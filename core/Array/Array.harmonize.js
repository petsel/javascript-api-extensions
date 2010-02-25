

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

        var elm, i = -1, len = arr.length, hasSome = false; // [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were [undefined] values.
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

        var elm, i = -1, len = arr.length, hasSome = false;// [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were [undefined] values.
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


//clean up after
  sh = null; Arr = null; ProtoArr = null; ProtoObj = null; exposeImplementation = null; isFunction = null;
  delete sh; delete Arr; delete ProtoArr; delete ProtoObj; delete exposeImplementation; delete isFunction;

})();



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - ?.??? byte

- Simple          - 3.965 byte
(function(){var m=this&&this.window===this&&window||this,c=m.Array,j=c.prototype,t=m.Object.prototype,r=t.toString,l=typeof m.isFunction=="function"&&m.isFunction||function(f){return typeof f=="function"};c.isArray=m.isArray=l(c.isArray)&&c.isArray||l(m.isArray)&&m.isArray||function(){var f=/^\[object\s+Array\]$/,e=r;return function(d){return f.test(e.call(d))}}();c.isArgumentsArray=l(c.isArgumentsArray)&&c.isArgumentsArray||function(){var f,e=/^\[object\s+Object\]$/,d=r,a=t.propertyIsEnumerable;try{a.call(m,"length");f=function(b){return e.test(d.call(b))&&!!b&&typeof b.length=="number"&&!a.call(b,"length")}}catch(g){f=function(b){return e.test(d.call(b))&&!!b&&typeof b.length=="number"&&!function(h){var i;try{i=a.call(h,"length")}catch(n){i=true}return i}(b)}}return f}();c.make=function(){var f,e,d,a=m.document,g=m,b=a&&l(a.getElementsByTagName)&&a.getElementsByTagName("*")||[],h=j.slice,i=c.isArgumentsArray,n=c.isArray,q=l(m.isString)&&m.isString||function(){var k=/^\[object\s+String\]$/,p=r;return function(o){return k.test(p.call(o))}}();try{e=h.call(b);e=h.call(arguments);d=e.join("");if(e.length!=3||d!="Array.make")throw new Error;e=h.call(d);if(e.length!==10||e[5]!==".")throw new Error;f=function(k){var p=(k||q(k))&&k.length;return typeof p=="number"&&g.isFinite(p)&&h.call(k)||void 0};n=i=null;delete i;delete n}catch(u){f=function(k){var p,o,s=i(k)&&h.call(k)||q(k)&&k.split("")||n(k)&&h.call(k)||p;if(!s){o=k!==0&&k&&k.length;if(typeof o=="number"&&g.isFinite(o)){s=new g.Array(g.Math.max(0,o));if(typeof k.item=="function")for(;--o>=0;){p=k.item(o);if(typeof p!="undefined"||o in k)s[o]=p}else for(;--o>=0;){p=k[o];if(typeof p!="undefined"||o in k)s[o]=p}}}return s}}b=a=d=e=null;delete e;delete d;delete a;delete b;return f}("Array",".","make");j.forEach=l(j.forEach)&&j.forEach||function(){var f=c.isArray,e=c.make;return function(d,a){var g=f(this)&&this||e(this);if(g&&typeof d=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var b,h=-1,i=g.length;++h<i;){b=g[h];if(typeof b!="undefined"||h in g)d.call(a,b,h,g)}}}}();c.forEach=l(c.forEach)&&c.forEach||function(){var f=j.forEach;return function(e,d,a){f.call(e,d,a)}}();j.every=l(j.every)&&j.every||function(){var f=c.isArray,e=c.make;return function(d,a){var g,b=f(this)&&this||e(this);if(b&&typeof d=="function"){var h,i=-1,n=b.length,q=false;if(n>=1){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(g=true;g&&++i<n;){h=b[i];if(typeof h!="undefined"||i in b){q=true;g=d.call(a,h,i,b)}}g=q&&g}}return!!g}}();c.every=l(c.every)&&c.every||function(){var f=j.every;return function(e,d,a){return f.call(e,d,a)}}();j.some=l(j.some)&&j.some||function(){var f=c.isArray,e=c.make;return function(d,a){var g,b=f(this)&&this||e(this);if(b&&typeof d=="function"){var h,i=-1,n=b.length,q=false;if(n>=1){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(g=false;!g&&++i<n;){h=b[i];if(typeof h!="undefined"||i in b){q=true;g=d.call(a,h,i,b)}}g=q&&g}}return!!g}}();c.some=l(c.some)&&c.some||function(){var f=j.some;return function(e,d,a){return f.call(e,d,a)}}();j.map=l(j.map)&&j.map||function(){var f=c.isArray,e=c.make;return function(d,a){var g=[],b=f(this)&&this||e(this);if(b&&typeof d=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var h,i=-1,n=b.length;++i<n;){h=b[i];g[i]=typeof h!="undefined"||i in b?d.call(a,h,i,b):h}}return g}}();c.map=l(c.map)&&c.map||function(){var f=j.map;return function(e,d,a){return f.call(e,d,a)}}();j.filter=l(j.filter)&&j.filter||function(){var f=c.isArray,e=c.make;return function(d,a){var g=[],b=f(this)&&this||e(this);if(b&&typeof d=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var h,i=-1,n=b.length;++i<n;){h=b[i];if(typeof h!="undefined"||i in b)d.call(a,h,i,b)&&g.push(h)}}return g}}();c.filter=l(c.filter)&&c.filter||function(){var f=j.filter;return function(e,d,a){return f.call(e,d,a)}}();l=r=t=j=c=m=null;delete m;delete c;delete j;delete t;delete r;delete l})();


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - ?.??? byte

