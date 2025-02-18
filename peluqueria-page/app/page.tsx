import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Scissors, Clock, Phone, MapPin, Calendar } from "lucide-react"
import { prisma } from "@/lib/prisma"

const services = [
  {
    name: "Corte de cabello",
    price: "25€",
    duration: "30 min",
    description: "Corte y estilo personalizado",
  },
  {
    name: "Tinte",
    price: "50€",
    duration: "90 min",
    description: "Color profesional y cuidado del cabello",
  },
  {
    name: "Peinado",
    price: "35€",
    duration: "45 min",
    description: "Peinado para ocasiones especiales",
  },
  {
    name: "Tratamiento capilar",
    price: "40€",
    duration: "60 min",
    description: "Hidratación y reparación profunda",
  },
]

async function getProximasCitas() {
  const citas = await prisma.cita.findMany({
    where: {
      fecha: {
        gte: new Date(),
      },
    },
    orderBy: {
      fecha: "asc",
    },
    take: 5,
  })

  return citas.map((cita) => ({
    ...cita,
    fecha: cita.fecha.toLocaleString(),
  }))
}

export default async function PeluqueriaPage() {
  const proximasCitas = await getProximasCitas()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bella Peluquería</h1>
          <Button asChild>
            <Link href="/agendar">Reservar cita</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scissors className="h-5 w-5" />
                    {service.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {service.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{service.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-semibold">{service.price}</span>
                  <Button variant="outline" asChild>
                    <Link href="/agendar">Agendar</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">Próximas Citas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proximasCitas.map((cita) => (
              <Card key={cita.id}>
                <CardHeader>
                  <CardTitle>{cita.nombre}</CardTitle>
                  <CardDescription>{cita.servicio}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Fecha y hora:</strong> {cita.fecha}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6">Contacto e Información</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Teléfono: 123-456-789</p>
                <p>Email: info@bellapeluqueria.com</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Calle Principal 123, Ciudad</p>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Horarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Lunes a Viernes: 9:00 - 20:00</p>
                <p>Sábados: 10:00 - 18:00</p>
                <p>Domingos: Cerrado</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-muted mt-12">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2024 Bella Peluquería. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

