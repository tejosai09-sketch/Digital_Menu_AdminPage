import StatusBadge from "../StatusBadge/StatusBadge";
import "./OrderTable.css";

const STATUSES = [
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled",
];

function OrderTable({ orders = [], compact = false, onUpdateStatus }) {
  return (
    <div className="order-table-wrap">
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            {!compact && <th>Phone</th>}
            {!compact && <th>Table</th>}
            {!compact && <th>Address</th>}
            <th>Items</th>
            <th>Total</th>
            <th>Time</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={compact ? 6 : 10} className="order-table-empty">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o.id}>
                <td className="order-id">#{o.id}</td>
                <td>{o.customer || "Guest"}</td>
                {!compact && <td>{o.phone || "—"}</td>}
                {!compact && <td>{o.table || o.tableNumber || "—"}</td>}
                {!compact && (
                  <td className="order-address">{o.address || "—"}</td>
                )}

                <td className="order-items">
                  {Array.isArray(o.items) && o.items.length > 0
                    ? o.items.map((item, index) => (
                        <div key={index}>
                          {item.name || "Item"} x{item.quantity}
                        </div>
                      ))
                    : "No items"}
                </td>

                <td>₹{Number(o.total || o.totalAmount || 0)}</td>
                <td className="order-time">{o.time || "—"}</td>

                <td>
                  <StatusBadge status={o.payment || "Pending"} />
                </td>

                <td>
                  {onUpdateStatus ? (
                    <select
                      className="order-status-select"
                      value={o.status || "Pending"}
                      onChange={(e) => onUpdateStatus(o.id, e.target.value)}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <StatusBadge status={o.status || "Pending"} />
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;