import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"

// Force static generation
export const dynamic = "force-static"

export const metadata: Metadata = {
  title: "Política de Privacidad | USA Import",
  description: "Política de privacidad y protección de datos de USA Import",
}

export default function PoliticaPrivacidadPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">Política de Privacidad</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">1. Información que Recopilamos</h2>
              <p>
                En USA Import, recopilamos la siguiente información cuando realiza una compra o se comunica con
                nosotros:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Nombre y apellido</li>
                <li>Número de teléfono</li>
                <li>Dirección de correo electrónico</li>
                <li>Dirección de envío</li>
                <li>Información de pago (procesada de forma segura)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">2. Uso de la Información</h2>
              <p>Utilizamos su información personal para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Procesar y gestionar sus pedidos</li>
                <li>Comunicarnos con usted sobre su compra</li>
                <li>Coordinar envíos y pagos</li>
                <li>Proporcionar atención al cliente</li>
                <li>Enviar información sobre productos y promociones (solo con su consentimiento)</li>
                <li>Mejorar nuestros servicios y experiencia de usuario</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">3. Protección de Datos</h2>
              <p>
                En USA Import, nos comprometemos a proteger su información personal. Implementamos medidas de seguridad
                técnicas y organizativas para prevenir el acceso no autorizado, pérdida o alteración de sus datos.
              </p>
              <p>
                Su información de pago es procesada de manera segura y nunca almacenamos datos completos de tarjetas de
                crédito en nuestros sistemas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">4. Compartir Información</h2>
              <p>
                No vendemos, alquilamos ni compartimos su información personal con terceros, excepto cuando sea
                necesario para:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Procesar pagos (procesadores de pago autorizados)</li>
                <li>Realizar envíos (empresas de mensajería)</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">5. Cookies</h2>
              <p>
                Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación. Para más información sobre
                el uso de cookies, consulte nuestra Política de Cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">6. Sus Derechos</h2>
              <p>De acuerdo con la Ley de Protección de Datos Personales (Ley 25.326), usted tiene derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acceder a sus datos personales</li>
                <li>Rectificar información incorrecta o incompleta</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Oponerse al procesamiento de sus datos</li>
                <li>Retirar su consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">7. Retención de Datos</h2>
              <p>
                Conservamos su información personal durante el tiempo necesario para cumplir con los fines para los
                cuales fue recopilada y para cumplir con obligaciones legales y contables.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">8. Menores de Edad</h2>
              <p>
                Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente
                información personal de menores de edad sin el consentimiento de sus padres o tutores.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-black">9. Cambios en la Política</h2>
              <p>
                Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Los cambios
                serán publicados en esta página con la fecha de la última actualización.
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-lg mt-8">
              <h2 className="text-2xl font-semibold mb-4 text-black">Contacto</h2>
              <p>
                Para ejercer sus derechos o realizar consultas sobre esta política de privacidad, puede contactarnos a
                través de WhatsApp o correo electrónico disponibles en nuestra sección de Contacto.
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
