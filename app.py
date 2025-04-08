from flask import Flask, render_template, request, flash
import sys

app = Flask(__name__)
app.secret_key = b'placeholderkey'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == "POST":
        #TODO: register account (send to database, serverside validation, etc.)

        flash("Account registration successful. You may log in.") #placeholder feedback
    return render_template('signup.html')

@app.route('/login')
def login():
    return "<h2>Login Page</h2><p>Login form will go here.</p>"

if __name__ == '__main__':
    app.run(debug=True)

