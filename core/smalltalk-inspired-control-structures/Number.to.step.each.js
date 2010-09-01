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

- Whitespace only - 2.163 byte :
(function(){var sh=this,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype,each=function(MATH_ABS){return function(from,to,fct,target){if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var idx=-1,count,len;if(from<=to){count=from-1;len=to-count;while(++idx<len)fct.call(target,idx,len,fct,++count,from,to)}else{count=from+1;len=MATH_ABS(to-count);while(++idx<len)fct.call(target,idx,len,fct,--count,from,to)}}}}(sh.Math.abs),eachStep=function(MATH_ABS,MATH_FLOOR){return function(from,to,step,fct,target){if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var idx=-1,count,len;if(from<=to){count=from-step;len=MATH_FLOOR((to-count)/step);while(++idx<len)fct.call(target,idx,len,fct,count+=step,from,to,step)}else{count=from+step;len=MATH_FLOOR(MATH_ABS(to-count)/step);while(++idx<len)fct.call(target,idx,len,fct,count-=step,from,to,step)}}}}(sh.Math.abs,sh.Math.floor),getNumber=function(NUMBER,IS_FINITE,MATH_FLOOR){return function(num){num=NUMBER(num);if(IS_FINITE(num))num=MATH_FLOOR(num);else num=-1;return num}}(Num,sh.isFinite,sh.Math.floor),NumberIterator=function(EACH,EACH_STEP,GET_NUMBER,MATH_ABS,VALUE_OF){return function(startValue,endValue){var stepValue=1,initialValue=VALUE_OF.call(startValue).valueOf();startValue=GET_NUMBER(startValue);endValue=GET_NUMBER(endValue);this.valueOf=function(){return initialValue};this.toString=function(){return""+initialValue};this.step=function(step){stepValue=MATH_ABS(GET_NUMBER(step));return this};this.each=function(fct,target){if(stepValue>=2)EACH_STEP(startValue,endValue,stepValue,fct,target);else EACH(startValue,endValue,fct,target);return initialValue}}}(each,eachStep,getNumber,sh.Math.abs,sh.Object.prototype.valueOf);NumProto.to=StrProto.to=function(NUMBER_ITERATOR){return function(num){return new NUMBER_ITERATOR(this,num)}}(NumberIterator);NumberIterator=getNumber=eachStep=each=StrProto=NumProto=Num=sh=null;delete NumberIterator;delete getNumber;delete eachStep;delete each;delete StrProto;delete NumProto;delete Num;delete sh;delete arguments.callee}).call(null);

