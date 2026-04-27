'use client'

import Image from "next/image"
import Link from "next/link"
import { LogOut, LayoutDashboard, ShoppingCart } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { logout } from "@/app/actions/auth"

interface AdminHeaderProps {
  onLogout?: () => Promise<void>
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout()
    } else {
      await logout()
    }
    router.push("/login")
  }

  const isOrdersPage = pathname.includes("/admin/orders")
  const isMainPage = pathname === "/admin"

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/admin" className="flex-shrink-0 flex items-center">
            <Image
              src="/images/logo-usa-import-navidad.webp"
              alt="USA IMPORT"
              width={180}
              height={90}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Title and Nav Links (center/right) */}
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                href="/admin"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isMainPage
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Panel
              </Link>

              <Link
                href="/admin/orders"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isOrdersPage
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80 text-foreground"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Órdenes
              </Link>
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
