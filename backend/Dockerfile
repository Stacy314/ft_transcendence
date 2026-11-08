FROM ruby:3.4-slim

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential libpq-dev libyaml-dev git curl libvips42 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV RAILS_ENV=production \
    BUNDLE_WITHOUT="development:test" \
    BUNDLE_DEPLOYMENT=1

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

RUN useradd -m rails && chown -R rails:rails /app
USER rails

EXPOSE 3000
ENTRYPOINT ["./setup.sh"]
CMD ["bin/rails", "server", "-b", "0.0.0.0", "-p", "3000"]
