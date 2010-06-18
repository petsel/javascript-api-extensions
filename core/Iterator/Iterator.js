/*
  different implementations of "iterators" ore more precisely "item iterators"
  at which "item" is understood/defined either as index based entry of a list
  or as key based property of an object.

  [EntryIteratorMixin] therefore does provide an index based iterator interface
  for list-like data structures such as native [Array] or even [String] objects
  as defined by the JavaScript language core as well as [HTMLElementCollection]
  or [NodeList] objects as provided by the browsers DOM-API implementations.
  [EntryIteratorMixin] keeps live objects live whereas [EntryIterator] does
  wrap provided list like objects (living or not) preventing them from outside
  mutation attempts.

  [PropertyIterator] on the other hand is a key based iterator wrapper thats
  methods slightly differ from the [EntryIterator]s ones.
*/



/*
(function(d){var e=(d&&d.Object&&d.Object.prototype);if(e){if(typeof e.hasOwnProperty!="function"){e.hasOwnProperty=(function(c){return(function(a){a=[""+a];var b=this,protoObj=(b.__proto__||((typeof b.constructor=="function")&&b.constructor.prototype)||c);return(b[a]!==protoObj[a])})})(e)}if(typeof e.keys!="function"){e.keys=(function(hasOwnProperty){return(function(){var a,arr=[],obj=this;for(a in obj){((hasOwnProperty.call(obj,a))&&arr.push(a))}return arr})})(e.hasOwnProperty)}d.Object.keys=(function(b){return(function(a){return(((a||((typeof a!="object")&&(typeof a!="undefined")))&&b.call(a))||[])})})(e.keys);if(typeof e.propertyIsEnumerable!="function"){e.propertyIsEnumerable=(function(c){return(function(a){a=[""+a];var b=this,arr=c.call(b),idx=-1,len=arr.length,isEnum=false;while(++idx<len){if(arr[idx]===a){isEnum=true;break}}return isEnum})})(e.keys)}}e=null;delete e;delete arguments.callee})(((this===this.window)&&window)||this);
(function(){var m=this&&this.window===this&&window||this,i=m.Array,j=i.prototype,t=m.Object.prototype,r=t.toString,q=typeof m.isFunction=="function"&&m.isFunction||function(g){return typeof g=="function"};i.isArray=m.isArray=q(i.isArray)&&i.isArray||q(m.isArray)&&m.isArray||function(){var g=/^\[object\s+Array\]$/,f=r;return function(d){return g.test(f.call(d))}}();i.isArgumentsArray=q(i.isArgumentsArray)&&i.isArgumentsArray||function(){var g,f=/^\[object\s+Object\]$/,d=r,b=t.propertyIsEnumerable;try{b.call(m,"length");g=function(c){return f.test(d.call(c))&&!!c&&typeof c.length=="number"&&!b.call(c,"length")}}catch(a){g=function(c){return f.test(d.call(c))&&!!c&&typeof c.length=="number"&&!function(e){var h;try{h=b.call(e,"length")}catch(k){h=true}return h}(c)}}return g}();i.make=function(){var g,f,d,b=m.document,a=m,c=b&&q(b.getElementsByTagName)&&b.getElementsByTagName("*")||[],e=j.slice,h=i.isArgumentsArray,k=i.isArray,n=q(m.isString)&&m.isString||function(){var l=/^\[object\s+String\]$/,p=r;return function(o){return l.test(p.call(o))}}();try{f=e.call(c);f=e.call(arguments);d=f.join("");if(f.length!=3||d!="Array.make")throw new Error;f=e.call(d);if(f.length!==10||f[5]!==".")throw new Error;g=function(l){var p=(l||n(l))&&l.length;return typeof p=="number"&&a.isFinite(p)&&e.call(l)||void 0};k=h=null;delete h;delete k}catch(u){g=function(l){var p,o,s=h(l)&&e.call(l)||n(l)&&l.split("")||k(l)&&e.call(l)||p;if(!s){o=l!==0&&l&&l.length;if(typeof o=="number"&&a.isFinite(o)){s=new a.Array(a.Math.max(0,o));if(typeof l.item=="function")for(;--o>=0;){p=l.item(o);if(typeof p!="undefined"||o in l)s[o]=p}else for(;--o>=0;){p=l[o];if(typeof p!="undefined"||o in l)s[o]=p}}}return s}}c=b=d=f=null;delete f;delete d;delete b;delete c;return g}("Array",".","make");j.forEach=function(){var g=i.isArray,f=i.make;return function(d,b){var a=g(this)&&this||f(this);if(a&&typeof d=="function"){b=typeof b=="undefined"||typeof b=="obj"&&!b?null:b;for(var c,e=-1,h=a.length;++e<h;){c=a[e];if(typeof c!="undefined"||e in a)d.call(b,c,e,a)}}}}();i.forEach=function(){var g=j.forEach;return function(f,d,b){g.call(f,d,b)}}();j.every=function(){var g=i.isArray,f=i.make;return function(d,b){var a,c=g(this)&&this||f(this);if(c&&typeof d=="function"){var e,h=-1,k=c.length,n=false;if(k>=1){b=typeof b=="undefined"||typeof b=="obj"&&!b?null:b;for(a=true;a&&++h<k;){e=c[h];if(typeof e!="undefined"||h in c){n=true;a=d.call(b,e,h,c)}}a=n&&a}}return!!a}}();i.every=function(){var g=j.every;return function(f,d,b){return g.call(f,d,b)}}();j.some=function(){var g=i.isArray,f=i.make;return function(d,b){var a,c=g(this)&&this||f(this);if(c&&typeof d=="function"){var e,h=-1,k=c.length,n=false;if(k>=1){b=typeof b=="undefined"||typeof b=="obj"&&!b?null:b;for(a=false;!a&&++h<k;){e=c[h];if(typeof e!="undefined"||h in c){n=true;a=d.call(b,e,h,c)}}a=n&&a}}return!!a}}();i.some=function(){var g=j.some;return function(f,d,b){return g.call(f,d,b)}}();j.map=function(){var g=i.isArray,f=i.make;return function(d,b){var a=[],c=g(this)&&this||f(this);if(c&&typeof d=="function"){b=typeof b=="undefined"||typeof b=="obj"&&!b?null:b;for(var e,h=-1,k=c.length;++h<k;){e=c[h];a[h]=typeof e!="undefined"||h in c?d.call(b,e,h,c):e}}return a}}();i.map=function(){var g=j.map;return function(f,d,b){return g.call(f,d,b)}}();j.filter=function(){var g=i.isArray,f=i.make;return function(d,b){var a=[],c=g(this)&&this||f(this);if(c&&typeof d=="function"){b=typeof b=="undefined"||typeof b=="obj"&&!b?null:b;for(var e,h=-1,k=c.length;++h<k;){e=c[h];if(typeof e!="undefined"||h in c)d.call(b,e,h,c)&&a.push(e)}}return a}}();i.filter=function(){var g=j.filter;return function(f,d,b){return g.call(f,d,b)}}();j.reduce=function(){var g=i.isArray,f=i.make;return function(d,b){var a=g(this)&&this||f(this);if(a&&typeof d=="function"){var c,e=0,h=a.length;c=typeof b!="undefined";if(h!==0||c){if(!c){do{c=a[e];if(typeof c!="undefined"||e in a){b=c;++e;break}if(++e>=h)break}while(1)}for(;e<h;){c=a[e];if(typeof c!="undefined"||e in a)b=d(b,c,e,a);++e}}else b=void 0}else b=void 0;return b}}();i.reduce=function(){var g=j.reduce;return function(f,d,b){return g.call(f,d,b)}}();j.reduceRight=function(){var g=i.isArray,f=i.make;return function(d,b){var a=g(this)&&this||f(this);if(a&&typeof d=="function"){var c;c=a.length;var e=c-1,h=typeof b!="undefined";if(c!==0||h){if(!h){do{c=a[e];if(typeof c!="undefined"||e in a){b=c;--e;break}if(--e<0)break}while(1)}for(;e>=0;){c=a[e];if(typeof c!="undefined"||e in a)b=d(b,c,e,a);--e}}else b=void 0}else b=void 0;return b}}();i.reduceRight=function(){var g=j.reduceRight;return function(f,d,b){return g.call(f,d,b)}}();j.indexOf=function(){var g=i.isArray,f=i.make,d=m;return function(b,a){var c,e,h,k=g(this)&&this||f(this);if(k){c=k.length;a=d.parseInt(d.Number(a),10);a=d.isFinite(a)&&a||0;for(a=a<0&&d.Math.max(0,c+a)||a;a<c;){e=k[a];if((typeof e!="undefined"||a in k)&&e===b){h=true;break}++a}}return h?a:-1}}();i.indexOf=function(){var g=j.indexOf;return function(f,d,b){return g.call(f,d,b)}}();j.lastIndexOf=function(){var g=i.isArray,f=i.make,d=m;return function(b,a){var c,e,h=g(this)&&this||f(this);if(h){c=h.length;a=d.parseInt(d.Number(a),10);a=d.isFinite(a)&&a||c;a=a<0&&d.Math.max(0,c+a)||a;for(a=a>=c&&c-1||a;a>-1;){c=h[a];if((typeof c!="undefined"||a in h)&&c===b){e=true;break}--a}}return e?a:-1}}();i.lastIndexOf=function(){var g=j.lastIndexOf;return function(f,d,b){return g.call(f,d,b)}}();j.isEmpty=function(){var g=i.isArray,f=i.make;return function(){var d,b,a=true,c=-1,e=g(this)&&this||f(this);if(e)for(d=e.length;++c<d;)if((b=e[c])||typeof b!="undefined"||c in e){a=false;break}return a}}();i.isEmpty=function(){var g=j.isEmpty;return function(f){return g.call(f)}}();j.contains=function(){var g=i.isArray,f=i.make;return function(d){var b,a,c,e=-1,h=g(this)&&this||f(this);if(h)for(b=h.length;++e<b;){a=h[e];if((typeof a!="undefined"||e in h)&&a===d){c=true;break}}return!!c}}();i.contains=function(){var g=j.contains;return function(f,d,b){return g.call(f,d,b)}}();j.indexOfFilter=function(){var g=i.isArray,f=i.make,d=m;return function(b,a){var c,e,h,k=g(this)&&this||f(this);if(k&&typeof b=="function"){c=k.length;a=d.parseInt(d.Number(a),10);a=d.isFinite(a)&&a||0;for(a=a<0&&d.Math.max(0,c+a)||a;a<c;){e=k[a];if((typeof e!="undefined"||a in k)&&b(e,a,k)){h=true;break}++a}}return h?a:-1}}();i.indexOfFilter=function(){var g=j.indexOfFilter;return function(f,d,b){return g.call(f,d,b)}}();j.lastIndexOfFilter=function(){var g=i.isArray,f=i.make,d=m;return function(b,a){var c,e,h=g(this)&&this||f(this);if(h&&typeof b=="function"){c=h.length;a=d.parseInt(d.Number(a),10);a=d.isFinite(a)&&a||c;a=a<0&&d.Math.max(0,c+a)||a;for(a=a>=c&&c-1||a;a>-1;){c=h[a];if((typeof c!="undefined"||a in h)&&b(c,a,h)){e=true;break}--a}}return e?a:-1}}();i.lastIndexOfFilter=function(){var g=j.lastIndexOfFilter;return function(f,d,b){return g.call(f,d,b)}}();j.remove=function(){var g=i.isArray,f=i.make,d=j.splice;return function(b){var a,c,e,h=-1,k=arguments,n=g(this)&&this||f(this);if(n){a=k.length;for(c=n.length;++h<a;){b=k[h];for(e=-1;++e<c;)if(n[e]===b){n.splice(e,1);--c;--e}}}if(this.remove===k.callee){d.apply(this,[0,c].concat(n));n=this}return n}}();i.remove=function(){var g=i.make,f=j.remove;return function(){var d=g(arguments);return f.apply(g(d.shift()),d)}}();j.removeByFilter=function(){var g=i.isArray,f=i.make,d=j.splice;return function(b){var a,c,e=-1,h=g(this)&&this||f(this);if(h&&typeof b=="function")for(a=h.length;++e<a;){c=h[e];if((typeof c!="undefined"||e in h)&&b(c,e,h)){h.splice(e,1);--a;--e}}if(this.removeByFilter===arguments.callee){d.apply(this,[0,a].concat(h));h=this}return h}}();i.removeByFilter=function(){var g=i.make,f=j.removeByFilter;return function(d,b){return f.call(g(d),b)}}();q=r=t=j=i=m=null;delete m;delete i;delete j;delete t;delete r;delete q})();
*/



