"use client"; 
 
import { useActionState } from "react"; 
import { useFormStatus } from "react-dom"; 
import { crearServicio } from "@/app/actions/servicios"; 
import { input, label, botonPrimario } from "@/app/lib/estilos"; 
 
const estadoInicial = { errores: {} as Record<string, string[]>, mensaje: "" }; 
 
function BotonEnviar() { 
  const { pending } = useFormStatus(); 
  return ( 
    <button type="submit" disabled={pending} className={botonPrimario}> 
      {pending ? "Guardando..." : "Crear servicio"} 
    </button> 
  ); 
} 
 
export default function PaginaNuevoServicio() { 
  const [estado, accion] = useActionState(crearServicio, estadoInicial); 
 
  return ( 
    <div className="max-w-md"> 
      <h1 className="text-xl font-semibold mb-6">Nuevo servicio</h1> 
 
      <form action={accion} className="space-y-5"> 
        <div> 
          <label className={label}>Nombre</label> 
          <input name="nombre" type="text" className={input} /> 
          {estado.errores?.nombre && ( 
            <p className="text-xs text-red-500 mt-1">{estado.errores.nombre}</p> 
          )} 
        </div> 
 
        <div> 
          <label className={label}>Descripción</label> 
          <textarea name="descripcion" rows={3} className={input} /> 
        </div> 

        <div> 
          <label className={label}>Duración (minutos)</label> 
          <input name="duracion" type="number" min={1} className={input} /> 
          {estado.errores?.duracion && ( 
            <p className="text-xs text-red-500 mt-1"> 
              {estado.errores.duracion} 
            </p> 
          )} 
        </div> 
 
        <BotonEnviar /> 
      </form> 
    </div> 
  ); 
} 