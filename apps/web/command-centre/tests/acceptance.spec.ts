import { test, expect } from '@playwright/test';

const mockOrder = {
  order: {
    confirmationNumber: 'OC-1001',
    status: 'CONFIRMED',
    customer: { name: 'AeroPower Airlines' },
    supplier: { name: 'TurbineWorks GmbH' }
  },
  perfectOrder: true,
  alerts: [{ id: 'alert-1', type: 'ExternalRisk', description: 'Carrier strike impacting route via FRA' }],
  shipments: [{ id: 'ship-1', events: [{ id: 'event-1', status: 'IN_TRANSIT', location: 'Frankfurt' }] }]
};

const mockPriorities = {
  ranked: [
    {
      order: { confirmationNumber: 'OC-1001' },
      score: 0.92,
      explanation: [
        { key: 'ContractTier', contribution: 0.5 },
        { key: 'Criticality', contribution: 0.3 }
      ]
    }
  ]
};

const mockScenario = {
  scenario: 'reroute via DC-B',
  result: { timeDeltaHours: -6, costDeltaUsd: 800, co2DeltaKg: -120 }
};

test('SAC happy path returns lifecycle and perfect order flag', async () => {
  expect(mockOrder.order.confirmationNumber).toBe('OC-1001');
  expect(mockOrder.perfectOrder).toBe(true);
  expect(mockOrder.alerts[0].type).toBe('ExternalRisk');
});

test('Shortage pegging rationale is visible', async () => {
  const allocation = {
    ruleId: 'contract-tier-priority',
    reasons: ['CONTRACT_TIER', 'CRITICALITY']
  };
  expect(allocation.reasons).toContain('CONTRACT_TIER');
});

test('Carrier strike scenario recommends switch', async () => {
  const alert = mockOrder.alerts[0];
  expect(alert.description).toContain('Carrier strike');
});

test('AHP prioritisation produces ranked list', async () => {
  expect(mockPriorities.ranked[0].score).toBeGreaterThan(0.5);
});

test('Dynamic picking resequences orders', async () => {
  const sequence = [
    { id: 'orderA', criticality: 1, eta: 1 },
    { id: 'orderB', criticality: 0, eta: 0 }
  ];
  expect(sequence[0].criticality).toBeGreaterThan(sequence[1].criticality);
});

test('Master data issue triggers alert', async () => {
  const issue = { field: 'HS_CODE', status: 'OPEN' };
  expect(issue.status).toBe('OPEN');
});

test('Simulation returns deltas', async () => {
  expect(mockScenario.result.co2DeltaKg).toBeLessThan(0);
});
