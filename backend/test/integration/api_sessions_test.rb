require "test_helper"

class ApiSessionsTest < ActionDispatch::IntegrationTest
  test "wrong password does not create a session" do
    User.create!(username: "login_user", email: "login@example.com", password: "secure-password")

    post "/api/auth/login", params: {
      session: { username: "login_user", password: "incorrect-password" }
    }, as: :json

    assert_response :unauthorized
    assert_equal ["Invalid username or password"], response.parsed_body["errors"]
    assert_logged_out
  end

  test "unknown username does not create a session" do
    post "/api/auth/login", params: {
      session: { username: "unknown_user", password: "secure-password" }
    }, as: :json

    assert_response :unauthorized
    assert_equal ["Invalid username or password"], response.parsed_body["errors"]
    assert_logged_out
  end

  {
    "blank username" => { username: "" },
    "invalid username" => { username: "invalid!" },
    "invalid email" => { email: "invalid-email" },
    "blank email" => { email: "" },
    "short password" => { password: "short", password_confirmation: "short" },
    "blank password" => { password: "", password_confirmation: "" },
    "mismatched passwords" => { password_confirmation: "different-password" }
  }.each do |description, invalid_attributes|
    test "signup rejects #{description} without creating a user or session" do
      assert_no_difference "User.count" do
        post "/api/auth/signup", params: {
          user: signup_attributes.merge(invalid_attributes)
        }, as: :json
      end

      assert_response :unprocessable_entity
      errors = response.parsed_body.fetch("errors")
      assert_kind_of Hash, errors
      assert errors.key?(invalid_attributes.keys.first.to_s)
      assert_logged_out
    end
  end

  %i[username email].each do |field|
    test "signup rejects duplicate #{field} without creating a user or session" do
      existing = User.create!(username: "existing_user", email: "existing@example.com",
                              password: "secure-password")

      assert_no_difference "User.count" do
        post "/api/auth/signup", params: {
          user: signup_attributes.merge(field => existing.public_send(field).upcase)
        }, as: :json
      end

      assert_response :unprocessable_entity
      assert response.parsed_body.fetch("errors").key?(field.to_s)
      assert_logged_out
    end
  end

  test "signup login and current user responses only expose public profile fields" do
    assert_difference "User.count", 1 do
      post "/api/auth/signup", params: { user: signup_attributes }, as: :json
    end
    assert_response :created
    user = User.find_by!(username: signup_attributes[:username])
    expected = { "id" => user.id, "username" => user.username,
                 "email" => user.email, "name" => user.name }
    assert_equal expected, response.parsed_body.fetch("user")

    delete "/api/auth/logout", as: :json
    assert_response :no_content

    post "/api/auth/login", params: {
      session: { username: user.username, password: signup_attributes[:password] }
    }, as: :json
    assert_response :ok
    assert_equal expected, response.parsed_body.fetch("user")

    get "/api/auth/me", as: :json
    assert_response :ok
    assert_equal expected, response.parsed_body.fetch("user")
  end

  test "registering creates an authenticated session" do
    post "/api/auth/signup", params: {
      user: {
        username: "cookie_user",
        email: "cookie@example.com",
        password: "secure-password",
        password_confirmation: "secure-password"
      }
    }

    assert_response :created
    assert_equal "cookie_user", response.parsed_body.dig("user", "username")

    get "/api/auth/me"

    assert_response :success
    assert_equal "cookie_user", response.parsed_body.dig("user", "username")
  end

  test "login, logout, and current session endpoints" do
    User.create!(
      username: "login_user",
      email: "login@example.com",
      password: "secure-password"
    )

    post "/api/auth/login", params: {
      session: {
        username: "login_user",
        password: "secure-password"
      }
    }

    assert_response :success

    delete "/api/auth/logout"
    assert_response :no_content

    get "/api/auth/me"
    assert_response :ok
    assert_nil response.parsed_body["user"]
  end

  test "session cookie has HttpOnly and SameSite attributes" do
    User.create!(
      username: "cookie_check",
      email: "cookie_check@example.com",
      password: "secure-password"
    )

    post "/api/auth/login", params: {
      session: {
        username: "cookie_check",
        password: "secure-password"
      }
    }

    assert_response :success

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

    post "/api/auth/login",
         params: {
           session: {
             username: "csrf_check",
             password: "secure-password"
           }
         },
         headers: {
           "X-CSRF-Token" => csrf_token
         }

    assert_response :success
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

    post "/api/auth/login", params: {
      session: {
        username: "no_csrf_user",
        password: "secure-password"
      }
    }

    assert_response :unprocessable_entity
  ensure
    ActionController::Base.allow_forgery_protection = previous_setting
  end

  private

  def signup_attributes
    { username: "signup_user", email: "signup@example.com", name: "Signup User",
      password: "secure-password", password_confirmation: "secure-password" }
  end

  def assert_logged_out
    get "/api/auth/me", as: :json
    assert_response :ok
    assert_nil response.parsed_body["user"]
  end
end
