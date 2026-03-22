"use client";

import { confirmarReserva } from "../actions/reservas";
import { useState } from "react";

export function BotonConfirmarReserva({ id }: { id: number }) {
    const [error, setError] = useState<string | null>(null);
    async function manejarClick() {
        const resultado = await confirmarReserva(id);

        if (!resultado.exito) {
            setError(resultado.mensaje ?? "Error desconocido.");
        }
    }

    return (
        <div className="text right shrink-0">
            <button
            onClick={manejarClick}
            className="text-sm text-green-600 hover:text-green-800 transition-colors"
            >
                Confirmar
            </button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
    );
}
