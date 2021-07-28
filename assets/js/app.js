var mapStyles = [{"featureType": "road", "elementType": "labels", "stylers": [{"visibility": "simplified"}, {"lightness": 20}]}, {"featureType": "administrative.land_parcel", "elementType": "all", "stylers": [{"visibility": "off"}]}, {"featureType": "landscape.man_made", "elementType": "all", "stylers": [{"visibility": "on"}]}, {
	"featureType": "transit",
	"elementType": "all",
	"stylers": [{"saturation": -100}, {"visibility": "on"}, {"lightness": 10}]
}, {"featureType": "road.local", "elementType": "all", "stylers": [{"visibility": "on"}]}, {"featureType": "road.local", "elementType": "all", "stylers": [{"visibility": "on"}]}, {"featureType": "road.highway", "elementType": "labels", "stylers": [{"visibility": "simplified"}]}, {"featureType": "poi", "elementType": "labels", "stylers": [{"visibility": "off"}]}, {
	"featureType": "road.arterial",
	"elementType": "labels",
	"stylers": [{"visibility": "on"}, {"lightness": 50}]
}, {"featureType": "water", "elementType": "all", "stylers": [{"hue": "#a1cdfc"}, {"saturation": 30}, {"lightness": 49}]}, {"featureType": "road.highway", "elementType": "geometry", "stylers": [{"hue": "#f49935"}]}, {"featureType": "road.arterial", "elementType": "geometry", "stylers": [{"hue": "#fad959"}]}, {
	featureType: 'road.highway',
	elementType: 'all',
	stylers: [{hue: '#dddbd7'}, {saturation: -92}, {lightness: 60}, {visibility: 'on'}]
}, {featureType: 'landscape.natural', elementType: 'all', stylers: [{hue: '#c8c6c3'}, {saturation: -71}, {lightness: -18}, {visibility: 'on'}]}, {featureType: 'poi', elementType: 'all', stylers: [{hue: '#d9d5cd'}, {saturation: -70}, {lightness: 20}, {visibility: 'on'}]}];

function drawInfobox(category, infoboxContentWindow, json, i) {

	if (json.data[i].price) {
		var price = '<div class="price">' + json.data[i].price + '</div>'
	} else {
		price = ''
	}

	if (json.data[i].id) {
		var id = json.data[i].id
	} else {
		id = ''
	}
	if (json.data[i].url) {
		var url = json.data[i].url
	} else {
		url = ''
	}
	if (json.data[i].type) {
		var type = json.data[i].type
	} else {
		type = ''
	}
	if (json.data[i].title) {
		var title = json.data[i].title
	} else {
		title = ''
	}
	if (json.data[i].location) {
		var location = json.data[i].location
	} else {
		location = ''
	}
	if (json.data[i].gallery[0]) {
		var gallery = json.data[i].gallery[0]
	} else {
		gallery[0] = '../img/doctor.jpg'
	}

	var ibContent = '';
	ibContent     =
		'<div class="infobox">' +
		'<div class="inner">' +
		'<div class="image">' +
		'<div class="overlay">' +
		'<div class="wrapper">' +
		'<a href="' + url + '" class="detail">Open</a>' +
		'</div>' +
		'</div>' +
		'<a href="' + url + '" class="description">' +
		'<div class="meta">' +
		price +
		'<h2>' + title + '</h2>' +
		'<figure>' + location + '</figure>' +
		'</div>' +
		'</a>' +
		'<img src="' + gallery + '">' +
		'</div>' +
		'</div>' +
		'</div>';

	return ibContent;
}