(function (global) { // Iterator[EntryIteratorMixin, EntryIterator, PropertyIterator].


  if (!global.Object || (typeof global.Object.keys != "function")) {
    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Object/Object.keys.js]
    throw (new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Object]] extensions module [Object.keys]."));
  }
  if (!global.Array || (typeof global.Array.make != "function")) {
    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Array/Array.make.detect.js]
    throw (new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Array]] extensions module base [Array.make.detect]."));
  }


  global["Iterator"] = (function (sh) {


    var keys = sh.Object.keys, makeArray = sh.Array.make

    regXClassName = (/^\[object\s+(.*)\]$/), // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/global/type-detection/type-detection.js]
    exposeImplementation = sh.Object.prototype.toString,

    isString = (function () {
      var regXBaseClass = (/^\[object\s+String\]$/), expose = exposeImplementation;
      return (function (obj/*:[object|value]*/) {
        return regXBaseClass.test(expose.call(obj));
      });
    })(),

    isKindOfList = (function (obj) {return (obj && (typeof obj.length == "number") && isFinite(obj.length));}),
    hasItemMethod = (function (obj) {return (obj && obj.item && ((typeof obj.item == "function") || (typeof obj.item == "object")));}),


    createGetListItemFallbackByCurrentType = (function (obj) {
      return ((isString(obj) && (function (str, idx) {
        return str.charAt(idx);
      })) || (hasItemMethod(obj) && (function (obj, idx) {
        return obj.item(idx);
      })) || (function (obj, idx, ndf) { // it's very unlikely to run in here ever.
        return ndf;
      }));
    }),


    EndOfIteration = (function () { // [EoI]-singleton reference - "End of Iteration".

      var obj = {};
      obj.constructor.toString = (function () {
        return "[object EoI]";
      });
      obj.toString = (function () {
        return "EoI";
      });
      obj.valueOf = (function () {
        return null;
      });
      return obj;
    })(),

    isEndOfIteration = (function (EoI) { // [isEoI] method reference - "is End Of Iteration".

      return (function (obj) {
        return (obj === EoI);
      });
    })(EndOfIteration);


    return {


      "EntryIteratorMixin": (function (isListLike, createGetListItemFallback, EoI, isEoI) {

        return (function () {
          if (isListLike(this)) {

            var idx = -1, list = this, getListItem = createGetListItemFallback(list);

            this.hasPrevious = (function ()/*:[boolean]*/ {
              return (idx > 0);
            });
            this.hasNext = (function ()/*:[boolean]*/ {
              return (idx < (list.length-1));
            });

            this.getPrevious = (function ()/*:[object|*primitive*]*/ {
              var obj;
              if (idx > 0) { // this.hasPrevious()
                obj = list[--idx];
                obj = (((typeof obj != "undefined") || !(idx in list)) ? obj : getListItem(list, idx));
              } else {
                idx = -1;
                obj = EoI;
              }
              return obj;
            });
            this.getNext = (function ()/*:[object|*primitive*]*/ {
              var obj;
              if (idx < (list.length-1)) { // this.hasNext()
                obj = list[++idx];
                obj = (((typeof obj != "undefined") || !(idx in list)) ? obj : getListItem(list, idx));
              } else {
                idx = list.length;
                obj = EoI;
              }
              return obj;
            });

            this.getIndex = (function ()/*:[number]*/ {
              return (((idx < list.length) && (idx > -1)) ? idx : EoI);
            });
            this.setIndex = (function (num/*:[number]*/) {/*
              num = Number(parseInt(num, 10));
              idx = (!isNaN(num) ? ((num <= -1) ? (-1) : ((num >= list.length) ? list.length : num)) : idx);*/
              num = ~~(1 * num);
              idx = (((num <= -1) && -1) || ((num >= list.length) && list.length) || num);
            });

            this.isEoI = isEoI;
          }
          return this;
        });
      })(isKindOfList, createGetListItemFallbackByCurrentType, EndOfIteration, isEndOfIteration),


      "EntryIterator": (function (isListLike, makeArray, sh) {

        return (function (list) {
          if (isListLike(list)) {

            list = sh.Iterator.EntryIteratorMixin.call(makeArray(list));

            this.hasPrevious = list.hasPrevious;
            this.hasNext = list.hasNext;

            this.getPrevious = list.getPrevious;
            this.getNext = list.getNext;

            this.getIndex = list.getIndex;
            this.setIndex = list.setIndex;

            this.isEoI = list.isEoI;

            this.size = (function () {
              return list.length;
            });
          }
          return this;
        });
      })(isKindOfList, makeArray, sh),


      "PropertyIterator": (function (keys) {

        return (function (obj) {
          var list = sh.Iterator.EntryIteratorMixin.call(keys(obj)),

          getPrevious = list.getPrevious,
          getNext = list.getNext,
          getIndex = list.getIndex,
          isEoI = list.isEoI;

          this.hasPrevious = list.hasPrevious;
          this.hasNext = list.hasNext;

          this.getPrevious = (function () {
            var key = getPrevious();
            return (!isEoI(key) ? obj[key] : key);
          });
          this.getNext = (function () {
            var key = getNext();
            return (!isEoI(key) ? obj[key] : key);
          });
          this.getKey = (function () {
            var idx = getIndex();
            return (!isEoI(idx) ? list[idx] : idx);
          });

          this.isEoI = isEoI;

          this.size = (function () {
            return list.length;
          });
          return this;
        });
      })(keys),


      "mixin" : (function (IteratorType/*:[object|string]*/, obj) {
        if (obj && ((typeof obj == "object") || (typeof obj == "function"))) {
          var Iterator = sh.Iterator;
          if (isString(IteratorType) && (typeof Iterator[IteratorType+"Mixin"] == "function")) {
            Iterator[IteratorType+"Mixin"].call(obj);
          } else if (typeof IteratorType == "function") {
            IteratorType.call(obj);
          }
        }
        return obj;
      }),
      "create" : (function (IteratorType/*:[object|string]*/, obj) {
        var iter, Iterator = sh.Iterator;
        if (obj && ((typeof obj == "object") || (typeof obj == "function"))) {
          if (isString(IteratorType) && (typeof Iterator[IteratorType] == "function")) {
            iter = (new Iterator[IteratorType](obj));
          } else if (typeof IteratorType == "function") {
            iter = (new IteratorType(obj));
          }
        }
        return iter;
      })
    };
  })(global);

  delete arguments.callee;
})((this && (this.window === this) && window) || this);



