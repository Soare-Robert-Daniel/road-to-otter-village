const CACHE_NAME = "v2";
const ASSETS_TO_CACHE = ["/assets/favicon.ico", "/van.min.js", "/main.mjs"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache non-critical assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (!cachedResponse) {
        return fetch(event.request).then((response) => {
          const responseToCache = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
          return response;
        });
      }

      const responseDate = new Date(cachedResponse.headers.get("date"));
      const ageInMilliseconds = Date.now() - responseDate.getTime();

      if (ageInMilliseconds > 12 * 60 * 60 * 1000) {
        console.log(
          "Cache expired, fetching new data for " + event.request.url
        );
        return fetch(event.request).then((response) => {
          const responseToCache = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache));
          return response;
        });
      }

      return cachedResponse;
    })
  );
});
