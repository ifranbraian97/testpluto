'use client';

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { usePromoBanner } from "@/hooks/use-promo-banner"

export default function PromoBanner() {
  const { banner, loading } = usePromoBanner();

  if (loading || !banner) {
    return null; // Don't show section if loading or no banner
  }

  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link href={banner.redirect_link} className="group block relative overflow-hidden rounded-3xl bg-neutral-100">
          <div className="relative aspect-[21/9] md:aspect-[21/7]">
            <Image
              src={banner.image_url || "/placeholder.svg"}
              alt={banner.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 md:px-16 max-w-xl">
                <span className="inline-block text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider mb-2">
                  Colección Exclusiva
                </span>
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">{banner.title}</h3>
                <p className="mt-3 text-sm md:text-base text-white/80 max-w-md hidden md:block">
                  Descubrí fragancias únicas importadas directamente
                </p>
                <div className="mt-4 md:mt-6 inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                  Ver colección
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
