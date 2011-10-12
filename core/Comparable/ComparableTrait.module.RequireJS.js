define(function () {
  return (function () {


    var global/*global object | scripting host*/ = this,


    defaultValueOf = (function (proto_value_of) {
      return (function (type) {
  /*
    Object.prototype.valueOf.call(new String(1))              // "[object String]"
    Object.prototype.valueOf.call(new Number("1"))            // "[object Number]"
  //  versus
    Object.prototype.valueOf.call(new String(1)).valueOf()    // "1" [string] value
    Object.prototype.valueOf.call(new Number("1")).valueOf()  // 1 [number] value
  */
        return proto_value_of.call(type).valueOf();
      });
    })(global.Object.prototype.valueOf),

    defaultCompareTypes = (function (default_value_of) {
      return (function (typeA, typeB, customValueOf) {

        customValueOf = (((typeof customValueOf == "function") && customValueOf) || default_value_of);

        var valueA, valueB;
        return (
          (((valueA = customValueOf(typeA)) > (valueB = customValueOf(typeB))) && 1)
          || ((valueA < valueB) && -1)
          || 0
        );
      });
    })(defaultValueOf),

  /*

    [http://apidock.com/ruby/Comparable]

  */ /*

    JavaScript supports/enables [Function] based [Trait] and [Mixin] -patterns
    for object composition. Both patterns are containers for a single or a
    whole bunch of implemented method(s) that is/are supposed to get bound to
    and run on objects.

    In my oppinion [Trait]s in JavaScript are considered to be "stateless".
    If it comes to state that needs to be carried throughout an object such
    implementations should be referred to as [Mixin]s.

    In order to avoid/solve conflicts [Trait] composition patterns should
    make use of [Function.prototype.before], [Function.prototype.after]
    and [Function.prototype.around].

  */

    ComparableTrait = (function (default_compare_types) {
      return (function (customCompareTypes/* if [ComparableTrait] gets applied onto an object (most likely such as XYZ.prototype) it is suggested to pass a custom [compareTypes] method as well */) {

        customCompareTypes = (((typeof customCompareTypes == "function") && customCompareTypes) || default_compare_types);

        this.compareTo = (function (obj/*object [this] does compare to*/, customValueOf/*during object comparison an optional custom [valueOf] method will be called for each object rigth before comparing them to one another*/) {

          return customCompareTypes(this, obj, customValueOf);
        });
        this.inBetween = (function (objK, objM/*objects [this] does compare to*/, customValueOf/*during object comparison an optional custom [valueOf] method will be called for each object rigth before comparing them to one another*/) {

          var isInBetween = customCompareTypes(objK, objM, customValueOf); // -1 || 0 || 1;
          if (isInBetween < 0) {
            isInBetween = (customCompareTypes(this, objK, customValueOf) > 0) && (customCompareTypes(this, objM, customValueOf) < 0);
          } else if (isInBetween > 0) {
            isInBetween = (customCompareTypes(this, objM, customValueOf) > 0) && (customCompareTypes(this, objK, customValueOf) < 0);
          }
          return !!isInBetween;
        });
      });
    })(defaultCompareTypes);


    defaultCompareTypes = defaultValueOf = global = null;
    delete defaultCompareTypes; delete defaultValueOf; delete global;


    return ComparableTrait;

  }).call(null/*does force the internal [this] context pointing to the [global] object*/);
});


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.316 byte
define(function(){return function(){var global=this,defaultValueOf=function(proto_value_of){return function(type){return proto_value_of.call(type).valueOf()}}(global.Object.prototype.valueOf),defaultCompareTypes=function(default_value_of){return function(typeA,typeB,customValueOf){customValueOf=typeof customValueOf=="function"&&customValueOf||default_value_of;var valueA,valueB;return(valueA=customValueOf(typeA))>(valueB=customValueOf(typeB))&&1||valueA<valueB&&-1||0}}(defaultValueOf),ComparableTrait=function(default_compare_types){return function(customCompareTypes){customCompareTypes=typeof customCompareTypes=="function"&&customCompareTypes||default_compare_types;this.compareTo=function(obj,customValueOf){return customCompareTypes(this,obj,customValueOf)};this.inBetween=function(objK,objM,customValueOf){var isInBetween=customCompareTypes(objK,objM,customValueOf);if(isInBetween<0)isInBetween=customCompareTypes(this,objK,customValueOf)>0&&customCompareTypes(this,objM,customValueOf)<0;else if(isInBetween>0)isInBetween=customCompareTypes(this,objM,customValueOf)>0&&customCompareTypes(this,objK,customValueOf)<0;return!!isInBetween}}}(defaultCompareTypes);defaultCompareTypes=defaultValueOf=global=null;delete defaultCompareTypes;delete defaultValueOf;delete global;return ComparableTrait}.call(null)});

- Simple          -   560 byte
define(function(){return function(){var i,g=function(f){return function(a){return f.call(a).valueOf()}}(this.Object.prototype.valueOf),h=function(f){return function(a,e,b){var b=typeof b=="function"&&b||f,c,d;return(c=b(a))>(d=b(e))&&1||c<d&&-1||0}}(g),j=function(f){return function(a){a=typeof a=="function"&&a||f;this.compareTo=function(e,b){return a(this,e,b)};this.inBetween=function(e,b,c){var d=a(e,b,c);d<0?d=a(this,e,c)>0&&a(this,b,c)<0:d>0&&(d=a(this,b,c)>0&&a(this,e,c)<0);return!!d}}}(h),h=g=i=null;delete h;delete g;delete i;return j}.call(null)});


*/
