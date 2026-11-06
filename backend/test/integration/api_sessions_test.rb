require "test_helper"

class ApiSessionsTest < ActionDispatch::IntegrationTest
  test "registering creates an authenticated session" do
    post "/api/registration", params: {
      user: {
        username: "cookie_user",
        email: "cookie@example.com",
        password: "secure-password",
        password_confirmation: "secure-password"
      }
    }

    assert_response :created
    assert_equal "cookie_user", response.parsed_body.dig("user", "username")

    get "/api/session"

    assert_response :success
    assert_equal "cookie_user", response.parsed_body.dig("user", "username")
  end

  test "login, logout, and current session endpoints" do
    User.create!(
      username: "login_user",
      email: "login@example.com",
      password: "secure-password"
    )

    post "/api/session", params: {
      username: "login_user",
      password: "secure-password"
    }

    assert_response :created

    delete "/api/session"
    assert_response :no_content

    get "/api/session"
    assert_response :unauthorized
  end

  test "session cookie has HttpOnly and SameSite attributes" do
    User.create!(
      username: "cookie_check",
      email: "cookie_check@example.com",
      password: "secure-password"
    )

    post "/api/session", params: {
      username: "cookie_check",
      password: "secure-password"
    }

    assert_response :created

    cookie = response.headers["Set-Cookie"]

    assert_not_nil cookie, "Expected a Set-Cookie header"
    assert_includes cookie, "_tamagotchi_session"
    assert_match(/httponly/i, cookie)
    assert_match(/samesite=lax/i, cookie)
  end

  test "login works with CSRF protection enabled" do
    previous_setting = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true

    User.create!(
      username: "csrf_check",
      email: "csrf_check@example.com",
      password: "secure-password"
    )

    get "/api/csrf"

    assert_response :success
    csrf_token = response.parsed_body["csrf_token"]

    assert_not_nil csrf_token

    post "/api/session",
         params: {
           username: "csrf_check",
           password: "secure-password"
         },
         headers: {
           "X-CSRF-Token" => csrf_token
         }

    assert_response :created
  ensure
    ActionController::Base.allow_forgery_protection = previous_setting
  end
  test "login rejects requests without a CSRF token" do
  previous_setting = ActionController::Base.allow_forgery_protection
  ActionController::Base.allow_forgery_protection = true

  User.create!(
    username: "no_csrf_user",
    email: "no_csrf@example.com",
    password: "secure-password"
  )

  post "/api/session", params: {
    username: "no_csrf_user",
    password: "secure-password"
  }

  assert_response :unprocessable_entity
ensure
  ActionController::Base.allow_forgery_protection = previous_setting
end

end
