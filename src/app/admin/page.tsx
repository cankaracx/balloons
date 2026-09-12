"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Pufferfish from "@/components/site/Pufferfish";

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
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span style={{ width: 48, height: 48, display: "inline-block" }}>
            <Pufferfish />
          </span>
        </div>
        <h1>BALLOONS Admin</h1>
        <p className="lead">Sign in to edit the site.</p>
        <label className="sr-only" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          autoFocus
          placeholder="Password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {error && <p className="admin-err">{error}</p>}
        <button onClick={submit} disabled={loading} className="btn fill" style={{ marginTop: 16, width: "100%" }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" className="admin-back">
          Back to site
        </a>
      </div>
    </main>
  );
}
