/*
  [Boolean.ifTrue] / [Boolean.ifFalse] are a fun implementation of [http://en.wikipedia.org/wiki/Smalltalk Smalltalks]
  [ifTrue] / [ifFalse] - [http://en.wikipedia.org/wiki/Smalltalk#Control_structures control structure]; it is nothing
  one would really desire in JavaScript unless one's looking for an alternative to its native "if ... else" statement
  and has deeply fallen in love with using function expressions all along.

  links:

    EN: [http://en.wikipedia.org/wiki/Smalltalk#Control_structures]
    DE: [http://de.wikipedia.org/wiki/Smalltalk-80_(Programmiersprache)#IF-Anweisung]

  for a quick countercheck paste code into [http://jconsole.com/]:
*/


(function () {
  var BoolProto = this.Boolean.prototype;

  BoolProto.ifTrue = (function (fct, target/*optional:[object|function]*/) { // [caseTrue], [ifTrue], [ifTrueDo]
    var isTrue = this.valueOf();
    if (isTrue && (typeof fct == "function")) {
      fct.call(target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
    }
    return isTrue;
  });
  BoolProto.ifFalse = (function (fct, target/*optional:[object|function]*/) { // [caseFalse], [ifFalse], [ifFalseDo]
    var isTrue = this.valueOf();
    if (!isTrue && (typeof fct == "function")) {
      fct.call(target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
    }
    return isTrue;
  });
  BoolProto = null; delete BoolProto;

  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);





print((7 < 6).ifTrue(function () {
  print("(7 < 6) ... is true.");
}).ifFalse(function () {
  print("(7 < 6) ... is false.");
}).ifTrue(function () {
  print("(7 < 6) ... is true.");
}).ifFalse(function () {
  print("(7 < 6) ... is false.");
}));

print((7 > 6).ifTrue(function () {
  print("(7 > 6) ... is true.");
}).ifFalse(function () {
  print("(7 > 6) ... is false.");
}).ifTrue(function () {
  print("(7 > 6) ... is true.");
}).ifFalse(function () {
  print("(7 > 6) ... is false.");
}));


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 514 byte :
(function(){var BoolProto=this.Boolean.prototype;BoolProto.ifTrue=function(fct,target){var isTrue=this.valueOf();if(isTrue&&typeof fct=="function")fct.call(target||(typeof target=="undefined"||typeof target=="object"?null:target));return isTrue};BoolProto.ifFalse=function(fct,target){var isTrue=this.valueOf();if(!isTrue&&typeof fct=="function")fct.call(target||(typeof target=="undefined"||typeof target=="object"?null:target));return isTrue};BoolProto=null;delete BoolProto;delete arguments.callee}).call(null);

- Simple          - 382 byte :
(function(){var d=this.Boolean.prototype;d.ifTrue=function(b,a){var c=this.valueOf();if(c&&typeof b=="function")b.call(a||(typeof a=="undefined"||typeof a=="object"?null:a));return c};d.ifFalse=function(b,a){var c=this.valueOf();if(!c&&typeof b=="function")b.call(a||(typeof a=="undefined"||typeof a=="object"?null:a));return c};d=null;delete d;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 536 byte :
(function(){var BoolProto=this.Boolean.prototype;BoolProto.ifTrue=(function(fct,target){var isTrue=this.valueOf();if(isTrue&&(typeof fct=="function")){fct.call(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target))}return isTrue});BoolProto.ifFalse=(function(fct,target){var isTrue=this.valueOf();if(!isTrue&&(typeof fct=="function")){fct.call(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target))}return isTrue});BoolProto=null;delete BoolProto;delete arguments.callee}).call(null);

- packed / shrinked           - 404 byte :
(function(){var d=this.Boolean.prototype;d.ifTrue=(function(a,b){var c=this.valueOf();if(c&&(typeof a=="function")){a.call(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b))}return c});d.ifFalse=(function(a,b){var c=this.valueOf();if(!c&&(typeof a=="function")){a.call(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b))}return c});d=null;delete d;delete arguments.callee}).call(null);


*/ 
