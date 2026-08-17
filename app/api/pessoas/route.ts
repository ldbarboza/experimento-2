import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/db';
import { validatePessoa } from '@/lib/validation';
import { ApiResponse, PaginatedResponse, Pessoa } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const ativo = searchParams.get('ativo');
    const search = searchParams.get('search') || undefined;

    const store = getStore();
    const filters: { ativo?: boolean; search?: string } = {};

    if (ativo !== null) {
      filters.ativo = ativo === 'true';
    }
    if (search) {
      filters.search = search;
    }

    const result = store.list(page, limit, filters);

    const response: ApiResponse<PaginatedResponse<Pessoa>> = {
      data: result,
      status: 'success',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const response: ApiResponse<null> = {
      error: 'Erro ao listar pessoas',
      status: 'error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const store = getStore();
    const validation = validatePessoa(body, {
      checkEmailUniqueness: (email, excludeId) => !store.emailExists(email, excludeId),
    });

    if (!validation.valid) {
      const response: ApiResponse<null> = {
        error: 'Validacao falhou',
        details: validation.errors,
        status: 'error',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const pessoa = store.create({
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      data_nascimento: body.data_nascimento,
      ativo: body.ativo !== false,
    });

    const response: ApiResponse<Pessoa> = {
      data: pessoa,
      status: 'success',
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const response: ApiResponse<null> = {
      error: 'Erro ao criar pessoa',
      status: 'error',
    };
    return NextResponse.json(response, { status: 500 });
  }
}
