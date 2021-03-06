define([
  // Libraries.
  "jquery",
  "lodash",
  "backbone",
  //kinetic  andhandlebars should be passed below without breaking  
  "handlebars",

  // Plugins.
  "plugins/backbone.layoutmanager"
],

function($, _, Backbone) {
  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
    // The root path to run the application through.
    root: "/",
    FTKey: '&key=AIzaSyD_m4f3s5GagfJm9JCW9C9p0JX4-IknhtQ',
    normalizeTransform: function(value, minSource, maxSource, minDest, maxDest) {
      //http://stackoverflow.com/a/1477265/262305
      x = (((maxDest-minDest)*(value-minSource))/(maxSource-minSource))+minDest;
      return x;
    }
  };

  // Localize or create a new JavaScript Template object.
  var JST = window.JST = window.JST || {};

  // Configure LayoutManager with Backbone Boilerplate defaults.
  Backbone.LayoutManager.configure({
    paths: {
      layout: "app/templates/layouts/",
      template: "app/templates/"
    },
    render: function(template, context) {
      return template(context);
    },

    fetch: function(path) {
      path = path + ".html";

      if (!JST[path]) {
        $.ajax({ url: "/" + path, async: false }).then(function(contents) {
          JST[path] = Handlebars.compile(contents);
        });
      }
      
      return JST[path];
    }
  });

  // Mix Backbone.Events, modules, and layout management into the app object.
  return _.extend(app, {
    // Create a custom object with a nested Views object.
    module: function(additionalProps) {
      return _.extend({ Views: {} }, additionalProps);
    },

    // Helper for specific layouts.
    useLayout: function(name) {
      // If already using this Layout, then don't re-inject into the DOM.
      if (this.layout && this.layout.options.template === name) {
        return this.layout;
      }

      // If a layout already exists, remove it from the DOM.
      if (this.layout) {
        this.layout.remove();
      }

      // Create a new Layout.
      var layout = new Backbone.Layout({
        template: name,
        className: "layout " + name,
        id: "layout"
      });

      // Insert into the DOM.
      $("#main").empty().append(layout.el);

      // Render the layout.
      layout.render();

      // Cache the reference on the Router.
      this.layout = layout;

      // Return the reference, for later usage.
      return layout;
    }
  }, Backbone.Events);

});
