# Makefile for Node.js Application with Docker and MySQL

# VARIABLES
DOCKER_COMPOSE = docker-compose
DOCKER_COMPOSE_DEV = docker-compose -f docker-compose.dev.yaml
DOCKER_COMPOSE_PROD = docker-compose -f docker-compose.prod.yaml
DOCKER_IMAGE_NAME = server-api-app
DOCKER_CONTAINER_NAME = server-api

# DEVELOPMENT ENVIRONMENT
.PHONY: dev-build
dev-build:
	@echo "Building development Docker image..."
	docker build -f Dockerfile.dev -t $(DOCKER_IMAGE_NAME):dev .

.PHONY: dev-up
dev-up: dev-build
	@echo "Starting development environment..."
	$(DOCKER_COMPOSE_DEV) up -d

.PHONY: dev-down
dev-down:
	@echo "Stopping development environment..."
	$(DOCKER_COMPOSE_DEV) down

.PHONY: dev-restart
dev-restart: dev-down dev-up
	@echo "Restarting development environment..."

# PRODUCTION ENVIRONMENT
.PHONY: prod-build
prod-build:
	@echo "Building production Docker image..."
	docker build -f Dockerfile -t $(DOCKER_IMAGE_NAME):prod .

.PHONY: prod-up
prod-up: prod-build
	@echo "Starting production environment..."
	$(DOCKER_COMPOSE_PROD) up -d

.PHONY: prod-down
prod-down:
	@echo "Stopping production environment..."
	$(DOCKER_COMPOSE_PROD) down

.PHONY: prod-restart
prod-restart: prod-down prod-up
	@echo "Restarting production environment..."

# Database Management
.PHONY: db-up
db-up:
	@echo "Starting database..."
	$(DOCKER_COMPOSE_DEV) up -d db

.PHONY: db-setup
db-setup:
	@echo "Initializing database schema..."
	npm run db:setup

.PHONY: db-down
db-down:
	@echo "Stopping database..."
	$(DOCKER_COMPOSE_DEV) stop db && $(DOCKER_COMPOSE_DEV) rm -f db

.PHONY: db-restart
db-restart: db-down db-up
	@echo "Restarting database..."

# Utility Commands
.PHONY: logs
logs:
	@echo "Viewing application logs..."
	docker logs -f $(DOCKER_CONTAINER_NAME)

.PHONY: clean
clean:
	@echo "Cleaning up Docker images and containers..."
	docker system prune -f