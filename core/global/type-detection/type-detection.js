//  -----   feel free to use this stuff   ---   play with it   ---   copy as You  like   -----
//  -----   but leave this authors 4 lines untouched:    pseliger@gmx.net   [may 2009]   -----
//
//  partly "stolen" from Douglas Crockford  : "http://www.crockford.com/javascript/remedial.html"
//
//  extended javascript-api-methods         :
//  * jsApi-extension-name / file-name      : "jsApi.Object.typeDetection.new.dev.xFrameSafe.js"
//  * original download-location            : "http://www.pseliger.de/jsExtendedApi/jsApi.Object.typeDetection.new.dev.xFrameSafe.js"
//
//  sixth code revision :       may-03-2009 - *cross frame safe* fundamentally required type detection of any ECMAScript/JavaScript-Type/Value;
//                                          - no type detection of any specific [HTMLElement]s, [Node]s, [NodeList]s or [HTMLCollection]s though;
//                                          - getting rid of the global "isArrayLike";
//  fifth code revision :       may-25-2006 - introduction of global "isArrayLike";
//  fourth code revision:     april-18-2006 - rewriting of the global "isNode", "isValue", "isObject", and all "Boolean|Number|String" methods;
//  third code revision :     march-02-2005 - complete rewriting of all of the global functions and object methods;
//                                          - "Object.getConstructorName" as well as "Object.getObjectType" finally got kicked out;
//  second code revision:   january-25-2005 - state of the art DOM-node-detection;
//  first code revision :     march-25-2004 - there is a new global function "isEmpty";
//                                          - objects featuring a native constructor prototype can access "isEmpty" as a method too;
//  first public release: september-30-2003 - provides constructor and type detection of any javascript object;
//


/*
  for testing please paste example scripts into [http://jconsole.com/]
*/



(function () {


  var sh/*global*/ = ((this && (this.window === this) && /*this.*/window) || this), // "scripting host" or "global object"

  regXClassName = (/^\[object\s+(.*)\]$/),

  exposeImplementation = sh.Object.prototype.toString,
  exposeErrorImplementation = sh.Error.prototype.toString;/*

  8.6.2
    Object Internal Properties and Methods

      ...

      The value of the [[Class]] internal property is defined by this specification for every kind
      of built-in object. The value of the [[Class]] internal property of a host object may be any
      String value except one of "Arguments", "Array", "Boolean", "Date", "Error", "Function",
      "JSON", "Math", "Number", "Object", "RegExp", and "String". The value of a [[Class]] internal
      property is used internally to distinguish different kinds of built-in objects. Note that this
      specification does not provide any means for a program to access that value except through
      Object.prototype.toString (see 15.2.4.2).

      ...

  15.2.4.2
    Object.prototype.toString ( )

      When the toString method is called, the following steps are taken:
      1. Let O be the result of calling ToObject passing the this value as the argument.
      2. Let class be the value of the [[Class]] internal property of O.
      3. Return the string value that is the result of concatenating the three strings "[object ", class, and "]".
*/



  // type detection

  sh.isUndefined = (function (obj/*:[object|value]*/) {

    return (typeof obj == "undefined");
  });
  sh.isDefined = (function (obj/*:[object|value]*/) {

    return (typeof obj != "undefined");
  });
  sh.isNull = (function (obj/*:[object|value]*/) {

    return (!obj && (typeof obj == "object"));
  });
  sh.isNotNull = (function (obj/*:[object|value]*/) {

    return (obj || (typeof obj != "object"));
  });

  sh.isUndefinedOrNull = (function (obj/*:[object|value]*/) {

    return (!obj && ((typeof obj == "undefined") || (typeof obj == "object")));
  });
  sh.isNeitherUndefinedNorNull = (function (obj/*:[object|value]*/) {

    return (obj || ((typeof obj != "undefined") && (typeof obj != "object")));
  });


  sh.isPrimitive = (function (obj/*:[object|value]*/) { // returns true in case of one of the primitive ECMAScript values [boolean], [number] or [string] is this global functions argument.

  //return ((typeof obj != "undefined") && (typeof obj != "object") && (typeof obj != "function"));
    return ((typeof obj == "string") || (typeof obj == "number") || (typeof obj == "boolean"));
  });
  sh.isValue = (function () {

    var isPrimitive = sh.isPrimitive, isUndefinedOrNull = sh.isUndefinedOrNull;
    return (function (obj/*:[object|value]*/) { // returns true in case of one of the primitive ECMAScript values [boolean], [number], [string], [undefined] or [null] is this global functions argument.

    //return (isPrimitive(obj) || isUndefined(obj) || isNull(obj));
    //return (isPrimitive(obj) || (!obj && ((typeof obj == "undefined") || (typeof obj == "object"))));

      return (isPrimitive(obj) || isUndefinedOrNull(obj));
    });
  })();
  sh.isObject = (function (obj/*:[object|value]*/) { // returns true in case of one of the ECMAScript instances of [[Boolean]], [[Number]], [[String]], [[Date]], [[Error]], [[RegExp]], [[Function]], [[Array]] or [[Object]], an object generated by a self-defined constructor function or a clients DOM-object is this global functions argument.

    return (obj && ((typeof obj == "object") || (typeof obj == "function"))); // (typeof obj == "function") : as for real [[Function]] types or even mozillas older [[RegExp]] implementations.
  });


  sh.isNative = (function () {

    var isNeitherUndefinedNorNull = sh.isNeitherUndefinedNorNull;
    return (function (obj/*:[object|value]*/) { // returns true for every ECMAScript-conform object that is this global functions argument.

    //return (isDefined(obj) && isNotNull(obj) && (typeof obj.constructor == "function"));
    //return ((obj || ((typeof obj != "undefined") && (typeof obj != "object"))) && (typeof obj.constructor == "function"));

      return (isNeitherUndefinedNorNull(obj) && (typeof obj.constructor == "function"));
    });
  })();
  sh.isAlien = (function () {

    var isObject = sh.isObject;
    return (function (obj/*:[object|value]*/) { // return value depends on browser implementation - for instance in MSIE any DOM-node is an alien so far since such an object does not support the [constructor] property (and of course the type of an objects constructor always is supposed to be "function").

      return (isObject(obj) && (typeof obj.constructor != "function"));
    });
  })();/*

  4.3.6 Native Object
    A native object is any object supplied by an ECMAScript implementation independent of the host environment.
    Standard native objects are defined in this specification. Some native objects are built-in; others may be
    constructed during the course of execution of an ECMAScript program.

  4.3.7 Built-in Object
    A built-in object is any object supplied by an ECMAScript implementation, independent of the host environment,
    which is present at the start of the execution of an ECMAScript program. Standard built-in objects are defined
    in this specification, and an ECMAScript implementation may specify and define others. Every built-in object is
    a native object. A built-in constructor is a built-in object that is also a constructor.

  4.3.8 Host Object
    A host object is any object supplied by the host environment to complete the execution environment of ECMAScript.
    Any object that is not native is a host object.
*/


  sh.isBoolean = (function () {

    var regXBaseClass = (/^\[object\s+Boolean\]$/), expose = exposeImplementation;
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof Boolean)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof Boolean))); // too much - missing the point.

      return regXBaseClass.test(expose.call(obj));
    });
  })();
  sh.isBooleanValue = (function (obj/*:[object|value]*/) {

    return (typeof obj == "boolean");
  });
  sh.isBooleanObject = (function (obj/*:[object|value]*/) {

    return (isBoolean(obj) && (typeof obj != "boolean"));
  });


