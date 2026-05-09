const artworks = window.ARTWORKS;

const storageKeys = {
  visibility: "alejandra:visibility",
  views: "alejandra:views",
};

const visibilityList = document.querySelector("#visibilityList");
const statsList = document.querySelector("#statsList");

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

const persistVisibility = () => {
  localStorage.setItem(storageKeys.visibility, JSON.stringify(visibility));
};

const renderAdmin = () => {
  visibilityList.innerHTML = artworks
    .map(
      (artwork) => `
        <div class="admin-row">
          <img src="${artwork.image}" alt="" />
          <div>
            <strong>${artwork.title}</strong>
            <p>${artwork.id} &middot; ${artwork.status}</p>
          </div>
          <label class="toggle">
            <input type="checkbox" data-visible-id="${artwork.id}" ${visibility[artwork.id] ? "checked" : ""} />
            Visible
          </label>
        </div>
      `,
    )
    .join("");

  statsList.innerHTML = [...artworks]
    .sort((a, b) => views[b.id] - views[a.id])
    .map(
      (artwork, index) => `
        <div class="stat-row">
          <span>${index + 1}. ${artwork.title}</span>
          <strong>${views[artwork.id]} vistas</strong>
        </div>
      `,
    )
    .join("");
};

visibilityList.addEventListener("change", (event) => {
  const id = event.target.dataset.visibleId;
  if (!id) return;
  visibility[id] = event.target.checked;
  persistVisibility();
});

renderAdmin();