- Simple          - 1.229 byte :
(function(){var h=this,l=h.Number,m=l.prototype,n=h.String.prototype,o=function(k){return function(g,d,a,c){if(typeof a=="function"){c=c||(typeof c=="undefined"||typeof c=="object"?null:c);var e=-1,b,f;if(g<=d){b=g-1;for(f=d-b;++e<f;)a.call(c,e,f,a,++b,g,d)}else{b=g+1;for(f=k(d-b);++e<f;)a.call(c,e,f,a,--b,g,d)}}}}(h.Math.abs),p=function(k,g){return function(d,a,c,e,b){if(typeof e=="function"){b=b||(typeof b=="undefined"||typeof b=="object"?null:b);var f=-1,j,i;if(d<=a){j=d-c;for(i=g((a-j)/c);++f<i;)e.call(b,f,i,e,j+=c,d,a,c)}else{j=d+c;for(i=g(k(a-j)/c);++f<i;)e.call(b,f,i,e,j-=c,d,a,c)}}}}(h.Math.abs,h.Math.floor),q=function(k,g,d){return function(a){a=k(a);return a=g(a)?d(a):-1}}(l,h.isFinite,h.Math.floor),r=function(k,g,d,a,c){return function(e,b){var f=1,j=c.call(e).valueOf();e=d(e);b=d(b);this.valueOf=function(){return j};this.toString=function(){return""+j};this.step=function(i){f=a(d(i));return this};this.each=function(i,s){f>=2?g(e,b,f,i,s):k(e,b,i,s);return j}}}(o,p,q,h.Math.abs,h.Object.prototype.valueOf);m.to=n.to=function(k){return function(g){return new k(this,g)}}(r);r=q=p=o=n=m=l=h=null;delete r;delete q;delete p;delete o;delete n;delete m;delete l;delete h;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 2.229 byte :
(function(){var sh=this,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype,each=(function(MATH_ABS){return(function(from,to,fct,target){if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var idx=-1,count,len;if(from<=to){count=(from-1);len=(to-count);while(++idx<len){fct.call(target,idx,len,fct,++count,from,to)}}else{count=(from+1);len=MATH_ABS(to-count);while(++idx<len){fct.call(target,idx,len,fct,--count,from,to)}}}})})(sh.Math.abs),eachStep=(function(MATH_ABS,MATH_FLOOR){return(function(from,to,step,fct,target){if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var idx=-1,count,len;if(from<=to){count=(from-step);len=MATH_FLOOR((to-count)/step);while(++idx<len){fct.call(target,idx,len,fct,(count+=step),from,to,step)}}else{count=(from+step);len=MATH_FLOOR(MATH_ABS(to-count)/step);while(++idx<len){fct.call(target,idx,len,fct,(count-=step),from,to,step)}}}})})(sh.Math.abs,sh.Math.floor),getNumber=(function(NUMBER,IS_FINITE,MATH_FLOOR){return(function(num){num=NUMBER(num);if(IS_FINITE(num)){num=MATH_FLOOR(num)}else{num=-1}return num})})(Num,sh.isFinite,sh.Math.floor),NumberIterator=(function(EACH,EACH_STEP,GET_NUMBER,MATH_ABS,VALUE_OF){return(function(startValue,endValue){var stepValue=1,initialValue=VALUE_OF.call(startValue).valueOf();startValue=GET_NUMBER(startValue);endValue=GET_NUMBER(endValue);this.valueOf=(function(){return initialValue});this.toString=(function(){return(""+initialValue)});this.step=(function(step){stepValue=MATH_ABS(GET_NUMBER(step));return this});this.each=(function(fct,target){if(stepValue>=2){EACH_STEP(startValue,endValue,stepValue,fct,target)}else{EACH(startValue,endValue,fct,target)}return initialValue})})})(each,eachStep,getNumber,sh.Math.abs,sh.Object.prototype.valueOf);NumProto.to=StrProto.to=(function(NUMBER_ITERATOR){return(function(num){return(new NUMBER_ITERATOR(this,num))})})(NumberIterator);NumberIterator=getNumber=eachStep=each=StrProto=NumProto=Num=sh=null;delete NumberIterator;delete getNumber;delete eachStep;delete each;delete StrProto;delete NumProto;delete Num;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 1.637 byte :
(function(){var k=this,Num=k.Number,NumProto=Num.prototype,StrProto=k.String.prototype,each=(function(f){return(function(a,b,c,d){if(typeof c=="function"){d=(d||(((typeof d=="undefined")||(typeof d=="object"))?null:d));var e=-1,count,len;if(a<=b){count=(a-1);len=(b-count);while(++e<len){c.call(d,e,len,c,++count,a,b)}}else{count=(a+1);len=f(b-count);while(++e<len){c.call(d,e,len,c,--count,a,b)}}}})})(k.Math.abs),eachStep=(function(g,h){return(function(a,b,c,d,e){if(typeof d=="function"){e=(e||(((typeof e=="undefined")||(typeof e=="object"))?null:e));var f=-1,count,len;if(a<=b){count=(a-c);len=h((b-count)/c);while(++f<len){d.call(e,f,len,d,(count+=c),a,b,c)}}else{count=(a+c);len=h(g(b-count)/c);while(++f<len){d.call(e,f,len,d,(count-=c),a,b,c)}}}})})(k.Math.abs,k.Math.floor),getNumber=(function(b,c,d){return(function(a){a=b(a);if(c(a)){a=d(a)}else{a=-1}return a})})(Num,k.isFinite,k.Math.floor),NumberIterator=(function(f,g,h,i,j){return(function(c,d){var e=1,initialValue=j.call(c).valueOf();c=h(c);d=h(d);this.valueOf=(function(){return initialValue});this.toString=(function(){return(""+initialValue)});this.step=(function(a){e=i(h(a));return this});this.each=(function(a,b){if(e>=2){g(c,d,e,a,b)}else{f(c,d,a,b)}return initialValue})})})(each,eachStep,getNumber,k.Math.abs,k.Object.prototype.valueOf);NumProto.to=StrProto.to=(function(b){return(function(a){return(new b(this,a))})})(NumberIterator);NumberIterator=getNumber=eachStep=each=StrProto=NumProto=Num=k=null;delete NumberIterator;delete getNumber;delete eachStep;delete each;delete StrProto;delete NumProto;delete Num;delete k;delete arguments.callee}).call(null);


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
