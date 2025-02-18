"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { agendarCita, getCitasDisponibles } from "./actions"

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce un email válido.",
  }),
  telefono: z.string().min(9, {
    message: "El número de teléfono debe tener al menos 9 dígitos.",
  }),
  servicio: z.string({
    required_error: "Por favor, selecciona un servicio.",
  }),
  fecha: z.string({
    required_error: "Por favor, selecciona una fecha y hora.",
  }),
})

export function AgendarForm() {
  const router = useRouter()
  const [citasDisponibles, setCitasDisponibles] = useState<string[]>([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      servicio: "",
      fecha: "",
    },
  })

  useEffect(() => {
    if (fechaSeleccionada) {
      getCitasDisponibles(new Date(fechaSeleccionada)).then(setCitasDisponibles)
    }
  }, [fechaSeleccionada])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await agendarCita(values)
      if (result.success) {
        router.push(`/confirmacion?id=${result.id}`)
      } else {
        form.setError("root", { type: "manual", message: "Error al agendar la cita. Por favor, inténtalo de nuevo." })
      }
    } catch (error) {
      console.error("Error al agendar la cita:", error)
      form.setError("root", { type: "manual", message: "Error al agendar la cita. Por favor, inténtalo de nuevo." })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="telefono"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="servicio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servicio</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="corte">Corte de cabello</SelectItem>
                  <SelectItem value="tinte">Tinte</SelectItem>
                  <SelectItem value="peinado">Peinado</SelectItem>
                  <SelectItem value="tratamiento">Tratamiento capilar</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  onChange={(e) => {
                    setFechaSeleccionada(e.target.value)
                    field.onChange(e)
                  }}
                  value={field.value.split("T")[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {citasDisponibles.length > 0 && (
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <Select onValueChange={(value) => field.onChange(`${fechaSeleccionada}T${value}`)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {citasDisponibles.map((cita) => (
                      <SelectItem key={cita} value={new Date(cita).toTimeString().slice(0, 5)}>
                        {new Date(cita).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit">Agendar Cita</Button>
      </form>
    </Form>
  )
}

