/*
  This [EventTargetProvider] singleton enables and will encourage usage of a pretty lightweighted but still type-safety enforcing implementation of
  [http://en.wikipedia.org/wiki/Signals_and_slots Signals and Slots], an [http://en.wikipedia.org/wiki/Observer_pattern observer] concept different
  from [http://en.wikipedia.org/wiki/Publish/subscribe publish-subscribe], and all of it based on this languages core-API.

  Registering a native JavaScript object via [EventTargetProvider.register] applies an implemented [EventTarget] interface onto this object thus
  featuring immediately its 4 methods [addEventListener] and [on] that are synonyms as well as [removeEventListener] and [dispatchEvent].

  Attempting to register DOM-[Node] or DOM-[Element] objects as well as reregistering of objects that already have applied the [EventTarget]Mixin
  is futile.

  Furthermore, this observer does not support any DOM-level-2 event flow behavior like capture, bubbling, propagation for there are no dependencies
  like ancestry or tree-like object hierarchies.

  Once such an object features [EventTarget] behavior every other object can subscribe itself or listen via [addEventListener] or [on] to a certain
  event by passing a valid type and a handler to that firstly mentioned object.


  link-list:

    English:

      [http://en.wikipedia.org/wiki/Observer_pattern]   - Observer Pattern
      [http://en.wikipedia.org/wiki/Publish/subscribe]  - publish-subscribe
      [http://en.wikipedia.org/wiki/Signals_and_slots]  - Signals and Slots

      [http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/]
      [http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html]
      [http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/ecma-script-binding.html] // DOM Level 2 - Appendix C: ECMAScript Language Binding.

    Deutsch/German:
      [http://de.wikipedia.org/wiki/Observer_(Entwurfsmuster)]  - Observer (Entwurfsmuster) / publish-subscribe
      [http://de.wikipedia.org/wiki/Signal-Slot-Konzept]        - Signal-Slot-Konzept

    EN - comments    : There are no dependencies within the [EventTargetProvider] implementation beneath. This module runs independently in any ECMAScript environment.
    DE - Kommentare  : Die folgende Implementierung des [EventTargetProvider]s ist frei von Abhängigkeiten. Dieses Modul läuft unabhängig in jeder ECMAScript-Umgebung.
*/


