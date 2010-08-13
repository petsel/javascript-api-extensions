

/*
  - static only [[Array]] extensions that will
    create arrays and detect array structures.

  - the generic creator implementation [Array.make]
    will throw a [[TypeError]] in case of getting
    invoked with an invalid argument.




  - list of implemented Array extension methods:

  [Array.isArray],          // type detection
  [Array.isArgumentsArray],

  [Array.make]              // generic creator


  copy and paste code beneath into [http://jconsole.com/] for quick testing:
*/


(function () {


  var sh/*global*/ = this, // "scripting host" or "global object"

  Arr = sh.Array/*,
  Obj = sh.Object*/,
  ArrProto = Arr.prototype,
  ObjProto = sh.Object.prototype,

  regXBaseClassObject = (/^\[object\s+Object\]$/),
  regXBaseClassArguments = (/^\[object\s+Arguments\]$/),

  propertyIsEnumerable = (function () {

    var propertyIsEnumerable;
    try {
      ObjProto.propertyIsEnumerable.call(null, "length");

      propertyIsEnumerable = (function (isEnumerable) {
        return (function (obj, key) {

          return isEnumerable.call(obj, key);
        });
      })(ObjProto.propertyIsEnumerable);

    } catch (exc) { // [exc]::[Error]

      propertyIsEnumerable = (function (isEnumerable) {
        return (function (obj, key) {

          var isEnum;
          try {
            isEnum = isEnumerable.call(obj, key);
          } catch (exc) {
          //isEnum = false;
            isEnum = true; /* due to [propertyIsEnumerable]'s special internal use within client/js-egine specific [isArgumentsArray] method */
          }
          return isEnum;
        });
      })(ObjProto.propertyIsEnumerable);
    }
    return propertyIsEnumerable;
  })(),

  exposeImplementation = ObjProto.toString,

  isFunction = (((typeof sh.isFunction == "function") && sh.isFunction) || (function (obj) {return (typeof obj == "function");}));
/*
(function () {
  print(Object.prototype.toString.call(arguments));
  print(Object.prototype.propertyIsEnumerable.call(arguments, "length"));
  print(Object.prototype.propertyIsEnumerable.call([], "length"));
  print(Object.prototype.propertyIsEnumerable.call("", "length"));
  print(Object.prototype.propertyIsEnumerable.call({length:0}, "length"));
  print(Object.prototype.propertyIsEnumerable.call(document.getElementsByTagName("*"), "length"));
})()
*/


  Arr.isArray/* = sh.isArray*/ = (

    (isFunction(Arr.isArray) && Arr.isArray) ||
    (isFunction(sh.isArray) && sh.isArray) ||

    (function (regXBaseClass, expose) { // equal to : Arr.isArray = sh.isArray = (function () { ... });
      return (function (obj/*:[object|value]*/) {

        return regXBaseClass.test(expose.call(obj));
      });
    })((/^\[object\s+Array\]$/), exposeImplementation)
  );


  Arr.isArgumentsArray/* = sh.isArgumentsArray*/ = (

    (isFunction(Arr.isArgumentsArray) && Arr.isArgumentsArray) ||
    (isFunction(sh.isArgumentsArray) && sh.isArgumentsArray) ||

    (function () { // equal to : Arr.isArgumentsArray = sh.isArgumentsArray = (function () { ... });
      var isArguments;
      if ((function () {return regXBaseClassArguments.test(exposeImplementation.call(arguments));})()) {

        isArguments = (function (regXBaseClass, expose) {
          return (function (obj/*:[object|value]*/) {

            return regXBaseClass.test(expose.call(obj));
          });
        })(regXBaseClassArguments, exposeImplementation);

      } else {

        isArguments = (function (regXBaseClass, expose, isFinite, isEnumerable) {
          return (function (obj/*:[object|value]*/) {

            return (regXBaseClass.test(expose.call(obj)) && !!obj && (typeof obj.length == "number") && isFinite(obj.length) && !isEnumerable(obj, "length"));
          });
        })(regXBaseClassObject, exposeImplementation, sh.isFinite, propertyIsEnumerable);
      }
      return isArguments;
    })()
  );
/*
(function () {
  print(Array.isArgumentsArray(arguments));
  print(Array.isArgumentsArray([]));
  print(Array.isArgumentsArray(""));
  print(Array.isArgumentsArray({length:0}));
  print(Array.isArgumentsArray(document.getElementsByTagName("*")));
})()
*/


  Arr.make = (function () {

    var make, arr, str, doc = sh.document, global = sh,
    all = ((doc && isFunction(doc.getElementsByTagName) && doc.getElementsByTagName("*")) || []),
    slice = ArrProto.slice,
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

  //  so far fastest available, most reliable [Array.make] implementation - throwing a type error (debug version) - supported by all browsers that pass all of the above tests.
      make = (function (list) {

        var arr, len = ((list || isString(list)) && list.length);
        if ((typeof len == "number") && global.isFinite(len)) { // detect invalid list structures.

          arr = (slice.call(list)/* || (new Arr(len))*/);
        } else {
          throw (new TypeError("1st argument needs to be some kind of list."));
        }
        return arr; // (arr || list); // (arr || []); // (arr || [list]); // there might be a debate on it.
      });

    //clean up after
      isArguments = null; isArray = null;
      delete isArguments; delete isArray;

    } catch (exc) { // [exc]::[Error]

  //  so far most reliable [Array.make] implementation - throwing a type error (debug version) - fallback for all browsers that do fail at least one of the above tests.
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
          } else {
            throw (new TypeError("1st argument needs to be some kind of list."));
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


//clean up after
  isFunction = exposeImplementation = propertyIsEnumerable = null;
  regXBaseClassArguments = regXBaseClassObject = null;
  ObjProto = ArrProto = Arr = sh = null;

  delete isFunction; delete exposeImplementation; delete propertyIsEnumerable;
  delete regXBaseClassArguments; delete regXBaseClassObject;
  delete ObjProto; delete ArrProto; delete Arr; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);



print(Array.make(document.getElementsByTagName("*")));
print(Array.make((function(){return arguments})(1,2,3,4,5,6,7,8,9,0)));



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 2.924 byte
(function(){var sh=this&&this.window===this&&window||this,Arr=sh.Array,ProtoArr=Arr.prototype,ProtoObj=sh.Object.prototype,exposeImplementation=ProtoObj.toString,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"};Arr.isArray=sh.isArray=isFunction(Arr.isArray)&&Arr.isArray||isFunction(sh.isArray)&&sh.isArray||function(){var regXBaseClass=/^\[object\s+Array\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();Arr.isArgumentsArray=isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray||function(){var isArguments,regXBaseClass=/^\[object\s+Object\]$/,expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(sh,"length");isArguments=function(obj){return regXBaseClass.test(expose.call(obj))&&!!obj&&typeof obj.length=="number"&&!isEnumerable.call(obj,"length")}}catch(exc){isArguments=function(obj){return regXBaseClass.test(expose.call(obj))&&!!obj&&typeof obj.length=="number"&&!function(elm){var isEnum;try{isEnum=isEnumerable.call(elm,"length")}catch(exc){isEnum=true}return isEnum}(obj)}}return isArguments}();Arr.make=function(){var make,arr,str,doc=sh.document,global=sh,all=doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName("*")||[],slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=isFunction(sh.isString)&&sh.isString||function(){var regXBaseClass=/^\[object\s+String\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if(arr.length!=3||str!="Array.make")throw new Error;arr=slice.call(str);if(arr.length!==10||arr[5]!==".")throw new Error;make=function(list){var arr,len=(list||isString(list))&&list.length;if(typeof len=="number"&&global.isFinite(len))arr=slice.call(list);else throw new TypeError("1st argument needs to be some kind of list.");return arr};isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){make=function(list){var elm,idx,arr=isArguments(list)&&slice.call(list)||isString(list)&&list.split("")||isArray(list)&&slice.call(list)||elm;if(!arr){idx=list!==0&&list&&list.length;if(typeof idx=="number"&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof list.item=="function")while(--idx>=0){elm=list.item(idx);if(typeof elm!="undefined"||idx in list)arr[idx]=elm}else while(--idx>=0){elm=list[idx];if(typeof elm!="undefined"||idx in list)arr[idx]=elm}}else throw new TypeError("1st argument needs to be some kind of list.");}return arr}}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return make}("Array",".","make");sh=null;Arr=null;ProtoArr=null;ProtoObj=null;exposeImplementation=null;isFunction=null;delete sh;delete Arr;delete ProtoArr;delete ProtoObj;delete exposeImplementation;delete isFunction})();

- Simple          - 1.994 byte
(function(){var b=this&&this.window===this&&window||this,f=b.Array,s=f.prototype,q=b.Object.prototype,n=q.toString,l=typeof b.isFunction=="function"&&b.isFunction||function(h){return typeof h=="function"};f.isArray=b.isArray=l(f.isArray)&&f.isArray||l(b.isArray)&&b.isArray||function(){var h=/^\[object\s+Array\]$/,c=n;return function(i){return h.test(c.call(i))}}();f.isArgumentsArray=l(f.isArgumentsArray)&&f.isArgumentsArray||function(){var h,c=/^\[object\s+Object\]$/,i=n,j=q.propertyIsEnumerable;try{j.call(b,"length");h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!j.call(e,"length")}}catch(o){h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!function(k){var m;try{m=j.call(k,"length")}catch(r){m=true}return m}(e)}}return h}();f.make=function(){var h,c,i,j=b.document,o=b,e=j&&l(j.getElementsByTagName)&&j.getElementsByTagName("*")||[],k=s.slice,m=f.isArgumentsArray,r=f.isArray,t=l(b.isString)&&b.isString||function(){var a=/^\[object\s+String\]$/,g=n;return function(d){return a.test(g.call(d))}}();try{c=k.call(e);c=k.call(arguments);i=c.join("");if(c.length!=3||i!="Array.make")throw new Error;c=k.call(i);if(c.length!==10||c[5]!==".")throw new Error;h=function(a){var g=(a||t(a))&&a.length;if(typeof g=="number"&&o.isFinite(g))a=k.call(a);else throw new TypeError("1st argument needs to be some kind of list.");return a};r=m=null;delete m;delete r}catch(u){h=function(a){var g,d,p=m(a)&&k.call(a)||t(a)&&a.split("")||r(a)&&k.call(a)||g;if(!p){d=a!==0&&a&&a.length;if(typeof d=="number"&&o.isFinite(d)){p=new o.Array(o.Math.max(0,d));if(typeof a.item=="function")for(;--d>=0;){g=a.item(d);if(typeof g!="undefined"||d in a)p[d]=g}else for(;--d>=0;){g=a[d];if(typeof g!="undefined"||d in a)p[d]=g}}else throw new TypeError("1st argument needs to be some kind of list.");}return p}}e=j=i=c=null;delete c;delete i;delete j;delete e;return h}("Array",".","make");l=n=q=s=f=b=null;delete b;delete f;delete s;delete q;delete n;delete l})();


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 3.043 byte
(function(){var sh=((this&&(this.window===this)&&window)||this),Arr=sh.Array,ProtoArr=Arr.prototype,ProtoObj=sh.Object.prototype,exposeImplementation=ProtoObj.toString,isFunction=(((typeof sh.isFunction=="function")&&sh.isFunction)||(function(obj){return(typeof obj=="function")}));Arr.isArray=sh.isArray=((isFunction(Arr.isArray)&&Arr.isArray)||(isFunction(sh.isArray)&&sh.isArray)||(function(){var regXBaseClass=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})());Arr.isArgumentsArray=((isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray)||(function(){var isArguments,regXBaseClass=(/^\[object\s+Object\]$/),expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(sh,"length");isArguments=(function(obj){return(regXBaseClass.test(expose.call(obj))&&!!obj&&(typeof obj.length=="number")&&!isEnumerable.call(obj,"length"))})}catch(exc){isArguments=(function(obj){return(regXBaseClass.test(expose.call(obj))&&!!obj&&(typeof obj.length=="number")&&!(function(elm){var isEnum;try{isEnum=isEnumerable.call(elm,"length")}catch(exc){isEnum=true}return isEnum})(obj))})}return isArguments})());Arr.make=(function(){var make,arr,str,doc=sh.document,global=sh,all=((doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName("*"))||[]),slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=((isFunction(sh.isString)&&sh.isString)||(function(){var regXBaseClass=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})());try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}make=(function(list){var arr,len=((list||isString(list))&&list.length);if((typeof len=="number")&&global.isFinite(len)){arr=(slice.call(list))}else{throw(new TypeError("1st argument needs to be some kind of list."));}return arr});isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){make=(function(list){var elm,idx,arr=((isArguments(list)&&slice.call(list))||(isString(list)&&list.split(""))||(isArray(list)&&slice.call(list))||elm);if(!arr){idx=((list!==0)&&list&&list.length);if((typeof idx=="number")&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof list.item=="function"){while(--idx>=0){elm=list.item(idx);if((typeof elm!="undefined")||(idx in list)){arr[idx]=elm}}}else{while(--idx>=0){elm=list[idx];if((typeof elm!="undefined")||(idx in list)){arr[idx]=elm}}}}else{throw(new TypeError("1st argument needs to be some kind of list."));}}return arr})}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return make})("Array",".","make");sh=null;Arr=null;ProtoArr=null;ProtoObj=null;exposeImplementation=null;isFunction=null;delete sh;delete Arr;delete ProtoArr;delete ProtoObj;delete exposeImplementation;delete isFunction})();

