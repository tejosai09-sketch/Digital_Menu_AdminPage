import "./StatCard.css";

function StatCard({ label, value, hint, icon, accent }) {
  return (
    <div className={`stat-card ${accent ? "stat-card-accent" : ""}`}>
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {hint && <div className="stat-card-hint">{hint}</div>}
    </div>
  );
}

export default StatCard;
