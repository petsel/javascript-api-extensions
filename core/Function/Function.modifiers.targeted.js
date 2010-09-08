

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
        if (target || ((typeof target != "undefined") && (typeof target != "object"))) {
          fct = (function (before, after, target) {
            return (function () {

              before.call(target);
              return after.call(target);
            });
          })(fctBefore, fct, target);
        } else {
          fct = (function (before, after) {
            return (function () {

              before();
              return after();
            });
          })(fctBefore, fct);
        }
      }
      return fct;
    });
  })(isCallable);


  FuncProto.after = (function (isCallable) {
    return (function (fctAfter, target/*optional*/) {

      var fct = this;
      if (isCallable(fctAfter) && isCallable(fct)) {
        if (target || ((typeof target != "undefined") && (typeof target != "object"))) {
          fct = (function (before, after, target) {
            return (function () {

              before.call(target);
              return after.call(target);
            });
          })(fct, fctAfter, target);
        } else {
          fct = (function (before, after) {
            return (function () {

              before();
              return after();
            });
          })(fct, fctAfter);
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
        if (target || ((typeof target != "undefined") && (typeof target != "object"))) {
          fct = (function (cover, embedded, target) {
            return (function () {

              return cover.call(target, embedded, cover, target);
            });
          })(fctCover, fct, target);
        } else {
          fct = (function (cover, embedded) {
            return (function () {

              return cover(embedded, cover);
            });
          })(fctCover, fct);
        }
      }
      return fct;
    });
  })(isCallable);


  FuncProto.replace = (function (isCallable) {
    return (function (fctReplacement, target/*optional*/) {

      var fct = this;
      if (isCallable(fctReplacement) && isCallable(fct)) {
        if (target || ((typeof target != "undefined") && (typeof target != "object"))) {
          fct = (function (replacement, target) {
            return (function () {

              return replacement.call(target);
            });
          })(fctReplacement, target);
        } else {
          fct = (function (replacement) {
            return (function () {

              return replacement();
            });
          })(fctReplacement);
        }
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


- Whitespace only - 1.275 byte : [before, after] only
(function(){var sh=this,FuncProto=sh.Function.prototype,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},isCallable=isFunction(sh.isCallable)&&sh.isCallable||isFunction;FuncProto.before=function(isCallable){return function(fctBefore,target){var fct=this;if(isCallable(fctBefore)&&isCallable(fct))if(target||typeof target!="undefined"&&typeof target!="object")fct=function(before,after,target){return function(){before.call(target);return after.call(target)}}(fctBefore,fct,target);else fct=function(before,after){return function(){before();return after()}}(fctBefore,fct);return fct}}(isCallable);FuncProto.after=function(isCallable){return function(fctAfter,target){var fct=this;if(isCallable(fctAfter)&&isCallable(fct))if(target||typeof target!="undefined"&&typeof target!="object")fct=function(before,after,target){return function(){before.call(target);return after.call(target)}}(fct,fctAfter,target);else fct=function(before,after){return function(){before();return after()}}(fct,fctAfter);return fct}}(isCallable);isCallable=isFunction=FuncProto=sh=null;delete isCallable;delete isFunction;delete FuncProto;delete sh;delete arguments.callee}).call(null);

- Simple          -   815 byte : [before, after] only
(function(){var d=this,i=d.Function.prototype,j=typeof d.isFunction=="function"&&d.isFunction||function(b){return typeof b=="function"&&typeof b.call=="function"&&typeof b.apply=="function"},k=j(d.isCallable)&&d.isCallable||j;i.before=function(b){return function(e,c){var a=this;if(b(e)&&b(a))a=c||typeof c!="undefined"&&typeof c!="object"?function(f,g,h){return function(){f.call(h);return g.call(h)}}(e,a,c):function(f,g){return function(){f();return g()}}(e,a);return a}}(k);i.after=function(b){return function(e,c){var a=this;if(b(e)&&b(a))a=c||typeof c!="undefined"&&typeof c!="object"?function(f,g,h){return function(){f.call(h);return g.call(h)}}(a,e,c):function(f,g){return function(){f();return g()}}(a,e);return a}}(k);k=j=i=d=null;delete k;delete j;delete i;delete d;delete arguments.callee}).call(null);



- Whitespace only - 2.131 byte : [before, after, cover, replace]
(function(){var sh=this,FuncProto=sh.Function.prototype,isFunction=typeof sh.isFunction=="function"&&sh.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},isCallable=isFunction(sh.isCallable)&&sh.isCallable||isFunction;FuncProto.before=function(isCallable){return function(fctBefore,target){var fct=this;if(isCallable(fctBefore)&&isCallable(fct))if(target||typeof target!="undefined"&&typeof target!="object")fct=function(before,after,target){return function(){before.call(target);return after.call(target)}}(fctBefore,fct,target);else fct=function(before,after){return function(){before();return after()}}(fctBefore,fct);return fct}}(isCallable);FuncProto.after=function(isCallable){return function(fctAfter,target){var fct=this;if(isCallable(fctAfter)&&isCallable(fct))if(target||typeof target!="undefined"&&typeof target!="object")fct=function(before,after,target){return function(){before.call(target);return after.call(target)}}(fct,fctAfter,target);else fct=function(before,after){return function(){before();return after()}}(fct,fctAfter);return fct}}(isCallable);FuncProto.cover=function(isCallable){return function(fctCover,target){var fct=this;if(isCallable(fctCover)&&isCallable(fct))if(target||typeof target!="undefined"&&typeof target!="object")fct=function(cover,embedded,target){return function(){return cover.call(target,embedded,cover,target)}}(fctCover,fct,target);else fct=function(cover,embedded){return function(){return cover(embedded,cover)}}(fctCover,fct);return fct}}(isCallable);FuncProto.replace=function(isCallable){return function(fctReplacement,target){var fct=this;if(isCallable(fctReplacement)&&isCallable(fct))if(target||typeof target!="undefined"&&typeof target!="object")fct=function(replacement,target){return function(){return replacement.call(target)}}(fctReplacement,target);else fct=function(replacement){return function(){return replacement()}}(fctReplacement);return fct}}(isCallable);isCallable=isFunction=FuncProto=sh=null;delete isCallable;delete isFunction;delete FuncProto;delete sh;delete arguments.callee}).call(null);

- Simple          - 1.292 byte : [before, after, cover, replace]
(function(){var h=this,i=h.Function.prototype,k=typeof h.isFunction=="function"&&h.isFunction||function(d){return typeof d=="function"&&typeof d.call=="function"&&typeof d.apply=="function"},j=k(h.isCallable)&&h.isCallable||k;i.before=function(d){return function(e,b){var a=this;if(d(e)&&d(a))a=b||typeof b!="undefined"&&typeof b!="object"?function(c,f,g){return function(){c.call(g);return f.call(g)}}(e,a,b):function(c,f){return function(){c();return f()}}(e,a);return a}}(j);i.after=function(d){return function(e,b){var a=this;if(d(e)&&d(a))a=b||typeof b!="undefined"&&typeof b!="object"?function(c,f,g){return function(){c.call(g);return f.call(g)}}(a,e,b):function(c,f){return function(){c();return f()}}(a,e);return a}}(j);i.cover=function(d){return function(e,b){var a=this;if(d(e)&&d(a))a=b||typeof b!="undefined"&&typeof b!="object"?function(c,f,g){return function(){return c.call(g,f,c,g)}}(e,a,b):function(c,f){return function(){return c(f,c)}}(e,a);return a}}(j);i.replace=function(d){return function(e,b){var a=this;if(d(e)&&d(a))a=b||typeof b!="undefined"&&typeof b!="object"?function(c,f){return function(){return c.call(f)}}(e,b):function(c){return function(){return c()}}(e);return a}}(j);j=k=i=h=null;delete j;delete k;delete i;delete h;delete arguments.callee}).call(null);


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined        - 1.134 byte : [before, after, cover, replace]
eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(){6 h=4,i=h.s.r,k=2 h.m=="0"&&h.m||0(d){1 2 d=="0"&&2 d.3=="0"&&2 d.u=="0"},j=k(h.n)&&h.n||k;i.p=0(d){1 0(e,b){6 a=4;9(d(e)&&d(a))a=b||2 b!="8"&&2 b!="7"?0(c,f,g){1 0(){c.3(g);1 f.3(g)}}(e,a,b):0(c,f){1 0(){c();1 f()}}(e,a);1 a}}(j);i.w=0(d){1 0(e,b){6 a=4;9(d(e)&&d(a))a=b||2 b!="8"&&2 b!="7"?0(c,f,g){1 0(){c.3(g);1 f.3(g)}}(a,e,b):0(c,f){1 0(){c();1 f()}}(a,e);1 a}}(j);i.o=0(d){1 0(e,b){6 a=4;9(d(e)&&d(a))a=b||2 b!="8"&&2 b!="7"?0(c,f,g){1 0(){1 c.3(g,f,c,g)}}(e,a,b):0(c,f){1 0(){1 c(f,c)}}(e,a);1 a}}(j);i.v=0(d){1 0(e,b){6 a=4;9(d(e)&&d(a))a=b||2 b!="8"&&2 b!="7"?0(c,f){1 0(){1 c.3(f)}}(e,b):0(c){1 0(){1 c()}}(e);1 a}}(j);j=k=i=h=l;5 j;5 k;5 i;5 h;5 q.t}).3(l);',33,33,'function|return|typeof|call|this|delete|var|object|undefined|if||||||||||||null|isFunction|isCallable|cover|before|arguments|prototype|Function|callee|apply|replace|after'.split('|'),0,{}));


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

