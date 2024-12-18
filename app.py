from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS
from your_module import initContract, convertDataToJSON, pinJSONtoIPFS

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

@app.route('/')
def home():
    return "Welcome to the KYC Application!"

@app.route('/submit_kyc', methods=['POST'])
def submit_kyc():
    try:
        kyc_data = request.get_json()

        # Extract data from the request
        first_name = kyc_data.get('first_name')
        last_name = kyc_data.get('last_name')
        dob = kyc_data.get('dob')
        email = kyc_data.get('email')
        nationality = kyc_data.get('nationality')
        occupation = kyc_data.get('occupation')
        annual_income = kyc_data.get('annual_income')
        image = kyc_data.get('image')

        # Convert KYC data to JSON and pin it to IPFS
        json_data = convertDataToJSON(first_name, last_name, dob, email, nationality, occupation, annual_income, image)
        ipfs_uri = pinJSONtoIPFS(json_data)

        return jsonify({
            "message": "KYC data successfully submitted and pinned to IPFS.",
            "ipfs_uri": ipfs_uri
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/get_contract', methods=['GET'])
def get_contract():
    try:
        contract = initContract()
        return jsonify({
            "message": "KYC contract initialized successfully",
            "contract_address": contract.address
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