//reverse order of implementing global [isNumber...] methods due to an additional validation within global [isNumber] that only will return true if number values/objects are finite too.

  sh.isNumberObject = (function () {

  //print(typeof Number.NaN); // number
  //print(typeof (new Number(Number.NaN))); // object
  //print(new Number(Number.NaN)); // "NaN"
  //print(typeof Infinity); // number
  //print(typeof (new Number(Infinity))); // object
  //print(new Number(Infinity)); // "Infinity"

    var regXBaseClass = (/^\[object\s+Number\]$/), expose = exposeImplementation;
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof Number) && isFinite(obj)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return ((regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof Number))) && isFinite(obj)); // too much - missing the point.

      return (regXBaseClass.test(expose.call(obj)) && (typeof obj != "number")); // do not test for [Infinity] value but test for *objectness* instead.
    });
  })();
  sh.isNumberValue = (function (obj/*:[object|value]*/) {

    return (typeof obj == "number");
  });
  sh.isNumber = (function () {

    var isFinite = sh.isFinite, isNumberObject = sh.isNumberObject;
    return (function (obj/*:[object|value]*/) { // [isFinite] as of this implementation did prove its x-frame-safety.

      return (((typeof obj == "number") || isNumberObject(obj)) && isFinite(obj)); // additional test for [Infinity] value.
    });
  })();/*

  or is it even better changing above implementations back and add an additional 4th method [isValidNumber] to this global [isNumber...] method set?
*/ /*
  sh.isNumber = (function () {

    var regXBaseClass = (/^\[object\s+Number\]$/), expose = exposeImplementation;
    return (function (obj/ *:[object|value]* /) {

    //return (isNative(obj) && (obj instanceof Number)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof Number))); // too much - missing the point.
      return regXBaseClass.test(expose.call(obj));
    });
  })();
  sh.isNumberValue = (function (obj/ *:[object|value]* /) {

    return (typeof obj == "number");
  });
  sh.isNumberObject = (function (obj/ *:[object|value]* /) {

    return (isNumber(obj) && (typeof obj != "number"));
  });
  sh.isFiniteNumber = (function (obj/ *:[object|value]* /) {

    return (isNumber(obj) && isFinite(obj));
  });
*/


  sh.isString = (function () {

    var regXBaseClass = (/^\[object\s+String\]$/), expose = exposeImplementation;
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof String)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof String))); // too much - missing the point.

      return regXBaseClass.test(expose.call(obj));
    });
  })();
  sh.isStringValue = (function (obj/*:[object|value]*/) {

    return (typeof obj == "string");
  });
  sh.isStringObject = (function (obj/*:[object|value]*/) {

    return (isString(obj) && (typeof obj != "string"));
  });


  if (typeof sh.Array.isArray != "function") {

    sh.isArray = sh.Array.isArray = (function () {

      var regXBaseClass = (/^\[object\s+Array\]$/), expose = exposeImplementation;
      return (function (obj/*:[object|value]*/) {

      //return (isNative(obj) && (obj instanceof Array)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
      //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof Array))); // too much - missing the point.

        return regXBaseClass.test(expose.call(obj));
      });
    })();
  }/*
  sh.isListLike = (function (obj/ *:[object|value]* /) {

  });*/


  sh.isObjectObject = (function () { // returns true only in case of this global functions argument is a native ECMAScript [[Object]] type but neither the [null] value nor an ECMAScript [[Function]] type.

    var regXBaseClass = (/^\[object\s+Object\]$/), expose = exposeImplementation, isNative = sh.isNative;
    return (function (obj/*:[object|value]*/) {

    //return ((obj || ((typeof obj != "undefined") && (typeof obj != "object"))) && (typeof obj.constructor == "function") && regXBaseClass.test(expose.call(obj)));
    //return (isDefined(obj) && isNotNull(obj) && (typeof obj.constructor == "function") && regXBaseClass.test(expose.call(obj)));
    //return (isNeitherUndefinedNorNull(obj) && (typeof obj.constructor == "function") && regXBaseClass.test(expose.call(obj)));

      return (isNative(obj) && regXBaseClass.test(expose.call(obj)));
    });
  })();


  sh.isFunction = (function (obj/*:[object|value]*/) { // returns true only in case of this global functions argument is an ECMAScript [[Function]] type.

    return ((typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function")); // x-frame-safe and also filters e.g. mozillas [[RegExp]] implementation.
  });/*
  sh.isFunction = (function () { // returns true only in case of this global functions argument is an ECMAScript [[Function]] type.

    var regXBaseClass = (/^\[object\s+Function\]$/), expose = exposeImplementation;
    return (function (obj/ *:[object|value]* /) {

      return (regXBaseClass.test(expose.call(obj)) && regXBaseClass.test(expose.call(obj.call)) && regXBaseClass.test(expose.call(obj.apply)));
    });
  })();*/
  sh.isCallable = (function () { // returns true only in case of this global functions argument is a callable type.

  //var regXCallable = (/function\s+[^(]+\([^)]*\)\s*\{/);
    var regXCallable = (/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/),
    isFunction = sh.isFunction,
    getCallability = (function (mayBeCallee) {

      var isCallable = false;
      try {
        mayBeCallee();
        isCallable = true;
      } catch (err) {
      //alert(err);
        isCallable = (!(err instanceof TypeError) && (err.message != "NOT_SUPPORTED_ERR"));
      }
      return isCallable;
    });
    return (function (obj/*:[object|value]*/) {

    //return (isFunction(obj)/* || regXCallable.test(String(obj))*/ || getCallability(obj));
      return (isFunction(obj) || regXCallable.test("" + obj) || getCallability(obj)); /*

      - opera falsly can bypass this since for example [Element] claims to be typeof "function" as well as supporting both functional [call] and [apply].
      - the [getCallability] test then will not be entered even though it was going to fail throwing "Error: NOT_SUPPORTED_ERR".

      - either way - this test remains unchanged so far since a natively implemented [Function]-object always should be callable.
    */
    });
  })();


  sh.isRegExp = (function () {

    var regXBaseClass = (/^\[object\s+RegExp\]$/), expose = exposeImplementation;
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof RegExp)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof RegExp))); // too much - missing the point.

      return regXBaseClass.test(expose.call(obj));
    });
  })();


  sh.isDate = (function () {

    var regXBaseClass = (/^\[object\s+Date\]$/), expose = exposeImplementation;
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof Date)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof Date))); // too much - missing the point.

      return regXBaseClass.test(expose.call(obj));
    });
  })();


/*
  print(TypeError.prototype.toString === Error.prototype.toString);
  print(TypeError.prototype.toString === Object.prototype.toString);
  print(Error.prototype.toString === Object.prototype.toString);
  print("\n")
  print(TypeError.prototype.toString.call(new TypeError("foo")));
  print(TypeError.prototype.toString.call(new RangeError("bar")));
  print(TypeError.prototype.toString.call(new URIError("baz")));
  print(TypeError.prototype.toString.call(new Error("faa")));
  print("\n")
  print(Error.prototype.toString.call(new TypeError("foo")));
  print(Error.prototype.toString.call(new RangeError("bar")));
  print(Error.prototype.toString.call(new URIError("baz")));
  print(Error.prototype.toString.call(new Error("faa")));
  print("\n")
  print(Error.prototype.toString.call(new TypeError));
  print(Error.prototype.toString.call(new RangeError));
  print(Error.prototype.toString.call(new URIError));
  print(Error.prototype.toString.call(new Error));


  var obj = new Error("foo"); print((/^\[object\s+Error\]$/).test(Object.prototype.toString.call(obj))); // true
  obj = new TypeError("foo"); print((/^\[object\s+Error\]$/).test(Object.prototype.toString.call(obj))); // true
  obj = new RangeError("foo"); print((/^\[object\s+Error\]$/).test(Object.prototype.toString.call(obj))); // true
  obj = new EvalError("foo"); print((/^\[object\s+Error\]$/).test(Object.prototype.toString.call(obj))); // true
  obj = new ReferenceError("foo"); print((/^\[object\s+Error\]$/).test(Object.prototype.toString.call(obj))); // true
  obj = new SyntaxError("foo"); print((/^\[object\s+Error\]$/).test(Object.prototype.toString.call(obj))); // true
  obj = new URIError("foo"); print((/^\[object\s+Error\]$/).test(Object.prototype.toString.call(obj))); // true
  obj = new RegExp; print((/^\[object\s+Error\]$/).test(Object.prototype.toString.call(obj))); // false

  var obj = new Error("foo"); print(obj.name && (obj.name == "Error")); // true
  obj = new TypeError("foo"); print(obj.name && (obj.name == "TypeError")); // true
  obj = new RangeError("foo"); print(obj.name && (obj.name == "RangeError")); // true
  obj = new EvalError("foo"); print(obj.name && (obj.name == "EvalError")); // true
  obj = new ReferenceError("foo"); print(obj.name && (obj.name == "ReferenceError")); // true
  obj = new SyntaxError("foo"); print(obj.name && (obj.name == "SyntaxError")); // true
  obj = new URIError("foo"); print(obj.name && (obj.name == "URIError")); // true
  obj = new RegExp; print(obj.name && (obj.name == "Error")); // undefined
  obj = new RegExp; print((typeof obj.name == "string") && (obj.name == "Error")); // false
*/
  sh.isError = (function () { // [isError] : not specific - will match all [Error] types

    var regXErrorClass = (/^\[object\s+Error\]$/), expose = exposeImplementation;
    return (function (obj/*:[object|value]*/) {

      return regXErrorClass.test(expose.call(obj));
    });
  })();
  sh.isGenericError = (function () { // [isErrorError]

    var regXErrorType = (/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/), expose = exposeErrorImplementation, isError = sh.isError; // (mozilla|webkit) || (mozilla|webkit) || (opera)
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "Error"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "Error"))));
    });
  })();
  sh.isEvalError = (function () {

    var regXErrorType = (/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/), expose = exposeErrorImplementation, isError = sh.isError; // (mozilla|webkit) || (mozilla|webkit) || (opera)
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "EvalError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "EvalError"))));
    });
  })();
  sh.isRangeError = (function () {

    var regXErrorType = (/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/), expose = exposeErrorImplementation, isError = sh.isError; // (mozilla|webkit) || (mozilla|webkit) || (opera)
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "RangeError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "RangeError"))));
    });
  })();
  sh.isReferenceError = (function () {

    var regXErrorType = (/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/), expose = exposeErrorImplementation, isError = sh.isError; // (mozilla|webkit) || (mozilla|webkit) || (opera)
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "ReferenceError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "ReferenceError"))));
    });
  })();
  sh.isSyntaxError = (function () {

    var regXErrorType = (/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/), expose = exposeErrorImplementation, isError = sh.isError; // (mozilla|webkit) || (mozilla|webkit) || (opera)
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "SyntaxError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "SyntaxError"))));
    });
  })();
  sh.isTypeError = (function () {

    var regXErrorType = (/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/), expose = exposeErrorImplementation, isError = sh.isError; // (mozilla|webkit) || (mozilla|webkit) || (opera)
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "TypeError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "TypeError"))));
    });
  })();
  sh.isURIError = (function () {

    var regXErrorType = (/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/), expose = exposeErrorImplementation, isError = sh.isError; // (mozilla|webkit) || (mozilla|webkit) || (opera)
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "URIError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "URIError"))));
    });
  })();/*


  sh.isHTMLCollection = (function () {

    var regXBaseClass = (/^\[object\s+HTMLCollection\]$/), expose = exposeImplementation;
    return (function (obj/ *:[object|value]* /) {

      return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof HTMLCollection)));
    });
  })();
  sh.isNodeList = (function () {

    var regXBaseClass = (/^\[object\s+NodeList\]$/), expose = exposeImplementation;
  //var regXBaseClass = (/^\[object\s+HTMLCollection\]$/), expose = exposeImplementation;
    return (function (obj/ *:[object|value]* /) {

      return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof NodeList)));
    });
  })();
  sh.isHTMLElement = (function () {

  //var regXBaseClass = (/^\[object\s+Node\]$/), expose = exposeImplementation;
  //var regXBaseClass = (/^\[object\s+Element\]$/), expose = exposeImplementation;
    var regXBaseClass = (/^\[object\s+HTML(.*)?Element\]$/), expose = exposeImplementation;
    return (function (obj/ *:[object|value]* /) {

      return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof HTMLElement)));
    });
  })();
*/


