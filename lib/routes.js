Router.configure({
  // the default layout
  layoutTemplate: 'mainNav'
});
 
Router.route('/', function () {
  this.render('docPage');
  this.layout('mainNav');
});
 
 
Router.route('/ar', function () {
  this.render('ar');
  this.layout('mainAR');
});

// define route to ar pages /ar/hashtag
Router.route('/ar/:_hashtag', function(){
	var params = this.params;
	var hashtag = params._hashtag;
	this.layout('arPage');
})