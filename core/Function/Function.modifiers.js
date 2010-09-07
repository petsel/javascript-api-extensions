

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


  FuncProto.cover = (function (isCallable) { // [cover] originally was named [embed] but wording of the latter closely missed the point - terms to the disadvantage of [cover] were [encase], [enclose] or [surround].

    return (function (fctCover) {

      var fct = this;
      if (isCallable(fctCover) && isCallable(fct)) {
        fct = (function (cover, embedded) {
          return (function () {

            return cover(embedded, cover);
          });
        })(fctCover, fct);
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


- Whitespace only -   882 byte : [before, after] only
(function(){var sh=this,FuncProto=sh.Function.prototype,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},isCallable=isFunction(sh.isCallable)&&sh.isCallable||isFunction;FuncProto.before=function(isCallable){return function(fctBefore){var fct=this;if(isCallable(fctBefore)&&isCallable(fct))fct=function(before,after){return function(){before();return after()}}(fctBefore,fct);return fct}}(isCallable);FuncProto.after=function(isCallable){return function(fctAfter){var fct=this;if(isCallable(fctAfter)&&isCallable(fct))fct=function(before,after){return function(){before();return after()}}(fct,fctAfter);return fct}}(isCallable);isCallable=isFunction=FuncProto=sh=null;delete isCallable;delete isFunction;delete FuncProto;delete sh;delete arguments.callee}).call(null);

- Simple          -   581 byte : [before, after] only
(function(){var c=this,e=c.Function.prototype,f=typeof c.isFunction=="function"&&c.isFunction||function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"},g=f(c.isCallable)&&c.isCallable||f;e.before=function(a){return function(d){var b=this;if(a(d)&&a(b))b=function(h,i){return function(){h();return i()}}(d,b);return b}}(g);e.after=function(a){return function(d){var b=this;if(a(d)&&a(b))b=function(h,i){return function(){h();return i()}}(b,d);return b}}(g);g=f=e=c=null;delete g;delete f;delete e;delete c;delete arguments.callee}).call(null);


- Whitespace only - 1.355 byte : [before, after, cover, replace]
(function(){var sh=this,FuncProto=sh.Function.prototype,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},isCallable=isFunction(sh.isCallable)&&sh.isCallable||isFunction;FuncProto.before=function(isCallable){return function(fctBefore){var fct=this;if(isCallable(fctBefore)&&isCallable(fct))fct=function(before,after){return function(){before();return after()}}(fctBefore,fct);return fct}}(isCallable);FuncProto.after=function(isCallable){return function(fctAfter){var fct=this;if(isCallable(fctAfter)&&isCallable(fct))fct=function(before,after){return function(){before();return after()}}(fct,fctAfter);return fct}}(isCallable);FuncProto.cover=function(isCallable){return function(fctCover){var fct=this;if(isCallable(fctCover)&&isCallable(fct))fct=function(cover,embedded){return function(){return cover(embedded,cover)}}(fctCover,fct);return fct}}(isCallable);FuncProto.replace=function(isCallable){return function(fctReplacement){var fct=this;if(isCallable(fctReplacement)&&isCallable(fct))fct=function(replacement){return function(){return replacement()}}(fctReplacement);return fct}}(isCallable);isCallable=isFunction=FuncProto=sh=null;delete isCallable;delete isFunction;delete FuncProto;delete sh;delete arguments.callee}).call(null);

- Simple          -   842 byte : [before, after, cover, replace]
(function(){var e=this,f=e.Function.prototype,i=typeof e.isFunction=="function"&&e.isFunction||function(b){return typeof b=="function"&&typeof b.call=="function"&&typeof b.apply=="function"},g=i(e.isCallable)&&e.isCallable||i;f.before=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(d,h){return function(){d();return h()}}(c,a);return a}}(g);f.after=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(d,h){return function(){d();return h()}}(a,c);return a}}(g);f.cover=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(d,h){return function(){return d(h,d)}}(c,a);return a}}(g);f.replace=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(d){return function(){return d()}}(c);return a}}(g);g=i=f=e=null;delete g;delete i;delete f;delete e;delete arguments.callee}).call(null);


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
}).cover(function (embedded/*[, cover]*/) {
  print("cover::open");
  embedded()
  print("cover::close");
}).after(function () {
  print("00");
}).before(function () {
  print("03");
})();
