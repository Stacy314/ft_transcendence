class Pet < ApplicationRecord
  belongs_to :owner, class_name: 'User'

  validates :name, presence: true
  validates :species, presence: true
  validates :health, numericality: { greater_than_or_equal_to: 0 }
  validates :hunger, numericality: { greater_than_or_equal_to: 0 }
  validates :energy, numericality: { greater_than_or_equal_to: 0 }
end