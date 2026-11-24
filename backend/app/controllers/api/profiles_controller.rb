module Api
  class ProfilesController < ApplicationController
    before_action :require_user

    def update
      if current_user.update(profile_params)
        render json: { user: user_json(current_user) }, status: :ok
      else
        render json: { errors: current_user.errors.to_hash(true) }, status: :unprocessable_entity
      end
    end

    private

    def require_user
      render json: { error: "Not authenticated" }, status: :unauthorized unless current_user
    end

    def profile_params
      params.require(:user).permit(:username, :email, :name)
    end
  end
end
