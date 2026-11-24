-include .env

COMPOSE = docker compose

.DEFAULT_GOAL := all

SERVICE ?=

.PHONY: help build up down rebuild logs ps \
        generate db-migrate db-rollback db-seed db-reset \
        console psql clean \
		fe-install fe-dev fe-lint fe-format fe-build fe-clean

## ---  frontend ---

fe-install: ## install exact frontend dependencies from package-lock.json
	cd frontend && npm ci

fe-dev: ## start the Vite dev server on http://localhost:5173
	cd frontend && npm run dev

fe-lint: ## check frontend code (ESLint) and formatting (Prettier)
	cd frontend && npm run lint && npm run format:check

fe-format: ## auto-format frontend code with Prettier
	cd frontend && npm run format

fe-build: ## build the frontend production bundle into frontend/dist
	cd frontend && npm run build

fe-clean: ## remove frontend node_modules, dist and the Vite cache
	rm -rf frontend/node_modules frontend/dist frontend/.vite

## --- project ---

all: up ## start the whole project (same as make up)

env: ## create .env from .env.example if it does not exist yet
	@test -f .env || { cp .env.example .env && echo "Created .env from .env.example - fill in the values, then run make again"; }

## --- containers ---

build: ## build the backend image
	$(COMPOSE) build $(SERVICE)

up: ## start db + backend in the background
	$(COMPOSE) up -d --build

down: ## stop and remove containers
	$(COMPOSE) down

restart: ## restart without rebuilding (all, or one: make restart SERVICE=frontend)
	$(COMPOSE) restart $(SERVICE)
	
rebuild: build ## rebuild rebuild from scratch and restart  
	$(COMPOSE) build --no-cache $(SERVICE)
	$(COMPOSE) up -d --force-recreate --renew-anon-volumes $(SERVICE)

logs: ## follow backend logs
	$(COMPOSE) logs -f  $(SERVICE)

ps: ## show container status
	$(COMPOSE) ps -a

## --- database ---

generate: ## generate a migration/model, e.g. make generate ARGS="migration CreateGames"
	$(COMPOSE) exec backend bin/rails generate $(ARGS)

db-migrate: ## run pending migrations
	$(COMPOSE) exec backend bin/rails db:migrate

db-rollback: ## roll back the last migration on the primary database
	$(COMPOSE) exec backend bin/rails db:rollback:primary

db-seed: ## load test data (db/seeds.rb)
	$(COMPOSE) exec backend bin/rails db:seed

db-reset: ## drop and recreate all databases from scratch, then seed
	$(COMPOSE) exec backend bin/rails db:drop db:create db:migrate db:seed

console: ## open a rails console inside the backend container
	$(COMPOSE) exec backend bin/rails console

psql: ## open psql on the primary database
	$(COMPOSE) exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

## --- destructive ---

clean: ## remove containers AND the database volume (all data will be lost!)
	$(COMPOSE) down -v

help: ## show this list of commands
	@grep -hE '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'
