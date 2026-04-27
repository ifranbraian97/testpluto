"use client"

const announcements = [
  { text: "Envíos a todo el país" },
  { text: "Nuevos ingresos Maquillajes" },
  { text: "Venta Mayorista" },
]

export default function AnnouncementBar() {
  // Duplicate announcements for seamless loop
  const duplicatedAnnouncements = [...announcements, ...announcements, ...announcements, ...announcements]

  return (
    <div className="bg-foreground text-background py-2.5 overflow-hidden">
      <div className="relative flex">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {duplicatedAnnouncements.map((item, index) => (
            <div key={index} className="flex items-center gap-2 px-4">
              <span className="text-xs font-medium tracking-wider uppercase">{item.text}</span>
              <span className="text-background/30 mx-4">—</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
