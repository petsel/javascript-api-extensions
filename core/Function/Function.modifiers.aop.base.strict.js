(function () {


  "use strict";


  var
    f = Function,
    global = f("return this")(),


    FctProto = global.Function.prototype,


    isFunction = function (obj/*:[object|value]*/) { // returns true only in case of this global functions argument is an ECMAScript [[Function]] type.

  //  x-frame-safe and also filters e.g. [[RegExp]] implementationa of older mozilla version.
      return (typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function");
    },


    makeModifierBeforeAfter = function (fctBefore, fctAfter, target) {
      return function () {

        var args = arguments;

        fctBefore.apply(target, args);
        return fctAfter.apply(target, args);
      };
    },
    makeModifierAround = function (fctEnclosed, fctAround, target) {
      return function () {

    //  return fctAround.call(target, arguments, fctEnclosed, fctAround, target);
        return fctAround.call(target, fctEnclosed, fctAround, arguments, target);
      };
    },
    getSanitizedTarget = (function (NULL_VALUE, UNDEFINED_VALUE) {
      return function (target) {

        return (!target && ((target === UNDEFINED_VALUE) || (target === NULL_VALUE))) ? NULL_VALUE : target;
      };
    })(null)
  ;


  FctProto.before = (isFunction(FctProto.before) && FctProto.before) || (function (is_function, make_modifier, get_sanitized) {
    return function (adviceBefore/*:function*/, target/*:object(optional)*/) {

      var proceedAfter = this;
      return (is_function(adviceBefore) && is_function(proceedAfter) && make_modifier(adviceBefore, proceedAfter, get_sanitized(target))) || proceedAfter;
    };
  })(isFunction, makeModifierBeforeAfter, getSanitizedTarget);


  FctProto.after = (isFunction(FctProto.after) && FctProto.after) || (function (is_function, make_modifier, get_sanitized) {
    return function (adviceAfter/*:function*/, target/*:object(optional)*/) {

      var proceedBefore = this;
      return (is_function(proceedBefore) && is_function(adviceAfter) && make_modifier(proceedBefore, adviceAfter, get_sanitized(target))) || proceedBefore;
    };
  })(isFunction, makeModifierBeforeAfter, getSanitizedTarget);


  FctProto.around/* = FctProto.cover*/ = (isFunction(FctProto.around) && FctProto.around) || (function (is_function, make_modifier, get_sanitized) {
    return function (adviceAround/*:function*/, target/*:object(optional)*/) {

      var proceedEnclosed = this;
      return (is_function(proceedEnclosed) && is_function(adviceAround) && make_modifier(proceedEnclosed, adviceAround, get_sanitized(target))) || proceedEnclosed;
    };
  })(isFunction, makeModifierAround, getSanitizedTarget);


  getSanitizedTarget = makeModifierAround = makeModifierBeforeAfter = null;
  isFunction = FctProto = global = f = null;


})();



/*

var hi = function (toWhome) {

  console.log("hi " + toWhome);
};
var ho = function (toWhome) {

  console.log("ho " + toWhome);
};

console.log("hi : " + hi);

hi = hi.before(ho);

console.log("hi : " + hi);

hi("to everyone");
console.log("+++ +++ +++");



var hi = function (toWhome) {

  console.log("hi " + toWhome);
};
var ho = function (toWhome) {

  console.log("ho " + toWhome);
};

console.log("hi : " + hi);

hi = hi.after(ho);

console.log("hi : " + hi);

hi("to everyone");
console.log("+++ +++ +++");


var hi = function (toWhome) {

  console.log("hi " + toWhome);
};
var ho = function (toWhome) {

  console.log("ho " + toWhome);
};

console.log("ho : " + ho);

ho = ho.after(hi);

console.log("ho : " + ho);

ho("to everyone");
console.log("+++ +++ +++");



var hi = function (toWhome) {

  console.log("hi " + toWhome);
};
var ho = function (enclosed, around, args, target) {

  console.log("ho, ho, ho " + args[0]);
  enclosed.apply(target, args)
  console.log("ho, ho, ho " + args[0]);

  console.log("(around === arguments.callee) ? " + (around === arguments.callee));
};

console.log("hi : " + hi);

hi = hi.around(ho);

console.log("hi : " + hi);

hi("to everyone");
console.log("+++ +++ +++");

*/
