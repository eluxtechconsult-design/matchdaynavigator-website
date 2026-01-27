
// --- Dark Matter base layer ---
const map = L.map('map', { zoomControl:true, worldCopyJump:true });
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO', subdomains:'abcd', maxZoom:20
}).addTo(map);
map.setView([37.8, -96], 4);

// --- Data loading with fallback ---
const FALLBACK_CITIES = {"cities":[
  {"slug":"new-york-new-jersey","name":"New York / New Jersey","country":"USA","lat":40.813528,"lng":-74.074361},
  {"slug":"dallas","name":"Dallas (Arlington)","country":"USA","lat":32.74778,"lng":-97.09278},
  {"slug":"houston","name":"Houston","country":"USA","lat":29.68472,"lng":-95.41083},
  {"slug":"kansas-city","name":"Kansas City","country":"USA","lat":39.04889,"lng":-94.48389},
  {"slug":"atlanta","name":"Atlanta","country":"USA","lat":33.75556,"lng":-84.4},
  {"slug":"los-angeles","name":"Los Angeles (Inglewood)","country":"USA","lat":33.953,"lng":-118.339},
  {"slug":"san-francisco-bay-area","name":"San Francisco Bay Area (Santa Clara)","country":"USA","lat":37.403,"lng":-121.97},
  {"slug":"seattle","name":"Seattle","country":"USA","lat":47.5952,"lng":-122.3316},
  {"slug":"boston","name":"Boston (Foxborough)","country":"USA","lat":42.091,"lng":-71.264},
  {"slug":"philadelphia","name":"Philadelphia","country":"USA","lat":39.90083,"lng":-75.1675},
  {"slug":"miami","name":"Miami (Miami Gardens)","country":"USA","lat":25.95806,"lng":-80.23889},
  {"slug":"toronto","name":"Toronto","country":"Canada","lat":43.63333,"lng":-79.41861},
  {"slug":"vancouver","name":"Vancouver","country":"Canada","lat":49.276684,"lng":-123.112404},
  {"slug":"mexico-city","name":"Mexico City","country":"Mexico","lat":19.30306,"lng":-99.15056},
  {"slug":"guadalajara","name":"Guadalajara","country":"Mexico","lat":20.68167,"lng":-103.46278},
  {"slug":"monterrey","name":"Monterrey","country":"Mexico","lat":25.66917,"lng":-100.24444}
]};
const FALLBACK_STADIUMS = {"stadiums":[
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
]};

async function loadJSON(url, fb){
  try{const r=await fetch(url,{cache:'no-store'}); if(!r.ok) throw 0; return await r.json();}
  catch{return fb}
}

// --- SVG pin builders (city vs stadium) ---
function svgPin(fill, stroke='#0a3d62'){
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='25' height='41' viewBox='0 0 25 41'>
    <defs><filter id='s'><feDropShadow dx='0' dy='1' stdDeviation='1' flood-opacity='0.35'/></filter></defs>
    <path filter='url(#s)' d='M12.5 0C5.6 0 0 5.6 0 12.5c0 9.2 10.6 17.2 11.2 17.7a2 2 0 0 0 2.6 0C14.4 29.7 25 21.7 25 12.5 25 5.6 19.4 0 12.5 0z' fill='${fill}' stroke='${stroke}' stroke-width='1'/>
    <circle cx='12.5' cy='12.5' r='5' fill='#fff'/></svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
const ICONS = {
  city: L.icon({iconUrl: svgPin('#1e90ff'), iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[0,-36]}),
  stadium: L.icon({iconUrl: svgPin('#f7d354'), iconSize:[25,41], iconAnchor:[12,41], popupAnchor:[0,-36]}),
  active: L.icon({iconUrl: svgPin('#00e5ff'), iconSize:[30,50], iconAnchor:[15,50], popupAnchor:[0,-44]})
};

// --- Clusters (styled by CSS) ---
const cityCluster = L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:50});
const stCluster   = L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:50});
map.addLayer(cityCluster); map.addLayer(stCluster);

// --- State ---
const state = { cities:[], stadiums:[], cityMarkers:{}, stadiumMarkers:{} };

function a(href,label,ext=false){return `${href}${label}</a>`}
function internal(type,slug){return `/worldcup-2026/?${type}=${encodeURIComponent(slug)}`}

function addCityRow(c){
  const wrap=document.getElementById('cityList');
  const el=document.createElement('div'); el.className='item';
  el.innerHTML=a(internal('city',c.slug), `${c.name} <small>• ${c.country}</small>`);
  wrap.appendChild(el);
  el.querySelector('a').addEventListener('click',e=>{e.preventDefault(); history.pushState({},'',internal('city',c.slug)); focusCity(c.slug,true)});
}
function addStadiumRow(s){
  const wrap=document.getElementById('stadiumList');
  const el=document.createElement('div'); el.className='item';
  el.innerHTML=a(internal('stadium',s.slug), `${s.name} <small>• ${s.citySlug}</small>`);
  wrap.appendChild(el);
  el.querySelector('a').addEventListener('click',e=>{e.preventDefault(); history.pushState({},'',internal('stadium',s.slug)); focusStadium(s.slug,true)});
}