(function (ns) {


  ns = (ns/*[custom_namespace]*/ || this/*[global_object|scripting_host]*/);
  ns["EventTargetProvider"] = (function () { // [EventTargetProvider] Module/Singleton becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.


    var exposeImplementation = Object.prototype.toString,

    Detect = { // typedetection
      isString :(function (regXBaseClass, expose) {
        return (function (obj/*:[object|value]*/) { /*:[true|false]*/

          return regXBaseClass.test(expose.call(obj));
        });
      })((/^\[object\s+String\]$/), exposeImplementation),

      isFunction : (function (obj/*:[object|value]*/) { /*:[true|false]*/ 
        return ((typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function")); // x-frame-safe and also filters e.g. mozillas [[RegExp]] implementation.
      })
    },
    Handler = { // specialized [indexOf] helper method.
      indexOf : (function (arr, fct) { /*:[number(>=0|-1)]*/
        var idx = arr.length;
        while (idx--) {
          if (arr[idx] === fct) {
            break;
          }
        }
        return idx;
      })
    },


    Event = (function (target/*:[EventTarget]*/, type/*:[string|String]*/) { // providing the [[Event]] constructor.

      this.constructor = Event; // arguments.callee

      this.target = target;
      this.type = type;
      this.timeStamp = new Date();
    }),
    EventListener = (function (target/*:[EventTarget]*/, type/*:[string|String]*/, handler/*:[Function]*/) { // providing the [[EventListener]] constructor.

      this.constructor = EventListener; // arguments.callee

      var defaultEvent = new Event(target, type); // default [Event] object
      this.handleEvent = (function (evt/*:[string|String|Event-like-Object]*/) { /*:void*/

        if (evt && (typeof evt == "object")) {
        //stay strictly typesafe - [dispatchEvent] never will take control of [defaultEvent] e.g trying to delegate another [target] by manipulating its event-object-like argument.
          evt.target = defaultEvent.target;
          evt.type = defaultEvent.type;
          evt.timeStamp = defaultEvent.timeStamp;
        } else {
        //create a [defaultEvent] copy.
          evt = {
            target: defaultEvent.target,
            type: defaultEvent.type,
            timeStamp: defaultEvent.timeStamp
          };
        }
        handler(evt);
      });

      this.getType = (function () { /*:[string]*/
        return type;
      });
      this.getHandler = (function () { /*:[Function]*/
        return handler;
      });
    }),/*

    »The concept of "Mixin"s from the perspective of JavaScript adds behavior to objects
    by delegation over implemented interfaces. "Trait"s  might be the wording that comes
    closest to this languages design if such an implementation is stateless.

  */
    EventTargetMixin = (function (indexOf, isString, isFunction) {
      return (function () { // [EventTarget]Mixin - providing the implementation of an [EventTarget] interface.

        var eventMap = { },
        removeEventListener = (function (type/*:[string|String]*/, handler/*:[Function]*/) { /*:[true|false]*/

          var event = eventMap[type], successfully = false;
          if (event) {

            var handlers = event.handlers,
            listeners = event.listeners,
            idx = indexOf(handlers, handler);

            if (idx >= 0) {
              handlers.splice(idx, 1);
              listeners.splice(idx, 1);
              successfully = true;
            }
          }
          return successfully;
        }),
        hasEventListener = (function (type/*:[string|String]*/, handler/*:[Function]*/) { /*:[true|false]*/
          return ((eventMap[type] || false) && (indexOf(eventMap[type].handlers, handler) >= 0));
        });

        this.addEventListener = this.on = (function (type/*:[string|String]*/, handler/*:[Function]*/) { /*:[EventListener|undefined]*/

          var reference;
          if (type && isString(type) && isFunction(handler)) {

            var event = eventMap[type], listener = new EventListener(this, type, handler);
            if (event) {

              var handlers = event.handlers,
              listeners = event.listeners,
              idx = indexOf(handlers, handler);

              if (idx == -1) {
                handlers.push(listener.getHandler()); // in order to store a proper handler reference that later on could be compared to.
                listeners.push(listener);

                reference = listener;
              } else {
                reference = listeners[idx];
              }
            } else {
              event = eventMap[type] = {};
              event.handlers = [listener.getHandler()]; // in order to store a proper handler reference that later on could be compared to.
              event.listeners = [listener];

              reference = listener;
            }
          }
          return reference;
        });
        this.removeEventListener = (function (typeOrListener/*:[string|String|EventListener]*/, handler/*:[Function]*/) { /*:[true|false]*/
          return ((isString(typeOrListener) && isFunction(handler) && removeEventListener(typeOrListener, handler)) || ((typeOrListener instanceof EventListener) && removeEventListener(typeOrListener.getType(), typeOrListener.getHandler())) || false);
        });
        this.hasEventListener = (function (typeOrListener/*:[string|String|EventListener]*/, handler/*:[Function]*/) { /*:[true|false]*/
          return ((isString(typeOrListener) && isFunction(handler) && hasEventListener(typeOrListener, handler)) || ((typeOrListener instanceof EventListener) && hasEventListener(typeOrListener.getType(), typeOrListener.getHandler())) || false/* or might >>return undefined<< be even better? */);
        });
        this.dispatchEvent = (function (evt/*:[string|String|Event-like-Object]*/) { /*:[true|false]*/

          var successfully = false,
          type = (((typeof evt == "object") && (typeof evt.type == "string") && evt.type) || ((typeof evt == "string") && evt)),
          event = (type && eventMap[type]);

          if (event) {
            var listeners = (event && event.listeners), len = ((listeners && listeners.length) || 0), idx = 0;

            if (len >= 1) {
              while (idx < len) {

                listeners[idx++].handleEvent(evt); // to handle event dispatching serially is recommended if handler-processing is not that time consuming.

              //handling event dispatching kind of *green threaded* prevents freezing the user interface if dispatch cycle starts.
              //setTimeout((function () {listeners[idx++].handleEvent(evt);}), 0);        // play around adjusting timeout values.
              //setTimeout((function () {listeners[idx++].handleEvent(evt);}), 1);        // ... "" ...
              //setTimeout((function () {listeners[idx++].handleEvent(evt);}), idx);      // ... "" ...
              //setTimeout((function () {listeners[idx++].handleEvent(evt);}), (idx * 5));// ... "" ...

              //alternatively each object that implements the [EventTarget] interface might enclose calling its own [dispatchEvent] method into a timeout if necessary:
              // obj = {};
              // EventTargetProvider.register(obj);
              // var customEventListener = obj.addEventListener("customEvent", (function (evt) {print("onCustomEvent :\nevt : " + ((evt && ((evt.toSource && evt.toSource()) || evt.toString())) || evt) + "\n");}));
              // setTimeout((function () {obj.dispatchEvent("customEvent");}), 1);
              // obj.dispatchEvent("someOtherEvent");
              }
              successfully = true;
            }
          }
          return successfully;
        });
      });
    })(Handler.indexOf, Detect.isString, Detect.isFunction),

    target = (function () {var obj = {}; EventTargetMixin.call(obj); return obj;})(), // there will be never ever any [EventTarget] instances.

    TARGET = {
      addListenerString : ("" + target.addEventListener),
      removeListenerString : ("" + target.removeEventListener),
      hasListenerString : ("" + target.hasEventListener),
      dispatchEventString : ("" + target.dispatchEvent)
    };
    target = Handler = Detect = exposeImplementation = null;
    delete target; delete Handler; delete Detect; delete exposeImplementation;


  /*
    objects need to be registered and/or unsubscribed explicitly in order to
    apply/augment and/or withdraw/remove [EventTarget]-properties to/from them.
  */
    return {
      register: (function (obj/*:[Object]*/) { /*:void*/ // register | sign on

      //do not apply this customized [EventTarget] interface to DOM-[Node] or DOM-[Element] objects or to objects that already got augmented by this customized [EventTarget] features.
        if ((typeof obj.addEventListener != "function") && !obj.attachEvent && (typeof obj.removeEventListener != "function") && !obj.detachEvent && (typeof obj.dispatchEvent != "function") && !obj.fireEvent) {

          EventTargetMixin.call(obj); // applying the [EventTarget]Mixin - [obj] implements the [EventTarget] interface.
        }
        return obj;
      }),
      unsubscribe: (function (obj/*:[Object]*/) { /*:void*/ // unsubscribe | sign off

        if (("" + obj.addEventListener) == TARGET.addListenerString)  {
          delete obj.addEventListener;
        }
        if (("" + obj.removeEventListener) == TARGET.removeListenerString) {
          delete obj.removeEventListener;
        }
        if (("" + obj.hasEventListener) == TARGET.hasListenerString) {
          delete obj.hasEventListener;
        }
        if (("" + obj.dispatchEvent) == TARGET.dispatchEventString) {
          delete obj.dispatchEvent;
        }
      })
    };
  })(); // [EventTargetProvider] Module/Singleton becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.


  ns = null; delete ns;
  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_EventTargetProvider_is_supposed_to_be_bound_to]*/);



var getDump = ((Object.prototype.toSource && (function (obj) {return (obj && obj.toSource());})) || (function (obj) {return (obj && obj.toString());}));
//window.print = (((typeof window.print == "function") && window.print) || (window.console && window.console.log) || (function (msg) {alert(msg);}));

var obj = {};
EventTargetProvider.register(obj);
var customListener = obj.addEventListener("customEvent", (function (evt) {print("onCustomEvent :\ngetDump(evt) : " + getDump(evt) + "\n\n");}));
obj.dispatchEvent("customEvent");
obj.dispatchEvent({type:"customEvent"});
obj.dispatchEvent({type:"undefinedEvent"});
obj.dispatchEvent("undefinedEvent");
//obj.removeEventListener(customListener);

var xyHandler = (function (evt) {print("onCustomEvent :\ngetDump(evt) : " + getDump(evt) + "\n\n");});
var xListener = obj.addEventListener("customEvent", xyHandler);
var yListener = obj.addEventListener("customEvent", xyHandler);
print("\n(xListener === yListener) ? " + (xListener === yListener) + "\n\n");

obj.dispatchEvent({type:"customEvent"});

print("hasEventListener : " + obj.hasEventListener(customListener));
print("removeEventListener : " + obj.removeEventListener(customListener));
print("hasEventListener : " + obj.hasEventListener(customListener));
obj.dispatchEvent({type:"customEvent"});
print("removeEventListener : " + obj.removeEventListener(customListener));

print("hasEventListener : " + obj.hasEventListener(xListener.getType(), yListener.getHandler()));
print("removeEventListener : " + obj.removeEventListener(xListener.getType(), yListener.getHandler()));
print("hasEventListener : " + obj.hasEventListener(xListener.getType(), yListener.getHandler()));
obj.dispatchEvent({type:"customEvent"});
print("removeEventListener : " + obj.removeEventListener(xListener));
print("\n(xListener === yListener) ? " + (xListener === yListener) + "\n\n");

print(obj.removeEventListener(customListener));
obj.dispatchEvent({type:"customEvent"});
print(obj.removeEventListener(customListener));

print(obj.removeEventListener(xListener.getType(), yListener.getHandler()));
obj.dispatchEvent({type:"customEvent"});
print(obj.removeEventListener(xListener));
print("\n(xListener === yListener) ? " + (xListener === yListener) + "\n\n");

obj.addEventListener(customListener.getType(), customListener.getHandler());
obj.dispatchEvent(customListener.getType());


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only   - 4.086 byte : (additionally featuring [hasEventListener])
(function(ns){(ns||this)["EventTargetProvider"]=function(){var exposeImplementation=Object.prototype.toString,Detect={isString:function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+String\]$/,exposeImplementation),isFunction:function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"}},Handler={indexOf:function(arr,fct){var idx=arr.length;while(idx--)if(arr[idx]===fct)break;return idx}},Event=function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date},EventListener=function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=function(evt){if(evt&&typeof evt=="object"){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp};handler(evt)};this.getType=function(){return type};this.getHandler=function(){return handler}},EventTargetMixin=function(indexOf,isString,isFunction){return function(){var eventMap={},removeEventListener=function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully},hasEventListener=function(type,handler){return(eventMap[type]||false)&&indexOf(eventMap[type].handlers,handler)>=0};this.addEventListener=this.on=function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else reference=listeners[idx]}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference};this.removeEventListener=function(typeOrListener,handler){return isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler)||typeOrListener instanceof EventListener&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler())||false};this.hasEventListener=function(typeOrListener,handler){return isString(typeOrListener)&&isFunction(handler)&&hasEventListener(typeOrListener,handler)||typeOrListener instanceof EventListener&&hasEventListener(typeOrListener.getType(),typeOrListener.getHandler())||false};this.dispatchEvent=function(evt){var successfully=false,type=typeof evt=="object"&&typeof evt.type=="string"&&evt.type||typeof evt=="string"&&evt,event=type&&eventMap[type];if(event){var listeners=event&&event.listeners,len=listeners&&listeners.length||0,idx=0;if(len>=1){while(idx<len)listeners[idx++].handleEvent(evt);successfully=true}}return successfully}}}(Handler.indexOf,Detect.isString,Detect.isFunction),target=function(){var obj={};EventTargetMixin.call(obj);return obj}(),TARGET={addListenerString:""+target.addEventListener,removeListenerString:""+target.removeEventListener,hasListenerString:""+target.hasEventListener,dispatchEventString:""+target.dispatchEvent};target=Handler=Detect=exposeImplementation=null;delete target;delete Handler;delete Detect;delete exposeImplementation;return{register:function(obj){if(typeof obj.addEventListener!="function"&&!obj.attachEvent&&typeof obj.removeEventListener!="function"&&!obj.detachEvent&&typeof obj.dispatchEvent!="function"&&!obj.fireEvent)EventTargetMixin.call(obj);return obj},unsubscribe:function(obj){if(""+obj.addEventListener==TARGET.addListenerString)delete obj.addEventListener;if(""+obj.removeEventListener==TARGET.removeListenerString)delete obj.removeEventListener;if(""+obj.hasEventListener==TARGET.hasListenerString)delete obj.hasEventListener;if(""+obj.dispatchEvent==TARGET.dispatchEventString)delete obj.dispatchEvent}}}();ns=null;delete ns;delete arguments.callee}).call(null);

- Whitespace only   - 3.573 byte : (does not include [hasEventListener] functionality)
(function(ns){(ns||this)["EventTargetProvider"]=function(){var exposeImplementation=Object.prototype.toString,Detect={isString:function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+String\]$/,exposeImplementation),isFunction:function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"}},Handler={indexOf:function(arr,fct){var idx=arr.length;while(idx--)if(arr[idx]===fct)break;return idx}},Event=function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date},EventListener=function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=function(evt){if(evt&&typeof evt=="object"){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp};handler(evt)};this.getType=function(){return type};this.getHandler=function(){return handler}},EventTargetMixin=function(indexOf,isString,isFunction){return function(){var eventMap={},removeEventListener=function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully};this.addEventListener=this.on=function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else reference=listeners[idx]}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference};this.removeEventListener=function(typeOrListener,handler){return isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler)||typeOrListener instanceof EventListener&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler())||false};this.dispatchEvent=function(evt){var successfully=false,type=typeof evt=="object"&&typeof evt.type=="string"&&evt.type||typeof evt=="string"&&evt,event=type&&eventMap[type];if(event){var listeners=event&&event.listeners,len=listeners&&listeners.length||0,idx=0;if(len>=1){while(idx<len)listeners[idx++].handleEvent(evt);successfully=true}}return successfully}}}(Handler.indexOf,Detect.isString,Detect.isFunction),target=function(){var obj={};EventTargetMixin.call(obj);return obj}(),TARGET={addListenerString:""+target.addEventListener,removeListenerString:""+target.removeEventListener,dispatchEventString:""+target.dispatchEvent};target=Handler=Detect=exposeImplementation=null;delete target;delete Handler;delete Detect;delete exposeImplementation;return{register:function(obj){if(typeof obj.addEventListener!="function"&&!obj.attachEvent&&typeof obj.removeEventListener!="function"&&!obj.detachEvent&&typeof obj.dispatchEvent!="function"&&!obj.fireEvent)EventTargetMixin.call(obj);return obj},unsubscribe:function(obj){if(""+obj.addEventListener==TARGET.addListenerString)delete obj.addEventListener;if(""+obj.removeEventListener==TARGET.removeListenerString)delete obj.removeEventListener;if(""+obj.dispatchEvent==TARGET.dispatchEventString)delete obj.dispatchEvent}}}();ns=null;delete ns;delete arguments.callee}).call(null);



- Simple            - 2.633 byte : (additionally featuring [hasEventListener])
(function(m){(m||this).EventTargetProvider=function(){var q=Object.prototype.toString,n={isString:function(a,g){return function(h){return a.test(g.call(h))}}(/^\[object\s+String\]$/,q),isFunction:function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"}},r={indexOf:function(a,g){for(var h=a.length;h--;)if(a[h]===g)break;return h}},s=function(a,g){this.constructor=s;this.target=a;this.type=g;this.timeStamp=new Date},o=function(a,g,h){this.constructor=o;var f=new s(a,g);this.handleEvent=function(i){if(i&&typeof i=="object"){i.target=f.target;i.type=f.type;i.timeStamp=f.timeStamp}else i={target:f.target,type:f.type,timeStamp:f.timeStamp};h(i)};this.getType=function(){return g};this.getHandler=function(){return h}},u=function(a,g,h){return function(){var f={},i=function(b,d){var c=f[b],e=false;if(c){var j=c.handlers;c=c.listeners;var k=a(j,d);if(k>=0){j.splice(k,1);c.splice(k,1);e=true}}return e},t=function(b,d){return(f[b]||false)&&a(f[b].handlers,d)>=0};this.addEventListener=this.on=function(b,d){var c;if(b&&g(b)&&h(d)){var e=f[b];c=new o(this,b,d);if(e){var j=e.handlers;e=e.listeners;var k=a(j,d);if(k==-1){j.push(c.getHandler());e.push(c);c=c}else c=e[k]}else{e=f[b]={};e.handlers=[c.getHandler()];e.listeners=[c];c=c}}return c};this.removeEventListener=function(b,d){return g(b)&&h(d)&&i(b,d)||b instanceof o&&i(b.getType(),b.getHandler())||false};this.hasEventListener=function(b,d){return g(b)&&h(d)&&t(b,d)||b instanceof o&&t(b.getType(),b.getHandler())||false};this.dispatchEvent=function(b){var d=false,c=typeof b=="object"&&typeof b.type=="string"&&b.type||typeof b=="string"&&b;if(c=c&&f[c]){var e=(c=c&&c.listeners)&&c.length||0,j=0;if(e>=1){for(;j<e;)c[j++].handleEvent(b);d=true}}return d}}}(r.indexOf,n.isString,n.isFunction),l=function(){var a={};u.call(a);return a}(),p={addListenerString:""+l.addEventListener,removeListenerString:""+l.removeEventListener,hasListenerString:""+l.hasEventListener,dispatchEventString:""+l.dispatchEvent};l=r=n=q=null;delete l;delete r;delete n;delete q;return{register:function(a){typeof a.addEventListener!="function"&&!a.attachEvent&&typeof a.removeEventListener!="function"&&!a.detachEvent&&typeof a.dispatchEvent!="function"&&!a.fireEvent&&u.call(a);return a},unsubscribe:function(a){""+a.addEventListener==p.addListenerString&&delete a.addEventListener;""+a.removeEventListener==p.removeListenerString&&delete a.removeEventListener;""+a.hasEventListener==p.hasListenerString&&delete a.hasEventListener;""+a.dispatchEvent==p.dispatchEventString&&delete a.dispatchEvent}}}();m=null;delete m;delete arguments.callee}).call(null);

- Simple            - 2.346 byte : (does not include [hasEventListener] functionality)
(function(l){(l||this).EventTargetProvider=function(){var o=Object.prototype.toString,n={isString:function(a,e){return function(f){return a.test(e.call(f))}}(/^\[object\s+String\]$/,o),isFunction:function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"}},p={indexOf:function(a,e){for(var f=a.length;f--;)if(a[f]===e)break;return f}},s=function(a,e){this.constructor=s;this.target=a;this.type=e;this.timeStamp=new Date},q=function(a,e,f){this.constructor=q;var g=new s(a,e);this.handleEvent=function(i){if(i&&typeof i=="object"){i.target=g.target;i.type=g.type;i.timeStamp=g.timeStamp}else i={target:g.target,type:g.type,timeStamp:g.timeStamp};f(i)};this.getType=function(){return e};this.getHandler=function(){return f}},t=function(a,e,f){return function(){var g={},i=function(c,h){var b=g[c],d=false;if(b){var j=b.handlers;b=b.listeners;var k=a(j,h);if(k>=0){j.splice(k,1);b.splice(k,1);d=true}}return d};this.addEventListener=this.on=function(c,h){var b;if(c&&e(c)&&f(h)){var d=g[c];b=new q(this,c,h);if(d){var j=d.handlers;d=d.listeners;var k=a(j,h);if(k==-1){j.push(b.getHandler());d.push(b);b=b}else b=d[k]}else{d=g[c]={};d.handlers=[b.getHandler()];d.listeners=[b];b=b}}return b};this.removeEventListener=function(c,h){return e(c)&&f(h)&&i(c,h)||c instanceof q&&i(c.getType(),c.getHandler())||false};this.dispatchEvent=function(c){var h=false,b=typeof c=="object"&&typeof c.type=="string"&&c.type||typeof c=="string"&&c;if(b=b&&g[b]){var d=(b=b&&b.listeners)&&b.length||0,j=0;if(d>=1){for(;j<d;)b[j++].handleEvent(c);h=true}}return h}}}(p.indexOf,n.isString,n.isFunction),m=function(){var a={};t.call(a);return a}(),r={addListenerString:""+m.addEventListener,removeListenerString:""+m.removeEventListener,dispatchEventString:""+m.dispatchEvent};m=p=n=o=null;delete m;delete p;delete n;delete o;return{register:function(a){typeof a.addEventListener!="function"&&!a.attachEvent&&typeof a.removeEventListener!="function"&&!a.detachEvent&&typeof a.dispatchEvent!="function"&&!a.fireEvent&&t.call(a);return a},unsubscribe:function(a){""+a.addEventListener==r.addListenerString&&delete a.addEventListener;""+a.removeEventListener==r.removeListenerString&&delete a.removeEventListener;""+a.dispatchEvent==r.dispatchEventString&&delete a.dispatchEvent}}}();l=null;delete l;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]

  
- packed                      - 4.210 byte : (additionally featuring [hasEventListener])
(function(ns){(ns||this)["EventTargetProvider"]=(function(){var exposeImplementation=Object.prototype.toString,Detect={isString:(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+String\]$/),exposeImplementation),isFunction:(function(obj){return((typeof obj=="function")&&(typeof obj.call=="function")&&(typeof obj.apply=="function"))})},Handler={indexOf:(function(arr,fct){var idx=arr.length;while(idx--){if(arr[idx]===fct){break}}return idx})},Event=(function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date()}),EventListener=(function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=(function(evt){if(evt&&(typeof evt=="object")){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else{evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp}}handler(evt)});this.getType=(function(){return type});this.getHandler=(function(){return handler})}),EventTargetMixin=(function(indexOf,isString,isFunction){return(function(){var eventMap={},removeEventListener=(function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully}),hasEventListener=(function(type,handler){return((eventMap[type]||false)&&(indexOf(eventMap[type].handlers,handler)>=0))});this.addEventListener=this.on=(function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else{reference=listeners[idx]}}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference});this.removeEventListener=(function(typeOrListener,handler){return((isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler))||((typeOrListener instanceof EventListener)&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler()))||false)});this.hasEventListener=(function(typeOrListener,handler){return((isString(typeOrListener)&&isFunction(handler)&&hasEventListener(typeOrListener,handler))||((typeOrListener instanceof EventListener)&&hasEventListener(typeOrListener.getType(),typeOrListener.getHandler()))||false)});this.dispatchEvent=(function(evt){var successfully=false,type=(((typeof evt=="object")&&(typeof evt.type=="string")&&evt.type)||((typeof evt=="string")&&evt)),event=(type&&eventMap[type]);if(event){var listeners=(event&&event.listeners),len=((listeners&&listeners.length)||0),idx=0;if(len>=1){while(idx<len){listeners[idx++].handleEvent(evt)}successfully=true}}return successfully})})})(Handler.indexOf,Detect.isString,Detect.isFunction),target=(function(){var obj={};EventTargetMixin.call(obj);return obj})(),TARGET={addListenerString:(""+target.addEventListener),removeListenerString:(""+target.removeEventListener),hasListenerString:(""+target.hasEventListener),dispatchEventString:(""+target.dispatchEvent)};target=Handler=Detect=exposeImplementation=null;delete target;delete Handler;delete Detect;delete exposeImplementation;return{register:(function(obj){if((typeof obj.addEventListener!="function")&&!obj.attachEvent&&(typeof obj.removeEventListener!="function")&&!obj.detachEvent&&(typeof obj.dispatchEvent!="function")&&!obj.fireEvent){EventTargetMixin.call(obj)}return obj}),unsubscribe:(function(obj){if((""+obj.addEventListener)==TARGET.addListenerString){delete obj.addEventListener}if((""+obj.removeEventListener)==TARGET.removeListenerString){delete obj.removeEventListener}if((""+obj.hasEventListener)==TARGET.hasListenerString){delete obj.hasEventListener}if((""+obj.dispatchEvent)==TARGET.dispatchEventString){delete obj.dispatchEvent}})}})();ns=null;delete ns;delete arguments.callee}).call(null);

- packed                      - 3.677 byte : (does not include [hasEventListener] functionality)
(function(ns){(ns||this)["EventTargetProvider"]=(function(){var exposeImplementation=Object.prototype.toString,Detect={isString:(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+String\]$/),exposeImplementation),isFunction:(function(obj){return((typeof obj=="function")&&(typeof obj.call=="function")&&(typeof obj.apply=="function"))})},Handler={indexOf:(function(arr,fct){var idx=arr.length;while(idx--){if(arr[idx]===fct){break}}return idx})},Event=(function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date()}),EventListener=(function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=(function(evt){if(evt&&(typeof evt=="object")){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else{evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp}}handler(evt)});this.getType=(function(){return type});this.getHandler=(function(){return handler})}),EventTargetMixin=(function(indexOf,isString,isFunction){return(function(){var eventMap={},removeEventListener=(function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully});this.addEventListener=this.on=(function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else{reference=listeners[idx]}}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference});this.removeEventListener=(function(typeOrListener,handler){return((isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler))||((typeOrListener instanceof EventListener)&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler()))||false)});this.dispatchEvent=(function(evt){var successfully=false,type=(((typeof evt=="object")&&(typeof evt.type=="string")&&evt.type)||((typeof evt=="string")&&evt)),event=(type&&eventMap[type]);if(event){var listeners=(event&&event.listeners),len=((listeners&&listeners.length)||0),idx=0;if(len>=1){while(idx<len){listeners[idx++].handleEvent(evt)}successfully=true}}return successfully})})})(Handler.indexOf,Detect.isString,Detect.isFunction),target=(function(){var obj={};EventTargetMixin.call(obj);return obj})(),TARGET={addListenerString:(""+target.addEventListener),removeListenerString:(""+target.removeEventListener),dispatchEventString:(""+target.dispatchEvent)};target=Handler=Detect=exposeImplementation=null;delete target;delete Handler;delete Detect;delete exposeImplementation;return{register:(function(obj){if((typeof obj.addEventListener!="function")&&!obj.attachEvent&&(typeof obj.removeEventListener!="function")&&!obj.detachEvent&&(typeof obj.dispatchEvent!="function")&&!obj.fireEvent){EventTargetMixin.call(obj)}return obj}),unsubscribe:(function(obj){if((""+obj.addEventListener)==TARGET.addListenerString){delete obj.addEventListener}if((""+obj.removeEventListener)==TARGET.removeListenerString){delete obj.removeEventListener}if((""+obj.dispatchEvent)==TARGET.dispatchEventString){delete obj.dispatchEvent}})}})();ns=null;delete ns;delete arguments.callee}).call(null);



