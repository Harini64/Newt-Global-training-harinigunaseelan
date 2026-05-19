import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        database=os.getenv("DB_NAME", "student_db"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", ""),
        cursor_factory=RealDictCursor,
    )


def create_table():
    query = """
    CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        course VARCHAR(100) NOT NULL,
        mobile VARCHAR(15) NOT NULL
    );
    """
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query)
            conn.commit()


def fetch_students(search_text=""):
    with get_connection() as conn:
        with conn.cursor() as cur:
            if search_text:
                cur.execute(
                    """
                    SELECT id, name, course, mobile
                    FROM students
                    WHERE name ILIKE %s OR course ILIKE %s OR mobile ILIKE %s
                    ORDER BY id;
                    """,
                    (f"%{search_text}%", f"%{search_text}%", f"%{search_text}%"),
                )
            else:
                cur.execute("SELECT id, name, course, mobile FROM students ORDER BY id;")
            return cur.fetchall()


def add_student(name, course, mobile):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO students (name, course, mobile) VALUES (%s, %s, %s);",
                (name, course, mobile),
            )
            conn.commit()


def update_student(student_id, name, course, mobile):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE students
                SET name=%s, course=%s, mobile=%s
                WHERE id=%s;
                """,
                (name, course, mobile, student_id),
            )
            conn.commit()


def delete_student(student_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM students WHERE id=%s;", (student_id,))
            conn.commit()
