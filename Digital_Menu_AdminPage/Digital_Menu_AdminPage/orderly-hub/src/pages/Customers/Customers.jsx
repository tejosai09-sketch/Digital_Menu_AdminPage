import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import { getCustomers } from "../../services/customerService";
import "./Customers.css";

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers().then(setCustomers);
  }, []);

  return (
    <AdminLayout title="Customers">
      <div className="customers-card">
        <h2>Customer List</h2>

        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Total Orders</th>
              <th>Last Order</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" className="customers-empty">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c, index) => (
                <tr key={index}>
                  <td>{c.name || "Customer"}</td>
                  <td>{c.phone || "—"}</td>
                  <td>{c.address || "—"}</td>
                  <td>{c.total_orders}</td>
                  <td>{c.last_order_date || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default Customers;