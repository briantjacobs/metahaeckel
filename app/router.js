define([
  // Application.
  "app",

  // Modules.
  "modules/subplate",
  "modules/plate"
],

function(app, Subplate, Plate) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index",
      "plate/:id": "showPlate",
      "plate/:id/": "showPlate",
      "plate/:id/:species": "filterPlate"
      //"plate/:id/:species": "index"
    },

    showPlate: function(id) {
      // Create a new Subplate List.
      var list = new Subplate.List({plate:id});

      // Use the main layout.
      app.useLayout("main").setViews({
        // Attach the root content View to the layout.
        ".list": new Subplate.Views.List({
          collection: list
        })
        // Attach the list View into the content View.
      }).render();

      // Fetch the data
      list.fetch();
    },
    filterPlate: function(id, species) {
      // Create a new Subplate List.
      var list = new Subplate.List({plate: id});

      // Use the main layout.
      app.useLayout("main").setViews({
        // Attach the root content View to the layout.
        ".list": new Subplate.Views.FilteredList({
          collection: list,
          speciesTarget: species
        }),

        ".canvas": new Subplate.Views.Canvas({
          collection: list,
          speciesTarget: species
        })

        // Attach the list View into the content View.
      }).render();

      // Fetch the data
      list.fetch({
        success: function(){
          list.trigger("filterSpecies");
        }
      });
      
    },

    index: function() {
      // Create a new Plate List.
      var list = new Plate.List();
      // Use the main layout.
      app.useLayout("main").setViews({
        // Attach the root content View to the layout.
        ".list": new Plate.Views.List({
          collection: list
        })
        // Attach the list View into the content View.
      }).render();

      // Fetch the data
      list.fetch();
    }
  });



  return Router;

});
