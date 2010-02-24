

/*
  - static only [[Array]] extensions that will
    create arrays and detect array structures.

  - none of the implementations is going to throw
    any single [[Error]] message.
    every method instead fails silently but still
    smart enough in case of getting invoked with
    invalid arguments.


  - list of implemented Array extension methods:

  [Array.isArray],          // type detection
  [Array.isArgumentsArray],

  [Array.make]              // generic creator


  copy and paste code beneath into [http://jconsole.com/] for quick testing:
*/


(function () {


  var sh/*global*/ = ((this && (this.window === this) && /*this.*/window) || this), // "scripting host" or "global object"

  Arr = sh.Array/*, Obj = sh.Object*/, ProtoArr = Arr.prototype, ProtoObj = sh.Object.prototype, exposeImplementation = ProtoObj.toString,

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


//clean up after
  sh = null; Arr = null; ProtoArr = null; ProtoObj = null; exposeImplementation = null; isFunction = null;
  delete sh; delete Arr; delete ProtoArr; delete ProtoObj; delete exposeImplementation; delete isFunction;

})();



print(Array.make(document.getElementsByTagName("*")));
print(Array.make((function(){return arguments})(1,2,3,4,5,6,7,8,9,0)));



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 2.775 byte
(function(){var sh=this&&this.window===this&&window||this,Arr=sh.Array,ProtoArr=Arr.prototype,ProtoObj=sh.Object.prototype,exposeImplementation=ProtoObj.toString,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"};Arr.isArray=sh.isArray=isFunction(Arr.isArray)&&Arr.isArray||isFunction(sh.isArray)&&sh.isArray||function(){var regXBaseClass=/^\[object\s+Array\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();Arr.isArgumentsArray=isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray||function(){var isArguments,regXBaseClass=/^\[object\s+Object\]$/,expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(sh,"length");isArguments=function(obj){return regXBaseClass.test(expose.call(obj))&&!!obj&&typeof obj.length=="number"&&!isEnumerable.call(obj,"length")}}catch(exc){isArguments=function(obj){return regXBaseClass.test(expose.call(obj))&&!!obj&&typeof obj.length=="number"&&!function(elm){var isEnum;try{isEnum=isEnumerable.call(elm,"length")}catch(exc){isEnum=true}return isEnum}(obj)}}return isArguments}();Arr.make=function(){var make,arr,str,doc=sh.document,global=sh,all=doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName("*")||[],slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=isFunction(sh.isString)&&sh.isString||function(){var regXBaseClass=/^\[object\s+String\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if(arr.length!=3||str!="Array.make")throw new Error;arr=slice.call(str);if(arr.length!==10||arr[5]!==".")throw new Error;make=function(list){var arr,len=(list||isString(list))&&list.length;return typeof len=="number"&&global.isFinite(len)&&slice.call(list)||arr};isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){make=function(list){var elm,idx,arr=isArguments(list)&&slice.call(list)||isString(list)&&list.split("")||isArray(list)&&slice.call(list)||elm;if(!arr){idx=list!==0&&list&&list.length;if(typeof idx=="number"&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof list.item=="function")while(--idx>=0){elm=list.item(idx);if(typeof elm!="undefined"||idx in list)arr[idx]=elm}else while(--idx>=0){elm=list[idx];if(typeof elm!="undefined"||idx in list)arr[idx]=elm}}}return arr}}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return make}("Array",".","make");sh=null;Arr=null;ProtoArr=null;ProtoObj=null;exposeImplementation=null;isFunction=null;delete sh;delete Arr;delete ProtoArr;delete ProtoObj;delete exposeImplementation;delete isFunction})();

- Simple          - 1.852 byte
(function(){var b=this&&this.window===this&&window||this,f=b.Array,s=f.prototype,q=b.Object.prototype,n=q.toString,l=typeof b.isFunction=="function"&&b.isFunction||function(h){return typeof h=="function"};f.isArray=b.isArray=l(f.isArray)&&f.isArray||l(b.isArray)&&b.isArray||function(){var h=/^\[object\s+Array\]$/,c=n;return function(i){return h.test(c.call(i))}}();f.isArgumentsArray=l(f.isArgumentsArray)&&f.isArgumentsArray||function(){var h,c=/^\[object\s+Object\]$/,i=n,j=q.propertyIsEnumerable;try{j.call(b,"length");h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!j.call(e,"length")}}catch(o){h=function(e){return c.test(i.call(e))&&!!e&&typeof e.length=="number"&&!function(k){var m;try{m=j.call(k,"length")}catch(r){m=true}return m}(e)}}return h}();f.make=function(){var h,c,i,j=b.document,o=b,e=j&&l(j.getElementsByTagName)&&j.getElementsByTagName("*")||[],k=s.slice,m=f.isArgumentsArray,r=f.isArray,t=l(b.isString)&&b.isString||function(){var a=/^\[object\s+String\]$/,g=n;return function(d){return a.test(g.call(d))}}();try{c=k.call(e);c=k.call(arguments);i=c.join("");if(c.length!=3||i!="Array.make")throw new Error;c=k.call(i);if(c.length!==10||c[5]!==".")throw new Error;h=function(a){var g=(a||t(a))&&a.length;return typeof g=="number"&&o.isFinite(g)&&k.call(a)||void 0};r=m=null;delete m;delete r}catch(u){h=function(a){var g,d,p=m(a)&&k.call(a)||t(a)&&a.split("")||r(a)&&k.call(a)||g;if(!p){d=a!==0&&a&&a.length;if(typeof d=="number"&&o.isFinite(d)){p=new o.Array(o.Math.max(0,d));if(typeof a.item=="function")for(;--d>=0;){g=a.item(d);if(typeof g!="undefined"||d in a)p[d]=g}else for(;--d>=0;){g=a[d];if(typeof g!="undefined"||d in a)p[d]=g}}}return p}}e=j=i=c=null;delete c;delete i;delete j;delete e;return h}("Array",".","make");l=n=q=s=f=b=null;delete b;delete f;delete s;delete q;delete n;delete l})();


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 2.890 byte
(function(){var sh=((this&&(this.window===this)&&window)||this),Arr=sh.Array,ProtoArr=Arr.prototype,ProtoObj=sh.Object.prototype,exposeImplementation=ProtoObj.toString,isFunction=(((typeof sh.isFunction=="function")&&sh.isFunction)||(function(obj){return(typeof obj=="function")}));Arr.isArray=sh.isArray=((isFunction(Arr.isArray)&&Arr.isArray)||(isFunction(sh.isArray)&&sh.isArray)||(function(){var regXBaseClass=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})());Arr.isArgumentsArray=((isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray)||(function(){var isArguments,regXBaseClass=(/^\[object\s+Object\]$/),expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(sh,"length");isArguments=(function(obj){return(regXBaseClass.test(expose.call(obj))&&!!obj&&(typeof obj.length=="number")&&!isEnumerable.call(obj,"length"))})}catch(exc){isArguments=(function(obj){return(regXBaseClass.test(expose.call(obj))&&!!obj&&(typeof obj.length=="number")&&!(function(elm){var isEnum;try{isEnum=isEnumerable.call(elm,"length")}catch(exc){isEnum=true}return isEnum})(obj))})}return isArguments})());Arr.make=(function(){var make,arr,str,doc=sh.document,global=sh,all=((doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName("*"))||[]),slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=((isFunction(sh.isString)&&sh.isString)||(function(){var regXBaseClass=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})());try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}make=(function(list){var arr,len=((list||isString(list))&&list.length);return(((typeof len=="number")&&global.isFinite(len)&&slice.call(list))||arr)});isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){make=(function(list){var elm,idx,arr=((isArguments(list)&&slice.call(list))||(isString(list)&&list.split(""))||(isArray(list)&&slice.call(list))||elm);if(!arr){idx=((list!==0)&&list&&list.length);if((typeof idx=="number")&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof list.item=="function"){while(--idx>=0){elm=list.item(idx);if((typeof elm!="undefined")||(idx in list)){arr[idx]=elm}}}else{while(--idx>=0){elm=list[idx];if((typeof elm!="undefined")||(idx in list)){arr[idx]=elm}}}}}return arr})}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return make})("Array",".","make");sh=null;Arr=null;ProtoArr=null;ProtoObj=null;exposeImplementation=null;isFunction=null;delete sh;delete Arr;delete ProtoArr;delete ProtoObj;delete exposeImplementation;delete isFunction})();

