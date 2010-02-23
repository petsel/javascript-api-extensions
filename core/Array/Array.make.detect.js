

/*
	- prototypal as well as static but mainly non-generic
	  implemented Array extension methods:

	- none of the implementations is going to throw any
	  single [[Error]] message. every method instead fails
		silently but still smart enough in case of getting
		invoked with invalid arguments.


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
				isEnumerable.call(document.getElementsByTagName("*"), "length");
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

				var len = ((list || isString(list)) && list.length);
				return (((typeof len == "number") && isFinite(len) && (slice.call(list) || (new Arr(len)))) || list); // ( ... || []); // ( ... || [list]); // there might be a debate on it.
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

/*
	[http://closure-compiler.appspot.com/home]

- simple : 4.810 byte down to 1.624 byte
	(function(h){var d=h.Array,q=d.prototype,n=h.Object.prototype;d.isArray=typeof d.isArray=="function"&&d.isArray||typeof h.isArray=="function"&&h.isArray||function(){var f=/^\[object\s+Array\]$/,b=n.toString;return function(g){return f.test(b.call(g))}}();d.isArgumentsArray=typeof h.isArgumentsArray=="function"&&h.isArgumentsArray||function(){var f,b=/^\[object\s+Object\]$/,g=n.toString,j=n.propertyIsEnumerable;try{j.call(document.getElementsByTagName("*"),"length");f=function(e){return b.test(g.call(e))&& typeof e.length=="number"&&!j.call(e,"length")}}catch(i){f=function(e){return b.test(g.call(e))&&typeof e.length=="number"&&!function(){var k;try{k=j.call(e,"length")}catch(o){k=true}return k}()}}return f}();d.make=function(){var f,b,g,j=document.getElementsByTagName&&document.getElementsByTagName("*"),i=q.slice,e=d.isArgumentsArray,k=d.isArray,o=typeof h.isString=="function"&&h.isString||function(){var a=/^\[object\s+String\]$/,c=n.toString;return function(l){return a.test(c.call(l))}}();try{b=i.call(j); b=i.call(arguments);g=b.join("");if(b.length!=3||g!="Array.make")throw new Error;b=i.call(g);if(b.length!==10||b[5]!==".")throw new Error;f=function(a){var c=(a||o(a))&&a.length;return typeof c=="number"&&isFinite(c)&&(i.call(a)||new d(c))||a};delete e;delete k}catch(r){f=function(a){var c,l=e(a)&&i.call(a)||o(a)&&a.split("")||k(a)&&i.call(a)||c;if(!l){c=a!==0&&a&&a.length;if(typeof c=="number"&&isFinite(c)){l=new d(c);for(var m=0,p;m<c;){p=a.item&&a.item(m)||a[m];if(typeof p!="undefined"||m in a)l[m]= p;++m}}}return l||a}}delete b;delete g;delete j;return f}("Array",".","make")})(window||this);


	[http://dean.edwards.name/packer/] bzw. [http://javascriptcompressor.com/]

- shrink variables only	: down to 2.150 byte
	(function(d){var e=d.Array,Obj=d.Object,ProtoArr=e.prototype,ProtoObj=Obj.prototype;e.isArray=(((typeof e.isArray=="function")&&e.isArray)||((typeof d.isArray=="function")&&d.isArray)||(function(){var b=(/^\[object\s+Array\]$/),exposeImplementation=ProtoObj.toString;return(function(a){return b.test(exposeImplementation.call(a))})})());e.isArgumentsArray=(((typeof d.isArgumentsArray=="function")&&d.isArgumentsArray)||(function(){var c,regXBaseClass=(/^\[object\s+Object\]$/),exposeImplementation=ProtoObj.toString,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(document.getElementsByTagName("*"),"length");c=(function(a){return(regXBaseClass.test(exposeImplementation.call(a))&&(typeof a.length=="number")&&!isEnumerable.call(a,"length"))})}catch(exc){c=(function(b){return(regXBaseClass.test(exposeImplementation.call(b))&&(typeof b.length=="number")&&!(function(){var a;try{a=isEnumerable.call(b,"length")}catch(exc){a=true}return a})())})}return c})());e.make=(function(){var c,arr,str,all=(document.getElementsByTagName&&document.getElementsByTagName("*")),slice=ProtoArr.slice,isArguments=e.isArgumentsArray,isArray=e.isArray,isString=(((typeof d.isString=="function")&&d.isString)||(function(){var b=(/^\[object\s+String\]$/),exposeImplementation=ProtoObj.toString;return(function(a){return b.test(exposeImplementation.call(a))})})());try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}c=(function(a){var b=((a||isString(a))&&a.length);return(((typeof b=="number")&&isFinite(b)&&(slice.call(a)||(new e(b))))||a)});delete isArguments;delete isArray}catch(exc){c=(function(a){var b,arr=((isArguments(a)&&slice.call(a))||(isString(a)&&a.split(""))||(isArray(a)&&slice.call(a))||b);if(!arr){b=((a!==0)&&a&&a.length);if((typeof b=="number")&&isFinite(b)){arr=new e(b);var i=0,elm;while(i<b){elm=((a.item&&a.item(i))||a[i]);if((typeof elm!="undefined")||(i in a)){arr[i]=elm}++i}}}return(arr||a)})}delete arr;delete str;delete all;return c})("Array",".","make")})(window||this);
	
- shrink and encode			: down to 1.725 byte
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(d){f e=d.t,J=d.M,H=e.K,n=J.K;e.8=(((9 e.8=="1")&&e.8)||((9 d.8=="1")&&d.8)||(1(){f b=(/^\\[F\\s+t\\]$/),h=n.z;6(1(a){6 b.v(h.4(a))})})());e.u=(((9 d.u=="1")&&d.u)||(1(){f c,x=(/^\\[F\\s+M\\]$/),h=n.z,p=n.T;C{p.4(D.E("*"),"7");c=(1(a){6(x.v(h.4(a))&&(9 a.7=="q")&&!p.4(a,"7"))})}G(w){c=(1(b){6(x.v(h.4(b))&&(9 b.7=="q")&&!(1(){f a;C{a=p.4(b,"7")}G(w){a=U}6 a})())})}6 c})());e.y=(1(){f c,2,l,A=(D.E&&D.E("*")),g=H.g,B=e.u,8=e.8,m=(((9 d.m=="1")&&d.m)||(1(){f b=(/^\\[F\\s+Q\\]$/),h=n.z;6(1(a){6 b.v(h.4(a))})})());C{2=g.4(A);2=g.4(P);l=2.Y("");j((2.7!=3)||(l!="t.y")){L(r N);}2=g.4(l);j((2.7!==10)||(2[5]!==".")){L(r N);}c=(1(a){f b=((a||m(a))&&a.7);6(((9 b=="q")&&O(b)&&(g.4(a)||(r e(b))))||a)});k B;k 8}G(w){c=(1(a){f b,2=((B(a)&&g.4(a))||(m(a)&&a.Z(""))||(8(a)&&g.4(a))||b);j(!2){b=((a!==0)&&a&&a.7);j((9 b=="q")&&O(b)){2=r e(b);f i=0,o;X(i<b){o=((a.I&&a.I(i))||a[i]);j((9 o!="W")||(i R a)){2[i]=o}++i}}}6(2||a)})}k 2;k l;k A;6 c})("t",".","y")})(V||S);',62,63,'|function|arr||call||return|length|isArray|typeof||||||var|slice|exposeImplementation||if|delete|str|isString|ProtoObj|elm|isEnumerable|number|new||Array|isArgumentsArray|test|exc|regXBaseClass|make|toString|all|isArguments|try|document|getElementsByTagName|object|catch|ProtoArr|item|Obj|prototype|throw|Object|Error|isFinite|arguments|String|in|this|propertyIsEnumerable|true|window|undefined|while|join|split|'.split('|'),0,{}));
*/
