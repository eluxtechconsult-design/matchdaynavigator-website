// DARK BASE MAP
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

// Helper: SVG pin icon
function svgPin(fill, stroke = '#0a3d62') {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'>
      <path d='M12.5 0C5.6 0 0 5.6 0 12.5c0 9.2 10.6 17.2 11.2 17.7a2 2 0 0 0 2.6 0C14.4 29.7 
      25 21.7 25 12.5 25 5.6 19.4 0 12.5 0z' fill='${fill}' stroke='${stroke}' stroke-width='1'/>
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

// Fallback data (used if JSON fails)
const FALLBACK_CITIES = { "cities": [
  {"name":"New York / New Jersey","country":"USA","lat":40.813528,"lng":-74.074361},
  {"name":"Dallas (Arlington)","country":"USA","lat":32.74778,"lng":-97.09278},
  {"name":"Houston","country":"USA","lat":29.68472,"lng":-95.41083},
  {"name":"Kansas City","country":"USA","lat":39.04889,"lng":-94.48389},
  {"name":"Atlanta","country":"USA","lat":33.75556,"lng":-84.4},
  {"name":"Los Angeles","country":"USA","lat":33.953,"lng":-118.339},
  {"name":"Vancouver","country":"Canada","lat":49.276684,"lng":-123.112404},
  {"name":"Toronto","country":"Canada","lat":43.63333,"lng":-79.41861}
]};

const FALLBACK_STADIUMS = {"stadiums":[]};

// Fetch JSON with fallback
async function getJSON(url, fallback) {
  try {
    const r = await fetch(url, { cache:'no-store' });
    if (!r.ok) throw 0;
    return await r.json();
  } catch {
    return fallback;
  }
}

(async () => {
  const cities = (await getJSON('/assets/data/cities.json', FALLBACK_CITIES)).cities;

  const markers = [];

  // City pins
  cities.forEach(c => {
    const m = L.marker([c.lat, c.lng], { icon: ICONS.city })
      .bindPopup(`<b>${c.name}</b><br/>${c.country}`)
      .bindTooltip(c.name);
    m.addTo(map);
    markers.push(m);
  });

  // Fit to all markers
  const g = L.featureGroup(markers);
  map.fitBounds(g.getBounds(), { padding: [40,40] });

  window.addEventListener('resize', () => map.invalidateSize());
})();