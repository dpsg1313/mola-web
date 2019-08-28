self.addEventListener('fetch', function(event) {
    //var baseUrl = 'https://mola-api.dpsg1313.de/v1/';
    var baseUrl = 'https://shielded-wave-91464.herokuapp.com/v1/';
    if ('GET' === event.request.method) {
        var url = event.request.url;
        if(url.startsWith(baseUrl)){
            event.respondWith(
                caches.open(cacheName + '-mola').then(function(cache) {
                    return cache.match(url).then(function (response) {
                        return response || fetch(event.request).then(function(response) {
                            if(response.ok){
                                cache.put(url, response.clone());
                            }
                            return response;
                        });
                    });
                }).catch(function(e) {
                    // Fall back to just fetch()ing the request if some unexpected error
                    // prevented the cached response from being valid.
                    console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                    return fetch(event.request);
                })
            );
        }
    }
});