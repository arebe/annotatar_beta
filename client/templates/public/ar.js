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

  console.log("video w: ", video.width, " video h: ", video.height);
  console.log("window w: ", $(window).width())
  context.canvas.width = $(window).width();
  context.canvas.height = $(window).height();
  context.font = "20px serif";

  try{
    navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.mozURL || window.webkitURL;

      // note ab resolution: http://stackoverflow.com/questions/27420581/get-maximum-video-resolution-with-getusermedia
      navigator.getUserMedia({'video': {
        optional: [
        {minWidth: 320},
        {minWidth: 640},
        {minWidth: 800},
        {minWidth: 900},
        {minWidth: 1024},
        {minWidth: 1280},
        {minWidth: 1920},
        {minWidth: 2560}
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
      var x, y, w, h;
      if ((video.width - $(window).width()) > (video.height - $(window).height())) {
        // portrait
        x = (video.width - $(window).width())/2;
        y = 0;
        w = video.width * ($(window).height()/video.height);
        h = $(window).height();
      }
      else {
        // landscape
        x = 0;
        y = (video.height - $(window).height())/2;
        w = $(window).width();
        h = video.height * ($(window).width()/video.width);
      }
      var img = context.drawImage(video, x, y, w, h, 0, 0, $(window).width(), $(window).height());
      renderTweets();
      //("geolocation" in navigator) ? renderTweets() : renderNoTweets("Please enable geolocation for full AR experience!");
    }, 100);

    var renderTweets = function(){
      var tweets = Tweets.find({}, {sort: {createdAt: -1}}).fetch();
      if(!tweets.length) {
        console.log("no tweets");
        return;
      }
      tweets.map(function(data){
        var age = parseInt(Date.now() - data.tweetCreatedAt);
        // 14400000 ms == 4 hrs
        // 3600000 ms == 1 hr
        // 1200000 ms = 20min
        // 60000 ms = 1min
        var ageMax = (3600000),
        fsizeMax = 50,
        fsizeMin = 0;
        if (age > ageMax){ age = ageMax };
        var fsize = Math.floor((((fsizeMin-fsizeMax)*age)/ageMax)+fsizeMax);
        alphaMax = 1.0;
        alphaMin = 0;
        var alpha = (((alphaMin-alphaMax)*age)/ageMax)+alphaMax;
        context.font = fsize+'px "Amatic SC"';
        context.fillStyle = 'rgba('+data.color.r+','+data.color.g+','+ data.color.b+','+ alpha+')';
        context.fillText(data.text, data.xPos+offset.x, data.yPos+offset.y);
      });

    };

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