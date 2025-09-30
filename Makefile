SHELL := /bin/bash

.PHONY: install generate seed dev test build up down lint format

install:
pnpm install

generate:
pnpm run generate

seed:
pnpm run seed

dev:
docker compose -f infra/docker-compose.yml up --build

up:
docker compose -f infra/docker-compose.yml up -d --build

down:
docker compose -f infra/docker-compose.yml down -v

build:
pnpm run build

test:
pnpm run test

lint:
pnpm run lint

format:
pnpm run format
