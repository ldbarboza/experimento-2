import { NextRequest, NextResponse } from 'next/server';
import { pessoasDb } from '@/lib/database/pessoasDb';
import { validateCreatePessoa } from '@/lib/validation/pessoasValidator';
import { createErrorResponse } from '@/lib/api/response';

/**
 * POST /api/pessoas
 * Create a new pessoa
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = validateCreatePessoa(body);
    if (!validation.valid) {
      return NextResponse.json(
        createErrorResponse(400, 'Validação falhou', validation.errors),
        { status: 400 }
      );
    }

    // Check for duplicate email
    if (pessoasDb.emailExists(body.email)) {
      return NextResponse.json(
        createErrorResponse(409, 'Email já existe'),
        { status: 409 }
      );
    }

    // Create pessoa
    const pessoa = pessoasDb.create(body);

    return NextResponse.json(pessoa, { status: 201 });
  } catch (error) {
    console.error('Error creating pessoa:', error);
    const message = error instanceof Error ? error.message : 'Erro ao criar pessoa';
    return NextResponse.json(
      createErrorResponse(500, message),
      { status: 500 }
    );
  }
}

/**
 * GET /api/pessoas
 * List all pessoas with pagination and search
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const search = searchParams.get('search') || undefined;

    const result = pessoasDb.readAll(page, limit, search);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error listing pessoas:', error);
    const message = error instanceof Error ? error.message : 'Erro ao listar pessoas';
    return NextResponse.json(
      createErrorResponse(500, message),
      { status: 500 }
    );
  }
}
