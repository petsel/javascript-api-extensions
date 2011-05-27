(function (ns/*[custom_namespace]*/) {


  var global = this; // [global_object|scripting_host]


  if (typeof (ns||global).Range == "function") {

    return;
  }
  if ((typeof global.Number.prototype.next != "function") || (typeof global.String.prototype.next != "function")) {

    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Range/Number.String.next.js]
    global.console
    && (global.console.warn
        || global.console.log)
          ("This [[Range]] implementation can be used best if [Number.String.next] already exists.");/*
    throw(new ReferenceError("This [[Range]] implementation at least requires the presence of the [Number.String.next] extensions module."));*/
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


//return Range; // if implemented as requireJS module - and then also delete >>(ns||global).Range = Range;<< ... >>delete arguments.callee;<<


  (ns||global).Range = Range;


  Range = rangeToArray = eachType = compareTypes = defaultValueOf = global = null;
  delete Range; delete rangeToArray; delete eachType; delete compareTypes; delete defaultValueOf; delete global;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_Range_is_supposed_to_be_bound_to]*/);





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



/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 2.557 byte
(function(ns){var global=this;if(typeof(ns||global).Range=="function")return;if(typeof global.Number.prototype.next!="function"||typeof global.String.prototype.next!="function")global.console&&(global.console.warn||global.console.log)("This [[Range]] implementation can be used best if [Number.String.next] already exists.");var defaultValueOf=function(proto_value_of){return function(type){return proto_value_of.call(type).valueOf()}}(global.Object.prototype.valueOf),compareTypes=function(default_value_of){return function(typeA,typeB,customValueOf){var comparativeValue,valueA,valueB;if(typeof customValueOf=="function")comparativeValue=(valueA=customValueOf(typeA))>(valueB=customValueOf(typeB))&&1||valueA<valueB&&-1||0;else comparativeValue=typeof typeA.compareTo=="function"&&typeof typeB.compareTo=="function"?typeA.compareTo(typeB):(valueA=default_value_of(typeA))>(valueB=default_value_of(typeB))&&1||valueA<valueB&&-1||0;return comparativeValue}}(defaultValueOf),eachType=function(compare){return function(fct,target,thisRange,currentType,endType,customValueOf){if((currentType||typeof currentType!="undefined"&&typeof currentType!="object")&&(endType||typeof endType!="undefined"&&typeof endType!="object")&&typeof currentType.next=="function"&&typeof endType.next=="function")if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var comparativeValue=compare(currentType,endType,customValueOf),idx=-1;if(comparativeValue<0){do{fct.call(target,currentType,++idx,thisRange);currentType=currentType.next()}while((currentType||typeof currentType!="object")&&typeof currentType.next=="function"&&compare(currentType,endType,customValueOf)<0);fct.call(target,endType,++idx,thisRange)}else if(comparativeValue===0)fct.call(target,currentType,++idx,thisRange)}}}(compareTypes),rangeToArray=function(thisRange){var arr=[];thisRange.each(function(elm){arr.push(elm)});return arr},Range=function(range_to_array,for_each){return function(startType,endType,customValueOf){var arr;this.each=function(fct,target){for_each(fct,target,this,startType,endType,customValueOf);return this};this.toArray=function(){return arr||(arr=range_to_array(this))};this.valueOf=function(){return this.toArray()};this.toString=function(){return""+this.toArray()}}}(rangeToArray,eachType);(ns||global).Range=Range;Range=rangeToArray=eachType=compareTypes=defaultValueOf=global=null;delete Range;delete rangeToArray;delete eachType;delete compareTypes;delete defaultValueOf;delete global;delete arguments.callee}).call(null);

- Simple          - 1.493 byte
(function(l){var a=this;if(typeof(l||a).Range!="function"){if(typeof a.Number.prototype.next!="function"||typeof a.String.prototype.next!="function")a.console&&(a.console.warn||a.console.log)("This [[Range]] implementation can be used best if [Number.String.next] already exists.");var f=function(g){return function(d){return g.call(d).valueOf()}}(a.Object.prototype.valueOf),i=function(g){return function(d,e,a){var b,c;return typeof a=="function"?(b=a(d))>(c=a(e))&&1||b<c&&-1||0:typeof d.compareTo=="function"&&typeof e.compareTo=="function"?d.compareTo(e):(b=g(d))>(c=g(e))&&1||b<c&&-1||0}}(f),j=function(a){return function(d,e,h,b,c,m){if((b||typeof b!="undefined"&&typeof b!="object")&&(c||typeof c!="undefined"&&typeof c!="object")&&typeof b.next=="function"&&typeof c.next=="function"&&typeof d=="function"){var e=e||(typeof e=="undefined"||typeof e=="object"?null:e),n=a(b,c,m),f=-1;if(n<0){do d.call(e,b,++f,h),b=b.next();while((b||typeof b!="object")&&typeof b.next=="function"&&a(b,c,m)<0);d.call(e,c,++f,h)}else n===0&&d.call(e,b,++f,h)}}}(i),o,k=function(a,d){return function(e,f,b){var c;this.each=function(a,c){d(a,c,this,e,f,b);return this};this.toArray=function(){return c||(c=a(this))};this.valueOf=function(){return this.toArray()};this.toString=function(){return""+this.toArray()}}}(function(a){var d=[];a.each(function(a){d.push(a)});return d},j);(l||a).Range=k;k=o=j=i=f=a=null;delete k;delete o;delete j;delete i;delete f;delete a;delete arguments.callee}}).call(null);


*/

