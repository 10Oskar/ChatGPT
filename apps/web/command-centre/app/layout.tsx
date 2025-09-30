import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <header className="p-4 border-b border-slate-800">
          <h1 className="text-xl font-semibold">Surveillance Command Centre</h1>
        </header>
        <main className="p-6 space-y-6">{children}</main>
      </body>
    </html>
  );
}
