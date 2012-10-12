

        this.dispatchEvent = (function (evt/*:[string|String|Event-like-Object]*/) { /*:[true|false]*/

          var successfully = false,
          type = (((typeof evt == "object") && (typeof evt.type == "string") && evt.type) || ((typeof evt == "string") && evt)),
          event = (type && eventMap[type]);

          if (event) {
/*
recent - stable
*/
            var listeners = (event && event.listeners), handlers = [], len = ((listeners && listeners.length) || 0), idx = 0;

            if (len >= 1) {
              while (idx < len) {

                handlers.push(listeners[idx++].handleEvent);
              }
              idx = 0;
              while (idx < len) {

                handlers[idx++](evt); // to handle event dispatching serially is recommended if handler-processing is not that time consuming.
/*
last:

- unstable version if it did come to concurring addEventListener/removeEventListener accesses.

            var listeners = (event && event.listeners), len = ((listeners && listeners.length) || 0), idx = 0;

            if (len >= 1) {
              while (idx < len) {

                listeners[idx++].handleEvent(evt); // to handle event dispatching serially is recommended if handler-processing is not that time consuming.

*/ /*
- comment of the guy who discovered that one and also did provide a fix to it:

            Moin Peter,

            heute bin ich auf ein Problem mit dem EventTargetProvider gestoßen.
            Wir haben mehrere Listener am selben Objekt für das selbe Event
            registriert, die sich selbstständig wieder abmelden, wenn das Event
            dispatched wird. Sozusagen "run once".

            var onEventName = function (event) {
            // ...
            event.target.removeEventListener('eventName', onClose);
            };

            var onEventName2 = function (event) {
            // ...
            event.target.removeEventListener('eventName', onClose2);
            };

            obj.on('eventName', onEventName);
            obj.on('eventName', onEventName2);

            Bei einem obj.dispatchEvent('close') gibt es dann einen Fehler, weil
            das Array mit den Listenern, durch das removeEventListener, während
            der Iteration verändert wird. Genauer gesagt wird es verkürzt und am
            Ende auf nicht mehr vorhandene Elemente zugegriffen. Ganz theoretisch
            könnte gleichzeitig auch ein neuer EventHandler registriert werden.
            Dann würde dieser, für das aktuelle Event, direkt aufgerufen werden.

            Ich hänge mal einen Diff mit meiner Änderung an. Vielleicht möchtest
            du es ja in dein github Repository übernehmen. Natürlich könnte ich
            es auch forken und einen Pull Request stellen, aber so geht's (für mich)
            schneller ;-). Alternativ könnte man vielleicht das Array während des
            dispatchEvent auch vor Änderungen schützen und dann ggf. eine Exception
            auslösen, damit man weiß was man falsch gemacht hat.

            Viele Grüße aus Bremen,
            Alexander
*/
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
