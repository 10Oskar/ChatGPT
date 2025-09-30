import Link from 'next/link';

const cards = [
  { href: '/alerts', title: 'Global Detect & Act', description: 'Resolve alerts, apply playbooks, and manage timers.' },
  { href: '/(dashboard)/sac', title: 'SAC Dashboard', description: 'Search orders, view readiness, notify customers.' },
  { href: '/(dashboard)/supply', title: 'Supply Network Specialist', description: 'Backlog heat map and pegging view.' },
  { href: '/(dashboard)/dc', title: 'DC Operations', description: 'Live wave status and dynamic pick queue.' },
  { href: '/sandbox', title: 'Simulation Sandbox', description: 'Test what-if scenarios before promotion.' },
  { href: '/tracking', title: 'Customer Tracking', description: 'Provide public milestone view with safe data.' }
];

export default function HomePage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => (
        <Link key={card.href} href={card.href} className="card block transition hover:border-sky-500">
          <h2 className="text-lg font-semibold mb-2">{card.title}</h2>
          <p className="text-sm text-slate-300">{card.description}</p>
        </Link>
      ))}
    </div>
  );
}
