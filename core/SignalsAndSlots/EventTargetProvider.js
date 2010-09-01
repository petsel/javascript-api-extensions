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


(function (ns/*[custom_namespace]*/) {
  var sh = this/*[global_object|scripting_host]*/;


  (ns||sh)["EventTargetProvider"] = (function () { // [EventTargetProvider] Module/Singleton becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.


    var Detect = { // typedetection
      isString :(function (regXBaseClass, expose) {
        return (function (obj/*:[object|value]*/) { /*:[true|false]*/

          return regXBaseClass.test(expose.call(obj));
        });
      })((/^\[object\s+String\]$/), sh.Object.prototype.toString),

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
    target = Handler = Detect = null;
    delete target; delete Handler; delete Detect;


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


  sh = ns = null;
  delete sh; delete ns;


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


- Whitespace only   - 4.021 byte : (additionally featuring [hasEventListener])
(function(ns){var sh=this;(ns||sh)["EventTargetProvider"]=function(){var Detect={isString:function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+String\]$/,sh.Object.prototype.toString),isFunction:function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"}},Handler={indexOf:function(arr,fct){var idx=arr.length;while(idx--)if(arr[idx]===fct)break;return idx}},Event=function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date},EventListener=function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=function(evt){if(evt&&typeof evt=="object"){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp};handler(evt)};this.getType=function(){return type};this.getHandler=function(){return handler}},EventTargetMixin=function(indexOf,isString,isFunction){return function(){var eventMap={},removeEventListener=function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully},hasEventListener=function(type,handler){return(eventMap[type]||false)&&indexOf(eventMap[type].handlers,handler)>=0};this.addEventListener=this.on=function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else reference=listeners[idx]}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference};this.removeEventListener=function(typeOrListener,handler){return isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler)||typeOrListener instanceof EventListener&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler())||false};this.hasEventListener=function(typeOrListener,handler){return isString(typeOrListener)&&isFunction(handler)&&hasEventListener(typeOrListener,handler)||typeOrListener instanceof EventListener&&hasEventListener(typeOrListener.getType(),typeOrListener.getHandler())||false};this.dispatchEvent=function(evt){var successfully=false,type=typeof evt=="object"&&typeof evt.type=="string"&&evt.type||typeof evt=="string"&&evt,event=type&&eventMap[type];if(event){var listeners=event&&event.listeners,len=listeners&&listeners.length||0,idx=0;if(len>=1){while(idx<len)listeners[idx++].handleEvent(evt);successfully=true}}return successfully}}}(Handler.indexOf,Detect.isString,Detect.isFunction),target=function(){var obj={};EventTargetMixin.call(obj);return obj}(),TARGET={addListenerString:""+target.addEventListener,removeListenerString:""+target.removeEventListener,hasListenerString:""+target.hasEventListener,dispatchEventString:""+target.dispatchEvent};target=Handler=Detect=null;delete target;delete Handler;delete Detect;return{register:function(obj){if(typeof obj.addEventListener!="function"&&!obj.attachEvent&&typeof obj.removeEventListener!="function"&&!obj.detachEvent&&typeof obj.dispatchEvent!="function"&&!obj.fireEvent)EventTargetMixin.call(obj);return obj},unsubscribe:function(obj){if(""+obj.addEventListener==TARGET.addListenerString)delete obj.addEventListener;if(""+obj.removeEventListener==TARGET.removeListenerString)delete obj.removeEventListener;if(""+obj.hasEventListener==TARGET.hasListenerString)delete obj.hasEventListener;if(""+obj.dispatchEvent==TARGET.dispatchEventString)delete obj.dispatchEvent}}}();sh=ns=null;delete sh;delete ns;delete arguments.callee}).call(null);

- Whitespace only   - 3.508 byte : (does not include [hasEventListener] functionality)
(function(ns){var sh=this;(ns||sh)["EventTargetProvider"]=function(){var Detect={isString:function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+String\]$/,sh.Object.prototype.toString),isFunction:function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"}},Handler={indexOf:function(arr,fct){var idx=arr.length;while(idx--)if(arr[idx]===fct)break;return idx}},Event=function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date},EventListener=function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=function(evt){if(evt&&typeof evt=="object"){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp};handler(evt)};this.getType=function(){return type};this.getHandler=function(){return handler}},EventTargetMixin=function(indexOf,isString,isFunction){return function(){var eventMap={},removeEventListener=function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully};this.addEventListener=this.on=function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else reference=listeners[idx]}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference};this.removeEventListener=function(typeOrListener,handler){return isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler)||typeOrListener instanceof EventListener&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler())||false};this.dispatchEvent=function(evt){var successfully=false,type=typeof evt=="object"&&typeof evt.type=="string"&&evt.type||typeof evt=="string"&&evt,event=type&&eventMap[type];if(event){var listeners=event&&event.listeners,len=listeners&&listeners.length||0,idx=0;if(len>=1){while(idx<len)listeners[idx++].handleEvent(evt);successfully=true}}return successfully}}}(Handler.indexOf,Detect.isString,Detect.isFunction),target=function(){var obj={};EventTargetMixin.call(obj);return obj}(),TARGET={addListenerString:""+target.addEventListener,removeListenerString:""+target.removeEventListener,dispatchEventString:""+target.dispatchEvent};target=Handler=Detect=null;delete target;delete Handler;delete Detect;return{register:function(obj){if(typeof obj.addEventListener!="function"&&!obj.attachEvent&&typeof obj.removeEventListener!="function"&&!obj.detachEvent&&typeof obj.dispatchEvent!="function"&&!obj.fireEvent)EventTargetMixin.call(obj);return obj},unsubscribe:function(obj){if(""+obj.addEventListener==TARGET.addListenerString)delete obj.addEventListener;if(""+obj.removeEventListener==TARGET.removeListenerString)delete obj.removeEventListener;if(""+obj.dispatchEvent==TARGET.dispatchEventString)delete obj.dispatchEvent}}}();sh=ns=null;delete sh;delete ns;delete arguments.callee}).call(null);



- Simple            - 2.639 byte : (additionally featuring [hasEventListener])
(function(q){var m=this;(q||m).EventTargetProvider=function(){var n={isString:function(a,g){return function(h){return a.test(g.call(h))}}(/^\[object\s+String\]$/,m.Object.prototype.toString),isFunction:function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"}},r={indexOf:function(a,g){for(var h=a.length;h--;)if(a[h]===g)break;return h}},s=function(a,g){this.constructor=s;this.target=a;this.type=g;this.timeStamp=new Date},o=function(a,g,h){this.constructor=o;var f=new s(a,g);this.handleEvent=function(i){if(i&&typeof i=="object"){i.target=f.target;i.type=f.type;i.timeStamp=f.timeStamp}else i={target:f.target,type:f.type,timeStamp:f.timeStamp};h(i)};this.getType=function(){return g};this.getHandler=function(){return h}},u=function(a,g,h){return function(){var f={},i=function(b,d){var c=f[b],e=false;if(c){var j=c.handlers;c=c.listeners;var k=a(j,d);if(k>=0){j.splice(k,1);c.splice(k,1);e=true}}return e},t=function(b,d){return(f[b]||false)&&a(f[b].handlers,d)>=0};this.addEventListener=this.on=function(b,d){var c;if(b&&g(b)&&h(d)){var e=f[b];c=new o(this,b,d);if(e){var j=e.handlers;e=e.listeners;var k=a(j,d);if(k==-1){j.push(c.getHandler());e.push(c);c=c}else c=e[k]}else{e=f[b]={};e.handlers=[c.getHandler()];e.listeners=[c];c=c}}return c};this.removeEventListener=function(b,d){return g(b)&&h(d)&&i(b,d)||b instanceof o&&i(b.getType(),b.getHandler())||false};this.hasEventListener=function(b,d){return g(b)&&h(d)&&t(b,d)||b instanceof o&&t(b.getType(),b.getHandler())||false};this.dispatchEvent=function(b){var d=false,c=typeof b=="object"&&typeof b.type=="string"&&b.type||typeof b=="string"&&b;if(c=c&&f[c]){var e=(c=c&&c.listeners)&&c.length||0,j=0;if(e>=1){for(;j<e;)c[j++].handleEvent(b);d=true}}return d}}}(r.indexOf,n.isString,n.isFunction),l=function(){var a={};u.call(a);return a}(),p={addListenerString:""+l.addEventListener,removeListenerString:""+l.removeEventListener,hasListenerString:""+l.hasEventListener,dispatchEventString:""+l.dispatchEvent};l=r=n=null;delete l;delete r;delete n;return{register:function(a){typeof a.addEventListener!="function"&&!a.attachEvent&&typeof a.removeEventListener!="function"&&!a.detachEvent&&typeof a.dispatchEvent!="function"&&!a.fireEvent&&u.call(a);return a},unsubscribe:function(a){""+a.addEventListener==p.addListenerString&&delete a.addEventListener;""+a.removeEventListener==p.removeListenerString&&delete a.removeEventListener;""+a.hasEventListener==p.hasListenerString&&delete a.hasEventListener;""+a.dispatchEvent==p.dispatchEventString&&delete a.dispatchEvent}}}();m=q=null;delete m;delete q;delete arguments.callee}).call(null);

- Simple            - 2.352 byte : (does not include [hasEventListener] functionality)
(function(o){var m=this;(o||m).EventTargetProvider=function(){var n={isString:function(a,e){return function(f){return a.test(e.call(f))}}(/^\[object\s+String\]$/,m.Object.prototype.toString),isFunction:function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"}},p={indexOf:function(a,e){for(var f=a.length;f--;)if(a[f]===e)break;return f}},s=function(a,e){this.constructor=s;this.target=a;this.type=e;this.timeStamp=new Date},q=function(a,e,f){this.constructor=q;var g=new s(a,e);this.handleEvent=function(i){if(i&&typeof i=="object"){i.target=g.target;i.type=g.type;i.timeStamp=g.timeStamp}else i={target:g.target,type:g.type,timeStamp:g.timeStamp};f(i)};this.getType=function(){return e};this.getHandler=function(){return f}},t=function(a,e,f){return function(){var g={},i=function(c,h){var b=g[c],d=false;if(b){var j=b.handlers;b=b.listeners;var k=a(j,h);if(k>=0){j.splice(k,1);b.splice(k,1);d=true}}return d};this.addEventListener=this.on=function(c,h){var b;if(c&&e(c)&&f(h)){var d=g[c];b=new q(this,c,h);if(d){var j=d.handlers;d=d.listeners;var k=a(j,h);if(k==-1){j.push(b.getHandler());d.push(b);b=b}else b=d[k]}else{d=g[c]={};d.handlers=[b.getHandler()];d.listeners=[b];b=b}}return b};this.removeEventListener=function(c,h){return e(c)&&f(h)&&i(c,h)||c instanceof q&&i(c.getType(),c.getHandler())||false};this.dispatchEvent=function(c){var h=false,b=typeof c=="object"&&typeof c.type=="string"&&c.type||typeof c=="string"&&c;if(b=b&&g[b]){var d=(b=b&&b.listeners)&&b.length||0,j=0;if(d>=1){for(;j<d;)b[j++].handleEvent(c);h=true}}return h}}}(p.indexOf,n.isString,n.isFunction),l=function(){var a={};t.call(a);return a}(),r={addListenerString:""+l.addEventListener,removeListenerString:""+l.removeEventListener,dispatchEventString:""+l.dispatchEvent};l=p=n=null;delete l;delete p;delete n;return{register:function(a){typeof a.addEventListener!="function"&&!a.attachEvent&&typeof a.removeEventListener!="function"&&!a.detachEvent&&typeof a.dispatchEvent!="function"&&!a.fireEvent&&t.call(a);return a},unsubscribe:function(a){""+a.addEventListener==r.addListenerString&&delete a.addEventListener;""+a.removeEventListener==r.removeListenerString&&delete a.removeEventListener;""+a.dispatchEvent==r.dispatchEventString&&delete a.dispatchEvent}}}();m=o=null;delete m;delete o;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]

  
- packed                      - 4.145 byte : (additionally featuring [hasEventListener])
(function(ns){var sh=this;(ns||sh)["EventTargetProvider"]=(function(){var Detect={isString:(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+String\]$/),sh.Object.prototype.toString),isFunction:(function(obj){return((typeof obj=="function")&&(typeof obj.call=="function")&&(typeof obj.apply=="function"))})},Handler={indexOf:(function(arr,fct){var idx=arr.length;while(idx--){if(arr[idx]===fct){break}}return idx})},Event=(function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date()}),EventListener=(function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=(function(evt){if(evt&&(typeof evt=="object")){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else{evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp}}handler(evt)});this.getType=(function(){return type});this.getHandler=(function(){return handler})}),EventTargetMixin=(function(indexOf,isString,isFunction){return(function(){var eventMap={},removeEventListener=(function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully}),hasEventListener=(function(type,handler){return((eventMap[type]||false)&&(indexOf(eventMap[type].handlers,handler)>=0))});this.addEventListener=this.on=(function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else{reference=listeners[idx]}}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference});this.removeEventListener=(function(typeOrListener,handler){return((isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler))||((typeOrListener instanceof EventListener)&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler()))||false)});this.hasEventListener=(function(typeOrListener,handler){return((isString(typeOrListener)&&isFunction(handler)&&hasEventListener(typeOrListener,handler))||((typeOrListener instanceof EventListener)&&hasEventListener(typeOrListener.getType(),typeOrListener.getHandler()))||false)});this.dispatchEvent=(function(evt){var successfully=false,type=(((typeof evt=="object")&&(typeof evt.type=="string")&&evt.type)||((typeof evt=="string")&&evt)),event=(type&&eventMap[type]);if(event){var listeners=(event&&event.listeners),len=((listeners&&listeners.length)||0),idx=0;if(len>=1){while(idx<len){listeners[idx++].handleEvent(evt)}successfully=true}}return successfully})})})(Handler.indexOf,Detect.isString,Detect.isFunction),target=(function(){var obj={};EventTargetMixin.call(obj);return obj})(),TARGET={addListenerString:(""+target.addEventListener),removeListenerString:(""+target.removeEventListener),hasListenerString:(""+target.hasEventListener),dispatchEventString:(""+target.dispatchEvent)};target=Handler=Detect=null;delete target;delete Handler;delete Detect;return{register:(function(obj){if((typeof obj.addEventListener!="function")&&!obj.attachEvent&&(typeof obj.removeEventListener!="function")&&!obj.detachEvent&&(typeof obj.dispatchEvent!="function")&&!obj.fireEvent){EventTargetMixin.call(obj)}return obj}),unsubscribe:(function(obj){if((""+obj.addEventListener)==TARGET.addListenerString){delete obj.addEventListener}if((""+obj.removeEventListener)==TARGET.removeListenerString){delete obj.removeEventListener}if((""+obj.hasEventListener)==TARGET.hasListenerString){delete obj.hasEventListener}if((""+obj.dispatchEvent)==TARGET.dispatchEventString){delete obj.dispatchEvent}})}})();sh=ns=null;delete sh;delete ns;delete arguments.callee}).call(null);

- packed                      - 3.612 byte : (does not include [hasEventListener] functionality)
(function(ns){var sh=this;(ns||sh)["EventTargetProvider"]=(function(){var Detect={isString:(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+String\]$/),sh.Object.prototype.toString),isFunction:(function(obj){return((typeof obj=="function")&&(typeof obj.call=="function")&&(typeof obj.apply=="function"))})},Handler={indexOf:(function(arr,fct){var idx=arr.length;while(idx--){if(arr[idx]===fct){break}}return idx})},Event=(function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date()}),EventListener=(function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=(function(evt){if(evt&&(typeof evt=="object")){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else{evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp}}handler(evt)});this.getType=(function(){return type});this.getHandler=(function(){return handler})}),EventTargetMixin=(function(indexOf,isString,isFunction){return(function(){var eventMap={},removeEventListener=(function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully});this.addEventListener=this.on=(function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else{reference=listeners[idx]}}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference});this.removeEventListener=(function(typeOrListener,handler){return((isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler))||((typeOrListener instanceof EventListener)&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler()))||false)});this.dispatchEvent=(function(evt){var successfully=false,type=(((typeof evt=="object")&&(typeof evt.type=="string")&&evt.type)||((typeof evt=="string")&&evt)),event=(type&&eventMap[type]);if(event){var listeners=(event&&event.listeners),len=((listeners&&listeners.length)||0),idx=0;if(len>=1){while(idx<len){listeners[idx++].handleEvent(evt)}successfully=true}}return successfully})})})(Handler.indexOf,Detect.isString,Detect.isFunction),target=(function(){var obj={};EventTargetMixin.call(obj);return obj})(),TARGET={addListenerString:(""+target.addEventListener),removeListenerString:(""+target.removeEventListener),dispatchEventString:(""+target.dispatchEvent)};target=Handler=Detect=null;delete target;delete Handler;delete Detect;return{register:(function(obj){if((typeof obj.addEventListener!="function")&&!obj.attachEvent&&(typeof obj.removeEventListener!="function")&&!obj.detachEvent&&(typeof obj.dispatchEvent!="function")&&!obj.fireEvent){EventTargetMixin.call(obj)}return obj}),unsubscribe:(function(obj){if((""+obj.addEventListener)==TARGET.addListenerString){delete obj.addEventListener}if((""+obj.removeEventListener)==TARGET.removeListenerString){delete obj.removeEventListener}if((""+obj.dispatchEvent)==TARGET.dispatchEventString){delete obj.dispatchEvent}})}})();sh=ns=null;delete sh;delete ns;delete arguments.callee}).call(null);



