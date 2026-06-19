import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getRestaurant } from "../../services/restaurantService";
import "./Sidebar.css";

const links = [
  { to: "/", label: "Dashboard", icon: "▦" },
  { to: "/orders", label: "Orders", icon: "🧾" },
  { to: "/menu", label: "Menu Management", icon: "🍽" },
  { to: "/ads", label: "Ads & Offers", icon: "📢" },
  { to: "/analytics", label: "Analytics", icon: "📈" },
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/settings", label: "Restaurant Settings", icon: "⚙" },
  { to: "/profile", label: "Admin Profile", icon: "👤" },
];

function Sidebar({ open, onClose }) {
  const { location } = useRouterState();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    getRestaurant().then(setRestaurant);
  }, []);

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            {restaurant?.logo ? (
              <img
                src={restaurant.logo}
                alt="Logo"
                style={{
                  width: "34px",
                  height: "34px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ) : (
              "🍴"
            )}
          </div>

          <div>
            <div className="sidebar-brand-name">
              {restaurant?.name || "Restaurant"}
            </div>
            <div className="sidebar-brand-sub">Admin Panel</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map((l) => {
            const active = location.pathname === l.to;

            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={onClose}
                className={`sidebar-link ${
                  active ? "sidebar-link-active" : ""
                }`}
              >
                <span className="sidebar-icon">{l.icon}</span>
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-card">
            <div className="sidebar-footer-title">Need help?</div>
            <div className="sidebar-footer-sub">Check the documentation.</div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;