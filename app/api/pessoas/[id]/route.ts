/**
 * API routes for individual Pessoa operations
 * GET /api/pessoas/:id - Get a single person
 * PUT /api/pessoas/:id - Update a person
 * DELETE /api/pessoas/:id - Delete a person
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/pessoasDb';
import { validateUpdatePessoa } from '@/lib/validation/pessoasValidator';
import { UpdatePessoaDTO, ErrorResponse } from '@/lib/types/pessoa';

/**
 * GET /api/pessoas/:id
 * Get a single person by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const pessoa = db.read(id);
    if (!pessoa) {
      return NextResponse.json(
        {
          status: 404,
          message: `Pessoa com ID ${id} não encontrada`,
          timestamp: new Date().toISOString(),
        } as ErrorResponse,
        { status: 404 }
      );
    }

    return NextResponse.json(pessoa, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar pessoa';

    return NextResponse.json(
      {
        status: 500,
        message: message,
        timestamp: new Date().toISOString(),
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

/**
 * PUT /api/pessoas/:id
 * Update a person (partial update allowed)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if person exists
    const existingPessoa = db.read(id);
    if (!existingPessoa) {
      return NextResponse.json(
        {
          status: 404,
          message: `Pessoa com ID ${id} não encontrada`,
          timestamp: new Date().toISOString(),
        } as ErrorResponse,
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validation = validateUpdatePessoa(body as UpdatePessoaDTO);
    if (!validation.valid) {
      return NextResponse.json(
        {
          status: 400,
          message: 'Validação falhou',
          details: validation.errors,
          timestamp: new Date().toISOString(),
        } as ErrorResponse,
        { status: 400 }
      );
    }

    // Update person
    const pessoa = db.update(id, body as UpdatePessoaDTO);

    return NextResponse.json(pessoa, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar pessoa';

    // Check for duplicate email error
    if (message.includes('já está registrado')) {
      return NextResponse.json(
        {
          status: 409,
          message: message,
          timestamp: new Date().toISOString(),
        } as ErrorResponse,
        { status: 409 }
      );
    }

    // Check for not found error
    if (message.includes('não encontrada')) {
      return NextResponse.json(
        {
          status: 404,
          message: message,
          timestamp: new Date().toISOString(),
        } as ErrorResponse,
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 500,
        message: message,
        timestamp: new Date().toISOString(),
      } as ErrorResponse,
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/pessoas/:id
 * Delete a person
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if person exists
    const pessoa = db.read(id);
    if (!pessoa) {
      return NextResponse.json(
        {
          status: 404,
          message: `Pessoa com ID ${id} não encontrada`,
          timestamp: new Date().toISOString(),
        } as ErrorResponse,
        { status: 404 }
      );
    }

    // Delete person
    db.delete(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao deletar pessoa';

    // Check for not found error
    if (message.includes('não encontrada')) {
      return NextResponse.json(
        {
          status: 404,
          message: message,
          timestamp: new Date().toISOString(),
        } as ErrorResponse,
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: 500,
        message: message,
        timestamp: new Date().toISOString(),
      } as ErrorResponse,
      { status: 500 }
    );
  }
}
