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



(function (ns/*[custom_namespace]*/) { // Iterator[EntryIteratorMixin, EntryIterator, PropertyIterator].
  var sh = this/*[global_object|scripting_host]*/;


  if (!sh.Object || (typeof sh.Object.keys != "function")) {
    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Object/Object.keys.js]
    throw (new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Object]] extensions module [Object.keys]."));
  }
  if (!sh.Array || (typeof sh.Array.make != "function")) {
    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Array/Array.make.detect.js]
    throw (new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Array]] extensions module base [Array.make.detect]."));
  }


  (ns||sh)["Iterator"] = (function (NAMESPACE, GLOBAL) { // [Iterator] becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.


    var isString = (function (regXBaseClass, expose) {
      return (function (obj/*:[object|value]*/) {

        return regXBaseClass.test(expose.call(obj));
      });
    })((/^\[object\s+String\]$/), GLOBAL.Object.prototype.toString),

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
              num = (~~(1 * num));
              idx = (((num <= -1) && -1) || ((num >= list.length) && list.length) || num);
            });

            this.isEoI = isEoI;
          }
          return this;
        });
      })(isKindOfList, createGetListItemFallbackByCurrentType, EndOfIteration, isEndOfIteration),


      "EntryIterator": (function (isListLike, make, ns) {

        return (function (obj) {
          if (isListLike(obj)) {

            var list, IteratorMixin = ns.Iterator.EntryIteratorMixin;
            this.compile = (function (obj) {

              list = IteratorMixin.call(make(obj));

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
              return this;
            });
            return this.compile(obj);
          }
        });
      })(isKindOfList, GLOBAL.Array.make, NAMESPACE),


      "PropertyIterator": (function (keys, ns) {

        return (function (obj) {

          var list, IteratorMixin = ns.Iterator.EntryIteratorMixin,
          getPrevious, getNext, getIndex, isEoI;

          this.compile = (function (obj) {

            list = IteratorMixin.call(keys(obj)),

            getPrevious = list.getPrevious;
            getNext = list.getNext;
            getIndex = list.getIndex;
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
          return this.compile(obj);
        });
      })(GLOBAL.Object.keys, NAMESPACE),


      "mixin" : (function (IteratorType/*:[object|string]*/, obj) {
        if (obj && ((typeof obj == "object") || (typeof obj == "function"))) {
          var Iterator = NAMESPACE.Iterator;
          if (isString(IteratorType) && (typeof Iterator[IteratorType+"Mixin"] == "function")) {
            Iterator[IteratorType+"Mixin"].call(obj);
          } else if (typeof IteratorType == "function") {
            IteratorType.call(obj);
          }
        }
        return obj;
      }),
      "create" : (function (IteratorType/*:[object|string]*/, obj) {
        var iter, Iterator = NAMESPACE.Iterator;
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
  })((ns||sh), sh);


  sh = ns = null;
  delete sh; delete ns;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_Iterator_is_supposed_to_be_bound_to]*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 4.143 byte
(function(ns){var sh=this;if(!sh.Object||typeof sh.Object.keys!="function")throw new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Object]] extensions module [Object.keys].");if(!sh.Array||typeof sh.Array.make!="function")throw new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Array]] extensions module base [Array.make.detect].");(ns||sh)["Iterator"]=function(NAMESPACE,GLOBAL){var isString=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+String\]$/,GLOBAL.Object.prototype.toString),isKindOfList=function(obj){return obj&&typeof obj.length=="number"&&isFinite(obj.length)},hasItemMethod=function(obj){return obj&&obj.item&&(typeof obj.item=="function"||typeof obj.item=="object")},createGetListItemFallbackByCurrentType=function(obj){return isString(obj)&&function(str,idx){return str.charAt(idx)}||hasItemMethod(obj)&&function(obj,idx){return obj.item(idx)}||function(obj,idx,ndf){return ndf}},EndOfIteration=function(){var obj={};obj.constructor.toString=function(){return"[object EoI]"};obj.toString=function(){return"EoI"};obj.valueOf=function(){return null};return obj}(),isEndOfIteration=function(EoI){return function(obj){return obj===EoI}}(EndOfIteration);return{EntryIteratorMixin:function(isListLike,createGetListItemFallback,EoI,isEoI){return function(){if(isListLike(this)){var idx=-1,list=this,getListItem=createGetListItemFallback(list);this.hasPrevious=function(){return idx>0};this.hasNext=function(){return idx<list.length-1};this.getPrevious=function(){var obj;if(idx>0){obj=list[--idx];obj=typeof obj!="undefined"||!(idx in list)?obj:getListItem(list,idx)}else{idx=-1;obj=EoI}return obj};this.getNext=function(){var obj;if(idx<list.length-1){obj=list[++idx];obj=typeof obj!="undefined"||!(idx in list)?obj:getListItem(list,idx)}else{idx=list.length;obj=EoI}return obj};this.getIndex=function(){return idx<list.length&&idx>-1?idx:EoI};this.setIndex=function(num){num=~~(1*num);idx=num<=-1&&-1||num>=list.length&&list.length||num};this.isEoI=isEoI}return this}}(isKindOfList,createGetListItemFallbackByCurrentType,EndOfIteration,isEndOfIteration),EntryIterator:function(isListLike,make,ns){return function(obj){if(isListLike(obj)){var list,IteratorMixin=ns.Iterator.EntryIteratorMixin;this.compile=function(obj){list=IteratorMixin.call(make(obj));this.hasPrevious=list.hasPrevious;this.hasNext=list.hasNext;this.getPrevious=list.getPrevious;this.getNext=list.getNext;this.getIndex=list.getIndex;this.setIndex=list.setIndex;this.isEoI=list.isEoI;this.size=function(){return list.length};return this};return this.compile(obj)}}}(isKindOfList,GLOBAL.Array.make,NAMESPACE),PropertyIterator:function(keys,ns){return function(obj){var list,IteratorMixin=ns.Iterator.EntryIteratorMixin,getPrevious,getNext,getIndex,isEoI;this.compile=function(obj){list=IteratorMixin.call(keys(obj)),getPrevious=list.getPrevious;getNext=list.getNext;getIndex=list.getIndex;isEoI=list.isEoI;this.hasPrevious=list.hasPrevious;this.hasNext=list.hasNext;this.getPrevious=function(){var key=getPrevious();return!isEoI(key)?obj[key]:key};this.getNext=function(){var key=getNext();return!isEoI(key)?obj[key]:key};this.getKey=function(){var idx=getIndex();return!isEoI(idx)?list[idx]:idx};this.isEoI=isEoI;this.size=function(){return list.length};return this};return this.compile(obj)}}(GLOBAL.Object.keys,NAMESPACE),mixin:function(IteratorType,obj){if(obj&&(typeof obj=="object"||typeof obj=="function")){var Iterator=NAMESPACE.Iterator;if(isString(IteratorType)&&typeof Iterator[IteratorType+"Mixin"]=="function")Iterator[IteratorType+"Mixin"].call(obj);else if(typeof IteratorType=="function")IteratorType.call(obj)}return obj},create:function(IteratorType,obj){var iter,Iterator=NAMESPACE.Iterator;if(obj&&(typeof obj=="object"||typeof obj=="function"))if(isString(IteratorType)&&typeof Iterator[IteratorType]=="function")iter=new Iterator[IteratorType](obj);else if(typeof IteratorType=="function")iter=new IteratorType(obj);return iter}}}(ns||sh,sh);sh=ns=null;delete sh;delete ns;delete arguments.callee}).call(null);

