

//module base [Array.make.detect]
(function(){var b=this&&this.window===this&&window||this,f=b.Array,s=f.prototype,q=b.Object.prototype,n=q.toString,l=typeof b.isFunction=="function"&&b.isFunction||function(h){return typeof h=="function"};f.isArray=b.isArray=l(f.isArray)&&f.isArray||l(b.isArray)&&b.isArray||function(){var h=/^\[object\s+Array\]$/,c=n;return function(i){return h.test(c.call(i))}}();f.isArgumentsArray=l(f.isArgumentsArray)&&f.isArgumentsArray||function(){var h,c=/^\[object\s+Object\]$/,i=n,j=q.propertyIsEnumerable;try{j.call(b,"length");h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!j.call(e,"length")}}catch(o){h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!function(k){var m;try{m=j.call(k,"length")}catch(r){m=true}return m}(e)}}return h}();f.make=function(){var h,c,i,j=b.document,o=b,e=j&&l(j.getElementsByTagName)&&j.getElementsByTagName("*")||[],k=s.slice,m=f.isArgumentsArray,r=f.isArray,t=l(b.isString)&&b.isString||function(){var a=/^\[object\s+String\]$/,g=n;return function(d){return a.test(g.call(d))}}();try{c=k.call(e);c=k.call(arguments);i=c.join("");if(c.length!=3||i!="Array.make")throw new Error;c=k.call(i);if(c.length!==10||c[5]!==".")throw new Error;h=function(a){var g=(a||t(a))&&a.length;return typeof g=="number"&&o.isFinite(g)&&k.call(a)||void 0};r=m=null;delete m;delete r}catch(u){h=function(a){var g,d,p=m(a)&&k.call(a)||t(a)&&a.split("")||r(a)&&k.call(a)||g;if(!p){d=a!==0&&a&&a.length;if(typeof d=="number"&&o.isFinite(d)){p=new o.Array(o.Math.max(0,d));if(typeof a.item=="function")for(;--d>=0;){g=a.item(d);if(typeof g!="undefined"||d in a)p[d]=g}else for(;--d>=0;){g=a[d];if(typeof g!="undefined"||d in a)p[d]=g}}}return p}}e=j=i=c=null;delete c;delete i;delete j;delete e;return h}("Array",".","make");l=n=q=s=f=b=null;delete b;delete f;delete s;delete q;delete n;delete l})();


