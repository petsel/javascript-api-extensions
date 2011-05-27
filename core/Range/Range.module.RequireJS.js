define([


  "https://github.com/petsel/javascript-api-extensions/raw/master/core/Range/Number.String.next.js"/*,  // - already implemented
  "https://github.com/petsel/javascript-api-extensions/raw/master/core/Range/Date.next.js"              // - nice to have ... yet to be implemented
*/

], (function () {


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

        var comparativeValue, valueA, valueB;
        if (typeof customValueOf == "function") {

          comparativeValue = (
            (((valueA = customValueOf(typeA)) > (valueB = customValueOf(typeB))) && 1)
            || ((valueA < valueB) && -1)
            || 0
          );
        } else {
          comparativeValue = (
            ((typeof typeA.compareTo == "function") && (typeof typeB.compareTo == "function"))
              ? typeA.compareTo(typeB)
              : ((((valueA = default_value_of(typeA)) > (valueB = default_value_of(typeB))) && 1)
                || ((valueA < valueB) && -1)
                || 0)
          );
        }
        return comparativeValue;
      });
    })(defaultValueOf),


    eachType = (function (compare) {
      return (function (fct, target, thisRange, currentType, endType, customValueOf) {

        if (
          (currentType || ((typeof currentType != "undefined") && (typeof currentType != "object")))
          && (endType || ((typeof endType != "undefined") && (typeof endType != "object")))
          && (typeof currentType.next == "function")
          && (typeof endType.next == "function")
        ) { /* types that are >>ready for [[Range]]<< do at least implement a [next] method ...

               ... please check back with:

               - [http://apidock.com/ruby/Range] and
               - [http://apidock.com/ruby/Comparable].
        */
          if (typeof fct == "function") {
            target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));

            var comparativeValue = compare(currentType, endType, customValueOf), idx = -1;
            if (comparativeValue < 0) {
              do {

              //callback.call(target, element, index, listStructure/*[, startValue, endValue]*/);
                fct.call(target, currentType, ++idx, thisRange);

                currentType = currentType.next();

              } while ((currentType || (typeof currentType != "object")) && (typeof currentType.next == "function") && (compare(currentType, endType, customValueOf) < 0))

              fct.call(target, endType, ++idx, thisRange);

            } else if (comparativeValue === 0) {

              fct.call(target, currentType, ++idx, thisRange);
            }
          }
        }
      });
    })(compareTypes),


    rangeToArray = (function (thisRange) {
      var arr = [];

      thisRange.each(function (elm/*, idx, range*/) {
        arr.push(elm);
      });
      return arr;
    }),


    Range = (function (range_to_array, for_each) {
      return (function (startType, endType, customValueOf) {
        var arr;/*

          as soon as an optional 3rd [customValueOf] parameter
          is provided to the [Range] constructor all comparision
          with objects one to another will be channelled through
          this functional helper.
          thus any object that is a valid range member does not
          necesserely need to have applied the [ComparableTrait]
          nor does it need to implemented a [compareTo] method.
        */
        this.each = (function (fct, target) {

          for_each(fct, target, this, startType, endType, customValueOf);

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


    rangeToArray = eachType = compareTypes = defaultValueOf = global = null;
    delete rangeToArray; delete eachType; delete compareTypes; delete defaultValueOf; delete global;


    return Range;

  }).call(null/*does force the internal [this] context pointing to the [global] object*/);


}));





/*

var
log = console.log,
dir = console.dir,


range = new Range(5, 14);

dir(range);

log("{5, 14} : " + range);
log(range.toArray());


range = new Range(5, 5);

log("{5, 5} : " + range);
log(range.toArray());


range = new Range(5, 4);

log("{5, 4} : " + range);
log(range.toArray());


range = new Range(5);

log("{5} : " + range);
log(range.toArray());


range = new Range();

log("{} : " + range);
log(range.toArray());


range = new Range("9", "ß");

log("{\"9\", \"ß\"} : " + range);
log(range.toArray());


range = new Range(7, "G");

log("{7, \"G\"} : " + range);
log(range.toArray());


range = new Range("7", "G");

log("{\"7\", \"G\"} : " + range);
log(range.toArray());


range.each(function (elm, idx, range) {
  log("elm : " + elm);
  log("idx : " + idx);
  log("range : " + range);
})


log(range); // range object itself.

log("range : " + range); // does implicitly force a range.toString().
log("range.length : " + range.length);
log("range.toArray() : " + range.toArray());
log("range.toArray().length : " + range.toArray().length);

log("(range.toArray() === range.valueOf()) ? " + (range.toArray() === range.valueOf()));


var stringValueOf = (function (str) {
  return str.charCodeAt(0);
});
range = new Range("7", "G", stringValueOf);

log("{\"7\", \"G\"} : " + range);
log(range.toArray());


var oddityStringValueOf = (function (str) {
  return (-1 * str.charCodeAt(0));
});
range = new Range("7", "G", oddityStringValueOf);

log("{\"7\", \"G\"} : " + range);
log(range.toArray());


oddityStringValueOf = (function (str) {
  return (((Math.random() * 10) > 5) ? -1 : 1);
});
range = new Range("7", "G", oddityStringValueOf);

log("{\"7\", \"G\"} : " + range);
log(range.toArray());

range = new Range("7", "G", oddityStringValueOf);

log("{\"7\", \"G\"} : " + range);
log(range.toArray());

range = new Range("7", "G", oddityStringValueOf);

log("{\"7\", \"G\"} : " + range);
log(range.toArray());

*/

