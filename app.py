#python /Users/tae/Desktop/EnvironmentalNewsPortal/app.py
from flask import Flask, render_template, request, redirect, url_for, flash, session

import requests #used for external API calls; this is different from flask.request
import weather_service
import events_service
import database
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Change this in production!

# Initialize the database
database.init_db()

# Dummy user data (you can replace with a real database)
dummy_user = {
    'email': 'test@example.com',
    'password': 'password123',
    'name': 'John Doe'
}

UPLOAD_FOLDER = os.path.join('static', 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.context_processor
def inject_now():
    from datetime import datetime
    return {'now': datetime.now()}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/forum', methods=['GET', 'POST'])
def forum():
    from database import add_forum_post, get_all_forum_posts
    posts = get_all_forum_posts()
    if request.method == 'POST':
        if 'user_id' not in session:
            flash("You must be logged in to post a message.", "flash-error")
            return redirect(url_for('login'))
        title = request.form.get('title')
        category = request.form.get('category')
        image_url = request.form.get('image_url')
        content = request.form.get('content')
        uploaded_image = None
        if 'uploaded_image' in request.files:
            file = request.files['uploaded_image']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                uploaded_image = filename
        add_forum_post(session['user_id'], session['user_name'], title, category, image_url, uploaded_image, content)
        flash("Your post has been submitted!", "flash-success")
        return redirect(url_for('forum'))
    return render_template('forum.html', posts=posts)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        if password != confirm_password:
            flash("Passwords do not match. Please try again.", "flash-error")
            return render_template('signup.html')

        # Create new user in database
        if database.create_user(name, email, password):
            flash("Sign up successful! Please log in.", "flash-success")
            return redirect(url_for('login'))
        else:
            flash("Email already exists. Please use a different email.", "flash-error")
            return render_template('signup.html')

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = database.verify_user(email, password)
        if user:
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            flash("Logged in successfully!", "flash-success")
            return redirect(url_for('home'))
        else:
            flash("Invalid email or password.", "flash-error")

    return render_template('login.html')

@app.route('/login/google')
def login_google():
    return "<h3>This would redirect to Google login (not implemented yet).</h3>"

@app.route('/logout')
def logout():
    session.clear()
    flash("You have been logged out.", "flash-success")
    return redirect(url_for('login'))

@app.route('/post_article')
def post_article():
    return render_template('post_article.html')

#NOTE: need to implement form input validation to prevent security risks
@app.route('/map_test', methods=['GET', 'POST'])
def map_test():
    if request.method == 'POST':
        lat = request.form.get('lat')
        lon = request.form.get('lon')
        return weather_service.getWeatherData(lat, lon)
    
    return render_template('map_test.html')

#NOTE: need to implement form input validation to prevent security risks
@app.route('/events', methods=['GET','POST'])
def events():
    if request.method == 'POST':
        if 'lat' in request.form:
            lat = request.form.get('lat')
            lon = request.form.get('lon')
            return events_service.getCommunityEvents(lat, lon)
        elif 'link' in request.form:
            return events_service.getEventInfo(request.form.get('link'))
    
    return render_template('events.html')

if __name__ == '__main__':
    app.run(debug=True)