- packed / shrinked           - 2.790 byte
(function(){var e=((this&&(this.window===this)&&window)||this),Arr=e.Array,ProtoArr=Arr.prototype,ProtoObj=e.Object.prototype,exposeImplementation=ProtoObj.toString,isFunction=(((typeof e.isFunction=="function")&&e.isFunction)||(function(a){return(typeof a=="function")}));Arr.isArray=e.isArray=((isFunction(Arr.isArray)&&Arr.isArray)||(isFunction(e.isArray)&&e.isArray)||(function(){var b=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})());Arr.isArgumentsArray=((isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray)||(function(){var d,regXBaseClass=(/^\[object\s+Object\]$/),expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(e,"length");d=(function(a){return(regXBaseClass.test(expose.call(a))&&!!a&&(typeof a.length=="number")&&!isEnumerable.call(a,"length"))})}catch(exc){d=(function(c){return(regXBaseClass.test(expose.call(c))&&!!c&&(typeof c.length=="number")&&!(function(a){var b;try{b=isEnumerable.call(a,"length")}catch(exc){b=true}return b})(c))})}return d})());Arr.make=(function(){var c,arr,str,doc=e.document,global=e,all=((doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName("*"))||[]),slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=((isFunction(e.isString)&&e.isString)||(function(){var b=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})());try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}c=(function(a){var b,len=((a||isString(a))&&a.length);if((typeof len=="number")&&global.isFinite(len)){b=(slice.call(a))}else{throw(new TypeError("1st argument needs to be some kind of list."));}return b});isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){c=(function(a){var b,idx,arr=((isArguments(a)&&slice.call(a))||(isString(a)&&a.split(""))||(isArray(a)&&slice.call(a))||b);if(!arr){idx=((a!==0)&&a&&a.length);if((typeof idx=="number")&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof a.item=="function"){while(--idx>=0){b=a.item(idx);if((typeof b!="undefined")||(idx in a)){arr[idx]=b}}}else{while(--idx>=0){b=a[idx];if((typeof b!="undefined")||(idx in a)){arr[idx]=b}}}}else{throw(new TypeError("1st argument needs to be some kind of list."));}}return arr})}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return c})("Array",".","make");e=null;Arr=null;ProtoArr=null;ProtoObj=null;exposeImplementation=null;isFunction=null;delete e;delete Arr;delete ProtoArr;delete ProtoObj;delete exposeImplementation;delete isFunction})();

