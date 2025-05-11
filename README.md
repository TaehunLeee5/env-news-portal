# Environmental News Portal

A web application for sharing and accessing environmental news articles. This portal allows users to sign up, log in, and post articles about environmental topics.

## Features

- User authentication (signup, login, logout)
- Article posting functionality
- Responsive design with Bootstrap
- Flash messages for user feedback
- Google login integration (placeholder)

## Getting Started

### Prerequisites

- Python 3.6 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/TaehunLeee5/env-news-portal.git
   cd env-news-portal
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the Flask server:
   ```
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### User Authentication

- **Sign Up**: Create a new account with your name, email, and password
- **Login**: Access your account using your email and password
- **Logout**: End your session

### Testing Credentials

For testing purposes, you can use the following credentials:
- Email: test@example.com
- Password: password123

## Project Structure

```
env-news-portal/
├── app.py                  # Main application file
├── requirements.txt        # Python dependencies
├── static/                 # Static files (CSS, JS, images)
│   └── content/
│       ├── signup.js       # Signup form validation
│       └── site.css        # Custom CSS styles
└── templates/              # HTML templates
    ├── index.html          # Home page
    ├── login.html          # Login page
    ├── signup.html         # Signup page
    ├── post_article.html   # Article posting page
    └── news.html           # News display page
```

## Technologies Used

- **Backend**: Flask (Python web framework)
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Bootstrap 5
- **Authentication**: Session-based authentication

## Future Enhancements

- Database integration for persistent storage
- User profile management
- Article categories and tags
- Search functionality
- Comment system
- Social media sharing