//exposeImplementation.call(null); // [object builtins] - google chrome and safari only
//exposeImplementation.call(); // [object builtins] - google chrome and safari only
//exposeImplementation.call(undefined); // [object builtins] - google chrome and safari only

  sh.Object.prototype.getBaseName = (function () {

    var regXBaseClass = regXClassName, expose = exposeImplementation, global = sh;
    return (function (delegatee) { // [delegatee] : object that explicitly got delegated by e.g. [Object.getBaseName] in order to distinguish it from [global].

    //var str = "builtins"; // within google chrome and safari [object builtins] is a fallback message according to built-in objects that get not closer specified.
      var str;
      if (this === global) {
        if (typeof delegatee == "undefined") { // implementation of [isUndefined]
          str = "UndefinedType";
        } else if (!delegatee && (typeof delegatee == "object")) { // implementation of [isNull]
          str = "NullType";
        } else {
          str = regXBaseClass.exec(expose.call(delegatee))[1];
        }
      } else {
        str = regXBaseClass.exec(expose.call(this))[1];
      }
      return str;
    });
  })();
  sh.Object.getBaseName = (function () {

    var getBaseName = sh.Object.prototype.getBaseName, global = sh;
    return (function (obj/*:[object|value]*/) {

      return getBaseName.call(global, obj); // explicit delegation via apply/call.
    });
  })();/*

  print(Object.getBaseName(document.documentElement)); // HTMLHtmlElement || Object(msie)
  print(Object.getBaseName(document.body)); // HTMLBodyElement || Object(msie)
  print(Object.getBaseName(sh)); // Window || global(google chrome, safari) || Object(msie)

  (function() {print(Object.getBaseName(arguments));})(); // Object
  (function() {print(arguments.getBaseName());})(); // Object

  print(Object.getBaseName(new RangeError)); // Error

  print(Object.getBaseName(new Function)); // Function
  print(Object.getBaseName(function(){})); // Function

  print(Object.getBaseName(Function)); // Function
  print(Object.getBaseName(Array)); // Function
  print(Object.getBaseName(RegExp)); // Function
  print(Object.getBaseName(Object)); // Function

  print(Object.getBaseName(new Object)); // Object

  print(Object.getBaseName(null)); // NullType - was before: Window || global(google chrome, safari) || Object(msie)
  print(Object.getBaseName(undefined)); // UndefinedType - was before: Window || global(google chrome, safari) || Object(msie)
  print(Object.getBaseName(window.undefined)); // UndefinedType - was before: Window || global(google chrome, safari) || Object(msie)
  print(Object.getBaseName()); // UndefinedType - was before: Window || global(google chrome, safari) || Object(msie)
*/


  sh.Object.prototype.getBase = (function () { // or [getBaseType] or even more precisely [getBaseTypeOrValue]

    var regXBaseClass = regXClassName, expose = exposeImplementation, isUndefinedOrNull = sh.isUndefinedOrNull, global = sh; // (!obj && ((typeof obj == "undefined") || (typeof obj == "object"))) // implementation of [isUndefinedOrNull]
    return (function (delegatee) { // [delegatee] : an object that explicitly got delegated by e.g. [Object.getBase] in order to distinguish it from [global].

      var Base;
      if (this === global) {
        if (isUndefinedOrNull(delegatee)) {
          Base = delegatee;
        } else {
          Base = global[regXBaseClass.exec(expose.call(delegatee))[1]];
        }
      } else {
        Base = global[regXBaseClass.exec(expose.call(this))[1]];
      }
      return Base;
    });
  })();
  sh.Object.getBase = (function () { // or [getBaseType] or even more precisely [getBaseTypeOrValue]

    var getBase = sh.Object.prototype.getBase, global = sh;
    return (function (obj/*:[object|value]*/) {

      return getBase.call(global, obj); // explicit delegation via apply/call.
    });
  })();/*

  tests within mozilla firefox 3.x, google chrome 2.x, opera 9.64 and microsoft internet explorer 7:

  print(Object.prototype.toString.call(document));                  // mozffx: [object HTMLDocument]                // chrome: [object HTMLDocument]                        // opera: [object HTMLDocument]                    // msie: [object Object]
  print(Object.prototype.toString.call(document.body));              // mozffx: [object HTMLBodyElement]              // chrome: [object HTMLBodyElement]                      // opera: [object HTMLBodyElement]                // msie: [object Object]
  print(document.body.constructor);                                  // mozffx: [object HTMLBodyElement]              // chrome: function HTMLBodyElement() { [native code] }  // opera: function Element() { [native code] }    // msie: undefined
  print(document.body.constructor.prototype);                        // mozffx: [xpconnect wrapped native prototype]  // chrome: [object Object]                              // opera: [object Object]                          // msie: "TypeError: 'document.body.constructor.prototype' ist Null oder kein Objekt"
  print(document.body.constructor.prototype.constructor);            // mozffx: function Object() { [native code] }  // chrome: function HTMLBodyElement() { [native code] }  // opera: function Element() { [native code] }    // msie: "TypeError: 'document.body.constructor.prototype' ist Null oder kein Objekt"
  print(document.body.constructor.prototype.constructor.prototype);  // mozffx: [object Object]                      // chrome: [object Object]                              // opera: [object Object]                          // msie: "TypeError: 'document.body.constructor.prototype' ist Null oder kein Objekt"
  print(typeof document.body.constructor.call);                      // mozffx: undefined                            // chrome: undefined  !!                                // opera: function //----+                        // msie: "TypeError: 'document.body.constructor' ist Null oder kein Objekt"
  print(typeof document.body.constructor.apply);                    // mozffx: undefined                            // chrome: undefined  !!                                // opera: function //--+ |                        // msie: "TypeError: 'document.body.constructor' ist Null oder kein Objekt"
  print(typeof document.body.constructor);                          // mozffx: object                                // chrome: function    !!                                // opera: function // print(new Element) throws:  // msie: undefined
                                                                                                                                                                                               // "Error: NOT_SUPPORTED_ERR"
*/

})();



Array.forEach=(function(list,fct,target){var len=(list&&list.length);if(typeof len=="number"){if(typeof fct=="function"){target=(((typeof target=="undefined")||((typeof target=="obj")&&!target))?(null):(target));var i=0,elm;while(i<len){elm=list[i];if((typeof elm!="undefined")||(i in list)){fct.call(target,elm,i,list)}++i}}else{throw(new TypeError("2nd argument needs to be a function type."));}}else{throw(new TypeError("1st argument needs to be some kind of list."));}});

window.analyzeAliens = (function () {

//alert(arguments.length);
  Array.forEach(arguments, (function (elm/*, idx, arr*/) {
    print("(typeof " + elm + ") : " + (typeof elm));
    print("(" + elm + " instanceof Object) ? " + (elm instanceof Object));
    print(elm + ".constructor : " + elm.constructor);
  //print("isNaN(" + elm + ") : " + isNaN(elm));
  //print("isFinite(" + elm + ") : " + isFinite(elm));
    print("\n");
    print("Object.prototype.toString.call(elm) : \"" + Object.prototype.toString.call(elm) + "\"");
    print("\n");
    print("\nError.prototype.toString.call(" + elm + ") : " + Error.prototype.toString.call(elm));
    print("\n");
    print("\n");
  }));
});
window.testForNull = (function (obj) {

  print("(obj == null) ? " + (obj == null));
  print("(obj === null) ? " + (obj === null));

  print("(null == null) ? " + (null == null));
  print("(null === null) ? " + (null === null));

  print("obj : " + obj);
  print("(typeof obj) : " + (typeof obj));

  print("\n");
  print("\n");
});

var testElm = document.createElement("iframe");
testElm.src = "about:blank";
testElm.name = "testWin";
testElm.id = "testWin";
document.body.appendChild(testElm);
var testWin = window.frames[0];
//var testWin = window.open("about:blank", "test", "");
testWin.document.open("text/html");
testWin.document.write('<html><head><title>test<\/title>' +
  '<s' + 'cript type="text/javas' + 'cript">' +
  '/*alert(parent.analyzeAliens);*/parent.testForNull(null),parent.analyzeAliens(/*window.undefined, parent.undefined, null, */ /*Number.NaN, (new Number(Number.NaN)), 10000, (new Number(10000)), */{}, [], (new RegExp), (function () {return;}), (new Function), (new Date), (new Error), (new TypeError), (new RangeError), (new URIError), (new Error)); ' +
//'alert(window.opener.analyzeAliens);window.opener.analyzeAliens({}, [], (new RegExp), (function () {return;}), (new Function), (new Date), (new Error)); ' +
  '<\/s' + 'cript>' +
  '<\/head><body><h1>analyze aliens testcase<\/h1><\/body><\/html>');
