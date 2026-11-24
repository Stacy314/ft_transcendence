# Schema snapshot matching the migrations through 20261019092400.
# Update the database using migrations; regenerate this file with db:schema:dump.
ActiveRecord::Schema[8.1].define(version: 2026_10_19_092400) do
  enable_extension "pg_catalog.plpgsql"

  create_table "pets", force: :cascade do |t|
    t.string "name"
    t.string "species"
    t.bigint "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "health", default: 100, null: false
    t.integer "hunger", default: 70, null: false
    t.integer "energy", default: 70, null: false
    t.index ["owner_id"], name: "index_pets_on_owner_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "name"
    t.string "telephone"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "pets", "users", column: "owner_id"
end
