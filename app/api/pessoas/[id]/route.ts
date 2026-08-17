/**
 * API routes for individual Pessoa operations
 * GET /api/pessoas/[id] - Get a single person
 * PUT /api/pessoas/[id] - Update a person
 * DELETE /api/pessoas/[id] - Delete a person
 */

import { NextRequest, NextResponse } from 'next/server';
import { pessoasDb } from '@/lib/database/pessoasDb';
import { validateUpdatePessoa } from '@/lib/validation/pessoasValidator';
import { ErrorResponse } from '@/lib/types/pessoa';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/pessoas/[id]
 * Get a single person by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const pessoa = pessoasDb.read(id);
    if (!pessoa) {
      const errorResponse: ErrorResponse = {
        status: 404,
        message: `Pessoa com ID ${id} não encontrada`,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    return NextResponse.json(pessoa, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar pessoa';
    const errorResponse: ErrorResponse = {
      status: 500,
      message,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * PUT /api/pessoas/[id]
 * Update a person (partial update allowed)
 * Body: { nome?, email?, telefone?, dataNascimento? }
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check if person exists
    const pessoa = pessoasDb.read(id);
    if (!pessoa) {
      const errorResponse: ErrorResponse = {
        status: 404,
        message: `Pessoa com ID ${id} não encontrada`,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const body = await request.json();

    // Validate request body
    const validation = validateUpdatePessoa(body);
    if (!validation.valid) {
      const details: Record<string, string> = {};
      validation.errors.forEach((error) => {
        details[error.field] = error.message;
      });

      const errorResponse: ErrorResponse = {
        status: 400,
        message: 'Validação falhou',
        details,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // Check for email conflict if email is being updated
    if (body.email && body.email !== pessoa.email) {
      if (pessoasDb.emailExists(body.email, id)) {
        const errorResponse: ErrorResponse = {
          status: 409,
          message: 'Email já registrado',
          details: { email: `O email ${body.email} já está em uso` },
          timestamp: new Date().toISOString(),
        };
        return NextResponse.json(errorResponse, { status: 409 });
      }
    }

    // Update person
    const updated = pessoasDb.update(id, body);

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar pessoa';

    // Check if it's a not found error
    if (message.includes('não encontrada')) {
      const errorResponse: ErrorResponse = {
        status: 404,
        message,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Check if it's a duplicate email error
    if (message.includes('já está registrado')) {
      const errorResponse: ErrorResponse = {
        status: 409,
        message: 'Email já registrado',
        details: { email: message },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 409 });
    }

    const errorResponse: ErrorResponse = {
      status: 500,
      message,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * DELETE /api/pessoas/[id]
 * Delete a person
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // Check if person exists
    const pessoa = pessoasDb.read(id);
    if (!pessoa) {
      const errorResponse: ErrorResponse = {
        status: 404,
        message: `Pessoa com ID ${id} não encontrada`,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Delete person
    pessoasDb.delete(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao deletar pessoa';

    // Check if it's a not found error
    if (message.includes('não encontrada')) {
      const errorResponse: ErrorResponse = {
        status: 404,
        message,
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const errorResponse: ErrorResponse = {
      status: 500,
      message,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
