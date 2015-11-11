Router.configure({
  // the default layout
  layoutTemplate: 'mainNav'
});
 
Router.route('/', function () {
  this.render('docPage');
  this.layout('mainNav');
});
 
 
Router.route('/ar', function () {
  this.render('arPage');
  this.layout('mainAR');
});