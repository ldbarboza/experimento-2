import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { validatePessoa } from '@/lib/validation';
import { ApiResponse, Pessoa } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const store = getStore();
    const pessoa = store.getById(params.id);

    if (!pessoa) {
      const response: ApiResponse<null> = {
        error: 'Pessoa nao encontrada',
        status: 'error',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<Pessoa> = {
      data: pessoa,
      status: 'success',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      error: 'Erro ao buscar pessoa',
      status: 'error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const store = getStore();

    const pessoa = store.getById(params.id);
    if (!pessoa) {
      const response: ApiResponse<null> = {
        error: 'Pessoa nao encontrada',
        status: 'error',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const validation = validatePessoa(
      { ...pessoa, ...body },
      {
        checkEmailUniqueness: (email, excludeId) =>
          !store.emailExists(email, excludeId || params.id),
      }
    );

    if (!validation.valid) {
      const response: ApiResponse<null> = {
        error: 'Validacao falhou',
        details: validation.errors,
        status: 'error',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const updated = store.update(params.id, body);

    const response: ApiResponse<Pessoa> = {
      data: updated || undefined,
      status: 'success',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      error: 'Erro ao atualizar pessoa',
      status: 'error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const store = getStore();
    const pessoa = store.getById(params.id);

    if (!pessoa) {
      const response: ApiResponse<null> = {
        error: 'Pessoa nao encontrada',
        status: 'error',
      };
      return NextResponse.json(response, { status: 404 });
    }

    store.delete(params.id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const response: ApiResponse<null> = {
      error: 'Erro ao deletar pessoa',
      status: 'error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
