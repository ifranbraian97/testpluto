import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { ArrowRight, Smartphone, Sparkles, Wind, Cable, Palette, Truck, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Requisitos Mayorista | USA Import",
  description: "Conoce los requisitos para iniciar como mayorista con USA Import. Diferentes opciones para comenzar a comprar al por mayor.",
}

const wholesaleOptions = [
  {
    id: 1,
    icon: Smartphone,
    title: "Electro Mayor",
    description: "3 unidades en electro mayores a $16.000 cada uno (parlante, TV, celulares, etc.)",
    href: "/categoria/celulares",
    buttonText: "Ver Electro",
    emoji: "📱🔊🎧",
  },
  {
    id: 2,
    icon: Sparkles,
    title: "Perfumes Arabes",
    description: "3 unidades en perfumes arabes (o productos mayores a $20.000)",
    href: "/categoria/perfumeria",
    buttonText: "Ver Perfumes",
    emoji: "🇸🇦",
  },
  {
    id: 3,
    icon: Wind,
    title: "Vapers",
    description: "$50.000 en vapers",
    href: "/categoria/vapers",
    buttonText: "Ver Vapers",
    emoji: "♨️🚬",
  },
  {
    id: 4,
    icon: Cable,
    title: "Accesorios Celulares",
    description: "$50.000 en accesorios para celulares (fundas, cargadores, cables, etc.)",
    href: "/categoria/accesorios-celular",
    buttonText: "Ver Accesorios",
    emoji: "🔋",
  },
  {
    id: 5,
    icon: Palette,
    title: "Combo Maquillaje",
    description: "Combo de Maquillaje completo",
    href: "/categoria/maquillaje",
    buttonText: "Ver Maquillaje",
    emoji: "💄",
  },
]

export default function RequisitosPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-primary py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Image
              src="/images/logo-usa-import-navidad.webp"
              alt="USA IMPORT"
              width={180}
              height={90}
              className="h-16 md:h-20 w-auto mx-auto brightness-0 invert mb-6"
            />
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
              Inicia como mayorista aqui
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Para iniciar como mayorista con nosotros debes elegir una de las siguientes formas:
            </p>
          </div>
        </section>

        {/* Options Section */}
        <section className="py-12 md:py-16 bg-secondary/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wholesaleOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <div
                    key={option.id}
                    className="bg-background border border-border rounded-xl p-6 flex flex-col hover:shadow-lg hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {option.title}
                        </h3>
                        <span className="text-xl">{option.emoji}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-6 flex-grow">
                      {option.description}
                    </p>
                    
                    <Link href={option.href}>
                      <Button 
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        {option.buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  Beneficios de ser mayorista
                </h2>
              </div>
              
              <div className="space-y-4 text-muted-foreground">
                <p className="text-base leading-relaxed">
                  Con una sola primera compra de cualquiera de estas opciones ya formaras parte de nuestros clientes mayorista.
                </p>
                <p className="text-base leading-relaxed font-medium text-foreground">
                  Luego podras seguir comprando desde una sola unidad a precio por mayor.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium mb-1">
                      Envios a todo el pais
                    </p>
                    <p className="text-muted-foreground text-sm">
                      En nuestra web <span className="font-semibold text-primary">usaimport.com.ar</span> podras armar tu carrito para que nuestro personal de despacho pueda enviartelo. 🚚🇦🇷🇺🇸
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-10 text-center">
              <p className="text-muted-foreground mb-4">
                ¿Listo para comenzar?
              </p>
              <Link href="/">
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full"
                >
                  Explorar productos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
