

Boolean.prototype.ifTrue = (function (fct, target/*optional:[object|function]*/) { // [caseTrue], [ifTrue], [ifTrueDo]

  var isTrue = this.valueOf();
  if (isTrue && (typeof fct == "function")) {

    fct.call((((typeof target == "undefined") || ((typeof target == "obj") && !target)) && null) || target);
  }
  return isTrue;
});
Boolean.prototype.ifFalse = (function (fct, target/*optional:[object|function]*/) { // [caseFalse], [ifFalse], [ifFalseDo]

  var isTrue = this.valueOf();
  if (!isTrue && (typeof fct == "function")) {

    fct.call((((typeof target == "undefined") || ((typeof target == "obj") && !target)) && null) || target);
  }
  return isTrue;
});





(function () { // anonymus application context


  var sh = ((this && (this.window === this) && /*this.*/window) || this),


  makeArray = (((typeof sh.Array.make == "function") && sh.Array.make) || (function () {

    var slice = sh.Array.prototype.slice;
    return (function (list) {

      return slice.call(list);
    });
  })()),
  isFunction = (function (obj) {

    return (typeof obj == "function");
  });


  sh.Function.prototype.whileTrue = (function (/*fct:Function[, arg01:Object[, arg02:Object]]*/) {

    var args = makeArray(arguments),

    fctStatement = args.shift(0),
    fctCondition = this;

    if (isFunction(fctStatement) && isFunction(fctCondition)) {

      while (fctCondition.apply(null, args)) {
        args = (fctStatement.apply(null, args) || []);
      }
    }
    return null;
  });
  sh.Function.prototype.whileFalse = (function (/*fct:Function[, arg01:Object[, arg02:Object]]*/) {

    var args = makeArray(arguments),

    fctStatement = args.shift(0),
    fctCondition = this;

    if (isFunction(fctStatement) && isFunction(fctCondition)) {

      while (!fctCondition.apply(null, args)) {
        args = (fctStatement.apply(null, args) || []);
      }
    }
    return null; // that's what the Smalltalk specification states.
  });

})();





Number.prototype.times = (function (fct, target) { // prototypal implementation

  var i = -1, num = Number(this);

  num = ((isFinite(num) && (typeof fct == "function") && Math.floor(num)) || i);
  target = ((((typeof target == "undefined") || ((typeof target == "obj") && !target)) && null) || target);

  while (++i < num) {
    fct.call(target, i, num, fct);
  }
});
Number.times = (function () { // static implementation

  var times = (Number.prototype.times || (function () {}));

  return (function (num, fct, target) {
    times.call(Number(num), fct, target);
  });
})();
String.prototype.times = (function () { // prototypal implementation

  var times = (Number.prototype.times || (function () {}));

  return (function (fct, target) {
    times.apply(Number(this), arguments);
  });
})();





