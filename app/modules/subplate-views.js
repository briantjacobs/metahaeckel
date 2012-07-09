define([
  "app"
],

function(app) {
  
  var Views = {};

  Views.Item = Backbone.View.extend({
    template: "subplate/item",
 
    // The DOM events specific to an item.
    events: {
     // "filterSpecies": "highlight"
    },

    serialize: function() {
      return {
        data: this.model.toJSON()
      };
    },

    initialize: function() {
      this.on("filterSpecies", function() {
        console.log("yeah!!");
      }, this);
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
