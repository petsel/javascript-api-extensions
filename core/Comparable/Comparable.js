(function (module_factory) {


  var
    global = this,

    define = global.define,
    module = global.module,
  //YUI = global.YUI,

    MODULE_NAME = "Comparable"
  ;


//if ((typeof define == "function") && define.amd) {                            // AMD
  if (typeof define == "function") {                                            // AMD, RequireJS

    define(module_factory);

  } else if ((typeof module == "object") && module && module.exports) {         // NODE

    module.exports = module_factory();

  }/* else if ((typeof YUI == "function") && (typeof YUI.add == "function")) {  // YUI3

    YUI.add(MODULE_NAME, module_factory);

  }*/ else {                                                                    // GLOBAL

    global[MODULE_NAME] = module_factory();
  }


}).call(null, function () {
  return (function () {


    var
      global = this,


      isFunction = (

        (typeof global.isFunction == "function")

        && global.isFunction(global.isFunction)
        && global.isFunction

      ) || function (obj) {return (typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function");},


      defaultValueOf = (function (proto_value_of) {
        return function (type) {

//        Object.prototype.valueOf.call(new String(1))              // "[object String]"
//        Object.prototype.valueOf.call(new Number("1"))            // "[object Number]"
//        //  versus
//        Object.prototype.valueOf.call(new String(1)).valueOf()    // "1" [string] value
//        Object.prototype.valueOf.call(new Number("1")).valueOf()  // 1 [number] value

          return proto_value_of.call(type).valueOf();
        };
      }(global.Object.prototype.valueOf)),


      defaultCompareTypes = (function (default_value_of, is_function, UNDEFINED_VALUE) {
        return function (typeA, typeB, customValueOf) {

          customValueOf = (is_function(customValueOf) && customValueOf) || default_value_of;

          var valueA, valueB;
          return (

            (((valueA = customValueOf(typeA)) > (valueB = customValueOf(typeB))) && 1)

            || ((valueA < valueB) && -1)
          //|| ((valueA == valueB) ? 0 : UNDEFINED_VALUE)   // as for UNDEFINED_VALUE, the 4th possible return value, ...
            || ((valueA === valueB) ? 0 : UNDEFINED_VALUE)  // ... please countercheck with [http://apidock.com/ruby/Comparable]
          );
        };
      }(defaultValueOf, isFunction))
    ;
/*

    [http://apidock.com/ruby/Comparable]

 */ /*

    JavaScript supports/enables [Function] based [Trait] and [Mixin] -patterns
    for object composition. Both patterns are containers for a single or a
    whole bunch of implemented method(s) that is/are supposed to get bound to
    and run on objects.

    In my opinion [Trait]s in JavaScript are considered to be "stateless".
    If it comes to state that needs to be carried throughout an object such
    implementations should be referred to as [Mixin]s.

    In order to avoid/solve conflicts [Trait] composition patterns should
    make use of [Function.prototype.before], [Function.prototype.after]
    and [Function.prototype.around].

*/
    var createComparableTrait = (function (default_compare_types, is_function) {
      return function (compareTypes/* if a [ComparableTrait] is ought to be applied onto an object (most likely such as XYZ.prototype) it is suggested to pass a custom [compareTypes] method to this traits creating method */) {


        var ComparableTrait = (function (compareTypes) {
          return function () {


            var comparable = this;


            comparable.compareTo = function (obj/* object [comparable] does compare to */, customValueOf/* during object comparison an optional custom [valueOf] method will be called for each object right before comparing them to one another */) {

              return compareTypes(this, obj, customValueOf);
            };
            comparable.inBetween = function (objA, objB/* objects [comparable] does compare to */, customValueOf/* during object comparison an optional custom [valueOf] method will be called for each object right before comparing them to one another */) {

              var isInBetween = compareTypes(objA, objB, customValueOf); // -1 || 0 || 1;
              if (isInBetween < 0) {

                isInBetween = ((compareTypes(this, objA, customValueOf) > 0) && (compareTypes(this, objB, customValueOf) < 0));

              } else if (isInBetween > 0) {

                isInBetween = ((compareTypes(this, objB, customValueOf) > 0) && (compareTypes(this, objA, customValueOf) < 0));
              }
              return !!isInBetween;
            };
          };
        }((is_function(compareTypes) && compareTypes) || default_compare_types));


        return ComparableTrait;
      };
    }(defaultCompareTypes, isFunction));


    var withdrawComparable = (function (comparable_create, is_function, object_keys) {
      return function (comparable, ComparableTrait/* optional 2nd argument */) {

        var obj = {};
        (is_function(ComparableTrait) && ComparableTrait.call(obj)) || comparable_create().call(obj);

        object_keys(obj).forEach(function (methodName) {

          if ((comparable[methodName] + "") == (obj[methodName] + "")) {

            comparable[methodName] = null;
            delete comparable[methodName];
          }
        });
      };
    }(createComparableTrait, isFunction, global.Object.keys));


    var isComparable = (function (is_function, NULL_VALUE, UNDEFINED_VALUE) {
      return function (obj) {

        return ((obj !== UNDEFINED_VALUE) && (obj !== NULL_VALUE) && is_function(obj.compareTo) && is_function(obj.inBetween));
      };
    }(isFunction, null));
/*

    defaultCompareTypes = defaultValueOf = isFunction = global = null;
    delete defaultCompareTypes; delete defaultValueOf; delete isFunction; delete global;

*/
    var
      compareTypes = (function (default_compare_types, is_function, UNDEFINED_VALUE) {
        return function (a, b) {

          return (is_function(a.compareTo) ? a.compareTo(b) : default_compare_types(a, b));
        };
      }(defaultCompareTypes, isFunction)),

      ArrProto = global.Array.prototype
    ;
    ArrProto.sort = (function (compare_types, is_function, core_proto_sort) {
      return function (compareTypes) {

        core_proto_sort.call(this, ((is_function(compareTypes) && compareTypes) || compare_types));
      };
    }(compareTypes, isFunction, ArrProto.sort));


    return { // module;

      "create": createComparableTrait,
      "withdraw": withdrawComparable,
      "isComparable": isComparable
    };


  }).call(null);
});



/*
  quick test
*/
var
  log = function (msg) {console && console.log && console.log(msg);},
//dir = function (msg) {console && console.dir && console.dir(msg);},

  // test 1
  x = {"x":"x"},
  y = {"x":"y"},
  z = {"x":"z"},

  ComparableTrait,

  oddityValueOf
;
/*
  // test 2
  x = {"x":"x"},
  y = {"x":"y"},
  z = {"x":"x"};

  // test 3
  x = {"x":"x"},
  y = {"x":"y"},
  z = {"x":"y"};
*/

/*
dir("{x} : " + x);
dir("{y} : " + x);
dir("{z} : " + x);
*/

log("(x < y) ? " + (x < y));    // false
log("(x > y) ? " + (x > y));    // false
log("(x <= y) ? " + (x <= y));  // true
log("(x >= y) ? " + (x >= y));  // true
log("(x == y) ? " + (x == y));  // false


ComparableTrait = Comparable.create();
ComparableTrait.call(x);
ComparableTrait.call(y);


log("x.compareTo(y) : " + x.compareTo(y)); // undefined
log("y.compareTo(x) : " + y.compareTo(x)); // undefined

log("x.compareTo(z) : " + x.compareTo(z)); // undefined
log("y.compareTo(z) : " + y.compareTo(z)); // undefined


var xyzValueOf = function (obj) {
    return obj.x;
};

log("x.compareTo(y, xyzValueOf) : " + x.compareTo(y, xyzValueOf)); // -1
log("y.compareTo(x, xyzValueOf) : " + y.compareTo(x, xyzValueOf)); // 1

log("x.compareTo(z, xyzValueOf) : " + x.compareTo(z, xyzValueOf)); // -1
log("y.compareTo(z, xyzValueOf) : " + y.compareTo(z, xyzValueOf)); // -1


log("ComparableTrait.call(Number.prototype);");

ComparableTrait.call(Number.prototype);

x = 1;
y = 2;
z = 3;

log("(x < y) ? " + (x < y));    // true
log("(x > y) ? " + (x > y));    // false
log("(x <= y) ? " + (x <= y));  // true
log("(x >= y) ? " + (x >= y));  // false
log("(x == y) ? " + (x == y));  // false
log("(x < z) ? " + (x < z));    // true
log("(x > z) ? " + (x > z));    // false
log("(x <= z) ? " + (x <= z));  // true
log("(x >= z) ? " + (x >= z));  // false

log("x.compareTo(y) : " + x.compareTo(y)); // -1
log("y.compareTo(x) : " + y.compareTo(x)); // 1

log("x.compareTo(z) : " + x.compareTo(z)); // -1
log("y.compareTo(z) : " + y.compareTo(z)); // -1


oddityValueOf = function (obj) {

    return (-1 * obj);
};
log("x.compareTo(y, oddityValueOf) : " + x.compareTo(y, oddityValueOf)); // 1
log("y.compareTo(x, oddityValueOf) : " + y.compareTo(x, oddityValueOf)); // -1

log("x.compareTo(z, oddityValueOf) : " + x.compareTo(z, oddityValueOf)); // 1
log("y.compareTo(z, oddityValueOf) : " + y.compareTo(z, oddityValueOf)); // 1


oddityValueOf = function (obj) {

    return "";
};
log("x.compareTo(y, oddityValueOf) : " + x.compareTo(y, oddityValueOf)); // 0
log("y.compareTo(x, oddityValueOf) : " + y.compareTo(x, oddityValueOf)); // 0

log("x.compareTo(z, oddityValueOf) : " + x.compareTo(z, oddityValueOf)); // 0
log("y.compareTo(z, oddityValueOf) : " + y.compareTo(z, oddityValueOf)); // 0



log("2..inBetween(1, 3) ? " + 2..inBetween(1, 3)); // true
log("2..inBetween(2, 3) ? " + 2..inBetween(2, 3)); // false
log("2..inBetween(1, 2) ? " + 2..inBetween(1, 2)); // false



log("1..compareTo(2) : " + 1..compareTo(2)); // -1

//ComparableTrait.call(Number.prototype, function (a, b) {return a-b < 0 ? 1 : a-b > 0 ? -1 : 0;});
ComparableTrait = Comparable.create(function (a, b) {return a-b < 0 ? 1 : a-b > 0 ? -1 : 0;});
ComparableTrait.call(Number.prototype);

log("ComparableTrait = Comparable.create(function (a, b) {return a-b < 0 ? 1 : a-b > 0 ? -1 : 0;});");
log("ComparableTrait.call(Number.prototype);");

log("1..compareTo(2) : " + 1..compareTo(2)); // 1


ComparableTrait = Comparable.create();
ComparableTrait.call(String.prototype);


log("ComparableTrait.call(String.prototype);");

log("\"cat\".inBetween(\"ant\", \"dog\") ? " + "cat".inBetween("ant", "dog")); // true
log("\"gnu\".inBetween(\"ant\", \"dog\") ? " + "gnu".inBetween("ant", "dog")); // false

log("\"a\".inBetween(\"a\", \"d\") ? " + "a".inBetween("a", "d"));    // false
log("\"aa\".inBetween(\"a\", \"d\") ? " + "aa".inBetween("a", "d"));  // true
log("\"b\".inBetween(\"a\", \"d\") ? " + "b".inBetween("a", "d"));    // true



/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 2.564 byte
(function(module_factory){var global=this,define=global.define,module=global.module,MODULE_NAME="Comparable";if(typeof define=="function")define(module_factory);else if(typeof module=="object"&&module&&module.exports)module.exports=module_factory();else global[MODULE_NAME]=module_factory()}).call(null,function(){return function(){var global=this,isFunction=typeof global.isFunction=="function"&&global.isFunction(global.isFunction)&&global.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},defaultValueOf=function(proto_value_of){return function(type){return proto_value_of.call(type).valueOf()}}(global.Object.prototype.valueOf),defaultCompareTypes=function(default_value_of,is_function,UNDEFINED_VALUE){return function(typeA,typeB,customValueOf){customValueOf=is_function(customValueOf)&&customValueOf||default_value_of;var valueA,valueB;return(valueA=customValueOf(typeA))>(valueB=customValueOf(typeB))&&1||valueA<valueB&&-1||(valueA===valueB?0:UNDEFINED_VALUE)}}(defaultValueOf,isFunction);var createComparableTrait=function(default_compare_types,is_function){return function(compareTypes){var ComparableTrait=function(compareTypes){return function(){var comparable=this;comparable.compareTo=function(obj,customValueOf){return compareTypes(this,obj,customValueOf)};comparable.inBetween=function(objA,objB,customValueOf){var isInBetween=compareTypes(objA,objB,customValueOf);if(isInBetween<0)isInBetween=compareTypes(this,objA,customValueOf)>0&&compareTypes(this,objB,customValueOf)<0;else if(isInBetween>0)isInBetween=compareTypes(this,objB,customValueOf)>0&&compareTypes(this,objA,customValueOf)<0;return!!isInBetween}}}(is_function(compareTypes)&&compareTypes||default_compare_types);return ComparableTrait}}(defaultCompareTypes,isFunction);var withdrawComparable=function(comparable_create,is_function,object_keys){return function(comparable,ComparableTrait){var obj={};is_function(ComparableTrait)&&ComparableTrait.call(obj)||comparable_create().call(obj);object_keys(obj).forEach(function(methodName){if(comparable[methodName]+""==obj[methodName]+""){comparable[methodName]=null;delete comparable[methodName]}})}}(createComparableTrait,isFunction,global.Object.keys);var isComparable=function(is_function,NULL_VALUE,UNDEFINED_VALUE){return function(obj){return obj!==UNDEFINED_VALUE&&obj!==NULL_VALUE&&is_function(obj.compareTo)&&is_function(obj.inBetween)}}(isFunction,null);return{"create":createComparableTrait,"withdraw":withdrawComparable,"isComparable":isComparable}}.call(null)});

- Whitespace only - 3.021 byte  - including a monkey patched [Array.sort]
(function(module_factory){var global=this,define=global.define,module=global.module,MODULE_NAME="Comparable";if(typeof define=="function")define(module_factory);else if(typeof module=="object"&&module&&module.exports)module.exports=module_factory();else global[MODULE_NAME]=module_factory()}).call(null,function(){return function(){var global=this,isFunction=typeof global.isFunction=="function"&&global.isFunction(global.isFunction)&&global.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},defaultValueOf=function(proto_value_of){return function(type){return proto_value_of.call(type).valueOf()}}(global.Object.prototype.valueOf),defaultCompareTypes=function(default_value_of,is_function,UNDEFINED_VALUE){return function(typeA,typeB,customValueOf){customValueOf=is_function(customValueOf)&&customValueOf||default_value_of;var valueA,valueB;return(valueA=customValueOf(typeA))>(valueB=customValueOf(typeB))&&1||valueA<valueB&&-1||(valueA===valueB?0:UNDEFINED_VALUE)}}(defaultValueOf,isFunction);var createComparableTrait=function(default_compare_types,is_function){return function(compareTypes){var ComparableTrait=function(compareTypes){return function(){var comparable=this;comparable.compareTo=function(obj,customValueOf){return compareTypes(this,obj,customValueOf)};comparable.inBetween=function(objA,objB,customValueOf){var isInBetween=compareTypes(objA,objB,customValueOf);if(isInBetween<0)isInBetween=compareTypes(this,objA,customValueOf)>0&&compareTypes(this,objB,customValueOf)<0;else if(isInBetween>0)isInBetween=compareTypes(this,objB,customValueOf)>0&&compareTypes(this,objA,customValueOf)<0;return!!isInBetween}}}(is_function(compareTypes)&&compareTypes||default_compare_types);return ComparableTrait}}(defaultCompareTypes,isFunction);var withdrawComparable=function(comparable_create,is_function,object_keys){return function(comparable,ComparableTrait){var obj={};is_function(ComparableTrait)&&ComparableTrait.call(obj)||comparable_create().call(obj);object_keys(obj).forEach(function(methodName){if(comparable[methodName]+""==obj[methodName]+""){comparable[methodName]=null;delete comparable[methodName]}})}}(createComparableTrait,isFunction,global.Object.keys);var isComparable=function(is_function,NULL_VALUE,UNDEFINED_VALUE){return function(obj){return obj!==UNDEFINED_VALUE&&obj!==NULL_VALUE&&is_function(obj.compareTo)&&is_function(obj.inBetween)}}(isFunction,null);var compareTypes=function(default_compare_types,is_function,UNDEFINED_VALUE){return function(a,b){return is_function(a.compareTo)?a.compareTo(b):default_compare_types(a,b)}}(defaultCompareTypes,isFunction),ArrProto=global.Array.prototype;ArrProto.sort=function(compare_types,is_function,core_proto_sort){return function(compareTypes){core_proto_sort.call(this,is_function(compareTypes)&&compareTypes||compare_types)}}(compareTypes,isFunction,ArrProto.sort);return{"create":createComparableTrait,"withdraw":withdrawComparable,"isComparable":isComparable}}.call(null)});