(function () { // anonymus application context


  var sh = ((this && (this.window === this) && /*this.*/window) || this),


  each = (function (from, to, fct, target) {

    var idx = -1, count, len;
    if (from <= to) {

      count = (from - 1);
      len = (to - count);

      while (++idx < len) {
        fct.call(target, idx, len, fct, ++count, from, to);
      }
    } else {

      count = (from + 1);
      len = sh.Math.abs(to - count);

      while (++idx < len) {
        fct.call(target, idx, len, fct, --count, from, to);
      }
    }
  }),
  getNumber = (function (num) {

    num = sh.Number(num);

    if (sh.isFinite(num)) {
      num = sh.Math.floor(num);
    } else {
      num = -1;
    }
    return num;
  }),
  NumberIterator = (function (startValue, endValue) {

    initialValue = startValue.valueOf();

    startValue = getNumber(startValue);
    endValue = getNumber(endValue);

    this.valueOf = (function () {

      return initialValue;
    });
    this.toString = (function () {

      return String(initialValue);
    });
    this.each = (function (fct, target) {

      each(startValue, endValue, fct, target);
      return initialValue;
    });
  });


  sh.Number.prototype.to = sh.String.prototype.to = (function (num) {

    return (new NumberIterator(this, num));
  });

})();/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 2619 byte :
//Boolean.prototype.ifTrue=function(fct,target){var isTrue=this.valueOf();if(isTrue&&typeof fct=="function")fct.call((typeof target=="undefined"||typeof target=="obj"&&!target)&&null||target);return isTrue};Boolean.prototype.ifFalse=function(fct,target){var isTrue=this.valueOf();if(!isTrue&&typeof fct=="function")fct.call((typeof target=="undefined"||typeof target=="obj"&&!target)&&null||target);return isTrue};
//(function(){var sh=this&&this.window===this&&window||this,makeArray=typeof sh.Array.make=="function"&&sh.Array.make||function(){var slice=sh.Array.prototype.slice;return function(list){return slice.call(list)}}(),isFunction=function(obj){return typeof obj=="function"};sh.Function.prototype.whileTrue=function(){var args=makeArray(arguments),fctStatement=args.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition))while(fctCondition.apply(null,args))args=fctStatement.apply(null,args)||[];return null};sh.Function.prototype.whileFalse=function(){var args=makeArray(arguments),fctStatement=args.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition))while(!fctCondition.apply(null,args))args=fctStatement.apply(null,args)||[];return null}})();
//Number.prototype.times=function(fct,target){var i=-1,num=Number(this);num=isFinite(num)&&typeof fct=="function"&&Math.floor(num)||i;target=(typeof target=="undefined"||typeof target=="obj"&&!target)&&null||target;while(++i<num)fct.call(target,i,num,fct)};
//Number.times=function(){var times=Number.prototype.times||function(){};return function(num,fct,target){times.call(Number(num),fct,target)}}();
//String.prototype.times=function(){var times=Number.prototype.times||function(){};return function(fct,target){times.apply(Number(this),arguments)}}();
//(function(){var sh=this&&this.window===this&&window||this,each=function(from,to,fct,target){var idx=-1,count,len;if(from<=to){count=from-1;len=to-count;while(++idx<len)fct.call(target,idx,len,fct,++count,from,to)}else{count=from+1;len=sh.Math.abs(to-count);while(++idx<len)fct.call(target,idx,len,fct,--count,from,to)}},getNumber=function(num){num=sh.Number(num);if(sh.isFinite(num))num=sh.Math.floor(num);else num=-1;return num},NumberIterator=function(startValue,endValue){initialValue=startValue.valueOf();startValue=getNumber(startValue);endValue=getNumber(endValue);this.valueOf=function(){return initialValue};this.toString=function(){return String(initialValue)};this.each=function(fct,target){each(startValue,endValue,fct,target);return initialValue}};sh.Number.prototype.to=sh.String.prototype.to=function(num){return new NumberIterator(this,num)}})();

