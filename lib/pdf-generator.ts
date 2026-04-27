import PDFDocument from 'pdfkit'
import { OrderDetail } from '@/types/order'

export async function generateOrderPDF(order: OrderDetail, companyName: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
    })

    const chunks: Buffer[] = []

    doc.on('data', (chunk) => {
      chunks.push(chunk)
    })

    doc.on('end', () => {
      resolve(Buffer.concat(chunks))
    })

    doc.on('error', reject)

    // Encabezado
    doc.fontSize(20).font('Helvetica-Bold').text(companyName, { align: 'center' })
    doc.fontSize(10).text('COMPROBANTE DE COMPRA', { align: 'center' })
    doc.moveDown(0.5)

    // Línea separadora
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown()

    // Información de la orden
    doc.fontSize(12).font('Helvetica-Bold').text('Número de Orden:')
    doc.fontSize(11).font('Helvetica').text(order.order_number)
    doc.moveDown(0.3)

    doc.fontSize(12).font('Helvetica-Bold').text('Fecha:')
    doc.fontSize(11).font('Helvetica').text(
      new Date(order.created_at).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
    doc.moveDown(0.5)

    // Datos del cliente
    doc.fontSize(12).font('Helvetica-Bold').text('Datos del Cliente:')
    doc.fontSize(11).font('Helvetica').text(order.customer_name)
    doc.text(`Email: ${order.customer_email}`)
    doc.text(`Teléfono: ${order.customer_phone}`)
    if (order.customer_document_id) {
      doc.text(`DNI: ${order.customer_document_id}`)
    }
    doc.moveDown(0.5)

    // Dirección de envío
    doc.fontSize(12).font('Helvetica-Bold').text('Dirección de Envío:')
    doc.fontSize(11).font('Helvetica').text(order.shipping_address.street)
    doc.text(
      `${order.shipping_address.city}, ${order.shipping_address.state || ''} ${order.shipping_address.postal_code}`
    )
    doc.text(order.shipping_address.country)
    doc.moveDown(0.5)

    // Estado del envío
    doc.fontSize(12).font('Helvetica-Bold').text('Estado del Envío:')
    doc.fontSize(11).font('Helvetica').text('Por coordinar - Nos contactaremos pronto')
    doc.moveDown(1)

    // Línea separadora
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown()

    // Productos
    doc.fontSize(12).font('Helvetica-Bold').text('Productos:')
    doc.moveDown(0.3)

    // Encabezados de tabla
    doc.fontSize(10).font('Helvetica-Bold')
    const tableTop = doc.y
    doc.text('Producto', 50, tableTop)
    doc.text('Variante', 250, tableTop)
    doc.text('Cantidad', 380, tableTop)
    doc.text('Precio Unit.', 430, tableTop)
    doc.text('Subtotal', 510, tableTop)

    doc.moveDown()
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown()

    // Filas de productos
    doc.fontSize(10).font('Helvetica')
    order.items.forEach((item) => {
      const yPos = doc.y
      const productName = item.product_name.substring(0, 25)
      const variantName = (item.variant_name || '-').substring(0, 18)

      doc.text(productName, 50, yPos)
      doc.text(variantName, 250, yPos)
      doc.text(String(item.quantity), 380, yPos)
      doc.text(`$${(item.unit_price / 100).toFixed(2)}`, 430, yPos)
      doc.text(`$${(item.line_subtotal / 100).toFixed(2)}`, 510, yPos)
      doc.moveDown()
    })

    doc.moveDown(0.5)
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown()

    // Totales
    const totalsX = 380
    doc.fontSize(10).font('Helvetica')
    doc.text('Subtotal:', totalsX, doc.y)
    doc.text(`$${(order.subtotal / 100).toFixed(2)}`, 510, doc.y - 10, { align: 'right' })
    doc.moveDown()

    if (order.shipping_cost > 0) {
      doc.text(`Envío (${order.shipping_method}):`, totalsX, doc.y)
      doc.text(`$${(order.shipping_cost / 100).toFixed(2)}`, 510, doc.y - 10, { align: 'right' })
      doc.moveDown()
    }

    if (order.discount > 0) {
      doc.text('Descuento:', totalsX, doc.y)
      doc.text(`-$${(order.discount / 100).toFixed(2)}`, 510, doc.y - 10, { align: 'right' })
      doc.moveDown()
    }

    if (order.tax > 0) {
      doc.text('Impuestos:', totalsX, doc.y)
      doc.text(`$${(order.tax / 100).toFixed(2)}`, 510, doc.y - 10, { align: 'right' })
      doc.moveDown()
    }

    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.3)

    doc.fontSize(12).font('Helvetica-Bold')
    doc.text('Total:', totalsX, doc.y)
    doc.text(`$${(order.total / 100).toFixed(2)}`, 510, doc.y - 12, { align: 'right' })
    doc.moveDown(1)

    // Método de pago
    doc.fontSize(11).font('Helvetica-Bold').text('Método de Pago:')
    doc.fontSize(10).font('Helvetica').text(order.payment_method || 'No especificado')
    doc.moveDown(0.5)

    // Notas del cliente
    if (order.customer_notes) {
      doc.fontSize(11).font('Helvetica-Bold').text('Notas:')
      doc.fontSize(10).font('Helvetica').text(order.customer_notes)
      doc.moveDown(0.5)
    }

    // Pie de página
    doc.moveDown(1)
    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke()
    doc.moveDown(0.5)
    doc.fontSize(9).font('Helvetica').text('Gracias por tu compra!', { align: 'center' })
    doc.text('El estado de tu pedido será coordinado via email o teléfono', { align: 'center' })

    doc.end()
  })
}
