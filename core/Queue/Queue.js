

var Queue = (function (ETP, LWM) { // [http://de.wikipedia.org/wiki/Datenstruktur#Warteschlange]


  var sh = ((this && (this.window === this) && /*this.*/window) || this),

  strErrorETP = "This [[Queue]] implementation badly requieres the presence of the [[EventTargetProvider]] singleton - aka [[EventDispatcher]] .",
  strErrorLWM = "This [[Queue]] implementation badly requieres the presence of the [[ListWrapperMixin]]  Mixin (/ Interface).",

  isFunction = (function (obj) {
    return (typeof obj == "function");
  }),
  throwImplementationError = (function (str) {
    if (str) {
      throw (new ReferenceError(str));
    }
  });

  LWM = (function (fct) { // LWM : [[ListWrapperMixin]]  Mixin (/ Interface)
    var obj = new fct;
    return ((obj && isFunction(obj.item) && isFunction(obj.size) && fct) || null);
  })(
    ((isFunction(LWM) && LWM) || (isFunction(sh.ListWrapperMixin) && sh.ListWrapperMixin)) || (function () {})
  );
  ETP = (( // ETP : [[EventTargetProvider]] Singleton
    (ETP && isFunction(ETP.register) && isFunction(ETP.unsubscribe) && ETP) ||
    (sh.EventTargetProvider && isFunction(sh.EventTargetProvider.register) && isFunction(sh.EventTargetProvider.unsubscribe) && sh.EventTargetProvider) ||
    (sh.EventDispatcher && isFunction(sh.EventDispatcher.register) && isFunction(sh.EventDispatcher.unsubscribe) && sh.EventDispatcher)
  ) || null);

  throwImplementationError(!ETP && strErrorETP);
  throwImplementationError(!LWM && strErrorLWM);

//print("sh : " + sh);

  strErrorETP = null; strErrorLWM = null; isFunction = null; throwImplementationError = null;
  delete strErrorETP; delete strErrorLWM; delete isFunction; delete throwImplementationError;


  return (function () { // [[Queue]] constructor function


    var self = this, list = [],

    onEnqueue = (function (obj) {

      self.dispatchEvent({target: self, type: "enqueue", elm: obj/*, even more key:value pairs */});
    }),
    onDequeue = (function (obj) {

      self.dispatchEvent({target: self, type: "dequeue", elm: obj/*, even more key:value pairs */});
    }),
    onEmpty = (function () {

      self.dispatchEvent({target: self, type: "empty"/*, even more key:value pairs */});
    });


    ETP.register(this); // provide the EventTarget Mixin (/ Interface).
    LWM.call(this, list); // apply the wrapped basic [[List]] interface.

    this.constructor = (sh.Queue || arguments.callee);


  //queue specific part
    this.enqueue = (function (obj/*:[Object]*/) { /* enqueue | line up | [Array.push] */

      list.push(obj);
      this.length = list.length;
      onEnqueue(obj);
    });
    this.dequeue = (function () { /* dequeue | line up | [Array.shift] */

      var obj = list.shift();
      if (list.length === 0) {

        onEmpty();
      }
      onDequeue(obj);

      return obj;
    });
  });
})();/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 1.801 byte :
//var Queue=function(ETP,LWM){var sh=this&&this.window===this&&window||this,strErrorETP="This [[Queue]] implementation badly requieres the presence of the [[EventTargetProvider]] singleton - aka [[EventDispatcher]] .",strErrorLWM="This [[Queue]] implementation badly requieres the presence of the [[ListWrapperMixin]]  Mixin (/ Interface).",isFunction=function(obj){return typeof obj=="function"},throwImplementationError=function(str){if(str)throw new ReferenceError(str);};LWM=function(fct){var obj=new fct;return obj&&isFunction(obj.item)&&isFunction(obj.size)&&fct||null}(isFunction(LWM)&&LWM||isFunction(sh.ListWrapperMixin)&&sh.ListWrapperMixin||function(){});ETP=ETP&&isFunction(ETP.register)&&isFunction(ETP.unsubscribe)&&ETP||sh.EventTargetProvider&&isFunction(sh.EventTargetProvider.register)&&isFunction(sh.EventTargetProvider.unsubscribe)&&sh.EventTargetProvider||sh.EventDispatcher&&isFunction(sh.EventDispatcher.register)&&isFunction(sh.EventDispatcher.unsubscribe)&&sh.EventDispatcher||null;throwImplementationError(!ETP&&strErrorETP);throwImplementationError(!LWM&&strErrorLWM);strErrorETP=null;strErrorLWM=null;isFunction=null;throwImplementationError=null;delete strErrorETP;delete strErrorLWM;delete isFunction;delete throwImplementationError;return function(){var self=this,list=[],onEnqueue=function(obj){self.dispatchEvent({target:self,type:"enqueue",elm:obj})},onDequeue=function(obj){self.dispatchEvent({target:self,type:"dequeue",elm:obj})},onEmpty=function(){self.dispatchEvent({target:self,type:"empty"})};ETP.register(this);LWM.call(this,list);this.constructor=sh.Queue||arguments.callee;this.enqueue=function(obj){list.push(obj);this.length=list.length;onEnqueue(obj)};this.dequeue=function(){var obj=list.shift();if(list.length===0)onEmpty();onDequeue(obj);return obj}}}();