- packed / shrinked / encoded - 2.111 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){m e=((D&&(D.P===D)&&P)||D),7=e.w,E=7.V,r=e.X.V,p=r.1i,h=(((i e.h=="1")&&e.h)||(1(a){9(i a=="1")}));7.g=e.g=((h(7.g)&&7.g)||(h(e.g)&&e.g)||(1(){m b=(/^\\[H\\s+w\\]$/),n=p;9(1(a){9 b.A(n.6(a))})})());7.C=((h(7.C)&&7.C)||(1(){m d,N=(/^\\[H\\s+X\\]$/),n=p,F=r.1a;M{F.6(e,"j");d=(1(a){9(N.A(n.6(a))&&!!a&&(i a.j=="z")&&!F.6(a,"j"))})}L(K){d=(1(c){9(N.A(n.6(c))&&!!c&&(i c.j=="z")&&!(1(a){m b;M{b=F.6(a,"j")}L(K){b=19}9 b})(c))})}9 d})());7.G=(1(){m c,2,o,q=e.1d,t=e,B=((q&&h(q.O)&&q.O("*"))||[]),k=E.k,y=7.C,g=7.g,u=((h(e.u)&&e.u)||(1(){m b=(/^\\[H\\s+1f\\]$/),n=p;9(1(a){9 b.A(n.6(a))})})());M{2=k.6(B);2=k.6(1c);o=2.1e("");l((2.j!=3)||(o!="w.G")){x(v S);}2=k.6(o);l((2.j!==10)||(2[5]!==".")){x(v S);}c=(1(a){m b,J=((a||u(a))&&a.j);l((i J=="z")&&t.W(J)){b=(k.6(a))}I{x(v Y("Z 11 12 13 14 15 16 17 18."));}9 b});y=f;g=f;8 y;8 g}L(K){c=(1(a){m b,4,2=((y(a)&&k.6(a))||(u(a)&&a.1h(""))||(g(a)&&k.6(a))||b);l(!2){4=((a!==0)&&a&&a.j);l((i 4=="z")&&t.W(4)){2=v t.w(t.1g.1b(0,4));l(i a.U=="1"){T(--4>=0){b=a.U(4);l((i b!="R")||(4 Q a)){2[4]=b}}}I{T(--4>=0){b=a[4];l((i b!="R")||(4 Q a)){2[4]=b}}}}I{x(v Y("Z 11 12 13 14 15 16 17 18."));}}9 2})}2=f;o=f;q=f;B=f;8 2;8 o;8 q;8 B;9 c})("w",".","G");e=f;7=f;E=f;r=f;p=f;h=f;8 e;8 7;8 E;8 r;8 p;8 h})();',62,81,'|function|arr||idx||call|Arr|delete|return||||||null|isArray|isFunction|typeof|length|slice|if|var|expose|str|exposeImplementation|doc|ProtoObj||global|isString|new|Array|throw|isArguments|number|test|all|isArgumentsArray|this|ProtoArr|isEnumerable|make|object|else|len|exc|catch|try|regXBaseClass|getElementsByTagName|window|in|undefined|Error|while|item|prototype|isFinite|Object|TypeError|1st||argument|needs|to|be|some|kind|of|list|true|propertyIsEnumerable|max|arguments|document|join|String|Math|split|toString'.split('|'),0,{}));


*/
