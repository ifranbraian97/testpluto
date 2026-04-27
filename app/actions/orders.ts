'use server'

import { createServerClient } from '@/lib/supabase/server'
import {
  Order,
  OrderDetail,
  OrdersPaginatedResponse,
  CreateOrderResponse,
  OrderStatus,
  PaymentStatus,
  CompanyConfig,
  OrderFilter,
  ApiOrderResponse,
  ApiOrderDetailResponse,
  ApiOrdersListResponse,
  ApiCreateOrderResponse,
  ApiResponse,
  Customer,
  OrderPayment,
} from '@/types/order'

// ============================================================================
// ÓRDENES - READ OPERATIONS
// ============================================================================

/**
 * Obtiene todas las órdenes con paginación, filtrado y búsqueda
 */
export async function getAllOrders(params: {
  limit?: number
  offset?: number
  status?: OrderStatus
  search?: string
  dateFrom?: string
  dateTo?: string
}): Promise<ApiOrdersListResponse> {
  try {
    const supabase = await createServerClient()
    const {
      limit = 10,
      offset = 0,
      status,
      search,
      dateFrom,
      dateTo,
    } = params

    // Build query with JOIN to get customer name
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        order_status,
        payment_status,
        subtotal,
        shipping_cost,
        discount,
        tax,
        total,
        shipping_method,
        customer_notes,
        created_at,
        updated_at,
        customers!inner(
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `, { count: 'exact' })
    
    // Apply filters
    if (status) {
      query = query.eq('order_status', status)
    }
    if (search) {
      query = query.or(`order_number.ilike.%${search}%`)
    }
    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }

    // Get total count
    const { count, error: countError } = await query
    
    if (countError) {
      console.error('Orders count error:', countError)
    }

    // Get paginated data
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Orders query error:', error)
      return {
        data: {
          data: [],
          totalCount: 0,
          page: Math.floor((offset || 0) / (limit || 10)) + 1,
          pageSize: limit || 10,
          totalPages: 0,
        },
        error: null,
      }
    }

    const formattedData = (data || []).map((order: any) => ({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.customers ? `${order.customers.first_name} ${order.customers.last_name}` : 'Cliente',
      customer_email: order.customers?.email || '',
      customer_phone: order.customers?.phone || '',
      total: order.total,
      order_status: order.order_status,
      payment_status: order.payment_status,
      created_at: order.created_at,
    }))

    return {
      data: {
        data: formattedData,
        totalCount: count || 0,
        page: Math.floor((offset || 0) / (limit || 10)) + 1,
        pageSize: limit || 10,
        totalPages: Math.ceil((count || 0) / (limit || 10)),
      },
      error: null,
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    return {
      data: {
        data: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      },
      error: error instanceof Error ? error.message : 'Error fetching orders',
    }
  }
}

/**
 * Obtiene detalles completos de una orden
 */
export async function getOrderDetail(
  orderId: number
): Promise<ApiOrderDetailResponse> {
  try {
    const supabase = await createServerClient()
    
    // Get order - sin JOIN complicado
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('Order not found error:', orderError)
      return {
        data: null,
        error: 'Order not found',
      }
    }

    // Get customer data separately
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('first_name, last_name, email, phone')
      .eq('id', order.customer_id)
      .single()

    if (customerError) {
      console.error('Error fetching customer:', customerError)
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (itemsError) {
      console.error('Error fetching order items:', itemsError)
    }

    // Get order payments
    const { data: payments, error: paymentsError } = await supabase
      .from('order_payments')
      .select('*')
      .eq('order_id', orderId)

    if (paymentsError) {
      console.error('Error fetching order payments:', paymentsError)
    }

    // Get customer info
    const customerName = customer ? `${customer.first_name} ${customer.last_name}` : 'Cliente'

    const result: OrderDetail = {
      order_id: order.id,
      order_number: order.order_number,
      order_status: order.order_status,
      payment_status: order.payment_status,
      customer_id: order.customer_id,
      customer_name: customerName,
      customer_email: customer?.email || '',
      customer_phone: customer?.phone || '',
      shipping_address: {
        street: order.shipping_address_street || '',
        city: order.shipping_address_city || '',
        state: order.shipping_address_state,
        country: order.shipping_address_country || '',
        postal_code: order.shipping_address_postal_code || '',
      },
      shipping_method: order.shipping_method || '',
      payment_method: order.payment_method,
      total: order.total,
      subtotal: order.subtotal || order.total,
      shipping_cost: order.shipping_cost || 0,
      tax: order.tax || 0,
      discount: order.discount || 0,
      items: items || [],
      payments: payments || [],
      created_at: order.created_at,
      admin_notes: order.admin_notes,
    }

    return {
      data: result,
      error: null,
    }
  } catch (error) {
    console.error('Error fetching order detail:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error fetching order',
    }
  }
}

/**
 * Obtiene detalles de una orden por número de orden
 */
export async function getOrderDetailByNumber(
  orderNumber: string
): Promise<ApiOrderDetailResponse> {
  try {
    const supabase = await createServerClient()
    
    console.log('[getOrderDetailByNumber] Buscando orden:', orderNumber)
    
    // Get order - sin usar inner join por si acaso hay problema con customers
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .single()

    console.log('[getOrderDetailByNumber] Orden encontrada:', { order, orderError })

    if (orderError || !order) {
      console.error('[getOrderDetailByNumber] Orden no encontrada:', orderError)
      return {
        data: null,
        error: 'Order not found',
      }
    }

    // Get customer data separately
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('first_name, last_name, email, phone')
      .eq('id', order.customer_id)
      .single()

    if (customerError) {
      console.error('[getOrderDetailByNumber] Error fetching customer:', customerError)
    }

    // Get order items
    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id)

    if (itemsError) {
      console.error('[getOrderDetailByNumber] Error fetching order items:', itemsError)
    }

    // Get order payments
    const { data: payments, error: paymentsError } = await supabase
      .from('order_payments')
      .select('*')
      .eq('order_id', order.id)

    if (paymentsError) {
      console.error('[getOrderDetailByNumber] Error fetching order payments:', paymentsError)
    }

    // Get customer info
    const customerName = customer ? `${customer.first_name} ${customer.last_name}` : 'Cliente'

    const result: OrderDetail = {
      order_id: order.id,
      order_number: order.order_number,
      order_status: order.order_status,
      payment_status: order.payment_status,
      customer_id: order.customer_id,
      customer_name: customerName,
      customer_email: customer?.email || '',
      customer_phone: customer?.phone || '',
      shipping_address: {
        street: order.shipping_address_street || '',
        city: order.shipping_address_city || '',
        state: order.shipping_address_state,
        country: order.shipping_address_country || '',
        postal_code: order.shipping_address_postal_code || '',
      },
      shipping_method: order.shipping_method || '',
      payment_method: order.payment_method,
      total: order.total,
      subtotal: order.subtotal || order.total,
      shipping_cost: order.shipping_cost || 0,
      tax: order.tax || 0,
      discount: order.discount || 0,
      items: items || [],
      payments: payments || [],
      created_at: order.created_at,
    }

    return {
      data: result,
      error: null,
    }
  } catch (error) {
    console.error('[getOrderDetailByNumber] Error:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error fetching order',
    }
  }
}

/**
 * Obtiene todas las órdenes de un cliente por email
 */
export async function getOrdersByCustomer(
  email: string
): Promise<ApiResponse<Order[]>> {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase.rpc(
      'get_orders_by_customer',
      { p_customer_email: email }
    )

    if (error) throw error

    return {
      data: data || [],
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error fetching customer orders',
    }
  }
}

// ============================================================================
// ÓRDENES - CREATE OPERATIONS
// ============================================================================

/**
 * Crea una orden desde el carrito - SIN RPC
 */
export async function createOrderFromCart(input: {
  customer_data: any
  cart_items: any[]
  shipping_method?: string
  payment_method?: string
  customer_notes?: string
}): Promise<ApiCreateOrderResponse> {
  console.log('[createOrderFromCart] Input:', JSON.stringify(input, null, 2))
  
  try {
    if (!input.customer_data || !input.cart_items || input.cart_items.length === 0) {
      return {
        data: null,
        error: 'Invalid order data',
      }
    }

    const supabase = await createServerClient()
    const { customer_data, cart_items, shipping_method, payment_method, customer_notes } = input

    console.log('[createOrderFromCart] Customer data:', customer_data)

    // 1. Buscar o crear cliente
    let customerId: number
    const { data: existingCustomer, error: searchError } = await supabase
      .from('customers')
      .select('id')
      .eq('email', customer_data.email)
      .single()

    console.log('[createOrderFromCart] Search customer result:', { existingCustomer, searchError })

    if (searchError && searchError.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('[createOrderFromCart] Error searching customer:', searchError)
    }

    if (existingCustomer) {
      customerId = existingCustomer.id
      console.log('[createOrderFromCart] Found existing customer:', customerId)
    } else {
      // Crear nuevo cliente
      console.log('[createOrderFromCart] Creating new customer...')
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          email: customer_data.email,
          phone: customer_data.phone,
          first_name: customer_data.first_name,
          last_name: customer_data.last_name,
          document_id: customer_data.document_id || null,
          address_street: customer_data.address_street || '',
          address_number: customer_data.address_number || '',
          address_complement: '',
          address_city: customer_data.address_city || '',
          address_state: customer_data.address_state || '',
          address_country: customer_data.address_country || 'Argentina',
          address_postal_code: customer_data.address_postal_code || '',
        }])
        .select()
        .single()

      console.log('[createOrderFromCart] Create customer result:', { newCustomer, customerError })

      if (customerError) {
        return { data: null, error: `Error creating customer: ${customerError.message}` }
      }
      customerId = newCustomer.id
    }

    // 2. Calcular totales
    // El envío se cobra aparte, no se suma al total
    // IMPORTANTE: Multiplicar por 100 porque se guarda en centavos en la BD
    const subtotal = cart_items.reduce((sum, item) => sum + (item.unit_price * item.quantity * 100), 0)
    const shippingCost = 0 // El envío se cobra aparte
    const total = subtotal // Solo productos

    console.log('[createOrderFromCart] Totals:', { subtotal, shippingCost, total })

    // 3. Generar número de orden
    const orderNumber = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Date.now().toString().slice(-5)}`

    // 4. Crear orden
    console.log('[createOrderFromCart] Creating order with customer_id:', customerId)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        order_number: orderNumber,
        customer_id: customerId,
        order_status: 'pending',
        payment_method: payment_method || null,
        payment_status: 'pending',
        subtotal,
        shipping_cost: shippingCost,
        discount: 0,
        tax: 0,
        total,
        shipping_address_street: customer_data.address_street || null,
        shipping_address_city: customer_data.address_city || null,
        shipping_address_state: customer_data.address_state || null,
        shipping_address_country: customer_data.address_country || null,
        shipping_address_postal_code: customer_data.address_postal_code || null,
        shipping_method: shipping_method || null,
        customer_notes: customer_notes || null,
      }])
      .select()
      .single()

    console.log('[createOrderFromCart] Create order result:', { order, orderError })

    if (orderError) {
      return { data: null, error: `Error creating order: ${orderError.message}` }
    }

    // 5. Crear items de la orden
    const orderItems = cart_items.map(item => {
      // Convertir product_id a número si es string
      let productId = item.product_id
      if (typeof item.product_id === 'string') {
        const parsed = parseInt(item.product_id, 10)
        if (!isNaN(parsed)) {
          productId = parsed
        }
      }
      
      // IMPORTANTE: Siempre NULL para product_variant_id
      // No estamos validando contra product_variants en el checkout
      // Solo guardamos el nombre de la variante como texto en variant_name
      
      return {
        order_id: order.id,
        product_id: productId,
        product_variant_id: null, // Siempre null - no validamos IDs de variantes en checkout
        product_name: item.name,
        product_sku: item.sku || null,
        variant_name: item.variant_name || null, // Guardamos el nombre como texto
        unit_price: item.unit_price * 100, // Multiplicar por 100: se guarda en centavos
        unit_price_offer: item.unit_price_offer ? item.unit_price_offer * 100 : null, // Multiplicar por 100
        discount_percentage: item.discount_percentage || null,
        quantity: item.quantity,
        line_subtotal: (item.unit_price * 100) * item.quantity, // Multiplicar precio por 100 y luego por cantidad
      }
    })

    console.log('[createOrderFromCart] Order items:', orderItems)

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    console.log('[createOrderFromCart] Create items result:', { itemsError })

    if (itemsError) {
      // Rollback: eliminar orden creada
      await supabase.from('orders').delete().eq('id', order.id)
      return { data: null, error: `Error creating order items: ${itemsError.message}` }
    }

    // 6. Enviar email con PDF (asíncrono, no bloquea)
    // Ejecutar en background sin esperar
    ;(async () => {
      try {
        // Importar dentro de la función para evitar problemas de importación circular
        const { sendOrderConfirmationEmail } = await import('@/lib/email-sender')
        
        // Obtener datos completos de la orden
        const { data: fullOrder } = await getOrderDetailByNumber(order.order_number)
        if (fullOrder) {
          const { data: config } = await getCompanyConfig()
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
          await sendOrderConfirmationEmail(
            fullOrder,
            baseUrl,
            config?.company_name || 'USA Import',
            config?.company_email || 'contacto@usaimport.com'
          )
        }
      } catch (emailError) {
        console.error('[createOrderFromCart] Error sending email:', emailError)
        // No lanzar error, solo logear
      }
    })()

    return {
      data: {
        order_id: order.id,
        order_number: order.order_number,
        total: order.total,
        message: 'Order created successfully',
      },
      error: null,
    }
  } catch (error) {
    console.error('[createOrderFromCart] Catch error:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error creating order',
    }
  }
}

