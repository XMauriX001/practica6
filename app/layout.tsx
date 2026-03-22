import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Nav } from "./components/nav";
import "./globals.css";

8


const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Panel de reservas',
  description: 'Gestión de citas y servicios',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='es'>
      <body className={`${geist.className} bg-gray-50 text-gray-900 antialiased`}>
        <Nav />
        <main className='max-w-4xl mx-auto px-6 py-10'>{children}</main>
      </body>
    </html>
  );
} 