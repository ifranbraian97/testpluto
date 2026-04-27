import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"

// Force static generation
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Defensa del Consumidor | USA Import",
  description: "Información sobre derechos del consumidor según la Ley 24.240",
}

export default function DefensaConsumidorPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Defensa del Consumidor</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Ley de Defensa del Consumidor - Ley 24.240</h2>
              <p>
                En USA Import respetamos y cumplimos con la Ley de Defensa del Consumidor N° 24.240 de la República
                Argentina, que tiene como objetivo la protección y defensa de los derechos de los consumidores y
                usuarios.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Derechos del Consumidor</h2>
              <p>Como consumidor, usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Recibir información clara, detallada y veraz sobre los productos y servicios</li>
                <li>La protección de su salud y seguridad</li>
                <li>La protección de sus intereses económicos</li>
                <li>Condiciones de trato equitativo y digno</li>
                <li>Educación para el consumo</li>
                <li>Libertad de elección</li>
                <li>Acceder a la justicia y procedimientos eficaces de solución de conflictos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Información del Producto</h2>
              <p>
                Todos nuestros productos incluyen información clara sobre características, precio, origen y condiciones
                de venta. Nos comprometemos a brindar datos precisos que le permitan tomar decisiones informadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Garantía Legal</h2>
              <p>
                Todos nuestros productos cuentan con la garantía legal establecida en el artículo 11 de la Ley 24.240.
                En caso de defectos o vicios, usted puede optar por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Exigir el cumplimiento de la obligación</li>
                <li>Aceptar otro producto equivalente</li>
                <li>Rescindir el contrato con derecho a la restitución del precio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Derecho de Arrepentimiento</h2>
              <p>
                Para compras realizadas a distancia (online, telefónica, etc.), el consumidor tiene derecho a revocar la
                aceptación durante el plazo de 10 días corridos contados a partir de la entrega del producto. Para más
                información, consulte nuestra sección de Botón de Arrepentimiento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Reclamos y Denuncias</h2>
              <p>
                Si necesita realizar un reclamo o tiene alguna consulta, puede contactarnos a través de nuestros canales
                de atención al cliente.
              </p>
              <p className="mt-4">También puede comunicarse con:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="font-semibold text-black">Dirección Nacional de Defensa del Consumidor</p>
                <p className="mt-2">
                  <strong>Teléfono:</strong> 0800-666-1518
                </p>
                <p>
                  <strong>Web:</strong>{" "}
                  <a
                    href="https://www.argentina.gob.ar/produccion/defensadelconsumidor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    www.argentina.gob.ar/produccion/defensadelconsumidor
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Resolución de Conflictos</h2>
              <p>
                USA Import se compromete a resolver cualquier conflicto de manera amigable y eficiente. En primera
                instancia, le solicitamos que se comunique directamente con nosotros para buscar una solución.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Prácticas Abusivas Prohibidas</h2>
              <p>En USA Import no realizamos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cobros indebidos o no autorizados</li>
                <li>Publicidad engañosa o falsa</li>
                <li>Venta atada o forzada de productos</li>
                <li>Negativa injustificada de venta</li>
                <li>Discriminación de consumidores</li>
              </ul>
            </section>

            <section className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">Información Importante</h2>
              <p>
                La violación de la Ley de Defensa del Consumidor está sujeta a sanciones administrativas que pueden
                incluir multas, clausura y otras penalidades establecidas por la autoridad competente.
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">Contacto</h2>
              <p>
                Para cualquier consulta sobre sus derechos como consumidor o para realizar un reclamo, puede
                contactarnos a través de WhatsApp o correo electrónico disponibles en nuestra sección de Contacto.
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
