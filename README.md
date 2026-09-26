# ft_transcendence

A full-stack web application inspired by the classic Tamagotchi game, built as a team project for the final common-core project.

## Project overview

This project is a multi-user web app where each user can create and care for a virtual pet. The application includes:

- user authentication and account management
- pet creation and persistence
- game loop with stats such as hunger, happiness, energy, and cleanliness
- responsive frontend interface
- backend API with PostgreSQL database
- Docker-based local deployment

The goal is to build a complete product with a clear user experience, solid backend logic, and polished deployment workflow.

## Team roles

The project requires clear role distribution and each team member must be able to explain their work. For a 5-person team, the recommended structure is:

- Product Owner / UX Lead: product vision, feature prioritization, user experience decisions
- Project Manager / QA Lead: task management, communication, testing, documentation
- Backend Lead: database design, authentication, API contracts, security
- Frontend Lead: game UI, interactions, responsiveness, accessibility
- DevOps / Full-stack Integration Lead: Docker setup, environment configuration, deployment, bug fixing, bonus features

## Architecture

The application is structured as a three-layer architecture:

1. Frontend
   - React + Vite
   - handles user interface, game logic presentation, forms, and request handling
2. Backend
   - Node.js + Express
   - exposes REST API for authentication, user, and pet operations
3. Database
   - PostgreSQL
   - stores users, pets, stats, and application data

A Docker Compose setup orchestrates all services in one environment.

## Repository structure

```text
ft_transcendence/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── db.js
│       ├── server.js
│       └── routes/
│           └── health.js
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       └── styles.css
└── en.subject.pdf
```

## Tech stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- Containerization: Docker Compose
- Environment config: `.env` and `.env.example`

## Setup and run

### 1. Create environment files

Copy the example files and adjust values if needed:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

### 2. Start the app

```bash
docker compose up --build
```

This starts:

- PostgreSQL database
- backend API on port 3001
- frontend app on port 5173

### 3. Access the app

- Frontend: http://localhost:5173
- Backend health check: http://localhost:3001/api/ping

## Current status

The project skeleton is ready and includes:

- Docker Compose configuration
- PostgreSQL service
- backend API server
- frontend React + Vite app
- basic health endpoints

## Planned game features

The Tamagotchi game should eventually include:

- user signup/login
- create and select a pet
- feed, play, clean, and rest actions
- pet mood and stat progression over time
- responsive interface for desktop/mobile
- real-time or near-real-time game updates
- persistence between sessions

## Module strategy

To reach the required score, the team should aim for at least 14 points, with a safer target of 16+ if possible. Recommended modules include:

- Web
- User Management
- Gaming and User Experience
- Accessibility and Internationalization
- DevOps
- Data and Analytics
- Cybersecurity
- Artificial Intelligence
- optional module of choice

The exact modules should be chosen only after the core game concept is finalized.

## Team workflow recommendation

- use Git with clear commit messages and regular commits from all members
- keep work split by feature and responsibility
- review code before merging critical changes
- use a project board or issue tracker for tasks
- meet regularly to review blockers and progress

## Notes

This project is not only about building a game. It also evaluates:

- teamwork and coordination
- role distribution
- technical quality
- deployment readiness
- documentation quality
- ability to explain and defend decisions

All team members must be able to explain the architecture, responsibilities, and contribution of their work.

## License

This project is developed for educational purposes as part of the ft_transcendence assignment.
