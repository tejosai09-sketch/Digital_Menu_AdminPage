import "./CustomerTable.css";

function CustomerTable({ customers }) {
  return (
    <div className="customer-table-wrap">
      <table className="customer-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Phone</th>
            <th>Total Orders</th>
            <th>Total Spend</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 && (
            <tr><td colSpan={4} className="customer-empty">No customers found.</td></tr>
          )}
          {customers.map((c) => (
            <tr key={c.id}>
              <td>
                <div className="customer-cell">
                  <div className="customer-avatar">{c.name.charAt(0)}</div>
                  <div className="customer-name">{c.name}</div>
                </div>
              </td>
              <td>{c.phone}</td>
              <td>{c.orders}</td>
              <td>₹{c.spend.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerTable;
