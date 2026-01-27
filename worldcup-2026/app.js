
/* ---------------------------------------------------------------------------
   MatchDay Navigator • World Cup 2026
   Map logic + clustering + sidebar rendering (CSP-safe: no inline code)
   Uses data-URL SVG markers (no external PNGs required).
   --------------------------------------------------------------------------- */

/* ---------- Fallback data (used only if /assets/data/*.json can’t be loaded) ---------- */
const FALLBACK_CITIES = {
  "cities": [
    {"slug":"new-york-new-jersey","name":"New York / New Jersey","country":"USA","region":"EAST","lat":40.813528,"lng":-74.074361},
    {"slug":"dallas","name":"Dallas (Arlington)","country":"USA","region":"CENTRAL","lat":32.74778,"lng":-97.09278},
    {"slug":"houston","name":"Houston","country":"USA","region":"CENTRAL","lat":29.68472,"lng":-95.41083},
    {"slug":"kansas-city","name":"Kansas City","country":"USA","region":"CENTRAL","lat":39.04889,"lng":-94.48389},
    {"slug":"atlanta","name":"Atlanta","country":"USA","region":"CENTRAL","lat":33.75556,"lng":-84.4},
    {"slug":"los-angeles","name":"Los Angeles (Inglewood)","country":"USA","region":"WEST","lat":33.953,"lng":-118.339},
    {"slug":"san-francisco-bay-area","name":"San Francisco Bay Area (Santa Clara)","country":"USA","region":"WEST","lat":37.403,"lng":-121.97},
    {"slug":"seattle","name":"Seattle","country":"USA","region":"WEST","lat":47.5952,"lng":-122.3316},
    {"slug":"boston","name":"Boston (Foxborough)","country":"USA","region":"EAST","lat":42.091,"lng":-71.264},
    {"slug":"philadelphia","name":"Philadelphia","country":"USA","region":"EAST","lat":39.90083,"lng":-75.1675},
    {"slug":"miami","name":"Miami (Miami Gardens)","country":"USA","region":"EAST","lat":25.95806,"lng":-80.23889},
    {"slug":"toronto","name":"Toronto","country":"Canada","region":"EAST","lat":43.63333,"lng":-79.41861},
    {"slug":"vancouver","name":"Vancouver","country":"Canada","region":"WEST","lat":49.276684,"lng":-123.112404},
    {"slug":"mexico-city","name":"Mexico City","country":"Mexico","region":"CENTRAL","lat":19.30306,"lng":-99.15056},
    {"slug":"guadalajara","name":"Guadalajara","country":"Mexico","region":"WEST","lat":20.68167,"lng":-103.46278},
    {"slug":"monterrey","name":"Monterrey","country":"Mexico","region":"CENTRAL","lat":25.66917,"lng":-100.24444}
  ]
};

const FALLBACK_STADIUMS = {
  "stadiums": [
    {"slug":"metlife-stadium","name":"MetLife Stadium","citySlug":"new-york-new-jersey","official_url":"https://www.metlifestadium.com/","lat":40.813528,"lng":-74.074361},
    {"slug":"att-stadium","name":"AT&T Stadium","citySlug":"dallas","official_url":"https://attstadium.com/","lat":32.74778,"lng":-97.09278},
    {"slug":"nrg-stadium","name":"NRG Stadium","citySlug":"houston","official_url":"https://www.nrgpark.com/venues/nrg-stadium/","lat":29.68472,"lng":-95.41083},
    {"slug":"arrowhead-stadium","name":"Arrowhead Stadium","citySlug":"kansas-city","official_url":"https://www.chiefs.com/stadium/","lat":39.04889,"lng":-94.48389},
    {"slug":"mercedes-benz-stadium","name":"Mercedes-Benz Stadium","citySlug":"atlanta","official_url":"https://www.mercedesbenzstadium.com/","lat":33.75556,"lng":-84.4},
    {"slug":"sofi-stadium","name":"SoFi Stadium","citySlug":"los-angeles","official_url":"https://www.sofistadium.com/","lat":33.953,"lng":-118.339},
    {"slug":"levis-stadium","name":"Levi's Stadium","citySlug":"san-francisco-bay-area","official_url":"https://www.levisstadium.com/","lat":37.403,"lng":-121.97},
    {"slug":"lumen-field","name":"Lumen Field","citySlug":"seattle","official_url":"https://www.lumenfield.com/","lat":47.5952,"lng":-122.3316},
    {"slug":"gillette-stadium","name":"Gillette Stadium","citySlug":"boston","official_url":"https://www.gillettestadium.com/","lat":42.091,"lng":-71.264},
    {"slug":"lincoln-financial-field","name":"Lincoln Financial Field","citySlug":"philadelphia","official_url":"https://www.lincolnfinancialfield.com/","lat":39.90083,"lng":-75.1675},
    {"slug":"hard-rock-stadium","name":"Hard Rock Stadium","citySlug":"miami","official_url":"https://hardrockstadium.com/","lat":25.95806,"lng":-80.23889},
    {"slug":"bmo-field","name":"BMO Field","citySlug":"toronto","official_url":"https://www.bmofield.com/","lat":43.63333,"lng":-79.41861},
    {"slug":"bc-place","name":"BC Place","citySlug":"vancouver","official_url":"https://bcplace.com/","lat":49.276684,"lng":-123.112404},
    {"slug":"estadio-azteca","name":"Estadio Azteca","citySlug":"mexico-city","official_url":"https://www.estadioazteca.com.mx/","lat":19.30306,"lng":-99.15056},
    {"slug":"estadio-bbva","name":"Estadio BBVA","citySlug":"monterrey","official_url":"https://www.estadiobbva.com/","lat":25.66917,"lng":-100.24444},
    {"slug":"estadio-akron","name":"Estadio Akron","citySlug":"guadalajara","official_url":"https://www.estadioakron.mx/","lat":20.68167,"lng":-103.46278}
  ]
};

