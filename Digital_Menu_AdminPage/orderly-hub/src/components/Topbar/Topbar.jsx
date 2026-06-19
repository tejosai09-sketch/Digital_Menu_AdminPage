import { useEffect, useState } from "react";
import { getRestaurant } from "../../services/restaurantService";
import "./Topbar.css";

function Topbar({ title, onMenuClick }) {
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    getRestaurant().then(setRestaurant);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuClick} aria-label="Open menu">
          ☰
        </button>

        <div>
          <h1 className="topbar-title">{title}</h1>
          <div className="topbar-sub">
            {restaurant?.name ? `${restaurant.name} Admin Panel` : "Welcome back, Admin"}
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <input className="topbar-search" placeholder="Search orders, customers..." />
        <button className="topbar-icon-btn" aria-label="Notifications">🔔</button>
        <div className="topbar-avatar">
          {restaurant?.name ? restaurant.name.charAt(0).toUpperCase() : "A"}
        </div>
      </div>
    </header>
  );
}

export default Topbar;