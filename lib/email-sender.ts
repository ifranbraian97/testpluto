import nodemailer from 'nodemailer'
import { OrderDetail } from '@/types/order'

// Configurar transporte de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    : undefined,
})

export async function sendOrderConfirmationEmail(
  order: OrderDetail,
  baseUrl: string,
  companyName: string,
  companyEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Si no hay configuración de SMTP, solo logear
    if (!process.env.SMTP_HOST) {
      console.log('[Email] SMTP not configured. Skipping email send for order', order.order_number)
      return { success: true }
    }

    const mailOptions = {
      from: companyEmail || process.env.SMTP_FROM || 'noreply@usaimport.com',
      to: order.customer_email,
      subject: `Confirmación de tu compra - Orden ${order.order_number}`,
      html: generateEmailHTML(order, baseUrl, companyName),
    }

    await transporter.sendMail(mailOptions)
    console.log('[Email] Order confirmation sent to', order.customer_email)
    return { success: true }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Email Error]', errorMsg)
    // No retornar error para no bloquear la creación de orden
    return { success: true }
  }
}

function generateEmailHTML(order: OrderDetail, baseUrl: string, companyName: string): string {
  const totalAmount = (order.total / 100).toFixed(2)
  const subtotal = (order.subtotal / 100).toFixed(2)
  const shippingCost = (order.shipping_cost / 100).toFixed(2)
  const pdfUrl = `${baseUrl}/api/orders/${order.order_number}/pdf`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
          .header h1 { margin: 0; color: #2c3e50; font-size: 24px; }
          .order-number { font-size: 18px; color: #27ae60; font-weight: bold; margin: 10px 0; }
          .section { margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; }
          .section h2 { color: #2c3e50; font-size: 16px; margin-top: 0; }
          .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ddd; }
          .item:last-child { border-bottom: none; }
          .label { color: #666; }
          .value { font-weight: bold; color: #2c3e50; }
          .total-section { background-color: #27ae60; color: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .total-amount { font-size: 24px; font-weight: bold; }
          .shipping-notice { background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
          .button { display: inline-block; background-color: #27ae60; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${companyName}</h1>
            <p>¡Gracias por tu compra!</p>
          </div>

          <div class="section">
            <h2>Confirmación de Orden</h2>
            <div class="order-number">Orden #${order.order_number}</div>
            <div class="item">
              <span class="label">Fecha:</span>
              <span class="value">${new Date(order.created_at).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div class="section">
            <h2>Datos del Cliente</h2>
            <div class="item">
              <span class="label">Nombre:</span>
              <span class="value">${order.customer_name}</span>
            </div>
            <div class="item">
              <span class="label">Teléfono:</span>
              <span class="value">${order.customer_phone}</span>
            </div>
          </div>

          <div class="section">
            <h2>Productos (${order.items.length})</h2>
            ${order.items.map((item) => `
              <div class="item">
                <span>
                  ${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ''} x${item.quantity}
                </span>
                <span class="value">$${(item.line_subtotal / 100).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="total-section">
            <div class="item" style="border: none; color: white;">
              <span>TOTAL:</span>
              <span class="total-amount">$${totalAmount}</span>
            </div>
          </div>

          <div class="shipping-notice">
            <strong>📦 Estado del Envío: Por Coordinar</strong>
            <p style="margin: 10px 0 0 0; font-size: 13px;">Nos contactaremos pronto via email o teléfono para coordinar los detalles del envío.</p>
          </div>

          <div style="text-align: center;">
            <a href="${pdfUrl}?print=1" class="button">📄 Ver Comprobante Completo</a>
          </div>

          <div class="section">
            <h2>Dirección de Envío</h2>
            <p><strong>${order.customer_name}</strong></p>
            <p>${order.shipping_address.street}</p>
            <p>${order.shipping_address.city}, ${order.shipping_address.state || ''} ${order.shipping_address.postal_code}</p>
            <p>${order.shipping_address.country}</p>
          </div>

          <div class="footer">
            <p>Este es un correo automático. Por favor no respondas a este mensaje.</p>
            <p>Para ver tu comprobante completo, haz click en el botón "Ver Comprobante Completo" arriba.</p>
            <p>Cualquier consulta, contáctanos: <strong>${companyName}</strong></p>
          </div>
        </div>
      </body>
    </html>
  `
}
