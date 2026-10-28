all: 

install:
	cd frontend && npm ci

dev:
	cd frontend && npm run dev

lint:
	cd frontend && npm run lint && npm run format:check

re: down up

clean:
	docker compose down -v

.PHONY: all up down logs re clean