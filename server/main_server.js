if (Meteor.isServer) {

  var hashtags = ["occupy"];

  Meteor.startup(function () {

    Hashtags.remove({});

   //**** hashtags **/
   Meteor.call("addHashtag", 40.81, -73.96, "columbia");
   Meteor.call("addHashtag", 40.84, -73.91, "bronx");
   Meteor.call("addHashtag", 40.83, -73.91, "bronxish");
   Meteor.call("addHashtag", 40.80, -73.96, "pastry");
   Meteor.call("addHashtag", 40.81, -73.95, "ambassades");
   Meteor.call("addHashtag", 40.73, -74, "dumpling");
   Meteor.call("addHashtag", 40.74, -74, "meow");
   Meteor.call("addHashtag", 42.37, -71.12, "harvard");
   Meteor.call("addHashtag", 38.91, -77.02, "whatever");
   Meteor.call("addHashtag", 48.86, 2.37, "cop21");
   Meteor.call("addHashtag", 48.86, 2.38, "cop21");

   var hashtagsCursor = Hashtags.find();
   hashtagsCursor.map(function(h){
    console.log("pushing: ", h.hashtag);
    hashtags.push(h.hashtag); 
  })


   Twit = new TwitMaker({
    consumer_key:         Meteor.settings.twitter.consumer_key
    , consumer_secret:      Meteor.settings.twitter.consumer_secret
    , access_token:         Meteor.settings.twitter.access_token
    , access_token_secret:  Meteor.settings.twitter.access_token_secret
  });

    //*** REST

    var handleTweets = Meteor.bindEnvironment(function(err, data, response) {
      console.log(data);
      console.log("***********************", err, "***********************");
      for(var i = 0; i < data.statuses.length; i++){
        Meteor.call("addTweet", data.statuses[i].text, data.search_metadata.query, data.statuses[i].created_at);
      }
    });


    //**************************************************//
    // ******  uncomment to turn the rest on: ****** //
    hashtags.map(function(h){
      hashtag = h;
      Twit.get('search/tweets',
      {
       q: h,
       count: 20
     }, handleTweets);

    })

   //*** Stream --- old version (rewrite for multiple hashtags)

   var handleStream = Meteor.bindEnvironment(function(tweet, err){
    console.log("***********************", err, "***********************");
    console.log("+++++++++++++++++++++++",tweet,"+++++++++++++++++++++++");
    Meteor.call("addTweet", tweet.text, hashtag);
  });


   // var stream = Twit.stream('statuses/filter', { track: "#"+hashtag });

    //**************************************************//
    // ******  uncomment to turn the stream on: ****** //
   // stream.on('tweet', handleStream);


  }); // end onstartup

  Meteor.publish("tweets", function (hashtag) {
    return Tweets.find({hashtag: hashtag});
  });

  Meteor.publish("hashtags", function () {
    return Hashtags.find();
  });


  Houston.methods("Tweets", {
    "Download": function(e){
      var nameFile = 'fileDownloaded.csv';
      Meteor.call('download', function(err, fileContent) {
        if(fileContent){
          var blob = new Blob([fileContent], {type: "text/plain;charset=utf-8"});
          saveAs(blob, nameFile);
        }
      })
      return "Downloaded Tweets";
    },
  });


} // end if meteor.isServer