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

  eachStep = (function (MATH_ABS, MATH_FLOOR) {
    return (function (from, to, step, fct, target) {

      if (typeof fct == "function") {
        target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));

        var idx = -1, count, len;
        if (from <= to) {

          count = (from - step);
          len = MATH_FLOOR((to - count) / step);

          while (++idx < len) {
          //arguments order of callback function sticks closely/strictly to that one of [Number.times] but appends the arguments array by "count", "from" and "to".
            fct.call(target, idx, len, fct, (count += step), from, to, step);
          }
        } else {

          count = (from + step);
          len = MATH_FLOOR(MATH_ABS(to - count) / step);

          while (++idx < len) {
          //arguments order of callback function sticks closely/strictly to that one of [Number.times] but appends the arguments array by "count", "from" and "to".
            fct.call(target, idx, len, fct, (count -= step), from, to, step);
          }
        }
      }
    });
  })(sh.Math.abs,  sh.Math.floor),

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


  NumberIterator = (function (EACH, EACH_STEP, GET_NUMBER, MATH_ABS, VALUE_OF) {
    return (function (startValue, endValue) {

    //in almost every case the initial value was a primitive "number" or "string" value.
      var stepValue = 1, initialValue = VALUE_OF.call(startValue).valueOf();

      startValue = GET_NUMBER(startValue);
      endValue = GET_NUMBER(endValue);

      this.valueOf = (function () {
        return initialValue;
      });
      this.toString = (function () {
        return ("" + initialValue);
      });

      this.step = (function (step) {

        stepValue = MATH_ABS(GET_NUMBER(step));
        return this;
      });

    //[each], [go], [does], [todo], [serve] or [serves] because [do] is an reserved word and already in use as part of the do-while iterator statement.
      this.each = (function (fct, target) {

        if (stepValue >= 2) {
          EACH_STEP(startValue, endValue, stepValue, fct, target);
        } else {
          EACH(startValue, endValue, fct, target);
        }
        return initialValue;
      });
    });
  })(each, eachStep, getNumber, sh.Math.abs, sh.Object.prototype.valueOf);


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


  makeArray = NumberIterator = getNumber = eachStep = each = StrProto = NumProto = Num = BoolProto = FctProto = Arr = sh = null;
  delete makeArray; delete NumberIterator; delete getNumber; delete eachStep; delete each; delete StrProto; delete NumProto; delete Num; delete BoolProto; delete FctProto; delete Arr; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 3.969 byte :
