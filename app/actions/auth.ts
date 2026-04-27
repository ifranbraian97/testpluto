"use server"

import { cookies } from "next/headers"
import { randomBytes, createHmac } from "crypto"

declare global {
  var adminTokens: { [key: string]: { email: string; expiresAt: number } } | undefined
}

// Simple credentials for demo (in production, use Supabase Auth or proper auth system)
// Change these credentials to your desired admin credentials
const ADMIN_EMAIL = "plutotec@admin.com"
const ADMIN_PASSWORD = "Plut0tec@2026$ecure!" // Change this to a secure password

interface LoginResult {
  success: boolean
  error?: string
  token?: string
}

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    console.log('[login] Attempt with email:', email)
    
    // Validate credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log('[login] Invalid credentials')
      return {
        success: false,
        error: "Email o contraseña incorrectos",
      }
    }

    // Create a signed token (HMAC) so sessions persist across serverless instances.
    // Requires `ADMIN_JWT_SECRET` to be set in Vercel environment variables.
    const secret = process.env.ADMIN_JWT_SECRET
    console.log('[login] ADMIN_JWT_SECRET configured:', !!secret)
    
    if (!secret) {
      console.warn('[login] ADMIN_JWT_SECRET is not set. Falling back to in-memory tokens (not recommended on serverless).')
      const token = randomBytes(32).toString("hex")
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

      const cookieStore = await cookies()
      try {
        cookieStore.set("admin_token", token, {
          httpOnly: true,
          secure: true, // Always HTTPS in Vercel
          sameSite: "lax",
          path: "/",
          maxAge: 24 * 60 * 60, // 24 hours in seconds
        })
        console.log('[login] In-memory token set in cookie')
      } catch (e) {
        console.error('[login] Error setting cookie:', e)
      }

      global.adminTokens = global.adminTokens || {}
      global.adminTokens[token] = {
        email,
        expiresAt: expiresAt.getTime(),
      }

      console.log('[login] In-memory token created and stored')

      return {
        success: true,
        token,
      }
    }

    const expiresAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60 // seconds
    const payload = Buffer.from(JSON.stringify({ email, exp: expiresAt })).toString('base64url')
    const signature = createHmac('sha256', secret).update(payload).digest('base64url')
    const signed = `${payload}.${signature}`

    console.log('[login] JWT created:', `${signed.substring(0, 30)}...`)
    console.log('[login] Payload:', Buffer.from(payload, 'base64url').toString('utf8'))

    const cookieStore = await cookies()
    try {
      cookieStore.set("admin_token", signed, {
        httpOnly: true,
        secure: true, // Always HTTPS in Vercel
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60, // 24 hours in seconds
      })
      console.log('[login] JWT saved to cookie')
    } catch (e) {
      console.error('[login] Error setting cookie:', e)
      return {
        success: false,
        error: "Error al guardar la sesión",
      }
    }

    return {
      success: true,
      token: signed,
    }
  } catch (error) {
    console.error("[login] Error:", error)
    return {
      success: false,
      error: "Error al procesar la solicitud",
    }
  }
}

export async function logout(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete("admin_token")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

export async function verifyAdminToken(): Promise<boolean> {
  try {
    console.log('[verifyAdminToken] 🔍 Starting verification...')
    
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) {
      console.log('[verifyAdminToken] ❌ No token in cookies')
      // List all cookies for debugging
      const allCookies = cookieStore.getAll()
      console.log('[verifyAdminToken] Available cookies:', allCookies.map(c => c.name).join(', '))
      return false
    }

    console.log('[verifyAdminToken] ✓ Token found:', `${token.substring(0, 30)}...`)

    // If ADMIN_JWT_SECRET present, verify HMAC-signed token
    const secret = process.env.ADMIN_JWT_SECRET
    if (!secret) {
      console.log('[verifyAdminToken] ⚠️  No ADMIN_JWT_SECRET in env, trying in-memory tokens')
    } else {
      console.log('[verifyAdminToken] ✓ ADMIN_JWT_SECRET is configured')
    }
    
    if (secret && token.includes('.')) {
      console.log('[verifyAdminToken] 🔐 Verifying HMAC-signed token...')
      const parts = token.split('.')
      
      if (parts.length !== 2) {
        console.log('[verifyAdminToken] ❌ Invalid token format, parts:', parts.length)
        return false
      }
      
      const [payloadB64, signature] = parts
      try {
        const expected = createHmac('sha256', secret).update(payloadB64).digest('base64url')
        const sigMatch = signature === expected
        console.log('[verifyAdminToken] Signature match:', sigMatch ? '✓' : '❌')
        
        if (!sigMatch) {
          console.log('[verifyAdminToken] ❌ Signature mismatch')
          console.log('[verifyAdminToken] Expected:', expected.substring(0, 20))
          console.log('[verifyAdminToken] Got:', signature.substring(0, 20))
          return false
        }

        const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8')
        const payload = JSON.parse(payloadJson)
        const { exp, email } = payload
        const now = Math.floor(Date.now() / 1000)
        const isExpired = !(exp && exp > now)
        
        console.log('[verifyAdminToken] Token payload - email:', email, 'expires in:', (exp - now) / 3600, 'hours')
        console.log('[verifyAdminToken] Token valid:', !isExpired ? '✓' : '❌')
        
        return !isExpired
      } catch (e: any) {
        console.error('[verifyAdminToken] ❌ HMAC verification failed:', e.message)
        return false
      }
    }

    // Fallback: in-memory token (not reliable on serverless)
    console.log('[verifyAdminToken] 📦 Checking in-memory token storage...')
    if (global.adminTokens && global.adminTokens[token]) {
      const tokenData = global.adminTokens[token]
      const isValid = tokenData.expiresAt > Date.now()
      console.log('[verifyAdminToken] In-memory token valid:', isValid ? '✓' : '❌')
      return isValid
    }

    console.log('[verifyAdminToken] ❌ No valid token found')
    return false
  } catch (error: any) {
    console.error('[verifyAdminToken] ❌ Exception:', error.message)
    return false
  }
}

export async function getAdminUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_token")?.value

    if (!token) return null

    const secret = process.env.ADMIN_JWT_SECRET
    if (secret && token.includes('.')) {
      try {
        const [payloadB64, signature] = token.split('.')
        const expected = createHmac('sha256', secret).update(payloadB64).digest('base64url')
        if (signature !== expected) return null
        const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf8')
        const data = JSON.parse(payloadJson)
        if (data.exp && data.exp > Math.floor(Date.now() / 1000)) {
          return { email: data.email }
        }
      } catch (e) {
        return null
      }
    }

    if (!global.adminTokens || !global.adminTokens[token]) return null

    const tokenData = global.adminTokens[token]
    if (tokenData.expiresAt > Date.now()) {
      return {
        email: tokenData.email,
      }
    }

    return null
  } catch (error) {
    console.error("Get admin user error:", error)
    return null
  }
}
