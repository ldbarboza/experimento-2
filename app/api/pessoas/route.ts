/**
 * API routes for Pessoa CRUD operations
 * POST /api/pessoas - Create a new person
 * GET /api/pessoas - List all people with pagination and search
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database/pessoasDb';
import { validateCreatePessoa } from '@/lib/validation/pessoasValidator';
import { CreatePessoaDTO, ErrorResponse } from '@/lib/types/pessoa';

/**
 * POST /api/pessoas
 * Create a new person
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validation = validateCreatePessoa(body as CreatePessoaDTO);
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

    // Create person
    const pessoa = db.create(body as CreatePessoaDTO);

    return NextResponse.json(pessoa, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar pessoa';

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
 * GET /api/pessoas
 * List all people with pagination and optional search
 * Query parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - search: string (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
    const search = searchParams.get('search') || undefined;

    const result = db.readAll(page, limit, search);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao listar pessoas';

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
