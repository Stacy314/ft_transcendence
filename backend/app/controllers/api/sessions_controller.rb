module Api
  class SessionsController < ApplicationController
    skip_before_action :verify_authenticity_token, only: :create

    def create
      user = User.find_by(username: session_params[:username])

      if user&.authenticate(session_params[:password])
        render json: {
          user: user.slice(:id, :username, :email, :name, :telephone, :created_at)
        }, status: :ok
      else
        render json: { errors: ["Invalid username or password"] }, status: :unauthorized
      end
    end

    private

    def session_params
      params.require(:session).permit(:username, :password)
    end
  end
end