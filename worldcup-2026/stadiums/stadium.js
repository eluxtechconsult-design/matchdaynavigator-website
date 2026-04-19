(async function () {
  const params = new URLSearchParams(window.location.search);
  const stadiumId = params.get("id");

  const listView = document.getElementById("stadium-list-view");
  const detailView = document.getElementById("stadium-detail-view");

  const cities = await fetch("/data/cities.json").then(r => r.json());
  const stadiums = await fetch("/data/stadiums.json").then(r => r.json());

  const cityById = Object.fromEntries(cities.map(c => [c.id, c]));

  // ============================
  // DETAIL MODE
  // ============================
  if (stadiumId) {
    const stadium = stadiums.find(s => s.id === stadiumId);

    if (!stadium) {
      detailView.innerHTML = "<p>Stadium not found.</p>";
      detailView.style.display = "block";
      return;
    }

    const city = cityById[stadium.cityId];

    detailView.innerHTML = `
      <h2>${stadium.name}</h2>
      <p><strong>Host city:</strong> ${city?.name || "—"}</p>
      <p><strong>Capacity:</strong> ${stadium.capacity?.toLocaleString() || "—"}</p>
      <p><strong>Bag policy:</strong> ${stadium.bagPolicy || "See official guidance"}</p>
      <p>
        <a href="${stadium.officialUrl}" target="_blank" rel="noopener">
          Official stadium website →
        </a>
      </p>
      <p style="margin-top:32px">
        <a href="/worldcup-2026/stadiums/">← Back to stadium list</a>
      </p>
    `;

    detailView.style.display = "block";
    return;
  }

  // ============================
  // LIST MODE
  // ============================
  const byCountry = {};

  stadiums.forEach(s => {
    const city = cityById[s.cityId];
    const country = city?.country || "Other";
    byCountry[country] ??= [];
    byCountry[country].push({ stadium: s, city });
  });

  let html = "";
  Object.entries(byCountry).forEach(([country, items]) => {
    html += `<h2>${country}</h2><div class="stadium-grid">`;
    items.forEach(({ stadium, city }) => {
      html += `
        <div class="stadium-card">
          <h3>${stadium.name}</h3>
          <p>${city?.name}</p>
          <a href="/worldcup-2026/stadiums/?id=${stadium.id}">
            View stadium →
          </a>
        </div>
      `;
    });
    html += "</div>";
  });

  listView.innerHTML = html;
})();