/* VENDO.KZ — 2GIS картасы (contact.html) */

// 2GIS Platform Manager-ден алған КІЛТТІ осы жерге қой.
// Кілтті міндетті түрде домен бойынша шектеу керек (vendo.kz және localhost).
const DGIS_KEY = 'b0d2f801-eb2b-4291-badc-8d9bc099f63a';

// Орал қаласының орталығы: [бойлық, ендік]. Нақты мекенжайыңды осында ауыстыр.
const VENDO_COORDS = [51.3865, 51.2278];

(function initMap() {
  const box = document.getElementById('map2gis');
  if (!box) return;

  const fail = (msg) => { box.innerHTML = '<span class="map-fallback">📍 ' + msg + '</span>'; };

  if (!DGIS_KEY || DGIS_KEY === 'YOUR_2GIS_KEY') return fail('Карта үшін js/map.js ішіне 2GIS кілтін қосыңыз');
  if (typeof mapgl === 'undefined') return fail('Карта жүктелмеді. Интернетті тексеріңіз');

  try {
    box.innerHTML = '';
    const map = new mapgl.Map('map2gis', {
      key: DGIS_KEY,
      center: VENDO_COORDS,
      zoom: 14,
      zoomControl: 'topRight',
    });

    const marker = new mapgl.Marker(map, { coordinates: VENDO_COORDS });
    const popup = new mapgl.HtmlMarker(map, {
      coordinates: VENDO_COORDS,
      html: '<div class="map-pin">VENDO<span>.KZ</span></div>',
      anchor: [0.5, 2.1],
    });

    marker.on('click', () => map.setCenter(VENDO_COORDS));
    window.addEventListener('resize', () => map.invalidateSize && map.invalidateSize());
  } catch (e) {
    console.error('2GIS map error:', e);
    fail('Картаны іске қосу мүмкін болмады');
  }
})();