- Simple          - 1.305 byte :
//var Queue=function(f,g){var c=this&&this.window===this&&window||this,i="This [[Queue]] implementation badly requieres the presence of the [[EventTargetProvider]] singleton - aka [[EventDispatcher]] .",j="This [[Queue]] implementation badly requieres the presence of the [[ListWrapperMixin]]  Mixin (/ Interface).",b=function(a){return typeof a=="function"},h=function(a){if(a)throw new ReferenceError(a);};g=function(a){var d=new a;return d&&b(d.item)&&b(d.size)&&a||null}(b(g)&&g||b(c.ListWrapperMixin)&&c.ListWrapperMixin||function(){});f=f&&b(f.register)&&b(f.unsubscribe)&&f||c.EventTargetProvider&&b(c.EventTargetProvider.register)&&b(c.EventTargetProvider.unsubscribe)&&c.EventTargetProvider||c.EventDispatcher&&b(c.EventDispatcher.register)&&b(c.EventDispatcher.unsubscribe)&&c.EventDispatcher||null;h(!f&&i);h(!g&&j);h=b=j=i=null;delete i;delete j;delete b;delete h;return function(){var a=this,d=[],k=function(e){a.dispatchEvent({target:a,type:"enqueue",elm:e})},l=function(e){a.dispatchEvent({target:a,type:"dequeue",elm:e})},m=function(){a.dispatchEvent({target:a,type:"empty"})};f.register(this);g.call(this,d);this.constructor=c.Queue||arguments.callee;this.enqueue=function(e){d.push(e);this.length=d.length;k(e)};this.dequeue=function(){var e=d.shift();d.length===0&&m();l(e);return e}}}();

- Advanced        - 1.024 byte : !!! BROKEN !!!


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 1.854 byte :
//var Queue=(function(ETP,LWM){var sh=((this&&(this.window===this)&&window)||this),strErrorETP="This [[Queue]] implementation badly requieres the presence of the [[EventTargetProvider]] singleton - aka [[EventDispatcher]] .",strErrorLWM="This [[Queue]] implementation badly requieres the presence of the [[ListWrapperMixin]]  Mixin (/ Interface).",isFunction=(function(obj){return(typeof obj=="function")}),throwImplementationError=(function(str){if(str){throw(new ReferenceError(str));}});LWM=(function(fct){var obj=new fct;return((obj&&isFunction(obj.item)&&isFunction(obj.size)&&fct)||null)})(((isFunction(LWM)&&LWM)||(isFunction(sh.ListWrapperMixin)&&sh.ListWrapperMixin))||(function(){}));ETP=(((ETP&&isFunction(ETP.register)&&isFunction(ETP.unsubscribe)&&ETP)||(sh.EventTargetProvider&&isFunction(sh.EventTargetProvider.register)&&isFunction(sh.EventTargetProvider.unsubscribe)&&sh.EventTargetProvider)||(sh.EventDispatcher&&isFunction(sh.EventDispatcher.register)&&isFunction(sh.EventDispatcher.unsubscribe)&&sh.EventDispatcher))||null);throwImplementationError(!ETP&&strErrorETP);throwImplementationError(!LWM&&strErrorLWM);strErrorETP=null;strErrorLWM=null;isFunction=null;throwImplementationError=null;delete strErrorETP;delete strErrorLWM;delete isFunction;delete throwImplementationError;return(function(){var self=this,list=[],onEnqueue=(function(obj){self.dispatchEvent({target:self,type:"enqueue",elm:obj})}),onDequeue=(function(obj){self.dispatchEvent({target:self,type:"dequeue",elm:obj})}),onEmpty=(function(){self.dispatchEvent({target:self,type:"empty"})});ETP.register(this);LWM.call(this,list);this.constructor=(sh.Queue||arguments.callee);this.enqueue=(function(obj){list.push(obj);this.length=list.length;onEnqueue(obj)});this.dequeue=(function(){var obj=list.shift();if(list.length===0){onEmpty()}onDequeue(obj);return obj})})})();

