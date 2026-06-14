import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Admin · BALLOONS", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-6">
      <Suspense fallback={<div className="text-sm font-semibold text-white/70">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
