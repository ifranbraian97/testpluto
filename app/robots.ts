import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/image",   // 🔥 CLAVE: bloquea edge image optimizer
          "/_next/",        // assets internos
          "/admin/",
          "/dashboard/",
          "/checkout/",
          "/carrito/",
        ],
      },
    ],
    sitemap: "https://usaimport.com.ar/sitemap.xml",
  }
}
