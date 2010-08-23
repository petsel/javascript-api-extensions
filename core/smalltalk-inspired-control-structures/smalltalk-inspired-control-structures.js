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
  delete makeArray; delete NumberIterator; delete getNumber, delete each; delete StrProto; delete NumProto; delete Num; delete BoolProto; delete FctProto; delete Arr; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 3.238 byte :
(function(){var sh=this,Arr=sh.Array,FctProto=sh.Function.prototype,BoolProto=this.Boolean.prototype,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype,makeArray=typeof Arr.make=="function"&&Arr.make||function(slice){return function(list){return slice.call(list)}}(Arr.prototype.slice),each=function(MATH_ABS){return function(from,to,fct,target){if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var idx=-1,count,len;if(from<=to){count=from-1;len=to-count;while(++idx<len)fct.call(target,idx,len,fct,++count,from,to)}else{count=from+1;len=MATH_ABS(to-count);while(++idx<len)fct.call(target,idx,len,fct,--count,from,to)}}}}(sh.Math.abs),getNumber=function(NUMBER,IS_FINITE,MATH_FLOOR){return function(num){num=NUMBER(num);if(IS_FINITE(num))num=MATH_FLOOR(num);else num=-1;return num}}(Num,sh.isFinite,sh.Math.floor),NumberIterator=function(EACH,GET_NUMBER,VALUE_OF){return function(startValue,endValue){initialValue=VALUE_OF.call(startValue).valueOf();startValue=GET_NUMBER(startValue);endValue=GET_NUMBER(endValue);this.valueOf=function(){return initialValue};this.toString=function(){return""+initialValue};this.each=function(fct,target){EACH(startValue,endValue,fct,target);return initialValue}}}(each,getNumber,sh.Object.prototype.valueOf);NumProto.to=StrProto.to=function(NUMBER_ITERATOR){return function(num){return new NUMBER_ITERATOR(this,num)}}(NumberIterator);NumProto.times=function(NUMBER,IS_FINITE,MATH_FLOOR){return function(fct,target){var i=-1,num=NUMBER(this);num=IS_FINITE(num)&&typeof fct=="function"&&MATH_FLOOR(num)||i;target=target||(typeof target=="undefined"||typeof target=="object"?null:target);while(++i<num)fct.call(target,i,num,fct)}}(Num,sh.isFinite,sh.Math.floor);Num.times=function(times){return function(num,fct,target){times.call(num,fct,target)}}(NumProto.times);StrProto.times=function(times){return function(fct,target){times.apply(this,arguments)}}(NumProto.times);BoolProto.ifTrue=function(fct,target){var isTrue=this.valueOf();if(isTrue&&typeof fct=="function")fct.call(target||(typeof target=="undefined"||typeof target=="object"?null:target));return isTrue};BoolProto.ifFalse=function(fct,target){var isTrue=this.valueOf();if(!isTrue&&typeof fct=="function")fct.call(target||(typeof target=="undefined"||typeof target=="object"?null:target));return isTrue};FctProto.whileTrue=function(make){return function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if(typeof fctStatement=="function"&&typeof fctCondition=="function")while(fctCondition.apply(null,arr))arr=fctStatement.apply(null,arr)||[];return null}}(makeArray);FctProto.whileFalse=function(make){return function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if(typeof fctStatement=="function"&&typeof fctCondition=="function")while(!fctCondition.apply(null,arr))arr=fctStatement.apply(null,arr)||[];return null}}(makeArray);makeArray=NumberIterator=getNumber=each=StrProto=NumProto=Num=BoolProto=FctProto=Arr=sh=null;delete makeArray;delete NumberIterator;delete getNumber,delete each;delete StrProto;delete NumProto;delete Num;delete BoolProto;delete FctProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- Simple          - 2.106 byte :
(function(){var g=this,l=g.Array,m=g.Function.prototype,n=this.Boolean.prototype,i=g.Number,j=i.prototype,o=g.String.prototype,p=typeof l.make=="function"&&l.make||function(b){return function(a){return b.call(a)}}(l.prototype.slice),q=function(b){return function(a,c,d,e){if(typeof d=="function"){e=e||(typeof e=="undefined"||typeof e=="object"?null:e);var h=-1,f,k;if(a<=c){f=a-1;for(k=c-f;++h<k;)d.call(e,h,k,d,++f,a,c)}else{f=a+1;for(k=b(c-f);++h<k;)d.call(e,h,k,d,--f,a,c)}}}}(g.Math.abs),r=function(b,a,c){return function(d){d=b(d);return d=a(d)?c(d):-1}}(i,g.isFinite,g.Math.floor),s=function(b,a,c){return function(d,e){initialValue=c.call(d).valueOf();d=a(d);e=a(e);this.valueOf=function(){return initialValue};this.toString=function(){return""+initialValue};this.each=function(h,f){b(d,e,h,f);return initialValue}}}(q,r,g.Object.prototype.valueOf);j.to=o.to=function(b){return function(a){return new b(this,a)}}(s);j.times=function(b,a,c){return function(d,e){var h=-1,f=b(this);f=a(f)&&typeof d=="function"&&c(f)||h;for(e=e||(typeof e=="undefined"||typeof e=="object"?null:e);++h<f;)d.call(e,h,f,d)}}(i,g.isFinite,g.Math.floor);i.times=function(b){return function(a,c,d){b.call(a,c,d)}}(j.times);o.times=function(b){return function(){b.apply(this,arguments)}}(j.times);n.ifTrue=function(b,a){var c=this.valueOf();if(c&&typeof b=="function")b.call(a||(typeof a=="undefined"||typeof a=="object"?null:a));return c};n.ifFalse=function(b,a){var c=this.valueOf();if(!c&&typeof b=="function")b.call(a||(typeof a=="undefined"||typeof a=="object"?null:a));return c};m.whileTrue=function(b){return function(){var a=b(arguments),c=a.shift(0);if(typeof c=="function"&&typeof this=="function")for(;this.apply(null,a);)a=c.apply(null,a)||[];return null}}(p);m.whileFalse=function(b){return function(){var a=b(arguments),c=a.shift(0);if(typeof c=="function"&&typeof this=="function")for(;!this.apply(null,a);)a=c.apply(null,a)||[];return null}}(p);p=s=r=q=o=j=i=n=m=l=g=null;delete p;delete s;delete r;delete q;delete o;delete j;delete i;delete n;delete m;delete l;delete g;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 3.358 byte :
(function(){var sh=this,Arr=sh.Array,FctProto=sh.Function.prototype,BoolProto=this.Boolean.prototype,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype,makeArray=(((typeof Arr.make=="function")&&Arr.make)||(function(slice){return(function(list){return slice.call(list)})})(Arr.prototype.slice)),each=(function(MATH_ABS){return(function(from,to,fct,target){if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var idx=-1,count,len;if(from<=to){count=(from-1);len=(to-count);while(++idx<len){fct.call(target,idx,len,fct,++count,from,to)}}else{count=(from+1);len=MATH_ABS(to-count);while(++idx<len){fct.call(target,idx,len,fct,--count,from,to)}}}})})(sh.Math.abs),getNumber=(function(NUMBER,IS_FINITE,MATH_FLOOR){return(function(num){num=NUMBER(num);if(IS_FINITE(num)){num=MATH_FLOOR(num)}else{num=-1}return num})})(Num,sh.isFinite,sh.Math.floor),NumberIterator=(function(EACH,GET_NUMBER,VALUE_OF){return(function(startValue,endValue){initialValue=VALUE_OF.call(startValue).valueOf();startValue=GET_NUMBER(startValue);endValue=GET_NUMBER(endValue);this.valueOf=(function(){return initialValue});this.toString=(function(){return(""+initialValue)});this.each=(function(fct,target){EACH(startValue,endValue,fct,target);return initialValue})})})(each,getNumber,sh.Object.prototype.valueOf);NumProto.to=StrProto.to=(function(NUMBER_ITERATOR){return(function(num){return(new NUMBER_ITERATOR(this,num))})})(NumberIterator);NumProto.times=(function(NUMBER,IS_FINITE,MATH_FLOOR){return(function(fct,target){var i=-1,num=NUMBER(this);num=((IS_FINITE(num)&&(typeof fct=="function")&&MATH_FLOOR(num))||i);target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));while(++i<num){fct.call(target,i,num,fct)}})})(Num,sh.isFinite,sh.Math.floor);Num.times=(function(times){return(function(num,fct,target){times.call(num,fct,target)})})(NumProto.times);StrProto.times=(function(times){return(function(fct,target){times.apply(this,arguments)})})(NumProto.times);BoolProto.ifTrue=(function(fct,target){var isTrue=this.valueOf();if(isTrue&&(typeof fct=="function")){fct.call(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target))}return isTrue});BoolProto.ifFalse=(function(fct,target){var isTrue=this.valueOf();if(!isTrue&&(typeof fct=="function")){fct.call(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target))}return isTrue});FctProto.whileTrue=(function(make){return(function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(fctCondition.apply(null,arr)){arr=(fctStatement.apply(null,arr)||[])}}return null})})(makeArray);FctProto.whileFalse=(function(make){return(function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(!fctCondition.apply(null,arr)){arr=(fctStatement.apply(null,arr)||[])}}return null})})(makeArray);makeArray=NumberIterator=getNumber=each=StrProto=NumProto=Num=BoolProto=FctProto=Arr=sh=null;delete makeArray;delete NumberIterator;delete getNumber,delete each;delete StrProto;delete NumProto;delete Num;delete BoolProto;delete FctProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 2.753 byte :
(function(){var h=this,Arr=h.Array,FctProto=h.Function.prototype,BoolProto=this.Boolean.prototype,Num=h.Number,NumProto=Num.prototype,StrProto=h.String.prototype,makeArray=(((typeof Arr.make=="function")&&Arr.make)||(function(b){return(function(a){return b.call(a)})})(Arr.prototype.slice)),each=(function(f){return(function(a,b,c,d){if(typeof c=="function"){d=(d||(((typeof d=="undefined")||(typeof d=="object"))?null:d));var e=-1,count,len;if(a<=b){count=(a-1);len=(b-count);while(++e<len){c.call(d,e,len,c,++count,a,b)}}else{count=(a+1);len=f(b-count);while(++e<len){c.call(d,e,len,c,--count,a,b)}}}})})(h.Math.abs),getNumber=(function(b,c,d){return(function(a){a=b(a);if(c(a)){a=d(a)}else{a=-1}return a})})(Num,h.isFinite,h.Math.floor),NumberIterator=(function(e,f,g){return(function(c,d){initialValue=g.call(c).valueOf();c=f(c);d=f(d);this.valueOf=(function(){return initialValue});this.toString=(function(){return(""+initialValue)});this.each=(function(a,b){e(c,d,a,b);return initialValue})})})(each,getNumber,h.Object.prototype.valueOf);NumProto.to=StrProto.to=(function(b){return(function(a){return(new b(this,a))})})(NumberIterator);NumProto.times=(function(c,d,e){return(function(a,b){var i=-1,num=c(this);num=((d(num)&&(typeof a=="function")&&e(num))||i);b=(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b));while(++i<num){a.call(b,i,num,a)}})})(Num,h.isFinite,h.Math.floor);Num.times=(function(d){return(function(a,b,c){d.call(a,b,c)})})(NumProto.times);StrProto.times=(function(c){return(function(a,b){c.apply(this,arguments)})})(NumProto.times);BoolProto.ifTrue=(function(a,b){var c=this.valueOf();if(c&&(typeof a=="function")){a.call(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b))}return c});BoolProto.ifFalse=(function(a,b){var c=this.valueOf();if(!c&&(typeof a=="function")){a.call(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b))}return c});FctProto.whileTrue=(function(b){return(function(){var a=b(arguments),fctStatement=a.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})(makeArray);FctProto.whileFalse=(function(b){return(function(){var a=b(arguments),fctStatement=a.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(!fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})(makeArray);makeArray=NumberIterator=getNumber=each=StrProto=NumProto=Num=BoolProto=FctProto=Arr=h=null;delete makeArray;delete NumberIterator;delete getNumber,delete each;delete StrProto;delete NumProto;delete Num;delete BoolProto;delete FctProto;delete Arr;delete h;delete arguments.callee}).call(null);

- packed / shrinked           - 2.005 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(){n h=7,s=h.U,t=h.S.p,z=7.Z.p,m=h.T,9=m.p,A=h.W.p,x=(((4 s.M=="2")&&s.M)||(2(b){3(2(a){3 b.8(a)})})(s.p.V)),B=(2(f){3(2(a,b,c,d){j(4 c=="2"){d=(d||(((4 d=="D")||(4 d=="F"))?6:d));n e=-1,l,k;j(a<=b){l=(a-1);k=(b-l);y(++e<k){c.8(d,e,k,c,++l,a,b)}}O{l=(a+1);k=f(b-l);y(++e<k){c.8(d,e,k,c,--l,a,b)}}}})})(h.I.10),C=(2(b,c,d){3(2(a){a=b(a);j(c(a)){a=d(a)}O{a=-1}3 a})})(m,h.L,h.I.N),G=(2(e,f,g){3(2(c,d){E=g.8(c).v();c=f(c);d=f(d);7.v=(2(){3 E});7.12=(2(){3(""+E)});7.B=(2(a,b){e(c,d,a,b);3 E})})})(B,C,h.P.p.v);9.K=A.K=(2(b){3(2(a){3(13 b(7,a))})})(G);9.u=(2(c,d,e){3(2(a,b){n i=-1,r=c(7);r=((d(r)&&(4 a=="2")&&e(r))||i);b=(b||(((4 b=="D")||(4 b=="F"))?6:b));y(++i<r){a.8(b,i,r,a)}})})(m,h.L,h.I.N);m.u=(2(d){3(2(a,b,c){d.8(a,b,c)})})(9.u);A.u=(2(c){3(2(a,b){c.w(7,H)})})(9.u);z.Q=(2(a,b){n c=7.v();j(c&&(4 a=="2")){a.8(b||(((4 b=="D")||(4 b=="F"))?6:b))}3 c});z.11=(2(a,b){n c=7.v();j(!c&&(4 a=="2")){a.8(b||(((4 b=="D")||(4 b=="F"))?6:b))}3 c});t.R=(2(b){3(2(){n a=b(H),q=a.J(0),o=7;j((4 q=="2")&&(4 o=="2")){y(o.w(6,a)){a=(q.w(6,a)||[])}}3 6})})(x);t.Y=(2(b){3(2(){n a=b(H),q=a.J(0),o=7;j((4 q=="2")&&(4 o=="2")){y(!o.w(6,a)){a=(q.w(6,a)||[])}}3 6})})(x);x=G=C=B=A=9=m=z=t=s=h=6;5 x;5 G;5 C,5 B;5 A;5 9;5 m;5 z;5 t;5 s;5 h;5 H.X}).8(6);',62,66,'||function|return|typeof|delete|null|this|call|NumProto||||||||||if|len|count|Num|var|fctCondition|prototype|fctStatement|num|Arr|FctProto|times|valueOf|apply|makeArray|while|BoolProto|StrProto|each|getNumber|undefined|initialValue|object|NumberIterator|arguments|Math|shift|to|isFinite|make|floor|else|Object|ifTrue|whileTrue|Function|Number|Array|slice|String|callee|whileFalse|Boolean|abs|ifFalse|toString|new'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 1.757 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(){9 g=5,l=g.V,m=g.R.u,n=5.J.u,i=g.U,j=i.u,o=g.Y.u,p=4 l.F=="2"&&l.F||2(b){3 2(a){3 b.8(a)}}(l.u.P),q=2(b){3 2(a,c,d,e){t(4 d=="2"){e=e||(4 e=="C"||4 e=="A"?6:e);9 h=-1,f,k;t(a<=c){f=a-1;x(k=c-f;++h<k;)d.8(e,h,k,d,++f,a,c)}N{f=a+1;x(k=b(c-f);++h<k;)d.8(e,h,k,d,--f,a,c)}}}}(g.D.Q),r=2(b,a,c){3 2(d){d=b(d);3 d=a(d)?c(d):-1}}(i,g.I,g.D.E),s=2(b,a,c){3 2(d,e){z=c.8(d).y();d=a(d);e=a(e);5.y=2(){3 z};5.K=2(){3""+z};5.L=2(h,f){b(d,e,h,f);3 z}}}(q,r,g.M.u.y);j.H=o.H=2(b){3 2(a){3 O b(5,a)}}(s);j.w=2(b,a,c){3 2(d,e){9 h=-1,f=b(5);f=a(f)&&4 d=="2"&&c(f)||h;x(e=e||(4 e=="C"||4 e=="A"?6:e);++h<f;)d.8(e,h,f,d)}}(i,g.I,g.D.E);i.w=2(b){3 2(a,c,d){b.8(a,c,d)}}(j.w);o.w=2(b){3 2(){b.v(5,B)}}(j.w);n.S=2(b,a){9 c=5.y();t(c&&4 b=="2")b.8(a||(4 a=="C"||4 a=="A"?6:a));3 c};n.T=2(b,a){9 c=5.y();t(!c&&4 b=="2")b.8(a||(4 a=="C"||4 a=="A"?6:a));3 c};m.W=2(b){3 2(){9 a=b(B),c=a.G(0);t(4 c=="2"&&4 5=="2")x(;5.v(6,a);)a=c.v(6,a)||[];3 6}}(p);m.X=2(b){3 2(){9 a=b(B),c=a.G(0);t(4 c=="2"&&4 5=="2")x(;!5.v(6,a);)a=c.v(6,a)||[];3 6}}(p);p=s=r=q=o=j=i=n=m=l=g=6;7 p;7 s;7 r;7 q;7 o;7 j;7 i;7 n;7 m;7 l;7 g;7 B.Z}).8(6);',62,62,'||function|return|typeof|this|null|delete|call|var||||||||||||||||||||if|prototype|apply|times|for|valueOf|initialValue|object|arguments|undefined|Math|floor|make|shift|to|isFinite|Boolean|toString|each|Object|else|new|slice|abs|Function|ifTrue|ifFalse|Number|Array|whileTrue|whileFalse|String|callee'.split('|'),0,{}));


*/
