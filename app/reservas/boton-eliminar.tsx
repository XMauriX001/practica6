"use client"; 
 
import { eliminarReserva } from "@/app/actions/reservas"; 
import { useState } from "react"; 
import { botonPeligro } from "@/app/lib/estilos"; 
 
 
 
14 
 
export function BotonEliminarReserva({ id }: { id: number }) { 
  const [error, setError] = useState<string | null>(null); 
 
  async function manejarClick() { 
    const resultado = await eliminarReserva(id); 
    if (!resultado.exito) { 
      setError(resultado.mensaje ?? "Error desconocido."); 
    } 
  } 
 
  return ( 
    <div className="text-right shrink-0 ml-4"> 
      <button onClick={manejarClick} className={botonPeligro}> 
        Eliminar 
      </button> 
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>} 
    </div> 
  ); 
} 