/*
  for quick testing paste all code into [http://jconsole.com]:
*/
var iter = Iterator.mixin("EntryIterator", document.getElementsByTagName("*"));
//var list = Iterator.mixin("EntryIterator", document.getElementsByTagName("*"));
//var iter = Iterator.create("EntryIterator", document.getElementsByTagName("*"));

print("iter : " + iter);
print("\n");

print("iter.length : " + iter.length);
print("iter.length : " + iter.length);
print("iter.length : " + iter.length);
print("iter.length : " + iter.length);
print("\n");

print("iter.hasPrevious() ? " + iter.hasPrevious());
print("iter.getPrevious() : " + iter.getPrevious());
print("\n");

print("iter.getIndex() : " + iter.getIndex());
print("\n");

print("iter.hasNext() ? " + iter.hasNext());
print("iter.getNext() : " + iter.getNext());
print("\n");

print("iter.getIndex() : " + iter.getIndex());
print("\n");

print("iter.hasPrevious() ? " + iter.hasPrevious());
print("iter.getPrevious() : " + iter.getPrevious());
print("\n");

print("iter.getIndex() : " + iter.getIndex());
print("\n");

print("iter.hasPrevious() ? " + iter.hasPrevious());
print("iter.getPrevious() : " + iter.getPrevious());
print("\n");

