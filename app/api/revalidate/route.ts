/**
 * On-demand revalidation endpoint
 * Llamar desde admin cuando hace cambios para limpiar ISR cache
 * POST /api/revalidate?secret=<token>&path=/
 */

import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Validar token secret
  const secret = request.nextUrl.searchParams.get('secret');
  const path = request.nextUrl.searchParams.get('path') || '/';

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    );
  }

  try {
    revalidatePath(path);
    return NextResponse.json(
      { revalidated: true, path },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Revalidation failed', details: (err as Error).message },
      { status: 500 }
    );
  }
}

