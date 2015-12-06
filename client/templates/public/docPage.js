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

}); // end docPage onRendered

