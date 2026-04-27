'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, LogOut } from 'lucide-react'
import { ProductForm } from '@/components/admin/product-form-clean'
import { ProductTable } from '@/components/admin/product-table'
import { HomepageConfigPanel } from '@/components/admin/homepage-config-panel'
import { VariantManagementPanel } from '@/components/admin/variant-management-panel'
import OrdersListPanel from '@/components/admin/orders-list-panel'
import CompanyConfigPanel from '@/components/admin/company-config-panel'
import type { AdminProductWithVariants } from '@/types/admin'
import { PRODUCTS_PER_PAGE } from '@/types/admin'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/app/actions/admin-products'
import { verifyAdminToken, logout } from '@/app/actions/auth'

type FormState = {
  isOpen: boolean
  product: AdminProductWithVariants | null
  isNew: boolean
}

export default function AdminPage() {
  const router = useRouter()
  
  // === ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONALS ===
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  
  // === PRODUCTOS ===
  const [products, setProducts] = useState<AdminProductWithVariants[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()

  const [formState, setFormState] = useState<FormState>({
    isOpen: false,
    product: null,
    isNew: false,
  })

  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // === AUTH CHECK - Before any conditionals ===
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('[Auth] Starting token verification...')
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise<boolean>((resolve) => {
          setTimeout(() => {
            console.log('[Auth] Timeout: Auth check took too long, assuming not authenticated')
            resolve(false)
          }, 5000)
        })

        const verifyPromise = verifyAdminToken()
        
        const isValid = await Promise.race([verifyPromise, timeoutPromise])
        
        console.log('[Auth] Token verification result:', isValid)
        setIsAuthenticated(isValid)
        setIsCheckingAuth(false)

        if (!isValid) {
          console.log('[Auth] User not authenticated, redirecting to login')
          router.push('/login')
        } else {
          console.log('[Auth] User authenticated, showing admin panel')
        }
      } catch (error) {
        console.error('[Auth] Error during auth check:', error)
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

  // === PRODUCTOS - Funciones (BEFORE conditionals to avoid hook violations) ===
  const loadProducts = useCallback(async (page: number = 1) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await getProducts(page, PRODUCTS_PER_PAGE, searchQuery, selectedCategory)

      setProducts(result.items)
      setTotalPages(result.totalPages)
      setCurrentPage(result.page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando productos')
    } finally {
      setIsLoading(false)
    }
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    loadProducts(1)
  }, [loadProducts])

  const handleNewProduct = useCallback(() => {
    const emptyProduct: AdminProductWithVariants = {
      id: 0,
      name: '',
      price: 0,
      category: 'Celulares',
      slug: '',
      stock: 'high',
    }

    setFormState({
      isOpen: true,
      product: emptyProduct,
      isNew: true,
    })
    setFormError(null)
  }, [])

  const handleEditProduct = useCallback((product: AdminProductWithVariants) => {
    setFormState({
      isOpen: true,
      product,
      isNew: false,
    })
    setFormError(null)
  }, [])

  const handleCloseForm = useCallback(() => {
    setFormState({
      isOpen: false,
      product: null,
      isNew: false,
    })
    setFormError(null)
  }, [])

  const handleSaveProduct = useCallback(
    async (product: AdminProductWithVariants) => {
      if (!formState.product) return

      setFormLoading(true)
      setFormError(null)

      try {
        if (formState.isNew) {
          const { id, created_at, updated_at, ...createData } = product

          const cleanData = Object.fromEntries(
            Object.entries(createData).map(([k, v]) => {
              // Asegurarse que images sea un array válido
              if (k === 'images' && (!Array.isArray(v) || v.length === 0)) {
                return [k, undefined]
              }
              return [k, v === null ? undefined : v]
            })
          )

          await createProduct(cleanData as any)
        } else {
          const { id, created_at, updated_at, ...updateData } = product

          const cleanData = Object.fromEntries(
            Object.entries(updateData).map(([k, v]) => {
              // Asegurarse que images sea un array válido
              if (k === 'images' && (!Array.isArray(v) || v.length === 0)) {
                return [k, undefined]
              }
              return [k, v === null ? undefined : v]
            })
          )

          await updateProduct({
            id: product.id,
            ...cleanData,
          } as any)
        }

        await loadProducts(currentPage)
        handleCloseForm()
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Error guardando producto')
      } finally {
        setFormLoading(false)
      }
    },
    [formState, currentPage, loadProducts, handleCloseForm]
  )

  const handleDeleteProduct = useCallback(
    async (productId: number) => {
      setFormLoading(true)
      setFormError(null)

      try {
        await deleteProduct(productId)
        await loadProducts(currentPage)
        handleCloseForm()
      } catch (err) {
        setFormError(err instanceof Error ? err.message : 'Error eliminando producto')
      } finally {
        setFormLoading(false)
      }
    },
    [currentPage, loadProducts, handleCloseForm]
  )

  // === CONDITIONAL RENDERING - After all hooks ===
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black/60">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Panel de Control</h1>
                <p className="text-sm text-muted-foreground mt-1">Gestión de productos</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/admin/categorias')}
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Gestionar Categorías
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="variants">Variantes</TabsTrigger>
              <TabsTrigger value="orders">Órdenes</TabsTrigger>
              <TabsTrigger value="company">Empresa</TabsTrigger>
              <TabsTrigger value="homepage">Inicio</TabsTrigger>
            </TabsList>

            {/* === PRODUCTOS TAB === */}
            <TabsContent value="products" className="space-y-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-full px-4 py-2 border rounded-lg"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
                <Button
                  onClick={handleNewProduct}
                  disabled={isLoading}
                  className="gap-2 shrink-0"
                >
                  ➕ Nuevo Producto
                </Button>
              </div>

              <Card className="overflow-hidden">
                <div className="p-6 space-y-6">
                  <ProductTable
                    products={products}
                    isLoading={isLoading}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between gap-4 pt-4">
                      <div className="text-sm text-muted-foreground">
                        Página {currentPage} de {totalPages}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadProducts(currentPage - 1)}
                          disabled={currentPage === 1 || isLoading}
                          className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-muted"
                        >
                          ← Anterior
                        </button>
                        <button
                          onClick={() => loadProducts(currentPage + 1)}
                          disabled={currentPage === totalPages || isLoading}
                          className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-muted"
                        >
                          Siguiente →
                        </button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                      {error}
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* === VARIANTS TAB === */}
            <TabsContent value="variants">
              <VariantManagementPanel />
            </TabsContent>

            {/* === ORDERS TAB === */}
            <TabsContent value="orders">
              <OrdersListPanel />
            </TabsContent>

            {/* === COMPANY CONFIG TAB === */}
            <TabsContent value="company">
              <CompanyConfigPanel />
            </TabsContent>

            {/* === HOMEPAGE CONFIG TAB === */}
            <TabsContent value="homepage">
              <HomepageConfigPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modal del formulario */}
      {formState.isOpen && formState.product && (
        <ProductForm
          product={formState.product}
          isNew={formState.isNew}
          isLoading={formLoading}
          error={formError}
          onClose={handleCloseForm}
          onSave={handleSaveProduct}
          onDelete={handleDeleteProduct}
        />
      )}
    </>
  )
}
