class AddStatsToPets < ActiveRecord::Migration[8.1]
  def change
    add_column :pets, :health, :integer, default: 100, null: false
    add_column :pets, :hunger, :integer, default: 70, null: false
    add_column :pets, :energy, :integer, default: 70, null: false
  end
end