- Simple          - 2.979 byte
(function(l){var i=this;if(!i.Object||typeof i.Object.keys!="function")throw new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Object]] extensions module [Object.keys].");if(!i.Array||typeof i.Array.make!="function")throw new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Array]] extensions module base [Array.make.detect].");(l||i).Iterator=function(m,n){var o=function(a,c){return function(e){return a.test(c.call(e))}}(/^\[object\s+String\]$/,n.Object.prototype.toString),q=function(a){return a&&typeof a.length=="number"&&isFinite(a.length)},r=function(){var a={};a.constructor.toString=function(){return"[object EoI]"};a.toString=function(){return"EoI"};a.valueOf=function(){return null};return a}(),s=function(a){return function(c){return c===a}}(r);return{EntryIteratorMixin:function(a,c,e,f){return function(){if(a(this)){var b=-1,g=this,j=c(g);this.hasPrevious=function(){return b>0};this.hasNext=function(){return b<g.length-1};this.getPrevious=function(){var d;if(b>0){d=g[--b];d=typeof d!="undefined"||!(b in g)?d:j(g,b)}else{b=-1;d=e}return d};this.getNext=function(){var d;if(b<g.length-1){d=g[++b];d=typeof d!="undefined"||!(b in g)?d:j(g,b)}else{b=g.length;d=e}return d};this.getIndex=function(){return b<g.length&&b>-1?b:e};this.setIndex=function(d){d=~~(1*d);b=d<=-1&&-1||d>=g.length&&g.length||d};this.isEoI=f}return this}}(q,function(a){return o(a)&&function(c,e){return c.charAt(e)}||a&&a.item&&(typeof a.item=="function"||typeof a.item=="object")&&function(c,e){return c.item(e)}||function(c,e,f){return f}},r,s),EntryIterator:function(a,c,e){return function(f){if(a(f)){var b,g=e.Iterator.EntryIteratorMixin;this.compile=function(j){b=g.call(c(j));this.hasPrevious=b.hasPrevious;this.hasNext=b.hasNext;this.getPrevious=b.getPrevious;this.getNext=b.getNext;this.getIndex=b.getIndex;this.setIndex=b.setIndex;this.isEoI=b.isEoI;this.size=function(){return b.length};return this};return this.compile(f)}}}(q,n.Array.make,m),PropertyIterator:function(a,c){return function(e){var f,b=c.Iterator.EntryIteratorMixin,g,j,d,k;this.compile=function(p){f=b.call(a(p));g=f.getPrevious;j=f.getNext;d=f.getIndex;k=f.isEoI;this.hasPrevious=f.hasPrevious;this.hasNext=f.hasNext;this.getPrevious=function(){var h=g();return!k(h)?p[h]:h};this.getNext=function(){var h=j();return!k(h)?p[h]:h};this.getKey=function(){var h=d();return!k(h)?f[h]:h};this.isEoI=k;this.size=function(){return f.length};return this};return this.compile(e)}}(n.Object.keys,m),mixin:function(a,c){if(c&&(typeof c=="object"||typeof c=="function")){var e=m.Iterator;if(o(a)&&typeof e[a+"Mixin"]=="function")e[a+"Mixin"].call(c);else typeof a=="function"&&a.call(c)}return c},create:function(a,c){var e,f=m.Iterator;if(c&&(typeof c=="object"||typeof c=="function"))if(o(a)&&typeof f[a]=="function")e=new f[a](c);else if(typeof a=="function")e=new a(c);return e}}}(l||i,i);i=l=null;delete i;delete l;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 4.314 byte :
(function(ns){var sh=this;if(!sh.Object||(typeof sh.Object.keys!="function")){throw(new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Object]] extensions module [Object.keys]."));}if(!sh.Array||(typeof sh.Array.make!="function")){throw(new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Array]] extensions module base [Array.make.detect]."));}(ns||sh)["Iterator"]=(function(NAMESPACE,GLOBAL){var isString=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+String\]$/),GLOBAL.Object.prototype.toString),isKindOfList=(function(obj){return(obj&&(typeof obj.length=="number")&&isFinite(obj.length))}),hasItemMethod=(function(obj){return(obj&&obj.item&&((typeof obj.item=="function")||(typeof obj.item=="object")))}),createGetListItemFallbackByCurrentType=(function(obj){return((isString(obj)&&(function(str,idx){return str.charAt(idx)}))||(hasItemMethod(obj)&&(function(obj,idx){return obj.item(idx)}))||(function(obj,idx,ndf){return ndf}))}),EndOfIteration=(function(){var obj={};obj.constructor.toString=(function(){return"[object EoI]"});obj.toString=(function(){return"EoI"});obj.valueOf=(function(){return null});return obj})(),isEndOfIteration=(function(EoI){return(function(obj){return(obj===EoI)})})(EndOfIteration);return{"EntryIteratorMixin":(function(isListLike,createGetListItemFallback,EoI,isEoI){return(function(){if(isListLike(this)){var idx=-1,list=this,getListItem=createGetListItemFallback(list);this.hasPrevious=(function(){return(idx>0)});this.hasNext=(function(){return(idx<(list.length-1))});this.getPrevious=(function(){var obj;if(idx>0){obj=list[--idx];obj=(((typeof obj!="undefined")||!(idx in list))?obj:getListItem(list,idx))}else{idx=-1;obj=EoI}return obj});this.getNext=(function(){var obj;if(idx<(list.length-1)){obj=list[++idx];obj=(((typeof obj!="undefined")||!(idx in list))?obj:getListItem(list,idx))}else{idx=list.length;obj=EoI}return obj});this.getIndex=(function(){return(((idx<list.length)&&(idx>-1))?idx:EoI)});this.setIndex=(function(num){num=(~~(1*num));idx=(((num<=-1)&&-1)||((num>=list.length)&&list.length)||num)});this.isEoI=isEoI}return this})})(isKindOfList,createGetListItemFallbackByCurrentType,EndOfIteration,isEndOfIteration),"EntryIterator":(function(isListLike,make,ns){return(function(obj){if(isListLike(obj)){var list,IteratorMixin=ns.Iterator.EntryIteratorMixin;this.compile=(function(obj){list=IteratorMixin.call(make(obj));this.hasPrevious=list.hasPrevious;this.hasNext=list.hasNext;this.getPrevious=list.getPrevious;this.getNext=list.getNext;this.getIndex=list.getIndex;this.setIndex=list.setIndex;this.isEoI=list.isEoI;this.size=(function(){return list.length});return this});return this.compile(obj)}})})(isKindOfList,GLOBAL.Array.make,NAMESPACE),"PropertyIterator":(function(keys,ns){return(function(obj){var list,IteratorMixin=ns.Iterator.EntryIteratorMixin,getPrevious,getNext,getIndex,isEoI;this.compile=(function(obj){list=IteratorMixin.call(keys(obj)),getPrevious=list.getPrevious;getNext=list.getNext;getIndex=list.getIndex;isEoI=list.isEoI;this.hasPrevious=list.hasPrevious;this.hasNext=list.hasNext;this.getPrevious=(function(){var key=getPrevious();return(!isEoI(key)?obj[key]:key)});this.getNext=(function(){var key=getNext();return(!isEoI(key)?obj[key]:key)});this.getKey=(function(){var idx=getIndex();return(!isEoI(idx)?list[idx]:idx)});this.isEoI=isEoI;this.size=(function(){return list.length});return this});return this.compile(obj)})})(GLOBAL.Object.keys,NAMESPACE),"mixin":(function(IteratorType,obj){if(obj&&((typeof obj=="object")||(typeof obj=="function"))){var Iterator=NAMESPACE.Iterator;if(isString(IteratorType)&&(typeof Iterator[IteratorType+"Mixin"]=="function")){Iterator[IteratorType+"Mixin"].call(obj)}else if(typeof IteratorType=="function"){IteratorType.call(obj)}}return obj}),"create":(function(IteratorType,obj){var iter,Iterator=NAMESPACE.Iterator;if(obj&&((typeof obj=="object")||(typeof obj=="function"))){if(isString(IteratorType)&&(typeof Iterator[IteratorType]=="function")){iter=(new Iterator[IteratorType](obj))}else if(typeof IteratorType=="function"){iter=(new IteratorType(obj))}}return iter})}})((ns||sh),sh);sh=ns=null;delete sh;delete ns;delete arguments.callee}).call(null);

