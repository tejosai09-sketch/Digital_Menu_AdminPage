import { useEffect, useMemo, useRef, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import OrderTable from "../../components/OrderTable/OrderTable";
import StatCard from "../../components/StatCard/StatCard";
import {
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "../../services/orderService";
import "../Orders/Orders.css";
import "../Dashboard/Dashboard.css";

const STATUSES = [
  "All",
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
];

const getOrderDate = (order) => {
  const dateVal = order.created_at || order.time;
  return dateVal ? new Date(dateVal) : new Date();
};

const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const getOrderTotal = (order) =>
  Number(
    order.total ||
    order.total_amount ||
    order.totalAmount ||
    order.amount ||
    0
  );

function TodayOrders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const lastOrderIdRef = useRef(null);

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.volume = 1;
    audio.play().catch((error) => {
      console.log("Sound play failed:", error);
    });
  };

  const fetchOrdersData = async (showNotification = false) => {
    try {
      const data = await getOrders();

      if (data.length > 0) {
        const latestOrderId = data[0].id;

        if (
          showNotification &&
          lastOrderIdRef.current &&
          latestOrderId !== lastOrderIdRef.current
        ) {
          playNotificationSound();
        }

        lastOrderIdRef.current = latestOrderId;
      }

      setOrders(data);
    } catch (error) {
      console.log("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    fetchOrdersData(false);

    const interval = setInterval(() => {
      fetchOrdersData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    fetchOrdersData(false);
  };

  const handleMarkPaid = async (orderId) => {
    await updatePaymentStatus(orderId, "paid");
    fetchOrdersData(false);
  };

  // Filter orders created today
  const todaysOrders = useMemo(() => {
    const today = new Date();
    return orders.filter((order) => isSameDay(getOrderDate(order), today));
  }, [orders]);

  // Compute stat metrics for today's orders
  const stats = useMemo(() => {
    const totalCount = todaysOrders.length;
    const pendingCount = todaysOrders.filter((o) => o.status === "Pending").length;
    const completedCount = todaysOrders.filter(
      (o) => o.status === "Delivered" || o.status === "Completed"
    ).length;

    const revenue = todaysOrders
      .filter((o) => o.status === "Delivered" || o.status === "Completed")
      .reduce((sum, o) => sum + getOrderTotal(o), 0);

    return {
      totalCount,
      pendingCount,
      completedCount,
      revenue,
    };
  }, [todaysOrders]);

  // Apply search query and status filter
  const filtered = useMemo(() => {
    return todaysOrders.filter((o) => {
      const q = query.toLowerCase();
      const orderIdStr = String(o.id || "").toLowerCase();
      const customerStr = String(o.customer || "").toLowerCase();
      const phoneStr = String(o.phone || "");

      const matchesQ =
        !q ||
        orderIdStr.includes(q) ||
        customerStr.includes(q) ||
        phoneStr.includes(q);

      if (status === "All") {
        return matchesQ;
      }

      return o.status === status && matchesQ;
    });
  }, [todaysOrders, query, status]);

  return (
    <AdminLayout title="Today's Orders">
      {/* Today's Stats Cards */}
      <div className="dashboard-grid">
        <StatCard
          label="Today's Orders"
          value={stats.totalCount}
          hint={`${stats.pendingCount} pending`}
          icon="🧾"
        />

        <StatCard
          label="Pending Orders"
          value={stats.pendingCount}
          hint="Awaiting action"
          icon="⏱"
        />

        <StatCard
          label="Completed Orders"
          value={stats.completedCount}
          hint="Delivered today"
          icon="✓"
        />

        <StatCard
          label="Today's Revenue"
          value={`₹${stats.revenue.toLocaleString()}`}
          hint="From delivered/completed orders"
          icon="₹"
          accent
        />
      </div>

      {/* Toolbar & Filters */}
      <div className="orders-toolbar">
        <input
          className="orders-search"
          placeholder="Search by order ID, name, or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="orders-filters">
        {STATUSES.map((s) => (
          <button
            key={s}
            className={`orders-chip ${
              status === s ? "orders-chip-active" : ""
            }`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <OrderTable
        orders={filtered}
        onUpdateStatus={handleUpdateStatus}
        onMarkPaid={handleMarkPaid}
      />
    </AdminLayout>
  );
}

export default TodayOrders;
