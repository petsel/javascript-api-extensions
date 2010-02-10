/*
	This [EventTargetProvider] singleton enables and will encourage usage of a pretty lightweighted but still type-safety enforcing implementation of
	[http://en.wikipedia.org/wiki/Signals_and_slots Signals and Slots], an [http://en.wikipedia.org/wiki/Observer_pattern observer] concept different
	from [http://en.wikipedia.org/wiki/Publish/subscribe publish-subscribe], and all of it based on this languages core-API.

	Registering a native JavaScript object via [EventTargetProvider.register] applies kind of an [EventTarget] interface onto this object thus featuring
	immediately its 3 methods [addEventListener], [removeEventListener] and [dispatchEvent].

	Attempting to register DOM-[Node] or DOM-[Element] objects as well as reregistering of objects that already do implement the [EventTarget] interface
	is futile.

	Furthermore, this observer does not support any DOM-level-2 event flow behavior like capture, bubbling, propagation for there are no dependencies
	like ancestry or tree-like object hierarchies.

	Once such an object features [EventTarget] behavior every other object can subscribe itself or listen via [addEventListener] to a certain event
	by passing a valid type and a handler to that firstly mentioned object.


	link-list:

		English:

			[http://en.wikipedia.org/wiki/Observer_pattern]   - Observer Pattern
			[http://en.wikipedia.org/wiki/Publish/subscribe]  - publish-subscribe
			[http://en.wikipedia.org/wiki/Signals_and_slots]  - Signals and Slots

			[http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/]
			[http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html]
			[http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/ecma-script-binding.html]

		Deutsch/German:
			[http://de.wikipedia.org/wiki/Observer_(Entwurfsmuster)]  - Observer (Entwurfsmuster) / publish-subscribe
			[http://de.wikipedia.org/wiki/Signal-Slot-Konzept]        - Signal-Slot-Konzept

		EN - comments		: There are no dependencies within the [[EventTargetProvider]] implementation beneath. This module runs independently in any ECMAScript environment.
		DE - Kommentare	: Die folgende Implementierung des [[EventTargetProvider]]s ist frei von Abhängigkeiten. Dieses Modul läuft unabhängig in jeder ECMAScript-Umgebung.
*/


