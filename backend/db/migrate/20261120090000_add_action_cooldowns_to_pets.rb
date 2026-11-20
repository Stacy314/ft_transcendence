class AddActionCooldownsToPets < ActiveRecord::Migration[8.1]
  def change
    add_column :pets, :last_fed_at, :datetime
    add_column :pets, :last_played_at, :datetime
    add_column :pets, :last_cleaned_at, :datetime
  end
end
