// ARCHIVO DEPRECADO - NO USAR
// Esta sección fue eliminada completamente de la aplicación
// El sistema de ofertas ahora se maneja a través de price_offer en la base de datos

import type { Product } from "@/data/featured-products"

export const ofertasProducts: Product[] = [
  {
    id: 9001,
    name: "Combo Mayorista - 16 Productos",
    price: 20100,
    image: "/images/combo-1.jpeg",
    category: "belleza",
    slug: "combo-mayorista-16-productos",
    description: "Combo ideal para arrancar a emprender con 16 productos de maquillaje y skincare.",
    fullDescription:
      "Este combo mayorista incluye 16 productos seleccionados de alta calidad para que puedas comenzar tu emprendimiento. Incluye: Mascarilla facial, Mascarilla para puntos negros, Gloss, Paleta 8 tonos, Labial matte Karite, Corrector 2 en 1, Base líquida, Lapiz 2 en 1 karite, Delineador líquido ultra fino, Bálsamo labial, Rimel y más.",
    images: ["/images/combo-1.jpeg"],
    features: [
      "16 productos incluidos",
      "Ideal para emprendedores",
      "Productos de maquillaje y skincare",
      "Precio mayorista exclusivo",
      "Variedad de productos",
    ],
    stock: "high",
  },
  {
    id: 9002,
    name: "Super Combo Mayorista - 32 Productos",
    price: 49900,
    image: "/images/combo-2.jpeg",
    category: "belleza",
    slug: "super-combo-mayorista-32-productos",
    description: "Super combo con 32 productos de maquillaje para arrancar a emprender.",
    fullDescription:
      "El combo más completo para emprendedores! Incluye 32 productos: Mascarilla facial, Mascarilla para puntos negros, Set manicure, Base, Gloss, Paleta de sombras 8 tonos, Rimel, Rimel sin color, Delineador líquido ultra fino, Corrector 2 en 1, Lapiz labial, Iluminador 4 tonos, Neceser y mucho más.",
    images: ["/images/combo-2.jpeg"],
    features: [
      "32 productos incluidos",
      "El combo más completo",
      "Ideal para emprendedores",
      "Incluye neceser de regalo",
      "Variedad de maquillaje profesional",
    ],
    stock: "high",
  },
  {
    id: 9003,
    name: "Combo Mayorista Skincare - 25 Productos",
    price: 49900,
    image: "/images/combo-3.jpeg",
    category: "belleza",
    slug: "combo-mayorista-skincare-25-productos",
    description: "Combo especializado en skincare con 25 productos para el cuidado de la piel.",
    fullDescription:
      "Combo especializado en skincare con 25 productos de alta calidad. Incluye: Body Lotion + 25 SPF Maracuyá, Body Lotion, Set x6 pcas Manicure, Piedra Gua Sha, Roller de Jade, Mascarilla de Carbono Facial, Crema Facial Ácido Hyalurónico, Jabones Skin Clinic, Toallita de Aloe Vera, Toallitas Desmaquillante, Vincha Skincare, Serum Yara Moi, Mascarilla Facial, Mascarilla de Carbono para la Nariz y más.",
    images: ["/images/combo-3.jpeg"],
    features: [
      "25 productos de skincare",
      "Incluye Roller de Jade y Gua Sha",
      "Productos de cuidado facial",
      "Ideal para emprendedores",
      "Variedad completa de skincare",
    ],
    stock: "high",
  },
  {
    id: 63,
    name: "Placa Infrarroja",
    price: 15000,
    image: "/placa-infrarroja.jpeg",
    category: "Electrodomésticos",
    slug: "placa-infrarroja",
    description: "Placa de cocción infrarroja portátil con controles digitales y múltiples niveles de potencia.",
    fullDescription:
      "Cocina de manera eficiente y segura con esta placa de cocción infrarroja portátil. Tecnología de calentamiento infrarrojo que distribuye el calor de manera uniforme para una cocción perfecta.\n\nPanel de control digital con pantalla LED que muestra la temperatura y el tiempo de cocción. Múltiples niveles de potencia ajustables para diferentes tipos de preparaciones. Funciones preestablecidas para cocinar, freír, hervir y mantener caliente.\n\nSuperficie de cristal templado fácil de limpiar y resistente a altas temperaturas. Diseño compacto y portátil ideal para cocinas pequeñas, apartamentos, oficinas o como placa adicional. Sistema de seguridad con apagado automático y protección contra sobrecalentamiento.",
    images: ["/placa-infrarroja.jpeg"],
    features: [
      "Tecnología infrarroja",
      "Panel de control digital",
      "Pantalla LED",
      "Múltiples niveles de potencia",
      "Funciones preestablecidas",
      "Superficie de cristal templado",
      "Fácil de limpiar",
      "Apagado automático",
      "Protección contra sobrecalentamiento",
      "Diseño compacto y portátil",
    ],
  },
  {
    id: 6,
    name: "Combo Karseell",
    price: 27900,
    image: "/images/maca-hair-mask-6-1-600x600-c0de168437d9fd15d417503595588658-1024-1024.webp",
    category: "Belleza y Cuidado Personal",
    slug: "combo-karseell",
    description: "Combo completo Karseell con crema de colágeno y aceite de maca para un tratamiento capilar integral.",
    stock: "high",
    fullDescription:
      "El Combo Karseell combina lo mejor de ambos mundos: la crema de colágeno de 500ml y el aceite de maca de 50ml para un tratamiento capilar completo y profesional.\n\nLa crema de colágeno contiene aceite de argán, maca y hierbas naturales que reparan profundamente el cabello seco y dañado, proporcionando una hidratación intensa desde la primera aplicación. El aceite de maca complementa el tratamiento nutriendo, reparando y revitalizando cada hebra.\n\nJuntos, estos productos transforman el cabello en una melena suave, brillante, manejable y completamente restaurada. Ideal para todo tipo de cabello, especialmente cabello teñido, decolorado y procesado químicamente.",
    images: [
      "/images/maca-hair-mask-6-1-600x600-c0de168437d9fd15d417503595588658-1024-1024.webp",
      "/images/d-692566-mla82295728697-022025-c-1817f710c15b37bb7817503594865260-1024-1024.webp",
    ],
    features: [
      "Incluye Crema de Colágeno 500ml",
      "Incluye Aceite de Maca 50ml",
      "Tratamiento capilar completo",
      "Aceite de argán y maca",
      "Reparación profunda",
      "Hidratación intensa",
      "Resultados visibles inmediatos",
      "Ideal para todo tipo de cabello",
      "Perfecto para cabello teñido y decolorado",
      "100% original",
    ],
    quantityVariants: [
      { min: 11, max: 20, price: 26800 },
      { min: 21, max: 30, price: 25700 },
    ],
  },
  {
  name: "RAF ICE MARKER - Máquina de Hielo",
  price: 140000,
  image: "/raf-ice-maker-1.png",
  category: "electrodomesticos",
  slug: "raf-ice-marker-maquina-hielo",
  
},
]