(function(){var sh=this,Arr=sh.Array,FctProto=sh.Function.prototype,BoolProto=this.Boolean.prototype,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype,makeArray=typeof Arr.make=="function"&&Arr.make||function(slice){return function(list){return slice.call(list)}}(Arr.prototype.slice),each=function(MATH_ABS){return function(from,to,fct,target){if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var idx=-1,count,len;if(from<=to){count=from-1;len=to-count;while(++idx<len)fct.call(target,idx,len,fct,++count,from,to)}else{count=from+1;len=MATH_ABS(to-count);while(++idx<len)fct.call(target,idx,len,fct,--count,from,to)}}}}(sh.Math.abs),eachStep=function(MATH_ABS,MATH_FLOOR){return function(from,to,step,fct,target){if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var idx=-1,count,len;if(from<=to){count=from-step;len=MATH_FLOOR((to-count)/step);while(++idx<len)fct.call(target,idx,len,fct,count+=step,from,to,step)}else{count=from+step;len=MATH_FLOOR(MATH_ABS(to-count)/step);while(++idx<len)fct.call(target,idx,len,fct,count-=step,from,to,step)}}}}(sh.Math.abs,sh.Math.floor),getNumber=function(NUMBER,IS_FINITE,MATH_FLOOR){return function(num){num=NUMBER(num);if(IS_FINITE(num))num=MATH_FLOOR(num);else num=-1;return num}}(Num,sh.isFinite,sh.Math.floor),NumberIterator=function(EACH,EACH_STEP,GET_NUMBER,MATH_ABS,VALUE_OF){return function(startValue,endValue){var stepValue=1,initialValue=VALUE_OF.call(startValue).valueOf();startValue=GET_NUMBER(startValue);endValue=GET_NUMBER(endValue);this.valueOf=function(){return initialValue};this.toString=function(){return""+initialValue};this.step=function(step){stepValue=MATH_ABS(GET_NUMBER(step));return this};this.each=function(fct,target){if(stepValue>=2)EACH_STEP(startValue,endValue,stepValue,fct,target);else EACH(startValue,endValue,fct,target);return initialValue}}}(each,eachStep,getNumber,sh.Math.abs,sh.Object.prototype.valueOf);NumProto.to=StrProto.to=function(NUMBER_ITERATOR){return function(num){return new NUMBER_ITERATOR(this,num)}}(NumberIterator);NumProto.times=function(NUMBER,IS_FINITE,MATH_FLOOR){return function(fct,target){var i=-1,num=NUMBER(this);num=IS_FINITE(num)&&typeof fct=="function"&&MATH_FLOOR(num)||i;target=target||(typeof target=="undefined"||typeof target=="object"?null:target);while(++i<num)fct.call(target,i,num,fct)}}(Num,sh.isFinite,sh.Math.floor);Num.times=function(times){return function(num,fct,target){times.call(num,fct,target)}}(NumProto.times);StrProto.times=function(times){return function(fct,target){times.apply(this,arguments)}}(NumProto.times);BoolProto.ifTrue=function(fct,target){var isTrue=this.valueOf();if(isTrue&&typeof fct=="function")fct.call(target||(typeof target=="undefined"||typeof target=="object"?null:target));return isTrue};BoolProto.ifFalse=function(fct,target){var isTrue=this.valueOf();if(!isTrue&&typeof fct=="function")fct.call(target||(typeof target=="undefined"||typeof target=="object"?null:target));return isTrue};FctProto.whileTrue=function(make){return function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if(typeof fctStatement=="function"&&typeof fctCondition=="function")while(fctCondition.apply(null,arr))arr=fctStatement.apply(null,arr)||[];return null}}(makeArray);FctProto.whileFalse=function(make){return function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if(typeof fctStatement=="function"&&typeof fctCondition=="function")while(!fctCondition.apply(null,arr))arr=fctStatement.apply(null,arr)||[];return null}}(makeArray);makeArray=NumberIterator=getNumber=eachStep=each=StrProto=NumProto=Num=BoolProto=FctProto=Arr=sh=null;delete makeArray;delete NumberIterator;delete getNumber;delete eachStep;delete each;delete StrProto;delete NumProto;delete Num;delete BoolProto;delete FctProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- Simple          - 2.456 byte :
(function(){var h=this,n=h.Array,o=h.Function.prototype,p=this.Boolean.prototype,l=h.Number,m=l.prototype,q=h.String.prototype,r=typeof n.make=="function"&&n.make||function(c){return function(a){return c.call(a)}}(n.prototype.slice),s=function(c){return function(a,b,d,e){if(typeof d=="function"){e=e||(typeof e=="undefined"||typeof e=="object"?null:e);var g=-1,f,i;if(a<=b){f=a-1;for(i=b-f;++g<i;)d.call(e,g,i,d,++f,a,b)}else{f=a+1;for(i=c(b-f);++g<i;)d.call(e,g,i,d,--f,a,b)}}}}(h.Math.abs),t=function(c,a){return function(b,d,e,g,f){if(typeof g=="function"){f=f||(typeof f=="undefined"||typeof f=="object"?null:f);var i=-1,k,j;if(b<=d){k=b-e;for(j=a((d-k)/e);++i<j;)g.call(f,i,j,g,k+=e,b,d,e)}else{k=b+e;for(j=a(c(d-k)/e);++i<j;)g.call(f,i,j,g,k-=e,b,d,e)}}}}(h.Math.abs,h.Math.floor),u=function(c,a,b){return function(d){d=c(d);return d=a(d)?b(d):-1}}(l,h.isFinite,h.Math.floor),v=function(c,a,b,d,e){return function(g,f){var i=1,k=e.call(g).valueOf();g=b(g);f=b(f);this.valueOf=function(){return k};this.toString=function(){return""+k};this.step=function(j){i=d(b(j));return this};this.each=function(j,w){i>=2?a(g,f,i,j,w):c(g,f,j,w);return k}}}(s,t,u,h.Math.abs,h.Object.prototype.valueOf);m.to=q.to=function(c){return function(a){return new c(this,a)}}(v);m.times=function(c,a,b){return function(d,e){var g=-1,f=c(this);f=a(f)&&typeof d=="function"&&b(f)||g;for(e=e||(typeof e=="undefined"||typeof e=="object"?null:e);++g<f;)d.call(e,g,f,d)}}(l,h.isFinite,h.Math.floor);l.times=function(c){return function(a,b,d){c.call(a,b,d)}}(m.times);q.times=function(c){return function(){c.apply(this,arguments)}}(m.times);p.ifTrue=function(c,a){var b=this.valueOf();if(b&&typeof c=="function")c.call(a||(typeof a=="undefined"||typeof a=="object"?null:a));return b};p.ifFalse=function(c,a){var b=this.valueOf();if(!b&&typeof c=="function")c.call(a||(typeof a=="undefined"||typeof a=="object"?null:a));return b};o.whileTrue=function(c){return function(){var a=c(arguments),b=a.shift(0);if(typeof b=="function"&&typeof this=="function")for(;this.apply(null,a);)a=b.apply(null,a)||[];return null}}(r);o.whileFalse=function(c){return function(){var a=c(arguments),b=a.shift(0);if(typeof b=="function"&&typeof this=="function")for(;!this.apply(null,a);)a=b.apply(null,a)||[];return null}}(r);r=v=u=t=s=q=m=l=p=o=n=h=null;delete r;delete v;delete u;delete t;delete s;delete q;delete m;delete l;delete p;delete o;delete n;delete h;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 4.115 byte :
(function(){var sh=this,Arr=sh.Array,FctProto=sh.Function.prototype,BoolProto=this.Boolean.prototype,Num=sh.Number,NumProto=Num.prototype,StrProto=sh.String.prototype,makeArray=(((typeof Arr.make=="function")&&Arr.make)||(function(slice){return(function(list){return slice.call(list)})})(Arr.prototype.slice)),each=(function(MATH_ABS){return(function(from,to,fct,target){if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var idx=-1,count,len;if(from<=to){count=(from-1);len=(to-count);while(++idx<len){fct.call(target,idx,len,fct,++count,from,to)}}else{count=(from+1);len=MATH_ABS(to-count);while(++idx<len){fct.call(target,idx,len,fct,--count,from,to)}}}})})(sh.Math.abs),eachStep=(function(MATH_ABS,MATH_FLOOR){return(function(from,to,step,fct,target){if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var idx=-1,count,len;if(from<=to){count=(from-step);len=MATH_FLOOR((to-count)/step);while(++idx<len){fct.call(target,idx,len,fct,(count+=step),from,to,step)}}else{count=(from+step);len=MATH_FLOOR(MATH_ABS(to-count)/step);while(++idx<len){fct.call(target,idx,len,fct,(count-=step),from,to,step)}}}})})(sh.Math.abs,sh.Math.floor),getNumber=(function(NUMBER,IS_FINITE,MATH_FLOOR){return(function(num){num=NUMBER(num);if(IS_FINITE(num)){num=MATH_FLOOR(num)}else{num=-1}return num})})(Num,sh.isFinite,sh.Math.floor),NumberIterator=(function(EACH,EACH_STEP,GET_NUMBER,MATH_ABS,VALUE_OF){return(function(startValue,endValue){var stepValue=1,initialValue=VALUE_OF.call(startValue).valueOf();startValue=GET_NUMBER(startValue);endValue=GET_NUMBER(endValue);this.valueOf=(function(){return initialValue});this.toString=(function(){return(""+initialValue)});this.step=(function(step){stepValue=MATH_ABS(GET_NUMBER(step));return this});this.each=(function(fct,target){if(stepValue>=2){EACH_STEP(startValue,endValue,stepValue,fct,target)}else{EACH(startValue,endValue,fct,target)}return initialValue})})})(each,eachStep,getNumber,sh.Math.abs,sh.Object.prototype.valueOf);NumProto.to=StrProto.to=(function(NUMBER_ITERATOR){return(function(num){return(new NUMBER_ITERATOR(this,num))})})(NumberIterator);NumProto.times=(function(NUMBER,IS_FINITE,MATH_FLOOR){return(function(fct,target){var i=-1,num=NUMBER(this);num=((IS_FINITE(num)&&(typeof fct=="function")&&MATH_FLOOR(num))||i);target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));while(++i<num){fct.call(target,i,num,fct)}})})(Num,sh.isFinite,sh.Math.floor);Num.times=(function(times){return(function(num,fct,target){times.call(num,fct,target)})})(NumProto.times);StrProto.times=(function(times){return(function(fct,target){times.apply(this,arguments)})})(NumProto.times);BoolProto.ifTrue=(function(fct,target){var isTrue=this.valueOf();if(isTrue&&(typeof fct=="function")){fct.call(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target))}return isTrue});BoolProto.ifFalse=(function(fct,target){var isTrue=this.valueOf();if(!isTrue&&(typeof fct=="function")){fct.call(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target))}return isTrue});FctProto.whileTrue=(function(make){return(function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(fctCondition.apply(null,arr)){arr=(fctStatement.apply(null,arr)||[])}}return null})})(makeArray);FctProto.whileFalse=(function(make){return(function(){var arr=make(arguments),fctStatement=arr.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(!fctCondition.apply(null,arr)){arr=(fctStatement.apply(null,arr)||[])}}return null})})(makeArray);makeArray=NumberIterator=getNumber=eachStep=each=StrProto=NumProto=Num=BoolProto=FctProto=Arr=sh=null;delete makeArray;delete NumberIterator;delete getNumber;delete eachStep;delete each;delete StrProto;delete NumProto;delete Num;delete BoolProto;delete FctProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 3.253 byte :
(function(){var k=this,Arr=k.Array,FctProto=k.Function.prototype,BoolProto=this.Boolean.prototype,Num=k.Number,NumProto=Num.prototype,StrProto=k.String.prototype,makeArray=(((typeof Arr.make=="function")&&Arr.make)||(function(b){return(function(a){return b.call(a)})})(Arr.prototype.slice)),each=(function(f){return(function(a,b,c,d){if(typeof c=="function"){d=(d||(((typeof d=="undefined")||(typeof d=="object"))?null:d));var e=-1,count,len;if(a<=b){count=(a-1);len=(b-count);while(++e<len){c.call(d,e,len,c,++count,a,b)}}else{count=(a+1);len=f(b-count);while(++e<len){c.call(d,e,len,c,--count,a,b)}}}})})(k.Math.abs),eachStep=(function(g,h){return(function(a,b,c,d,e){if(typeof d=="function"){e=(e||(((typeof e=="undefined")||(typeof e=="object"))?null:e));var f=-1,count,len;if(a<=b){count=(a-c);len=h((b-count)/c);while(++f<len){d.call(e,f,len,d,(count+=c),a,b,c)}}else{count=(a+c);len=h(g(b-count)/c);while(++f<len){d.call(e,f,len,d,(count-=c),a,b,c)}}}})})(k.Math.abs,k.Math.floor),getNumber=(function(b,c,d){return(function(a){a=b(a);if(c(a)){a=d(a)}else{a=-1}return a})})(Num,k.isFinite,k.Math.floor),NumberIterator=(function(f,g,h,i,j){return(function(c,d){var e=1,initialValue=j.call(c).valueOf();c=h(c);d=h(d);this.valueOf=(function(){return initialValue});this.toString=(function(){return(""+initialValue)});this.step=(function(a){e=i(h(a));return this});this.each=(function(a,b){if(e>=2){g(c,d,e,a,b)}else{f(c,d,a,b)}return initialValue})})})(each,eachStep,getNumber,k.Math.abs,k.Object.prototype.valueOf);NumProto.to=StrProto.to=(function(b){return(function(a){return(new b(this,a))})})(NumberIterator);NumProto.times=(function(c,d,e){return(function(a,b){var i=-1,num=c(this);num=((d(num)&&(typeof a=="function")&&e(num))||i);b=(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b));while(++i<num){a.call(b,i,num,a)}})})(Num,k.isFinite,k.Math.floor);Num.times=(function(d){return(function(a,b,c){d.call(a,b,c)})})(NumProto.times);StrProto.times=(function(c){return(function(a,b){c.apply(this,arguments)})})(NumProto.times);BoolProto.ifTrue=(function(a,b){var c=this.valueOf();if(c&&(typeof a=="function")){a.call(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b))}return c});BoolProto.ifFalse=(function(a,b){var c=this.valueOf();if(!c&&(typeof a=="function")){a.call(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b))}return c});FctProto.whileTrue=(function(b){return(function(){var a=b(arguments),fctStatement=a.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})(makeArray);FctProto.whileFalse=(function(b){return(function(){var a=b(arguments),fctStatement=a.shift(0),fctCondition=this;if((typeof fctStatement=="function")&&(typeof fctCondition=="function")){while(!fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})(makeArray);makeArray=NumberIterator=getNumber=eachStep=each=StrProto=NumProto=Num=BoolProto=FctProto=Arr=k=null;delete makeArray;delete NumberIterator;delete getNumber;delete eachStep;delete each;delete StrProto;delete NumProto;delete Num;delete BoolProto;delete FctProto;delete Arr;delete k;delete arguments.callee}).call(null);

- packed / shrinked           - 2.330 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(3(){o k=8,s=k.12,D=k.13.v,G=8.14.v,p=k.X,r=p.v,z=k.17.v,B=(((5 s.S=="3")&&s.S)||(3(b){4(3(a){4 b.m(a)})})(s.v.18)),C=(3(f){4(3(a,b,c,d){n(5 c=="3"){d=(d||(((5 d=="H")||(5 d=="y"))?9:d));o e=-1,7,6;n(a<=b){7=(a-1);6=(b-7);q(++e<6){c.m(d,e,6,c,++7,a,b)}}M{7=(a+1);6=f(b-7);q(++e<6){c.m(d,e,6,c,--7,a,b)}}}})})(k.w.O),N=(3(g,h){4(3(a,b,c,d,e){n(5 d=="3"){e=(e||(((5 e=="H")||(5 e=="y"))?9:e));o f=-1,7,6;n(a<=b){7=(a-c);6=h((b-7)/c);q(++f<6){d.m(e,f,6,d,(7+=c),a,b,c)}}M{7=(a+c);6=h(g(b-7)/c);q(++f<6){d.m(e,f,6,d,(7-=c),a,b,c)}}}})})(k.w.O,k.w.P),I=(3(b,c,d){4(3(a){a=b(a);n(c(a)){a=d(a)}M{a=-1}4 a})})(p,k.Q,k.w.P),J=(3(f,g,h,i,j){4(3(c,d){o e=1,K=j.m(c).A();c=h(c);d=h(d);8.A=(3(){4 K});8.11=(3(){4(""+K)});8.Y=(3(a){e=i(h(a));4 8});8.C=(3(a,b){n(e>=2){g(c,d,e,a,b)}M{f(c,d,a,b)}4 K})})})(C,N,I,k.w.O,k.V.v.A);r.T=z.T=(3(b){4(3(a){4(U b(8,a))})})(J);r.E=(3(c,d,e){4(3(a,b){o i=-1,u=c(8);u=((d(u)&&(5 a=="3")&&e(u))||i);b=(b||(((5 b=="H")||(5 b=="y"))?9:b));q(++i<u){a.m(b,i,u,a)}})})(p,k.Q,k.w.P);p.E=(3(d){4(3(a,b,c){d.m(a,b,c)})})(r.E);z.E=(3(c){4(3(a,b){c.F(8,L)})})(r.E);G.16=(3(a,b){o c=8.A();n(c&&(5 a=="3")){a.m(b||(((5 b=="H")||(5 b=="y"))?9:b))}4 c});G.W=(3(a,b){o c=8.A();n(!c&&(5 a=="3")){a.m(b||(((5 b=="H")||(5 b=="y"))?9:b))}4 c});D.15=(3(b){4(3(){o a=b(L),x=a.R(0),t=8;n((5 x=="3")&&(5 t=="3")){q(t.F(9,a)){a=(x.F(9,a)||[])}}4 9})})(B);D.Z=(3(b){4(3(){o a=b(L),x=a.R(0),t=8;n((5 x=="3")&&(5 t=="3")){q(!t.F(9,a)){a=(x.F(9,a)||[])}}4 9})})(B);B=J=I=N=C=z=r=p=G=D=s=k=9;l B;l J;l I;l N;l C;l z;l r;l p;l G;l D;l s;l k;l L.10}).m(9);',62,71,'|||function|return|typeof|len|count|this|null||||||||||||delete|call|if|var|Num|while|NumProto|Arr|fctCondition|num|prototype|Math|fctStatement|object|StrProto|valueOf|makeArray|each|FctProto|times|apply|BoolProto|undefined|getNumber|NumberIterator|initialValue|arguments|else|eachStep|abs|floor|isFinite|shift|make|to|new|Object|ifFalse|Number|step|whileFalse|callee|toString|Array|Function|Boolean|whileTrue|ifTrue|String|slice'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 2.034 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(3(){x h=6,n=h.10,o=h.V.A,p=6.S.A,l=h.W,m=l.A,q=h.Q.A,r=5 n.M=="3"&&n.M||3(c){4 3(a){4 c.9(a)}}(n.A.U),s=3(c){4 3(a,b,d,e){y(5 d=="3"){e=e||(5 e=="C"||5 e=="E"?7:e);x g=-1,f,i;y(a<=b){f=a-1;z(i=b-f;++g<i;)d.9(e,g,i,d,++f,a,b)}L{f=a+1;z(i=c(b-f);++g<i;)d.9(e,g,i,d,--f,a,b)}}}}(h.B.I),t=3(c,a){4 3(b,d,e,g,f){y(5 g=="3"){f=f||(5 f=="C"||5 f=="E"?7:f);x i=-1,k,j;y(b<=d){k=b-e;z(j=a((d-k)/e);++i<j;)g.9(f,i,j,g,k+=e,b,d,e)}L{k=b+e;z(j=a(c(d-k)/e);++i<j;)g.9(f,i,j,g,k-=e,b,d,e)}}}}(h.B.I,h.B.J),u=3(c,a,b){4 3(d){d=c(d);4 d=a(d)?b(d):-1}}(l,h.O,h.B.J),v=3(c,a,b,d,e){4 3(g,f){x i=1,k=e.9(g).G();g=b(g);f=b(f);6.G=3(){4 k};6.11=3(){4""+k};6.13=3(j){i=d(b(j));4 6};6.P=3(j,w){i>=2?a(g,f,i,j,w):c(g,f,j,w);4 k}}}(s,t,u,h.B.I,h.R.A.G);m.N=q.N=3(c){4 3(a){4 T c(6,a)}}(v);m.F=3(c,a,b){4 3(d,e){x g=-1,f=c(6);f=a(f)&&5 d=="3"&&b(f)||g;z(e=e||(5 e=="C"||5 e=="E"?7:e);++g<f;)d.9(e,g,f,d)}}(l,h.O,h.B.J);l.F=3(c){4 3(a,b,d){c.9(a,b,d)}}(m.F);q.F=3(c){4 3(){c.D(6,H)}}(m.F);p.X=3(c,a){x b=6.G();y(b&&5 c=="3")c.9(a||(5 a=="C"||5 a=="E"?7:a));4 b};p.Y=3(c,a){x b=6.G();y(!b&&5 c=="3")c.9(a||(5 a=="C"||5 a=="E"?7:a));4 b};o.Z=3(c){4 3(){x a=c(H),b=a.K(0);y(5 b=="3"&&5 6=="3")z(;6.D(7,a);)a=b.D(7,a)||[];4 7}}(r);o.12=3(c){4 3(){x a=c(H),b=a.K(0);y(5 b=="3"&&5 6=="3")z(;!6.D(7,a);)a=b.D(7,a)||[];4 7}}(r);r=v=u=t=s=q=m=l=p=o=n=h=7;8 r;8 v;8 u;8 t;8 s;8 q;8 m;8 l;8 p;8 o;8 n;8 h;8 H.14}).9(7);',62,67,'|||function|return|typeof|this|null|delete|call||||||||||||||||||||||||var|if|for|prototype|Math|undefined|apply|object|times|valueOf|arguments|abs|floor|shift|else|make|to|isFinite|each|String|Object|Boolean|new|slice|Function|Number|ifTrue|ifFalse|whileTrue|Array|toString|whileFalse|step|callee'.split('|'),0,{}));


*/
