import { slugify } from "./slugify"

// Mapeo de IDs antiguos a nuevos IDs
const oldIdToNewId: Record<string, string> = {
  "accesorios-celular": "accesorios-para-celular",
}

export function getCategorySlug(categoryName: string): string {
  if (!categoryName) return ""
  
  const normalized = categoryName.toLowerCase().trim()
  
  // Check if it's an old ID that needs mapping
  if (oldIdToNewId[normalized]) {
    return oldIdToNewId[normalized]
  }
  
  // Fallback: slugify the name (compatible with DB categories)
  return slugify(categoryName)
}
