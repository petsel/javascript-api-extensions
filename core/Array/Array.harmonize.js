

(function () {


  var sh/*global*/ = ((this && (this.window === this) && /*this.*/window) || this), // "scripting host" or "global object"

  Arr = sh.Array/*, Obj = sh.Object*/, ProtoArr = Arr.prototype, ProtoObj = sh.Object.prototype, exposeImplementation = ProtoObj.toString,

  isFunction = (((typeof sh.isFunction == "function") && sh.isFunction) || (function (obj) {return (typeof obj == "function");}));


  Arr.isArray = sh.isArray = (

    (isFunction(Arr.isArray) && Arr.isArray) ||
    (isFunction(sh.isArray) && sh.isArray) ||

    (function () { // equal to : Arr.isArray = sh.isArray = (function () { ... });

      var regXBaseClass = (/^\[object\s+Array\]$/), expose = exposeImplementation;
      return (function (obj/*:[object|value]*/) {

        return regXBaseClass.test(expose.call(obj));
      });
    })()
  );
  Arr.isArgumentsArray = (

    (isFunction(Arr.isArgumentsArray) && Arr.isArgumentsArray) ||
    (function () {

      var isArguments, regXBaseClass = (/^\[object\s+Object\]$/), expose = exposeImplementation, isEnumerable = ProtoObj.propertyIsEnumerable;
      try {
        isEnumerable.call(sh, "length");
        isArguments = (function (obj/*:[object|value]*/) {

          return (regXBaseClass.test(expose.call(obj)) && !!obj && (typeof obj.length == "number") && !isEnumerable.call(obj, "length"));
        });
      } catch (exc) { // [exc]::[Error]
        isArguments = (function (obj/*:[object|value]*/) {

          return (regXBaseClass.test(expose.call(obj)) && !!obj && (typeof obj.length == "number") && !(function (elm) {var isEnum;try {isEnum = isEnumerable.call(elm, "length");} catch (exc) {isEnum = true;}return isEnum;})(obj));
        });
      }
      return isArguments;
    })()
  );
  Arr.make = (function () {

    var make, arr, str, doc = sh.document, global = sh,
    all = ((doc && isFunction(doc.getElementsByTagName) && doc.getElementsByTagName("*")) || []),
    slice = ProtoArr.slice,
    isArguments = Arr.isArgumentsArray,
    isArray = Arr.isArray,
    isString = (
      (isFunction(sh.isString) && sh.isString) ||
      (function () {

        var regXBaseClass = (/^\[object\s+String\]$/), expose = exposeImplementation;
        return (function (obj/*:[object|value]*/) {

          return regXBaseClass.test(expose.call(obj));
        });
      })()
    );

    try {

    //[NodeList|HTMLCollection] test in case this script runs within a certain W3C-DOM context (this test fails silently if there was no DOM at all).
      arr = slice.call(all); // msie fails.

    //[arguments] test.
      arr = slice.call(arguments); // every relevant (seen from a point of market share) browser passes.
      str = arr.join("");
      if ((arr.length != 3) || (str != "Array.make")) {
        throw (new Error);
      }

    //[String] test.
      arr = slice.call(str); // opera and msie fail.
      if ((arr.length !== 10) || (arr[5] !== ".")) {
        throw (new Error);
      }

  //  so far fastest available, most reliable [Array.make] implementation - failing silently - supported by all browsers that pass all of the above tests.
      make = (function (list) {

        var arr, len = ((list || isString(list)) && list.length);
        return (((typeof len == "number") && global.isFinite(len) && slice.call(list)) || arr); // ( ... || list); // ( ... || []); // ( ... || [list]); // there might be a debate on it.
      });

    //clean up after
      isArguments = null; isArray = null;
      delete isArguments; delete isArray;

    } catch (exc) { // [exc]::[Error]

  //  so far most reliable [Array.make] implementation - failing silently - fallback for all browsers that do fail at least one of the above tests.
      make = (function (list) {

        var elm, idx, arr = ((isArguments(list) && slice.call(list)) || (isString(list) && list.split("")) || (isArray(list) && slice.call(list)) || elm); // [arguments], [String] and [Array] test shortcut.
        if (!arr) {
        //idx = (list && list.length); // (((0) && (0).length) === 0) // ((0 && window.undefined) === 0) // true
          idx = ((list !== 0) && list && list.length); // prevent passing zero as an argument.
          if ((typeof idx == "number") && global.isFinite(idx)) { // detect invalid list structures.

            arr = new global.Array(global.Math.max(0, idx));

            if (typeof list.item == "function") {
              while (--idx >= 0) {
                elm = list.item(idx);
                if ((typeof elm != "undefined") || (idx in list)) {
                  arr[idx] = elm;
                }
              }
            } else {
              while (--idx >= 0) {
                elm = list[idx];
                if ((typeof elm != "undefined") || (idx in list)) {
                  arr[idx] = elm;
                }
              }
            }
          }
        }
        return arr; // (arr || list); // (arr || []); // (arr || [list]); // there might be a debate on it.
      });
    }
  //clean up after
    arr = null; str = null; doc = null; all = null;
    delete arr; delete str; delete doc; delete all;

    return make;

  })("Array", ".", "make");


  ProtoArr.forEach = ((isFunction(ProtoArr.forEach) && ProtoArr.forEach) || (function () {

    var isArray = Arr.isArray, makeArray = Arr.make, isFinite = sh.isFinite;
    return (function (fct, target) {

      var arr = ((isArray(this) && this) || makeArray(this));
      if (arr && (typeof fct == "function")) { // fail silently

        target = (((typeof target == "undefined") || ((typeof target == "obj") && !target)) ? (null) : (target));
        var elm, i = -1, len = arr.length;
        while (++i < len) {
          elm = arr[i];
          if ((typeof elm != "undefined") || (i in arr)) { // countercheck on this issue with [https://bugzilla.mozilla.org/show_bug.cgi?id=475925] and [http://code.google.com/p/v8/issues/detail?id=218]
            fct.call(target, elm, i, arr);
          }
        }
      }
    });
  })());
  Arr.forEach = ((isFunction(Arr.forEach) && Arr.forEach) || (function () {

    var forEach = ProtoArr.forEach;
    return (function (list, fct, target) {

      forEach.call(list, fct, target);
    });
  })());


  ProtoArr.every = ((isFunction(ProtoArr.every) && ProtoArr.every) || (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, target) {

      var isAnd, arr = ((isArray(this) && this) || makeArray(this));
      if (arr && (typeof fct == "function")) { // fail silently

        var elm, i = -1, len = arr.length, hasSome = false; // [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were unassigned/[undefined] values.
        if (len >= 1) {

          target = (((typeof target == "undefined") || ((typeof target == "obj") && !target)) ? (null) : (target));
          isAnd = true;
          while (isAnd && (++i < len)) {
            elm = arr[i];
            if ((typeof elm != "undefined") || (i in arr)) {
              hasSome = true;
              isAnd = fct.call(target, elm, i, arr);
            }
          }
          isAnd = (hasSome && isAnd);
        }
      }
      return !!isAnd; // prevents return of the initial [undefined] value for [isAnd].
    });
  })());
  Arr.every = ((isFunction(Arr.every) && Arr.every) || (function () {

    var every = ProtoArr.every;
    return (function (list, fct, target) {

      return every.call(list, fct, target);
    });
  })());