/* ---------- Load JSON with fallback ---------- */
async function loadJSON(url, fallback) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch {
    return fallback;
  }
}

/* ---------- SVG data URL marker (no external PNGs needed) ---------- */
function svgPin(fill = '#1e90ff', stroke = '#0a3d62') {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
       <defs><filter id="s"><feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.35"/></filter></defs>
       <path filter="url(#s)" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.2 10.6 17.2 11.2 17.7a2 2 0 0 0 2.6 0C14.4 29.7 25 21.7 25 12.5 25 5.6 19.4 0 12.5 0z" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
       <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
     </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
const PIN_ICON = L.icon({
  iconUrl: svgPin(),
  iconRetinaUrl: svgPin(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -36],
  shadowUrl: undefined
});

/* ---------- Map init ---------- */
const map = L.map('map', { zoomControl: true });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);
map.setView([37.8, -96], 4);

/* ---------- Clusters ---------- */
const cityCluster = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50 });
const stCluster   = L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50 });
map.addLayer(cityCluster);
map.addLayer(stCluster);

/* ---------- Correct anchor builder (THIS WAS THE PROBLEM) ---------- */
function a(href, label, { external = false } = {}) {
  const ext = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  const h = String(href);
  const l = String(label);
  return `<a href="${h}"${ext}>${l}</a>`;
}

/* ---------- Sidebar renderers ---------- */
function addCityRow(city) {
  const list = document.getElementById('cityList');
  const el = document.createElement('div');
  el.className = 'city';
  el.innerHTML = a(`./city.html?id=${city.slug}`, `${city.name} — ${city.country}`);
  list.appendChild(el);
}

function addStadiumRow(st) {
  const list = document.getElementById('stadiumList');
  const el = document.createElement('div');
  el.className = 'stadium';
  el.innerHTML = a(`./stadium.html?id=${st.slug}`, st.name);
  list.appendChild(el);
}

/* ---------- Marker builders ---------- */
function addCityMarker(city) {
  if (city.lat == null || city.lng == null) return;
  const popupHtml =
    `<b>${city.name}</b><br/>${city.country}<br/>` +
    a(`./city.html?id=${city.slug}`, 'Open city page');
  cityCluster.addLayer(L.marker([city.lat, city.lng], { icon: PIN_ICON }).bindPopup(popupHtml));
}

function addStadiumMarker(st) {
  if (st.lat == null || st.lng == null) return;
  const waText = encodeURIComponent(`Hi, I'd like match‑day details for ${st.name}.`);
  const popupHtml = `
    <b>${st.name}</b><br/>
    ${a(st.official_url, 'Official site', { external: true })}<br/>
    ${a('https://concierge.matchdaynavigator.com/route?stadium=' + encodeURIComponent(st.name), 'Open route', { external: true })}<br/>
    ${a('https://wa.me/14155238886?text=' + waText, 'Get match‑day details on WhatsApp', })}
    <br/><small>(Replace the number with your WABA or link to your own opt‑in page.)</small>
  `;
  stCluster.addLayer(L.marker([st.lat, st.lng], { icon: PIN_ICON }).bindPopup(popupHtml));
}

/* ---------- Bootstrap ---------- */
(async () => {
  const cData = await loadJSON('/assets/data/cities.json',   FALLBACK_CITIES);
  const sData = await loadJSON('/assets/data/stadiums.json', FALLBACK_STADIUMS);

  (cData.cities   || []).forEach(c => { addCityRow(c);   addCityMarker(c); });
  (sData.stadiums || []).forEach(s => { addStadiumRow(s); addStadiumMarker(s); });
})();
