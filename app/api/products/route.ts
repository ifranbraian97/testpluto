import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createServerClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

  try {
    let query = supabase
      .from('products')
      .select(
        'id, name, price, image, category, slug, stock, created_at',
        { count: 'exact' }
      )
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (limit) {
      query = query.limit(limit)
    }

    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      count,
      total: count,
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerClient()
    const productData = await request.json()

    // Remove id if it's a new product (let Supabase generate it)
    const { id, ...dataWithoutId } = productData

    const { data: product, error } = await supabase
      .from('products')
      .insert([dataWithoutId])
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
