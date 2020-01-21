const Cache = {
  PREFIX: `trip-cache`,
  VER: `v1`
}

const CACHE_NAME = `${Cache.PREFIX}-${Cache.VER}`;
const INDEX_FIRST_ELEMENT = 0;
const STATUS_OK = 200;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/normalize.css`,
            `/css/style.css`,
            `/fonts/montserrat-bold-webfont.woff2`,
            `/fonts/montserrat-extrabold-webfont.woff2`,
            `/fonts/montserrat-medium-webfont.woff2`,
            `/fonts/montserrat-regular-webfont.woff2`,
            `/fonts/montserrat-semibold-webfont.woff2`,
            `/img/header-bg.png`,
            `/img/header-bg@2x.png`,
            `/img/logo.png`,
            `/img/icons/bus.png`,
            `/img/icons/check-in.png`,
            `/img/icons/drive.png`,
            `/img/icons/flight.png`,
            `/img/icons/restaurant.png`,
            `/img/icons/ship.png`,
            `/img/icons/sightseeing.png`,
            `/img/icons/taxi.png`,
            `/img/icons/train.png`,
            `/img/icons/transport.png`,
            `/img/icons/trip.png`
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      caches.keys()
        .then(
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      if (key.indexOf(Cache.PREFIX) === INDEX_FIRST_ELEMENT && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }
                      return null;
                    }
                ).filter(
                    (key) => key !== null
                )
            )
        )
  );
});

self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;
  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          }
          return fetch(request).then(
              (response) => {
                if (!response || response.status !== STATUS_OK || response.type !== `basic`) {
                  return response;
                }
                const clonedResponse = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse));
                return response;
              }
          ).catch((error) => {
            console.log(error)
            return Promise.resolve(new Response());
          });
        })
  );
});