- packed / shrinked           - ?.??? byte

- packed / shrinked / encoded - 3.560 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(){9 f=((l&&(l.19===l)&&19)||l),4=f.O,g=4.1b,L=f.18.1b,H=L.1j,k=(((7 f.k=="2")&&f.k)||(2(a){6(7 a=="2")}));4.n=f.n=((k(4.n)&&4.n)||(k(f.n)&&f.n)||(2(){9 b=(/^\\[13\\s+O\\]$/),z=H;6(2(a){6 b.P(z.h(a))})})());4.Q=((k(4.Q)&&4.Q)||(2(){9 d,12=(/^\\[13\\s+18\\]$/),z=H,S=L.1m;11{S.h(f,"p");d=(2(a){6(12.P(z.h(a))&&!!a&&(7 a.p=="R")&&!S.h(a,"p"))})}Z(X){d=(2(c){6(12.P(z.h(c))&&!!c&&(7 c.p=="R")&&!(2(a){9 b;11{b=S.h(a,"p")}Z(X){b=U}6 b})(c))})}6 d})());4.w=(2(){9 c,8,J,I=f.1e,K=f,W=((I&&k(I.1a)&&I.1a("*"))||[]),x=g.x,V=4.Q,n=4.n,N=((k(f.N)&&f.N)||(2(){9 b=(/^\\[13\\s+1g\\]$/),z=H;6(2(a){6 b.P(z.h(a))})})());11{8=x.h(W);8=x.h(1h);J=8.1i("");j((8.p!=3)||(J!="O.w")){17(Y 16);}8=x.h(J);j((8.p!==10)||(8[5]!==".")){17(Y 16);}c=(2(a){9 b,o=((a||N(a))&&a.p);6(((7 o=="R")&&K.T(o)&&x.h(a))||b)});V=m;n=m;u V;u n}Z(X){c=(2(a){9 b,q,8=((V(a)&&x.h(a))||(N(a)&&a.1d(""))||(n(a)&&x.h(a))||b);j(!8){q=((a!==0)&&a&&a.p);j((7 q=="R")&&K.T(q)){8=Y K.O(K.1k.1l(0,q));j(7 a.1c=="2"){E(--q>=0){b=a.1c(q);j((7 b!="r")||(q B a)){8[q]=b}}}15{E(--q>=0){b=a[q];j((7 b!="r")||(q B a)){8[q]=b}}}}}6 8})}8=m;J=m;I=m;W=m;u 8;u J;u I;u W;6 c})("O",".","w");g.A=((k(g.A)&&g.A)||(2(){9 e=4.n,v=4.w,T=f.T;6(2(a,b){9 c=((e(l)&&l)||v(l));j(c&&(7 a=="2")){b=(((7 b=="r")||((7 b=="M")&&!b))?(m):(b));9 d,i=-1,o=c.p;E(++i<o){d=c[i];j((7 d!="r")||(i B c)){a.h(b,d,i,c)}}}})})());4.A=((k(4.A)&&4.A)||(2(){9 d=g.A;6(2(a,b,c){d.h(a,b,c)})})());g.y=((k(g.y)&&g.y)||(2(){9 e=4.n,v=4.w;6(2(a,b){9 c,8=((e(l)&&l)||v(l));j(8&&(7 a=="2")){9 d,i=-1,o=8.p,G=14;j(o>=1){b=(((7 b=="r")||((7 b=="M")&&!b))?(m):(b));c=U;E(c&&(++i<o)){d=8[i];j((7 d!="r")||(i B 8)){G=U;c=a.h(b,d,i,8)}}c=(G&&c)}}6!!c})})());4.y=((k(4.y)&&4.y)||(2(){9 d=g.y;6(2(a,b,c){6 d.h(a,b,c)})})());g.F=((k(g.F)&&g.F)||(2(){9 e=4.n,v=4.w;6(2(a,b){9 c,8=((e(l)&&l)||v(l));j(8&&(7 a=="2")){9 d,i=-1,o=8.p,G=14;j(o>=1){b=(((7 b=="r")||((7 b=="M")&&!b))?(m):(b));c=14;E(!c&&(++i<o)){d=8[i];j((7 d!="r")||(i B 8)){G=U;c=a.h(b,d,i,8)}}c=(G&&c)}}6!!c})})());4.F=((k(4.F)&&4.F)||(2(){9 d=g.F;6(2(a,b,c){6 d.h(a,b,c)})})());g.C=((k(g.C)&&g.C)||(2(){9 e=4.n,v=4.w;6(2(a,b){9 c=[],t=((e(l)&&l)||v(l));j(t&&(7 a=="2")){b=(((7 b=="r")||((7 b=="M")&&!b))?(m):(b));9 d,i=-1,o=t.p;E(++i<o){d=t[i];j((7 d!="r")||(i B t)){c[i]=a.h(b,d,i,t)}15{c[i]=d}}}6 c})})());4.C=((k(4.C)&&4.C)||(2(){9 d=g.C;6(2(a,b,c){6 d.h(a,b,c)})})());g.D=((k(g.D)&&g.D)||(2(){9 e=4.n,v=4.w;6(2(a,b){9 c=[],t=((e(l)&&l)||v(l));j(t&&(7 a=="2")){b=(((7 b=="r")||((7 b=="M")&&!b))?(m):(b));9 d,i=-1,o=t.p;E(++i<o){d=t[i];j((7 d!="r")||(i B t)){j(a.h(b,d,i,t)){c.1f(d)}}}}6 c})})());4.D=((k(4.D)&&4.D)||(2(){9 d=g.D;6(2(a,b,c){6 d.h(a,b,c)})})());f=m;4=m;g=m;L=m;H=m;k=m;u f;u 4;u g;u L;u H;u k})();',62,85,'||function||Arr||return|typeof|arr|var|||||||ProtoArr|call||if|isFunction|this|null|isArray|len|length|idx|undefined||list|delete|makeArray|make|slice|every|expose|forEach|in|map|filter|while|some|hasSome|exposeImplementation|doc|str|global|ProtoObj|obj|isString|Array|test|isArgumentsArray|number|isEnumerable|isFinite|true|isArguments|all|exc|new|catch||try|regXBaseClass|object|false|else|Error|throw|Object|window|getElementsByTagName|prototype|item|split|document|push|String|arguments|join|toString|Math|max|propertyIsEnumerable'.split('|'),0,{}));


*/
