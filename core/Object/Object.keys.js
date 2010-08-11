(function () {
  var global = this, ObjProto = (global.Object && global.Object.prototype);
  if (ObjProto) {

    if (typeof ObjProto.hasOwnProperty != "function") {
      ObjProto.hasOwnProperty = (function (defaultProto) {

        return (function (key) {
          key = ("" + key);
          var obj = this, protoObj = (obj.__proto__ || ((typeof obj.constructor == "function") && obj.constructor.prototype) || defaultProto);
        //return ((key in obj) !== (key in protoObj));
          return (obj[key] !== protoObj[key]);
        });
      })(ObjProto);
    }
    if (typeof ObjProto.keys != "function") {
      ObjProto.keys = (function (hasOwnProperty) {

        return (function () {
          var key, idx = -1, arr = [], obj = this;
          for (key in obj) {
          //(hasOwnProperty.call(obj, key) && arr.push(key));
            (hasOwnProperty.call(obj, key) && (arr[++idx] = key));
          }
          return arr;
        });
      })(ObjProto.hasOwnProperty);
    }
    global.Object.keys = (function (keys) {

      return (function (obj) {
        return (((obj || ((typeof obj != "object") && (typeof obj != "undefined"))) && keys.call(obj)) || []);
      });
    })(ObjProto.keys);

    if (typeof ObjProto.propertyIsEnumerable != "function") {
      ObjProto.propertyIsEnumerable = (function (keys) {

        return (function (key) {
          key = ("" + key);
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
  ObjProto = global = null;
  delete ObjProto; delete global;

  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 1.114 byte
(function(){var global=this,ObjProto=global.Object&&global.Object.prototype;if(ObjProto){if(typeof ObjProto.hasOwnProperty!="function")ObjProto.hasOwnProperty=function(defaultProto){return function(key){key=""+key;var obj=this,protoObj=obj.__proto__||typeof obj.constructor=="function"&&obj.constructor.prototype||defaultProto;return obj[key]!==protoObj[key]}}(ObjProto);if(typeof ObjProto.keys!="function")ObjProto.keys=function(hasOwnProperty){return function(){var key,idx=-1,arr=[],obj=this;for(key in obj)hasOwnProperty.call(obj,key)&&(arr[++idx]=key);return arr}}(ObjProto.hasOwnProperty);global.Object.keys=function(keys){return function(obj){return(obj||typeof obj!="object"&&typeof obj!="undefined")&&keys.call(obj)||[]}}(ObjProto.keys);if(typeof ObjProto.propertyIsEnumerable!="function")ObjProto.propertyIsEnumerable=function(keys){return function(key){key=""+key;var obj=this,arr=keys.call(obj),idx=-1,len=arr.length,isEnum=false;while(++idx<len)if(arr[idx]===key){isEnum=true;break}return isEnum}}(ObjProto.keys)}ObjProto=global=null;delete ObjProto;delete global;delete arguments.callee}).call(null);

- Simple          -   808 byte
(function(){var d=this,b=d.Object&&d.Object.prototype;if(b){if(typeof b.hasOwnProperty!="function")b.hasOwnProperty=function(c){return function(a){a=""+a;return this[a]!==(this.__proto__||typeof this.constructor=="function"&&this.constructor.prototype||c)[a]}}(b);if(typeof b.keys!="function")b.keys=function(c){return function(){var a,f=-1,e=[];for(a in this)c.call(this,a)&&(e[++f]=a);return e}}(b.hasOwnProperty);d.Object.keys=function(c){return function(a){return(a||typeof a!="object"&&typeof a!="undefined")&&c.call(a)||[]}}(b.keys);if(typeof b.propertyIsEnumerable!="function")b.propertyIsEnumerable=function(c){return function(a){a=""+a;for(var f=c.call(this),e=-1,h=f.length,g=false;++e<h;)if(f[e]===a){g=true;break}return g}}(b.keys)}b=d=null;delete b;delete d;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 1.158 byte
(function(){var global=this,ObjProto=(global.Object&&global.Object.prototype);if(ObjProto){if(typeof ObjProto.hasOwnProperty!="function"){ObjProto.hasOwnProperty=(function(defaultProto){return(function(key){key=(""+key);var obj=this,protoObj=(obj.__proto__||((typeof obj.constructor=="function")&&obj.constructor.prototype)||defaultProto);return(obj[key]!==protoObj[key])})})(ObjProto)}if(typeof ObjProto.keys!="function"){ObjProto.keys=(function(hasOwnProperty){return(function(){var key,idx=-1,arr=[],obj=this;for(key in obj){(hasOwnProperty.call(obj,key)&&(arr[++idx]=key))}return arr})})(ObjProto.hasOwnProperty)}global.Object.keys=(function(keys){return(function(obj){return(((obj||((typeof obj!="object")&&(typeof obj!="undefined")))&&keys.call(obj))||[])})})(ObjProto.keys);if(typeof ObjProto.propertyIsEnumerable!="function"){ObjProto.propertyIsEnumerable=(function(keys){return(function(key){key=(""+key);var obj=this,arr=keys.call(obj),idx=-1,len=arr.length,isEnum=false;while(++idx<len){if(arr[idx]===key){isEnum=true;break}}return isEnum})})(ObjProto.keys)}}ObjProto=global=null;delete ObjProto;delete global;delete arguments.callee}).call(null);

- packed / shrinked           - 1.044 byte
(function(){var d=this,ObjProto=(d.Object&&d.Object.prototype);if(ObjProto){if(typeof ObjProto.hasOwnProperty!="function"){ObjProto.hasOwnProperty=(function(c){return(function(a){a=(""+a);var b=this,protoObj=(b.__proto__||((typeof b.constructor=="function")&&b.constructor.prototype)||c);return(b[a]!==protoObj[a])})})(ObjProto)}if(typeof ObjProto.keys!="function"){ObjProto.keys=(function(hasOwnProperty){return(function(){var a,idx=-1,arr=[],obj=this;for(a in obj){(hasOwnProperty.call(obj,a)&&(arr[++idx]=a))}return arr})})(ObjProto.hasOwnProperty)}d.Object.keys=(function(b){return(function(a){return(((a||((typeof a!="object")&&(typeof a!="undefined")))&&b.call(a))||[])})})(ObjProto.keys);if(typeof ObjProto.propertyIsEnumerable!="function"){ObjProto.propertyIsEnumerable=(function(c){return(function(a){a=(""+a);var b=this,arr=c.call(b),idx=-1,len=arr.length,isEnum=false;while(++idx<len){if(arr[idx]===a){isEnum=true;break}}return isEnum})})(ObjProto.keys)}}ObjProto=d=null;delete ObjProto;delete d;delete arguments.callee}).call(null);


*/
