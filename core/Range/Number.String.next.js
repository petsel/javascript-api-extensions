(function () {
  var
    global = this,


    Num = global.Number,
    Str = global.String,
    NumProto = Num.prototype,
    StrProto = Str.prototype,

/*
    Range, RngProto,
*/

    isFunction = (((typeof global.isFunction == "function") && global.isFunction) || (function (obj) {
      return ((typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function"));
    }));/*,


    INT_MIN = Math.pow(-2, 53), // (Math.pow(-2, 53) - 1) === (Math.pow(-2, 53)) // true // (Math.pow(-2, 53) + 1) === (Math.pow(-2, 53)) // false
    INT_MAX = Math.pow(2, 53); // [http://blog.vjeux.com/2010/javascript/javascript-max_int-number-limits.html] via [http://stackoverflow.com/questions/307179/what-is-javascripts-max-int-whats-the-highest-integer-value-a-number-can-go-to#answer-4375743]
*/

  NumProto.next = ((isFunction(NumProto.next) && NumProto.next) || (function (parse_int/*, is_finite, INT_MIN_VAL, INT_MAX_VAL*/) {
    return (function () {/*
      var num = parse_int(this, 10);

      if (is_finite(num)) {
        ++num;

        num = (((num < INT_MIN_VAL) && INT_MIN_VAL) || num)
        num = (((num > INT_MAX_VAL) && INT_MAX_VAL) || num);
      }
      return num;
    */
      return parse_int(((1 * this) + 1), 10);
    });
  })(global.parseInt/*, global.isFinite, INT_MIN, INT_MAX*/));


  StrProto.next = ((isFunction(StrProto.next) && StrProto.next) || (function (str_from_char_code, parse_int, is_finite, num_proto_next) {
    return (function () {
      var str = ("" + this), num;

      if (str.length == 1) {

        str = str_from_char_code(str.charCodeAt(0) + 1);

      } else if ((num = parse_int((1 * this), 10)) && is_finite(num)) {

        str = num_proto_next.call(num);
      } else {
        str = "";
      }
      return str;
    });
  })(Str.fromCharCode, global.parseInt, global.isFinite, NumProto.next));


  global = Num = Str = NumProto = StrProto/* = Range = RngProto*/ = isFunction/* = INT_MIN = INT_MAX*/ = null;

  delete global;
  delete Num; delete Str;
  delete NumProto; delete StrProto/*;
  delete Range*; delete RngProto*/;
  delete isFunction/*; delete INT_MIN; delete INT_MAX*/;

  delete arguments.callee;


}).call(null);



/*

var num = 273582153;
var max = 273582334;
while ((num = num.next()) < max) {
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

*/



/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 985 byte
(function(){var global=this,Num=global.Number,Str=global.String,NumProto=Num.prototype,StrProto=Str.prototype,isFunction=typeof global.isFunction=="function"&&global.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"};NumProto.next=isFunction(NumProto.next)&&NumProto.next||function(parse_int){return function(){return parse_int(1*this+1,10)}}(global.parseInt);StrProto.next=isFunction(StrProto.next)&&StrProto.next||function(str_from_char_code,parse_int,is_finite,num_proto_next){return function(){var str=""+this,num;if(str.length==1)str=str_from_char_code(str.charCodeAt(0)+1);else if((num=parse_int(1*this,10))&&is_finite(num))str=num_proto_next.call(num);else str="";return str}}(Str.fromCharCode,global.parseInt,global.isFinite,NumProto.next);global=Num=Str=NumProto=StrProto=isFunction=null;delete global;delete Num;delete Str;delete NumProto;delete StrProto;delete isFunction;delete arguments.callee}).call(null);

- Simple          - 621 byte
(function(){var a=this,d=a.Number,f=a.String,b=d.prototype,e=f.prototype,c=typeof a.isFunction=="function"&&a.isFunction||function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"};b.next=c(b.next)&&b.next||function(a){return function(){return a(1*this+1,10)}}(a.parseInt);e.next=c(e.next)&&e.next||function(a,b,e,f){return function(){var c=""+this,d;return c=c.length==1?a(c.charCodeAt(0)+1):(d=b(1*this,10))&&e(d)?f.call(d):""}}(f.fromCharCode,a.parseInt,a.isFinite,b.next);a=d=f=b=e=c=null;delete a;delete d;delete f;delete b;delete e;delete c;delete arguments.callee}).call(null);


*/
