from flask import Flask, jsonify, request, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data', methods=['GET', 'POST'])
def handle_data():
    if request.method == 'POST':
        data = request.json
        # Process the data
        return jsonify({'status': 'success', 'data': data})
    else:
        return jsonify({'message': 'Welcome to the API'})

if __name__ == '__main__':
    app.run(debug=True)
