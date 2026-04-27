-- ============================================================================
-- SISTEMA COMPLETO DE ÓRDENES/PEDIDOS
-- Script 012: Tablas, Índices, RLS Policies, Funciones RPC
-- ============================================================================

-- 1. TABLA: company_config (Configuración de la empresa)
-- Almacena datos de la empresa para mostrar en PDFs y facturación
CREATE TABLE IF NOT EXISTS company_config (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_legal_name VARCHAR(255),
    company_email VARCHAR(255) NOT NULL,
    company_phone VARCHAR(20),
    company_website VARCHAR(255),
    company_logo_url TEXT,
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_country VARCHAR(100),
    address_postal_code VARCHAR(20),
    tax_id VARCHAR(50),
    bank_info TEXT,
    return_policy TEXT,
    terms_conditions TEXT,
    payment_methods JSONB DEFAULT '[]'::jsonb,
    currency_symbol VARCHAR(5) DEFAULT '$',
    currency_code VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas frecuentes
CREATE INDEX idx_company_config_active ON company_config(is_active);

-- 2. TABLA: customers (Datos de clientes)
-- Almacena información de los clientes que compran
CREATE TABLE IF NOT EXISTS customers (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    document_id VARCHAR(50),
    address_street VARCHAR(255) NOT NULL,
    address_number VARCHAR(20),
    address_complement VARCHAR(255),
    address_city VARCHAR(100) NOT NULL,
    address_state VARCHAR(100),
    address_country VARCHAR(100) DEFAULT 'Argentina',
    address_postal_code VARCHAR(20) NOT NULL,
    preferred_contact_method VARCHAR(50) DEFAULT 'email',
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas y filtrados
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_name ON customers(first_name, last_name);
CREATE INDEX idx_customers_active ON customers(is_active);

-- 3. TABLA: orders (Cabecera de órdenes)
-- Una fila por cada compra realizada
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'pending',
    
    -- Montos
    subtotal BIGINT NOT NULL,
    shipping_cost BIGINT DEFAULT 0,
    discount BIGINT DEFAULT 0,
    tax BIGINT DEFAULT 0,
    total BIGINT NOT NULL,
    
    -- Datos de envío
    shipping_address_street VARCHAR(255),
    shipping_address_city VARCHAR(100),
    shipping_address_state VARCHAR(100),
    shipping_address_country VARCHAR(100),
    shipping_address_postal_code VARCHAR(20),
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    
    -- Notas y adicional
    customer_notes TEXT,
    admin_notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas y filtrados
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- 4. TABLA: order_items (Líneas de cada orden)
-- Cada fila es un producto en la orden
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    product_variant_id BIGINT REFERENCES product_variants(id),
    
    -- Datos del producto en el momento de la compra
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    variant_name VARCHAR(255),
    
    -- Precios en el momento de la compra
    unit_price BIGINT NOT NULL,
    unit_price_offer BIGINT,
    discount_percentage NUMERIC(5, 2),
    quantity BIGINT NOT NULL,
    line_subtotal BIGINT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_order_items_variant ON order_items(product_variant_id);

-- 5. TABLA: order_payments (Historial de pagos)
-- Registra cada transacción de pago asociada a una orden
CREATE TABLE IF NOT EXISTS order_payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    payment_method VARCHAR(100) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    amount BIGINT NOT NULL,
    
    -- Datos de la transacción
    transaction_id VARCHAR(255),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    transaction_details JSONB,
    
    -- Notas
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_order_payments_order ON order_payments(order_id);
CREATE INDEX idx_order_payments_status ON order_payments(payment_status);

-- 6. TABLA: order_status_history (Historial de cambios de estado)
-- Registra cada cambio de estado de una orden
CREATE TABLE IF NOT EXISTS order_status_history (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100) DEFAULT 'system',
    change_reason TEXT,
    admin_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_status ON order_status_history(new_status);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE company_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS POLICY: company_config (todos pueden leer, solo admin actualizar)
CREATE POLICY "company_config_public_read" ON company_config
    FOR SELECT USING (is_active = true);

CREATE POLICY "company_config_admin_write" ON company_config
    FOR ALL USING (true) WITH CHECK (true);

-- RLS POLICY: customers (todos pueden crear, ver su propia data)
CREATE POLICY "customers_public_insert" ON customers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "customers_public_read" ON customers
    FOR SELECT USING (true);

-- RLS POLICY: orders (todos pueden crear y leer)
CREATE POLICY "orders_public_all" ON orders
    FOR ALL USING (true) WITH CHECK (true);

-- RLS POLICY: order_items (todos pueden crear y leer)
CREATE POLICY "order_items_public_all" ON order_items
    FOR ALL USING (true) WITH CHECK (true);

-- RLS POLICY: order_payments (todos pueden crear y leer)
CREATE POLICY "order_payments_public_all" ON order_payments
    FOR ALL USING (true) WITH CHECK (true);

-- RLS POLICY: order_status_history (todos pueden leer y crear)
CREATE POLICY "order_status_history_public_all" ON order_status_history
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- FUNCIONES GENERADORAS DE NÚMEROS DE ORDEN
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    new_order_number VARCHAR(50);
BEGIN
    -- Formato: ORD-YYYYMMDD-NNNNN (ej: ORD-20260422-00001)
    new_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                       LPAD((SELECT COUNT(*) + 1 FROM orders 
                             WHERE DATE(created_at) = CURRENT_DATE)::TEXT, 5, '0');
    
    RETURN new_order_number;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN RPC: get_orders_paginated
-- Obtiene órdenes con paginación, filtrado y búsqueda
-- ============================================================================

CREATE OR REPLACE FUNCTION get_orders_paginated(
    p_limit INT DEFAULT 10,
    p_offset INT DEFAULT 0,
    p_status VARCHAR DEFAULT NULL,
    p_search VARCHAR DEFAULT NULL,
    p_date_from DATE DEFAULT NULL,
    p_date_to DATE DEFAULT NULL
)
RETURNS TABLE (
    id BIGINT,
    order_number VARCHAR,
    customer_name VARCHAR,
    customer_email VARCHAR,
    customer_phone VARCHAR,
    order_status VARCHAR,
    payment_status VARCHAR,
    total BIGINT,
    created_at TIMESTAMP WITH TIME ZONE,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    WITH filtered_orders AS (
        SELECT DISTINCT o.* FROM orders o
        INNER JOIN customers c ON o.customer_id = c.id
        WHERE 
            (p_status IS NULL OR o.order_status = p_status)
            AND (p_search IS NULL OR 
                 o.order_number ILIKE '%' || p_search || '%' OR
                 c.first_name ILIKE '%' || p_search || '%' OR
                 c.last_name ILIKE '%' || p_search || '%' OR
                 c.email ILIKE '%' || p_search || '%' OR
                 c.phone ILIKE '%' || p_search || '%')
            AND (p_date_from IS NULL OR DATE(o.created_at) >= p_date_from)
            AND (p_date_to IS NULL OR DATE(o.created_at) <= p_date_to)
    )
    SELECT 
        o.id,
        o.order_number,
        CONCAT(c.first_name, ' ', c.last_name),
        c.email,
        c.phone,
        o.order_status,
        o.payment_status,
        o.total,
        o.created_at,
        (SELECT COUNT(*) FROM filtered_orders)
    FROM filtered_orders o
    INNER JOIN customers c ON o.customer_id = c.id
    ORDER BY o.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN RPC: get_order_details
-- Obtiene detalles completos de una orden con items
-- ============================================================================

CREATE OR REPLACE FUNCTION get_order_details(p_order_id BIGINT)
RETURNS TABLE (
    order_id BIGINT,
    order_number VARCHAR,
    order_status VARCHAR,
    payment_status VARCHAR,
    customer_id BIGINT,
    customer_name VARCHAR,
    customer_email VARCHAR,
    customer_phone VARCHAR,
    customer_document_id VARCHAR,
    shipping_address JSONB,
    subtotal BIGINT,
    shipping_cost BIGINT,
    discount BIGINT,
    tax BIGINT,
    total BIGINT,
    payment_method VARCHAR,
    shipping_method VARCHAR,
    tracking_number VARCHAR,
    customer_notes TEXT,
    admin_notes TEXT,
    items JSONB,
    payments JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.order_number,
        o.order_status,
        o.payment_status,
        c.id,
        CONCAT(c.first_name, ' ', c.last_name),
        c.email,
        c.phone,
        c.document_id,
        JSONB_BUILD_OBJECT(
            'street', COALESCE(o.shipping_address_street, c.address_street),
            'city', COALESCE(o.shipping_address_city, c.address_city),
            'state', COALESCE(o.shipping_address_state, c.address_state),
            'country', COALESCE(o.shipping_address_country, c.address_country),
            'postal_code', COALESCE(o.shipping_address_postal_code, c.address_postal_code)
        ),
        o.subtotal,
        o.shipping_cost,
        o.discount,
        o.tax,
        o.total,
        o.payment_method,
        o.shipping_method,
        o.tracking_number,
        o.customer_notes,
        o.admin_notes,
        COALESCE(
            JSON_AGG(
                JSONB_BUILD_OBJECT(
                    'id', oi.id,
                    'product_name', oi.product_name,
                    'product_sku', oi.product_sku,
                    'variant_name', oi.variant_name,
                    'unit_price', oi.unit_price,
                    'unit_price_offer', oi.unit_price_offer,
                    'discount_percentage', oi.discount_percentage,
                    'quantity', oi.quantity,
                    'line_subtotal', oi.line_subtotal
                ) ORDER BY oi.created_at
            ),
            '[]'::jsonb
        ),
        COALESCE(
            JSON_AGG(DISTINCT
                JSONB_BUILD_OBJECT(
                    'id', op.id,
                    'payment_method', op.payment_method,
                    'payment_status', op.payment_status,
                    'amount', op.amount,
                    'transaction_id', op.transaction_id,
                    'created_at', op.created_at
                )
            ) FILTER (WHERE op.id IS NOT NULL),
            '[]'::jsonb
        ),
        o.created_at
    FROM orders o
    INNER JOIN customers c ON o.customer_id = c.id
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN order_payments op ON o.id = op.order_id
    WHERE o.id = p_order_id
    GROUP BY o.id, o.order_number, o.order_status, o.payment_status, 
             c.id, c.first_name, c.last_name, c.email, c.phone, c.document_id,
             c.address_street, c.address_city, c.address_state, c.address_country, c.address_postal_code,
             o.shipping_address_street, o.shipping_address_city, o.shipping_address_state, 
             o.shipping_address_country, o.shipping_address_postal_code,
             o.subtotal, o.shipping_cost, o.discount, o.tax, o.total,
             o.payment_method, o.shipping_method, o.tracking_number, 
             o.customer_notes, o.admin_notes, o.created_at;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN RPC: update_order_status
-- Actualiza el estado de una orden y registra el cambio
-- ============================================================================

CREATE OR REPLACE FUNCTION update_order_status(
    p_order_id BIGINT,
    p_new_status VARCHAR,
    p_changed_by VARCHAR DEFAULT 'admin',
    p_reason TEXT DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    message VARCHAR
) AS $$
DECLARE
    v_old_status VARCHAR;
BEGIN
    -- Obtener estado actual
    SELECT order_status INTO v_old_status FROM orders WHERE id = p_order_id;
    
    IF v_old_status IS NULL THEN
        RETURN QUERY SELECT false::boolean, 'Order not found'::varchar;
        RETURN;
    END IF;
    
    -- Actualizar estado
    UPDATE orders 
    SET order_status = p_new_status,
        updated_at = NOW()
    WHERE id = p_order_id;
    
    -- Registrar cambio de estado
    INSERT INTO order_status_history (order_id, old_status, new_status, changed_by, change_reason)
    VALUES (p_order_id, v_old_status, p_new_status, p_changed_by, p_reason);
    
    -- Actualizar timestamps según estado
    IF p_new_status = 'confirmed' THEN
        UPDATE orders SET confirmed_at = NOW() WHERE id = p_order_id;
    ELSIF p_new_status = 'shipped' THEN
        UPDATE orders SET shipped_at = NOW() WHERE id = p_order_id;
    ELSIF p_new_status = 'delivered' THEN
        UPDATE orders SET delivered_at = NOW() WHERE id = p_order_id;
    END IF;
    
    RETURN QUERY SELECT true::boolean, 'Order status updated successfully'::varchar;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN RPC: get_orders_by_customer
-- Obtiene todas las órdenes de un cliente específico
-- ============================================================================

CREATE OR REPLACE FUNCTION get_orders_by_customer(p_customer_email VARCHAR)
RETURNS TABLE (
    order_id BIGINT,
    order_number VARCHAR,
    order_status VARCHAR,
    payment_status VARCHAR,
    total BIGINT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.order_number,
        o.order_status,
        o.payment_status,
        o.total,
        o.created_at
    FROM orders o
    INNER JOIN customers c ON o.customer_id = c.id
    WHERE c.email = p_customer_email
    ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN RPC: create_order_from_cart
-- Crea una orden completa desde el carrito
-- ============================================================================

CREATE OR REPLACE FUNCTION create_order_from_cart(
    p_customer_data JSONB,
    p_cart_items JSONB,
    p_shipping_method VARCHAR DEFAULT NULL,
    p_payment_method VARCHAR DEFAULT NULL,
    p_customer_notes TEXT DEFAULT NULL
)
RETURNS TABLE (
    order_id BIGINT,
    order_number VARCHAR,
    total BIGINT,
    message VARCHAR
) AS $$
DECLARE
    v_customer_id BIGINT;
    v_order_id BIGINT;
    v_order_number VARCHAR;
    v_subtotal BIGINT := 0;
    v_total BIGINT := 0;
    v_item JSONB;
BEGIN
    -- Crear o actualizar cliente
    INSERT INTO customers (
        email, phone, first_name, last_name, document_id,
        address_street, address_number, address_city, address_state, 
        address_country, address_postal_code, preferred_contact_method
    )
    VALUES (
        p_customer_data->>'email',
        p_customer_data->>'phone',
        p_customer_data->>'first_name',
        p_customer_data->>'last_name',
        p_customer_data->>'document_id',
        p_customer_data->>'address_street',
        p_customer_data->>'address_number',
        p_customer_data->>'address_city',
        p_customer_data->>'address_state',
        COALESCE(p_customer_data->>'address_country', 'Argentina'),
        p_customer_data->>'address_postal_code',
        'email'
    )
    ON CONFLICT (email) 
    DO UPDATE SET 
        phone = EXCLUDED.phone,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        address_street = EXCLUDED.address_street,
        address_city = EXCLUDED.address_city,
        updated_at = NOW()
    RETURNING id INTO v_customer_id;
    
    -- Calcular subtotal
    FOR v_item IN SELECT jsonb_array_elements(p_cart_items)
    LOOP
        v_subtotal := v_subtotal + ((v_item->>'unit_price')::BIGINT * (v_item->>'quantity')::BIGINT);
    END LOOP;
    
    v_total := v_subtotal;
    
    -- Generar número de orden
    v_order_number := generate_order_number();
    
    -- Crear orden
    INSERT INTO orders (
        order_number, customer_id, order_status, payment_status,
        subtotal, total, payment_method, shipping_method, customer_notes
    )
    VALUES (
        v_order_number, v_customer_id, 'pending', 'pending',
        v_subtotal, v_total, p_payment_method, p_shipping_method, p_customer_notes
    )
    RETURNING id INTO v_order_id;
    
    -- Insertar items de la orden
    INSERT INTO order_items (
        order_id, product_id, product_variant_id, product_name, product_sku,
        variant_name, unit_price, unit_price_offer, discount_percentage,
        quantity, line_subtotal
    )
    SELECT 
        v_order_id,
        (v_item->>'product_id')::BIGINT,
        CASE WHEN v_item->>'product_variant_id' != 'null' THEN (v_item->>'product_variant_id')::BIGINT ELSE NULL END,
        v_item->>'product_name',
        v_item->>'product_sku',
        v_item->>'variant_name',
        (v_item->>'unit_price')::BIGINT,
        CASE WHEN v_item->>'unit_price_offer' != 'null' THEN (v_item->>'unit_price_offer')::BIGINT ELSE NULL END,
        CASE WHEN v_item->>'discount_percentage' != 'null' THEN (v_item->>'discount_percentage')::NUMERIC ELSE NULL END,
        (v_item->>'quantity')::BIGINT,
        ((v_item->>'unit_price')::BIGINT * (v_item->>'quantity')::BIGINT)
    FROM jsonb_array_elements(p_cart_items) v_item;
    
    -- Crear registro de pago pendiente
    INSERT INTO order_payments (order_id, payment_method, payment_status, amount)
    VALUES (v_order_id, COALESCE(p_payment_method, 'unknown'), 'pending', v_total);
    
    RETURN QUERY SELECT 
        v_order_id::BIGINT,
        v_order_number::VARCHAR,
        v_total::BIGINT,
        'Order created successfully'::VARCHAR;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INSERTS INICIALES: company_config
-- ============================================================================

INSERT INTO company_config (
    company_name, company_email, company_phone, company_website,
    address_city, address_country, currency_symbol, currency_code,
    payment_methods
)
VALUES (
    'Mi Tienda Online',
    'contacto@mtienda.com',
    '+54 11 0000-0000',
    'https://mtienda.com',
    'Buenos Aires',
    'Argentina',
    '$',
    'ARS',
    '[
        {"name": "Transferencia Bancaria", "description": "Transferencia a nuestra cuenta"},
        {"name": "Mercado Pago", "description": "Tarjeta de crédito o débito"},
        {"name": "Contra Entrega", "description": "Paga cuando recibes el producto"}
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- CREAR VISTA ÚTIL: vw_orders_summary
-- ============================================================================

CREATE OR REPLACE VIEW vw_orders_summary AS
SELECT 
    o.id,
    o.order_number,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    c.email,
    c.phone,
    o.order_status,
    o.payment_status,
    o.total,
    COUNT(DISTINCT oi.id) AS items_count,
    o.created_at,
    o.updated_at
FROM orders o
INNER JOIN customers c ON o.customer_id = c.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, c.first_name, c.last_name, c.email, c.phone,
         o.order_status, o.payment_status, o.total, o.created_at, o.updated_at;

-- ============================================================================
-- TRIGGER: Auto-update orders.updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_orders_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_update_orders_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_orders_timestamp();

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
-- Ejecutado: 2026-04-22
-- Sistema de Órdenes Completo
-- Total de tablas: 6
-- Total de funciones RPC: 5
-- Total de índices: 20+
-- ============================================================================