// ============================================================================
// ÓRDENES - UPDATE OPERATIONS
// ============================================================================

/**
 * Actualiza el estado de una orden
 */
export async function updateOrderStatus(
  orderId: number,
  newStatus: OrderStatus,
  reason?: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase.rpc(
      'update_order_status',
      {
        p_order_id: orderId,
        p_new_status: newStatus,
        p_changed_by: 'admin',
        p_reason: reason || null,
      }
    )

    if (error) throw error

    if (!data || data.length === 0) {
      return {
        data: null,
        error: 'Error updating order status',
      }
    }

    const result = data[0]
    return {
      data: {
        success: result.success,
        message: result.message,
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error updating order status',
    }
  }
}

/**
 * Actualiza datos de una orden (notas admin, métodos de envío, etc.)
 */
export async function updateOrder(
  orderId: number,
  updates: {
    shipping_method?: string
    tracking_number?: string
    admin_notes?: string
    payment_method?: string
  }
): Promise<ApiOrderResponse> {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('orders')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error

    return {
      data,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error updating order',
    }
  }
}

/**
 * Actualiza el estado de pago de una orden
 */
export async function updateOrderPaymentStatus(
  orderId: number,
  paymentStatus: PaymentStatus
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return {
        data: null,
        error: 'Error updating payment status',
      }
    }

    return {
      data: {
        success: true,
        message: `Payment status updated to ${paymentStatus}`,
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error updating payment status',
    }
  }
}