var EventTargetProvider = (function () { // [EventTargetProvider] Singleton. // DOM Level 2 - Appendix C: ECMAScript Language Binding.


	var exposeImplementation = Object.prototype.toString,

	stringify = (function (obj) { /*:[string]*/ // kind of [toString] helper method.

		return ((obj && obj.toString && obj.toString()) || "");
	}),
	isBoolean = (function () { // typedetection.

		var regXBaseClass = (/^\[object\s+Boolean\]$/);
		return (function (obj/*:[object|value]*/) { /*:[true|false]*/

			return regXBaseClass.test(exposeImplementation.call(obj));
		});
	})(),
	isString = (function () { // typedetection.

		var regXBaseClass = (/^\[object\s+String\]$/);
		return (function (obj/*:[object|value]*/) { /*:[true|false]*/

			return regXBaseClass.test(exposeImplementation.call(obj));
		});
	})(),
	isFunction = (function (obj/*:[object|value]*/) { /*:[true|false]*/ // typedetection.

		return ((typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function")); // x-frame-safe and also filters e.g. mozillas [[RegExp]] implementation.
	}),


	Handler = { // specialized [indexOf] helper method.
		indexOf : (function (arr, fct) { /*:[number(>=0|-1)]*/

		//var elm, idx = (arr.length - 1);
			var idx = (arr.length - 1);
			while (idx > -1) {
			//elm = arr[idx];
			//if (((typeof elm != "undefined") || (idx in arr)) && (elm === fct)) {
				if (arr[idx] === fct) {
					break;
				}
				--idx;
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


			if ((typeof evt == "object") && evt) {
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


	»The concept of "Mixin"s from the perspective of
	 JavaScript adds behavior to objects by delegation
	 over implemented interfaces. "Trait"s  might be
	 the wording that comes closest to this languages
	 design.
	 Furthermore, "augment" describes far better the
	 mechanism behind this special kind of interface
	 inheritance than "mix in" does.«

*/
	EventTarget = (function () { // MIXIN: providing the [[EventTarget]] interface.

	//this.constructor = EventTarget; // arguments.callee // this is not a constructor .

		var eventMap = {},
		removeEventListener = (function (type/*:[string|String]*/, handler/*:[Function]*/) { /*:[true|false]*/

			var event = eventMap[type], successfully = false;
			if (event) {

				var handlers = event.handlers,
				listeners = event.listeners,
				idx = Handler.indexOf(handlers, handler);

				if (idx >= 0) {
					handlers.splice(idx, 1);
					listeners.splice(idx, 1);
					successfully = true;
				}
			}
			return successfully;
		}),
		hasEventListener = (function (type/*:[string|String]*/, handler/*:[Function]*/) { /*:[true|false]*/

			return ((eventMap[type] || false) && (Handler.indexOf(eventMap[type].handlers, handler) >= 0));
		});

		this.addEventListener = (function (type/*:[string|String]*/, handler/*:[Function]*/) { /*:[EventListener|undefined]*/

			var reference;
			if (type && isString(type) && isFunction(handler)) {

				var event = eventMap[type], listener = new EventListener(this, type, handler);
				if (event) {

					var handlers = event.handlers,
					listeners = event.listeners,
					idx = Handler.indexOf(handlers, handler);

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

						listeners[idx++].handleEvent(evt); // handle event dispatching serially - recommended if handler-processing is not that time consuming.

					//handling event dispatching kind of *green threaded* prevents freezing the user interface if dispatch cycle starts.
					//setTimeout((function () {listeners[idx++].handleEvent(evt);}), 0);				// play around adjusting timeout values.
					//setTimeout((function () {listeners[idx++].handleEvent(evt);}), 1);				// ... "" ...
					//setTimeout((function () {listeners[idx++].handleEvent(evt);}), idx);			// ... "" ...
					//setTimeout((function () {listeners[idx++].handleEvent(evt);}), (idx * 5));// ... "" ...

					//alternatively each object that implements the [[EventTarget]] interface might enclose calling its own [dispatchEvent] method into a timeout if necessary:
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
	}),

	pseudoTarget = new EventTarget, // there will be never ever any [[EventTarget]] instances except this one for copying purpose at initialize-time.


	CROSSCHECK_TARGET = {
		addListenerString : pseudoTarget.addEventListener.toString(),
		removeListenerString : pseudoTarget.removeEventListener.toString(),
		hasListenerString : pseudoTarget.hasEventListener.toString(),
		dispatchEventString : pseudoTarget.dispatchEvent.toString()
	};
	delete pseudoTarget; // done ... get rid of this undesirable changeling.


/*
	objects need to be registered and/or unsubscribed explicitly in order to
	apply/augment and/or withdraw/remove [EventTarget]-properties to/from them.
*/
	return {

		register: (function (obj/*:[Object]*/) { /*:void*/ // register | sign on

		//do not apply this customized [[EventTarget]] interface to DOM-[Node] or DOM-[Element] objects or to objects that already got augmented by this customized [EventTarget] features.
			if ((typeof obj.addEventListener == "function") || obj.attachEvent || (typeof obj.removeEventListener == "function") || obj.detachEvent || (typeof obj.dispatchEvent == "function") || obj.fireEvent) {
				return;
			}
			EventTarget.call(obj); // applying the MIXIN concept - [obj] implements the [[EventTarget]] interface.
		}),
		unsubscribe: (function (obj/*:[Object]*/) { /*:void*/ // unsubscribe | sign off

			if (stringify(obj.addEventListener) === CROSSCHECK_TARGET.addListenerString) {
				delete obj.addEventListener;
			}
			if (stringify(obj.removeEventListener) === CROSSCHECK_TARGET.removeListenerString) {
				delete obj.removeEventListener;
			}
			if (stringify(obj.hasEventListener) === CROSSCHECK_TARGET.hasListenerString) {
				delete obj.hasEventListener;
			}
			if (stringify(obj.dispatchEvent) === CROSSCHECK_TARGET.dispatchEventString) {
				delete obj.dispatchEvent;
			}
		})
	};

})(); // [EventTargetProvider] Singleton.



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
	//[http://closure-compiler.appspot.com/home]	-	Whitespace only	- 3571 bytes	: (does not include [hasEventListener] functionality)
	var EventTargetProvider=function(){var exposeImplementation=Object.prototype.toString,stringify=function(obj){return obj&&obj.toString&&obj.toString()||""},isBoolean=function(){var regXBaseClass=/^\[object\s+Boolean\]$/;return function(obj){return regXBaseClass.test(exposeImplementation.call(obj))}}(),isString=function(){var regXBaseClass=/^\[object\s+String\]$/;return function(obj){return regXBaseClass.test(exposeImplementation.call(obj))}}(),isFunction=function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},Handler={indexOf:function(arr,fct){var idx=arr.length-1;while(idx>-1){if(arr[idx]===fct)break;--idx}return idx}},Event=function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date},EventListener=function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=function(evt){if(typeof evt=="object"&&evt){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp};handler(evt)};this.getType=function(){return type};this.getHandler=function(){return handler}},EventTarget=function(){var eventMap={},removeEventListener=function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=Handler.indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully};this.addEventListener=function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=Handler.indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else reference=listeners[idx]}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference};this.removeEventListener=function(typeOrListener,handler){return isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler)||typeOrListener instanceof EventListener&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler())||false};this.dispatchEvent=function(evt){var successfully=false,type=typeof evt=="object"&&typeof evt.type=="string"&&evt.type||typeof evt=="string"&&evt,event=type&&eventMap[type];if(event){var listeners=event&&event.listeners,len=listeners&&listeners.length||0,idx=0;if(len>=1){while(idx<len)listeners[idx++].handleEvent(evt);successfully=true}}return successfully}},pseudoTarget=new EventTarget,CROSSCHECK_TARGET={addListenerString:pseudoTarget.addEventListener.toString(),removeListenerString:pseudoTarget.removeEventListener.toString(),dispatchEventString:pseudoTarget.dispatchEvent.toString()};delete pseudoTarget;return{register:function(obj){if(typeof obj.addEventListener=="function"||obj.attachEvent||typeof obj.removeEventListener=="function"||obj.detachEvent||typeof obj.dispatchEvent=="function"||obj.fireEvent)return;EventTarget.call(obj)},unsubscribe:function(obj){if(stringify(obj.addEventListener)===CROSSCHECK_TARGET.addListenerString)delete obj.addEventListener;if(stringify(obj.removeEventListener)===CROSSCHECK_TARGET.removeListenerString)delete obj.removeEventListener;if(stringify(obj.dispatchEvent)===CROSSCHECK_TARGET.dispatchEventString)delete obj.dispatchEvent}}}();

	//[http://closure-compiler.appspot.com/home]	-	Whitespace only	- 4126 bytes	: (additionally featuring [hasEventListener])
	var EventTargetProvider=function(){var exposeImplementation=Object.prototype.toString,stringify=function(obj){return obj&&obj.toString&&obj.toString()||""},isBoolean=function(){var regXBaseClass=/^\[object\s+Boolean\]$/;return function(obj){return regXBaseClass.test(exposeImplementation.call(obj))}}(),isString=function(){var regXBaseClass=/^\[object\s+String\]$/;return function(obj){return regXBaseClass.test(exposeImplementation.call(obj))}}(),isFunction=function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},Handler={indexOf:function(arr,fct){var idx=arr.length-1;while(idx>-1){if(arr[idx]===fct)break;--idx}return idx}},Event=function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date},EventListener=function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=function(evt){if(typeof evt=="object"&&evt){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp};handler(evt)};this.getType=function(){return type};this.getHandler=function(){return handler}},EventTarget=function(){var eventMap={},removeEventListener=function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=Handler.indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully},hasEventListener=function(type,handler){return(eventMap[type]||false)&&Handler.indexOf(eventMap[type].handlers,handler)>=0};this.addEventListener=function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=Handler.indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else reference=listeners[idx]}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference};this.removeEventListener=function(typeOrListener,handler){return isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler)||typeOrListener instanceof EventListener&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler())||false};this.hasEventListener=function(typeOrListener,handler){return isString(typeOrListener)&&isFunction(handler)&&hasEventListener(typeOrListener,handler)||typeOrListener instanceof EventListener&&hasEventListener(typeOrListener.getType(),typeOrListener.getHandler())||false};this.dispatchEvent=function(evt){var successfully=false,type=typeof evt=="object"&&typeof evt.type=="string"&&evt.type||typeof evt=="string"&&evt,event=type&&eventMap[type];if(event){var listeners=event&&event.listeners,len=listeners&&listeners.length||0,idx=0;if(len>=1){while(idx<len)listeners[idx++].handleEvent(evt);successfully=true}}return successfully}},pseudoTarget=new EventTarget,CROSSCHECK_TARGET={addListenerString:pseudoTarget.addEventListener.toString(),removeListenerString:pseudoTarget.removeEventListener.toString(),hasListenerString:pseudoTarget.hasEventListener.toString(),dispatchEventString:pseudoTarget.dispatchEvent.toString()};delete pseudoTarget;return{register:function(obj){if(typeof obj.addEventListener=="function"||obj.attachEvent||typeof obj.removeEventListener=="function"||obj.detachEvent||typeof obj.dispatchEvent=="function"||obj.fireEvent)return;EventTarget.call(obj)},unsubscribe:function(obj){if(stringify(obj.addEventListener)===CROSSCHECK_TARGET.addListenerString)delete obj.addEventListener;if(stringify(obj.removeEventListener)===CROSSCHECK_TARGET.removeListenerString)delete obj.removeEventListener;if(stringify(obj.hasEventListener)===CROSSCHECK_TARGET.hasListenerString)delete obj.hasEventListener;if(stringify(obj.dispatchEvent)===CROSSCHECK_TARGET.dispatchEventString)delete obj.dispatchEvent}}}();



	//[http://closure-compiler.appspot.com/home]	- Simple					- 2290 bytes	: (does not include [hasEventListener] functionality)
	var EventTargetProvider=function(){var k=Object.prototype.toString,h=function(a){return a&&a.toString&&a.toString()||""};(function(){var a=/^\[object\s+Boolean\]$/;return function(f){return a.test(k.call(f))}})();var l=function(){var a=/^\[object\s+String\]$/;return function(f){return a.test(k.call(f))}}(),m=function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"},n={indexOf:function(a,f){for(var b=a.length-1;b>-1;){if(a[b]===f)break;--b}return b}},o=function(a,f){this.constructor=o;this.target=a;this.type=f;this.timeStamp=new Date},i=function(a,f,b){this.constructor=i;var d=new o(a,f);this.handleEvent=function(c){if(typeof c=="object"&&c){c.target=d.target;c.type=d.type;c.timeStamp=d.timeStamp}else c={target:d.target,type:d.type,timeStamp:d.timeStamp};b(c)};this.getType=function(){return f};this.getHandler=function(){return b}},q=function(){var a={},f=function(b,d){var c=a[b];b=false;if(c){var e=c.handlers;c=c.listeners;d=n.indexOf(e,d);if(d>=0){e.splice(d,1);c.splice(d,1);b=true}}return b};this.addEventListener=function(b,d){var c;if(b&&l(b)&&m(d)){var e=a[b];c=new i(this,b,d);if(e){b=e.handlers;e=e.listeners;d=n.indexOf(b,d);if(d==-1){b.push(c.getHandler());e.push(c);c=c}else c=e[d]}else{e=a[b]={};e.handlers=[c.getHandler()];e.listeners=[c];c=c}}return c};this.removeEventListener=function(b,d){return l(b)&&m(d)&&f(b,d)||b instanceof i&&f(b.getType(),b.getHandler())||false};this.dispatchEvent=function(b){var d=false,c=typeof b=="object"&&typeof b.type=="string"&&b.type||typeof b=="string"&&b;if(c=c&&a[c]){var e=(c=c&&c.listeners)&&c.length||0,p=0;if(e>=1){for(;p<e;)c[p++].handleEvent(b);d=true}}return d}},g=new q,j={addListenerString:g.addEventListener.toString(),removeListenerString:g.removeEventListener.toString(),dispatchEventString:g.dispatchEvent.toString()};delete g;return{register:function(a){typeof a.addEventListener=="function"||a.attachEvent||typeof a.removeEventListener=="function"||a.detachEvent||typeof a.dispatchEvent=="function"||a.fireEvent||q.call(a)},unsubscribe:function(a){h(a.addEventListener)===j.addListenerString&&delete a.addEventListener;h(a.removeEventListener)===j.removeListenerString&&delete a.removeEventListener;h(a.dispatchEvent)===j.dispatchEventString&&delete a.dispatchEvent}}}();

	//[http://closure-compiler.appspot.com/home]	- Simple					- 2594 bytes	: (additionally featuring [hasEventListener])
	var EventTargetProvider=function(){var o=Object.prototype.toString,i=function(a){return a&&a.toString&&a.toString()||""};(function(){var a=/^\[object\s+Boolean\]$/;return function(f){return a.test(o.call(f))}})();var l=function(){var a=/^\[object\s+String\]$/;return function(f){return a.test(o.call(f))}}(),m=function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"},n={indexOf:function(a,f){for(var g=a.length-1;g>-1;){if(a[g]===f)break;--g}return g}},p=function(a,f){this.constructor=p;this.target=a;this.type=f;this.timeStamp=new Date},j=function(a,f,g){this.constructor=j;var b=new p(a,f);this.handleEvent=function(c){if(typeof c=="object"&&c){c.target=b.target;c.type=b.type;c.timeStamp=b.timeStamp}else c={target:b.target,type:b.type,timeStamp:b.timeStamp};g(c)};this.getType=function(){return f};this.getHandler=function(){return g}},r=function(){var a={},f=function(b,c){var d=a[b];b=false;if(d){var e=d.handlers;d=d.listeners;c=n.indexOf(e,c);if(c>=0){e.splice(c,1);d.splice(c,1);b=true}}return b},g=function(b,c){return(a[b]||false)&&n.indexOf(a[b].handlers,c)>=0};this.addEventListener=function(b,c){var d;if(b&&l(b)&&m(c)){var e=a[b];d=new j(this,b,c);if(e){b=e.handlers;e=e.listeners;c=n.indexOf(b,c);if(c==-1){b.push(d.getHandler());e.push(d);d=d}else d=e[c]}else{e=a[b]={};e.handlers=[d.getHandler()];e.listeners=[d];d=d}}return d};this.removeEventListener=function(b,c){return l(b)&&m(c)&&f(b,c)||b instanceof j&&f(b.getType(),b.getHandler())||false};this.hasEventListener=function(b,c){return l(b)&&m(c)&&g(b,c)||b instanceof j&&g(b.getType(),b.getHandler())||false};this.dispatchEvent=function(b){var c=false,d=typeof b=="object"&&typeof b.type=="string"&&b.type||typeof b=="string"&&b;if(d=d&&a[d]){var e=(d=d&&d.listeners)&&d.length||0,q=0;if(e>=1){for(;q<e;)d[q++].handleEvent(b);c=true}}return c}},h=new r,k={addListenerString:h.addEventListener.toString(),removeListenerString:h.removeEventListener.toString(),hasListenerString:h.hasEventListener.toString(),dispatchEventString:h.dispatchEvent.toString()};delete h;return{register:function(a){typeof a.addEventListener=="function"||a.attachEvent||typeof a.removeEventListener=="function"||a.detachEvent||typeof a.dispatchEvent=="function"||a.fireEvent||r.call(a)},unsubscribe:function(a){i(a.addEventListener)===k.addListenerString&&delete a.addEventListener;i(a.removeEventListener)===k.removeListenerString&&delete a.removeEventListener;i(a.hasEventListener)===k.hasListenerString&&delete a.hasEventListener;i(a.dispatchEvent)===k.dispatchEventString&&delete a.dispatchEvent}}}();





	//[http://dean.edwards.name/packer/]	-	packed							- 3670 bytes	: (does not include [hasEventListener] functionality)
	var EventTargetProvider=(function(){var exposeImplementation=Object.prototype.toString,stringify=(function(obj){return((obj&&obj.toString&&obj.toString())||"")}),isBoolean=(function(){var regXBaseClass=(/^\[object\s+Boolean\]$/);return(function(obj){return regXBaseClass.test(exposeImplementation.call(obj))})})(),isString=(function(){var regXBaseClass=(/^\[object\s+String\]$/);return(function(obj){return regXBaseClass.test(exposeImplementation.call(obj))})})(),isFunction=(function(obj){return((typeof obj=="function")&&(typeof obj.call=="function")&&(typeof obj.apply=="function"))}),Handler={indexOf:(function(arr,fct){var idx=(arr.length-1);while(idx>-1){if(arr[idx]===fct){break}--idx}return idx})},Event=(function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date()}),EventListener=(function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=(function(evt){if((typeof evt=="object")&&evt){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else{evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp}}handler(evt)});this.getType=(function(){return type});this.getHandler=(function(){return handler})}),EventTarget=(function(){var eventMap={},removeEventListener=(function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=Handler.indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully});this.addEventListener=(function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=Handler.indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else{reference=listeners[idx]}}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference});this.removeEventListener=(function(typeOrListener,handler){return((isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler))||((typeOrListener instanceof EventListener)&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler()))||false)});this.dispatchEvent=(function(evt){var successfully=false,type=(((typeof evt=="object")&&(typeof evt.type=="string")&&evt.type)||((typeof evt=="string")&&evt)),event=(type&&eventMap[type]);if(event){var listeners=(event&&event.listeners),len=((listeners&&listeners.length)||0),idx=0;if(len>=1){while(idx<len){listeners[idx++].handleEvent(evt)}successfully=true}}return successfully})}),pseudoTarget=new EventTarget,CROSSCHECK_TARGET={addListenerString:pseudoTarget.addEventListener.toString(),removeListenerString:pseudoTarget.removeEventListener.toString(),dispatchEventString:pseudoTarget.dispatchEvent.toString()};delete pseudoTarget;return{register:(function(obj){if((typeof obj.addEventListener=="function")||obj.attachEvent||(typeof obj.removeEventListener=="function")||obj.detachEvent||(typeof obj.dispatchEvent=="function")||obj.fireEvent){return}EventTarget.call(obj)}),unsubscribe:(function(obj){if(stringify(obj.addEventListener)===CROSSCHECK_TARGET.addListenerString){delete obj.addEventListener}if(stringify(obj.removeEventListener)===CROSSCHECK_TARGET.removeListenerString){delete obj.removeEventListener}if(stringify(obj.dispatchEvent)===CROSSCHECK_TARGET.dispatchEventString){delete obj.dispatchEvent}})}})();

	//[http://dean.edwards.name/packer/]	-	packed							- 4241 bytes	: (additionally featuring [hasEventListener])
	var EventTargetProvider=(function(){var exposeImplementation=Object.prototype.toString,stringify=(function(obj){return((obj&&obj.toString&&obj.toString())||"")}),isBoolean=(function(){var regXBaseClass=(/^\[object\s+Boolean\]$/);return(function(obj){return regXBaseClass.test(exposeImplementation.call(obj))})})(),isString=(function(){var regXBaseClass=(/^\[object\s+String\]$/);return(function(obj){return regXBaseClass.test(exposeImplementation.call(obj))})})(),isFunction=(function(obj){return((typeof obj=="function")&&(typeof obj.call=="function")&&(typeof obj.apply=="function"))}),Handler={indexOf:(function(arr,fct){var idx=(arr.length-1);while(idx>-1){if(arr[idx]===fct){break}--idx}return idx})},Event=(function(target,type){this.constructor=Event;this.target=target;this.type=type;this.timeStamp=new Date()}),EventListener=(function(target,type,handler){this.constructor=EventListener;var defaultEvent=new Event(target,type);this.handleEvent=(function(evt){if((typeof evt=="object")&&evt){evt.target=defaultEvent.target;evt.type=defaultEvent.type;evt.timeStamp=defaultEvent.timeStamp}else{evt={target:defaultEvent.target,type:defaultEvent.type,timeStamp:defaultEvent.timeStamp}}handler(evt)});this.getType=(function(){return type});this.getHandler=(function(){return handler})}),EventTarget=(function(){var eventMap={},removeEventListener=(function(type,handler){var event=eventMap[type],successfully=false;if(event){var handlers=event.handlers,listeners=event.listeners,idx=Handler.indexOf(handlers,handler);if(idx>=0){handlers.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully}),hasEventListener=(function(type,handler){return((eventMap[type]||false)&&(Handler.indexOf(eventMap[type].handlers,handler)>=0))});this.addEventListener=(function(type,handler){var reference;if(type&&isString(type)&&isFunction(handler)){var event=eventMap[type],listener=new EventListener(this,type,handler);if(event){var handlers=event.handlers,listeners=event.listeners,idx=Handler.indexOf(handlers,handler);if(idx==-1){handlers.push(listener.getHandler());listeners.push(listener);reference=listener}else{reference=listeners[idx]}}else{event=eventMap[type]={};event.handlers=[listener.getHandler()];event.listeners=[listener];reference=listener}}return reference});this.removeEventListener=(function(typeOrListener,handler){return((isString(typeOrListener)&&isFunction(handler)&&removeEventListener(typeOrListener,handler))||((typeOrListener instanceof EventListener)&&removeEventListener(typeOrListener.getType(),typeOrListener.getHandler()))||false)});this.hasEventListener=(function(typeOrListener,handler){return((isString(typeOrListener)&&isFunction(handler)&&hasEventListener(typeOrListener,handler))||((typeOrListener instanceof EventListener)&&hasEventListener(typeOrListener.getType(),typeOrListener.getHandler()))||false)});this.dispatchEvent=(function(evt){var successfully=false,type=(((typeof evt=="object")&&(typeof evt.type=="string")&&evt.type)||((typeof evt=="string")&&evt)),event=(type&&eventMap[type]);if(event){var listeners=(event&&event.listeners),len=((listeners&&listeners.length)||0),idx=0;if(len>=1){while(idx<len){listeners[idx++].handleEvent(evt)}successfully=true}}return successfully})}),pseudoTarget=new EventTarget,CROSSCHECK_TARGET={addListenerString:pseudoTarget.addEventListener.toString(),removeListenerString:pseudoTarget.removeEventListener.toString(),hasListenerString:pseudoTarget.hasEventListener.toString(),dispatchEventString:pseudoTarget.dispatchEvent.toString()};delete pseudoTarget;return{register:(function(obj){if((typeof obj.addEventListener=="function")||obj.attachEvent||(typeof obj.removeEventListener=="function")||obj.detachEvent||(typeof obj.dispatchEvent=="function")||obj.fireEvent){return}EventTarget.call(obj)}),unsubscribe:(function(obj){if(stringify(obj.addEventListener)===CROSSCHECK_TARGET.addListenerString){delete obj.addEventListener}if(stringify(obj.removeEventListener)===CROSSCHECK_TARGET.removeListenerString){delete obj.removeEventListener}if(stringify(obj.hasEventListener)===CROSSCHECK_TARGET.hasListenerString){delete obj.hasEventListener}if(stringify(obj.dispatchEvent)===CROSSCHECK_TARGET.dispatchEventString){delete obj.dispatchEvent}})}})();



	//[http://dean.edwards.name/packer/]	-	shrinked						- 2949 bytes	: (does not include [hasEventListener] functionality)
	var EventTargetProvider=(function(){var g=Object.prototype.toString,stringify=(function(a){return((a&&a.toString&&a.toString())||"")}),isBoolean=(function(){var b=(/^\[object\s+Boolean\]$/);return(function(a){return b.test(g.call(a))})})(),isString=(function(){var b=(/^\[object\s+String\]$/);return(function(a){return b.test(g.call(a))})})(),isFunction=(function(a){return((typeof a=="function")&&(typeof a.call=="function")&&(typeof a.apply=="function"))}),Handler={indexOf:(function(a,b){var c=(a.length-1);while(c>-1){if(a[c]===b){break}--c}return c})},Event=(function(a,b){this.constructor=Event;this.target=a;this.type=b;this.timeStamp=new Date()}),EventListener=(function(b,c,d){this.constructor=EventListener;var e=new Event(b,c);this.handleEvent=(function(a){if((typeof a=="object")&&a){a.target=e.target;a.type=e.type;a.timeStamp=e.timeStamp}else{a={target:e.target,type:e.type,timeStamp:e.timeStamp}}d(a)});this.getType=(function(){return c});this.getHandler=(function(){return d})}),EventTarget=(function(){var f={},removeEventListener=(function(a,b){var c=f[a],successfully=false;if(c){var d=c.handlers,listeners=c.listeners,idx=Handler.indexOf(d,b);if(idx>=0){d.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully});this.addEventListener=(function(a,b){var c;if(a&&isString(a)&&isFunction(b)){var d=f[a],listener=new EventListener(this,a,b);if(d){var e=d.handlers,listeners=d.listeners,idx=Handler.indexOf(e,b);if(idx==-1){e.push(listener.getHandler());listeners.push(listener);c=listener}else{c=listeners[idx]}}else{d=f[a]={};d.handlers=[listener.getHandler()];d.listeners=[listener];c=listener}}return c});this.removeEventListener=(function(a,b){return((isString(a)&&isFunction(b)&&removeEventListener(a,b))||((a instanceof EventListener)&&removeEventListener(a.getType(),a.getHandler()))||false)});this.dispatchEvent=(function(a){var b=false,type=(((typeof a=="object")&&(typeof a.type=="string")&&a.type)||((typeof a=="string")&&a)),event=(type&&f[type]);if(event){var c=(event&&event.listeners),len=((c&&c.length)||0),idx=0;if(len>=1){while(idx<len){c[idx++].handleEvent(a)}b=true}}return b})}),pseudoTarget=new EventTarget,CROSSCHECK_TARGET={addListenerString:pseudoTarget.addEventListener.toString(),removeListenerString:pseudoTarget.removeEventListener.toString(),dispatchEventString:pseudoTarget.dispatchEvent.toString()};delete pseudoTarget;return{register:(function(a){if((typeof a.addEventListener=="function")||a.attachEvent||(typeof a.removeEventListener=="function")||a.detachEvent||(typeof a.dispatchEvent=="function")||a.fireEvent){return}EventTarget.call(a)}),unsubscribe:(function(a){if(stringify(a.addEventListener)===CROSSCHECK_TARGET.addListenerString){delete a.addEventListener}if(stringify(a.removeEventListener)===CROSSCHECK_TARGET.removeListenerString){delete a.removeEventListener}if(stringify(a.dispatchEvent)===CROSSCHECK_TARGET.dispatchEventString){delete a.dispatchEvent}})}})();

	//[http://dean.edwards.name/packer/]	-	shrinked						- 3385 bytes	: (additionally featuring [hasEventListener])
	var EventTargetProvider=(function(){var g=Object.prototype.toString,stringify=(function(a){return((a&&a.toString&&a.toString())||"")}),isBoolean=(function(){var b=(/^\[object\s+Boolean\]$/);return(function(a){return b.test(g.call(a))})})(),isString=(function(){var b=(/^\[object\s+String\]$/);return(function(a){return b.test(g.call(a))})})(),isFunction=(function(a){return((typeof a=="function")&&(typeof a.call=="function")&&(typeof a.apply=="function"))}),Handler={indexOf:(function(a,b){var c=(a.length-1);while(c>-1){if(a[c]===b){break}--c}return c})},Event=(function(a,b){this.constructor=Event;this.target=a;this.type=b;this.timeStamp=new Date()}),EventListener=(function(b,c,d){this.constructor=EventListener;var e=new Event(b,c);this.handleEvent=(function(a){if((typeof a=="object")&&a){a.target=e.target;a.type=e.type;a.timeStamp=e.timeStamp}else{a={target:e.target,type:e.type,timeStamp:e.timeStamp}}d(a)});this.getType=(function(){return c});this.getHandler=(function(){return d})}),EventTarget=(function(){var f={},removeEventListener=(function(a,b){var c=f[a],successfully=false;if(c){var d=c.handlers,listeners=c.listeners,idx=Handler.indexOf(d,b);if(idx>=0){d.splice(idx,1);listeners.splice(idx,1);successfully=true}}return successfully}),hasEventListener=(function(a,b){return((f[a]||false)&&(Handler.indexOf(f[a].handlers,b)>=0))});this.addEventListener=(function(a,b){var c;if(a&&isString(a)&&isFunction(b)){var d=f[a],listener=new EventListener(this,a,b);if(d){var e=d.handlers,listeners=d.listeners,idx=Handler.indexOf(e,b);if(idx==-1){e.push(listener.getHandler());listeners.push(listener);c=listener}else{c=listeners[idx]}}else{d=f[a]={};d.handlers=[listener.getHandler()];d.listeners=[listener];c=listener}}return c});this.removeEventListener=(function(a,b){return((isString(a)&&isFunction(b)&&removeEventListener(a,b))||((a instanceof EventListener)&&removeEventListener(a.getType(),a.getHandler()))||false)});this.hasEventListener=(function(a,b){return((isString(a)&&isFunction(b)&&hasEventListener(a,b))||((a instanceof EventListener)&&hasEventListener(a.getType(),a.getHandler()))||false)});this.dispatchEvent=(function(a){var b=false,type=(((typeof a=="object")&&(typeof a.type=="string")&&a.type)||((typeof a=="string")&&a)),event=(type&&f[type]);if(event){var c=(event&&event.listeners),len=((c&&c.length)||0),idx=0;if(len>=1){while(idx<len){c[idx++].handleEvent(a)}b=true}}return b})}),pseudoTarget=new EventTarget,CROSSCHECK_TARGET={addListenerString:pseudoTarget.addEventListener.toString(),removeListenerString:pseudoTarget.removeEventListener.toString(),hasListenerString:pseudoTarget.hasEventListener.toString(),dispatchEventString:pseudoTarget.dispatchEvent.toString()};delete pseudoTarget;return{register:(function(a){if((typeof a.addEventListener=="function")||a.attachEvent||(typeof a.removeEventListener=="function")||a.detachEvent||(typeof a.dispatchEvent=="function")||a.fireEvent){return}EventTarget.call(a)}),unsubscribe:(function(a){if(stringify(a.addEventListener)===CROSSCHECK_TARGET.addListenerString){delete a.addEventListener}if(stringify(a.removeEventListener)===CROSSCHECK_TARGET.removeListenerString){delete a.removeEventListener}if(stringify(a.hasEventListener)===CROSSCHECK_TARGET.hasListenerString){delete a.hasEventListener}if(stringify(a.dispatchEvent)===CROSSCHECK_TARGET.dispatchEventString){delete a.dispatchEvent}})}})();



	//[http://dean.edwards.name/packer/]	-	shrinked + encoded	- 2148 bytes	: (does not include [hasEventListener] functionality)
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('4 1c=(2(){4 g=12.11.k,w=(2(a){3((a&&a.k&&a.k())||"")}),Z=(2(){4 b=(/^\\[v\\s+13\\]$/);3(2(a){3 b.M(g.q(a))})})(),E=(2(){4 b=(/^\\[v\\s+10\\]$/);3(2(a){3 b.M(g.q(a))})})(),H=(2(a){3((8 a=="2")&&(8 a.q=="2")&&(8 a.Y=="2"))}),F={A:(2(a,b){4 c=(a.S-1);R(c>-1){5(a[c]===b){16}--c}3 c})},C=(2(a,b){6.N=C;6.l=a;6.7=b;6.n=u 14()}),r=(2(b,c,d){6.N=r;4 e=u C(b,c);6.U=(2(a){5((8 a=="v")&&a){a.l=e.l;a.7=e.7;a.n=e.n}D{a={l:e.l,7:e.7,n:e.n}}d(a)});6.X=(2(){3 c});6.x=(2(){3 d})}),G=(2(){4 f={},i=(2(a,b){4 c=f[a],I=J;5(c){4 d=c.K,h=c.h,9=F.A(d,b);5(9>=0){d.L(9,1);h.L(9,1);I=W}}3 I});6.o=(2(a,b){4 c;5(a&&E(a)&&H(b)){4 d=f[a],j=u r(6,a,b);5(d){4 e=d.K,h=d.h,9=F.A(e,b);5(9==-1){e.V(j.x());h.V(j);c=j}D{c=h[9]}}D{d=f[a]={};d.K=[j.x()];d.h=[j];c=j}}3 c});6.i=(2(a,b){3((E(a)&&H(b)&&i(a,b))||((a 15 r)&&i(a.X(),a.x()))||J)});6.p=(2(a){4 b=J,7=(((8 a=="v")&&(8 a.7=="O")&&a.7)||((8 a=="O")&&a)),t=(7&&f[7]);5(t){4 c=(t&&t.h),B=((c&&c.S)||0),9=0;5(B>=1){R(9<B){c[9++].U(a)}b=W}}3 b})}),m=u G,y={P:m.o.k(),T:m.i.k(),Q:m.p.k()};z m;3{17:(2(a){5((8 a.o=="2")||a.18||(8 a.i=="2")||a.19||(8 a.p=="2")||a.1a){3}G.q(a)}),1b:(2(a){5(w(a.o)===y.P){z a.o}5(w(a.i)===y.T){z a.i}5(w(a.p)===y.Q){z a.p}})}})();',62,75,'||function|return|var|if|this|type|typeof|idx||||||||listeners|removeEventListener|listener|toString|target|pseudoTarget|timeStamp|addEventListener|dispatchEvent|call|EventListener||event|new|object|stringify|getHandler|CROSSCHECK_TARGET|delete|indexOf|len|Event|else|isString|Handler|EventTarget|isFunction|successfully|false|handlers|splice|test|constructor|string|addListenerString|dispatchEventString|while|length|removeListenerString|handleEvent|push|true|getType|apply|isBoolean|String|prototype|Object|Boolean|Date|instanceof|break|register|attachEvent|detachEvent|fireEvent|unsubscribe|EventTargetProvider'.split('|'),0,{}));

	//[http://dean.edwards.name/packer/]	-	shrinked + encoded	- 2331 bytes	: (additionally featuring [hasEventListener])
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('5 19=(2(){5 g=17.18.j,x=(2(a){3((a&&a.j&&a.j())||"")}),16=(2(){5 b=(/^\\[G\\s+1c\\]$/);3(2(a){3 b.O(g.z(a))})})(),A=(2(){5 b=(/^\\[G\\s+11\\]$/);3(2(a){3 b.O(g.z(a))})})(),y=(2(a){3((9 a=="2")&&(9 a.z=="2")&&(9 a.12=="2"))}),D={E:(2(a,b){5 c=(a.Z-1);P(c>-1){4(a[c]===b){1d}--c}3 c})},J=(2(a,b){6.W=J;6.w=a;6.8=b;6.n=B 1e()}),u=(2(b,c,d){6.W=u;5 e=B J(b,c);6.N=(2(a){4((9 a=="G")&&a){a.w=e.w;a.8=e.8;a.n=e.n}I{a={w:e.w,8:e.8,n:e.n}}d(a)});6.L=(2(){3 c});6.t=(2(){3 d})}),M=(2(){5 f={},i=(2(a,b){5 c=f[a],H=o;4(c){5 d=c.F,h=c.h,7=D.E(d,b);4(7>=0){d.Q(7,1);h.Q(7,1);H=R}}3 H}),k=(2(a,b){3((f[a]||o)&&(D.E(f[a].F,b)>=0))});6.r=(2(a,b){5 c;4(a&&A(a)&&y(b)){5 d=f[a],l=B u(6,a,b);4(d){5 e=d.F,h=d.h,7=D.E(e,b);4(7==-1){e.U(l.t());h.U(l);c=l}I{c=h[7]}}I{d=f[a]={};d.F=[l.t()];d.h=[l];c=l}}3 c});6.i=(2(a,b){3((A(a)&&y(b)&&i(a,b))||((a V u)&&i(a.L(),a.t()))||o)});6.k=(2(a,b){3((A(a)&&y(b)&&k(a,b))||((a V u)&&k(a.L(),a.t()))||o)});6.p=(2(a){5 b=o,8=(((9 a=="G")&&(9 a.8=="X")&&a.8)||((9 a=="X")&&a)),C=(8&&f[8]);4(C){5 c=(C&&C.h),K=((c&&c.Z)||0),7=0;4(K>=1){P(7<K){c[7++].N(a)}b=R}}3 b})}),m=B M,v={10:m.r.j(),Y:m.i.j(),T:m.k.j(),S:m.p.j()};q m;3{13:(2(a){4((9 a.r=="2")||a.1b||(9 a.i=="2")||a.14||(9 a.p=="2")||a.1a){3}M.z(a)}),15:(2(a){4(x(a.r)===v.10){q a.r}4(x(a.i)===v.Y){q a.i}4(x(a.k)===v.T){q a.k}4(x(a.p)===v.S){q a.p}})}})();',62,77,'||function|return|if|var|this|idx|type|typeof||||||||listeners|removeEventListener|toString|hasEventListener|listener|pseudoTarget|timeStamp|false|dispatchEvent|delete|addEventListener||getHandler|EventListener|CROSSCHECK_TARGET|target|stringify|isFunction|call|isString|new|event|Handler|indexOf|handlers|object|successfully|else|Event|len|getType|EventTarget|handleEvent|test|while|splice|true|dispatchEventString|hasListenerString|push|instanceof|constructor|string|removeListenerString|length|addListenerString|String|apply|register|detachEvent|unsubscribe|isBoolean|Object|prototype|EventTargetProvider|fireEvent|attachEvent|Boolean|break|Date'.split('|'),0,{}));
*/
