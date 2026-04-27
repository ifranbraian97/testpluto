import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import Image from "next/image"

// Force static generation
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Información de Envíos | USA Import",
  description: "Información sobre envíos, tiempos de entrega y cobertura de USA Import",
}

export default function EnviosPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Información de Envíos</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Cobertura de Envíos</h2>
              <p>
                Realizamos envíos a todo el territorio argentino a través de nuestra empresa de logística de confianza,
                Andreani, garantizando que tus productos lleguen de forma segura y rápida.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mt-4 flex items-center justify-center">
                <Image
                  src="/shipping-methods/andreani.png"
                  alt="Andreani"
                  width={150}
                  height={60}
                  className="h-12 w-auto object-contain"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Tiempos de Entrega</h2>
              <p>Los tiempos de entrega varían según tu ubicación:</p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded mt-4 space-y-3">
                <div>
                  <p className="font-semibold text-black">Capital Federal y GBA:</p>
                  <p>2 a 4 días hábiles</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Interior de Buenos Aires:</p>
                  <p>3 a 5 días hábiles</p>
                </div>
                <div>
                  <p className="font-semibold text-black">Resto del país:</p>
                  <p>5 a 10 días hábiles</p>
                </div>
              </div>

              <p className="mt-4 text-sm">
                Los tiempos son estimados y pueden variar según la disponibilidad del producto, condiciones climáticas o
                situaciones excepcionales del servicio de mensajería.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Costo de Envío</h2>
              <p>
                El costo del envío se calcula según el peso, dimensiones del paquete y la distancia a tu ubicación. Te
                informaremos el costo exacto del envío al momento de coordinar tu compra a través de WhatsApp.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Proceso de Envío</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Confirmación del Pedido</h3>
                    <p>Una vez confirmado tu pedido y el pago, preparamos tu orden para el envío.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Preparación y Empaque</h3>
                    <p>Embalamos cuidadosamente tu producto para garantizar que llegue en perfectas condiciones.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Despacho</h3>
                    <p>
                      Enviamos tu pedido a través de Andreani y te proporcionamos el número de seguimiento para que
                      puedas rastrear tu envío.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-black">Entrega</h3>
                    <p>Recibirás tu pedido en la dirección que nos proporcionaste.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Seguimiento de Envío</h2>
              <p>
                Una vez despachado tu pedido, te enviaremos el número de seguimiento por WhatsApp. Podrás rastrear tu
                envío en tiempo real ingresando a la web de Andreani:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <a
                  href="https://www.andreani.com/#!/personas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  www.andreani.com - Seguimiento de Envíos
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Recepción del Pedido</h2>
              <p>Al momento de recibir tu pedido:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Verificá el estado del paquete antes de firmar la recepción</li>
                <li>Si el paquete presenta daños visibles, no lo recibas y contactanos inmediatamente</li>
                <li>Revisá el contenido para asegurarte de que todo esté en orden</li>
                <li>Conservá el comprobante de entrega</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Problemas con el Envío</h2>
              <p>Si tenés algún problema con tu envío:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>El paquete no llegó en el tiempo estimado</li>
                <li>El paquete presenta daños</li>
                <li>Falta algún producto</li>
                <li>Recibiste un producto incorrecto</li>
              </ul>
              <p className="mt-4">
                Contactanos inmediatamente por WhatsApp y te ayudaremos a resolver la situación lo antes posible.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Importante</h2>
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Asegurate de proporcionar una dirección completa y correcta</li>
                  <li>Verificá que haya alguien disponible para recibir el paquete</li>
                  <li>Si no estás disponible, Andreani dejará un aviso para coordinar la reentrega</li>
                  <li>Los envíos no incluyen subida por escalera o izaje</li>
                </ul>
              </div>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Tenés Dudas?</h2>
              <p>
                Si tenés preguntas sobre tu envío o necesitás más información, contactanos por WhatsApp y con gusto te
                ayudaremos.
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
