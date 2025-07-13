const apiKey = '4IRtkgIJiyGkWedkx3O2rnX9yUKjYVtQgJYdiRS7';

// NASA APOD (Astronomy Picture of the Day)
fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('apod-date').textContent = data.date;
    document.getElementById('apod-img').src = data.url;
    document.getElementById('apod-desc').textContent = data.explanation;
  });

let descExpanded = false;
function toggleDescription() {
  const desc = document.getElementById('apod-desc');
  descExpanded = !descExpanded;
  desc.classList.toggle('expanded', descExpanded);
  document.querySelector('.toggle-btn').textContent = descExpanded ? 'Weniger anzeigen' : 'Mehr anzeigen';
}

// Mars-Rover Bilder (Curiosity, sol=1000)
fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('mars-gallery');
    data.photos.slice(0, 10).forEach(photo => {
      const img = document.createElement('img');
      img.src = photo.img_src;
      img.alt = photo.camera.full_name;
      img.onclick = () => openLightbox(photo.img_src);
      gallery.appendChild(img);
    });
  });

function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  img.src = src;
  lightbox.style.display = 'flex';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.style.display = 'none';
}

// NEOs (Near Earth Objects) für heute
fetch(`https://api.nasa.gov/neo/rest/v1/feed/today?api_key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    const neoList = document.getElementById('neo-list');
    const today = Object.keys(data.near_earth_objects)[0];
    data.near_earth_objects[today].forEach(neo => {
      const li = document.createElement('li');
      li.textContent = `${neo.name} - Max. Durchmesser: ${neo.estimated_diameter.meters.estimated_diameter_max.toFixed(2)} m, Gefährlich: ${neo.is_potentially_hazardous_asteroid ? 'Ja' : 'Nein'}`;
      neoList.appendChild(li);
    });
  });

// OpenLayers Karte mit NASA GIBS MODIS Layer
const map = new ol.Map({
  target: 'gibs-map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.TileWMS({
        url: 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi',
        params: {
          LAYERS: 'MODIS_Terra_CorrectedReflectance_TrueColor',
          FORMAT: 'image/png',
          TRANSPARENT: true,
          TIME: new Date().toISOString().split('T')[0]
        },
        attributions: 'NASA GIBS'
      })
    })
  ],
  view: new ol.View({
    projection: 'EPSG:4326',
    center: [10.8333, 48.0833], // Buchloe, Bayern
    zoom: 5,
    maxZoom: 12,
    minZoom: 2
  })
});

// Mondphase mit SunCalc
function updateMoonPhase() {
  const moonIllum = SunCalc.getMoonIllumination(new Date());
  const phase = moonIllum.phase;
  let phaseName = '';
  if (phase === 0) phaseName = 'Neumond';
  else if (phase < 0.25) phaseName = 'Zunehmender Sichelmond';
  else if (phase === 0.25) phaseName = 'Erstes Viertel';
  else if (phase < 0.5) phaseName = 'Zunehmender Mond';
  else if (phase === 0.5) phaseName = 'Vollmond';
  else if (phase < 0.75) phaseName = 'Abnehmender Mond';
  else if (phase === 0.75) phaseName = 'Letztes Viertel';
  else phaseName = 'Abnehmender Sichelmond';
  document.getElementById('moon-phase').textContent = phaseName;
  document.getElementById('moonphase').textContent = phaseName;
}
updateMoonPhase();

// Lokale Sonnen- und Mondzeiten für Buchloe
const buchloe = { lat: 48.0833, lon: 10.8333 };
function updateLocalSkyEvents() {
  const now = new Date();
  const times = SunCalc.getTimes(now, buchloe.lat, buchloe.lon);
  const moonTimes = SunCalc.getMoonTimes(now, buchloe.lat, buchloe.lon);

  document.getElementById('sunrise').textContent = times.sunrise.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('sunset').textContent = times.sunset.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('moonrise').textContent = moonTimes.rise ? moonTimes.rise.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : 'Kein Mondaufgang heute';
  document.getElementById('moonset').textContent = moonTimes.set ? moonTimes.set.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : 'Kein Monduntergang heute';
}
updateLocalSkyEvents();

// Himmelsereignisse (komplette Liste)
const skyEvents = [
  { date: "10. Juli 2025", name: "Bockmond 🌕" },
  { date: "24. Juli 2025", name: "Neumond 🌑" },
  { date: "9. August 2025", name: "Störmond 🌕" },
  { date: "12./13. August 2025", name: "Perseiden-Meteorschauer 🌠" },
  { date: "19. August 2025", name: "Merkur in größter westlicher Elongation ☿️" },
  { date: "23. August 2025", name: "Black Moon 🌑" },
  { date: "7./8. September 2025", name: "Totale Mondfinsternis 🌘" },
  { date: "7. September 2025", name: "Maismond 🌕" },
  { date: "21. September 2025", name: "Partielle Sonnenfinsternis 🌒" },
  { date: "21. September 2025", name: "Neumond 🌑" },
  { date: "21. September 2025", name: "Saturn in Opposition 🪐" },
  { date: "22. September 2025", name: "Herbst-Tagundnachtgleiche 🍁" },
  { date: "7. Oktober 2025", name: "Erntemond 🌕" },
  { date: "8./9. Oktober 2025", name: "Draconiden-Meteorschauer 🌠" },
  { date: "21. Oktober 2025", name: "Neumond 🌑" },
  { date: "21./22. Oktober 2025", name: "Orioniden-Meteorschauer 🌟" },
  { date: "29. Oktober 2025", name: "Merkur in größter östlicher Elongation ☿️" },
  { date: "5. November 2025", name: "Super-Bibermond 🌕✨" },
  { date: "17./18. November 2025", name: "Leoniden-Meteorschauer 🌠" },
  { date: "20. November 2025", name: "Mini-Neumond 🌑" },
  { date: "4. Dezember 2025", name: "Super-Julmond 🌕❄️" },
  { date: "7. Dezember 2025", name: "Merkur in größter westlicher Elongation ☿️" },
  { date: "13./14. Dezember 2025", name: "Geminiden-Meteorschauer 🌠" },
  { date: "20. Dezember 2025", name: "Neumond 🌑" },
  { date: "21. Dezember 2025", name: "Wintersonnenwende ❄️" },
  { date: "21./22. Dezember 2025", name: "Ursiden-Meteorschauer 🌠" }
];

// Hilfsfunktion: Monatsname auf Zahl mappen
const monthMap = {
  "Januar": 0, "Februar": 1, "März": 2, "April": 3, "Mai": 4, "Juni": 5,
  "Juli": 6, "August": 7, "September": 8, "Oktober": 9, "November": 10, "Dezember": 11
};

function extractMonth(eventDateStr) {
  const months = Object.keys(monthMap);
  for (const month of months) {
    if (eventDateStr.includes(month)) {
      return monthMap[month];
    }
  }
  return null;
}

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const filteredEvents = skyEvents.filter(evt => {
  const monthNum = extractMonth(evt.date);
  const yearMatch = evt.date.match(/\d{4}/);
  const yearNum = yearMatch ? parseInt(yearMatch[0]) : null;
  return monthNum === currentMonth && yearNum === currentYear;
});

const ul = document.getElementById("sky-events");
if (ul) {
  ul.innerHTML = ''; // sicher vorher löschen

  if (filteredEvents.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Keine Himmelsereignisse im aktuellen Monat.";
    ul.appendChild(li);
  } else {
    filteredEvents.forEach(evt => {
      const li = document.createElement("li");
      li.textContent = `${evt.date} – ${evt.name}`;
      ul.appendChild(li);
    });
  }
}

// ISS-Sichtungen für Buchloe laden und anzeigen
function loadIssPasses() {
  const lat = 48.0833;
  const lon = 10.8333;

  fetch(`https://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}&n=5`)
    .then(res => {
      if (!res.ok) throw new Error(`Netzwerkfehler: ${res.status}`);
      return res.json();
    })
    .then(data => {
      const container = document.getElementById('iss-pass');
      container.innerHTML = '';

      if (data.response && data.response.length > 0) {
        const ul = document.createElement('ul');
        data.response.forEach(pass => {
          const date = new Date(pass.risetime * 1000);
          const duration = pass.duration;
          const li = document.createElement('li');
          li.textContent = `Sichtbar am ${date.toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })} für ${duration} Sekunden`;
          ul.appendChild(li);
        });
        container.appendChild(ul);
      } else {
        container.textContent = 'Keine ISS-Durchgänge für heute verfügbar.';
      }
    })
    .catch(err => {
      const container = document.getElementById('iss-pass');
      container.textContent = 'Fehler beim Laden der ISS-Durchgänge.';
      console.error('ISS API Fehler:', err);
    });
}
loadIssPasses();

