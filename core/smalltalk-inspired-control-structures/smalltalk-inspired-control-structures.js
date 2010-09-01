(function () {
  var sh/*scripting_host|global_object*/ = this,

  Arr = sh.Array,
  FctProto = sh.Function.prototype,
  BoolProto = this.Boolean.prototype,
  Num = sh.Number,
  NumProto = Num.prototype,
  StrProto = sh.String.prototype,


  makeArray = (((typeof Arr.make == "function") && Arr.make) || (function (slice) {
    return (function (list) { // sufficient enough for it only has to convert [Argument] objects into [Array] objects.

      return slice.call(list);
    });
  })(Arr.prototype.slice)),


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

  NumberIterator = (function (EACH, GET_NUMBER, VALUE_OF) {
    return (function (startValue, endValue) {

    //in almost every case the initial value was a primitive "number" or "string" value.
      initialValue = VALUE_OF.call(startValue).valueOf();

      startValue = GET_NUMBER(startValue);
      endValue = GET_NUMBER(endValue);

      this.valueOf = (function () {
        return initialValue;
      });
      this.toString = (function () {
        return ("" + initialValue);
      });

    //[each], [go], [does], [todo], [serve] or [serves] because [do] is an reserved word and already in use as part of the do-while iterator statement.
      this.each = (function (fct, target) {

        EACH(startValue, endValue, fct, target);
        return initialValue;
      });
    });
  })(each, getNumber, sh.Object.prototype.valueOf);


  NumProto.to = StrProto.to = (function (NUMBER_ITERATOR) {
    return (function (num) {

    //print("(typeof this) : " + (typeof this));
      return (new NUMBER_ITERATOR(this, num));
    });
  })(NumberIterator);


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


  BoolProto.ifTrue = (function (fct, target/*optional:[object|function]*/) { // [caseTrue], [ifTrue], [ifTrueDo]
    var isTrue = this.valueOf();
    if (isTrue && (typeof fct == "function")) {
      fct.call(target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
    }
    return isTrue;
  });
  BoolProto.ifFalse = (function (fct, target/*optional:[object|function]*/) { // [caseFalse], [ifFalse], [ifFalseDo]
    var isTrue = this.valueOf();
    if (!isTrue && (typeof fct == "function")) {
      fct.call(target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
    }
    return isTrue;
  });


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


  makeArray = NumberIterator = getNumber = each = StrProto = NumProto = Num = BoolProto = FctProto = Arr = sh = null;
  delete makeArray; delete NumberIterator; delete getNumber; delete each; delete StrProto; delete NumProto; delete Num; delete BoolProto; delete FctProto; delete Arr; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 3.238 byte :
(function(){var sh=this,Arr=sh.Array,FctProto=sh.Function.prototype,BoolProto=this.Boolean.prototype,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype,makeArray=typeof Arr.make=="function"&&Arr.make||function(slice){return function(list){return slice.call(list)}}(Arr.prototype.slice),each=function(MATH_ABS){return function(from,to,fct,target){if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var idx=-1,count,len;if(from<=to){count=from-1;len=to-count;while(++idx<len)fct.call(target,idx,len,fct,++count,from,to)}else{count=from+1;len=MATH_ABS(to-count);while(++idx<len)fct.call(target,idx,len,fct,--count,from,to)}}}}(sh.Math.abs),getNumber=function(NUMBER,IS_FINITE,MATH_FLOOR){return function(num){num=NUMBER(num);if(IS_FINITE(num))num=MATH_FLOOR(num);else num=-1;return num}}(Num,sh.isFinite,sh.Math.floor),NumberIterator=function(EACH,GET_NUMBER,VALUE_OF){return function(startValue,endValue){initialValue=VALUE_OF.call(startValue).valueOf();startValue=GET_NUMBER(startValue);endValue=GET_NUMBER(endValue);this.valueOf=function(){return initialValue};this.toString=function(){return""+initialValue};this.each=function(fct,target){EACH(startValue,endValue,fct,target);return initialValue}}}(each,getNumber,sh.Object.prototype.valueOf);NumProto.to=StrProto.to=function(NUMBER_ITERATOR){return function(num){return new NUMBER_ITERATOR(this,num)}}(NumberIterator);NumProto.times=function(NUMBER,IS_FINITE,MATH_FLOOR){return function(fct,target){var i=-1,num=NUMBER(this);num=IS_FINITE(num)&&typeof fct=="function"&&MATH_FLOOR(num)||i;target=target||(typeof target=="undefined"||typeof target=="object"?null:target);while(++i<num)fct.call(target,i,num,fct)}}(Num,sh.isFinite,sh.Math.floor);Num.times=function(times){return function(num,fct,target){times.call(num,fct,target)}}(NumProto.times);StrProto.times=function(times){return function(fct,target){times.apply(this,arguments)}}(NumProto.times);BoolProto.ifTrue=function(fct,target){var isTrue=this.valueOf();if(isTrue&&typeof fct=="function")fct.call(target||(typeof target=="undefined"||typeof target=="object"?null:target));return isTrue};BoolProto.ifFalse=function(fct,target){var isTrue=this.valueOf();if(!isTrue&&typeof fct=="function")fct.call(target||(typeof target=="undefined"||typeof target=="object"?null:target));return isTrue};FctProto.whileTrue=function(make){return function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if(typeof fctStatement=="function"&&typeof fctCondition=="function")while(fctCondition.apply(null,arr))arr=fctStatement.apply(null,arr)||[];return null}}(makeArray);FctProto.whileFalse=function(make){return function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if(typeof fctStatement=="function"&&typeof fctCondition=="function")while(!fctCondition.apply(null,arr))arr=fctStatement.apply(null,arr)||[];return null}}(makeArray);makeArray=NumberIterator=getNumber=each=StrProto=NumProto=Num=BoolProto=FctProto=Arr=sh=null;delete makeArray;delete NumberIterator;delete getNumber;delete each;delete StrProto;delete NumProto;delete Num;delete BoolProto;delete FctProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- Simple          - 2.106 byte :
(function(){var g=this,l=g.Array,m=g.Function.prototype,n=this.Boolean.prototype,i=g.Number,j=i.prototype,o=g.String.prototype,p=typeof l.make=="function"&&l.make||function(b){return function(a){return b.call(a)}}(l.prototype.slice),q=function(b){return function(a,c,d,e){if(typeof d=="function"){e=e||(typeof e=="undefined"||typeof e=="object"?null:e);var h=-1,f,k;if(a<=c){f=a-1;for(k=c-f;++h<k;)d.call(e,h,k,d,++f,a,c)}else{f=a+1;for(k=b(c-f);++h<k;)d.call(e,h,k,d,--f,a,c)}}}}(g.Math.abs),r=function(b,a,c){return function(d){d=b(d);return d=a(d)?c(d):-1}}(i,g.isFinite,g.Math.floor),s=function(b,a,c){return function(d,e){initialValue=c.call(d).valueOf();d=a(d);e=a(e);this.valueOf=function(){return initialValue};this.toString=function(){return""+initialValue};this.each=function(h,f){b(d,e,h,f);return initialValue}}}(q,r,g.Object.prototype.valueOf);j.to=o.to=function(b){return function(a){return new b(this,a)}}(s);j.times=function(b,a,c){return function(d,e){var h=-1,f=b(this);f=a(f)&&typeof d=="function"&&c(f)||h;for(e=e||(typeof e=="undefined"||typeof e=="object"?null:e);++h<f;)d.call(e,h,f,d)}}(i,g.isFinite,g.Math.floor);i.times=function(b){return function(a,c,d){b.call(a,c,d)}}(j.times);o.times=function(b){return function(){b.apply(this,arguments)}}(j.times);n.ifTrue=function(b,a){var c=this.valueOf();if(c&&typeof b=="function")b.call(a||(typeof a=="undefined"||typeof a=="object"?null:a));return c};n.ifFalse=function(b,a){var c=this.valueOf();if(!c&&typeof b=="function")b.call(a||(typeof a=="undefined"||typeof a=="object"?null:a));return c};m.whileTrue=function(b){return function(){var a=b(arguments),c=a.shift(0);if(typeof c=="function"&&typeof this=="function")for(;this.apply(null,a);)a=c.apply(null,a)||[];return null}}(p);m.whileFalse=function(b){return function(){var a=b(arguments),c=a.shift(0);if(typeof c=="function"&&typeof this=="function")for(;!this.apply(null,a);)a=c.apply(null,a)||[];return null}}(p);p=s=r=q=o=j=i=n=m=l=g=null;delete p;delete s;delete r;delete q;delete o;delete j;delete i;delete n;delete m;delete l;delete g;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 3.358 byte :
(function(){var sh=this,Arr=sh.Array,FctProto=sh.Function.prototype,BoolProto=this.Boolean.prototype,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype,makeArray=(((typeof Arr.make=="function")&&Arr.make)||(function(slice){return(function(list){return slice.call(list)})})(Arr.prototype.slice)),each=(function(MATH_ABS){return(function(from,to,fct,target){if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var idx=-1,count,len;if(from<=to){count=(from-1);len=(to-count);while(++idx<len){fct.call(target,idx,len,fct,++count,from,to)}}else{count=(from+1);len=MATH_ABS(to-count);while(++idx<len){fct.call(target,idx,len,fct,--count,from,to)}}}})})(sh.Math.abs),getNumber=(function(NUMBER,IS_FINITE,MATH_FLOOR){return(function(num){num=NUMBER(num);if(IS_FINITE(num)){num=MATH_FLOOR(num)}else{num=-1}return num})})(Num,sh.isFinite,sh.Math.floor),NumberIterator=(function(EACH,GET_NUMBER,VALUE_OF){return(function(startValue,endValue){initialValue=VALUE_OF.call(startValue).valueOf();startValue=GET_NUMBER(startValue);endValue=GET_NUMBER(endValue);this.valueOf=(function(){return initialValue});this.toString=(function(){return(""+initialValue)});this.each=(function(fct,target){EACH(startValue,endValue,fct,target);return initialValue})})})(each,getNumber,sh.Object.prototype.valueOf);NumProto.to=StrProto.to=(function(NUMBER_ITERATOR){return(function(num){return(new NUMBER_ITERATOR(this,num))})})(NumberIterator);NumProto.times=(function(NUMBER,IS_FINITE,MATH_FLOOR){return(function(fct,target){var i=-1,num=NUMBER(this);num=((IS_FINITE(num)&&(typeof fct=="function")&&MATH_FLOOR(num))||i);target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));while(++i<num){fct.call(target,i,num,fct)}})})(Num,sh.isFinite,sh.Math.floor);Num.times=(function(times){return(function(num,fct,target){times.call(num,fct,target)})})(NumProto.times);StrProto.times=(function(times){return(function(fct,target){times.apply(this,arguments)})})(NumProto.times);BoolProto.ifTrue=(function(fct,target){var isTrue=this.valueOf();if(isTrue&&(typeof fct=="function")){fct.call(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target))}return isTrue});BoolProto.ifFalse=(function(fct,target){var isTrue=this.valueOf();if(!isTrue&&(typeof fct=="function")){fct.call(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target))}return isTrue});FctProto.whileTrue=(function(make){return(function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(fctCondition.apply(null,arr)){arr=(fctStatement.apply(null,arr)||[])}}return null})})(makeArray);FctProto.whileFalse=(function(make){return(function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(!fctCondition.apply(null,arr)){arr=(fctStatement.apply(null,arr)||[])}}return null})})(makeArray);makeArray=NumberIterator=getNumber=each=StrProto=NumProto=Num=BoolProto=FctProto=Arr=sh=null;delete makeArray;delete NumberIterator;delete getNumber;delete each;delete StrProto;delete NumProto;delete Num;delete BoolProto;delete FctProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 2.753 byte :
(function(){var h=this,Arr=h.Array,FctProto=h.Function.prototype,BoolProto=this.Boolean.prototype,Num=h.Number,NumProto=Num.prototype,StrProto=h.String.prototype,makeArray=(((typeof Arr.make=="function")&&Arr.make)||(function(b){return(function(a){return b.call(a)})})(Arr.prototype.slice)),each=(function(f){return(function(a,b,c,d){if(typeof c=="function"){d=(d||(((typeof d=="undefined")||(typeof d=="object"))?null:d));var e=-1,count,len;if(a<=b){count=(a-1);len=(b-count);while(++e<len){c.call(d,e,len,c,++count,a,b)}}else{count=(a+1);len=f(b-count);while(++e<len){c.call(d,e,len,c,--count,a,b)}}}})})(h.Math.abs),getNumber=(function(b,c,d){return(function(a){a=b(a);if(c(a)){a=d(a)}else{a=-1}return a})})(Num,h.isFinite,h.Math.floor),NumberIterator=(function(e,f,g){return(function(c,d){initialValue=g.call(c).valueOf();c=f(c);d=f(d);this.valueOf=(function(){return initialValue});this.toString=(function(){return(""+initialValue)});this.each=(function(a,b){e(c,d,a,b);return initialValue})})})(each,getNumber,h.Object.prototype.valueOf);NumProto.to=StrProto.to=(function(b){return(function(a){return(new b(this,a))})})(NumberIterator);NumProto.times=(function(c,d,e){return(function(a,b){var i=-1,num=c(this);num=((d(num)&&(typeof a=="function")&&e(num))||i);b=(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b));while(++i<num){a.call(b,i,num,a)}})})(Num,h.isFinite,h.Math.floor);Num.times=(function(d){return(function(a,b,c){d.call(a,b,c)})})(NumProto.times);StrProto.times=(function(c){return(function(a,b){c.apply(this,arguments)})})(NumProto.times);BoolProto.ifTrue=(function(a,b){var c=this.valueOf();if(c&&(typeof a=="function")){a.call(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b))}return c});BoolProto.ifFalse=(function(a,b){var c=this.valueOf();if(!c&&(typeof a=="function")){a.call(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b))}return c});FctProto.whileTrue=(function(b){return(function(){var a=b(arguments),fctStatement=a.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})(makeArray);FctProto.whileFalse=(function(b){return(function(){var a=b(arguments),fctStatement=a.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(!fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})(makeArray);makeArray=NumberIterator=getNumber=each=StrProto=NumProto=Num=BoolProto=FctProto=Arr=h=null;delete makeArray;delete NumberIterator;delete getNumber;delete each;delete StrProto;delete NumProto;delete Num;delete BoolProto;delete FctProto;delete Arr;delete h;delete arguments.callee}).call(null);

- packed / shrinked           - 2.005 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(){k h=7,r=h.13,t=h.11.p,x=7.Z.p,l=h.W,n=l.p,y=h.S.p,B=(((4 r.K=="2")&&r.K)||(2(b){3(2(a){3 b.8(a)})})(r.p.Q)),A=(2(f){3(2(a,b,c,d){j(4 c=="2"){d=(d||(((4 d=="D")||(4 d=="E"))?6:d));k e=-1,9,m;j(a<=b){9=(a-1);m=(b-9);w(++e<m){c.8(d,e,m,c,++9,a,b)}}N{9=(a+1);m=f(b-9);w(++e<m){c.8(d,e,m,c,--9,a,b)}}}})})(h.I.12),G=(2(b,c,d){3(2(a){a=b(a);j(c(a)){a=d(a)}N{a=-1}3 a})})(l,h.J,h.I.L),H=(2(e,f,g){3(2(c,d){F=g.8(c).v();c=f(c);d=f(d);7.v=(2(){3 F});7.P=(2(){3(""+F)});7.A=(2(a,b){e(c,d,a,b);3 F})})})(A,G,h.R.p.v);n.O=y.O=(2(b){3(2(a){3(Y b(7,a))})})(H);n.u=(2(c,d,e){3(2(a,b){k i=-1,s=c(7);s=((d(s)&&(4 a=="2")&&e(s))||i);b=(b||(((4 b=="D")||(4 b=="E"))?6:b));w(++i<s){a.8(b,i,s,a)}})})(l,h.J,h.I.L);l.u=(2(d){3(2(a,b,c){d.8(a,b,c)})})(n.u);y.u=(2(c){3(2(a,b){c.z(7,C)})})(n.u);x.T=(2(a,b){k c=7.v();j(c&&(4 a=="2")){a.8(b||(((4 b=="D")||(4 b=="E"))?6:b))}3 c});x.U=(2(a,b){k c=7.v();j(!c&&(4 a=="2")){a.8(b||(((4 b=="D")||(4 b=="E"))?6:b))}3 c});t.V=(2(b){3(2(){k a=b(C),o=a.M(0),q=7;j((4 o=="2")&&(4 q=="2")){w(q.z(6,a)){a=(o.z(6,a)||[])}}3 6})})(B);t.10=(2(b){3(2(){k a=b(C),o=a.M(0),q=7;j((4 o=="2")&&(4 q=="2")){w(!q.z(6,a)){a=(o.z(6,a)||[])}}3 6})})(B);B=H=G=A=y=n=l=x=t=r=h=6;5 B;5 H;5 G;5 A;5 y;5 n;5 l;5 x;5 t;5 r;5 h;5 C.X}).8(6);',62,66,'||function|return|typeof|delete|null|this|call|count||||||||||if|var|Num|len|NumProto|fctStatement|prototype|fctCondition|Arr|num|FctProto|times|valueOf|while|BoolProto|StrProto|apply|each|makeArray|arguments|undefined|object|initialValue|getNumber|NumberIterator|Math|isFinite|make|floor|shift|else|to|toString|slice|Object|String|ifTrue|ifFalse|whileTrue|Number|callee|new|Boolean|whileFalse|Function|abs|Array'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 1.757 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(){9 g=5,l=g.V,m=g.R.t,n=5.J.t,i=g.S,j=i.t,o=g.Y.t,p=4 l.H=="2"&&l.H||2(b){3 2(a){3 b.8(a)}}(l.t.P),q=2(b){3 2(a,c,d,e){u(4 d=="2"){e=e||(4 e=="B"||4 e=="z"?6:e);9 h=-1,f,k;u(a<=c){f=a-1;y(k=c-f;++h<k;)d.8(e,h,k,d,++f,a,c)}N{f=a+1;y(k=b(c-f);++h<k;)d.8(e,h,k,d,--f,a,c)}}}}(g.D.Q),r=2(b,a,c){3 2(d){d=b(d);3 d=a(d)?c(d):-1}}(i,g.I,g.D.E),s=2(b,a,c){3 2(d,e){A=c.8(d).w();d=a(d);e=a(e);5.w=2(){3 A};5.K=2(){3""+A};5.L=2(h,f){b(d,e,h,f);3 A}}}(q,r,g.M.t.w);j.F=o.F=2(b){3 2(a){3 O b(5,a)}}(s);j.x=2(b,a,c){3 2(d,e){9 h=-1,f=b(5);f=a(f)&&4 d=="2"&&c(f)||h;y(e=e||(4 e=="B"||4 e=="z"?6:e);++h<f;)d.8(e,h,f,d)}}(i,g.I,g.D.E);i.x=2(b){3 2(a,c,d){b.8(a,c,d)}}(j.x);o.x=2(b){3 2(){b.v(5,C)}}(j.x);n.W=2(b,a){9 c=5.w();u(c&&4 b=="2")b.8(a||(4 a=="B"||4 a=="z"?6:a));3 c};n.T=2(b,a){9 c=5.w();u(!c&&4 b=="2")b.8(a||(4 a=="B"||4 a=="z"?6:a));3 c};m.U=2(b){3 2(){9 a=b(C),c=a.G(0);u(4 c=="2"&&4 5=="2")y(;5.v(6,a);)a=c.v(6,a)||[];3 6}}(p);m.X=2(b){3 2(){9 a=b(C),c=a.G(0);u(4 c=="2"&&4 5=="2")y(;!5.v(6,a);)a=c.v(6,a)||[];3 6}}(p);p=s=r=q=o=j=i=n=m=l=g=6;7 p;7 s;7 r;7 q;7 o;7 j;7 i;7 n;7 m;7 l;7 g;7 C.Z}).8(6);',62,62,'||function|return|typeof|this|null|delete|call|var||||||||||||||||||||prototype|if|apply|valueOf|times|for|object|initialValue|undefined|arguments|Math|floor|to|shift|make|isFinite|Boolean|toString|each|Object|else|new|slice|abs|Function|Number|ifFalse|whileTrue|Array|ifTrue|whileFalse|String|callee'.split('|'),0,{}));


*/
