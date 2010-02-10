/*
  This new [Number] iteration with [Number.to( ... ).each] was as much inspired by
  Smalltalk as it had been before with the recently implemented [Number.times] iterator.

  links:

    EN: [http://en.wikipedia.org/wiki/Smalltalk]
    DE: [http://de.wikipedia.org/wiki/Smalltalk-80_(Programmiersprache)#Schleifen]

  for a quick countercheck paste code into [http://jconsole.com/]:
*/ /*

first try:

Number.Iterator = (function () {

//[each], [go], [does], [todo], [serve] or [serves] because [do] is an reserved word and already in use as part of the do-while iterator statement.
  var each = (function (from, to, fct, target) {

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
      len = Math.abs(to - count);

      while (++idx < len) {
      //arguments order of callback function sticks closely/strictly to that one of [Number.times] but appends the arguments array by "count", "from" and "to".
        fct.call(target, idx, len, fct, --count, from, to);
      }
    }
  }),
  getNumber = (function (num) {

    num = Number(num);
  //return ((isFinite(num) && Math.floor(num)) || -1); // does not detect cero values.

    if (isFinite(num)) {
      num = Math.floor(num);
    } else {
      num = -1;
    }
    return num;
  }),
  NumberIterator = (function (startValue, endValue) {

  //in almost every case the initial value was a primitive "number" or "string" value.
    initialValue = startValue.valueOf();

    startValue = getNumber(startValue);
    endValue = getNumber(endValue);

    this.valueOf = (function () {

      return initialValue;
    });
    this.toString = (function () {

      return String(initialValue);
    }); / *

  //[each], [go], [does], [todo], [serve] or [serves] because [do] is an reserved word and already in use as part of the do-while iterator statement.
    this.each = (function (fct, target) {

    //[each] might use the same callback-functionality as in [Number.times] or callback of [each] could be augmented in order to meet our needs.
      (endValue + 1 - startValue).times(fct, target);
      return initialValue;
    }); * /

  //[each], [go], [does], [todo], [serve] or [serves] because [do] is an reserved word and already in use as part of the do-while iterator statement.
    this.each = (function (fct, target) {

      each(startValue, endValue, fct, target);
      return initialValue;
    });
  });

  return NumberIterator;

})();

Number.prototype.to = String.prototype.to = (function (num) {

//print("(typeof this) : " + (typeof this));
  return (new Number.Iterator(this, num));
});*/



(function () { // anonymus application context


//[sh] - scripting host.
  var sh = ((this && (this.window === this) && /*this.*/window) || this),


//[each], [go], [does], [todo], [serve] or [serves] because [do] is an reserved word and already in use as part of the do-while iterator statement.
  each = (function (from, to, fct, target) {

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
      len = sh.Math.abs(to - count);

      while (++idx < len) {
      //arguments order of callback function sticks closely/strictly to that one of [Number.times] but appends the arguments array by "count", "from" and "to".
        fct.call(target, idx, len, fct, --count, from, to);
      }
    }
  }),
  getNumber = (function (num) {

    num = sh.Number(num);
  //return ((sh.isFinite(num) && sh.Math.floor(num)) || -1); // does not detect cero values.

    if (sh.isFinite(num)) {
      num = sh.Math.floor(num);
    } else {
      num = -1;
    }
    return num;
  }),
  NumberIterator = (function (startValue, endValue) {

  //in almost every case the initial value was a primitive "number" or "string" value.
    initialValue = startValue.valueOf();

    startValue = getNumber(startValue);
    endValue = getNumber(endValue);

    this.valueOf = (function () {

      return initialValue;
    });
    this.toString = (function () {

      return String(initialValue);
    });/*

  //[each], [go], [does], [todo], [serve] or [serves] because [do] is an reserved word and already in use as part of the do-while iterator statement.
    this.each = (function (fct, target) {

    //[each] might use the same callback-functionality as in [Number.times] or callback of [each] could be augmented in order to meet our needs.
      (endValue + 1 - startValue).times(fct, target);
      return initialValue;
    });*/

  //[each], [go], [does], [todo], [serve] or [serves] because [do] is an reserved word and already in use as part of the do-while iterator statement.
    this.each = (function (fct, target) {

      each(startValue, endValue, fct, target);
      return initialValue;
    });
  });


  sh.Number.prototype.to = sh.String.prototype.to = (function (num) {

  //print("(typeof this) : " + (typeof this));
    return (new NumberIterator(this, num));
  });

})();/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 861 byte :
//(function(){var sh=this&&this.window===this&&window||this,each=function(from,to,fct,target){var idx=-1,count,len;if(from<=to){count=from-1;len=to-count;while(++idx<len)fct.call(target,idx,len,fct,++count,from,to)}else{count=from+1;len=sh.Math.abs(to-count);while(++idx<len)fct.call(target,idx,len,fct,--count,from,to)}},getNumber=function(num){num=sh.Number(num);if(sh.isFinite(num))num=sh.Math.floor(num);else num=-1;return num},NumberIterator=function(startValue,endValue){initialValue=startValue.valueOf();startValue=getNumber(startValue);endValue=getNumber(endValue);this.valueOf=function(){return initialValue};this.toString=function(){return String(initialValue)};this.each=function(fct,target){each(startValue,endValue,fct,target);return initialValue}};sh.Number.prototype.to=sh.String.prototype.to=function(num){return new NumberIterator(this,num)}})();

