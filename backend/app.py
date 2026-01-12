from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from detector import FraudDetector
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

detector = FraudDetector()

@app.route('/', methods=['GET'])
def home():
    """Root endpoint - API documentation"""
    return jsonify({
        'message': 'Fraud Detection API',
        'version': '1.0',
        'endpoints': {
            'POST /api/analyze': 'Analyze transactions for fraud (file upload or JSON data)',
            'GET /api/sample-data': 'Get sample dataset from Kaggle credit card data',
            'GET /api/health': 'Health check endpoint'
        }
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    """Analyze uploaded CSV or use sample data"""
    try:
        if 'file' in request.files:
            # Handle file upload
            file = request.files['file']
            df = pd.read_csv(file)
        else:
            # Use JSON data
            data = request.json
            df = pd.DataFrame(data['transactions'])
        
        # Limit to first 500 rows for performance
        df = df.head(500)
        
        result = detector.analyze(df)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/sample-data', methods=['GET'])
def sample_data():
    """Load sample from Kaggle dataset and analyze"""
    try:
        df = pd.read_csv('data/creditcard.csv')
        
        # Get 100 random transactions (mix of fraud and normal)
        fraud = df[df['Class'] == 1].sample(n=min(20, len(df[df['Class'] == 1])))
        normal = df[df['Class'] == 0].sample(n=80)
        sample = pd.concat([fraud, normal]).sample(frac=1).reset_index(drop=True)
        
        # Add transaction IDs for tracking
        sample['transaction_id'] = ['T' + str(i).zfill(3) for i in range(len(sample))]
        
        # Analyze the sample data
        result = detector.analyze(sample)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)