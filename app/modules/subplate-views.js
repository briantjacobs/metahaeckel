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
          //put canvas element here
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



   Views.Shape = Backbone.View.extend({

    createShape : function(x, y, w, h, fill) {
        this.x = x || 0;
        this.y = y || 0;
        this.w = w || 1;
        this.h = h || 1;
        this.fill = fill || '#AAAAAA';
        return this;
    },

    drawShape : function(ctx) {
        ctx.fillStyle = this.fill;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    },

    initialize: function() {
      //override
      this.setElement(this.options.ctx);
      this.delegateEvents(this.events);

      //I SHOULD NOT HAVE TO DO THIS CHECK, THERE IS AN EXTRA EMPTY MODEL BEING INITIALIZED...SOMEHOW
      if (typeof this.model.get("position") !== 'undefined') {
        var model=this.model, ctx=this.options.ctx;
        var position = model.get("position").split(',');

        ctx.fillStyle = "#FF9000";
        ctx.strokeStyle = "#FF9000";
        if (model.get("active")) {
          ctx.strokeStyle = "#000000";
        }
        ctx.lineWidth = 1;
        ctx.strokeRect(parseInt(position[0])+0.5,parseInt(position[1])+0.5,model.get("width"),model.get("height")); //transparent box in the back

       // ctx.strokeRect(0,0,200,200); //rectangle on top
      }

    }
  });


  Views.Canvas = Backbone.View.extend({
    tagName: "canvas",
    render: function(manage) {
      var speciesTarget = unescape(this.options.speciesTarget);

      var canvas=this.el, ctx=canvas.getContext("2d");
    //  console.log(this.$el.width())
      canvas.width = this.$el.parent().width();
      canvas.height = this.$el.parent().height();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //console.log(this.collection);
      this.collection.each(function(item) {
        if (item.get("species") == speciesTarget) {
          item.set({"active":"active"});
        }
        var itemView = new Views.Shape({
             model: item,
             ctx: ctx
         });
        //render an item
        this.insertView(itemView).render();

      }, this);

      return manage(this).render();
    },

    initialize: function() {
        this.collection.on("reset",this.render,this);
      
    }
  });

  return Views;

});
