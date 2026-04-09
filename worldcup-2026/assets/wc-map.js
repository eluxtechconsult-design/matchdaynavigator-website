(async function () {
  const map = L.map("map", { scrollWheelZoom: false });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities = await fetch("../data/cities.json").then(r => r.json());
  const bounds = [];
  const markersById = {};

  cities.forEach((city, index) => {
    const number = index + 1;

    const icon = L.divIcon({
      className: "numbered-marker",
      html: `<span>${number}</span>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const marker = L.marker([city.lat, city.lng], { icon })
      .addTo(map)
      .bindPopup(`<strong>${number}. ${city.name}</strong>`);

    markersById[city.id] = marker;
    bounds.push([city.lat, city.lng]);
  });

  map.fitBounds(bounds, { padding: [90, 90], maxZoom: 4 });

  document.querySelectorAll("[data-city]").forEach(item => {
    item.addEventListener("click", () => {
      const id = item.dataset.city;
      const marker = markersById[id];
      if (!marker) return;

      map.setView(marker.getLatLng(), 6, { animate: true });
      marker.openPopup();

      document.querySelectorAll(".active").forEach(el => el.classList.remove("active"));
      item.classList.add("active");
    });
  });
})();
