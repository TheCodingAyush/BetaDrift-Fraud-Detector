# Fraud Detection Web App

A full-stack fraud detection dashboard where users upload transaction CSVs (or use sample Kaggle data) and get ML + rule-based risk scoring with charts and an interactive table.

## Tech Stack
- Backend: Python + Flask + pandas + scikit-learn (Isolation Forest)
- Frontend: React (Vite) + TypeScript + Tailwind + Recharts + TanStack Table

## How It Works
- **ML (40%)**: Isolation Forest anomaly detection on normalized features (Amount, Hour, V1-V5 if present).
- **Rules (60%)**: Large outliers, micro-transactions, round numbers, late-night hours.
- Scores combine to `risk_score` and map to Low/Medium/High/Critical; reasons are generated per row.

## Setup
### Backend
```bash
cd backend
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
python app.py
```
Backend runs at http://127.0.0.1:5000.

### Frontend
```bash
cd frontend
npm install
npm run dev   # or: npm run build && npm run preview
```
Frontend runs at http://localhost:5173 (shown in terminal).

## API
- `GET /api/health` — health check
- `GET /api/sample-data` — returns analyzed sample (100 random Kaggle rows)
- `POST /api/analyze` — analyze CSV upload (field name: `file`, multipart/form-data). Limited to first 500 rows for speed.

### Analyze response shape
```json
{
  "transactions": [{
    "id": "T001",
    "amount": 123.45,
    "riskScore": 72,
    "riskLevel": "High",
    "reasons": ["Large amount: $123.45", "ML detected unusual pattern"]
  }],
  "statistics": {
    "totalTransactions": 100,
    "suspiciousCount": 23,
    "fraudRate": 23.0,
    "totalAtRisk": 50234.12
  },
  "riskDistribution": [{"name": "High", "value": 10, "color": "hsl(25 95% 55%)"}],
  "fraudComparison": [{"name": "Analysis", "fraudulent": 23, "normal": 77}]
}
```

## CSV Format
- Required column: `Amount`
- Optional columns (improve model): `Time` (seconds; converts to Hour), `V1..Vn` (PCA features from Kaggle credit card dataset), `Class` (0/1) for reference only.
- Upload as CSV; or click **Generate Sample Data** to fetch Kaggle sample from backend.

## Running Notes
- Dev mode uses Flask built-in server (not for production). For prod, use Gunicorn/uwsgi + reverse proxy.
- Frontend dev mode is slower; `npm run build && npm run preview` is faster.
- If npm is missing, install Node.js LTS.
- If pip errors on pandas/numpy, upgrade pip/setuptools/wheel (already in setup above).

## Repo Structure
- `backend/app.py` — Flask API endpoints
- `backend/detector.py` — ML + rule engine and response shaping
- `frontend/` — React + Tailwind dashboard (charts, table, upload UI)

## Troubleshooting
- Hover text disappearing (light mode) fixed in table header buttons.
- Background particles disabled for performance; re-enable via `ParticleBackground.tsx` if desired.
- Sample data randomness: `/api/sample-data` samples new fraud/normal rows each call.

## Quick Start
1) Start backend: `python app.py`
2) Start frontend: `npm run dev`
3) Open browser, use **Generate Sample Data** or upload a CSV.