print("iter.getIndex() : " + iter.getIndex());
print("\n");

print("iter.hasNext() ? " + iter.hasNext());
print("\n");

print("iter.getNext() : " + iter.getNext());
print("iter.getNext() : " + iter.getNext());
print("iter.getNext() : " + iter.getNext());
print("iter.getNext() : " + iter.getNext());
print("iter.getNext() : " + iter.getNext());
print("iter.getNext() : " + iter.getNext());
print("iter.getNext() : " + iter.getNext());

print("iter.getIndex() : " + iter.getIndex());
print("\n");

print("iter.length : " + iter.length);
print("iter.length : " + iter.length);
print("iter.length : " + iter.length);
print("\n");

print("var obj = iter.getPrevious();");
print("while (!iter.isEoI(obj)) {");
print("  obj = iter.getPrevious();");
print("  print(\"iter.isEoI(\" + obj + \") ? \" + iter.isEoI(obj));");
print("}");
print("\n");

var obj = iter.getPrevious();
while (!iter.isEoI(obj)) {
  obj = iter.getPrevious();
  print("iter.isEoI(" + obj + ") ? " + iter.isEoI(obj));
}
print("\n");

print("iter.getIndex() : " + iter.getIndex());
print("iter.hasPrevious() ? " + iter.hasPrevious());
print("iter.hasNext() ? " + iter.hasNext());
print("\n");

print("iter.isEoI() ? " + iter.isEoI());
print("iter.isEoI(null) ? " + iter.isEoI(null));
print("iter.isEoI(obj) ? " + iter.isEoI(obj));
print("\n");
