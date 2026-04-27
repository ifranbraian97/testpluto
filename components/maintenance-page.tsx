"use client"

import { Wrench, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MaintenancePage() {
  const whatsappNumber = "5493814032351"
  const whatsappMessage = "Hola! Vi que están en mantenimiento. Quisiera consultar sobre productos."
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        {/* Logo/Brand */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary via-accent to-secondary">
              <Wrench className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
          Pronto Volvemos
        </h1>

        {/* Subheading */}
        <p className="mb-6 text-xl text-muted-foreground md:text-2xl">Estamos en mantenimiento</p>

        {/* Description */}
        <p className="mb-12 text-lg leading-relaxed text-foreground/80">
          Estamos trabajando para mejorar tu experiencia de compra.
          <br />
          Mientras tanto, podés contactarnos por WhatsApp para consultas o pedidos.
        </p>

        {/* WhatsApp CTA Button */}
        <div className="flex justify-center">
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-[#25D366] to-[#128C7E] text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#25D366]/20"
          >
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-6"
            >
              <MessageCircle className="h-6 w-6 transition-transform group-hover:rotate-12" />
              <span>Contactar por WhatsApp</span>
            </a>
          </Button>
        </div>

        {/* Footer Text */}
        <p className="mt-16 text-sm text-muted-foreground">
          <span className="font-semibold text-secondary">USA Import</span> - Desde el mundo para vos
        </p>
      </div>
    </div>
  )
}
