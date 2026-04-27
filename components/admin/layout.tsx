'use client'

import type React from 'react'
import { memo } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, LogOut } from 'lucide-react'

interface AdminLayoutProps {
  children: React.ReactNode
  searchValue: string
  onSearchChange: (value: string) => void
  onAddNew: () => void
  onLogout?: () => void
  title?: string
  subtitle?: string
  isLoading?: boolean
}

/**
 * Layout reutilizable para el panel de administración
 * Componente presentacional sin lógica de negocio
 */
const AdminLayout = memo(function AdminLayout({
  children,
  searchValue,
  onSearchChange,
  onAddNew,
  onLogout,
  title = 'Panel de Administración',
  subtitle = 'Gestión de productos y contenido',
  isLoading,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            </div>
            {onLogout && (
              <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Salir
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  className="pl-10 w-full"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Add Button */}
            <Button
              onClick={onAddNew}
              disabled={isLoading}
              className="gap-2 shrink-0"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        {/* Content Card */}
        <Card className="overflow-hidden">
          {children}
        </Card>
      </div>
    </div>
  )
})

export { AdminLayout }