- packed / shrinked           - 3.260 byte : (additionally featuring [hasEventListener])
(function(k){(k||this).EventTargetProvider=(function(){var j=Object.prototype.toString,Detect={isString:(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+String\]$/),j),isFunction:(function(a){return((typeof a=="function")&&(typeof a.call=="function")&&(typeof a.apply=="function"))})},Handler={indexOf:(function(a,b){var c=a.length;while(c--){if(a[c]===b){break}}return c})},Event=(function(a,b){this.constructor=Event;this.target=a;this.type=b;this.timeStamp=new Date()}),EventListener=(function(b,c,d){this.constructor=EventListener;var e=new Event(b,c);this.handleEvent=(function(a){if(a&&(typeof a=="object")){a.target=e.target;a.type=e.type;a.timeStamp=e.timeStamp}else{a={target:e.target,type:e.type,timeStamp:e.timeStamp}}d(a)});this.getType=(function(){return c});this.getHandler=(function(){return d})}),EventTargetMixin=(function(g,h,i){return(function(){var f={},removeEventListener=(function(a,b){var c=f[a],successfully=false;if(c){var d=c.handlers,listeners=c.listeners,idx=g(d,b);if(idx>=0){d.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully}),hasEventListener=(function(a,b){return((f[a]||false)&&(g(f[a].handlers,b)>=0))});this.addEventListener=this.on=(function(a,b){var c;if(a&&h(a)&&i(b)){var d=f[a],listener=new EventListener(this,a,b);if(d){var e=d.handlers,listeners=d.listeners,idx=g(e,b);if(idx==-1){e.push(listener.getHandler());listeners.push(listener);c=listener}else{c=listeners[idx]}}else{d=f[a]={};d.handlers=[listener.getHandler()];d.listeners=[listener];c=listener}}return c});this.removeEventListener=(function(a,b){return((h(a)&&i(b)&&removeEventListener(a,b))||((a instanceof EventListener)&&removeEventListener(a.getType(),a.getHandler()))||false)});this.hasEventListener=(function(a,b){return((h(a)&&i(b)&&hasEventListener(a,b))||((a instanceof EventListener)&&hasEventListener(a.getType(),a.getHandler()))||false)});this.dispatchEvent=(function(a){var b=false,type=(((typeof a=="object")&&(typeof a.type=="string")&&a.type)||((typeof a=="string")&&a)),event=(type&&f[type]);if(event){var c=(event&&event.listeners),len=((c&&c.length)||0),idx=0;if(len>=1){while(idx<len){c[idx++].handleEvent(a)}b=true}}return b})})})(Handler.indexOf,Detect.isString,Detect.isFunction),target=(function(){var a={};EventTargetMixin.call(a);return a})(),TARGET={addListenerString:(""+target.addEventListener),removeListenerString:(""+target.removeEventListener),hasListenerString:(""+target.hasEventListener),dispatchEventString:(""+target.dispatchEvent)};target=Handler=Detect=j=null;delete target;delete Handler;delete Detect;delete j;return{register:(function(a){if((typeof a.addEventListener!="function")&&!a.attachEvent&&(typeof a.removeEventListener!="function")&&!a.detachEvent&&(typeof a.dispatchEvent!="function")&&!a.fireEvent){EventTargetMixin.call(a)}return a}),unsubscribe:(function(a){if((""+a.addEventListener)==TARGET.addListenerString){delete a.addEventListener}if((""+a.removeEventListener)==TARGET.removeListenerString){delete a.removeEventListener}if((""+a.hasEventListener)==TARGET.hasListenerString){delete a.hasEventListener}if((""+a.dispatchEvent)==TARGET.dispatchEventString){delete a.dispatchEvent}})}})();k=null;delete k;delete arguments.callee}).call(null);