// ============================================================================
// ÓRDENES - DELETE OPERATIONS
// ============================================================================

/**
 * Cancela una orden (soft delete - marca como cancelada)
 */
export async function cancelOrder(
  orderId: number,
  reason?: string
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  try {
    return await updateOrderStatus(
      orderId,
      OrderStatus.CANCELLED,
      reason
    ) as any
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error cancelling order',
    }
  }
}

// ============================================================================
// CONFIGURACIÓN DE EMPRESA
// ============================================================================

// Configuración por defecto
const DEFAULT_COMPANY_CONFIG: CompanyConfig = {
  id: 0,
  company_name: 'ORIGINAL USA IMPORT',
  company_legal_name: '',
  company_email: 'contacto@originalusaimport.com',
  company_phone: '',
  company_website: '',
  company_logo_url: undefined,
  address_street: '',
  address_city: '',
  address_state: '',
  address_country: 'Argentina',
  address_postal_code: '',
  tax_id: '',
  bank_info: '',
  return_policy: '',
  terms_conditions: '',
  payment_methods: [
    { name: 'Transferencia Bancaria', description: 'Transferencia bancaria directa' },
    { name: 'Efectivo', description: 'Pago en efectivo contra entrega' }
  ],
  currency_symbol: '$',
  currency_code: 'USD',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

/**
 * Obtiene la configuración de la empresa
 */
export async function getCompanyConfig(): Promise<ApiResponse<CompanyConfig>> {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('company_config')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (error) {
      // Si no existe, crear configuración por defecto
      if (error.code === 'PGRST116') {
        const { data: newConfig, error: insertError } = await supabase
          .from('company_config')
          .insert([DEFAULT_COMPANY_CONFIG])
          .select()
          .single()

        if (insertError) {
          console.error('Error creating default config:', insertError)
          // Devolver config por defecto en memoria
          return {
            data: DEFAULT_COMPANY_CONFIG,
            error: null,
          }
        }

        return {
          data: newConfig,
          error: null,
        }
      }
      throw error
    }

    return {
      data,
      error: null,
    }
  } catch (error) {
    // En caso de error, devolver config por defecto
    return {
      data: DEFAULT_COMPANY_CONFIG,
      error: null,
    }
  }
}

