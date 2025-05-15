# Environmental News Portal

A web application for sharing and accessing environmental news articles, weather information, and community events. This portal allows users to sign up, log in, and post articles about environmental topics.

## Features

- User authentication (signup, login, logout)
- Article posting functionality with image upload support
- Weather information and alerts based on location
- Community events discovery
- Forum for community discussions
- Responsive design with Bootstrap
- Flash messages for user feedback

## Prerequisites

- Python 3.6 or higher
- pip (Python package manager)
- Git
- A modern web browser
- API Keys (optional for full functionality):
  - AQICN API Key for air quality data
  - Weather API access
  - News API access

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/TaehunLeee5/env-news-portal.git
   cd env-news-portal
   ```

2. Create and activate a virtual environment:
   ```bash
   # Create virtual environment
   python -m venv venv

   # Activate virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   aqicnAPIKey=your_aqicn_api_key
   WEATHER_API_KEY=your_weather_api_key
   NEWS_API_KEY=your_news_api_key
   ```

## Running the Application

1. Ensure your virtual environment is activated

2. Start the Flask server:
   ```bash
   python app.py
   ```

3. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## Using the Application

### User Authentication
- **Sign Up**: Create a new account with your name, email, and password
- **Login**: Access your account using your email and password
- **Logout**: End your session

### Main Features
1. **Forum**
   - Create posts with images
   - Filter posts by category
   - Search posts by title or content
   - Sort posts by popularity, date, or title

2. **Weather**
   - View current weather conditions
   - Check weather alerts
   - Get zone-specific information

3. **Events**
   - Discover community events
   - View event details
   - Filter events by location

4. **News**
   - Browse environmental news headlines
   - Navigate through news pages

### Testing Credentials
For testing purposes, you can use the following credentials:
- Email: test@example.com
- Password: password123

## Project Structure

```
EnvironmentalNewsPortal/
├── app.py                        # Main Flask application
├── database.py                   # Database operations
├── events_service.py            # Events API integration
├── weather_service.py           # Weather API integration
├── news_service.py              # News API integration
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables (create this)
├── static/                      # Static files
│   ├── content/                # CSS and JS files
│   └── uploads/                # User uploaded images
└── templates/                   # HTML templates
    ├── index.html
    ├── login.html
    ├── signup.html
    ├── forum.html
    ├── events.html
    ├── weather.html
    └── news.html
```

## Troubleshooting

1. **Database Issues**
   - If you encounter database errors, ensure the `database.db` file exists
   - The database will be automatically initialized on first run

2. **API Integration**
   - Weather and news features require valid API keys
   - Check the `.env` file for proper API key configuration

3. **Image Upload**
   - Ensure the `static/uploads` directory exists
   - Supported image formats: PNG, JPG, JPEG, GIF

4. **Common Errors**
   - "Module not found": Ensure virtual environment is activated
   - "API Error": Check API keys in `.env` file
   - "Permission denied": Check file permissions for uploads directory

## Technologies Used

- **Backend**: Flask 3.0.0
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Bootstrap 5
- **Database**: SQLite
- **Authentication**: Session-based
- **APIs**: Weather, News, Events services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

