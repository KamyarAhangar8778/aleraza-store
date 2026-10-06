const FONT_CACHE_NAME = 'aleraza-fonts-cache-v2';
const IMAGE_CACHE_NAME = 'aleraza-images-cache-v2';

const INITIAL_IMAGES_TO_PRECACHE = [
  '/images/hero_appliance_accessories.jpg',
  '/images/fridge_water_filter.jpg',
  '/images/vacuum_hepa_kit.jpg',
  '/images/espresso_barista_kit.jpg',
  '/images/washer_care_stand.jpg',
  '/images/airfryer_accessory_pack.jpg',
  '/images/aleraza_hero_kitchen.jpg',
  '/images/espresso_maker_pro.jpg',
  '/images/smart_washer_titanium.jpg',
  '/images/stand_mixer_copper.jpg',
  '/images/cordless_vacuum_pro.jpg',
  '/images/smart_air_fryer.jpg',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(IMAGE_CACHE_NAME).then((cache) => {
      return cache.addAll(INITIAL_IMAGES_TO_PRECACHE).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== FONT_CACHE_NAME && key !== IMAGE_CACHE_NAME) {
              return caches.delete(key);
            }
            return Promise.resolve();
          })
        )
      ),
    ])
  );
});

function isFontRequest(request, url) {
  if (request.destination === 'font') return true;
  if (
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    return true;
  }
  return /\.(woff2?|ttf|otf|eot)(\?.*)?$/i.test(url.pathname);
}

function isImageRequest(request, url) {
  if (request.destination === 'image') return true;
  if (
    url.pathname.includes('/images/') ||
    url.hostname.includes('images.unsplash.com') ||
    url.hostname.includes('picsum.photos')
  ) {
    return true;
  }
  return /\.(jpe?g|png|webp|avif|gif|svg|ico)(\?.*)?$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;

  // 1. Cache-First Strategy for Fonts
  if (isFontRequest(request, url)) {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (
            networkResponse &&
            (networkResponse.status === 200 || networkResponse.type === 'opaque')
          ) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return cachedResponse || Response.error();
        }
      })
    );
    return;
  }

  // 2. Cache-First with Background Revalidation for Product & Hero Images
  if (isImageRequest(request, url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          if (
            networkResponse &&
            (networkResponse.status === 200 || networkResponse.type === 'opaque')
          ) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          return cachedResponse || Response.error();
        }
      })
    );
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_IMAGES' && Array.isArray(event.data.urls)) {
    const urls = event.data.urls;
    event.waitUntil(
      caches.open(IMAGE_CACHE_NAME).then(async (cache) => {
        for (const rawUrl of urls) {
          if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.startsWith('data:')) continue;
          try {
            const existing = await cache.match(rawUrl);
            if (!existing) {
              const req = new Request(rawUrl, {
                mode: rawUrl.startsWith('http') ? 'no-cors' : 'same-origin',
              });
              const res = await fetch(req);
              if (res && (res.status === 200 || res.type === 'opaque')) {
                await cache.put(rawUrl, res);
              }
            }
          } catch {
            // Ignore individual image fetch errors
          }
        }
      })
    );
  }
});