//Array.every("aaaaaaaaaaa", (function (elm) {return (elm === "a");}));


  ProtoArr.some = ((isFunction(ProtoArr.some) && ProtoArr.some) || (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, target) {

      var isOr, arr = ((isArray(this) && this) || makeArray(this));
      if (arr && (typeof fct == "function")) { // fail silently

        var elm, i = -1, len = arr.length, hasSome = false;// [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were unassigned/[undefined] values.
        if (len >= 1) {

          target = (((typeof target == "undefined") || ((typeof target == "obj") && !target)) ? (null) : (target));
          isOr = false;
          while (!isOr && (++i < len)) {
            elm = arr[i];
            if ((typeof elm != "undefined") || (i in arr)) {
              hasSome = true;
              isOr = fct.call(target, elm, i, arr);
            }
          }
          isOr = (hasSome && isOr);
        }
      }
      return !!isOr; // prevents return of the initial [undefined] value for [isOr].
    });
  })());
  Arr.some = ((isFunction(Arr.some) && Arr.some) || (function () {

    var some = ProtoArr.some;
    return (function (list, fct, target) {

      return some.call(list, fct, target);
    });
  })());
//Array.some("bbbbbbbbbba", (function (elm) {return (elm === "a");}));


  ProtoArr.map = ((isFunction(ProtoArr.map) && ProtoArr.map) || (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, target) {

      var arr = [], list = ((isArray(this) && this) || makeArray(this));
      if (list && (typeof fct == "function")) {

        target = (((typeof target == "undefined") || ((typeof target == "obj") && !target)) ? (null) : (target));
        var elm, i = -1, len = list.length;
        while (++i < len) {
          elm = list[i];
          if ((typeof elm != "undefined") || (i in list)) {
            arr[i] = fct.call(target, elm, i, list);
          } else {
            arr[i] = elm;
          }
        }
      }
      return arr;
    });
  })());
  Arr.map = ((isFunction(Arr.map) && Arr.map) || (function () {

    var map = ProtoArr.map;
    return (function (list, fct, target) {

      return map.call(list, fct, target);
    });
  })());


  ProtoArr.filter = ((isFunction(ProtoArr.filter) && ProtoArr.filter) || (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, target) {

      var arr = [], list = ((isArray(this) && this) || makeArray(this));
      if (list && (typeof fct == "function")) {

        target = (((typeof target == "undefined") || ((typeof target == "obj") && !target)) ? (null) : (target));
        var elm, i = -1, len = list.length;
        while (++i < len) {
          elm = list[i];
          if ((typeof elm != "undefined") || (i in list)) {
            if (fct.call(target, elm, i, list)) {
              arr.push(elm);
            }
          }
        }
      }
      return arr;
    });
  })());
  Arr.filter = ((isFunction(Arr.filter) && Arr.filter) || (function () {

    var filter = ProtoArr.filter;
    return (function (list, fct, target) {

      return filter.call(list, fct, target);
    });
  })());


  ProtoArr.reduce = ((isFunction(ProtoArr.reduce) && ProtoArr.reduce) || (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, val) {

      var ndf, list = ((isArray(this) && this) || makeArray(this));
      if (list && (typeof fct == "function")) {

        var elm, i = 0, len = list.length, isInitalValue = (typeof val != "undefined");
        if ((len !== 0) || isInitalValue) {

          if (!isInitalValue) {
            do { // retrieve initial value in case it was not passed.
              elm = list[i];
              if ((typeof elm != "undefined") || (i in list)) {
                val = elm;
                ++i;
                break;
              }
              if (++i >= len) {
              //val = ndf;
                break;
              }
            }
            while (true);
          }
          while (i < len) { // reduce process
            elm = list[i];
            if ((typeof elm != "undefined") || (i in list)) {
              val = fct.call(null, val, elm, i, list);
            }
            ++i;
          }
        } else {
          val = ndf;
        }
      } else {
        val = ndf; // ndf : "not defined" : [undefined] value
      }
      return val;
    });
  })());
  Arr.reduce = ((isFunction(Arr.reduce) && Arr.reduce) || (function () {

    var reduce = ProtoArr.reduce;
    return (function (list, fct, target) {

      return reduce.call(list, fct, target);
    });
  })());


  ProtoArr.reduceRight = ((isFunction(ProtoArr.reduceRight) && ProtoArr.reduceRight) || (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, val) {

      var ndf, list = ((isArray(this) && this) || makeArray(this));
      if (list && (typeof fct == "function")) {

        var elm, len = list.length, i = (len - 1), isInitalValue = (typeof val != "undefined");
        if ((len !== 0) || isInitalValue) {

          if (!isInitalValue) {
            do { // retrieve initial value in case it was not passed.
              elm = list[i];
              if ((typeof elm != "undefined") || (i in list)) {
                val = elm;
                --i;
                break;
              }
              if (--i < 0) {
              //val = ndf;
                break;
              }
            }
            while (true);
          }
          while (i >= 0) { // reduce process
            elm = list[i];
            if ((typeof elm != "undefined") || (i in list)) {
              val = fct.call(null, val, elm, i, list);
            }
            --i;
          }
        } else {
          val = ndf;
        }
      } else {
        val = ndf; // ndf : "not defined" : [undefined] value
      }
      return val;
    });
  })());
  Arr.reduceRight = ((isFunction(Arr.reduceRight) && Arr.reduceRight) || (function () {

    var reduceRight = ProtoArr.reduceRight;
    return (function (list, fct, target) {

      return reduceRight.call(list, fct, target);
    });
  })());


  ProtoArr.indexOf = ((isFunction(ProtoArr.indexOf) && ProtoArr.indexOf) || (function () {

    var isArray = Arr.isArray, makeArray = Arr.make, global = sh;
    return (function (obj, idx) {

      var len, elm, isMember, list = ((isArray(this) && this) || makeArray(this));
      if (list) {
        len = list.length;

        idx = global.parseInt(global.Number(idx), 10);
        idx = ((global.isFinite(idx) && idx) || 0);
        idx = (((idx < 0) && global.Math.max(0, (len + idx))) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf#Parameters]

        while (idx < len) {
          elm = list[idx];
          if (((typeof elm != "undefined") || (idx in list)) && (elm === obj)) {
            isMember = true;
            break;
          }
          ++idx;
        }
      }
      return ((isMember) ? (idx) : (-1));
    });
  })());
  Arr.indexOf = ((isFunction(Arr.indexOf) && Arr.indexOf) || (function () {

    var indexOf = ProtoArr.indexOf;
    return (function (list, fct, target) {

      return indexOf.call(list, fct, target);
    });
  })());


  ProtoArr.lastIndexOf = ((isFunction(ProtoArr.lastIndexOf) && ProtoArr.lastIndexOf) || (function () {

    var isArray = Arr.isArray, makeArray = Arr.make, global = sh;
    return (function (obj, idx) {

      var len, elm, isMember, list = ((isArray(this) && this) || makeArray(this));
      if (list) {
        len = list.length;

        idx = global.parseInt(global.Number(idx), 10);
        idx = ((global.isFinite(idx) && idx) || len);
        idx = (((idx < 0) && global.Math.max(0, (len + idx))) || idx);
        idx = (((idx >= len) && (len - 1)) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf#Parameters]

        while (idx > -1) {
          elm = list[idx];
          if (((typeof elm != "undefined") || (idx in list)) && (elm === obj)) {
            isMember = true;
            break;
          }
          --idx;
        }
      }
      return ((isMember) ? (idx) : (-1));
    });
  })());
  Arr.lastIndexOf = ((isFunction(Arr.lastIndexOf) && Arr.lastIndexOf) || (function () {

    var lastIndexOf = ProtoArr.lastIndexOf;
    return (function (list, fct, target) {

      return lastIndexOf.call(list, fct, target);
    });
  })());


//clean up after
  sh = null; Arr = null; ProtoArr = null; ProtoObj = null; exposeImplementation = null; isFunction = null;
  delete sh; delete Arr; delete ProtoArr; delete ProtoObj; delete exposeImplementation; delete isFunction;

})();/*


  ANNOTATIONS:

  - so far there seems to be at least one bug within chromes/V8's [reduce]/[reduceRight]
    methods regarding theirs second [initialValue] argument if it was/gets not passed.

  - there might be a bug as well within mozillas/chromes/operas JavaScript engines
    regarding theirs [every] method if it comes to run at completely empty arrays
    e.g. of that kind: [] or [,,,,,,,,,,,].
    any given filter function never will be used internally by [every]s process steps
    either due to such an arrays length of zero or due to such an arrays unassigned
    values.

    each of the statements beneath in my opinion should not return [true]
    but [false] instead ...

    [].every(function (elm) {return (elm === "a");});      // true
    [,,,,,].every(function (elm) {return (elm === "a");}); // true

    ... all the more for [some] on the other hand returns [false]
    for one and the same set-up ...

    [].some(function (elm) {return (elm === "a");});      // false
    [,,,,,].some(function (elm) {return (elm === "a");}); // false


    if a condition applied as logical AND ([every]) onto a list returns
    [true], the same condition applied as logical OR ([some]) onto the
    same list coercively is expected to return [true].

    the result of the above test is contradictory to logic.
*/




