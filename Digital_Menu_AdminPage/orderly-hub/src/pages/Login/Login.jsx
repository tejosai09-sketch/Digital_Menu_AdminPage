import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { loginAdmin } from "../../services/authService";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const { error } = await loginAdmin(email, password);

    if (error) {
      alert(error.message);
      return;
    }

    navigate({ to: "/" });
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <div className="login-logo">🍽️</div>
        <h2>Admin Login</h2>
        <p>Login to manage your restaurant dashboard</p>

        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;