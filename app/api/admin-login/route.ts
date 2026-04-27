import { NextResponse } from "next/server"

const ADMIN_EMAIL = "usaimport@admin.com"
// Contraseña fuerte: UsaImp0rt@2025$ecure!
const ADMIN_PASSWORD_HASH = "UsaImp0rt@2025$ecure!"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Verificar credenciales
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD_HASH) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, error: "Credenciales incorrectas" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 })
  }
}
