"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { artworks, storageKeys } from "../lib/artworks";

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

export default function Home() {
  const [currentFilter, setCurrentFilter] = useState("all");
  const [visibility, setVisibility] = useState(defaultVisibility);
  const [views, setViews] = useState(defaultViews);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [inquiryArtwork, setInquiryArtwork] = useState(null);
  const [isArtworkDialogOpen, setIsArtworkDialogOpen] = useState(false);
  const [isInquiryDialogOpen, setIsInquiryDialogOpen] = useState(false);

  useEffect(() => {
    setVisibility(readJson(storageKeys.visibility, defaultVisibility));
    setViews(readJson(storageKeys.views, defaultViews));
  }, []);

  const visibleArtworks = useMemo(
    () =>
      artworks.filter(
        (artwork) =>
          visibility[artwork.id] &&
          (currentFilter === "all" || artwork.status === currentFilter),
      ),
    [currentFilter, visibility],
  );

  const openArtwork = (artwork) => {
    const nextViews = { ...views, [artwork.id]: (views[artwork.id] || 0) + 1 };
    setViews(nextViews);
    localStorage.setItem(storageKeys.views, JSON.stringify(nextViews));
    setSelectedArtwork(artwork);
    setIsArtworkDialogOpen(true);
  };

  const openInquiry = (artwork = null) => {
    setInquiryArtwork(artwork);
    setIsArtworkDialogOpen(false);
    setIsInquiryDialogOpen(true);
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Alejandra Stier inicio">
          Alejandra Stier
        </a>
        <nav className="nav" aria-label="Principal">
          <a href="#obra">Obra</a>
          <a href="#consulta">Consultas</a>
          <Link href="/admin">Gestion</Link>
        </nav>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow">Pintura contemporanea</p>
            <h1>Obras que se descubren de cerca.</h1>
            <p>
              Una galeria digital pensada para mirar cada pieza con pausa, conocer sus datos y
              consultar por la obra exacta sin perder contexto.
            </p>
            <a className="primary-link" href="#obra">
              Ver galeria
            </a>
          </div>
          <figure className="hero-art">
            <img src="/assets/paintings/energia-de-color.png" alt="Obra abstracta Energia de color" />
          </figure>
        </section>

        <section className="intro-band" aria-label="Presentacion">
          <p>
            Alejandra trabaja con capas, gestos y silencios visuales. Esta nueva experiencia
            prioriza la obra: imagen grande, ficha clara, consulta directa y herramientas simples
            para decidir que piezas se muestran.
          </p>
        </section>

        <section className="gallery-section" id="obra">
          <div className="section-heading">
            <p className="eyebrow">Galeria</p>
            <h2>Obras disponibles</h2>
          </div>
          <div className="gallery-tools" aria-label="Filtros de galeria">
            {[
              ["all", "Todas"],
              ["Disponible", "Disponibles"],
              ["Reservada", "Reservadas"],
            ].map(([filter, label]) => (
              <button
                className={`filter-button ${currentFilter === filter ? "is-active" : ""}`}
                key={filter}
                type="button"
                onClick={() => setCurrentFilter(filter)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="gallery-grid">
            {visibleArtworks.map((artwork) => (
              <button
                className="art-card"
                key={artwork.id}
                type="button"
                style={{ "--ratio": artwork.ratio }}
                onClick={() => openArtwork(artwork)}
              >
                <img src={artwork.image} alt={artwork.title} loading="lazy" />
                <h3>{artwork.title}</h3>
                <p>
                  {artwork.technique} &middot; {artwork.size} &middot;{" "}
                  <span className="status">{artwork.status}</span>
                </p>
              </button>
            ))}
          </div>
        </section>

        <section className="contact-band" id="consulta">
          <div>
            <p className="eyebrow">Consultas</p>
            <h2>Preguntar por una obra</h2>
          </div>
          <p>
            Cada ficha abre una consulta con titulo, codigo y medidas ya cargadas. Asi la artista
            sabe exactamente que pieza intereso al visitante.
          </p>
          <button className="secondary-link" type="button" onClick={() => openInquiry()}>
            Consulta general
          </button>
        </section>
      </main>

      <ArtworkDialog
        artwork={selectedArtwork}
        isOpen={isArtworkDialogOpen}
        onClose={() => setIsArtworkDialogOpen(false)}
        onInquiry={openInquiry}
      />
      <InquiryDialog
        artwork={inquiryArtwork}
        isOpen={isInquiryDialogOpen}
        onClose={() => setIsInquiryDialogOpen(false)}
      />

      <footer className="site-footer">
        <p>Alejandra Stier</p>
        <a href="mailto:consultas@alejandrastier.com">consultas@alejandrastier.com</a>
      </footer>
    </>
  );
}

function ArtworkDialog({ artwork, isOpen, onClose, onInquiry }) {
  if (!isOpen || !artwork) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="art-dialog modal-shell" role="dialog" aria-modal="true" aria-labelledby="art-title">
        <button className="close-button" type="button" aria-label="Cerrar" onClick={onClose}>
          x
        </button>
        <div className="dialog-body">
          <img src={artwork.image} alt={artwork.title} />
          <div className="dialog-copy">
            <p className="eyebrow">{artwork.id}</p>
            <h2 id="art-title">{artwork.title}</h2>
            <dl>
              <div>
                <dt>Tecnica</dt>
                <dd>{artwork.technique}</dd>
              </div>
              <div>
                <dt>Medidas</dt>
                <dd>{artwork.size}</dd>
              </div>
              <div>
                <dt>Anio</dt>
                <dd>{artwork.year}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{artwork.status}</dd>
              </div>
            </dl>
            <p>{artwork.description}</p>
            <button className="primary-link as-button" type="button" onClick={() => onInquiry(artwork)}>
              Consultar esta obra
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function InquiryDialog({ artwork, isOpen, onClose }) {
  if (!isOpen) return null;

  const subject = artwork ? `${artwork.title} (${artwork.id})` : "Consulta general";
  const artworkValue = artwork
    ? `${artwork.id} | ${artwork.title} | ${artwork.size}`
    : "Consulta general";
  const defaultMessage = artwork
    ? `Hola Alejandra, me interesa consultar por la obra ${subject}, ${artwork.technique}, ${artwork.size}.`
    : "Hola Alejandra, quisiera recibir informacion sobre tus obras.";

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const mailSubject = encodeURIComponent(`Consulta Alejandra Stier - ${artworkValue}`);
    const body = encodeURIComponent(
      `Nombre: ${formData.get("name")}\nEmail: ${formData.get("email")}\nObra: ${artworkValue}\n\n${formData.get("message")}`,
    );
    window.location.href = `mailto:consultas@alejandrastier.com?subject=${mailSubject}&body=${body}`;
  };

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="inquiry-dialog modal-shell" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
        <button className="close-button" type="button" aria-label="Cerrar" onClick={onClose}>
          x
        </button>
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <p className="eyebrow">Nueva consulta</p>
          <h2 id="inquiry-title">{artwork ? `Consulta por ${artwork.title}` : "Consulta general"}</h2>
          <label>
            Nombre
            <input name="name" autoComplete="name" required />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            Mensaje
            <textarea name="message" rows="5" required defaultValue={defaultMessage} />
          </label>
          <input name="artwork" type="hidden" value={artworkValue} readOnly />
          <button className="primary-link as-button" type="submit">
            Preparar email
          </button>
        </form>
      </section>
    </div>
  );
}
