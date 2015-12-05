Template.docPage.onCreated(function(){
    this.hashtags = this.subscribe('hashtags');
});

Template.docPage.helpers({
    subscription: function(){
        return Template.instance().hashtags.ready();
    }
})
    

Template.docPage.onRendered(function(){
	console.log("hi i'm onRendered");
	// GoogleMaps.init(
 //    {
 //        'language': 'en' //optional
 //    }, 
 //    function(){
 //        var mapOptions = {
 //            zoom: 3,
 //            mapTypeId: google.maps.MapTypeId.HYBRID
 //        };
 //        map = new google.maps.Map(document.getElementById("map"), mapOptions); 
 //        map.setCenter(new google.maps.LatLng( 30, -74 ));
 //        addMarkers(map);
 //    }
// );

}); // end docPage onRendered

function addMarkers(map){
    var icon = 'tweet_marker.png';
    var markers = [];
    var hashtagsCursor = Hashtags.find();
    hashtagsCursor.map(function(h){
        console.log("adding marker for: ", h.lat, " ", h.lon, " ", h.hashtag);
        markers.push(new google.maps.Marker({
            position: new google.maps.LatLng(h.lat, h.lon),
            map: map,
            icon: icon,
            title: h.hashtag
         }));
    })
}


/*function initMap(){

    var mapOptions = {
        center: {
            lat: 30,
            lng: -74
        },
        zoom: 3,

        // disables scroll-initiated zooming
        scrollwheel: true,

        // hides other scaling, zooming, and display options
        panControl: true,
        zoomControl: true,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,

        //display satellite map w high level labels as default
        mapTypeId: google.maps.MapTypeId.HYBRID,
    };

    var styles = [
        //stuff placed in here will style the map -- when it is a road map displayed
        {
        	featureType: "administrative.country",
        	elementType: "labels",
        	stylers: [{
        		visibility: "off"
        	}]
        }
        ];

    // defines map object and applies styling to that object
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    map.setOptions({
    	styles: styles
    });
// var map = new google.maps.Map(document.getElementById('map'), {
//     center: {lat: 40, lng: -74},
//     scrollwheel: false,
//     zoom: 5
//   });


    var icon = 'tweet_marker.png';
    var markers = [];
    // items added to this list will be added to the navigation map at the top of the site
    var hashtagsCursor = Hashtags.find();
    hashtagsCursor.map(function(h){
    	console.log("adding marker for: ", h.lat, " ", h.lon, " ", h.hashtag);
    	markers.push(new google.maps.Marker({
    		position: new google.maps.LatLng(h.lat, h.lon),
    		map: map,
            icon: icon,
    		title: h.hashtag
    	}));
    })
    // markers[0] = new google.maps.Marker({
    // 	position: new google.maps.LatLng(42.333172, -83.044960),
    // 	map: map,
    // 	icon: icon,
    // 	title: 'Detroit, MI',
    // 	url: '#detroit'
    // });
    // markers[1] = new google.maps.Marker({
    // 	position: new google.maps.LatLng(38.004111, -80.944114),
    // 	map: map,
    // 	icon: icon,
    // 	title: 'Clifftop, WV',
    // 	url: '#clifftop'
    // });
    // markers[2] = new google.maps.Marker({
    // 	position: new google.maps.LatLng(34.056915, -118.248311),
    // 	map: map,
    // 	icon: icon,
    // 	title: 'Los Angelas, CA',
    // 	url: '#la'
    // });
    // markers[3] = new google.maps.Marker({
    // 	position: new google.maps.LatLng(28.539998, -81.370123),
    // 	icon: icon,
    // 	map: map,
    // 	title: 'Orlando, FL',
    // 	url: '#orlando'
    // });

    // turns each map marker into a link
    // for (var i = 0; i < markers.length; i++) {
    // 	google.maps.event.addListener(markers[i], 'click', function() {
    // 		window.location.href = this.url;
    // 	});
    // }

// google.maps.event.addDomListener(window, 'load', initMap);


} // end initMap*/  