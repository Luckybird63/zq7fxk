from __future__ import annotations

import math
import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

load_dotenv()

app = FastAPI(title="UK Wind Forecast Decision Support")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://localhost:4173",
]
if os.getenv("CORS_ORIGINS"):
    origins.extend([origin.strip() for origin in os.getenv("CORS_ORIGINS").split(",") if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def iso_utc(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def generate_demo_dataset() -> Dict[str, Any]:
    start = datetime(2026, 1, 1, 0, 0, tzinfo=timezone.utc)
    end = datetime(2026, 1, 31, 23, 30, tzinfo=timezone.utc)
    actual_data: List[Dict[str, Any]] = []
    forecast_data: List[Dict[str, Any]] = []

    publish_base = datetime(2026, 1, 1, 15, 0, tzinfo=timezone.utc)
    current = start
    while current <= end:
        hour = current.hour + current.minute / 60.0
        seasonal = 0.65 + 0.35 * math.sin((hour - 14) / 24 * 2 * math.pi)
        diurnal = 350 + 500 * math.sin((hour - 6) / 24 * 2 * math.pi)
        demand_adjustment = 150 * math.sin((current.day / 31) * 2 * math.pi)
        noise = 60 * math.sin((current.day * 9.7) + (current.hour * 1.7))
        actual_generation = max(0.0, diurnal * seasonal + demand_adjustment + noise)

        actual_data.append({
            "startTime": iso_utc(current),
            "generation": round(actual_generation, 2),
        })

        forecast_bias = 0.08 * math.sin((current.hour / 24) * 2 * math.pi)
        forecast_generation = actual_generation * (1.05 + forecast_bias) + 35
        publish_time = publish_base + timedelta(days=(current.date() - start.date()).days)
        forecast_data.append({
            "startTime": iso_utc(current),
            "publishTime": iso_utc(publish_time),
            "generation": round(forecast_generation, 2),
        })
        current += timedelta(minutes=30)

    return {"actual": actual_data, "forecast": forecast_data}


def fetch_bmrs_data() -> Dict[str, Any]:
    api_key = os.getenv("BMRS_API_KEY")
    if not api_key:
        return generate_demo_dataset()

    actual_url = "https://api.bmreports.com/BMRS/FUELHH/v1"
    forecast_url = "https://api.bmreports.com/BMRS/WINDFOR/v1"

    try:
        actual_response = requests.get(
            actual_url,
            params={
                "APIKey": api_key,
                "FromDate": "2026-01-01",
                "ToDate": "2026-01-31",
                "FuelType": "WIND",
            },
            timeout=20,
        )
        actual_response.raise_for_status()
        actual_payload = actual_response.json()

        forecast_response = requests.get(
            forecast_url,
            params={
                "APIKey": api_key,
                "FromDate": "2026-01-01",
                "ToDate": "2026-01-31",
            },
            timeout=20,
        )
        forecast_response.raise_for_status()
        forecast_payload = forecast_response.json()

        actual_rows = []
        for item in actual_payload.get("data", []) or []:
            if str(item.get("fuelType", "")).upper() == "WIND":
                actual_rows.append({
                    "startTime": item.get("startTime"),
                    "generation": safe_float(item.get("generation")),
                })

        forecast_rows = []
        for item in forecast_payload.get("data", []) or []:
            if item.get("generation") is None:
                continue
            forecast_rows.append({
                "startTime": item.get("startTime"),
                "publishTime": item.get("publishTime"),
                "generation": safe_float(item.get("generation")),
            })

        if actual_rows and forecast_rows:
            return {"actual": actual_rows, "forecast": forecast_rows}
    except Exception:
        pass

    return generate_demo_dataset()


def compute_accuracy(actual: List[Dict[str, Any]], forecast: List[Dict[str, Any]]) -> Dict[str, Any]:
    matched = []
    by_time = {entry["startTime"]: entry for entry in actual}

    for item in forecast:
        if item.get("startTime") not in by_time:
            continue
        actual_value = safe_float(by_time[item["startTime"]].get("generation"))
        forecast_value = safe_float(item.get("generation"))
        absolute_error = abs(forecast_value - actual_value)
        ape_pct = 0.0 if actual_value == 0 else (absolute_error / abs(actual_value)) * 100.0
        matched.append({
            "startTime": item["startTime"],
            "actual": actual_value,
            "forecast": forecast_value,
            "absolute_error": absolute_error,
            "ape_pct": ape_pct,
        })

    if not matched:
        return {
            "mae_mw": 0.0,
            "rmse_mw": 0.0,
            "mape_pct": 0.0,
            "mean_actual_mw": 0.0,
            "mean_forecast_mw": 0.0,
            "records": 0,
        }

    mae = sum(entry["absolute_error"] for entry in matched) / len(matched)
    rmse = math.sqrt(sum((entry["absolute_error"] ** 2) for entry in matched) / len(matched))
    mape = sum(entry["ape_pct"] for entry in matched) / len(matched)

    mean_actual = sum(entry["actual"] for entry in matched) / len(matched)
    mean_forecast = sum(entry["forecast"] for entry in matched) / len(matched)

    return {
        "mae_mw": round(mae, 2),
        "rmse_mw": round(rmse, 2),
        "mape_pct": round(mape, 2),
        "mean_actual_mw": round(mean_actual, 2),
        "mean_forecast_mw": round(mean_forecast, 2),
        "records": len(matched),
    }


def build_daily_summary(actual_rows: List[Dict[str, Any]], forecast_rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    by_dt: Dict[str, Dict[str, float]] = {}
    actual_map = {item["startTime"]: safe_float(item.get("generation")) for item in actual_rows}

    for item in forecast_rows:
        time_key = item.get("startTime")
        if time_key not in actual_map:
            continue
        day = time_key[:10]
        if day not in by_dt:
            by_dt[day] = {"day": day, "actual": 0.0, "forecast": 0.0, "error": 0.0, "count": 0}
        actual_value = actual_map[time_key]
        forecast_value = safe_float(item.get("generation"))
        by_dt[day]["actual"] += actual_value
        by_dt[day]["forecast"] += forecast_value
        by_dt[day]["error"] += abs(forecast_value - actual_value)
        by_dt[day]["count"] += 1

    daily_summary = []
    for day, values in sorted(by_dt.items()):
        count = values["count"]
        if count == 0:
            continue
        daily_summary.append({
            "day": day,
            "actual_mw": round(values["actual"] / count, 2),
            "forecast_mw": round(values["forecast"] / count, 2),
            "mae_mw": round(values["error"] / count, 2),
        })
    return daily_summary


def build_decision_snapshot(actual_rows: List[Dict[str, Any]], forecast_rows: List[Dict[str, Any]]) -> Dict[str, float]:
    if not actual_rows or not forecast_rows:
        return {
            "forecast_coverage_ratio": 0.0,
            "net_gap_mw": 0.0,
            "risk_band": "low",
        }

    actual_map = {item["startTime"]: safe_float(item.get("generation")) for item in actual_rows}
    forecast_values = []
    actual_values = []
    for item in forecast_rows:
        time_key = item.get("startTime")
        if time_key not in actual_map:
            continue
        forecast_values.append(safe_float(item.get("generation")))
        actual_values.append(actual_map[time_key])

    if not forecast_values:
        return {
            "forecast_coverage_ratio": 0.0,
            "net_gap_mw": 0.0,
            "risk_band": "low",
        }

    actual_avg = sum(actual_values) / len(actual_values)
    forecast_avg = sum(forecast_values) / len(forecast_values)
    coverage_ratio = forecast_avg / actual_avg if actual_avg else 0.0
    net_gap = forecast_avg - actual_avg

    if coverage_ratio < 0.9:
        risk_band = "high"
    elif coverage_ratio < 1.0:
        risk_band = "medium"
    else:
        risk_band = "low"

    return {
        "forecast_coverage_ratio": round(coverage_ratio, 3),
        "net_gap_mw": round(net_gap, 2),
        "risk_band": risk_band,
    }


@app.get("/api/health")
def healthcheck() -> Dict[str, str]:
    return {"status": "ok", "service": "wind-forecast-portal"}


@app.get("/api/summary")
def get_summary() -> Dict[str, Any]:
    dataset = fetch_bmrs_data()
    actual_rows = dataset.get("actual", [])
    forecast_rows = dataset.get("forecast", [])

    if not actual_rows or not forecast_rows:
        return {
            "data_window": {"start": None, "end": None},
            "latest_publish_time": None,
            "accuracy": compute_accuracy([], []),
            "latest_forecast": [],
            "daily_metrics": [],
            "decision_snapshot": {"forecast_coverage_ratio": 0.0, "net_gap_mw": 0.0, "risk_band": "low"},
        }

    actual_by_time = {item["startTime"]: item for item in actual_rows}
    latest_publish = max((item.get("publishTime") for item in forecast_rows if item.get("publishTime") is not None), default=None)
    latest_forecast_rows = [
        item for item in forecast_rows if item.get("publishTime") == latest_publish
    ] if latest_publish else forecast_rows

    matched_accuracy = compute_accuracy(actual_rows, latest_forecast_rows)
    decision_snapshot = build_decision_snapshot(actual_rows, latest_forecast_rows)

    latest_snapshot = []
    for item in latest_forecast_rows:
        if item.get("startTime") in actual_by_time:
            actual_value = safe_float(actual_by_time[item["startTime"]].get("generation"))
            forecast_value = safe_float(item.get("generation"))
            latest_snapshot.append({
                "startTime": item["startTime"],
                "forecast_mw": round(forecast_value, 2),
                "actual_mw": round(actual_value, 2),
                "error_mw": round(abs(forecast_value - actual_value), 2),
            })

    actual_average = sum(safe_float(actual_by_time[item["startTime"]].get("generation")) for item in latest_forecast_rows if item.get("startTime") in actual_by_time) / len(latest_forecast_rows) if latest_forecast_rows else 0.0
    forecast_average = sum(safe_float(item.get("generation")) for item in latest_forecast_rows) / len(latest_forecast_rows) if latest_forecast_rows else 0.0

    summary = {
        "data_window": {
            "start": actual_rows[0]["startTime"],
            "end": actual_rows[-1]["startTime"],
        },
        "latest_publish_time": latest_publish,
        "accuracy": matched_accuracy,
        "latest_forecast": latest_snapshot[:48],
        "daily_metrics": build_daily_summary(actual_rows, latest_forecast_rows),
        "forecast_average_mw": round(forecast_average, 2),
        "actual_average_mw": round(actual_average, 2),
        "decision_snapshot": decision_snapshot,
    }
    return summary


@app.get("/api/forecast-series")
def get_forecast_series() -> Dict[str, Any]:
    dataset = fetch_bmrs_data()
    actual_rows = dataset.get("actual", [])
    forecast_rows = dataset.get("forecast", [])
    if not actual_rows or not forecast_rows:
        return {"series": []}

    latest_publish = max((item.get("publishTime") for item in forecast_rows if item.get("publishTime") is not None), default=None)
    latest_forecast = [
        item for item in forecast_rows if item.get("publishTime") == latest_publish
    ] if latest_publish else forecast_rows

    actual_map = {item["startTime"]: safe_float(item.get("generation")) for item in actual_rows}
    series = []
    for item in latest_forecast:
        time_key = item.get("startTime")
        if time_key not in actual_map:
            continue
        series.append({
            "time": time_key,
            "actual": round(actual_map[time_key], 2),
            "forecast": round(safe_float(item.get("generation")), 2),
        })

    return {"series": series[:96]}
