"use client";

import { cancelarReserva } from "../actions/reservas";
import { useState } from "react";
import { botonPeligro } from "@/app/lib/estilos";
import { FUNCTIONS_CONFIG_MANIFEST } from "next/dist/shared/lib/constants";

export function BotonCancelarReserva({id}: {id: number}) {
    const [error, setError] = useState<string | null>(null);

    async function manejarClick() {
        const resultado = await cancelarReserva(id);
        if (!resultado.exito) {
            setError(resultado.mensaje ?? "Error desconocido.");
        }
    }

    return (
        <div className="text-right shrink-0 ml-4">
            <button onClick={manejarClick} className={botonPeligro}>
                Cancelar
            </button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
    );
}