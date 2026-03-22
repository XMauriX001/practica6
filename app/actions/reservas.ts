"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";

const EsquemaReserva = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  correo: z.string().email("El correo no es válido."),
  fecha: z.string().min(1, "La fecha es obligatoria."),
  servicioId: z.coerce.number({ message: "Debe seleccionar un servicio." }),
});


export async function crearReserva(_estadoPrevio: any, formData: FormData) {
  const campos = EsquemaReserva.safeParse({
    nombre: formData.get("nombre"),
    correo: formData.get("correo"),
    fecha: formData.get("fecha"),
    servicioId: formData.get("servicioId"),
  });


  if (!campos.success) {
    return {
      errores: campos.error.flatten().fieldErrors,
      mensaje: "Error de validación.",
    };
  }

  await prisma.reserva.create({
    data: {
      nombre: campos.data.nombre,
      correo: campos.data.correo,
      fecha: new Date(campos.data.fecha),
      servicioId: campos.data.servicioId,
    },
  });

  revalidatePath("/reservas");
  redirect("/reservas");
}


export async function eliminarReserva(id: number) {
  try {
    await prisma.reserva.delete({ where: { id } });
    revalidatePath("/reservas");
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo eliminar la reserva." };
  }
}