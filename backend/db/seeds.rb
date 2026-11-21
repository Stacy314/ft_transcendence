# Populates the database with data needed for development/demo.
# Idempotent: find_or_create_by! only fills the block for records that don't exist yet,
# so running `rails db:seed` again never creates duplicates or re-hashes passwords.

test_users = [
  { username: "alice", email: "alice@example.com", password: "password123", name: "Alice Smith", telephone: "123-456-7890", avatar: "avatars/alice.png" },
  { username: "bob",   email: "bob@example.com",   password: "password123", name: "Bob Johnson", telephone: "098-765-4321", avatar: "avatars/bob.png" }
]

test_users.each do |attrs|
  User.find_or_create_by!(username: attrs[:username]) do |user|
    user.email = attrs[:email]
    user.password = attrs[:password]
    user.name = attrs[:name]
    user.telephone = attrs[:telephone]
    user.avatar = attrs[:avatar]
  end
end

puts "Seeded users: #{User.count} total"

test_pets = [
  { owner_username: "alice", name: "Fluffy", species: "cat", xp: 120, level: 2, state: "idle" },
  { owner_username: "bob",   name: "Bell",    species: "cat", xp: 0,   level: 1, state: "idle" }
]

test_pets.each do |attrs|
  owner = User.find_by!(username: attrs[:owner_username])

  Pet.find_or_create_by!(owner: owner, name: attrs[:name]) do |pet|
    pet.species = attrs[:species]
    pet.xp = attrs[:xp]
    pet.level = attrs[:level]
    pet.state = attrs[:state]
    pet.last_updated_at = Time.current
  end
end

puts "Seeded pets: #{Pet.count} total"
