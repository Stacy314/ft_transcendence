module Api
  class PingController < BaseController
    def show
      render json: { status: "ok" }
    end
  end
end