/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - ?.??? byte

- Simple          - 5.954 byte
(function(){var n=this&&this.window===this&&window||this,f=n.Array,j=f.prototype,t=n.Object.prototype,r=t.toString,k=typeof n.isFunction=="function"&&n.isFunction||function(h){return typeof h=="function"};f.isArray=n.isArray=k(f.isArray)&&f.isArray||k(n.isArray)&&n.isArray||function(){var h=/^\[object\s+Array\]$/,g=r;return function(d){return h.test(g.call(d))}}();f.isArgumentsArray=k(f.isArgumentsArray)&&f.isArgumentsArray||function(){var h,g=/^\[object\s+Object\]$/,d=r,a=t.propertyIsEnumerable;try{a.call(n,"length");h=function(c){return g.test(d.call(c))&&!!c&&typeof c.length=="number"&&!a.call(c,"length")}}catch(b){h=function(c){return g.test(d.call(c))&&!!c&&typeof c.length=="number"&&!function(e){var i;try{i=a.call(e,"length")}catch(m){i=true}return i}(c)}}return h}();f.make=function(){var h,g,d,a=n.document,b=n,c=a&&k(a.getElementsByTagName)&&a.getElementsByTagName("*")||[],e=j.slice,i=f.isArgumentsArray,m=f.isArray,q=k(n.isString)&&n.isString||function(){var l=/^\[object\s+String\]$/,p=r;return function(o){return l.test(p.call(o))}}();try{g=e.call(c);g=e.call(arguments);d=g.join("");if(g.length!=3||d!="Array.make")throw new Error;g=e.call(d);if(g.length!==10||g[5]!==".")throw new Error;h=function(l){var p=(l||q(l))&&l.length;return typeof p=="number"&&b.isFinite(p)&&e.call(l)||void 0};m=i=null;delete i;delete m}catch(u){h=function(l){var p,o,s=i(l)&&e.call(l)||q(l)&&l.split("")||m(l)&&e.call(l)||p;if(!s){o=l!==0&&l&&l.length;if(typeof o=="number"&&b.isFinite(o)){s=new b.Array(b.Math.max(0,o));if(typeof l.item=="function")for(;--o>=0;){p=l.item(o);if(typeof p!="undefined"||o in l)s[o]=p}else for(;--o>=0;){p=l[o];if(typeof p!="undefined"||o in l)s[o]=p}}}return s}}c=a=d=g=null;delete g;delete d;delete a;delete c;return h}("Array",".","make");j.forEach=k(j.forEach)&&j.forEach||function(){var h=f.isArray,g=f.make;return function(d,a){var b=h(this)&&this||g(this);if(b&&typeof d=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var c,e=-1,i=b.length;++e<i;){c=b[e];if(typeof c!="undefined"||e in b)d.call(a,c,e,b)}}}}();f.forEach=k(f.forEach)&&f.forEach||function(){var h=j.forEach;return function(g,d,a){h.call(g,d,a)}}();j.every=k(j.every)&&j.every||function(){var h=f.isArray,g=f.make;return function(d,a){var b,c=h(this)&&this||g(this);if(c&&typeof d=="function"){var e,i=-1,m=c.length,q=false;if(m>=1){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(b=true;b&&++i<m;){e=c[i];if(typeof e!="undefined"||i in c){q=true;b=d.call(a,e,i,c)}}b=q&&b}}return!!b}}();f.every=k(f.every)&&f.every||function(){var h=j.every;return function(g,d,a){return h.call(g,d,a)}}();j.some=k(j.some)&&j.some||function(){var h=f.isArray,g=f.make;return function(d,a){var b,c=h(this)&&this||g(this);if(c&&typeof d=="function"){var e,i=-1,m=c.length,q=false;if(m>=1){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(b=false;!b&&++i<m;){e=c[i];if(typeof e!="undefined"||i in c){q=true;b=d.call(a,e,i,c)}}b=q&&b}}return!!b}}();f.some=k(f.some)&&f.some||function(){var h=j.some;return function(g,d,a){return h.call(g,d,a)}}();j.map=k(j.map)&&j.map||function(){var h=f.isArray,g=f.make;return function(d,a){var b=[],c=h(this)&&this||g(this);if(c&&typeof d=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var e,i=-1,m=c.length;++i<m;){e=c[i];b[i]=typeof e!="undefined"||i in c?d.call(a,e,i,c):e}}return b}}();f.map=k(f.map)&&f.map||function(){var h=j.map;return function(g,d,a){return h.call(g,d,a)}}();j.filter=k(j.filter)&&j.filter||function(){var h=f.isArray,g=f.make;return function(d,a){var b=[],c=h(this)&&this||g(this);if(c&&typeof d=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var e,i=-1,m=c.length;++i<m;){e=c[i];if(typeof e!="undefined"||i in c)d.call(a,e,i,c)&&b.push(e)}}return b}}();f.filter=k(f.filter)&&f.filter||function(){var h=j.filter;return function(g,d,a){return h.call(g,d,a)}}();j.reduce=k(j.reduce)&&j.reduce||function(){var h=f.isArray,g=f.make;return function(d,a){var b=h(this)&&this||g(this);if(b&&typeof d=="function"){var c,e=0,i=b.length;c=typeof a!="undefined";if(i!==0||c){if(!c){do{c=b[e];if(typeof c!="undefined"||e in b){a=c;++e;break}if(++e>=i)break}while(1)}for(;e<i;){c=b[e];if(typeof c!="undefined"||e in b)a=d.call(null,a,c,e,b);++e}}else a=void 0}else a=void 0;return a}}();f.reduce=k(f.reduce)&&f.reduce||function(){var h=j.reduce;return function(g,d,a){return h.call(g,d,a)}}();j.reduceRight=k(j.reduceRight)&&j.reduceRight||function(){var h=f.isArray,g=f.make;return function(d,a){var b=h(this)&&this||g(this);if(b&&typeof d=="function"){var c;c=b.length;var e=c-1,i=typeof a!="undefined";if(c!==0||i){if(!i){do{c=b[e];if(typeof c!="undefined"||e in b){a=c;--e;break}if(--e<0)break}while(1)}for(;e>=0;){c=b[e];if(typeof c!="undefined"||e in b)a=d.call(null,a,c,e,b);--e}}else a=void 0}else a=void 0;return a}}();f.reduceRight=k(f.reduceRight)&&f.reduceRight||function(){var h=j.reduceRight;return function(g,d,a){return h.call(g,d,a)}}();j.indexOf=k(j.indexOf)&&j.indexOf||function(){var h=f.isArray,g=f.make,d=n;return function(a,b){var c,e,i,m=h(this)&&this||g(this);if(m){c=m.length;b=d.parseInt(d.Number(b),10);b=d.isFinite(b)&&b||0;for(b=b<0&&d.Math.max(0,c+b)||b;b<c;){e=m[b];if((typeof e!="undefined"||b in m)&&e===a){i=true;break}++b}}return i?b:-1}}();f.indexOf=k(f.indexOf)&&f.indexOf||function(){var h=j.indexOf;return function(g,d,a){return h.call(g,d,a)}}();j.lastIndexOf=k(j.lastIndexOf)&&j.lastIndexOf||function(){var h=f.isArray,g=f.make,d=n;return function(a,b){var c,e,i=h(this)&&this||g(this);if(i){c=i.length;b=d.parseInt(d.Number(b),10);b=d.isFinite(b)&&b||c;b=b<0&&d.Math.max(0,c+b)||b;for(b=b>=c&&c-1||b;b>-1;){c=i[b];if((typeof c!="undefined"||b in i)&&c===a){e=true;break}--b}}return e?b:-1}}();f.lastIndexOf=k(f.lastIndexOf)&&f.lastIndexOf||function(){var h=j.lastIndexOf;return function(g,d,a){return h.call(g,d,a)}}();k=r=t=j=f=n=null;delete n;delete f;delete j;delete t;delete r;delete k})();

