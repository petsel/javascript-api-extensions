(function (ns/*[custom_namespace]*/) {


  var global = this; // [global_object|scripting_host]


  if (typeof (ns||global).ComparableTrait == "function") {

    return;
  }


  var defaultValueOf = (function (proto_value_of) {
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


//return ComparableTrait; // if implemented as requireJS module - and then also delete >>(ns||global).ComparableTrait = ComparableTrait;<< ... >>delete arguments.callee;<<


  (ns||global).ComparableTrait = ComparableTrait;


  ComparableTrait = defaultCompareTypes = defaultValueOf = global = null;
  delete ComparableTrait; delete defaultCompareTypes; delete defaultValueOf; delete global;


}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_ComparableTrait_is_supposed_to_be_bound_to]*/);





/*
  quick test
*/
var
  log = function (msg) {console && console.log && console.log(msg);},
  dir = function (msg) {console && console.dir && console.dir(msg);},

  // test 1
  x = {"x":"x"},
  y = {"x":"y"},
  z = {"x":"z"}
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


ComparableTrait.call(x);
ComparableTrait.call(y);


log("x.compareTo(y) : " + x.compareTo(y)); // 0
log("y.compareTo(x) : " + y.compareTo(x)); // 0

log("x.compareTo(z) : " + x.compareTo(z)); // 0
log("y.compareTo(z) : " + y.compareTo(z)); // 0


var xyzValueOf = function (obj) {
    return obj.x;
}

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
}
log("x.compareTo(y, oddityValueOf) : " + x.compareTo(y, oddityValueOf)); // 1
log("y.compareTo(x, oddityValueOf) : " + y.compareTo(x, oddityValueOf)); // -1

log("x.compareTo(z, oddityValueOf) : " + x.compareTo(z, oddityValueOf)); // 1
log("y.compareTo(z, oddityValueOf) : " + y.compareTo(z, oddityValueOf)); // 1


oddityValueOf = function (obj) {
    return "";
}
log("x.compareTo(y, oddityValueOf) : " + x.compareTo(y, oddityValueOf)); // 0
log("y.compareTo(x, oddityValueOf) : " + y.compareTo(x, oddityValueOf)); // 0

log("x.compareTo(z, oddityValueOf) : " + x.compareTo(z, oddityValueOf)); // 0
log("y.compareTo(z, oddityValueOf) : " + y.compareTo(z, oddityValueOf)); // 0



log("2..inBetween(1, 3) ? " + 2..inBetween(1, 3)); // true
log("2..inBetween(2, 3) ? " + 2..inBetween(2, 3)); // false
log("2..inBetween(1, 2) ? " + 2..inBetween(1, 2)); // false



log("1..compareTo(2) : " + 1..compareTo(2)); // -1

ComparableTrait.call(Number.prototype, function (a, b) {return a-b < 0 ? 1 : a-b > 0 ? -1 : 0;});

log("ComparableTrait.call(Number.prototype, function (a, b) {return a-b < 0 ? 1 : a-b > 0 ? -1 : 0;});");

log("1..compareTo(2) : " + 1..compareTo(2)); // 1



ComparableTrait.call(String.prototype);

log("ComparableTrait.call(String.prototype);");

log("\"cat\".inBetween(\"ant\", \"dog\") ? " + "cat".inBetween("ant", "dog")); // true
log("\"gnu\".inBetween(\"ant\", \"dog\") ? " + "gnu".inBetween("ant", "dog")); // false

log("\"a\".inBetween(\"a\", \"d\") ? " + "a".inBetween("a", "d"));    // false
log("\"aa\".inBetween(\"a\", \"d\") ? " + "aa".inBetween("a", "d"));  // true
log("\"b\".inBetween(\"a\", \"d\") ? " + "b".inBetween("a", "d"));    // true



/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.415 byte
(function(ns){var global=this;if(typeof(ns||global).ComparableTrait=="function")return;var defaultValueOf=function(proto_value_of){return function(type){return proto_value_of.call(type).valueOf()}}(global.Object.prototype.valueOf),defaultCompareTypes=function(default_value_of){return function(typeA,typeB,customValueOf){customValueOf=typeof customValueOf=="function"&&customValueOf||default_value_of;var valueA,valueB;return(valueA=customValueOf(typeA))>(valueB=customValueOf(typeB))&&1||valueA<valueB&&-1||0}}(defaultValueOf),ComparableTrait=function(default_compare_types){return function(customCompareTypes){customCompareTypes=typeof customCompareTypes=="function"&&customCompareTypes||default_compare_types;this.compareTo=function(obj,customValueOf){return customCompareTypes(this,obj,customValueOf)};this.inBetween=function(objK,objM,customValueOf){var isInBetween=customCompareTypes(objK,objM,customValueOf);if(isInBetween<0)isInBetween=customCompareTypes(this,objK,customValueOf)>0&&customCompareTypes(this,objM,customValueOf)<0;else if(isInBetween>0)isInBetween=customCompareTypes(this,objM,customValueOf)>0&&customCompareTypes(this,objK,customValueOf)<0;return!!isInBetween}}}(defaultCompareTypes);(ns||global).ComparableTrait=ComparableTrait;ComparableTrait=defaultCompareTypes=defaultValueOf=global=null;delete ComparableTrait;delete defaultCompareTypes;delete defaultValueOf;delete global}).call(null);

- Simple          -   615 byte
(function(i){var a=this;if(typeof(i||a).ComparableTrait!="function"){var f=function(a){return function(b){return a.call(b).valueOf()}}(a.Object.prototype.valueOf),g=function(a){return function(b,j,c){var c=typeof c=="function"&&c||a,d,e;return(d=c(b))>(e=c(j))&&1||d<e&&-1||0}}(f),h=function(a){return function(b){b=typeof b=="function"&&b||a;this.compareTo=function(a,c){return b(this,a,c)};this.inBetween=function(a,c,d){var e=b(a,c,d);e<0?e=b(this,a,d)>0&&b(this,c,d)<0:e>0&&(e=b(this,c,d)>0&&b(this,a,d)<0);return!!e}}}(g);(i||a).ComparableTrait=h;h=g=f=a=null;delete h;delete g;delete f;delete a}}).call(null);


*/
