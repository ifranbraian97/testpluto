import { getOrderDetailByNumber, getCompanyConfig } from '@/app/actions/orders'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params

    // Obtener datos de la orden
    const { data: order, error: orderError } = await getOrderDetailByNumber(orderNumber)
    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Obtener config de la empresa
    const { data: config } = await getCompanyConfig()
    const companyName = config?.company_name || 'USA Import'

    // Generar HTML del comprobante
    const html = generateOrderHTML(order, companyName)

    // Retornar HTML que puede ser impreso o convertido a PDF por el cliente
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="orden-${orderNumber}.html"`,
      },
    })
  } catch (error) {
    console.error('[PDF API Error]', error)
    return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

function generateOrderHTML(order: any, companyName: string): string {
  const totalAmount = (order.total / 100).toFixed(2)
  const subtotal = (order.subtotal / 100).toFixed(2)
  const shippingCost = (order.shipping_cost / 100).toFixed(2)

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orden ${order.order_number}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        color: #333;
        line-height: 1.6;
        background: #f5f5f5;
        padding: 20px;
      }
      
      .container {
        max-width: 900px;
        margin: 0 auto;
        background: white;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      
      .header {
        text-align: center;
        border-bottom: 2px solid #333;
        padding-bottom: 20px;
        margin-bottom: 30px;
      }
      
      .header h1 {
        font-size: 28px;
        color: #2c3e50;
        margin-bottom: 5px;
      }
      
      .header p {
        font-size: 14px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      .order-number {
        font-size: 24px;
        color: #27ae60;
        font-weight: bold;
        margin: 15px 0;
      }
      
      .info-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
        margin: 20px 0;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
      }
      
      .info-block h3 {
        font-size: 14px;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 10px;
      }
      
      .info-block p {
        margin: 5px 0;
        font-size: 14px;
      }
      
      .status {
        background: #fff3cd;
        border-left: 4px solid #ffc107;
        padding: 15px;
        margin: 20px 0;
        border-radius: 4px;
      }
      
      .status strong {
        color: #856404;
      }
      
      .products {
        margin: 30px 0;
      }
      
      .products h2 {
        font-size: 18px;
        color: #2c3e50;
        margin-bottom: 15px;
        border-bottom: 2px solid #333;
        padding-bottom: 10px;
      }
      
      .product-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      
      .product-table thead {
        background: #f5f5f5;
      }
      
      .product-table th {
        padding: 12px;
        text-align: left;
        font-weight: bold;
        border-bottom: 2px solid #ddd;
        font-size: 13px;
        text-transform: uppercase;
      }
      
      .product-table td {
        padding: 12px;
        border-bottom: 1px solid #ddd;
        font-size: 14px;
      }
      
      .product-table tbody tr:hover {
        background: #f9f9f9;
      }
      
      .text-right {
        text-align: right;
      }
      
      .totals {
        margin: 20px 0;
        padding: 20px;
        background: #f5f5f5;
        border-radius: 4px;
      }
      
      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 14px;
      }
      
      .total-row.final {
        border-top: 2px solid #333;
        padding-top: 12px;
        font-size: 18px;
        font-weight: bold;
        color: #27ae60;
      }
      
      .footer {
        text-align: center;
        margin-top: 40px;
        padding-top: 20px;
        border-top: 1px solid #eee;
        font-size: 12px;
        color: #666;
      }
      
      .print-button {
        text-align: center;
        margin: 20px 0;
      }
      
      .print-button button {
        background: #27ae60;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
      }
      
      .print-button button:hover {
        background: #229954;
      }
      
      @media print {
        body {
          background: white;
          padding: 0;
        }
        
        .container {
          box-shadow: none;
          padding: 20px;
        }
        
        .print-button {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${companyName}</h1>
        <p>Comprobante de Compra</p>
        <div class="order-number">Orden #${order.order_number}</div>
      </div>
      
      <div class="info-row">
        <div class="info-block">
          <h3>Información del Pedido</h3>
          <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Estado:</strong> ${order.order_status}</p>
          <p><strong>Pago:</strong> ${order.payment_status}</p>
        </div>
        
        <div class="info-block">
          <h3>Datos del Cliente</h3>
          <p><strong>${order.customer_name}</strong></p>
          <p>${order.customer_email}</p>
          <p>${order.customer_phone}</p>
          ${order.customer_document_id ? `<p>DNI: ${order.customer_document_id}</p>` : ''}
        </div>
      </div>
      
      <div class="status">
        <strong>📦 Estado del Envío: Por Coordinar</strong>
        <p style="margin-top: 8px; font-size: 13px;">Nos contactaremos pronto via email o teléfono para coordinar los detalles del envío.</p>
      </div>
      
      <div class="products">
        <h2>Productos</h2>
        <table class="product-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Variante</th>
              <th class="text-right">Cantidad</th>
              <th class="text-right">Precio Unit.</th>
              <th class="text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item: any) => `
              <tr>
                <td>${item.product_name}</td>
                <td>${item.variant_name || '-'}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">$${(item.unit_price / 100).toFixed(2)}</td>
                <td class="text-right">$${(item.line_subtotal / 100).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>$${subtotal}</span>
        </div>
        <div class="total-row">
          <span>Envío (${order.shipping_method || 'Standard'}):</span>
          <span>$${shippingCost}</span>
        </div>
        ${order.discount > 0 ? `
          <div class="total-row">
            <span>Descuento:</span>
            <span>-$${(order.discount / 100).toFixed(2)}</span>
          </div>
        ` : ''}
        ${order.tax > 0 ? `
          <div class="total-row">
            <span>Impuestos:</span>
            <span>$${(order.tax / 100).toFixed(2)}</span>
          </div>
        ` : ''}
        <div class="total-row final">
          <span>TOTAL:</span>
          <span>$${totalAmount}</span>
        </div>
      </div>
      
      <div class="info-row">
        <div class="info-block">
          <h3>Dirección de Envío</h3>
          <p>${order.shipping_address.street}</p>
          <p>${order.shipping_address.city}, ${order.shipping_address.state || ''}</p>
          <p>${order.shipping_address.postal_code} - ${order.shipping_address.country}</p>
        </div>
        
        <div class="info-block">
          <h3>Método de Pago</h3>
          <p>${order.payment_method || 'No especificado'}</p>
        </div>
      </div>
      
      ${order.customer_notes ? `
        <div class="info-block" style="grid-column: 1/-1;">
          <h3>Notas</h3>
          <p>${order.customer_notes}</p>
        </div>
      ` : ''}
      
      <div class="print-button">
        <button onclick="window.print()">🖨️ Imprimir / Descargar como PDF</button>
      </div>
      
      <div class="footer">
        <p>Gracias por tu compra!</p>
        <p>El estado de tu pedido será coordinado vía email o teléfono.</p>
      </div>
    </div>
    
    <script>
      // Auto-open print dialog
      if (window.location.search.includes('print=1')) {
        window.print();
      }
    </script>
  </body>
</html>`
}
