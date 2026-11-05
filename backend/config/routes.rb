Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    # The frontend reads this before a state-changing request and returns it as
    # X-CSRF-Token. Nginx serves both applications from one origin, so no CORS
    # configuration is needed.
    get "csrf", to: "csrf#show"

    post "auth/signup", to: "registrations#create"
    post "auth/login", to: "sessions#create"
    delete "auth/logout", to: "sessions#destroy"
    get "auth/me", to: "sessions#show"

    resources :pets, only: :create
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"

end
