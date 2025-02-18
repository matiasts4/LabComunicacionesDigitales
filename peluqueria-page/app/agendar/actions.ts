"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"

const citaSchema = z.object({
  nombre: z.string(),
  email: z.string().email(),
  telefono: z.string(),
  servicio: z.string(),
  fecha: z.string(),
})

export async function agendarCita(data: z.infer<typeof citaSchema>) {
  const result = citaSchema.safeParse(data)

  if (!result.success) {
    return { success: false, errors: result.error.flatten() }
  }

  try {
    const cita = await prisma.cita.create({
      data: {
        ...result.data,
        fecha: new Date(result.data.fecha),
      },
    })

    return { success: true, id: cita.id }
  } catch (error) {
    console.error("Error al agendar la cita:", error)
    return { success: false, error: "Error al agendar la cita. Por favor, inténtalo de nuevo." }
  }
}

export async function getCitasDisponibles(fecha: Date) {
  const startOfDay = new Date(fecha)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(fecha)
  endOfDay.setHours(23, 59, 59, 999)

  const citasExistentes = await prisma.cita.findMany({
    where: {
      fecha: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    select: {
      fecha: true,
    },
  })

  const horasLaborales = Array.from({ length: 11 }, (_, i) => i + 9) // 9:00 AM to 7:00 PM
  const citasDisponibles = horasLaborales.flatMap((hora) => {
    const fechaHora = new Date(fecha)
    fechaHora.setHours(hora, 0, 0, 0)
    if (!citasExistentes.some((cita) => cita.fecha.getTime() === fechaHora.getTime())) {
      return [fechaHora.toISOString()]
    }
    return []
  })

  return citasDisponibles
}

