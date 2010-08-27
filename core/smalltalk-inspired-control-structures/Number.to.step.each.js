/*
  This new [Number] iteration with [Number.to( ... ).each] was as much inspired by
  Smalltalk as it had been before with the recently implemented [Number.times] iterator.

  links:

    EN: [http://en.wikipedia.org/wiki/Smalltalk]
    DE: [http://de.wikipedia.org/wiki/Smalltalk-80_(Programmiersprache)#Schleifen]

  for a quick countercheck paste code into [http://jconsole.com/]:
*/


(function () {
  var sh/*scripting_host|global_object*/ = this, Num = sh.Number, NumProto = Num.prototype, StrProto = sh.String.prototype,


//[each], [go], [does], [todo], [serve] or [serves] because [do] is an reserved word and already in use as part of the do-while iterator statement.
  each = (function (MATH_ABS) {
    return (function (from, to, fct, target) {

      if (typeof fct == "function") {
        target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));

        var idx = -1, count, len;
        if (from <= to) {

          count = (from - 1);
          len = (to - count);

          while (++idx < len) {
          //arguments order of callback function sticks closely/strictly to that one of [Number.times] but appends the arguments array by "count", "from" and "to".
            fct.call(target, idx, len, fct, ++count, from, to);
          }
        } else {

          count = (from + 1);
          len = MATH_ABS(to - count);

          while (++idx < len) {
          //arguments order of callback function sticks closely/strictly to that one of [Number.times] but appends the arguments array by "count", "from" and "to".
            fct.call(target, idx, len, fct, --count, from, to);
          }
        }
      }
    });
  })(sh.Math.abs),

  eachStep = (function (MATH_ABS, MATH_FLOOR) {
    return (function (from, to, step, fct, target) {

      if (typeof fct == "function") {
        target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));

        var idx = -1, count, len;
        if (from <= to) {

          count = (from - step);
          len = MATH_FLOOR((to - count) / step);

          while (++idx < len) {
          //arguments order of callback function sticks closely/strictly to that one of [Number.times] but appends the arguments array by "count", "from" and "to".
            fct.call(target, idx, len, fct, (count += step), from, to, step);
          }
        } else {

          count = (from + step);
          len = MATH_FLOOR(MATH_ABS(to - count) / step);

          while (++idx < len) {
          //arguments order of callback function sticks closely/strictly to that one of [Number.times] but appends the arguments array by "count", "from" and "to".
            fct.call(target, idx, len, fct, (count -= step), from, to, step);
          }
        }
      }
    });
  })(sh.Math.abs,  sh.Math.floor),

  getNumber = (function (NUMBER, IS_FINITE, MATH_FLOOR) {
    return (function (num) {

      num = NUMBER(num);
    //return ((IS_FINITE(num) && MATH_FLOOR(num)) || -1); // does not detect cero values.

      if (IS_FINITE(num)) {
        num = MATH_FLOOR(num);
      } else {
        num = -1;
      }
      return num;
    });
  })(Num, sh.isFinite, sh.Math.floor),


  NumberIterator = (function (EACH, EACH_STEP, GET_NUMBER, MATH_ABS, VALUE_OF) {
    return (function (startValue, endValue) {

    //in almost every case the initial value was a primitive "number" or "string" value.
      var stepValue = 1, initialValue = VALUE_OF.call(startValue).valueOf();

      startValue = GET_NUMBER(startValue);
      endValue = GET_NUMBER(endValue);

      this.valueOf = (function () {
        return initialValue;
      });
      this.toString = (function () {
        return ("" + initialValue);
      });

      this.step = (function (step) {

        stepValue = MATH_ABS(GET_NUMBER(step));
        return this;
      });

    //[each], [go], [does], [todo], [serve] or [serves] because [do] is an reserved word and already in use as part of the do-while iterator statement.
      this.each = (function (fct, target) {

        if (stepValue >= 2) {
          EACH_STEP(startValue, endValue, stepValue, fct, target);
        } else {
          EACH(startValue, endValue, fct, target);
        }
        return initialValue;
      });
    });
  })(each, eachStep, getNumber, sh.Math.abs, sh.Object.prototype.valueOf);


  NumProto.to = StrProto.to = (function (NUMBER_ITERATOR) {
    return (function (num) {

    //print("(typeof this) : " + (typeof this));
      return (new NUMBER_ITERATOR(this, num));
    });
  })(NumberIterator);


  NumberIterator = getNumber = eachStep = each = StrProto = NumProto = Num = sh = null;
  delete NumberIterator; delete getNumber; delete eachStep; delete each;
  delete StrProto; delete NumProto; delete Num; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 1.432 byte :
