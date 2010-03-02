

//module base [Array.make.detect]
(function(){var b=this&&this.window===this&&window||this,f=b.Array,s=f.prototype,q=b.Object.prototype,n=q.toString,l=typeof b.isFunction=="function"&&b.isFunction||function(h){return typeof h=="function"};f.isArray=b.isArray=l(f.isArray)&&f.isArray||l(b.isArray)&&b.isArray||function(){var h=/^\[object\s+Array\]$/,c=n;return function(i){return h.test(c.call(i))}}();f.isArgumentsArray=l(f.isArgumentsArray)&&f.isArgumentsArray||function(){var h,c=/^\[object\s+Object\]$/,i=n,j=q.propertyIsEnumerable;try{j.call(b,"length");h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!j.call(e,"length")}}catch(o){h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!function(k){var m;try{m=j.call(k,"length")}catch(r){m=true}return m}(e)}}return h}();f.make=function(){var h,c,i,j=b.document,o=b,e=j&&l(j.getElementsByTagName)&&j.getElementsByTagName("*")||[],k=s.slice,m=f.isArgumentsArray,r=f.isArray,t=l(b.isString)&&b.isString||function(){var a=/^\[object\s+String\]$/,g=n;return function(d){return a.test(g.call(d))}}();try{c=k.call(e);c=k.call(arguments);i=c.join("");if(c.length!=3||i!="Array.make")throw new Error;c=k.call(i);if(c.length!==10||c[5]!==".")throw new Error;h=function(a){var g=(a||t(a))&&a.length;return typeof g=="number"&&o.isFinite(g)&&k.call(a)||void 0};r=m=null;delete m;delete r}catch(u){h=function(a){var g,d,p=m(a)&&k.call(a)||t(a)&&a.split("")||r(a)&&k.call(a)||g;if(!p){d=a!==0&&a&&a.length;if(typeof d=="number"&&o.isFinite(d)){p=new o.Array(o.Math.max(0,d));if(typeof a.item=="function")for(;--d>=0;){g=a.item(d);if(typeof g!="undefined"||d in a)p[d]=g}else for(;--d>=0;){g=a[d];if(typeof g!="undefined"||d in a)p[d]=g}}}return p}}e=j=i=c=null;delete c;delete i;delete j;delete e;return h}("Array",".","make");l=n=q=s=f=b=null;delete b;delete f;delete s;delete q;delete n;delete l})();


(function () {


  var sh/*global*/ = ((this && (this.window === this) && /*this.*/window) || this), // "scripting host" or "global object"

//Arr = sh.Array/*, Obj = sh.Object*/, ProtoArr = Arr.prototype, ProtoObj = sh.Object.prototype, exposeImplementation = ProtoObj.toString;
  Arr = sh.Array, ProtoArr = Arr.prototype,

  isFunction = (((typeof sh.isFunction == "function") && sh.isFunction) || (function (obj) {return (typeof obj == "function");}));

  if (!Arr || !isFunction(Arr.isArray) || !isFunction(Arr.make)) {
    throw (new ReferenceError("All [[Array]] implementations badly require the presence of the [[Array]] extensions module base [Array.make.detect]."));
  }


  ProtoArr.forEach = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
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
  })();
  Arr.forEach = (function () {

    var forEach = ProtoArr.forEach;
    return (function (list, fct, target) {

      forEach.call(list, fct, target);
    });
  })();


  ProtoArr.every = (function () { // [http://apidock.com/ruby/Enumerable/all%3F]

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
  })();
  Arr.every = (function () {

    var every = ProtoArr.every;
    return (function (list, fct, target) {

      return every.call(list, fct, target);
    });
  })();
