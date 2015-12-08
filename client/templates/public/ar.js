Template.mainAR.onRendered(function(){

  var offset = {
    lastTime: 0,
    time: 0,
    velX: 0.0,
    velY: 0.0,
    x: 0.0,
    y: 0.0,
  };

  var ar = $('#ar'),
  canvas = $('canvas', ar)[0],
  context = canvas.getContext('2d'),
  video = $('video', ar)[0],
  navLat, navLong, accurate,
  hashtag;
  var sx = 0, 
  sy = 0, 
  sw = video.width, 
  sh = video.height;

  console.log("video w: ", video.width, " video h: ", video.height);
  console.log("window w: ", $(window).width())
  context.canvas.width = $(window).width();
  context.canvas.height = $(window).height();
  context.font = "20px serif";

//****************************
// navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
//    getUserMedia: function(c) {
//      return new Promise(function(y, n) {
//        (navigator.mozGetUserMedia ||
//         navigator.webkitGetUserMedia).call(navigator, c, y, n);
//      });
//    }
// } : null);

// if (!navigator.mediaDevices) {
//   console.log("getUserMedia() not supported.");
//   return;
// }

// // Prefer camera resolution nearest to 1280x720.

// var constraints = { audio: false, video: { width: 1280, height: 720 } };

// navigator.mediaDevices.getUserMedia(constraints)
// .then(function(stream) {
//   var video = document.querySelector('video');
//   video.src = window.URL.createObjectURL(stream);
//   video.onloadedmetadata = function(e) {
//     video.play();
//   };
// })
// .catch(function(err) {
//   console.log(err.name + ": " + err.message);
// });
//****************************


  try{
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.mozURL || window.webkitURL;

      // note ab resolution: http://stackoverflow.com/questions/27420581/get-maximum-video-resolution-with-getusermedia
      navigator.getUserMedia({ audio: false, 'video': {
        optional: [
        // {minWidth: 320},
        // {minWidth: 640},
        // {minWidth: 800},
        // {minWidth: 900},
        // {minWidth: 1024},
        // {minWidth: 1280},
        // {minWidth: 1920},
        // {minWidth: 2560}
        ]
      }}, 
      function(stream){
        video.src = window.opera ? stream : window.URL.createObjectURL(stream);
        video.play();
      }, 
      function(err){
        console.err("video capture error: ", err);
      })

    } catch(err){
      console.log("navigator.getUserMedia error: ", err);
    }

    video.style.position = "absolute";
    video.style.visibility = "hidden";

    window.addEventListener(
      'load',
      function () {
        //fullscreencan(canvas);
        //fullscreenvid(video);
      },
      false
      );

    function fullscreencan(canvas) {
      var style = canvas.getAttribute('style') || '';

      window.addEventListener('resize', function () {resize(canvas);}, false);

      resize(canvas);

      function resize(canvas) {
        var scale = {x: 1, y: 1};
      // scale > 1 if viewport dim is larger
      scale.x = (window.innerWidth - 10) / canvas.width; 
      scale.y = (window.innerHeight - 10) / canvas.height;
      //console.log("window.innerHeight: ", window.innerHeight - 10, " canvas.height: ", canvas.height);
      //console.log("scale: ", scale);
      if (scale.x < 1 || scale.y < 1) {
        scale = '1, 1'; // if canvas is larger (on either dim), no scaling needed
      } else if (scale.x < scale.y) {  
        scale = scale.x + ', ' + scale.x;  // if landscape, use x scale
      } else {
        scale = scale.y + ', ' + scale.y;  // if portrait, use y scale
      }

      canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
    }
  } // end fullscreencan

  function fullscreenvid(video){
    window.addEventListener('resize', function () {resize(canvas);}, false);

    resize(video);

    function resize(video) {
      var scale = {x: 1, y: 1};
      scale.x = $(window).width() / video.width;
      scale.y = $(window).height() / video.height;
      if ($(window).width() < $(window).height()){
        // portrait mode
        // scale using y
        sw = video.width * scale.y;
        sh = video.height * scale.y;
        // slice extra x
        sx = (sxw - $(window).width()) / 2;
        sy = 0;
      }
      else{
        // lanscape mode
        // scale using x
        sw = video.width * scale.x;
        sh = video.height * scale.y;
        // slice extra y
        sx = 0;
        sy = (sh - $(window).height()) / 2;
      }
    }
  } // end fullscreenvid


  setInterval(function(){

      // if ((video.width - $(window).width()) > (video.height - $(window).height())) {
      //   // portrait
      //   x = (video.width - $(window).width())/2;
      //   y = 0;
      //   w = video.width * ($(window).height()/video.height);
      //   h = $(window).height();
      // }
      // else {
      //   // landscape
      //   x = 0;
      //   y = (video.height - $(window).height())/2;
      //   w = $(window).width();
      //   h = video.height * ($(window).width()/video.width);
      // }
    var img = context.drawImage(video, sx, sy, sw, sh, 0, 0, $(window).width(), $(window).height());
    renderTweets();
      //("geolocation" in navigator) ? renderTweets() : renderNoTweets("Please enable geolocation for full AR experience!");
  }, 100); // end setInterval

var renderTweets = function(){
  var tweets = Tweets.find({}, {sort: {createdAt: -1}}).fetch();
  //var tweetElements = [];
  if(!tweets.length) {
    console.log("no tweets");
    return;
  }
  var ageMax = 0;
  tweets.map(function(data){
    var age = parseInt(Date.now() - data.tweetCreatedAt);
    if (ageMax < age){
      ageMax = age;
    }
  })
  tweets.map(function(data){
    var age = parseInt(Date.now() - data.tweetCreatedAt);
        // 14400000 ms == 4 hrs
        // 3600000 ms == 1 hr
        // 1200000 ms = 20min
        // 60000 ms = 1min
        //var ageMax = (3600000);
        var fsizeMax = 50,
        fsizeMin = 0;
        if (age > ageMax){ age = ageMax };
        var fsize = Math.floor((((fsizeMin-fsizeMax)*age)/ageMax)+fsizeMax);
        alphaMax = 1.0;
        alphaMin = 0;
        var alpha = (((alphaMin-alphaMax)*age)/ageMax)+alphaMax;
        context.font = fsize+'px "Walter Turncoat"';
        context.fillStyle = 'rgba('+data.color.r+','+data.color.g+','+ data.color.b+','+ alpha+')';
        context.fillText(data.text, data.xPos+offset.x, data.yPos+offset.y);
    }); // end tweets.map
}; // end renderTweets

$("#downloadBtn").click(function(event) {
  var filename = 'annotatar_data.csv';
  Meteor.call('download', function(err, fileContent) {
    if(fileContent){
      var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
      saveAs(blob, filename);
    }
  })
});

$("#captureBtn").click(function(e){
  var url = canvas.toDataURL('png');
  $("#captureLink").attr('href', url).click();

});

}); // end template.mainar.onrendered
