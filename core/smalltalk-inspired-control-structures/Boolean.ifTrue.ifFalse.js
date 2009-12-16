

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



Boolean.prototype.ifTrue = (function (fct, target/*optional:[object|function]*/) { // [caseTrue], [ifTrue], [ifTrueDo]

	var isTrue = this.valueOf();
	if (isTrue && (typeof fct == "function")) {

		fct.call((((typeof target == "undefined") || ((typeof target == "obj") && !target)) && null) || target);
	}
	return isTrue;
});
Boolean.prototype.ifFalse = (function (fct, target/*optional:[object|function]*/) { // [caseFalse], [ifFalse], [ifFalseDo]

	var isTrue = this.valueOf();
	if (!isTrue && (typeof fct == "function")) {

		fct.call((((typeof target == "undefined") || ((typeof target == "obj") && !target)) && null) || target);
	}
	return isTrue;
});
//[http://dean.edwards.name/packer/] - shrinked - 346 byte:
//Boolean.prototype.ifTrue=(function(a,b){var c=this.valueOf();if(c&&(typeof a=="function")){a.call((((typeof b=="undefined")||((typeof b=="obj")&&!b))&&null)||b)}return c});
//Boolean.prototype.ifFalse=(function(a,b){var c=this.valueOf();if(!c&&(typeof a=="function")){a.call((((typeof b=="undefined")||((typeof b=="obj")&&!b))&&null)||b)}return c});


/*
	... and even without using >>if ... else<< internally at all:
*/
Boolean.prototype.ifTrue = (function (fct, target/*optional:[object|function]*/) { // [caseTrue], [ifTrue], [ifTrueDo]

	return (
		(
			this.valueOf() &&
			(typeof fct == "function") &&
			(function () {
				fct.call((((typeof target == "undefined") || ((typeof target == "obj") && !target)) && null) || target);
				return true;
			})
		) || (function () {
			return false;
		})
	)();
});
Boolean.prototype.ifFalse = (function (fct, target/*optional:[object|function]*/) { // [caseFalse], [ifFalse], [ifFalseDo]

	return (
		(
			!this.valueOf() &&
			(typeof fct == "function") &&
			(function () {
				fct.call((((typeof target == "undefined") || ((typeof target == "obj") && !target)) && null) || target);
				return false;
			})
		) || (function () {
			return true;
		})
	)();
});
//[http://dean.edwards.name/packer/] - shrinked - 438 byte:
//Boolean.prototype.ifTrue=(function(a,b){return((this.valueOf()&&(typeof a=="function")&&(function(){a.call((((typeof b=="undefined")||((typeof b=="obj")&&!b))&&null)||b);return true}))||(function(){return false}))()});
//Boolean.prototype.ifFalse=(function(a,b){return((!this.valueOf()&&(typeof a=="function")&&(function(){a.call((((typeof b=="undefined")||((typeof b=="obj")&&!b))&&null)||b);return false}))||(function(){return true}))()});



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
