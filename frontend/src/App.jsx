* {
  box-sizing: border-box;
}

:root {
  font-family: Inter, 'Segoe UI', sans-serif;
  color: #e2e8f0;
  background: #020817;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(14, 116, 144, 0.2), transparent 35%),
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
  padding: 32px 20px 56px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
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
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
}

h2 {
  font-size: clamp(1.4rem, 2vw, 2rem);
}

.panel {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.35);
}

.hero {
  display: grid;
  gap: 12px;
  padding: 24px;
}

.hero-text {
  max-width: 760px;
  color: #cbd5e1;
}

.topbar-badge {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 999px;
  padding: 10px 14px;
  color: #bbf7d0;
  font-size: 0.82rem;
  white-space: nowrap;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
  margin: 24px 0;
}

.metric-card {
  padding: 20px;
}

.metric-label {
  color: #94a3b8;
  margin-bottom: 10px;
  font-size: 0.8rem;
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
  height: 340px;
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
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}

th {
  color: #94a3b8;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.loading-card,
.error-card {
  max-width: 700px;
  margin: 80px auto;
  background: rgba(15, 23, 42, 0.8);
  color: #e2e8f0;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 18px;
  padding: 28px;
  text-align: center;
}

@media (max-width: 640px) {
  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
