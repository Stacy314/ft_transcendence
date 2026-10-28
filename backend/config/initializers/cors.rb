# Browser clients on a different development port need CORS permission. Cookies
# are never accepted from arbitrary origins: credentials require a named origin.
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch("FRONTEND_ORIGIN", "http://localhost:5173")

    resource "/api/*",
             headers: :any,
             methods: %i[get post delete options],
             credentials: true
  end
end