- packed / shrinked           - 2.639 byte
(function(){var e=((this&&(this.window===this)&&window)||this),Arr=e.Array,ProtoArr=Arr.prototype,ProtoObj=e.Object.prototype,exposeImplementation=ProtoObj.toString,isFunction=(((typeof e.isFunction=="function")&&e.isFunction)||(function(a){return(typeof a=="function")}));Arr.isArray=e.isArray=((isFunction(Arr.isArray)&&Arr.isArray)||(isFunction(e.isArray)&&e.isArray)||(function(){var b=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})());Arr.isArgumentsArray=((isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray)||(function(){var d,regXBaseClass=(/^\[object\s+Object\]$/),expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(e,"length");d=(function(a){return(regXBaseClass.test(expose.call(a))&&!!a&&(typeof a.length=="number")&&!isEnumerable.call(a,"length"))})}catch(exc){d=(function(c){return(regXBaseClass.test(expose.call(c))&&!!c&&(typeof c.length=="number")&&!(function(a){var b;try{b=isEnumerable.call(a,"length")}catch(exc){b=true}return b})(c))})}return d})());Arr.make=(function(){var c,arr,str,doc=e.document,global=e,all=((doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName("*"))||[]),slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=((isFunction(e.isString)&&e.isString)||(function(){var b=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})());try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}c=(function(a){var b,len=((a||isString(a))&&a.length);return(((typeof len=="number")&&global.isFinite(len)&&slice.call(a))||b)});isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){c=(function(a){var b,idx,arr=((isArguments(a)&&slice.call(a))||(isString(a)&&a.split(""))||(isArray(a)&&slice.call(a))||b);if(!arr){idx=((a!==0)&&a&&a.length);if((typeof idx=="number")&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof a.item=="function"){while(--idx>=0){b=a.item(idx);if((typeof b!="undefined")||(idx in a)){arr[idx]=b}}}else{while(--idx>=0){b=a[idx];if((typeof b!="undefined")||(idx in a)){arr[idx]=b}}}}}return arr})}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return c})("Array",".","make");e=null;Arr=null;ProtoArr=null;ProtoObj=null;exposeImplementation=null;isFunction=null;delete e;delete Arr;delete ProtoArr;delete ProtoObj;delete exposeImplementation;delete isFunction})();

