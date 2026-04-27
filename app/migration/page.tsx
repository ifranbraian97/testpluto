'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { migrateProductsToSupabase } from '@/app/actions/migrate-products'

interface MigrationResult {
  success: boolean
  insertedCount: number
  errorCount: number
  totalProducts: number
  skippedDuplicates: number
  variantErrors: number
  errors?: Array<{ slug: string; error: string }>
  message?: string
}

export default function MigrationPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<MigrationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleMigrate = async () => {
    if (
      !confirm(
        'Esta acción importará todos los productos a Supabase.\n\n¿Continuar? Esta acción solo debería ejecutarse una vez.\n\nSi algunos productos ya existen, serán omitidos automáticamente.'
      )
    ) {
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const migrationResult = await migrateProductsToSupabase()
      setResult(migrationResult)

      if (!migrationResult.success) {
        setError(`Migración completada con advertencias: ${migrationResult.errorCount} errores`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error durante la migración')
    } finally {
      setIsLoading(false)
    }
  }

  const getProgressPercentage = () => {
    if (!result) return 0
    return Math.round(((result.insertedCount + result.skippedDuplicates) / result.totalProducts) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="mx-auto max-w-3xl">
        <Card className="p-8">
          <h1 className="mb-2 text-3xl font-bold">Migración de Productos</h1>
          <p className="mb-6 text-muted-foreground">Importar todos los productos locales a Supabase</p>

          {error && (
            <div className="mb-6 flex gap-3 rounded-lg bg-red-100 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-800 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {result && (
            <div className="mb-6 space-y-4 rounded-lg border p-6">
              <div className="flex items-center gap-2">
                {result.success ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-600">Migración Exitosa</h3>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-yellow-600">Migración Completada con Problemas</h3>
                  </>
                )}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium">Progreso</span>
                  <span className="text-muted-foreground">{getProgressPercentage()}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${result.success ? 'bg-green-600' : 'bg-yellow-600'}`}
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              </div>

              {/* Summary table */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{result.totalProducts}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground">Insertados</p>
                  <p className="text-2xl font-bold text-green-600">{result.insertedCount}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-muted-foreground">Duplicados</p>
                  <p className="text-2xl font-bold text-blue-600">{result.skippedDuplicates}</p>
                </div>
                <div className={`p-4 rounded-lg border ${result.errorCount > 0 ? 'bg-red-50 border-red-200' : 'bg-background'}`}>
                  <p className="text-sm text-muted-foreground">Errores</p>
                  <p className={`text-2xl font-bold ${result.errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {result.errorCount}
                  </p>
                </div>
                <div className="bg-background p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Variantes (Avisos)</p>
                  <p className="text-2xl font-bold">{result.variantErrors}</p>
                </div>
              </div>

              {/* Message */}
              {result.message && (
                <div className="bg-background p-4 rounded-lg border">
                  <p className="text-sm">{result.message}</p>
                </div>
              )}

              {/* Errors list */}
              {result.errors && result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-semibold text-red-600 mb-3">Errores encontrados:</p>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {result.errors.map((err, idx) => (
                      <div key={idx} className="text-sm">
                        <p className="font-medium text-red-700">{err.slug}</p>
                        <p className="text-red-600 text-xs">{err.error}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success message */}
              {result.success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-700">
                    ✅ Todos los productos fueron migrados exitosamente. Ahora puedes:
                  </p>
                  <ul className="text-sm text-green-700 mt-2 list-disc list-inside space-y-1">
                    <li>Acceder al <a href="/admin" className="underline font-medium">panel de administración</a></li>
                    <li>Crear, editar o eliminar productos</li>
                    <li>Ver cambios en tiempo real en todos los navegadores</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {!result && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Requisitos Previos:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Tablas SQL creadas en Supabase (ver <a href="/health" className="underline font-medium">Health Check</a>)</li>
                <li>Realtime habilitado para las 3 tablas</li>
                <li>RLS políticas configuradas (público para desarrollo)</li>
              </ol>
              <p className="text-sm text-blue-700 mt-3">
                ¿No sabes por dónde empezar? Ejecuta el <a href="/health" className="underline font-medium">Health Check</a> para diagnosticar.
              </p>
            </div>
          )}

          <Button
            onClick={handleMigrate}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Migrando ({result ? `${Math.round((result.insertedCount / result.totalProducts) * 100)}%` : '...'})
              </>
            ) : (
              'Iniciar Migración'
            )}
          </Button>

          <p className="mt-6 text-xs text-muted-foreground">
            ⚠️ Esta acción importará todos los productos locales a Supabase. Se omitirán automáticamente los duplicados basándose en el slug del producto.
          </p>
        </Card>
      </div>
    </div>
  )
}
