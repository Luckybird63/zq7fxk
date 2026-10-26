* {
  box-sizing: border-box;
}

:root {
  font-family: Inter, 'Segoe UI', sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #e2e8f0;
  background: #020817;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(14, 165, 233, 0.14), transparent 18%),
    radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.08), transparent 25%),
    linear-gradient(180deg, #020817 0%, #0f172a 100%);
}

button,
input,
textarea,
select {
  font: inherit;
}

#root {
  min-height: 100vh;
}

.page-shell {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 20px 64px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 22px;
}

.eyebrow,
.section-label {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.72rem;
  color: #7dd3fc;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  line-height: 1.08;
}

h2 {
  font-size: clamp(1.4rem, 2.2vw, 2.1rem);
}

h3 {
  font-size: 1.2rem;
}

.panel {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.25);
}

.hero {
  padding: 24px 24px 16px;
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.hero-text {
  max-width: 900px;
  color: #cbd5e1;
  margin-bottom: 18px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.hero-stats > div {
  padding: 14px 16px;
  background: rgba(15, 118, 110, 0.08);
  border: 1px solid rgba(45, 212, 191, 0.18);
  border-radius: 14px;
}

.meta-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.hero-stats strong {
  font-size: 1rem;
}

.status-pill,
.risk-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.status-pill {
  background: rgba(59, 130, 246, 0.08);
  color: #bfdbfe;
}

.risk-badge.low {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.38);
  color: #bbf7d0;
}

.risk-badge.medium {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.42);
  color: #fcd34d;
}

.risk-badge.high {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.38);
  color: #fecaca;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 18px;
  margin: 24px 0;
}

.metric-card {
  padding: 18px 20px;
}

.metric-label {
  margin-bottom: 14px;
  color: #a5b4cf;
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.metric-value {
  font-size: clamp(1.5rem, 2vw, 2.2rem);
  font-weight: 700;
}

.chart-panel,
.table-panel {
  padding: 20px;
  margin-top: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-wrap {
  height: 360px;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  text-align: left;
  padding: 12px 10px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

th {
  color: #94a3b8;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.loading-card,
.error-card {
  max-width: 720px;
  margin: 80px auto;
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  padding: 28px;
  text-align: center;
}

@media (max-width: 640px) {
  .topbar,
  .hero-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-shell {
    padding-left: 14px;
    padding-right: 14px;
  }
}
