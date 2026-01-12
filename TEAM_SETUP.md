# Team Setup Guide

This project is a two-server app (backend API + frontend dashboard). Follow these steps to run locally after cloning or unzipping.

## Prerequisites
- Python 3.12+
- Node.js 18+ (npm included)
- Git (if cloning)

## 1) Clone or unzip
```bash
# clone
 git clone <repo-url>
 cd fraud-detector

# or unzip, then
 cd fraud-detector
```

## 2) Backend setup (Flask)
```bash
cd backend
python -m pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
python app.py
```
- Runs at http://127.0.0.1:5000
- Endpoints: `/api/health`, `/api/sample-data`, `/api/analyze`
- Upload field name for CSV: `file` (multipart/form-data)

## 3) Frontend setup (React + Vite)
Open a new terminal:
```bash
cd frontend
npm install
npm run dev          # dev server
# or for fastest runtime:
# npm run build && npm run preview
```
- Dev server prints URL (typically http://localhost:5173)
- Keep backend running for real API calls

## 4) Using the app
- Click **Generate Sample Data** to fetch analyzed Kaggle sample from backend
- Or drag/drop a CSV (requires `Amount` column; `Time`/`V1..Vn` optional)
- Dashboard shows stats, charts, and sortable/filterable table with reasons

## 5) Common issues
- `npm: command not found` → Install Node.js LTS
- `ModuleNotFoundError: No module named 'flask'` → Run backend install step
- Slow UI in dev mode → use `npm run build && npm run preview`

## 6) Repo structure
- backend/app.py — Flask routes
- backend/detector.py — ML + rules + response formatting
- frontend/ — React UI (upload, charts, table)

## 7) Production notes
- Backend: use a WSGI server (e.g., gunicorn/uwsgi) behind a reverse proxy
- Frontend: deploy Vite build output (`npm run build`) to static hosting
- Configure CORS/proxy as needed for your environment
