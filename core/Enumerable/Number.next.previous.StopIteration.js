(function () {


  var
    global = this,


    Num = global.Number,
/*

    INT_MIN = Math.pow(-2, 53), // (Math.pow(-2, 53) - 1) === (Math.pow(-2, 53)) // true // (Math.pow(-2, 53) + 1) === (Math.pow(-2, 53)) // false
    INT_MAX = Math.pow(2, 53),  // [http://blog.vjeux.com/2010/javascript/javascript-max_int-number-limits.html]
                                // via [http://stackoverflow.com/questions/307179/what-is-javascripts-max-int-whats-the-highest-integer-value-a-number-can-go-to#answer-4375743]
*/
    parseInt = global.parseInt,
    isFinite = global.isFinite,


    isFunction = (

      (typeof global.isFunction == "function")

      && global.isFunction(global.isFunction)
      && global.isFunction

    ) || function (obj) {return (typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function");},


    Enumerable = (isFunction(global.require) && global.require("Enumerable")) || global["Enumerable"]
  ;


  var
    nextInteger = (function (parse_int, is_finite, UNDEFINED_VALUE) {
      return function () {

        var
          currInt = parse_int(this, 10),
          nextInt = (currInt + 1)
        ;
        return ((is_finite(nextInt) && (nextInt !== currInt)) ? nextInt : UNDEFINED_VALUE);
      };
    }(parseInt, isFinite)),


    previousInteger = (function (parse_int, is_finite, UNDEFINED_VALUE) {
      return function () {

        var
          currInt = parse_int(this, 10),
          prevInt = (currInt - 1)
        ;
        return ((is_finite(prevInt) && (prevInt !== currInt)) ? prevInt : UNDEFINED_VALUE);
      };
    }(parseInt, isFinite)),


    compare = function (a, b) {return (a - b);},
  //compareTo = function (b) {return (this - b);},


    EnumerableInteger = Enumerable.create({     // By default this implementation of an enumerable trait generator does not
                                                // create [Enumerable]s that do stop iterations by throwing [StopIteration].
      next                  : nextInteger,      // Invalid calls on [next] or [previous] just return [undefined] thus preventing
      previous              : previousInteger,  // wrapping each of these calls into rather expensive try...catch statements.
      compare               : compare,

    //compare               : compareTo,
      isThrowStopIteration  : true              // if this flag was set to [true] each call on [next] or [previous] needs to be wrapped into a try...catch block.
    })
  ;


  EnumerableInteger.call(Num.prototype);


  return Num;


}).call(null);



/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.053 byte
(function(){var global=this,Num=global.Number,parseInt=global.parseInt,isFinite=global.isFinite,isFunction=typeof global.isFunction=="function"&&global.isFunction(global.isFunction)&&global.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},Enumerable=isFunction(global.require)&&global.require("Enumerable")||global["Enumerable"];var nextInteger=function(parse_int,is_finite,UNDEFINED_VALUE){return function(){var currInt=parse_int(this,10),nextInt=currInt+1;return is_finite(nextInt)&&nextInt!==currInt?nextInt:UNDEFINED_VALUE}}(parseInt,isFinite),previousInteger=function(parse_int,is_finite,UNDEFINED_VALUE){return function(){var currInt=parse_int(this,10),prevInt=currInt-1;return is_finite(prevInt)&&prevInt!==currInt?prevInt:UNDEFINED_VALUE}}(parseInt,isFinite),compare=function(a,b){return a-b},EnumerableInteger=Enumerable.create({next:nextInteger,previous:previousInteger,compare:compare,isThrowStopIteration:true});EnumerableInteger.call(Num.prototype);return Num}).call(null);


- Simple          -   555 byte
(function(){var c=this.Number,d=this.parseInt,e=this.isFinite;(("function"==typeof this.isFunction&&this.isFunction(this.isFunction)&&this.isFunction||function(a){return"function"==typeof a&&"function"==typeof a.call&&"function"==typeof a.apply})(this.require)&&this.require("Enumerable")||this.Enumerable).create({next:function(){var a=d(this,10),b=a+1;return e(b)&&b!==a?b:void 0},previous:function(){var a=d(this,10),b=a-1;return e(b)&&b!==a?b:void 0},compare:function(a,b){return a-b},isThrowStopIteration:!0}).call(c.prototype);return c}).call(null);


*/
