"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react"
import Link from "next/link"
import { contactConfig } from "@/lib/contact-config"

const faqItems = [
  {
    question: "¿A dónde envían los productos?",
    answer:
      "Realizamos envios a todo el país. Desde Tucumán, Argentina, podemos llegar a cualquier provincia. Los tiempos de entrega varían según la ubicación y el método de envío seleccionado.",
  },
  {
    question: "¿Cuánto tiempo tarda la entrega?",
    answer:
      "El tiempo de entrega depende de la zona: Tucumán (2-3 días), provincias cercanas (3-5 días), y resto del país (5-10 días). Podés seguir tu pedido con el número de seguimiento que te proporcionamos.",
  },
  {
    question: "¿Cuál es el costo del envío?",
    answer:
      "El costo del envío depende del peso del producto y la distancia de entrega. Te proporcionaremos un presupuesto exacto una vez confirmes tu pedido.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Contáctanos por WhatsApp para detalles sobre los métodos de pago disponibles. Ofrecemos diferentes opciones para tu comodidad y procesamos tus compras de forma segura para brindarte la mejor atención personalizada.",
  },
  {
    question: "¿De dónde son los productos?",
    answer:
      "Todos nuestros productos son importados directamente desde Estados Unidos. Garantizamos autenticidad y calidad en cada artículo.",
  },
  {
    question: "¿Qué garantía tienen los productos?",
    answer:
      "Ofrecemos garantía de 12 meses desde la compra para la mayoría de productos. La garantía cubre defectos de fabricación y malfuncionamiento.",
  },
  {
    question: "¿Los productos vienen con instrucciones?",
    answer:
      "Sí, todos los productos incluyen manuales de uso. Si vienen en inglés, te proporcionamos traducciones digitales disponibles.",
  },
  {
    question: "¿Cuál es la política de devolución?",
    answer:
      "Aceptamos devoluciones dentro de 30 días de la compra. El producto debe estar en su empaque original y en perfectas condiciones.",
  },
  {
    question: "¿Cómo solicito un cambio?",
    answer:
      "Podés solicitar un cambio mediante WhatsApp, email o formulario de contacto. El cambio es gratuito si el producto tiene defecto de fábrica.",
  },
  {
    question: "¿Me devuelven el dinero?",
    answer:
      "Sí, procesamos reembolsos al mismo método de pago original dentro de 5-10 días hábiles después de recibir el producto.",
  },
  {
    question: "¿Ofrecen descuentos por compras en volumen?",
    answer:
      "Sí, contáctanos por WhatsApp para solicitar presupuestos especiales en compras al por mayor. Ofrecemos descuentos según la cantidad y el tipo de producto.",
  },
  {
    question: "¿Cómo me suscribo a las promociones?",
    answer:
      "Seguinos en Instagram @usaimportarg y TikTok @usa.importarg para enterarte de las mejores ofertas, descuentos y lanzamientos de nuevos productos.",
  },
  {
    question: "¿Tienen ofertas especiales en temporadas?",
    answer:
      "Sí, realizamos promociones especiales en fechas importantes como Black Friday, Navidad y otros eventos. Suscribite a nuestro newsletter para no perderte ninguna oferta.",
  },
]

export default function FAQsPage() {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleItem = (index: string) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((id) => id !== index) : [...prev, index]))
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Preguntas Frecuentes</h1>
            <p className="text-blue-100 text-lg max-w-2xl mx-auto">
              Encuentra respuestas rápidas a las preguntas más comunes sobre nuestros productos y servicios
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 border-l-4 border-blue-600">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <HelpCircle className="w-6 h-6 text-blue-300" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Todas las Preguntas</h2>
                </div>
              </div>

              {/* Questions List */}
              <div className="divide-y divide-gray-800">
                {faqItems.map((item, index) => {
                  const itemId = index.toString()
                  const isExpanded = expandedItems.includes(itemId)

                  return (
                    <div key={itemId} className="bg-gray-900">
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-800 transition flex items-center justify-between group"
                      >
                        <span className="font-semibold text-white group-hover:text-blue-400 transition">
                          {item.question}
                        </span>
                        <div className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-blue-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700">
                          <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">¿No encontraste lo que buscas?</h3>
              <p className="text-blue-100 mb-6">
                Nuestro equipo está disponible para ayudarte con cualquier otra pregunta
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contacto">
                  <Button className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                    Contactanos
                  </Button>
                </Link>
                <a href={`https://wa.me/${contactConfig.phone.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold">
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
