import PessoasList from '@/components/PessoasList';

async function deletePessoa(id: string) {
  'use server';

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/pessoas/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar pessoa');
    }
  } catch (error) {
    console.error('Error deleting pessoa:', error);
    throw error;
  }
}

export default function PessoasPage() {
  return <PessoasList onDelete={deletePessoa} />;
}
