(function () {


  var
    global = this,


    Str = global.String,


    fromCharCode = Str.fromCharCode,
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
    nextCharacter = (function (from_char_code, parse_int, is_finite, UNDEFINED_VALUE) {
      return function () {

        var
          currVal = ("" + this),
          nextVal
        ;
        if (currVal === "") { // there is nothing like a "next" character that could be a successor of an empty string.

          nextVal = UNDEFINED_VALUE;

        } else if (currVal.length == 1) { // this definitely is a character.

          nextVal = from_char_code(currVal.charCodeAt(0) + 1);
      /*
       *  either "nextVal" gets assigned a valid character ...
       *  ... or assignement of "nextVal" falls back again to the [undefined] value.
       */
          nextVal = ((nextVal !== "") && (nextVal !== currVal)) ? nextVal : UNDEFINED_VALUE;

        } else {

          currVal = parse_int(this, 10);
          nextVal = (currVal + 1);
      /*
       *  either "nextVal" gets assigned a valid number ...
       *  ... or assignement of "nextVal" falls back again to the [undefined] value.
       */
          nextVal = (is_finite(nextVal) && (nextVal !== currVal)) ? nextVal : UNDEFINED_VALUE;
        }
        return nextVal;
      };
    }(fromCharCode, parseInt, isFinite)),


    compare = function (a, b) {return (((a < b) && -1) || ((a > b) && 1) || 0);},
  //compareTo = function (b) {return (((this < b) && -1) || ((this > b) && 1) || 0);},


    EnumerableCharacter = Enumerable.create({     // By default this implementation of an enumerable trait generator does not
                                                  // create [Enumerable]s that do stop iterations by throwing [StopIteration].
      next                  : nextCharacter,      // Invalid calls on [next] or [previous] just return [undefined] thus preventing
    //previous              : previousCharacter,  // wrapping each of these calls into rather expensive try...catch statements.
      compare               : compare,

    //compare               : compareTo,
      isThrowStopIteration  : true                // if this flag was set to [true] each call on [next] or [previous] needs to be wrapped into a try...catch block.
    })
  ;


  EnumerableCharacter.call(Str.prototype);


  return Str;


}).call(null);



/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.114 byte
(function(){var global=this,Str=global.String,fromCharCode=Str.fromCharCode,parseInt=global.parseInt,isFinite=global.isFinite,isFunction=typeof global.isFunction=="function"&&global.isFunction(global.isFunction)&&global.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},Enumerable=isFunction(global.require)&&global.require("Enumerable")||global["Enumerable"];var nextCharacter=function(from_char_code,parse_int,is_finite,UNDEFINED_VALUE){return function(){var currVal=""+this,nextVal;if(currVal==="")nextVal=UNDEFINED_VALUE;else if(currVal.length==1){nextVal=from_char_code(currVal.charCodeAt(0)+1);nextVal=nextVal!==""&&nextVal!==currVal?nextVal:UNDEFINED_VALUE}else{currVal=parse_int(this,10);nextVal=currVal+1;nextVal=is_finite(nextVal)&&nextVal!==currVal?nextVal:UNDEFINED_VALUE}return nextVal}}(fromCharCode,parseInt,isFinite),compare=function(a,b){return a<b&&-1||a>b&&1||0},EnumerableCharacter=Enumerable.create({next:nextCharacter,compare:compare,isThrowStopIteration:true});EnumerableCharacter.call(Str.prototype);return Str}).call(null);


- Simple          -   611 byte
(function(){var c=this.String,d=c.fromCharCode,e=this.parseInt,f=this.isFinite;(("function"==typeof this.isFunction&&this.isFunction(this.isFunction)&&this.isFunction||function(b){return"function"==typeof b&&"function"==typeof b.call&&"function"==typeof b.apply})(this.require)&&this.require("Enumerable")||this.Enumerable).create({next:function(){var b=""+this,a;""===b?a=void 0:1==b.length?(a=d(b.charCodeAt(0)+1),a=""!==a&&a!==b?a:void 0):(b=e(this,10),a=b+1,a=f(a)&&a!==b?a:void 0);return a},compare:function(b,a){return b<a&&-1||b>a&&1||0},isThrowStopIteration:!0}).call(c.prototype);return c}).call(null);


*/
