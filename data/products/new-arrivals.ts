import type { Product } from "@/data/featured-products"
import { perfumeriaProducts } from "@/data/products/perfumeria"
import { maquillajeProducts } from "@/data/products/maquillaje"

export const newArrivalsProducts: Product[] = [
  // Bharara Bleu
  perfumeriaProducts.find((p) => p.slug === "bharara-bleu"),
  // Bharara Queen
  perfumeriaProducts.find((p) => p.slug === "bharara-queen"),
  // Labial Chocolate Matte Ink
  maquillajeProducts.find((p) => p.slug === "labial-chocolate-matte-ink"),
  // Blush S.F.R Colors
  maquillajeProducts.find((p) => p.slug === "blush-sfr-colors"),
  // Bharara Scarlet
  perfumeriaProducts.find((p) => p.slug === "bharara-scarlet"),
].filter(Boolean) as Product[]
