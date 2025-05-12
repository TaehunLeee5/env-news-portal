import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.execute('''
        CREATE TABLE IF NOT EXISTS forum_posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            user_name TEXT,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            image_url TEXT,
            uploaded_image TEXT,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    conn.commit()
    conn.close()

def create_user(name, email, password):
    try:
        conn = get_db_connection()
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                    (name, email, hashed_password))
        conn.commit()
        conn.close()
        return True
    except sqlite3.IntegrityError:
        return False

def get_user_by_email(email):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()
    return user

def verify_user(email, password):
    user = get_user_by_email(email)
    if user and check_password_hash(user['password'], password):
        return user
    return None

# Add a new forum post
def add_forum_post(user_id, user_name, title, category, image_url, uploaded_image, content):
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO forum_posts (user_id, user_name, title, category, image_url, uploaded_image, content)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (user_id, user_name, title, category, image_url, uploaded_image, content))
    conn.commit()
    conn.close()

# Fetch all forum posts (newest first)
def get_all_forum_posts():
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM forum_posts ORDER BY created_at DESC').fetchall()
    conn.close()
    return posts 