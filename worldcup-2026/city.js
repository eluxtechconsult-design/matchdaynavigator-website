
const id = new URLSearchParams(location.search).get('id');

const CITIES_FALLBACK={"cities":[
  {"slug":"new-york-new-jersey","name":"New York / New Jersey","country":"USA","region":"EAST"},
  {"slug":"dallas","name":"Dallas (Arlington)","country":"USA","region":"CENTRAL"},
  {"slug":"houston","name":"Houston","country":"USA","region":"CENTRAL"},
  {"slug":"kansas-city","name":"Kansas City","country":"USA","region":"CENTRAL"},
  {"slug":"atlanta","name":"Atlanta","country":"USA","region":"CENTRAL"},
  {"slug":"los-angeles","name":"Los Angeles (Inglewood)","country":"USA","region":"WEST"},
  {"slug":"san-francisco-bay-area","name":"San Francisco Bay Area (Santa Clara)","country":"USA","region":"WEST"},
  {"slug":"seattle","name":"Seattle","country":"USA","region":"WEST"},
  {"slug":"boston","name":"Boston (Foxborough)","country":"USA","region":"EAST"},
  {"slug":"philadelphia","name":"Philadelphia","country":"USA","region":"EAST"},
  {"slug":"miami","name":"Miami (Miami Gardens)","country":"USA","region":"EAST"},
  {"slug":"toronto","name":"Toronto","country":"Canada","region":"EAST"},
  {"slug":"vancouver","name":"Vancouver","country":"Canada","region":"WEST"},
  {"slug":"mexico-city","name":"Mexico City","country":"Mexico","region":"CENTRAL"},
  {"slug":"guadalajara","name":"Guadalajara","country":"Mexico","region":"WEST"},
  {"slug":"monterrey","name":"Monterrey","country":"Mexico","region":"CENTRAL"}
]};
const STADIUMS_FALLBACK={"stadiums":[
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
  const cities   = (await loadOrFallback('/assets/data/cities.json',   CITIES_FALLBACK)).cities   || [];
  const stadiums = (await loadOrFallback('/assets/data/stadiums.json', STADIUMS_FALLBACK)).stadiums || [];

  const city = cities.find(c => c.slug === id);
  const title = document.getElementById('cityTitle');
  if (!city) { title.textContent = 'City not found'; return; }

  title.textContent = city.name;
  document.getElementById('meta').textContent = `${city.country} • ${city.region}`;

  const list = document.getElementById('stadiumList');
  const inCity = stadiums.filter(st => st.citySlug === city.slug);
  if (inCity.length === 0) {
    list.innerHTML = '<div>No stadium found for this city.</div>';
  } else {
    inCity.forEach(st => {
      const el = document.createElement('div');
      el.className='city';
      el.innerHTML = `${st.official_url}Official site</a> · /worldcup-2026/stadium.html?id=${st.slug}Open stadium page</a>`;
      list.appendChild(el);
    });
  }
})();
