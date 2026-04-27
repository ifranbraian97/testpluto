export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // Remove non-word chars except hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+/, "") // Trim hyphens from start
    .replace(/-+$/, "") // Trim hyphens from end
}
