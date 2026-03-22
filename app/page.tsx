import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function PaginaInicio() {
  const [totalServicios, totalReservas] = await Promise.all([
    prisma.servicio.count(),
    prisma.reserva.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-1">Bienvenido</h1>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-xs text-gray-400 uppercase mb-1">Servicios</p>
          <p className="text-3xl font-semibold">{totalServicios}</p>
        </div>
        <div className="border rounded-lg p-6 bg-white">
          <p className="text-xs text-gray-400 uppercase mb-1">Reservas</p>
          <p className="text-3xl font-semibold">{totalReservas}</p>
        </div>
      </div>
      <Link href="/servicios/nuevo" className="bg-black text-white px-4 py-2 rounded text-sm">
        Agregar servicio
      </Link>
    </div>
  );
} 