- packed / shrinked           - 2.884 byte : (does not include [hasEventListener] functionality)
(function(k){(k||this).EventTargetProvider=(function(){var j=Object.prototype.toString,Detect={isString:(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+String\]$/),j),isFunction:(function(a){return((typeof a=="function")&&(typeof a.call=="function")&&(typeof a.apply=="function"))})},Handler={indexOf:(function(a,b){var c=a.length;while(c--){if(a[c]===b){break}}return c})},Event=(function(a,b){this.constructor=Event;this.target=a;this.type=b;this.timeStamp=new Date()}),EventListener=(function(b,c,d){this.constructor=EventListener;var e=new Event(b,c);this.handleEvent=(function(a){if(a&&(typeof a=="object")){a.target=e.target;a.type=e.type;a.timeStamp=e.timeStamp}else{a={target:e.target,type:e.type,timeStamp:e.timeStamp}}d(a)});this.getType=(function(){return c});this.getHandler=(function(){return d})}),EventTargetMixin=(function(g,h,i){return(function(){var f={},removeEventListener=(function(a,b){var c=f[a],successfully=false;if(c){var d=c.handlers,listeners=c.listeners,idx=g(d,b);if(idx>=0){d.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully});this.addEventListener=this.on=(function(a,b){var c;if(a&&h(a)&&i(b)){var d=f[a],listener=new EventListener(this,a,b);if(d){var e=d.handlers,listeners=d.listeners,idx=g(e,b);if(idx==-1){e.push(listener.getHandler());listeners.push(listener);c=listener}else{c=listeners[idx]}}else{d=f[a]={};d.handlers=[listener.getHandler()];d.listeners=[listener];c=listener}}return c});this.removeEventListener=(function(a,b){return((h(a)&&i(b)&&removeEventListener(a,b))||((a instanceof EventListener)&&removeEventListener(a.getType(),a.getHandler()))||false)});this.dispatchEvent=(function(a){var b=false,type=(((typeof a=="object")&&(typeof a.type=="string")&&a.type)||((typeof a=="string")&&a)),event=(type&&f[type]);if(event){var c=(event&&event.listeners),len=((c&&c.length)||0),idx=0;if(len>=1){while(idx<len){c[idx++].handleEvent(a)}b=true}}return b})})})(Handler.indexOf,Detect.isString,Detect.isFunction),target=(function(){var a={};EventTargetMixin.call(a);return a})(),TARGET={addListenerString:(""+target.addEventListener),removeListenerString:(""+target.removeEventListener),dispatchEventString:(""+target.dispatchEvent)};target=Handler=Detect=j=null;delete target;delete Handler;delete Detect;delete j;return{register:(function(a){if((typeof a.addEventListener!="function")&&!a.attachEvent&&(typeof a.removeEventListener!="function")&&!a.detachEvent&&(typeof a.dispatchEvent!="function")&&!a.fireEvent){EventTargetMixin.call(a)}return a}),unsubscribe:(function(a){if((""+a.addEventListener)==TARGET.addListenerString){delete a.addEventListener}if((""+a.removeEventListener)==TARGET.removeListenerString){delete a.removeEventListener}if((""+a.dispatchEvent)==TARGET.dispatchEventString){delete a.dispatchEvent}})}})();k=null;delete k;delete arguments.callee}).call(null);



