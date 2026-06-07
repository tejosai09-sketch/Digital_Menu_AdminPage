import "./MenuTable.css";

function MenuTable({ items, onEdit, onDelete, onToggleAvailability }) {
  return (
    <div className="menu-table-wrap">
      <table className="menu-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr><td colSpan={8} className="menu-table-empty">No products yet.</td></tr>
          )}
          {items.map((p) => (
            <tr key={p.id}>
              <td>
                <img className="menu-thumb" src={p.image} alt={p.name} />
              </td>
              <td className="menu-name">{p.name}</td>
              <td>{p.category}</td>
              <td className="menu-desc">{p.description}</td>
              <td>₹{p.price}</td>
              <td>
                <span className={`menu-type-dot ${p.type === "Veg" ? "veg" : "nonveg"}`}>
                  ● {p.type}
                </span>
              </td>
<td>
  <button
    className={`menu-avail-toggle ${p.available ? "on" : "off"}`}
    onClick={() => onToggleAvailability(p)}
  >
    {p.available ? "Available ✅" : "Out of Stock ❌"}
  </button>
</td>
              <td>
                <div className="menu-actions">
                  <button className="btn-ghost" onClick={() => onEdit(p)}>Edit</button>
                  <button className="btn-danger" onClick={() => onDelete(p.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MenuTable;