- Simple          - 1.038 byte
(function(b){var g=this.define,c=this.module;"function"==typeof g?g(b):"object"==typeof c&&c&&c.exports?c.exports=b():this.Comparable=b()}).call(null,function(){return function(){var b="function"==typeof this.isFunction&&this.isFunction(this.isFunction)&&this.isFunction||function(a){return"function"==typeof a&&"function"==typeof a.call&&"function"==typeof a.apply},g=this.Object.prototype.valueOf,c=function(a){return g.call(a).valueOf()},h,j=function(a,f,d){var d=b(d)&&d||c,e,i;return(e=d(a))>(i=d(f))&&1||e<i&&-1||(e===i?0:void 0)};h=function(a){var f=b(a)&&a||j;return function(){this.compareTo=function(a,e){return f(this,a,e)};this.inBetween=function(a,e,b){var c=f(a,e,b);0>c?c=0<f(this,a,b)&&0>f(this,e,b):0<c&&(c=0<f(this,e,b)&&0>f(this,a,b));return!!c}}};var k=this.Object.keys;return{create:h,withdraw:function(a,c){var d={};b(c)&&c.call(d)||h().call(d);k(d).forEach(function(b){a[b]+""==d[b]+""&&(a[b]=null,delete a[b])})},isComparable:function(a){return void 0!==a&&null!==a&&b(a.compareTo)&&b(a.inBetween)}}}.call(null)});