testWin.document.close();



/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 6.996 byte : (additionally featuring [getBase ...] functionality)
(function(){var sh=this&&this.window===this&&window||this,regXClassName=/^\[object\s+(.*)\]$/,exposeImplementation=sh.Object.prototype.toString,exposeErrorImplementation=sh.Error.prototype.toString;sh.isUndefined=function(obj){return typeof obj=="undefined"};sh.isDefined=function(obj){return typeof obj!="undefined"};sh.isNull=function(obj){return!obj&&typeof obj=="object"};sh.isNotNull=function(obj){return obj||typeof obj!="object"};sh.isUndefinedOrNull=function(obj){return!obj&&(typeof obj=="undefined"||
typeof obj=="object")};sh.isNeitherUndefinedNorNull=function(obj){return obj||typeof obj!="undefined"&&typeof obj!="object"};sh.isPrimitive=function(obj){return typeof obj=="string"||typeof obj=="number"||typeof obj=="boolean"};sh.isValue=function(){var isPrimitive=sh.isPrimitive,isUndefinedOrNull=sh.isUndefinedOrNull;return function(obj){return isPrimitive(obj)||isUndefinedOrNull(obj)}}();sh.isObject=function(obj){return obj&&(typeof obj=="object"||typeof obj=="function")};sh.isNative=function(){var isNeitherUndefinedNorNull=
sh.isNeitherUndefinedNorNull;return function(obj){return isNeitherUndefinedNorNull(obj)&&typeof obj.constructor=="function"}}();sh.isAlien=function(){var isObject=sh.isObject;return function(obj){return isObject(obj)&&typeof obj.constructor!="function"}}();sh.isBoolean=function(){var regXBaseClass=/^\[object\s+Boolean\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();sh.isBooleanValue=function(obj){return typeof obj=="boolean"};sh.isBooleanObject=
function(obj){return isBoolean(obj)&&typeof obj!="boolean"};sh.isNumberObject=function(){var regXBaseClass=/^\[object\s+Number\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))&&typeof obj!="number"}}();sh.isNumberValue=function(obj){return typeof obj=="number"};sh.isNumber=function(){var isFinite=sh.isFinite,isNumberObject=sh.isNumberObject;return function(obj){return(typeof obj=="number"||isNumberObject(obj))&&isFinite(obj)}}();sh.isString=function(){var regXBaseClass=
/^\[object\s+String\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();sh.isStringValue=function(obj){return typeof obj=="string"};sh.isStringObject=function(obj){return isString(obj)&&typeof obj!="string"};if(typeof sh.Array.isArray!="function")sh.isArray=sh.Array.isArray=function(){var regXBaseClass=/^\[object\s+Array\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();sh.isObjectObject=function(){var regXBaseClass=
/^\[object\s+Object\]$/,expose=exposeImplementation,isNative=sh.isNative;return function(obj){return isNative(obj)&&regXBaseClass.test(expose.call(obj))}}();sh.isFunction=function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"};sh.isCallable=function(){var regXCallable=/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/,isFunction=sh.isFunction,getCallability=function(mayBeCallee){var isCallable=false;try{mayBeCallee();isCallable=true}catch(err){isCallable=!(err instanceof
TypeError)&&err.message!="NOT_SUPPORTED_ERR"}return isCallable};return function(obj){return isFunction(obj)||regXCallable.test(""+obj)||getCallability(obj)}}();sh.isRegExp=function(){var regXBaseClass=/^\[object\s+RegExp\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();sh.isDate=function(){var regXBaseClass=/^\[object\s+Date\]$/,expose=exposeImplementation;return function(obj){return regXBaseClass.test(expose.call(obj))}}();sh.isError=function(){var regXErrorClass=
/^\[object\s+Error\]$/,expose=exposeImplementation;return function(obj){return regXErrorClass.test(expose.call(obj))}}();sh.isGenericError=function(){var regXErrorType=/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/,expose=exposeErrorImplementation,isError=sh.isError;return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="Error")}}();sh.isEvalError=function(){var regXErrorType=/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/,
expose=exposeErrorImplementation,isError=sh.isError;return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="EvalError")}}();sh.isRangeError=function(){var regXErrorType=/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/,expose=exposeErrorImplementation,isError=sh.isError;return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="RangeError")}}();sh.isReferenceError=
function(){var regXErrorType=/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/,expose=exposeErrorImplementation,isError=sh.isError;return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="ReferenceError")}}();sh.isSyntaxError=function(){var regXErrorType=/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/,expose=exposeErrorImplementation,isError=sh.isError;return function(obj){return isError(obj)&&
(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="SyntaxError")}}();sh.isTypeError=function(){var regXErrorType=/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/,expose=exposeErrorImplementation,isError=sh.isError;return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="TypeError")}}();sh.isURIError=function(){var regXErrorType=/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/,
expose=exposeErrorImplementation,isError=sh.isError;return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="URIError")}}();sh.Object.prototype.getBaseName=function(){var regXBaseClass=regXClassName,expose=exposeImplementation,global=sh;return function(delegatee){var str;if(this===global)if(typeof delegatee=="undefined")str="UndefinedType";else if(!delegatee&&typeof delegatee=="object")str="NullType";else str=regXBaseClass.exec(expose.call(delegatee))[1];
else str=regXBaseClass.exec(expose.call(this))[1];return str}}();sh.Object.getBaseName=function(){var getBaseName=sh.Object.prototype.getBaseName,global=sh;return function(obj){return getBaseName.call(global,obj)}}();sh.Object.prototype.getBase=function(){var regXBaseClass=regXClassName,expose=exposeImplementation,isUndefinedOrNull=sh.isUndefinedOrNull,global=sh;return function(delegatee){var Base;if(this===global)if(isUndefinedOrNull(delegatee))Base=delegatee;else Base=global[regXBaseClass.exec(expose.call(delegatee))[1]];
else Base=global[regXBaseClass.exec(expose.call(this))[1]];return Base}}();sh.Object.getBase=function(){var getBase=sh.Object.prototype.getBase,global=sh;return function(obj){return getBase.call(global,obj)}}()})();


- Simple          - 4.882 byte : (additionally featuring [getBase ...] functionality)
(function(){var b=this&&this.window===this&&window||this,h=/^\[object\s+(.*)\]$/,e=b.Object.prototype.toString,f=b.Error.prototype.toString;b.isUndefined=function(a){return typeof a=="undefined"};b.isDefined=function(a){return typeof a!="undefined"};b.isNull=function(a){return!a&&typeof a=="object"};b.isNotNull=function(a){return a||typeof a!="object"};b.isUndefinedOrNull=function(a){return!a&&(typeof a=="undefined"||typeof a=="object")};b.isNeitherUndefinedNorNull=function(a){return a||typeof a!=
"undefined"&&typeof a!="object"};b.isPrimitive=function(a){return typeof a=="string"||typeof a=="number"||typeof a=="boolean"};b.isValue=function(){var a=b.isPrimitive,c=b.isUndefinedOrNull;return function(d){return a(d)||c(d)}}();b.isObject=function(a){return a&&(typeof a=="object"||typeof a=="function")};b.isNative=function(){var a=b.isNeitherUndefinedNorNull;return function(c){return a(c)&&typeof c.constructor=="function"}}();b.isAlien=function(){var a=b.isObject;return function(c){return a(c)&&
typeof c.constructor!="function"}}();b.isBoolean=function(){var a=/^\[object\s+Boolean\]$/;return function(c){return a.test(e.call(c))}}();b.isBooleanValue=function(a){return typeof a=="boolean"};b.isBooleanObject=function(a){return isBoolean(a)&&typeof a!="boolean"};b.isNumberObject=function(){var a=/^\[object\s+Number\]$/;return function(c){return a.test(e.call(c))&&typeof c!="number"}}();b.isNumberValue=function(a){return typeof a=="number"};b.isNumber=function(){var a=b.isFinite,c=b.isNumberObject;
return function(d){return(typeof d=="number"||c(d))&&a(d)}}();b.isString=function(){var a=/^\[object\s+String\]$/;return function(c){return a.test(e.call(c))}}();b.isStringValue=function(a){return typeof a=="string"};b.isStringObject=function(a){return isString(a)&&typeof a!="string"};if(typeof b.Array.isArray!="function")b.isArray=b.Array.isArray=function(){var a=/^\[object\s+Array\]$/;return function(c){return a.test(e.call(c))}}();b.isObjectObject=function(){var a=/^\[object\s+Object\]$/,c=b.isNative;
return function(d){return c(d)&&a.test(e.call(d))}}();b.isFunction=function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"};b.isCallable=function(){var a=/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/,c=b.isFunction,d=function(g){var i=false;try{g();i=true}catch(j){i=!(j instanceof TypeError)&&j.message!="NOT_SUPPORTED_ERR"}return i};return function(g){return c(g)||a.test(""+g)||d(g)}}();b.isRegExp=function(){var a=/^\[object\s+RegExp\]$/;return function(c){return a.test(e.call(c))}}();
b.isDate=function(){var a=/^\[object\s+Date\]$/;return function(c){return a.test(e.call(c))}}();b.isError=function(){var a=/^\[object\s+Error\]$/;return function(c){return a.test(e.call(c))}}();b.isGenericError=function(){var a=/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="Error")}}();b.isEvalError=function(){var a=/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/,c=b.isError;
return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="EvalError")}}();b.isRangeError=function(){var a=/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="RangeError")}}();b.isReferenceError=function(){var a=/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||
typeof d.name=="string"&&d.name=="ReferenceError")}}();b.isSyntaxError=function(){var a=/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="SyntaxError")}}();b.isTypeError=function(){var a=/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="TypeError")}}();
b.isURIError=function(){var a=/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="URIError")}}();b.Object.prototype.getBaseName=function(){return function(a){return this===b?typeof a=="undefined"?"UndefinedType":!a&&typeof a=="object"?"NullType":h.exec(e.call(a))[1]:h.exec(e.call(this))[1]}}();b.Object.getBaseName=function(){var a=b.Object.prototype.getBaseName;return function(c){return a.call(b,
c)}}();b.Object.prototype.getBase=function(){var a=b.isUndefinedOrNull;return function(c){return this===b?a(c)?c:b[h.exec(e.call(c))[1]]:b[h.exec(e.call(this))[1]]}}();b.Object.getBase=function(){var a=b.Object.prototype.getBase;return function(c){return a.call(b,c)}}()})();


