class Pet < ApplicationRecord
  belongs_to :owner, class_name: 'User'

  STAT_MAX = 100
  TICK = 1.minute
  HUNGER_DECAY_PER_TICK = 1
  ENERGY_DECAY_PER_TICK = 1
  STARVING_HEALTH_DECAY_PER_TICK = 1

  FEED_COOLDOWN = 30.seconds
  PLAY_COOLDOWN = 30.seconds
  CLEAN_COOLDOWN = 30.seconds
  FEED_AMOUNT = 20
  PLAY_AMOUNT = 20
  CLEAN_AMOUNT = 20

  normalizes :name, with: ->(name) { name.strip }

  validates :name, presence: true, length: { maximum: 20 }
  validates :species, presence: true, inclusion: { in: %w[cat-1 cat-2] }
  validates :health, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: STAT_MAX }
  validates :hunger, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: STAT_MAX }
  validates :energy, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: STAT_MAX }

  def apply_decay!
    reference_time = last_updated_at || created_at
    ticks = ((Time.current - reference_time) / TICK).floor
    return if ticks <= 0

    hunger_zero_at = (hunger.to_f / HUNGER_DECAY_PER_TICK).ceil
    energy_zero_at = (energy.to_f / ENERGY_DECAY_PER_TICK).ceil
    starving_ticks = [ticks - [hunger_zero_at, energy_zero_at].min, 0].max

    self.hunger = clamp_stat(hunger - HUNGER_DECAY_PER_TICK * ticks)
    self.energy = clamp_stat(energy - ENERGY_DECAY_PER_TICK * ticks)
    self.health = clamp_stat(health - STARVING_HEALTH_DECAY_PER_TICK * starving_ticks) if starving_ticks.positive?
    self.last_updated_at = reference_time + ticks * TICK
    save!
  end

  def feed!
    perform_action(:last_fed_at, FEED_COOLDOWN) { self.hunger = clamp_stat(hunger + FEED_AMOUNT) }
  end

  def play!
    perform_action(:last_played_at, PLAY_COOLDOWN) { self.energy = clamp_stat(energy + PLAY_AMOUNT) }
  end

  def clean!
    perform_action(:last_cleaned_at, CLEAN_COOLDOWN) { self.health = clamp_stat(health + CLEAN_AMOUNT) }
  end

  private

  def clamp_stat(value)
    value.clamp(0, STAT_MAX)
  end

  def perform_action(timestamp_attr, cooldown)
    apply_decay!

    last_at = public_send(timestamp_attr)
    remaining = last_at ? cooldown - (Time.current - last_at) : 0
    return remaining.ceil if remaining.positive?

    yield
    public_send("#{timestamp_attr}=", Time.current)
    save!
    nil
  end
end
