export interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  slug: string
  description?: string
  fullDescription?: string
  images?: string[]
  features?: string[]
  stock?: "out" | "low" | "medium" | "high"
  quantityVariants?: Array<{
    min: number
    max: number | null
    price: number
  }>
  flavorVariants?: Array<{
    id: string
    name: string
    stock: "out" | "low" | "medium" | "high"
  }>
  hasQuantityVariants?: boolean
  hasFlavorVariants?: boolean
}

import { accesoriosCelularProducts } from "@/data/products/accesorios-celular"
import { seguridadProducts } from "@/data/products/seguridad"
import { bellezaProducts } from "@/data/products/belleza"
import { tecnologiaProducts } from "@/data/products/tecnologia"
import { tvAudioProducts } from "@/data/products/tv-audio"
import { perfumeriaProducts } from "@/data/products/perfumeria"
import { celularesProducts } from "@/data/products/celulares"
import { hogarProducts } from "@/data/products/hogar"
import { electrodomesticosProducts } from "@/data/products/electrodomesticos"
import { scooterMotosProducts } from "@/data/products/scooter-motos"
import { vapersProducts } from "@/data/products/vapers"
import { maquillajeProducts } from "@/data/products/maquillaje"

export const featuredProductsList: Product[] = [
  // Aceite Karseell 100% Original
  bellezaProducts.find((p) => p.slug === "aceite-karseell-100-original"),
  // Combo Karseell
  bellezaProducts.find((p) => p.slug === "combo-karseell"),
  // JBL go4 ORIGINAL
  tvAudioProducts.find((p) => p.slug === "jbl-go4-original"),
  // Apple Watch Serie 10
  tecnologiaProducts.find((p) => p.slug === "apple-watch-serie-10"),
  // Natural Jade Beauty Roller
  bellezaProducts.find((p) => p.slug === "natural-jade-beauty-roller"),
  // Fundas de Silicone Case
  accesoriosCelularProducts.find((p) => p.slug === "fundas-silicone-case"),
  // Funda Silicone Case iPhone 17
  accesoriosCelularProducts.find((p) => p.slug === "funda-silicone-case-iphone-17"),
  // Protector de Cámara con Strass
  accesoriosCelularProducts.find((p) => p.slug === "cubre-camara-con-strass"),
  // Protector de Cámara sin Strass
  accesoriosCelularProducts.find((p) => p.slug === "cubre-camara-sin-strass"),
  // Protector de Cámara sin Strass iPhone 17
  accesoriosCelularProducts.find((p) => p.slug === "cubre-camara-sin-strass-iphone-17"),
].filter(Boolean) as Product[]

export const featuredProducts: Product[] = [
  ...bellezaProducts,
  ...accesoriosCelularProducts,
  ...seguridadProducts,
  ...tecnologiaProducts,
  ...celularesProducts,
  ...tvAudioProducts,
  ...perfumeriaProducts,
  ...hogarProducts,
  ...electrodomesticosProducts,
  ...scooterMotosProducts,
  ...vapersProducts,
  ...maquillajeProducts,
]
