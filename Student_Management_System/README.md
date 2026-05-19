# Student Management CRUD App

Frontend: PyQt6  
Database: PostgreSQL using pgAdmin 4  
Operations: Create, Read, Update, Delete, Search

## 1. Install requirements

```bash
pip install -r requirements.txt
```

## 2. Create database in pgAdmin 4

Open pgAdmin 4, create a database named:

```text
student_db
```

Then open Query Tool inside `student_db` and run:

```sql
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    course VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL
);
```

## 3. Create `.env` file

Copy `.env.example` and rename it to `.env`.

Update your PostgreSQL password:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=student_db
DB_USER=postgres
DB_PASSWORD=your_pgadmin_password
```

## 4. Run the app

```bash
python main.py
```

## Features

- Add student
- View all students
- Search students
- Update selected student
- Delete selected student
- PostgreSQL backend
- PyQt6 desktop frontend
