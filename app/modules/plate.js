define([
  "app",

  //modules
  "modules/plate-views"
],

function(app, Views) {

  var Plate = app.module({
    baseUrl : 'http://ft2json.appspot.com/q?sql=SELECT * FROM 1yJFHa7UaISeEbuc2Yn7huQzSv4PvAB-KdxCdBaE',
    buildUrl: function(){
        var plateQuery = ''; //' WHERE plate='+id;
        return Plate.baseUrl+plateQuery+app.FTKey;
    }
  });

  // Default model.
  Plate.Model = Backbone.Model.extend({
  
  });

  // Default collection.
  Plate.List = Backbone.Collection.extend({
    model: Plate.Model,
    url: function(){
        return Plate.buildUrl();
    },
    parse: function(response) {
        return response.data;
    }
  });

  // Attach the Views sub-module into this module.
  Plate.Views = Views;

  // Return the module for AMD compliance.
  return Plate;

});
