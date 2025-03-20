from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    return render_template('signup.html')

@app.route('/login')
def login():
    return "<h2>Login Page</h2><p>Login form will go here.</p>"

if __name__ == '__main__':
    app.run(debug=True)

