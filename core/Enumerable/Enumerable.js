(function (module_factory) {


  var
    global = this,

    define = global.define,
    module = global.module,
  //YUI = global.YUI,

    MODULE_NAME = "Enumerable"
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

      ) || function (obj) {return (typeof obj == "function");},


      emptyFct = function () {},

      defaultTraitConfig = {

        next      : emptyFct,
        previous  : emptyFct,
        compare   : emptyFct
      },


      StopIteration = ((/^\[object\s+StopIteration\]$/).test(global.Object.prototype.toString.call(global.StopIteration)) && global.StopIteration) || (function () {
        var Constructor = function () {
        };
        Constructor.prototype = {};

        Constructor.prototype.toString = function () {
          return "[object StopIteration]";
        };
        Constructor.prototype.valueOf = function () {
          return this;
        };
        return (new Constructor);
      }()),

      isStopIteration = (function (StopIteration) {
        return function (obj) {

          return (obj === StopIteration);
        };
      }(StopIteration)),

      stopIterationByThrowStatement = (function (StopIteration) {
        return function () {

          throw StopIteration;
        };
      }(StopIteration)),

      stopIterationWithUndefinedValue = (function (UNDEFINED_VALUE) {
        return function () {

          return UNDEFINED_VALUE;
        };
      }())
    ;
/*

    [http://apidock.com/ruby/Enumerable]

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
    var createEnumerableTrait = function (config) {

      config = ((typeof config == "object") && config) || {};

      var
        getNext = config.next,
        getPrevious = config.previous,
        compareTypes = config.compare,

        stopIteration = (!!config.isThrowStopIteration && stopIterationByThrowStatement) || stopIterationWithUndefinedValue,

        GetNextTrait,
        GetPreviousTrait,

        EnumerableTrait
      ;


      if (isFunction(compareTypes)) {                             // either a [compare] respectively a [compareTo] method
        if (compareTypes.length == 1) {                           // needs to be passed to each [Enumerable]'s creation
                                                                  // process ...
          compareTypes = (function (compare_types) {
            return function (a, b) {

              return compare_types.call(a, b);
            };
          }(compareTypes));
        }
      } else {                                                    // ... or with a required [[Comparable]] module at least
                                                                  // one created [Comparable] was applied onto each object
        compareTypes = (function (is_function, UNDEFINED_VALUE) { // before applying of an created [Enumerable] onto those
          return function (a, b) {                                // objects could take place.

            return (is_function(a.compareTo) ? a.compareTo(b) : UNDEFINED_VALUE);
          };
        }(isFunction));
      }
//console.log("+++ compareTypes +++", compareTypes);

      GetNextTrait = (isFunction(getNext) && (function (get_next, compare_types, stop_iteration, UNDEFINED_VALUE) {
        return function () {

          this.next = function () {

            var
              curr = this,
              next = get_next.call(curr),

              comparison = compare_types(curr, next)
            ;
//console.log("next", [curr, next, comparison, ((next !== UNDEFINED_VALUE) && (comparison !== UNDEFINED_VALUE) && (comparison <= 0))]);

            return ((next !== UNDEFINED_VALUE) && (comparison !== UNDEFINED_VALUE) && (comparison <= 0)) ? next : stop_iteration();
          };
        };
      }(getNext, compareTypes, stopIteration))) || emptyFct;

      GetPreviousTrait = (isFunction(getPrevious) && (function (get_previous, compare_types, stop_iteration, UNDEFINED_VALUE) {
        return function () {

          this.previous = function () {

            var
              curr = this,
              prev = get_previous.call(curr),

              comparison = compare_types(curr, prev)
            ;
//console.log("previous", [curr, prev, comparison, ((prev !== UNDEFINED_VALUE) && (comparison !== UNDEFINED_VALUE) && (comparison >= 0))]);

            return ((prev !== UNDEFINED_VALUE) && (comparison !== UNDEFINED_VALUE) && (comparison >= 0)) ? prev : stop_iteration();
          };
        };
      }(getPrevious, compareTypes, stopIteration))) || emptyFct;


      EnumerableTrait = (function (GetNextTrait, GetPreviousTrait) {
        return function () {

          GetNextTrait.call(this);
          GetPreviousTrait.call(this);
        };
      }(GetNextTrait, GetPreviousTrait));


      return EnumerableTrait;
    };


    var withdrawEnumerable = (function (enumerable_create, default_config, is_function, object_keys) {
      return function (enumerable, EnumerableTrait/* optional 2nd argument */) {

        var obj = {};
        (is_function(EnumerableTrait) && EnumerableTrait.call(obj)) || enumerable_create(default_config).call(obj);

        object_keys(obj).forEach(function (methodName) {

          if ((enumerable[methodName] + "") == (obj[methodName] + "")) {

            enumerable[methodName] = null;
            delete enumerable[methodName];
          }
        });
      };
    }(createEnumerableTrait, defaultTraitConfig, isFunction, global.Object.keys));


    var isEnumerable = (function (is_function, NULL_VALUE, UNDEFINED_VALUE) {
      return function (obj) {

        return ((obj !== UNDEFINED_VALUE) && (obj !== NULL_VALUE) && (is_function(obj.next) || is_function(obj.previous)));
      };
    }(isFunction, null));