- Simple          - 1.181 byte  - including a monkey patched [Array.sort]
(function(b){var g=this.define,c=this.module;"function"==typeof g?g(b):"object"==typeof c&&c&&c.exports?c.exports=b():this.Comparable=b()}).call(null,function(){return function(){var b="function"==typeof this.isFunction&&this.isFunction(this.isFunction)&&this.isFunction||function(a){return"function"==typeof a&&"function"==typeof a.call&&"function"==typeof a.apply},g=this.Object.prototype.valueOf,c,k=function(a){return g.call(a).valueOf()};c=function(a,d,e){var e=b(e)&&e||k,f,h;return(f=e(a))>(h=e(d))&&1||f<h&&-1||(f===h?0:void 0)};var i;i=function(a){var d=b(a)&&a||c;return function(){this.compareTo=function(a,f){return d(this,a,f)};this.inBetween=function(a,f,b){var c=d(a,f,b);0>c?c=0<d(this,a,b)&&0>d(this,f,b):0<c&&(c=0<d(this,f,b)&&0>d(this,a,b));return!!c}}};var l=this.Object.keys,j=this.Array.prototype,m=function(a,d){return b(a.compareTo)?a.compareTo(d):c(a,d)},n=j.sort;j.sort=function(a){n.call(this,b(a)&&a||m)};return{create:i,withdraw:function(a,c){var e={};b(c)&&c.call(e)||i().call(e);l(e).forEach(function(b){a[b]+""==e[b]+""&&(a[b]=null,delete a[b])})},isComparable:function(a){return void 0!==a&&null!==a&&b(a.compareTo)&&b(a.inBetween)}}}.call(null)});


*/