- packed / shrinked / encoded - 2.347 byte : (additionally featuring [hasEventListener])
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(k){(k||4).18=(2(){7 j=1a.13.14,t={Y:(2(b,c){3(2(a){3 b.1c(c.y(a))})})((/^\\[E\\s+16\\]$/),j),10:(2(a){3((m a=="2")&&(m a.y=="2")&&(m a.1b=="2"))})},B={P:(2(a,b){7 c=a.11;Z(c--){5(a[c]===b){17}}3 c})},L=(2(a,b){4.12=L;4.6=a;4.8=b;4.v=G 15()}),z=(2(b,c,d){4.12=z;7 e=G L(b,c);4.R=(2(a){5(a&&(m a=="E")){a.6=e.6;a.8=e.8;a.v=e.v}I{a={6:e.6,8:e.8,v:e.v}}d(a)});4.H=(2(){3 c});4.A=(2(){3 d})}),K=(2(g,h,i){3(2(){7 f={},o=(2(a,b){7 c=f[a],M=w;5(c){7 d=c.D,n=c.n,9=g(d,b);5(9>=0){d.S(9,1);n.S(9,1);M=X}}3 M}),p=(2(a,b){3((f[a]||w)&&(g(f[a].D,b)>=0))});4.r=4.19=(2(a,b){7 c;5(a&&h(a)&&i(b)){7 d=f[a],q=G z(4,a,b);5(d){7 e=d.D,n=d.n,9=g(e,b);5(9==-1){e.N(q.A());n.N(q);c=q}I{c=n[9]}}I{d=f[a]={};d.D=[q.A()];d.n=[q];c=q}}3 c});4.o=(2(a,b){3((h(a)&&i(b)&&o(a,b))||((a O z)&&o(a.H(),a.A()))||w)});4.p=(2(a,b){3((h(a)&&i(b)&&p(a,b))||((a O z)&&p(a.H(),a.A()))||w)});4.x=(2(a){7 b=w,8=(((m a=="E")&&(m a.8=="Q")&&a.8)||((m a=="Q")&&a)),C=(8&&f[8]);5(C){7 c=(C&&C.n),F=((c&&c.11)||0),9=0;5(F>=1){Z(9<F){c[9++].R(a)}b=X}}3 b})})})(B.P,t.Y,t.10),6=(2(){7 a={};K.y(a);3 a})(),u={U:(""+6.r),V:(""+6.o),W:(""+6.p),T:(""+6.x)};6=B=t=j=J;l 6;l B;l t;l j;3{1d:(2(a){5((m a.r!="2")&&!a.1e&&(m a.o!="2")&&!a.1f&&(m a.x!="2")&&!a.1g){K.y(a)}3 a}),1h:(2(a){5((""+a.r)==u.U){l a.r}5((""+a.o)==u.V){l a.o}5((""+a.p)==u.W){l a.p}5((""+a.x)==u.T){l a.x}})}})();k=J;l k;l 1i.1j}).y(J);',62,82,'||function|return|this|if|target|var|type|idx||||||||||||delete|typeof|listeners|removeEventListener|hasEventListener|listener|addEventListener||Detect|TARGET|timeStamp|false|dispatchEvent|call|EventListener|getHandler|Handler|event|handlers|object|len|new|getType|else|null|EventTargetMixin|Event|successfully|push|instanceof|indexOf|string|handleEvent|splice|dispatchEventString|addListenerString|removeListenerString|hasListenerString|true|isString|while|isFunction|length|constructor|prototype|toString|Date|String|break|EventTargetProvider|on|Object|apply|test|register|attachEvent|detachEvent|fireEvent|unsubscribe|arguments|callee'.split('|'),0,{}));

