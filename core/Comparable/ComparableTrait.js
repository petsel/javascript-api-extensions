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

  compareTypes = (function (default_value_of) {
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


  ComparableTrait = (function (compare_types) {
    return (function () {

      this.compareTo = (function (obj/*object [this] does compare to*/, customValueOf/*during object comparison an optional custom value of method will be called for each object rigth before comparing them to one another*/) {

        return compare_types(this, obj, customValueOf);
      });
    });
  })(compareTypes);


//return ComparableTrait; // if implemented as requireJS module - and then also delete >>(ns||global).ComparableTrait = ComparableTrait;<< ... >>delete arguments.callee;<<


  (ns||global).ComparableTrait = ComparableTrait;


  ComparableTrait = compareTypes = defaultValueOf = global = null;
  delete ComparableTrait; delete compareTypes; delete defaultValueOf; delete global;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_ComparableTrait_is_supposed_to_be_bound_to]*/);





/*
  quick test
*/
var
log = console.log,
dir = console.dir,

  // test 1
x = {"x":"x"},
y = {"x":"y"},
z = {"x":"z"};
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



/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 901 byte
(function(ns){var global=this;if(typeof(ns||global).ComparableTrait=="function")return;var defaultValueOf=function(proto_value_of){return function(type){return proto_value_of.call(type).valueOf()}}(global.Object.prototype.valueOf),compareTypes=function(default_value_of){return function(typeA,typeB,customValueOf){customValueOf=typeof customValueOf=="function"&&customValueOf||default_value_of;var valueA,valueB;return(valueA=customValueOf(typeA))>(valueB=customValueOf(typeB))&&1||valueA<valueB&&-1||0}}(defaultValueOf),ComparableTrait=function(compare_types){return function(){this.compareTo=function(obj,customValueOf){return compare_types(this,obj,customValueOf)}}}(compareTypes);(ns||global).ComparableTrait=ComparableTrait;ComparableTrait=compareTypes=defaultValueOf=global=null;delete ComparableTrait;delete compareTypes;delete defaultValueOf;delete global;delete arguments.callee}).call(null);

- Simple          - 479 byte
(function(g){var a=this;if(typeof(g||a).ComparableTrait!="function"){var d=function(a){return function(f){return a.call(f).valueOf()}}(a.Object.prototype.valueOf),b=function(a){return function(f,d,e){var e=typeof e=="function"&&e||a,b,c;return(b=e(f))>(c=e(d))&&1||b<c&&-1||0}}(d),c=function(a){return function(){this.compareTo=function(b,c){return a(this,b,c)}}}(b);(g||a).ComparableTrait=c;c=b=d=a=null;delete c;delete b;delete d;delete a;delete arguments.callee}}).call(null);


*/

