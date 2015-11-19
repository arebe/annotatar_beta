if (Meteor.isServer){
	Meteor.startup(function(){

		Meteor.call("addHashtag", 40.81, -73.96, "columbia");


	}); // end meteor.startup
} // end Meteor.isServer