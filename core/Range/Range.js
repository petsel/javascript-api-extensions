(function (ns/*[custom_namespace]*/) {


  var global = this; // [global_object|scripting_host]


  if (typeof (ns||global).Range == "function") {

    return;
  }
  if ((typeof global.Number.prototype.next != "function") || (typeof global.String.prototype.next != "function")) {

    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Range/Number.String.next.js]
    throw (new ReferenceError("This [[Range]] implementation at least requires the presence of the [Number.String.next] extensions module."));
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
    return (function (typeA, typeB) {

      var valueA, valueB;
      return (
        ((typeof typeA.compareTo == "function") && (typeof typeB.compareTo == "function"))
          ? typeA.compareTo(typeB)
          : ((((valueA = default_value_of(typeA)) > (valueB = default_value_of(typeB))) && 1)
            || ((valueA < valueB) && -1)
            || 0)
      );
    });
  })(defaultValueOf),


  eachType = (function (default_value_of, compare) {
    return (function (fct, target, thisRange, currentType, endType) {

      if (
        (currentType || (typeof currentType != "object"))
        && (endType || (typeof endType != "object"))
        && (typeof currentType.next == "function")
        && (typeof endType.next == "function")
      ) { // types that are >>ready for [[Range]]<< do at least implement a [next] method.

        if (typeof fct == "function") {
          target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));

          var comparativeValue = compare(currentType, endType), idx = -1;
          if (comparativeValue < 0) {
            do {

            //callback.call(target, element, index, listStructure/*[, startValue, endValue]*/);
              fct.call(target, currentType, ++idx, thisRange);

              currentType = currentType.next();

            } while ((currentType || (typeof currentType != "object")) && (typeof currentType.next == "function") && (compare(currentType, endType) < 0))

            fct.call(target, endType, ++idx, thisRange);

          } else if (comparativeValue === 0) {

            fct.call(target, currentType, ++idx, thisRange);
          }
        }
      }
    });
  })(defaultValueOf, compareTypes),


  rangeToArray = (function (thisRange) {
    var arr = [];

    thisRange.each(function (elm/*, idx, range*/) {
      arr.push(elm);
    });
    return arr;
  }),



  Range = (function (range_to_array, for_each) {
    return (function (startType, endType) {
      var arr;

      this.each = (function (fct, target) {

        for_each(fct, target, this, startType, endType);

        return this;
      });
      this.toArray = (function () {

        return (arr || (arr = range_to_array(this)));
      });

      this.valueOf = (function () {

        return this.toArray();
      });
      this.toString = (function () {

        return ("" + this.toArray());
      });
    });
  })(rangeToArray, eachType);


//return Range; // if implemented as requireJS module - and then also delete >>(ns||global).Range = Range;<< ... >>delete arguments.callee;<<


  (ns||global).Range = Range;


  Range = rangeToArray = eachType = compareTypes = defaultValueOf = global = null;
  delete Range; delete rangeToArray; delete eachType; delete compareTypes; delete defaultValueOf; delete global;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_Range_is_supposed_to_be_bound_to]*/);
