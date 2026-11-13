require "test_helper"

class ApiPetsTest < ActionDispatch::IntegrationTest
  setup do
    @owner = User.create!(username: "pet_owner", email: "pet_owner@example.com", password: "secure-password")
    @other = User.create!(username: "other_owner", email: "other_owner@example.com", password: "secure-password")
  end

  test "pet endpoints require a session" do
    get "/api/pet"
    assert_response :unauthorized
    assert_no_difference "Pet.count" do
      post "/api/pet", params: { pet: { name: "Mochi", species: "cat-1", owner_id: @owner.id } }
    end
    assert_response :unauthorized
  end

  test "creation assigns the session owner and ignores client supplied ownership and stats" do
    sign_in(@owner)
    get "/api/pet"
    assert_response :success
    assert_nil response.parsed_body["pet"]

    assert_difference "@owner.pets.count", 1 do
      post "/api/pet", params: {
        pet: { name: " Mochi ", species: "cat-2", owner_id: @other.id, owner_username: @other.username, health: 0 }
      }
    end
    assert_response :created
    pet = response.parsed_body["pet"]
    assert_equal @owner.id, pet["owner_id"]
    assert_equal "Mochi", pet["name"]
    assert_equal 100, pet["health"]
    assert_equal 0, @other.pets.count

    # A fresh browser session must retrieve the same saved selection.
    browser = open_session
    browser.post "/api/session", params: { username: @owner.username, password: "secure-password" }
    browser.get "/api/pet"
    assert_equal pet["id"], browser.response.parsed_body.dig("pet", "id")
    assert_equal "cat-2", browser.response.parsed_body.dig("pet", "species")
  end

  test "users only retrieve their own pet" do
    @other.pets.create!(name: "Other", species: "cat-1")
    sign_in(@owner)
    get "/api/pet", params: { owner_id: @other.id }
    assert_response :success
    assert_nil response.parsed_body["pet"]
  end

  test "invalid selection is rejected without creating a pet" do
    sign_in(@owner)
    [{ name: " ", species: "cat-1" }, { name: "a" * 21, species: "cat-1" }, { name: "Mochi", species: "unknown" }].each do |attributes|
      assert_no_difference "Pet.count" do
        post "/api/pet", params: { pet: attributes }
      end
      assert_response :unprocessable_entity
      assert_kind_of Hash, response.parsed_body["errors"]
    end
  end

  test "existing selection cannot be duplicated" do
    @owner.pets.create!(name: "Mochi", species: "cat-1")
    sign_in(@owner)
    assert_no_difference "Pet.count" do
      post "/api/pet", params: { pet: { name: "Another", species: "cat-2" } }
    end
    assert_response :conflict
  end

  test "pet creation requires a CSRF token" do
    sign_in(@owner)
    previous_setting = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true

    assert_no_difference "Pet.count" do
      post "/api/pet", params: { pet: { name: "Mochi", species: "cat-1" } }
    end
    assert_response :unprocessable_entity

    get "/api/csrf"
    token = response.parsed_body["csrf_token"]
    post "/api/pet", params: { pet: { name: "Mochi", species: "cat-1" } }, headers: { "X-CSRF-Token" => token }
    assert_response :created
  ensure
    ActionController::Base.allow_forgery_protection = previous_setting
  end

  private

  def sign_in(user)
    post "/api/session", params: { username: user.username, password: "secure-password" }
    assert_response :created
  end
end
