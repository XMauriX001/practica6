"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const enlaces = [
    { href: "/", etiqueta: "Inicio" },
    { href: "/servicios", etiqueta: "Servicios" },
    { href: "/reservas", etiqueta: "Reservas" },
];

export function Nav() {
    const pathname = usePathname();

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
                <span className="font-semibold text-sm">Panel de reservas</span>
                <nav className="flex items-center gap-6">
                    {enlaces.map(({ href, etiqueta }) => (
                        <Link key={href} href={href}
                            className={pathname === href ? 'text-black font-medium text-sm' :
                                'text-gray-500 text-sm hover:text-black'}
                        >
                            {etiqueta}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
} 