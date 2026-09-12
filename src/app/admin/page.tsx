"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push("/");
        router.refresh();
      } else setError(data.error || "Login failed");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin">
      <form
        className="admin-card"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <h1>Edit the site</h1>
        <p className="lead">BALLOONS admin</p>
        <label htmlFor="admin-password">Password</label>
        <input
          id="admin-password"
          type="password"
          value={password}
          autoFocus
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="admin-err">{error}</p>}
        <button type="submit" disabled={loading} className="btn">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" className="admin-back">
          Back to the site
        </a>
      </form>
    </main>
  );
}
