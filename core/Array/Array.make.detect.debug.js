

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


})();



print(Array.make(document.getElementsByTagName("*")));
print(Array.make((function(){return arguments})(1,2,3,4,5,6,7,8,9,0)));



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 2.668 byte
(function(){var sh=this&&this.window===this&&window||this,Arr=sh.Array,ProtoArr=Arr.prototype,ProtoObj=sh.Object.prototype,exposeImplementation=ProtoObj.toString;Arr.isArray=sh.isArray=typeof Arr.isArray=="function"&&Arr.isArray||typeof sh.isArray=="function"&&sh.isArray||function(){var regXBaseClass=/^\[object\s+Array\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();Arr.isArgumentsArray=typeof Arr.isArgumentsArray=="function"&&Arr.isArgumentsArray||function(){var isArguments,regXBaseClass=/^\[object\s+Object\]$/,expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(sh,"length");isArguments=function(obj){return regXBaseClass.test(expose.call(obj))&&!!obj&&typeof obj.length=="number"&&!isEnumerable.call(obj,"length")}}catch(exc){isArguments=function(obj){return regXBaseClass.test(expose.call(obj))&&!!obj&&typeof obj.length=="number"&&!function(elm){var isEnum;try{isEnum=isEnumerable.call(elm,"length")}catch(exc){isEnum=true}return isEnum}(obj)}}return isArguments}();Arr.make=function(){var make,arr,str,doc=sh.document,global=sh,all=doc&&typeof doc.getElementsByTagName=="function"&&doc.getElementsByTagName("*")||[],slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=typeof sh.isString=="function"&&sh.isString||function(){var regXBaseClass=/^\[object\s+String\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if(arr.length!=3||str!="Array.make")throw new Error;arr=slice.call(str);if(arr.length!==10||arr[5]!==".")throw new Error;make=function(list){var arr,len=(list||isString(list))&&list.length;if(typeof len=="number"&&global.isFinite(len))arr=slice.call(list);else throw new TypeError("1st argument needs to be some kind of list.");return arr};isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){make=function(list){var elm,idx,arr=isArguments(list)&&slice.call(list)||isString(list)&&list.split("")||isArray(list)&&slice.call(list)||elm;if(!arr){idx=list!==0&&list&&list.length;if(typeof idx=="number"&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof list.item=="function")while(--idx>=0){elm=list.item(idx);if(typeof elm!="undefined"||idx in list)arr[idx]=elm}else while(--idx>=0){elm=list[idx];if(typeof elm!="undefined"||idx in list)arr[idx]=elm}}else throw new TypeError("1st argument needs to be some kind of list.");}return arr}}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return make}("Array",".","make")})();

- Simple          - 1.897 byte
(function(){var c=this&&this.window===this&&window||this,g=c.Array,r=g.prototype,p=c.Object.prototype,n=p.toString;g.isArray=c.isArray=typeof g.isArray=="function"&&g.isArray||typeof c.isArray=="function"&&c.isArray||function(){var h=/^\[object\s+Array\]$/;return function(b){return h.test(n.call(b))}}();g.isArgumentsArray=typeof g.isArgumentsArray=="function"&&g.isArgumentsArray||function(){var h,b=/^\[object\s+Object\]$/,i=p.propertyIsEnumerable;try{i.call(c,"length");h=function(d){return b.test(n.call(d))&&!!d&&typeof d.length=="number"&&!i.call(d,"length")}}catch(l){h=function(d){return b.test(n.call(d))&&!!d&&typeof d.length=="number"&&!function(j){var k;try{k=i.call(j,"length")}catch(o){k=true}return k}(d)}}return h}();g.make=function(){var h,b,i,l=c.document,d=l&&typeof l.getElementsByTagName=="function"&&l.getElementsByTagName("*")||[],j=r.slice,k=g.isArgumentsArray,o=g.isArray,q=typeof c.isString=="function"&&c.isString||function(){var a=/^\[object\s+String\]$/;return function(e){return a.test(n.call(e))}}();try{b=j.call(d);b=j.call(arguments);i=b.join("");if(b.length!=3||i!="Array.make")throw new Error;b=j.call(i);if(b.length!==10||b[5]!==".")throw new Error;h=function(a){var e=(a||q(a))&&a.length;if(typeof e=="number"&&c.isFinite(e))a=j.call(a);else throw new TypeError("1st argument needs to be some kind of list.");return a};o=k=null;delete k;delete o}catch(s){h=function(a){var e,f,m=k(a)&&j.call(a)||q(a)&&a.split("")||o(a)&&j.call(a)||e;if(!m){f=a!==0&&a&&a.length;if(typeof f=="number"&&c.isFinite(f)){m=new c.Array(c.Math.max(0,f));if(typeof a.item=="function")for(;--f>=0;){e=a.item(f);if(typeof e!="undefined"||f in a)m[f]=e}else for(;--f>=0;){e=a[f];if(typeof e!="undefined"||f in a)m[f]=e}}else throw new TypeError("1st argument needs to be some kind of list.");}return m}}d=l=i=b=null;delete b;delete i;delete l;delete d;return h}("Array",".","make")})();


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 2.788 byte
(function(){var sh=((this&&(this.window===this)&&window)||this),Arr=sh.Array,ProtoArr=Arr.prototype,ProtoObj=sh.Object.prototype,exposeImplementation=ProtoObj.toString;Arr.isArray=sh.isArray=(((typeof Arr.isArray=="function")&&Arr.isArray)||((typeof sh.isArray=="function")&&sh.isArray)||(function(){var regXBaseClass=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})());Arr.isArgumentsArray=(((typeof Arr.isArgumentsArray=="function")&&Arr.isArgumentsArray)||(function(){var isArguments,regXBaseClass=(/^\[object\s+Object\]$/),expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(sh,"length");isArguments=(function(obj){return(regXBaseClass.test(expose.call(obj))&&!!obj&&(typeof obj.length=="number")&&!isEnumerable.call(obj,"length"))})}catch(exc){isArguments=(function(obj){return(regXBaseClass.test(expose.call(obj))&&!!obj&&(typeof obj.length=="number")&&!(function(elm){var isEnum;try{isEnum=isEnumerable.call(elm,"length")}catch(exc){isEnum=true}return isEnum})(obj))})}return isArguments})());Arr.make=(function(){var make,arr,str,doc=sh.document,global=sh,all=((doc&&(typeof doc.getElementsByTagName=="function")&&doc.getElementsByTagName("*"))||[]),slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=(((typeof sh.isString=="function")&&sh.isString)||(function(){var regXBaseClass=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})());try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}make=(function(list){var arr,len=((list||isString(list))&&list.length);if((typeof len=="number")&&global.isFinite(len)){arr=(slice.call(list))}else{throw(new TypeError("1st argument needs to be some kind of list."));}return arr});isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){make=(function(list){var elm,idx,arr=((isArguments(list)&&slice.call(list))||(isString(list)&&list.split(""))||(isArray(list)&&slice.call(list))||elm);if(!arr){idx=((list!==0)&&list&&list.length);if((typeof idx=="number")&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof list.item=="function"){while(--idx>=0){elm=list.item(idx);if((typeof elm!="undefined")||(idx in list)){arr[idx]=elm}}}else{while(--idx>=0){elm=list[idx];if((typeof elm!="undefined")||(idx in list)){arr[idx]=elm}}}}else{throw(new TypeError("1st argument needs to be some kind of list."));}}return arr})}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return make})("Array",".","make")})();

