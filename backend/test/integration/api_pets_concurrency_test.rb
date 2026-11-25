require "test_helper"

# Overlapping requests need connections that commit independently, so the per-test transaction is off here.
class ApiPetsConcurrencyTest < ActionDispatch::IntegrationTest
  self.use_transactional_tests = false

  setup do
    @owner = User.create!(username: "race_owner", email: "race_owner@example.com", password: "secure-password")
  end

  teardown do
    @owner.pets.delete_all
    @owner.destroy
  end

  test "simultaneous feeds apply the food exactly once" do
    pet = create_pet(hunger: 50, energy: 50, health: 50)

    results = in_parallel(%w[feed feed feed]) { |session, action| session.patch("/api/pet/#{action}") }
    statuses = results.map(&:first)

    assert_equal 1, statuses.count(200), "exactly one feed should be applied, got #{statuses.inspect}"
    assert_equal 2, statuses.count(429)
    # 50 - 5 ticks of decay + a single serving of 20.
    assert_equal 65, pet.reload.hunger

    results.each do |status, body|
      next unless status == 429

      assert_operator body["retry_after"], :>, 0
      assert_operator body["retry_after"], :<=, Pet::FEED_COOLDOWN.to_i
    end
  end

  # The lock is there to serialize the writes, not to drop two of every three actions.
  test "simultaneous feed, play and clean all apply" do
    pet = create_pet(hunger: 50, energy: 50, health: 50)

    results = in_parallel(%w[feed play clean]) { |session, action| session.patch("/api/pet/#{action}") }

    assert_equal [200, 200, 200], results.map(&:first)
    pet.reload
    assert_equal 65, pet.hunger
    assert_equal 65, pet.energy
    assert_equal 70, pet.health
  end

  # GET reports the decay without saving it, so it cannot clobber a write committed alongside.
  test "a feed is not lost when reads of the pet run alongside it" do
    pet = create_pet(hunger: 50, energy: 50, health: 50)

    results = in_parallel(%w[pet pet/feed pet]) do |session, path|
      path.end_with?("feed") ? session.patch("/api/#{path}") : session.get("/api/#{path}")
    end

    assert_equal [200, 200, 200], results.map(&:first)
    assert_equal 65, pet.reload.hunger
  end

  test "simultaneous creation leaves the owner with one pet" do
    results = in_parallel(%w[cat-1 cat-2 cat-1]) do |session, species|
      session.post("/api/pet", params: { pet: { name: "Mochi", species: species } })
    end
    statuses = results.map(&:first)

    assert_equal 1, statuses.count(201), "exactly one creation should win, got #{statuses.inspect}"
    assert_equal 2, statuses.count(409)
    assert_equal 1, @owner.pets.count
  end

  private

  def create_pet(**stats)
    @owner.pets.create!(name: "Mochi", species: "cat-1", last_updated_at: 5.minutes.ago, **stats)
  end

  # One request per argument, each in its own session and thread, released together. Returns [status, body].
  def in_parallel(arguments)
    sessions = arguments.map { signed_in_session }
    start = Queue.new

    threads = sessions.zip(arguments).map do |session, argument|
      Thread.new do
        start.pop
        yield(session, argument)
        [session.response.status, session.response.parsed_body]
      ensure
        ActiveRecord::Base.connection_pool.release_connection
      end
    end

    arguments.size.times { start.push(:go) }
    threads.map(&:value)
  end

  def signed_in_session
    session = open_session
    session.post "/api/session", params: { username: @owner.username, password: "secure-password" }
    assert_equal 201, session.response.status
    session
  end
end