*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - ?.??? byte

- packed / shrinked           - ?.??? byte

- packed / shrinked / encoded - 5.014 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(){7 f=((j&&(j.1j===j)&&1j)||j),4=f.X,8=4.1i,Y=f.1p.1i,U=Y.1t,m=(((9 f.m=="2")&&f.m)||(2(a){6(9 a=="2")}));4.p=f.p=((m(4.p)&&4.p)||(m(f.p)&&f.p)||(2(){7 b=(/^\\[1c\\s+X\\]$/),G=U;6(2(a){6 b.16(G.k(a))})})());4.14=((m(4.14)&&4.14)||(2(){7 d,1f=(/^\\[1c\\s+1p\\]$/),G=U,15=Y.1u;19{15.k(f,"t");d=(2(a){6(1f.16(G.k(a))&&!!a&&(9 a.t=="13")&&!15.k(a,"t"))})}1d(1e){d=(2(c){6(1f.16(G.k(c))&&!!c&&(9 c.t=="13")&&!(2(a){7 b;19{b=15.k(a,"t")}1d(1e){b=C}6 b})(c))})}6 d})());4.y=(2(){7 c,l,O,V=f.1s,u=f,11=((V&&m(V.1h)&&V.1h("*"))||[]),B=8.B,12=4.14,p=4.p,Z=((m(f.Z)&&f.Z)||(2(){7 b=(/^\\[1c\\s+1v\\]$/),G=U;6(2(a){6 b.16(G.k(a))})})());19{l=B.k(11);l=B.k(1r);O=l.1w("");h((l.t!=3)||(O!="X.y")){1k(18 1n);}l=B.k(O);h((l.t!==10)||(l[5]!==".")){1k(18 1n);}c=(2(a){7 b,n=((a||Z(a))&&a.t);6(((9 n=="13")&&u.N(n)&&B.k(a))||b)});12=q;p=q;z 12;z p}1d(1e){c=(2(a){7 b,w,l=((12(a)&&B.k(a))||(Z(a)&&a.1q(""))||(p(a)&&B.k(a))||b);h(!l){w=((a!==0)&&a&&a.t);h((9 w=="13")&&u.N(w)){l=18 u.X(u.17.1b(0,w));h(9 a.1g=="2"){v(--w>=0){b=a.1g(w);h((9 b!="o")||(w x a)){l[w]=b}}}P{v(--w>=0){b=a[w];h((9 b!="o")||(w x a)){l[w]=b}}}}}6 l})}l=q;O=q;V=q;11=q;z l;z O;z V;z 11;6 c})("X",".","y");8.J=((m(8.J)&&8.J)||(2(){7 e=4.p,r=4.y,N=f.N;6(2(a,b){7 c=((e(j)&&j)||r(j));h(c&&(9 a=="2")){b=(((9 b=="o")||((9 b=="W")&&!b))?(q):(b));7 d,i=-1,n=c.t;v(++i<n){d=c[i];h((9 d!="o")||(i x c)){a.k(b,d,i,c)}}}})})());4.J=((m(4.J)&&4.J)||(2(){7 d=8.J;6(2(a,b,c){d.k(a,b,c)})})());8.H=((m(8.H)&&8.H)||(2(){7 e=4.p,r=4.y;6(2(a,b){7 c,l=((e(j)&&j)||r(j));h(l&&(9 a=="2")){7 d,i=-1,n=l.t,T=1a;h(n>=1){b=(((9 b=="o")||((9 b=="W")&&!b))?(q):(b));c=C;v(c&&(++i<n)){d=l[i];h((9 d!="o")||(i x l)){T=C;c=a.k(b,d,i,l)}}c=(T&&c)}}6!!c})})());4.H=((m(4.H)&&4.H)||(2(){7 d=8.H;6(2(a,b,c){6 d.k(a,b,c)})})());8.K=((m(8.K)&&8.K)||(2(){7 e=4.p,r=4.y;6(2(a,b){7 c,l=((e(j)&&j)||r(j));h(l&&(9 a=="2")){7 d,i=-1,n=l.t,T=1a;h(n>=1){b=(((9 b=="o")||((9 b=="W")&&!b))?(q):(b));c=1a;v(!c&&(++i<n)){d=l[i];h((9 d!="o")||(i x l)){T=C;c=a.k(b,d,i,l)}}c=(T&&c)}}6!!c})})());4.K=((m(4.K)&&4.K)||(2(){7 d=8.K;6(2(a,b,c){6 d.k(a,b,c)})})());8.E=((m(8.E)&&8.E)||(2(){7 e=4.p,r=4.y;6(2(a,b){7 c=[],g=((e(j)&&j)||r(j));h(g&&(9 a=="2")){b=(((9 b=="o")||((9 b=="W")&&!b))?(q):(b));7 d,i=-1,n=g.t;v(++i<n){d=g[i];h((9 d!="o")||(i x g)){c[i]=a.k(b,d,i,g)}P{c[i]=d}}}6 c})})());4.E=((m(4.E)&&4.E)||(2(){7 d=8.E;6(2(a,b,c){6 d.k(a,b,c)})})());8.L=((m(8.L)&&8.L)||(2(){7 e=4.p,r=4.y;6(2(a,b){7 c=[],g=((e(j)&&j)||r(j));h(g&&(9 a=="2")){b=(((9 b=="o")||((9 b=="W")&&!b))?(q):(b));7 d,i=-1,n=g.t;v(++i<n){d=g[i];h((9 d!="o")||(i x g)){h(a.k(b,d,i,g)){c.1x(d)}}}}6 c})})());4.L=((m(4.L)&&4.L)||(2(){7 d=8.L;6(2(a,b,c){6 d.k(a,b,c)})})());8.M=((m(8.M)&&8.M)||(2(){7 e=4.p,r=4.y;6(2(a,b){7 c,g=((e(j)&&j)||r(j));h(g&&(9 a=="2")){7 d,i=0,n=g.t,S=(9 b!="o");h((n!==0)||S){h(!S){1m{d=g[i];h((9 d!="o")||(i x g)){b=d;++i;Q}h(++i>=n){Q}}v(C)}v(i<n){d=g[i];h((9 d!="o")||(i x g)){b=a.k(q,b,d,i,g)}++i}}P{b=c}}P{b=c}6 b})})());4.M=((m(4.M)&&4.M)||(2(){7 d=8.M;6(2(a,b,c){6 d.k(a,b,c)})})());8.F=((m(8.F)&&8.F)||(2(){7 e=4.p,r=4.y;6(2(a,b){7 c,g=((e(j)&&j)||r(j));h(g&&(9 a=="2")){7 d,n=g.t,i=(n-1),S=(9 b!="o");h((n!==0)||S){h(!S){1m{d=g[i];h((9 d!="o")||(i x g)){b=d;--i;Q}h(--i<0){Q}}v(C)}v(i>=0){d=g[i];h((9 d!="o")||(i x g)){b=a.k(q,b,d,i,g)}--i}}P{b=c}}P{b=c}6 b})})());4.F=((m(4.F)&&4.F)||(2(){7 d=8.F;6(2(a,b,c){6 d.k(a,b,c)})})());8.D=((m(8.D)&&8.D)||(2(){7 d=4.p,r=4.y,u=f;6(2(a,b){7 c,A,R,g=((d(j)&&j)||r(j));h(g){c=g.t;b=u.1l(u.1o(b),10);b=((u.N(b)&&b)||0);b=(((b<0)&&u.17.1b(0,(c+b)))||b);v(b<c){A=g[b];h(((9 A!="o")||(b x g))&&(A===a)){R=C;Q}++b}}6((R)?(b):(-1))})})());4.D=((m(4.D)&&4.D)||(2(){7 d=8.D;6(2(a,b,c){6 d.k(a,b,c)})})());8.I=((m(8.I)&&8.I)||(2(){7 d=4.p,r=4.y,u=f;6(2(a,b){7 c,A,R,g=((d(j)&&j)||r(j));h(g){c=g.t;b=u.1l(u.1o(b),10);b=((u.N(b)&&b)||c);b=(((b<0)&&u.17.1b(0,(c+b)))||b);b=(((b>=c)&&(c-1))||b);v(b>-1){A=g[b];h(((9 A!="o")||(b x g))&&(A===a)){R=C;Q}--b}}6((R)?(b):(-1))})})());4.I=((m(4.I)&&4.I)||(2(){7 d=8.I;6(2(a,b,c){6 d.k(a,b,c)})})());f=q;4=q;8=q;Y=q;U=q;m=q;z f;z 4;z 8;z Y;z U;z m})();',62,96,'||function||Arr||return|var|ProtoArr|typeof|||||||list|if||this|call|arr|isFunction|len|undefined|isArray|null|makeArray||length|global|while|idx|in|make|delete|elm|slice|true|indexOf|map|reduceRight|expose|every|lastIndexOf|forEach|some|filter|reduce|isFinite|str|else|break|isMember|isInitalValue|hasSome|exposeImplementation|doc|obj|Array|ProtoObj|isString||all|isArguments|number|isArgumentsArray|isEnumerable|test|Math|new|try|false|max|object|catch|exc|regXBaseClass|item|getElementsByTagName|prototype|window|throw|parseInt|do|Error|Number|Object|split|arguments|document|toString|propertyIsEnumerable|String|join|push'.split('|'),0,{}));

*/
