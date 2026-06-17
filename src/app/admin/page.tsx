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
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--char)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 360, background: "var(--bone)", borderRadius: 4, padding: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <span style={{ width: 56, height: 56, display: "inline-block" }}><Pufferfish /></span>
          <h1 style={{ marginTop: 14, fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>BALLOONS Admin</h1>
          <p style={{ marginTop: 4, fontSize: 14, color: "var(--ink-soft)" }}>Sign in to edit your site.</p>
        </div>
        <input
          type="password"
          value={password}
          autoFocus
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          style={{ marginTop: 24, width: "100%", padding: "12px 14px", border: "1.5px solid var(--hair)", borderRadius: 3, fontSize: 14, background: "#fff" }}
        />
        {error && <p style={{ marginTop: 10, fontSize: 13, color: "var(--accent)", fontWeight: 600 }}>{error}</p>}
        <button onClick={submit} disabled={loading} className="btn fill" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <a href="/" style={{ marginTop: 18, display: "block", textAlign: "center", fontSize: 13, color: "var(--ink-soft)" }}>← Back to site</a>
      </div>
    </main>
  );
}
