import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import { getAnalytics } from "../../services/analyticsService";
import "./Analytics.css";

function BarChart({ data, color = "var(--color-orange)" }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="analytics-chart">
      {data.map(d => (
        <div className="analytics-col" key={d.label}>
          <div className="analytics-bar" style={{ height: `${(d.value / max) * 100}%`, background: color }} title={`₹${d.value}`} />
          <div className="analytics-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function HBar({ rows, suffix = "" }) {
  const max = Math.max(...rows.map(r => r.value ?? r.sold), 1);
  return (
    <ul className="hbar-list">
      {rows.map((r, i) => {
        const v = r.value ?? r.sold;
        return (
          <li key={i}>
            <div className="hbar-head">
              <span>{r.name}</span>
              <strong>{v}{suffix}</strong>
            </div>
            <div className="hbar-track">
              <div className="hbar-fill" style={{ width: `${(v / max) * 100}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Analytics() {
  const [a, setA] = useState(null);
  useEffect(() => { getAnalytics().then(setA); }, []);
  if (!a) return <AdminLayout title="Analytics"><div>Loading…</div></AdminLayout>;

  return (
    <AdminLayout title="Analytics">
      <div className="summary-cards">
  <div className="summary-card-box">
    <span>📦</span>
    <p>Today's Orders</p>
    <h2>{a.summary.todayOrders}</h2>
  </div>

  <div className="summary-card-box">
    <span>💰</span>
    <p>Today's Revenue</p>
    <h2>₹{a.summary.todayRevenue}</h2>
  </div>

  <div className="summary-card-box">
    <span>🍽</span>
    <p>Pending Orders</p>
    <h2>{a.summary.pendingOrders}</h2>
  </div>

  <div className="summary-card-box">
    <span>✅</span>
    <p>Completed Orders</p>
    <h2>{a.summary.completedOrders}</h2>
  </div>
</div>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Daily Revenue</h3>
          <p className="analytics-sub">Last 7 days</p>
          <BarChart data={a.daily} />
        </div>
        <div className="analytics-card">
          <h3>Weekly Revenue</h3>
          <p className="analytics-sub">Last 4 weeks</p>
          <BarChart data={a.weekly} color="#1f2430" />
        </div>
        <div className="analytics-card analytics-wide">
          <h3>Monthly Revenue</h3>
          <p className="analytics-sub">Last 6 months</p>
          <BarChart data={a.monthly} />
        </div>

        <div className="analytics-card">
          <h3>Top Selling Products</h3>
          <p className="analytics-sub">By units sold</p>
          <HBar rows={a.topProducts} />
        </div>
        <div className="analytics-card">
          <h3>Least Selling Products</h3>
          <p className="analytics-sub">Low movers</p>
          <HBar rows={a.leastProducts} />
        </div>
        <div className="analytics-card">
          <h3>Most Ordered Categories</h3>
          <p className="analytics-sub">Share of orders</p>
          <HBar rows={a.topCategories} suffix="%" />
        </div>
      </div>
    </AdminLayout>
  );
}

export default Analytics;