- Simple          - 4287 byte : (does not include [getBase ...] functionality)
(function(){var b=this&&this.window===this&&window||this,h=/^\[object\s+(.*)\]$/,e=b.Object.prototype.toString,f=b.Error.prototype.toString;b.isUndefined=function(a){return typeof a=="undefined"};b.isDefined=function(a){return typeof a!="undefined"};b.isNull=function(a){return!a&&typeof a=="object"};b.isNotNull=function(a){return a||typeof a!="object"};b.isUndefinedOrNull=function(a){return!a&&(typeof a=="undefined"||typeof a=="object")};b.isNeitherUndefinedNorNull=function(a){return a||typeof a!="undefined"&&typeof a!="object"};b.isPrimitive=function(a){return typeof a=="string"||typeof a=="number"||typeof a=="boolean"};b.isValue=function(){var a=b.isPrimitive,c=b.isUndefinedOrNull;return function(d){return a(d)||c(d)}}();b.isObject=function(a){return a&&(typeof a=="object"||typeof a=="function")};b.isNative=function(){var a=b.isNeitherUndefinedNorNull;return function(c){return a(c)&&typeof c.constructor=="function"}}();b.isAlien=function(){var a=b.isObject;return function(c){return a(c)&&typeof c.constructor!="function"}}();b.isBoolean=function(){var a=/^\[object\s+Boolean\]$/;return function(c){return a.test(e.call(c))}}();b.isBooleanValue=function(a){return typeof a=="boolean"};b.isBooleanObject=function(a){return isBoolean(a)&&typeof a!="boolean"};b.isNumberObject=function(){var a=/^\[object\s+Number\]$/;return function(c){return a.test(e.call(c))&&typeof c!="number"}}();b.isNumberValue=function(a){return typeof a=="number"};b.isNumber=function(){var a=b.isFinite,c=b.isNumberObject;return function(d){return(typeof d=="number"||c(d))&&a(d)}}();b.isString=function(){var a=/^\[object\s+String\]$/;return function(c){return a.test(e.call(c))}}();b.isStringValue=function(a){return typeof a=="string"};b.isStringObject=function(a){return isString(a)&&typeof a!="string"};if(typeof b.Array.isArray!="function")b.isArray=b.Array.isArray=function(){var a=/^\[object\s+Array\]$/;return function(c){return a.test(e.call(c))}}();b.isObjectObject=function(){var a=/^\[object\s+Object\]$/,c=b.isNative;return function(d){return c(d)&&a.test(e.call(d))}}();b.isFunction=function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"};b.isCallable=function(){var a=/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/,c=b.isFunction,d=function(g){var i=false;try{g();i=true}catch(j){i=!(j instanceof TypeError)&&j.message!="NOT_SUPPORTED_ERR"}return i};return function(g){return c(g)||a.test(""+g)||d(g)}}();b.isRegExp=function(){var a=/^\[object\s+RegExp\]$/;return function(c){return a.test(e.call(c))}}();b.isDate=function(){var a=/^\[object\s+Date\]$/;return function(c){return a.test(e.call(c))}}();b.isError=function(){var a=/^\[object\s+Error\]$/;return function(c){return a.test(e.call(c))}}();b.isGenericError=function(){var a=/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="Error")}}();b.isEvalError=function(){var a=/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="EvalError")}}();b.isRangeError=function(){var a=/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="RangeError")}}();b.isReferenceError=function(){var a=/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="ReferenceError")}}();b.isSyntaxError=function(){var a=/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="SyntaxError")}}();b.isTypeError=function(){var a=/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="TypeError")}}();b.isURIError=function(){var a=/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/,c=b.isError;return function(d){return c(d)&&(a.test(f.call(d))||typeof d.name=="string"&&d.name=="URIError")}}();})();


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 7.237 byte : (additionally featuring [getBase ...] functionality)
(function(){var sh=((this&&(this.window===this)&&window)||this),regXClassName=(/^\[object\s+(.*)\]$/),exposeImplementation=sh.Object.prototype.toString,exposeErrorImplementation=sh.Error.prototype.toString;sh.isUndefined=(function(obj){return(typeof obj=="undefined")});sh.isDefined=(function(obj){return(typeof obj!="undefined")});sh.isNull=(function(obj){return(!obj&&(typeof obj=="object"))});sh.isNotNull=(function(obj){return(obj||(typeof obj!="object"))});sh.isUndefinedOrNull=(function(obj){return(!obj&&((typeof obj=="undefined")||(typeof obj=="object")))});sh.isNeitherUndefinedNorNull=(function(obj){return(obj||((typeof obj!="undefined")&&(typeof obj!="object")))});sh.isPrimitive=(function(obj){return((typeof obj=="string")||(typeof obj=="number")||(typeof obj=="boolean"))});sh.isValue=(function(){var isPrimitive=sh.isPrimitive,isUndefinedOrNull=sh.isUndefinedOrNull;return(function(obj){return(isPrimitive(obj)||isUndefinedOrNull(obj))})})();sh.isObject=(function(obj){return(obj&&((typeof obj=="object")||(typeof obj=="function")))});sh.isNative=(function(){var isNeitherUndefinedNorNull=sh.isNeitherUndefinedNorNull;return(function(obj){return(isNeitherUndefinedNorNull(obj)&&(typeof obj.constructor=="function"))})})();sh.isAlien=(function(){var isObject=sh.isObject;return(function(obj){return(isObject(obj)&&(typeof obj.constructor!="function"))})})();sh.isBoolean=(function(){var regXBaseClass=(/^\[object\s+Boolean\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})();sh.isBooleanValue=(function(obj){return(typeof obj=="boolean")});sh.isBooleanObject=(function(obj){return(isBoolean(obj)&&(typeof obj!="boolean"))});sh.isNumberObject=(function(){var regXBaseClass=(/^\[object\s+Number\]$/),expose=exposeImplementation;return(function(obj){return(regXBaseClass.test(expose.call(obj))&&(typeof obj!="number"))})})();sh.isNumberValue=(function(obj){return(typeof obj=="number")});sh.isNumber=(function(){var isFinite=sh.isFinite,isNumberObject=sh.isNumberObject;return(function(obj){return(((typeof obj=="number")||isNumberObject(obj))&&isFinite(obj))})})();sh.isString=(function(){var regXBaseClass=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})();sh.isStringValue=(function(obj){return(typeof obj=="string")});sh.isStringObject=(function(obj){return(isString(obj)&&(typeof obj!="string"))});if(typeof sh.Array.isArray!="function"){sh.isArray=sh.Array.isArray=(function(){var regXBaseClass=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})()}sh.isObjectObject=(function(){var regXBaseClass=(/^\[object\s+Object\]$/),expose=exposeImplementation,isNative=sh.isNative;return(function(obj){return(isNative(obj)&&regXBaseClass.test(expose.call(obj)))})})();sh.isFunction=(function(obj){return((typeof obj=="function")&&(typeof obj.call=="function")&&(typeof obj.apply=="function"))});sh.isCallable=(function(){var regXCallable=(/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/),isFunction=sh.isFunction,getCallability=(function(mayBeCallee){var isCallable=false;try{mayBeCallee();isCallable=true}catch(err){isCallable=(!(err instanceof TypeError)&&(err.message!="NOT_SUPPORTED_ERR"))}return isCallable});return(function(obj){return(isFunction(obj)||regXCallable.test(""+obj)||getCallability(obj))})})();sh.isRegExp=(function(){var regXBaseClass=(/^\[object\s+RegExp\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})();sh.isDate=(function(){var regXBaseClass=(/^\[object\s+Date\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})();sh.isError=(function(){var regXErrorClass=(/^\[object\s+Error\]$/),expose=exposeImplementation;return(function(obj){return regXErrorClass.test(expose.call(obj))})})();sh.isGenericError=(function(){var regXErrorType=(/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="Error"))))})})();sh.isEvalError=(function(){var regXErrorType=(/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="EvalError"))))})})();sh.isRangeError=(function(){var regXErrorType=(/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="RangeError"))))})})();sh.isReferenceError=(function(){var regXErrorType=(/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="ReferenceError"))))})})();sh.isSyntaxError=(function(){var regXErrorType=(/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="SyntaxError"))))})})();sh.isTypeError=(function(){var regXErrorType=(/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="TypeError"))))})})();sh.isURIError=(function(){var regXErrorType=(/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="URIError"))))})})();sh.Object.prototype.getBaseName=(function(){var regXBaseClass=regXClassName,expose=exposeImplementation,global=sh;return(function(delegatee){var str;if(this===global){if(typeof delegatee=="undefined"){str="UndefinedType"}else if(!delegatee&&(typeof delegatee=="object")){str="NullType"}else{str=regXBaseClass.exec(expose.call(delegatee))[1]}}else{str=regXBaseClass.exec(expose.call(this))[1]}return str})})();sh.Object.getBaseName=(function(){var getBaseName=sh.Object.prototype.getBaseName,global=sh;return(function(obj){return getBaseName.call(global,obj)})})();sh.Object.prototype.getBase=(function(){var regXBaseClass=regXClassName,expose=exposeImplementation,isUndefinedOrNull=sh.isUndefinedOrNull,global=sh;return(function(delegatee){var Base;if(this===global){if(isUndefinedOrNull(delegatee)){Base=delegatee}else{Base=global[regXBaseClass.exec(expose.call(delegatee))[1]]}}else{Base=global[regXBaseClass.exec(expose.call(this))[1]]}return Base})})();sh.Object.getBase=(function(){var getBase=sh.Object.prototype.getBase,global=sh;return(function(obj){return getBase.call(global,obj)})})()})();

