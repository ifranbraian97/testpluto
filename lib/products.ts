export interface Product {
  id: string
  name: string
  price: number
  image: string
  specs: string[]
  category: string
}

export const products: Product[] = [
  // Redmi A5 Series
  {
    id: "redmi-a5-6-128",
    name: "Redmi A5 6/128GB",
    price: 162000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Redmi%20A5%206-128gb.png-txNN63JHRqE8uN5KG51uiWSRj8mQT9.webp",
    specs: [
      "6GB RAM / 128GB Storage",
      'Pantalla LCD 6.88"',
      "Cámara frontal 8MP",
      "Batería 5200mAh",
      "Dispositivo liberado",
    ],
    category: "Tecnología",
  },
  {
    id: "redmi-a5-3-64",
    name: "Redmi A5 3/64GB",
    price: 147000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Redmi%20A5%203-64gb.png-3D3YmV0Mqijy5tD80RjeETz3q8F41Q.webp",
    specs: [
      "3GB RAM / 64GB Storage",
      'Pantalla 6.88" 1640x720',
      "Frecuencia 120Hz",
      "Brillo 450 nits",
      "Contraste 1500:1",
    ],
    category: "Tecnología",
  },

  // Redmi 15C Series
  {
    id: "redmi-15c-8-256",
    name: "Redmi 15C 8/256GB",
    price: 270000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Redmi%2015c%208-256GB-mriJk7Sqy9SEOdrhdtpkMEAoVbxQqz.png",
    specs: [
      "8GB RAM / 256GB Storage",
      'Pantalla IPS LCD 6.9"',
      "Resolución 720x1600 px",
      "Tasa refresco 120Hz",
      "Gorilla Glass 3",
    ],
    category: "Tecnología",
  },
  {
    id: "redmi-15c-4-128",
    name: "Redmi 15C 4/128GB",
    price: 239000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Redmi%2015c%204-128gb-76wghUomvTV9AG5VamFy9nv7QtciBi.png",
    specs: ["4GB RAM / 128GB Storage", "Android 15, HyperOS 2", 'Pantalla 6.9" 120Hz', "Gorilla Glass 3", "Dual SIM"],
    category: "Tecnología",
  },

  // Redmi 14C Series
  {
    id: "redmi-14c-16-256",
    name: "Redmi 14C 16/256GB",
    price: 240000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/REDMI%2014C%2016-256gb.png-jI0WJprzxVYTOoYSdXLMcVSeUGOHf2.webp",
    specs: [
      "16GB RAM / 256GB Storage",
      "MediaTek Helio G85",
      "CPU Cortex-A75 2.0GHz",
      "GPU Mali-G52 MC2",
      "LPDDR4X y eMMC 5.1",
    ],
    category: "Tecnología",
  },
  {
    id: "redmi-14c-8-256",
    name: "Redmi 14C 8/256GB",
    price: 232000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Redmi%2014c%208-256gb.png-beIALCsI7HP0ijYLQGoz6sG1hcd6Sy.webp",
    specs: [
      "8GB RAM / 256GB Storage",
      "CPU Helio G81 Ultra",
      'Pantalla 6.88" 720x1640',
      "Cámara 50MP + 2MP",
      "Batería 5160mAh",
    ],
    category: "Tecnología",
  },
  {
    id: "redmi-14c-4-128",
    name: "Redmi 14C 4/128GB",
    price: 197000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Redmi%2014c%204-128gb.png-VtMSUlq21VKZw3H5j4lCNNhAwgZrCX.webp",
    specs: [
      "4GB RAM / 128GB Storage",
      "MediaTek Helio G85",
      "Procesamiento 12nm",
      "GPU Mali-G52 MC2",
      "LPDDR4X y eMMC 5.1",
    ],
    category: "Tecnología",
  },

  // POCO Series
  {
    id: "poco-c75-8-256",
    name: "POCO C75 8/256GB",
    price: 210000,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/POCO%20C75%208-256gb.png-F7JoZSFsJTFjiVcmwzNI0h9b1qTcfh.webp",
    specs: [
      "8GB RAM / 256GB Storage",
      'Pantalla LCD IPS 6.88" 120Hz',
      "Mediatek Helio G81-Ultra",
      "Cámara 50MP con HDR",
      "Cámara frontal 13MP",
    ],
    category: "Tecnología",
  },

  // Nokia Classic
  {
    id: "nokia-210",
    name: "Nokia 210",
    price: 33500,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NOKIA%20210.png-5dx01UhyErPIzj8yD9pHbW4Zwalpq1.jpeg",
    specs: ['Pantalla QVGA 2.4"', "16MB almacenamiento", "Radio FM", "Cámara VGA", "Batería 1020mAh"],
    category: "Tecnología",
  },
  {
    id: "nokia-150",
    name: "Nokia 150",
    price: 32500,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NOKIA%20150.png-pp3fNV7sveDDXs0oYwIHF49iMhoUv7.avif",
    specs: ['Pantalla QVGA 2.4"', "Cámara VGA", "Batería 1020mAh", "Radio FM, Linterna", "Reproductor MP3"],
    category: "Tecnología",
  },
]

export function getProductsByCategory() {
  const categories = new Map<string, Product[]>()

  products.forEach((product) => {
    if (!categories.has(product.category)) {
      categories.set(product.category, [])
    }
    categories.get(product.category)?.push(product)
  })

  return categories
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
