/*
  [Number.times] and its relatives got implemented close to mozilla.org's
  [Array.forEach] remaining [Number] specific and Smalltalk inspired though.

  links:

    EN: [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/forEach]
    EN: [http://en.wikipedia.org/wiki/Smalltalk]

    DE: [http://de.wikipedia.org/wiki/Smalltalk-80_(Programmiersprache)#Schleifen]

  for a quick countercheck paste code into [http://jconsole.com/]:
*/


(function () {
  var sh/*scripting_host|global_object*/ = this, Num = sh.Number, NumProto = Num.prototype, StrProto = sh.String.prototype;


  NumProto.times = (function (NUMBER, IS_FINITE, MATH_FLOOR) {
    return (function (fct, target) { // prototypal implementation

      var i = -1, num = NUMBER(this);

      num = ((IS_FINITE(num) && (typeof fct == "function") && MATH_FLOOR(num)) || i);
      target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));

      while (++i < num) {
        fct.call(target, i, num, fct);
      }
    });
  })(Num, sh.isFinite, sh.Math.floor);


  Num.times = (function (times) {
    return (function (num, fct, target) { // static implementation

      times.call(num, fct, target);
    });
  })(NumProto.times);


  StrProto.times = (function (times) {
    return (function (fct, target) { // prototypal implementation

      times.apply(this, arguments);
    });
  })(NumProto.times);


  StrProto = NumProto = Num = sh = null;
  delete StrProto; delete NumProto; delete Num; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);



(5).times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");});              // 5 times the function
(3.999).times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");});          // 3 times the function

print("\n");


Number.times(2, (function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");}));      // 2 times the function
Number.times((1/0), (function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");}));  // 0 times the function
Number.times("1.9", (function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");}));  // 1 times the function

print("\n");


("3").times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");});            // 3 times the function
("2,00000001").times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");});   // 0 times the function
(0).times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");});              // 0 times the function
("5.99999999").times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");});   // 5 times the function

print("\n");


var arr = [1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

arr.length.times(function (idx/*, len, fct*/) {

  print("arr[" + idx + "] : " + arr[idx]);
});


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 743 byte :
(function(){var sh=this,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype;NumProto.times=function(NUMBER,IS_FINITE,MATH_FLOOR){return function(fct,target){var i=-1,num=NUMBER(this);num=IS_FINITE(num)&&typeof fct=="function"&&MATH_FLOOR(num)||i;target=target||(typeof target=="undefined"||typeof target=="object"?null:target);while(++i<num)fct.call(target,i,num,fct)}}(Num,sh.isFinite,sh.Math.floor);Num.times=function(times){return function(num,fct,target){times.call(num,fct,target)}}(NumProto.times);StrProto.times=function(times){return function(fct,target){times.apply(this,arguments)}}(NumProto.times);StrProto=NumProto=Num=sh=null;delete StrProto;delete NumProto;delete Num;delete sh;delete arguments.callee}).call(null);

- Simple          - 510 byte :
(function(){var a=this,c=a.Number,d=c.prototype,h=a.String.prototype;d.times=function(e,i,j){return function(f,b){var k=-1,g=e(this);g=i(g)&&typeof f=="function"&&j(g)||k;for(b=b||(typeof b=="undefined"||typeof b=="object"?null:b);++k<g;)f.call(b,k,g,f)}}(c,a.isFinite,a.Math.floor);c.times=function(e){return function(i,j,f){e.call(i,j,f)}}(d.times);h.times=function(e){return function(){e.apply(this,arguments)}}(d.times);h=d=c=a=null;delete h;delete d;delete c;delete a;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 768 byte :
(function(){var sh=this,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype;NumProto.times=(function(NUMBER,IS_FINITE,MATH_FLOOR){return(function(fct,target){var i=-1,num=NUMBER(this);num=((IS_FINITE(num)&&(typeof fct=="function")&&MATH_FLOOR(num))||i);target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));while(++i<num){fct.call(target,i,num,fct)}})})(Num,sh.isFinite,sh.Math.floor);Num.times=(function(times){return(function(num,fct,target){times.call(num,fct,target)})})(NumProto.times);StrProto.times=(function(times){return(function(fct,target){times.apply(this,arguments)})})(NumProto.times);StrProto=NumProto=Num=sh=null;delete StrProto;delete NumProto;delete Num;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 633 byte :
(function(){var f=this,Num=f.Number,NumProto=Num.prototype,StrProto=f.String.prototype;NumProto.times=(function(c,d,e){return(function(a,b){var i=-1,num=c(this);num=((d(num)&&(typeof a=="function")&&e(num))||i);b=(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b));while(++i<num){a.call(b,i,num,a)}})})(Num,f.isFinite,f.Math.floor);Num.times=(function(d){return(function(a,b,c){d.call(a,b,c)})})(NumProto.times);StrProto.times=(function(c){return(function(a,b){c.apply(this,arguments)})})(NumProto.times);StrProto=NumProto=Num=f=null;delete StrProto;delete NumProto;delete Num;delete f;delete arguments.callee}).call(null);


*/ 