// Nächster sichtbarer Meteorschauer aus der Liste berechnen
function updateNextMeteorShower() {
  const meteorShowers = skyEvents.filter(evt =>
    evt.name.toLowerCase().includes('meteorschauer')
  );
  if (meteorShowers.length === 0) {
    document.getElementById('next-meteor-shower').textContent = 'Keine Meteorschauer gefunden.';
    return;
  }

  const now = new Date();
  let nextShower = null;
  let nextDate = null;

  for (const shower of meteorShowers) {
    // Beispiel: "12./13. August 2025"
    const dateMatch = shower.date.match(/(\d{1,2})(?:\.\/(\d{1,2}))?\.?\s+([A-Za-z]+)\s+(\d{4})/);
    if (!dateMatch) continue;

    let day = parseInt(dateMatch[1], 10);
    const monthName = dateMatch[3];
    const year = parseInt(dateMatch[4], 10);
    const month = monthMap[monthName];

    if (dateMatch[2]) {
      const day2 = parseInt(dateMatch[2], 10);
      const date1 = new Date(year, month, day);
      const date2 = new Date(year, month, day2);
      if (date1 < now) day = day2;
    }

    const showerDate = new Date(year, month, day);

    if (showerDate >= now && (!nextDate || showerDate < nextDate)) {
      nextDate = showerDate;
      nextShower = shower;
    }
  }

  if (nextShower && nextDate) {
    const formattedDate = nextDate.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
    document.getElementById('next-meteor-shower').textContent = `${nextShower.name} am ${formattedDate}`;
  } else {
    document.getElementById('next-meteor-shower').textContent = 'Keine kommenden Meteorschauer.';
  }
}
updateNextMeteorShower();
