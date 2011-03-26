/*
 *  [EventTargetProvider] is a singleton/module that features two methods
 *
 *  @method [register]:
 *    - any object that does not already feature an [EventTarget] Interface/Behavior can be passed to it.
 *    - thus such an object gets applied [EventTargetMixin] that is an implemented [EventTarget] Interface for customized event dispatching.
 *
 *  @method [unsubscribe]:
 *    - any object that features the above described [EventTarget] Interface/Behavior can discard this very behavior.
 *
 *
 *  [EventTargetMixin] is an implemented [EventTarget] Interface for customized event dispatching.
 *
 *  @method [on] / [addEventListener]: registers a method/event handler associated with a string labeled (custom) event. returns a reference to the created [EventListener] that now is associated with this object.
 *  @method [removeEventListener]: removes [EventListener]s that are associated with this object by [EventListener] references or by valid combined signatures of an event handler and a string labeled (custom) event.
 *  @method [hasEventListener]: tells whether or not [EventTarget] does already listen to a certain event.
 *  @method [dispatchEvent]: every object that features [EventTarget] behavior can trigger/dispatch (custom) events.
 *
 */


define(function () {


/*
  RequireJS specific:

  local variable within this RequireJS's module pattern scope
  acting as temporary namespace in order to prevent a global
  initialization of the [EventTargetProvider] module beneath.
*/
  var ETP = {};


/*
  code of [EventTargetProvider] module beneath does and always
  should exactly match one of the the latest implementation of

  [https://github.com/petsel/javascript-api-extensions/tree/master/core/SignalsAndSlots]

  like

  [https://github.com/petsel/javascript-api-extensions/raw/master/core/SignalsAndSlots/EventTargetProvider.js] or

*/ /*

//[https://github.com/petsel/javascript-api-extensions/raw/master/core/SignalsAndSlots/EventTargetProvider.min.js] or
  (function(o){var m=this;(o||m).EventTargetProvider=function(){var n={isString:function(a,e){return function(f){return a.test(e.call(f))}}(/^\[object\s+String\]$/,m.Object.prototype.toString),isFunction:function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"}},p={indexOf:function(a,e){for(var f=a.length;f--;)if(a[f]===e)break;return f}},s=function(a,e){this.constructor=s;this.target=a;this.type=e;this.timeStamp=new Date},q=function(a,e,f){this.constructor=q;var g=new s(a,e);this.handleEvent=function(i){if(i&&typeof i=="object"){i.target=g.target;i.type=g.type;i.timeStamp=g.timeStamp}else i={target:g.target,type:g.type,timeStamp:g.timeStamp};f(i)};this.getType=function(){return e};this.getHandler=function(){return f}},t=function(a,e,f){return function(){var g={},i=function(c,h){var b=g[c],d=false;if(b){var j=b.handlers;b=b.listeners;var k=a(j,h);if(k>=0){j.splice(k,1);b.splice(k,1);d=true}}return d};this.addEventListener=this.on=function(c,h){var b;if(c&&e(c)&&f(h)){var d=g[c];b=new q(this,c,h);if(d){var j=d.handlers;d=d.listeners;var k=a(j,h);if(k==-1){j.push(b.getHandler());d.push(b);b=b}else b=d[k]}else{d=g[c]={};d.handlers=[b.getHandler()];d.listeners=[b];b=b}}return b};this.removeEventListener=function(c,h){return e(c)&&f(h)&&i(c,h)||c instanceof q&&i(c.getType(),c.getHandler())||false};this.dispatchEvent=function(c){var h=false,b=typeof c=="object"&&typeof c.type=="string"&&c.type||typeof c=="string"&&c;if(b=b&&g[b]){var d=(b=b&&b.listeners)&&b.length||0,j=0;if(d>=1){for(;j<d;)b[j++].handleEvent(c);h=true}}return h}}}(p.indexOf,n.isString,n.isFunction),l=function(){var a={};t.call(a);return a}(),r={addListenerString:""+l.addEventListener,removeListenerString:""+l.removeEventListener,dispatchEventString:""+l.dispatchEvent};l=p=n=null;delete l;delete p;delete n;return{register:function(a){typeof a.addEventListener!="function"&&!a.attachEvent&&typeof a.removeEventListener!="function"&&!a.detachEvent&&typeof a.dispatchEvent!="function"&&!a.fireEvent&&t.call(a);return a},unsubscribe:function(a){""+a.addEventListener==r.addListenerString&&delete a.addEventListener;""+a.removeEventListener==r.removeListenerString&&delete a.removeEventListener;""+a.dispatchEvent==r.dispatchEventString&&delete a.dispatchEvent}}}();m=o=null;delete m;delete o;delete arguments.callee})

  .call(null, ETP);

*/

//[https://github.com/petsel/javascript-api-extensions/raw/master/core/SignalsAndSlots/EventTargetProvider.hasEventListener.min.js].
  (function(q){var m=this;(q||m).EventTargetProvider=function(){var n={isString:function(a,g){return function(h){return a.test(g.call(h))}}(/^\[object\s+String\]$/,m.Object.prototype.toString),isFunction:function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"}},r={indexOf:function(a,g){for(var h=a.length;h--;)if(a[h]===g)break;return h}},s=function(a,g){this.constructor=s;this.target=a;this.type=g;this.timeStamp=new Date},o=function(a,g,h){this.constructor=o;var f=new s(a,g);this.handleEvent=function(i){if(i&&typeof i=="object"){i.target=f.target;i.type=f.type;i.timeStamp=f.timeStamp}else i={target:f.target,type:f.type,timeStamp:f.timeStamp};h(i)};this.getType=function(){return g};this.getHandler=function(){return h}},u=function(a,g,h){return function(){var f={},i=function(b,d){var c=f[b],e=false;if(c){var j=c.handlers;c=c.listeners;var k=a(j,d);if(k>=0){j.splice(k,1);c.splice(k,1);e=true}}return e},t=function(b,d){return(f[b]||false)&&a(f[b].handlers,d)>=0};this.addEventListener=this.on=function(b,d){var c;if(b&&g(b)&&h(d)){var e=f[b];c=new o(this,b,d);if(e){var j=e.handlers;e=e.listeners;var k=a(j,d);if(k==-1){j.push(c.getHandler());e.push(c);c=c}else c=e[k]}else{e=f[b]={};e.handlers=[c.getHandler()];e.listeners=[c];c=c}}return c};this.removeEventListener=function(b,d){return g(b)&&h(d)&&i(b,d)||b instanceof o&&i(b.getType(),b.getHandler())||false};this.hasEventListener=function(b,d){return g(b)&&h(d)&&t(b,d)||b instanceof o&&t(b.getType(),b.getHandler())||false};this.dispatchEvent=function(b){var d=false,c=typeof b=="object"&&typeof b.type=="string"&&b.type||typeof b=="string"&&b;if(c=c&&f[c]){var e=(c=c&&c.listeners)&&c.length||0,j=0;if(e>=1){for(;j<e;)c[j++].handleEvent(b);d=true}}return d}}}(r.indexOf,n.isString,n.isFunction),l=function(){var a={};u.call(a);return a}(),p={addListenerString:""+l.addEventListener,removeListenerString:""+l.removeEventListener,hasListenerString:""+l.hasEventListener,dispatchEventString:""+l.dispatchEvent};l=r=n=null;delete l;delete r;delete n;return{register:function(a){typeof a.addEventListener!="function"&&!a.attachEvent&&typeof a.removeEventListener!="function"&&!a.detachEvent&&typeof a.dispatchEvent!="function"&&!a.fireEvent&&u.call(a);return a},unsubscribe:function(a){""+a.addEventListener==p.addListenerString&&delete a.addEventListener;""+a.removeEventListener==p.removeListenerString&&delete a.removeEventListener;""+a.hasEventListener==p.hasListenerString&&delete a.hasEventListener;""+a.dispatchEvent==p.dispatchEventString&&delete a.dispatchEvent}}}();m=q=null;delete m;delete q;delete arguments.callee})

  .call(null, ETP);


/*
  RequireJS specific:

  finally return the reference of [EventTargetProvider]
  that was bound to the local variable [ETP] back into
  RequireJS's functional execution scope.
*/
  return ETP.EventTargetProvider;
});
