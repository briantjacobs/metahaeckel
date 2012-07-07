define([
  // Application.
  "app",

  // Modules.
  "modules/subplate"
],

function(app, Subplate) {

  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      // Create a new Subplate List.
      var list = new Subplate.List();

      // Use the main layout.
      app.useLayout("main").setViews({
        // Attach the root content View to the layout.
        ".list": new Subplate.Views.List({
          collection: list
        }),
        "form": new Subplate.Views.Form({
          collection: list
        }),

        // Attach the stats View into the content View.
        ".stats": new Subplate.Views.Stats({
          collection: list
        })
        // Attach the list View into the content View.
      }).render();

      // Fetch the data from localStorage
      list.fetch();
    }
  });

  return Router;

});
