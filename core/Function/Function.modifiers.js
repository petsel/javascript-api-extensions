

(function () {
  var sh/*scripting_host|global_object*/ = this, FuncProto = sh.Function.prototype,


  isFunction = (((typeof sh.isFunction == "function") && sh.isFunction) || (function (obj/*:[object|value]*/) {
    return ((typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function"));
  })),
  isCallable = ((isFunction(sh.isCallable) && sh.isCallable) || isFunction/* sufficient enough fallback */);


  FuncProto.before = (function (isCallable) {
    return (function (fctBefore) {

      var fct = this;
      if (isCallable(fctBefore) && isCallable(fct)) {
        fct = (function (before, after) {
          return (function () {

            before();
            return after();
          });
        })(fctBefore, fct);
      }
      return fct;
    });
  })(isCallable);


  FuncProto.after = (function (isCallable) {
    return (function (fctAfter) {

      var fct = this;
      if (isCallable(fctAfter) && isCallable(fct)) {
        fct = (function (before, after) {
          return (function () {

            before();
            return after();
          });
        })(fct, fctAfter);
      }
      return fct;
    });
  })(isCallable);/*

  FuncProto.after = (function (before) {
    return (function (fctAfter) {

      return before.call(fctAfter, this);
    });
  })(FuncProto.before);
*/


  FuncProto.embed = (function (isCallable) {
    return (function (fctWrapper) {

      var fct = this;
      if (isCallable(fctWrapper) && isCallable(fct)) {
        fct = (function (wrapper, embedded) {
          return (function () {

            return wrapper(embedded, wrapper);
          });
        })(fctWrapper, fct);
      }
      return fct;
    });
  })(isCallable);


  FuncProto.replace = (function (isCallable) {
    return (function (fctReplacement) {

      var fct = this;
      if (isCallable(fctReplacement) && isCallable(fct)) {
        fct = (function (replacement) {
          return (function () {

            return replacement();
          });
        })(fctReplacement);
      }
      return fct;
    });
  })(isCallable);


  isCallable = isFunction = FuncProto = sh = null;
  delete isCallable; delete isFunction; delete FuncProto; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.085 byte : [before, after, replace] only
(function(){var sh=this,FuncProto=sh.Function.prototype,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},isCallable=isFunction(sh.isCallable)&&sh.isCallable||isFunction;FuncProto.before=function(isCallable){return function(fctBefore){var fct=this;if(isCallable(fctBefore)&&isCallable(fct))fct=function(before,after){return function(){before();after()}}(fctBefore,fct);return fct}}(isCallable);FuncProto.after=function(isCallable){return function(fctAfter){var fct=this;if(isCallable(fctAfter)&&isCallable(fct))fct=function(before,after){return function(){before();after()}}(fct,fctAfter);return fct}}(isCallable);FuncProto.replace=function(isCallable){return function(fctReplaced){var fct=this;if(isCallable(fctReplaced)&&isCallable(fct))fct=function(replaced){return function(){replaced()}}(fctReplaced);return fct}}(isCallable);isCallable=isFunction=FuncProto=sh=null;delete isCallable;delete isFunction;delete FuncProto;delete sh;delete arguments.callee}).call(null);

- Whitespace only - 1.367 byte : [before, after, replace, embed]
(function(){var sh=this,FuncProto=sh.Function.prototype,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},isCallable=isFunction(sh.isCallable)&&sh.isCallable||isFunction;FuncProto.before=function(isCallable){return function(fctBefore){var fct=this;if(isCallable(fctBefore)&&isCallable(fct))fct=function(before,after){return function(){before();return after()}}(fctBefore,fct);return fct}}(isCallable);FuncProto.after=function(isCallable){return function(fctAfter){var fct=this;if(isCallable(fctAfter)&&isCallable(fct))fct=function(before,after){return function(){before();return after()}}(fct,fctAfter);return fct}}(isCallable);FuncProto.embed=function(isCallable){return function(fctWrapper){var fct=this;if(isCallable(fctWrapper)&&isCallable(fct))fct=function(wrapper,embedded){return function(){return wrapper(embedded,wrapper)}}(fctWrapper,fct);return fct}}(isCallable);FuncProto.replace=function(isCallable){return function(fctReplacement){var fct=this;if(isCallable(fctReplacement)&&isCallable(fct))fct=function(replacement){return function(){return replacement()}}(fctReplacement);return fct}}(isCallable);isCallable=isFunction=FuncProto=sh=null;delete isCallable;delete isFunction;delete FuncProto;delete sh;delete arguments.callee}).call(null);


- Simple          -   688 byte : [before, after, replace] only
(function(){var d=this,e=d.Function.prototype,h=typeof d.isFunction=="function"&&d.isFunction||function(b){return typeof b=="function"&&typeof b.call=="function"&&typeof b.apply=="function"},f=h(d.isCallable)&&d.isCallable||h;e.before=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(g,i){return function(){g();i()}}(c,a);return a}}(f);e.after=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(g,i){return function(){g();i()}}(a,c);return a}}(f);e.replace=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(g){return function(){g()}}(c);return a}}(f);f=h=e=d=null;delete f;delete h;delete e;delete d;delete arguments.callee}).call(null);

- Simple          -   842 byte : [before, after, replace, embed]
(function(){var e=this,f=e.Function.prototype,i=typeof e.isFunction=="function"&&e.isFunction||function(b){return typeof b=="function"&&typeof b.call=="function"&&typeof b.apply=="function"},g=i(e.isCallable)&&e.isCallable||i;f.before=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(d,h){return function(){d();return h()}}(c,a);return a}}(g);f.after=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(d,h){return function(){d();return h()}}(a,c);return a}}(g);f.embed=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(d,h){return function(){return d(h,d)}}(c,a);return a}}(g);f.replace=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(d){return function(){return d()}}(c);return a}}(g);g=i=f=e=null;delete g;delete i;delete f;delete e;delete arguments.callee}).call(null);


*/ /*


  please run this simple test within [http://jconsole.com/]

*/


(function () {
  print("01");
}).after(function () {
  print("02");
})();

print("\n");

(function () {
  print("01");
}).before(function () {
  print("02");
})();

print("\n");

(function () {
  print("01");
}).replace(function () {
  print("02");
})();

print("\n");

(function () {
  print("01");
}).before(function () {
  print("02");
}).embed(function (embedded) {
  print("wrapper::open");
  embedded()
  print("wrapper::close");
}).after(function () {
  print("00");
}).before(function () {
  print("03");
})();
