"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useHomepageData } from "@/hooks/use-homepage-data"

const fallbackBanners = [
  {
    id: "1",
    title: "Desde el mundo",
    subtitle: "Para vos",
    description: "CELULARES AL MEJOR PRECIO",
    image_url: "/images/banner-1-desktop.webp",
    image_key: "banner-1",
    link: "/categoria/celulares",
    position: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },

]

export default function Banner() {
  const { banners: dbBanners, loading } = useHomepageData()
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Usar banners de la BD o fallback a banners estáticos
  const banners = dbBanners && dbBanners.length > 0 ? dbBanners : fallbackBanners

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [banners.length])

  return (
    <section className="relative w-full bg-foreground overflow-hidden">
      <div className="relative w-full aspect-[4/5] md:aspect-[21/9]">
        {banners.map((slide: any, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image_url || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/30 to-transparent" />
          </div>
        ))}

        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg" suppressHydrationWarning>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-background leading-tight tracking-tight">
                {banners[currentSlide]?.title || "Bienvenido"}
                {banners[currentSlide]?.subtitle && (
                  <span className="block text-accent mt-2">{banners[currentSlide].subtitle}</span>
                )}
              </h1>
              {banners[currentSlide]?.description && (
                <p className="mt-4 text-xs md:text-sm text-background/70 max-w-md tracking-widest uppercase">
                  {banners[currentSlide].description}
                </p>
              )}
              <Link
                href={banners[currentSlide]?.link || "/categoria/celulares"}
                className="mt-8 inline-flex items-center gap-3 bg-background text-foreground px-8 py-4 rounded-none font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm tracking-wide uppercase"
              >
                Explorar productos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-0.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "w-10 bg-background" : "w-4 bg-background/30"
              }`}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
