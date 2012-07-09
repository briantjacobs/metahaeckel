define([
  "app"
],

function(app) {
  
  var Views = {};

  Views.Item = Backbone.View.extend({
    template: "plate/item",
 
    // The DOM events specific to an item.
    events: {
    },

    serialize: function() {
      return {
        data: this.model.toJSON()
      };
    },

    initialize: function() {
    
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

  return Views;

});
