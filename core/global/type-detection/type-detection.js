//  -----   feel free to use this stuff   ---   play with it   ---   copy as You  like   -----
//  -----   but leave this authors 4 lines untouched:  pseliger@gmx.net  [august 2010]   -----
//
//  partly "stolen" from Douglas Crockford  : "http://www.crockford.com/javascript/remedial.html"
//
//  extended javascript-api-methods         :
//  * jsApi-extension-name / file-name      : "jsApi.Object.typeDetection.new.dev.xFrameSafe.js"
//  * original download-location            : "http://www.pseliger.de/jsExtendedApi/jsApi.Object.typeDetection.new.dev.xFrameSafe.js"
//
//  7th code revision   :    august-13-2010 - [isArgumentsArray] has migrated from module [Array.make.detect] into this module as well;
//                                          - there is a revival of [isListLike] (formerly known as "isArrayLike" and then deprecated);
//                                          - general code refactoring;
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


  var sh/*global*/ = this, // "scripting host" or "global object"

  Arr = sh.Array,
  Obj = sh.Object,
  ObjProto = Obj.prototype,

  regXClassName = (/^\[object\s+(.*)\]$/),
  regXBaseClassObject = (/^\[object\s+Object\]$/),
  regXBaseClassArguments = (/^\[object\s+Arguments\]$/),

  propertyIsEnumerable,

  exposeImplementation = ObjProto.toString,
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
  sh.isValue = (function (isPrimitive, isUndefinedOrNull) {
    return (function (obj/*:[object|value]*/) { // returns true in case of one of the primitive ECMAScript values [boolean], [number], [string], [undefined] or [null] is this global functions argument.

    //return (isPrimitive(obj) || isUndefined(obj) || isNull(obj));
    //return (isPrimitive(obj) || (!obj && ((typeof obj == "undefined") || (typeof obj == "object"))));

      return (isPrimitive(obj) || isUndefinedOrNull(obj));
    });
  })(sh.isPrimitive, sh.isUndefinedOrNull);

  sh.isObject = (function (obj/*:[object|value]*/) { // returns true in case of one of the ECMAScript instances of [[Boolean]], [[Number]], [[String]], [[Date]], [[Error]], [[RegExp]], [[Function]], [[Array]] or [[Object]], an object generated by a self-defined constructor function or a clients DOM-object is this global functions argument.

    return (obj && ((typeof obj == "object") || (typeof obj == "function"))); // (typeof obj == "function") : as for real [[Function]] types or even mozillas older [[RegExp]] implementations.
  });


  sh.isNative = (function (isNeitherUndefinedNorNull) {
    return (function (obj/*:[object|value]*/) { // returns true for every ECMAScript-conform object that is this global functions argument.

    //return (isDefined(obj) && isNotNull(obj) && (typeof obj.constructor == "function"));
    //return ((obj || ((typeof obj != "undefined") && (typeof obj != "object"))) && (typeof obj.constructor == "function"));

      return (isNeitherUndefinedNorNull(obj) && (typeof obj.constructor == "function"));
    });
  })(sh.isNeitherUndefinedNorNull);

  sh.isAlien = (function (isObject) {
    return (function (obj/*:[object|value]*/) { // return value depends on browser implementation - for instance in MSIE any DOM-node is an alien so far since such an object does not support the [constructor] property (and of course the type of an objects constructor always is supposed to be "function").

      return (isObject(obj) && (typeof obj.constructor != "function"));
    });
  })(sh.isObject);/*

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



  sh.isBoolean = (function (regXBaseClass, expose) {
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof Boolean)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof Boolean))); // too much - missing the point.

      return regXBaseClass.test(expose.call(obj));
    });
  })((/^\[object\s+Boolean\]$/), exposeImplementation);

  sh.isBooleanValue = (function (obj/*:[object|value]*/) {
    return (typeof obj == "boolean");
  });
  sh.isBooleanObject = (function (isBoolean) {
    return (function (obj/*:[object|value]*/) {

      return (isBoolean(obj) && (typeof obj != "boolean"));
    });
  })(sh.isBoolean);


//reverse order of implementing global [isNumber...] methods due to an additional validation within global [isNumber] that only will return true if number values/objects are finite too.

  sh.isNumberObject = (function (regXBaseClass, expose) {
  //print(typeof Number.NaN); // number
  //print(typeof (new Number(Number.NaN))); // object
  //print(new Number(Number.NaN)); // "NaN"
  //print(typeof Infinity); // number
  //print(typeof (new Number(Infinity))); // object
  //print(new Number(Infinity)); // "Infinity"
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof Number) && isFinite(obj)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return ((regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof Number))) && isFinite(obj)); // too much - missing the point.

      return (regXBaseClass.test(expose.call(obj)) && (typeof obj != "number")); // do not test for [Infinity] value but test for *objectness* instead.
    });
  })((/^\[object\s+Number\]$/), exposeImplementation);

  sh.isNumberValue = (function (obj/*:[object|value]*/) {
    return (typeof obj == "number");
  });
  sh.isNumber = (function (isFinite, isNumberObject) { // [isFinite] as of this implementation did prove its x-frame-safety.
    return (function (obj/*:[object|value]*/) {

      return (((typeof obj == "number") || isNumberObject(obj)) && isFinite(obj)); // additional test for [Infinity] value.
    });
  })(sh.isFinite, sh.isNumberObject);/*

  or is it even better changing above implementations back and add an additional 4th method [isValidNumber] to this global [isNumber...] method set?
*/ /*
  sh.isNumber = (function (regXBaseClass, expose) {
    return (function (obj/ *:[object|value]* /) {

    //return (isNative(obj) && (obj instanceof Number)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof Number))); // too much - missing the point.

      return regXBaseClass.test(expose.call(obj));
    });
  })((/^\[object\s+Number\]$/), exposeImplementation);

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


  sh.isString = (function (regXBaseClass, expose) {
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof String)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof String))); // too much - missing the point.

      return regXBaseClass.test(expose.call(obj));
    });
  })((/^\[object\s+String\]$/), exposeImplementation);

  sh.isStringValue = (function (obj/*:[object|value]*/) {
    return (typeof obj == "string");
  });
  sh.isStringObject = (function (isString) {
    return (function (obj/*:[object|value]*/) {

      return (isString(obj) && (typeof obj != "string"));
    });
  })(sh.isString);/*



  sh.propertyIsEnumerable = Obj.propertyIsEnumerable = (function () {*/
  propertyIsEnumerable = (function () {

    var propertyIsEnumerable;
    try {
      ObjProto.propertyIsEnumerable.call(null, "length");

      propertyIsEnumerable = (function (isEnumerable) {
        return (function (obj, key) {

          return isEnumerable.call(obj, key);
        });
      })(ObjProto.propertyIsEnumerable);

    } catch (exc) { // [exc]::[Error]

      propertyIsEnumerable = (function (isEnumerable) {
        return (function (obj, key) {

          var isEnum;
          try {
            isEnum = isEnumerable.call(obj, key);
          } catch (exc) {
          //isEnum = false;
            isEnum = true; /* due to [propertyIsEnumerable]'s special internal use within client/js-egine specific [isArgumentsArray] method */
          }
          return isEnum;
        });
      })(ObjProto.propertyIsEnumerable);
    }
    return propertyIsEnumerable;
  })();



  sh.isArray = (((typeof Arr.isArray == "function") && Arr.isArray) || (Arr.isArray = (function (regXBaseClass, expose) { // equal to : sh.isArray = Arr.isArray = (function () { ... });
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof Array)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof Array))); // too much - missing the point.

      return regXBaseClass.test(expose.call(obj));
    });
  })((/^\[object\s+Array\]$/), exposeImplementation)));

  sh.isArgumentsArray = (((typeof Arr.isArgumentsArray == "function") && Arr.isArgumentsArray) || (Arr.isArgumentsArray = (function () { // equal to : sh.isArgumentsArray = Arr.isArgumentsArray = (function () { ... });

    var isArguments;
    if ((function () {return regXBaseClassArguments.test(exposeImplementation.call(arguments));})()) {

      isArguments = (function (regXBaseClass, expose) {
        return (function (obj/*:[object|value]*/) {

          return regXBaseClass.test(expose.call(obj));
        });
      })(regXBaseClassArguments, exposeImplementation);

    } else {

      isArguments = (function (regXBaseClass, expose, isFinite, isEnumerable) {
        return (function (obj/*:[object|value]*/) {

          return (regXBaseClass.test(expose.call(obj)) && !!obj && (typeof obj.length == "number") && isFinite(obj.length) && !isEnumerable(obj, "length"));
        });
      })(regXBaseClassObject, exposeImplementation, sh.isFinite, /*sh.*/propertyIsEnumerable);
    }
    return isArguments;
  })()));

  sh.isListLike = (function (isNeitherUndefinedNorNull) {
    return (function (obj/*:[object|value]*/) {

      return (isNeitherUndefinedNorNull(obj) && (typeof obj.length == "number") && isFinite(obj.length));
    });
  })(sh.isNeitherUndefinedNorNull);



  sh.isObjectObject = (function (regXBaseClass, expose, isNative) { // returns true only in case of this global functions argument is a native ECMAScript [[Object]] type but neither the [null] value nor an ECMAScript [[Function]] type.
    return (function (obj/*:[object|value]*/) {

    //return ((obj || ((typeof obj != "undefined") && (typeof obj != "object"))) && (typeof obj.constructor == "function") && regXBaseClass.test(expose.call(obj)));
    //return (isDefined(obj) && isNotNull(obj) && (typeof obj.constructor == "function") && regXBaseClass.test(expose.call(obj)));
    //return (isNeitherUndefinedNorNull(obj) && (typeof obj.constructor == "function") && regXBaseClass.test(expose.call(obj)));

      return (isNative(obj) && regXBaseClass.test(expose.call(obj)));
    });
  })(regXBaseClassObject, exposeImplementation, sh.isNative);



  sh.isFunction = (function (obj/*:[object|value]*/) { // returns true only in case of this global functions argument is an ECMAScript [[Function]] type.

    return ((typeof obj == "function") && (typeof obj.call == "function") && (typeof obj.apply == "function")); // x-frame-safe and also filters e.g. mozillas [[RegExp]] implementation.
  });/*
  sh.isFunction = (function (regXBaseClass, expose) { // returns true only in case of this global functions argument is an ECMAScript [[Function]] type.
    return (function (obj/ *:[object|value]* /) {

      return (regXBaseClass.test(expose.call(obj)) && regXBaseClass.test(expose.call(obj.call)) && regXBaseClass.test(expose.call(obj.apply)));
    });
  })((/^\[object\s+Function\]$/), exposeImplementation);*/

  sh.isCallable = (function (isFunction) { // returns true only in case of this global functions argument is a callable type.

    var getCallability = (function (mayBeCallee) {
      var isCallable = false;
      try {
        mayBeCallee();
        isCallable = true;
      } catch (err) {
      //alert(err);
        isCallable = (!(err instanceof TypeError) && (err.message != "NOT_SUPPORTED_ERR"));
      }
      return isCallable;
    }),/*
    regXCallable = (/function\s+[^(]+\([^)]*\)\s*\{/);*/
    regXCallable = (/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/);

    return (function (obj/*:[object|value]*/) {/*

    - opera falsly can bypass this since for example [Element] claims to be typeof "function" as well as supporting both functional [call] and [apply].
    - the [getCallability] test then will not be entered even though it was going to fail throwing "Error: NOT_SUPPORTED_ERR".

    - either way - this test remains unchanged so far since a natively implemented [Function]-object always should be callable.
*/
    //return (isFunction(obj)/* || regXCallable.test(String(obj))*/ || getCallability(obj));
      return (isFunction(obj) || regXCallable.test("" + obj) || getCallability(obj));
    });
  })(sh.isFunction);



  sh.isRegExp = (function (regXBaseClass, expose) {
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof RegExp)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof RegExp))); // too much - missing the point.

      return regXBaseClass.test(expose.call(obj));
    });
  })((/^\[object\s+RegExp\]$/), exposeImplementation);


  sh.isDate = (function (regXBaseClass, expose) {
    return (function (obj/*:[object|value]*/) {

    //return (isNative(obj) && (obj instanceof Date)); // actually sufficient/adequate accuracy though unfortunately not x-frame-safe.
    //return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof Date))); // too much - missing the point.

      return regXBaseClass.test(expose.call(obj));
    });
  })((/^\[object\s+Date\]$/), exposeImplementation);



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
  sh.isError = (function (regXErrorClass, expose) { // [isError] : not specific - will match all [Error] types
    return (function (obj/*:[object|value]*/) {

      return regXErrorClass.test(expose.call(obj));
    });
  })((/^\[object\s+Error\]$/), exposeImplementation);

  sh.isGenericError = (function (regXErrorType, expose, isError) { // [isErrorError]
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "Error"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "Error"))));
    });
  })((/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/), exposeErrorImplementation, sh.isError); // (mozilla|webkit) || (mozilla|webkit) || (opera)

  sh.isEvalError = (function (regXErrorType, expose, isError) {
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "EvalError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "EvalError"))));
    });
  })((/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/), exposeErrorImplementation, sh.isError); // (mozilla|webkit) || (mozilla|webkit) || (opera)

  sh.isRangeError = (function (regXErrorType, expose, isError) {
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "RangeError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "RangeError"))));
    });
  })((/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/), exposeErrorImplementation, sh.isError); // (mozilla|webkit) || (mozilla|webkit) || (opera)

  sh.isReferenceError = (function (regXErrorType, expose, isError) {
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "ReferenceError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "ReferenceError"))));
    });
  })((/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/), exposeErrorImplementation, sh.isError); // (mozilla|webkit) || (mozilla|webkit) || (opera)

  sh.isSyntaxError = (function (regXErrorType, expose, isError) {
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "SyntaxError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "SyntaxError"))));
    });
  })((/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/), exposeErrorImplementation, sh.isError); // (mozilla|webkit) || (mozilla|webkit) || (opera)

  sh.isTypeError = (function (regXErrorType, expose, isError) {
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "TypeError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "TypeError"))));
    });
  })((/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/), exposeErrorImplementation, sh.isError); // (mozilla|webkit) || (mozilla|webkit) || (opera)

  sh.isURIError = (function (regXErrorType, expose, isError) {
    return (function (obj/*:[object|value]*/) {

    //return (isError(obj) && (regXErrorType.test(expose.call(obj)) || (obj.name && (obj.name == "URIError"))));
      return (isError(obj) && (regXErrorType.test(expose.call(obj)) || ((typeof obj.name == "string") && (obj.name == "URIError"))));
    });
  })((/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/), exposeErrorImplementation, sh.isError); // (mozilla|webkit) || (mozilla|webkit) || (opera)



