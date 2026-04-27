/**
 * TIPOS PARA EL SISTEMA DE ÓRDENES/PEDIDOS
 * Incluye: Orders, Items, Payments, Customers, Company Config
 */

// ============================================================================
// ENUMS Y CONSTANTES
// ============================================================================

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'Transferencia Bancaria',
  MERCADO_PAGO = 'Mercado Pago',
  CASH_ON_DELIVERY = 'Contra Entrega',
}

// ============================================================================
// INTERFACES: CONFIGURACIÓN DE EMPRESA
// ============================================================================

export interface CompanyConfig {
  id: number
  company_name: string
  company_legal_name?: string
  company_email: string
  company_phone?: string
  company_website?: string
  company_logo_url?: string
  address_street?: string
  address_city?: string
  address_state?: string
  address_country?: string
  address_postal_code?: string
  tax_id?: string
  bank_info?: string
  return_policy?: string
  terms_conditions?: string
  payment_methods: PaymentMethodConfig[]
  currency_symbol: string
  currency_code: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PaymentMethodConfig {
  name: string
  description: string
}

// ============================================================================
// INTERFACES: CLIENTE
// ============================================================================

export interface Customer {
  id: number
  email: string
  phone: string
  first_name: string
  last_name: string
  document_id?: string
  address_street: string
  address_number?: string
  address_complement?: string
  address_city: string
  address_state?: string
  address_country: string
  address_postal_code: string
  preferred_contact_method: 'email' | 'phone' | 'whatsapp'
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CustomerCreateInput {
  email: string
  phone: string
  first_name: string
  last_name: string
  document_id?: string
  address_street: string
  address_number?: string
  address_complement?: string
  address_city: string
  address_state?: string
  address_country?: string
  address_postal_code: string
  preferred_contact_method?: 'email' | 'phone' | 'whatsapp'
  notes?: string
}

// ============================================================================
// INTERFACES: ITEMS DE ORDEN
// ============================================================================

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_variant_id?: number
  product_name: string
  product_sku?: string
  variant_name?: string
  unit_price: number
  unit_price_offer?: number
  discount_percentage?: number
  quantity: number
  line_subtotal: number
  created_at: string
  updated_at: string
}

export interface OrderItemCreateInput {
  product_id: number
  product_variant_id?: number
  product_name: string
  product_sku?: string
  variant_name?: string
  unit_price: number
  unit_price_offer?: number
  discount_percentage?: number
  quantity: number
}

// ============================================================================
// INTERFACES: PAGOS DE ORDEN
// ============================================================================

export interface OrderPayment {
  id: number
  order_id: number
  payment_method: string
  payment_status: PaymentStatus
  amount: number
  transaction_id?: string
  transaction_date: string
  transaction_details?: Record<string, any>
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderPaymentCreateInput {
  payment_method: string
  payment_status: PaymentStatus
  amount: number
  transaction_id?: string
  transaction_details?: Record<string, any>
  notes?: string
}

// ============================================================================
// INTERFACES: HISTORIAL DE ESTADOS
// ============================================================================

export interface OrderStatusHistory {
  id: number
  order_id: number
  old_status?: string
  new_status: string
  changed_by: string
  change_reason?: string
  admin_notes?: string
  created_at: string
}

// ============================================================================
// INTERFACES: ORDEN PRINCIPAL
// ============================================================================

export interface Order {
  id: number
  order_number: string
  customer_id: number
  order_status: OrderStatus
  payment_method?: string
  payment_status: PaymentStatus
  subtotal: number
  shipping_cost: number
  discount: number
  tax: number
  total: number
  shipping_address_street?: string
  shipping_address_city?: string
  shipping_address_state?: string
  shipping_address_country?: string
  shipping_address_postal_code?: string
  shipping_method?: string
  tracking_number?: string
  customer_notes?: string
  admin_notes?: string
  created_at: string
  confirmed_at?: string
  shipped_at?: string
  delivered_at?: string
  updated_at: string
}

export interface OrderCreateInput {
  customer_id: number
  order_status?: OrderStatus
  payment_method?: string
  payment_status?: PaymentStatus
  subtotal: number
  shipping_cost?: number
  discount?: number
  tax?: number
  total: number
  shipping_address_street?: string
  shipping_address_city?: string
  shipping_address_state?: string
  shipping_address_country?: string
  shipping_address_postal_code?: string
  shipping_method?: string
  customer_notes?: string
}

export interface OrderUpdateInput {
  order_status?: OrderStatus
  payment_status?: PaymentStatus
  payment_method?: string
  shipping_method?: string
  tracking_number?: string
  admin_notes?: string
  discount?: number
  tax?: number
}

// ============================================================================
// INTERFACES: ORDEN CON DETALLES COMPLETOS
// ============================================================================

export interface OrderDetail {
  order_id: number
  order_number: string
  order_status: OrderStatus
  payment_status: PaymentStatus
  customer_id: number
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_document_id?: string
  shipping_address: {
    street: string
    city: string
    state?: string
    country: string
    postal_code: string
  }
  subtotal: number
  shipping_cost: number
  discount: number
  tax: number
  total: number
  payment_method?: string
  shipping_method?: string
  tracking_number?: string
  customer_notes?: string
  admin_notes?: string
  items: OrderItem[]
  payments: OrderPayment[]
  created_at: string
}

// ============================================================================
// INTERFACES: PAGINACIÓN
// ============================================================================

export interface OrdersPaginatedResponse {
  data: OrderSummary[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface OrderSummary {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  order_status: OrderStatus
  payment_status: PaymentStatus
  total: number
  created_at: string
}

// ============================================================================
// INTERFACES: CARRITO PARA CREAR ORDEN
// ============================================================================

export interface CartItemForOrder {
  product_id: number
  product_variant_id?: number
  product_name: string
  product_sku?: string
  variant_name?: string
  unit_price: number
  unit_price_offer?: number
  discount_percentage?: number
  quantity: number
}

export interface CreateOrderFromCartInput {
  customer_data: CustomerCreateInput
  cart_items: CartItemForOrder[]
  shipping_method?: string
  payment_method?: string
  customer_notes?: string
}

// ============================================================================
// INTERFACES: RESPUESTA DE CREAR ORDEN
// ============================================================================

export interface CreateOrderResponse {
  order_id: number
  order_number: string
  total: number
  message: string
}

// ============================================================================
// TIPOS PARA BUSQUEDA Y FILTRADO
// ============================================================================

export interface OrderFilter {
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  search?: string
  dateFrom?: Date
  dateTo?: Date
}

// ============================================================================
// TIPOS PARA RESPUESTAS API
// ============================================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface ApiOrderResponse extends ApiResponse<Order> {}

export interface ApiOrderDetailResponse extends ApiResponse<OrderDetail> {}

export interface ApiOrdersListResponse extends ApiResponse<OrdersPaginatedResponse> {}

export interface ApiCreateOrderResponse extends ApiResponse<CreateOrderResponse> {}

export interface OrdersPaginationParams {
  limit?: number
  offset?: number
  status?: OrderStatus
  search?: string
  dateFrom?: string
  dateTo?: string
}

// ============================================================================
// TIPOS PARA RESPUESTAS DE API
// ============================================================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface ApiOrderResponse extends ApiResponse<Order> {}
export interface ApiOrderDetailResponse extends ApiResponse<OrderDetail> {}
export interface ApiOrdersListResponse extends ApiResponse<OrdersPaginatedResponse> {}
export interface ApiCreateOrderResponse extends ApiResponse<CreateOrderResponse> {}