/*

    stopIterationWithUndefinedValue = stopIterationByThrowStatement = StopIteration = defaultTraitConfig = emptyFct = isFunction = global = null;
    delete stopIterationWithUndefinedValue; delete stopIterationByThrowStatement; delete StopIteration;
    delete defaultTraitConfig; delete emptyFct; delete isFunction; delete global;

*/
    return { // module;

      "create": createEnumerableTrait,
      "withdraw": withdrawEnumerable,
      "isEnumerable": isEnumerable,
      "isStopIteration": isStopIteration
    };


  }).call(null);
});



/*
  quick test
 */
(function () {


  var
    global = this,


    nextInteger = (function (parse_int, is_finite, UNDEFINED_VALUE) {
      return function () {

        var
          currInt = parse_int(this, 10),
          nextInt = (currInt + 1)
          ;
        return ((is_finite(nextInt) && (nextInt !== currInt)) ? nextInt : UNDEFINED_VALUE);
      };
    }(global.parseInt, global.isFinite)),

    previousInteger = (function (parse_int, is_finite, UNDEFINED_VALUE) {
      return function () {

        var
          currInt = parse_int(this, 10),
          prevInt = (currInt - 1)
          ;
        return ((is_finite(prevInt) && (prevInt !== currInt)) ? prevInt : UNDEFINED_VALUE);
      };
    }(global.parseInt, global.isFinite)),


    compare = function (a, b) {return (a - b);},
    compareTo = function (b) {return (this - b);},


  //EnumerableInteger,


    Enumerable = global.Enumerable
  ;

/*
   EnumerableInteger = Enumerable.create({    // By default this implementation of an enumerable trait generator does not
                                              // create [Enumerable]s that do stop iterations by throwing [StopIteration].
     next                  : nextInteger,     // Invalid calls on [next] or [previous] just return [undefined] thus preventing
     previous              : previousInteger, // wrapping each of these calls into rather expensive try...catch statements.
     compare               : compare,
     isThrowStopIteration  : true             // if this flag was set to [true] each call on [next] or [previous] needs to be wrapped into a try...catch block.
   });
*/
  EnumerableInteger = Enumerable.create({

    next      : nextInteger,
    previous  : previousInteger,
    compare   : compareTo
  });
/*
   EnumerableInteger = Enumerable.create({

   next      : previousInteger,
   compare   : compare
   });
   EnumerableInteger = Enumerable.create({

   next      : nextInteger
   });
*/

  EnumerableInteger.call(Number.prototype);

}).call(null);



