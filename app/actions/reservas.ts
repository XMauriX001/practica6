"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { ca } from "zod/locales";

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
  // Obtener el servicio
  const servicio = await prisma.servicio.findUnique({
    where: { id: campos.data.servicioId },
  });

  if (!servicio) {
    return {
      errores: {},
      mensaje: "Servicio no encontrado.",
    };
  }

  // Obtener la fecha inicial y final
  const fechaInicio = new Date(campos.data.fecha);
  const fechaFin = new Date(fechaInicio.getTime() + servicio.duracion * 60000);

  // Obtener las reservas existentes
  const reservasExistentes = await prisma.reserva.findMany({
    where: {
      servicioId: campos.data.servicioId,
      estado: {
        not: "cancelada",
      },
    },
    include: {
      servicio: true,
    },
  });

  for (const reserva of reservasExistentes) {
    const reservaInicio = new Date(reserva.fecha);
    const reservaFin = new Date(reservaInicio.getTime() + reserva.servicio.duracion * 60000);

    const conflicto =
      (fechaInicio >= reservaInicio && fechaInicio < reservaFin) ||
      (fechaFin > reservaInicio && fechaFin <= reservaFin) ||
      (fechaInicio <= reservaInicio && fechaFin >= reservaFin);

    if (conflicto) {
      return {
        errores: {
          fecha: ["Ya existe una reserva para este horario."],
        },
        mensaje: "Error de validación.",
      }
    }
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

export async function cancelarReserva(id: number) {
  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id },
    });

    if (!reserva) {
      return { exito: false, mensaje: "Reserva no encontrada." };
    }

    if (reserva.estado === "cancelada") {
      return { exito: false, mensaje: "La reserva ya está cancelada." };
    }

    await prisma.reserva.update({
      where: { id },
      data: { estado: "cancelada" },
    });

    revalidatePath("/reservas");
    return { exito: true };
  } catch {
    return { exito: false, mensaje: "No se pudo cancelar la reserva." };
  }
}

export async function confirmarReserva(id: number) {
  try {
    // Obtener la reserva que se quiere confirmar
    const reserva = await prisma.reserva.findUnique({
      where: { id },
      include: { servicio: true },
    });

    if (!reserva) {
      return { exito: false, mensaje: "Reserva no encontrada." };
    }

    // Calcular el rango de tiempo de esta reserva
    const fechaInicio = new Date(reserva.fecha);
    const fechaFin = new Date(
      fechaInicio.getTime() + reserva.servicio.duracion * 60000
    );

    // Buscar otras reservas confirmadas para el mismo servicio
    const reservasConflictivas = await prisma.reserva.findMany({
      where: {
        servicioId: reserva.servicioId,
        estado: "confirmada",
        id: { not: id },
      },
      include: {
        servicio: true,
      },
    });

    // Verificar si hay conflicto de horario
    for (const otraReserva of reservasConflictivas) {
      const reservaInicio = new Date(otraReserva.fecha);
      const reservaFin = new Date(
        reservaInicio.getTime() + otraReserva.servicio.duracion * 60000
      );

      // Hay conflicto si los rangos se traslapan
      const hayConflicto =
        (fechaInicio >= reservaInicio && fechaInicio < reservaFin) ||
        (fechaFin > reservaInicio && fechaFin <= reservaFin) ||
        (fechaInicio <= reservaInicio && fechaFin >= reservaFin);

      if (hayConflicto) {
        return {
          exito: false,
          mensaje: "Ya existe otra reserva confirmada en este horario.",
        };
      }
    }

    await prisma.reserva.update({
      where: { id },
      data: { estado: "confirmada" },

    });
    revalidatePath("/reservas");
    return { exito: true };
  }
  catch {
    return { exito: false, mensaje: "No se pudo confirmar la reserva." }
  }
}