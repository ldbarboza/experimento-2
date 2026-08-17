import Link from 'next/link';

export default function Home() {
  return (
    <div className="home">
      <h1>Bem-vindo ao CRUD de Pessoas</h1>
      <p>Sistema de gerenciamento de pessoas com Next.js e banco de dados em memória.</p>
      <div className="home-actions">
        <Link href="/pessoas" className="btn btn-primary">
          Ir para Pessoas
        </Link>
      </div>
    </div>
  );
}
