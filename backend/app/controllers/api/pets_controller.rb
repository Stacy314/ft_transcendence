module Api
  class PetsController < ApplicationController
    before_action :require_user

    def show
      pet = current_user.pets.order(:id).first
      # Reporting the decay without saving it keeps this read from overwriting a concurrent action.
      pet&.apply_decay
      render json: { pet: pet_json(pet) }
    end

    def create
      # Serialize creation per owner so simultaneous submissions cannot create duplicates.
      current_user.with_lock do
        if current_user.pets.exists?
          return render json: { error: "You already have a Gotchi." }, status: :conflict
        end

        pet = current_user.pets.new(params.require(:pet).permit(:name, :species))
        if pet.save
          render json: { pet: pet_json(pet) }, status: :created
        else
          render json: { errors: pet.errors.to_hash(true) }, status: :unprocessable_entity
        end
      end
    end

    def feed
      perform_action(:feed!)
    end

    def play
      perform_action(:play!)
    end

    def clean
      perform_action(:clean!)
    end

    private

    def require_user
      render json: { error: "Not authenticated" }, status: :unauthorized unless current_user
    end

    def perform_action(method_name)
      current_user.with_lock do
        pet = current_user.pets.order(:id).first
        return render json: { error: "You don't have a Gotchi yet." }, status: :not_found unless pet

        retry_after = pet.public_send(method_name)
        if retry_after
          render json: { error: "On cooldown.", retry_after: retry_after }, status: :too_many_requests
        else
          render json: { pet: pet_json(pet) }
        end
      end
    end

    def pet_json(pet)
      return nil unless pet

      # Seconds remaining rather than last_*_at: the client cannot trust its own clock.
      pet.as_json(only: %i[id name species owner_id health hunger energy created_at])
         .merge("cooldowns" => Pet::ACTION_COOLDOWNS.keys.index_with { |action| pet.cooldown_remaining(action) })
    end
  end
end