- packed / shrinked           - 6.201 byte : (additionally featuring [getBase ...] functionality)
(function(){var d=((this&&(this.window===this)&&window)||this),regXClassName=(/^\[object\s+(.*)\]$/),exposeImplementation=d.Object.prototype.toString,exposeErrorImplementation=d.Error.prototype.toString;d.isUndefined=(function(a){return(typeof a=="undefined")});d.isDefined=(function(a){return(typeof a!="undefined")});d.isNull=(function(a){return(!a&&(typeof a=="object"))});d.isNotNull=(function(a){return(a||(typeof a!="object"))});d.isUndefinedOrNull=(function(a){return(!a&&((typeof a=="undefined")||(typeof a=="object")))});d.isNeitherUndefinedNorNull=(function(a){return(a||((typeof a!="undefined")&&(typeof a!="object")))});d.isPrimitive=(function(a){return((typeof a=="string")||(typeof a=="number")||(typeof a=="boolean"))});d.isValue=(function(){var b=d.isPrimitive,isUndefinedOrNull=d.isUndefinedOrNull;return(function(a){return(b(a)||isUndefinedOrNull(a))})})();d.isObject=(function(a){return(a&&((typeof a=="object")||(typeof a=="function")))});d.isNative=(function(){var b=d.isNeitherUndefinedNorNull;return(function(a){return(b(a)&&(typeof a.constructor=="function"))})})();d.isAlien=(function(){var b=d.isObject;return(function(a){return(b(a)&&(typeof a.constructor!="function"))})})();d.isBoolean=(function(){var b=(/^\[object\s+Boolean\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})();d.isBooleanValue=(function(a){return(typeof a=="boolean")});d.isBooleanObject=(function(a){return(isBoolean(a)&&(typeof a!="boolean"))});d.isNumberObject=(function(){var b=(/^\[object\s+Number\]$/),expose=exposeImplementation;return(function(a){return(b.test(expose.call(a))&&(typeof a!="number"))})})();d.isNumberValue=(function(a){return(typeof a=="number")});d.isNumber=(function(){var b=d.isFinite,isNumberObject=d.isNumberObject;return(function(a){return(((typeof a=="number")||isNumberObject(a))&&b(a))})})();d.isString=(function(){var b=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})();d.isStringValue=(function(a){return(typeof a=="string")});d.isStringObject=(function(a){return(isString(a)&&(typeof a!="string"))});if(typeof d.Array.isArray!="function"){d.isArray=d.Array.isArray=(function(){var b=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})()}d.isObjectObject=(function(){var b=(/^\[object\s+Object\]$/),expose=exposeImplementation,isNative=d.isNative;return(function(a){return(isNative(a)&&b.test(expose.call(a)))})})();d.isFunction=(function(a){return((typeof a=="function")&&(typeof a.call=="function")&&(typeof a.apply=="function"))});d.isCallable=(function(){var c=(/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/),isFunction=d.isFunction,getCallability=(function(a){var b=false;try{a();b=true}catch(err){b=(!(err instanceof TypeError)&&(err.message!="NOT_SUPPORTED_ERR"))}return b});return(function(a){return(isFunction(a)||c.test(""+a)||getCallability(a))})})();d.isRegExp=(function(){var b=(/^\[object\s+RegExp\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})();d.isDate=(function(){var b=(/^\[object\s+Date\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})();d.isError=(function(){var b=(/^\[object\s+Error\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})();d.isGenericError=(function(){var b=(/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="Error"))))})})();d.isEvalError=(function(){var b=(/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="EvalError"))))})})();d.isRangeError=(function(){var b=(/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="RangeError"))))})})();d.isReferenceError=(function(){var b=(/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="ReferenceError"))))})})();d.isSyntaxError=(function(){var b=(/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="SyntaxError"))))})})();d.isTypeError=(function(){var b=(/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="TypeError"))))})})();d.isURIError=(function(){var b=(/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="URIError"))))})})();d.Object.prototype.getBaseName=(function(){var c=regXClassName,expose=exposeImplementation,global=d;return(function(a){var b;if(this===global){if(typeof a=="undefined"){b="UndefinedType"}else if(!a&&(typeof a=="object")){b="NullType"}else{b=c.exec(expose.call(a))[1]}}else{b=c.exec(expose.call(this))[1]}return b})})();d.Object.getBaseName=(function(){var b=d.Object.prototype.getBaseName,global=d;return(function(a){return b.call(global,a)})})();d.Object.prototype.getBase=(function(){var c=regXClassName,expose=exposeImplementation,isUndefinedOrNull=d.isUndefinedOrNull,global=d;return(function(a){var b;if(this===global){if(isUndefinedOrNull(a)){b=a}else{b=global[c.exec(expose.call(a))[1]]}}else{b=global[c.exec(expose.call(this))[1]]}return b})})();d.Object.getBase=(function(){var b=d.Object.prototype.getBase,global=d;return(function(a){return b.call(global,a)})})()})();