- packed / shrinked           - 3.241 byte : (additionally featuring [hasEventListener])
(function(k){var l=this;(k||l).EventTargetProvider=(function(){var j={isString:(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+String\]$/),l.Object.prototype.toString),isFunction:(function(a){return((typeof a=="function")&&(typeof a.call=="function")&&(typeof a.apply=="function"))})},Handler={indexOf:(function(a,b){var c=a.length;while(c--){if(a[c]===b){break}}return c})},Event=(function(a,b){this.constructor=Event;this.target=a;this.type=b;this.timeStamp=new Date()}),EventListener=(function(b,c,d){this.constructor=EventListener;var e=new Event(b,c);this.handleEvent=(function(a){if(a&&(typeof a=="object")){a.target=e.target;a.type=e.type;a.timeStamp=e.timeStamp}else{a={target:e.target,type:e.type,timeStamp:e.timeStamp}}d(a)});this.getType=(function(){return c});this.getHandler=(function(){return d})}),EventTargetMixin=(function(g,h,i){return(function(){var f={},removeEventListener=(function(a,b){var c=f[a],successfully=false;if(c){var d=c.handlers,listeners=c.listeners,idx=g(d,b);if(idx>=0){d.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully}),hasEventListener=(function(a,b){return((f[a]||false)&&(g(f[a].handlers,b)>=0))});this.addEventListener=this.on=(function(a,b){var c;if(a&&h(a)&&i(b)){var d=f[a],listener=new EventListener(this,a,b);if(d){var e=d.handlers,listeners=d.listeners,idx=g(e,b);if(idx==-1){e.push(listener.getHandler());listeners.push(listener);c=listener}else{c=listeners[idx]}}else{d=f[a]={};d.handlers=[listener.getHandler()];d.listeners=[listener];c=listener}}return c});this.removeEventListener=(function(a,b){return((h(a)&&i(b)&&removeEventListener(a,b))||((a instanceof EventListener)&&removeEventListener(a.getType(),a.getHandler()))||false)});this.hasEventListener=(function(a,b){return((h(a)&&i(b)&&hasEventListener(a,b))||((a instanceof EventListener)&&hasEventListener(a.getType(),a.getHandler()))||false)});this.dispatchEvent=(function(a){var b=false,type=(((typeof a=="object")&&(typeof a.type=="string")&&a.type)||((typeof a=="string")&&a)),event=(type&&f[type]);if(event){var c=(event&&event.listeners),len=((c&&c.length)||0),idx=0;if(len>=1){while(idx<len){c[idx++].handleEvent(a)}b=true}}return b})})})(Handler.indexOf,j.isString,j.isFunction),target=(function(){var a={};EventTargetMixin.call(a);return a})(),TARGET={addListenerString:(""+target.addEventListener),removeListenerString:(""+target.removeEventListener),hasListenerString:(""+target.hasEventListener),dispatchEventString:(""+target.dispatchEvent)};target=Handler=j=null;delete target;delete Handler;delete j;return{register:(function(a){if((typeof a.addEventListener!="function")&&!a.attachEvent&&(typeof a.removeEventListener!="function")&&!a.detachEvent&&(typeof a.dispatchEvent!="function")&&!a.fireEvent){EventTargetMixin.call(a)}return a}),unsubscribe:(function(a){if((""+a.addEventListener)==TARGET.addListenerString){delete a.addEventListener}if((""+a.removeEventListener)==TARGET.removeListenerString){delete a.removeEventListener}if((""+a.hasEventListener)==TARGET.hasListenerString){delete a.hasEventListener}if((""+a.dispatchEvent)==TARGET.dispatchEventString){delete a.dispatchEvent}})}})();l=k=null;delete l;delete k;delete arguments.callee}).call(null);

