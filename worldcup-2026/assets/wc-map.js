(async function () {
  const map = L.map("map", {
    scrollWheelZoom: false,
    zoomControl: true
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const cities = await fetch("../data/cities.json").then(r => r.json());
  const bounds = [];

  function labelOffset(city) {
    // Region-based offsets to prevent overlap
    if (city.lng < -120) return [8, -12];         // West Coast
    if (city.lng < -95) return [6, -10];          // Central
    if (city.lng > -80) return [-8, -12];         // East Coast / Canada
    if (city.lat < 23) return [0, 14];            // Mexico
    return [6, -10];
  }

  cities.forEach(city => {
    // Marker
    L.circleMarker([city.lat, city.lng], {
      radius: 7,
      color: "#16a34a",
      fillColor: "#16a34a",
      fillOpacity: 0.95
    }).addTo(map);

    const offset = labelOffset(city);

    // Permanent city label
    L.marker([city.lat, city.lng], {
      icon: L.divIcon({
        className: "city-label",
        html: city.name,
        iconAnchor: offset
      }),
      interactive: false
    }).addTo(map);

    bounds.push([city.lat, city.lng]);
  });

  // Bigger, more confident landing zoom
  map.fitBounds(bounds, {
    padding: [90, 90],
    maxZoom: 4
  });
})();