- packed / shrinked           - 3.620 byte :
(function(j){var k=this;if(!k.Object||(typeof k.Object.keys!="function")){throw(new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Object]] extensions module [Object.keys]."));}if(!k.Array||(typeof k.Array.make!="function")){throw(new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Array]] extensions module base [Array.make.detect]."));}(j||k).Iterator=(function(g,h){var i=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+String\]$/),h.Object.prototype.toString),isKindOfList=(function(a){return(a&&(typeof a.length=="number")&&isFinite(a.length))}),hasItemMethod=(function(a){return(a&&a.item&&((typeof a.item=="function")||(typeof a.item=="object")))}),createGetListItemFallbackByCurrentType=(function(d){return((i(d)&&(function(a,b){return a.charAt(b)}))||(hasItemMethod(d)&&(function(a,b){return a.item(b)}))||(function(a,b,c){return c}))}),EndOfIteration=(function(){var a={};a.constructor.toString=(function(){return"[object EoI]"});a.toString=(function(){return"EoI"});a.valueOf=(function(){return null});return a})(),isEndOfIteration=(function(b){return(function(a){return(a===b)})})(EndOfIteration);return{"EntryIteratorMixin":(function(c,d,e,f){return(function(){if(c(this)){var b=-1,list=this,getListItem=d(list);this.hasPrevious=(function(){return(b>0)});this.hasNext=(function(){return(b<(list.length-1))});this.getPrevious=(function(){var a;if(b>0){a=list[--b];a=(((typeof a!="undefined")||!(b in list))?a:getListItem(list,b))}else{b=-1;a=e}return a});this.getNext=(function(){var a;if(b<(list.length-1)){a=list[++b];a=(((typeof a!="undefined")||!(b in list))?a:getListItem(list,b))}else{b=list.length;a=e}return a});this.getIndex=(function(){return(((b<list.length)&&(b>-1))?b:e)});this.setIndex=(function(a){a=(~~(1*a));b=(((a<=-1)&&-1)||((a>=list.length)&&list.length)||a)});this.isEoI=f}return this})})(isKindOfList,createGetListItemFallbackByCurrentType,EndOfIteration,isEndOfIteration),"EntryIterator":(function(d,e,f){return(function(b){if(d(b)){var c,IteratorMixin=f.Iterator.EntryIteratorMixin;this.compile=(function(a){c=IteratorMixin.call(e(a));this.hasPrevious=c.hasPrevious;this.hasNext=c.hasNext;this.getPrevious=c.getPrevious;this.getNext=c.getNext;this.getIndex=c.getIndex;this.setIndex=c.setIndex;this.isEoI=c.isEoI;this.size=(function(){return c.length});return this});return this.compile(b)}})})(isKindOfList,h.Array.make,g),"PropertyIterator":(function(e,f){return(function(c){var d,IteratorMixin=f.Iterator.EntryIteratorMixin,getPrevious,getNext,getIndex,isEoI;this.compile=(function(b){d=IteratorMixin.call(e(b)),getPrevious=d.getPrevious;getNext=d.getNext;getIndex=d.getIndex;isEoI=d.isEoI;this.hasPrevious=d.hasPrevious;this.hasNext=d.hasNext;this.getPrevious=(function(){var a=getPrevious();return(!isEoI(a)?b[a]:a)});this.getNext=(function(){var a=getNext();return(!isEoI(a)?b[a]:a)});this.getKey=(function(){var a=getIndex();return(!isEoI(a)?d[a]:a)});this.isEoI=isEoI;this.size=(function(){return d.length});return this});return this.compile(c)})})(h.Object.keys,g),"mixin":(function(a,b){if(b&&((typeof b=="object")||(typeof b=="function"))){var c=g.Iterator;if(i(a)&&(typeof c[a+"Mixin"]=="function")){c[a+"Mixin"].call(b)}else if(typeof a=="function"){a.call(b)}}return b}),"create":(function(a,b){var c,Iterator=g.Iterator;if(b&&((typeof b=="object")||(typeof b=="function"))){if(i(a)&&(typeof Iterator[a]=="function")){c=(new Iterator[a](b))}else if(typeof a=="function"){c=(new a(b))}}return c})}})((j||k),k);k=j=null;delete k;delete j;delete arguments.callee}).call(null);

