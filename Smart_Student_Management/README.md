# EduTrack - Smart Student Management System

A comprehensive, production-ready student management platform built with modern technologies for managing students, attendance, marks, and analytics.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Docker Deployment](#docker-deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin, Student)
- Secure password hashing with BCrypt
- Protected API endpoints

### Student Management
- Complete CRUD operations for students
- Search and filter students
- Pagination and sorting
- Department and year-wise filtering
- Student profile management

### Attendance Management
- Mark attendance for students
- View attendance records
- Calculate attendance percentage
- Subject-wise attendance analytics
- Low attendance risk alerts (threshold: 75%)
- Date-range filtering

### Marks Management
- Add and update student marks
- Automatic grade calculation (A+ to F)
- Automatic GPA calculation (4.0 scale)
- Semester-wise marks summary
- Weak subject detection
- Pass/fail statistics

### Analytics Dashboard
- Overall dashboard statistics
- Topper ranking system
- Department-wise performance
- Subject-wise analytics
- Performance insights and recommendations
- Pass/fail rate analysis

## 🛠 Tech Stack

### Backend
- **Java 17** - Programming language
- **Spring Boot 3.2.0** - Application framework
- **Spring Security** - Security framework
- **Spring Data JPA** - Data access
- **Hibernate** - ORM framework
- **PostgreSQL** - Database
- **JWT (jjwt)** - Token-based authentication
- **Maven** - Build tool
- **Lombok** - Code generation
- **MapStruct** - Bean mapping

### Frontend
- **React 18.2.0** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router DOM** - Routing
- **Lucide React** - Icons
- **Recharts** - Charts

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🏗 Architecture

### Backend Architecture
```
com.edutrack
├── config/          # Configuration classes (CORS, Security)
├── controller/      # REST API controllers
├── dto/             # Data Transfer Objects
├── entity/          # JPA entities
├── enums/           # Enumerations
├── exception/       # Exception handling
├── repository/      # JPA repositories
├── security/        # Security configuration
├── service/         # Business logic
│   └── impl/        # Service implementations
├── util/            # Utility classes
└── mapper/          # Object mapping
```

### Frontend Architecture
```
src/
├── api/             # API service calls
├── assets/          # Static assets
├── components/      # Reusable components
├── context/         # React context (Auth)
├── hooks/           # Custom hooks
├── layouts/         # Page layouts
├── pages/           # Page components
├── routes/          # Route configuration
├── services/        # API services
└── utils/           # Utility functions
```

### Database Schema
- **users** - User authentication data
- **students** - Student profiles
- **attendance** - Attendance records
- **marks** - Academic marks

### Entity Relationships
```
User (1) ←→ (1) Student
Student (1) ←→ (N) Attendance
Student (1) ←→ (N) Marks
```

## 📦 Prerequisites

- **Java 17** or higher
- **Maven 3.9+** or use the included Maven wrapper
- **Node.js 18+** and npm
- **PostgreSQL 15+**
- **Docker** (optional, for containerized deployment)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/edutrack.git
cd edutrack
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE edutrack_db;
```

### 3. Backend Setup

```bash
cd backend

# Configure database in src/main/resources/application.properties
# Update the following properties:
# spring.datasource.url=jdbc:postgresql://localhost:5432/edutrack_db
# spring.datasource.username=your_username
# spring.datasource.password=your_password

# Build and run
./mvnw clean install
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## ⚙️ Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/edutrack_db
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT Configuration
jwt.secret=your-secret-key-min-256-bits
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

### Frontend Configuration

Edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api'
```

### Environment Variables

Create `.env` files:

**Backend (.env):**
```env
DB_URL=jdbc:postgresql://localhost:5432/edutrack_db
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## 🚀 Running the Application

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432`

### Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Student Endpoints

#### Get All Students (Admin)
```http
GET /api/students?page=0&size=10&sortBy=id&sortDir=asc
Authorization: Bearer {token}
```

#### Get Student by ID
```http
GET /api/students/{id}
Authorization: Bearer {token}
```

#### Create Student (Admin)
```http
POST /api/students
Authorization: Bearer {token}
Content-Type: application/json

{
  "registerNumber": "REG001",
  "department": "Computer Science",
  "year": 1,
  "section": "A",
  "phone": "1234567890"
}
```

### Attendance Endpoints

#### Mark Attendance (Admin)
```http
POST /api/attendance?studentId={studentId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "attendanceDate": "2024-01-15",
  "subject": "Mathematics",
  "status": "PRESENT",
  "remarks": "On time"
}
```

#### Get Attendance Percentage
```http
GET /api/attendance/student/{studentId}/percentage
Authorization: Bearer {token}
```

### Marks Endpoints

#### Add Marks (Admin)
```http
POST /api/marks?studentId={studentId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "subject": "Mathematics",
  "internalMarks": 40,
  "externalMarks": 45,
  "semester": 1,
  "examType": "SEMESTER"
}
```

#### Get Semester Summary
```http
GET /api/marks/student/{studentId}/semester/{semester}/summary
Authorization: Bearer {token}
```

### Analytics Endpoints (Admin Only)

#### Get Dashboard Stats
```http
GET /api/analytics/dashboard
Authorization: Bearer {token}
```

#### Get Top Students
```http
GET /api/analytics/top-students?limit=10
Authorization: Bearer {token}
```

#### Get Department Stats
```http
GET /api/analytics/departments
Authorization: Bearer {token}
```

## 🐳 Docker Deployment

### Build Images

```bash
# Build backend image
cd backend
docker build -t edutrack-backend:latest .

# Build frontend image
cd frontend
docker build -t edutrack-frontend:latest .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Production Deployment

Update `docker-compose.yml` with production configurations:

```yaml
services:
  postgres:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
  
  backend:
    environment:
      SPRING_PROFILES_ACTIVE: prod
      JWT_SECRET: ${JWT_SECRET}
```

## 📸 Screenshots

### Login Page
![Login](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Students Management
![Students](screenshots/students.png)

### Attendance
![Attendance](screenshots/attendance.png)

### Marks
![Marks](screenshots/marks.png)

### Analytics
![Analytics](screenshots/analytics.png)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Your Name** - Initial work

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing UI library
- Tailwind CSS for the utility-first CSS framework

## 📞 Support

For support, email support@edutrack.com or create an issue in the repository.

## 🔐 Security

- JWT tokens are used for authentication
- Passwords are hashed using BCrypt
- Role-based access control is implemented
- CORS is configured for cross-origin requests
- Input validation is implemented on all endpoints

## 📈 Performance

- Lazy loading for JPA entities
- Pagination for large datasets
- Database indexing on frequently queried fields
- Caching can be implemented for frequently accessed data

## 🧪 Testing

```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests
cd frontend
npm test
```

## 🔄 CI/CD

The project can be integrated with CI/CD pipelines using:
- GitHub Actions
- Jenkins
- GitLab CI

Example workflow:
1. Run tests on push
2. Build Docker images
3. Deploy to staging environment
4. Run integration tests
5. Deploy to production

## 📊 Monitoring

Consider adding:
- Application performance monitoring (APM)
- Log aggregation (ELK stack)
- Database monitoring
- Error tracking (Sentry)

## 🗄️ Database Backup

```bash
# Backup
pg_dump -U postgres edutrack_db > backup.sql

# Restore
psql -U postgres edutrack_db < backup.sql
```

## 📝 Changelog

### Version 1.0.0 (2024)
- Initial release
- Complete student management system
- Attendance tracking
- Marks management with GPA calculation
- Analytics dashboard
- Role-based authentication
