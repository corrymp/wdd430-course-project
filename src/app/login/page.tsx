"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { setAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save token & update auth state
      localStorage.setItem("token", data.token);
      setAuthenticated(true);

      alert("Login successful!");
      router.push("/"); // redirect after login
    } catch (err: unknown) {
      if(err instanceof Error) setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form">
        <h2>Login</h2>
        {error && <p className="auth-error">{error}</p>}
        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="auth-btn" onClick={handleLogin}>
          Login
        </button>
        <p>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
