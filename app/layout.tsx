import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gerenciamento de Pessoas',
  description: 'CRUD de pessoas com Next.js e banco em memória',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <nav className="bg-gray-800 text-white py-4">
          <div className="max-w-6xl mx-auto px-4">
            <a href="/pessoas" className="text-xl font-bold hover:text-gray-300">
              Gerenciamento de Pessoas
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
