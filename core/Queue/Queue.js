

(function (ns, ListWrapperMixin, EventTargetProvider) {


  var unknown, isFunction = (function (obj) {return (typeof obj == "function");});

  ListWrapperMixin = ((isFunction(ListWrapperMixin) && ListWrapperMixin) || (ns && isFunction(ns.ListWrapperMixin) && ns.ListWrapperMixin) || (isFunction(this.ListWrapperMixin) && this.ListWrapperMixin) || unknown);
  EventTargetProvider = (
    (EventTargetProvider && isFunction(EventTargetProvider.register) && isFunction(EventTargetProvider.unsubscribe) && EventTargetProvider) ||
    (ns && ns.EventTargetProvider && isFunction(ns.EventTargetProvider.register) && isFunction(ns.EventTargetProvider.unsubscribe) && ns.EventTargetProvider) ||
    (this.EventTargetProvider && isFunction(this.EventTargetProvider.register) && isFunction(this.EventTargetProvider.unsubscribe) && this.EventTargetProvider) || unknown);

  if (!ListWrapperMixin) {throw (new ReferenceError("This [Queue] implementation requires the presence of the [ListWrapper]Mixin."));}
  if (!EventTargetProvider) {throw (new ReferenceError("This [Queue] implementation requires the presence of the [EventTargetProvider] Module/Singleton."));}


  ns = (ns/*[custom_namespace]*/ || this/*[scripting_host|global_object]*/);


  ns["Queue"] = (function (NAMESPACE, LIST_WRAPPER_MIXIN, EVENT_TARGET_PROVIDER) { // [Queue] Constructor becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.
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
      LIST_WRAPPER_MIXIN.call(this, list); // apply kind of wrapped basic [List] interface.


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
        if (list.length === 0) {

          onEmpty();
        }
        onDequeue(obj);

        return obj;
      });
    });
  })(ns, ListWrapperMixin, EventTargetProvider); // [Queue] Constructor becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.


  EventTargetProvider = ListWrapperMixin = isFunction = unknown = ns = null;
  delete EventTargetProvider; delete ListWrapperMixin; delete isFunction; delete unknown; delete ns;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_Queue_is_supposed_to_be_bound_to[, kind_of_wrapped_list_interface[, EventTargetProvider]]]*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.916 byte :
(function(ns,ListWrapperMixin,EventTargetProvider){var unknown,isFunction=function(obj){return typeof obj=="function"};ListWrapperMixin=isFunction(ListWrapperMixin)&&ListWrapperMixin||ns&&isFunction(ns.ListWrapperMixin)&&ns.ListWrapperMixin||isFunction(this.ListWrapperMixin)&&this.ListWrapperMixin||unknown;EventTargetProvider=EventTargetProvider&&isFunction(EventTargetProvider.register)&&isFunction(EventTargetProvider.unsubscribe)&&EventTargetProvider||ns&&ns.EventTargetProvider&&isFunction(ns.EventTargetProvider.register)&&isFunction(ns.EventTargetProvider.unsubscribe)&&ns.EventTargetProvider||this.EventTargetProvider&&isFunction(this.EventTargetProvider.register)&&isFunction(this.EventTargetProvider.unsubscribe)&&this.EventTargetProvider||unknown;if(!ListWrapperMixin)throw new ReferenceError("This [Queue] implementation requires the presence of the [ListWrapper]Mixin.");if(!EventTargetProvider)throw new ReferenceError("This [Queue] implementation requires the presence of the [EventTargetProvider] Module/Singleton.");ns=ns||this;ns["Queue"]=function(NAMESPACE,LIST_WRAPPER_MIXIN,EVENT_TARGET_PROVIDER){return function(){var self=this,list=[],onEnqueue=function(obj){self.dispatchEvent({target:self,type:"enqueue",elm:obj})},onDequeue=function(obj){self.dispatchEvent({target:self,type:"dequeue",elm:obj})},onEmpty=function(){self.dispatchEvent({target:self,type:"empty"})};EVENT_TARGET_PROVIDER.register(this);LIST_WRAPPER_MIXIN.call(this,list);this.constructor=NAMESPACE.Queue;this.enqueue=function(obj){list.push(obj);this.length=list.length;onEnqueue(obj)};this.dequeue=function(){var obj=list.shift();if(list.length===0)onEmpty();onDequeue(obj);return obj}}}(ns,ListWrapperMixin,EventTargetProvider);EventTargetProvider=ListWrapperMixin=isFunction=unknown=ns=null;delete EventTargetProvider;delete ListWrapperMixin;delete isFunction;delete unknown;delete ns;delete arguments.callee}).call(null);

