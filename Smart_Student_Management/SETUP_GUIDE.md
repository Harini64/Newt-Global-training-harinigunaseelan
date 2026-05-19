# EduTrack Setup Guide

This guide will help you set up and run the EduTrack Smart Student Management System on your local machine.

## Prerequisites Checklist

Before you begin, ensure you have the following installed:

- [ ] Java 17 or higher
- [ ] Maven 3.9+ (or use the included Maven wrapper)
- [ ] Node.js 18+ and npm
- [ ] PostgreSQL 15+
- [ ] Git
- [ ] Docker (optional, but recommended)

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/edutrack.git
cd edutrack
```

## Step 2: Database Setup

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL using Docker
docker run --name edutrack-postgres \
  -e POSTGRES_DB=edutrack_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Option B: Local PostgreSQL Installation

1. Install PostgreSQL 15+ on your system
2. Create a new database:

```sql
CREATE DATABASE edutrack_db;
```

3. Note down your PostgreSQL username and password

## Step 3: Backend Configuration

### Configure Database Connection

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/edutrack_db
spring.datasource.username=postgres
spring.datasource.password=postgres
```

### Configure JWT Secret

Generate a secure JWT secret (at least 256 bits):

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[System.Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Minimum 0 -Maximum 256}))
```

Update the JWT secret in `application.properties`:

```properties
jwt.secret=your-generated-secret-here
jwt.expiration=86400000
```

### Configure CORS

Update allowed origins for your frontend:

```properties
cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

## Step 4: Build and Run Backend

### Using Maven Wrapper (Recommended)

```bash
cd backend

# Build the project
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

### Using System Maven

```bash
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Verify Backend is Running

Open your browser and visit:
- `http://localhost:8080` - You should see a 404 error (this is expected)
- Check the console for "Started EduTrackApplication in X.XXX seconds"

## Step 5: Frontend Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Configure API Base URL

Edit `frontend/src/services/api.js` if your backend is running on a different port:

```javascript
const API_BASE_URL = 'http://localhost:8080/api'
```

### Run Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### Verify Frontend is Running

Open your browser and visit `http://localhost:5173` - You should see the login page.

## Step 6: Create Initial Users

### Using API (Postman/cURL)

#### Create Admin User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@edutrack.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

#### Create Student User

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "student@edutrack.com",
    "password": "student123",
    "role": "STUDENT"
  }'
```

### Using H2 Console (Development Only)

If you're using H2 database for development, you can access the console at:
`http://localhost:8080/h2-console`

## Step 7: Login and Test

### Admin Login

1. Navigate to `http://localhost:5173`
2. Enter admin credentials:
   - Email: `admin@edutrack.com`
   - Password: `admin123`
3. You should see the admin dashboard with analytics

### Student Login

1. Navigate to `http://localhost:5173`
2. Enter student credentials:
   - Email: `student@edutrack.com`
   - Password: `student123`
3. You should see the student dashboard

## Step 8: Test Features

### Admin Features
- [ ] View dashboard statistics
- [ ] Add new students
- [ ] Search and filter students
- [ ] Mark attendance
- [ ] Add marks
- [ ] View analytics
- [ ] View topper rankings

### Student Features
- [ ] View profile
- [ ] View attendance records
- [ ] View attendance percentage
- [ ] View marks
- [ ] View semester summaries

## Step 9: Docker Deployment (Optional)

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Build Individual Images

```bash
# Backend
cd backend
docker build -t edutrack-backend:latest .

# Frontend
cd frontend
docker build -t edutrack-frontend:latest .
```

## Troubleshooting

### Backend Issues

**Issue: Port 8080 already in use**
```bash
# Find process using port 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080                  # Linux/Mac

# Kill the process or change the port in application.properties
server.port=8081
```

**Issue: Database connection failed**
- Verify PostgreSQL is running
- Check database credentials in application.properties
- Ensure the database `edutrack_db` exists

**Issue: JWT validation errors**
- Verify JWT secret is at least 256 bits
- Check token expiration time
- Ensure system time is synchronized

### Frontend Issues

**Issue: Port 5173 already in use**
```bash
# Kill the process or change the port in vite.config.js
server: {
  port: 5174
}
```

**Issue: API connection failed**
- Verify backend is running
- Check API_BASE_URL in services/api.js
- Check CORS configuration in backend
- Check browser console for CORS errors

**Issue: Tailwind CSS not working**
- Run `npm install` again
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Database Issues

**Issue: Tables not created**
- Check `spring.jpa.hibernate.ddl-auto=update` in application.properties
- Verify database connection
- Check logs for SQL errors

**Issue: Data not persisting**
- Check transaction annotations (@Transactional)
- Verify database is not in read-only mode
- Check for constraint violations

## Common Tasks

### Reset Database

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS edutrack_db;"
psql -U postgres -c "CREATE DATABASE edutrack_db;"

# Hibernate will recreate tables on next startup
```

### Clear Application Data

```bash
# Backend
cd backend
./mvnw clean

# Frontend
cd frontend
rm -rf node_modules dist .vite
npm install
```

### View Logs

```bash
# Backend logs are in console
# For production, check logs in configured log directory

# Frontend logs are in browser console
```

## Performance Tips

1. **Enable Database Connection Pooling** - Already configured with HikariCP
2. **Use Pagination** - Implemented in all list endpoints
3. **Enable Caching** - Add @Cacheable annotations for frequently accessed data
4. **Optimize Queries** - Use @EntityGraph for lazy loading optimization
5. **Frontend Optimization** - Run `npm run build` for production

## Security Best Practices

1. **Change Default Passwords** - Update all default credentials
2. **Use HTTPS in Production** - Configure SSL/TLS
3. **Rotate JWT Secrets** - Change secrets periodically
4. **Enable Rate Limiting** - Add rate limiting to API endpoints
5. **Regular Updates** - Keep dependencies updated

## Next Steps

1. Configure production database
2. Set up CI/CD pipeline
3. Configure monitoring and logging
4. Set up backup strategy
5. Configure domain and SSL
6. Deploy to production server

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the main README.md
3. Check application logs
4. Create an issue on GitHub with detailed error information

## Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
