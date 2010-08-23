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
  var sh/*scripting_host|global_object*/ = this,


  Arr = sh.Array,/*
  Obj = sh.Object,*/
  ArrProto = Arr.prototype,
  ObjProto = sh.Object.prototype,


  regXBaseClassObject = (/^\[object\s+Object\]$/),
  regXBaseClassArguments = (/^\[object\s+Arguments\]$/),

  exposeImplementation = ObjProto.toString,


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
            isEnum = true; /* due to [propertyIsEnumerable]'s special internal use within client/js-engine specific [isArgumentsArray] method */
          }
          return isEnum;
        });
      })(ObjProto.propertyIsEnumerable);
    }
    return propertyIsEnumerable;
  })(),

  isFunction = (((typeof sh.isFunction == "function") && sh.isFunction) || (function (obj) {return (typeof obj == "function");})),

  isString = (
    (isFunction(sh.isString) && sh.isString) ||
    (function (regXBaseClass, expose) {
      return (function (obj/*:[object|value]*/) {

        return regXBaseClass.test(expose.call(obj));
      });
    })((/^\[object\s+String\]$/), exposeImplementation)
  );

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

            return (regXBaseClass.test(expose.call(obj)));
          });
        })(regXBaseClassArguments, exposeImplementation);

      } else {

        isArguments = (function (regXBaseClass, expose, isFinite, isEnumerable) {
          return (function (obj/*:[object|value]*/) {

          //return (!!obj && regXBaseClass.test(expose.call(obj)) && (typeof obj.length == "number") && isFinite(obj.length) && !isEnumerable(obj, "length") && (typeof obj.callee == "function"));
            return (!!obj && regXBaseClass.test(expose.call(obj)) && (typeof obj.length == "number") && isFinite(obj.length) && !isEnumerable(obj, "length"));
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
    var make, arr, str, doc = sh.document, slice = ArrProto.slice, coll = ((doc && doc.forms) || []), list = ((doc && isFunction(doc.getElementsByTagName) && doc.getElementsByTagName("")) || []);
    try {


    //[HTMLCollection] test in case this script runs within a certain W3C-DOM context (this test fails silently if there was no DOM at all).
      arr = slice.call(coll); // msie fails.

    //[NodeList] test in case this script runs within a certain W3C-DOM context (this test fails silently if there was no DOM at all).
      arr = slice.call(list); // msie fails.

    //[Arguments] test.
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


    //so far fastest available, most reliable [Array.make] implementation - throwing a type error (debug version) - supported by all browsers that pass all of the above tests.
      make = (function (slice, isString, isFinite) {
        return (function (list) {

          var arr, len = ((list || isString(list)) && list.length);
          if ((typeof len == "number") && isFinite(len)) { // detect invalid list structures.

            arr = (slice.call(list)/* || (new Arr(len))*/);
          } else {
            throw (new TypeError("1st argument needs to be some kind of list."));
          }
          return arr; // (arr || list); // (arr || []); // (arr || [list]); // there might be a debate on it.
        });
      })(slice, isString, sh.isFinite);


    } catch (exc) { // [exc]::[Error]


    //so far most reliable [Array.make] implementation - throwing a type error (debug version) - fallback for all browsers that do fail at least one of the above tests.
      make = (function (slice/*, ARRAY*/, isArray, isArguments, isString, isFinite, MATH_MAX) {
        return (function (list) {

          var elm, idx, arr = (((isArray(list) || isArguments(list)) && slice.call(list)) || (isString(list) && list.split("")) || elm); // [Array]/[Arguments] or [String] shortcut.
          if (!arr) {
          //idx = (list && list.length); // (((0) && (0).length) === 0) // ((0 && window.undefined) === 0) // true
            idx = ((list !== 0) && list && list.length); // prevent passing zero as an argument.
            if ((typeof idx == "number") && isFinite(idx)) { // detect invalid list structures.

            //arr = new ARRAY(MATH_MAX(0, idx));
              arr = []; arr.length = MATH_MAX(0, idx);

              if (typeof list.item == "function") {
                while (idx--) {
                  elm = list.item(idx);
                  if (idx in list) {
                    arr[idx] = elm;
                  }
                }
              } else {
                while (idx--) {
                  elm = list[idx];
                  if (idx in list) {
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
      })(slice/*, Arr*/, Arr.isArray, Arr.isArgumentsArray, isString, sh.isFinite, Math.max);
    }


  //clean up after
    arr = str = doc = slice = coll = list = null;
    delete arr; delete str; delete doc; delete slice; delete coll; delete list;


    return make;

  })("Array", ".", "make");


//clean up after
  isString = isFunction = propertyIsEnumerable = exposeImplementation = regXBaseClassArguments = regXBaseClassObject = ObjProto = ArrProto = Arr = sh = null;
  delete isString; delete isFunction; delete propertyIsEnumerable; delete exposeImplementation;
  delete regXBaseClassArguments; delete regXBaseClassObject;
  delete ObjProto; delete ArrProto; delete Arr; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*
print(Array.make(document.getElementsByTagName("*")));
print(Array.make((function(){return arguments})(1,2,3,4,5,6,7,8,9,0)));
*/


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 3.757 byte
(function(){var sh=this,Arr=sh.Array,ArrProto=Arr.prototype,ObjProto=sh.Object.prototype,regXBaseClassObject=/^\[object\s+Object\]$/,regXBaseClassArguments=/^\[object\s+Arguments\]$/,exposeImplementation=ObjProto.toString,propertyIsEnumerable=function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=function(isEnumerable){return function(obj,key){return isEnumerable.call(obj,key)}}(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=function(isEnumerable){return function(obj,key){var isEnum;try{isEnum=isEnumerable.call(obj,key)}catch(exc){isEnum=true}return isEnum}}(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable}(),isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"},isString=isFunction(sh.isString)&&sh.isString||function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+String\]$/,exposeImplementation);Arr.isArray=isFunction(Arr.isArray)&&Arr.isArray||isFunction(sh.isArray)&&sh.isArray||function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+Array\]$/,exposeImplementation);Arr.isArgumentsArray=isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray||isFunction(sh.isArgumentsArray)&&sh.isArgumentsArray||function(){var isArguments;if(function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))}())isArguments=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(regXBaseClassArguments,exposeImplementation);else isArguments=function(regXBaseClass,expose,isFinite,isEnumerable){return function(obj){return!!obj&&regXBaseClass.test(expose.call(obj))&&typeof obj.length=="number"&&isFinite(obj.length)&&!isEnumerable(obj,"length")}}(regXBaseClassObject,exposeImplementation,sh.isFinite,propertyIsEnumerable);return isArguments}();Arr.make=function(){var make,arr,str,doc=sh.document,slice=ArrProto.slice,coll=doc&&doc.forms||[],list=doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName("")||[];try{arr=slice.call(coll);arr=slice.call(list);arr=slice.call(arguments);str=arr.join("");if(arr.length!=3||str!="Array.make")throw new Error;arr=slice.call(str);if(arr.length!==10||arr[5]!==".")throw new Error;make=function(slice,isString,isFinite){return function(list){var arr,len=(list||isString(list))&&list.length;if(typeof len=="number"&&isFinite(len))arr=slice.call(list);else throw new TypeError("1st argument needs to be some kind of list.");return arr}}(slice,isString,sh.isFinite)}catch(exc){make=function(slice,isArray,isArguments,isString,isFinite,MATH_MAX){return function(list){var elm,idx,arr=(isArray(list)||isArguments(list))&&slice.call(list)||isString(list)&&list.split("")||elm;if(!arr){idx=list!==0&&list&&list.length;if(typeof idx=="number"&&isFinite(idx)){arr=[];arr.length=MATH_MAX(0,idx);if(typeof list.item=="function")while(idx--){elm=list.item(idx);if(idx in list)arr[idx]=elm}else while(idx--){elm=list[idx];if(idx in list)arr[idx]=elm}}else throw new TypeError("1st argument needs to be some kind of list.");}return arr}}(slice,Arr.isArray,Arr.isArgumentsArray,isString,sh.isFinite,Math.max)}arr=str=doc=slice=coll=list=null;delete arr;delete str;delete doc;delete slice;delete coll;delete list;return make}("Array",".","make");isString=isFunction=propertyIsEnumerable=exposeImplementation=regXBaseClassArguments=regXBaseClassObject=ObjProto=ArrProto=Arr=sh=null;delete isString;delete isFunction;delete propertyIsEnumerable;delete exposeImplementation;delete regXBaseClassArguments;delete regXBaseClassObject;delete ObjProto;delete ArrProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- Simple          - 2.327 byte
(function(){var e=this,h=e.Array,u=h.prototype,n=e.Object.prototype,v=/^\[object\s+Object\]$/,q=/^\[object\s+Arguments\]$/,l=n.toString,w=function(){var c;try{n.propertyIsEnumerable.call(null,"length");c=function(d){return function(f,b){return d.call(f,b)}}(n.propertyIsEnumerable)}catch(a){c=function(d){return function(f,b){var m;try{m=d.call(f,b)}catch(r){m=true}return m}}(n.propertyIsEnumerable)}return c}(),j=typeof e.isFunction=="function"&&e.isFunction||function(c){return typeof c=="function"},s=j(e.isString)&&e.isString||function(c,a){return function(d){return c.test(a.call(d))}}(/^\[object\s+String\]$/,l);h.isArray=j(h.isArray)&&h.isArray||j(e.isArray)&&e.isArray||function(c,a){return function(d){return c.test(a.call(d))}}(/^\[object\s+Array\]$/,l);h.isArgumentsArray=j(h.isArgumentsArray)&&h.isArgumentsArray||j(e.isArgumentsArray)&&e.isArgumentsArray||function(){return function(){return q.test(l.call(arguments))}()?function(c,a){return function(d){return c.test(a.call(d))}}(q,l):function(c,a,d,f){return function(b){return!!b&&c.test(a.call(b))&&typeof b.length=="number"&&d(b.length)&&!f(b,"length")}}(v,l,e.isFinite,w)}();h.make=function(){var c,a,d,f=e.document,b=u.slice,m=f&&f.forms||[],r=f&&j(f.getElementsByTagName)&&f.getElementsByTagName("")||[];try{a=b.call(m);a=b.call(r);a=b.call(arguments);d=a.join("");if(a.length!=3||d!="Array.make")throw Error();a=b.call(d);if(a.length!==10||a[5]!==".")throw Error();c=function(x,y,z){return function(k){var t=(k||y(k))&&k.length;if(typeof t=="number"&&z(t))k=x.call(k);else throw new TypeError("1st argument needs to be some kind of list.");return k}}(b,s,e.isFinite)}catch(B){c=function(x,y,z,k,t,A){return function(g){var p,i,o=(y(g)||z(g))&&x.call(g)||k(g)&&g.split("")||p;if(!o){i=g!==0&&g&&g.length;if(typeof i=="number"&&t(i)){o=[];o.length=A(0,i);if(typeof g.item=="function")for(;i--;){p=g.item(i);if(i in g)o[i]=p}else for(;i--;){p=g[i];if(i in g)o[i]=p}}else throw new TypeError("1st argument needs to be some kind of list.");}return o}}(b,h.isArray,h.isArgumentsArray,s,e.isFinite,Math.max)}a=d=f=b=m=r=null;delete a;delete d;delete f;delete b;delete m;delete r;return c}("Array",".","make");s=j=w=l=q=v=n=u=h=e=null;delete s;delete j;delete w;delete l;delete q;delete v;delete n;delete u;delete h;delete e;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 3.880 byte
(function(){var sh=this,Arr=sh.Array,ArrProto=Arr.prototype,ObjProto=sh.Object.prototype,regXBaseClassObject=(/^\[object\s+Object\]$/),regXBaseClassArguments=(/^\[object\s+Arguments\]$/),exposeImplementation=ObjProto.toString,propertyIsEnumerable=(function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=(function(isEnumerable){return(function(obj,key){return isEnumerable.call(obj,key)})})(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=(function(isEnumerable){return(function(obj,key){var isEnum;try{isEnum=isEnumerable.call(obj,key)}catch(exc){isEnum=true}return isEnum})})(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable})(),isFunction=(((typeof sh.isFunction=="function")&&sh.isFunction)||(function(obj){return(typeof obj=="function")})),isString=((isFunction(sh.isString)&&sh.isString)||(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+String\]$/),exposeImplementation));Arr.isArray=((isFunction(Arr.isArray)&&Arr.isArray)||(isFunction(sh.isArray)&&sh.isArray)||(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+Array\]$/),exposeImplementation));Arr.isArgumentsArray=((isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray)||(isFunction(sh.isArgumentsArray)&&sh.isArgumentsArray)||(function(){var isArguments;if((function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))})()){isArguments=(function(regXBaseClass,expose){return(function(obj){return(regXBaseClass.test(expose.call(obj)))})})(regXBaseClassArguments,exposeImplementation)}else{isArguments=(function(regXBaseClass,expose,isFinite,isEnumerable){return(function(obj){return(!!obj&&regXBaseClass.test(expose.call(obj))&&(typeof obj.length=="number")&&isFinite(obj.length)&&!isEnumerable(obj,"length"))})})(regXBaseClassObject,exposeImplementation,sh.isFinite,propertyIsEnumerable)}return isArguments})());Arr.make=(function(){var make,arr,str,doc=sh.document,slice=ArrProto.slice,coll=((doc&&doc.forms)||[]),list=((doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName(""))||[]);try{arr=slice.call(coll);arr=slice.call(list);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}make=(function(slice,isString,isFinite){return(function(list){var arr,len=((list||isString(list))&&list.length);if((typeof len=="number")&&isFinite(len)){arr=(slice.call(list))}else{throw(new TypeError("1st argument needs to be some kind of list."));}return arr})})(slice,isString,sh.isFinite)}catch(exc){make=(function(slice,isArray,isArguments,isString,isFinite,MATH_MAX){return(function(list){var elm,idx,arr=(((isArray(list)||isArguments(list))&&slice.call(list))||(isString(list)&&list.split(""))||elm);if(!arr){idx=((list!==0)&&list&&list.length);if((typeof idx=="number")&&isFinite(idx)){arr=[];arr.length=MATH_MAX(0,idx);if(typeof list.item=="function"){while(idx--){elm=list.item(idx);if(idx in list){arr[idx]=elm}}}else{while(idx--){elm=list[idx];if(idx in list){arr[idx]=elm}}}}else{throw(new TypeError("1st argument needs to be some kind of list."));}}return arr})})(slice,Arr.isArray,Arr.isArgumentsArray,isString,sh.isFinite,Math.max)}arr=str=doc=slice=coll=list=null;delete arr;delete str;delete doc;delete slice;delete coll;delete list;return make})("Array",".","make");isString=isFunction=propertyIsEnumerable=exposeImplementation=regXBaseClassArguments=regXBaseClassObject=ObjProto=ArrProto=Arr=sh=null;delete isString;delete isFunction;delete propertyIsEnumerable;delete exposeImplementation;delete regXBaseClassArguments;delete regXBaseClassObject;delete ObjProto;delete ArrProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 3.338 byte
(function(){var j=this,Arr=j.Array,ArrProto=Arr.prototype,ObjProto=j.Object.prototype,regXBaseClassObject=(/^\[object\s+Object\]$/),regXBaseClassArguments=(/^\[object\s+Arguments\]$/),exposeImplementation=ObjProto.toString,propertyIsEnumerable=(function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=(function(c){return(function(a,b){return c.call(a,b)})})(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=(function(d){return(function(a,b){var c;try{c=d.call(a,b)}catch(exc){c=true}return c})})(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable})(),isFunction=(((typeof j.isFunction=="function")&&j.isFunction)||(function(a){return(typeof a=="function")})),isString=((isFunction(j.isString)&&j.isString)||(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+String\]$/),exposeImplementation));Arr.isArray=((isFunction(Arr.isArray)&&Arr.isArray)||(isFunction(j.isArray)&&j.isArray)||(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+Array\]$/),exposeImplementation));Arr.isArgumentsArray=((isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray)||(isFunction(j.isArgumentsArray)&&j.isArgumentsArray)||(function(){var f;if((function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))})()){f=(function(b,c){return(function(a){return(b.test(c.call(a)))})})(regXBaseClassArguments,exposeImplementation)}else{f=(function(b,c,d,e){return(function(a){return(!!a&&b.test(c.call(a))&&(typeof a.length=="number")&&d(a.length)&&!e(a,"length"))})})(regXBaseClassObject,exposeImplementation,j.isFinite,propertyIsEnumerable)}return f})());Arr.make=(function(){var i,arr,str,doc=j.document,slice=ArrProto.slice,coll=((doc&&doc.forms)||[]),list=((doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName(""))||[]);try{arr=slice.call(coll);arr=slice.call(list);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}i=(function(c,d,e){return(function(a){var b,len=((a||d(a))&&a.length);if((typeof len=="number")&&e(len)){b=(c.call(a))}else{throw(new TypeError("1st argument needs to be some kind of list."));}return b})})(slice,isString,j.isFinite)}catch(exc){i=(function(c,d,e,f,g,h){return(function(a){var b,idx,arr=(((d(a)||e(a))&&c.call(a))||(f(a)&&a.split(""))||b);if(!arr){idx=((a!==0)&&a&&a.length);if((typeof idx=="number")&&g(idx)){arr=[];arr.length=h(0,idx);if(typeof a.item=="function"){while(idx--){b=a.item(idx);if(idx in a){arr[idx]=b}}}else{while(idx--){b=a[idx];if(idx in a){arr[idx]=b}}}}else{throw(new TypeError("1st argument needs to be some kind of list."));}}return arr})})(slice,Arr.isArray,Arr.isArgumentsArray,isString,j.isFinite,Math.max)}arr=str=doc=slice=coll=list=null;delete arr;delete str;delete doc;delete slice;delete coll;delete list;return i})("Array",".","make");isString=isFunction=propertyIsEnumerable=exposeImplementation=regXBaseClassArguments=regXBaseClassObject=ObjProto=ArrProto=Arr=j=null;delete isString;delete isFunction;delete propertyIsEnumerable;delete exposeImplementation;delete regXBaseClassArguments;delete regXBaseClassObject;delete ObjProto;delete ArrProto;delete Arr;delete j;delete arguments.callee}).call(null);

- packed / shrinked / encoded - 2.270 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){t j=1k,9=j.E,F=9.12,u=j.18.12,I=(/^\\[K\\s+18\\]$/),A=(/^\\[K\\s+1b\\]$/),p=u.1f,l=(1(){t l;S{u.l.7(D,"n");l=(1(c){2(1(a,b){2 c.7(a,b)})})(u.l)}M(P){l=(1(d){2(1(a,b){t c;S{c=d.7(a,b)}M(P){c=1h}2 c})})(u.l)}2 l})(),k=(((x j.k=="1")&&j.k)||(1(a){2(x a=="1")})),r=((k(j.r)&&j.r)||(1(b,c){2(1(a){2 b.B(c.7(a))})})((/^\\[K\\s+1g\\]$/),p));9.z=((k(9.z)&&9.z)||(k(j.z)&&j.z)||(1(b,c){2(1(a){2 b.B(c.7(a))})})((/^\\[K\\s+E\\]$/),p));9.v=((k(9.v)&&9.v)||(k(j.v)&&j.v)||(1(){t f;o((1(){2 A.B(p.7(L))})()){f=(1(b,c){2(1(a){2(b.B(c.7(a)))})})(A,p)}C{f=(1(b,c,d,e){2(1(a){2(!!a&&b.B(c.7(a))&&(x a.n=="O")&&d(a.n)&&!e(a,"n"))})})(I,p,j.N,l)}2 f})());9.Q=(1(){t i,4,w,q=j.1a,m=F.m,J=((q&&q.1d)||[]),y=((q&&k(q.16)&&q.16(""))||[]);S{4=m.7(J);4=m.7(y);4=m.7(L);w=4.1c("");o((4.n!=3)||(w!="E.Q")){H(G 17);}4=m.7(w);o((4.n!==10)||(4[5]!==".")){H(G 17);}i=(1(c,d,e){2(1(a){t b,R=((a||d(a))&&a.n);o((x R=="O")&&e(R)){b=(c.7(a))}C{H(G 19("T U V W X Y Z 11 y."));}2 b})})(m,r,j.N)}M(P){i=(1(c,d,e,f,g,h){2(1(a){t b,8,4=(((d(a)||e(a))&&c.7(a))||(f(a)&&a.1e(""))||b);o(!4){8=((a!==0)&&a&&a.n);o((x 8=="O")&&g(8)){4=[];4.n=h(0,8);o(x a.13=="1"){14(8--){b=a.13(8);o(8 15 a){4[8]=b}}}C{14(8--){b=a[8];o(8 15 a){4[8]=b}}}}C{H(G 19("T U V W X Y Z 11 y."));}}2 4})})(m,9.z,9.v,r,j.N,1i.1j)}4=w=q=m=J=y=D;6 4;6 w;6 q;6 m;6 J;6 y;2 i})("E",".","Q");r=k=l=p=A=I=u=F=9=j=D;6 r;6 k;6 l;6 p;6 A;6 I;6 u;6 F;6 9;6 j;6 L.1l}).7(D);',62,84,'|function|return||arr||delete|call|idx|Arr|||||||||||isFunction|propertyIsEnumerable|slice|length|if|exposeImplementation|doc|isString||var|ObjProto|isArgumentsArray|str|typeof|list|isArray|regXBaseClassArguments|test|else|null|Array|ArrProto|new|throw|regXBaseClassObject|coll|object|arguments|catch|isFinite|number|exc|make|len|try|1st|argument|needs|to|be|some|kind||of|prototype|item|while|in|getElementsByTagName|Error|Object|TypeError|document|Arguments|join|forms|split|toString|String|true|Math|max|this|callee'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 2.042 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){9 e=1o,h=e.I,u=h.Y,n=e.15.Y,v=/^\\[H\\s+15\\]$/,q=/^\\[H\\s+1i\\]$/,l=n.1j,w=1(){9 c;N{n.P.6(J,"7");c=1(d){2 1(f,b){2 d.6(f,b)}}(n.P)}Q(a){c=1(d){2 1(f,b){9 m;N{m=d.6(f,b)}Q(r){m=1p}2 m}}(n.P)}2 c}(),j=E e.11=="1"&&e.11||1(c){2 E c=="1"},s=j(e.14)&&e.14||1(c,a){2 1(d){2 c.F(a.6(d))}}(/^\\[H\\s+1d\\]$/,l);h.D=j(h.D)&&h.D||j(e.D)&&e.D||1(c,a){2 1(d){2 c.F(a.6(d))}}(/^\\[H\\s+I\\]$/,l);h.C=j(h.C)&&h.C||j(e.C)&&e.C||1(){2 1(){2 q.F(l.6(R))}()?1(c,a){2 1(d){2 c.F(a.6(d))}}(q,l):1(c,a,d,f){2 1(b){2!!b&&c.F(a.6(b))&&E b.7=="K"&&d(b.7)&&!f(b,"7")}}(v,l,e.L,w)}();h.M=1(){9 c,a,d,f=e.1h,b=u.1k,m=f&&f.1f||[],r=f&&j(f.S)&&f.S("")||[];N{a=b.6(m);a=b.6(r);a=b.6(R);d=a.1e("");8(a.7!=3||d!="I.M")G 1c();a=b.6(d);8(a.7!==10||a[5]!==".")G 1c();c=1(x,y,z){2 1(k){9 t=(k||y(k))&&k.7;8(E t=="K"&&z(t))k=x.6(k);O G 1b T("1a U 19 V 18 W 17 X 16.");2 k}}(b,s,e.L)}Q(B){c=1(x,y,z,k,t,A){2 1(g){9 p,i,o=(y(g)||z(g))&&x.6(g)||k(g)&&g.1g("")||p;8(!o){i=g!==0&&g&&g.7;8(E i=="K"&&t(i)){o=[];o.7=A(0,i);8(E g.13=="1")Z(;i--;){p=g.13(i);8(i 12 g)o[i]=p}O Z(;i--;){p=g[i];8(i 12 g)o[i]=p}}O G 1b T("1a U 19 V 18 W 17 X 16.");}2 o}}(b,h.D,h.C,s,e.L,1l.1m)}a=d=f=b=m=r=J;4 a;4 d;4 f;4 b;4 m;4 r;2 c}("I",".","M");s=j=w=l=q=v=n=u=h=e=J;4 s;4 j;4 w;4 l;4 q;4 v;4 n;4 u;4 h;4 e;4 R.1n}).6(J);',62,88,'|function|return||delete||call|length|if|var|||||||||||||||||||||||||||||isArgumentsArray|isArray|typeof|test|throw|object|Array|null|number|isFinite|make|try|else|propertyIsEnumerable|catch|arguments|getElementsByTagName|TypeError|argument|to|some|of|prototype|for||isFunction|in|item|isString|Object|list|kind|be|needs|1st|new|Error|String|join|forms|split|document|Arguments|toString|slice|Math|max|callee|this|true'.split('|'),0,{}));


*/
