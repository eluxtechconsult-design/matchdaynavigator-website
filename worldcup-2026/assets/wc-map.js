(async function () {
  const map = L.map("map", { scrollWheelZoom: false })
    .setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities = await fetch("../data/cities.json").then(r => r.json());

  /* --------------------------------
     STATE (local + URL)
  -------------------------------- */
  const params = new URLSearchParams(location.search);

  let saved = params.get("saved")
    ? params.get("saved").split(",")
    : JSON.parse(localStorage.getItem("wc26-saved") || "[]");

  let group = params.get("group") || "solo";

  function syncState() {
    localStorage.setItem("wc26-saved", JSON.stringify(saved));
    const url =
      `${location.pathname}?saved=${saved.join(",")}&group=${group}`;
    history.replaceState(null, "", url);
  }

  function toggleSave(cityId) {
    saved.includes(cityId)
      ? saved.splice(saved.indexOf(cityId), 1)
      : saved.push(cityId);
    syncState();
  }

  /* --------------------------------
     UI
  -------------------------------- */
  const panelTitle = document.getElementById("panel-title");
  const panelBody = document.getElementById("panel-body");

  function renderCity(city) {
    panelTitle.textContent = city.name;
    panelBody.innerHTML = `
      <button class="save-btn">
        ${saved.includes(city.id) ? "★ Saved" : "☆ Save city"}
      </button>

      <button class="share-btn">🔗 Share map</button>
      <button class="export-btn">🖨 Export / Print</button>

      <p><strong>${city.country}</strong></p>

      <p class="cta">
        📲 Matchday details are delivered via WhatsApp once you have a booking.
      </p>

      <p class="print-upsell">
        🖼 Turn this into a framed World Cup 2026 push‑pin map.
        <a href="/print.html">View print options</a>
      </p>
    `;

    panelBody.querySelector(".save-btn").onclick = () => {
      toggleSave(city.id);
      renderCity(city);
    };

    panelBody.querySelector(".share-btn").onclick = () => {
      navigator.clipboard.writeText(location.href);
      alert("Share link copied");
    };

    panelBody.querySelector(".export-btn").onclick = () => {
      window.print();
    };
  }

  /* --------------------------------
     Markers (gold if saved)
  -------------------------------- */
  cities.forEach(city => {
    const icon = saved.includes(city.id)
      ? L.divIcon({
          className: "gold-pin",
          html: "★",
          iconSize: [20, 20]
        })
      : undefined;

    const marker = L.marker([city.lat, city.lng], icon ? { icon } : {})
      .addTo(map);

    marker.on("click", () => renderCity(city));
  });

})();