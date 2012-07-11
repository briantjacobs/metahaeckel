define([
  "app",

  // Views
  "modules/subplate-views"
],

function(app, Views) {

  var Subplate = app.module({
    baseUrl : 'http://ft2json.appspot.com/q?sql=SELECT * FROM 1RY8Tk5Y3KN4_L_0stwsKmuCXf_L4LznrbcFYfoc',
    buildUrl: function(id){
         var plateQuery = ' WHERE plate='+id;
        return Subplate.baseUrl+plateQuery+app.FTKey;
    }
  });
  Subplate.Model = Backbone.Model.extend({});

  Subplate.List = Backbone.Collection.extend({
	model: Subplate.Model,
    initialize: function(options) {
        options = options || (options = {});
        this.plate = options.plate;
        this.species = options.species;
      },
	url: function(){
        return Subplate.buildUrl(this.plate);
    },
	parse: function(response) {
		return response.data;
	}
});


  // Attach the Views sub-module into this module.
  Subplate.Views = Views;

  // Required, return the module for AMD compliance
  return Subplate;

});
