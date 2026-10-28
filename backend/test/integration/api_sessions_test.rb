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
    User.create!(username: "login_user", email: "login@example.com", password: "secure-password")

    post "/api/session", params: { username: "login_user", password: "secure-password" }
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
end
