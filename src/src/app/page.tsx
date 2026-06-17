import { loadData } from "@/lib/store";
import { isAuthenticated } from "@/lib/guard";
import Site from "@/components/site/Site";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await loadData();
  const canEdit = await isAuthenticated();
  return <Site data={data} canEdit={canEdit} />;
}
