module Api
  class PetsController < ApplicationController
    before_action :require_user

    def show
      render json: { pet: pet_json(current_user.pets.order(:id).first) }
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

    private

    def require_user
      render json: { error: "Not authenticated" }, status: :unauthorized unless current_user
    end

    def pet_json(pet)
      pet&.as_json(only: %i[id name species owner_id health hunger energy created_at])
    end
  end
end
