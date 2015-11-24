if (Meteor.isServer) {
  Meteor.startup(function () {

   //**** hashtags **/
   Meteor.call("addHashtag", 40.81, -73.96, "columbia");
   Meteor.call("addHashtag", 40.84, -73.91, "bronx");
   Meteor.call("addHashtag", 40.83, -73.91, "bronxish");
   Meteor.call("addHashtag", 40.80, -73.96, "pitaplace");
   Meteor.call("addHashtag", 40.81, -73.95, "ambassades");
   Meteor.call("addHashtag", 40.73, -74, "dumpling");

    // for sat: #occupyboston
    var hashtags = ["occupy", "bronx", "columbia", "ambassades", "dumpling"];
    var hashtag = "";

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
        Meteor.call("addTweet", data.statuses[i].text, hashtag, data.statuses[i].created_at);
      }
      
    });


    //**************************************************//
    // ******  uncomment to turn the rest on: ****** //
    hashtags.map(function(h){
      hashtag = h;
      Twit.get('search/tweets',
      {
       q: hashtag,
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

  Meteor.publish("tweets", function () {
    return Tweets.find();
  });

  Meteor.publish("hashtags", function () {
    return Hashtags.find();
  });

  Meteor.publish("columbia", function(){
    return Tweets.find({hashtag: "columbia"});
  })

  Meteor.publish("ambassades", function(){
    return Tweets.find({hashtag: "ambassades"});
  })

  Meteor.publish("occupy", function(){
    return Tweets.find({hashtag: "occupy"});
  })

  Meteor.publish("dumpling", function(){
    return Tweets.find({hashtag: "dumpling"});
  })

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