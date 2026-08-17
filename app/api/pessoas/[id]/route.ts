import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { validateUpdatePessoa } from '@/lib/validation/pessoasValidator';
import { ErrorResponse, Pessoa } from '@/lib/types/pessoa';

const createErrorResponse = (status: number, message: string, details?: Record<string, string>): ErrorResponse => {
  return {
    status,
    message,
    details,
    timestamp: new Date().toISOString(),
  };
};

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
        createErrorResponse(404, 'Pessoa não encontrada'),
        { status: 404 }
      );
    }

    return NextResponse.json(pessoa, { status: 200 });
  } catch (error) {
    console.error('Error reading pessoa:', error);
    return NextResponse.json(
      createErrorResponse(500, 'Erro interno do servidor'),
      { status: 500 }
    );
  }
}

/**
 * PUT /api/pessoas/:id
 * Update a person
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate input
    const validationErrors = validateUpdatePessoa(body);
    if (validationErrors.length > 0) {
      const details: Record<string, string> = {};
      validationErrors.forEach((error) => {
        details[error.field] = error.message;
      });

      return NextResponse.json(
        createErrorResponse(400, 'Validação falhou', details),
        { status: 400 }
      );
    }

    // Update person
    const result = db.update(id, body);

    if (result === null) {
      return NextResponse.json(
        createErrorResponse(404, 'Pessoa não encontrada'),
        { status: 404 }
      );
    }

    // Check for database errors
    if ('code' in result) {
      if (result.code === 'DUPLICATE_EMAIL') {
        return NextResponse.json(
          createErrorResponse(409, result.message, { email: result.message }),
          { status: 409 }
        );
      }
      return NextResponse.json(
        createErrorResponse(500, 'Erro ao atualizar pessoa'),
        { status: 500 }
      );
    }

    return NextResponse.json(result as Pessoa, { status: 200 });
  } catch (error) {
    console.error('Error updating pessoa:', error);
    return NextResponse.json(
      createErrorResponse(500, 'Erro interno do servidor'),
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
    const deleted = db.delete(id);

    if (!deleted) {
      return NextResponse.json(
        createErrorResponse(404, 'Pessoa não encontrada'),
        { status: 404 }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting pessoa:', error);
    return NextResponse.json(
      createErrorResponse(500, 'Erro interno do servidor'),
      { status: 500 }
    );
  }
}
