

(function () {
  var sh/*scripting_host|global_object*/ = this, FuncProto = sh.Function.prototype,


  isFunction = (((typeof sh.isFunction == "function") && sh.isFunction) || (function (obj/*:[object|value]*/) {
    return ((typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function"));
  })),
  isCallable = ((isFunction(sh.isCallable) && sh.isCallable) || isFunction/* sufficient enough fallback */);


  FuncProto.before = (function (isCallable) {
    return (function (fctBefore, target/*optional*/) {

      var fct = this;
      if (isCallable(fctBefore) && isCallable(fct)) {
        if ((typeof target == "undefined") || (!target && (typeof target == "object"))) {
          fct = (function (before, after) {
            return (function () {

              before();
              return after();
            });
          })(fctBefore, fct);
        } else {
          fct = (function (before, after, target) {
            return (function () {

              before.call(target);
              return after.call(target);
            });
          })(fctBefore, fct, target);
        }
      }
      return fct;
    });
  })(isCallable);


  FuncProto.after = (function (isCallable) {
    return (function (fctAfter, target/*optional*/) {

      var fct = this;
      if (isCallable(fctAfter) && isCallable(fct)) {
        if ((typeof target == "undefined") || (!target && (typeof target == "object"))) {
          fct = (function (before, after) {
            return (function () {

              before();
              return after();
            });
          })(fct, fctAfter);
        } else {
          fct = (function (before, after, target) {
            return (function () {

              before.call(target);
              return after.call(target);
            });
          })(fct, fctAfter, target);
        }
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
    return (function (fctCover, target/*optional*/) {

      var fct = this;
      if (isCallable(fctCover) && isCallable(fct)) {
        if ((typeof target == "undefined") || (!target && (typeof target == "object"))) {
          fct = (function (cover, embedded) {
            return (function () {

              return cover(embedded, cover);
            });
          })(fctCover, fct);
        } else {
          fct = (function (cover, embedded, target) {
            return (function () {

              return cover.call(target, embedded, cover, target);
            });
          })(fctCover, fct, target);
        }
      }
      return fct;
    });
  })(isCallable);/*


//thinking it over there really is no need for a [skip] or a [replace] modifier:

  FuncProto.skip = (function (isCallable) {
    return (function (fctReplacement, target/ *optional* /) {

      var fct = this;
      if (isCallable(fctReplacement) && isCallable(fct)) {
        if ((typeof target == "undefined") || (!target && (typeof target == "object"))) {
          fct = (function (replacement) {
            return (function () {

              return replacement();
            });
          })(fctReplacement);
        } else {
          fct = (function (replacement, target) {
            return (function () {

              return replacement.call(target);
            });
          })(fctReplacement, target);
        }
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


- Whitespace only - 1.712 byte : [before, after, cover]
(function(){var sh=this,FuncProto=sh.Function.prototype,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},isCallable=isFunction(sh.isCallable)&&sh.isCallable||isFunction;FuncProto.before=function(isCallable){return function(fctBefore,target){var fct=this;if(isCallable(fctBefore)&&isCallable(fct))if(typeof target=="undefined"||!target&&typeof target=="object")fct=function(before,after){return function(){before();return after()}}(fctBefore,fct);else fct=function(before,after,target){return function(){before.call(target);return after.call(target)}}(fctBefore,fct,target);return fct}}(isCallable);FuncProto.after=function(isCallable){return function(fctAfter,target){var fct=this;if(isCallable(fctAfter)&&isCallable(fct))if(typeof target=="undefined"||!target&&typeof target=="object")fct=function(before,after){return function(){before();return after()}}(fct,fctAfter);else fct=function(before,after,target){return function(){before.call(target);return after.call(target)}}(fct,fctAfter,target);return fct}}(isCallable);FuncProto.cover=function(isCallable){return function(fctCover,target){var fct=this;if(isCallable(fctCover)&&isCallable(fct))if(typeof target=="undefined"||!target&&typeof target=="object")fct=function(cover,embedded){return function(){return cover(embedded,cover)}}(fctCover,fct);else fct=function(cover,embedded,target){return function(){return cover.call(target,embedded,cover,target)}}(fctCover,fct,target);return fct}}(isCallable);isCallable=isFunction=FuncProto=sh=null;delete isCallable;delete isFunction;delete FuncProto;delete sh;delete arguments.callee}).call(null);

- Simple          - 1.064 byte : [before, after, cover]
(function(){var h=this,i=h.Function.prototype,k=typeof h.isFunction=="function"&&h.isFunction||function(d){return typeof d=="function"&&typeof d.call=="function"&&typeof d.apply=="function"},j=k(h.isCallable)&&h.isCallable||k;i.before=function(d){return function(e,b){var a=this;if(d(e)&&d(a))a=typeof b=="undefined"||!b&&typeof b=="object"?function(c,f){return function(){c();return f()}}(e,a):function(c,f,g){return function(){c.call(g);return f.call(g)}}(e,a,b);return a}}(j);i.after=function(d){return function(e,b){var a=this;if(d(e)&&d(a))a=typeof b=="undefined"||!b&&typeof b=="object"?function(c,f){return function(){c();return f()}}(a,e):function(c,f,g){return function(){c.call(g);return f.call(g)}}(a,e,b);return a}}(j);i.cover=function(d){return function(e,b){var a=this;if(d(e)&&d(a))a=typeof b=="undefined"||!b&&typeof b=="object"?function(c,f){return function(){return c(f,c)}}(e,a):function(c,f,g){return function(){return c.call(g,f,c,g)}}(e,a,b);return a}}(j);j=k=i=h=null;delete j;delete k;delete i;delete h;delete arguments.callee}).call(null);


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined        - 1.008 byte : [before, after, cover]
eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(){6 h=5,i=h.p.t,k=2 h.m=="0"&&h.m||0(d){1 2 d=="0"&&2 d.3=="0"&&2 d.v=="0"},j=k(h.l)&&h.l||k;i.s=0(d){1 0(e,b){6 a=5;7(d(e)&&d(a))a=2 b=="8"||!b&&2 b=="9"?0(c,f){1 0(){c();1 f()}}(e,a):0(c,f,g){1 0(){c.3(g);1 f.3(g)}}(e,a,b);1 a}}(j);i.q=0(d){1 0(e,b){6 a=5;7(d(e)&&d(a))a=2 b=="8"||!b&&2 b=="9"?0(c,f){1 0(){c();1 f()}}(a,e):0(c,f,g){1 0(){c.3(g);1 f.3(g)}}(a,e,b);1 a}}(j);i.r=0(d){1 0(e,b){6 a=5;7(d(e)&&d(a))a=2 b=="8"||!b&&2 b=="9"?0(c,f){1 0(){1 c(f,c)}}(e,a):0(c,f,g){1 0(){1 c.3(g,f,c,g)}}(e,a,b);1 a}}(j);j=k=i=h=n;4 j;4 k;4 i;4 h;4 u.o}).3(n);',32,32,'function|return|typeof|call|delete|this|var|if|undefined|object||||||||||||isCallable|isFunction|null|callee|Function|after|cover|before|prototype|arguments|apply'.split('|'),0,{}));


*/ /*


  please run this simple test within [http://jconsole.com/]

*/
var arr = [9,8,7,6,5,4,3,2,1,0];
print("arr : " + arr);
print("\n");

print(arr.reverse.before(function(){print(this[0]);}));
print(arr.reverse.before(function(){print(this[0]);}, arr));
print("\n");
print("\n");

print(arr.reverse.before(function(){print(this[0]);}, arr)());
print("\n");

print(arr.reverse.before(function(){print(this[0]);}, arr)());
print("\n");

print(arr.reverse.before(function(){print(this[0]);}, arr)());
print("\n");
print("\n");

print(arr.reverse.before(function(){print(this[0]);}, arr)()[0]);
print("\n");

print(arr.reverse.before(function(){print(this[0]);}, arr)()[0]);
print("\n");

print(arr.reverse.before(function(){print(this[0]);}, arr)()[0]);
print("\n");
print("\n");


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

print("\n");
print("\n");



var GenericControllerMixin = (function () {

  if (this instanceof arguments.callee) {
    throw(new ReferenceError("GenericControllerMixin is protected from instantiation ... it rather should be called/applied onto already existing appropriate object references."));
  }
  this.initialize = (function () {
    print("generic initialization block");
  });
});


var SpecificControllerSingleton = (function (GENERIC_CONTROLLER_MIXIN, obj) {

  GENERIC_CONTROLLER_MIXIN.call(obj);

//print(obj.initialize);
  obj.initialize = obj.initialize.cover((function (generic) {
//print(this.toSource());
    print("specific initialization block");
    generic();
    print("specific initialization block");
  }), obj);
//print(obj.initialize);

  return obj;

})(GenericControllerMixin, {});


SpecificControllerSingleton.initialize();

