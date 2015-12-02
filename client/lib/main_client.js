if (Meteor.isClient) {
  // This code only runs on the client

//Meteor.subscribe("tweets");
Meteor.subscribe("hashtags");

Template.body.helpers({
  tweets: function(){
    return Tweets.find({}, {sort: {createdAt: -1}});
  }
});

Template.mainAR.helpers({
  startAR: function(){
    console.log("startAR!");
    }, // end startAR
  }); // end mainAR helpers

Meteor.startup(function(){
  var navLat, navLon, hashtag;

  try {
    if ("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(function(position){
        navLat = position.coords.latitude;
        navLon = position.coords.longitude;
        navLat = Math.round(100*navLat)/100;
        navLon = Math.round(100*navLon)/100;
        console.log("lat: ", navLat, " long: ", navLon, " accuracy: ", position.coords.accuracy);
        $("#dynamsg").append('<p>latitude: '+navLat+' longitude: '+navLon+' accuracy: <span id="acc">'+position.coords.accuracy+'</span></p>');
        Meteor.call("findHashtag", navLat, navLon, function(err, result){
          if(result){
            hashtag = result;
            console.log("subscribing to: ", hashtag);
            Meteor.subscribe("tweets", hashtag);
          }
          else{
            console.log("no hashtag found! subscribing to #occupy");
            Meteor.subscribe("tweets", "occupy");
          }
        });
        console.log('hashtagofthemoment: ', hashtag);

      });
    }
    else{
      navLat = 0;
      navLon = 0;
    }
  } catch(err){
    console.log("geolocation error: ", err);
  }

  var renderNoTweets = function(message){
    for(var i = 0; i < 30; i++){
      context.fillStyle("#f11");
      context.fillText(message, 10, (10*i));
    }
  }




  });  // end onstartup

  window.ondevicemotion = function(e){
  // var now = Date.now();
  // offset.time = now - offset.lastTime;
  // offset.lastTime = now;
  // var interval = e.interval;
  var accX = Math.round(e.accelerationIncludingGravity.x*10)/10;
  var accY = Math.round(e.accelerationIncludingGravity.y*10)/10;
  // offset.velX = offset.velX + (accX * (offset.time/1000));
  // offset.velY = offset.velY + (accY * (offset.time/1000));
  // var xincr = 0;
  // if (accX > 0){
  //   accX > 1 ? xincr = 5 : xincr = 1;
  // }
  // else if(accX < 0){
  //   accX < -1 ? xincr = -5 : xincr = -1;
  // }
  // offset.x += xincr;
  
  // offset.y -= offset.velY;
  // console.log("accX: "+accX+" accY: "+accY+" offset.x: "+offset.x+" offset.y: "+offset.y+" offset.time: "+offset.time/1000+" interval: "+interval);

  // offset.velX = 0;
  // offset.velY = 0;

}
} // end if meteor.isClient






