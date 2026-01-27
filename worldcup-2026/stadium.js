
const id = new URLSearchParams(location.search).get('id');

const CITIES_FB={"cities":[
  {"slug":"new-york-new-jersey","name":"New York / New Jersey"},
  {"slug":"dallas","name":"Dallas (Arlington)"},
  {"slug":"houston","name":"Houston"},
  {"slug":"kansas-city","name":"Kansas City"},
  {"slug":"atlanta","name":"Atlanta"},
  {"slug":"los-angeles","name":"Los Angeles (Inglewood)"},
  {"slug":"san-francisco-bay-area","name":"San Francisco Bay Area (Santa Clara)"},
  {"slug":"seattle","name":"Seattle"},
  {"slug":"boston","name":"Boston (Foxborough)"},
  {"slug":"philadelphia","name":"Philadelphia"},
  {"slug":"miami","name":"Miami (Miami Gardens)"},
  {"slug":"toronto","name":"Toronto"},
  {"slug":"vancouver","name":"Vancouver"},
  {"slug":"mexico-city","name":"Mexico City"},
  {"slug":"guadalajara","name":"Guadalajara"},
  {"slug":"monterrey","name":"Monterrey"}
]};
const STADIUMS_FB={"stadiums":[
  {"slug":"metlife-stadium","name":"MetLife Stadium","citySlug":"new-york-new-jersey","official_url":"https://www.metlifestadium.com/"},
  {"slug":"att-stadium","name":"AT&T Stadium","citySlug":"dallas","official_url":"https://attstadium.com/"},
  {"slug":"nrg-stadium","name":"NRG Stadium","citySlug":"houston","official_url":"https://www.nrgpark.com/venues/nrg-stadium/"},
  {"slug":"arrowhead-stadium","name":"Arrowhead Stadium","citySlug":"kansas-city","official_url":"https://www.chiefs.com/stadium/"},
  {"slug":"mercedes-benz-stadium","name":"Mercedes-Benz Stadium","citySlug":"atlanta","official_url":"https://www.mercedesbenzstadium.com/"},
  {"slug":"sofi-stadium","name":"SoFi Stadium","citySlug":"los-angeles","official_url":"https://www.sofistadium.com/"},
  {"slug":"levis-stadium","name":"Levi's Stadium","citySlug":"san-francisco-bay-area","official_url":"https://www.levisstadium.com/"},
  {"slug":"lumen-field","name":"Lumen Field","citySlug":"seattle","official_url":"https://www.lumenfield.com/"},
  {"slug":"gillette-stadium","name":"Gillette Stadium","citySlug":"boston","official_url":"https://www.gillettestadium.com/"},
  {"slug":"lincoln-financial-field","name":"Lincoln Financial Field","citySlug":"philadelphia","official_url":"https://www.lincolnfinancialfield.com/"},
  {"slug":"hard-rock-stadium","name":"Hard Rock Stadium","citySlug":"miami","official_url":"https://hardrockstadium.com/"},
  {"slug":"bmo-field","name":"BMO Field","citySlug":"toronto","official_url":"https://www.bmofield.com/"},
  {"slug":"bc-place","name":"BC Place","citySlug":"vancouver","official_url":"https://bcplace.com/"},
  {"slug":"estadio-azteca","name":"Estadio Azteca","citySlug":"mexico-city","official_url":"https://www.estadioazteca.com.mx/"},
  {"slug":"estadio-bbva","name":"Estadio BBVA","citySlug":"monterrey","official_url":"https://www.estadiobbva.com/"},
  {"slug":"estadio-akron","name":"Estadio Akron","citySlug":"guadalajara","official_url":"https://www.estadioakron.mx/"}
]};

async function loadOrFallback(url, fb) {
  try { const r = await fetch(url, {cache:'no-store'}); if(!r.ok) throw 0; return r.json(); }
  catch { return fb; }
}

(async () => {
  const cities   = (await loadOrFallback('/assets/data/cities.json',   CITIES_FB)).cities   || [];
  const stadiums = (await loadOrFallback('/assets/data/stadiums.json', STADIUMS_FB)).stadiums || [];

  const st = stadiums.find(x => x.slug === id);
  const titleEl = document.getElementById('title');
  const infoEl  = document.getElementById('info');

  if (!st) { titleEl.textContent = 'Stadium not found'; infoEl.textContent = 'Invalid or missing stadium id.'; return; }

  const city = cities.find(c => c.slug === st.citySlug);
  titleEl.textContent = st.name;

  const waText = encodeURIComponent(`Hi, I'd like match‑day details for ${st.name}.`);
  const routeUrl = `https://concierge.matchdaynavigator.com/route?stadium=${encodeURIComponent(st.name)}`;
  const optinUrl = `https://concierge.matchdaynavigator.com/optin?stadium=${encodeURIComponent(st.name)}`;

  infoEl.innerHTML = `
    <div style="margin:6px 0;">
      ${city ? `City: /worldcup-2026/city.html?id=${city.slug}${city.name}</a><br/>` : ''}
      ${st.official_url}Official site</a><br/>
      ${routeUrl}Open route</a><br/>
      https://wa.me/14155238886?text=${waText}Get match‑day details on WhatsApp</a>
      <!-- Or: ${optinUrl}Get match‑day details on WhatsApp</a> -->
    </div>
  `;
})();
