'use client';

import useSWR from 'swr';
import { fetchAlerts } from '../lib/api';

export default function AlertsPage() {
  const { data, mutate } = useSWR('alerts', fetchAlerts, { refreshInterval: 30000 });

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Detect & Act Workboard</h2>
          <p className="text-sm text-slate-300">Live alerts with recommended playbooks and timers.</p>
        </div>
        <button onClick={() => mutate()} className="px-3 py-2 rounded bg-sky-500 text-black font-semibold">
          Refresh
        </button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {data?.map((alert: any) => (
          <div key={alert.id} className="card space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{alert.type}</h3>
              <span className="text-xs uppercase text-slate-400">{alert.severity}</span>
            </div>
            <p className="text-sm text-slate-300">{alert.description}</p>
            {alert.playbook && (
              <details className="bg-slate-900 rounded p-2">
                <summary className="cursor-pointer text-sm">Playbook: {alert.playbook.name}</summary>
                <ul className="mt-2 space-y-1 text-xs text-slate-400">
                  {alert.playbook.steps.map((step: any, index: number) => (
                    <li key={index}>
                      {step.description} · ETA {step.etaImpactHours}h · Cost ${step.costImpactUsd}
                    </li>
                  ))}
                </ul>
              </details>
            )}
            <button className="px-3 py-2 rounded bg-emerald-500 text-black font-semibold">Apply Action</button>
          </div>
        ))}
      </div>
    </div>
  );
}
