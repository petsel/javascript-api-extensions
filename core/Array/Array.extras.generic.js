

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


  ProtoArr.contains/* = ProtoArr.exists*/ = (function () { // [http://apidock.com/ruby/Array/include%3F] - [include?] as in Ruby or [exists] as in [Joose.A.exists]

    var isArray = Arr.isArray, makeArray = Arr.make;
    return (function (obj) {

      var len, elm, isMember, i = -1, list = ((isArray(this) && this) || makeArray(this));
			if (list) {
				len = list.length;

				while (++i < len) {
					elm = list[i];
					if (((typeof elm != "undefined") || (i in list)) && (elm === obj)) {
						isMember = true;
						break;
					}
				}
			}
      return !!isMember; // prevents return of the initial [undefined] value for [isMember].
    });
  })();
  Arr.contains/* = Arr.exists*/ = (function () {

    var contains = ProtoArr.contains;
    return (function (list, fct, idx) {

      return contains.call(list, fct, idx);
    });
  })();


  ProtoArr.indexOfFilter = (function () { // [http://apidock.com/ruby/Enumerable/find_index]

    var isArray = Arr.isArray, makeArray = Arr.make, global = sh;
    return (function (fct, idx) {

      var len, elm, isMember, list = ((isArray(this) && this) || makeArray(this));
      if (list && (typeof fct == "function")) {

				len = list.length;

				idx = global.parseInt(global.Number(idx), 10);
				idx = ((global.isFinite(idx) && idx) || 0);
				idx = (((idx < 0) && global.Math.max(0, (len + idx))) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf#Parameters]

				while (idx < len) {
					elm = list[idx];
					if (((typeof elm != "undefined") || (idx in list)) && fct.call(null, elm, idx, list)) {
						isMember = true;
						break;
					}
					++idx;
				}
			}
      return ((isMember) ? (idx) : (-1));
    });
  })();
  Arr.indexOfFilter = (function () {

    var indexOfFilter = ProtoArr.indexOfFilter;
    return (function (list, fct, idx) {

      return indexOfFilter.call(list, fct, idx);
    });
  })();


  ProtoArr.lastIndexOfFilter = (function () {

    var isArray = Arr.isArray, makeArray = Arr.make, global = sh;
    return (function (fct, idx) {

      var len, elm, isMember, list = ((isArray(this) && this) || makeArray(this));
      if (list && (typeof fct == "function")) {

				len = list.length;

				idx = global.parseInt(global.Number(idx), 10);
				idx = ((global.isFinite(idx) && idx) || len);
				idx = (((idx < 0) && global.Math.max(0, (len + idx))) || idx);
				idx = (((idx >= len) && (len - 1)) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf#Parameters]

				while (idx > -1) {
					elm = list[idx];
					if (((typeof elm != "undefined") || (idx in list)) && fct.call(null, elm, idx, list)) {
						isMember = true;
						break;
					}
					--idx;
				}
			}
      return ((isMember) ? (idx) : (-1));
    });
  })();
  Arr.lastIndexOfFilter = (function () {

    var lastIndexOfFilter = ProtoArr.lastIndexOfFilter;
    return (function (list, fct, idx) {

      return lastIndexOfFilter.call(list, fct, idx);
    });
  })();


})();/*

//module base [Array.make.detect]   - 1.852 byte
(function(){var b=this&&this.window===this&&window||this,f=b.Array,s=f.prototype,q=b.Object.prototype,n=q.toString,l=typeof b.isFunction=="function"&&b.isFunction||function(h){return typeof h=="function"};f.isArray=b.isArray=l(f.isArray)&&f.isArray||l(b.isArray)&&b.isArray||function(){var h=/^\[object\s+Array\]$/,c=n;return function(i){return h.test(c.call(i))}}();f.isArgumentsArray=l(f.isArgumentsArray)&&f.isArgumentsArray||function(){var h,c=/^\[object\s+Object\]$/,i=n,j=q.propertyIsEnumerable;try{j.call(b,"length");h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!j.call(e,"length")}}catch(o){h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!function(k){var m;try{m=j.call(k,"length")}catch(r){m=true}return m}(e)}}return h}();f.make=function(){var h,c,i,j=b.document,o=b,e=j&&l(j.getElementsByTagName)&&j.getElementsByTagName("*")||[],k=s.slice,m=f.isArgumentsArray,r=f.isArray,t=l(b.isString)&&b.isString||function(){var a=/^\[object\s+String\]$/,g=n;return function(d){return a.test(g.call(d))}}();try{c=k.call(e);c=k.call(arguments);i=c.join("");if(c.length!=3||i!="Array.make")throw new Error;c=k.call(i);if(c.length!==10||c[5]!==".")throw new Error;h=function(a){var g=(a||t(a))&&a.length;return typeof g=="number"&&o.isFinite(g)&&k.call(a)||void 0};r=m=null;delete m;delete r}catch(u){h=function(a){var g,d,p=m(a)&&k.call(a)||t(a)&&a.split("")||r(a)&&k.call(a)||g;if(!p){d=a!==0&&a&&a.length;if(typeof d=="number"&&o.isFinite(d)){p=new o.Array(o.Math.max(0,d));if(typeof a.item=="function")for(;--d>=0;){g=a.item(d);if(typeof g!="undefined"||d in a)p[d]=g}else for(;--d>=0;){g=a[d];if(typeof g!="undefined"||d in a)p[d]=g}}}return p}}e=j=i=c=null;delete c;delete i;delete j;delete e;return h}("Array",".","make");l=n=q=s=f=b=null;delete b;delete f;delete s;delete q;delete n;delete l})();

//module base [Array.extras.generic] - 4.010 byte


*/
