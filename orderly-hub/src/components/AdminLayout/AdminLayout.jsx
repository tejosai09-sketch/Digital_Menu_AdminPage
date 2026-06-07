import { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import { getOrders } from "../../services/orderService";
import "../../styles/admin.css";
import "./AdminLayout.css";

function AdminLayout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const latestOrderIdRef = useRef(null);

  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.volume = 1;
    audio.play().catch((error) => console.log("Sound play failed:", error));
  };

  const checkNewOrders = async () => {
    const data = await getOrders();
    const activeOrders = data.filter(
      (o) => o.status !== "Delivered" && o.status !== "Cancelled"
    );

    const latestOrder = activeOrders[0];

    if (latestOrder) {
      const latestId = Number(latestOrder.id);

      if (
        latestOrderIdRef.current !== null &&
        latestId > latestOrderIdRef.current
      ) {
        setNewOrderAlert(latestOrder);
        playNotificationSound();
        setTimeout(() => setNewOrderAlert(null), 5000);
      }

      latestOrderIdRef.current = latestId;
    }
  };

  useEffect(() => {
    checkNewOrders();
    const interval = setInterval(checkNewOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-layout">
      {newOrderAlert && (
        <div className="new-order-toast">
          <div className="new-order-icon">🔔</div>
          <div>
            <h3>New Order Received</h3>
            <p>Table: {newOrderAlert.table || newOrderAlert.tableNumber}</p>

            <div className="new-order-items">
              {newOrderAlert.items?.map((item, index) => (
                <div key={index}>
                  {item.name} x{item.quantity}
                </div>
              ))}
            </div>

            <strong>₹{newOrderAlert.total || newOrderAlert.totalAmount}</strong>
            <span>Just Now</span>
          </div>
        </div>
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="admin-main">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;