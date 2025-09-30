'use client';

import useSWR from 'swr';
import { fetchPriorities, fetchAlerts } from '../../lib/api';

export default function SupplyDashboard() {
  const { data: priorities } = useSWR('supply-priorities', () => fetchPriorities('supply'));
  const { data: alerts } = useSWR('alerts', fetchAlerts);

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Backlog Hot List</h2>
        <ol className="mt-3 space-y-2 text-sm text-slate-300">
          {priorities?.ranked?.slice(0, 5).map((item: any) => (
            <li key={item.order.id} className="card">
              <div className="font-semibold">{item.order.confirmationNumber}</div>
              <div>Score: {item.score.toFixed(2)}</div>
              <details>
                <summary>Explanation</summary>
                <ul>
                  {item.explanation.map((entry: any) => (
                    <li key={entry.key}>
                      {entry.key}: {entry.contribution.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ol>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Active Alerts</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          {alerts?.map((alert: any) => (
            <li key={alert.id} className="card">
              <div className="font-semibold">{alert.type}</div>
              <div>{alert.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
