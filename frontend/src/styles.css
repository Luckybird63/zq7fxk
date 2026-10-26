import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const formatMW = (value) => `${Number(value || 0).toFixed(1)} MW`;
const formatPct = (value) => `${Number(value || 0).toFixed(1)}%`;
const formatDate = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function App() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(`${API_URL}/summary`);
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError('Unable to load wind forecast data. Please confirm the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const chartData = useMemo(() => {
    if (!summary?.latest_forecast) return [];
    return summary.latest_forecast.map((point) => ({
      time: new Date(point.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actual: Number(point.actual_mw || 0),
      forecast: Number(point.forecast_mw || 0),
    }));
  }, [summary]);

  const riskTone = summary?.decision_snapshot?.risk_band || 'low';
  const riskText = {
    low: 'Forecasting confidence is stable. Renewable availability looks manageable for day-ahead procurement decisions.',
    medium: 'Forecast variance is moderate. Procurement decisions should account for additional balancing risk.',
    high: 'Forecast error is elevated. Consider a defensible procurement buffer in the day-ahead market.',
  }[riskTone];

  if (loading) {
    return (
      <div className="page-shell">
        <div className="loading-card">Loading UK wind forecast dashboard…</div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="page-shell">
        <div className="error-card">{error || 'No data available yet.'}</div>
      </div>
    );
  }

  const metrics = [
    { label: 'Actual avg generation', value: formatMW(summary.actual_average_mw) },
    { label: 'Forecast avg generation', value: formatMW(summary.forecast_average_mw) },
    { label: 'MAE', value: formatMW(summary.accuracy?.mae_mw) },
    { label: 'RMSE', value: formatMW(summary.accuracy?.rmse_mw) },
    { label: 'MAPE', value: formatPct(summary.accuracy?.mape_pct) },
  ];

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Decision support portal</p>
          <h1>UK Wind Forecast Dashboard</h1>
        </div>
        <div className="status-pill">
          Latest publish: {formatDate(summary.latest_publish_time)}
        </div>
      </header>

      <section className="hero panel">
        <div className="hero-header">
          <div>
            <p className="section-label">Operational view</p>
            <h2>January 2026 day-ahead procurement window</h2>
          </div>
          <span className={`risk-badge ${riskTone}`}>{riskTone.toUpperCase()} RISK</span>
        </div>
        <p className="hero-text">{riskText}</p>
        <div className="hero-stats">
          <div>
            <span className="meta-label">Forecast coverage</span>
            <strong>{summary.decision_snapshot?.forecast_coverage_ratio ?? 0.0}</strong>
          </div>
          <div>
            <span className="meta-label">Net gap</span>
            <strong>{formatMW(summary.decision_snapshot?.net_gap_mw)}</strong>
          </div>
          <div>
            <span className="meta-label">Data window</span>
            <strong>{formatDate(summary.data_window?.start)} → {formatDate(summary.data_window?.end)}</strong>
          </div>
        </div>
      </section>

      <section className="metrics-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card panel">
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
          </article>
        ))}
      </section>

      <section className="panel chart-panel">
        <div className="section-header">
          <div>
            <p className="section-label">Latest forecast</p>
            <h3>Actual vs forecast generation</h3>
          </div>
        </div>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={360}>
            <AreaChart data={chartData} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="actualFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#7dd3fc" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#7dd3fc" stopOpacity={0.08} />
                </linearGradient>
                <linearGradient id="forecastFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0.08} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fill: '#cbd5e1', fontSize: 10 }} interval={11} />
              <YAxis tick={{ fill: '#cbd5e1', fontSize: 10 }} label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#e2e8f0' }}
              />
              <Area type="monotone" dataKey="actual" stroke="#7dd3fc" fill="url(#actualFill)" strokeWidth={2} name="Actual" />
              <Area type="monotone" dataKey="forecast" stroke="#34d399" fill="url(#forecastFill)" strokeWidth={2} name="Forecast" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel table-panel">
        <div className="section-header">
          <div>
            <p className="section-label">Daily summary</p>
            <h3>Average generation by day</h3>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Actual avg</th>
                <th>Forecast avg</th>
                <th>Mean absolute error</th>
              </tr>
            </thead>
            <tbody>
              {summary.daily_metrics?.slice(0, 10).map((row) => (
                <tr key={row.day}>
                  <td>{row.day}</td>
                  <td>{formatMW(row.actual_mw)}</td>
                  <td>{formatMW(row.forecast_mw)}</td>
                  <td>{formatMW(row.mae_mw)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
