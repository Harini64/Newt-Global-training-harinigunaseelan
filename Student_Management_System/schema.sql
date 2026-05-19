CREATE DATABASE student_db;

-- After creating database, connect to student_db and run this:
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    course VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL
);
