from flask import Flask, render_template, request, redirect, url_for, flash, session
import os

import requests #used for external API calls; this is different from flask.request
import weather_service
import events_service
from flask_sqlalchemy import SQLAlchemy
from flask_migrate  import Migrate
from models        import db, User, Post

app = Flask(__name__)
app.secret_key = 'aqicnAPIKey'  # This is a development key - change in production!

app.config['SQLALCHEMY_DATABASE_URI']        = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

# Dummy user data (you can replace with a real database)
dummy_user = {
    'email': 'test@example.com',
    'password': 'password123',
    'name': 'John Doe'
}

@app.context_processor
def inject_now():
    from datetime import datetime
    return {'now': datetime.now()}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        user_email = User.query.filter_by(email=email).first()
        if user_email:
            flash("Email already in use. Please try a different email.", "flash-error")
            return render_template('signup.html')

        if password != confirm_password:
            flash("Passwords do not match. Please try again.", "flash-error")
            return render_template('signup.html')

        user = User(name=name, email=email, password=password)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        flash("Sign up successful! Please log in.", "flash-success")
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            session['user_id'] = user.id
            session['user_name'] = user.name
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

@app.route('/map_test', methods=['GET', 'POST'])
def map_test():
    if request.method == 'POST':
        lat = request.form.get('lat')
        lon = request.form.get('lon')
        return weather_service.getWeatherData(lat, lon)
    
    return render_template('map_test.html')

@app.route('/events', methods=['GET','POST'])
def events():
    if request.method == 'POST':
        lat = request.form.get('lat')
        lon = request.form.get('lon')
        return events_service.getCommunityEvents(lat, lon)
    
    return render_template('events.html')

if __name__ == '__main__':
    app.run(debug=True)
