"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WholesaleBanner() {
  return (
    <section className="w-full bg-primary py-8 md:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
          <Image
            src="/logo-usa-banner.webp"
            alt="USA IMPORT"
            width={120}
            height={60}
            className="h-12 md:h-14 w-auto brightness-0 invert"
          />
          
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-primary-foreground">
              Inicia como mayorista aqui
            </h2>
            <p className="text-primary-foreground/80 text-sm mt-1">
              Conoce los requisitos para ser parte de nuestros clientes mayoristas
            </p>
          </div>

          <Link href="/requisitos">
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 rounded-full"
            >
              Ver requisitos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}


