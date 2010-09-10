

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
  })(isCallable);/*


//thinking it over there really is no need for a [skip] or a [replace] modifier:

  FuncProto.skip = (function (isCallable) {
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
*/

  isCallable = isFunction = FuncProto = sh = null;
  delete isCallable; delete isFunction; delete FuncProto; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.117 byte : [before, after, cover]
(function(){var sh=this,FuncProto=sh.Function.prototype,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},isCallable=isFunction(sh.isCallable)&&sh.isCallable||isFunction;FuncProto.before=function(isCallable){return function(fctBefore){var fct=this;if(isCallable(fctBefore)&&isCallable(fct))fct=function(before,after){return function(){before();return after()}}(fctBefore,fct);return fct}}(isCallable);FuncProto.after=function(isCallable){return function(fctAfter){var fct=this;if(isCallable(fctAfter)&&isCallable(fct))fct=function(before,after){return function(){before();return after()}}(fct,fctAfter);return fct}}(isCallable);FuncProto.cover=function(isCallable){return function(fctCover){var fct=this;if(isCallable(fctCover)&&isCallable(fct))fct=function(cover,embedded){return function(){return cover(embedded,cover)}}(fctCover,fct);return fct}}(isCallable);isCallable=isFunction=FuncProto=sh=null;delete isCallable;delete isFunction;delete FuncProto;delete sh;delete arguments.callee}).call(null);

- Simple          -   714 byte : [before, after, cover]
(function(){var d=this,f=d.Function.prototype,i=typeof d.isFunction=="function"&&d.isFunction||function(b){return typeof b=="function"&&typeof b.call=="function"&&typeof b.apply=="function"},g=i(d.isCallable)&&d.isCallable||i;f.before=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(e,h){return function(){e();return h()}}(c,a);return a}}(g);f.after=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(e,h){return function(){e();return h()}}(a,c);return a}}(g);f.cover=function(b){return function(c){var a=this;if(b(c)&&b(a))a=function(e,h){return function(){return e(h,e)}}(c,a);return a}}(g);g=i=f=d=null;delete g;delete i;delete f;delete d;delete arguments.callee}).call(null);


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
/*
(function () {
  print("01");
}).skip(function () {
  print("02");
})();

print("\n");
*/
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

