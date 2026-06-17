import { loadData } from "@/lib/store";
import { isCloudConfigured } from "@/lib/store";
import Dashboard from "@/components/admin/Dashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard · BALLOONS", robots: { index: false, follow: false } };

export default async function DashboardPage() {
  const data = await loadData();
  const cloud = isCloudConfigured();
  return <Dashboard initialData={data} cloud={cloud} />;
}
