

/*
	[Function.whileTrue|whileFalse] is the last JavaScript implementation of Smalltalk inspired
	control structures like [Boolean.ifTrue|ifFalse], [Number.times] or [Number.to( ... ).each]
	that recently have been committed to refactory.org.

	Its right to exist might be more of academic nature. But here it is.


	links:

		DE: [http://de.wikipedia.org/wiki/Smalltalk-80_(Programmiersprache)#Kontrollstrukturen]

	for a quick countercheck paste code into [http://jconsole.com/]:
*/ /*

	[ "ein Block, der ein boole'sches Objekt zurückgibt" ] whileTrue.
	[ "ein Block, der ein boole'sches Objekt zurückgibt" ] whileFalse.
	[ "ein Block, der ein boole'sches Objekt zurückgibt" ] whileTrue: [ "Block mit Schleifenrumpf" ].
	[ "ein Block, der ein boole'sches Objekt zurückgibt" ] whileFalse: [ "Block mit Schleifenrumpf" ]


	Function.prototype.whileFalse = (function () {});

	(function () {}).whileTrue();
	(function () {}).whileFalse();
	(function () {}).whileTrue().ifFalse(function () {});
	(function () {}).whileFalse().ifTrue(function () {});
*/

(function (sh) {

	var makeArray = (((typeof Array.make == "function") && Array.make) || (function () {

		var slice = Array.prototype.slice;
		return (function (list) {

			return slice.call(list);
		});
	})()),
	isFunction = (function (obj) {

		return (typeof obj == "function");
	});

	sh.Function.prototype.whileTrue = (function (/*fct:Function[, arg01:Object[, arg02:Object]]*/) {

		var args = makeArray(arguments),

		fctStatement = args.shift(0),
		fctCondition = this;

		if (isFunction(fctStatement) && isFunction(fctCondition)) {

			while (fctCondition.apply(null, args)) {
			//args = fctStatement.apply(null, args);					// this already is sufficient and every browser can deal with it ...
				args = (fctStatement.apply(null, args) || []);	// ... except for msie that at this point, for whatever reason, desires an object.
			}
		}
	//return false; // nice to have if to be followed by a functional [Boolean.ifFalse] expression.
		return null; // that's what the Smalltalk specification states.
	});
	sh.Function.prototype.whileFalse = (function (/*fct:Function[, arg01:Object[, arg02:Object]]*/) {

		var args = makeArray(arguments),

		fctStatement = args.shift(0),
		fctCondition = this;

		if (isFunction(fctStatement) && isFunction(fctCondition)) {

			while (!fctCondition.apply(null, args)) {
			//args = fctStatement.apply(null, args);					// this already is sufficient and every browser can deal with it ...
				args = (fctStatement.apply(null, args) || []);	// ... except for msie that at this point, for whatever reason, desires an object.
			}
		}
	//return false; // nice to have if to be followed by a functional [Boolean.ifFalse] expression.
		return null; // that's what the Smalltalk specification states.
	});

})(window || this);



//[http://dean.edwards.name/packer/] - shrinked - 709 byte
//(function(c){var d=(((typeof Array.make=="function")&&Array.make)||(function(){var b=Array.prototype.slice;return(function(a){return b.call(a)})})()),isFunction=(function(a){return(typeof a=="function")});c.Function.prototype.whileTrue=(function(){var a=d(arguments),fctStatement=a.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition)){while(fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null});c.Function.prototype.whileFalse=(function(){var a=d(arguments),fctStatement=a.shift(0),fctCondition=this;if(isFunction(fctStatement)&&isFunction(fctCondition)){while(!fctCondition.apply(null,a)){a=(fctStatement.apply(null,a)||[])}}return null})})(window||this);



// 2 simple examples both operating at variables of an outer scope:

var arr = [], maxLength = 9;

print((function () { // "conditional" part

	return (arr.length >= maxLength);

}).whileFalse(function () { // "statement" complement

	arr.push(Math.floor(Math.random() * maxLength));
	print("currLength : " + arr.length + " - arr : " + arr);

}));
print((function () { // "conditional" part

	return (arr.length < maxLength);

}).whileTrue(function () { // "statement" complement

	arr.push(Math.floor(Math.random() * maxLength));
	print("currLength : " + arr.length + " - arr : " + arr);

}));



// more advanced examples - each does provide its conditional start parameters locally to itself and passes them around:

print((function (x, y) { // "conditional" part

	return ((x-y) > 0);

}).whileTrue((function (x, y) { // "statement" complement

	print("x : " + x + " - y : " + y);
	++y;

//the current state of all assigned parameters needs to be returned to this "statement"s "conditional" complement as ordered list.
	return [x, y];

}), 5, 2)); // start parameters [x] and [y] for both functions the "conditional" part and its "statement" complement.


print((function (x, y) { // "conditional" part

	return ((x-y) > 0);

}).whileFalse((function (x, y) { // "statement" complement

	print("x : " + x + " - y : " + y);
	++y;

//the current state of all assigned parameters needs to be returned to this "statement"s "conditional" complement as ordered list.
	return [x, y];

}), 5, 2)); // start parameters [x] and [y] for both functions the "conditional" part and its "statement" complement.