/**
 * Actualiza la configuración de la empresa
 */
export async function updateCompanyConfig(
  updates: Partial<CompanyConfig>
): Promise<ApiResponse<CompanyConfig>> {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('company_config')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('is_active', true)
      .select()
      .single()

    if (error) throw error

    return {
      data,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error updating company config',
    }
  }
}

// ============================================================================
// ESTADÍSTICAS DE ÓRDENES
// ============================================================================

/**
 * Obtiene estadísticas resumidas de órdenes
 */
export async function getOrdersStats(): Promise<
  ApiResponse<{
    totalOrders: number
    totalRevenue: number
    pendingOrders: number
    confirmedOrders: number
    averageOrderValue: number
  }>
> {
  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('orders')
      .select('id, total, order_status')

    if (error) throw error

    const stats = {
      totalOrders: data?.length || 0,
      totalRevenue: data?.reduce((sum: number, o: any) => sum + (o.total || 0), 0) || 0,
      pendingOrders: data?.filter((o: any) => o.order_status === 'pending').length || 0,
      confirmedOrders: data?.filter((o: any) => o.order_status === 'confirmed').length || 0,
      averageOrderValue:
        data && data.length > 0
          ? Math.round(data.reduce((sum: number, o: any) => sum + (o.total || 0), 0) / data.length)
          : 0,
    }

    return {
      data: stats,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error fetching orders stats',
    }
  }
}
