"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/app/lib/prisma";
import { ca } from "zod/locales";

const EsquemaServicio = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    descripcion: z.string().optional(),
    duracion: z.coerce.number().positive("La duración debe ser mayor a cero"),
});

export async function crearServicio(_estadoPrevio: any, formData: FormData) {
    const campos = EsquemaServicio.safeParse({
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        duracion: formData.get("duracion"),
    });

    if (!campos.success) {
        return {
            errores: campos.error.flatten().fieldErrors,
            mensaje: "Error de validación.",
        }
    };

    await prisma.servicio.create({ data: campos.data });

    revalidatePath("/servicios");
    redirect("/servicios");
}

export async function eliminarServicio(id: number) {
    try {
        await prisma.servicio.delete({ where: { id } });
        revalidatePath("/servicios");
        return { exito: true }
    } catch {
        return { exito: false, mensaje: "No se pudo eliminar el servicio." }
    }
}