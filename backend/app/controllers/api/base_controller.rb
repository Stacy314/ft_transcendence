module Api
  class BaseController < ActionController::API
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable
    rescue_from ActionController::ParameterMissing, with: :render_bad_request
    rescue_from StandardError, with: :render_internal_error

    private

    def render_not_found(exception)
      render json: { error: exception.message }, status: :not_found
    end

    def render_unprocessable(exception)
      render json: { error: exception.record.errors.full_messages }, status: :unprocessable_entity
    end

    def render_bad_request(exception)
      render json: { error: exception.message }, status: :bad_request
    end

    def render_internal_error(exception)
      Rails.logger.error("#{exception.class}: #{exception.message}\n#{exception.backtrace&.first(10)&.join("\n")}")
      message = Rails.env.local? ? exception.message : "Internal server error"
      render json: { error: message }, status: :internal_server_error
    end
  end
end
