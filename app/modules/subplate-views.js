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



   Views.HitShape = Backbone.View.extend({

    initialize: function() {
      //override
      this.setElement(this.options.ctx);
      this.delegateEvents(this.events);
      //I SHOULD NOT HAVE TO DO THIS CHECK, THERE IS AN EXTRA EMPTY MODEL BEING INITIALIZED...SOMEHOW
      if (typeof this.model.get("position") !== 'undefined') {

        var model=this.model, hitCtx=this.options.hitCtx;
        var position = model.get("position").split(',');

        var image = new Image();
        image.src = "data:image/png;base64,"+model.get("shape");
        if (typeof this.options.opacityIndex !== 'undefined') {
          //global alpha only has a precision of 2 decimal places
          hitCtx.globalAlpha = this.options.opacityIndex/100;
          hitCtx.fillStyle = '#000000';

          $(image).load(function(){
            //hitCtx.drawImage(image, position[0], position[1]);
          });



          //temp square fill
          ///if (model.get("shape") == '') {
            hitCtx.fillRect(parseInt(position[0]),parseInt(position[1]),model.get("width"), model.get("height"));
          //}

   //       hitCtx.font = "bold 12px sans-serif";
    //      hitCtx.globalAlpha = 1;
    //     hitCtx.fillStyle = "red";
     //    hitCtx.fillText(this.options.opacityIndex+', '+model.get("plate_label"), position[0],position[1]);



        }
      }

    }
  });

   Views.DrawShape = Backbone.View.extend({

    initialize: function() {
      //override
      this.setElement(this.options.ctx);
      this.delegateEvents(this.events);
      //I SHOULD NOT HAVE TO DO THIS CHECK, THERE IS AN EXTRA EMPTY MODEL BEING INITIALIZED...SOMEHOW
      if (typeof this.model.get("position") !== 'undefined') {

        var model=this.model, ctx=this.options.ctx;
        var position = model.get("position").split(',');

        if (model.get("active")) {
          ctx.strokeStyle = "#000000";
        }
        //var min = _.min(model.collection.models, function(model){return model.get("species_id");}).get('species_id');
        //var max = _.max(model.collection.models, function(model){return model.get("species_id");}).get('species_id');
        //round to 2 decimal?
        // var alpha = app.normalizeTransform(model.get('species_id'),min, max, 0.01,0.99);
        //this will break at over 100 speciens. This is assuming global alpha can do 2 decimal pla
        //var alpha = app.normalizeTransform(model.get('species_id'),min, max, 0.01,1).toFixed(2);
        //var alphaHex = app.normalizeTransform(alpha,0, 255, 0.1,1);
        //hitCtx.globalAlpha = alpha;

        var image = new Image();
        image.src = "data:image/png;base64,"+model.get("shape");

        $(image).load(function(){
          //ctx.drawImage(image, position[0], position[1]);
        });

      
        //temp square fill
       // if (model.get("shape") == '') {
          ctx.fillRect(parseInt(position[0]),parseInt(position[1]),model.get("width"),model.get("height")); //transparent box in the back
       // }
       // ctx.strokeRect(0,0,200,200); //rectangle on top
      }

    }
  });


  Views.Canvas = Backbone.View.extend({
    tagName: "canvas",

    events: {
      'mouseover':'detectHit'
    },

    render: function(manage) {
      var speciesTarget = unescape(this.options.speciesTarget);

//_.groupBy(list, 'property')

      // real canvas
      //setting canvas to an option seemed to slow things down.
      this.options.hit = false;
      this.options.canvas=this.el;
      this.options.ctx=this.options.canvas.getContext("2d");
      this.options.canvas.width = this.$el.parent().width();
      this.options.canvas.height = this.$el.parent().height();
      this.options.ctx.clearRect(0, 0, this.options.canvas.width, this.options.canvas.height);
      //this.options.ctx.fillStyle = "#fefefe";
      this.options.ctx.fillStyle = "#000";
      //this.options.ctx.globalCompositeOperation = "xor";
      //this.options.ctx.fillRect(0,0,this.options.canvas.width, this.options.canvas.height);

      //shadow canvas
      var hitCanvas = this.$el.clone();
      this.options.hitCtx = hitCanvas[0].getContext("2d");
      //for preview purposes
      this.$el.parent().parent().append(hitCanvas);

      //this grouped lookup table wont work if things are subsequently sorted.
      //this also depends on 0-100 opacity values = 0-100 objects
      var grouped  = _.groupBy(this.collection.models, function(item){return item.get("species_id");});
      this.options.groupedSet =_.toArray(grouped);

       //   var range = _.range(0,254);
       //   this.options.opacityLookup = _.map(range, function(num) {
       //     return app.normalizeTransform(num,0, 254, 0.01,1);
       //   });

       var that = this;
       var cnt = that.options.groupedSet.length;
       //reverse loop to account for alpha to rbg inversion
       while (cnt--) {
        _.each(that.options.groupedSet[cnt],function(item) {
          var opacity = cnt + 1;
          console.log(opacity)
          var itemView = new Views.HitShape({
               model: item,
               ctx: that.options.ctx,
               hitCtx: that.options.hitCtx,
               opacityIndex: opacity // start with base opacity of 1
           });
          //render an item
          that.insertView(itemView).render();
          });
        //count down to account for globalAlpha to rbg transparency inversion
       // cnt--;
      }

      return manage(this).render();
    },

    detectHit: function() {
      var that = this;
      $(this.el).mousemove(function(e) {
          //use the position from the real canvas
          var pos = that.findPos(this);
          var x = e.pageX - pos.x;
          var y = e.pageY - pos.y;
          //use the image data from the hitCanvas
          var c =  that.options.hitCtx;
          var p = c.getImageData(x, y, 1, 1).data;

          //THIS COULD BUG OUT. THIS IS THIS CONVERSION FROM RGB 255 TO 0-1 ALPHA VALUES AND THEN MAPPED TO AN ARRAY NUMBER
          //THE BETTER WAY TO DO THIS. MAKE A HASH TABLE OF THE DECIMAL VALUES OF THE TRANSFORMATION WITHOUT ROUNDING AND DO ASSIGN A LOOKUP
          var speciesAlpha =  Math.ceil(app.normalizeTransform(p[3], 0,255,0,100).toFixed(2));


          //if there is opacity
          if (p[3] > 0) {
            if (that.options.hit === false ) {
              that.options.hit = true;
              // this is basically redundant from abovee except for this -> that
              that.options.ctx.clearRect(0, 0, that.options.canvas.width, that.options.canvas.height);
              that.options.ctx.fillStyle = "#000";
              //that.options.ctx.globalCompositeOperation = "xor";
              //that.options.ctx.fillRect(0,0,that.options.canvas.width, that.options.canvas.height);

              _.each(that.options.groupedSet[speciesAlpha-1],function(item){ 
                var itemView = new Views.DrawShape({
                  model: item,
                  ctx: that.options.ctx
                });
                //render an item
                that.insertView(itemView).render();
                });
              }
            } else {
              that.options.hit = false;
              that.options.ctx.clearRect(0, 0, that.options.canvas.width, that.options.canvas.height);
            }



          });
    },

    findPos: function(obj) {
      var curleft = 0, curtop = 0;
      if (obj.offsetParent) {
          do {
              curleft += obj.offsetLeft;
              curtop += obj.offsetTop;
          } while (obj = obj.offsetParent);
          return { x: curleft, y: curtop };
      }
      return undefined;
    },

    initialize: function() {
        this.collection.on("reset",this.render,this);
      
    }
  });

  return Views;

});
