import { NextRequest, NextResponse } from 'next/server';
import { pessoasDb } from '@/lib/database/pessoasDb';
import { validateUpdatePessoa } from '@/lib/validation/pessoasValidator';
import { createErrorResponse } from '@/lib/api/response';

/**
 * GET /api/pessoas/:id
 * Get a single pessoa by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const pessoa = pessoasDb.read(id);
    if (!pessoa) {
      return NextResponse.json(
        createErrorResponse(404, 'Pessoa não encontrada'),
        { status: 404 }
      );
    }

    return NextResponse.json(pessoa, { status: 200 });
  } catch (error) {
    console.error('Error reading pessoa:', error);
    const message = error instanceof Error ? error.message : 'Erro ao buscar pessoa';
    return NextResponse.json(
      createErrorResponse(500, message),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/pessoas/:id
 * Update a pessoa
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if pessoa exists
    if (!pessoasDb.read(id)) {
      return NextResponse.json(
        createErrorResponse(404, 'Pessoa não encontrada'),
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = validateUpdatePessoa(body);
    if (!validation.valid) {
      return NextResponse.json(
        createErrorResponse(400, 'Validação falhou', validation.errors),
        { status: 400 }
      );
    }

    // Check for email conflict if email is being updated
    if (body.email && pessoasDb.emailExists(body.email, id)) {
      return NextResponse.json(
        createErrorResponse(409, 'Email já existe'),
        { status: 409 }
      );
    }

    // Update pessoa
    const pessoa = pessoasDb.update(id, body);

    return NextResponse.json(pessoa, { status: 200 });
  } catch (error) {
    console.error('Error updating pessoa:', error);
    const message = error instanceof Error ? error.message : 'Erro ao atualizar pessoa';
    return NextResponse.json(
      createErrorResponse(500, message),
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pessoas/:id
 * Delete a pessoa
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const deleted = pessoasDb.delete(id);
    if (!deleted) {
      return NextResponse.json(
        createErrorResponse(404, 'Pessoa não encontrada'),
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting pessoa:', error);
    const message = error instanceof Error ? error.message : 'Erro ao deletar pessoa';
    return NextResponse.json(
      createErrorResponse(500, message),
      { status: 500 }
    );
  }
}
