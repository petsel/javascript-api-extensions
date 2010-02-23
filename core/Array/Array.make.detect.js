

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

  Arr = sh.Array/*, Obj = sh.Object*/, ProtoArr = Arr.prototype, ProtoObj = sh.Object.prototype, exposeImplementation = ProtoObj.toString;
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

    ((typeof Arr.isArray == "function") && Arr.isArray) ||
    ((typeof sh.isArray == "function") && sh.isArray) ||

    (function () { // equal to : Arr.isArray = sh.isArray = (function () { ... });

      var regXBaseClass = (/^\[object\s+Array\]$/), expose = exposeImplementation;
      return (function (obj/*:[object|value]*/) {

        return regXBaseClass.test(expose.call(obj));
      });
    })()
  );


  Arr.isArgumentsArray = (

    ((typeof Arr.isArgumentsArray == "function") && Arr.isArgumentsArray) ||
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
    all = ((doc && (typeof doc.getElementsByTagName == "function") && doc.getElementsByTagName("*")) || []),
    slice = ProtoArr.slice,
    isArguments = Arr.isArgumentsArray,
    isArray = Arr.isArray,
    isString = (
      ((typeof sh.isString == "function") && sh.isString) ||
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


})();



print(Array.make(document.getElementsByTagName("*")));
print(Array.make((function(){return arguments})(1,2,3,4,5,6,7,8,9,0)));



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 2.519 byte
(function(){var sh=this&&this.window===this&&window||this,Arr=sh.Array,ProtoArr=Arr.prototype,ProtoObj=sh.Object.prototype,exposeImplementation=ProtoObj.toString;Arr.isArray=sh.isArray=typeof Arr.isArray=="function"&&Arr.isArray||typeof sh.isArray=="function"&&sh.isArray||function(){var regXBaseClass=/^\[object\s+Array\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();Arr.isArgumentsArray=typeof Arr.isArgumentsArray=="function"&&Arr.isArgumentsArray||function(){var isArguments,regXBaseClass=/^\[object\s+Object\]$/,expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(sh,"length");isArguments=function(obj){return regXBaseClass.test(expose.call(obj))&&!!obj&&typeof obj.length=="number"&&!isEnumerable.call(obj,"length")}}catch(exc){isArguments=function(obj){return regXBaseClass.test(expose.call(obj))&&!!obj&&typeof obj.length=="number"&&!function(elm){var isEnum;try{isEnum=isEnumerable.call(elm,"length")}catch(exc){isEnum=true}return isEnum}(obj)}}return isArguments}();Arr.make=function(){var make,arr,str,doc=sh.document,global=sh,all=doc&&typeof doc.getElementsByTagName=="function"&&doc.getElementsByTagName("*")||[],slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=typeof sh.isString=="function"&&sh.isString||function(){var regXBaseClass=/^\[object\s+String\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if(arr.length!=3||str!="Array.make")throw new Error;arr=slice.call(str);if(arr.length!==10||arr[5]!==".")throw new Error;make=function(list){var arr,len=(list||isString(list))&&list.length;return typeof len=="number"&&global.isFinite(len)&&slice.call(list)||arr};isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){make=function(list){var elm,idx,arr=isArguments(list)&&slice.call(list)||isString(list)&&list.split("")||isArray(list)&&slice.call(list)||elm;if(!arr){idx=list!==0&&list&&list.length;if(typeof idx=="number"&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof list.item=="function")while(--idx>=0){elm=list.item(idx);if(typeof elm!="undefined"||idx in list)arr[idx]=elm}else while(--idx>=0){elm=list[idx];if(typeof elm!="undefined"||idx in list)arr[idx]=elm}}}return arr}}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return make}("Array",".","make")})();

- Simple          - 1.755 byte
(function(){var c=this&&this.window===this&&window||this,g=c.Array,r=g.prototype,p=c.Object.prototype,n=p.toString;g.isArray=c.isArray=typeof g.isArray=="function"&&g.isArray||typeof c.isArray=="function"&&c.isArray||function(){var h=/^\[object\s+Array\]$/;return function(b){return h.test(n.call(b))}}();g.isArgumentsArray=typeof g.isArgumentsArray=="function"&&g.isArgumentsArray||function(){var h,b=/^\[object\s+Object\]$/,i=p.propertyIsEnumerable;try{i.call(c,"length");h=function(d){return b.test(n.call(d))&&!!d&&typeof d.length=="number"&&!i.call(d,"length")}}catch(l){h=function(d){return b.test(n.call(d))&&!!d&&typeof d.length=="number"&&!function(j){var k;try{k=i.call(j,"length")}catch(o){k=true}return k}(d)}}return h}();g.make=function(){var h,b,i,l=c.document,d=l&&typeof l.getElementsByTagName=="function"&&l.getElementsByTagName("*")||[],j=r.slice,k=g.isArgumentsArray,o=g.isArray,q=typeof c.isString=="function"&&c.isString||function(){var a=/^\[object\s+String\]$/;return function(e){return a.test(n.call(e))}}();try{b=j.call(d);b=j.call(arguments);i=b.join("");if(b.length!=3||i!="Array.make")throw new Error;b=j.call(i);if(b.length!==10||b[5]!==".")throw new Error;h=function(a){var e=(a||q(a))&&a.length;return typeof e=="number"&&c.isFinite(e)&&j.call(a)||void 0};o=k=null;delete k;delete o}catch(s){h=function(a){var e,f,m=k(a)&&j.call(a)||q(a)&&a.split("")||o(a)&&j.call(a)||e;if(!m){f=a!==0&&a&&a.length;if(typeof f=="number"&&c.isFinite(f)){m=new c.Array(c.Math.max(0,f));if(typeof a.item=="function")for(;--f>=0;){e=a.item(f);if(typeof e!="undefined"||f in a)m[f]=e}else for(;--f>=0;){e=a[f];if(typeof e!="undefined"||f in a)m[f]=e}}}return m}}d=l=i=b=null;delete b;delete i;delete l;delete d;return h}("Array",".","make")})();


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 2.635 byte
(function(){var sh=((this&&(this.window===this)&&window)||this),Arr=sh.Array,ProtoArr=Arr.prototype,ProtoObj=sh.Object.prototype,exposeImplementation=ProtoObj.toString;Arr.isArray=sh.isArray=(((typeof Arr.isArray=="function")&&Arr.isArray)||((typeof sh.isArray=="function")&&sh.isArray)||(function(){var regXBaseClass=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})());Arr.isArgumentsArray=(((typeof Arr.isArgumentsArray=="function")&&Arr.isArgumentsArray)||(function(){var isArguments,regXBaseClass=(/^\[object\s+Object\]$/),expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(sh,"length");isArguments=(function(obj){return(regXBaseClass.test(expose.call(obj))&&!!obj&&(typeof obj.length=="number")&&!isEnumerable.call(obj,"length"))})}catch(exc){isArguments=(function(obj){return(regXBaseClass.test(expose.call(obj))&&!!obj&&(typeof obj.length=="number")&&!(function(elm){var isEnum;try{isEnum=isEnumerable.call(elm,"length")}catch(exc){isEnum=true}return isEnum})(obj))})}return isArguments})());Arr.make=(function(){var make,arr,str,doc=sh.document,global=sh,all=((doc&&(typeof doc.getElementsByTagName=="function")&&doc.getElementsByTagName("*"))||[]),slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=(((typeof sh.isString=="function")&&sh.isString)||(function(){var regXBaseClass=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})());try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}make=(function(list){var arr,len=((list||isString(list))&&list.length);return(((typeof len=="number")&&global.isFinite(len)&&slice.call(list))||arr)});isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){make=(function(list){var elm,idx,arr=((isArguments(list)&&slice.call(list))||(isString(list)&&list.split(""))||(isArray(list)&&slice.call(list))||elm);if(!arr){idx=((list!==0)&&list&&list.length);if((typeof idx=="number")&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof list.item=="function"){while(--idx>=0){elm=list.item(idx);if((typeof elm!="undefined")||(idx in list)){arr[idx]=elm}}}else{while(--idx>=0){elm=list[idx];if((typeof elm!="undefined")||(idx in list)){arr[idx]=elm}}}}}return arr})}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return make})("Array",".","make")})();