- Simple          - 1882 byte :
//Boolean.prototype.ifTrue=function(a,c){var e=this.valueOf();if(e&&typeof a=="function")a.call((typeof c=="undefined"||typeof c=="obj"&&!c)&&null||c);return e};Boolean.prototype.ifFalse=function(a,c){var e=this.valueOf();if(!e&&typeof a=="function")a.call((typeof c=="undefined"||typeof c=="obj"&&!c)&&null||c);return e};(function(){var a=this&&this.window===this&&window||this,c=typeof a.Array.make=="function"&&a.Array.make||function(){var d=a.Array.prototype.slice;return function(b){return d.call(b)}}(),e=function(d){return typeof d=="function"};a.Function.prototype.whileTrue=function(){var d=c(arguments),b=d.shift(0),f=this;if(e(b)&&e(f))for(;f.apply(null,d);)d=b.apply(null,d)||[];return null};a.Function.prototype.whileFalse=function(){var d=c(arguments),b=d.shift(0),f=this;if(e(b)&&e(f))for(;!f.apply(null,d);)d=b.apply(null,d)||[];return null}})();Number.prototype.times=function(a,c){var e=-1,d=Number(this);d=isFinite(d)&&typeof a=="function"&&Math.floor(d)||e;for(c=(typeof c=="undefined"||typeof c=="obj"&&!c)&&null||c;++e<d;)a.call(c,e,d,a)};Number.times=function(){var a=Number.prototype.times||function(){};return function(c,e,d){a.call(Number(c),e,d)}}();String.prototype.times=function(){var a=Number.prototype.times||function(){};return function(){a.apply(Number(this),arguments)}}();(function(){var a=this&&this.window===this&&window||this,c=function(b,f,g,j){var k=-1,h,i;if(b<=f){h=b-1;for(i=f-h;++k<i;)g.call(j,k,i,g,++h,b,f)}else{h=b+1;for(i=a.Math.abs(f-h);++k<i;)g.call(j,k,i,g,--h,b,f)}},e=function(b){b=a.Number(b);return b=a.isFinite(b)?a.Math.floor(b):-1},d=function(b,f){initialValue=b.valueOf();b=e(b);f=e(f);this.valueOf=function(){return initialValue};this.toString=function(){return String(initialValue)};this.each=function(g,j){c(b,f,g,j);return initialValue}};a.Number.prototype.to=a.String.prototype.to=function(b){return new d(this,b)}})();


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 2744 byte :
//Boolean.prototype.ifTrue=(function(fct,target){var isTrue=this.valueOf();if(isTrue&&(typeof fct=="function")){fct.call((((typeof target=="undefined")||((typeof target=="obj")&&!target))&&null)||target)}return isTrue});
//Boolean.prototype.ifFalse=(function(fct,target){var isTrue=this.valueOf();if(!isTrue&&(typeof fct=="function")){fct.call((((typeof target=="undefined")||((typeof target=="obj")&&!target))&&null)||target)}return isTrue});
//(function(){var sh=((this&&(this.window===this)&&window)||this),makeArray=(((typeof sh.Array.make=="function")&&sh.Array.make)||(function(){var slice=sh.Array.prototype.slice;return(function(list){return slice.call(list)})})()),isFunction=(function(obj){return(typeof obj=="function")});sh.Function.prototype.whileTrue=(function(){var args=makeArray(arguments),fctStatement=args.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition)){while(fctCondition.apply(null,args)){args=(fctStatement.apply(null,args)||[])}}return null});sh.Function.prototype.whileFalse=(function(){var args=makeArray(arguments),fctStatement=args.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition)){while(!fctCondition.apply(null,args)){args=(fctStatement.apply(null,args)||[])}}return null})})();
//Number.prototype.times=(function(fct,target){var i=-1,num=Number(this);num=((isFinite(num)&&(typeof fct=="function")&&Math.floor(num))||i);target=((((typeof target=="undefined")||((typeof target=="obj")&&!target))&&null)||target);while(++i<num){fct.call(target,i,num,fct)}});
//Number.times=(function(){var times=(Number.prototype.times||(function(){}));return(function(num,fct,target){times.call(Number(num),fct,target)})})();
//String.prototype.times=(function(){var times=(Number.prototype.times||(function(){}));return(function(fct,target){times.apply(Number(this),arguments)})})();
//(function(){var sh=((this&&(this.window===this)&&window)||this),each=(function(from,to,fct,target){var idx=-1,count,len;if(from<=to){count=(from-1);len=(to-count);while(++idx<len){fct.call(target,idx,len,fct,++count,from,to)}}else{count=(from+1);len=sh.Math.abs(to-count);while(++idx<len){fct.call(target,idx,len,fct,--count,from,to)}}}),getNumber=(function(num){num=sh.Number(num);if(sh.isFinite(num)){num=sh.Math.floor(num)}else{num=-1}return num}),NumberIterator=(function(startValue,endValue){initialValue=startValue.valueOf();startValue=getNumber(startValue);endValue=getNumber(endValue);this.valueOf=(function(){return initialValue});this.toString=(function(){return String(initialValue)});this.each=(function(fct,target){each(startValue,endValue,fct,target);return initialValue})});sh.Number.prototype.to=sh.String.prototype.to=(function(num){return(new NumberIterator(this,num))})})();

