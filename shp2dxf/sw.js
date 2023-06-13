

const cacheName = 'shp2dxf';

const assets = [
    
   './dist/bundle.js'
];

self.addEventListener( 'install', async function () {

	const cache = await caches.open( cacheName );

	assets.forEach( function ( asset ) {

		cache.add( asset ).catch( function () {
            console.log(asset)
			console.warn( '[SW] Cound\'t cache:', asset );

		} );

	} );

} );

self.addEventListener( 'fetch', async function ( event ) {

	if ( event.request.url.startsWith( 'chrome-extension' ) ) return;

	const request = event.request;
	event.respondWith( networkFirst( request ) );

} );

async function networkFirst( request ) {

	return fetch( request )
		.then( async function ( response ) {

			const cache = await caches.open( cacheName );

			cache.put( request, response.clone() );

			return response;

		} )
		.catch( async function () {

			const cachedResponse = await caches.match( request );

			if ( cachedResponse === undefined ) {

				console.warn( '[SW] Not cached:', request.url );

			}

			return cachedResponse;

		} );

}
