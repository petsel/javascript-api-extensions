/*
  Ecma/TC39/2009/025 - Final Draft ECMA-262 5th Edition / April 2009 - ECMAScript Language Specification


  15.3.4.5 Function.prototype.bind (thisArg [, arg1 [, arg2, …]])

  The bind method takes one or more arguments, thisArg and (optionally) arg1, arg2, etc, and returns a new function object by performing the following steps:

  1. Let Target be the this value.
  2. If IsCallable(Target) is false, throw a TypeError exception.
  3. Let A be a new (possibly empty) internal list of all of the argument values provided after thisArg (arg1, arg2 etc), in order.
  4. Let F be a new native ECMAScript object .
  5. Set the [[TargetFunction]] internal property of F to Target.
  6. Set the [[BoundThis]] internal property of F to the value of thisArg.
  7. Set the [[BoundArgs]] internal property of F to A.
  8. Set the [[Class]] internal property of F to "Function".
  9. Set the [[Prototype]] internal property of F to the standard built-in Function prototype object as specified in 15.3.3.1.
  10. Set the [[Call]] internal property of F as described in 15.3.4.5.1.
  11. Set the [[Construct]] internal property of F as described in 15.3.4.5.2.
  12. Set the [[HasInstance]] internal property of F as described in 15.3.4.5.3.
  13. The [[Scope]] internal property of F is unused and need not exist.
  14. If the [[Class]] internal property of Target is "Function", then
  a. Let L be the length property of Target minus the length of A.
  b. Set the length own property of F to either 0 or L, whichever is larger.
  15. Else set the length own property of F to 0.
  16. The length own property of F is given attributes as specified in 15.3.5.1.
  17. Set the [[Extensible]] internal property of F to true.
  18. Call the [[DefineOwnProperty]] internal method of F with arguments "caller", PropertyDescriptor {[[Value: null, [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false}, and false.
  19. Call the [[DefineOwnProperty]] internal method of F with arguments "arguments", PropertyDescriptor {[[Value: null, [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: false}, and false.
  20. Return F.

  The length property of the bind method is 1. NOTE Function objects created using Function.prototype.bind do not have a prototype property.

*/ /*

  last revision of code beneath at   : have a look into the github log
  first revision of code beneath at  : 17th of February 2010
  first implementation of beneath at : 30th of May 2007

*/


