import { prisma } from "@/app/lib/prisma";
import Link from "next/link";
import {BotonEliminarServicio} from "./boton-eliminar";
import { tarjeta } from "@/app/lib/estilos";

export default async function PaginaServicios() {
    const servicios = await prisma.servicio.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { reservas: true } } },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold">Servicios</h1>

                10

                <Link href="/servicios/nuevo" className="bg-black text-white px-4 py-2 rounded text-sm">
                    Agregar servicio
                </Link>
            </div>
            <ul className='space-y-3'>
                {servicios.map((servicio) => (
                    <li key={servicio.id} className={`${tarjeta} flex items-center justify-between`}>
                        <div>
                            <p className='font-medium text-sm'>{servicio.nombre}</p>
                            <p className='text-xs text-gray-400'>{servicio.duracion} min —
                                {servicio._count.reservas} reserva(s)</p>
                        </div>
                        <BotonEliminarServicio id={servicio.id} />
                    </li>
                ))}
            </ul>
        </div>
    );
} 