/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 3.646 byte
(function(module_factory){var global=this,define=global.define,module=global.module,MODULE_NAME="Enumerable";if(typeof define=="function")define(module_factory);else if(typeof module=="object"&&module&&module.exports)module.exports=module_factory();else global[MODULE_NAME]=module_factory()}).call(null,function(){return function(){var global=this,isFunction=typeof global.isFunction=="function"&&global.isFunction(global.isFunction)&&global.isFunction||function(obj){return typeof obj=="function"},emptyFct=function(){},defaultTraitConfig={next:emptyFct,previous:emptyFct,compare:emptyFct},StopIteration=/^\[object\s+StopIteration\]$/.test(global.Object.prototype.toString.call(global.StopIteration))&&global.StopIteration||function(){var Constructor=function(){};Constructor.prototype={};Constructor.prototype.toString=function(){return"[object StopIteration]"};Constructor.prototype.valueOf=function(){return this};return new Constructor}(),isStopIteration=function(StopIteration){return function(obj){return obj===StopIteration}}(StopIteration),stopIterationByThrowStatement=function(StopIteration){return function(){throw StopIteration;}}(StopIteration),stopIterationWithUndefinedValue=function(UNDEFINED_VALUE){return function(){return UNDEFINED_VALUE}}();var createEnumerableTrait=function(config){config=typeof config=="object"&&config||{};var getNext=config.next,getPrevious=config.previous,compareTypes=config.compare,stopIteration=!!config.isThrowStopIteration&&stopIterationByThrowStatement||stopIterationWithUndefinedValue,GetNextTrait,GetPreviousTrait,EnumerableTrait;if(isFunction(compareTypes)){if(compareTypes.length==1)compareTypes=function(compare_types){return function(a,b){return compare_types.call(a,b)}}(compareTypes)}else compareTypes=function(is_function,UNDEFINED_VALUE){return function(a,b){return is_function(a.compareTo)?a.compareTo(b):UNDEFINED_VALUE}}(isFunction);GetNextTrait=isFunction(getNext)&&function(get_next,compare_types,stop_iteration,UNDEFINED_VALUE){return function(){this.next=function(){var curr=this,next=get_next.call(curr),comparison=compare_types(curr,next);return next!==UNDEFINED_VALUE&&comparison!==UNDEFINED_VALUE&&comparison<=0?next:stop_iteration()}}}(getNext,compareTypes,stopIteration)||emptyFct;GetPreviousTrait=isFunction(getPrevious)&&function(get_previous,compare_types,stop_iteration,UNDEFINED_VALUE){return function(){this.previous=function(){var curr=this,prev=get_previous.call(curr),comparison=compare_types(curr,prev);return prev!==UNDEFINED_VALUE&&comparison!==UNDEFINED_VALUE&&comparison>=0?prev:stop_iteration()}}}(getPrevious,compareTypes,stopIteration)||emptyFct;EnumerableTrait=function(GetNextTrait,GetPreviousTrait){return function(){GetNextTrait.call(this);GetPreviousTrait.call(this)}}(GetNextTrait,GetPreviousTrait);return EnumerableTrait};var withdrawEnumerable=function(enumerable_create,default_config,is_function,object_keys){return function(enumerable,EnumerableTrait){var obj={};is_function(EnumerableTrait)&&EnumerableTrait.call(obj)||enumerable_create(default_config).call(obj);object_keys(obj).forEach(function(methodName){if(enumerable[methodName]+""==obj[methodName]+""){enumerable[methodName]=null;delete enumerable[methodName]}})}}(createEnumerableTrait,defaultTraitConfig,isFunction,global.Object.keys);var isEnumerable=function(is_function,NULL_VALUE,UNDEFINED_VALUE){return function(obj){return obj!==UNDEFINED_VALUE&&obj!==NULL_VALUE&&(is_function(obj.next)||is_function(obj.previous))}}(isFunction,null);return{"create":createEnumerableTrait,"withdraw":withdrawEnumerable,"isEnumerable":isEnumerable,"isStopIteration":isStopIteration}}.call(null)});


- Simple          - 1.563 byte
(function(e){var d=this.define,f=this.module;"function"==typeof d?d(e):"object"==typeof f&&f&&f.exports?f.exports=e():this.Enumerable=e()}).call(null,function(){return function(){var e="function"==typeof this.isFunction&&this.isFunction(this.isFunction)&&this.isFunction||function(a){return"function"==typeof a},d=function(){},f={next:d,previous:d,compare:d},c;if(!(c=/^\[object\s+StopIteration\]$/.test(this.Object.prototype.toString.call(this.StopIteration))&&this.StopIteration))c=function(){},c.prototype={},c.prototype.toString=function(){return"[object StopIteration]"},c.prototype.valueOf=function(){return this},c=new c;var g=c,j;j=function(){throw g;};var k;k=function(){};var h=function(a){var a="object"==typeof a&&a||{},c=a.next,l=a.previous,b=a.compare,f=!!a.isThrowStopIteration&&j||k,g;if(e(b)){if(1==b.length)var h=b,b=function(a,b){return h.call(a,b)}}else b=function(a,b){return e(a.compareTo)?a.compareTo(b):void 0};if(a=e(c))var i=b,a=function(){this.next=function(){var a=c.call(this),b=i(this,a);return void 0!==a&&void 0!==b&&0>=b?a:f()}};g=a||d;if(a=e(l))var m=b,a=function(){this.previous=function(){var a=l.call(this),b=m(this,a);return void 0!==a&&void 0!==b&&0<=b?a:f()}};var n=a||d;return function(){g.call(this);n.call(this)}},i=this.Object.keys;return{create:h,withdraw:function(a,c){var d={};e(c)&&c.call(d)||h(f).call(d);i(d).forEach(function(b){a[b]+""==d[b]+""&&(a[b]=null,delete a[b])})},isEnumerable:function(a){return void 0!==a&&null!==a&&(e(a.next)||e(a.previous))},isStopIteration:function(a){return a===g}}}.call(null)});


*/