- packed / shrinked / encoded - 1.974 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){k e=((B&&(B.M===B)&&M)||B),7=e.r,C=7.T,u=e.P.T,o=u.Z,h=(((i e.h=="1")&&e.h)||(1(a){8(i a=="1")}));7.g=e.g=((h(7.g)&&7.g)||(h(e.g)&&e.g)||(1(){k b=(/^\\[I\\s+r\\]$/),m=o;8(1(a){8 b.A(m.4(a))})})());7.y=((h(7.y)&&7.y)||(1(){k d,J=(/^\\[I\\s+P\\]$/),m=o,w=u.15;F{w.4(e,"j");d=(1(a){8(J.A(m.4(a))&&!!a&&(i a.j=="z")&&!w.4(a,"j"))})}E(L){d=(1(c){8(J.A(m.4(c))&&!!c&&(i c.j=="z")&&!(1(a){k b;F{b=w.4(a,"j")}E(L){b=16}8 b})(c))})}8 d})());7.K=(1(){k c,2,p,q=e.11,t=e,x=((q&&h(q.W)&&q.W("*"))||[]),l=C.l,D=7.y,g=7.g,v=((h(e.v)&&e.v)||(1(){k b=(/^\\[I\\s+18\\]$/),m=o;8(1(a){8 b.A(m.4(a))})})());F{2=l.4(x);2=l.4(X);p=2.Y("");n((2.j!=3)||(p!="r.K")){V(G O);}2=l.4(p);n((2.j!==10)||(2[5]!==".")){V(G O);}c=(1(a){k b,H=((a||v(a))&&a.j);8(((i H=="z")&&t.U(H)&&l.4(a))||b)});D=9;g=9;f D;f g}E(L){c=(1(a){k b,6,2=((D(a)&&l.4(a))||(v(a)&&a.12(""))||(g(a)&&l.4(a))||b);n(!2){6=((a!==0)&&a&&a.j);n((i 6=="z")&&t.U(6)){2=G t.r(t.13.14(0,6));n(i a.Q=="1"){R(--6>=0){b=a.Q(6);n((i b!="S")||(6 N a)){2[6]=b}}}17{R(--6>=0){b=a[6];n((i b!="S")||(6 N a)){2[6]=b}}}}}8 2})}2=9;p=9;q=9;x=9;f 2;f p;f q;f x;8 c})("r",".","K");e=9;7=9;C=9;u=9;o=9;h=9;f e;f 7;f C;f u;f o;f h})();',62,71,'|function|arr||call||idx|Arr|return|null||||||delete|isArray|isFunction|typeof|length|var|slice|expose|if|exposeImplementation|str|doc|Array||global|ProtoObj|isString|isEnumerable|all|isArgumentsArray|number|test|this|ProtoArr|isArguments|catch|try|new|len|object|regXBaseClass|make|exc|window|in|Error|Object|item|while|undefined|prototype|isFinite|throw|getElementsByTagName|arguments|join|toString||document|split|Math|max|propertyIsEnumerable|true|else|String'.split('|'),0,{}));


*/
