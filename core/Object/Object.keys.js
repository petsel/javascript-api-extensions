(function (global) {
  var ObjProto = (global && global.Object && global.Object.prototype);
  if (ObjProto) {
    if (typeof ObjProto.hasOwnProperty != "function") {
      ObjProto.hasOwnProperty = (function (defaultProto) {

        return (function (key) {
          key = ["" + key];
          var obj = this, protoObj = (obj.__proto__ || ((typeof obj.constructor == "function") && obj.constructor.prototype) || defaultProto);
        //return ((key in obj) !== (key in protoObj));
          return (obj[key] !== protoObj[key]);
        });

      })(ObjProto);
    }
    if (typeof ObjProto.keys != "function") {
      ObjProto.keys = (function (hasOwnProperty) {

        return (function () {
          var key, arr = [], obj = this;
          for (key in obj) {
            ((hasOwnProperty.call(obj, key)) && arr.push(key));
          }
          return arr;
        });

      })(ObjProto.hasOwnProperty);
    }
    if (typeof ObjProto.propertyIsEnumerable != "function") {
      ObjProto.propertyIsEnumerable = (function (keys) {

        return (function (key) {
          key = ["" + key];
          var obj = this, arr = keys.call(obj), idx = -1, len = arr.length, isEnum = false;
          while (++idx < len) {
            if (arr[idx] === key) {
              isEnum = true;
              break;
            }
          }
          return isEnum;
        });

      })(ObjProto.keys);
    }
  }
  ObjProto = null; delete ObjProto; delete arguments.callee;
})(((this === this.window) && window) || this);



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 961 byte
(function(global){var ObjProto=global&&global.Object&&global.Object.prototype;if(ObjProto){if(typeof ObjProto.hasOwnProperty!="function")ObjProto.hasOwnProperty=function(defaultProto){return function(key){key=[""+key];var obj=this,protoObj=obj.__proto__||typeof obj.constructor=="function"&&obj.constructor.prototype||defaultProto;return obj[key]!==protoObj[key]}}(ObjProto);if(typeof ObjProto.keys!="function")ObjProto.keys=function(hasOwnProperty){return function(){var key,arr=[],obj=this;for(key in obj)hasOwnProperty.call(obj,key)&&arr.push(key);return arr}}(ObjProto.hasOwnProperty);if(typeof ObjProto.propertyIsEnumerable!="function")ObjProto.propertyIsEnumerable=function(keys){return function(key){key=[""+key];var obj=this,arr=keys.call(obj),idx=-1,len=arr.length,isEnum=false;while(++idx<len)if(arr[idx]===key){isEnum=true;break}return isEnum}}(ObjProto.keys)}ObjProto=null;delete ObjProto;delete arguments.callee})(this===this.window&&window||this);

- Simple          - 692 byte
(function(e){var b=e&&e.Object&&e.Object.prototype;if(b){if(typeof b.hasOwnProperty!="function")b.hasOwnProperty=function(c){return function(a){a=[""+a];return this[a]!==(this.__proto__||typeof this.constructor=="function"&&this.constructor.prototype||c)[a]}}(b);if(typeof b.keys!="function")b.keys=function(c){return function(){var a,d=[];for(a in this)c.call(this,a)&&d.push(a);return d}}(b.hasOwnProperty);if(typeof b.propertyIsEnumerable!="function")b.propertyIsEnumerable=function(c){return function(a){a=[""+a];for(var d=c.call(this),f=-1,h=d.length,g=false;++f<h;)if(d[f]===a){g=true;break}return g}}(b.keys);b=null;delete b;delete arguments.callee})(this===this.window&&window||this);


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 994 byte
(function(global){var ObjProto=(global&&global.Object&&global.Object.prototype);if(ObjProto){if(typeof ObjProto.hasOwnProperty!="function"){ObjProto.hasOwnProperty=(function(defaultProto){return(function(key){key=[""+key];var obj=this,protoObj=(obj.__proto__||((typeof obj.constructor=="function")&&obj.constructor.prototype)||defaultProto);return(obj[key]!==protoObj[key])})})(ObjProto)}if(typeof ObjProto.keys!="function"){ObjProto.keys=(function(hasOwnProperty){return(function(){var key,arr=[],obj=this;for(key in obj){((hasOwnProperty.call(obj,key))&&arr.push(key))}return arr})})(ObjProto.hasOwnProperty)}if(typeof ObjProto.propertyIsEnumerable!="function"){ObjProto.propertyIsEnumerable=(function(keys){return(function(key){key=[""+key];var obj=this,arr=keys.call(obj),idx=-1,len=arr.length,isEnum=false;while(++idx<len){if(arr[idx]===key){isEnum=true;break}}return isEnum})})(ObjProto.keys)}}ObjProto=null;delete ObjProto;delete arguments.callee})(((this===this.window)&&window)||this);

- packed / shrinked           - 815 byte
(function(d){var e=(d&&d.Object&&d.Object.prototype);if(e){if(typeof e.hasOwnProperty!="function"){e.hasOwnProperty=(function(c){return(function(a){a=[""+a];var b=this,protoObj=(b.__proto__||((typeof b.constructor=="function")&&b.constructor.prototype)||c);return(b[a]!==protoObj[a])})})(e)}if(typeof e.keys!="function"){e.keys=(function(hasOwnProperty){return(function(){var a,arr=[],obj=this;for(a in obj){((hasOwnProperty.call(obj,a))&&arr.push(a))}return arr})})(e.hasOwnProperty)}if(typeof e.propertyIsEnumerable!="function"){e.propertyIsEnumerable=(function(c){return(function(a){a=[""+a];var b=this,arr=c.call(b),idx=-1,len=arr.length,isEnum=false;while(++idx<len){if(arr[idx]===a){isEnum=true;break}}return isEnum})})(e.keys)}}e=null;delete e;delete arguments.callee})(((this===this.window)&&window)||this);

- packed / shrinked / encoded - 956 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(d){8 e=(d&&d.k&&d.k.i);6(e){6(7 e.5!="0"){e.5=(0(c){4(0(a){a=[""+a];8 b=3,m=(b.x||((7 b.q=="0")&&b.q.i)||c);4(b[a]!==m[a])})})(e)}6(7 e.h!="0"){e.h=(0(5){4(0(){8 a,2=[],9=3;w(a z 9){((5.j(9,a))&&2.C(a))}4 2})})(e.5)}6(7 e.p!="0"){e.p=(0(c){4(0(a){a=[""+a];8 b=3,2=c.j(b),f=-1,o=2.r,g=s;B(++f<o){6(2[f]===a){g=t;A}}4 g})})(e.h)}}e=u;l e;l v.y})(((3===3.n)&&n)||3);',39,39,'function||arr|this|return|hasOwnProperty|if|typeof|var|obj||||||idx|isEnum|keys|prototype|call|Object|delete|protoObj|window|len|propertyIsEnumerable|constructor|length|false|true|null|arguments|for|__proto__|callee|in|break|while|push'.split('|'),0,{}));


*/
