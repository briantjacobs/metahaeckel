define([
  "app"
],

function(app) {
  
  var Views = {};

//this is overriding a specific post
    app.bind("post:selected", function(post){

 
});

  Views.Item = Backbone.View.extend({
    template: "subplate/item",
 
    // The DOM events specific to an item.
    events: {
      "click .subplate a":"postSelected"

    },

    serialize: function() {
      return {
        data: this.model.toJSON()
      };
    },

    initialize: function() {
      this.model.collection.on("change", function() {
        //render the list
        this.render(function(el) {

        });
      }, this);
    },
    postSelected: function(e) {
      e.preventDefault();
      //$(this.el).css({"background-color":"black"});
      var species = this.model.get("species");
      this.model.collection.each(function(item) {
        if (item.get("species") == species) {
          item.set({"active":"active"});
        } else {
          item.unset("active");
        }
      });
      app.router.navigate("/plate/" + this.model.get("plate") + "/" + this.model.get("species"));
   // this.model.select();

    }

    
  });

  Views.List = Backbone.View.extend({
      render: function(manage) {
        this.collection.each(function(item) {
          this.insertView(new Views.Item({
            model: item
          }));
        }, this);

        return manage(this).render();
      },

      initialize: function() {
        this.collection.on("reset", function() {
          this.render();
        }, this);
      }
  });

  Views.FilteredList = Backbone.View.extend({

    render: function(manage) {
   //   console.log(this.collection.species)
      var speciesTarget = unescape(this.options.speciesTarget);
      this.collection.each(function(item) {
        if (item.get("species") == speciesTarget) {
          item.set({"active":"active"});
        }
        var itemView = new Views.Item({
             model: item
         });
        //render an item

        this.insertView(itemView).render(function(el){
        });
      }, this);

      return manage(this).render();
    },

    initialize: function() {
      this.collection.on("reset", function() {
        //render the list
        this.render(function(el) {

        });
      }, this);
      
    }
  });

  return Views;

});
