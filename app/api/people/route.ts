import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import { validatePerson } from '@/lib/validation/validators';
import { generateId } from '@/lib/utils/formatters';
import { Person } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10', 10)));
  const search = searchParams.get('search') || '';

  let people = store.getAll();
  if (search.trim()) {
    people = store.search(search);
  }

  people.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const total = people.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedPeople = people.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    data: paginatedPeople,
    pagination: { page, limit, total, totalPages },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = validatePerson(body);
  
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: 'Validation failed', data: validation.errors },
      { status: 400 }
    );
  }

  if (store.emailExists(body.email)) {
    return NextResponse.json(
      { success: false, error: 'Email already exists' },
      { status: 409 }
    );
  }

  const now = new Date().toISOString();
  const person: Person = {
    id: generateId(),
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone?.trim() || undefined,
    birthDate: body.birthDate || undefined,
    createdAt: now,
    updatedAt: now,
  };

  store.create(person);
  return NextResponse.json({ success: true, data: person }, { status: 201 });
}
