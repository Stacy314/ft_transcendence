# Populates the database with data needed for development/demo.
# Idempotent: find_or_create_by! only fills the block for records that don't exist yet,
# so running `rails db:seed` again never creates duplicates or re-hashes passwords.

test_users = [
  { username: "alice", email: "alice@example.com", password: "password123", name: "Alice Smith", telephone: "123-456-7890" },
  { username: "bob",   email: "bob@example.com",   password: "password123", name: "Bob Johnson", telephone: "098-765-4321" }
]

test_users.each do |attrs|
  User.find_or_create_by!(username: attrs[:username]) do |user|
    user.email = attrs[:email]
    user.password = attrs[:password]
    user.name = attrs[:name]
    user.telephone = attrs[:telephone]
  end
end

puts "Seeded users: #{User.count} total"
