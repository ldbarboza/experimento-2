import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { validateCreatePessoa } from '@/lib/validation/pessoasValidator';
import { ErrorResponse, PaginatedResponse, Pessoa } from '@/lib/types/pessoa';

const createErrorResponse = (status: number, message: string, details?: Record<string, string>): ErrorResponse => {
  return {
    status,
    message,
    details,
    timestamp: new Date().toISOString(),
  };
};

/**
 * POST /api/pessoas
 * Create a new person
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationErrors = validateCreatePessoa(body);
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

    // Create person
    const result = db.create(body);

    // Check for database errors
    if ('code' in result) {
      if (result.code === 'DUPLICATE_EMAIL') {
        return NextResponse.json(
          createErrorResponse(409, result.message, { email: result.message }),
          { status: 409 }
        );
      }
      return NextResponse.json(
        createErrorResponse(500, 'Erro ao criar pessoa'),
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating pessoa:', error);
    return NextResponse.json(
      createErrorResponse(500, 'Erro interno do servidor'),
      { status: 500 }
    );
  }
}

/**
 * GET /api/pessoas
 * List all people with pagination and search
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const search = searchParams.get('search') || undefined;

    const result = db.readAll(page, limit, search);

    return NextResponse.json(result as PaginatedResponse<Pessoa>, { status: 200 });
  } catch (error) {
    console.error('Error listing pessoas:', error);
    return NextResponse.json(
      createErrorResponse(500, 'Erro interno do servidor'),
      { status: 500 }
    );
  }
}
