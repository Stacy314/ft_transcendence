Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    get "csrf", to: "csrf#show"
    post "auth/signup", to: "registrations#create"
    post "auth/login", to: "sessions#create"
    delete "auth/logout", to: "sessions#destroy"
    get "auth/me", to: "sessions#show"
    patch "profile", to: "profiles#update"
    resource :pet, only: %i[show create]
    resources :pets, only: :create
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    get "ping" => "ping#show"
  end
end
