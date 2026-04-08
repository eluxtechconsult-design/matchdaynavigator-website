(async function () {
  const map = L.map("map", {
    scrollWheelZoom: false
  }).setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  const citiesRes = await fetch("../data/cities.json");
  const stadiumsRes = await fetch("../data/stadiums.json");

  const cities = await citiesRes.json();
  const stadiums = await stadiumsRes.json();

  const panelTitle = document.getElementById("panel-title");
  const panelBody = document.getElementById("panel-body");

  function renderCity(city) {
    const cityStadiums = stadiums.filter(
      s => city.stadiums.includes(s.id)
    );

    panelTitle.textContent = city.name;
    panelBody.innerHTML = `
      <p><strong>Country:</strong> ${city.country}</p>
      <p><strong>Region:</strong> ${city.region}</p>
      <h3>Stadiums</h3>
      <ul>
        ${cityStadiums.map(s => `
          <li>
            <strong>${s.name}</strong><br />
            Capacity: ${s.capacity.toLocaleString()}<br />
            <a href="https://concierge.matchdaynavigator.com/route?stadium=${encodeURIComponent(s.name)}"
               target="_blank">Open route</a>
          </li>
        `).join("")}
      </ul>
      <p class="cta">
        📲 Matchday details are delivered via WhatsApp once you have a booking.
      </p>
    `;
  }

  cities.forEach(city => {
    const marker = L.marker([city.lat, city.lng]).addTo(map);
    marker.bindTooltip(city.name);

    marker.on("click", () => renderCity(city));
  });
})();