- packed / shrinked / encoded - 2.162 byte : (does not include [hasEventListener] functionality)
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(k){(k||3).14=(2(){6 j=15.1a.10,r={S:(2(b,c){4(2(a){4 b.13(c.t(a))})})((/^\\[I\\s+17\\]$/),j),R:(2(a){4((8 a=="2")&&(8 a.t=="2")&&(8 a.12=="2"))})},w={T:(2(a,b){6 c=a.V;O(c--){5(a[c]===b){18}}4 c})},D=(2(a,b){3.W=D;3.7=a;3.9=b;3.v=B 16()}),A=(2(b,c,d){3.W=A;6 e=B D(b,c);3.X=(2(a){5(a&&(8 a=="I")){a.7=e.7;a.9=e.9;a.v=e.v}J{a={7:e.7,9:e.9,v:e.v}}d(a)});3.Y=(2(){4 c});3.z=(2(){4 d})}),C=(2(g,h,i){4(2(){6 f={},o=(2(a,b){6 c=f[a],F=G;5(c){6 d=c.H,n=c.n,l=g(d,b);5(l>=0){d.L(l,1);n.L(l,1);F=Z}}4 F});3.u=3.19=(2(a,b){6 c;5(a&&h(a)&&i(b)){6 d=f[a],p=B A(3,a,b);5(d){6 e=d.H,n=d.n,l=g(e,b);5(l==-1){e.M(p.z());n.M(p);c=p}J{c=n[l]}}J{d=f[a]={};d.H=[p.z()];d.n=[p];c=p}}4 c});3.o=(2(a,b){4((h(a)&&i(b)&&o(a,b))||((a 11 A)&&o(a.Y(),a.z()))||G)});3.q=(2(a){6 b=G,9=(((8 a=="I")&&(8 a.9=="N")&&a.9)||((8 a=="N")&&a)),x=(9&&f[9]);5(x){6 c=(x&&x.n),E=((c&&c.V)||0),l=0;5(E>=1){O(l<E){c[l++].X(a)}b=Z}}4 b})})})(w.T,r.S,r.R),7=(2(){6 a={};C.t(a);4 a})(),y={P:(""+7.u),U:(""+7.o),Q:(""+7.q)};7=w=r=j=K;m 7;m w;m r;m j;4{1b:(2(a){5((8 a.u!="2")&&!a.1c&&(8 a.o!="2")&&!a.1d&&(8 a.q!="2")&&!a.1e){C.t(a)}4 a}),1f:(2(a){5((""+a.u)==y.P){m a.u}5((""+a.o)==y.U){m a.o}5((""+a.q)==y.Q){m a.q}})}})();k=K;m k;m 1g.1h}).t(K);',62,80,'||function|this|return|if|var|target|typeof|type||||||||||||idx|delete|listeners|removeEventListener|listener|dispatchEvent|Detect||call|addEventListener|timeStamp|Handler|event|TARGET|getHandler|EventListener|new|EventTargetMixin|Event|len|successfully|false|handlers|object|else|null|splice|push|string|while|addListenerString|dispatchEventString|isFunction|isString|indexOf|removeListenerString|length|constructor|handleEvent|getType|true|toString|instanceof|apply|test|EventTargetProvider|Object|Date|String|break|on|prototype|register|attachEvent|detachEvent|fireEvent|unsubscribe|arguments|callee'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 2.131 byte : (additionally featuring [hasEventListener]);
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(m){(m||4).14=2(){5 q=1h.11.1g,n={U:2(a,g){3 2(h){3 a.1f(g.x(h))}}(/^\\[H\\s+13\\]$/,q),T:2(a){3 6 a=="2"&&6 a.x=="2"&&6 a.1e=="2"}},r={M:2(a,g){Z(5 h=a.L;h--;)8(a[h]===g)18;3 h}},s=2(a,g){4.P=s;4.C=a;4.9=g;4.A=K 19},o=2(a,g,h){4.P=o;5 f=K s(a,g);4.N=2(i){8(i&&6 i=="H"){i.C=f.C;i.9=f.9;i.A=f.A}G i={C:f.C,9:f.9,A:f.A};h(i)};4.I=2(){3 g};4.w=2(){3 h}},u=2(a,g,h){3 2(){5 f={},i=2(b,d){5 c=f[b],e=y;8(c){5 j=c.E;c=c.D;5 k=a(j,d);8(k>=0){j.Q(k,1);c.Q(k,1);e=S}}3 e},t=2(b,d){3(f[b]||y)&&a(f[b].E,d)>=0};4.v=4.12=2(b,d){5 c;8(b&&g(b)&&h(d)){5 e=f[b];c=K o(4,b,d);8(e){5 j=e.E;e=e.D;5 k=a(j,d);8(k==-1){j.W(c.w());e.W(c);c=c}G c=e[k]}G{e=f[b]={};e.E=[c.w()];e.D=[c];c=c}}3 c};4.B=2(b,d){3 g(b)&&h(d)&&i(b,d)||b Y o&&i(b.I(),b.w())||y};4.F=2(b,d){3 g(b)&&h(d)&&t(b,d)||b Y o&&t(b.I(),b.w())||y};4.z=2(b){5 d=y,c=6 b=="H"&&6 b.9=="10"&&b.9||6 b=="10"&&b;8(c=c&&f[c]){5 e=(c=c&&c.D)&&c.L||0,j=0;8(e>=1){Z(;j<e;)c[j++].N(b);d=S}}3 d}}}(r.M,n.U,n.T),l=2(){5 a={};u.x(a);3 a}(),p={V:""+l.v,O:""+l.B,X:""+l.F,R:""+l.z};l=r=n=q=J;7 l;7 r;7 n;7 q;3{1d:2(a){6 a.v!="2"&&!a.15&&6 a.B!="2"&&!a.1c&&6 a.z!="2"&&!a.16&&u.x(a);3 a},1b:2(a){""+a.v==p.V&&7 a.v;""+a.B==p.O&&7 a.B;""+a.F==p.X&&7 a.F;""+a.z==p.R&&7 a.z}}}();m=J;7 m;7 17.1a}).x(J);',62,80,'||function|return|this|var|typeof|delete|if|type||||||||||||||||||||||addEventListener|getHandler|call|false|dispatchEvent|timeStamp|removeEventListener|target|listeners|handlers|hasEventListener|else|object|getType|null|new|length|indexOf|handleEvent|removeListenerString|constructor|splice|dispatchEventString|true|isFunction|isString|addListenerString|push|hasListenerString|instanceof|for|string|prototype|on|String|EventTargetProvider|attachEvent|fireEvent|arguments|break|Date|callee|unsubscribe|detachEvent|register|apply|test|toString|Object'.split('|'),0,{}));

