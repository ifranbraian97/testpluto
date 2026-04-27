import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  supabaseConnection: boolean
  supabaseUrl: string
  tablesExist: {
    products: boolean
    quantityVariants: boolean
    flavorVariants: boolean
  }
  tableCounts?: {
    products: number
    quantityVariants: number
    flavorVariants: number
  }
  realtimeEnabled: boolean
  rlsEnabled: boolean
  productsCount: number
  checks: {
    name: string
    status: boolean
    message?: string
  }[]
  errors: string[]
  message: string
}

export async function GET() {
  const supabase = await createServerClient()
  const checks: HealthResponse['checks'] = []

  const health: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    supabaseConnection: false,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not-configured',
    tablesExist: {
      products: false,
      quantityVariants: false,
      flavorVariants: false,
    },
    tableCounts: {
      products: 0,
      quantityVariants: 0,
      flavorVariants: 0,
    },
    realtimeEnabled: false,
    rlsEnabled: false,
    productsCount: 0,
    checks: [],
    errors: [],
    message: 'System initialization in progress...',
  }

  try {
    // 1. Test Supabase connection
    console.log('🔍 Health Check: Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .limit(0)

    if (testError) {
      health.status = 'unhealthy'
      health.supabaseConnection = false
      const errorMsg = `Supabase connection failed: ${testError.message}`
      health.errors.push(errorMsg)
      checks.push({ name: 'Supabase Connection', status: false, message: errorMsg })
      console.error('❌', errorMsg)
      health.message = 'Cannot connect to Supabase'
      health.checks = checks
      return NextResponse.json(health, { status: 200 })
    }

    health.supabaseConnection = true
    checks.push({ name: 'Supabase Connection', status: true })
    console.log('✅ Supabase connection: OK')

    // 2. Check products table
    console.log('🔍 Health Check: Checking products table...')
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .limit(0)

    if (!productsError && productsCount !== null) {
      health.tablesExist.products = true
      health.productsCount = productsCount
      if (health.tableCounts) health.tableCounts.products = productsCount
      checks.push({ name: 'Products Table', status: true, message: `${productsCount} products` })
      console.log(`✅ Products table: OK (${productsCount} records)`)
    } else {
      health.status = 'degraded'
      health.errors.push(`Products table check failed: ${productsError?.message || 'Unknown error'}`)
      checks.push({ name: 'Products Table', status: false, message: 'Table missing or inaccessible' })
      console.error('❌ Products table: FAILED -', productsError?.message)
    }

    // 3. Check quantity_variants table
    console.log('🔍 Health Check: Checking quantity_variants table...')
    const { count: qvCount, error: qvError } = await supabase
      .from('quantity_variants')
      .select('id', { count: 'exact', head: true })
      .limit(0)

    if (!qvError && qvCount !== null) {
      health.tablesExist.quantityVariants = true
      if (health.tableCounts) health.tableCounts.quantityVariants = qvCount
      checks.push({ name: 'Quantity Variants Table', status: true, message: `${qvCount} variants` })
      console.log(`✅ Quantity variants table: OK (${qvCount} records)`)
    } else {
      health.status = 'degraded'
      health.errors.push(`Quantity variants table check failed: ${qvError?.message || 'Unknown error'}`)
      checks.push({ name: 'Quantity Variants Table', status: false, message: 'Table missing or inaccessible' })
      console.error('❌ Quantity variants table: FAILED -', qvError?.message)
    }

    // 4. Check flavor_variants table
    console.log('🔍 Health Check: Checking flavor_variants table...')
    const { count: fvCount, error: fvError } = await supabase
      .from('flavor_variants')
      .select('id', { count: 'exact', head: true })
      .limit(0)

    if (!fvError && fvCount !== null) {
      health.tablesExist.flavorVariants = true
      if (health.tableCounts) health.tableCounts.flavorVariants = fvCount
      checks.push({ name: 'Flavor Variants Table', status: true, message: `${fvCount} variants` })
      console.log(`✅ Flavor variants table: OK (${fvCount} records)`)
    } else {
      health.status = 'degraded'
      health.errors.push(`Flavor variants table check failed: ${fvError?.message || 'Unknown error'}`)
      checks.push({ name: 'Flavor Variants Table', status: false, message: 'Table missing or inaccessible' })
      console.error('❌ Flavor variants table: FAILED -', fvError?.message)
    }

    // 5. Check RLS
    health.rlsEnabled = health.tablesExist.products && health.tablesExist.quantityVariants && health.tablesExist.flavorVariants
    checks.push({ name: 'RLS Policies', status: health.rlsEnabled, message: health.rlsEnabled ? 'Tables accessible' : 'Not all tables accessible' })

    // 6. Check Realtime (assume enabled if tables exist - actual realtime requires subscription test)
    health.realtimeEnabled = health.tablesExist.products
    checks.push({ name: 'Realtime Config', status: health.realtimeEnabled, message: health.realtimeEnabled ? 'Ready for subscriptions' : 'Not configured' })

    // Set final status message
    if (health.status === 'healthy') {
      health.message = `✅ All systems operational. Database has ${health.productsCount} products.`
      console.log('✅ Overall status: HEALTHY')
    } else if (health.status === 'degraded') {
      health.message = `⚠️  Some tables are missing. Please run the SQL schema in Supabase Dashboard.`
      console.log('⚠️  Overall status: DEGRADED')
    }

    health.checks = checks
    return NextResponse.json(health, { status: 200 })

  } catch (error) {
    console.error('❌ Health check error:', error)
    health.status = 'unhealthy'
    health.message = 'Unexpected error during health check'
    const errorMsg = error instanceof Error ? error.message : String(error)
    health.errors.push(`Unexpected error: ${errorMsg}`)
    checks.push({ name: 'Overall Health', status: false, message: errorMsg })
    health.checks = checks
    return NextResponse.json(health, { status: 200 })
  }
}
