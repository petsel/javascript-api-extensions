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

(function () { // anonymus application context


//[sh] - scripting host.
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
      //args = fctStatement.apply(null, args);          // this already is sufficient and every browser can deal with it ...
        args = (fctStatement.apply(null, args) || []);  // ... except for msie that at this point, for whatever reason, desires an object.
      }
    }
  //return false; // nice to have if to be followed by a functional [Boolean.ifFalse] expression.
    return null; // that's what the Smalltalk specification states.
  });
  sh.Function.prototype.whileFalse = (function (/*fct:Function[, arg01:Object[, arg02:Object]]*/) {

    var args = makeArray(arguments),

    fctStatement = args.shift(0),
    fctCondition = this;

    if (isFunction(fctStatement) && isFunction(fctCondition)) {

      while (!fctCondition.apply(null, args)) {
      //args = fctStatement.apply(null, args);          // this already is sufficient and every browser can deal with it ...
        args = (fctStatement.apply(null, args) || []);  // ... except for msie that at this point, for whatever reason, desires an object.
      }
    }
  //return false; // nice to have if to be followed by a functional [Boolean.ifFalse] expression.
    return null; // that's what the Smalltalk specification states.
  });

})();/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 795 byte :
//(function(){var sh=this&&this.window===this&&window||this,makeArray=typeof sh.Array.make=="function"&&sh.Array.make||function(){var slice=sh.Array.prototype.slice;return function(list){return slice.call(list)}}(),isFunction=function(obj){return typeof obj=="function"};sh.Function.prototype.whileTrue=function(){var args=makeArray(arguments),fctStatement=args.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition))while(fctCondition.apply(null,args))args=fctStatement.apply(null,args)||[];return null};sh.Function.prototype.whileFalse=function(){var args=makeArray(arguments),fctStatement=args.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition))while(!fctCondition.apply(null,args))args=fctStatement.apply(null,args)||[];return null}})();

- Simple          - 540 byte :
//(function(){var c=this&&this.window===this&&window||this,f=typeof c.Array.make=="function"&&c.Array.make||function(){var a=c.Array.prototype.slice;return function(b){return a.call(b)}}(),e=function(a){return typeof a=="function"};c.Function.prototype.whileTrue=function(){var a=f(arguments),b=a.shift(0),d=this;if(e(b)&&e(d))for(;d.apply(null,a);)a=b.apply(null,a)||[];return null};c.Function.prototype.whileFalse=function(){var a=f(arguments),b=a.shift(0),d=this;if(e(b)&&e(d))for(;!d.apply(null,a);)a=b.apply(null,a)||[];return null}})();

- Advanced        - 171 byte : !!! BROKEN !!!


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 827 byte :
//(function(){var sh=((this&&(this.window===this)&&window)||this),makeArray=(((typeof sh.Array.make=="function")&&sh.Array.make)||(function(){var slice=sh.Array.prototype.slice;return(function(list){return slice.call(list)})})()),isFunction=(function(obj){return(typeof obj=="function")});sh.Function.prototype.whileTrue=(function(){var args=makeArray(arguments),fctStatement=args.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition)){while(fctCondition.apply(null,args)){args=(fctStatement.apply(null,args)||[])}}return null});sh.Function.prototype.whileFalse=(function(){var args=makeArray(arguments),fctStatement=args.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition)){while(!fctCondition.apply(null,args)){args=(fctStatement.apply(null,args)||[])}}return null})})();ister)&&isFunction(sh.EventTargetProvider.unsubscribe)&&sh.EventTargetProvider)||(sh.EventDispatcher&&isFunction(sh.EventDispatcher.register)&&isFunction(sh.EventDispatcher.unsubscribe)&&sh.EventDispatcher))||null);throwImplementationError(!ETP&&strErrorETP);throwImplementationError(!LWM&&strErrorLWM);strErrorETP=null;strErrorLWM=null;isFunction=null;throwImplementationError=null;delete strErrorETP;delete strErrorLWM;delete isFunction;delete throwImplementationError;return(function(){var self=this,list=[],onEnqueue=(function(obj){self.dispatchEvent({target:self,type:"onEnqueue",elm:obj})}),onDequeue=(function(obj){self.dispatchEvent({target:self,type:"onDequeue",elm:obj})}),onEmpty=(function(){self.dispatchEvent({target:self,type:"onEmpty"})});ETP.register(this);LWM.call(this,list);this.constructor=(sh.Queue||arguments.callee);this.enqueue=(function(obj){list.push(obj);this.length=list.length;onEnqueue(obj)});this.dequeue=(function(){var obj=list.shift();if(list.length===0){onEmpty()}onDequeue(obj);return obj})})})();

- packed / shrinked           - 773 byte :
//(function(){var c=((this&&(this.window===this)&&window)||this),makeArray=(((typeof c.Array.make=="function")&&c.Array.make)||(function(){var b=c.Array.prototype.slice;return(function(a){return b.call(a)})})()),isFunction=(function(a){return(typeof a=="function")});c.Function.prototype.whileTrue=(function(){var a=makeArray(arguments),fctStatement=a.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition)){while(fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null});c.Function.prototype.whileFalse=(function(){var a=makeArray(arguments),fctStatement=a.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition)){while(!fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})();


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
