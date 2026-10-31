module Api
  class PetsController < ApplicationController
    skip_before_action :verify_authenticity_token, only: :create

    def create
      owner = find_owner
      return render json: { errors: ["Owner not found"] }, status: :unprocessable_entity if owner.nil?

      pet = owner.pets.new(name: pet_params[:name], species: pet_params[:species])

      if pet.save
        render json: {
          pet: pet.slice(:id, :name, :species, :owner_id, :health, :hunger, :energy, :created_at)
        }, status: :created
      else
        render json: { errors: pet.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def pet_params
      params.require(:pet).permit(:name, :species, :owner_id, :owner_username)
    end

    def find_owner
      if pet_params[:owner_id].present?
        User.find_by(id: pet_params[:owner_id])
      elsif pet_params[:owner_username].present?
        User.find_by(username: pet_params[:owner_username])
      end
    end
  end
end