(function(){var sh=this,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype,each=function(MATH_ABS){return function(from,to,fct,target){if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var idx=-1,count,len;if(from<=to){count=from-1;len=to-count;while(++idx<len)fct.call(target,idx,len,fct,++count,from,to)}else{count=from+1;len=MATH_ABS(to-count);while(++idx<len)fct.call(target,idx,len,fct,--count,from,to)}}}}(sh.Math.abs),getNumber=function(NUMBER,IS_FINITE,MATH_FLOOR){return function(num){num=NUMBER(num);if(IS_FINITE(num))num=MATH_FLOOR(num);else num=-1;return num}}(Num,sh.isFinite,sh.Math.floor),NumberIterator=function(EACH,GET_NUMBER,VALUE_OF){return function(startValue,endValue){initialValue=VALUE_OF.call(startValue).valueOf();startValue=GET_NUMBER(startValue);endValue=GET_NUMBER(endValue);this.valueOf=function(){return initialValue};this.toString=function(){return""+initialValue};this.each=function(fct,target){EACH(startValue,endValue,fct,target);return initialValue}}}(each,getNumber,sh.Object.prototype.valueOf);NumProto.to=StrProto.to=function(NUMBER_ITERATOR){return function(num){return new NUMBER_ITERATOR(this,num)}}(NumberIterator);NumberIterator=getNumber=each=StrProto=NumProto=Num=sh=null;delete NumberIterator;delete getNumber,delete each;delete StrProto;delete NumProto;delete Num;delete sh;delete arguments.callee}).call(null);

