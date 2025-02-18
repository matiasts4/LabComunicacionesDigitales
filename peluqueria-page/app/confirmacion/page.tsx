import { notFound } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function getCitaDetails(id: string) {
  const cita = await prisma.cita.findUnique({
    where: { id },
  })

  if (!cita) {
    return null
  }

  return {
    id: cita.id,
    nombre: cita.nombre,
    servicio: cita.servicio,
    fecha: cita.fecha.toLocaleString(),
  }
}

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const id = searchParams.id

  if (!id) {
    notFound()
  }

  const citaDetails = await getCitaDetails(id)

  if (!citaDetails) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Confirmación de Cita</h1>
      <Card>
        <CardHeader>
          <CardTitle>Detalles de tu cita</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Número de cita:</strong> {citaDetails.id}
          </p>
          <p>
            <strong>Nombre:</strong> {citaDetails.nombre}
          </p>
          <p>
            <strong>Servicio:</strong> {citaDetails.servicio}
          </p>
          <p>
            <strong>Fecha y hora:</strong> {citaDetails.fecha}
          </p>
        </CardContent>
      </Card>
      <div className="mt-6">
        <Button asChild>
          <Link href="/">Volver a la página principal</Link>
        </Button>
      </div>
    </div>
  )
}

