import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'CRUD de Pessoas',
  description: 'Sistema de gerenciamento de pessoas com Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="header">
          <div className="container">
            <h1>CRUD de Pessoas</h1>
            <nav>
              <a href="/pessoas">Pessoas</a>
            </nav>
          </div>
        </header>
        <main className="main">
          <div className="container">{children}</div>
        </main>
        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 CRUD de Pessoas. Todos os direitos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
