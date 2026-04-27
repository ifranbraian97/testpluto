import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"

// Force static generation
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Garantía | USA Import",
  description: "Información sobre garantías de productos de USA Import",
}

export default function GarantiaPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Garantía</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Compromiso de Calidad</h2>
              <p>
                En USA Import nos comprometemos a ofrecerte productos de la más alta calidad. Todos nuestros productos
                cuentan con garantía legal según lo establecido por la Ley de Defensa del Consumidor N° 24.240.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Garantía Legal</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                <p className="font-semibold text-black mb-3">
                  Todo producto tiene una garantía legal de 3 meses por defectos de fabricación o vicios ocultos.
                </p>
                <p>
                  Esta garantía cubre defectos de fabricación, mal funcionamiento o vicios que impidan el uso normal del
                  producto, siempre que no hayan sido causados por uso inadecuado, accidentes o alteraciones.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Garantía Extendida</h2>
              <p>Algunos de nuestros productos cuentan con garantía extendida del fabricante:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Productos electrónicos:</strong> 6 a 12 meses de garantía del fabricante
                </li>
                <li>
                  <strong>Electrodomésticos:</strong> 12 meses de garantía del fabricante
                </li>
                <li>
                  <strong>Tecnología:</strong> Según especificaciones del fabricante
                </li>
              </ul>
              <p className="mt-4">
                La información específica sobre la garantía de cada producto se detalla en la descripción del mismo y en
                el comprobante de compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Qué Cubre la Garantía?</h2>
              <div className="bg-green-50 p-6 rounded-lg">
                <p className="font-semibold text-black mb-3">La garantía cubre:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Defectos de fabricación</li>
                  <li>Fallas en materiales o mano de obra</li>
                  <li>Mal funcionamiento sin causa aparente</li>
                  <li>Vicios ocultos que afecten el uso del producto</li>
                  <li>Problemas técnicos no causados por el usuario</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Qué NO Cubre la Garantía?</h2>
              <div className="bg-red-50 p-6 rounded-lg">
                <p className="font-semibold text-black mb-3">La garantía NO cubre:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Daños causados por uso inadecuado o negligencia</li>
                  <li>Golpes, caídas o accidentes</li>
                  <li>Exposición a líquidos, humedad o temperaturas extremas</li>
                  <li>Modificaciones o reparaciones no autorizadas</li>
                  <li>Desgaste natural por el uso normal</li>
                  <li>Daños estéticos (rayones, abolladuras, etc.) que no afecten el funcionamiento</li>
                  <li>Pérdida de accesorios o componentes desmontables</li>
                  <li>Daños por sobretensión eléctrica o rayos</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Cómo Hacer Válida la Garantía?</h2>

              <div className="bg-gray-50 p-6 rounded-lg">
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Contactanos por WhatsApp</strong> dentro del período de garantía
                  </li>
                  <li>
                    <strong>Proporcioná la siguiente información:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Comprobante de compra</li>
                      <li>Descripción detallada del problema</li>
                      <li>Fotos o videos del defecto (si es posible)</li>
                      <li>Número de serie del producto (si aplica)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Evaluación técnica:</strong> Nuestro equipo evaluará el caso y determinará si aplica la
                    garantía
                  </li>
                  <li>
                    <strong>Coordinación del servicio:</strong> Te indicaremos los pasos a seguir según el caso
                  </li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Opciones de Garantía</h2>
              <p>Si tu producto tiene un defecto cubierto por la garantía, tenés las siguientes opciones:</p>

              <div className="space-y-4 mt-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Reparación</h3>
                    <p>Reparamos el producto sin costo para restaurar su funcionamiento normal.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Reemplazo</h3>
                    <p>Si la reparación no es posible, reemplazamos el producto por uno nuevo del mismo modelo.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Devolución</h3>
                    <p>
                      Si no hay stock para reemplazo o el problema persiste, devolvemos el importe total de tu compra.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Tiempos de Respuesta</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Evaluación inicial:</strong> 24 a 48 horas
                </li>
                <li>
                  <strong>Reparación:</strong> 15 a 30 días hábiles (según complejidad)
                </li>
                <li>
                  <strong>Reemplazo:</strong> 5 a 10 días hábiles (sujeto a disponibilidad)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Costos</h2>
              <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded">
                <p className="font-semibold text-black mb-2">Servicio sin cargo</p>
                <p>
                  Todos los servicios de garantía (reparación, reemplazo o devolución) son completamente gratuitos para
                  vos, incluyendo los costos de envío si el producto debe ser trasladado.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Consejos para Mantener tu Garantía</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Conservá el comprobante de compra:</strong> Es indispensable para hacer válida la garantía
                </li>
                <li>
                  <strong>Guardá el embalaje original:</strong> Facilita el envío si es necesaria una reparación
                </li>
                <li>
                  <strong>Seguí las instrucciones de uso:</strong> Lee el manual antes de usar el producto
                </li>
                <li>
                  <strong>Realizá mantenimiento regular:</strong> Cuando corresponda según el producto
                </li>
                <li>
                  <strong>No intentes reparar por tu cuenta:</strong> Esto puede anular la garantía
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Servicio Técnico</h2>
              <p>
                Trabajamos con servicios técnicos autorizados para garantizar reparaciones de calidad. En algunos casos,
                podemos coordinar la reparación directamente con el fabricante o su servicio técnico oficial.
              </p>
            </section>

            <section className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
              <h2 className="text-2xl font-semibold mb-4 text-black">Importante</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>La garantía comienza a contar desde la fecha de entrega del producto</li>
                <li>El plazo de garantía no se interrumpe durante el período de reparación</li>
                <li>Si el producto se repara o reemplaza, la garantía continúa por el tiempo restante</li>
                <li>Hacé valer tus derechos dentro del período de garantía correspondiente</li>
              </ul>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Tenés un Problema con tu Producto?</h2>
              <p>
                No dudes en contactarnos por WhatsApp. Nuestro equipo está preparado para ayudarte y resolver cualquier
                inconveniente de la manera más rápida y eficiente posible.
              </p>
              <p className="mt-4 font-semibold text-black">
                En USA Import, tu satisfacción es nuestra prioridad. Estamos para ayudarte.
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
