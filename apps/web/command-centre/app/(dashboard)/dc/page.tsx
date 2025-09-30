'use client';

import useSWR from 'swr';

const fetcher = () =>
  fetch((process.env.NEXT_PUBLIC_WMS_URL ?? 'http://localhost:3002') + '/resequence/AMS-DC').then((res) => res.json());

export default function DcDashboard() {
  const { data } = useSWR('dc-sequence', fetcher);
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Dynamic Pick Queue</h2>
        <ol className="mt-3 space-y-2 text-sm text-slate-300">
          {data?.sequence?.map((item: any, index: number) => (
            <li key={item.id} className="card flex justify-between">
              <span>#{index + 1} — {item.id}</span>
              <span>Criticality: {item.criticality}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold">Cut-off Radar</h2>
        <p className="text-sm text-slate-300">Next carrier departure in 4h 20m. Adjust wave releases accordingly.</p>
      </div>
    </div>
  );
}