(function () {


  var sh/*global*/ = ((this && (this.window === this) && /*this.*/window) || this), // "scripting host" or "global object"

//Arr = sh.Array/*, Obj = sh.Object*/, ProtoArr = Arr.prototype, ProtoObj = sh.Object.prototype, exposeImplementation = ProtoObj.toString;
  Arr = sh.Array, ProtoArr = Arr.prototype,

  isFunction = (((typeof sh.isFunction == "function") && sh.isFunction) || (function (obj) {return (typeof obj == "function");})),

  throwListDelegationTypeError = (function () {throw (new TypeError("objects delegated via apply/call need to be some kind of list."));}),
  throwListTypeError = (function () {throw (new TypeError("1st argument needs to be some kind of list."));}),

  throwFirstArgumentFunctionTypeError = (function () {throw (new TypeError("1st argument needs to be a function type."));}),
  throwSecondArgumentFunctionTypeError = (function () {throw (new TypeError("2nd argument needs to be a function type."));});

  if (!Arr || !isFunction(Arr.isArray) || !isFunction(Arr.make)) {
    throw (new ReferenceError("All [[Array]] implementations badly require the presence of the [[Array]] extensions module base [Array.make.detect]."));
  }


  ProtoArr.isEmpty = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function () {

      var len, elm, isEmpty = true, i = -1, list = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var len, elm, isEmpty = true, i = -1, list = ((isArray(this) && this) || makeArray(this) || []); // fail silently

      len = list.length;
      while (++i < len) {
        elm = list[i];
        if (elm || (typeof elm != "undefined") || (i in list)) {
          isEmpty = false;
          break;
        }
      }
      return isEmpty;
    });
  })();
  Arr.isEmpty = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (list) {

      var len, elm, isEmpty = true, i = -1; list = ((isArray(list) && list) || makeArray(list) || throwListTypeError());
    //var len, elm, isEmpty = true, i = -1; list = ((isArray(list) && list) || makeArray(list) || []); // fail silently

      len = list.length;
      while (++i < len) {
        elm = list[i];
        if (elm || (typeof elm != "undefined") || (i in list)) {
          isEmpty = false;
          break;
        }
      }
      return isEmpty;
    });
  })();


  ProtoArr.contains/* = ProtoArr.exists*/ = (function () { // [http://apidock.com/ruby/Array/include%3F] - [include?] as in Ruby or [exists] as in [Joose.A.exists]

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (obj) {

      var len, elm, isMember, i = -1, list = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var len, elm, isMember, i = -1, list = ((isArray(this) && this) || makeArray(this) || []); // fail silently

      len = list.length;
      while (++i < len) {
        elm = list[i];
        if (((typeof elm != "undefined") || (i in list)) && (elm === obj)) {
          isMember = true;
          break;
        }
      }
      return !!isMember; // prevents return of the initial [undefined] value for [isMember].
    });
  })();
  Arr.contains/* = Arr.exists*/ = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (list, obj) {

      var len, elm, isMember, i = -1; list = ((isArray(list) && list) || makeArray(list) || throwListTypeError());
    //var len, elm, isMember, i = -1; list = ((isArray(list) && list) || makeArray(list) || []); // fail silently

      len = list.length;
      while (++i < len) {
        elm = list[i];
        if (((typeof elm != "undefined") || (i in list)) && (elm === obj)) {
          isMember = true;
          break;
        }
      }
      return !!isMember; // prevents return of the initial [undefined] value for [isMember].
    });
  })();/*
          [containsFilter] already gets covered by [some]

  ProtoArr.containsFilter = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct) {

      var len, elm, isMember, i = -1, list = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var len, elm, isMember, i = -1, list = ((isArray(this) && this) || makeArray(this) || []); // fail silently
      if (typeof fct == "function") {

        len = list.length;
        while (++i < len) {
          elm = list[i];
          if (((typeof elm != "undefined") || (i in list)) && fct.call(null, elm, idx, list)) {
            isMember = true;
            break;
          }
        }
      } else {
        throwFirstArgumentFunctionTypeError();
      }
      return !!isMember; // prevents return of the initial [undefined] value for [isMember].
    });
  })();
  Arr.containsFilter = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (list, fct) {

      var len, elm, isMember, i = -1; list = ((isArray(list) && list) || makeArray(list) || throwListTypeError());
    //var len, elm, isMember, i = -1; list = ((isArray(list) && list) || makeArray(list) || []); // fail silently
      if (typeof fct == "function") {

        len = list.length;
        while (++i < len) {
          elm = list[i];
          if (((typeof elm != "undefined") || (i in list)) && (elm === obj)) {
            isMember = true;
            break;
          }
        }
      } else {
        throwSecondArgumentFunctionTypeError();
      }
      return !!isMember; // prevents return of the initial [undefined] value for [isMember].
    });
  })();
*/

  ProtoArr.indexOfFilter = (function () { // [http://apidock.com/ruby/Enumerable/find_index]

    var isArray = Arr.isArray, makeArray = Arr.make, global = sh;
    return (function (fct, idx) {

      var len, elm, isMember, list = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var len, elm, isMember, list = ((isArray(this) && this) || makeArray(this) || []); // fail silently
      if (typeof fct == "function") {

        len = list.length;

        idx = global.parseInt(global.Number(idx), 10);
        idx = ((global.isFinite(idx) && idx) || 0);
        idx = (((idx < 0) && global.Math.max(0, (len + idx))) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf#Parameters]

        while (idx < len) {
          elm = list[idx];
        //if (((typeof elm != "undefined") || (idx in list)) && fct.call(null, elm, idx, list)) {
          if (((typeof elm != "undefined") || (idx in list)) && fct(elm, idx, list)) {
            isMember = true;
            break;
          }
          ++idx;
        }
      } else {
        throwFirstArgumentFunctionTypeError();
      }
      return ((isMember) ? (idx) : (-1));
    });
  })();
  Arr.indexOfFilter = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make, global = sh;
    return (function (list, fct, idx) {

      var len, elm, isMember; list = ((isArray(list) && list) || makeArray(list) || throwListTypeError());
    //var len, elm, isMember; list = ((isArray(list) && list) || makeArray(list) || []); // fail silently
      if (typeof fct == "function") {

        len = list.length;

        idx = global.parseInt(global.Number(idx), 10);
        idx = ((global.isFinite(idx) && idx) || 0);
        idx = (((idx < 0) && global.Math.max(0, (len + idx))) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf#Parameters]

        while (idx < len) {
          elm = list[idx];
        //if (((typeof elm != "undefined") || (idx in list)) && fct.call(null, elm, idx, list)) {
          if (((typeof elm != "undefined") || (idx in list)) && fct(elm, idx, list)) {
            isMember = true;
            break;
          }
          ++idx;
        }
      } else {
        throwSecondArgumentFunctionTypeError();
      }
      return ((isMember) ? (idx) : (-1));
    });
  })();


  ProtoArr.lastIndexOfFilter = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make, global = sh;
    return (function (fct, idx) {

      var len, elm, isMember, list = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var len, elm, isMember, list = ((isArray(this) && this) || makeArray(this) || []); // fail silently
      if (typeof fct == "function") {

        len = list.length;

        idx = global.parseInt(global.Number(idx), 10);
        idx = ((global.isFinite(idx) && idx) || len);
        idx = (((idx < 0) && global.Math.max(0, (len + idx))) || idx);
        idx = (((idx >= len) && (len - 1)) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf#Parameters]

        while (idx > -1) {
          elm = list[idx];
        //if (((typeof elm != "undefined") || (idx in list)) && fct.call(null, elm, idx, list)) {
          if (((typeof elm != "undefined") || (idx in list)) && fct(elm, idx, list)) {
            isMember = true;
            break;
          }
          --idx;
        }
      } else {
        throwFirstArgumentFunctionTypeError();
      }
      return ((isMember) ? (idx) : (-1));
    });
  })();
  Arr.lastIndexOfFilter = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make, global = sh;
    return (function (list, fct, idx) {

      var len, elm, isMember; list = ((isArray(list) && list) || makeArray(list) || throwListTypeError());
    //var len, elm, isMember; list = ((isArray(list) && list) || makeArray(list) || []); // fail silently
      if (typeof fct == "function") {

        len = list.length;

        idx = global.parseInt(global.Number(idx), 10);
        idx = ((global.isFinite(idx) && idx) || len);
        idx = (((idx < 0) && global.Math.max(0, (len + idx))) || idx);
        idx = (((idx >= len) && (len - 1)) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf#Parameters]

        while (idx > -1) {
          elm = list[idx];
        //if (((typeof elm != "undefined") || (idx in list)) && fct.call(null, elm, idx, list)) {
          if (((typeof elm != "undefined") || (idx in list)) && fct(elm, idx, list)) {
            isMember = true;
            break;
          }
          --idx;
        }
      } else {
        throwSecondArgumentFunctionTypeError();
      }
      return ((isMember) ? (idx) : (-1));
    });
  })();


  ProtoArr.remove = (function () { // mutating for native arrays - non mutating for all other list like structures of course.

    var isArray = Arr.isArray, makeArray = Arr.make, splice = ProtoArr.splice;
    return (function (obj/*[, obj2[, obj3[, ...]]]*/) {

      var lenArgs, lenList/*, obj*/, k, i = -1, args = arguments, list = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var lenArgs, lenList/*, obj*/, k, i = -1, args = arguments, list = ((isArray(this) && this) || makeArray(this) || []); // fail silently

      lenArgs = args.length;
      lenList = list.length;

      while (++i < lenArgs) {
        obj = args[i];
        k = -1;
        while (++k < lenList) {
          if (list[k] === obj) {

            list.splice(k, 1);
            --lenList;
            --k;
          }
        }
      }/*
      list.unshift(lenList); list.unshift(0);
    //or
      list = [0, lenList].concat(list);
    */

    //if (typeof this.remove == "function") {
      if (this.remove === args.callee) {
        splice.apply(this, [0, lenList].concat(list)); // in order to be mutating for native arrays
        list = this;
      }
      return list;
    });
  })();/*
//to be pasted into [http://jconsole.com/]
  var time = (new Date);
  print(Array.prototype.remove.apply(document.getElementsByTagName("*"), Array.make(document.getElementsByTagName("div"))));
  time = ((new Date) - time);
  print(time + " msec");
*/
  Arr.remove = (function () { // non mutating for passed native arrays.

    var makeArray = Arr.make, splice = ProtoArr.splice;
    return (function (list, obj/*[, obj2[, obj3[, ...]]]*/) {

      var lenArgs, lenList/*, obj*/, k, i = -1, args = makeArray(arguments); list = (makeArray(args.shift()) || throwListTypeError()); // non mutating for passed native arrays.
    //var lenArgs, lenList/*, obj*/, k, i = -1, args = makeArray(arguments); list = (makeArray(args.shift()) || []); // fail silently

      lenArgs = args.length;
      lenList = list.length;

      while (++i < lenArgs) {
        obj = args[i];
        k = -1;
        while (++k < lenList) {
          if (list[k] === obj) {

            list.splice(k, 1);
            --lenList;
            --k;
          }
        }
      }
      return list; // non mutating for passed native arrays.
    });
  })();/*
//to be pasted into [http://jconsole.com/]
  var time = (new Date);
  print(Array.remove.apply(null, [document.getElementsByTagName("*")].concat(Array.make(document.getElementsByTagName("div")))));
  time = ((new Date) - time);
  print(time + " msec");

  var arr = [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,0,0,0,0,0,0,0];
  print(Array.remove(arr, 0, 2, 4, 6, 8));
  print(arr);
  print(Array.remove(arr, 0, 2, 4, 6, 8).remove(1, 5, 9));
  print(arr);
*/


})();/*

//module base [Array.make.detect]         - 1.852 byte
(function(){var b=this&&this.window===this&&window||this,f=b.Array,s=f.prototype,q=b.Object.prototype,n=q.toString,l=typeof b.isFunction=="function"&&b.isFunction||function(h){return typeof h=="function"};f.isArray=b.isArray=l(f.isArray)&&f.isArray||l(b.isArray)&&b.isArray||function(){var h=/^\[object\s+Array\]$/,c=n;return function(i){return h.test(c.call(i))}}();f.isArgumentsArray=l(f.isArgumentsArray)&&f.isArgumentsArray||function(){var h,c=/^\[object\s+Object\]$/,i=n,j=q.propertyIsEnumerable;try{j.call(b,"length");h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!j.call(e,"length")}}catch(o){h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!function(k){var m;try{m=j.call(k,"length")}catch(r){m=true}return m}(e)}}return h}();f.make=function(){var h,c,i,j=b.document,o=b,e=j&&l(j.getElementsByTagName)&&j.getElementsByTagName("*")||[],k=s.slice,m=f.isArgumentsArray,r=f.isArray,t=l(b.isString)&&b.isString||function(){var a=/^\[object\s+String\]$/,g=n;return function(d){return a.test(g.call(d))}}();try{c=k.call(e);c=k.call(arguments);i=c.join("");if(c.length!=3||i!="Array.make")throw new Error;c=k.call(i);if(c.length!==10||c[5]!==".")throw new Error;h=function(a){var g=(a||t(a))&&a.length;return typeof g=="number"&&o.isFinite(g)&&k.call(a)||void 0};r=m=null;delete m;delete r}catch(u){h=function(a){var g,d,p=m(a)&&k.call(a)||t(a)&&a.split("")||r(a)&&k.call(a)||g;if(!p){d=a!==0&&a&&a.length;if(typeof d=="number"&&o.isFinite(d)){p=new o.Array(o.Math.max(0,d));if(typeof a.item=="function")for(;--d>=0;){g=a.item(d);if(typeof g!="undefined"||d in a)p[d]=g}else for(;--d>=0;){g=a[d];if(typeof g!="undefined"||d in a)p[d]=g}}}return p}}e=j=i=c=null;delete c;delete i;delete j;delete e;return h}("Array",".","make");l=n=q=s=f=b=null;delete b;delete f;delete s;delete q;delete n;delete l})();

//module base [Array.extras.generic.debug] - 3.398 byte
(function(){var g=this&&this.window===this&&window||this,f=g.Array,r=f.prototype,s=typeof g.isFunction=="function"&&g.isFunction||function(h){return typeof h=="function"},q=function(){throw new TypeError("objects delegated via apply/call need to be some kind of list.");},o=function(){throw new TypeError("1st argument needs to be some kind of list.");},m=function(){throw new TypeError("1st argument needs to be a function type.");},l=function(){throw new TypeError("2nd argument needs to be a function type.");};if(!f||!s(f.isArray)||!s(f.make))throw new ReferenceError("All [[Array]] implementations badly require the presence of the [[Array]] extensions module base [Array.make.detect].");r.isEmpty=function(){var h=f.isArray,i=f.make;return function(){var c,b,a=true,d=-1,e=h(this)&&this||i(this)||q();for(c=e.length;++d<c;)if((b=e[d])||typeof b!="undefined"||d in e){a=false;break}return a}}();f.isEmpty=function(){var h=f.isArray,i=f.make;return function(c){var b,a,d=true,e=-1;c=h(c)&&c||i(c)||o();for(b=c.length;++e<b;)if((a=c[e])||typeof a!="undefined"||e in c){d=false;break}return d}}();r.contains=function(){var h=f.isArray,i=f.make;return function(c){var b,a,d,e=-1,k=h(this)&&this||i(this)||q();for(b=k.length;++e<b;){a=k[e];if((typeof a!="undefined"||e in k)&&a===c){d=true;break}}return!!d}}();f.contains=function(){var h=f.isArray,i=f.make;return function(c,b){var a,d,e,k=-1;c=h(c)&&c||i(c)||o();for(a=c.length;++k<a;){d=c[k];if((typeof d!="undefined"||k in c)&&d===b){e=true;break}}return!!e}}();r.indexOfFilter=function(){var h=f.isArray,i=f.make;return function(c,b){var a,d,e,k=h(this)&&this||i(this)||q();if(typeof c=="function"){a=k.length;b=g.parseInt(g.Number(b),10);b=g.isFinite(b)&&b||0;for(b=b<0&&g.Math.max(0,a+b)||b;b<a;){d=k[b];if((typeof d!="undefined"||b in k)&&c(d,b,k)){e=true;break}++b}}else m();return e?b:-1}}();f.indexOfFilter=function(){var h=f.isArray,i=f.make;return function(c,b,a){var d,e,k;c=h(c)&&c||i(c)||o();if(typeof b=="function"){d=c.length;a=g.parseInt(g.Number(a),10);a=g.isFinite(a)&&a||0;for(a=a<0&&g.Math.max(0,d+a)||a;a<d;){e=c[a];if((typeof e!="undefined"||a in c)&&b(e,a,c)){k=true;break}++a}}else l();return k?a:-1}}();r.lastIndexOfFilter=function(){var h=f.isArray,i=f.make;return function(c,b){var a,d,e=h(this)&&this||i(this)||q();if(typeof c=="function"){a=e.length;b=g.parseInt(g.Number(b),10);b=g.isFinite(b)&&b||a;b=b<0&&g.Math.max(0,a+b)||b;for(b=b>=a&&a-1||b;b>-1;){a=e[b];if((typeof a!="undefined"||b in e)&&c(a,b,e)){d=true;break}--b}}else m();return d?b:-1}}();f.lastIndexOfFilter=function(){var h=f.isArray,i=f.make;return function(c,b,a){var d,e;c=h(c)&&c||i(c)||o();if(typeof b=="function"){d=c.length;a=g.parseInt(g.Number(a),10);a=g.isFinite(a)&&a||d;a=a<0&&g.Math.max(0,d+a)||a;for(a=a>=d&&d-1||a;a>-1;){d=c[a];if((typeof d!="undefined"||a in c)&&b(d,a,c)){e=true;break}--a}}else l();return e?a:-1}}();r.remove=function(){var h=f.isArray,i=f.make,c=r.splice;return function(b){var a,d,e,k=-1,u=arguments,j=h(this)&&this||i(this)||q();a=u.length;for(d=j.length;++k<a;){b=u[k];for(e=-1;++e<d;)if(j[e]===b){j.splice(e,1);--d;--e}}if(this.remove===u.callee){c.apply(this,[0,d].concat(j));j=this}return j}}();f.remove=function(){var h=f.make;return function(i,c){var b,a,d,e=-1,k=h(arguments);i=h(k.shift())||o();b=k.length;for(a=i.length;++e<b;){c=k[e];for(d=-1;++d<a;)if(i[d]===c){i.splice(d,1);--a;--d}}return i}}()})();

*/
