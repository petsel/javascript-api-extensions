define(function () {


  return (function () {
    var global = this, // [global_object|scripting_host]


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


    compareTypes = defaultValueOf = global = null;
    delete compareTypes; delete defaultValueOf; delete global;


    return ComparableTrait;

  }).call(null/*does force the internal [this] context pointing to the [global] object*/);


});