- Simple          -   879 byte :
(function(){var e=this,j=e.Number,k=j.prototype,l=e.String.prototype,m=function(g){return function(b,d,a,c){if(typeof a=="function"){c=c||(typeof c=="undefined"||typeof c=="object"?null:c);var h=-1,f,i;if(b<=d){f=b-1;for(i=d-f;++h<i;)a.call(c,h,i,a,++f,b,d)}else{f=b+1;for(i=g(d-f);++h<i;)a.call(c,h,i,a,--f,b,d)}}}}(e.Math.abs),n=function(g,b,d){return function(a){a=g(a);return a=b(a)?d(a):-1}}(j,e.isFinite,e.Math.floor),o=function(g,b,d){return function(a,c){initialValue=d.call(a).valueOf();a=b(a);c=b(c);this.valueOf=function(){return initialValue};this.toString=function(){return""+initialValue};this.each=function(h,f){g(a,c,h,f);return initialValue}}}(m,n,e.Object.prototype.valueOf);k.to=l.to=function(g){return function(b){return new g(this,b)}}(o);o=n=m=l=k=j=e=null;delete o;delete n;delete m;delete l;delete k;delete j;delete e;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 1.472 byte :
(function(){var sh=this,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype,each=(function(MATH_ABS){return(function(from,to,fct,target){if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var idx=-1,count,len;if(from<=to){count=(from-1);len=(to-count);while(++idx<len){fct.call(target,idx,len,fct,++count,from,to)}}else{count=(from+1);len=MATH_ABS(to-count);while(++idx<len){fct.call(target,idx,len,fct,--count,from,to)}}}})})(sh.Math.abs),getNumber=(function(NUMBER,IS_FINITE,MATH_FLOOR){return(function(num){num=NUMBER(num);if(IS_FINITE(num)){num=MATH_FLOOR(num)}else{num=-1}return num})})(Num,sh.isFinite,sh.Math.floor),NumberIterator=(function(EACH,GET_NUMBER,VALUE_OF){return(function(startValue,endValue){initialValue=VALUE_OF.call(startValue).valueOf();startValue=GET_NUMBER(startValue);endValue=GET_NUMBER(endValue);this.valueOf=(function(){return initialValue});this.toString=(function(){return(""+initialValue)});this.each=(function(fct,target){EACH(startValue,endValue,fct,target);return initialValue})})})(each,getNumber,sh.Object.prototype.valueOf);NumProto.to=StrProto.to=(function(NUMBER_ITERATOR){return(function(num){return(new NUMBER_ITERATOR(this,num))})})(NumberIterator);NumberIterator=getNumber=each=StrProto=NumProto=Num=sh=null;delete NumberIterator;delete getNumber,delete each;delete StrProto;delete NumProto;delete Num;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 1.137 byte :
(function(){var h=this,Num=h.Number,NumProto=Num.prototype,StrProto=h.String.prototype,each=(function(f){return(function(a,b,c,d){if(typeof c=="function"){d=(d||(((typeof d=="undefined")||(typeof d=="object"))?null:d));var e=-1,count,len;if(a<=b){count=(a-1);len=(b-count);while(++e<len){c.call(d,e,len,c,++count,a,b)}}else{count=(a+1);len=f(b-count);while(++e<len){c.call(d,e,len,c,--count,a,b)}}}})})(h.Math.abs),getNumber=(function(b,c,d){return(function(a){a=b(a);if(c(a)){a=d(a)}else{a=-1}return a})})(Num,h.isFinite,h.Math.floor),NumberIterator=(function(e,f,g){return(function(c,d){initialValue=g.call(c).valueOf();c=f(c);d=f(d);this.valueOf=(function(){return initialValue});this.toString=(function(){return(""+initialValue)});this.each=(function(a,b){e(c,d,a,b);return initialValue})})})(each,getNumber,h.Object.prototype.valueOf);NumProto.to=StrProto.to=(function(b){return(function(a){return(new b(this,a))})})(NumberIterator);NumberIterator=getNumber=each=StrProto=NumProto=Num=h=null;delete NumberIterator;delete getNumber,delete each;delete StrProto;delete NumProto;delete Num;delete h;delete arguments.callee}).call(null);


*/ /*


  please run this simple test within [http://jconsole.com/]

*/


(4).to(11).step(3).each(function (idx, len, fct) { // callback exactly as in [Number.times]
  print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");
});
print("\n"); // 3 times the function


var callback = (function (idx, len, fct, count, from, to, step) { // callback similar to [Number.times] - appended arguments array though.
  print("hallo - idx : " + idx + " - len : " + len/* + " - fct : " + fct*/ + " - count : " + count + " - from : " + from + " - to : " + to + " - step : " + step + "\n");
});


(1).to(2).each(callback); // 2 times the function
print("\n");

("19.5555").to("20").step(2).each(callback); // 1 times the function
print("\n");

("18").to("20.9999999999999999999").step(2).each(callback); // 2 times the function
print("\n");

(-1).to("1").step(3).each(callback); // 1 times the function
print("\n");

(2).to("-1").step(2).each(callback); // 2 times the function
print("\n");

(1).to("1").step(5).each(callback); // 1 times the function
print("\n");

("0").to(0).step(9).each(callback); // 1 times the function
print("\n");

("-1").to(-1).step(0).each(callback); // 1 times the function
print("\n");

("-3").to(12).step(3).each(callback); // 6 times the function
print("\n");

("-3").to(12).step(5).each(callback); // 4 times the function
print("\n");

(29).to(-3).step(11).each(callback); // 3 times the function
print("\n");

(29).to(-4).step(11).each(callback); // 4 times the function
print("\n");
