import "./globals.css";

export const metadata = {
  title: "Alejandra Stier | Obras",
  description:
    "Galeria contemporanea de Alejandra Stier: obras, fichas individuales y consultas directas sobre cada pieza.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
