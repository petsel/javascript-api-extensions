(function () {


  "use strict";


  var
    f = Function,
    global = f("return this")(),


    Fct = global.Function,
    FctProto = Fct.prototype,


    isFunction = (

      ((typeof global.isFunction == "function") && global.isFunction)
      || ((typeof Fct.isFunction == "function") && Fct.isFunction)

      || function (obj/*:[object|value]*/) {  // returns true only in case of this global functions argument is an ECMAScript [[Function]] type.

    //  x-frame-safe and also filters e.g. [[RegExp]] implementationa of older mozilla version.
        return (typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function");
      }
    ),
    isCallable = (

      (isFunction(global.isCallable) && global.isCallable)
      || (isFunction(Fct.isCallable) && Fct.isCallable)

      || (function (is_function, TypeErr) {            // returns true only in case of this global functions argument is a callable type.

        var
          get_callability = function (assumeCallable) {
            var isCallable = false;
            try {
              assumeCallable();
              isCallable = true;
            } catch (exc) {
              isCallable = !(exc instanceof TypeErr) && (exc.message != "NOT_SUPPORTED_ERR");
            }
            return isCallable;
          },
          REG_X_CALLABLE = (/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/)
        ;
        return function (obj/*:[object|value]*/) {/*

          - older opera versions falsly can bypass this since for example [Element] claims to be typeof "function" as well as supporting both functional [call] and [apply].
          - the [getCallability] test then will not be entered even though it was going to fail throwing "Error: NOT_SUPPORTED_ERR".

          - either way - this test remains unchanged so far since a natively implemented [Function]-object always should be callable.
        */
          return is_function(obj) || REG_X_CALLABLE.test("" + obj) || get_callability(obj);
        };
      }(isFunction, global.TypeError))
    ),


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

        return (!target && ((target == UNDEFINED_VALUE) || (target == NULL_VALUE))) ? NULL_VALUE : target;
      };
    }(null))
  ;


  FctProto.before = (isFunction(FctProto.before) && FctProto.before) || (function (is_callable, make_modifier, get_sanitized) {
    return function (fctBefore/*:object(callable)*/, target/*:object(optional)*/) {

      var fctAfter = this;
      return (is_callable(fctBefore) && is_callable(fctAfter) && make_modifier(fctBefore, fctAfter, get_sanitized(target))) || fctAfter;
    };
  }(isCallable, makeModifierBeforeAfter, getSanitizedTarget));


  FctProto.after = (isFunction(FctProto.after) && FctProto.after) || (function (is_callable, make_modifier, get_sanitized) {
    return function (fctAfter/*:object(callable)*/, target/*:object(optional)*/) {

      var fctBefore = this;
      return (is_callable(fctBefore) && is_callable(fctAfter) && make_modifier(fctBefore, fctAfter, get_sanitized(target))) || fctBefore;
    };
  }(isCallable, makeModifierBeforeAfter, getSanitizedTarget));


  FctProto.around/* = FctProto.cover*/ = (isFunction(FctProto.around) && FctProto.around) || (function (is_callable, make_modifier, get_sanitized) {
    return function (fctAround/*:object(callable)*/, target/*:object(optional)*/) {

      var fctEnclosed = this;
      return (is_callable(fctEnclosed) && is_callable(fctAround) && make_modifier(fctEnclosed, fctAround, get_sanitized(target))) || fctEnclosed;
    };
  }(isCallable, makeModifierAround, getSanitizedTarget));


  getSanitizedTarget = makeModifierAround = makeModifierBeforeAfter = null;
  isCallable = isFunction = FctProto = Fct = global = f = null;


}());



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
