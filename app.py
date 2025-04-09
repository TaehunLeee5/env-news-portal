from flask import Flask, render_template, request, redirect, url_for, flash, session

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Change this in production!

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

if __name__ == '__main__':
    app.run(debug=True)
