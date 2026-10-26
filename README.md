# UK Wind Forecast Decision Support Portal

A React + Python decision-support portal for day-ahead power procurement in the UK, focused on national wind generation actuals and forecasts for January 2026.

## Product purpose

This portal supports a utility trading team that must decide how much additional power to buy from the day-ahead market when renewable generation is uncertain and weather-dependent.

The app focuses on two key questions:

- What is the latest available wind generation forecast for the procurement decision horizon?
- How reliable is that forecast, using quantified forecast error metrics?

## Business context

The trading team must ensure sufficient generation is available to meet customer demand. Wind output is renewable and weather-dependent, so the team needs a clear view of forecasted renewable contribution and the likely error in that forecast.

This challenge narrows scope to UK national wind generation only, using:

- actual generation from Elexon BMRS `FUELHH` for `fuelType = WIND`
- forecast generation from Elexon BMRS `WINDFOR`
- January 2026 as the relevant decision window

## What the app shows

- latest available wind forecast snapshot
- actual vs forecast generation chart
- forecast error metrics (MAE, RMSE, MAPE)
- daily summary of forecast performance
- operational risk signal for day-ahead procurement decisions

## Tech stack

- Frontend: React + Vite + Recharts
- Backend: Python + FastAPI
- Containerization: Docker Compose
- Data source: Elexon BMRS when an API key is configured
- Fallback mode: demo January 2026 dataset if no BMRS key is available

## AI usage

This project was developed with AI-assisted coding support using GitHub Copilot.

## Repository structure

- `backend/` — FastAPI service and wind analytics logic
- `backend/app/main.py` — API endpoints and calculations
- `frontend/` — React dashboard UI and styling
- `frontend/src/App.jsx` — dashboard logic and visual layout
- `frontend/src/styles.css` — polished styling and responsive layout
- `docker-compose.yml` — local orchestration for backend + frontend
- `.env.example` — sample environment variables
- `README.md` — project overview and run instructions

## Local setup

1. Create the environment file:

```bash
cp .env.example .env
```

2. Start the app:

```bash
docker compose up --build
```

3. Open the application:

- Frontend: http://localhost:5173
- Backend health endpoint: http://localhost:8000/api/health
- Backend summary endpoint: http://localhost:8000/api/summary

## Running without Docker

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

## Environment variables

Example `.env` values:

```env
BMRS_API_KEY=
CORS_ORIGINS=http://localhost:5173
VITE_API_URL=http://localhost:8000/api
```

If `BMRS_API_KEY` is empty, the backend automatically uses an internal January 2026 demo dataset so the dashboard remains usable in local/demo environments.

## Link to app
- **Frontend Live App:** [View Live Demo](https://zq7fxk-l9ifemgjw-debabratachowdhury711-8928s-projects.vercel.app)

## Notes on the solution

This is designed as a pilot-ready product for an internal demo and customer-facing review. The architecture is intentionally straightforward:

- FastAPI backend handles BMRS integration, data cleaning, and forecast error calculations
- React frontend renders the trading dashboard and operational summary
- Docker Compose keeps local development consistent and easy to run

## License

This project is intended for demonstration and pilot evaluation purposes.

## Conclusion
for the readme part and to fix some local issues i have used github co pilot and built this.
