
module Api
  class SessionsController < ApplicationController
    def create
      user = User.find_by(username: session_params[:username])

      if user&.authenticate(session_params[:password])
        reset_session
        session[:user_id] = user.id
        render json: { user: user_json(user) }, status: :ok
      else
        render json: { errors: ["Invalid username or password"] }, status: :unauthorized
      end
    end

    def show
      render json: { user: current_user ? user_json(current_user) : nil }
    end

    def destroy
      reset_session
      head :no_content
    end

    private

    def session_params
      params.require(:session).permit(:username, :password)
    end
  end
end
