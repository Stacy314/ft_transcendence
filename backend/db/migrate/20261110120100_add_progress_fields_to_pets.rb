class AddProgressFieldsToPets < ActiveRecord::Migration[8.1]
  def change
    add_column :pets, :xp, :integer, default: 0, null: false
    add_column :pets, :level, :integer, default: 1, null: false
    add_column :pets, :state, :string, default: "idle", null: false
    add_column :pets, :last_updated_at, :datetime
  end
end
