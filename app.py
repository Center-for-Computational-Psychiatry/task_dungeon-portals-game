from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import pandas as pd
import os
from portal_maker import PortalMaker

app = Flask(__name__)
CORS(app)

# Set configuration values
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(__file__), 'data')
app.config['FLASK_RUN_PORT'] = 5000
# for production environment
app.config['FLASK_RUN_HOST'] = '0.0.0.0' 
app.config['FLASK_DEBUG'] = False
# for local environment
# app.config['FLASK_RUN_HOST'] = '127.0.0.1' 
# app.config['FLASK_DEBUG'] = True

# Create the "data" folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/portal_map', methods=['GET'])
def get_portal_map():
    portal_maker = PortalMaker(n_doors=18, n_floors=6, steps_to_solve=3)
    portal_map = portal_maker.portal_picker()  # Generate the portal map
    return jsonify(portal_map)


if __name__ == '__main__':
    app.run(host=app.config['FLASK_RUN_HOST'], port=app.config['FLASK_RUN_PORT'], debug=app.config['FLASK_DEBUG'])


# class GameSession(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, nullable=False)
#     start_time = db.Column(db.DateTime, nullable=False)
#     actions = db.Column(db.JSON, nullable=False)  # Store JSON data of game actions

# @app.route('/save-game', methods=['POST'])
# def save_game():
#     data = request.json
#     try:
#         new_game = GameSession(
#             user_id=data['user_id'],
#             start_time=data['start_time'],
#             actions=data['actions']
#         )
#         db.session.add(new_game)
#         db.session.commit()
#         return jsonify({"message": "Game data saved successfully"}), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400

# @app.route('/export-csv', methods=['GET'])
# def export_csv():
#     try:
#         # Query all game sessions
#         sessions = GameSession.query.all()
#         # Convert to DataFrame
#         data = [
#             {
#                 'user_id': session.user_id,
#                 'start_time': session.start_time,
#                 'actions': session.actions
#             }
#             for session in sessions
#         ]
#         df = pd.DataFrame(data)
#         # Define file path
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'game_sessions.csv')
#         # Write DataFrame to CSV
#         df.to_csv(file_path, index=False)
        
#         return jsonify({"message": "CSV file has been created successfully."}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/download-csv', methods=['GET'])
# def download_csv():
#     try:
#         # Define file path
#         file_path = os.path.join(app.config['UPLOAD_FOLDER'], 'game_sessions.csv')
#         return send_from_directory(app.config['UPLOAD_FOLDER'], 'game_sessions.csv')
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500



# @app.route('/api/data', methods=['GET', 'POST'])
# def handle_data():
#     if request.method == 'POST':
#         data = request.json
#         # Process the data
#         return jsonify({'status': 'success', 'data': data})
#     else:
#         return jsonify({'message': 'Welcome to the API'})
