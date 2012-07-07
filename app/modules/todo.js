define([
  "app",

  // Libs
  "backbone",

  // Views
  "modules/todo/views"

],

function(app, Backbone, Views) {

  // Create a new module
  var Todo = app.module();

  Todo.Model = Backbone.Model.extend({
    defaults: {
    }
  });

  Todo.List = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: Todo.Model,
    url: 'http://ft2json.appspot.com/q?sql=SELECT * FROM 1RY8Tk5Y3KN4_L_0stwsKmuCXf_L4LznrbcFYfoc&key=AIzaSyD_m4f3s5GagfJm9JCW9C9p0JX4-IknhtQ&jsonCallback=',
    parse: function(response) {
        return response.data;
    }
  });

  // Attach the Views sub-module into this module.
  Todo.Views = Views;

  // Required, return the module for AMD compliance
  return Todo;

});
