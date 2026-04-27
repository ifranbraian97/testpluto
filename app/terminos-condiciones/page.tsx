import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"

// Force static generation
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Términos y Condiciones | USA Import",
  description: "Términos y condiciones de uso del sitio web de USA Import",
}

export default function TerminosCondicionesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Términos y Condiciones</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y utilizar el sitio web de USA Import, usted acepta estar sujeto a estos términos y
                condiciones de uso. Si no está de acuerdo con alguno de estos términos, le recomendamos que no utilice
                nuestro sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">2. Uso del Sitio</h2>
              <p>
                El contenido de este sitio web es para su información general y uso personal. Está sujeto a cambios sin
                previo aviso.
              </p>
              <p>
                Usted se compromete a utilizar el sitio únicamente con fines legales y de manera que no infrinja los
                derechos de terceros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">3. Productos y Precios</h2>
              <p>
                Todos los productos están sujetos a disponibilidad. Los precios pueden cambiar sin previo aviso. USA
                Import se reserva el derecho de modificar o discontinuar productos en cualquier momento.
              </p>
              <p>Los precios publicados son en pesos argentinos e incluyen IVA cuando corresponda.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">4. Proceso de Compra</h2>
              <p>
                Las compras se realizan a través de WhatsApp. Al enviar su orden, usted acepta proporcionar información
                veraz y actualizada. USA Import se reserva el derecho de cancelar pedidos que contengan información
                incorrecta o fraudulenta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">5. Métodos de Pago</h2>
              <p>
                Aceptamos diversos métodos de pago que serán coordinados personalmente a través de WhatsApp. El pago
                debe completarse antes del envío del producto.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">6. Envíos</h2>
              <p>
                Los tiempos de envío son estimados y pueden variar según la ubicación y disponibilidad del servicio de
                mensajería. USA Import no se hace responsable por demoras ocasionadas por el servicio de envío.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">7. Garantías</h2>
              <p>
                Todos nuestros productos cuentan con garantía según lo establecido por la Ley de Defensa del Consumidor
                (Ley 24.240). Para más información, consulte nuestra sección de Garantía.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">8. Propiedad Intelectual</h2>
              <p>
                Todo el contenido del sitio, incluyendo textos, imágenes, logotipos y diseños, es propiedad de USA
                Import o de sus proveedores de contenido y está protegido por las leyes de propiedad intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">9. Limitación de Responsabilidad</h2>
              <p>
                USA Import no será responsable por daños indirectos, incidentales o consecuentes que surjan del uso o la
                imposibilidad de usar este sitio web o los productos adquiridos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">10. Modificaciones</h2>
              <p>
                USA Import se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las
                modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">11. Ley Aplicable</h2>
              <p>
                Estos términos y condiciones se rigen por las leyes de la República Argentina. Cualquier disputa será
                resuelta en los tribunales competentes de Argentina.
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">Contacto</h2>
              <p>
                Para cualquier consulta sobre estos términos y condiciones, puede contactarnos a través de nuestro
                WhatsApp o correo electrónico disponibles en la sección de Contacto.
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
