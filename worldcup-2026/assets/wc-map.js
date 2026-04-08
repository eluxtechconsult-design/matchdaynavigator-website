(async function () {
  const map = L.map("map", { scrollWheelZoom: false })
    .setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities = await fetch("../data/cities.json").then(r => r.json());
  const stadiums = await fetch("../data/stadiums.json").then(r => r.json());

  // Load saved cities from URL OR localStorage
  const params = new URLSearchParams(window.location.search);
  let saved = [];

  if (params.get("saved")) {
    saved = params.get("saved").split(",");
  } else {
    saved = JSON.parse(localStorage.getItem("wc26-saved") || "[]");
  }

  function persistSaved() {
    localStorage.setItem("wc26-saved", JSON.stringify(saved));
    const shareUrl =
      `${window.location.origin}${window.location.pathname}?saved=${saved.join(",")}`;
    history.replaceState(null, "", shareUrl);
  }

  function toggleSave(cityId) {
    const idx = saved.indexOf(cityId);
    if (idx >= 0) saved.splice(idx, 1);
    else saved.push(cityId);
    persistSaved();
  }

  const panelTitle = document.getElementById("panel-title");
  const panelBody = document.getElementById("panel-body");

  function renderCity(city) {
    const isSaved = saved.includes(city.id);

    panelTitle.textContent = city.name;
    panelBody.innerHTML = `
      <button class="save-btn">
        ${isSaved ? "★ Saved" : "☆ Save this city"}
      </button>

      <button class="share-btn">🔗 Share my WC map</button>

      <button class="export-btn">🖨 Export / Print map</button>

      <p><strong>${city.country}</strong> · ${city.region}</p>

      <p class="cta">
        📲 Matchday details are delivered via WhatsApp once you have a booking.
      </p>
    `;

    panelBody.querySelector(".save-btn").onclick = () => {
      toggleSave(city.id);
      renderCity(city);
    };

    panelBody.querySelector(".share-btn").onclick = () => {
      const url =
        `${window.location.origin}${window.location.pathname}?saved=${saved.join(",")}`;
      navigator.clipboard.writeText(url);
      alert("Share link copied to clipboard");
    };

    panelBody.querySelector(".export-btn").onclick = () => {
      window.print();
    };
  }

  cities.forEach(city => {
    const marker = L.marker([city.lat, city.lng]).addTo(map);
    marker.on("click", () => renderCity(city));

    // Highlight saved cities visually (optional future enhancement)
    if (saved.includes(city.id)) {
      marker.bindTooltip("★ " + city.name);
    }
  });
})();