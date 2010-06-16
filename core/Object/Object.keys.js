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

    global.Object.keys = (function (keys) {

      return (function (obj) {
        return (((obj || ((typeof obj != "object") && (typeof obj != "undefined"))) && keys.call(obj)) || []);
      });

    })(ObjProto.keys);

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

- Whitespace only - 1.112 byte
(function(global){var ObjProto=global&&global.Object&&global.Object.prototype;if(ObjProto){if(typeof ObjProto.hasOwnProperty!="function")ObjProto.hasOwnProperty=function(defaultProto){return function(key){key=[""+key];var obj=this,protoObj=obj.__proto__||typeof obj.constructor=="function"&&obj.constructor.prototype||defaultProto;return obj[key]!==protoObj[key]}}(ObjProto);if(typeof ObjProto.keys!="function")ObjProto.keys=function(hasOwnProperty){return function(){var key,arr=[],obj=this;for(key in obj)hasOwnProperty.call(obj,key)&&arr.push(key);return arr}}(ObjProto.hasOwnProperty);global.Object.keys=function(keys){return function(obj){return(obj||typeof obj!="object"&&typeof obj!="undefined")&&keys.call(obj)||[]}}(ObjProto.keys);if(typeof ObjProto.propertyIsEnumerable!="function")ObjProto.propertyIsEnumerable=function(keys){return function(key){key=[""+key];var obj=this,arr=keys.call(obj),idx=-1,len=arr.length,isEnum=false;while(++idx<len)if(arr[idx]===key){isEnum=true;break}return isEnum}}(ObjProto.keys)}ObjProto=null;delete ObjProto;delete arguments.callee})(this===this.window&&window||this);

- Simple          -   815 byte - error prone by compressing
(function(e){var b=e&&e.Object&&e.Object.prototype;if(b){if(typeof b.hasOwnProperty!="function")b.hasOwnProperty=function(c){return function(a){a=[""+a];return this[a]!==(this.__proto__||typeof this.constructor=="function"&&this.constructor.prototype||c)[a]}}(b);if(typeof b.keys!="function")b.keys=function(c){return function(){var a,d=[];for(a in this)c.call(this,a)&&d.push(a);return d}}(b.hasOwnProperty);e.Object.keys=function(c){return function(a){return(a||typeof a!="object"&&typeof a!="undefined")&&c.call(a)||[]}}(b.keys);if(typeof b.propertyIsEnumerable!="function")b.propertyIsEnumerable=function(c){return function(a){a=[""+a];for(var d=c.call(this),f=-1,h=d.length,g=false;++f<h;)if(d[f]===a){g=true;break}return g}}(b.keys);b=null;delete b;delete arguments.callee})(this===this.window&&window||this);


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 1.158 byte
(function(global){var ObjProto=(global&&global.Object&&global.Object.prototype);if(ObjProto){if(typeof ObjProto.hasOwnProperty!="function"){ObjProto.hasOwnProperty=(function(defaultProto){return(function(key){key=[""+key];var obj=this,protoObj=(obj.__proto__||((typeof obj.constructor=="function")&&obj.constructor.prototype)||defaultProto);return(obj[key]!==protoObj[key])})})(ObjProto)}if(typeof ObjProto.keys!="function"){ObjProto.keys=(function(hasOwnProperty){return(function(){var key,arr=[],obj=this;for(key in obj){((hasOwnProperty.call(obj,key))&&arr.push(key))}return arr})})(ObjProto.hasOwnProperty)}global.Object.keys=(function(keys){return(function(obj){return(((obj||((typeof obj!="object")&&(typeof obj!="undefined")))&&keys.call(obj))||[])})})(ObjProto.keys);if(typeof ObjProto.propertyIsEnumerable!="function"){ObjProto.propertyIsEnumerable=(function(keys){return(function(key){key=[""+key];var obj=this,arr=keys.call(obj),idx=-1,len=arr.length,isEnum=false;while(++idx<len){if(arr[idx]===key){isEnum=true;break}}return isEnum})})(ObjProto.keys)}}ObjProto=null;delete ObjProto;delete arguments.callee})(((this===this.window)&&window)||this);

- packed / shrinked           -   951 byte
(function(d){var e=(d&&d.Object&&d.Object.prototype);if(e){if(typeof e.hasOwnProperty!="function"){e.hasOwnProperty=(function(c){return(function(a){a=[""+a];var b=this,protoObj=(b.__proto__||((typeof b.constructor=="function")&&b.constructor.prototype)||c);return(b[a]!==protoObj[a])})})(e)}if(typeof e.keys!="function"){e.keys=(function(hasOwnProperty){return(function(){var a,arr=[],obj=this;for(a in obj){((hasOwnProperty.call(obj,a))&&arr.push(a))}return arr})})(e.hasOwnProperty)}d.Object.keys=(function(b){return(function(a){return(((a||((typeof a!="object")&&(typeof a!="undefined")))&&b.call(a))||[])})})(e.keys);if(typeof e.propertyIsEnumerable!="function"){e.propertyIsEnumerable=(function(c){return(function(a){a=[""+a];var b=this,arr=c.call(b),idx=-1,len=arr.length,isEnum=false;while(++idx<len){if(arr[idx]===a){isEnum=true;break}}return isEnum})})(e.keys)}}e=null;delete e;delete arguments.callee})(((this===this.window)&&window)||this);

- packed / shrinked / encoded - 1.048 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(d){9 e=(d&&d.j&&d.j.n);8(e){8(5 e.7!="0"){e.7=(0(c){2(0(a){a=[""+a];9 b=4,m=(b.y||((5 b.p=="0")&&b.p.n)||c);2(b[a]!==m[a])})})(e)}8(5 e.6!="0"){e.6=(0(7){2(0(){9 a,3=[],g=4;x(a z g){((7.i(g,a))&&3.v(a))}2 3})})(e.7)}d.j.6=(0(b){2(0(a){2(((a||((5 a!="s")&&(5 a!="r")))&&b.i(a))||[])})})(e.6);8(5 e.q!="0"){e.q=(0(c){2(0(a){a=[""+a];9 b=4,3=c.i(b),f=-1,o=3.E,h=D;t(++f<o){8(3[f]===a){h=C;u}}2 h})})(e.6)}}e=B;l e;l A.w})(((4===4.k)&&k)||4);',41,41,'function||return|arr|this|typeof|keys|hasOwnProperty|if|var||||||idx|obj|isEnum|call|Object|window|delete|protoObj|prototype|len|constructor|propertyIsEnumerable|undefined|object|while|break|push|callee|for|__proto__|in|arguments|null|true|false|length'.split('|'),0,{}));


*/