- packed / shrinked           - 2.543 byte
(function(){var e=((this&&(this.window===this)&&window)||this),Arr=e.Array,ProtoArr=Arr.prototype,ProtoObj=e.Object.prototype,exposeImplementation=ProtoObj.toString;Arr.isArray=e.isArray=(((typeof Arr.isArray=="function")&&Arr.isArray)||((typeof e.isArray=="function")&&e.isArray)||(function(){var b=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})());Arr.isArgumentsArray=(((typeof Arr.isArgumentsArray=="function")&&Arr.isArgumentsArray)||(function(){var d,regXBaseClass=(/^\[object\s+Object\]$/),expose=exposeImplementation,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(e,"length");d=(function(a){return(regXBaseClass.test(expose.call(a))&&!!a&&(typeof a.length=="number")&&!isEnumerable.call(a,"length"))})}catch(exc){d=(function(c){return(regXBaseClass.test(expose.call(c))&&!!c&&(typeof c.length=="number")&&!(function(a){var b;try{b=isEnumerable.call(a,"length")}catch(exc){b=true}return b})(c))})}return d})());Arr.make=(function(){var c,arr,str,doc=e.document,global=e,all=((doc&&(typeof doc.getElementsByTagName=="function")&&doc.getElementsByTagName("*"))||[]),slice=ProtoArr.slice,isArguments=Arr.isArgumentsArray,isArray=Arr.isArray,isString=(((typeof e.isString=="function")&&e.isString)||(function(){var b=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})());try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}c=(function(a){var b,len=((a||isString(a))&&a.length);if((typeof len=="number")&&global.isFinite(len)){b=(slice.call(a))}else{throw(new TypeError("1st argument needs to be some kind of list."));}return b});isArguments=null;isArray=null;delete isArguments;delete isArray}catch(exc){c=(function(a){var b,idx,arr=((isArguments(a)&&slice.call(a))||(isString(a)&&a.split(""))||(isArray(a)&&slice.call(a))||b);if(!arr){idx=((a!==0)&&a&&a.length);if((typeof idx=="number")&&global.isFinite(idx)){arr=new global.Array(global.Math.max(0,idx));if(typeof a.item=="function"){while(--idx>=0){b=a.item(idx);if((typeof b!="undefined")||(idx in a)){arr[idx]=b}}}else{while(--idx>=0){b=a[idx];if((typeof b!="undefined")||(idx in a)){arr[idx]=b}}}}else{throw(new TypeError("1st argument needs to be some kind of list."));}}return arr})}arr=null;str=null;doc=null;all=null;delete arr;delete str;delete doc;delete all;return c})("Array",".","make")})();

