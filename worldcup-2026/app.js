// Initialize dark map (Carto Dark Matter)
const map = L.map('map', {
  zoomControl: true,
  worldCopyJump: true
});

L.tileLayer(
  'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }
).addTo(map);

map.setView([37.8, -96], 4);

// SVG pin generators
function svgPin(fill, stroke = '#0a3d62') {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'>
    <path d='M12.5 0C5.6 0 0 5.6 0 12.5c0 9.2 10.6 
    17.2 11.2 17.7a2 2 0 0 0 2.6 0C14.4 29.7 25 21.7 
    25 12.5 25 5.6 19.4 0 12.5 0z'
    fill='${fill}' stroke='${stroke}' stroke-width='1'/>
    <circle cx='12.5' cy='12.5' r='5' fill='#fff'/>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const ICONS = {
  city: L.icon({
    iconUrl: svgPin('#1e90ff'),
    iconSize: [25,41],
    iconAnchor: [12,41],
    popupAnchor: [0,-36]
  }),
  stadium: L.icon({
    iconUrl: svgPin('#f7d354'),
    iconSize: [25,41],
    iconAnchor: [12,41],
    popupAnchor: [0,-36]
  })
};

// FALLBACK DATA (only used if fetch fails)
const FALLBACK_CITIES = {"cities":[
  {"slug":"new-york-new-jersey","name":"New York / New Jersey","country":"USA","lat":40.813528,"lng":-74.074361},
  {"slug":"dallas","name":"Dallas (Arlington)","country":"USA","lat":32.74778,"lng":-97.09278},
  {"slug":"houston","name":"Houston","country":"USA","lat":29.68472,"lng":-95.41083},
  {"slug":"kansas-city","name":"Kansas City","country":"USA","lat":39.04889,"lng":-94.48389},
  {"slug":"atlanta","name":"Atlanta","country":"USA","lat":33.75556,"lng":-84.4},
  {"slug":"los-angeles","name":"Los Angeles (Inglewood)","country":"USA","lat":33.953,"lng":-118.339},
  {"slug":"san-francisco-bay-area","name":"San Francisco Bay Area","country":"USA","lat":37.403,"lng":-121.97},
  {"slug":"seattle","name":"Seattle","country":"USA","lat":47.5952,"lng":-122.3316},
  {"slug":"boston","name":"Boston","country":"USA","lat":42.091,"lng":-71.264},
  {"slug":"philadelphia","name":"Philadelphia","country":"USA","lat":39.90083,"lng":-75.1675},
  {"slug":"miami","name":"Miami","country":"USA","lat":25.95806,"lng":-80.23889},
  {"slug":"toronto","name":"Toronto","country":"Canada","lat":43.63333,"lng":-79.41861},
  {"slug":"vancouver","name":"Vancouver","country":"Canada","lat":49.276684,"lng":-123.112404},
  {"slug":"mexico-city","name":"Mexico City","country":"Mexico","lat":19.30306,"lng":-99.15056},
  {"slug":"guadalajara","name":"Guadalajara","country":"Mexico","lat":20.68167,"lng":-103.46278},
  {"slug":"monterrey","name":"Monterrey","country":"Mexico","lat":25.66917,"lng":-100.24444}
]};

const FALLBACK_STADIUMS = {"stadiums":[
  {"slug":"metlife-stadium","name":"MetLife Stadium","citySlug":"new-york-new-jersey","lat":40.813528,"lng":-74.074361},
  {"slug":"att-stadium","name":"AT&T Stadium","citySlug":"dallas","lat":32.74778,"lng":-97.09278},
  {"slug":"nrg-stadium","name":"NRG Stadium","citySlug":"houston","lat":29.68472,"lng":-95.41083},
  {"slug":"arrowhead-stadium","name":"Arrowhead Stadium","citySlug":"kansas-city","lat":39.04889,"lng":-94.48389},
  {"slug":"mercedes-benz-stadium","name":"Mercedes-Benz Stadium","citySlug":"atlanta","lat":33.75556,"lng":-84.4},
  {"slug":"sofi-stadium","name":"SoFi Stadium","citySlug":"los-angeles","lat":33.953,"lng":-118.339},
  {"slug":"levis-stadium","name":"Levi's Stadium","citySlug":"san-francisco-bay-area","lat":37.403,"lng":-121.97},
  {"slug":"lumen-field","name":"Lumen Field","citySlug":"seattle","lat":47.5952,"lng":-122.3316},
  {"slug":"gillette-stadium","name":"Gillette Stadium","citySlug":"boston","lat":42.091,"lng":-71.264},
  {"slug":"lincoln-financial-field","name":"Lincoln Financial Field","citySlug":"philadelphia","lat":39.90083,"lng":-75.1675},
  {"slug":"hard-rock-stadium","name":"Hard Rock Stadium","citySlug":"miami","lat":25.95806,"lng":-80.23889},
  {"slug":"bmo-field","name":"BMO Field","citySlug":"toronto","lat":43.63333,"lng":-79.41861},
  {"slug":"bc-place","name":"BC Place","citySlug":"vancouver","lat":49.276684,"lng":-123.112404},
  {"slug":"estadio-azteca","name":"Estadio Azteca","citySlug":"mexico-city","lat":19.30306,"lng":-99.15056},
  {"slug":"estadio-bbva","name":"Estadio BBVA","citySlug":"monterrey","lat":25.66917,"lng":-100.24444},
  {"slug":"estadio-akron","name":"Estadio Akron","citySlug":"guadalajara","lat":20.68167,"lng":-103.46278}
]};

// Fetch helper
async function getJSON(url, fallback) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw 0;
    return await r.json();
  } catch {
    return fallback;
  }
}

// Render map
(async () => {
  const cities = (await getJSON('/assets/data/cities.json', FALLBACK_CITIES)).cities;
  const stadiums = (await getJSON('/assets/data/stadiums.json', FALLBACK_STADIUMS)).stadiums;

  const markers = [];

  cities.forEach(c => {
    const m = L.marker([c.lat, c.lng], { icon: ICONS.city })
      .bindPopup(`<b>${c.name}</b><br/>${c.country}`)
      .bindTooltip(c.name);
    m.addTo(map);
    markers.push(m);
  });

  stadiums.forEach(s => {
    const m = L.marker([s.lat, s.lng], { icon: ICONS.stadium })
      .bindPopup(`<b>${s.name}</b>`)
      .bindTooltip(s.name);
    m.addTo(map);
    markers.push(m);
  });

  const group = L.featureGroup(markers);
  map.fitBounds(group.getBounds(), { padding: [40, 40] });

  window.addEventListener('resize', () => map.invalidateSize());
})();