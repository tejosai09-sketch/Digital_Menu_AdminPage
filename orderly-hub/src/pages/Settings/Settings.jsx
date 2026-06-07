import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import {
  getRestaurant,
  updateRestaurant,
} from "../../services/restaurantService";
import "./Settings.css";

function Settings() {
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    phone1: "",
    phone2: "",
    address: "",
    logo: "",
    whatsapp_number: "",
    theme_color: "#ff7a00",
    order_mode: "table",
  });

  const [loading, setLoading] = useState(true);

  const update = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  useEffect(() => {
    getRestaurant().then((data) => {
      if (data) {
        setForm({
          name: data.name || "",
          tagline: data.tagline || "",
          phone1: data.phone1 || "",
          phone2: data.phone2 || "",
          address: data.address || "",
          logo: data.logo || "",
          whatsapp_number: data.whatsapp_number || "",
          theme_color: data.theme_color || "#ff7a00",
          order_mode: data.order_mode || "table",
        });
      }

      setLoading(false);
    });
  }, []);

  const saveSettings = async () => {
    const result = await updateRestaurant(form);

    if (result?.success) {
      alert("Restaurant settings saved successfully!");
    } else {
      alert("Failed to save settings.");
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Restaurant Settings">
        <div>Loading settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Restaurant Settings">
      <div className="settings-card">
        <h2>General Information</h2>

        <div className="settings-logo-row">
          <div className="settings-logo">
            {form.logo ? (
              <img
                src={form.logo}
                alt="Restaurant Logo"
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            ) : (
              "🍴"
            )}
          </div>

          <div>
            <label>Logo URL</label>
            <input
              value={form.logo}
              onChange={(e) => update("logo", e.target.value)}
              placeholder="/logo.png or image URL"
            />
            <div className="settings-hint">
              Paste image URL for now. Upload option can be added later.
            </div>
          </div>
        </div>

        <div className="settings-grid">
          <label>
            Restaurant Name
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
          </label>

          <label>
            Tagline
            <input
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
            />
          </label>

          <label>
            Phone Number
            <input
              value={form.phone1}
              onChange={(e) => update("phone1", e.target.value)}
            />
          </label>

          <label>
            Secondary Phone
            <input
              value={form.phone2}
              onChange={(e) => update("phone2", e.target.value)}
            />
          </label>

          <label>
            WhatsApp Number
            <input
              value={form.whatsapp_number}
              onChange={(e) => update("whatsapp_number", e.target.value)}
            />
          </label>

          <label>
            Theme Color
            <input
              type="color"
              value={form.theme_color}
              onChange={(e) => update("theme_color", e.target.value)}
            />
          </label>

          <label>
            Order Mode
            <select
              value={form.order_mode}
              onChange={(e) => update("order_mode", e.target.value)}
            >
              <option value="table">Table Only</option>
              <option value="delivery">Delivery Only</option>
              <option value="both">Table + Delivery</option>
            </select>
          </label>

          <label className="settings-full">
            Address
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
            />
          </label>
        </div>

        <div className="settings-actions">
          <button className="btn-primary" onClick={saveSettings}>
            Save Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Settings;