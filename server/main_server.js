if (Meteor.isServer) {
  var hashtags = ["occupy"];

  Meteor.startup(function () {

    Hashtags.remove({});
    Tweets.remove({});

   //**** hashtags **/
   Meteor.call("addHashtag", 40.80, -73.96, "test");
   Meteor.call("addHashtag", 42.37, -71.12, "harvardclimate");
   Meteor.call("addHashtag", 48.86, 2.37, "cop21");
   Meteor.call("addHashtag", 48.86, 2.38, "cop21");
   Meteor.call("addHashtag", 40.71, -74.01, "ows");
   Meteor.call("addHashtag", 40.70, -74.01, "occupywallstreet");
   Meteor.call("addHashtag", 40.76, -73.99, "riseupoctober");
   Meteor.call("addHashtag", 40.73, -74, "NYCStandsWithMinneapolis");
   Meteor.call("addHashtag", 40.73, -73.99, "Justice4Jamar");
   Meteor.call("addHashtag", 42.35, -71.06, "occupyboston");
   Meteor.call("addHashtag", 42.35, -71.05, "occupyboston");

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
       count: 50
     }, handleTweets);

    })

   //*** Stream --- old version (rewrite for multiple hashtags) -- reactivated for HarvardClimate only

   var handleStream = Meteor.bindEnvironment(function(tweet, err){
    console.log("***********************", err, "***********************");
    console.log("+++++++++++++++++++++++",tweet,"+++++++++++++++++++++++");
    Meteor.call("addTweet", tweet.text, "harvardclimate");
  });


   var stream = Twit.stream('statuses/filter', { track: "#"+hashtag });

    //**************************************************//
    // ******  uncomment to turn the stream on: ****** //
   stream.on('tweet', handleStream);


  }); // end onstartup

  Meteor.publish("tweets", function (hashtag) {
    return Tweets.find({hashtag: hashtag});
  });

  Meteor.publish("hashtags", function () {
    return Hashtags.find();
    return this.ready();
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