function createGoogleMap(_latitude, _longitude, json) {
	let richmarkerJs = $.get( "assets/js/richmarker.js" ),
		infoboxJs    = $.get( "assets/js/infobox.js" );

	$.when( richmarkerJs, infoboxJs ).done(
		function () {
			gMapInitialization();
		}
	);

	function gMapInitialization() {
		var mapCenter     = new google.maps.LatLng( _latitude, _longitude );
		var mapOptions    = {
			zoom: 14,
			center: mapCenter,
			disableDefaultUI: false,
			scrollwheel: false,
			styles: mapStyles,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.BOTTOM_CENTER
			},
			panControl: false,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.LARGE,
				position: google.maps.ControlPosition.RIGHT_TOP
			}
		};
		var mapElement    = document.getElementById( 'map' );
		var map           = new google.maps.Map( mapElement, mapOptions );
		var newMarkersArr = [];
		var markerClicked = 0;
		var activeMarker  = false;
		var lastClicked   = false;

		for (var i = 0; i < json.data.length; i++) {

			var markerContentHTML = document.createElement( 'DIV' );

			markerContentHTML.innerHTML =
				'<div class="map-marker ">' +
				'<div class="icon">' +
				'<img src="' + json.data[i].type_icon + '">' +
				'</div>' +
				'</div>';

			// Create marker on the map

			var marker = new RichMarker(
				{
					position: new google.maps.LatLng( json.data[i].latitude, json.data[i].longitude ),
					map: map,
					draggable: false,
					content: markerContentHTML,
					flat: true
				}
			);

			newMarkersArr.push( marker );

			// Infobox

			var infoboxContentWindow = document.createElement( "div" );
			var infoboxOptions       = {
				content: infoboxContentWindow,
				disableAutoPan: false,
				pixelOffset: new google.maps.Size( -18, -42 ),
				zIndex: null,
				alignBottom: true,
				boxClass: "infobox",
				enableEventPropagation: true,
				closeBoxMargin: "0px 0px -30px 0px",
				closeBoxURL: "assets/img/close.png",
				infoBoxClearance: new google.maps.Size( 1, 1 )
			};

			// Infobox HTML element

			var category                   = json.data[i].category;
			infoboxContentWindow.innerHTML = drawInfobox( category, infoboxContentWindow, json, i );

			// Create new markers

			newMarkersArr[i].infobox = new InfoBox( infoboxOptions );

			// Show infobox after click
			google.maps.event.addListener(
				marker,
				'click',
				(function (marker, i) {
					return function () {
						google.maps.event.addListener(
							map,
							'click',
							function (event) {
								lastClicked = newMarkersArr[i];
							}
						);
						activeMarker = newMarkersArr[i];
						if (activeMarker != lastClicked) {
							for (var h = 0; h < newMarkersArr.length; h++) {
								newMarkersArr[h].content.className = 'marker-loaded';
								newMarkersArr[h].infobox.close();
							}
							newMarkersArr[i].infobox.open( map, this );
							newMarkersArr[i].infobox.setOptions( {boxClass: 'fade-in-marker'} );
							newMarkersArr[i].content.className = 'marker-active marker-loaded';
							markerClicked                      = 1;
						}
					}
				})(
					marker,
					i
				)
			);

			// Fade infobox after close is clicked
			google.maps.event.addListener(
				newMarkersArr[i].infobox,
				'closeclick',
				(function (marker, i) {
					return function () {
						activeMarker                       = 0;
						newMarkersArr[i].content.className = 'marker-loaded';
						newMarkersArr[i].infobox.setOptions( {boxClass: 'fade-out-marker'} );
					}
				})(
					marker,
					i
				)
			);
		}

		// Infobox Close
		google.maps.event.addListener(
			map,
			'click',
			function (event) {
				if (activeMarker != false && lastClicked != false) {
					if (markerClicked == 1) {
						activeMarker.infobox.open( map );
						activeMarker.infobox.setOptions( {boxClass: 'fade-in-marker'} );
						activeMarker.content.className = 'marker-active marker-loaded';
					} else {
						markerClicked = 0;
						activeMarker.infobox.setOptions( {boxClass: 'fade-out-marker'} );
						activeMarker.content.className = 'marker-loaded';
						setTimeout(
							function () {
								activeMarker.infobox.close();
							},
							350
						);
					}
					markerClicked = 0;
				}
				if (activeMarker != false) {
					google.maps.event.addListener(
						activeMarker,
						'click',
						function (event) {
							markerClicked = 1;
						}
					);
				}
				markerClicked = 0;
			}
		);

		// Marker Cluster
		var clusterStyles = [
			{
				url: 'assets/img/cluster.png',
				height: 54,
				width: 54
		}
		];

		var markerClusterItem     = new MarkerClusterer( map, newMarkersArr, {styles: clusterStyles, maxZoom: 19} );
		markerClusterItem.onClick = function (clickedClusterIcon, sameLatitude, sameLongitude) {
			return multiChoice( sameLatitude, sameLongitude, json );
		};

		// load JSON
		google.maps.event.addListener(
			map,
			'idle',
			function () {
				var visibleArray = [];
				for (var i = 0; i < json.data.length; i++) {
					if (map.getBounds().contains( newMarkersArr[i].getPosition() )) {
						visibleArray.push( newMarkersArr[i] );
						$.each(
							visibleArray,
							function (i) {
								setTimeout(
									function () {
										if (map.getBounds().contains( visibleArray[i].getPosition() )) {
											if ( ! visibleArray[i].content.className) {
												visibleArray[i].setMap( map );
												visibleArray[i].content.className += 'bounce-animation marker-loaded';
												markerClusterItem.repaint();
											}
										}
									},
									i * 50
								);
							}
						);
					} else {
						newMarkersArr[i].content.className = '';
						newMarkersArr[i].setMap( null );
					}
				}

				var visibleItemsArray = [];
				$.each(
					json.data,
					function (a) {
						if (map.getBounds().contains( new google.maps.LatLng( json.data[a].latitude, json.data[a].longitude ) )) {
							var category = json.data[a].category;
							pushItemsToArray( json, a, category, visibleItemsArray );
						}
					}
				);

				// push visible items to html
				$( '.items' ).html( visibleItemsArray );

				// cache images
				$.each(
					json.data,
					function (a) {
						if (map.getBounds().contains( new google.maps.LatLng( json.data[a].latitude, json.data[a].longitude ) )) {
							is_cached( json.data[a].gallery[0], a );
						}
					}
				);

				// Rating
				ratingFunc( '.items .item' );

				var $singleItem = $( '.items .item' );
				$singleItem.hover(
					function () {
						newMarkersArr[$( this ).attr( 'id' ) - 1].content.className = 'marker-active marker-loaded';
					},
					function () {
						newMarkersArr[$( this ).attr( 'id' ) - 1].content.className = 'marker-loaded';
					}
				);
			}
		);

		redrawMapView( 'google', map );

		function is_cached(src, a) {
			var image       = new Image();
			var loadedImage = $( '.items li #' + json.data[a].id + ' .image' );
			image.src       = src;
			if (image.complete) {
				$( ".items" ).each(
					function () {
						loadedImage.removeClass( 'loading' );
						loadedImage.addClass( 'loaded' );
					}
				);
			} else {
				$( ".items" ).each(
					function () {
						$( '.items li #' + json.data[a].id + ' .image' ).addClass( 'loading' );
					}
				);
				$( image ).load(
					function () {
						loadedImage.removeClass( 'loading' );
						loadedImage.addClass( 'loaded' );
					}
				);
			}
		}

	}
}

