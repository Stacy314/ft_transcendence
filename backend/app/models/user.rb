class User < ApplicationRecord
  has_secure_password

  has_many :pets, foreign_key: :owner_id, dependent: :destroy

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :username, presence: true,
                        uniqueness: { case_sensitive: false },
                        length: { minimum: 3, maximum: 20 },
                        format: { with: /\A[a-zA-Z0-9_]+\z/, message: "only letters, numbers and underscores allowed" }

  validates :email, presence: true,
                     uniqueness: true,
                     format: { with: URI::MailTo::EMAIL_REGEXP }

  validates :password, length: { minimum: 8 }, allow_nil: true
end
