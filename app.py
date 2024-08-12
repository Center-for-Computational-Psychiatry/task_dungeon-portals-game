from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from portal_maker import PortalMaker

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/portal_map', methods=['GET'])
def get_portal_map():
    portal_maker = PortalMaker(n_doors=18, n_floors=6, steps_to_solve=3)
    portal_map = portal_maker.portal_picker()  # Generate the portal map
    return jsonify(portal_map)

if __name__ == '__main__':
    app.run(debug=True)


# @app.route('/api/data', methods=['GET', 'POST'])
# def handle_data():
#     if request.method == 'POST':
#         data = request.json
#         # Process the data
#         return jsonify({'status': 'success', 'data': data})
#     else:
#         return jsonify({'message': 'Welcome to the API'})
