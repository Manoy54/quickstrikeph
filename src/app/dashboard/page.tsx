import DashboardClient from "@/app/dashboard/DashboardClient";
import { getRecentPhivolcsEvents } from "@/lib/phivolcs";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const [{ event }, events] = await Promise.all([
    searchParams,
    getRecentPhivolcsEvents(),
  ]);

  return <DashboardClient events={events} selectedEventId={event ?? null} />;
}
