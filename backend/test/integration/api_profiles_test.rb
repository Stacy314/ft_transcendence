require "test_helper"

class ApiProfilesTest < ActionDispatch::IntegrationTest
  setup do
    @user = User.create!(username: "profile_user", email: "profile@example.com",
                         name: "Original", password: "secure-password")
    @other = User.create!(username: "other_user", email: "other@example.com",
                          password: "secure-password")
  end

  test "profile updates require login" do
    patch "/api/profile", params: { user: { name: "Changed" } }, as: :json

    assert_response :unauthorized
    assert_equal "Original", @user.reload.name
  end

  test "logged in user can update and retrieve their profile" do
    sign_in
    patch "/api/profile", params: {
      user: { username: "updated_user", email: " Updated@Example.com ", name: "Updated" }
    }, as: :json

    assert_response :ok
    expected = { "id" => @user.id, "username" => "updated_user",
                 "email" => "updated@example.com", "name" => "Updated" }
    assert_equal expected, response.parsed_body["user"]
    assert_equal expected, @user.reload.attributes.slice(*expected.keys)

    get "/api/auth/me", as: :json
    assert_response :ok
    assert_equal expected, response.parsed_body["user"]
  end

  test "partial updates preserve omitted fields" do
    sign_in
    patch "/api/profile", params: { user: { name: "Changed" } }, as: :json

    assert_response :ok
    assert_equal "Changed", @user.reload.name
    assert_equal "profile_user", @user.username
    assert_equal "profile@example.com", @user.email
  end

  test "invalid profile updates do not persist any changes" do
    sign_in
    [{ username: "!" }, { username: "" }, { email: "invalid" }, { email: "" }].each do |invalid|
      original = @user.reload.attributes
      patch "/api/profile", params: { user: invalid.merge(name: "Should not persist") }, as: :json

      assert_response :unprocessable_entity
      assert response.parsed_body.fetch("errors").key?(invalid.keys.first.to_s)
      assert_equal original, @user.reload.attributes
    end
  end

  test "duplicate usernames and emails are rejected" do
    sign_in
    [{ username: @other.username.upcase }, { email: @other.email.upcase }].each do |duplicate|
      original = @user.reload.attributes
      patch "/api/profile", params: { user: duplicate }, as: :json

      assert_response :unprocessable_entity
      assert response.parsed_body.fetch("errors").key?(duplicate.keys.first.to_s)
      assert_equal original, @user.reload.attributes
    end
  end

  test "client cannot target another user or change password fields" do
    sign_in
    other_attributes = @other.attributes
    digest = @user.password_digest
    patch "/api/profile", params: {
      id: @other.id,
      user: { id: @other.id, name: "Mine", password: "changed-password", password_digest: "forged" }
    }, as: :json

    assert_response :ok
    assert_equal @user.id, response.parsed_body.dig("user", "id")
    assert_equal %w[email id name username], response.parsed_body.fetch("user").keys.sort
    assert_equal "Mine", @user.reload.name
    assert_equal digest, @user.password_digest
    assert_equal other_attributes, @other.reload.attributes
  end

  test "missing user parameters return bad request" do
    sign_in
    patch "/api/profile", params: {}, as: :json
    assert_response :bad_request
  end

  test "profile update requires a valid CSRF token" do
    sign_in
    previous_setting = ActionController::Base.allow_forgery_protection
    ActionController::Base.allow_forgery_protection = true

    patch "/api/profile", params: { user: { name: "Rejected" } }, as: :json
    assert_response :unprocessable_entity
    assert_equal "Original", @user.reload.name

    get "/api/csrf", as: :json
    assert_response :ok
    token = response.parsed_body.fetch("csrf_token")
    patch "/api/profile", params: { user: { name: "Accepted" } },
          headers: { "X-CSRF-Token" => token }, as: :json
    assert_response :ok
    assert_equal "Accepted", @user.reload.name
  ensure
    ActionController::Base.allow_forgery_protection = previous_setting
  end

  private

  def sign_in
    post "/api/auth/login", params: {
      session: { username: @user.username, password: "secure-password" }
    }, as: :json
    assert_response :ok
  end
end
