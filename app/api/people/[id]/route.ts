import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';
import { validatePerson } from '@/lib/validation/validators';
import { Person } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const person = store.getById(params.id);
  
  if (!person) {
    return NextResponse.json(
      { success: false, error: 'Person not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: person });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const person = store.getById(params.id);
  
  if (!person) {
    return NextResponse.json(
      { success: false, error: 'Person not found' },
      { status: 404 }
    );
  }

  const body = await request.json();
  
  // Validate the update data
  const validation = validatePerson({ ...person, ...body });
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: 'Validation failed', data: validation.errors },
      { status: 400 }
    );
  }

  // Check for duplicate email if email is being changed
  if (body.email && body.email !== person.email && store.emailExists(body.email)) {
    return NextResponse.json(
      { success: false, error: 'Email already exists' },
      { status: 409 }
    );
  }

  const updates: Partial<Person> = {};
  if (body.name !== undefined) updates.name = body.name.trim();
  if (body.email !== undefined) updates.email = body.email.trim().toLowerCase();
  if (body.phone !== undefined) updates.phone = body.phone?.trim() || undefined;
  if (body.birthDate !== undefined) updates.birthDate = body.birthDate || undefined;

  const updated = store.update(params.id, updates);
  return NextResponse.json({ success: true, data: updated });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const person = store.getById(params.id);
  
  if (!person) {
    return NextResponse.json(
      { success: false, error: 'Person not found' },
      { status: 404 }
    );
  }

  store.delete(params.id);
  return NextResponse.json({ success: true }, { status: 204 });
}
