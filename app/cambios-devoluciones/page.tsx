import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import Link from "next/link"

// Force static generation
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Cambios y Devoluciones | USA Import",
  description: "Política de cambios y devoluciones de USA Import",
}

export default function CambiosDevolucionesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Cambios y Devoluciones</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Nuestra Política</h2>
              <p>
                En USA Import queremos que estés completamente satisfecho con tu compra. Si por algún motivo no lo
                estás, ofrecemos opciones de cambio y devolución bajo las condiciones que se detallan a continuación.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Plazos</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded space-y-3">
                <div>
                  <p className="font-semibold text-black">Derecho de Arrepentimiento:</p>
                  <p>10 días corridos desde la recepción del producto (compras online)</p>
                  <p className="text-sm mt-1">
                    <Link href="/arrepentimiento" className="text-blue-600 hover:text-blue-800">
                      Ver más información sobre el Derecho de Arrepentimiento
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-black">Defectos de Fábrica o Producto Incorrecto:</p>
                  <p>30 días corridos desde la recepción del producto</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Condiciones para Cambios y Devoluciones</h2>
              <p>Para que podamos procesar tu cambio o devolución, el producto debe cumplir con:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Estar en perfectas condiciones, sin uso ni señales de desgaste</li>
                <li>Conservar el embalaje original intacto</li>
                <li>Incluir todas las etiquetas originales</li>
                <li>Acompañarse de todos los accesorios, manuales y regalos promocionales</li>
                <li>Presentar el comprobante de compra</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Motivos de Cambio o Devolución</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">1. Producto Defectuoso</h3>
                  <p>
                    Si el producto presenta defectos de fabricación o no funciona correctamente, realizaremos el cambio
                    por uno nuevo o la devolución del dinero, según tu preferencia.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">2. Producto Incorrecto</h3>
                  <p>
                    Si recibiste un producto diferente al que compraste, lo cambiaremos por el correcto sin costo
                    adicional.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">3. Producto Dañado en el Envío</h3>
                  <p>
                    Si el producto llegó dañado por el transporte, realizaremos el cambio o devolución inmediatamente.
                    Es importante que rechaces el paquete en el momento de la entrega si observás daños evidentes.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">4. Arrepentimiento de Compra</h3>
                  <p>
                    Si simplemente cambiaste de opinión, podés ejercer tu derecho de arrepentimiento dentro de los 10
                    días corridos. Ver{" "}
                    <Link href="/arrepentimiento" className="text-blue-600 hover:text-blue-800">
                      Botón de Arrepentimiento
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Cómo Solicitar un Cambio o Devolución?</h2>

              <div className="bg-gray-50 p-6 rounded-lg">
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Contactanos por WhatsApp</strong> dentro del plazo correspondiente
                  </li>
                  <li>
                    <strong>Proporcioná la siguiente información:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Número de orden o comprobante de compra</li>
                      <li>Motivo del cambio o devolución</li>
                      <li>Fotos del producto (si aplica)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Coordiná la logística</strong> con nuestro equipo
                  </li>
                  <li>
                    <strong>Enviá o entregá el producto</strong> según lo coordinado
                  </li>
                  <li>
                    <strong>Recibí tu producto nuevo o reembolso</strong>
                  </li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Costos de Devolución</h2>

              <div className="space-y-3">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="font-semibold text-black">Sin costo para vos:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Producto defectuoso</li>
                    <li>Producto incorrecto</li>
                    <li>Producto dañado en el envío</li>
                    <li>Error de USA Import</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-semibold text-black">Sin costo por derecho de arrepentimiento:</p>
                  <p className="mt-2">
                    Según la Ley de Defensa del Consumidor, los gastos de devolución por arrepentimiento corren por
                    cuenta nuestra.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Reembolsos</h2>
              <p>Una vez recibido y verificado el producto, procesaremos tu reembolso:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Plazo:</strong> Hasta 30 días corridos desde la recepción del producto devuelto
                </li>
                <li>
                  <strong>Método:</strong> Por el mismo medio de pago utilizado en la compra
                </li>
                <li>
                  <strong>Monto:</strong> El importe total pagado, incluyendo gastos de envío si corresponde
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Cambios por Otro Producto</h2>
              <p>
                Si preferís cambiar el producto por otro de nuestro catálogo, coordinamos el cambio sin costo adicional
                (siempre que sea por el mismo valor o superior, en cuyo caso deberás abonar la diferencia).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Productos Excluidos</h2>
              <p>No se aceptan devoluciones de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Productos de higiene personal que hayan sido abiertos o usados</li>
                <li>Productos personalizados o hechos a medida</li>
                <li>Productos en oferta o liquidación (salvo defecto de fábrica)</li>
                <li>Productos sin embalaje original o etiquetas</li>
              </ul>
              <p className="mt-4 text-sm">
                Estos productos solo pueden ser devueltos si presentan defectos de fábrica o errores en el envío.
              </p>
            </section>

            <section className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
              <h2 className="text-2xl font-semibold mb-4 text-black">Importante</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Conservá siempre el comprobante de compra</li>
                <li>Sacá fotos al producto al momento de recibirlo</li>
                <li>No aceptes paquetes visiblemente dañados</li>
                <li>Contactanos lo antes posible si detectás algún problema</li>
              </ul>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Necesitás Ayuda?</h2>
              <p>
                Si tenés dudas sobre cambios y devoluciones o necesitás iniciar un proceso, contactanos por WhatsApp.
                Nuestro equipo está disponible para ayudarte y hacer el proceso lo más simple posible.
              </p>
            </section>
          </div>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  )
}
