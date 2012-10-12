

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
