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
          return (((typeof len == "number") && isFinite(len) && slice.call(list)) || arr); // ( ... || list); // ( ... || []); // ( ... || [list]); // there might be a debate on it.
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


- Whitespace only - 3.608 byte
(function(){var sh=this,Arr=sh.Array,ArrProto=Arr.prototype,ObjProto=sh.Object.prototype,regXBaseClassObject=/^\[object\s+Object\]$/,regXBaseClassArguments=/^\[object\s+Arguments\]$/,exposeImplementation=ObjProto.toString,propertyIsEnumerable=function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=function(isEnumerable){return function(obj,key){return isEnumerable.call(obj,key)}}(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=function(isEnumerable){return function(obj,key){var isEnum;try{isEnum=isEnumerable.call(obj,key)}catch(exc){isEnum=true}return isEnum}}(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable}(),isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"},isString=isFunction(sh.isString)&&sh.isString||function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+String\]$/,exposeImplementation);Arr.isArray=isFunction(Arr.isArray)&&Arr.isArray||isFunction(sh.isArray)&&sh.isArray||function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+Array\]$/,exposeImplementation);Arr.isArgumentsArray=isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray||isFunction(sh.isArgumentsArray)&&sh.isArgumentsArray||function(){var isArguments;if(function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))}())isArguments=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(regXBaseClassArguments,exposeImplementation);else isArguments=function(regXBaseClass,expose,isFinite,isEnumerable){return function(obj){return!!obj&&regXBaseClass.test(expose.call(obj))&&typeof obj.length=="number"&&isFinite(obj.length)&&!isEnumerable(obj,"length")}}(regXBaseClassObject,exposeImplementation,sh.isFinite,propertyIsEnumerable);return isArguments}();Arr.make=function(){var make,arr,str,doc=sh.document,slice=ArrProto.slice,coll=doc&&doc.forms||[],list=doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName("")||[];try{arr=slice.call(coll);arr=slice.call(list);arr=slice.call(arguments);str=arr.join("");if(arr.length!=3||str!="Array.make")throw new Error;arr=slice.call(str);if(arr.length!==10||arr[5]!==".")throw new Error;make=function(slice,isString,isFinite){return function(list){var arr,len=(list||isString(list))&&list.length;return typeof len=="number"&&isFinite(len)&&slice.call(list)||arr}}(slice,isString,sh.isFinite)}catch(exc){make=function(slice,isArray,isArguments,isString,isFinite,MATH_MAX){return function(list){var elm,idx,arr=(isArray(list)||isArguments(list))&&slice.call(list)||isString(list)&&list.split("")||elm;if(!arr){idx=list!==0&&list&&list.length;if(typeof idx=="number"&&isFinite(idx)){arr=[];arr.length=MATH_MAX(0,idx);if(typeof list.item=="function")while(idx--){elm=list.item(idx);if(idx in list)arr[idx]=elm}else while(idx--){elm=list[idx];if(idx in list)arr[idx]=elm}}}return arr}}(slice,Arr.isArray,Arr.isArgumentsArray,isString,sh.isFinite,Math.max)}arr=str=doc=slice=coll=list=null;delete arr;delete str;delete doc;delete slice;delete coll;delete list;return make}("Array",".","make");isString=isFunction=propertyIsEnumerable=exposeImplementation=regXBaseClassArguments=regXBaseClassObject=ObjProto=ArrProto=Arr=sh=null;delete isString;delete isFunction;delete propertyIsEnumerable;delete exposeImplementation;delete regXBaseClassArguments;delete regXBaseClassObject;delete ObjProto;delete ArrProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- Simple          - 2.185 byte
(function(){var e=this,h=e.Array,u=h.prototype,m=e.Object.prototype,v=/^\[object\s+Object\]$/,q=/^\[object\s+Arguments\]$/,k=m.toString,w=function(){var c;try{m.propertyIsEnumerable.call(null,"length");c=function(d){return function(f,b){return d.call(f,b)}}(m.propertyIsEnumerable)}catch(a){c=function(d){return function(f,b){var l;try{l=d.call(f,b)}catch(r){l=true}return l}}(m.propertyIsEnumerable)}return c}(),j=typeof e.isFunction=="function"&&e.isFunction||function(c){return typeof c=="function"},s=j(e.isString)&&e.isString||function(c,a){return function(d){return c.test(a.call(d))}}(/^\[object\s+String\]$/,k);h.isArray=j(h.isArray)&&h.isArray||j(e.isArray)&&e.isArray||function(c,a){return function(d){return c.test(a.call(d))}}(/^\[object\s+Array\]$/,k);h.isArgumentsArray=j(h.isArgumentsArray)&&h.isArgumentsArray||j(e.isArgumentsArray)&&e.isArgumentsArray||function(){return function(){return q.test(k.call(arguments))}()?function(c,a){return function(d){return c.test(a.call(d))}}(q,k):function(c,a,d,f){return function(b){return!!b&&c.test(a.call(b))&&typeof b.length=="number"&&d(b.length)&&!f(b,"length")}}(v,k,e.isFinite,w)}();h.make=function(){var c,a,d,f=e.document,b=u.slice,l=f&&f.forms||[],r=f&&j(f.getElementsByTagName)&&f.getElementsByTagName("")||[];try{a=b.call(l);a=b.call(r);a=b.call(arguments);d=a.join("");if(a.length!=3||d!="Array.make")throw Error();a=b.call(d);if(a.length!==10||a[5]!==".")throw Error();c=function(x,y,z){return function(n){var t=(n||y(n))&&n.length;return typeof t=="number"&&z(t)&&x.call(n)||void 0}}(b,s,e.isFinite)}catch(B){c=function(x,y,z,n,t,A){return function(g){var p,i,o=(y(g)||z(g))&&x.call(g)||n(g)&&g.split("")||p;if(!o){i=g!==0&&g&&g.length;if(typeof i=="number"&&t(i)){o=[];o.length=A(0,i);if(typeof g.item=="function")for(;i--;){p=g.item(i);if(i in g)o[i]=p}else for(;i--;){p=g[i];if(i in g)o[i]=p}}}return o}}(b,h.isArray,h.isArgumentsArray,s,e.isFinite,Math.max)}a=d=f=b=l=r=null;delete a;delete d;delete f;delete b;delete l;delete r;return c}("Array",".","make");s=j=w=k=q=v=m=u=h=e=null;delete s;delete j;delete w;delete k;delete q;delete v;delete m;delete u;delete h;delete e;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 3.727 byte
(function(){var sh=this,Arr=sh.Array,ArrProto=Arr.prototype,ObjProto=sh.Object.prototype,regXBaseClassObject=(/^\[object\s+Object\]$/),regXBaseClassArguments=(/^\[object\s+Arguments\]$/),exposeImplementation=ObjProto.toString,propertyIsEnumerable=(function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=(function(isEnumerable){return(function(obj,key){return isEnumerable.call(obj,key)})})(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=(function(isEnumerable){return(function(obj,key){var isEnum;try{isEnum=isEnumerable.call(obj,key)}catch(exc){isEnum=true}return isEnum})})(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable})(),isFunction=(((typeof sh.isFunction=="function")&&sh.isFunction)||(function(obj){return(typeof obj=="function")})),isString=((isFunction(sh.isString)&&sh.isString)||(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+String\]$/),exposeImplementation));Arr.isArray=((isFunction(Arr.isArray)&&Arr.isArray)||(isFunction(sh.isArray)&&sh.isArray)||(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+Array\]$/),exposeImplementation));Arr.isArgumentsArray=((isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray)||(isFunction(sh.isArgumentsArray)&&sh.isArgumentsArray)||(function(){var isArguments;if((function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))})()){isArguments=(function(regXBaseClass,expose){return(function(obj){return(regXBaseClass.test(expose.call(obj)))})})(regXBaseClassArguments,exposeImplementation)}else{isArguments=(function(regXBaseClass,expose,isFinite,isEnumerable){return(function(obj){return(!!obj&&regXBaseClass.test(expose.call(obj))&&(typeof obj.length=="number")&&isFinite(obj.length)&&!isEnumerable(obj,"length"))})})(regXBaseClassObject,exposeImplementation,sh.isFinite,propertyIsEnumerable)}return isArguments})());Arr.make=(function(){var make,arr,str,doc=sh.document,slice=ArrProto.slice,coll=((doc&&doc.forms)||[]),list=((doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName(""))||[]);try{arr=slice.call(coll);arr=slice.call(list);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}make=(function(slice,isString,isFinite){return(function(list){var arr,len=((list||isString(list))&&list.length);return(((typeof len=="number")&&isFinite(len)&&slice.call(list))||arr)})})(slice,isString,sh.isFinite)}catch(exc){make=(function(slice,isArray,isArguments,isString,isFinite,MATH_MAX){return(function(list){var elm,idx,arr=(((isArray(list)||isArguments(list))&&slice.call(list))||(isString(list)&&list.split(""))||elm);if(!arr){idx=((list!==0)&&list&&list.length);if((typeof idx=="number")&&isFinite(idx)){arr=[];arr.length=MATH_MAX(0,idx);if(typeof list.item=="function"){while(idx--){elm=list.item(idx);if(idx in list){arr[idx]=elm}}}else{while(idx--){elm=list[idx];if(idx in list){arr[idx]=elm}}}}}return arr})})(slice,Arr.isArray,Arr.isArgumentsArray,isString,sh.isFinite,Math.max)}arr=str=doc=slice=coll=list=null;delete arr;delete str;delete doc;delete slice;delete coll;delete list;return make})("Array",".","make");isString=isFunction=propertyIsEnumerable=exposeImplementation=regXBaseClassArguments=regXBaseClassObject=ObjProto=ArrProto=Arr=sh=null;delete isString;delete isFunction;delete propertyIsEnumerable;delete exposeImplementation;delete regXBaseClassArguments;delete regXBaseClassObject;delete ObjProto;delete ArrProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 3.187 byte
(function(){var j=this,Arr=j.Array,ArrProto=Arr.prototype,ObjProto=j.Object.prototype,regXBaseClassObject=(/^\[object\s+Object\]$/),regXBaseClassArguments=(/^\[object\s+Arguments\]$/),exposeImplementation=ObjProto.toString,propertyIsEnumerable=(function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=(function(c){return(function(a,b){return c.call(a,b)})})(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=(function(d){return(function(a,b){var c;try{c=d.call(a,b)}catch(exc){c=true}return c})})(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable})(),isFunction=(((typeof j.isFunction=="function")&&j.isFunction)||(function(a){return(typeof a=="function")})),isString=((isFunction(j.isString)&&j.isString)||(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+String\]$/),exposeImplementation));Arr.isArray=((isFunction(Arr.isArray)&&Arr.isArray)||(isFunction(j.isArray)&&j.isArray)||(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+Array\]$/),exposeImplementation));Arr.isArgumentsArray=((isFunction(Arr.isArgumentsArray)&&Arr.isArgumentsArray)||(isFunction(j.isArgumentsArray)&&j.isArgumentsArray)||(function(){var f;if((function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))})()){f=(function(b,c){return(function(a){return(b.test(c.call(a)))})})(regXBaseClassArguments,exposeImplementation)}else{f=(function(b,c,d,e){return(function(a){return(!!a&&b.test(c.call(a))&&(typeof a.length=="number")&&d(a.length)&&!e(a,"length"))})})(regXBaseClassObject,exposeImplementation,j.isFinite,propertyIsEnumerable)}return f})());Arr.make=(function(){var i,arr,str,doc=j.document,slice=ArrProto.slice,coll=((doc&&doc.forms)||[]),list=((doc&&isFunction(doc.getElementsByTagName)&&doc.getElementsByTagName(""))||[]);try{arr=slice.call(coll);arr=slice.call(list);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}i=(function(c,d,e){return(function(a){var b,len=((a||d(a))&&a.length);return(((typeof len=="number")&&e(len)&&c.call(a))||b)})})(slice,isString,j.isFinite)}catch(exc){i=(function(c,d,e,f,g,h){return(function(a){var b,idx,arr=(((d(a)||e(a))&&c.call(a))||(f(a)&&a.split(""))||b);if(!arr){idx=((a!==0)&&a&&a.length);if((typeof idx=="number")&&g(idx)){arr=[];arr.length=h(0,idx);if(typeof a.item=="function"){while(idx--){b=a.item(idx);if(idx in a){arr[idx]=b}}}else{while(idx--){b=a[idx];if(idx in a){arr[idx]=b}}}}}return arr})})(slice,Arr.isArray,Arr.isArgumentsArray,isString,j.isFinite,Math.max)}arr=str=doc=slice=coll=list=null;delete arr;delete str;delete doc;delete slice;delete coll;delete list;return i})("Array",".","make");isString=isFunction=propertyIsEnumerable=exposeImplementation=regXBaseClassArguments=regXBaseClassObject=ObjProto=ArrProto=Arr=j=null;delete isString;delete isFunction;delete propertyIsEnumerable;delete exposeImplementation;delete regXBaseClassArguments;delete regXBaseClassObject;delete ObjProto;delete ArrProto;delete Arr;delete j;delete arguments.callee}).call(null);