// Redraw map

function redrawMapView(mapProvider, map) {
	$( '.map .toggle-navigation' ).click(
		function () {
			$( '.map-canvas' ).toggleClass( 'items-collapsed' );
			$( '.map-canvas .map' ).one(
				"transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
				function () {
					if (mapProvider == 'osm') {
						map.invalidateSize();
					} else if (mapProvider == 'google') {
						google.maps.event.trigger( map, 'resize' );
					}
				}
			);
		}
	);
}

function pushItemsToArray(json, a, category, visibleItemsArray) {
	var itemPrice;
	visibleItemsArray.push(
		'<li>' +
		'<div class="item" id="' + json.data[a].id + '">' +
		'<a href="#" class="image">' +
		'<div class="inner">' +
		'<img src="' + json.data[a].gallery[0] + '" alt="">' +
		'</div>' +
		'</a>' +
		'<div class="wrapper">' +
		'<a href="#" id="' + json.data[a].id + '"><h3>' + json.data[a].title + '</h3></a>' +
		'<figure>' + json.data[a].location + '</figure>' +
		drawPriceHtml( json.data[a].price ) +
		'<div class="info">' +
		'<div class="type">' +
		'<span>' + json.data[a].type + '</span>' +
		'</div>' +
		'<div class="rating" data-rating="' + json.data[a].rating + '"></div>' +
		'</div>' +
		'</div>' +
		'</div>' +
		'</li>'
	);

	function drawPriceHtml(price) {
		if (price) {
			itemPrice = '<div class="price">' + price + '</div>';
			return itemPrice;
		} else {
			return '';
		}
	}
}


// Rating

function ratingFunc(element) {
	var ratingElement =
		'<span class="stars">' +
		'<i class="fa fa-star s1" data-score="1"></i>' +
		'<i class="fa fa-star s2" data-score="2"></i>' +
		'<i class="fa fa-star s3" data-score="3"></i>' +
		'<i class="fa fa-star s4" data-score="4"></i>' +
		'<i class="fa fa-star s5" data-score="5"></i>' +
		'</span>';
	if ( ! element) {
		element = '';
	}
	$.each(
		$( element + ' .rating' ),
		function (i) {
			$( this ).append( ratingElement );
			if ($( this ).hasClass( 'active' )) {
				$( this ).append( '<input readonly hidden="" name="score_' + $( this ).attr( 'data-name' ) + '" id="score_' + $( this ).attr( 'data-name' ) + '">' );
			}
			var rating = $( this ).attr( 'data-rating' );
			for (var e = 0; e < rating; e++) {
				var rate = e + 1;
				$( this ).children( '.stars' ).children( '.s' + rate ).addClass( 'active' );
			}
		}
	);

	var ratingActive = $( '.rating.active i' );
	ratingActive.on(
		'hover',
		function () {
			for (var i = 0; i < $( this ).attr( 'data-score' ); i++) {
				var a = i + 1;
				$( this ).parent().children( '.s' + a ).addClass( 'hover' );
			}
		},
		function () {
			for (var i = 0; i < $( this ).attr( 'data-score' ); i++) {
				var a = i + 1;
				$( this ).parent().children( '.s' + a ).removeClass( 'hover' );
			}
		}
	);
	ratingActive.on(
		'click',
		function () {
			$( this ).parent().parent().children( 'input' ).val( $( this ).attr( 'data-score' ) );
			$( this ).parent().children( '.fa' ).removeClass( 'active' );
			for (var i = 0; i < $( this ).attr( 'data-score' ); i++) {
				var a = i + 1;
				$( this ).parent().children( '.s' + a ).addClass( 'active' );
			}
			return false;
		}
	);
}

jQuery( window ).on(
	'load',
	function () {
		var _latitude  = 51.541216;
		var _longitude = -0.095678;
		var jsonPath   = 'assets/json/items.json';

		// Load JSON data and create Google Maps
		$.getJSON( jsonPath )
			.done(
				function (json) {
					createGoogleMap( _latitude, _longitude, json );
				}
			)
			.fail(
				function (jqxhr, textStatus, error) {
					console.log( error );
				}
			);
	}
);
