import type React from "react"
import type { Metadata } from "next"
import { Inter, Oswald } from "next/font/google"
import { CartProvider } from "@/lib/cart-context"
import { contactConfig } from "@/lib/contact-config"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "USA Import - Importador Directo de Productos Americanos | Tucumán",
    template: "%s | USA Import - Importador Directo",
  },
  description:
    "USA Import es tu importador directo de productos americanos en Tucumán, Argentina. Tecnología, belleza, accesorios, vapers y más. Envíos a toda la región. Tienda de confianza desde 2020.",
  keywords: [
    "importador directo",
    "productos americanos",
    "USA Import",
    "Tucumán",
    "Argentina",
    "tecnología",
    "belleza",
    "accesorios",
    "vapers",
    "tienda online",
    "importación directa",
    "productos premium",
    "envíos Tucumán",
  ],
  authors: [{ name: "USA Import" }],
  creator: "USA Import",
  publisher: "USA Import",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.usaimport.com.ar"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "USA Import - Importador Directo de Productos Americanos | Tucumán",
    description:
      "Importador directo de productos americanos en Tucumán. Tecnología, belleza, accesorios, vapers y más de calidad premium.",
    url: "https://www.usaimport.com.ar",
    siteName: "USA Import",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "USA Import - Importador Directo en Tucumán",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "USA Import - Importador Directo | Tucumán",
    description: "Productos americanos de calidad. Importación directa a Tucumán, Argentina.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.webp", type: "image/webp" },
      { url: "/favicon-16x16.jpg", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.jpg", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.jpg", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  generator: "v0.app",
  other: {
    "geo:country": "AR",
    "geo:region": "AR-TUC",
    "geo:placename": "Tucumán",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: contactConfig.company.name,
              image: "https://www.usaimport.com.ar/og-image.jpg",
              description: contactConfig.company.description,
              address: {
                "@type": "PostalAddress",
                addressLocality: contactConfig.location.city,
                addressRegion: contactConfig.location.addresses[0].fullAddress,
                addressCountry: contactConfig.location.country,
              },
              sameAs: [contactConfig.social.instagram, contactConfig.social.tiktok],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: contactConfig.phone.full,
                contactType: "Sales",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
