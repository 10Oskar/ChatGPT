'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { fetchOrder, fetchKpis } from '../../lib/api';

const fetcher = (confirmation: string) => fetchOrder(confirmation);

export default function SacDashboard() {
  const [confirmation, setConfirmation] = useState('OC-1001');
  const { data, mutate } = useSWR(confirmation, fetcher, { revalidateOnFocus: false });
  const { data: kpis } = useSWR('kpis', fetchKpis, { revalidateOnFocus: false });

  return (
    <div className="space-y-4">
      <div className="card space-y-2">
        <h2 className="text-lg font-semibold">Order Lookup</h2>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const value = formData.get('confirmation') as string;
            setConfirmation(value);
            mutate();
          }}
          className="flex gap-2"
        >
          <input
            name="confirmation"
            defaultValue={confirmation}
            className="flex-1 rounded bg-slate-900 border border-slate-700 px-3 py-2 text-slate-100"
            placeholder="Enter Order Confirmation #"
          />
          <button type="submit" className="px-4 py-2 rounded bg-sky-500 text-black font-semibold">
            Search
          </button>
        </form>
        {data?.order ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="card">
              <h3 className="font-semibold">Lifecycle</h3>
              <ul className="text-sm text-slate-300">
                <li>Status: {data.order.status}</li>
                <li>Customer: {data.order.customer?.name}</li>
                <li>Supplier: {data.order.supplier?.name}</li>
                <li>Perfect Order: {data.perfectOrder ? '✅ Ready' : '⚠️ Attention'}</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="font-semibold">Risks</h3>
              <ul className="text-sm text-slate-300">
                {data.alerts.length === 0 && <li>No active alerts</li>}
                {data.alerts.map((alert: any) => (
                  <li key={alert.id}>
                    {alert.type}: {alert.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Enter a confirmation number to view lifecycle data.</p>
        )}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">KPI Snapshot</h2>
        <div className="flex flex-wrap gap-4">
          {kpis?.readings?.map((reading: any) => (
            <div key={reading.id} className="card">
              <div className="text-xs uppercase tracking-wide text-slate-400">{reading.name}</div>
              <div className="text-2xl font-bold">{reading.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
