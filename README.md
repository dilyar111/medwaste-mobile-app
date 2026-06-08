# MedWaste Mobile App

## Local Services

Run the services in separate terminals:

```text
AI module:   ai_module, uvicorn app.main:app --host 127.0.0.1 --port 8000
Backend:     backend, npm run dev
Mock sensor: backend, npm run mock:sensors
Frontend:    project root, npm run dev
```

The frontend talks to the backend through `VITE_API_URL`.
The backend talks to the AI module through `ML_SERVICE_URL`.

## Required Environment

Root `.env`:

```text
VITE_API_URL=http://127.0.0.1:5000
```

Backend `backend/.env`:

```text
PORT=5000
MONGO_URI=<mongo connection string>
POSTGRES_URI=<postgres connection string>
JWT_SECRET=<strong secret>
ML_SERVICE_URL=http://localhost:8000
ML_SERVICE_TIMEOUT_MS=5000
MOCK_ML_WARMUP_POINTS=12
MOCK_HISTORY_STEP_HOURS=0.5
MOCK_ML_WARMUP=true
```

Email alerts are optional. Configure all three values to send real alert emails:

```text
EMAIL_USER=<gmail account>
EMAIL_PASS=<gmail app password>
ALERT_RECIPIENT=<recipient email>
```

If `EMAIL_USER` or `EMAIL_PASS` is missing, the backend logs that email is skipped.

## Prediction And Alerts

- `/api/bins/predict/:binId` loads telemetry only for that `binId`, sorts it chronologically, and sends it to the AI module.
- The AI module trains a per-container model from the latest active fill cycle.
- Mock sensors warm each container with enough clean history for training before sampling predictions.
- A fullness reading at `80%` or above creates a critical alert.
- New critical alerts create dashboard notifications for admin and personnel users in the same company.
- Alert emails are sent only when email environment variables are configured.
