

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
					// var customEventListener = obj.addEventListener("onCustomEvent", (function (evt) {print("onCustomEvent :\nevt : " + ((evt && ((evt.toSource && evt.toSource()) || evt.toString())) || evt) + "\n");}));
					// setTimeout((function () {obj.dispatchEvent("onCustomEvent");}), 1);
					// obj.dispatchEvent("onSomeOtherEvent");
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
var onCustomListener = obj.addEventListener("onCustomEvent", (function (evt) {print("onCustomEvent :\ngetDump(evt) : " + getDump(evt) + "\n\n");}));
obj.dispatchEvent("onCustomEvent");
obj.dispatchEvent({type:"onCustomEvent"});
obj.dispatchEvent({type:"onUndefinedEvent"});
obj.dispatchEvent("onUndefinedEvent");
//obj.removeEventListener(onCustomListener);

var xyHandler = (function (evt) {print("onCustomEvent :\ngetDump(evt) : " + getDump(evt) + "\n\n");});
var onXListener = obj.addEventListener("onCustomEvent", xyHandler);
var onYListener = obj.addEventListener("onCustomEvent", xyHandler);
print("\n(onXListener === onYListener) ? " + (onXListener === onYListener) + "\n\n");

obj.dispatchEvent({type:"onCustomEvent"});

print(obj.removeEventListener(onCustomListener));
obj.dispatchEvent({type:"onCustomEvent"});
print(obj.removeEventListener(onCustomListener));

print(obj.removeEventListener(onXListener.getType(), onYListener.getHandler()));
obj.dispatchEvent({type:"onCustomEvent"});
print(obj.removeEventListener(onXListener));
print("\n(onXListener === onYListener) ? " + (onXListener === onYListener) + "\n\n");

obj.addEventListener(onCustomListener.getType(), onCustomListener.getHandler());
obj.dispatchEvent(onCustomListener.getType());