//Array.every("aaaaaaaaaaa", (function (elm) {return (elm === "a");}));


  ProtoArr.some = (function () { // [http://apidock.com/ruby/Enumerable/any%3F]

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, target) {

      var isOr, arr = ((isArray(this) && this) || makeArray(this));
      if (arr && (typeof fct == "function")) { // fail silently

        var elm, i = -1, len = arr.length, hasSome = false; // [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were unassigned/[undefined] values.
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
  })();
  Arr.some = (function () {

    var some = ProtoArr.some;
    return (function (list, fct, target) {

      return some.call(list, fct, target);
    });
  })();
//Array.some("bbbbbbbbbba", (function (elm) {return (elm === "a");}));


  ProtoArr.map = (function () { // [http://apidock.com/ruby/Enumerable/map] - [http://apidock.com/ruby/Enumerable/collect]

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
  })();
  Arr.map = (function () {

    var map = ProtoArr.map;
    return (function (list, fct, target) {

      return map.call(list, fct, target);
    });
  })();


  ProtoArr.filter = (function () { // [http://apidock.com/ruby/Enumerable/select] - [http://apidock.com/ruby/Enumerable/find_all] - [http://apidock.com/ruby/Enumerable/find]

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
  })();
  Arr.filter = (function () {

    var filter = ProtoArr.filter;
    return (function (list, fct, target) {

      return filter.call(list, fct, target);
    });
  })();


  ProtoArr.reduce = (function () { // [http://apidock.com/ruby/Enumerable/reduce]

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
            //val = fct.call(null, val, elm, i, list);
              val = fct(val, elm, i, list);
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
  })();/*
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduce(function (a,b) {return (a + "-" +b);});
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduce(function (a,b) {return (a + "-" +b);}, "der foenig:");
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduce(function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));});

  Array.prototype.reduce.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}));
  Array.prototype.reduce.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}), "der foenig:");
  Array.prototype.reduce.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));}));
*/
  Arr.reduce = (function () {

    var reduce = ProtoArr.reduce;
    return (function (list, fct, target) {

      return reduce.call(list, fct, target);
    });
  })();/*
  Array.reduce("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}));
  Array.reduce("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}), "der foenig:");
  Array.reduce("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));}));
*/


  ProtoArr.reduceRight = (function () {

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
            //val = fct.call(null, val, elm, i, list);
              val = fct(val, elm, i, list);
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
  })();/*
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduceRight(function (a,b) {return (a + "-" +b);});
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduceRight((function (a,b) {return (a + "-" +b);}), "der foenig:");
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduceRight(function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));});

  Array.prototype.reduceRight.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}));
  Array.prototype.reduceRight.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}), "der foenig:");
  Array.prototype.reduceRight.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));}));
*/
  Arr.reduceRight = (function () {

    var reduceRight = ProtoArr.reduceRight;
    return (function (list, fct, target) {

      return reduceRight.call(list, fct, target);
    });
  })();/*
  Array.reduceRight("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}));
  Array.reduceRight("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}), "der foenig:");
  Array.reduceRight("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));}));
*/


  ProtoArr.indexOf = (function () { // [http://apidock.com/ruby/Array/index]

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
  })();/*
  ("hallo").split("").indexOf(); // -1
  ("hallo").split("").indexOf("e"); // -1
  ("hallo").split("").indexOf("l"); // 2
  ("hallo").split("").indexOf("l", 2); // 2
  ("hallo").split("").indexOf("l", 3); // 3
  ("hallo").split("").indexOf("l", 4); // -1
  ("hallo").split("").indexOf("h"); // 0
  ("hallo").split("").indexOf("l", -4); // 2
  ("hallo").split("").indexOf("l", -3); // 2
  ("hallo").split("").indexOf("l", -2); // 3
  ("hallo").split("").indexOf("l", 7); // -1

  Array.prototype.indexOf.call("hallo"); // -1
  Array.prototype.indexOf.call("hallo", "e"); // -1
  Array.prototype.indexOf.call("hallo", "l"); // 2
  Array.prototype.indexOf.call("hallo", "l", 2); // 2
  Array.prototype.indexOf.call("hallo", "l", 3); // 3
  Array.prototype.indexOf.call("hallo", "l", 4); // -1
  Array.prototype.indexOf.call("hallo", "h"); // 0
  Array.prototype.indexOf.call("hallo", "l", -4); // 2
  Array.prototype.indexOf.call("hallo", "l", -3); // 2
  Array.prototype.indexOf.call("hallo", "l", -2); // 3
  Array.prototype.indexOf.call("hallo", "l", 7); // -1
*/
  Arr.indexOf = (function () {

    var indexOf = ProtoArr.indexOf;
    return (function (list, fct, target) {

      return indexOf.call(list, fct, target);
    });
  })();/*
  Array.indexOf("hallo"); // -1
  Array.indexOf("hallo", "e"); // -1
  Array.indexOf("hallo", "l"); // 2
  Array.indexOf("hallo", "l", 2); // 2
  Array.indexOf("hallo", "l", 3); // 3
  Array.indexOf("hallo", "l", 4); // -1
  Array.indexOf("hallo", "h"); // 0
  Array.indexOf("hallo", "l", -4); // 2
  Array.indexOf("hallo", "l", -3); // 2
  Array.indexOf("hallo", "l", -2); // 3
  Array.indexOf("hallo", "l", 7); // -1
*/


  ProtoArr.lastIndexOf = (function () { // [http://apidock.com/ruby/Array/rindex]

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
  })();/*
  [2,3,,4,5,6].lastIndexOf(-4); // -1
  [2,3,,4,5,6].lastIndexOf(undefined, -4); // -1

  Array.prototype.lastIndexOf.apply([2,3,,4,5,6], [, -4]); // -1
  Array.prototype.lastIndexOf.apply([2,3,,4,5,6], [, -5]); // -1

  Array.prototype.lastIndexOf.apply([2,3,,4,5,6], [3, -5]); // 1
  Array.prototype.lastIndexOf.apply([2,3,,4,5,6], [4, -4]); // -1
  Array.prototype.lastIndexOf.apply([2,3,,4,5,6], [4, -3]); // 3
*/
  Arr.lastIndexOf = (function () {

    var lastIndexOf = ProtoArr.lastIndexOf;
    return (function (list, fct, target) {

      return lastIndexOf.call(list, fct, target);
    });
  })();/*
  Array.lastIndexOf("hallo"); // -1
  Array.lastIndexOf("hallo", "e"); // -1
  Array.lastIndexOf("hallo", "l"); // 3
  Array.lastIndexOf("hallo", "l"); // 3
  Array.lastIndexOf("hallo", "l", 2); // 2
  Array.lastIndexOf("hallo", "l", 1); // -1
  Array.lastIndexOf("hallo", "l", 4); // 3
  Array.lastIndexOf("hallo", "h"); // 0
  Array.lastIndexOf("hallo", "o"); // 4
  Array.lastIndexOf("hallo", "l", 7); // 3
  Array.lastIndexOf("hallo", "l", -2); // 3
  Array.lastIndexOf("hallo", "l", -3); // 2
  Array.lastIndexOf("hallo", "l", -4); // -1
*/


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

*/ /*

//module base [Array.make.detect]   - 1.852 byte
(function(){var b=this&&this.window===this&&window||this,f=b.Array,s=f.prototype,q=b.Object.prototype,n=q.toString,l=typeof b.isFunction=="function"&&b.isFunction||function(h){return typeof h=="function"};f.isArray=b.isArray=l(f.isArray)&&f.isArray||l(b.isArray)&&b.isArray||function(){var h=/^\[object\s+Array\]$/,c=n;return function(i){return h.test(c.call(i))}}();f.isArgumentsArray=l(f.isArgumentsArray)&&f.isArgumentsArray||function(){var h,c=/^\[object\s+Object\]$/,i=n,j=q.propertyIsEnumerable;try{j.call(b,"length");h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!j.call(e,"length")}}catch(o){h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!function(k){var m;try{m=j.call(k,"length")}catch(r){m=true}return m}(e)}}return h}();f.make=function(){var h,c,i,j=b.document,o=b,e=j&&l(j.getElementsByTagName)&&j.getElementsByTagName("*")||[],k=s.slice,m=f.isArgumentsArray,r=f.isArray,t=l(b.isString)&&b.isString||function(){var a=/^\[object\s+String\]$/,g=n;return function(d){return a.test(g.call(d))}}();try{c=k.call(e);c=k.call(arguments);i=c.join("");if(c.length!=3||i!="Array.make")throw new Error;c=k.call(i);if(c.length!==10||c[5]!==".")throw new Error;h=function(a){var g=(a||t(a))&&a.length;return typeof g=="number"&&o.isFinite(g)&&k.call(a)||void 0};r=m=null;delete m;delete r}catch(u){h=function(a){var g,d,p=m(a)&&k.call(a)||t(a)&&a.split("")||r(a)&&k.call(a)||g;if(!p){d=a!==0&&a&&a.length;if(typeof d=="number"&&o.isFinite(d)){p=new o.Array(o.Math.max(0,d));if(typeof a.item=="function")for(;--d>=0;){g=a.item(d);if(typeof g!="undefined"||d in a)p[d]=g}else for(;--d>=0;){g=a[d];if(typeof g!="undefined"||d in a)p[d]=g}}}return p}}e=j=i=c=null;delete c;delete i;delete j;delete e;return h}("Array",".","make");l=n=q=s=f=b=null;delete b;delete f;delete s;delete q;delete n;delete l})();

//module base [Array.ecma5.generic] - 3.990 byte
(function(){var j=this&&this.window===this&&window||this,g=j.Array,k=g.prototype,q=typeof j.isFunction=="function"&&j.isFunction||function(h){return typeof h=="function"};if(!g||!q(g.isArray)||!q(g.make))throw new ReferenceError("All [[Array]] implementations badly require the presence of the [[Array]] extensions module base [Array.make.detect].");k.forEach=function(){var h=g.isArray,i=g.make;return function(e,a){var b=h(this)&&this||i(this);if(b&&typeof e=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var c,d=-1,f=b.length;++d<f;){c=b[d];if(typeof c!="undefined"||d in b)e.call(a,c,d,b)}}}}();g.forEach=function(){var h=k.forEach;return function(i,e,a){h.call(i,e,a)}}();k.every=function(){var h=g.isArray,i=g.make;return function(e,a){var b,c=h(this)&&this||i(this);if(c&&typeof e=="function"){var d,f=-1,m=c.length,o=false;if(m>=1){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(b=true;b&&++f<m;){d=c[f];if(typeof d!="undefined"||f in c){o=true;b=e.call(a,d,f,c)}}b=o&&b}}return!!b}}();g.every=function(){var h=k.every;return function(i,e,a){return h.call(i,e,a)}}();k.some=function(){var h=g.isArray,i=g.make;return function(e,a){var b,c=h(this)&&this||i(this);if(c&&typeof e=="function"){var d,f=-1,m=c.length,o=false;if(m>=1){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(b=false;!b&&++f<m;){d=c[f];if(typeof d!="undefined"||f in c){o=true;b=e.call(a,d,f,c)}}b=o&&b}}return!!b}}();g.some=function(){var h=k.some;return function(i,e,a){return h.call(i,e,a)}}();k.map=function(){var h=g.isArray,i=g.make;return function(e,a){var b=[],c=h(this)&&this||i(this);if(c&&typeof e=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var d,f=-1,m=c.length;++f<m;){d=c[f];b[f]=typeof d!="undefined"||f in c?e.call(a,d,f,c):d}}return b}}();g.map=function(){var h=k.map;return function(i,e,a){return h.call(i,e,a)}}();k.filter=function(){var h=g.isArray,i=g.make;return function(e,a){var b=[],c=h(this)&&this||i(this);if(c&&typeof e=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var d,f=-1,m=c.length;++f<m;){d=c[f];if(typeof d!="undefined"||f in c)e.call(a,d,f,c)&&b.push(d)}}return b}}();g.filter=function(){var h=k.filter;return function(i,e,a){return h.call(i,e,a)}}();k.reduce=function(){var h=g.isArray,i=g.make;return function(e,a){var b=h(this)&&this||i(this);if(b&&typeof e=="function"){var c,d=0,f=b.length;c=typeof a!="undefined";if(f!==0||c){if(!c){do{c=b[d];if(typeof c!="undefined"||d in b){a=c;++d;break}if(++d>=f)break}while(1)}for(;d<f;){c=b[d];if(typeof c!="undefined"||d in b)a=e(a,c,d,b);++d}}else a=void 0}else a=void 0;return a}}();g.reduce=function(){var h=k.reduce;return function(i,e,a){return h.call(i,e,a)}}();k.reduceRight=function(){var h=g.isArray,i=g.make;return function(e,a){var b=h(this)&&this||i(this);if(b&&typeof e=="function"){var c;c=b.length;var d=c-1,f=typeof a!="undefined";if(c!==0||f){if(!f){do{c=b[d];if(typeof c!="undefined"||d in b){a=c;--d;break}if(--d<0)break}while(1)}for(;d>=0;){c=b[d];if(typeof c!="undefined"||d in b)a=e(a,c,d,b);--d}}else a=void 0}else a=void 0;return a}}();g.reduceRight=function(){var h=k.reduceRight;return function(i,e,a){return h.call(i,e,a)}}();k.indexOf=function(){var h=g.isArray,i=g.make;return function(e,a){var b,c,d,f=h(this)&&this||i(this);if(f){b=f.length;a=j.parseInt(j.Number(a),10);a=j.isFinite(a)&&a||0;for(a=a<0&&j.Math.max(0,b+a)||a;a<b;){c=f[a];if((typeof c!="undefined"||a in f)&&c===e){d=true;break}++a}}return d?a:-1}}();g.indexOf=function(){var h=k.indexOf;return function(i,e,a){return h.call(i,e,a)}}();k.lastIndexOf=function(){var h=g.isArray,i=g.make;return function(e,a){var b,c,d=h(this)&&this||i(this);if(d){b=d.length;a=j.parseInt(j.Number(a),10);a=j.isFinite(a)&&a||b;a=a<0&&j.Math.max(0,b+a)||a;for(a=a>=b&&b-1||a;a>-1;){b=d[a];if((typeof b!="undefined"||a in d)&&b===e){c=true;break}--a}}return c?a:-1}}();g.lastIndexOf=function(){var h=k.lastIndexOf;return function(i,e,a){return h.call(i,e,a)}}()})();

*/