- packed / shrinked / encoded - 4.025 byte : (additionally featuring [getBase ...] functionality)
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(){5 d=((k&&(k.S===k)&&S)||k),D=(/^\\[e\\s+(.*)\\]$/),f=d.i.n.O,j=d.l.n.O;d.1t=(0(a){2(4 a=="x")});d.1v=(0(a){2(4 a!="x")});d.V=(0(a){2(!a&&(4 a=="e"))});d.13=(0(a){2(a||(4 a!="e"))});d.m=(0(a){2(!a&&((4 a=="x")||(4 a=="e")))});d.K=(0(a){2(a||((4 a!="x")&&(4 a!="e")))});d.L=(0(a){2((4 a=="h")||(4 a=="z")||(4 a=="F"))});d.1r=(0(){5 b=d.L,m=d.m;2(0(a){2(b(a)||m(a))})})();d.N=(0(a){2(a&&((4 a=="e")||(4 a=="0")))});d.A=(0(){5 b=d.K;2(0(a){2(b(a)&&(4 a.Q=="0"))})})();d.1i=(0(){5 b=d.N;2(0(a){2(b(a)&&(4 a.Q!="0"))})})();d.R=(0(){5 b=(/^\\[e\\s+1p\\]$/),3=f;2(0(a){2 b.9(3.6(a))})})();d.W=(0(a){2(4 a=="F")});d.11=(0(a){2(R(a)&&(4 a!="F"))});d.B=(0(){5 b=(/^\\[e\\s+1a\\]$/),3=f;2(0(a){2(b.9(3.6(a))&&(4 a!="z"))})})();d.1c=(0(a){2(4 a=="z")});d.1e=(0(){5 b=d.1g,B=d.B;2(0(a){2(((4 a=="z")||B(a))&&b(a))})})();d.P=(0(){5 b=(/^\\[e\\s+1k\\]$/),3=f;2(0(a){2 b.9(3.6(a))})})();d.1n=(0(a){2(4 a=="h")});d.1o=(0(a){2(P(a)&&(4 a!="h"))});p(4 d.I.J!="0"){d.J=d.I.J=(0(){5 b=(/^\\[e\\s+I\\]$/),3=f;2(0(a){2 b.9(3.6(a))})})()}d.1u=(0(){5 b=(/^\\[e\\s+i\\]$/),3=f,A=d.A;2(0(a){2(A(a)&&b.9(3.6(a)))})})();d.C=(0(a){2((4 a=="0")&&(4 a.6=="0")&&(4 a.T=="0"))});d.U=(0(){5 c=(/0\\s+[^(]+\\([^)]*\\)\\s*\\{[^}]*\\}/),C=d.C,M=(0(a){5 b=X;Y{a();b=Z}10(H){b=(!(H 12 o)&&(H.14!="15"))}2 b});2(0(a){2(C(a)||c.9(""+a)||M(a))})})();d.16=(0(){5 b=(/^\\[e\\s+17\\]$/),3=f;2(0(a){2 b.9(3.6(a))})})();d.18=(0(){5 b=(/^\\[e\\s+19\\]$/),3=f;2(0(a){2 b.9(3.6(a))})})();d.7=(0(){5 b=(/^\\[e\\s+l\\]$/),3=f;2(0(a){2 b.9(3.6(a))})})();d.1b=(0(){5 b=(/(?:^l:)|(?:^l$)|(?:\\[l:\\s*8\\:\\s*l)/),3=j,7=d.7;2(0(a){2(7(a)&&(b.9(3.6(a))||((4 a.8=="h")&&(a.8=="l"))))})})();d.1d=(0(){5 b=(/(?:^q:)|(?:^q$)|(?:\\[q:\\s*8\\:\\s*q)/),3=j,7=d.7;2(0(a){2(7(a)&&(b.9(3.6(a))||((4 a.8=="h")&&(a.8=="q"))))})})();d.1f=(0(){5 b=(/(?:^r:)|(?:^r$)|(?:\\[r:\\s*8\\:\\s*r)/),3=j,7=d.7;2(0(a){2(7(a)&&(b.9(3.6(a))||((4 a.8=="h")&&(a.8=="r"))))})})();d.1h=(0(){5 b=(/(?:^w:)|(?:^w$)|(?:\\[w:\\s*8\\:\\s*w)/),3=j,7=d.7;2(0(a){2(7(a)&&(b.9(3.6(a))||((4 a.8=="h")&&(a.8=="w"))))})})();d.1j=(0(){5 b=(/(?:^v:)|(?:^v$)|(?:\\[v:\\s*8\\:\\s*v)/),3=j,7=d.7;2(0(a){2(7(a)&&(b.9(3.6(a))||((4 a.8=="h")&&(a.8=="v"))))})})();d.1l=(0(){5 b=(/(?:^o:)|(?:^o$)|(?:\\[o:\\s*8\\:\\s*o)/),3=j,7=d.7;2(0(a){2(7(a)&&(b.9(3.6(a))||((4 a.8=="h")&&(a.8=="o"))))})})();d.1m=(0(){5 b=(/(?:^t:)|(?:^t$)|(?:\\[t:\\s*8\\:\\s*t)/),3=j,7=d.7;2(0(a){2(7(a)&&(b.9(3.6(a))||((4 a.8=="h")&&(a.8=="t"))))})})();d.i.n.G=(0(){5 c=D,3=f,g=d;2(0(a){5 b;p(k===g){p(4 a=="x"){b="1q"}u p(!a&&(4 a=="e")){b="1s"}u{b=c.y(3.6(a))[1]}}u{b=c.y(3.6(k))[1]}2 b})})();d.i.G=(0(){5 b=d.i.n.G,g=d;2(0(a){2 b.6(g,a)})})();d.i.n.E=(0(){5 c=D,3=f,m=d.m,g=d;2(0(a){5 b;p(k===g){p(m(a)){b=a}u{b=g[c.y(3.6(a))[1]]}}u{b=g[c.y(3.6(k))[1]]}2 b})})();d.i.E=(0(){5 b=d.i.n.E,g=d;2(0(a){2 b.6(g,a)})})()})();',62,94,'function||return|expose|typeof|var|call|isError|name|test|||||object|exposeImplementation|global|string|Object|exposeErrorImplementation|this|Error|isUndefinedOrNull|prototype|TypeError|if|EvalError|RangeError||URIError|else|SyntaxError|ReferenceError|undefined|exec|number|isNative|isNumberObject|isFunction|regXClassName|getBase|boolean|getBaseName|err|Array|isArray|isNeitherUndefinedNorNull|isPrimitive|getCallability|isObject|toString|isString|constructor|isBoolean|window|apply|isCallable|isNull|isBooleanValue|false|try|true|catch|isBooleanObject|instanceof|isNotNull|message|NOT_SUPPORTED_ERR|isRegExp|RegExp|isDate|Date|Number|isGenericError|isNumberValue|isEvalError|isNumber|isRangeError|isFinite|isReferenceError|isAlien|isSyntaxError|String|isTypeError|isURIError|isStringValue|isStringObject|Boolean|UndefinedType|isValue|NullType|isUndefined|isObjectObject|isDefined'.split('|'),0,{}));



- packed                      - 6.141 byte : (does not include [getBase ...] functionality)
(function(){var sh=((this&&(this.window===this)&&window)||this),regXClassName=(/^\[object\s+(.*)\]$/),exposeImplementation=sh.Object.prototype.toString,exposeErrorImplementation=sh.Error.prototype.toString;sh.isUndefined=(function(obj){return(typeof obj=="undefined")});sh.isDefined=(function(obj){return(typeof obj!="undefined")});sh.isNull=(function(obj){return(!obj&&(typeof obj=="object"))});sh.isNotNull=(function(obj){return(obj||(typeof obj!="object"))});sh.isUndefinedOrNull=(function(obj){return(!obj&&((typeof obj=="undefined")||(typeof obj=="object")))});sh.isNeitherUndefinedNorNull=(function(obj){return(obj||((typeof obj!="undefined")&&(typeof obj!="object")))});sh.isPrimitive=(function(obj){return((typeof obj=="string")||(typeof obj=="number")||(typeof obj=="boolean"))});sh.isValue=(function(){var isPrimitive=sh.isPrimitive,isUndefinedOrNull=sh.isUndefinedOrNull;return(function(obj){return(isPrimitive(obj)||isUndefinedOrNull(obj))})})();sh.isObject=(function(obj){return(obj&&((typeof obj=="object")||(typeof obj=="function")))});sh.isNative=(function(){var isNeitherUndefinedNorNull=sh.isNeitherUndefinedNorNull;return(function(obj){return(isNeitherUndefinedNorNull(obj)&&(typeof obj.constructor=="function"))})})();sh.isAlien=(function(){var isObject=sh.isObject;return(function(obj){return(isObject(obj)&&(typeof obj.constructor!="function"))})})();sh.isBoolean=(function(){var regXBaseClass=(/^\[object\s+Boolean\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})();sh.isBooleanValue=(function(obj){return(typeof obj=="boolean")});sh.isBooleanObject=(function(obj){return(isBoolean(obj)&&(typeof obj!="boolean"))});sh.isNumberObject=(function(){var regXBaseClass=(/^\[object\s+Number\]$/),expose=exposeImplementation;return(function(obj){return(regXBaseClass.test(expose.call(obj))&&(typeof obj!="number"))})})();sh.isNumberValue=(function(obj){return(typeof obj=="number")});sh.isNumber=(function(){var isFinite=sh.isFinite,isNumberObject=sh.isNumberObject;return(function(obj){return(((typeof obj=="number")||isNumberObject(obj))&&isFinite(obj))})})();sh.isString=(function(){var regXBaseClass=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})();sh.isStringValue=(function(obj){return(typeof obj=="string")});sh.isStringObject=(function(obj){return(isString(obj)&&(typeof obj!="string"))});if(typeof sh.Array.isArray!="function"){sh.isArray=sh.Array.isArray=(function(){var regXBaseClass=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})()}sh.isObjectObject=(function(){var regXBaseClass=(/^\[object\s+Object\]$/),expose=exposeImplementation,isNative=sh.isNative;return(function(obj){return(isNative(obj)&&regXBaseClass.test(expose.call(obj)))})})();sh.isFunction=(function(obj){return((typeof obj=="function")&&(typeof obj.call=="function")&&(typeof obj.apply=="function"))});sh.isCallable=(function(){var regXCallable=(/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/),isFunction=sh.isFunction,getCallability=(function(mayBeCallee){var isCallable=false;try{mayBeCallee();isCallable=true}catch(err){isCallable=(!(err instanceof TypeError)&&(err.message!="NOT_SUPPORTED_ERR"))}return isCallable});return(function(obj){return(isFunction(obj)||regXCallable.test(""+obj)||getCallability(obj))})})();sh.isRegExp=(function(){var regXBaseClass=(/^\[object\s+RegExp\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})();sh.isDate=(function(){var regXBaseClass=(/^\[object\s+Date\]$/),expose=exposeImplementation;return(function(obj){return regXBaseClass.test(expose.call(obj))})})();sh.isError=(function(){var regXErrorClass=(/^\[object\s+Error\]$/),expose=exposeImplementation;return(function(obj){return regXErrorClass.test(expose.call(obj))})})();sh.isGenericError=(function(){var regXErrorType=(/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="Error"))))})})();sh.isEvalError=(function(){var regXErrorType=(/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="EvalError"))))})})();sh.isRangeError=(function(){var regXErrorType=(/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="RangeError"))))})})();sh.isReferenceError=(function(){var regXErrorType=(/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="ReferenceError"))))})})();sh.isSyntaxError=(function(){var regXErrorType=(/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="SyntaxError"))))})})();sh.isTypeError=(function(){var regXErrorType=(/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="TypeError"))))})})();sh.isURIError=(function(){var regXErrorType=(/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/),expose=exposeErrorImplementation,isError=sh.isError;return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="URIError"))))})})()})();

