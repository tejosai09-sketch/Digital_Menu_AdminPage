import { useEffect, useState } from "react";
import StatusBadge from "../StatusBadge/StatusBadge";
import { getRestaurant } from "../../services/restaurantService";
import { generateBill } from "../../utils/generateBill";
import "./OrderTable.css";

const STATUSES = ["Pending", "Accepted", "Preparing", "Ready", "Delivered", "Cancelled"];

function OrderTable({ orders = [], compact = false, onUpdateStatus, onMarkPaid }) {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    getRestaurant().then(setRestaurant);
  }, []);

  const getPaymentBadge = (o) => {
    if (o.paymentMethod === "online") {
      return o.paymentStatus === "paid" ? "Online - Paid" : "Online - Pending";
    }

    if (o.paymentMethod === "cash_on_delivery") {
      return o.paymentStatus === "paid" ? "Cash on Delivery - Paid" : "Cash on Delivery";
    }

    return o.paymentStatus === "paid" ? "Pay to Bearer - Paid" : "Pay to Bearer";
  };

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
            orders.map((o) => {
              const latLngFromAddress =
                typeof o.address === "string"
                  ? o.address.match(/Lat:\s*([0-9.-]+),\s*Lng:\s*([0-9.-]+)/)
                  : null;

              const finalLat = o.deliveryLatitude || latLngFromAddress?.[1];
              const finalLng = o.deliveryLongitude || latLngFromAddress?.[2];
              const hasLocation = finalLat && finalLng;

              const isPaid = o.paymentStatus === "paid";
              const canMarkPaid =
                !isPaid &&
                (o.paymentMethod === "cash_on_delivery" ||
                  o.paymentMethod === "pay_to_bearer");

              return (
                <tr key={o.id}>
                  <td className="order-id">#{o.id}</td>
                  <td>{o.customer || "Guest"}</td>
                  {!compact && <td>{o.phone || "—"}</td>}
                  {!compact && <td>{o.table || o.tableNumber || "—"}</td>}

                  {!compact && (
                    <td className="order-address">
                      {hasLocation ? (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${finalLat},${finalLng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="navigate-btn"
                        >
                          🧭 Navigate
                        </a>
                      ) : (
                        <div>{o.address || "—"}</div>
                      )}
                    </td>
                  )}

                  <td className="order-items">
                    {Array.isArray(o.items) && o.items.length > 0
                      ? o.items.map((item, index) => (
                          <div key={index}>
                            {item.name || "Item"} x{item.quantity || item.qty || 1}
                          </div>
                        ))
                      : "No items"}
                  </td>

                  <td>₹{Number(o.total || o.totalAmount || 0)}</td>
                  <td className="order-time">{o.time || "—"}</td>

                  <td>
                    <div className="payment-cell">
                      <StatusBadge status={getPaymentBadge(o)} />

                      {canMarkPaid && onMarkPaid && (
                        <button
                          className="mark-paid-btn"
                          onClick={() => onMarkPaid(o.id)}
                        >
                          Mark Paid
                        </button>
                      )}

                      {isPaid && (
                        <button
                          className="print-bill-btn"
                          onClick={() => generateBill(o, restaurant)}
                        >
                          Print Bill
                        </button>
                      )}
                    </div>
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
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;