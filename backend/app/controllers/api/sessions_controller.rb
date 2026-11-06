module Api
  class SessionsController < ApplicationController
    def create
      user = User.find_by(username: params[:username])

      if user&.authenticate(params[:password])
        reset_session
        session[:user_id] = user.id
        render json: { user: user_json(user) }, status: :created
      else
        render json: { error: "Invalid username or password" }, status: :unauthorized
      end
    end

    def show
      if current_user
        render json: { user: user_json(current_user) }
      else
        render json: { error: "Not authenticated" }, status: :unauthorized
      end
    end

    def destroy
      reset_session
      head :no_content
    end
  end
end
