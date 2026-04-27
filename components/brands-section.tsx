"use client"

import Image from "next/image"
import Link from "next/link"
import { Instagram } from "lucide-react"

const brands = [
  {
    name: "POCO",
    logo: "/images/2-slide-1756159911044-2156321348-991b4acd298967b38adee45e03c079f81756159914-1920-1920.webp",
  },
  {
    name: "EPSON",
    logo: "/images/2-slide-1756159911043-4736451289-50c2acc8547517d20f328b76ba557cc71756159912-1920-1920.webp",
  },
  {
    name: "SAMSUNG",
    logo: "/images/2-slide-1756159911044-7892679438-53323e9d8a7953ca9fc622dd2d7ba6f71756159913-1920-1920.webp",
  },
  {
    name: "Karseell",
    logo: "/images/2-slide-1756159911044-8415061215-4482167bd942c57dc76d622f6959847d1756159913-1920-1920.webp",
  },
  {
    name: "Lattafa",
    logo: "/images/2-slide-1756159911044-5555905834-30daa902f0b82141cb9b7ebf6a7d91ed1756159913-1920-1920.webp",
  },
  {
    name: "Victoria's Secret",
    logo: "/images/2-slide-1756159911044-2128555267-f0abfa2f1c1313c54df9db3fea6a54551756159914-1920-1920.webp",
  },
  {
    name: "JVC",
    logo: "/images/2-slide-1756159911044-3020163343-f21ebeebb814abec1ba74f5a6f0fc5391756159915-1920-1920.webp",
  },
  {
    name: "Xiaomi",
    logo: "/images/2-slide-1756159911044-2156321348-991b4acd298967b38adee45e03c079f81756159914-1920-1920.webp",
  },
]

export default function BrandsSection() {
  return (
    <section className="w-full bg-neutral-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Marcas que trabajamos</h2>
          <div className="mt-4 h-1 w-16 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6 mb-16">
          {brands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="aspect-square flex items-center justify-center bg-white rounded-xl p-3 hover:shadow-md transition-shadow"
            >
              <Image
                src={brand.logo || "/placeholder.svg"}
                alt={brand.name}
                width={80}
                height={80}
                className="w-full h-full object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-500">Seguinos en redes</p>
          <Link
            href="https://instagram.com/usaimportarg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-black hover:text-primary transition-colors"
          >
            <Instagram className="w-6 h-6" />
            <span className="text-lg font-semibold">@usaimportarg</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
