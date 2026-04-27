import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createServerClient()

  const result = {
    success: false,
    message: '',
    errors: [] as string[],
  }

  try {
    // Check if products table exists, if not create it
    const { error: checkError } = await supabase
      .from('products')
      .select('count', { count: 'exact', head: true })

    if (checkError && checkError.message.includes('not found')) {
      // Create products table
      const { error: createError } = await supabase
        .rpc('create_products_table')
        .single()

      if (createError) {
        // If RPC doesn't exist, we can't create via API
        result.errors.push('No es posible crear tablas desde la API. Por favor, ejecuta las migraciones manualmente en Supabase SQL Editor.')
        return NextResponse.json(result, { status: 400 })
      }

      result.message = 'Tabla products creada exitosamente'
      result.success = true
      return NextResponse.json(result, { status: 200 })
    }

    // Check if quantity_variants table exists
    const { error: qvError } = await supabase
      .from('quantity_variants')
      .select('count', { count: 'exact', head: true })

    if (qvError && qvError.message.includes('not found')) {
      result.errors.push('Tabla quantity_variants no existe. Ejecuta las migraciones en Supabase SQL Editor.')
      return NextResponse.json(result, { status: 400 })
    }

    // Check if flavor_variants table exists
    const { error: fvError } = await supabase
      .from('flavor_variants')
      .select('count', { count: 'exact', head: true })

    if (fvError && fvError.message.includes('not found')) {
      result.errors.push('Tabla flavor_variants no existe. Ejecuta las migraciones en Supabase SQL Editor.')
      return NextResponse.json(result, { status: 400 })
    }

    // All tables exist
    result.success = true
    result.message = 'Todas las tablas están creadas y listas'
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Error desconocido')
    return NextResponse.json(result, { status: 500 })
  }
}

export async function GET() {
  // GET handler for simple health check
  return NextResponse.json(
    {
      success: true,
      message: 'Usa POST para ejecutar migraciones',
    },
    { status: 200 }
  )
}
