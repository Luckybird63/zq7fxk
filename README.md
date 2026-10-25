# Wind Forecast Decision Support Portal

A React + Python decision-support portal for UK day-ahead power procurement, focused on national wind generation actuals and forecasts for January 2026.

This project was created with AI-assisted coding support (GitHub Copilot) during implementation.

## Why this product matters

The client needs to decide how much additional electricity to buy from the day-ahead market after accounting for available wind generation. The portal helps them:

- view the most recent wind generation forecast available to the trader
- compare forecasted generation against actual generation
- understand forecast error quantitatively using MAE, RMSE and MAPE
- review a January 2026 decision window with clean operational summaries

## Features

- live or simulated wind actual vs forecast dataset for January 2026
- latest forecast snapshot for the decision horizon
- forecast accuracy metrics for day-ahead trading decisions
- trend chart showing actual vs forecast generation across the month
- daily aggregated summary for operational review

## Repository layout

- `backend/` — FastAPI service that prepares the wind data and accuracy calculations
- `frontend/` — React + Vite dashboard for the trading portal UI
- `docker-compose.yml` — local Docker orchestration for the app stack
- `README.md` — project overview and run instructions
- `.gitignore` — standard project ignore file

## Running locally with Docker

1. Clone the repo.
2. From the project root, run:

```bash
docker compose up --build
```

3. Open the frontend in the browser:

- http://localhost:5173

4. The backend API is available at:

- http://localhost:8000/api/summary
- http://localhost:8000/api/health

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

## Backend notes

The application is designed for the Elexon BMRS datasets:

- wind actual generation: `FUELHH`
- wind forecast generation: `WINDFOR`

If a BMRS API key is configured in the environment, the backend will attempt to call the live BMRS endpoints. When no API key is available, the service falls back to a January 2026 demo dataset so the portal remains usable in offline/demo setups.

## Deployment

This repository is structured so the frontend can be deployed to Vercel and the backend can be deployed to Heroku, Render, or a container platform. The exact live URLs will need to be set after deployment.

Suggested production setup:

- Frontend: Vercel static app
- Backend: Heroku / Render / Azure Container Apps
- Shared environment variables:
  - `BMRS_API_KEY`
  - `CORS_ORIGINS`

## Product pitch example

> We have created a trading support portal that gives the day-ahead power procurement team immediate visibility into the latest UK wind generation forecast and the confidence range around it. The team can evaluate expected renewable generation, compare it with actual historical wind output, and quantify forecast accuracy before making wholesale market purchase decisions. This gives the client a practical, operational tool for balancing renewable uncertainty with procurement risk.

## Technical review summary

The solution comprises:

- a Python FastAPI backend for data collection, transformation, and analytics
- a React/Vite frontend for clear operational dashboards and charts
- Docker-based local deployment to keep the development environment consistent
- a simple architecture designed for incremental extension to more market datasets and trading workflows

## License

This repository is for demonstration and client pilot purposes.
