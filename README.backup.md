# Wind Forecast Decision Support Portal

A product demo for UK wind forecast-driven day-ahead power procurement.

## Overview

This is a portfolio-style demo that helps a utility team understand:

- the latest UK wind generation forecast available for procurement decisions
- the accuracy of forecasted wind generation relative to actual output
- the operational risk associated with using forecasted wind to cover demand shortfall

## Data model

The app focuses on January 2026 as the decision horizon and uses the following wind datasets:

- actual generation from BMRS `FUELHH` where `fuelType` = `WIND`
- forecast generation from BMRS `WINDFOR` where `publishTime` and `startTime` are used to compare forecast vs actual

## Frontend stack

- React
- Vite
- Recharts
- CSS modules / custom styling

## Backend stack

- Python
- FastAPI
- requests

## Local run

```bash
docker compose up --build
```

Then visit:

- http://localhost:5173
- http://localhost:8000/api/health

## Production deployment

- Frontend: deploy the `frontend` app to Vercel
- Backend: deploy the `backend` app to Heroku, Render, or another container platform

## AI usage

This project was developed with AI-assisted coding support (GitHub Copilot) during implementation and review.