- packed / shrinked           - 2.884 byte : (does not include [hasEventListener] functionality)
(function(k){var l=this;(k||l).EventTargetProvider=(function(){var j={isString:(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+String\]$/),l.Object.prototype.toString),isFunction:(function(a){return((typeof a=="function")&&(typeof a.call=="function")&&(typeof a.apply=="function"))})},Handler={indexOf:(function(a,b){var c=a.length;while(c--){if(a[c]===b){break}}return c})},Event=(function(a,b){this.constructor=Event;this.target=a;this.type=b;this.timeStamp=new Date()}),EventListener=(function(b,c,d){this.constructor=EventListener;var e=new Event(b,c);this.handleEvent=(function(a){if(a&&(typeof a=="object")){a.target=e.target;a.type=e.type;a.timeStamp=e.timeStamp}else{a={target:e.target,type:e.type,timeStamp:e.timeStamp}}d(a)});this.getType=(function(){return c});this.getHandler=(function(){return d})}),EventTargetMixin=(function(g,h,i){return(function(){var f={},removeEventListener=(function(a,b){var c=f[a],successfully=false;if(c){var d=c.handlers,listeners=c.listeners,idx=g(d,b);if(idx>=0){d.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully});this.addEventListener=this.on=(function(a,b){var c;if(a&&h(a)&&i(b)){var d=f[a],listener=new EventListener(this,a,b);if(d){var e=d.handlers,listeners=d.listeners,idx=g(e,b);if(idx==-1){e.push(listener.getHandler());listeners.push(listener);c=listener}else{c=listeners[idx]}}else{d=f[a]={};d.handlers=[listener.getHandler()];d.listeners=[listener];c=listener}}return c});this.removeEventListener=(function(a,b){return((h(a)&&i(b)&&removeEventListener(a,b))||((a instanceof EventListener)&&removeEventListener(a.getType(),a.getHandler()))||false)});this.dispatchEvent=(function(a){var b=false,type=(((typeof a=="object")&&(typeof a.type=="string")&&a.type)||((typeof a=="string")&&a)),event=(type&&f[type]);if(event){var c=(event&&event.listeners),len=((c&&c.length)||0),idx=0;if(len>=1){while(idx<len){c[idx++].handleEvent(a)}b=true}}return b})})})(Handler.indexOf,j.isString,j.isFunction),target=(function(){var a={};EventTargetMixin.call(a);return a})(),TARGET={addListenerString:(""+target.addEventListener),removeListenerString:(""+target.removeEventListener),dispatchEventString:(""+target.dispatchEvent)};target=Handler=j=null;delete target;delete Handler;delete j;return{register:(function(a){if((typeof a.addEventListener!="function")&&!a.attachEvent&&(typeof a.removeEventListener!="function")&&!a.detachEvent&&(typeof a.dispatchEvent!="function")&&!a.fireEvent){EventTargetMixin.call(a)}return a}),unsubscribe:(function(a){if((""+a.addEventListener)==TARGET.addListenerString){delete a.addEventListener}if((""+a.removeEventListener)==TARGET.removeListenerString){delete a.removeEventListener}if((""+a.dispatchEvent)==TARGET.dispatchEventString){delete a.dispatchEvent}})}})();l=k=null;delete l;delete k;delete arguments.callee}).call(null);



