from flask import Flask, render_template, request, redirect, url_for, flash, session
import requests #used for external API calls; this is different from flask.request

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Change this in production!

openWeatherAPIKey = '4262365db106dd47e4e7bf882df6d6ec' 

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

        if password != confirm_password:
            flash("Passwords do not match. Please try again.", "flash-error")
            return render_template('signup.html')

        # Here, you'd typically save the user to a database
        flash("Sign up successful! Please log in.", "flash-success")
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if email == dummy_user['email'] and password == dummy_user['password']:
            session['user_id'] = email
            session['user_name'] = dummy_user['name']
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
        data = {}
        lat = request.form.get('lat')
        lon = request.form.get('lon')
        locInfo = requests.get("https://api.weather.gov/points/" + lat + "," + lon)
        if locInfo.ok:
            locInfo = locInfo.json()
            data['city'] = locInfo['properties']['relativeLocation']['properties']['city']
            data['state'] = locInfo['properties']['relativeLocation']['properties']['state']
            weatherInfo = requests.get(locInfo['properties']['forecast'])
            if weatherInfo.ok:
                weatherInfo = weatherInfo.json()
                data['temp'] = weatherInfo['properties']['periods'][0]['temperature']
        
        #will be replaced with AirNow API
        aqInfo = requests.get("http://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&appid=" + openWeatherAPIKey)
        if aqInfo.ok:
            print(aqInfo, flush=True)
            aqInfo = aqInfo.json()
            data['aqi'] = aqInfo['list'][0]['main']['aqi']
        return data
    
    return render_template('map_test.html')



if __name__ == '__main__':
    app.run(debug=True)
