"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { login } from "@/app/actions/auth"
import { AlertCircle, Loader } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await login(email, password)
      
      if (result.success) {
        router.push("/admin")
      } else {
        setError(result.error || "Error al iniciar sesión")
      }
    } catch (err) {
      setError("Error al conectar con el servidor")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Panel Admin</h1>
            <p className="text-sm text-black/60">Inicia sesión para acceder</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-black/70 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border border-black/10 rounded-xl bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-black/70 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-black/10 rounded-xl bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                required
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full mt-6 bg-black text-white py-3 rounded-xl font-semibold hover:bg-black/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-black/10 text-center">
            <p className="text-xs text-black/50">
              ¿Olvidó su contraseña?{" "}
              <Link href="/" className="text-black font-semibold hover:underline">
                Volver al inicio
              </Link>
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          <p className="text-xs text-white/70 text-center">
            Este panel es solo para administradores autorizados
          </p>
        </div>
      </div>
    </div>
  )
}