- packed / shrinked           - 2.392 byte
(function(){var e=((this&&(this.window===this)&&window)||this),Arr=e.Array,ProtoArr=Arr.prototype,ProtoObj=e.Object.prototype,exposeImplementation=ProtoObj.toString;Arr.isArray=e.isArray=(((typeof Arr.isArray=="function")&&Arr.isArray)||((typeof e.isArray=="function")&&e.isArray)||(function(){var b=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})());Arr.isArgumentsArray=(((typeof Arr.isArgumentsArray=="function")&&Arr.isArgumentsArray)||(function(){var d,regXBaseClass=(/^\[object\s+Object\]$/),expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(e,"length");d=(function(a){return(regXBaseClass.test(expose.call(a))&&!!a&&(typeof a.length=="number")&&!isEnumerable.call(a,"length"))})}catch(exc){d=(function(c){return(regXBaseClass.test(expose.call(c))&&!!c&&(typeof c.length=="number")&&!(function(a){var b;try{b=isEnumerable.call(a,"length")}catch(exc){b=true}return b})(c))})}return d})());Arr.make=(function(){var c,arr,str,doc=e.document,global=e,all=((doc&&(typeof doc.getElementsByTagName=="function")&&doc.getElementsByTagName("*"))||[]),slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=(((typeof e.isString=="function")&&e.isString)||(function(){var b=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})());try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}c=(function(a){var b,len=((a||isString(a))&&a.length);return(((typeof len=="number")&&global.isFinite(len)&&slice.call(a))||b)});isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){c=(function(a){var b,idx,arr=((isArguments(a)&&slice.call(a))||(isString(a)&&a.split(""))||(isArray(a)&&slice.call(a))||b);if(!arr){idx=((a!==0)&&a&&a.length);if((typeof idx=="number")&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof a.item=="function"){while(--idx>=0){b=a.item(idx);if((typeof b!="undefined")||(idx in a)){arr[idx]=b}}}else{while(--idx>=0){b=a[idx];if((typeof b!="undefined")||(idx in a)){arr[idx]=b}}}}}return arr})}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return c})("Array",".","make")})();

