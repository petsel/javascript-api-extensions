(function (global) {
  var ObjProto = (global && global.Object && global.Object.prototype);
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
  ObjProto = null; delete ObjProto; delete arguments.callee;
})(((this === this.window) && window) || this);



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 948 byte
(function(global){var ObjProto=global&&global.Object&&global.Object.prototype;if(typeof ObjProto.hasOwnProperty!="function")ObjProto.hasOwnProperty=function(defaultProto){return function(key){key=[""+key];var obj=this,protoObj=obj.__proto__||typeof obj.constructor=="function"&&obj.constructor.prototype||defaultProto;return obj[key]!==protoObj[key]}}(ObjProto);if(typeof ObjProto.keys!="function")ObjProto.keys=function(hasOwnProperty){return function(){var key,arr=[],obj=this;for(key in obj)hasOwnProperty.call(obj,key)&&arr.push(key);return arr}}(ObjProto.hasOwnProperty);if(typeof ObjProto.propertyIsEnumerable!="function")ObjProto.propertyIsEnumerable=function(keys){return function(key){key=[""+key];var obj=this,arr=keys.call(obj),idx=-1,len=arr.length,isEnum=false;while(++idx<len)if(arr[idx]===key){isEnum=true;break}return isEnum}}(ObjProto.keys);ObjProto=null;delete ObjProto;delete arguments.callee})(this===this.window&&window||this);

- Simple          - 686 byte
(function(e){var b=e&&e.Object&&e.Object.prototype;if(typeof b.hasOwnProperty!="function")b.hasOwnProperty=function(c){return function(a){a=[""+a];return this[a]!==(this.__proto__||typeof this.constructor=="function"&&this.constructor.prototype||c)[a]}}(b);if(typeof b.keys!="function")b.keys=function(c){return function(){var a,d=[];for(a in this)c.call(this,a)&&d.push(a);return d}}(b.hasOwnProperty);if(typeof b.propertyIsEnumerable!="function")b.propertyIsEnumerable=function(c){return function(a){a=[""+a];for(var d=c.call(this),f=-1,h=d.length,g=false;++f<h;)if(d[f]===a){g=true;break}return g}}(b.keys);b=null;delete b;delete arguments.callee})(this===this.window&&window||this);


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 980 byte
(function(global){var ObjProto=(global&&global.Object&&global.Object.prototype);if(typeof ObjProto.hasOwnProperty!="function"){ObjProto.hasOwnProperty=(function(defaultProto){return(function(key){key=[""+key];var obj=this,protoObj=(obj.__proto__||((typeof obj.constructor=="function")&&obj.constructor.prototype)||defaultProto);return(obj[key]!==protoObj[key])})})(ObjProto)}if(typeof ObjProto.keys!="function"){ObjProto.keys=(function(hasOwnProperty){return(function(){var key,arr=[],obj=this;for(key in obj){((hasOwnProperty.call(obj,key))&&arr.push(key))}return arr})})(ObjProto.hasOwnProperty)}if(typeof ObjProto.propertyIsEnumerable!="function"){ObjProto.propertyIsEnumerable=(function(keys){return(function(key){key=[""+key];var obj=this,arr=keys.call(obj),idx=-1,len=arr.length,isEnum=false;while(++idx<len){if(arr[idx]===key){isEnum=true;break}}return isEnum})})(ObjProto.keys)}ObjProto=null;delete ObjProto;delete arguments.callee})(((this===this.window)&&window)||this);

- packed / shrinked           - 808 byte
(function(d){var e=(d&&d.Object&&d.Object.prototype);if(typeof e.hasOwnProperty!="function"){e.hasOwnProperty=(function(c){return(function(a){a=[""+a];var b=this,protoObj=(b.__proto__||((typeof b.constructor=="function")&&b.constructor.prototype)||c);return(b[a]!==protoObj[a])})})(e)}if(typeof e.keys!="function"){e.keys=(function(hasOwnProperty){return(function(){var a,arr=[],obj=this;for(a in obj){((hasOwnProperty.call(obj,a))&&arr.push(a))}return arr})})(e.hasOwnProperty)}if(typeof e.propertyIsEnumerable!="function"){e.propertyIsEnumerable=(function(c){return(function(a){a=[""+a];var b=this,arr=c.call(b),idx=-1,len=arr.length,isEnum=false;while(++idx<len){if(arr[idx]===a){isEnum=true;break}}return isEnum})})(e.keys)}e=null;delete e;delete arguments.callee})(((this===this.window)&&window)||this);

- packed / shrinked / encoded - 950 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(d){6 e=(d&&d.q&&d.q.m);8(7 e.5!="0"){e.5=(0(c){4(0(a){a=[""+a];6 b=2,p=(b.z||((7 b.o=="0")&&b.o.m)||c);4(b[a]!==p[a])})})(e)}8(7 e.h!="0"){e.h=(0(5){4(0(){6 a,3=[],f=2;C(a r f){((5.i(f,a))&&3.u(a))}4 3})})(e.5)}8(7 e.n!="0"){e.n=(0(c){4(0(a){a=[""+a];6 b=2,3=c.i(b),g=-1,j=3.s,9=t;v(++g<j){8(3[g]===a){9=w;x}}4 9})})(e.h)}e=y;k e;k A.B})(((2===2.l)&&l)||2);',39,39,'function||this|arr|return|hasOwnProperty|var|typeof|if|isEnum||||||obj|idx|keys|call|len|delete|window|prototype|propertyIsEnumerable|constructor|protoObj|Object|in|length|false|push|while|true|break|null|__proto__|arguments|callee|for'.split('|'),0,{}));


*/
