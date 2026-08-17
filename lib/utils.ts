import { NextResponse } from 'next/server'

/**
 * Create a success response
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status })
}

/**
 * Create an error response
 */
export function errorResponse(
  error: string,
  status: number = 400,
  details?: Record<string, unknown>
) {
  const response: Record<string, unknown> = { error }
  if (details) {
    response.details = details
  }
  return NextResponse.json(response, { status })
}

/**
 * Parse pagination parameters from query string
 */
export function parsePaginationParams(
  searchParams: Record<string, string | string[] | undefined>
): { page: number; limit: number } {
  const page = Math.max(1, parseInt(String(searchParams.page || '1'), 10) || 1)
  const limit = Math.max(1, Math.min(100, parseInt(String(searchParams.limit || '10'), 10) || 10))

  return { page, limit }
}

/**
 * Paginate an array
 */
export function paginate<T>(
  items: T[],
  page: number,
  limit: number
): { data: T[]; total: number; pages: number } {
  const total = items.length
  const pages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  const end = start + limit
  const data = items.slice(start, end)

  return { data, total, pages }
}
