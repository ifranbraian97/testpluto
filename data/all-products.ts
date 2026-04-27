import type { Product } from "@/types/product"
import { tvAudioProducts } from "@/data/products/tv-audio"
import { tecnologiaProducts } from "@/data/products/tecnologia"
import { accesoriosCelularProducts } from "@/data/products/accesorios-celular"
import { electrodomesticosProducts } from "@/data/products/electrodomesticos"
import { hogarProducts } from "@/data/products/hogar"
import { seguridadProducts } from "@/data/products/seguridad"
import { scooterMotosProducts } from "@/data/products/scooter-motos"
import { bellezaProducts } from "@/data/products/belleza"
import { perfumeriaProducts } from "@/data/products/perfumeria"
import { celularesProducts } from "@/data/products/celulares"
import { vapersProducts } from "@/data/products/vapers"
import { maquillajeProducts } from "@/data/products/maquillaje"

export const homePageProducts: Product[] = [
  // Redmi A5 6/128GB
  celularesProducts.find((p) => p.slug === "redmi-a5-6-128gb"),

  // Redmi A5 3/64GB
  celularesProducts.find((p) => p.slug === "redmi-a5-3-64gb"),

  // POCO C75 8/256GB
  celularesProducts.find((p) => p.slug === "poco-c75-8-256gb"),

  // TV LUO 43"
  tvAudioProducts.find((p) => p.slug === "tv-luo-43"),

  // Skyworth 32 Pulgadas
  tvAudioProducts.find((p) => p.slug === "skyworth-32-google-tv"),

  // iPhone 17 Pro Max 512GB
  celularesProducts.find((p) => p.slug === "iphone-17-pro-max-512gb"),

  // Emaan de Lattafa
  perfumeriaProducts.find((p) => p.slug === "emaan-lattafa"),

  // Notebook HP Stream 14"
  tecnologiaProducts.find((p) => p.slug === "notebook-hp-stream"),

  // Acer Chromebook 15.6"
  tecnologiaProducts.find((p) => p.slug === "acer-chromebook-15notebook"),

  // Notebook Acer Aspire Go 15
  tecnologiaProducts.find((p) => p.slug === "notebook-acer-aspire"),

  // Notebook Lenovo IdeaPad Slim 3
  tecnologiaProducts.find((p) => p.slug === "notebook-lenovo-slim"),
].filter(Boolean) as Product[]

// Combine all products from all categories
export const allProducts: Product[] = [
  ...tvAudioProducts,
  ...tecnologiaProducts,
  ...accesoriosCelularProducts,
  ...electrodomesticosProducts,
  ...hogarProducts,
  ...seguridadProducts,
  ...scooterMotosProducts,
  ...bellezaProducts,
  ...perfumeriaProducts,
  ...celularesProducts,
  ...vapersProducts,
  ...maquillajeProducts,
]

