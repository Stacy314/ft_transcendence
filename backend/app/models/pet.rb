class Pet < ApplicationRecord
  belongs_to :owner, class_name: 'User'

  normalizes :name, with: ->(name) { name.strip }

  validates :name, presence: true, length: { maximum: 20 }
  validates :species, presence: true, inclusion: { in: %w[cat-1 cat-2] }
  validates :health, numericality: { greater_than_or_equal_to: 0 }
  validates :hunger, numericality: { greater_than_or_equal_to: 0 }
  validates :energy, numericality: { greater_than_or_equal_to: 0 }
end
