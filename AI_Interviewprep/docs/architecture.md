# Architecture

```mermaid
flowchart TB
    subgraph client [Client Layer]
        FE[React Frontend]
    end

    subgraph gateway [API Gateway :8080]
        GW[Spring Cloud Gateway]
        JWT[JWT Global Filter]
    end

    subgraph services [Microservices]
        AUTH[Auth Service :8081]
        RES[Resume Service :8082]
        INT[Interview Service :8083]
        AI[AI Service :8085]
        NOTIF[Notification Service :8084]
    end

    subgraph data [Data Layer]
        PG[(PostgreSQL)]
        VEC[pgvector]
        REDIS[(Redis)]
    end

    subgraph ai_ext [AI Runtime]
        OLLAMA[Ollama]
    end

    FE --> GW
    GW --> JWT
    JWT --> AUTH
    JWT --> RES
    JWT --> INT
    JWT --> AI
    JWT --> NOTIF
    INT -->|OpenFeign| AI
    RES -->|OpenFeign| AI
    AUTH --> PG
    RES --> PG
    INT --> PG
    AI --> PG
    AI --> VEC
    NOTIF --> PG
    AI --> OLLAMA
    GW -.-> REDIS
```

## Service Responsibilities

| Service | Database | Core Responsibility |
|---------|----------|---------------------|
| auth-service | auth_db | Registration, login, JWT issuance |
| resume-service | resume_db | File upload, text extraction, ATS scoring |
| interview-service | interview_db | Sessions, Q&A persistence, analytics |
| ai-service | ai_db | LLM calls, embeddings, RAG retrieval |
| notification-service | notification_db | User notifications, email |
| gateway-service | — | Routing, CORS, JWT validation |
