

/*
	[Number.times] and its relatives got implemented close to mozilla.org's
	[Array.forEach] remaining [Number] specific and Smalltalk inspired though.


	links:

		EN: [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/forEach]
		EN: [http://en.wikipedia.org/wiki/Smalltalk]

		DE: [http://de.wikipedia.org/wiki/Smalltalk-80_(Programmiersprache)#Schleifen]

	for a quick countercheck paste code into [http://jconsole.com/]:
*/



Number.prototype.times = (function (fct, target) { // generic and prototypal implementation

	var i = -1, num = Number(this);

	num = ((isFinite(num) && (typeof fct == "function") && Math.floor(num)) || i);
	target = ((((typeof target == "undefined") || ((typeof target == "obj") && !target)) && null) || target);

	while (++i < num) {
		fct.call(target, i, num, fct);
	}
});
//[http://dean.edwards.name/packer/] - shrinked:
//Number.prototype.times=(function(a,b){var i=-1,num=Number(this);num=((isFinite(num)&&(typeof a=="function")&&Math.floor(num))||i);b=((((typeof b=="undefined")||((typeof b=="obj")&&!b))&&null)||b);while(++i<num){a.call(b,i,num,a)}});



Number.times = (function () { // generic and static implementation

	var times = (Number.prototype.times || (function () {}));

	return (function (num, fct, target) {
		times.call(Number(num), fct, target);
	});
})();
//[http://dean.edwards.name/packer/] - shrinked:
//Number.times=(function(){var d=(Number.prototype.times||(function(){}));return(function(a,b,c){d.call(Number(a),b,c)})})();



String.prototype.times = (function () { // generic and prototypal implementation

	var times = (Number.prototype.times || (function () {}));

	return (function (fct, target) {
		times.apply(Number(this), arguments);
	});
})();
//[http://dean.edwards.name/packer/] - shrinked:
//String.prototype.times=(function(){var c=(Number.prototype.times||(function(){}));return(function(a,b){c.apply(Number(this),arguments)})})();



(5).times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");});							// 5 times the function
(3.999).times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");});					// 3 times the function

print("\n");


Number.times(2, (function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");}));			// 2 times the function
Number.times((1/0), (function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");}));	// 0 times the function
Number.times("1.9", (function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");}));	// 1 times the function

print("\n");


("3").times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");});						// 3 times the function
("2,00000001").times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");}); 	// 0 times the function
(0).times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");});							// 0 times the function
("5.99999999").times(function (idx, len, fct) {print("hallo - idx : " + idx + " - len : " + len + " - fct : " + fct + "\n");}); 	// 5 times the function

print("\n");


var arr = [1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];

arr.length.times(function (idx/*, len, fct*/) {

	print("arr[" + idx + "] : " + arr[idx]);
});