- Simple          - 576 byte :
//(function(){var c=this&&this.window===this&&window||this,j=function(a,b,d,g){var h=-1,e,f;if(a<=b){e=a-1;for(f=b-e;++h<f;)d.call(g,h,f,d,++e,a,b)}else{e=a+1;for(f=c.Math.abs(b-e);++h<f;)d.call(g,h,f,d,--e,a,b)}},i=function(a){a=c.Number(a);return a=c.isFinite(a)?c.Math.floor(a):-1},k=function(a,b){initialValue=a.valueOf();a=i(a);b=i(b);this.valueOf=function(){return initialValue};this.toString=function(){return String(initialValue)};this.each=function(d,g){j(a,b,d,g);return initialValue}};c.Number.prototype.to=c.String.prototype.to=function(a){return new k(this,a)}})();

- Advanced        - no success


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 893 byte :
//(function(){var sh=((this&&(this.window===this)&&window)||this),each=(function(from,to,fct,target){var idx=-1,count,len;if(from<=to){count=(from-1);len=(to-count);while(++idx<len){fct.call(target,idx,len,fct,++count,from,to)}}else{count=(from+1);len=sh.Math.abs(to-count);while(++idx<len){fct.call(target,idx,len,fct,--count,from,to)}}}),getNumber=(function(num){num=sh.Number(num);if(sh.isFinite(num)){num=sh.Math.floor(num)}else{num=-1}return num}),NumberIterator=(function(startValue,endValue){initialValue=startValue.valueOf();startValue=getNumber(startValue);endValue=getNumber(endValue);this.valueOf=(function(){return initialValue});this.toString=(function(){return String(initialValue)});this.each=(function(fct,target){each(startValue,endValue,fct,target);return initialValue})});sh.Number.prototype.to=sh.String.prototype.to=(function(num){return(new NumberIterator(this,num))})})();

- packed / shrinked           - 720 byte :
//(function(){var f=((this&&(this.window===this)&&window)||this),each=(function(a,b,c,d){var e=-1,count,len;if(a<=b){count=(a-1);len=(b-count);while(++e<len){c.call(d,e,len,c,++count,a,b)}}else{count=(a+1);len=f.Math.abs(b-count);while(++e<len){c.call(d,e,len,c,--count,a,b)}}}),getNumber=(function(a){a=f.Number(a);if(f.isFinite(a)){a=f.Math.floor(a)}else{a=-1}return a}),NumberIterator=(function(c,d){initialValue=c.valueOf();c=getNumber(c);d=getNumber(d);this.valueOf=(function(){return initialValue});this.toString=(function(){return String(initialValue)});this.each=(function(a,b){each(c,d,a,b);return initialValue})});f.Number.prototype.to=f.String.prototype.to=(function(a){return(new NumberIterator(this,a))})})();


*/ /*


  please run this simple test within [http://jconsole.com/]

*/


(4).to(11).each(function (idx, len, fct) { // callback exactly as in [Number.times]
  print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");
});
print("\n"); // 8 times the function


var callback = (function (idx, len, fct, count, from, to) { // callback similar to [Number.times] - appended arguments array though.
  print("hallo - idx : " + idx + " - len : " + len/* + " - fct : " + fct*/ + " - count : " + count + " - from : " + from + " - to : " + to + "\n");
});


(17).to(21).each(callback); // 5 times the function
print("\n");

("19.5555").to("20").each(callback); // 2 times the function
print("\n");

("18").to("20.9999999999999999999").each(callback); // 4 times the function
print("\n");

(-1).to("1").each(callback); // 3 times the function
print("\n");

(2).to("-1").each(callback); // 4 times the function
print("\n");

(1).to("1").each(callback); // 1 times the function
print("\n");

("0").to(0).each(callback); // 1 times the function
print("\n");

("-1").to(-1).each(callback); // 1 times the function
print("\n");

print(("18").to("21") == 18);    // true
print(("18").to("21") === 18);  // false
print(("18").to("21") == "18");  // true
print(("18").to("21") === "18");// false
print("\n");

print(("18").to("21") == 18);              // true
print(("18").to("21").valueOf() === 18);  // false
print(("18").to("21") == "18");            // true
print(("18").to("21").valueOf() === "18");// true
print("\n");

print(("20").to("1000") / 5); // 4;
print(("20").to() * 4); // 80;
print("\n");
