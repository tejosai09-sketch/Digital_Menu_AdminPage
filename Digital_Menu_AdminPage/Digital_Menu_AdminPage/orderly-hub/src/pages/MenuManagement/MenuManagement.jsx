import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import MenuTable from "../../components/MenuTable/MenuTable";
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from "../../services/menuService";
import "./MenuManagement.css";

const empty = {
  id: null, name: "", category: "", description: "",
  price: "", type: "Veg", available: true,
  image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200",
};

function MenuManagement() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null); // form state or null

  // Helper function to pull latest items from MySQL database
  const fetchMenuData = () => {
    getMenu().then((data) => {
      if (Array.isArray(data)) {
        setItems(data);
      }
    });
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const openAdd = () => setModal({ ...empty });
  const openEdit = (p) => setModal({ ...p });
  const close = () => setModal(null);

  const save = async () => {
    if (!modal.name || !modal.category || !modal.price) return;

    if (modal.id) {
      // 1. Update existing item in MySQL
      await updateMenuItem(modal.id, modal);
    } else {
      // 2. Create new item in MySQL
      await addMenuItem(modal);
    }

    // Refresh UI with real database values and close modal
    fetchMenuData();
    close();
  };

  const remove = async (id) => {
    if (confirm("Delete this product?")) {
      // Delete from MySQL backend
      await deleteMenuItem(id);
      // Refresh UI list
      fetchMenuData();
    }
  };
  const toggleAvailability = async (item) => {
  const updatedItem = {
    ...item,
    available: !item.available,
  };

  await updateMenuItem(item.id, updatedItem);

  fetchMenuData();
};

  return (
    <AdminLayout title="Menu Management">
      <div className="menu-head">
        <div>
          <div className="menu-head-title">{items.length} Products</div>
          <div className="menu-head-sub">Manage your restaurant menu</div>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
      </div>

      <MenuTable
  items={items}
  onEdit={openEdit}
  onDelete={remove}
  onToggleAvailability={toggleAvailability}
/>

      {modal && (
        <div className="modal-backdrop" onClick={close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{modal.id ? "Edit Product" : "Add Product"}</h3>
              <button className="modal-close" onClick={close}>×</button>
            </div>
            <div className="modal-body">
              <label>Product Image URL
                <input value={modal.image || ""} onChange={(e) => setModal({ ...modal, image: e.target.value })} />
              </label>
              <label>Product Name
                <input value={modal.name} onChange={(e) => setModal({ ...modal, name: e.target.value })} />
              </label>
              <div className="modal-row">
                <label>Category
                  <input value={modal.category} onChange={(e) => setModal({ ...modal, category: e.target.value })} />
                </label>
                <label>Price (₹)
                  <input type="number" value={modal.price} onChange={(e) => setModal({ ...modal, price: Number(e.target.value) })} />
                </label>
              </div>
              <label>Description
                <textarea rows={3} value={modal.description || ""} onChange={(e) => setModal({ ...modal, description: e.target.value })} />
              </label>
              <div className="modal-row">
                <label>Type
                  <select value={modal.type} onChange={(e) => setModal({ ...modal, type: e.target.value })}>
                    <option>Veg</option>
                    <option>Non-Veg</option>
                  </select>
                </label>
                <label>Availability
                  <select value={String(modal.available)} onChange={(e) => setModal({ ...modal, available: e.target.value === "true" })}>
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-ghost" onClick={close}>Cancel</button>
              <button className="btn-primary" onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default MenuManagement;