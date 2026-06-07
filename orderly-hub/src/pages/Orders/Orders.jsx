import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import OrderTable from "../../components/OrderTable/OrderTable";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import "./Orders.css";

const STATUSES = [
  "All",
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [date, setDate] = useState("");

  const fetchOrdersData = () => {
    getOrders().then((data) => {
      setOrders(data);
    });
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    fetchOrdersData();
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = query.toLowerCase();

      const orderIdStr = String(o.id || "").toLowerCase();
      const customerStr = String(o.customer || "").toLowerCase();
      const phoneStr = String(o.phone || "");
      const timeStr = String(o.time || "");

      const matchesQ =
        !q ||
        orderIdStr.includes(q) ||
        customerStr.includes(q) ||
        phoneStr.includes(q);

      const matchesD = !date || timeStr.startsWith(date);

      const isActive =
        o.status !== "Delivered" &&
        o.status !== "Cancelled";

      if (status === "All") {
        return isActive && matchesQ && matchesD;
      }

      return o.status === status && matchesQ && matchesD;
    });
  }, [orders, query, status, date]);

  return (
    <AdminLayout title="Orders">
      <div className="orders-toolbar">
        <input
          className="orders-search"
          placeholder="Search by order ID, name, or phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <input
          type="date"
          className="orders-date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
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
      <OrderTable orders={filtered} onUpdateStatus={handleUpdateStatus} />

    </AdminLayout>
  );
}

export default Orders;