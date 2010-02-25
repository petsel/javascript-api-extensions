

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


  ProtoArr.forEach = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, target) {

      var arr = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var arr = ((isArray(this) && this) || makeArray(this) || []); // fail silently
      if (typeof fct == "function") {

        target = (((typeof target == "undefined") || ((typeof target == "obj") && !target)) ? (null) : (target));
        var elm, i = -1, len = arr.length;
        while (++i < len) {
          elm = arr[i];
          if ((typeof elm != "undefined") || (i in arr)) { // countercheck on this issue with [https://bugzilla.mozilla.org/show_bug.cgi?id=475925] and [http://code.google.com/p/v8/issues/detail?id=218]
            fct.call(target, elm, i, arr);
          }
        }
      } else {
        throwFirstArgumentFunctionTypeError();
      }
    });
  })();
  Arr.forEach = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (list, fct, target) {

      var arr = ((isArray(list) && list) || makeArray(list) || throwListTypeError());
    //var arr = ((isArray(list) && list) || makeArray(list) || []); // fail silently
      if (typeof fct == "function") {

        target = (((typeof target == "undefined") || ((typeof target == "obj") && !target)) ? (null) : (target));
        var elm, i = -1, len = arr.length;
        while (++i < len) {
          elm = arr[i];
          if ((typeof elm != "undefined") || (i in arr)) { // countercheck on this issue with [https://bugzilla.mozilla.org/show_bug.cgi?id=475925] and [http://code.google.com/p/v8/issues/detail?id=218]
            fct.call(target, elm, i, arr);
          }
        }
      } else {
        throwSecondArgumentFunctionTypeError();
      }
    });
  })();


  ProtoArr.every = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, target) {

      var isAnd, arr = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var isAnd, arr = ((isArray(this) && this) || makeArray(this) || []); // fail silently
      if (typeof fct == "function") {

        var elm, i = -1, len = arr.length, hasSome = false;// [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were [undefined] values.
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
      } else {
        throwFirstArgumentFunctionTypeError();
      }
      return !!isAnd; // prevents return of the initial [undefined] value for [isAnd].
    });
  })();
  Arr.every = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (list, fct, target) {

      var isAnd, arr = ((isArray(list) && list) || makeArray(list) || throwListTypeError());
    //var isAnd, arr = ((isArray(list) && list) || makeArray(list) || []); // fail silently
      if (typeof fct == "function") {

        var elm, i = -1, len = arr.length, hasSome = false;// [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were [undefined] values.
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
      } else {
        throwSecondArgumentFunctionTypeError();
      }
      return !!isAnd; // prevents return of the initial [undefined] value for [isAnd].
    });
  })();
//Array.every("aaaaaaaaaaa", (function (elm) {return (elm === "a");}));


  ProtoArr.some = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, target) {

      var isOr, arr = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var isOr, arr = ((isArray(this) && this) || makeArray(this) || []); // fail silently
      if (typeof fct == "function") {

        var elm, i = -1, len = arr.length, hasSome = false; // [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were [undefined] values.
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
      } else {
        throwFirstArgumentFunctionTypeError();
      }
      return !!isOr; // prevents return of the initial [undefined] value for [isOr].
    });
  })();
  Arr.some = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (list, fct, target) {

      var isOr, arr = ((isArray(list) && list) || makeArray(list) || throwListTypeError());
    //var isOr, arr = ((isArray(list) && list) || makeArray(list) || []); // fail silently
      if (typeof fct == "function") {

        var elm, i = -1, len = arr.length, hasSome = false; // [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were [undefined] values.
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
      } else {
        throwSecondArgumentFunctionTypeError();
      }
      return !!isOr; // prevents return of the initial [undefined] value for [isOr].
    });
  })();
//Array.some("bbbbbbbbbba", (function (elm) {return (elm === "a");}));


  ProtoArr.map = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, target) {

      var arr = [], list = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var arr = [], list = ((isArray(this) && this) || makeArray(this) || []); // fail silently
      if (typeof fct == "function") {

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
      } else {
        throwFirstArgumentFunctionTypeError();
      }
      return arr;
    });
  })();
  Arr.map = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (list, fct, target) {

      var arr = []; list = ((isArray(list) && list) || makeArray(list) || throwListTypeError());
    //var arr = []; list = ((isArray(list) && list) || makeArray(list) || []); // fail silently
      if (typeof fct == "function") {

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
      } else {
        throwSecondArgumentFunctionTypeError();
      }
      return arr;
    });
  })();


  ProtoArr.filter = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (fct, target) {

      var arr = [], list = ((isArray(this) && this) || makeArray(this) || throwListDelegationTypeError());
    //var arr = [], list = ((isArray(this) && this) || makeArray(this) || []); // fail silently
      if (typeof fct == "function") {

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
      } else {
        throwFirstArgumentFunctionTypeError();
      }
      return arr;
    });
  })();
  Arr.filter = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (list, fct, target) {

      var arr = []; list = ((isArray(list) && list) || makeArray(list) || throwListTypeError());
    //var arr = []; list = ((isArray(list) && list) || makeArray(list) || []); // fail silently
      if (typeof fct == "function") {

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
      } else {
        throwSecondArgumentFunctionTypeError();
      }
      return arr;
    });
  })();


})();
