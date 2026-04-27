'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  supabaseConnection: boolean
  supabaseUrl: string
  tablesExist: {
    products: boolean
    quantityVariants: boolean
    flavorVariants: boolean
  }
  tableCounts?: {
    products: number
    quantityVariants: number
    flavorVariants: number
  }
  realtimeEnabled: boolean
  rlsEnabled: boolean
  productsCount: number
  checks: Array<{
    name: string
    status: boolean
    message?: string
  }>
  errors: string[]
  message: string
}

export default function HealthCheckPage() {
  const [health, setHealth] = useState<HealthCheck | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const runHealthCheck = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/health')
      const data: HealthCheck = await response.json()
      setHealth(data)
    } catch (error) {
      console.error('Health check failed:', error)
      setHealth({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        supabaseConnection: false,
        supabaseUrl: 'unknown',
        tablesExist: {
          products: false,
          quantityVariants: false,
          flavorVariants: false,
        },
        realtimeEnabled: false,
        rlsEnabled: false,
        productsCount: 0,
        checks: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        message: 'Failed to run health check'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runHealthCheck()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-6 w-6 text-green-600" />
      case 'degraded':
        return <AlertCircle className="h-6 w-6 text-yellow-600" />
      case 'unhealthy':
        return <XCircle className="h-6 w-6 text-red-600" />
      default:
        return <AlertCircle className="h-6 w-6 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-50 border-green-200'
      case 'degraded':
        return 'bg-yellow-50 border-yellow-200'
      case 'unhealthy':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="mx-auto max-w-4xl">
        <Card className={`p-8 border-2 ${health ? getStatusColor(health.status) : 'bg-gray-50'}`}>
          <div className="flex items-center gap-4 mb-6">
            {isLoading ? (
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            ) : health ? (
              getStatusIcon(health.status)
            ) : null}
            <div>
              <h1 className="text-3xl font-bold">Sistema Health Check</h1>
              <p className="text-muted-foreground">
                {health ? health.message : 'Cargando...'}
              </p>
            </div>
          </div>

          {health && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <p className="text-lg font-semibold capitalize">{health.status}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Supabase URL</p>
                  <p className="text-sm font-mono break-all">{health.supabaseUrl}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Productos</p>
                  <p className="text-lg font-semibold">{health.productsCount}</p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Hora del Check</p>
                  <p className="text-xs font-mono">{new Date(health.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Checks Details */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Verificaciones Detalladas</h2>
                <div className="space-y-3">
                  {health.checks.map((check, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-background p-4 rounded-lg">
                      {check.status ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{check.name}</p>
                        {check.message && (
                          <p className="text-sm text-muted-foreground">{check.message}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        check.status
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {check.status ? 'OK' : 'FAIL'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Counts */}
              {health.tableCounts && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Conteos de Base de Datos</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg ${health.tablesExist.products ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="text-sm font-medium">Productos</p>
                      <p className="text-2xl font-bold">{health.tableCounts.products}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${health.tablesExist.quantityVariants ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="text-sm font-medium">Variantes Cantidad</p>
                      <p className="text-2xl font-bold">{health.tableCounts.quantityVariants}</p>
                    </div>
                    <div className={`p-4 rounded-lg ${health.tablesExist.flavorVariants ? 'bg-green-50' : 'bg-red-50'}`}>
                      <p className="text-sm font-medium">Variantes Sabor</p>
                      <p className="text-2xl font-bold">{health.tableCounts.flavorVariants}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Errors */}
              {health.errors.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4 text-red-600">Errores Encontrados</h2>
                  <div className="space-y-2 bg-red-50 p-4 rounded-lg border border-red-200">
                    {health.errors.map((error, idx) => (
                      <p key={idx} className="text-sm text-red-700">
                        • {error}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {health.status !== 'healthy' && (
                <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">Recomendaciones:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>Accede a tu dashboard de Supabase</li>
                    <li>Ve a SQL Editor</li>
                    <li>Copia el contenido de <code className="bg-blue-100 px-2 py-1 rounded">scripts/001_create_tables.sql</code></li>
                    <li>Ejecuta el SQL</li>
                    <li>Habilita Realtime para las 3 tablas en Replication settings</li>
                    <li>Vuelve a ejecutar este health check</li>
                  </ol>
                </div>
              )}
            </>
          )}

          <Button onClick={runHealthCheck} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verificando...
              </>
            ) : (
              'Ejecutar Health Check'
            )}
          </Button>
        </Card>
      </div>
    </div>
  )
}
