"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pufferfish from "@/components/public/Pufferfish";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin/dashboard";

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
        router.push(next);
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-lift">
      <div className="flex flex-col items-center text-center">
        <Pufferfish size={64} />
        <h1 className="mt-4 font-display text-2xl font-bold text-navy">BALLOONS Admin</h1>
        <p className="mt-1 text-sm text-ink/60">Sign in to manage your website.</p>
      </div>

      <div className="mt-8">
        <label htmlFor="pw" className="block text-sm font-semibold text-navy/80">
          Password
        </label>
        <input
          id="pw"
          type="password"
          value={password}
          autoFocus
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="mt-2 w-full rounded-xl border border-navy/15 px-4 py-3 text-navy outline-none transition-colors focus:border-scarlet"
          placeholder="••••••••"
        />
        {error && <p className="mt-3 text-sm font-medium text-scarlet-600">{error}</p>}

        <button onClick={submit} disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>

      <a href="/" className="mt-6 block text-center text-sm text-ink/50 transition-colors hover:text-navy">
        ← Back to website
      </a>
    </div>
  );
}
