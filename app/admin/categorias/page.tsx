'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, ArrowLeft } from 'lucide-react'
import { CategoriesManagement } from '@/components/admin/categories-management'
import { verifyAdminToken, logout } from '@/app/actions/auth'

export default function CategoriesPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // === AUTH CHECK ===
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const timeoutPromise = new Promise<boolean>((resolve) => {
          setTimeout(() => {
            resolve(false)
          }, 5000)
        })

        const verifyPromise = verifyAdminToken()
        const isValid = await Promise.race([verifyPromise, timeoutPromise])

        setIsAuthenticated(isValid)
        setIsCheckingAuth(false)

        if (!isValid) {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error during auth check:', error)
        setIsAuthenticated(false)
        setIsCheckingAuth(false)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/admin')}
              title="Volver al panel principal"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">Panel Administrativo</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <CategoriesManagement />
      </main>
    </div>
  )
}