- Simple          - 1.203 byte :
(function(a,d,c){var h,b=function(i){return typeof i=="function"};d=b(d)&&d||a&&b(a.ListWrapperMixin)&&a.ListWrapperMixin||b(this.ListWrapperMixin)&&this.ListWrapperMixin||h;c=c&&b(c.register)&&b(c.unsubscribe)&&c||a&&a.EventTargetProvider&&b(a.EventTargetProvider.register)&&b(a.EventTargetProvider.unsubscribe)&&a.EventTargetProvider||this.EventTargetProvider&&b(this.EventTargetProvider.register)&&b(this.EventTargetProvider.unsubscribe)&&this.EventTargetProvider||h;if(!d)throw new ReferenceError("This [Queue] implementation requires the presence of the [ListWrapper]Mixin.");if(!c)throw new ReferenceError("This [Queue] implementation requires the presence of the [EventTargetProvider] Module/Singleton.");a=a||this;a.Queue=function(i,j,k){return function(){var e=this,f=[];k.register(this);j.call(this,f);this.constructor=i.Queue;this.enqueue=function(g){f.push(g);this.length=f.length;e.dispatchEvent({target:e,type:"enqueue",elm:g})};this.dequeue=function(){var g=f.shift();f.length===0&&e.dispatchEvent({target:e,type:"empty"});e.dispatchEvent({target:e,type:"dequeue",elm:g});return g}}}(a,d,c);c=d=b=h=a=null;delete c;delete d;delete b;delete h;delete a;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 1.957 byte :
(function(ns,ListWrapperMixin,EventTargetProvider){var unknown,isFunction=(function(obj){return(typeof obj=="function")});ListWrapperMixin=((isFunction(ListWrapperMixin)&&ListWrapperMixin)||(ns&&isFunction(ns.ListWrapperMixin)&&ns.ListWrapperMixin)||(isFunction(this.ListWrapperMixin)&&this.ListWrapperMixin)||unknown);EventTargetProvider=((EventTargetProvider&&isFunction(EventTargetProvider.register)&&isFunction(EventTargetProvider.unsubscribe)&&EventTargetProvider)||(ns&&ns.EventTargetProvider&&isFunction(ns.EventTargetProvider.register)&&isFunction(ns.EventTargetProvider.unsubscribe)&&ns.EventTargetProvider)||(this.EventTargetProvider&&isFunction(this.EventTargetProvider.register)&&isFunction(this.EventTargetProvider.unsubscribe)&&this.EventTargetProvider)||unknown);if(!ListWrapperMixin){throw(new ReferenceError("This [Queue] implementation requires the presence of the [ListWrapper]Mixin."));}if(!EventTargetProvider){throw(new ReferenceError("This [Queue] implementation requires the presence of the [EventTargetProvider] Module/Singleton."));}ns=(ns||this);ns["Queue"]=(function(NAMESPACE,LIST_WRAPPER_MIXIN,EVENT_TARGET_PROVIDER){return(function(){var self=this,list=[],onEnqueue=(function(obj){self.dispatchEvent({target:self,type:"enqueue",elm:obj})}),onDequeue=(function(obj){self.dispatchEvent({target:self,type:"dequeue",elm:obj})}),onEmpty=(function(){self.dispatchEvent({target:self,type:"empty"})});EVENT_TARGET_PROVIDER.register(this);LIST_WRAPPER_MIXIN.call(this,list);this.constructor=NAMESPACE.Queue;this.enqueue=(function(obj){list.push(obj);this.length=list.length;onEnqueue(obj)});this.dequeue=(function(){var obj=list.shift();if(list.length===0){onEmpty()}onDequeue(obj);return obj})})})(ns,ListWrapperMixin,EventTargetProvider);EventTargetProvider=ListWrapperMixin=isFunction=unknown=ns=null;delete EventTargetProvider;delete ListWrapperMixin;delete isFunction;delete unknown;delete ns;delete arguments.callee}).call(null);

- packed / shrinked           - 1.477 byte :
(function(f,g,h){var i,isFunction=(function(a){return(typeof a=="function")});g=((isFunction(g)&&g)||(f&&isFunction(f.ListWrapperMixin)&&f.ListWrapperMixin)||(isFunction(this.ListWrapperMixin)&&this.ListWrapperMixin)||i);h=((h&&isFunction(h.register)&&isFunction(h.unsubscribe)&&h)||(f&&f.EventTargetProvider&&isFunction(f.EventTargetProvider.register)&&isFunction(f.EventTargetProvider.unsubscribe)&&f.EventTargetProvider)||(this.EventTargetProvider&&isFunction(this.EventTargetProvider.register)&&isFunction(this.EventTargetProvider.unsubscribe)&&this.EventTargetProvider)||i);if(!g){throw(new ReferenceError("This [Queue] implementation requires the presence of the [ListWrapper]Mixin."));}if(!h){throw(new ReferenceError("This [Queue] implementation requires the presence of the [EventTargetProvider] Module/Singleton."));}f=(f||this);f["Queue"]=(function(c,d,e){return(function(){var b=this,list=[],onEnqueue=(function(a){b.dispatchEvent({target:b,type:"enqueue",elm:a})}),onDequeue=(function(a){b.dispatchEvent({target:b,type:"dequeue",elm:a})}),onEmpty=(function(){b.dispatchEvent({target:b,type:"empty"})});e.register(this);d.call(this,list);this.constructor=c.Queue;this.enqueue=(function(a){list.push(a);this.length=list.length;onEnqueue(a)});this.dequeue=(function(){var a=list.shift();if(list.length===0){onEmpty()}onDequeue(a);return a})})})(f,g,h);h=g=isFunction=i=f=null;delete h;delete g;delete isFunction;delete i;delete f;delete arguments.callee}).call(null);

- packed / shrinked / encoded - 1.284 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(3(f,g,h){k i,2=(3(a){r(N a=="3")});g=((2(g)&&g)||(f&&2(f.j)&&f.j)||(2(1.j)&&1.j)||i);h=((h&&2(h.9)&&2(h.m)&&h)||(f&&f.4&&2(f.4.9)&&2(f.4.m)&&f.4)||(1.4&&2(1.4.9)&&2(1.4.m)&&1.4)||i);q(!g){E(v y("z [8] C D 7 s t 7 [P]L."));}q(!h){E(v y("z [8] C D 7 s t 7 [4] Q/I."));}f=(f||1);f["8"]=(3(c,d,e){r(3(){k b=1,5=[],A=(3(a){b.o({p:b,n:"B",F:a})}),G=(3(a){b.o({p:b,n:"H",F:a})}),x=(3(){b.o({p:b,n:"S"})});e.9(1);d.w(1,5);1.R=c.8;1.B=(3(a){5.J(a);1.l=5.l;A(a)});1.H=(3(){k a=5.K();q(5.l===0){x()}G(a);r a})})})(f,g,h);h=g=2=i=f=u;6 h;6 g;6 2;6 i;6 f;6 M.O}).w(u);',55,55,'|this|isFunction|function|EventTargetProvider|list|delete|the|Queue|register||||||||||ListWrapperMixin|var|length|unsubscribe|type|dispatchEvent|target|if|return|presence|of|null|new|call|onEmpty|ReferenceError|This|onEnqueue|enqueue|implementation|requires|throw|elm|onDequeue|dequeue|Singleton|push|shift|Mixin|arguments|typeof|callee|ListWrapper|Module|constructor|empty'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 1.160 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(3(a,d,c){9 h,b=3(i){p J i=="3"};d=b(d)&&d||a&&b(a.7)&&a.7||b(1.7)&&1.7||h;c=c&&b(c.8)&&b(c.q)&&c||a&&a.2&&b(a.2.8)&&b(a.2.q)&&a.2||1.2&&b(1.2.8)&&b(1.2.q)&&1.2||h;E(!d)s w x("y [5] C D 6 r A 6 [L]H.");E(!c)s w x("y [5] C D 6 r A 6 [2] G/O.");a=a||1;a.5=3(i,j,k){p 3(){9 e=1,f=[];k.8(1);j.z(1,f);1.F=i.5;1.B=3(g){f.P(g);1.n=f.n;e.o({m:e,l:"B",v:g})};1.u=3(){9 g=f.N();f.n===0&&e.o({m:e,l:"M"});e.o({m:e,l:"u",v:g});p g}}}(a,d,c);c=d=b=h=a=t;4 c;4 d;4 b;4 h;4 a;4 I.K}).z(t);',52,52,'|this|EventTargetProvider|function|delete|Queue|the|ListWrapperMixin|register|var||||||||||||type|target|length|dispatchEvent|return|unsubscribe|presence|throw|null|dequeue|elm|new|ReferenceError|This|call|of|enqueue|implementation|requires|if|constructor|Module|Mixin|arguments|typeof|callee|ListWrapper|empty|shift|Singleton|push'.split('|'),0,{}));


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
