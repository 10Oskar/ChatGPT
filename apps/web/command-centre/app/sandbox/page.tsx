import { runScenario } from '@sdt/simulation';

const scenarios = [
  {
    id: 'reroute-dc-b',
    name: 'Reroute via DC-B',
    parameters: {
      route: 'AMS-DC -> FRA-HUB -> JFK',
      safetyStockDelta: 3,
      sourcingSplit: 0.7,
      carrier: 'GreenWings',
      dcBypass: false,
      expedite: true
    }
  },
  {
    id: 'direct-flight',
    name: 'Direct Charter',
    parameters: {
      route: 'AMS-DC -> JFK',
      safetyStockDelta: -2,
      sourcingSplit: 0.5,
      carrier: 'SkyFreight',
      dcBypass: true,
      expedite: true
    }
  }
];

export default function SandboxPage() {
  const results = scenarios.map((scenario) => ({
    scenario,
    result: runScenario(scenario as any)
  }));

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">What-if Simulation</h2>
        <p className="text-sm text-slate-300">Review time, cost, and CO₂ deltas before promoting a plan.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {results.map(({ scenario, result }) => (
          <div key={scenario.id} className="card space-y-2">
            <h3 className="font-semibold">{scenario.name}</h3>
            <ul className="text-sm text-slate-300">
              <li>Time Δ: {result.timeDeltaHours}h</li>
              <li>Cost Δ: ${result.costDeltaUsd}</li>
              <li>CO₂ Δ: {result.co2DeltaKg}kg</li>
              <li>Risk Δ: {result.riskDelta}</li>
            </ul>
            <button className="px-3 py-2 rounded bg-slate-800 text-slate-200">Promote Scenario (manual)</button>
          </div>
        ))}
      </div>
    </div>
  );
}