function addCityMarker(c){
  if(c.lat==null||c.lng==null) return;
  const html = `<b>${c.name}</b><br/>${c.country}<br/>`+a(internal('city',c.slug),'Open city details');
  const m=L.marker([c.lat,c.lng],{icon:ICONS.city}).bindPopup(html).bindTooltip(c.name);
  state.cityMarkers[c.slug]=m; cityCluster.addLayer(m);
}
function addStadiumMarker(s){
  if(s.lat==null||s.lng==null) return;
  const wa=encodeURIComponent(`Hi, I'd like match‑day details for ${s.name}.`);
  const html = `<b>${s.name}</b><br/>`+
    a(s.official_url,'Official site',true)+`<br/>`+
    a('https://concierge.matchdaynavigator.com/route?stadium='+encodeURIComponent(s.name),'Open route',true)+`<br/>`+
    a('https://wa.me/14155238886?text='+wa,'Get match‑day details on WhatsApp',true)+`<br/>`+
    a(internal('stadium',s.slug),'Open stadium details');
  const m=L.marker([s.lat,s.lng],{icon:ICONS.stadium}).bindPopup(html).bindTooltip(s.name);
  state.stadiumMarkers[s.slug]=m; stCluster.addLayer(m);
}

function fitAll(){
  const all=[...Object.values(state.cityMarkers),...Object.values(state.stadiumMarkers)];
  if(!all.length) return;
  const fg=L.featureGroup(all); map.fitBounds(fg.getBounds(),{padding:[40,40]});
}

function focusCity(slug,open=true){ const m=state.cityMarkers[slug]; if(!m) return; map.flyTo(m.getLatLng(), 11, {duration:.8}); if(open) setTimeout(()=>m.openPopup(), 850); }
function focusStadium(slug,open=true){ const m=state.stadiumMarkers[slug]; if(!m) return; map.flyTo(m.getLatLng(), 13, {duration:.8}); if(open) setTimeout(()=>m.openPopup(), 850); }

function routeFromURL(open=true){ const q=new URLSearchParams(location.search); const s=q.get('stadium'), c=q.get('city'); if(s) focusStadium(s,open); else if(c) focusCity(c,open); }

// --- Search + Filters ---
function applyFilters(){
  const usa=document.getElementById('fUSA').checked;
  const can=document.getElementById('fCAN').checked;
  const mex=document.getElementById('fMEX').checked;
  const allowed = (ctry)=> (ctry==='USA'&&usa)||(ctry==='Canada'&&can)||(ctry==='Mexico'&&mex);
  // Filter sidebar
  document.querySelectorAll('#cityList .item').forEach((el,i)=>{ const c=state.cities[i]; el.style.display=allowed(c.country)?'block':'none'; });
  document.querySelectorAll('#stadiumList .item').forEach((el,i)=>{ const s=state.stadiums[i]; const city=state.cities.find(x=>x.slug===s.citySlug)||{country:'USA'}; el.style.display=allowed(city.country)?'block':'none'; });
}

document.getElementById('search').addEventListener('input', (e)=>{
  const q=e.target.value.trim().toLowerCase();
  function match(t){return t.toLowerCase().includes(q)}
  document.querySelectorAll('#cityList .item').forEach((el,i)=>{ const c=state.cities[i]; el.style.display=(match(c.name)||match(c.country))?'block':'none'; });
  document.querySelectorAll('#stadiumList .item').forEach((el,i)=>{ const s=state.stadiums[i]; el.style.display=match(s.name)?'block':'none'; });
});
['fUSA','fCAN','fMEX'].forEach(id=>document.getElementById(id).addEventListener('change', applyFilters));

// --- Bootstrap ---
(async ()=>{
  const cities = (await loadJSON('/assets/data/cities.json', FALLBACK_CITIES)).cities||[];
  const stadiums=(await loadJSON('/assets/data/stadiums.json',FALLBACK_STADIUMS)).stadiums||[];
  state.cities=cities; state.stadiums=stadiums;
  cities.forEach(c=>{ addCityRow(c); addCityMarker(c); });
  stadiums.forEach(s=>{ addStadiumRow(s); addStadiumMarker(s); });
  fitAll(); routeFromURL(true);
  window.addEventListener('popstate', ()=>routeFromURL(true));
  window.addEventListener('resize', ()=>map.invalidateSize());
})();