- combined                    - 1.967 byte : (does not include [hasEventListener] functionality)
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(l){(l||5).1d=2(){3 o=Y.1c.Z,n={J:2(a,e){4 2(f){4 a.15(e.z(f))}}(/^\\[D\\s+16\\]$/,o),K:2(a){4 6 a=="2"&&6 a.z=="2"&&6 a.1a=="2"}},p={T:2(a,e){U(3 f=a.W;f--;)7(a[f]===e)10;4 f}},s=2(a,e){5.O=s;5.w=a;5.9=e;5.x=F 1b},q=2(a,e,f){5.O=q;3 g=F s(a,e);5.M=2(i){7(i&&6 i=="D"){i.w=g.w;i.9=g.9;i.x=g.x}H i={w:g.w,9:g.9,x:g.x};f(i)};5.P=2(){4 e};5.B=2(){4 f}},t=2(a,e,f){4 2(){3 g={},i=2(c,h){3 b=g[c],d=G;7(b){3 j=b.C;b=b.A;3 k=a(j,h);7(k>=0){j.Q(k,1);b.Q(k,1);d=S}}4 d};5.v=5.X=2(c,h){3 b;7(c&&e(c)&&f(h)){3 d=g[c];b=F q(5,c,h);7(d){3 j=d.C;d=d.A;3 k=a(j,h);7(k==-1){j.V(b.B());d.V(b);b=b}H b=d[k]}H{d=g[c]={};d.C=[b.B()];d.A=[b];b=b}}4 b};5.y=2(c,h){4 e(c)&&f(h)&&i(c,h)||c 1e q&&i(c.P(),c.B())||G};5.u=2(c){3 h=G,b=6 c=="D"&&6 c.9=="R"&&c.9||6 c=="R"&&c;7(b=b&&g[b]){3 d=(b=b&&b.A)&&b.W||0,j=0;7(d>=1){U(;j<d;)b[j++].M(c);h=S}}4 h}}}(p.T,n.J,n.K),m=2(){3 a={};t.z(a);4 a}(),r={L:""+m.v,I:""+m.y,N:""+m.u};m=p=n=o=E;8 m;8 p;8 n;8 o;4{11:2(a){6 a.v!="2"&&!a.19&&6 a.y!="2"&&!a.12&&6 a.u!="2"&&!a.18&&t.z(a);4 a},13:2(a){""+a.v==r.L&&8 a.v;""+a.y==r.I&&8 a.y;""+a.u==r.N&&8 a.u}}}();l=E;8 l;8 17.14}).z(E);',62,77,'||function|var|return|this|typeof|if|delete|type|||||||||||||||||||||dispatchEvent|addEventListener|target|timeStamp|removeEventListener|call|listeners|getHandler|handlers|object|null|new|false|else|removeListenerString|isString|isFunction|addListenerString|handleEvent|dispatchEventString|constructor|getType|splice|string|true|indexOf|for|push|length|on|Object|toString|break|register|detachEvent|unsubscribe|callee|test|String|arguments|fireEvent|attachEvent|apply|Date|prototype|EventTargetProvider|instanceof'.split('|'),0,{}));


*/
