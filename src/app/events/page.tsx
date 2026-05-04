import EventsClient from "@/app/events/EventsClient";
import { getRecentPhivolcsEvents } from "@/lib/phivolcs";

export const dynamic = "force-dynamic";

export default async function EventListPage() {
  const events = await getRecentPhivolcsEvents();

  return <EventsClient events={events} />;
}
