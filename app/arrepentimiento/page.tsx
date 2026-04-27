import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import Link from "next/link"
import { contactConfig } from "@/lib/contact-config"

// Force static generation
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Botón de Arrepentimiento | USA Import",
  description: "Ejercé tu derecho de arrepentimiento según la Ley 24.240",
}

export default function ArrepentimientoPage() {
  const whatsappMessage = encodeURIComponent("Hola, deseo ejercer mi derecho de arrepentimiento sobre mi compra.")
  const whatsappLink = `https://wa.me/${contactConfig.phone.whatsapp}?text=${whatsappMessage}`

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Botón de Arrepentimiento</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Qué es el Derecho de Arrepentimiento?</h2>
              <p>
                El derecho de arrepentimiento es un derecho que tiene todo consumidor que realiza una compra a distancia
                (por internet, teléfono, catálogo, etc.) de revocar su aceptación de compra sin necesidad de justificar
                su decisión y sin penalización alguna.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Marco Legal</h2>
              <p>
                Este derecho está establecido en el artículo 34 de la Ley de Defensa del Consumidor N° 24.240 de la
                República Argentina y en la Resolución N° 424/2020 de la Secretaría de Comercio Interior.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Plazo para Ejercer el Derecho</h2>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
                <p className="font-semibold text-lg text-black">
                  Tenés 10 días corridos desde la recepción del producto para ejercer tu derecho de arrepentimiento.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Condiciones</h2>
              <p>Para ejercer este derecho, el producto debe cumplir con las siguientes condiciones:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Estar en perfectas condiciones, sin uso</li>
                <li>Conservar su embalaje y etiquetas originales</li>
                <li>No haber sido dañado o alterado</li>
                <li>Incluir todos los accesorios y manuales que lo acompañaban</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Cómo Ejercer tu Derecho?</h2>
              <div className="space-y-4">
                <p>Para ejercer tu derecho de arrepentimiento, seguí estos pasos:</p>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      <strong>Comunicate con nosotros</strong> dentro de los 10 días corridos desde la recepción del
                      producto
                    </li>
                    <li>
                      <strong>Indicá el motivo</strong> de tu arrepentimiento (opcional)
                    </li>
                    <li>
                      <strong>Coordiná la devolución</strong> del producto con nuestro equipo
                    </li>
                    <li>
                      <strong>Enviá el producto</strong> en las condiciones mencionadas anteriormente
                    </li>
                  </ol>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mt-6">
                  <h3 className="text-xl font-semibold mb-3 text-black">Contactanos por WhatsApp</h3>
                  <p className="mb-4">
                    La forma más rápida de ejercer tu derecho de arrepentimiento es a través de WhatsApp:
                  </p>
                  <Link
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Ejercer Derecho de Arrepentimiento
                  </Link>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Devolución del Dinero</h2>
              <p>
                Una vez que recibamos y verifiquemos el estado del producto, procederemos a devolver el importe total
                abonado en un plazo máximo de 30 días corridos desde la recepción del producto devuelto.
              </p>
              <p className="mt-4">La devolución incluye:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>El precio del producto</li>
                <li>Los gastos de envío originales (si corresponde)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Costos de Devolución</h2>
              <p>
                Los gastos de devolución del producto corren por cuenta de USA Import. Te proporcionaremos una etiqueta
                de envío o coordinaremos el retiro del producto sin costo para vos.
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">Más Información</h2>
              <p>
                Si tenés dudas sobre tu derecho de arrepentimiento o necesitás más información, no dudes en
                contactarnos. Estamos para ayudarte.
              </p>
              <div className="mt-4 space-y-2">
                <p>
                  <strong>WhatsApp:</strong>{" "}
                  <Link
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {contactConfig.phone.display}
                  </Link>
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a href={`mailto:${contactConfig.email}`} className="text-blue-600 hover:text-blue-800">
                    {contactConfig.email}
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <WhatsAppButton />
      <Footer />
    </main>
  )
}