- packed / shrinked / encoded - 1.899 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){i e=((u&&(u.O===u)&&O)||u),9=e.q,R=9.V,E=e.N.V,y=E.12;9.8=e.8=(((7 9.8=="1")&&9.8)||((7 e.8=="1")&&e.8)||(1(){i b=(/^\\[G\\s+q\\]$/),k=y;f(1(a){f b.x(k.4(a))})})());9.t=(((7 9.t=="1")&&9.t)||(1(){i d,H=(/^\\[G\\s+N\\]$/),k=y,w=E.11;C{w.4(e,"g");d=(1(a){f(H.x(k.4(a))&&!!a&&(7 a.g=="A")&&!w.4(a,"g"))})}I(B){d=(1(c){f(H.x(k.4(c))&&!!c&&(7 c.g=="A")&&!(1(a){i b;C{b=w.4(a,"g")}I(B){b=14}f b})(c))})}f d})());9.J=(1(){i c,2,m,n=e.Z,p=e,z=((n&&(7 n.S=="1")&&n.S("*"))||[]),h=R.h,v=9.t,8=9.8,r=(((7 e.r=="1")&&e.r)||(1(){i b=(/^\\[G\\s+15\\]$/),k=y;f(1(a){f b.x(k.4(a))})})());C{2=h.4(z);2=h.4(X);m=2.W("");j((2.g!=3)||(m!="q.J")){M(D T);}2=h.4(m);j((2.g!==10)||(2[5]!==".")){M(D T);}c=(1(a){i b,F=((a||r(a))&&a.g);f(((7 F=="A")&&p.U(F)&&h.4(a))||b)});v=l;8=l;o v;o 8}I(B){c=(1(a){i b,6,2=((v(a)&&h.4(a))||(r(a)&&a.17(""))||(8(a)&&h.4(a))||b);j(!2){6=((a!==0)&&a&&a.g);j((7 6=="A")&&p.U(6)){2=D p.q(p.16.Y(0,6));j(7 a.P=="1"){K(--6>=0){b=a.P(6);j((7 b!="L")||(6 Q a)){2[6]=b}}}13{K(--6>=0){b=a[6];j((7 b!="L")||(6 Q a)){2[6]=b}}}}}f 2})}2=l;m=l;n=l;z=l;o 2;o m;o n;o z;f c})("q",".","J")})();',62,70,'|function|arr||call||idx|typeof|isArray|Arr||||||return|length|slice|var|if|expose|null|str|doc|delete|global|Array|isString||isArgumentsArray|this|isArguments|isEnumerable|test|exposeImplementation|all|number|exc|try|new|ProtoObj|len|object|regXBaseClass|catch|make|while|undefined|throw|Object|window|item|in|ProtoArr|getElementsByTagName|Error|isFinite|prototype|join|arguments|max|document||propertyIsEnumerable|toString|else|true|String|Math|split'.split('|'),0,{}));


*/
