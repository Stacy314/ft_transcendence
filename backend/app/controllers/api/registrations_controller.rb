module Api
  class RegistrationsController < ApplicationController
    def create
      user = User.new(registration_params)

      if user.save
        reset_session
        session[:user_id] = user.id
        render json: { user: user_json(user) }, status: :created
      else
        render json: { errors: user.errors.to_hash(true) }, status: :unprocessable_entity
      end
    end

    private

    def registration_params
      params.require(:user).permit(:username, :email, :password, :password_confirmation, :name)
    end
  end
end
