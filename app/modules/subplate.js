define([
  "app",

  // Libs
  "backbone",

  // Views
  "modules/subplate/views"

],

function(app, Backbone, Views) {

  // Create a new module
  var Subplate = app.module();

  Subplate.Model = Backbone.Model.extend({
    defaults: {
    }
  });

  Subplate.List = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: Subplate.Model,
    url: 'http://ft2json.appspot.com/q?sql=SELECT * FROM 1RY8Tk5Y3KN4_L_0stwsKmuCXf_L4LznrbcFYfoc&key=AIzaSyD_m4f3s5GagfJm9JCW9C9p0JX4-IknhtQ&jsonCallback=',
    parse: function(response) {
        return response.data;
    }
  });

  // Attach the Views sub-module into this module.
  Subplate.Views = Views;

  // Required, return the module for AMD compliance
  return Subplate;

});