- packed / shrinked / encoded - 1.974 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){u j=13,9=j.E,F=9.U,t=j.Y.U,G=(/^\\[H\\s+Y\\]$/),A=(/^\\[H\\s+11\\]$/),o=t.14,k=(1(){u k;M{t.k.7(D,"n");k=(1(c){2(1(a,b){2 c.7(a,b)})})(t.k)}O(P){k=(1(d){2(1(a,b){u c;M{c=d.7(a,b)}O(P){c=17}2 c})})(t.k)}2 k})(),l=(((y j.l=="1")&&j.l)||(1(a){2(y a=="1")})),r=((l(j.r)&&j.r)||(1(b,c){2(1(a){2 b.z(c.7(a))})})((/^\\[H\\s+1b\\]$/),o));9.v=((l(9.v)&&9.v)||(l(j.v)&&j.v)||(1(b,c){2(1(a){2 b.z(c.7(a))})})((/^\\[H\\s+E\\]$/),o));9.w=((l(9.w)&&9.w)||(l(j.w)&&j.w)||(1(){u f;p((1(){2 A.z(o.7(I))})()){f=(1(b,c){2(1(a){2(b.z(c.7(a)))})})(A,o)}T{f=(1(b,c,d,e){2(1(a){2(!!a&&b.z(c.7(a))&&(y a.n=="K")&&d(a.n)&&!e(a,"n"))})})(G,o,j.L,k)}2 f})());9.N=(1(){u i,4,x,q=j.18,m=F.m,B=((q&&q.12)||[]),C=((q&&l(q.Z)&&q.Z(""))||[]);M{4=m.7(B);4=m.7(C);4=m.7(I);x=4.16("");p((4.n!=3)||(x!="E.N")){Q(R S);}4=m.7(x);p((4.n!==10)||(4[5]!==".")){Q(R S);}i=(1(c,d,e){2(1(a){u b,J=((a||d(a))&&a.n);2(((y J=="K")&&e(J)&&c.7(a))||b)})})(m,r,j.L)}O(P){i=(1(c,d,e,f,g,h){2(1(a){u b,8,4=(((d(a)||e(a))&&c.7(a))||(f(a)&&a.15(""))||b);p(!4){8=((a!==0)&&a&&a.n);p((y 8=="K")&&g(8)){4=[];4.n=h(0,8);p(y a.V=="1"){W(8--){b=a.V(8);p(8 X a){4[8]=b}}}T{W(8--){b=a[8];p(8 X a){4[8]=b}}}}}2 4})})(m,9.v,9.w,r,j.L,19.1a)}4=x=q=m=B=C=D;6 4;6 x;6 q;6 m;6 B;6 C;2 i})("E",".","N");r=l=k=o=A=G=t=F=9=j=D;6 r;6 l;6 k;6 o;6 A;6 G;6 t;6 F;6 9;6 j;6 I.1c}).7(D);',62,75,'|function|return||arr||delete|call|idx|Arr|||||||||||propertyIsEnumerable|isFunction|slice|length|exposeImplementation|if|doc|isString||ObjProto|var|isArray|isArgumentsArray|str|typeof|test|regXBaseClassArguments|coll|list|null|Array|ArrProto|regXBaseClassObject|object|arguments|len|number|isFinite|try|make|catch|exc|throw|new|Error|else|prototype|item|while|in|Object|getElementsByTagName||Arguments|forms|this|toString|split|join|true|document|Math|max|String|callee'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 1.908 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){E e=19,h=e.H,u=h.Y,m=e.Z.Y,v=/^\\[G\\s+Z\\]$/,q=/^\\[G\\s+1d\\]$/,k=m.1f,w=1(){E c;P{m.O.6(I,"7");c=1(d){2 1(f,b){2 d.6(f,b)}}(m.O)}J(a){c=1(d){2 1(f,b){E l;P{l=d.6(f,b)}J(r){l=18}2 l}}(m.O)}2 c}(),j=9 e.R=="1"&&e.R||1(c){2 9 c=="1"},s=j(e.X)&&e.X||1(c,a){2 1(d){2 c.F(a.6(d))}}(/^\\[G\\s+11\\]$/,k);h.D=j(h.D)&&h.D||j(e.D)&&e.D||1(c,a){2 1(d){2 c.F(a.6(d))}}(/^\\[G\\s+H\\]$/,k);h.C=j(h.C)&&h.C||j(e.C)&&e.C||1(){2 1(){2 q.F(k.6(N))}()?1(c,a){2 1(d){2 c.F(a.6(d))}}(q,k):1(c,a,d,f){2 1(b){2!!b&&c.F(a.6(b))&&9 b.7=="K"&&d(b.7)&&!f(b,"7")}}(v,k,e.L,w)}();h.M=1(){E c,a,d,f=e.12,b=u.1c,l=f&&f.1b||[],r=f&&j(f.W)&&f.W("")||[];P{a=b.6(l);a=b.6(r);a=b.6(N);d=a.14("");8(a.7!=3||d!="H.M")S T();a=b.6(d);8(a.7!==10||a[5]!==".")S T();c=1(x,y,z){2 1(n){E t=(n||y(n))&&n.7;2 9 t=="K"&&z(t)&&x.6(n)||1e 0}}(b,s,e.L)}J(B){c=1(x,y,z,n,t,A){2 1(g){E p,i,o=(y(g)||z(g))&&x.6(g)||n(g)&&g.13("")||p;8(!o){i=g!==0&&g&&g.7;8(9 i=="K"&&t(i)){o=[];o.7=A(0,i);8(9 g.V=="1")Q(;i--;){p=g.V(i);8(i U g)o[i]=p}15 Q(;i--;){p=g[i];8(i U g)o[i]=p}}}2 o}}(b,h.D,h.C,s,e.L,1a.16)}a=d=f=b=l=r=I;4 a;4 d;4 f;4 b;4 l;4 r;2 c}("H",".","M");s=j=w=k=q=v=m=u=h=e=I;4 s;4 j;4 w;4 k;4 q;4 v;4 m;4 u;4 h;4 e;4 N.17}).6(I);',62,78,'|function|return||delete||call|length|if|typeof|||||||||||||||||||||||||||||isArgumentsArray|isArray|var|test|object|Array|null|catch|number|isFinite|make|arguments|propertyIsEnumerable|try|for|isFunction|throw|Error|in|item|getElementsByTagName|isString|prototype|Object||String|document|split|join|else|max|callee|true|this|Math|forms|slice|Arguments|void|toString'.split('|'),0,{}));


*/
