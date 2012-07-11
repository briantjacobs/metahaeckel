this['JST'] = this['JST'] || {};

this['JST']['app/templates/layouts/main.html'] = function(data) { return function (obj,_) {
var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('  <div class="list"></div>\n\n');}return __p.join('');
}(data, _)};

this['JST']['app/templates/plate/item.html'] = function(data) { return function (obj,_) {
var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="subplate">\n{{data.plate_number}} - <br> {{data.name_haeckel}}\n\n</div>\n\n');}return __p.join('');
}(data, _)};

this['JST']['app/templates/subplate/item.html'] = function(data) { return function (obj,_) {
var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="subplate">\n<b>{{data.active}}</b>{{data.plate}} - {{data.species}} - <br> {{data.description}}\n\n</div>\n\n');}return __p.join('');
}(data, _)};