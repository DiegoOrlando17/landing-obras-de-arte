# Landing Alejandra Stier

Landing en Next.js para una artista plastica.

## Funcionalidades

- Galeria visual con fichas individuales por obra.
- Consulta por obra con titulo, codigo y medidas precargadas en el email.
- Pagina separada de gestion para activar o desactivar obras visibles.
- Conteo local de visualizaciones por obra para mostrar cuales interesan mas.

## Como correrlo

Instalar dependencias:

```bash
npm install
```

Levantar el entorno local:

```bash
npm run dev
```

El sitio queda en `http://localhost:3000`.

La gestion demo esta en `/admin`.

## Nota de produccion

La gestion y las metricas usan `localStorage` para que el prototipo funcione sin backend. Para que la visibilidad y las metricas sean compartidas entre dispositivos, conviene conectar:

- Una API minima para visibilidad de obras y vistas por obra.
- Formulario real con email transaccional o CRM.
- Analytics persistente para vistas por obra, origen del trafico y consultas generadas.

Las imagenes actuales son placeholders generados para presentar la direccion visual; deben reemplazarse por fotografias reales de la artista.

El catalogo base vive en `lib/artworks.js`. Para agregar nuevas piezas se suma la imagen a
`public/assets/paintings/`, se agrega el objeto correspondiente en `lib/artworks.js` y se vuelve a
publicar.