(function () {
  var sh/*scripting_host|global_object*/ = this, Func = sh.Function, FuncProto = Func.prototype, slice = sh.Array.prototype.slice,


  isFunction = (((typeof sh.isFunction == "function") && sh.isFunction) || (function (obj/*:[object|value]*/) {
    return ((typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function"));
  })),
  isCallable = ((isFunction(sh.isCallable) && sh.isCallable) || isFunction/* sufficient enough fallback */);


  FuncProto.bind = (function (slice, isCallable) {
    return (function (/*obj, param0, param1, ...*/)/*:[Function[closure]]*/ {

      if (isCallable(this)) {
        var arr = slice.call(arguments), obj = arr.shift(), fct = this;

        return (function () {
          fct.apply(obj, arr); // [fct]'s arguments are "(param01, param02, ...)" and [fct] itself will be executed within [obj]'s context.
        });
      } else {
        throw (new TypeError("The object delegated via apply/call onto [[Function]]'s prototypal [bind] is not callable."));
      }
    });
  })(slice, isCallable);


  // this [bindAsEventListener] implementation ... [bindToEventHandler] was the more precise term ... is aware of DOM events in addition to all already passed arguments.
  FuncProto.bindAsEventListener = (function (slice, isCallable, global) {
    return (function (/*obj, param0, param1, ...*/)/*:[Function[closure aware of DOM events]]*/ {

      if (isCallable(this)) {
        var arr = slice.call(arguments), obj = arr.shift(), fct = this;

        return (function (evt) {
          fct.apply(obj, [evt || global.event].concat(arr)); // [fct]'s arguments are "(evt, param01, param02, ...)" and [fct] itself will be executed within [obj]'s context.
        });
      } else {
        throw (new TypeError("The object delegated via apply/call onto [[Function]]'s prototypal [bindAsEventListener] is not callable."));
      }
    });
  })(slice, isCallable, sh);/*


  // this [bindAsEventListener] implementation ... [bindToEventHandler] was the more precise term ... is aware of DOM events only - any additionally passed arguments will not be recognized.
  FuncProto.bindAsEventListener = (function (isCallable, global) {
    return (function (obj)/ *:[Function[closure aware of DOM events]]* / {

      if (isCallable(this)) {
        var fct = this;

        return (function (evt) {
          fct.call(obj, (evt || global.event)); // [fct]'s only argument is "(evt)" ... [fct] itself will be executed within [obj]'s context.
        });
      } else {
        throw (new TypeError("The object delegated via apply/call onto [[Function]]'s [bindAsEventListener] prototype is not callable."));
      }
    });
  })(isCallable, sh);
*/

  isCallable = isFunction = slice = FuncProto = Func = sh = null;
  delete isCallable; delete isFunction; delete slice; delete FuncProto; delete Func; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.200 byte :
(function(){var sh=this,Func=sh.Function,FuncProto=Func.prototype,slice=sh.Array.prototype.slice,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},isCallable=isFunction(sh.isCallable)&&sh.isCallable||isFunction;FuncProto.bind=function(slice,isCallable){return function(){if(isCallable(this)){var arr=slice.call(arguments),obj=arr.shift(),fct=this;return function(){fct.apply(obj,arr)}}else throw new TypeError("The object delegated via apply/call onto [[Function]]'s prototypal [bind] is not callable.");}}(slice,isCallable);FuncProto.bindAsEventListener=function(slice,isCallable,global){return function(){if(isCallable(this)){var arr=slice.call(arguments),obj=arr.shift(),fct=this;return function(evt){fct.apply(obj,[evt||global.event].concat(arr))}}else throw new TypeError("The object delegated via apply/call onto [[Function]]'s prototypal [bindAsEventListener] is not callable.");}}(slice,isCallable,sh);isCallable=isFunction=slice=FuncProto=Func=sh=null;delete isCallable;delete isFunction;delete slice;delete FuncProto;delete Func;delete sh;delete arguments.callee}).call(null);

- Simple          -   926 byte :
(function(){var a=this,i=a.Function,c=i.prototype,d=a.Array.prototype.slice,e=typeof a.isFunction=="function"&&a.isFunction||function(b){return typeof b=="function"&&typeof b.call=="function"&&typeof b.apply=="function"},f=e(a.isCallable)&&a.isCallable||e;c.bind=function(b,j){return function(){if(j(this)){var g=b.call(arguments),h=g.shift(),k=this;return function(){k.apply(h,g)}}else throw new TypeError("The object delegated via apply/call onto [[Function]]'s prototypal [bind] is not callable.");}}(d,f);c.bindAsEventListener=function(b,j,g){return function(){if(j(this)){var h=b.call(arguments),k=h.shift(),l=this;return function(m){l.apply(k,[m||g.event].concat(h))}}else throw new TypeError("The object delegated via apply/call onto [[Function]]'s prototypal [bindAsEventListener] is not callable.");}}(d,f,a);f=e=d=c=i=a=null;delete f;delete e;delete d;delete c;delete i;delete a;delete arguments.callee}).call(null);


*/ /*


  please run this simple test within [http://jconsole.com/]

*/


var obj = {
  about: "me is just an object",
  onClickHandler: (function (/*evt, param01, param02, ...*/) {

    var arr = Array.prototype.slice.call(arguments), evt = arr.shift();

    print("this.about : "  + this.about);
    print("evt :" + ((evt.toSource && evt.toSource()) || evt.toString()));
    print("parameter list : " + ((arr.toSource && arr.toSource()) || arr.join(", ")));
  })
};

obj.onClickHandler({"target": "foo", "event": "bar"}, "hallo", "world");

document.about = "me is the [document] object";
document.onclick = obj.onClickHandler;

document.onclick = obj.onClickHandler.bindAsEventListener(obj, "hallo", "world");
