

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

    var forEach = ProtoArr.forEach
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

    var every = ProtoArr.every
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

    var some = ProtoArr.some
    return (function (list, fct, target) {

      return some.call(list, fct, target);
    });
  })());
//Array.some("bbbbbbbbbba", (function (elm) {return (elm === "a");}));


//clean up after
  sh = null; Arr = null; ProtoArr = null; ProtoObj = null; exposeImplementation = null; isFunction = null;
  delete sh; delete Arr; delete ProtoArr; delete ProtoObj; delete exposeImplementation; delete isFunction;

})();



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - ?.??? byte

- Simple          - 2.252 byte
(function(){var h=this&&this.window===this&&window||this,d=h.Array,o=d.prototype,r=h.Object.prototype,p=r.toString,m=typeof h.isFunction=="function"&&h.isFunction||function(f){return typeof f=="function"};d.isArray=h.isArray=m(d.isArray)&&d.isArray||m(h.isArray)&&h.isArray||function(){var f=/^\[object\s+Array\]$/,b=p;return function(g){return f.test(b.call(g))}}();d.isArgumentsArray=m(d.isArgumentsArray)&&d.isArgumentsArray||function(){var f,b=/^\[object\s+Object\]$/,g=p,c=r.propertyIsEnumerable;try{c.call(h,"length");f=function(e){return b.test(g.call(e))&&!!e&&typeof e.length=="number"&&!c.call(e,"length")}}catch(l){f=function(e){return b.test(g.call(e))&&!!e&&typeof e.length=="number"&&!function(j){var n;try{n=c.call(j,"length")}catch(s){n=true}return n}(e)}}return f}();d.make=function(){var f,b,g,c=h.document,l=h,e=c&&m(c.getElementsByTagName)&&c.getElementsByTagName("*")||[],j=o.slice,n=d.isArgumentsArray,s=d.isArray,t=m(h.isString)&&h.isString||function(){var a=/^\[object\s+String\]$/,k=p;return function(i){return a.test(k.call(i))}}();try{b=j.call(e);b=j.call(arguments);g=b.join("");if(b.length!=3||g!="Array.make")throw new Error;b=j.call(g);if(b.length!==10||b[5]!==".")throw new Error;f=function(a){var k=(a||t(a))&&a.length;return typeof k=="number"&&l.isFinite(k)&&j.call(a)||void 0};s=n=null;delete n;delete s}catch(u){f=function(a){var k,i,q=n(a)&&j.call(a)||t(a)&&a.split("")||s(a)&&j.call(a)||k;if(!q){i=a!==0&&a&&a.length;if(typeof i=="number"&&l.isFinite(i)){q=new l.Array(l.Math.max(0,i));if(typeof a.item=="function")for(;--i>=0;){k=a.item(i);if(typeof k!="undefined"||i in a)q[i]=k}else for(;--i>=0;){k=a[i];if(typeof k!="undefined"||i in a)q[i]=k}}}return q}}e=c=g=b=null;delete b;delete g;delete c;delete e;return f}("Array",".","make");o.forEach=m(o.forEach)&&o.forEach||function(){var f=d.isArray,b=d.make;return function(g,c){var l=f(this)&&this||b(this);if(l&&typeof g=="function"){c=typeof c=="undefined"||typeof c=="obj"&&!c?null:c;for(var e,j=-1,n=l.length;++j<n;){e=l[j];if(typeof e!="undefined"||j in l)g.call(c,e,j,l)}}}}();d.forEach=m(d.forEach)&&d.forEach||function(){var f=o.forEach;return function(b,g,c){f.call(b,g,c)}}();m=p=r=o=d=h=null;delete h;delete d;delete o;delete r;delete p;delete m})();


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - ?.??? byte

- packed / shrinked           - ?.??? byte

- packed / shrinked / encoded - 2.282 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(){l f=((r&&(r.Y===r)&&Y)||r),4=f.C,q=4.X,A=f.V.X,v=A.19,m=(((h f.m=="2")&&f.m)||(2(a){8(h a=="2")}));4.j=f.j=((m(4.j)&&4.j)||(m(f.j)&&f.j)||(2(){l b=(/^\\[P\\s+C\\]$/),t=v;8(2(a){8 b.K(t.7(a))})})());4.H=((m(4.H)&&4.H)||(2(){l d,S=(/^\\[P\\s+V\\]$/),t=v,J=A.18;N{J.7(f,"n");d=(2(a){8(S.K(t.7(a))&&!!a&&(h a.n=="L")&&!J.7(a,"n"))})}Q(R){d=(2(c){8(S.K(t.7(c))&&!!c&&(h c.n=="L")&&!(2(a){l b;N{b=J.7(a,"n")}Q(R){b=17}8 b})(c))})}8 d})());4.G=(2(){l c,6,x,w=f.14,z=f,D=((w&&m(w.U)&&w.U("*"))||[]),p=q.p,F=4.H,j=4.j,y=((m(f.y)&&f.y)||(2(){l b=(/^\\[P\\s+1d\\]$/),t=v;8(2(a){8 b.K(t.7(a))})})());N{6=p.7(D);6=p.7(1c);x=6.1b("");o((6.n!=3)||(x!="C.G")){Z(T 12);}6=p.7(x);o((6.n!==10)||(6[5]!==".")){Z(T 12);}c=(2(a){l b,B=((a||y(a))&&a.n);8(((h B=="L")&&z.E(B)&&p.7(a))||b)});F=9;j=9;k F;k j}Q(R){c=(2(a){l b,g,6=((F(a)&&p.7(a))||(y(a)&&a.13(""))||(j(a)&&p.7(a))||b);o(!6){g=((a!==0)&&a&&a.n);o((h g=="L")&&z.E(g)){6=T z.C(z.15.16(0,g));o(h a.11=="2"){M(--g>=0){b=a.11(g);o((h b!="I")||(g O a)){6[g]=b}}}1a{M(--g>=0){b=a[g];o((h b!="I")||(g O a)){6[g]=b}}}}}8 6})}6=9;x=9;w=9;D=9;k 6;k x;k w;k D;8 c})("C",".","G");q.u=((m(q.u)&&q.u)||(2(){l e=4.j,W=4.G,E=f.E;8(2(a,b){l c=((e(r)&&r)||W(r));o(c&&(h a=="2")){b=(((h b=="I")||((h b=="1e")&&!b))?(9):(b));l d,i=-1,B=c.n;M(++i<B){d=c[i];o((h d!="I")||(i O c)){a.7(b,d,i,c)}}}})})());4.u=((m(4.u)&&4.u)||(2(){l d=q.u 8(2(a,b,c){d.7(a,b,c)})})());f=9;4=9;q=9;A=9;v=9;m=9;k f;k 4;k q;k A;k v;k m})();',62,77,'||function||Arr||arr|call|return|null|||||||idx|typeof||isArray|delete|var|isFunction|length|if|slice|ProtoArr|this||expose|forEach|exposeImplementation|doc|str|isString|global|ProtoObj|len|Array|all|isFinite|isArguments|make|isArgumentsArray|undefined|isEnumerable|test|number|while|try|in|object|catch|exc|regXBaseClass|new|getElementsByTagName|Object|makeArray|prototype|window|throw||item|Error|split|document|Math|max|true|propertyIsEnumerable|toString|else|join|arguments|String|obj'.split('|'),0,{}));


*/
