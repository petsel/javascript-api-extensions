(function () {


  var
    global = this,


    Fct = global.Function,
    FctProto = Fct.prototype,


    isFunction = function (obj) {

      return (typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function");
    },
    emptyFct = function () {},

    getSanitizedTarget = (function (NULL_VALUE, UNDEFINED_VALUE) {
      return function (target) {

        return ((!target && ((target === UNDEFINED_VALUE) || (target === NULL_VALUE))) ? NULL_VALUE : target);
      };
    }(null)),


    callableTimes = function (amount, target) {
      return (function (callable, count, amount, target, get_sanitized, UNDEFINED_VALUE) {
        return function () {

          return ((amount > count++) ? callable.apply(get_sanitized(target), arguments) : UNDEFINED_VALUE);
        };
      }(((isFunction(this) && this) || emptyFct), 0, amount, target, getSanitizedTarget));
    },

    callableTwice = (function (callable_times) {
      return function (target) {

        return callable_times.call(this, 2, target);
      };
    }(callableTimes)),

    callableOnce = (function (callable_times) {
      return function (target) {

        return callable_times.call(this, 1, target);
      };
    }(callableTimes))
  ;


  FctProto.callableTimes = callableTimes;
  FctProto.callableTwice = callableTwice;
  FctProto.callableOnce = callableOnce;


}).call(null);



/*

  quick test

*/ /*

var fct = (function (msg) {console.log(msg + " - callableTimes(3)");}).callableTimes(3);
fct("foo"); // "foo - callableTimes(3)"
fct("foo"); // "foo - callableTimes(3)"
fct("foo"); // "foo - callableTimes(3)"
fct("foo"); // undefined

var fct = (function (msg) {console.log(msg + " - callableTwice()");}).callableTwice();
fct("bar"); // "bar - callableTwice()"
fct("bar"); // "bar - callableTwice()"
fct("bar"); // undefined

var fct = (function (msg) {console.log(msg + " - callableOnce()");}).callableOnce();
fct("baz"); // "baz - callableOnce()"
fct("baz"); // undefined

*/



/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.032 byte
(function(){var global=this,Fct=global.Function,FctProto=Fct.prototype,isFunction=function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},emptyFct=function(){},getSanitizedTarget=function(NULL_VALUE,UNDEFINED_VALUE){return function(target){return!target&&(target===UNDEFINED_VALUE||target===NULL_VALUE)?NULL_VALUE:target}}(null),callableTimes=function(amount,target){return function(callable,count,amount,target,get_sanitized,UNDEFINED_VALUE){return function(){return amount>count++?callable.apply(get_sanitized(target),arguments):UNDEFINED_VALUE}}(isFunction(this)&&this||emptyFct,0,amount,target,getSanitizedTarget)},callableTwice=function(callable_times){return function(target){return callable_times.call(this,2,target)}}(callableTimes),callableOnce=function(callable_times){return function(target){return callable_times.call(this,1,target)}}(callableTimes);FctProto.callableTimes=callableTimes;FctProto.callableTwice=callableTwice;FctProto.callableOnce=callableOnce}).call(null);


- Simple          -   440 byte
(function(){var b=this.Function.prototype,e=function(){},d;d=function(a){return!a&&(void 0===a||null===a)?null:a};var c=function(a,b){var c="function"==typeof this&&("function"==typeof this.call&&"function"==typeof this.apply)&&this||e,f=0;return function(){return a>f++?c.apply(d(b),arguments):void 0}};b.callableTimes=c;b.callableTwice=function(a){return c.call(this,2,a)};b.callableOnce=function(a){return c.call(this,1,a)}}).call(null);


*/