- packed / shrinked / encoded - 2.345 byte : (additionally featuring [hasEventListener])
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(k){6 l=4;(k||l).16=(2(){6 j={U:(2(b,c){3(2(a){3 b.13(c.y(a))})})((/^\\[I\\s+18\\]$/),l.19.1b.1f),V:(2(a){3((n a=="2")&&(n a.y=="2")&&(n a.15=="2"))})},C={T:(2(a,b){6 c=a.W;Q(c--){5(a[c]===b){1c}}3 c})},F=(2(a,b){4.Z=F;4.7=a;4.8=b;4.x=K 17()}),z=(2(b,c,d){4.Z=z;6 e=K F(b,c);4.P=(2(a){5(a&&(n a=="I")){a.7=e.7;a.8=e.8;a.x=e.x}L{a={7:e.7,8:e.8,x:e.x}}d(a)});4.E=(2(){3 c});4.v=(2(){3 d})}),G=(2(g,h,i){3(2(){6 f={},p=(2(a,b){6 c=f[a],M=A;5(c){6 d=c.D,o=c.o,9=g(d,b);5(9>=0){d.O(9,1);o.O(9,1);M=12}}3 M}),r=(2(a,b){3((f[a]||A)&&(g(f[a].D,b)>=0))});4.t=4.1a=(2(a,b){6 c;5(a&&h(a)&&i(b)){6 d=f[a],q=K z(4,a,b);5(d){6 e=d.D,o=d.o,9=g(e,b);5(9==-1){e.N(q.v());o.N(q);c=q}L{c=o[9]}}L{d=f[a]={};d.D=[q.v()];d.o=[q];c=q}}3 c});4.p=(2(a,b){3((h(a)&&i(b)&&p(a,b))||((a 11 z)&&p(a.E(),a.v()))||A)});4.r=(2(a,b){3((h(a)&&i(b)&&r(a,b))||((a 11 z)&&r(a.E(),a.v()))||A)});4.u=(2(a){6 b=A,8=(((n a=="I")&&(n a.8=="10")&&a.8)||((n a=="10")&&a)),B=(8&&f[8]);5(B){6 c=(B&&B.o),J=((c&&c.W)||0),9=0;5(J>=1){Q(9<J){c[9++].P(a)}b=12}}3 b})})})(C.T,j.U,j.V),7=(2(){6 a={};G.y(a);3 a})(),w={Y:(""+7.t),R:(""+7.p),X:(""+7.r),S:(""+7.u)};7=C=j=H;m 7;m C;m j;3{1d:(2(a){5((n a.t!="2")&&!a.1e&&(n a.p!="2")&&!a.14&&(n a.u!="2")&&!a.1g){G.y(a)}3 a}),1h:(2(a){5((""+a.t)==w.Y){m a.t}5((""+a.p)==w.R){m a.p}5((""+a.r)==w.X){m a.r}5((""+a.u)==w.S){m a.u}})}})();l=k=H;m l;m k;m 1i.1j}).y(H);',62,82,'||function|return|this|if|var|target|type|idx|||||||||||||delete|typeof|listeners|removeEventListener|listener|hasEventListener||addEventListener|dispatchEvent|getHandler|TARGET|timeStamp|call|EventListener|false|event|Handler|handlers|getType|Event|EventTargetMixin|null|object|len|new|else|successfully|push|splice|handleEvent|while|removeListenerString|dispatchEventString|indexOf|isString|isFunction|length|hasListenerString|addListenerString|constructor|string|instanceof|true|test|detachEvent|apply|EventTargetProvider|Date|String|Object|on|prototype|break|register|attachEvent|toString|fireEvent|unsubscribe|arguments|callee'.split('|'),0,{}));

