Template.ar.onRendered(function(){
  var ffmobile = navigator.userAgent.indexOf('Firefox') > -1 && navigator.userAgent.indexOf("Mobile") > -1;
 
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

  setInterval(function(){
    if(ffmobile){
      var wh = window.innerHeight - video.height;
      context.save();
      context.scale(1, -1);
      context.translate(0,-wh);
      var img = context.drawImage(video, 0, -video.height, window.innerWidth, window.innerHeight);
      context.restore();
    }
    else{
      var img = context.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
    }

    //renderTest("TEST");
    
    renderTweets();
    
  }, 100); // end setInterval

var renderTest = function(testText){
    context.font = '50px "Walter Turncoat"';
    context.fillStyle = 'rgba(255, 60, 180, 1)';
    context.fillText(testText, 25, 100);
}

var renderTweets = function(){
  //context.fillStyle = 'rgba(60, 180, 255, 1)';
  //context.fillText("THIS IS A TEST", 25, 150);
  var tweets = Tweets.find({}, {sort: {createdAt: -1}}).fetch();
  if(!tweets.length) {
    console.log("no tweets");
    return;
  }
  var ageMax = 0;
  // tweets.map(function(data){
  //   var age = parseInt(Date.now() - data.tweetCreatedAt);
  //   if (ageMax < age){
  //     ageMax = age;
  //   }
  // });
  var i = 1;
  tweets.map(function(data){
    // context.fillStyle = 'rgba(180, 255, 60, 1)';
    // context.fillText("THIS IS A TESTIE", 30, 50*i);
    i+=1;
    var age = parseInt(Date.now() - data.tweetCreatedAt);
        // 14400000 ms == 4 hrs
        // 3600000 ms == 1 hr
        // 1200000 ms = 20min
        // 60000 ms = 1min
    var ageMax = (3600000);
    var fsizeMax = 50,
    fsizeMin = 0;
    if (age > ageMax){ age = ageMax };
    // the scale needs to be non-linear...
    var fsize = Math.floor((((fsizeMin-fsizeMax)*age)/ageMax)+fsizeMax);
    alphaMax = 1.0;
    alphaMin = 0;
    var alpha = (((alphaMin-alphaMax)*age)/ageMax)+alphaMax;
    fsize = 30;
    var alpha = 0.9;
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

 //window.ondevicemotion = function(e){
    // var now = Date.now();
    // offset.time = now - offset.lastTime;
    // offset.lastTime = now;
    // var interval = e.interval;
    // var accX = Math.round(e.accelerationIncludingGravity.x*10)/10;
    // var accY = Math.round(e.accelerationIncludingGravity.y*10)/10;
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

  //} // end ondevicemotion

}); // end template.mainar.onrendered
