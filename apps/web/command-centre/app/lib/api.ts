const API_BASE = process.env.NEXT_PUBLIC_CC_CORE_URL ?? 'http://localhost:3000';

export const fetchOrder = async (confirmation: string) => {
  const res = await fetch(`${API_BASE}/orders/${confirmation}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to load order');
  }
  return res.json();
};

export const fetchAlerts = async () => {
  const res = await fetch(`${API_BASE}/alerts/active`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
};

export const fetchKpis = async () => {
  const res = await fetch(`${API_BASE}/kpis`, { cache: 'no-store' });
  if (!res.ok) return { readings: [], composite: 0 };
  return res.json();
};

export const fetchPriorities = async (role: string) => {
  const res = await fetch((process.env.NEXT_PUBLIC_PRIO_URL ?? 'http://localhost:3001') + `/priorities/${role}`, {
    cache: 'no-store'
  });
  if (!res.ok) return { ranked: [] };
  return res.json();
};