- packed / shrinked / encoded - 2.160 byte : (does not include [hasEventListener] functionality)
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(k){6 l=4;(k||l).12=(2(){6 j={Z:(2(b,c){3(2(a){3 b.11(c.t(a))})})((/^\\[E\\s+19\\]$/),l.1g.18.10),W:(2(a){3((9 a=="2")&&(9 a.t=="2")&&(9 a.1e=="2"))})},A={S:(2(a,b){6 c=a.M;N(c--){5(a[c]===b){16}}3 c})},C=(2(a,b){4.X=C;4.7=a;4.8=b;4.u=J 17()}),z=(2(b,c,d){4.X=z;6 e=J C(b,c);4.U=(2(a){5(a&&(9 a=="E")){a.7=e.7;a.8=e.8;a.u=e.u}F{a={7:e.7,8:e.8,u:e.u}}d(a)});4.Q=(2(){3 c});4.w=(2(){3 d})}),I=(2(g,h,i){3(2(){6 f={},p=(2(a,b){6 c=f[a],K=H;5(c){6 d=c.G,n=c.n,m=g(d,b);5(m>=0){d.R(m,1);n.R(m,1);K=T}}3 K});4.r=4.1f=(2(a,b){6 c;5(a&&h(a)&&i(b)){6 d=f[a],q=J z(4,a,b);5(d){6 e=d.G,n=d.n,m=g(e,b);5(m==-1){e.L(q.w());n.L(q);c=q}F{c=n[m]}}F{d=f[a]={};d.G=[q.w()];d.n=[q];c=q}}3 c});4.p=(2(a,b){3((h(a)&&i(b)&&p(a,b))||((a 1h z)&&p(a.Q(),a.w()))||H)});4.v=(2(a){6 b=H,8=(((9 a=="E")&&(9 a.8=="Y")&&a.8)||((9 a=="Y")&&a)),y=(8&&f[8]);5(y){6 c=(y&&y.n),D=((c&&c.M)||0),m=0;5(D>=1){N(m<D){c[m++].U(a)}b=T}}3 b})})})(A.S,j.Z,j.W),7=(2(){6 a={};I.t(a);3 a})(),x={V:(""+7.r),P:(""+7.p),O:(""+7.v)};7=A=j=B;o 7;o A;o j;3{1d:(2(a){5((9 a.r!="2")&&!a.13&&(9 a.p!="2")&&!a.1c&&(9 a.v!="2")&&!a.14){I.t(a)}3 a}),1b:(2(a){5((""+a.r)==x.V){o a.r}5((""+a.p)==x.P){o a.p}5((""+a.v)==x.O){o a.v}})}})();l=k=B;o l;o k;o 15.1a}).t(B);',62,80,'||function|return|this|if|var|target|type|typeof|||||||||||||idx|listeners|delete|removeEventListener|listener|addEventListener||call|timeStamp|dispatchEvent|getHandler|TARGET|event|EventListener|Handler|null|Event|len|object|else|handlers|false|EventTargetMixin|new|successfully|push|length|while|dispatchEventString|removeListenerString|getType|splice|indexOf|true|handleEvent|addListenerString|isFunction|constructor|string|isString|toString|test|EventTargetProvider|attachEvent|fireEvent|arguments|break|Date|prototype|String|callee|unsubscribe|detachEvent|register|apply|on|Object|instanceof'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 2.135 byte : (additionally featuring [hasEventListener])
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(q){5 m=4;(q||m).19=2(){5 n={10:2(a,g){3 2(h){3 a.1d(g.B(h))}}(/^\\[K\\s+14\\]$/,m.1e.13.1f),W:2(a){3 6 a=="2"&&6 a.B=="2"&&6 a.12=="2"}},r={N:2(a,g){P(5 h=a.Q;h--;)8(a[h]===g)1g;3 h}},s=2(a,g){4.U=s;4.x=a;4.9=g;4.z=H 11},o=2(a,g,h){4.U=o;5 f=H s(a,g);4.O=2(i){8(i&&6 i=="K"){i.x=f.x;i.9=f.9;i.z=f.z}G i={x:f.x,9:f.9,z:f.z};h(i)};4.I=2(){3 g};4.A=2(){3 h}},u=2(a,g,h){3 2(){5 f={},i=2(b,d){5 c=f[b],e=C;8(c){5 j=c.D;c=c.E;5 k=a(j,d);8(k>=0){j.R(k,1);c.R(k,1);e=Y}}3 e},t=2(b,d){3(f[b]||C)&&a(f[b].D,d)>=0};4.v=4.1h=2(b,d){5 c;8(b&&g(b)&&h(d)){5 e=f[b];c=H o(4,b,d);8(e){5 j=e.D;e=e.E;5 k=a(j,d);8(k==-1){j.X(c.A());e.X(c);c=c}G c=e[k]}G{e=f[b]={};e.D=[c.A()];e.E=[c];c=c}}3 c};4.w=2(b,d){3 g(b)&&h(d)&&i(b,d)||b Z o&&i(b.I(),b.A())||C};4.F=2(b,d){3 g(b)&&h(d)&&t(b,d)||b Z o&&t(b.I(),b.A())||C};4.y=2(b){5 d=C,c=6 b=="K"&&6 b.9=="L"&&b.9||6 b=="L"&&b;8(c=c&&f[c]){5 e=(c=c&&c.E)&&c.Q||0,j=0;8(e>=1){P(;j<e;)c[j++].O(b);d=Y}}3 d}}}(r.N,n.10,n.W),l=2(){5 a={};u.B(a);3 a}(),p={V:""+l.v,T:""+l.w,S:""+l.F,M:""+l.y};l=r=n=J;7 l;7 r;7 n;3{15:2(a){6 a.v!="2"&&!a.1c&&6 a.w!="2"&&!a.16&&6 a.y!="2"&&!a.1b&&u.B(a);3 a},17:2(a){""+a.v==p.V&&7 a.v;""+a.w==p.T&&7 a.w;""+a.F==p.S&&7 a.F;""+a.y==p.M&&7 a.y}}}();m=q=J;7 m;7 q;7 1a.18}).B(J);',62,80,'||function|return|this|var|typeof|delete|if|type||||||||||||||||||||||addEventListener|removeEventListener|target|dispatchEvent|timeStamp|getHandler|call|false|handlers|listeners|hasEventListener|else|new|getType|null|object|string|dispatchEventString|indexOf|handleEvent|for|length|splice|hasListenerString|removeListenerString|constructor|addListenerString|isFunction|push|true|instanceof|isString|Date|apply|prototype|String|register|detachEvent|unsubscribe|callee|EventTargetProvider|arguments|fireEvent|attachEvent|test|Object|toString|break|on'.split('|'),0,{}));