- packed / shrinked           - 5.327 byte : (does not include [getBase ...] functionality)
(function(){var d=((this&&(this.window===this)&&window)||this),regXClassName=(/^\[object\s+(.*)\]$/),exposeImplementation=d.Object.prototype.toString,exposeErrorImplementation=d.Error.prototype.toString;d.isUndefined=(function(a){return(typeof a=="undefined")});d.isDefined=(function(a){return(typeof a!="undefined")});d.isNull=(function(a){return(!a&&(typeof a=="object"))});d.isNotNull=(function(a){return(a||(typeof a!="object"))});d.isUndefinedOrNull=(function(a){return(!a&&((typeof a=="undefined")||(typeof a=="object")))});d.isNeitherUndefinedNorNull=(function(a){return(a||((typeof a!="undefined")&&(typeof a!="object")))});d.isPrimitive=(function(a){return((typeof a=="string")||(typeof a=="number")||(typeof a=="boolean"))});d.isValue=(function(){var b=d.isPrimitive,isUndefinedOrNull=d.isUndefinedOrNull;return(function(a){return(b(a)||isUndefinedOrNull(a))})})();d.isObject=(function(a){return(a&&((typeof a=="object")||(typeof a=="function")))});d.isNative=(function(){var b=d.isNeitherUndefinedNorNull;return(function(a){return(b(a)&&(typeof a.constructor=="function"))})})();d.isAlien=(function(){var b=d.isObject;return(function(a){return(b(a)&&(typeof a.constructor!="function"))})})();d.isBoolean=(function(){var b=(/^\[object\s+Boolean\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})();d.isBooleanValue=(function(a){return(typeof a=="boolean")});d.isBooleanObject=(function(a){return(isBoolean(a)&&(typeof a!="boolean"))});d.isNumberObject=(function(){var b=(/^\[object\s+Number\]$/),expose=exposeImplementation;return(function(a){return(b.test(expose.call(a))&&(typeof a!="number"))})})();d.isNumberValue=(function(a){return(typeof a=="number")});d.isNumber=(function(){var b=d.isFinite,isNumberObject=d.isNumberObject;return(function(a){return(((typeof a=="number")||isNumberObject(a))&&b(a))})})();d.isString=(function(){var b=(/^\[object\s+String\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})();d.isStringValue=(function(a){return(typeof a=="string")});d.isStringObject=(function(a){return(isString(a)&&(typeof a!="string"))});if(typeof d.Array.isArray!="function"){d.isArray=d.Array.isArray=(function(){var b=(/^\[object\s+Array\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})()}d.isObjectObject=(function(){var b=(/^\[object\s+Object\]$/),expose=exposeImplementation,isNative=d.isNative;return(function(a){return(isNative(a)&&b.test(expose.call(a)))})})();d.isFunction=(function(a){return((typeof a=="function")&&(typeof a.call=="function")&&(typeof a.apply=="function"))});d.isCallable=(function(){var c=(/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/),isFunction=d.isFunction,getCallability=(function(a){var b=false;try{a();b=true}catch(err){b=(!(err instanceof TypeError)&&(err.message!="NOT_SUPPORTED_ERR"))}return b});return(function(a){return(isFunction(a)||c.test(""+a)||getCallability(a))})})();d.isRegExp=(function(){var b=(/^\[object\s+RegExp\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})();d.isDate=(function(){var b=(/^\[object\s+Date\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})();d.isError=(function(){var b=(/^\[object\s+Error\]$/),expose=exposeImplementation;return(function(a){return b.test(expose.call(a))})})();d.isGenericError=(function(){var b=(/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="Error"))))})})();d.isEvalError=(function(){var b=(/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="EvalError"))))})})();d.isRangeError=(function(){var b=(/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="RangeError"))))})})();d.isReferenceError=(function(){var b=(/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="ReferenceError"))))})})();d.isSyntaxError=(function(){var b=(/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="SyntaxError"))))})})();d.isTypeError=(function(){var b=(/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="TypeError"))))})})();d.isURIError=(function(){var b=(/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/),expose=exposeErrorImplementation,isError=d.isError;return(function(a){return(isError(a)&&(b.test(expose.call(a))||((typeof a.name=="string")&&(a.name=="URIError"))))})})()})();

- packed / shrinked / encoded - 3.594 byte : (does not include [getBase ...] functionality)
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(){5 d=((t&&(t.I===t)&&I)||t),1n=(/^\\[9\\s+(.*)\\]$/),f=d.A.B.C,g=d.h.B.C;d.1m=(0(a){1(2 a=="o")});d.1j=(0(a){1(2 a!="o")});d.1h=(0(a){1(!a&&(2 a=="9"))});d.1f=(0(a){1(a||(2 a!="9"))});d.p=(0(a){1(!a&&((2 a=="o")||(2 a=="9")))});d.G=(0(a){1(a||((2 a!="o")&&(2 a!="9")))});d.H=(0(a){1((2 a=="e")||(2 a=="q")||(2 a=="x"))});d.1d=(0(){5 b=d.H,p=d.p;1(0(a){1(b(a)||p(a))})})();d.E=(0(a){1(a&&((2 a=="9")||(2 a=="0")))});d.r=(0(){5 b=d.G;1(0(a){1(b(a)&&(2 a.D=="0"))})})();d.1b=(0(){5 b=d.E;1(0(a){1(b(a)&&(2 a.D!="0"))})})();d.J=(0(){5 b=(/^\\[9\\s+19\\]$/),3=f;1(0(a){1 b.8(3.7(a))})})();d.12=(0(a){1(2 a=="x")});d.10=(0(a){1(J(a)&&(2 a!="x"))});d.v=(0(){5 b=(/^\\[9\\s+V\\]$/),3=f;1(0(a){1(b.8(3.7(a))&&(2 a!="q"))})})();d.U=(0(a){1(2 a=="q")});d.R=(0(){5 b=d.P,v=d.v;1(0(a){1(((2 a=="q")||v(a))&&b(a))})})();d.K=(0(){5 b=(/^\\[9\\s+O\\]$/),3=f;1(0(a){1 b.8(3.7(a))})})();d.17=(0(a){1(2 a=="e")});d.M=(0(a){1(K(a)&&(2 a!="e"))});N(2 d.w.z!="0"){d.z=d.w.z=(0(){5 b=(/^\\[9\\s+w\\]$/),3=f;1(0(a){1 b.8(3.7(a))})})()}d.Q=(0(){5 b=(/^\\[9\\s+A\\]$/),3=f,r=d.r;1(0(a){1(r(a)&&b.8(3.7(a)))})})();d.u=(0(a){1((2 a=="0")&&(2 a.7=="0")&&(2 a.S=="0"))});d.T=(0(){5 c=(/0\\s+[^(]+\\([^)]*\\)\\s*\\{[^}]*\\}/),u=d.u,F=(0(a){5 b=W;X{a();b=Y}Z(y){b=(!(y 11 i)&&(y.13!="14"))}1 b});1(0(a){1(u(a)||c.8(""+a)||F(a))})})();d.15=(0(){5 b=(/^\\[9\\s+16\\]$/),3=f;1(0(a){1 b.8(3.7(a))})})();d.L=(0(){5 b=(/^\\[9\\s+18\\]$/),3=f;1(0(a){1 b.8(3.7(a))})})();d.4=(0(){5 b=(/^\\[9\\s+h\\]$/),3=f;1(0(a){1 b.8(3.7(a))})})();d.1a=(0(){5 b=(/(?:^h:)|(?:^h$)|(?:\\[h:\\s*6\\:\\s*h)/),3=g,4=d.4;1(0(a){1(4(a)&&(b.8(3.7(a))||((2 a.6=="e")&&(a.6=="h"))))})})();d.1c=(0(){5 b=(/(?:^l:)|(?:^l$)|(?:\\[l:\\s*6\\:\\s*l)/),3=g,4=d.4;1(0(a){1(4(a)&&(b.8(3.7(a))||((2 a.6=="e")&&(a.6=="l"))))})})();d.1e=(0(){5 b=(/(?:^k:)|(?:^k$)|(?:\\[k:\\s*6\\:\\s*k)/),3=g,4=d.4;1(0(a){1(4(a)&&(b.8(3.7(a))||((2 a.6=="e")&&(a.6=="k"))))})})();d.1g=(0(){5 b=(/(?:^j:)|(?:^j$)|(?:\\[j:\\s*6\\:\\s*j)/),3=g,4=d.4;1(0(a){1(4(a)&&(b.8(3.7(a))||((2 a.6=="e")&&(a.6=="j"))))})})();d.1i=(0(){5 b=(/(?:^n:)|(?:^n$)|(?:\\[n:\\s*6\\:\\s*n)/),3=g,4=d.4;1(0(a){1(4(a)&&(b.8(3.7(a))||((2 a.6=="e")&&(a.6=="n"))))})})();d.1k=(0(){5 b=(/(?:^i:)|(?:^i$)|(?:\\[i:\\s*6\\:\\s*i)/),3=g,4=d.4;1(0(a){1(4(a)&&(b.8(3.7(a))||((2 a.6=="e")&&(a.6=="i"))))})})();d.1l=(0(){5 b=(/(?:^m:)|(?:^m$)|(?:\\[m:\\s*6\\:\\s*m)/),3=g,4=d.4;1(0(a){1(4(a)&&(b.8(3.7(a))||((2 a.6=="e")&&(a.6=="m"))))})})()})();',62,86,'function|return|typeof|expose|isError|var|name|call|test|object|||||string|exposeImplementation|exposeErrorImplementation|Error|TypeError|ReferenceError|RangeError|EvalError|URIError|SyntaxError|undefined|isUndefinedOrNull|number|isNative||this|isFunction|isNumberObject|Array|boolean|err|isArray|Object|prototype|toString|constructor|isObject|getCallability|isNeitherUndefinedNorNull|isPrimitive|window|isBoolean|isString|isDate|isStringObject|if|String|isFinite|isObjectObject|isNumber|apply|isCallable|isNumberValue|Number|false|try|true|catch|isBooleanObject|instanceof|isBooleanValue|message|NOT_SUPPORTED_ERR|isRegExp|RegExp|isStringValue|Date|Boolean|isGenericError|isAlien|isEvalError|isValue|isRangeError|isNotNull|isReferenceError|isNull|isSyntaxError|isDefined|isTypeError|isURIError|isUndefined|regXClassName'.split('|'),0,{}));


*/
