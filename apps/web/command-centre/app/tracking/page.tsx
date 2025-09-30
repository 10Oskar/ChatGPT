import { fetchOrder } from '../lib/api';

export const dynamic = 'force-dynamic';

export default async function TrackingPage({ searchParams }: { searchParams: { confirmation?: string } }) {
  const confirmation = searchParams.confirmation ?? 'OC-1001';
  const data = await fetchOrder(confirmation);
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Order {confirmation}</h2>
        <p className="text-sm text-slate-300">Current ETA and milestone history.</p>
      </div>
      <div className="card">
        <h3 className="font-semibold">Perfect Order Readiness</h3>
        <p className="text-sm text-slate-300">{data.perfectOrder ? 'All components ready for deployment' : 'Pending allocations'}</p>
      </div>
      <div className="card">
        <h3 className="font-semibold">Milestones</h3>
        <ol className="text-sm text-slate-300 space-y-1">
          {data.shipments.flatMap((shipment: any) =>
            shipment.events.map((event: any) => (
              <li key={event.id}>
                {event.status} — {event.location ?? 'Undisclosed'} at {new Date(event.occurredAt).toLocaleString()}
              </li>
            ))
          )}
        </ol>
      </div>
    </div>
  );
}