- packed / shrinked / encoded - 2.601 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(j){7 k=4;8(!k.q||(5 k.q.G!="2")){P(z N("O [[m]] S U A W X A [[q]] Y 10 [q.G]."));}8(!k.t||(5 k.t.E!="2")){P(z N("O [[m]] S U A W X A [[t]] Y 10 1c [t.E.1e]."));}(j||k).m=(2(g,h){7 i=(2(b,c){3(2(a){3 b.1f(c.r(a))})})((/^\\[w\\s+17\\]$/),h.q.1h.H),I=(2(a){3(a&&(5 a.l=="1i")&&15(a.l))}),Z=(2(a){3(a&&a.y&&((5 a.y=="2")||(5 a.y=="w")))}),11=(2(d){3((i(d)&&(2(a,b){3 a.1j(b)}))||(Z(d)&&(2(a,b){3 a.y(b)}))||(2(a,b,c){3 c}))}),L=(2(){7 a={};a.14.H=(2(){3"[w V]"});a.H=(2(){3"V"});a.1k=(2(){3 D});3 a})(),T=(2(b){3(2(a){3(a===b)})})(L);3{"M":(2(c,d,e,f){3(2(){8(c(4)){7 b=-1,6=4,K=d(6);4.u=(2(){3(b>0)});4.v=(2(){3(b<(6.l-1))});4.o=(2(){7 a;8(b>0){a=6[--b];a=(((5 a!="13")||!(b R 6))?a:K(6,b))}x{b=-1;a=e}3 a});4.n=(2(){7 a;8(b<(6.l-1)){a=6[++b];a=(((5 a!="13")||!(b R 6))?a:K(6,b))}x{b=6.l;a=e}3 a});4.p=(2(){3(((b<6.l)&&(b>-1))?b:e)});4.J=(2(a){a=(~~(1*a));b=(((a<=-1)&&-1)||((a>=6.l)&&6.l)||a)});4.9=f}3 4})})(I,11,L,T),"16":(2(d,e,f){3(2(b){8(d(b)){7 c,C=f.m.M;4.B=(2(a){c=C.r(e(a));4.u=c.u;4.v=c.v;4.o=c.o;4.n=c.n;4.p=c.p;4.J=c.J;4.9=c.9;4.12=(2(){3 c.l});3 4});3 4.B(b)}})})(I,h.t.E,g),"18":(2(e,f){3(2(c){7 d,C=f.m.M,o,n,p,9;4.B=(2(b){d=C.r(e(b)),o=d.o;n=d.n;p=d.p;9=d.9;4.u=d.u;4.v=d.v;4.o=(2(){7 a=o();3(!9(a)?b[a]:a)});4.n=(2(){7 a=n();3(!9(a)?b[a]:a)});4.1g=(2(){7 a=p();3(!9(a)?d[a]:a)});4.9=9;4.12=(2(){3 d.l});3 4});3 4.B(c)})})(h.q.G,g),"19":(2(a,b){8(b&&((5 b=="w")||(5 b=="2"))){7 c=g.m;8(i(a)&&(5 c[a+"Q"]=="2")){c[a+"Q"].r(b)}x 8(5 a=="2"){a.r(b)}}3 b}),"1a":(2(a,b){7 c,m=g.m;8(b&&((5 b=="w")||(5 b=="2"))){8(i(a)&&(5 m[a]=="2")){c=(z m[a](b))}x 8(5 a=="2"){c=(z a(b))}}3 c})}})((j||k),k);k=j=D;F k;F j;F 1b.1d}).r(D);',62,83,'||function|return|this|typeof|list|var|if|isEoI||||||||||||length|Iterator|getNext|getPrevious|getIndex|Object|call||Array|hasPrevious|hasNext|object|else|item|new|the|compile|IteratorMixin|null|make|delete|keys|toString|isKindOfList|setIndex|getListItem|EndOfIteration|EntryIteratorMixin|ReferenceError|Some|throw|Mixin|in|implementations|isEndOfIteration|require|EoI|presence|of|extensions|hasItemMethod|module|createGetListItemFallbackByCurrentType|size|undefined|constructor|isFinite|EntryIterator|String|PropertyIterator|mixin|create|arguments|base|callee|detect|test|getKey|prototype|number|charAt|valueOf'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 2.286 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(l){6 i=4;7(!i.t||5 i.t.L!="2")Z D Y("X [[9]] S V C U T C [[t]] R Q [t.L].");7(!i.A||5 i.A.J!="2")Z D Y("X [[9]] S V C U T C [[A]] R Q 19 [A.J.1a].");(l||i).9=2(m,n){6 o=2(a,c){3 2(e){3 a.18(c.u(e))}}(/^\\[y\\s+13\\]$/,n.t.17.I),q=2(a){3 a&&5 a.8=="1b"&&1c(a.8)},r=2(){6 a={};a.1h.I=2(){3"[y P]"};a.I=2(){3"P"};a.15=2(){3 O};3 a}(),s=2(a){3 2(c){3 c===a}}(r);3{K:2(a,c,e,f){3 2(){7(a(4)){6 b=-1,g=4,j=c(g);4.w=2(){3 b>0};4.x=2(){3 b<g.8-1};4.v=2(){6 d;7(b>0){d=g[--b];d=5 d!="11"||!(b 12 g)?d:j(g,b)}F{b=-1;d=e}3 d};4.z=2(){6 d;7(b<g.8-1){d=g[++b];d=5 d!="11"||!(b 12 g)?d:j(g,b)}F{b=g.8;d=e}3 d};4.E=2(){3 b<g.8&&b>-1?b:e};4.N=2(d){d=~~(1*d);b=d<=-1&&-1||d>=g.8&&g.8||d};4.B=f}3 4}}(q,2(a){3 o(a)&&2(c,e){3 c.14(e)}||a&&a.H&&(5 a.H=="2"||5 a.H=="y")&&2(c,e){3 c.H(e)}||2(c,e,f){3 f}},r,s),16:2(a,c,e){3 2(f){7(a(f)){6 b,g=e.9.K;4.G=2(j){b=g.u(c(j));4.w=b.w;4.x=b.x;4.v=b.v;4.z=b.z;4.E=b.E;4.N=b.N;4.B=b.B;4.W=2(){3 b.8};3 4};3 4.G(f)}}}(q,n.A.J,m),1f:2(a,c){3 2(e){6 f,b=c.9.K,g,j,d,k;4.G=2(p){f=b.u(a(p));g=f.v;j=f.z;d=f.E;k=f.B;4.w=f.w;4.x=f.x;4.v=2(){6 h=g();3!k(h)?p[h]:h};4.z=2(){6 h=j();3!k(h)?p[h]:h};4.1d=2(){6 h=d();3!k(h)?f[h]:h};4.B=k;4.W=2(){3 f.8};3 4};3 4.G(e)}}(n.t.L,m),1e:2(a,c){7(c&&(5 c=="y"||5 c=="2")){6 e=m.9;7(o(a)&&5 e[a+"10"]=="2")e[a+"10"].u(c);F 5 a=="2"&&a.u(c)}3 c},1g:2(a,c){6 e,f=m.9;7(c&&(5 c=="y"||5 c=="2"))7(o(a)&&5 f[a]=="2")e=D f[a](c);F 7(5 a=="2")e=D a(c);3 e}}}(l||i,i);i=l=O;M i;M l;M 1i.1j}).u(O);',62,82,'||function|return|this|typeof|var|if|length|Iterator||||||||||||||||||||Object|call|getPrevious|hasPrevious|hasNext|object|getNext|Array|isEoI|the|new|getIndex|else|compile|item|toString|make|EntryIteratorMixin|keys|delete|setIndex|null|EoI|module|extensions|implementations|of|presence|require|size|Some|ReferenceError|throw|Mixin|undefined|in|String|charAt|valueOf|EntryIterator|prototype|test|base|detect|number|isFinite|getKey|mixin|PropertyIterator|create|constructor|arguments|callee'.split('|'),0,{}));


*/ /*


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
