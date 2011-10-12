(function () {
  var
    global = this,


    Num = global.Number,
    Str = global.String,
    NumProto = Num.prototype,
    StrProto = Str.prototype,


    isFunction = ((typeof global.isFunction == "function") && global.isFunction) || function (obj) {

      return (typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function");
    }/*,


    INT_MIN = Math.pow(-2, 53), // (Math.pow(-2, 53) - 1) === (Math.pow(-2, 53)) // true // (Math.pow(-2, 53) + 1) === (Math.pow(-2, 53)) // false
    INT_MAX = Math.pow(2, 53)   // [http://blog.vjeux.com/2010/javascript/javascript-max_int-number-limits.html] via [http://stackoverflow.com/questions/307179/what-is-javascripts-max-int-whats-the-highest-integer-value-a-number-can-go-to#answer-4375743]
*/;


  NumProto.next = (isFunction(NumProto.next) && NumProto.next) || (function (parse_int/*, is_finite, INT_MIN_VAL, INT_MAX_VAL*/) {
    return function () {/*
      var num = parse_int(this, 10);

      if (is_finite(num)) {
        ++num;

        num = (((num < INT_MIN_VAL) && INT_MIN_VAL) || num)
        num = (((num > INT_MAX_VAL) && INT_MAX_VAL) || num);
      }
      return num;
    */
      return parse_int(((1 * this) + 1), 10);
    };
  })(global.parseInt/*, global.isFinite, INT_MIN, INT_MAX*/);


  StrProto.next = (isFunction(StrProto.next) && StrProto.next) || (function (str_from_char_code, parse_int, is_finite, UNDEFINED_VALUE) {
    return function () {
      var val = ("" + this);

      if (val === "") { // there is nothing like a "next" character that could be a successor of an empty string.

        val = UNDEFINED_VALUE;

      } else if (val.length == 1) { // this definitely is a character.

        val = str_from_char_code(val.charCodeAt(0) + 1);

      } else if (!is_finite(val = parse_int(((1 * this) + 1), 10))) { // either "val" gets assigned a valid number ...

        val = UNDEFINED_VALUE; // ... or assignement of "val" falls back again to the [undefined] value.
      }
      return val;
    };
  })(Str.fromCharCode, global.parseInt, global.isFinite);


  isFunction = StrProto = NumProto = Str = Num/* = INT_MIN = INT_MAX*/ = global = null;

  delete isFunction; delete StrProto; delete NumProto; delete Str; delete Num/*;
  delete INT_MIN; delete INT_MAX*/; delete global;

}).call(null/*does force the internal [this] context pointing to the [global] object*/);



/*

var num = 273582153;
var max = 273582334;
while ((num = num.next()) <= max) {
  console.log(num);
};

var str = "273582153";
var max = "273582334";
while ((str = str.next()) != max) {
  console.log(str);
};

var str = "0";
var max = "z";
while ((str = str.next()) < max) {
  console.log(str);
};

*/ /*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 956 byte
(function(){var global=this,Num=global.Number,Str=global.String,NumProto=Num.prototype,StrProto=Str.prototype,isFunction=typeof global.isFunction=="function"&&global.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"};NumProto.next=isFunction(NumProto.next)&&NumProto.next||function(parse_int){return function(){return parse_int(1*this+1,10)}}(global.parseInt);StrProto.next=isFunction(StrProto.next)&&StrProto.next||function(str_from_char_code,parse_int,is_finite,UNDEFINED_VALUE){return function(){var val=""+this;if(val==="")val=UNDEFINED_VALUE;else if(val.length==1)val=str_from_char_code(val.charCodeAt(0)+1);else if(!is_finite(val=parse_int(1*this+1,10)))val=UNDEFINED_VALUE;return val}}(Str.fromCharCode,global.parseInt,global.isFinite);isFunction=StrProto=NumProto=Str=Num=global=null;delete isFunction;delete StrProto;delete NumProto;delete Str;delete Num;delete global}).call(null);

- Simple          - 609 byte
(function(){var a=this,g=a.Number,c=a.String,d=g.prototype,e=c.prototype,f=typeof a.isFunction=="function"&&a.isFunction||function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"};d.next=f(d.next)&&d.next||function(a){return function(){return a(1*this+1,10)}}(a.parseInt);e.next=f(e.next)&&e.next||function(a,d,e,c){return function(){var b=""+this;if(b==="")b=c;else if(b.length==1)b=a(b.charCodeAt(0)+1);else if(!e(b=d(1*this+1,10)))b=c;return b}}(c.fromCharCode,a.parseInt,a.isFinite);f=e=d=c=g=a=null;delete f;delete e;delete d;delete c;delete g;delete a}).call(null);


*/