- packed / shrinked / encoded - 2.035 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){j e=((x&&(x.P===x)&&P)||x),f=e.q,Z=f.13,D=e.O.13,y=D.1a;f.9=e.9=(((7 f.9=="1")&&f.9)||((7 e.9=="1")&&e.9)||(1(){j b=(/^\\[E\\s+q\\]$/),k=y;8(1(a){8 b.B(k.4(a))})})());f.A=(((7 f.A=="1")&&f.A)||(1(){j d,F=(/^\\[E\\s+O\\]$/),k=y,z=D.1b;J{z.4(e,"g");d=(1(a){8(F.B(k.4(a))&&!!a&&(7 a.g=="C")&&!z.4(a,"g"))})}K(G){d=(1(c){8(F.B(k.4(c))&&!!c&&(7 c.g=="C")&&!(1(a){j b;J{b=z.4(a,"g")}K(G){b=1d}8 b})(c))})}8 d})());f.L=(1(){j c,2,m,l=e.1g,r=e,u=((l&&(7 l.11=="1")&&l.11("*"))||[]),i=Z.i,v=f.A,9=f.9,p=(((7 e.p=="1")&&e.p)||(1(){j b=(/^\\[E\\s+1h\\]$/),k=y;8(1(a){8 b.B(k.4(a))})})());J{2=i.4(u);2=i.4(18);m=2.19("");h((2.g!=3)||(m!="q.L")){w(t 12);}2=i.4(m);h((2.g!==10)||(2[5]!==".")){w(t 12);}c=(1(a){j b,H=((a||p(a))&&a.g);h((7 H=="C")&&r.N(H)){b=(i.4(a))}I{w(t M("Q R S T U V W X Y."));}8 b});v=n;9=n;o v;o 9}K(G){c=(1(a){j b,6,2=((v(a)&&i.4(a))||(p(a)&&a.1c(""))||(9(a)&&i.4(a))||b);h(!2){6=((a!==0)&&a&&a.g);h((7 6=="C")&&r.N(6)){2=t r.q(r.1e.1f(0,6));h(7 a.14=="1"){15(--6>=0){b=a.14(6);h((7 b!="16")||(6 17 a)){2[6]=b}}}I{15(--6>=0){b=a[6];h((7 b!="16")||(6 17 a)){2[6]=b}}}}I{w(t M("Q R S T U V W X Y."));}}8 2})}2=n;m=n;l=n;u=n;o 2;o m;o l;o u;8 c})("q",".","L")})();',62,80,'|function|arr||call||idx|typeof|return|isArray||||||Arr|length|if|slice|var|expose|doc|str|null|delete|isString|Array|global||new|all|isArguments|throw|this|exposeImplementation|isEnumerable|isArgumentsArray|test|number|ProtoObj|object|regXBaseClass|exc|len|else|try|catch|make|TypeError|isFinite|Object|window|1st|argument|needs|to|be|some|kind|of|list|ProtoArr||getElementsByTagName|Error|prototype|item|while|undefined|in|arguments|join|toString|propertyIsEnumerable|split|true|Math|max|document|String'.split('|'),0,{}));


*/
