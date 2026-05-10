import "./globals.css";

export const metadata = {
  title: "Alejandra Stier | Obras",
  description:
    "Galeria de Alejandra Stier: arte, calma, armonia y consultas directas sobre cada pieza.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