/*
  sh.isHTMLCollection = (function (regXBaseClass, expose, isNative) {
    return (function (obj/ *:[object|value]* /) {

      return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof HTMLCollection)));
    });
  })((/^\[object\s+HTMLCollection\]$/), exposeImplementation, sh.isNative);

  sh.isNodeList = (function (regXBaseClass, expose, isNative) {
  //regXBaseClass = (/^\[object\s+HTMLCollection\]$/);
    return (function (obj/ *:[object|value]* /) {

      return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof NodeList)));
    });
  })((/^\[object\s+NodeList\]$/), exposeImplementation, sh.isNative);

  sh.isHTMLElement = (function (regXBaseClass, expose, isNative) {
  //regXBaseClass = (/^\[object\s+Node\]$/);
  //regXBaseClass = (/^\[object\s+Element\]$/);
    return (function (obj/ *:[object|value]* /) {

      return (regXBaseClass.test(expose.call(obj)) || (isNative(obj) && (obj instanceof HTMLElement)));
    });
  })((/^\[object\s+HTML(.*)?Element\]$/), exposeImplementation, sh.isNative);
*/



//exposeImplementation.call(null); // [object builtins] - was in google chrome and safari only ... nowadays [object global] as of 2009 ... [object Window] in mozilla/opera
//exposeImplementation.call(); // [object builtins] - was in google chrome and safari only ... nowadays [object global] as of 2009 ... [object Window] in mozilla/opera
//exposeImplementation.call(undefined); // [object builtins] - was in google chrome and safari only ... nowadays [object global] as of 2009 ... [object Window] in mozilla/opera


  ObjProto.getBaseName = (function (regXBaseClass, expose, global) {
    return (function (delegatee) { // [delegatee] : object that explicitly got delegated by e.g. [Object.getBaseName] in order to distinguish it from [global].

    //var str = "builtins"; // within google chrome and safari [object builtins] was a fallback message according to built-in objects that get not closer specified.
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
  })(regXClassName, exposeImplementation, sh);

  Obj.getBaseName = (function (getBaseName, global) {
    return (function (obj/*:[object|value]*/) {

      return getBaseName.call(global, obj); // explicit delegation via apply/call.
    });
  })(ObjProto.getBaseName, sh);/*

  print(Object.getBaseName(document.documentElement)); // HTMLHtmlElement || Object(msie)
  print(Object.getBaseName(document.body)); // HTMLBodyElement || Object(msie)
  print(Object.getBaseName(window)); // Window || global(google chrome, safari) || Object(msie)

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


  ObjProto.getBase = (function (regXBaseClass, expose, isUndefinedOrNull, global) { // or [getBaseType] or even more precisely [getBaseTypeOrValue]
  //(!obj && ((typeof obj == "undefined") || (typeof obj == "object"))) // implementation of [isUndefinedOrNull]
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
  })(regXClassName, exposeImplementation, sh.isUndefinedOrNull, sh);

  Obj.getBase = (function (getBase, global) { // or [getBaseType] or even more precisely [getBaseTypeOrValue]
    return (function (obj/*:[object|value]*/) {

      return getBase.call(global, obj); // explicit delegation via apply/call.
    });
  })(ObjProto.getBase, sh);/*

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

  exposeErrorImplementation = exposeImplementation = propertyIsEnumerable = null;
  regXBaseClassArguments = regXBaseClassObject = regXClassName = null;
  ObjProto = Obj = Arr = sh = null;

  delete exposeErrorImplementation; delete exposeImplementation; delete propertyIsEnumerable;
  delete regXBaseClassArguments; delete regXBaseClassObject; delete regXClassName;
  delete ObjProto; delete Obj; delete Arr; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);





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


- Whitespace only - 8.747 byte : (additionally featuring [getBase ...] functionality)
(function(){var sh=this,Arr=sh.Array,Obj=sh.Object,ObjProto=Obj.prototype,regXClassName=/^\[object\s+(.*)\]$/,regXBaseClassObject=/^\[object\s+Object\]$/,regXBaseClassArguments=/^\[object\s+Arguments\]$/,propertyIsEnumerable,exposeImplementation=ObjProto.toString,exposeErrorImplementation=sh.Error.prototype.toString;sh.isUndefined=function(obj){return typeof obj=="undefined"};sh.isDefined=function(obj){return typeof obj!="undefined"};sh.isNull=function(obj){return!obj&&typeof obj=="object"};sh.isNotNull=function(obj){return obj||typeof obj!="object"};sh.isUndefinedOrNull=function(obj){return!obj&&(typeof obj=="undefined"||typeof obj=="object")};sh.isNeitherUndefinedNorNull=function(obj){return obj||typeof obj!="undefined"&&typeof obj!="object"};sh.isPrimitive=function(obj){return typeof obj=="string"||typeof obj=="number"||typeof obj=="boolean"};sh.isValue=function(isPrimitive,isUndefinedOrNull){return function(obj){return isPrimitive(obj)||isUndefinedOrNull(obj)}}(sh.isPrimitive,sh.isUndefinedOrNull);sh.isObject=function(obj){return obj&&(typeof obj=="object"||typeof obj=="function")};sh.isNative=function(isNeitherUndefinedNorNull){return function(obj){return isNeitherUndefinedNorNull(obj)&&typeof obj.constructor=="function"}}(sh.isNeitherUndefinedNorNull);sh.isAlien=function(isObject){return function(obj){return isObject(obj)&&typeof obj.constructor!="function"}}(sh.isObject);sh.isBoolean=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+Boolean\]$/,exposeImplementation);sh.isBooleanValue=function(obj){return typeof obj=="boolean"};sh.isBooleanObject=function(isBoolean){return function(obj){return isBoolean(obj)&&typeof obj!="boolean"}}(sh.isBoolean);sh.isNumberObject=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))&&typeof obj!="number"}}(/^\[object\s+Number\]$/,exposeImplementation);sh.isNumberValue=function(obj){return typeof obj=="number"};sh.isNumber=function(isFinite,isNumberObject){return function(obj){return(typeof obj=="number"||isNumberObject(obj))&&isFinite(obj)}}(sh.isFinite,sh.isNumberObject);sh.isString=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+String\]$/,exposeImplementation);sh.isStringValue=function(obj){return typeof obj=="string"};sh.isStringObject=function(isString){return function(obj){return isString(obj)&&typeof obj!="string"}}(sh.isString);propertyIsEnumerable=function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=function(isEnumerable){return function(obj,key){return isEnumerable.call(obj,key)}}(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=function(isEnumerable){return function(obj,key){var isEnum;try{isEnum=isEnumerable.call(obj,key)}catch(exc){isEnum=true}return isEnum}}(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable}();sh.isArray=typeof Arr.isArray=="function"&&Arr.isArray||(Arr.isArray=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+Array\]$/,exposeImplementation));sh.isArgumentsArray=typeof Arr.isArgumentsArray=="function"&&Arr.isArgumentsArray||(Arr.isArgumentsArray=function(){var isArguments;if(function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))}())isArguments=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(regXBaseClassArguments,exposeImplementation);else isArguments=function(regXBaseClass,expose,isFinite,isEnumerable){return function(obj){return regXBaseClass.test(expose.call(obj))&&!!obj&&typeof obj.length=="number"&&isFinite(obj.length)&&!isEnumerable(obj,"length")}}(regXBaseClassObject,exposeImplementation,sh.isFinite,propertyIsEnumerable);return isArguments}());sh.isListLike=function(isNeitherUndefinedNorNull){return function(obj){return isNeitherUndefinedNorNull(obj)&&typeof obj.length=="number"&&isFinite(obj.length)}}(sh.isNeitherUndefinedNorNull);sh.isObjectObject=function(regXBaseClass,expose,isNative){return function(obj){return isNative(obj)&&regXBaseClass.test(expose.call(obj))}}(regXBaseClassObject,exposeImplementation,sh.isNative);sh.isFunction=function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"};sh.isCallable=function(isFunction){var getCallability=function(mayBeCallee){var isCallable=false;try{mayBeCallee();isCallable=true}catch(err){isCallable=!(err instanceof TypeError)&&err.message!="NOT_SUPPORTED_ERR"}return isCallable},regXCallable=/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/;return function(obj){return isFunction(obj)||regXCallable.test(""+obj)||getCallability(obj)}}(sh.isFunction);sh.isRegExp=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+RegExp\]$/,exposeImplementation);sh.isDate=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+Date\]$/,exposeImplementation);sh.isError=function(regXErrorClass,expose){return function(obj){return regXErrorClass.test(expose.call(obj))}}(/^\[object\s+Error\]$/,exposeImplementation);sh.isGenericError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="Error")}}(/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/,exposeErrorImplementation,sh.isError);sh.isEvalError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="EvalError")}}(/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/,exposeErrorImplementation,sh.isError);sh.isRangeError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="RangeError")}}(/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/,exposeErrorImplementation,sh.isError);sh.isReferenceError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="ReferenceError")}}(/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/,exposeErrorImplementation,sh.isError);sh.isSyntaxError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="SyntaxError")}}(/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/,exposeErrorImplementation,sh.isError);sh.isTypeError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="TypeError")}}(/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/,exposeErrorImplementation,sh.isError);sh.isURIError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="URIError")}}(/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/,exposeErrorImplementation,sh.isError);ObjProto.getBaseName=function(regXBaseClass,expose,global){return function(delegatee){var str;if(this===global)if(typeof delegatee=="undefined")str="UndefinedType";else if(!delegatee&&typeof delegatee=="object")str="NullType";else str=regXBaseClass.exec(expose.call(delegatee))[1];else str=regXBaseClass.exec(expose.call(this))[1];return str}}(regXClassName,exposeImplementation,sh);Obj.getBaseName=function(getBaseName,global){return function(obj){return getBaseName.call(global,obj)}}(ObjProto.getBaseName,sh);ObjProto.getBase=function(regXBaseClass,expose,isUndefinedOrNull,global){return function(delegatee){var Base;if(this===global)if(isUndefinedOrNull(delegatee))Base=delegatee;else Base=global[regXBaseClass.exec(expose.call(delegatee))[1]];else Base=global[regXBaseClass.exec(expose.call(this))[1]];return Base}}(regXClassName,exposeImplementation,sh.isUndefinedOrNull,sh);Obj.getBase=function(getBase,global){return function(obj){return getBase.call(global,obj)}}(ObjProto.getBase,sh);exposeErrorImplementation=exposeImplementation=propertyIsEnumerable=null;regXBaseClassArguments=regXBaseClassObject=regXClassName=null;ObjProto=Obj=Arr=sh=null;delete exposeErrorImplementation;delete exposeImplementation;delete propertyIsEnumerable;delete regXBaseClassArguments;delete regXBaseClassObject;delete regXClassName;delete ObjProto;delete Obj;delete Arr;delete sh;delete arguments.callee}).call(null);

- Simple          - 5.734 byte : (additionally featuring [getBase ...] functionality)
(function(){var c=this,j=c.Array,k=c.Object,h=k.prototype,l=/^\[object\s+(.*)\]$/,m=/^\[object\s+Object\]$/,n=/^\[object\s+Arguments\]$/,o,g=h.toString,i=c.Error.prototype.toString;c.isUndefined=function(a){return typeof a=="undefined"};c.isDefined=function(a){return typeof a!="undefined"};c.isNull=function(a){return!a&&typeof a=="object"};c.isNotNull=function(a){return a||typeof a!="object"};c.isUndefinedOrNull=function(a){return!a&&(typeof a=="undefined"||typeof a=="object")};c.isNeitherUndefinedNorNull=function(a){return a||typeof a!="undefined"&&typeof a!="object"};c.isPrimitive=function(a){return typeof a=="string"||typeof a=="number"||typeof a=="boolean"};c.isValue=function(a,b){return function(e){return a(e)||b(e)}}(c.isPrimitive,c.isUndefinedOrNull);c.isObject=function(a){return a&&(typeof a=="object"||typeof a=="function")};c.isNative=function(a){return function(b){return a(b)&&typeof b.constructor=="function"}}(c.isNeitherUndefinedNorNull);c.isAlien=function(a){return function(b){return a(b)&&typeof b.constructor!="function"}}(c.isObject);c.isBoolean=function(a,b){return function(e){return a.test(b.call(e))}}(/^\[object\s+Boolean\]$/,g);c.isBooleanValue=function(a){return typeof a=="boolean"};c.isBooleanObject=function(a){return function(b){return a(b)&&typeof b!="boolean"}}(c.isBoolean);c.isNumberObject=function(a,b){return function(e){return a.test(b.call(e))&&typeof e!="number"}}(/^\[object\s+Number\]$/,g);c.isNumberValue=function(a){return typeof a=="number"};c.isNumber=function(a,b){return function(e){return(typeof e=="number"||b(e))&&a(e)}}(c.isFinite,c.isNumberObject);c.isString=function(a,b){return function(e){return a.test(b.call(e))}}(/^\[object\s+String\]$/,g);c.isStringValue=function(a){return typeof a=="string"};c.isStringObject=function(a){return function(b){return a(b)&&typeof b!="string"}}(c.isString);o=function(){var a;try{h.propertyIsEnumerable.call(null,"length");a=function(e){return function(d,f){return e.call(d,f)}}(h.propertyIsEnumerable)}catch(b){a=function(e){return function(d,f){var p;try{p=e.call(d,f)}catch(q){p=true}return p}}(h.propertyIsEnumerable)}return a}();c.isArray=typeof j.isArray=="function"&&j.isArray||(j.isArray=function(a,b){return function(e){return a.test(b.call(e))}}(/^\[object\s+Array\]$/,g));c.isArgumentsArray=typeof j.isArgumentsArray=="function"&&j.isArgumentsArray||(j.isArgumentsArray=function(){return function(){return n.test(g.call(arguments))}()?function(a,b){return function(e){return a.test(b.call(e))}}(n,g):function(a,b,e,d){return function(f){return a.test(b.call(f))&&!!f&&typeof f.length=="number"&&e(f.length)&&!d(f,"length")}}(m,g,c.isFinite,o)}());c.isListLike=function(a){return function(b){return a(b)&&typeof b.length=="number"&&isFinite(b.length)}}(c.isNeitherUndefinedNorNull);c.isObjectObject=function(a,b,e){return function(d){return e(d)&&a.test(b.call(d))}}(m,g,c.isNative);c.isFunction=function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"};c.isCallable=function(a){var b=/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/;return function(e){var d;if(!(d=a(e))){if(!(d=b.test(""+e))){d=false;try{e();d=true}catch(f){d=!(f instanceof TypeError)&&f.message!="NOT_SUPPORTED_ERR"}d=d}d=d}return d}}(c.isFunction);c.isRegExp=function(a,b){return function(e){return a.test(b.call(e))}}(/^\[object\s+RegExp\]$/,g);c.isDate=function(a,b){return function(e){return a.test(b.call(e))}}(/^\[object\s+Date\]$/,g);c.isError=function(a,b){return function(e){return a.test(b.call(e))}}(/^\[object\s+Error\]$/,g);c.isGenericError=function(a,b,e){return function(d){return e(d)&&(a.test(b.call(d))||typeof d.name=="string"&&d.name=="Error")}}(/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/,i,c.isError);c.isEvalError=function(a,b,e){return function(d){return e(d)&&(a.test(b.call(d))||typeof d.name=="string"&&d.name=="EvalError")}}(/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/,i,c.isError);c.isRangeError=function(a,b,e){return function(d){return e(d)&&(a.test(b.call(d))||typeof d.name=="string"&&d.name=="RangeError")}}(/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/,i,c.isError);c.isReferenceError=function(a,b,e){return function(d){return e(d)&&(a.test(b.call(d))||typeof d.name=="string"&&d.name=="ReferenceError")}}(/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/,i,c.isError);c.isSyntaxError=function(a,b,e){return function(d){return e(d)&&(a.test(b.call(d))||typeof d.name=="string"&&d.name=="SyntaxError")}}(/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/,i,c.isError);c.isTypeError=function(a,b,e){return function(d){return e(d)&&(a.test(b.call(d))||typeof d.name=="string"&&d.name=="TypeError")}}(/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/,i,c.isError);c.isURIError=function(a,b,e){return function(d){return e(d)&&(a.test(b.call(d))||typeof d.name=="string"&&d.name=="URIError")}}(/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/,i,c.isError);h.getBaseName=function(a,b,e){return function(d){return this===e?typeof d=="undefined"?"UndefinedType":!d&&typeof d=="object"?"NullType":a.exec(b.call(d))[1]:a.exec(b.call(this))[1]}}(l,g,c);k.getBaseName=function(a,b){return function(e){return a.call(b,e)}}(h.getBaseName,c);h.getBase=function(a,b,e,d){return function(f){return this===d?e(f)?f:d[a.exec(b.call(f))[1]]:d[a.exec(b.call(this))[1]]}}(l,g,c.isUndefinedOrNull,c);k.getBase=function(a,b){return function(e){return a.call(b,e)}}(h.getBase,c);h=k=j=c=n=m=l=i=g=o=null;delete i;delete g;delete o;delete n;delete m;delete l;delete h;delete k;delete j;delete c;delete arguments.callee}).call(null);



- Whitespace only - 7.681 byte : (does not include [getBase ...] functionality)
(function(){var sh=this,Arr=sh.Array,Obj=sh.Object,ObjProto=Obj.prototype,regXBaseClassObject=/^\[object\s+Object\]$/,regXBaseClassArguments=/^\[object\s+Arguments\]$/,propertyIsEnumerable,exposeImplementation=ObjProto.toString,exposeErrorImplementation=sh.Error.prototype.toString;sh.isUndefined=function(obj){return typeof obj=="undefined"};sh.isDefined=function(obj){return typeof obj!="undefined"};sh.isNull=function(obj){return!obj&&typeof obj=="object"};sh.isNotNull=function(obj){return obj||typeof obj!="object"};sh.isUndefinedOrNull=function(obj){return!obj&&(typeof obj=="undefined"||typeof obj=="object")};sh.isNeitherUndefinedNorNull=function(obj){return obj||typeof obj!="undefined"&&typeof obj!="object"};sh.isPrimitive=function(obj){return typeof obj=="string"||typeof obj=="number"||typeof obj=="boolean"};sh.isValue=function(isPrimitive,isUndefinedOrNull){return function(obj){return isPrimitive(obj)||isUndefinedOrNull(obj)}}(sh.isPrimitive,sh.isUndefinedOrNull);sh.isObject=function(obj){return obj&&(typeof obj=="object"||typeof obj=="function")};sh.isNative=function(isNeitherUndefinedNorNull){return function(obj){return isNeitherUndefinedNorNull(obj)&&typeof obj.constructor=="function"}}(sh.isNeitherUndefinedNorNull);sh.isAlien=function(isObject){return function(obj){return isObject(obj)&&typeof obj.constructor!="function"}}(sh.isObject);sh.isBoolean=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+Boolean\]$/,exposeImplementation);sh.isBooleanValue=function(obj){return typeof obj=="boolean"};sh.isBooleanObject=function(isBoolean){return function(obj){return isBoolean(obj)&&typeof obj!="boolean"}}(sh.isBoolean);sh.isNumberObject=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))&&typeof obj!="number"}}(/^\[object\s+Number\]$/,exposeImplementation);sh.isNumberValue=function(obj){return typeof obj=="number"};sh.isNumber=function(isFinite,isNumberObject){return function(obj){return(typeof obj=="number"||isNumberObject(obj))&&isFinite(obj)}}(sh.isFinite,sh.isNumberObject);sh.isString=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+String\]$/,exposeImplementation);sh.isStringValue=function(obj){return typeof obj=="string"};sh.isStringObject=function(isString){return function(obj){return isString(obj)&&typeof obj!="string"}}(sh.isString);propertyIsEnumerable=function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=function(isEnumerable){return function(obj,key){return isEnumerable.call(obj,key)}}(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=function(isEnumerable){return function(obj,key){var isEnum;try{isEnum=isEnumerable.call(obj,key)}catch(exc){isEnum=true}return isEnum}}(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable}();sh.isArray=typeof Arr.isArray=="function"&&Arr.isArray||(Arr.isArray=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+Array\]$/,exposeImplementation));sh.isArgumentsArray=typeof Arr.isArgumentsArray=="function"&&Arr.isArgumentsArray||(Arr.isArgumentsArray=function(){var isArguments;if(function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))}())isArguments=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(regXBaseClassArguments,exposeImplementation);else isArguments=function(regXBaseClass,expose,isFinite,isEnumerable){return function(obj){return regXBaseClass.test(expose.call(obj))&&!!obj&&typeof obj.length=="number"&&isFinite(obj.length)&&!isEnumerable(obj,"length")}}(regXBaseClassObject,exposeImplementation,sh.isFinite,propertyIsEnumerable);return isArguments}());sh.isListLike=function(isNeitherUndefinedNorNull){return function(obj){return isNeitherUndefinedNorNull(obj)&&typeof obj.length=="number"&&isFinite(obj.length)}}(sh.isNeitherUndefinedNorNull);sh.isObjectObject=function(regXBaseClass,expose,isNative){return function(obj){return isNative(obj)&&regXBaseClass.test(expose.call(obj))}}(regXBaseClassObject,exposeImplementation,sh.isNative);sh.isFunction=function(obj){return typeof obj=="function"&&typeof obj.call=="function"&&typeof obj.apply=="function"};sh.isCallable=function(isFunction){var getCallability=function(mayBeCallee){var isCallable=false;try{mayBeCallee();isCallable=true}catch(err){isCallable=!(err instanceof TypeError)&&err.message!="NOT_SUPPORTED_ERR"}return isCallable},regXCallable=/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/;return function(obj){return isFunction(obj)||regXCallable.test(""+obj)||getCallability(obj)}}(sh.isFunction);sh.isRegExp=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+RegExp\]$/,exposeImplementation);sh.isDate=function(regXBaseClass,expose){return function(obj){return regXBaseClass.test(expose.call(obj))}}(/^\[object\s+Date\]$/,exposeImplementation);sh.isError=function(regXErrorClass,expose){return function(obj){return regXErrorClass.test(expose.call(obj))}}(/^\[object\s+Error\]$/,exposeImplementation);sh.isGenericError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="Error")}}(/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/,exposeErrorImplementation,sh.isError);sh.isEvalError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="EvalError")}}(/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/,exposeErrorImplementation,sh.isError);sh.isRangeError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="RangeError")}}(/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/,exposeErrorImplementation,sh.isError);sh.isReferenceError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="ReferenceError")}}(/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/,exposeErrorImplementation,sh.isError);sh.isSyntaxError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="SyntaxError")}}(/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/,exposeErrorImplementation,sh.isError);sh.isTypeError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="TypeError")}}(/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/,exposeErrorImplementation,sh.isError);sh.isURIError=function(regXErrorType,expose,isError){return function(obj){return isError(obj)&&(regXErrorType.test(expose.call(obj))||typeof obj.name=="string"&&obj.name=="URIError")}}(/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/,exposeErrorImplementation,sh.isError);exposeErrorImplementation=exposeImplementation=propertyIsEnumerable=null;regXBaseClassArguments=regXBaseClassObject=null;ObjProto=Obj=Arr=sh=null;delete exposeErrorImplementation;delete exposeImplementation;delete propertyIsEnumerable;delete regXBaseClassArguments;delete regXBaseClassObject;delete ObjProto;delete Obj;delete Arr;delete sh;delete arguments.callee}).call(null);

- Simple          - 5.196 byte : (does not include [getBase ...] functionality)
(function(){var b=this,i=b.Array,n=b.Object,j=n.prototype,k=/^\[object\s+Object\]$/,l=/^\[object\s+Arguments\]$/,m,f=j.toString,h=b.Error.prototype.toString;b.isUndefined=function(a){return typeof a=="undefined"};b.isDefined=function(a){return typeof a!="undefined"};b.isNull=function(a){return!a&&typeof a=="object"};b.isNotNull=function(a){return a||typeof a!="object"};b.isUndefinedOrNull=function(a){return!a&&(typeof a=="undefined"||typeof a=="object")};b.isNeitherUndefinedNorNull=function(a){return a||typeof a!="undefined"&&typeof a!="object"};b.isPrimitive=function(a){return typeof a=="string"||typeof a=="number"||typeof a=="boolean"};b.isValue=function(a,c){return function(e){return a(e)||c(e)}}(b.isPrimitive,b.isUndefinedOrNull);b.isObject=function(a){return a&&(typeof a=="object"||typeof a=="function")};b.isNative=function(a){return function(c){return a(c)&&typeof c.constructor=="function"}}(b.isNeitherUndefinedNorNull);b.isAlien=function(a){return function(c){return a(c)&&typeof c.constructor!="function"}}(b.isObject);b.isBoolean=function(a,c){return function(e){return a.test(c.call(e))}}(/^\[object\s+Boolean\]$/,f);b.isBooleanValue=function(a){return typeof a=="boolean"};b.isBooleanObject=function(a){return function(c){return a(c)&&typeof c!="boolean"}}(b.isBoolean);b.isNumberObject=function(a,c){return function(e){return a.test(c.call(e))&&typeof e!="number"}}(/^\[object\s+Number\]$/,f);b.isNumberValue=function(a){return typeof a=="number"};b.isNumber=function(a,c){return function(e){return(typeof e=="number"||c(e))&&a(e)}}(b.isFinite,b.isNumberObject);b.isString=function(a,c){return function(e){return a.test(c.call(e))}}(/^\[object\s+String\]$/,f);b.isStringValue=function(a){return typeof a=="string"};b.isStringObject=function(a){return function(c){return a(c)&&typeof c!="string"}}(b.isString);m=function(){var a;try{j.propertyIsEnumerable.call(null,"length");a=function(e){return function(d,g){return e.call(d,g)}}(j.propertyIsEnumerable)}catch(c){a=function(e){return function(d,g){var o;try{o=e.call(d,g)}catch(p){o=true}return o}}(j.propertyIsEnumerable)}return a}();b.isArray=typeof i.isArray=="function"&&i.isArray||(i.isArray=function(a,c){return function(e){return a.test(c.call(e))}}(/^\[object\s+Array\]$/,f));b.isArgumentsArray=typeof i.isArgumentsArray=="function"&&i.isArgumentsArray||(i.isArgumentsArray=function(){return function(){return l.test(f.call(arguments))}()?function(a,c){return function(e){return a.test(c.call(e))}}(l,f):function(a,c,e,d){return function(g){return a.test(c.call(g))&&!!g&&typeof g.length=="number"&&e(g.length)&&!d(g,"length")}}(k,f,b.isFinite,m)}());b.isListLike=function(a){return function(c){return a(c)&&typeof c.length=="number"&&isFinite(c.length)}}(b.isNeitherUndefinedNorNull);b.isObjectObject=function(a,c,e){return function(d){return e(d)&&a.test(c.call(d))}}(k,f,b.isNative);b.isFunction=function(a){return typeof a=="function"&&typeof a.call=="function"&&typeof a.apply=="function"};b.isCallable=function(a){var c=/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/;return function(e){var d;if(!(d=a(e))){if(!(d=c.test(""+e))){d=false;try{e();d=true}catch(g){d=!(g instanceof TypeError)&&g.message!="NOT_SUPPORTED_ERR"}d=d}d=d}return d}}(b.isFunction);b.isRegExp=function(a,c){return function(e){return a.test(c.call(e))}}(/^\[object\s+RegExp\]$/,f);b.isDate=function(a,c){return function(e){return a.test(c.call(e))}}(/^\[object\s+Date\]$/,f);b.isError=function(a,c){return function(e){return a.test(c.call(e))}}(/^\[object\s+Error\]$/,f);b.isGenericError=function(a,c,e){return function(d){return e(d)&&(a.test(c.call(d))||typeof d.name=="string"&&d.name=="Error")}}(/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/,h,b.isError);b.isEvalError=function(a,c,e){return function(d){return e(d)&&(a.test(c.call(d))||typeof d.name=="string"&&d.name=="EvalError")}}(/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/,h,b.isError);b.isRangeError=function(a,c,e){return function(d){return e(d)&&(a.test(c.call(d))||typeof d.name=="string"&&d.name=="RangeError")}}(/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/,h,b.isError);b.isReferenceError=function(a,c,e){return function(d){return e(d)&&(a.test(c.call(d))||typeof d.name=="string"&&d.name=="ReferenceError")}}(/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/,h,b.isError);b.isSyntaxError=function(a,c,e){return function(d){return e(d)&&(a.test(c.call(d))||typeof d.name=="string"&&d.name=="SyntaxError")}}(/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/,h,b.isError);b.isTypeError=function(a,c,e){return function(d){return e(d)&&(a.test(c.call(d))||typeof d.name=="string"&&d.name=="TypeError")}}(/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/,h,b.isError);b.isURIError=function(a,c,e){return function(d){return e(d)&&(a.test(c.call(d))||typeof d.name=="string"&&d.name=="URIError")}}(/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/,h,b.isError);j=n=i=b=l=k=h=f=m=null;delete h;delete f;delete m;delete l;delete k;delete j;delete n;delete i;delete b;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 9.055 byte : (additionally featuring [getBase ...] functionality)
(function(){var sh=this,Arr=sh.Array,Obj=sh.Object,ObjProto=Obj.prototype,regXClassName=(/^\[object\s+(.*)\]$/),regXBaseClassObject=(/^\[object\s+Object\]$/),regXBaseClassArguments=(/^\[object\s+Arguments\]$/),propertyIsEnumerable,exposeImplementation=ObjProto.toString,exposeErrorImplementation=sh.Error.prototype.toString;sh.isUndefined=(function(obj){return(typeof obj=="undefined")});sh.isDefined=(function(obj){return(typeof obj!="undefined")});sh.isNull=(function(obj){return(!obj&&(typeof obj=="object"))});sh.isNotNull=(function(obj){return(obj||(typeof obj!="object"))});sh.isUndefinedOrNull=(function(obj){return(!obj&&((typeof obj=="undefined")||(typeof obj=="object")))});sh.isNeitherUndefinedNorNull=(function(obj){return(obj||((typeof obj!="undefined")&&(typeof obj!="object")))});sh.isPrimitive=(function(obj){return((typeof obj=="string")||(typeof obj=="number")||(typeof obj=="boolean"))});sh.isValue=(function(isPrimitive,isUndefinedOrNull){return(function(obj){return(isPrimitive(obj)||isUndefinedOrNull(obj))})})(sh.isPrimitive,sh.isUndefinedOrNull);sh.isObject=(function(obj){return(obj&&((typeof obj=="object")||(typeof obj=="function")))});sh.isNative=(function(isNeitherUndefinedNorNull){return(function(obj){return(isNeitherUndefinedNorNull(obj)&&(typeof obj.constructor=="function"))})})(sh.isNeitherUndefinedNorNull);sh.isAlien=(function(isObject){return(function(obj){return(isObject(obj)&&(typeof obj.constructor!="function"))})})(sh.isObject);sh.isBoolean=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+Boolean\]$/),exposeImplementation);sh.isBooleanValue=(function(obj){return(typeof obj=="boolean")});sh.isBooleanObject=(function(isBoolean){return(function(obj){return(isBoolean(obj)&&(typeof obj!="boolean"))})})(sh.isBoolean);sh.isNumberObject=(function(regXBaseClass,expose){return(function(obj){return(regXBaseClass.test(expose.call(obj))&&(typeof obj!="number"))})})((/^\[object\s+Number\]$/),exposeImplementation);sh.isNumberValue=(function(obj){return(typeof obj=="number")});sh.isNumber=(function(isFinite,isNumberObject){return(function(obj){return(((typeof obj=="number")||isNumberObject(obj))&&isFinite(obj))})})(sh.isFinite,sh.isNumberObject);sh.isString=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+String\]$/),exposeImplementation);sh.isStringValue=(function(obj){return(typeof obj=="string")});sh.isStringObject=(function(isString){return(function(obj){return(isString(obj)&&(typeof obj!="string"))})})(sh.isString);propertyIsEnumerable=(function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=(function(isEnumerable){return(function(obj,key){return isEnumerable.call(obj,key)})})(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=(function(isEnumerable){return(function(obj,key){var isEnum;try{isEnum=isEnumerable.call(obj,key)}catch(exc){isEnum=true}return isEnum})})(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable})();sh.isArray=(((typeof Arr.isArray=="function")&&Arr.isArray)||(Arr.isArray=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+Array\]$/),exposeImplementation)));sh.isArgumentsArray=(((typeof Arr.isArgumentsArray=="function")&&Arr.isArgumentsArray)||(Arr.isArgumentsArray=(function(){var isArguments;if((function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))})()){isArguments=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})(regXBaseClassArguments,exposeImplementation)}else{isArguments=(function(regXBaseClass,expose,isFinite,isEnumerable){return(function(obj){return(regXBaseClass.test(expose.call(obj))&&!!obj&&(typeof obj.length=="number")&&isFinite(obj.length)&&!isEnumerable(obj,"length"))})})(regXBaseClassObject,exposeImplementation,sh.isFinite,propertyIsEnumerable)}return isArguments})()));sh.isListLike=(function(isNeitherUndefinedNorNull){return(function(obj){return(isNeitherUndefinedNorNull(obj)&&(typeof obj.length=="number")&&isFinite(obj.length))})})(sh.isNeitherUndefinedNorNull);sh.isObjectObject=(function(regXBaseClass,expose,isNative){return(function(obj){return(isNative(obj)&&regXBaseClass.test(expose.call(obj)))})})(regXBaseClassObject,exposeImplementation,sh.isNative);sh.isFunction=(function(obj){return((typeof obj=="function")&&(typeof obj.call=="function")&&(typeof obj.apply=="function"))});sh.isCallable=(function(isFunction){var getCallability=(function(mayBeCallee){var isCallable=false;try{mayBeCallee();isCallable=true}catch(err){isCallable=(!(err instanceof TypeError)&&(err.message!="NOT_SUPPORTED_ERR"))}return isCallable}),regXCallable=(/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/);return(function(obj){return(isFunction(obj)||regXCallable.test(""+obj)||getCallability(obj))})})(sh.isFunction);sh.isRegExp=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+RegExp\]$/),exposeImplementation);sh.isDate=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+Date\]$/),exposeImplementation);sh.isError=(function(regXErrorClass,expose){return(function(obj){return regXErrorClass.test(expose.call(obj))})})((/^\[object\s+Error\]$/),exposeImplementation);sh.isGenericError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="Error"))))})})((/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/),exposeErrorImplementation,sh.isError);sh.isEvalError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="EvalError"))))})})((/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/),exposeErrorImplementation,sh.isError);sh.isRangeError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="RangeError"))))})})((/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/),exposeErrorImplementation,sh.isError);sh.isReferenceError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="ReferenceError"))))})})((/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/),exposeErrorImplementation,sh.isError);sh.isSyntaxError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="SyntaxError"))))})})((/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/),exposeErrorImplementation,sh.isError);sh.isTypeError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="TypeError"))))})})((/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/),exposeErrorImplementation,sh.isError);sh.isURIError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="URIError"))))})})((/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/),exposeErrorImplementation,sh.isError);ObjProto.getBaseName=(function(regXBaseClass,expose,global){return(function(delegatee){var str;if(this===global){if(typeof delegatee=="undefined"){str="UndefinedType"}else if(!delegatee&&(typeof delegatee=="object")){str="NullType"}else{str=regXBaseClass.exec(expose.call(delegatee))[1]}}else{str=regXBaseClass.exec(expose.call(this))[1]}return str})})(regXClassName,exposeImplementation,sh);Obj.getBaseName=(function(getBaseName,global){return(function(obj){return getBaseName.call(global,obj)})})(ObjProto.getBaseName,sh);ObjProto.getBase=(function(regXBaseClass,expose,isUndefinedOrNull,global){return(function(delegatee){var Base;if(this===global){if(isUndefinedOrNull(delegatee)){Base=delegatee}else{Base=global[regXBaseClass.exec(expose.call(delegatee))[1]]}}else{Base=global[regXBaseClass.exec(expose.call(this))[1]]}return Base})})(regXClassName,exposeImplementation,sh.isUndefinedOrNull,sh);Obj.getBase=(function(getBase,global){return(function(obj){return getBase.call(global,obj)})})(ObjProto.getBase,sh);exposeErrorImplementation=exposeImplementation=propertyIsEnumerable=null;regXBaseClassArguments=regXBaseClassObject=regXClassName=null;ObjProto=Obj=Arr=sh=null;delete exposeErrorImplementation;delete exposeImplementation;delete propertyIsEnumerable;delete regXBaseClassArguments;delete regXBaseClassObject;delete regXClassName;delete ObjProto;delete Obj;delete Arr;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 7.252 byte : (additionally featuring [getBase ...] functionality)
(function(){var g=this,Arr=g.Array,Obj=g.Object,ObjProto=Obj.prototype,regXClassName=(/^\[object\s+(.*)\]$/),regXBaseClassObject=(/^\[object\s+Object\]$/),regXBaseClassArguments=(/^\[object\s+Arguments\]$/),propertyIsEnumerable,exposeImplementation=ObjProto.toString,exposeErrorImplementation=g.Error.prototype.toString;g.isUndefined=(function(a){return(typeof a=="undefined")});g.isDefined=(function(a){return(typeof a!="undefined")});g.isNull=(function(a){return(!a&&(typeof a=="object"))});g.isNotNull=(function(a){return(a||(typeof a!="object"))});g.isUndefinedOrNull=(function(a){return(!a&&((typeof a=="undefined")||(typeof a=="object")))});g.isNeitherUndefinedNorNull=(function(a){return(a||((typeof a!="undefined")&&(typeof a!="object")))});g.isPrimitive=(function(a){return((typeof a=="string")||(typeof a=="number")||(typeof a=="boolean"))});g.isValue=(function(b,c){return(function(a){return(b(a)||c(a))})})(g.isPrimitive,g.isUndefinedOrNull);g.isObject=(function(a){return(a&&((typeof a=="object")||(typeof a=="function")))});g.isNative=(function(b){return(function(a){return(b(a)&&(typeof a.constructor=="function"))})})(g.isNeitherUndefinedNorNull);g.isAlien=(function(b){return(function(a){return(b(a)&&(typeof a.constructor!="function"))})})(g.isObject);g.isBoolean=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+Boolean\]$/),exposeImplementation);g.isBooleanValue=(function(a){return(typeof a=="boolean")});g.isBooleanObject=(function(b){return(function(a){return(b(a)&&(typeof a!="boolean"))})})(g.isBoolean);g.isNumberObject=(function(b,c){return(function(a){return(b.test(c.call(a))&&(typeof a!="number"))})})((/^\[object\s+Number\]$/),exposeImplementation);g.isNumberValue=(function(a){return(typeof a=="number")});g.isNumber=(function(b,c){return(function(a){return(((typeof a=="number")||c(a))&&b(a))})})(g.isFinite,g.isNumberObject);g.isString=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+String\]$/),exposeImplementation);g.isStringValue=(function(a){return(typeof a=="string")});g.isStringObject=(function(b){return(function(a){return(b(a)&&(typeof a!="string"))})})(g.isString);propertyIsEnumerable=(function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=(function(c){return(function(a,b){return c.call(a,b)})})(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=(function(d){return(function(a,b){var c;try{c=d.call(a,b)}catch(exc){c=true}return c})})(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable})();g.isArray=(((typeof Arr.isArray=="function")&&Arr.isArray)||(Arr.isArray=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+Array\]$/),exposeImplementation)));g.isArgumentsArray=(((typeof Arr.isArgumentsArray=="function")&&Arr.isArgumentsArray)||(Arr.isArgumentsArray=(function(){var f;if((function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))})()){f=(function(b,c){return(function(a){return b.test(c.call(a))})})(regXBaseClassArguments,exposeImplementation)}else{f=(function(b,c,d,e){return(function(a){return(b.test(c.call(a))&&!!a&&(typeof a.length=="number")&&d(a.length)&&!e(a,"length"))})})(regXBaseClassObject,exposeImplementation,g.isFinite,propertyIsEnumerable)}return f})()));g.isListLike=(function(b){return(function(a){return(b(a)&&(typeof a.length=="number")&&isFinite(a.length))})})(g.isNeitherUndefinedNorNull);g.isObjectObject=(function(b,c,d){return(function(a){return(d(a)&&b.test(c.call(a)))})})(regXBaseClassObject,exposeImplementation,g.isNative);g.isFunction=(function(a){return((typeof a=="function")&&(typeof a.call=="function")&&(typeof a.apply=="function"))});g.isCallable=(function(c){var d=(function(a){var b=false;try{a();b=true}catch(err){b=(!(err instanceof TypeError)&&(err.message!="NOT_SUPPORTED_ERR"))}return b}),regXCallable=(/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/);return(function(a){return(c(a)||regXCallable.test(""+a)||d(a))})})(g.isFunction);g.isRegExp=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+RegExp\]$/),exposeImplementation);g.isDate=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+Date\]$/),exposeImplementation);g.isError=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+Error\]$/),exposeImplementation);g.isGenericError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="Error"))))})})((/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/),exposeErrorImplementation,g.isError);g.isEvalError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="EvalError"))))})})((/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/),exposeErrorImplementation,g.isError);g.isRangeError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="RangeError"))))})})((/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/),exposeErrorImplementation,g.isError);g.isReferenceError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="ReferenceError"))))})})((/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/),exposeErrorImplementation,g.isError);g.isSyntaxError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="SyntaxError"))))})})((/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/),exposeErrorImplementation,g.isError);g.isTypeError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="TypeError"))))})})((/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/),exposeErrorImplementation,g.isError);g.isURIError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="URIError"))))})})((/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/),exposeErrorImplementation,g.isError);ObjProto.getBaseName=(function(c,d,e){return(function(a){var b;if(this===e){if(typeof a=="undefined"){b="UndefinedType"}else if(!a&&(typeof a=="object")){b="NullType"}else{b=c.exec(d.call(a))[1]}}else{b=c.exec(d.call(this))[1]}return b})})(regXClassName,exposeImplementation,g);Obj.getBaseName=(function(b,c){return(function(a){return b.call(c,a)})})(ObjProto.getBaseName,g);ObjProto.getBase=(function(c,d,e,f){return(function(a){var b;if(this===f){if(e(a)){b=a}else{b=f[c.exec(d.call(a))[1]]}}else{b=f[c.exec(d.call(this))[1]]}return b})})(regXClassName,exposeImplementation,g.isUndefinedOrNull,g);Obj.getBase=(function(b,c){return(function(a){return b.call(c,a)})})(ObjProto.getBase,g);exposeErrorImplementation=exposeImplementation=propertyIsEnumerable=null;regXBaseClassArguments=regXBaseClassObject=regXClassName=null;ObjProto=Obj=Arr=g=null;delete exposeErrorImplementation;delete exposeImplementation;delete propertyIsEnumerable;delete regXBaseClassArguments;delete regXBaseClassObject;delete regXClassName;delete ObjProto;delete Obj;delete Arr;delete g;delete arguments.callee}).call(null);

- packed / shrinked / encoded - 4.600 byte : (additionally featuring [getBase ...] functionality)
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(){n g=G,l=g.Z,v=g.16,h=v.17,B=(/^\\[8\\s+(.*)\\]$/),D=(/^\\[8\\s+16\\]$/),C=(/^\\[8\\s+1f\\]$/),9,7=h.13,k=g.o.17.13;g.1i=(0(a){2(3 a=="A")});g.1F=(0(a){2(3 a!="A")});g.1G=(0(a){2(!a&&(3 a=="8"))});g.1J=(0(a){2(a||(3 a!="8"))});g.K=(0(a){2(!a&&((3 a=="A")||(3 a=="8")))});g.R=(0(a){2(a||((3 a!="A")&&(3 a!="8")))});g.14=(0(a){2((3 a=="j")||(3 a=="u")||(3 a=="N"))});g.1K=(0(b,c){2(0(a){2(b(a)||c(a))})})(g.14,g.K);g.11=(0(a){2(a&&((3 a=="8")||(3 a=="0")))});g.12=(0(b){2(0(a){2(b(a)&&(3 a.U=="0"))})})(g.R);g.1H=(0(b){2(0(a){2(b(a)&&(3 a.U!="0"))})})(g.11);g.X=(0(b,c){2(0(a){2 b.6(c.4(a))})})((/^\\[8\\s+1E\\]$/),7);g.1B=(0(a){2(3 a=="N")});g.1A=(0(b){2(0(a){2(b(a)&&(3 a!="N"))})})(g.X);g.W=(0(b,c){2(0(a){2(b.6(c.4(a))&&(3 a!="u"))})})((/^\\[8\\s+1x\\]$/),7);g.1v=(0(a){2(3 a=="u")});g.1t=(0(b,c){2(0(a){2(((3 a=="u")||c(a))&&b(a))})})(g.O,g.W);g.V=(0(b,c){2(0(a){2 b.6(c.4(a))})})((/^\\[8\\s+1r\\]$/),7);g.1p=(0(a){2(3 a=="j")});g.1n=(0(b){2(0(a){2(b(a)&&(3 a!="j"))})})(g.V);9=(0(){n 9;S{h.9.4(E,"r");9=(0(c){2(0(a,b){2 c.4(a,b)})})(h.9)}M(Y){9=(0(d){2(0(a,b){n c;S{c=d.4(a,b)}M(Y){c=10}2 c})})(h.9)}2 9})();g.J=(((3 l.J=="0")&&l.J)||(l.J=(0(b,c){2(0(a){2 b.6(c.4(a))})})((/^\\[8\\s+Z\\]$/),7)));g.H=(((3 l.H=="0")&&l.H)||(l.H=(0(){n f;t((0(){2 C.6(7.4(15))})()){f=(0(b,c){2(0(a){2 b.6(c.4(a))})})(C,7)}p{f=(0(b,c,d,e){2(0(a){2(b.6(c.4(a))&&!!a&&(3 a.r=="u")&&d(a.r)&&!e(a,"r"))})})(D,7,g.O,9)}2 f})()));g.1d=(0(b){2(0(a){2(b(a)&&(3 a.r=="u")&&O(a.r))})})(g.R);g.1o=(0(b,c,d){2(0(a){2(d(a)&&b.6(c.4(a)))})})(D,7,g.12);g.18=(0(a){2((3 a=="0")&&(3 a.4=="0")&&(3 a.1a=="0"))});g.1b=(0(c){n d=(0(a){n b=1c;S{a();b=10}M(Q){b=(!(Q 1e q)&&(Q.1g!="1h"))}2 b}),T=(/0\\s+[^(]+\\([^)]*\\)\\s*\\{[^}]*\\}/);2(0(a){2(c(a)||T.6(""+a)||d(a))})})(g.18);g.1j=(0(b,c){2(0(a){2 b.6(c.4(a))})})((/^\\[8\\s+1k\\]$/),7);g.1l=(0(b,c){2(0(a){2 b.6(c.4(a))})})((/^\\[8\\s+1m\\]$/),7);g.m=(0(b,c){2(0(a){2 b.6(c.4(a))})})((/^\\[8\\s+o\\]$/),7);g.19=(0(b,c,d){2(0(a){2(d(a)&&(b.6(c.4(a))||((3 a.5=="j")&&(a.5=="o"))))})})((/(?:^o:)|(?:^o$)|(?:\\[o:\\s*5\\:\\s*o)/),k,g.m);g.1q=(0(b,c,d){2(0(a){2(d(a)&&(b.6(c.4(a))||((3 a.5=="j")&&(a.5=="z"))))})})((/(?:^z:)|(?:^z$)|(?:\\[z:\\s*5\\:\\s*z)/),k,g.m);g.1s=(0(b,c,d){2(0(a){2(d(a)&&(b.6(c.4(a))||((3 a.5=="j")&&(a.5=="F"))))})})((/(?:^F:)|(?:^F$)|(?:\\[F:\\s*5\\:\\s*F)/),k,g.m);g.1u=(0(b,c,d){2(0(a){2(d(a)&&(b.6(c.4(a))||((3 a.5=="j")&&(a.5=="y"))))})})((/(?:^y:)|(?:^y$)|(?:\\[y:\\s*5\\:\\s*y)/),k,g.m);g.1w=(0(b,c,d){2(0(a){2(d(a)&&(b.6(c.4(a))||((3 a.5=="j")&&(a.5=="x"))))})})((/(?:^x:)|(?:^x$)|(?:\\[x:\\s*5\\:\\s*x)/),k,g.m);g.1y=(0(b,c,d){2(0(a){2(d(a)&&(b.6(c.4(a))||((3 a.5=="j")&&(a.5=="q"))))})})((/(?:^q:)|(?:^q$)|(?:\\[q:\\s*5\\:\\s*q)/),k,g.m);g.1z=(0(b,c,d){2(0(a){2(d(a)&&(b.6(c.4(a))||((3 a.5=="j")&&(a.5=="w"))))})})((/(?:^w:)|(?:^w$)|(?:\\[w:\\s*5\\:\\s*w)/),k,g.m);h.P=(0(c,d,e){2(0(a){n b;t(G===e){t(3 a=="A"){b="1C"}p t(!a&&(3 a=="8")){b="1D"}p{b=c.I(d.4(a))[1]}}p{b=c.I(d.4(G))[1]}2 b})})(B,7,g);v.P=(0(b,c){2(0(a){2 b.4(c,a)})})(h.P,g);h.L=(0(c,d,e,f){2(0(a){n b;t(G===f){t(e(a)){b=a}p{b=f[c.I(d.4(a))[1]]}}p{b=f[c.I(d.4(G))[1]]}2 b})})(B,7,g.K,g);v.L=(0(b,c){2(0(a){2 b.4(c,a)})})(h.L,g);k=7=9=E;C=D=B=E;h=v=l=g=E;i k;i 7;i 9;i C;i D;i B;i h;i v;i l;i g;i 15.1I}).4(E);',62,109,'function||return|typeof|call|name|test|exposeImplementation|object|propertyIsEnumerable||||||||ObjProto|delete|string|exposeErrorImplementation|Arr|isError|var|Error|else|TypeError|length||if|number|Obj|URIError|SyntaxError|ReferenceError|EvalError|undefined|regXClassName|regXBaseClassArguments|regXBaseClassObject|null|RangeError|this|isArgumentsArray|exec|isArray|isUndefinedOrNull|getBase|catch|boolean|isFinite|getBaseName|err|isNeitherUndefinedNorNull|try|regXCallable|constructor|isString|isNumberObject|isBoolean|exc|Array|true|isObject|isNative|toString|isPrimitive|arguments|Object|prototype|isFunction|isGenericError|apply|isCallable|false|isListLike|instanceof|Arguments|message|NOT_SUPPORTED_ERR|isUndefined|isRegExp|RegExp|isDate|Date|isStringObject|isObjectObject|isStringValue|isEvalError|String|isRangeError|isNumber|isReferenceError|isNumberValue|isSyntaxError|Number|isTypeError|isURIError|isBooleanObject|isBooleanValue|UndefinedType|NullType|Boolean|isDefined|isNull|isAlien|callee|isNotNull|isValue'.split('|'),0,{}));



- packed                      - 7.966 byte : (does not include [getBase ...] functionality)
(function(){var sh=this,Arr=sh.Array,Obj=sh.Object,ObjProto=Obj.prototype,regXBaseClassObject=(/^\[object\s+Object\]$/),regXBaseClassArguments=(/^\[object\s+Arguments\]$/),propertyIsEnumerable,exposeImplementation=ObjProto.toString,exposeErrorImplementation=sh.Error.prototype.toString;sh.isUndefined=(function(obj){return(typeof obj=="undefined")});sh.isDefined=(function(obj){return(typeof obj!="undefined")});sh.isNull=(function(obj){return(!obj&&(typeof obj=="object"))});sh.isNotNull=(function(obj){return(obj||(typeof obj!="object"))});sh.isUndefinedOrNull=(function(obj){return(!obj&&((typeof obj=="undefined")||(typeof obj=="object")))});sh.isNeitherUndefinedNorNull=(function(obj){return(obj||((typeof obj!="undefined")&&(typeof obj!="object")))});sh.isPrimitive=(function(obj){return((typeof obj=="string")||(typeof obj=="number")||(typeof obj=="boolean"))});sh.isValue=(function(isPrimitive,isUndefinedOrNull){return(function(obj){return(isPrimitive(obj)||isUndefinedOrNull(obj))})})(sh.isPrimitive,sh.isUndefinedOrNull);sh.isObject=(function(obj){return(obj&&((typeof obj=="object")||(typeof obj=="function")))});sh.isNative=(function(isNeitherUndefinedNorNull){return(function(obj){return(isNeitherUndefinedNorNull(obj)&&(typeof obj.constructor=="function"))})})(sh.isNeitherUndefinedNorNull);sh.isAlien=(function(isObject){return(function(obj){return(isObject(obj)&&(typeof obj.constructor!="function"))})})(sh.isObject);sh.isBoolean=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+Boolean\]$/),exposeImplementation);sh.isBooleanValue=(function(obj){return(typeof obj=="boolean")});sh.isBooleanObject=(function(isBoolean){return(function(obj){return(isBoolean(obj)&&(typeof obj!="boolean"))})})(sh.isBoolean);sh.isNumberObject=(function(regXBaseClass,expose){return(function(obj){return(regXBaseClass.test(expose.call(obj))&&(typeof obj!="number"))})})((/^\[object\s+Number\]$/),exposeImplementation);sh.isNumberValue=(function(obj){return(typeof obj=="number")});sh.isNumber=(function(isFinite,isNumberObject){return(function(obj){return(((typeof obj=="number")||isNumberObject(obj))&&isFinite(obj))})})(sh.isFinite,sh.isNumberObject);sh.isString=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+String\]$/),exposeImplementation);sh.isStringValue=(function(obj){return(typeof obj=="string")});sh.isStringObject=(function(isString){return(function(obj){return(isString(obj)&&(typeof obj!="string"))})})(sh.isString);propertyIsEnumerable=(function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=(function(isEnumerable){return(function(obj,key){return isEnumerable.call(obj,key)})})(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=(function(isEnumerable){return(function(obj,key){var isEnum;try{isEnum=isEnumerable.call(obj,key)}catch(exc){isEnum=true}return isEnum})})(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable})();sh.isArray=(((typeof Arr.isArray=="function")&&Arr.isArray)||(Arr.isArray=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+Array\]$/),exposeImplementation)));sh.isArgumentsArray=(((typeof Arr.isArgumentsArray=="function")&&Arr.isArgumentsArray)||(Arr.isArgumentsArray=(function(){var isArguments;if((function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))})()){isArguments=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})(regXBaseClassArguments,exposeImplementation)}else{isArguments=(function(regXBaseClass,expose,isFinite,isEnumerable){return(function(obj){return(regXBaseClass.test(expose.call(obj))&&!!obj&&(typeof obj.length=="number")&&isFinite(obj.length)&&!isEnumerable(obj,"length"))})})(regXBaseClassObject,exposeImplementation,sh.isFinite,propertyIsEnumerable)}return isArguments})()));sh.isListLike=(function(isNeitherUndefinedNorNull){return(function(obj){return(isNeitherUndefinedNorNull(obj)&&(typeof obj.length=="number")&&isFinite(obj.length))})})(sh.isNeitherUndefinedNorNull);sh.isObjectObject=(function(regXBaseClass,expose,isNative){return(function(obj){return(isNative(obj)&&regXBaseClass.test(expose.call(obj)))})})(regXBaseClassObject,exposeImplementation,sh.isNative);sh.isFunction=(function(obj){return((typeof obj=="function")&&(typeof obj.call=="function")&&(typeof obj.apply=="function"))});sh.isCallable=(function(isFunction){var getCallability=(function(mayBeCallee){var isCallable=false;try{mayBeCallee();isCallable=true}catch(err){isCallable=(!(err instanceof TypeError)&&(err.message!="NOT_SUPPORTED_ERR"))}return isCallable}),regXCallable=(/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/);return(function(obj){return(isFunction(obj)||regXCallable.test(""+obj)||getCallability(obj))})})(sh.isFunction);sh.isRegExp=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+RegExp\]$/),exposeImplementation);sh.isDate=(function(regXBaseClass,expose){return(function(obj){return regXBaseClass.test(expose.call(obj))})})((/^\[object\s+Date\]$/),exposeImplementation);sh.isError=(function(regXErrorClass,expose){return(function(obj){return regXErrorClass.test(expose.call(obj))})})((/^\[object\s+Error\]$/),exposeImplementation);sh.isGenericError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="Error"))))})})((/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/),exposeErrorImplementation,sh.isError);sh.isEvalError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="EvalError"))))})})((/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/),exposeErrorImplementation,sh.isError);sh.isRangeError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="RangeError"))))})})((/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/),exposeErrorImplementation,sh.isError);sh.isReferenceError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="ReferenceError"))))})})((/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/),exposeErrorImplementation,sh.isError);sh.isSyntaxError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="SyntaxError"))))})})((/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/),exposeErrorImplementation,sh.isError);sh.isTypeError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="TypeError"))))})})((/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/),exposeErrorImplementation,sh.isError);sh.isURIError=(function(regXErrorType,expose,isError){return(function(obj){return(isError(obj)&&(regXErrorType.test(expose.call(obj))||((typeof obj.name=="string")&&(obj.name=="URIError"))))})})((/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/),exposeErrorImplementation,sh.isError);exposeErrorImplementation=exposeImplementation=propertyIsEnumerable=null;regXBaseClassArguments=regXBaseClassObject=null;ObjProto=Obj=Arr=sh=null;delete exposeErrorImplementation;delete exposeImplementation;delete propertyIsEnumerable;delete regXBaseClassArguments;delete regXBaseClassObject;delete ObjProto;delete Obj;delete Arr;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 6.491 byte : (does not include [getBase ...] functionality)
(function(){var g=this,Arr=g.Array,Obj=g.Object,ObjProto=Obj.prototype,regXBaseClassObject=(/^\[object\s+Object\]$/),regXBaseClassArguments=(/^\[object\s+Arguments\]$/),propertyIsEnumerable,exposeImplementation=ObjProto.toString,exposeErrorImplementation=g.Error.prototype.toString;g.isUndefined=(function(a){return(typeof a=="undefined")});g.isDefined=(function(a){return(typeof a!="undefined")});g.isNull=(function(a){return(!a&&(typeof a=="object"))});g.isNotNull=(function(a){return(a||(typeof a!="object"))});g.isUndefinedOrNull=(function(a){return(!a&&((typeof a=="undefined")||(typeof a=="object")))});g.isNeitherUndefinedNorNull=(function(a){return(a||((typeof a!="undefined")&&(typeof a!="object")))});g.isPrimitive=(function(a){return((typeof a=="string")||(typeof a=="number")||(typeof a=="boolean"))});g.isValue=(function(b,c){return(function(a){return(b(a)||c(a))})})(g.isPrimitive,g.isUndefinedOrNull);g.isObject=(function(a){return(a&&((typeof a=="object")||(typeof a=="function")))});g.isNative=(function(b){return(function(a){return(b(a)&&(typeof a.constructor=="function"))})})(g.isNeitherUndefinedNorNull);g.isAlien=(function(b){return(function(a){return(b(a)&&(typeof a.constructor!="function"))})})(g.isObject);g.isBoolean=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+Boolean\]$/),exposeImplementation);g.isBooleanValue=(function(a){return(typeof a=="boolean")});g.isBooleanObject=(function(b){return(function(a){return(b(a)&&(typeof a!="boolean"))})})(g.isBoolean);g.isNumberObject=(function(b,c){return(function(a){return(b.test(c.call(a))&&(typeof a!="number"))})})((/^\[object\s+Number\]$/),exposeImplementation);g.isNumberValue=(function(a){return(typeof a=="number")});g.isNumber=(function(b,c){return(function(a){return(((typeof a=="number")||c(a))&&b(a))})})(g.isFinite,g.isNumberObject);g.isString=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+String\]$/),exposeImplementation);g.isStringValue=(function(a){return(typeof a=="string")});g.isStringObject=(function(b){return(function(a){return(b(a)&&(typeof a!="string"))})})(g.isString);propertyIsEnumerable=(function(){var propertyIsEnumerable;try{ObjProto.propertyIsEnumerable.call(null,"length");propertyIsEnumerable=(function(c){return(function(a,b){return c.call(a,b)})})(ObjProto.propertyIsEnumerable)}catch(exc){propertyIsEnumerable=(function(d){return(function(a,b){var c;try{c=d.call(a,b)}catch(exc){c=true}return c})})(ObjProto.propertyIsEnumerable)}return propertyIsEnumerable})();g.isArray=(((typeof Arr.isArray=="function")&&Arr.isArray)||(Arr.isArray=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+Array\]$/),exposeImplementation)));g.isArgumentsArray=(((typeof Arr.isArgumentsArray=="function")&&Arr.isArgumentsArray)||(Arr.isArgumentsArray=(function(){var f;if((function(){return regXBaseClassArguments.test(exposeImplementation.call(arguments))})()){f=(function(b,c){return(function(a){return b.test(c.call(a))})})(regXBaseClassArguments,exposeImplementation)}else{f=(function(b,c,d,e){return(function(a){return(b.test(c.call(a))&&!!a&&(typeof a.length=="number")&&d(a.length)&&!e(a,"length"))})})(regXBaseClassObject,exposeImplementation,g.isFinite,propertyIsEnumerable)}return f})()));g.isListLike=(function(b){return(function(a){return(b(a)&&(typeof a.length=="number")&&isFinite(a.length))})})(g.isNeitherUndefinedNorNull);g.isObjectObject=(function(b,c,d){return(function(a){return(d(a)&&b.test(c.call(a)))})})(regXBaseClassObject,exposeImplementation,g.isNative);g.isFunction=(function(a){return((typeof a=="function")&&(typeof a.call=="function")&&(typeof a.apply=="function"))});g.isCallable=(function(c){var d=(function(a){var b=false;try{a();b=true}catch(err){b=(!(err instanceof TypeError)&&(err.message!="NOT_SUPPORTED_ERR"))}return b}),regXCallable=(/function\s+[^(]+\([^)]*\)\s*\{[^}]*\}/);return(function(a){return(c(a)||regXCallable.test(""+a)||d(a))})})(g.isFunction);g.isRegExp=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+RegExp\]$/),exposeImplementation);g.isDate=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+Date\]$/),exposeImplementation);g.isError=(function(b,c){return(function(a){return b.test(c.call(a))})})((/^\[object\s+Error\]$/),exposeImplementation);g.isGenericError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="Error"))))})})((/(?:^Error:)|(?:^Error$)|(?:\[Error:\s*name\:\s*Error)/),exposeErrorImplementation,g.isError);g.isEvalError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="EvalError"))))})})((/(?:^EvalError:)|(?:^EvalError$)|(?:\[EvalError:\s*name\:\s*EvalError)/),exposeErrorImplementation,g.isError);g.isRangeError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="RangeError"))))})})((/(?:^RangeError:)|(?:^RangeError$)|(?:\[RangeError:\s*name\:\s*RangeError)/),exposeErrorImplementation,g.isError);g.isReferenceError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="ReferenceError"))))})})((/(?:^ReferenceError:)|(?:^ReferenceError$)|(?:\[ReferenceError:\s*name\:\s*ReferenceError)/),exposeErrorImplementation,g.isError);g.isSyntaxError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="SyntaxError"))))})})((/(?:^SyntaxError:)|(?:^SyntaxError$)|(?:\[SyntaxError:\s*name\:\s*SyntaxError)/),exposeErrorImplementation,g.isError);g.isTypeError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="TypeError"))))})})((/(?:^TypeError:)|(?:^TypeError$)|(?:\[TypeError:\s*name\:\s*TypeError)/),exposeErrorImplementation,g.isError);g.isURIError=(function(b,c,d){return(function(a){return(d(a)&&(b.test(c.call(a))||((typeof a.name=="string")&&(a.name=="URIError"))))})})((/(?:^URIError:)|(?:^URIError$)|(?:\[URIError:\s*name\:\s*URIError)/),exposeErrorImplementation,g.isError);exposeErrorImplementation=exposeImplementation=propertyIsEnumerable=null;regXBaseClassArguments=regXBaseClassObject=null;ObjProto=Obj=Arr=g=null;delete exposeErrorImplementation;delete exposeImplementation;delete propertyIsEnumerable;delete regXBaseClassArguments;delete regXBaseClassObject;delete ObjProto;delete Obj;delete Arr;delete g;delete arguments.callee}).call(null);

- packed / shrinked / encoded - 4.166 byte : (does not include [getBase ...] functionality)
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(){q g=1C,j=g.N,B=g.W,l=B.Y,t=(/^\\[7\\s+W\\]$/),y=(/^\\[7\\s+1u\\]$/),8,6=l.K,i=g.m.Y.K;g.1q=(0(a){1(2 a=="D")});g.1o=(0(a){1(2 a!="D")});g.1m=(0(a){1(!a&&(2 a=="7"))});g.1e=(0(a){1(a||(2 a!="7"))});g.S=(0(a){1(!a&&((2 a=="D")||(2 a=="7")))});g.F=(0(a){1(a||((2 a!="D")&&(2 a!="7")))});g.10=(0(a){1((2 a=="9")||(2 a=="o")||(2 a=="G"))});g.1n=(0(b,c){1(0(a){1(b(a)||c(a))})})(g.10,g.S);g.U=(0(a){1(a&&((2 a=="7")||(2 a=="0")))});g.V=(0(b){1(0(a){1(b(a)&&(2 a.T=="0"))})})(g.F);g.1A=(0(b){1(0(a){1(b(a)&&(2 a.T!="0"))})})(g.U);g.P=(0(b,c){1(0(a){1 b.5(c.3(a))})})((/^\\[7\\s+1D\\]$/),6);g.1z=(0(a){1(2 a=="G")});g.1w=(0(b){1(0(a){1(b(a)&&(2 a!="G"))})})(g.P);g.L=(0(b,c){1(0(a){1(b.5(c.3(a))&&(2 a!="o"))})})((/^\\[7\\s+1s\\]$/),6);g.1h=(0(a){1(2 a=="o")});g.1c=(0(b,c){1(0(a){1(((2 a=="o")||c(a))&&b(a))})})(g.E,g.L);g.Q=(0(b,c){1(0(a){1 b.5(c.3(a))})})((/^\\[7\\s+18\\]$/),6);g.15=(0(a){1(2 a=="9")});g.13=(0(b){1(0(a){1(b(a)&&(2 a!="9"))})})(g.Q);8=(0(){q 8;I{l.8.3(w,"p");8=(0(c){1(0(a,b){1 c.3(a,b)})})(l.8)}H(X){8=(0(d){1(0(a,b){q c;I{c=d.3(a,b)}H(X){c=Z}1 c})})(l.8)}1 8})();g.A=(((2 j.A=="0")&&j.A)||(j.A=(0(b,c){1(0(a){1 b.5(c.3(a))})})((/^\\[7\\s+N\\]$/),6)));g.C=(((2 j.C=="0")&&j.C)||(j.C=(0(){q f;12((0(){1 y.5(6.3(R))})()){f=(0(b,c){1(0(a){1 b.5(c.3(a))})})(y,6)}14{f=(0(b,c,d,e){1(0(a){1(b.5(c.3(a))&&!!a&&(2 a.p=="o")&&d(a.p)&&!e(a,"p"))})})(t,6,g.E,8)}1 f})()));g.16=(0(b){1(0(a){1(b(a)&&(2 a.p=="o")&&E(a.p))})})(g.F);g.17=(0(b,c,d){1(0(a){1(d(a)&&b.5(c.3(a)))})})(t,6,g.V);g.O=(0(a){1((2 a=="0")&&(2 a.3=="0")&&(2 a.19=="0"))});g.1a=(0(c){q d=(0(a){q b=1b;I{a();b=Z}H(J){b=(!(J 1d n)&&(J.1f!="1g"))}1 b}),M=(/0\\s+[^(]+\\([^)]*\\)\\s*\\{[^}]*\\}/);1(0(a){1(c(a)||M.5(""+a)||d(a))})})(g.O);g.1i=(0(b,c){1(0(a){1 b.5(c.3(a))})})((/^\\[7\\s+1j\\]$/),6);g.1k=(0(b,c){1(0(a){1 b.5(c.3(a))})})((/^\\[7\\s+1l\\]$/),6);g.k=(0(b,c){1(0(a){1 b.5(c.3(a))})})((/^\\[7\\s+m\\]$/),6);g.11=(0(b,c,d){1(0(a){1(d(a)&&(b.5(c.3(a))||((2 a.4=="9")&&(a.4=="m"))))})})((/(?:^m:)|(?:^m$)|(?:\\[m:\\s*4\\:\\s*m)/),i,g.k);g.1p=(0(b,c,d){1(0(a){1(d(a)&&(b.5(c.3(a))||((2 a.4=="9")&&(a.4=="z"))))})})((/(?:^z:)|(?:^z$)|(?:\\[z:\\s*4\\:\\s*z)/),i,g.k);g.1r=(0(b,c,d){1(0(a){1(d(a)&&(b.5(c.3(a))||((2 a.4=="9")&&(a.4=="r"))))})})((/(?:^r:)|(?:^r$)|(?:\\[r:\\s*4\\:\\s*r)/),i,g.k);g.1t=(0(b,c,d){1(0(a){1(d(a)&&(b.5(c.3(a))||((2 a.4=="9")&&(a.4=="x"))))})})((/(?:^x:)|(?:^x$)|(?:\\[x:\\s*4\\:\\s*x)/),i,g.k);g.1v=(0(b,c,d){1(0(a){1(d(a)&&(b.5(c.3(a))||((2 a.4=="9")&&(a.4=="u"))))})})((/(?:^u:)|(?:^u$)|(?:\\[u:\\s*4\\:\\s*u)/),i,g.k);g.1x=(0(b,c,d){1(0(a){1(d(a)&&(b.5(c.3(a))||((2 a.4=="9")&&(a.4=="n"))))})})((/(?:^n:)|(?:^n$)|(?:\\[n:\\s*4\\:\\s*n)/),i,g.k);g.1y=(0(b,c,d){1(0(a){1(d(a)&&(b.5(c.3(a))||((2 a.4=="9")&&(a.4=="v"))))})})((/(?:^v:)|(?:^v$)|(?:\\[v:\\s*4\\:\\s*v)/),i,g.k);i=6=8=w;y=t=w;l=B=j=g=w;h i;h 6;h 8;h y;h t;h l;h B;h j;h g;h R.1B}).3(w);',62,102,'function|return|typeof|call|name|test|exposeImplementation|object|propertyIsEnumerable|string||||||||delete|exposeErrorImplementation|Arr|isError|ObjProto|Error|TypeError|number|length|var|RangeError||regXBaseClassObject|SyntaxError|URIError|null|ReferenceError|regXBaseClassArguments|EvalError|isArray|Obj|isArgumentsArray|undefined|isFinite|isNeitherUndefinedNorNull|boolean|catch|try|err|toString|isNumberObject|regXCallable|Array|isFunction|isBoolean|isString|arguments|isUndefinedOrNull|constructor|isObject|isNative|Object|exc|prototype|true|isPrimitive|isGenericError|if|isStringObject|else|isStringValue|isListLike|isObjectObject|String|apply|isCallable|false|isNumber|instanceof|isNotNull|message|NOT_SUPPORTED_ERR|isNumberValue|isRegExp|RegExp|isDate|Date|isNull|isValue|isDefined|isEvalError|isUndefined|isRangeError|Number|isReferenceError|Arguments|isSyntaxError|isBooleanObject|isTypeError|isURIError|isBooleanValue|isAlien|callee|this|Boolean'.split('|'),0,{}));


*/ /*


- Combined (closure + packer) - 4.096 byte : (additionally featuring [getBase ...] functionality)
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(){y c=B,j=c.W,k=c.11,h=k.V,l=/^\\[7\\s+(.*)\\]$/,m=/^\\[7\\s+11\\]$/,n=/^\\[7\\s+1C\\]$/,o,g=h.X,i=c.t.V.X;c.1v=0(a){2 3 a=="x"};c.17=0(a){2 3 a!="x"};c.1r=0(a){2!a&&3 a=="7"};c.1p=0(a){2 a||3 a!="7"};c.J=0(a){2!a&&(3 a=="x"||3 a=="7")};c.P=0(a){2 a||3 a!="x"&&3 a!="7"};c.U=0(a){2 3 a=="9"||3 a=="u"||3 a=="M"};c.19=0(a,b){2 0(e){2 a(e)||b(e)}}(c.U,c.J);c.12=0(a){2 a&&(3 a=="7"||3 a=="0")};c.10=0(a){2 0(b){2 a(b)&&3 b.Z=="0"}}(c.P);c.1e=0(a){2 0(b){2 a(b)&&3 b.Z!="0"}}(c.12);c.Y=0(a,b){2 0(e){2 a.6(b.4(e))}}(/^\\[7\\s+1I\\]$/,g);c.1H=0(a){2 3 a=="M"};c.1F=0(a){2 0(b){2 a(b)&&3 b!="M"}}(c.Y);c.T=0(a,b){2 0(e){2 a.6(b.4(e))&&3 e!="u"}}(/^\\[7\\s+1E\\]$/,g);c.1D=0(a){2 3 a=="u"};c.1z=0(a,b){2 0(e){2(3 e=="u"||b(e))&&a(e)}}(c.Q,c.T);c.16=0(a,b){2 0(e){2 a.6(b.4(e))}}(/^\\[7\\s+1y\\]$/,g);c.1n=0(a){2 3 a=="9"};c.1l=0(a){2 0(b){2 a(b)&&3 b!="9"}}(c.16);o=0(){y a;K{h.O.4(L,"v");a=0(e){2 0(d,f){2 e.4(d,f)}}(h.O)}N(b){a=0(e){2 0(d,f){y p;K{p=e.4(d,f)}N(q){p=14}2 p}}(h.O)}2 a}();c.F=3 j.F=="0"&&j.F||(j.F=0(a,b){2 0(e){2 a.6(b.4(e))}}(/^\\[7\\s+W\\]$/,g));c.H=3 j.H=="0"&&j.H||(j.H=0(){2 0(){2 n.6(g.4(15))}()?0(a,b){2 0(e){2 a.6(b.4(e))}}(n,g):0(a,b,e,d){2 0(f){2 a.6(b.4(f))&&!!f&&3 f.v=="u"&&e(f.v)&&!d(f,"v")}}(m,g,c.Q,o)}());c.1t=0(a){2 0(b){2 a(b)&&3 b.v=="u"&&Q(b.v)}}(c.P);c.18=0(a,b,e){2 0(d){2 e(d)&&a.6(b.4(d))}}(m,g,c.10);c.13=0(a){2 3 a=="0"&&3 a.4=="0"&&3 a.1a=="0"};c.1b=0(a){y b=/0\\s+[^(]+\\([^)]*\\)\\s*\\{[^}]*\\}/;2 0(e){y d;S(!(d=a(e))){S(!(d=b.6(""+e))){d=1c;K{e();d=14}N(f){d=!(f 1d w)&&f.1f!="1g"}d=d}d=d}2 d}}(c.13);c.1h=0(a,b){2 0(e){2 a.6(b.4(e))}}(/^\\[7\\s+1i\\]$/,g);c.1j=0(a,b){2 0(e){2 a.6(b.4(e))}}(/^\\[7\\s+1k\\]$/,g);c.r=0(a,b){2 0(e){2 a.6(b.4(e))}}(/^\\[7\\s+t\\]$/,g);c.1m=0(a,b,e){2 0(d){2 e(d)&&(a.6(b.4(d))||3 d.5=="9"&&d.5=="t")}}(/(?:^t:)|(?:^t$)|(?:\\[t:\\s*5\\:\\s*t)/,i,c.r);c.1o=0(a,b,e){2 0(d){2 e(d)&&(a.6(b.4(d))||3 d.5=="9"&&d.5=="E")}}(/(?:^E:)|(?:^E$)|(?:\\[E:\\s*5\\:\\s*E)/,i,c.r);c.1q=0(a,b,e){2 0(d){2 e(d)&&(a.6(b.4(d))||3 d.5=="9"&&d.5=="D")}}(/(?:^D:)|(?:^D$)|(?:\\[D:\\s*5\\:\\s*D)/,i,c.r);c.1s=0(a,b,e){2 0(d){2 e(d)&&(a.6(b.4(d))||3 d.5=="9"&&d.5=="A")}}(/(?:^A:)|(?:^A$)|(?:\\[A:\\s*5\\:\\s*A)/,i,c.r);c.1u=0(a,b,e){2 0(d){2 e(d)&&(a.6(b.4(d))||3 d.5=="9"&&d.5=="z")}}(/(?:^z:)|(?:^z$)|(?:\\[z:\\s*5\\:\\s*z)/,i,c.r);c.1w=0(a,b,e){2 0(d){2 e(d)&&(a.6(b.4(d))||3 d.5=="9"&&d.5=="w")}}(/(?:^w:)|(?:^w$)|(?:\\[w:\\s*5\\:\\s*w)/,i,c.r);c.1x=0(a,b,e){2 0(d){2 e(d)&&(a.6(b.4(d))||3 d.5=="9"&&d.5=="C")}}(/(?:^C:)|(?:^C$)|(?:\\[C:\\s*5\\:\\s*C)/,i,c.r);h.I=0(a,b,e){2 0(d){2 B===e?3 d=="x"?"1A":!d&&3 d=="7"?"1B":a.G(b.4(d))[1]:a.G(b.4(B))[1]}}(l,g,c);k.I=0(a,b){2 0(e){2 a.4(b,e)}}(h.I,c);h.R=0(a,b,e,d){2 0(f){2 B===d?e(f)?f:d[a.G(b.4(f))[1]]:d[a.G(b.4(B))[1]]}}(l,g,c.J,c);k.R=0(a,b){2 0(e){2 a.4(b,e)}}(h.R,c);h=k=j=c=n=m=l=i=g=o=L;8 i;8 g;8 o;8 n;8 m;8 l;8 h;8 k;8 j;8 c;8 15.1G}).4(L);',62,107,'function||return|typeof|call|name|test|object|delete|string||||||||||||||||||isError||Error|number|length|TypeError|undefined|var|SyntaxError|ReferenceError|this|URIError|RangeError|EvalError|isArray|exec|isArgumentsArray|getBaseName|isUndefinedOrNull|try|null|boolean|catch|propertyIsEnumerable|isNeitherUndefinedNorNull|isFinite|getBase|if|isNumberObject|isPrimitive|prototype|Array|toString|isBoolean|constructor|isNative|Object|isObject|isFunction|true|arguments|isString|isDefined|isObjectObject|isValue|apply|isCallable|false|instanceof|isAlien|message|NOT_SUPPORTED_ERR|isRegExp|RegExp|isDate|Date|isStringObject|isGenericError|isStringValue|isEvalError|isNotNull|isRangeError|isNull|isReferenceError|isListLike|isSyntaxError|isUndefined|isTypeError|isURIError|String|isNumber|UndefinedType|NullType|Arguments|isNumberValue|Number|isBooleanObject|callee|isBooleanValue|Boolean'.split('|'),0,{}));

- Combined (closure + packer) - 3.746 byte : (does not include [getBase ...] functionality)
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(0(){y b=1f,i=b.T,n=b.U,j=n.Q,k=/^\\[6\\s+U\\]$/,l=/^\\[6\\s+19\\]$/,m,f=j.V,h=b.q.Q.V;b.1q=0(a){1 2 a=="B"};b.1u=0(a){1 2 a!="B"};b.1w=0(a){1!a&&2 a=="6"};b.13=0(a){1 a||2 a!="6"};b.W=0(a){1!a&&(2 a=="B"||2 a=="6")};b.G=0(a){1 a||2 a!="B"&&2 a!="6"};b.X=0(a){1 2 a=="8"||2 a=="u"||2 a=="H"};b.1z=0(a,c){1 0(e){1 a(e)||c(e)}}(b.X,b.W);b.L=0(a){1 a&&(2 a=="6"||2 a=="0")};b.O=0(a){1 0(c){1 a(c)&&2 c.P=="0"}}(b.G);b.1s=0(a){1 0(c){1 a(c)&&2 c.P!="0"}}(b.L);b.R=0(a,c){1 0(e){1 a.5(c.3(e))}}(/^\\[6\\s+1A\\]$/,f);b.11=0(a){1 2 a=="H"};b.12=0(a){1 0(c){1 a(c)&&2 c!="H"}}(b.R);b.N=0(a,c){1 0(e){1 a.5(c.3(e))&&2 e!="u"}}(/^\\[6\\s+14\\]$/,f);b.15=0(a){1 2 a=="u"};b.16=0(a,c){1 0(e){1(2 e=="u"||c(e))&&a(e)}}(b.I,b.N);b.S=0(a,c){1 0(e){1 a.5(c.3(e))}}(/^\\[6\\s+1c\\]$/,f);b.1m=0(a){1 2 a=="8"};b.1o=0(a){1 0(c){1 a(c)&&2 c!="8"}}(b.S);m=0(){y a;K{j.E.3(F,"t");a=0(e){1 0(d,g){1 e.3(d,g)}}(j.E)}J(c){a=0(e){1 0(d,g){y o;K{o=e.3(d,g)}J(p){o=10}1 o}}(j.E)}1 a}();b.C=2 i.C=="0"&&i.C||(i.C=0(a,c){1 0(e){1 a.5(c.3(e))}}(/^\\[6\\s+T\\]$/,f));b.D=2 i.D=="0"&&i.D||(i.D=0(){1 0(){1 l.5(f.3(Z))}()?0(a,c){1 0(e){1 a.5(c.3(e))}}(l,f):0(a,c,e,d){1 0(g){1 a.5(c.3(g))&&!!g&&2 g.t=="u"&&e(g.t)&&!d(g,"t")}}(k,f,b.I,m)}());b.17=0(a){1 0(c){1 a(c)&&2 c.t=="u"&&I(c.t)}}(b.G);b.18=0(a,c,e){1 0(d){1 e(d)&&a.5(c.3(d))}}(k,f,b.O);b.M=0(a){1 2 a=="0"&&2 a.3=="0"&&2 a.1a=="0"};b.1b=0(a){y c=/0\\s+[^(]+\\([^)]*\\)\\s*\\{[^}]*\\}/;1 0(e){y d;Y(!(d=a(e))){Y(!(d=c.5(""+e))){d=1d;K{e();d=10}J(g){d=!(g 1e r)&&g.1g!="1h"}d=d}d=d}1 d}}(b.M);b.1i=0(a,c){1 0(e){1 a.5(c.3(e))}}(/^\\[6\\s+1j\\]$/,f);b.1k=0(a,c){1 0(e){1 a.5(c.3(e))}}(/^\\[6\\s+1l\\]$/,f);b.9=0(a,c){1 0(e){1 a.5(c.3(e))}}(/^\\[6\\s+q\\]$/,f);b.1n=0(a,c,e){1 0(d){1 e(d)&&(a.5(c.3(d))||2 d.4=="8"&&d.4=="q")}}(/(?:^q:)|(?:^q$)|(?:\\[q:\\s*4\\:\\s*q)/,h,b.9);b.1p=0(a,c,e){1 0(d){1 e(d)&&(a.5(c.3(d))||2 d.4=="8"&&d.4=="x")}}(/(?:^x:)|(?:^x$)|(?:\\[x:\\s*4\\:\\s*x)/,h,b.9);b.1r=0(a,c,e){1 0(d){1 e(d)&&(a.5(c.3(d))||2 d.4=="8"&&d.4=="z")}}(/(?:^z:)|(?:^z$)|(?:\\[z:\\s*4\\:\\s*z)/,h,b.9);b.1t=0(a,c,e){1 0(d){1 e(d)&&(a.5(c.3(d))||2 d.4=="8"&&d.4=="A")}}(/(?:^A:)|(?:^A$)|(?:\\[A:\\s*4\\:\\s*A)/,h,b.9);b.1v=0(a,c,e){1 0(d){1 e(d)&&(a.5(c.3(d))||2 d.4=="8"&&d.4=="w")}}(/(?:^w:)|(?:^w$)|(?:\\[w:\\s*4\\:\\s*w)/,h,b.9);b.1x=0(a,c,e){1 0(d){1 e(d)&&(a.5(c.3(d))||2 d.4=="8"&&d.4=="r")}}(/(?:^r:)|(?:^r$)|(?:\\[r:\\s*4\\:\\s*r)/,h,b.9);b.1y=0(a,c,e){1 0(d){1 e(d)&&(a.5(c.3(d))||2 d.4=="8"&&d.4=="v")}}(/(?:^v:)|(?:^v$)|(?:\\[v:\\s*4\\:\\s*v)/,h,b.9);j=n=i=b=l=k=h=f=m=F;7 h;7 f;7 m;7 l;7 k;7 j;7 n;7 i;7 b;7 Z.1B}).3(F);',62,100,'function|return|typeof|call|name|test|object|delete|string|isError|||||||||||||||||Error|TypeError||length|number|URIError|SyntaxError|EvalError|var|RangeError|ReferenceError|undefined|isArray|isArgumentsArray|propertyIsEnumerable|null|isNeitherUndefinedNorNull|boolean|isFinite|catch|try|isObject|isFunction|isNumberObject|isNative|constructor|prototype|isBoolean|isString|Array|Object|toString|isUndefinedOrNull|isPrimitive|if|arguments|true|isBooleanValue|isBooleanObject|isNotNull|Number|isNumberValue|isNumber|isListLike|isObjectObject|Arguments|apply|isCallable|String|false|instanceof|this|message|NOT_SUPPORTED_ERR|isRegExp|RegExp|isDate|Date|isStringValue|isGenericError|isStringObject|isEvalError|isUndefined|isRangeError|isAlien|isReferenceError|isDefined|isSyntaxError|isNull|isTypeError|isURIError|isValue|Boolean|callee'.split('|'),0,{}));


*/
