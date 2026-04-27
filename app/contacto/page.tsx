"use client"

import type React from "react"
import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MessageCircle, Phone, Mail, MapPin, Instagram, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { contactConfig } from "@/lib/contact-config"

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    asunto: "",
    mensaje: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const validateOnlyLetters = (value: string) => {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)
  }

  const validateOnlyNumbers = (value: string) => {
    return /^[0-9]*$/.test(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const message =
      `*NUEVO CONTACTO - USA IMPORT TUCUMÁN*%0A%0A` +
      `*Nombre:* ${formData.nombre}%0A` +
      `*Email:* ${formData.email}%0A` +
      `*Teléfono:* ${formData.telefono}%0A` +
      `*Asunto:* ${formData.asunto}%0A%0A` +
      `*Mensaje:*%0A${formData.mensaje}`

    const whatsappUrl = `https://wa.me/${contactConfig.phone.whatsapp}?text=${message}`

    window.open(whatsappUrl, "_blank")
    setSubmitted(true)

    setTimeout(() => {
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        asunto: "",
        mensaje: "",
      })
      setSubmitted(false)
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "nombre" && !validateOnlyLetters(value)) {
      return
    }

    if (name === "telefono" && !validateOnlyNumbers(value)) {
      return
    }

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-slate-900">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold mb-2 text-slate-900">Envianos tu consulta</h2>
                <p className="text-slate-600 mb-6">Te responderemos en el menor tiempo posible</p>

                {submitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-green-900 mb-2">¡Consulta enviada!</h3>
                    <p className="text-green-700">
                      Serás redirigido a WhatsApp para continuar con tu consulta. ¡Gracias!
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Label htmlFor="nombre" className="text-slate-700 font-semibold">
                        Nombre completo *
                      </Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        minLength={2}
                        value={formData.nombre}
                        onChange={handleChange}
                        className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-slate-700 font-semibold">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefono" className="text-slate-700 font-semibold">
                        Teléfono *
                      </Label>
                      <Input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        required
                        minLength={8}
                        maxLength={15}
                        value={formData.telefono}
                        onChange={handleChange}
                        className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                      />
                    </div>

                    <div>
                      <Label htmlFor="asunto" className="text-slate-700 font-semibold">
                        Asunto *
                      </Label>
                      <Input
                        id="asunto"
                        name="asunto"
                        type="text"
                        required
                        value={formData.asunto}
                        onChange={handleChange}
                        placeholder="Consulta sobre productos"
                        className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mensaje" className="text-slate-700 font-semibold">
                        Mensaje *
                      </Label>
                      <Textarea
                        id="mensaje"
                        name="mensaje"
                        required
                        value={formData.mensaje}
                        onChange={handleChange}
                        placeholder="Escribí tu consulta aquí..."
                        rows={5}
                        className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500 text-black"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-6 text-lg font-semibold transition-all hover:shadow-lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Enviar por WhatsApp
                    </Button>

                    <p className="text-sm text-slate-500 text-center">
                      Tu consulta será enviada directamente a nuestro WhatsApp
                    </p>
                  </form>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-6 border-l-4 border-red-600">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-red-600 p-3 rounded-full">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-red-900">Ubicación</h3>
                </div>
                <p className="text-red-900 font-semibold">
                  {contactConfig.location.city}, {contactConfig.location.country}
                </p>
                <p className="text-red-800 text-sm mt-2">Envios a todo el país</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-600 p-3 rounded-full">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-green-900">WhatsApp</h3>
                </div>
                <a
                  href={`https://wa.me/${contactConfig.phone.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 font-semibold hover:text-green-800 transition text-lg"
                >
                  {contactConfig.phone.display}
                </a>
                <p className="text-green-800 text-sm mt-2">Respuestas rápidas durante horarios</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 p-3 rounded-full">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900">Teléfono</h3>
                </div>
                <a
                  href={`tel:${contactConfig.phone.tel}`}
                  className="text-blue-700 font-semibold hover:text-blue-800 transition text-lg"
                >
                  {contactConfig.phone.display}
                </a>
                <p className="text-blue-800 text-sm mt-2">Llamadas de lunes a sábado</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-600 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-purple-900">Email</h3>
                </div>
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="text-purple-700 font-semibold hover:text-purple-800 transition"
                >
                  {contactConfig.email}
                </a>
                <p className="text-purple-800 text-sm mt-2">Respuesta en 24 horas</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-blue-600">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-7 h-7 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">Horarios de atención</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-semibold text-slate-700">Lunes a Sábado:</span>
                  <span className="text-blue-600 font-bold">9:00 - 20:00 hs</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-100 rounded-lg">
                  <span className="font-semibold text-slate-700">Domingo:</span>
                  <span className="text-slate-600 font-bold">Cerrado</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 mt-6">Consultá por envíos y atención fuera de horarios</p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 border-t-4 border-pink-600">
              <div className="flex items-center gap-3 mb-6">
                <Instagram className="w-7 h-7 text-pink-600" />
                <h2 className="text-2xl font-bold text-slate-900">Seguinos en redes</h2>
              </div>
              <p className="text-slate-600 mb-6">Encontrá ofertas especiales, novedades y promociones exclusivas</p>
              <div className="space-y-3">
                <Link
                  href={contactConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition font-semibold"
                >
                  <Instagram className="w-5 h-5" />
                  @usaimportarg
                </Link>
                <Link
                  href={contactConfig.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  @usa.importarg
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Link
        href={`https://wa.me/${contactConfig.phone.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-xl transition-all hover:scale-110 z-50 animate-pulse"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
      </Link>

      <Footer />
    </>
  )
}
