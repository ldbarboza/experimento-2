import Link from 'next/link';
import PessoaForm from '@/components/PessoaForm';

export const metadata = {
  title: 'Nova Pessoa - CRUD',
  description: 'Criar nova pessoa',
};

export default function NovaPessoaPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/pessoas" className="text-blue-600 hover:text-blue-800">
            ← Voltar para lista
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Criar Nova Pessoa</h1>
        <PessoaForm />
      </div>
    </main>
  );
}
