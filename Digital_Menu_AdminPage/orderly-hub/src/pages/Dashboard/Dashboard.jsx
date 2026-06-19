import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import StatCard from "../../components/StatCard/StatCard";
import OrderTable from "../../components/OrderTable/OrderTable";
import { getOrders } from "../../services/orderService";
import { getAnalytics } from "../../services/analyticsService";
import "./Dashboard.css";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    getOrders().then(setOrders);
    getAnalytics().then(setAnalytics);
  }, []);

  const pending = orders.filter(o => o.status === "Pending").length;
  const completed = orders.filter(o => o.status === "Delivered" || o.status === "Completed").length;
 const todayRevenue = orders.reduce(
  (sum, order) => sum + Number(order.total || 0),
  0
);

const weekly = analytics
  ? analytics.daily.reduce((sum, d) => sum + Number(d.value || 0), 0)
  : 0;

const monthly = analytics
  ? analytics.monthly.reduce((sum, d) => sum + Number(d.value || 0), 0)
  : 0;

const max = analytics
  ? Math.max(...analytics.daily.map((d) => Number(d.value || 0)), 1)
  : 1;
  return (
    <AdminLayout title="Dashboard">
      <div className="dashboard-grid">
        <StatCard label="Today's Revenue" value={`₹${todayRevenue.toLocaleString()}`} hint="+12% vs yesterday" icon="₹" accent />
        <StatCard label="Today's Orders"  value={orders.length} hint={`${pending} pending`} icon="🧾" />
        <StatCard label="Pending Orders"  value={pending} hint="Awaiting action" icon="⏱" />
        <StatCard label="Completed Orders" value={completed} hint="Delivered today" icon="✓" />
        <StatCard label="Weekly Revenue"  value={`₹${weekly.toLocaleString()}`} hint="Last 7 days" icon="📅" />
        <StatCard label="Monthly Revenue" value={`₹${monthly.toLocaleString()}`} hint="Last 6 months" icon="📈" />
        <StatCard label="Best Selling"    value={analytics?.topProducts[0]?.name || "—"} hint={`${analytics?.topProducts[0]?.sold || 0} sold`} icon="⭐" />
        <StatCard label="Least Selling"   value={analytics?.leastProducts[0]?.name || "—"} hint={`${analytics?.leastProducts[0]?.sold || 0} sold`} icon="↓" />
      </div>

      <div className="dashboard-section">
        <div className="dashboard-card">
          <div className="dashboard-card-head">
            <div>
              <h2 className="dashboard-card-title">Sales Overview</h2>
              <div className="dashboard-card-sub">Revenue this week</div>
            </div>
            <select className="dashboard-select">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>

          <div className="chart-bars">
            {analytics?.daily.map((d) => (
              <div className="chart-bar-col" key={d.label}>
<div
  className="chart-bar"
  style={{ height: `${(Number(d.value || 0) / max) * 100}%` }}
>
  <span className="chart-bar-value">₹{Number(d.value || 0)}</span>
</div>
                <div className="chart-bar-label">{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Quick Stats</h2>
          <ul className="quick-stats">
            <li><span>Avg Order Value</span><strong>₹{orders.length ? Math.round(todayRevenue / orders.length) : 0}</strong></li>
            <li><span>Dine-in Orders</span><strong>{orders.filter(o => o.table).length}</strong></li>
            <li><span>Delivery Orders</span><strong>{orders.filter(o => o.address).length}</strong></li>
            <li><span>Paid Orders</span><strong>{orders.filter(o => o.payment === "Paid").length}</strong></li>
            <li><span>Cancelled</span><strong>{orders.filter(o => o.status === "Cancelled").length}</strong></li>
          </ul>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card-head">
          <h2 className="dashboard-card-title">Recent Orders</h2>
          <a href="/orders" className="dashboard-link">View all →</a>
        </div>
        <OrderTable orders={orders.slice(0, 5)} compact onUpdateStatus={null} />
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
