/**
 * API routes for Pessoa CRUD operations
 * GET /api/pessoas - List all people with pagination and search
 * POST /api/pessoas - Create a new person
 */

import { NextRequest, NextResponse } from 'next/server';
import { pessoasDb } from '@/lib/database/pessoasDb';
import { validateCreatePessoa } from '@/lib/validation/pessoasValidator';
import { ErrorResponse } from '@/lib/types/pessoa';

/**
 * GET /api/pessoas
 * List all people with pagination and optional search
 * Query params: page (default: 1), limit (default: 10), search (optional)
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
    const message = error instanceof Error ? error.message : 'Erro ao listar pessoas';
    const errorResponse: ErrorResponse = {
      status: 500,
      message,
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * POST /api/pessoas
 * Create a new person
 * Body: { nome, email, telefone?, dataNascimento? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = validateCreatePessoa(body);
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

    // Check for duplicate email
    if (pessoasDb.emailExists(body.email)) {
      const errorResponse: ErrorResponse = {
        status: 409,
        message: 'Email já registrado',
        details: { email: `O email ${body.email} já está em uso` },
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorResponse, { status: 409 });
    }

    // Create person
    const pessoa = pessoasDb.create(body);

    return NextResponse.json(pessoa, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar pessoa';

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