- combined                    - 1.971 byte : (does not include [hasEventListener] functionality)
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(o){3 m=5;(o||m).X=2(){3 n={U:2(a,e){4 2(f){4 a.Z(e.y(f))}}(/^\\[F\\s+10\\]$/,m.11.12.1d),P:2(a){4 6 a=="2"&&6 a.y=="2"&&6 a.15=="2"}},p={N:2(a,e){M(3 f=a.K;f--;)7(a[f]===e)Y;4 f}},s=2(a,e){5.W=s;5.z=a;5.9=e;5.u=H 14},q=2(a,e,f){5.W=q;3 g=H s(a,e);5.I=2(i){7(i&&6 i=="F"){i.z=g.z;i.9=g.9;i.u=g.u}G i={z:g.z,9:g.9,u:g.u};f(i)};5.Q=2(){4 e};5.A=2(){4 f}},t=2(a,e,f){4 2(){3 g={},i=2(c,h){3 b=g[c],d=D;7(b){3 j=b.E;b=b.B;3 k=a(j,h);7(k>=0){j.V(k,1);b.V(k,1);d=J}}4 d};5.x=5.13=2(c,h){3 b;7(c&&e(c)&&f(h)){3 d=g[c];b=H q(5,c,h);7(d){3 j=d.E;d=d.B;3 k=a(j,h);7(k==-1){j.L(b.A());d.L(b);b=b}G b=d[k]}G{d=g[c]={};d.E=[b.A()];d.B=[b];b=b}}4 b};5.w=2(c,h){4 e(c)&&f(h)&&i(c,h)||c 1e q&&i(c.Q(),c.A())||D};5.v=2(c){3 h=D,b=6 c=="F"&&6 c.9=="O"&&c.9||6 c=="O"&&c;7(b=b&&g[b]){3 d=(b=b&&b.B)&&b.K||0,j=0;7(d>=1){M(;j<d;)b[j++].I(c);h=J}}4 h}}}(p.N,n.U,n.P),l=2(){3 a={};t.y(a);4 a}(),r={R:""+l.x,S:""+l.w,T:""+l.v};l=p=n=C;8 l;8 p;8 n;4{16:2(a){6 a.x!="2"&&!a.17&&6 a.w!="2"&&!a.18&&6 a.v!="2"&&!a.19&&t.y(a);4 a},1a:2(a){""+a.x==r.R&&8 a.x;""+a.w==r.S&&8 a.w;""+a.v==r.T&&8 a.v}}}();m=o=C;8 m;8 o;8 1b.1c}).y(C);',62,77,'||function|var|return|this|typeof|if|delete|type|||||||||||||||||||||timeStamp|dispatchEvent|removeEventListener|addEventListener|call|target|getHandler|listeners|null|false|handlers|object|else|new|handleEvent|true|length|push|for|indexOf|string|isFunction|getType|addListenerString|removeListenerString|dispatchEventString|isString|splice|constructor|EventTargetProvider|break|test|String|Object|prototype|on|Date|apply|register|attachEvent|detachEvent|fireEvent|unsubscribe|arguments|callee|toString|instanceof'.split('|'),0,{}));


*/
