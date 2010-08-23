/*
  [Function.whileTrue|whileFalse] is the last JavaScript implementation of Smalltalk inspired
  control structures like [Boolean.ifTrue|ifFalse], [Number.times] or [Number.to( ... ).each]
  that recently have been committed to refactory.org.

  Its right to exist might be more of academic nature. But here it is.

  links:

    DE: [http://de.wikipedia.org/wiki/Smalltalk-80_(Programmiersprache)#Kontrollstrukturen]

  for a quick countercheck paste code into [http://jconsole.com/]:
*/ /*

  [ "ein Block, der ein boole'sches Objekt zurückgibt" ] whileTrue.
  [ "ein Block, der ein boole'sches Objekt zurückgibt" ] whileFalse.
  [ "ein Block, der ein boole'sches Objekt zurückgibt" ] whileTrue: [ "Block mit Schleifenrumpf" ].
  [ "ein Block, der ein boole'sches Objekt zurückgibt" ] whileFalse: [ "Block mit Schleifenrumpf" ]


  Function.prototype.whileFalse = (function () {});

  (function () {}).whileTrue();
  (function () {}).whileFalse();
  (function () {}).whileTrue().ifFalse(function () {});
  (function () {}).whileFalse().ifTrue(function () {});
*/


(function () {
  var sh/*scripting_host|global_object*/ = this, Arr = sh.Array, FctProto = sh.Function.prototype,


  makeArray = (((typeof Arr.make == "function") && Arr.make) || (function (slice) {
    return (function (list) { // sufficient enough for it only has to convert [Argument] objects into [Array] objects.

      return slice.call(list);
    });
  })(Arr.prototype.slice));


  FctProto.whileTrue = (function (make) {
    return (function (/*fct:Function[, arg01:Object[, arg02:Object]]*/) {

      var arr = make(arguments), fctStatement = arr.shift(0), fctCondition = this;
      if ((typeof fctStatement == "function") && (typeof fctCondition == "function")) {

        while (fctCondition.apply(null, arr)) {
        //arr = fctStatement.apply(null, arr);          // this already is sufficient and every browser can deal with it ...
          arr = (fctStatement.apply(null, arr) || []);  // ... except for msie that at this point, for whatever reason, desires an object.
        }
      }
    //return false; // nice to have if to be followed by a functional [Boolean.ifFalse] expression.
      return null;  // that's what the Smalltalk specification states.
    });
  })(makeArray);


  FctProto.whileFalse = (function (make) {
    return (function (/*fct:Function[, arg01:Object[, arg02:Object]]*/) {

      var arr = make(arguments), fctStatement = arr.shift(0), fctCondition = this;
      if ((typeof fctStatement == "function") && (typeof fctCondition == "function")) {

        while (!fctCondition.apply(null, arr)) {
        //arr = fctStatement.apply(null, arr);          // this already is sufficient and every browser can deal with it ...
          arr = (fctStatement.apply(null, arr) || []);  // ... except for msie that at this point, for whatever reason, desires an object.
        }
      }
    //return false; // nice to have if to be followed by a functional [Boolean.ifFalse] expression.
      return null;  // that's what the Smalltalk specification states.
    });
  })(makeArray);


  makeArray = FctProto = Arr = sh = null;
  delete makeArray; delete FctProto; delete Arr; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 896 byte :
(function(){var sh=this,Arr=sh.Array,FctProto=sh.Function.prototype,makeArray=typeof Arr.make=="function"&&Arr.make||function(slice){return function(list){return slice.call(list)}}(Arr.prototype.slice);FctProto.whileTrue=function(make){return function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if(typeof fctStatement=="function"&&typeof fctCondition=="function")while(fctCondition.apply(null,arr))arr=fctStatement.apply(null,arr)||[];return null}}(makeArray);FctProto.whileFalse=function(make){return function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if(typeof fctStatement=="function"&&typeof fctCondition=="function")while(!fctCondition.apply(null,arr))arr=fctStatement.apply(null,arr)||[];return null}}(makeArray);makeArray=FctProto=Arr=sh=null;delete makeArray;delete FctProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- Simple          - 624 byte :
(function(){var e=this,b=e.Array,f=e.Function.prototype,g=typeof b.make=="function"&&b.make||function(c){return function(a){return c.call(a)}}(b.prototype.slice);f.whileTrue=function(c){return function(){var a=c(arguments),d=a.shift(0);if(typeof d=="function"&&typeof this=="function")for(;this.apply(null,a);)a=d.apply(null,a)||[];return null}}(g);f.whileFalse=function(c){return function(){var a=c(arguments),d=a.shift(0);if(typeof d=="function"&&typeof this=="function")for(;!this.apply(null,a);)a=d.apply(null,a)||[];return null}}(g);g=f=b=e=null;delete g;delete f;delete b;delete e;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 929 byte :
(function(){var sh=this,Arr=sh.Array,FctProto=sh.Function.prototype,makeArray=(((typeof Arr.make=="function")&&Arr.make)||(function(slice){return(function(list){return slice.call(list)})})(Arr.prototype.slice));FctProto.whileTrue=(function(make){return(function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(fctCondition.apply(null,arr)){arr=(fctStatement.apply(null,arr)||[])}}return null})})(makeArray);FctProto.whileFalse=(function(make){return(function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(!fctCondition.apply(null,arr)){arr=(fctStatement.apply(null,arr)||[])}}return null})})(makeArray);makeArray=FctProto=Arr=sh=null;delete makeArray;delete FctProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 878 byte :
(function(){var c=this,Arr=c.Array,FctProto=c.Function.prototype,makeArray=(((typeof Arr.make=="function")&&Arr.make)||(function(b){return(function(a){return b.call(a)})})(Arr.prototype.slice));FctProto.whileTrue=(function(b){return(function(){var a=b(arguments),fctStatement=a.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})(makeArray);FctProto.whileFalse=(function(b){return(function(){var a=b(arguments),fctStatement=a.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(!fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})(makeArray);makeArray=FctProto=Arr=c=null;delete makeArray;delete FctProto;delete Arr;delete c;delete arguments.callee}).call(null);

- packed / shrinked / encoded - 819 byte :
eval(function(p,a,c,k,e,r){e=function(c){return c.toString(a)};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){f c=g,6=c.o,7=c.t.j,9=(((d 6.k=="1")&&6.k)||(1(b){4(1(a){4 b.i(a)})})(6.j.q));7.s=(1(b){4(1(){f a=b(h),3=a.n(0),5=g;m((d 3=="1")&&(d 5=="1")){l(5.e(2,a)){a=(3.e(2,a)||[])}}4 2})})(9);7.r=(1(b){4(1(){f a=b(h),3=a.n(0),5=g;m((d 3=="1")&&(d 5=="1")){l(!5.e(2,a)){a=(3.e(2,a)||[])}}4 2})})(9);9=7=6=c=2;8 9;8 7;8 6;8 c;8 h.p}).i(2);',30,30,'|function|null|fctStatement|return|fctCondition|Arr|FctProto|delete|makeArray||||typeof|apply|var|this|arguments|call|prototype|make|while|if|shift|Array|callee|slice|whileFalse|whileTrue|Function'.split('|'),0,{}));


*/ /*


  please run all following simple tests within [http://jconsole.com/]


*/


// 2 simple examples both operating at variables of an outer scope:

var arr = [], maxLength = 9;

print((function () { // "conditional" part

  return (arr.length >= maxLength);

}).whileFalse(function () { // "statement" complement

  arr.push(Math.floor(Math.random() * maxLength));
  print("currLength : " + arr.length + " - arr : " + arr);

}));
print((function () { // "conditional" part

  return (arr.length < maxLength);

}).whileTrue(function () { // "statement" complement

  arr.push(Math.floor(Math.random() * maxLength));
  print("currLength : " + arr.length + " - arr : " + arr);

}));



// more advanced examples - each does provide its conditional start parameters locally to itself and passes them around:

print((function (x, y) { // "conditional" part

  return ((x-y) > 0);

}).whileTrue((function (x, y) { // "statement" complement

  print("x : " + x + " - y : " + y);
  ++y;

//the current state of all assigned parameters needs to be returned to this "statement"s "conditional" complement as ordered list.
  return [x, y];

}), 5, 2)); // start parameters [x] and [y] for both functions the "conditional" part and its "statement" complement.


print((function (x, y) { // "conditional" part

  return ((x-y) > 0);

}).whileFalse((function (x, y) { // "statement" complement

  print("x : " + x + " - y : " + y);
  ++y;

//the current state of all assigned parameters needs to be returned to this "statement"s "conditional" complement as ordered list.
  return [x, y];

}), 5, 2)); // start parameters [x] and [y] for both functions the "conditional" part and its "statement" complement.
