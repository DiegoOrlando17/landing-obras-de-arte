"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { artworks, storageKeys } from "../../lib/artworks";

const readJson = (key, fallback) => {
  if (typeof window === "undefined") return fallback;

  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const defaultVisibility = Object.fromEntries(
  artworks.map((artwork) => [artwork.id, artwork.visible]),
);

const defaultViews = Object.fromEntries(artworks.map((artwork) => [artwork.id, 0]));

export default function AdminClient() {
  const [visibility, setVisibility] = useState(defaultVisibility);
  const [views, setViews] = useState(defaultViews);

  useEffect(() => {
    setVisibility(readJson(storageKeys.visibility, defaultVisibility));
    setViews(readJson(storageKeys.views, defaultViews));
  }, []);

  const sortedArtworks = useMemo(
    () => [...artworks].sort((a, b) => (views[b.id] || 0) - (views[a.id] || 0)),
    [views],
  );

  const toggleVisibility = (id, checked) => {
    const nextVisibility = { ...visibility, [id]: checked };
    setVisibility(nextVisibility);
    localStorage.setItem(storageKeys.visibility, JSON.stringify(nextVisibility));
  };

  return (
    <>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Volver al sitio">
          Alejandra Stier
        </Link>
        <nav className="nav" aria-label="Gestion">
          <Link href="/">Ver sitio</Link>
        </nav>
      </header>

      <main>
        <section className="admin-hero">
          <p className="eyebrow">Gestion de galeria</p>
          <h1>Visibilidad de obras</h1>
          <p>
            Esta pantalla permite ocultar o mostrar piezas ya cargadas en el sitio, manteniendo la
            misma identidad visual de la landing publicada.
          </p>
        </section>

        <section className="admin-panel is-standalone" aria-label="Gestion de obras">
          <div className="admin-layout">
            <div>
              <h2>Mostrar en galeria</h2>
              <div className="admin-list">
                {artworks.map((artwork) => (
                  <div className="admin-row" key={artwork.id}>
                    <img src={artwork.image} alt="" />
                    <div>
                      <strong>{artwork.title}</strong>
                      <p>
                        {artwork.id} &middot; {artwork.status}
                      </p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={Boolean(visibility[artwork.id])}
                        onChange={(event) => toggleVisibility(artwork.id, event.target.checked)}
                      />
                      Visible
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2>Mas vistas</h2>
              <div className="stats-list">
                {sortedArtworks.map((artwork, index) => (
                  <div className="stat-row" key={artwork.id}>
                    <span>
                      {index + 1}. {artwork.title}
                    </span>
                    <strong>{views[artwork.id] || 0} vistas</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
