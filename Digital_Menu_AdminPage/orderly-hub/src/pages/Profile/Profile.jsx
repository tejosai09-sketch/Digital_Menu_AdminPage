import { useState } from "react";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import "./Profile.css";

function Profile() {
  const [admin, setAdmin] = useState({ name: "Aman Verma", email: "admin@spiceroute.com" });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  return (
    <AdminLayout title="Admin Profile">
      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar">{admin.name.charAt(0)}</div>
          <button className="btn-ghost">Change Picture</button>
          <div className="profile-meta">
            <div className="profile-name">{admin.name}</div>
            <div className="profile-email">{admin.email}</div>
            <span className="profile-role">Administrator</span>
          </div>
        </div>

        <div className="profile-card profile-form">
          <h3>Account Details</h3>
          <label>Admin Name
            <input value={admin.name} onChange={(e) => setAdmin({ ...admin, name: e.target.value })} />
          </label>
          <label>Email
            <input value={admin.email} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} />
          </label>
          <div className="profile-actions"><button className="btn-primary">Save</button></div>

          <hr />

          <h3>Change Password</h3>
          <label>Current Password
            <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
          </label>
          <label>New Password
            <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
          </label>
          <label>Confirm New Password
            <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          </label>
          <div className="profile-actions"><button className="btn-primary">Update Password</button></div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Profile;