- packed / shrinked           - 1.749 byte :
//var Queue=(function(c,d){var e=((this&&(this.window===this)&&window)||this),strErrorETP="This [[Queue]] implementation badly requieres the presence of the [[EventTargetProvider]] singleton - aka [[EventDispatcher]] .",strErrorLWM="This [[Queue]] implementation badly requieres the presence of the [[ListWrapperMixin]]  Mixin (/ Interface).",isFunction=(function(a){return(typeof a=="function")}),throwImplementationError=(function(a){if(a){throw(new ReferenceError(a));}});d=(function(a){var b=new a;return((b&&isFunction(b.item)&&isFunction(b.size)&&a)||null)})(((isFunction(d)&&d)||(isFunction(e.ListWrapperMixin)&&e.ListWrapperMixin))||(function(){}));c=(((c&&isFunction(c.register)&&isFunction(c.unsubscribe)&&c)||(e.EventTargetProvider&&isFunction(e.EventTargetProvider.register)&&isFunction(e.EventTargetProvider.unsubscribe)&&e.EventTargetProvider)||(e.EventDispatcher&&isFunction(e.EventDispatcher.register)&&isFunction(e.EventDispatcher.unsubscribe)&&e.EventDispatcher))||null);throwImplementationError(!c&&strErrorETP);throwImplementationError(!d&&strErrorLWM);strErrorETP=null;strErrorLWM=null;isFunction=null;throwImplementationError=null;delete strErrorETP;delete strErrorLWM;delete isFunction;delete throwImplementationError;return(function(){var b=this,list=[],onEnqueue=(function(a){b.dispatchEvent({target:b,type:"enqueue",elm:a})}),onDequeue=(function(a){b.dispatchEvent({target:b,type:"dequeue",elm:a})}),onEmpty=(function(){b.dispatchEvent({target:b,type:"empty"})});c.register(this);d.call(this,list);this.constructor=(e.Queue||arguments.callee);this.enqueue=(function(a){list.push(a);this.length=list.length;onEnqueue(a)});this.dequeue=(function(){var a=list.shift();if(list.length===0){onEmpty()}onDequeue(a);return a})})})();

- packed / shrinked / encoded - 1.433 byte :
//eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('9 i=(2(c,d){9 e=((3&&(3.w===3)&&w)||3),j="A [[i]] C D t k E G k [[7]] W - N [[6]] .",l="A [[i]] C D t k E G k [[r]]  S (/ K).",1=(2(a){g(J a=="2")}),8=(2(a){F(a){M(s U(a));}});d=(2(a){9 b=s a;g((b&&1(b.H)&&1(b.I)&&a)||5)})(((1(d)&&d)||(1(e.r)&&e.r))||(2(){}));c=(((c&&1(c.h)&&1(c.m)&&c)||(e.7&&1(e.7.h)&&1(e.7.m)&&e.7)||(e.6&&1(e.6.h)&&1(e.6.m)&&e.6))||5);8(!c&&j);8(!d&&l);j=5;l=5;1=5;8=5;f j;f l;f 1;f 8;g(2(){9 b=3,4=[],B=(2(a){b.o({n:b,p:"z",u:a})}),y=(2(a){b.o({n:b,p:"v",u:a})}),x=(2(){b.o({n:b,p:"O"})});c.h(3);d.P(3,4);3.Q=(e.i||R.L);3.z=(2(a){4.T(a);3.q=4.q;B(a)});3.v=(2(){9 a=4.V();F(4.q===0){x()}y(a);g a})})})();',59,59,'|isFunction|function|this|list|null|EventDispatcher|EventTargetProvider|throwImplementationError|var||||||delete|return|register|Queue|strErrorETP|the|strErrorLWM|unsubscribe|target|dispatchEvent|type|length|ListWrapperMixin|new|requieres|elm|dequeue|window|onEmpty|onDequeue|enqueue|This|onEnqueue|implementation|badly|presence|if|of|item|size|typeof|Interface|callee|throw|aka|empty|call|constructor|arguments|Mixin|push|ReferenceError|shift|singleton'.split('|'),0,{}));


*/ /*


  please run this simple test within [http://jconsole.com/]

*/

var myQueue = new Queue;

myQueue.enqueue("hallo");
myQueue.enqueue("du");
myQueue.enqueue("schöne");
myQueue.enqueue("neue");
myQueue.enqueue("welt");

print(myQueue);
print(myQueue.valueOf().concat("- was's", "los"));
print(myQueue);

var myDequeueListener = myQueue.addEventListener("dequeue", (function (evt) {print("evt.target : " + evt.target);print("evt.type : " + evt.type);print("evt.elm : " + evt.elm);}));
props(myDequeueListener);

print(myQueue.dequeue());
print(myQueue.dequeue());
print(myQueue.dequeue());

var myEmptyListener = myQueue.addEventListener("empty", (function (evt) {print("evt.target : " + evt.target);print("evt.type : " + evt.type);}));
props(myEmptyListener);

print(myQueue.dequeue());

myQueue.removeEventListener(myDequeueListener);

print(myQueue.dequeue());
print(myQueue.dequeue());
print(myQueue.dequeue());

var myEnqueueListener = myQueue.addEventListener("enqueue", (function (evt) {print("evt.target : " + evt.target);print("evt.type : " + evt.type);print("evt.elm : " + evt.elm);}));
props(myEnqueueListener);

myQueue.enqueue("hallo");
myQueue.enqueue("du");
myQueue.enqueue("schöne");
myQueue.enqueue("neue");
myQueue.enqueue("welt");

print(myQueue.length);
print(myQueue.size());
print(myQueue.item(5));
print(myQueue.item(0));
print(myQueue.item(4));
print(myQueue.item(1));
print(myQueue.item(3));
print(myQueue.item(2));
