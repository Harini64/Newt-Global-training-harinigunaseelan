# AI Interview Preparation Platform

A production-grade, microservices-based AI interview preparation platform built with **Spring Boot 3**, **Spring Cloud Gateway**, **Spring AI**, **PostgreSQL + pgvector**, and **React**.

See [Architecture Diagram](docs/architecture.md) for the full system design.

## Features

- **Secure Authentication** — JWT + refresh tokens, BCrypt, role-based access (USER/ADMIN)
- **Resume Upload & ATS Analysis** — PDF/DOCX parsing (PDFBox/POI), keyword scoring, skill extraction
- **AI Mock Interviews** — Question generation, timed sessions, AI answer evaluation
- **RAG Chatbot** — Semantic search over interview knowledge base (pgvector + embeddings)
- **Skill Gap Analyzer** — Personalized learning roadmap from resume + interview performance
- **Analytics Dashboard** — Score trends, category breakdown (Recharts)
- **Notifications** — In-app + optional email alerts
- **Dockerized** — Full stack via Docker Compose

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Backend | Java 17, Spring Boot 3.2, Spring Cloud Gateway, Spring AI, JPA, OpenFeign |
| Frontend | React 19, Vite, Tailwind CSS 4, Axios, React Router, Recharts |
| Database | PostgreSQL 16, pgvector |
| AI | Mistral API (default) or Ollama (optional profile) |
| DevOps | Docker, Docker Compose, GitHub Actions |

## Architecture

```
React Frontend (5173/3000)
        │
API Gateway (8080) ── JWT validation
        │
┌───────┼───────┬───────────┬────────┐
Auth  Resume  Interview    AI    Notification
8081   8082     8083      8085      8084
        │
PostgreSQL + pgvector (5432)
```

## Quick Start (Local Demo — fastest)

If Java/Maven/Docker are not set up, use the included Node.js API server (same REST endpoints):

```powershell
cd server
npm install
node index.js
# New terminal:
cd frontend
npm install
npm run dev
```

Or run: `powershell -File scripts/start-demo.ps1`

Open **http://localhost:5173** — register and explore all features.

> The Java microservices in `backend/` are the portfolio/production implementation. The `server/` folder powers the local demo when Maven SSL or Docker are unavailable.

## Quick Start (Docker)

```bash
# 1. Clone and configure
cp .env.example .env

# 2. Start infrastructure + services
cd backend
docker-compose up -d postgres redis
docker-compose up -d --build

# 3. (Optional) Start Ollama for full AI features
docker-compose --profile ai up -d ollama
docker exec ai-interview-ollama ollama pull llama3.2
docker exec ai-interview-ollama ollama pull nomic-embed-text

# 4. Frontend (development)
cd ../frontend
npm install
npm run dev
```

Open **http://localhost:5173** (frontend) — API proxied to **http://localhost:8080**.

## Local Development (without Docker)

### Prerequisites
- JDK 17, Maven 3.9+
- Node.js 20+
- PostgreSQL 16 with pgvector

### Database setup
```sql
CREATE USER aiplatform WITH PASSWORD 'aiplatform_secret';
CREATE DATABASE auth_db OWNER aiplatform;
CREATE DATABASE resume_db OWNER aiplatform;
CREATE DATABASE interview_db OWNER aiplatform;
CREATE DATABASE ai_db OWNER aiplatform;
CREATE DATABASE notification_db OWNER aiplatform;
\c ai_db
CREATE EXTENSION vector;
```

### Start services (separate terminals)
```bash
cd backend
mvn install -DskipTests
mvn -pl auth-service spring-boot:run
mvn -pl resume-service spring-boot:run
mvn -pl interview-service spring-boot:run
mvn -pl ai-service spring-boot:run
mvn -pl notification-service spring-boot:run
mvn -pl gateway-service spring-boot:run
```

```bash
cd frontend && npm install && npm run dev
```

## API Endpoints (via Gateway `/api`)

| Service | Method | Endpoint | Description |
|---------|--------|----------|-------------|
| Auth | POST | `/api/auth/register` | Register user |
| Auth | POST | `/api/auth/login` | Login, get JWT |
| Auth | GET | `/api/auth/me` | Current user profile |
| Resume | POST | `/api/resume/upload` | Upload PDF/DOCX |
| Resume | GET | `/api/resume/latest` | Latest resume |
| Resume | POST | `/api/resume/{id}/analyze` | ATS analysis |
| Interview | POST | `/api/interview/start` | Start mock interview |
| Interview | POST | `/api/interview/submit-answer` | Submit & evaluate answer |
| Interview | GET | `/api/interview/history` | Session history |
| Interview | GET | `/api/interview/analytics` | Performance analytics |
| AI | POST | `/api/ai/chat` | RAG chatbot |
| AI | POST | `/api/ai/skill-gap` | Skill gap analysis |

Swagger UI per service: `http://localhost:8081/swagger-ui.html` (auth), etc.

## Project Structure

```
backend/
├── common-library/      # Shared DTOs, JWT, exception handling
├── gateway-service/     # Spring Cloud Gateway + JWT filter
├── auth-service/
├── resume-service/
├── interview-service/
├── ai-service/          # Spring AI, RAG, pgvector
├── notification-service/
└── docker-compose.yml

frontend/
└── src/
    ├── api/             # Axios client
    ├── components/
    ├── pages/
    ├── context/         # Auth + Theme
    └── layouts/
```

## Environment Variables

See [`.env.example`](.env.example). Key variables:

- `JWT_SECRET` — Must be 32+ characters for HS256
- `MISTRAL_API_KEY` — from [console.mistral.ai](https://console.mistral.ai)
- `MISTRAL_CHAT_MODEL` — e.g. `mistral-small-latest`
- `AI_PROVIDER` — `mistral` (default) or `ollama` with profile `ollama`

## Resume Tips (for interviews)

When presenting this project:

1. Explain **microservices boundaries** and why API Gateway centralizes auth
2. Walk through **RAG pipeline**: embed → store → similarity search → augment prompt
3. Demo **graceful degradation** when Ollama is offline (fallback questions/scoring)
4. Highlight **ATS analyzer** as deterministic + AI-enhanced hybrid

## License

MIT
