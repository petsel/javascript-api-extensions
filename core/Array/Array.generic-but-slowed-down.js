

/*
	- prototypal as well as static but almost always
	  generic implemented Array extension methods.

	- all implementations do throw [[Error]] messages
	  in case of getting invoked with invalid arguments.




	- list of implemented Array extension methods:

	[Array.isArray],						// type detection
	[Array.isArgumentsArray],

	[Array.make],								// generic creator

	[Array.forEach]							// iterator
	...
	...


	copy and paste code beneath into [http://jconsole.com/] for quick testing:
*/

(function (sh) { // [sh]::[global|window] : "scripting host"


	var Arr = sh.Array, Obj = sh.Object,
	ProtoArr = Arr.prototype, ProtoObj = Obj.prototype;
/*
(function () {
	print(Object.prototype.toString.call(arguments));
	print(Object.prototype.propertyIsEnumerable.call(arguments, "length"));
	print(Object.prototype.propertyIsEnumerable.call([], "length"));
	print(Object.prototype.propertyIsEnumerable.call("", "length"));
	print(Object.prototype.propertyIsEnumerable.call({length:0}, "length"));
	print(Object.prototype.propertyIsEnumerable.call(document.getElementsByTagName("*"), "length"));
})()
*/
	Arr.isArray = (

		((typeof Arr.isArray == "function") && Arr.isArray) ||
		((typeof sh.isArray == "function") && sh.isArray) ||
		(function () {

			var regXBaseClass = (/^\[object\s+Array\]$/), exposeImplementation = ProtoObj.toString;
			return (function (obj/*:[object|value]*/) {

				return regXBaseClass.test(exposeImplementation.call(obj));
			});
		})()
	);
	Arr.isArgumentsArray = (

		((typeof sh.isArgumentsArray == "function") && sh.isArgumentsArray) ||
		(function () {

			var isArguments, regXBaseClass = (/^\[object\s+Object\]$/), exposeImplementation = ProtoObj.toString, isEnumerable = ProtoObj.propertyIsEnumerable;
			try {
				void isEnumerable.call(document.getElementsByTagName("*"), "length");
				isArguments = (function (obj/*:[object|value]*/) {

					return (regXBaseClass.test(exposeImplementation.call(obj)) && (typeof obj.length == "number") && !isEnumerable.call(obj, "length"));
				});
			} catch (exc) { // [exc]::[Error]
				isArguments = (function (obj/*:[object|value]*/) {

					return (regXBaseClass.test(exposeImplementation.call(obj)) && (typeof obj.length == "number") && !(function () {var isEnum;try {isEnum = isEnumerable.call(obj, "length");} catch (exc) {isEnum = true;}return isEnum;})());
				});
			}
			return isArguments;
		})()
	);
/*
(function () {
	print(Array.isArgumentsArray(arguments));
	print(Array.isArgumentsArray([]));
	print(Array.isArgumentsArray(""));
	print(Array.isArgumentsArray({length:0}));
	print(Array.isArgumentsArray(document.getElementsByTagName("*")));
})()
*/
	Arr.make = (function () {

		var make, arr, str,
		all = (document.getElementsByTagName && document.getElementsByTagName("*")),
		slice = ProtoArr.slice,
		isArguments = Arr.isArgumentsArray,
		isArray = Arr.isArray,
		isString = (
			((typeof sh.isString == "function") && sh.isString) ||
			(function () {

				var regXBaseClass = (/^\[object\s+String\]$/), exposeImplementation = ProtoObj.toString;
				return (function (obj/*:[object|value]*/) {

					return regXBaseClass.test(exposeImplementation.call(obj));
				});
			})()
		);


		try {

		//[NodeList|HTMLCollection] test.
			arr = slice.call(all); // msie fails.

		//[arguments] test.
			arr = slice.call(arguments); // every relevant (seen from a point of market share) browser passes.
			str = arr.join("");
			if ((arr.length != 3) || (str != "Array.make")) {
				throw (new Error);
			}

		//[String] test.
			arr = slice.call(str); // opera and msie fail.
			if ((arr.length !== 10) || (arr[5] !== ".")) {
				throw (new Error);
			}

			make = (function (list) {

				var arr, len = ((list || isString(list)) && list.length);
				if ((typeof len == "number") && isFinite(len)) { // detect invalid list structures.

				//arr = (slice.call(list, 0, len) || (new Arr(len)));
				//arr = (slice.call(list, 0) || (new Arr(len)));
					arr = (slice.call(list) || (new Arr(len)));
				} else {
					throw (new TypeError("1st argument needs to be some kind of list."));
				}
				return (arr || list); // (arr || []); // (arr || [list]); // there might be a debate on it.
			});
			delete isArguments; delete isArray;

		} catch (exc) { // [exc]::[Error]

			make = (function (list) {

				var len, arr = ((isArguments(list) && slice.call(list)) || (isString(list) && list.split("")) || (isArray(list) && slice.call(list)) || len); // [arguments], [String] and [Array] test shortcut.
				if (!arr) {
				//len = (list && list.length); // (((0) && (0).length) === 0) // ((0 && window.undefined) === 0) // true
					len = ((list !== 0) && list && list.length); // prevents passing zero as an argument.
					if ((typeof len == "number") && isFinite(len)) { // detect invalid list structures.

						arr = new Arr(len);

						var i = 0, elm;
						while (i < len) {
						//elm = list[i];
							elm = (/*(list.charAt && list.charAt(i)) || */(list.item && list.item(i)) || list[i]); // [String|string].charAt is not necessary anymore.
							if ((typeof elm != "undefined") || (i in list)) {
								arr[i] = elm;
							}
							++i;
						}
					} else {
						throw (new TypeError("1st argument needs to be some kind of list."));
					}
				}
			//return (Arr.filter(list, (function () {return true;})) || list);
				return (arr || list); // (arr || []); // (arr || [list]); // there might be a debate on it.
			});
		}
		delete arr; delete str; delete all;

		return make;

	})("Array", ".", "make");


})(window || this);



print(Array.make(document.getElementsByTagName("*")));
print(Array.make((function(){return arguments})(1,2,3,4,5,6,7,8,9,0)));

