import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"

// Force static generation
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Política de Cookies | USA Import",
  description: "Política de uso de cookies del sitio web de USA Import",
}

export default function PoliticaCookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Política de Cookies</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Qué son las Cookies?</h2>
              <p>
                Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio
                web. Estas cookies permiten que el sitio web recuerde sus acciones y preferencias durante un período de
                tiempo, para que no tenga que volver a configurarlas cada vez que regrese al sitio o navegue de una
                página a otra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">¿Cómo Utilizamos las Cookies?</h2>
              <p>En USA Import utilizamos cookies para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Mantener su carrito de compras durante su visita</li>
                <li>Recordar sus preferencias de navegación</li>
                <li>Analizar cómo los usuarios interactúan con nuestro sitio</li>
                <li>Mejorar la funcionalidad y el rendimiento del sitio</li>
                <li>Personalizar contenido y experiencias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Tipos de Cookies que Utilizamos</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">1. Cookies Esenciales</h3>
                  <p>
                    Son necesarias para el funcionamiento básico del sitio web. Permiten navegar por el sitio y utilizar
                    sus funciones esenciales, como acceder a áreas seguras y mantener el carrito de compras.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">2. Cookies de Rendimiento</h3>
                  <p>
                    Recopilan información sobre cómo los visitantes utilizan el sitio web, como qué páginas visitan con
                    más frecuencia. Esta información nos ayuda a mejorar el funcionamiento del sitio.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">3. Cookies de Funcionalidad</h3>
                  <p>
                    Permiten que el sitio web recuerde las elecciones que realiza (como su idioma preferido) y
                    proporcionan funciones mejoradas y más personales.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-black">4. Cookies de Terceros</h3>
                  <p>
                    Utilizamos servicios de terceros como Google Analytics para analizar el tráfico del sitio. Estos
                    servicios pueden establecer sus propias cookies.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Gestión de Cookies</h2>
              <p>
                Puede controlar y/o eliminar las cookies según desee. Puede eliminar todas las cookies que ya están en
                su dispositivo y puede configurar la mayoría de los navegadores para evitar que se coloquen.
              </p>
              <p className="mt-4">Para gestionar las cookies en su navegador:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Google Chrome:</strong> Configuración {">"} Privacidad y seguridad {">"} Cookies y otros datos
                  de sitios
                </li>
                <li>
                  <strong>Mozilla Firefox:</strong> Opciones {">"} Privacidad y seguridad {">"} Cookies y datos del
                  sitio
                </li>
                <li>
                  <strong>Safari:</strong> Preferencias {">"} Privacidad {">"} Cookies y datos de sitios web
                </li>
                <li>
                  <strong>Microsoft Edge:</strong> Configuración {">"} Privacidad, búsqueda y servicios {">"} Cookies y
                  permisos del sitio
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Cookies de Redes Sociales</h2>
              <p>
                Nuestro sitio incluye botones de redes sociales que pueden establecer cookies. Estas cookies son
                controladas por las respectivas redes sociales y no por USA Import. Le recomendamos revisar las
                políticas de privacidad de estas plataformas para obtener más información.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">Actualización de esta Política</h2>
              <p>
                Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en nuestras prácticas o
                por otras razones operativas, legales o reglamentarias.
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">Más Información</h2>
              <p>
                Si tiene preguntas sobre nuestra política de cookies, puede contactarnos a través de los canales
                disponibles en nuestra sección de Contacto.
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Última actualización: {new Date().toLocaleDateString("es-AR")}
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