- packed / shrinked           - 2335 byte :
//Boolean.prototype.ifTrue=(function(a,b){var c=this.valueOf();if(c&&(typeof a=="function")){a.call((((typeof b=="undefined")||((typeof b=="obj")&&!b))&&null)||b)}return c});Boolean.prototype.ifFalse=(function(a,b){var c=this.valueOf();if(!c&&(typeof a=="function")){a.call((((typeof b=="undefined")||((typeof b=="obj")&&!b))&&null)||b)}return c});(function(){var c=((this&&(this.window===this)&&window)||this),makeArray=(((typeof c.Array.make=="function")&&c.Array.make)||(function(){var b=c.Array.prototype.slice;return(function(a){return b.call(a)})})()),isFunction=(function(a){return(typeof a=="function")});c.Function.prototype.whileTrue=(function(){var a=makeArray(arguments),fctStatement=a.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition)){while(fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null});c.Function.prototype.whileFalse=(function(){var a=makeArray(arguments),fctStatement=a.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition)){while(!fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})();Number.prototype.times=(function(a,b){var i=-1,num=Number(this);num=((isFinite(num)&&(typeof a=="function")&&Math.floor(num))||i);b=((((typeof b=="undefined")||((typeof b=="obj")&&!b))&&null)||b);while(++i<num){a.call(b,i,num,a)}});Number.times=(function(){var d=(Number.prototype.times||(function(){}));return(function(a,b,c){d.call(Number(a),b,c)})})();String.prototype.times=(function(){var c=(Number.prototype.times||(function(){}));return(function(a,b){c.apply(Number(this),arguments)})})();(function(){var f=((this&&(this.window===this)&&window)||this),each=(function(a,b,c,d){var e=-1,count,len;if(a<=b){count=(a-1);len=(b-count);while(++e<len){c.call(d,e,len,c,++count,a,b)}}else{count=(a+1);len=f.Math.abs(b-count);while(++e<len){c.call(d,e,len,c,--count,a,b)}}}),getNumber=(function(a){a=f.Number(a);if(f.isFinite(a)){a=f.Math.floor(a)}else{a=-1}return a}),NumberIterator=(function(c,d){initialValue=c.valueOf();c=getNumber(c);d=getNumber(d);this.valueOf=(function(){return initialValue});this.toString=(function(){return String(initialValue)});this.each=(function(a,b){each(c,d,a,b);return initialValue})});f.Number.prototype.to=f.String.prototype.to=(function(a){return(new NumberIterator(this,a))})})();

- packed / shrinked / encoded - 1800 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('F.6.Q=(2(a,b){7 c=3.t();m(c&&(5 a=="2")){a.h((((5 b=="C")||((5 b=="v")&&!b))&&9)||b)}4 c});F.6.P=(2(a,b){7 c=3.t();m(!c&&(5 a=="2")){a.h((((5 b=="C")||((5 b=="v")&&!b))&&9)||b)}4 c});(2(){7 c=((3&&(3.s===3)&&s)||3),x=(((5 c.z.K=="2")&&c.z.K)||(2(){7 b=c.z.6.S;4(2(a){4 b.h(a)})})()),r=(2(a){4(5 a=="2")});c.H.6.T=(2(){7 a=x(y),n=a.G(0),l=3;m(r(n)&&r(l)){p(l.o(9,a)){a=(n.o(9,a)||[])}}4 9});c.H.6.U=(2(){7 a=x(y),n=a.G(0),l=3;m(r(n)&&r(l)){p(!l.o(9,a)){a=(n.o(9,a)||[])}}4 9})})();8.6.q=(2(a,b){7 i=-1,k=8(3);k=((E(k)&&(5 a=="2")&&D.M(k))||i);b=((((5 b=="C")||((5 b=="v")&&!b))&&9)||b);p(++i<k){a.h(b,i,k,a)}});8.q=(2(){7 d=(8.6.q||(2(){}));4(2(a,b,c){d.h(8(a),b,c)})})();w.6.q=(2(){7 c=(8.6.q||(2(){}));4(2(a,b){c.o(8(3),y)})})();(2(){7 f=((3&&(3.s===3)&&s)||3),A=(2(a,b,c,d){7 e=-1,g,j;m(a<=b){g=(a-1);j=(b-g);p(++e<j){c.h(d,e,j,c,++g,a,b)}}I{g=(a+1);j=f.D.N(b-g);p(++e<j){c.h(d,e,j,c,--g,a,b)}}}),B=(2(a){a=f.8(a);m(f.E(a)){a=f.D.M(a)}I{a=-1}4 a}),J=(2(c,d){u=c.t();c=B(c);d=B(d);3.t=(2(){4 u});3.R=(2(){4 w(u)});3.A=(2(a,b){A(c,d,a,b);4 u})});f.8.6.L=f.w.6.L=(2(a){4(O J(3,a))})})();',57,57,'||function|this|return|typeof|prototype|var|Number|null|||||||count|call||len|num|fctCondition|if|fctStatement|apply|while|times|isFunction|window|valueOf|initialValue|obj|String|makeArray|arguments|Array|each|getNumber|undefined|Math|isFinite|Boolean|shift|Function|else|NumberIterator|make|to|floor|abs|new|ifFalse|ifTrue|toString|slice|whileTrue|whileFalse'.split('|'),0,{}));


*/
