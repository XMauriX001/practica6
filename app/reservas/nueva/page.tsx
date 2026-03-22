import { prisma } from "@/app/lib/prisma";
import { FormularioReserva } from "./formulario";

export default async function PaginaNuevaReserva() {
    const servicios = await prisma.servicio.findMany({
        orderBy: { nombre: "asc" },
    });

    return (
        <div className="max-w-md">
            <h1 className="text-xl font-semibold mb-6">Nueva reserva</h1>
            <FormularioReserva servicios={servicios} />
        </div>
    );
} 