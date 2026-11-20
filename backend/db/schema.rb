# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_11_20_090000) do
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
    t.integer "xp", default: 0, null: false
    t.integer "level", default: 1, null: false
    t.string "state", default: "idle", null: false
    t.datetime "last_updated_at"
    t.datetime "last_fed_at"
    t.datetime "last_played_at"
    t.datetime "last_cleaned_at"
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
    t.string "avatar"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "pets", "users", column: "owner_id"
end
