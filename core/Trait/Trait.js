(function (module_factory) {


  var
    global = this,

    define = global.define,
    module = global.module,
  //YUI = global.YUI,

    MODULE_NAME = "Trait"
  ;


//if ((typeof define == "function") && define.amd) {                            // AMD
  if (typeof define == "function") {                                            // AMD, RequireJS

    define(module_factory);

  } else if ((typeof module == "object") && module && module.exports) {         // NODE

    module.exports = module_factory();

  }/* else if ((typeof YUI == "function") && (typeof YUI.add == "function")) {  // YUI3

    YUI.add(MODULE_NAME, module_factory);

  }*/ else {                                                                    // GLOBAL

    global[MODULE_NAME] = module_factory();
  }


}).call(null, function () {
  return (function () {


    var
      global = this,


      isFunction = (

        (typeof global.isFunction == "function")

        && global.isFunction(global.isFunction)
        && global.isFunction

      ) || function (obj) {

        return (typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function");
      },
      object_keys = global.Object.keys
    ;
/*

    JavaScript natively supports/enables [Function] based [Trait] and [Mixin] patterns
    for object aggregation/composition. Both patterns are containers for a single or
    a whole bunch of implemented method(s) that is/are supposed to get applied to
    and run on objects.

    In my opinion [Trait]s in JavaScript are considered to be "stateless".
    If it comes to state that needs to be carried throughout an object such
    implementations should be referred to as [Mixin]s.

    In order to avoid or solve conflicts both [Trait] and [Mixin] based
    aggregation/composition patterns should make use of [Function.prototype.before],
    [Function.prototype.after] and [Function.prototype.around].

*/
    var
      createListOfBehaviors = function (descriptor) {
        return object_keys(

        //(((typeof descriptor == "object") || isFunction(descriptor)) && descriptor) || {}
          ((typeof descriptor == "object") && descriptor) || {}

        ).reduce((function (collector, key) {
          if (isFunction(descriptor[key])) {

            collector.push({
              "key": key,
              "fct": descriptor[key]
            });
          }
          return collector;
        }), []);
      },
      createListOfBehaviorNames = function (descriptor) {
        return object_keys(

        //(((typeof descriptor == "object") || isFunction(descriptor)) && descriptor) || {}
          ((typeof descriptor == "object") && descriptor) || {}

        ).reduce((function (collector, key) {
          if (isFunction(descriptor[key])) {

            collector.push(key);
          }
          return collector;
        }), []);
      },


      createTrait = function (descriptor) { //  - [Trait] Generator
        return (function (behaviors) {      //  - additional closure that preserves a list of behaviors for its
                                            //    enclosed object composition pattern.
          return function () {              //  - [Trait]
                                            //    [createTrait] returns a function that always should be called
            var composite = this;           //    with one of its native caller methods [call] or [apply].
            behaviors.forEach(function (behavior) {

              composite[behavior.key] = behavior.fct;
//console.log("+++ applying Trait +++", [behavior.key, behavior.fct]);
//console.log("+++ applying Trait +++", [this, composite, composite[behavior.key]]);
            });
          };
        }(createListOfBehaviors(descriptor)));
      },


      withdrawTrait = function (composite, descriptorOrTrait) {
        if (composite && ((typeof composite == "object") || isFunction(composite))) {

          var descriptor = {};
          if (isFunction(descriptorOrTrait)) {

            descriptorOrTrait.call(descriptor);
          } else {
            descriptor = descriptorOrTrait;
          }
          createListOfBehaviorNames(descriptor).forEach(function (methodName) {
          //if ((composite[methodName] + "") == (descriptor[methodName] + "")) {
            if ((composite[methodName] === descriptor[methodName]) || ((composite[methodName] + "") == (descriptor[methodName] + ""))) {

              composite[methodName] = null;
              delete composite[methodName];
            }
          });
        }
      }
    ;

    return { // module;

      "create": createTrait,
      "withdraw": withdrawTrait
    };


  }).call(null);
});



/*
  quick test
 */ /*
(function () {


  var
    global = this,


    VoiceTrait = global.Trait.create({

      "speak"   : function () {return ("speak :: >> ..." + this.speech + "... <<");},
      "shout"   : function () {return ("shout :: >> !!!" + this.speech + "!!! <<");},
      "wonder"  : function () {return ("wonder :: >> !??" + this.speech + "!?? <<");}
    }),

    voicelessSpeaker = {
      "speech": " ... object composition over class based inheritance ... "
    }
  ;
  console.log("global.Trait", global.Trait);
  console.log("VoiceTrait", VoiceTrait);

  console.log("voicelessSpeaker", voicelessSpeaker);
  console.log("voicelessSpeaker.speak", voicelessSpeaker.speak);
  console.log("voicelessSpeaker.shout", voicelessSpeaker.shout);
  console.log("voicelessSpeaker.wonder", voicelessSpeaker.wonder);


//apply behaviors by Trait
  console.log("VoiceTrait.call(voicelessSpeaker);");
  VoiceTrait.call(voicelessSpeaker);

  console.log("voicelessSpeaker", voicelessSpeaker);
  console.log("voicelessSpeaker.speak", voicelessSpeaker.speak);
  console.log("voicelessSpeaker.shout", voicelessSpeaker.shout);
  console.log("voicelessSpeaker.wonder", voicelessSpeaker.wonder);

  console.log("voicelessSpeaker.speak()", voicelessSpeaker.speak());
  console.log("voicelessSpeaker.shout()", voicelessSpeaker.shout());
  console.log("voicelessSpeaker.wonder()", voicelessSpeaker.wonder());


//withdraw behaviors by trait descriptor
  console.log("global.Trait.withdraw(voicelessSpeaker, { \"shout\": .., \"wonder\": ... });");
  global.Trait.withdraw(voicelessSpeaker, {

    "shout"   : function () {return ("shout :: >> !!!" + this.speech + "!!! <<");},
    "wonder"  : function () {return ("wonder :: >> !??" + this.speech + "!?? <<");}
  });

  console.log("voicelessSpeaker", voicelessSpeaker);
  console.log("voicelessSpeaker.speak", voicelessSpeaker.speak);
  console.log("voicelessSpeaker.shout", voicelessSpeaker.shout);
  console.log("voicelessSpeaker.wonder", voicelessSpeaker.wonder);

  console.log("voicelessSpeaker.speak()", voicelessSpeaker.speak());


//withdraw behaviors by Trait
  console.log("global.Trait.withdraw(voicelessSpeaker, VoiceTrait);");
  global.Trait.withdraw(voicelessSpeaker, VoiceTrait);

  console.log("voicelessSpeaker", voicelessSpeaker);
  console.log("voicelessSpeaker.speak", voicelessSpeaker.speak);
  console.log("voicelessSpeaker.shout", voicelessSpeaker.shout);
  console.log("voicelessSpeaker.wonder", voicelessSpeaker.wonder);

}).call(null);
*/


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.796 byte
(function(module_factory){var global=this,define=global.define,module=global.module,MODULE_NAME="Trait";if(typeof define=="function")define(module_factory);else if(typeof module=="object"&&module&&module.exports)module.exports=module_factory();else global[MODULE_NAME]=module_factory()}).call(null,function(){return function(){var global=this,isFunction=typeof global.isFunction=="function"&&global.isFunction(global.isFunction)&&global.isFunction||function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"},object_keys=global.Object.keys;var createListOfBehaviors=function(descriptor){return object_keys(typeof descriptor=="object"&&descriptor||{}).reduce(function(collector,key){if(isFunction(descriptor[key]))collector.push({"key":key,"fct":descriptor[key]});return collector},[])},createListOfBehaviorNames=function(descriptor){return object_keys(typeof descriptor=="object"&&descriptor||{}).reduce(function(collector,key){if(isFunction(descriptor[key]))collector.push(key);return collector},[])},createTrait=function(descriptor){return function(behaviors){return function(){var composite=this;behaviors.forEach(function(behavior){composite[behavior.key]=behavior.fct})}}(createListOfBehaviors(descriptor))},withdrawTrait=function(composite,descriptorOrTrait){if(composite&&(typeof composite=="object"||isFunction(composite))){var descriptor={};if(isFunction(descriptorOrTrait))descriptorOrTrait.call(descriptor);else descriptor=descriptorOrTrait;createListOfBehaviorNames(descriptor).forEach(function(methodName){if(composite[methodName]===descriptor[methodName]||composite[methodName]+""==descriptor[methodName]+""){composite[methodName]=null;delete composite[methodName]}})}};return{"create":createTrait,"withdraw":withdrawTrait}}.call(null)});


- Simple          -   851 byte
(function(d){var e=this.define,a=this.module;"function"==typeof e?e(d):"object"==typeof a&&a&&a.exports?a.exports=d():this.Trait=d()}).call(null,function(){return function(){var d="function"==typeof this.isFunction&&this.isFunction(this.isFunction)&&this.isFunction||function(a){return"function"==typeof a&&"function"==typeof a.call&&"function"==typeof a.apply},e=this.Object.keys;return{create:function(a){var f=e("object"==typeof a&&a||{}).reduce(function(c,b){d(a[b])&&c.push({key:b,fct:a[b]});return c},[]);return function(){var a=this;f.forEach(function(b){a[b.key]=b.fct})}},withdraw:function(a,f){if(a&&("object"==typeof a||d(a))){var c={};d(f)?f.call(c):c=f;var b=c;e("object"==typeof b&&b||{}).reduce(function(a,c){d(b[c])&&a.push(c);return a},[]).forEach(function(b){if(a[b]===c[b]||a[b]+""==c[b]+"")a[b]=null,delete a[b]})}}}}.call(null)});


*/
