

(function (ns, WrappedListMixin, EventTargetProvider) {


  var unknown, isFunction = (function (obj) {return (typeof obj == "function");});

  WrappedListMixin = ((isFunction(WrappedListMixin) && WrappedListMixin) || (ns && isFunction(ns.WrappedListMixin) && ns.WrappedListMixin) || (isFunction(this.WrappedListMixin) && this.WrappedListMixin) || unknown);
  EventTargetProvider = (
    (EventTargetProvider && isFunction(EventTargetProvider.register) && isFunction(EventTargetProvider.unsubscribe) && EventTargetProvider) ||
    (ns && ns.EventTargetProvider && isFunction(ns.EventTargetProvider.register) && isFunction(ns.EventTargetProvider.unsubscribe) && ns.EventTargetProvider) ||
    (this.EventTargetProvider && isFunction(this.EventTargetProvider.register) && isFunction(this.EventTargetProvider.unsubscribe) && this.EventTargetProvider) || unknown);

  if (!WrappedListMixin) {throw (new ReferenceError("This [Queue] implementation requires the presence of the [WrappedList]Mixin."));}
  if (!EventTargetProvider) {throw (new ReferenceError("This [Queue] implementation requires the presence of the [EventTargetProvider] Module/Singleton."));}


  ns = (ns/*[custom_namespace]*/ || this/*[global_object|scripting_host]*/);


  ns["Queue"] = (function (NAMESPACE, WRAPPED_LIST_MIXIN, EVENT_TARGET_PROVIDER) { // [Queue] Constructor becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.
    return (function () { // [http://de.wikipedia.org/wiki/Datenstruktur#Warteschlange]


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


      EVENT_TARGET_PROVIDER.register(this); // apply the [EventTargetMixin].
      WRAPPED_LIST_MIXIN.call(this, list); // apply basic list wrapper that is provided as an implemented interface.


    //this.constructor = (NAMESPACE.Queue || arguments.callee);
      this.constructor = NAMESPACE.Queue;


    //queue specific part
      this.enqueue = (function (obj/*:[Object]*/) { /* enqueue | line up | [Array.push] */

        list.push(obj);
        this.length = list.length;

        onEnqueue(obj);
      });
      this.dequeue = (function () { /* dequeue | line up | [Array.shift] */

        var obj = list.shift();
        this.length = list.length;
        if (list.length === 0) {

          onEmpty();
        }
        onDequeue(obj);

        return obj;
      });
    });
  })(ns, WrappedListMixin, EventTargetProvider); // [Queue] Constructor becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.


  EventTargetProvider = WrappedListMixin = isFunction = unknown = ns = null;
  delete EventTargetProvider; delete WrappedListMixin; delete isFunction; delete unknown; delete ns;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_Queue_is_supposed_to_be_bound_to[, kind_of_wrapped_list_interface[, EventTargetProvider]]]*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.940 byte :
(function(ns,WrappedListMixin,EventTargetProvider){var unknown,isFunction=function(obj){return typeof obj=="function"};WrappedListMixin=isFunction(WrappedListMixin)&&WrappedListMixin||ns&&isFunction(ns.WrappedListMixin)&&ns.WrappedListMixin||isFunction(this.WrappedListMixin)&&this.WrappedListMixin||unknown;EventTargetProvider=EventTargetProvider&&isFunction(EventTargetProvider.register)&&isFunction(EventTargetProvider.unsubscribe)&&EventTargetProvider||ns&&ns.EventTargetProvider&&isFunction(ns.EventTargetProvider.register)&&isFunction(ns.EventTargetProvider.unsubscribe)&&ns.EventTargetProvider||this.EventTargetProvider&&isFunction(this.EventTargetProvider.register)&&isFunction(this.EventTargetProvider.unsubscribe)&&this.EventTargetProvider||unknown;if(!WrappedListMixin)throw new ReferenceError("This [Queue] implementation requires the presence of the [WrappedList]Mixin.");if(!EventTargetProvider)throw new ReferenceError("This [Queue] implementation requires the presence of the [EventTargetProvider] Module/Singleton.");ns=ns||this;ns["Queue"]=function(NAMESPACE,WRAPPED_LIST_MIXIN,EVENT_TARGET_PROVIDER){return function(){var self=this,list=[],onEnqueue=function(obj){self.dispatchEvent({target:self,type:"enqueue",elm:obj})},onDequeue=function(obj){self.dispatchEvent({target:self,type:"dequeue",elm:obj})},onEmpty=function(){self.dispatchEvent({target:self,type:"empty"})};EVENT_TARGET_PROVIDER.register(this);WRAPPED_LIST_MIXIN.call(this,list);this.constructor=NAMESPACE.Queue;this.enqueue=function(obj){list.push(obj);this.length=list.length;onEnqueue(obj)};this.dequeue=function(){var obj=list.shift();this.length=list.length;if(list.length===0)onEmpty();onDequeue(obj);return obj}}}(ns,WrappedListMixin,EventTargetProvider);EventTargetProvider=WrappedListMixin=isFunction=unknown=ns=null;delete EventTargetProvider;delete WrappedListMixin;delete isFunction;delete unknown;delete ns;delete arguments.callee}).call(null);

- Simple          - 1.224 byte :
(function(a,d,c){var h,b=function(i){return typeof i=="function"};d=b(d)&&d||a&&b(a.WrappedListMixin)&&a.WrappedListMixin||b(this.WrappedListMixin)&&this.WrappedListMixin||h;c=c&&b(c.register)&&b(c.unsubscribe)&&c||a&&a.EventTargetProvider&&b(a.EventTargetProvider.register)&&b(a.EventTargetProvider.unsubscribe)&&a.EventTargetProvider||this.EventTargetProvider&&b(this.EventTargetProvider.register)&&b(this.EventTargetProvider.unsubscribe)&&this.EventTargetProvider||h;if(!d)throw new ReferenceError("This [Queue] implementation requires the presence of the [WrappedList]Mixin.");if(!c)throw new ReferenceError("This [Queue] implementation requires the presence of the [EventTargetProvider] Module/Singleton.");a=a||this;a.Queue=function(i,j,k){return function(){var e=this,f=[];k.register(this);j.call(this,f);this.constructor=i.Queue;this.enqueue=function(g){f.push(g);this.length=f.length;e.dispatchEvent({target:e,type:"enqueue",elm:g})};this.dequeue=function(){var g=f.shift();this.length=f.length;f.length===0&&e.dispatchEvent({target:e,type:"empty"});e.dispatchEvent({target:e,type:"dequeue",elm:g});return g}}}(a,d,c);c=d=b=h=a=null;delete c;delete d;delete b;delete h;delete a;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 1.981 byte :
(function(ns,WrappedListMixin,EventTargetProvider){var unknown,isFunction=(function(obj){return(typeof obj=="function")});WrappedListMixin=((isFunction(WrappedListMixin)&&WrappedListMixin)||(ns&&isFunction(ns.WrappedListMixin)&&ns.WrappedListMixin)||(isFunction(this.WrappedListMixin)&&this.WrappedListMixin)||unknown);EventTargetProvider=((EventTargetProvider&&isFunction(EventTargetProvider.register)&&isFunction(EventTargetProvider.unsubscribe)&&EventTargetProvider)||(ns&&ns.EventTargetProvider&&isFunction(ns.EventTargetProvider.register)&&isFunction(ns.EventTargetProvider.unsubscribe)&&ns.EventTargetProvider)||(this.EventTargetProvider&&isFunction(this.EventTargetProvider.register)&&isFunction(this.EventTargetProvider.unsubscribe)&&this.EventTargetProvider)||unknown);if(!WrappedListMixin){throw(new ReferenceError("This [Queue] implementation requires the presence of the [WrappedList]Mixin."));}if(!EventTargetProvider){throw(new ReferenceError("This [Queue] implementation requires the presence of the [EventTargetProvider] Module/Singleton."));}ns=(ns||this);ns["Queue"]=(function(NAMESPACE,WRAPPED_LIST_MIXIN,EVENT_TARGET_PROVIDER){return(function(){var self=this,list=[],onEnqueue=(function(obj){self.dispatchEvent({target:self,type:"enqueue",elm:obj})}),onDequeue=(function(obj){self.dispatchEvent({target:self,type:"dequeue",elm:obj})}),onEmpty=(function(){self.dispatchEvent({target:self,type:"empty"})});EVENT_TARGET_PROVIDER.register(this);WRAPPED_LIST_MIXIN.call(this,list);this.constructor=NAMESPACE.Queue;this.enqueue=(function(obj){list.push(obj);this.length=list.length;onEnqueue(obj)});this.dequeue=(function(){var obj=list.shift();this.length=list.length;if(list.length===0){onEmpty()}onDequeue(obj);return obj})})})(ns,WrappedListMixin,EventTargetProvider);EventTargetProvider=WrappedListMixin=isFunction=unknown=ns=null;delete EventTargetProvider;delete WrappedListMixin;delete isFunction;delete unknown;delete ns;delete arguments.callee}).call(null);

- packed / shrinked           - 1.501 byte :
(function(f,g,h){var i,isFunction=(function(a){return(typeof a=="function")});g=((isFunction(g)&&g)||(f&&isFunction(f.WrappedListMixin)&&f.WrappedListMixin)||(isFunction(this.WrappedListMixin)&&this.WrappedListMixin)||i);h=((h&&isFunction(h.register)&&isFunction(h.unsubscribe)&&h)||(f&&f.EventTargetProvider&&isFunction(f.EventTargetProvider.register)&&isFunction(f.EventTargetProvider.unsubscribe)&&f.EventTargetProvider)||(this.EventTargetProvider&&isFunction(this.EventTargetProvider.register)&&isFunction(this.EventTargetProvider.unsubscribe)&&this.EventTargetProvider)||i);if(!g){throw(new ReferenceError("This [Queue] implementation requires the presence of the [WrappedList]Mixin."));}if(!h){throw(new ReferenceError("This [Queue] implementation requires the presence of the [EventTargetProvider] Module/Singleton."));}f=(f||this);f["Queue"]=(function(c,d,e){return(function(){var b=this,list=[],onEnqueue=(function(a){b.dispatchEvent({target:b,type:"enqueue",elm:a})}),onDequeue=(function(a){b.dispatchEvent({target:b,type:"dequeue",elm:a})}),onEmpty=(function(){b.dispatchEvent({target:b,type:"empty"})});e.register(this);d.call(this,list);this.constructor=c.Queue;this.enqueue=(function(a){list.push(a);this.length=list.length;onEnqueue(a)});this.dequeue=(function(){var a=list.shift();this.length=list.length;if(list.length===0){onEmpty()}onDequeue(a);return a})})})(f,g,h);h=g=isFunction=i=f=null;delete h;delete g;delete isFunction;delete i;delete f;delete arguments.callee}).call(null);

- packed / shrinked / encoded - 1.292 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(3(f,g,h){o i,2=(3(a){n(N a=="3")});g=((2(g)&&g)||(f&&2(f.9)&&f.9)||(2(1.9)&&1.9)||i);h=((h&&2(h.8)&&2(h.l)&&h)||(f&&f.4&&2(f.4.8)&&2(f.4.l)&&f.4)||(1.4&&2(1.4.8)&&2(1.4.l)&&1.4)||i);r(!g){F(v y("z [j] C D k s t k [P]L."));}r(!h){F(v y("z [j] C D k s t k [4] Q/I."));}f=(f||1);f["j"]=(3(c,d,e){n(3(){o b=1,5=[],A=(3(a){b.q({m:b,p:"E",B:a})}),G=(3(a){b.q({m:b,p:"H",B:a})}),x=(3(){b.q({m:b,p:"S"})});e.8(1);d.w(1,5);1.R=c.j;1.E=(3(a){5.J(a);1.7=5.7;A(a)});1.H=(3(){o a=5.K();1.7=5.7;r(5.7===0){x()}G(a);n a})})})(f,g,h);h=g=2=i=f=u;6 h;6 g;6 2;6 i;6 f;6 M.O}).w(u);',55,55,'|this|isFunction|function|EventTargetProvider|list|delete|length|register|WrappedListMixin||||||||||Queue|the|unsubscribe|target|return|var|type|dispatchEvent|if|presence|of|null|new|call|onEmpty|ReferenceError|This|onEnqueue|elm|implementation|requires|enqueue|throw|onDequeue|dequeue|Singleton|push|shift|Mixin|arguments|typeof|callee|WrappedList|Module|constructor|empty'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 1.168 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(3(a,d,c){m h,b=3(i){o H i=="3"};d=b(d)&&d||a&&b(a.9)&&a.9||b(1.9)&&1.9||h;c=c&&b(c.8)&&b(c.n)&&c||a&&a.2&&b(a.2.8)&&b(a.2.n)&&a.2||1.2&&b(1.2.8)&&b(1.2.n)&&1.2||h;x(!d)y w u("B [6] t C 7 r E 7 [K]G.");x(!c)y w u("B [6] t C 7 r E 7 [2] L/O.");a=a||1;a.6=3(i,j,k){o 3(){m e=1,f=[];k.8(1);j.D(1,f);1.F=i.6;1.s=3(g){f.P(g);1.5=f.5;e.l({q:e,p:"s",A:g})};1.v=3(){m g=f.I();1.5=f.5;f.5===0&&e.l({q:e,p:"J"});e.l({q:e,p:"v",A:g});o g}}}(a,d,c);c=d=b=h=a=z;4 c;4 d;4 b;4 h;4 a;4 M.N}).D(z);',52,52,'|this|EventTargetProvider|function|delete|length|Queue|the|register|WrappedListMixin||||||||||||dispatchEvent|var|unsubscribe|return|type|target|presence|enqueue|implementation|ReferenceError|dequeue|new|if|throw|null|elm|This|requires|call|of|constructor|Mixin|typeof|shift|empty|WrappedList|Module|arguments|callee|Singleton|push'.split('|'),0,{}));


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
