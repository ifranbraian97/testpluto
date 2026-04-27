import Image from "next/image"
import Link from "next/link"
import { Instagram, Mail, Phone, MapPin } from "lucide-react"
import { contactConfig } from "@/lib/contact-config"

export default function Footer() {
  const paymentMethods = [
    { name: "Visa", src: "/payment-methods/visa.png" },
    { name: "Mastercard", src: "/payment-methods/mastercard.png" },
    { name: "Maestro", src: "/payment-methods/maestro.png" },
    { name: "American Express", src: "/payment-methods/amex.png" },
    { name: "Cabal", src: "/payment-methods/cabal.png" },
    { name: "Tarjeta Naranja", src: "/payment-methods/naranja.png" },
    { name: "Nativa", src: "/payment-methods/nativa.png" },
    { name: "Pago Fácil", src: "/payment-methods/pagofacil.png" },
    { name: "Rapipago", src: "/payment-methods/rapipago.png" },
  ]

  const shippingMethods = [{ name: "Andreani", src: "/shipping-methods/andreani.png" }]

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo-usa-import-navidad.webp"
                alt="USA IMPORT"
                width={200}
                height={100}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm text-background/60 leading-relaxed mb-6">{contactConfig.company.description}</p>
            <div className="flex items-center gap-4">
              <Link
                href={contactConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-background/5 text-background/60 hover:bg-background/10 hover:text-background transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href={contactConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-background/5 text-background/60 hover:bg-background/10 hover:text-background transition-all"
                aria-label="TikTok"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-background/80 mb-6">
              Atención al Cliente
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/preguntas-frecuentes", label: "Preguntas Frecuentes" },
                { href: "/como-comprar", label: "Cómo Comprar" },
                { href: "/envios", label: "Información de Envíos" },
                { href: "/cambios-devoluciones", label: "Cambios y Devoluciones" },
                { href: "/garantia", label: "Garantía" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/50 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-background/80 mb-6">Legal</h3>
            <ul className="space-y-3">
              {[
                { href: "/terminos-condiciones", label: "Términos y Condiciones" },
                { href: "/politica-privacidad", label: "Política de Privacidad" },
                { href: "/politica-cookies", label: "Política de Cookies" },
                { href: "/defensa-consumidor", label: "Defensa del Consumidor" },
                { href: "/arrepentimiento", label: "Botón de Arrepentimiento" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-background/50 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-background/80 mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`https://wa.me/${contactConfig.phone.whatsapp}`}
                  className="flex items-center gap-3 text-sm text-background/50 hover:text-background transition-colors"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  {contactConfig.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="flex items-center gap-3 text-sm text-background/50 hover:text-background transition-colors"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  {contactConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/50">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {contactConfig.location.city}, {contactConfig.location.country}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-xs text-background/40 uppercase tracking-widest mb-4 text-center md:text-left">
                Medios de Pago
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                {paymentMethods.map((method) => (
                  <div key={method.name} className="bg-background rounded px-2 py-1">
                    <Image
                      src={method.src || "/placeholder.svg"}
                      alt={method.name}
                      width={40}
                      height={24}
                      className="h-5 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs text-background/40 uppercase tracking-widest mb-4 text-center md:text-right">
                Envíos
              </p>
              <div className="flex items-center justify-center md:justify-end gap-2">
                {shippingMethods.map((method) => (
                  <div key={method.name} className="bg-background rounded px-3 py-1">
                    <Image
                      src={method.src || "/placeholder.svg"}
                      alt={method.name}
                      width={60}
                      height={24}
                      className="h-5 w-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/40">
          <p>© {new Date().getFullYear()} USA Import. Todos los derechos reservados.</p>
          <p>
            Desarrollado por{" "}
            <Link
              href="https://dualitydomain.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors"
            >
              Duality Domain
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
