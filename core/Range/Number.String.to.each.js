(function () {
  var
    global = this,


    Num = global.Number,
    Str = global.String,
    NumProto = Num.prototype,
    StrProto = Str.prototype,

    mathAbs = global.Math.abs,



  valueOf = (function (proto_value_of) {
    return (function (type) {

    //return (((typeof type.valueOf == "function") && type.valueOf()) || proto_value_of.call(type).valueOf());
      return proto_value_of.call(type).valueOf();
    });
  })(global.Object.prototype.valueOf),

  compareTypes = (function (value_of) {
    return (function (typeA, typeB) {

      var valueA, valueB;
      return ((
        (typeof typeA.compareTo == "function") && (typeof typeB.compareTo == "function") && typeA.compareTo(typeB)
      ) || (
        (((valueA = value_of(typeA)) > (valueB = value_of(typeB))) && 1) || ((valueA < valueB) && -1) || 0
      ));
    });
  })(valueOf),



  eachType = (function (value_of, compare) {
    return (function (fct, target, thisRange, currentType, endType) {

      if ((typeof currentType.next == "function") && (typeof endType.next == "function")) { // types that are >>ready for [[Range]]<< do at least implement a [next] method ...
        if ((value_of(currentType) === value_of(endType)) || (compare(currentType, endType) < 0)) { // ... for better comparison a [compareTo] method was nice to have too.

          if (typeof fct == "function") {
            target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));

            var idx = -1;
            do {

            //callback.call(target, element, index, listStructure/*[, startValue, endValue]*/);
              fct.call(target, currentType, ++idx, thisRange/*, this, endType*/);

              currentType = currentType.next();

            } while (currentType && (typeof currentType.next == "function") && (compare(currentType, endType) < 0))
          }
        }
      }
    });
  })(valueOf, compareTypes),


  eachInteger = (function (math_abs) {
    return (function (fct, target, thisRange, from, to) {

      if (typeof fct == "function") {
        target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));

        var idx = -1, count, len;
        if (from <= to) {

          count = (from - 1);
          len = (to - count);

          while (++idx < len) {
          /*
            was:
          //arguments order of callback function sticks closely/strictly to that one of [Number.times] but appends the arguments array by "count", "from" and "to".
            fct.call(target, idx, len, fct, ++count, from, to);
          */
          //arguments order of callback has been changed to meet - at least at the first three positions - that one of array/list iterators.


          //callback.call(target, element, index, listStructure[, startValue, endValue[, listLength[, callback]]]);
            fct.call(target, ++count, idx, thisRange, from, to, len, fct);
          }
        } else {

          count = (from + 1);
          len = math_abs(to - count);

          while (++idx < len) {
            fct.call(target, --count, idx, thisRange, from, to, len, fct);
          }
        }
      }
    });
  })(mathAbs),


  eachCharacter = (function (math_abs, str_from_char_code) {
    return (function (fct, target, thisRange, from, to) {

      if (typeof fct == "function") {
        target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));

        from = from.charCodeAt(0);
        to = to.charCodeAt(0);

        var idx = -1, count, len;
        if (from <= to) {

          count = (from - 1);
          len = (to - count);

          while (++idx < len) {
          //callback.call(target, element, index, listStructure[, startValue, endValue[, listLength[, callback]]]);
            fct.call(target, str_from_char_code(++count), idx, thisRange, from, to, len, fct);
          }
        } else {

          count = (from + 1);
          len = math_abs(to - count);

          while (++idx < len) {
            fct.call(target, str_from_char_code(--count), idx, thisRange, from, to, len, fct);
          }
        }
      }
    });
  })(mathAbs, Str.fromCharCode),



  rangeToArray = (function (thisRange) {
    var arr = [];

    thisRange.each(function (elm/*, idx, range*/) {
      arr.push(elm);
    });
    return arr;
  }),



  Range = (function (range_to_array) {
    return (function (forEach, startValue, endValue) {
      var arr;

      this.each = (function (fct, target) {

        forEach(fct, target, this, startValue, endValue);

        return this;
      });
      this.toArray = (function () {

        return (arr || (arr = range_to_array(this)));
      });

      this.valueOf = (function () {

        return this.toArray();
      });
      this.toString = (function () {

        return ("" + this.toArray());
      });
    });
  })(rangeToArray),



  castInteger = (function (parse_int, is_finite, N_A_N) {
    return (function (num) {

      return ((!is_finite(num = parse_int((1 * num), 10)) && N_A_N) || num);
    });
  })(global.parseInt, global.isFinite, Num.NaN),

  castBest = (function (cast_integer) {
    return (function (type) {

      return (((type = ("" + type)) && (type.length === 1) && type) || cast_integer(type));
    });
  })(castInteger),



  createRange = (function (is_nan, value_of, cast_best, Range, each_type, each_int, each_char) {
    return (function (type) {

      var // in almost every case the initial value was a primitive "number" or "string" value.
        from = cast_best(this),
        to = cast_best(type),
        range;

      if ((typeof from == "string") && (typeof to == "string")) { // and only if both length's of each [from] and [to] are equal to 1.
        if (!is_nan(from) && !is_nan(to) && (typeof value_of(this) == "number") && (typeof value_of(type) == "number")) {

          range = (new Range(each_int, from, to));    // "two valid integers each of value between 0 and 9."
        } else {
          range = (new Range(each_char, from, to));   // "two valid characters."
        }
      } else {
        if (is_nan(from) || is_nan(to)) {
        //this triggers the generic [each] implementation of [[Range]] which forces compatible types as range members.

          range = (new Range(each_type, this, type)); // "at least one of those two types neither does cast to valid integer nor does it cast to valid character."
        } else {
          range = (new Range(each_int, from, to));    // "both types do cast to valid integers - at least one of value grater than 9."
        }
      }
      return range;
    });
  })(global.isNaN, valueOf, castBest, Range, eachType, eachInteger, eachCharacter);



  StrProto.to = NumProto.to = (function (create_range) {
    return (function (type) {

      return create_range.call(this, type);
    });
  })(createRange);



  Range = createRange = castBest = castInteger = rangeToArray = valueOf = compareTypes = eachType = eachInteger = eachCharacter = mathAbs = StrProto = NumProto = Str = Num = global = null;
  delete Range; delete createRange; delete castBest; delete castInteger; delete rangeToArray; delete valueOf; delete compareTypes; delete eachType; delete eachInteger; delete eachCharacter;
  delete mathAbs; delete StrProto; delete NumProto; delete Str; delete Num; delete global;


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


(4).to(11).each(function (elm, idx, range) { // callback meets arguments order of array iterator callbacks.
  print("hallo - elm : " + elm + " - idx : " + idx + " - range : " + range + "\n");
});
print("\n"); // 8 times the function


var callback = (function (elm, idx, range, from, to, len, fct) { // optional appended arguments array.4
  print("hallo - elm : " + elm + " - idx : " + idx + " - range : " + range + " - from : " + from + " - to : " + to + " - len : " + len + " - fct : " + fct + "\n");
});


(17).to(21).each(callback); // 5 times the function
print("\n");

("19.5555").to("20").each(callback); // 2 times the function
print("\n");

("18").to("20.9999999999999999999").each(callback); // 4 times the function
print("\n");
/*
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

*/
