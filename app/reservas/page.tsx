import { prisma } from "@/app/lib/prisma"; 
import Link from "next/link"; 
import { BotonEliminarReserva } from "./boton-eliminar"; 
import { tarjeta } from "@/app/lib/estilos"; 
 
const etiquetaEstado: Record<string, string> = { 
  pendiente: "bg-yellow-50 text-yellow-700 border-yellow-200", 
  confirmada: "bg-green-50 text-green-700 border-green-200", 
  cancelada: "bg-gray-100 text-gray-500 border-gray-200", 
}; 
 
export default async function PaginaReservas() { 
  const reservas = await prisma.reserva.findMany({ 
    orderBy: { fecha: "asc" }, 
    include: { servicio: true }, 
  }); 
 
  return ( 
    <div> 
      <div className="flex items-center justify-between mb-6"> 
        <h1 className="text-xl font-semibold">Reservas</h1> 
        <Link 
          href="/reservas/nueva" 
          className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors" 
        > 
 
          Nueva reserva 
        </Link> 
      </div> 
 
      {reservas.length === 0 ? ( 
        <p className="text-sm text-gray-400">No hay reservas registradas.</p> 
      ) : ( 
        <ul className="space-y-3"> 
          {reservas.map((reserva) => ( 
            <li 
              key={reserva.id} 
              className={`${tarjeta} flex items-start justify-between`} 
            > 
              <div> 
                <p className="font-medium text-sm">{reserva.nombre}</p> 
                <p className="text-xs text-gray-400 mt-0.5">{reserva.correo}</p> 
                <p className="text-xs text-gray-500 mt-1"> 
                  {reserva.servicio.nombre} —{" "} 
                  {new Date(reserva.fecha).toLocaleString("es-SV")} 
                </p> 
                <span 
                  className={`inline-block mt-2 text-xs px-2 py-0.5 rounded border ${ 
                    etiquetaEstado[reserva.estado] ?? etiquetaEstado.pendiente 
                  }`} 
                > 
                  {reserva.estado} 
                </span> 
              </div> 
              <BotonEliminarReserva id={reserva.id} /> 
            </li> 
          ))} 
        </ul> 
      )} 
    </div> 
  ); 
}