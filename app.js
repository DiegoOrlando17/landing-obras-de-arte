const artworks = window.ARTWORKS;

const storageKeys = {
  visibility: "alejandra:visibility",
  views: "alejandra:views",
};

const galleryGrid = document.querySelector("#galleryGrid");
const filterButtons = document.querySelectorAll(".filter-button");
const artDialog = document.querySelector("#artDialog");
const inquiryDialog = document.querySelector("#inquiryDialog");

let currentFilter = "all";
let selectedArtwork = null;

const readJson = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

const defaultVisibility = Object.fromEntries(
  artworks.map((artwork) => [artwork.id, artwork.visible]),
);

const visibility = readJson(storageKeys.visibility, defaultVisibility);

const views = readJson(
  storageKeys.views,
  Object.fromEntries(artworks.map((artwork) => [artwork.id, 0])),
);

const persistViews = () => {
  localStorage.setItem(storageKeys.views, JSON.stringify(views));
};

const visibleArtworks = () =>
  artworks.filter(
    (artwork) =>
      visibility[artwork.id] && (currentFilter === "all" || artwork.status === currentFilter),
  );

const renderGallery = () => {
  const items = visibleArtworks();
  galleryGrid.innerHTML = items
    .map(
      (artwork) => `
        <button class="art-card" type="button" data-id="${artwork.id}" style="--ratio: ${artwork.ratio}">
          <img src="${artwork.image}" alt="${artwork.title}" loading="lazy" />
          <h3>${artwork.title}</h3>
          <p>${artwork.technique} &middot; ${artwork.size} &middot; <span class="status">${artwork.status}</span></p>
        </button>
      `,
    )
    .join("");
};

const openArtwork = (id) => {
  selectedArtwork = artworks.find((artwork) => artwork.id === id);
  if (!selectedArtwork) return;

  views[id] = (views[id] || 0) + 1;
  persistViews();

  document.querySelector("#dialogImage").src = selectedArtwork.image;
  document.querySelector("#dialogImage").alt = selectedArtwork.title;
  document.querySelector("#dialogCode").textContent = selectedArtwork.id;
  document.querySelector("#dialogTitle").textContent = selectedArtwork.title;
  document.querySelector("#dialogTechnique").textContent = selectedArtwork.technique;
  document.querySelector("#dialogSize").textContent = selectedArtwork.size;
  document.querySelector("#dialogYear").textContent = selectedArtwork.year;
  document.querySelector("#dialogStatus").textContent = selectedArtwork.status;
  document.querySelector("#dialogDescription").textContent = selectedArtwork.description;
  artDialog.showModal();
};

const openInquiry = (artwork = null) => {
  selectedArtwork = artwork;
  const form = document.querySelector("#inquiryForm");
  const subject = artwork ? `${artwork.title} (${artwork.id})` : "Consulta general";
  document.querySelector("#inquiryHeading").textContent = artwork
    ? `Consulta por ${artwork.title}`
    : "Consulta general";
  form.elements.artwork.value = artwork
    ? `${artwork.id} | ${artwork.title} | ${artwork.size}`
    : "Consulta general";
  form.elements.message.value = artwork
    ? `Hola Alejandra, me interesa consultar por la obra ${subject}, ${artwork.technique}, ${artwork.size}.`
    : "Hola Alejandra, quisiera recibir informacion sobre tus obras.";
  inquiryDialog.showModal();
};

galleryGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".art-card");
  if (card) openArtwork(card.dataset.id);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    renderGallery();
  });
});

document.querySelector("#closeDialog").addEventListener("click", () => artDialog.close());
document.querySelector("#closeInquiry").addEventListener("click", () => inquiryDialog.close());
document.querySelector("#dialogInquiry").addEventListener("click", () => {
  artDialog.close();
  openInquiry(selectedArtwork);
});
document.querySelector("#generalInquiry").addEventListener("click", () => openInquiry());

document.querySelector("#inquiryForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const artwork = form.elements.artwork.value;
  const subject = encodeURIComponent(`Consulta Alejandra Stier - ${artwork}`);
  const body = encodeURIComponent(
    `Nombre: ${form.elements.name.value}\nEmail: ${form.elements.email.value}\nObra: ${artwork}\n\n${form.elements.message.value}`,
  );
  window.location.href = `mailto:consultas@alejandrastier.com?subject=${subject}&body=${body}`;
});

renderGallery();
