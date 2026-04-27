'use client'

import React, { useState, useEffect } from 'react'
import { getCompanyConfig, updateCompanyConfig } from '@/app/actions/orders'
import { CompanyConfig } from '@/types/order'

export default function CompanyConfigPanel() {
  const [config, setConfig] = useState<CompanyConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getCompanyConfig()

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.data) {
        setConfig(result.data)
      }
    } catch (err) {
      console.error('Error loading config:', err)
      setError(err instanceof Error ? err.message : 'Error loading config')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CompanyConfig, value: any) => {
    if (config) {
      setConfig({ ...config, [field]: value })
    }
  }

  const handlePaymentMethodsChange = (index: number, field: string, value: string) => {
    if (config) {
      const methods = [...config.payment_methods]
      methods[index] = { ...methods[index], [field]: value }
      setConfig({ ...config, payment_methods: methods })
    }
  }

  const addPaymentMethod = () => {
    if (config) {
      setConfig({
        ...config,
        payment_methods: [
          ...config.payment_methods,
          { name: 'Nuevo Método', description: '' },
        ],
      })
    }
  }

  const removePaymentMethod = (index: number) => {
    if (config) {
      setConfig({
        ...config,
        payment_methods: config.payment_methods.filter((_, i) => i !== index),
      })
    }
  }

  const handleSave = async () => {
    if (!config) return

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await updateCompanyConfig(config)

      if (result.error) {
        setError(result.error)
        return
      }

      setSuccess('✅ Configuración guardada exitosamente')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Error saving config:', err)
      setError(err instanceof Error ? err.message : 'Error saving config')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500">Cargando configuración...</p>
      </div>
    )
  }

  if (!config) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <p className="text-red-600 font-semibold">Error: No se pudo cargar la configuración</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Encabezado */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⚙️ Configuración de la Empresa</h1>
        <p className="text-gray-600">
          Actualiza la información de tu empresa que aparecerá en los PDFs y facturas
        </p>
      </div>

      {/* Mensajes */}
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg border border-green-300">
          <p>{success}</p>
        </div>
      )}

      {/* Información General */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Información General</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre Comercial *
            </label>
            <input
              type="text"
              value={config.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre Legal
            </label>
            <input
              type="text"
              value={config.company_legal_name || ''}
              onChange={(e) => handleInputChange('company_legal_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={config.company_email}
              onChange={(e) => handleInputChange('company_email', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              value={config.company_phone || ''}
              onChange={(e) => handleInputChange('company_phone', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Sitio Web
            </label>
            <input
              type="url"
              value={config.company_website || ''}
              onChange={(e) => handleInputChange('company_website', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Logo URL
            </label>
            <input
              type="url"
              value={config.company_logo_url || ''}
              onChange={(e) => handleInputChange('company_logo_url', e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ID Fiscal / RUT
            </label>
            <input
              type="text"
              value={config.tax_id || ''}
              onChange={(e) => handleInputChange('tax_id', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Símbolo Moneda
            </label>
            <input
              type="text"
              value={config.currency_symbol}
              onChange={(e) => handleInputChange('currency_symbol', e.target.value)}
              maxLength={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Código Moneda
            </label>
            <input
              type="text"
              value={config.currency_code}
              onChange={(e) => handleInputChange('currency_code', e.target.value)}
              maxLength={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📍 Dirección</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Calle"
            value={config.address_street || ''}
            onChange={(e) => handleInputChange('address_street', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Ciudad"
            value={config.address_city || ''}
            onChange={(e) => handleInputChange('address_city', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Provincia/Estado"
            value={config.address_state || ''}
            onChange={(e) => handleInputChange('address_state', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Código Postal"
            value={config.address_postal_code || ''}
            onChange={(e) => handleInputChange('address_postal_code', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="País"
            value={config.address_country || ''}
            onChange={(e) => handleInputChange('address_country', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-2"
          />
        </div>
      </div>

      {/* Información Bancaria */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🏦 Información Bancaria</h2>

        <textarea
          placeholder="Datos para transferencias: Banco, Titular, Número de Cuenta, CUIT..."
          value={config.bank_info || ''}
          onChange={(e) => handleInputChange('bank_info', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
        />
      </div>

      {/* Métodos de Pago */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">💳 Métodos de Pago</h2>
          <button
            onClick={addPaymentMethod}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            + Agregar Método
          </button>
        </div>

        <div className="space-y-4">
          {config.payment_methods.map((method, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  placeholder="Nombre del método"
                  value={method.name}
                  onChange={(e) => handlePaymentMethodsChange(index, 'name', e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={() => removePaymentMethod(index)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                >
                  Eliminar
                </button>
              </div>

              <input
                type="text"
                placeholder="Descripción"
                value={method.description}
                onChange={(e) => handlePaymentMethodsChange(index, 'description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Políticas */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📜 Políticas</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Política de Devoluciones
            </label>
            <textarea
              placeholder="Explica tu política de devoluciones y cambios..."
              value={config.return_policy || ''}
              onChange={(e) => handleInputChange('return_policy', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Términos y Condiciones
            </label>
            <textarea
              placeholder="Términos y condiciones de compra..."
              value={config.terms_conditions || ''}
              onChange={(e) => handleInputChange('terms_conditions', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Botón Guardar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`w-full py-4 rounded-lg font-bold text-white text-lg transition ${
            saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {saving ? '⏳ Guardando...' : '💾 Guardar Configuración'}
        </button>
      </div>
    </div>
  )
}
