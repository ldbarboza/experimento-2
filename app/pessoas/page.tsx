import PessoasList from '@/components/PessoasList';

export const metadata = {
  title: 'Pessoas - CRUD',
  description: 'Gerenciar pessoas',
};

export default function PessoasPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gerenciar Pessoas</h1>
        <PessoasList />
      </div>
    </main>
  );
}
