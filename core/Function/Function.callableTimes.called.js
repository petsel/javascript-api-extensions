(function () {


  var
    global = this,


    Arr = global.Array,
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

    makeArray = (isFunction(Arr.make) && Arr.make) || (function (proto_slice) {
      return function (list) {

        return proto_slice.call(list);
      };
    }(Arr.prototype.slice)),

    enrichCallableArguments = (function (make_array) {
      return function (args, callable, count, amount, target) {

        return ((args = make_array(args)) && args.push({callable: callable, count: count, amount: amount, target: target}) && args);
      };
    }(makeArray)),


    callableTimes = function (amount, target) {
      return (function (callable, count, amount, target, get_sanitized, enrich, UNDEFINED_VALUE) {
        return function () {

          return ((amount > count++) ? callable.apply((target = get_sanitized(target)), enrich(arguments, callable, count, amount, target)) : UNDEFINED_VALUE);
        };
      }(((isFunction(this) && this) || emptyFct), 0, amount, target, getSanitizedTarget, enrichCallableArguments));
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

var fct = (function (msg, called) {console.log((msg + " - callableTimes(3)"), called);}).callableTimes(3);
fct("foo"); // "foo - callableTimes(3)", Object {...}
fct("foo"); // "foo - callableTimes(3)", Object {...}
fct("foo"); // "foo - callableTimes(3)", Object {...}
fct("foo"); // undefined

var fct = (function (msg, called) {console.log((msg + " - callableTwice()"), called);}).callableTwice();
fct("bar"); // "bar - callableTwice()", Object {...}
fct("bar"); // "bar - callableTwice()", Object {...}
fct("bar"); // undefined

var fct = (function (msg, called) {console.log((msg + " - callableOnce()"), called);}).callableOnce();
fct("baz"); // "baz - callableOnce()", Object {...}
fct("baz"); // undefined

*/



/*


 [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.480 byte
(function(){var global=this,Arr=global.Array,Fct=global.Function,FctProto=Fct.prototype,isFunction=function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},emptyFct=function(){},getSanitizedTarget=function(NULL_VALUE,UNDEFINED_VALUE){return function(target){return!target&&(target===UNDEFINED_VALUE||target===NULL_VALUE)?NULL_VALUE:target}}(null),makeArray=isFunction(Arr.make)&&Arr.make||function(proto_slice){return function(list){return proto_slice.call(list)}}(Arr.prototype.slice),enrichCallableArguments=function(make_array){return function(args,callable,count,amount,target){return(args=make_array(args))&&args.push({callable:callable,count:count,amount:amount,target:target})&&args}}(makeArray),callableTimes=function(amount,target){return function(callable,count,amount,target,get_sanitized,enrich,UNDEFINED_VALUE){return function(){return amount>count++?callable.apply(target=get_sanitized(target),enrich(arguments,callable,count,amount,target)):UNDEFINED_VALUE}}(isFunction(this)&&this||emptyFct,0,amount,target,getSanitizedTarget,enrichCallableArguments)},callableTwice=function(callable_times){return function(target){return callable_times.call(this,2,target)}}(callableTimes),callableOnce=function(callable_times){return function(target){return callable_times.call(this,1,target)}}(callableTimes);FctProto.callableTimes=callableTimes;FctProto.callableTwice=callableTwice;FctProto.callableOnce=callableOnce}).call(null);


- Simple          -   676 byte
(function(){var b=this.Array,f=this.Function.prototype,j=function(a){return"function"==typeof a&&"function"==typeof a.call&&"function"==typeof a.apply},m=function(){},k;k=function(a){return!a&&(void 0===a||null===a)?null:a};var g;if(!(g=j(b.make)&&b.make)){var n=b.prototype.slice;g=function(a){return n.call(a)}}var l,p=g;l=function(a,b,d,e,c){return(a=p(a))&&a.push({callable:b,count:d,amount:e,target:c})&&a};var h=function(a,b){var d=j(this)&&this||m,e=0,c=b;return function(){return a>e++?d.apply(c=k(c),l(arguments,d,e,a,c)):void 0}};f.callableTimes=h;f.callableTwice=function(a){return h.call(this,2,a)};f.callableOnce=function(a){return h.call(this,1,a)}}).call(null);


*/
