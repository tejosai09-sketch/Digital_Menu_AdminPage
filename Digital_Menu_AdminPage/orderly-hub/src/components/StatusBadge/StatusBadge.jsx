import "./StatusBadge.css";

function StatusBadge({ status }) {
  const key = (status || "").toLowerCase().replace(/\s+/g, "-");
  return <span className={`status-badge status-${key}`}>{status}</span>;
}

export default StatusBadge;
