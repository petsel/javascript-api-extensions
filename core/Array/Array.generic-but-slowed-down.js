

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

/*
	[http://closure-compiler.appspot.com/home]

- simple : 5.176 byte down to 1.774 byte
	(function(h){var d=h.Array,q=d.prototype,n=h.Object.prototype;d.isArray=typeof d.isArray=="function"&&d.isArray||typeof h.isArray=="function"&&h.isArray||function(){var f=/^\[object\s+Array\]$/,c=n.toString;return function(g){return f.test(c.call(g))}}();d.isArgumentsArray=typeof h.isArgumentsArray=="function"&&h.isArgumentsArray||function(){var f,c=/^\[object\s+Object\]$/,g=n.toString,j=n.propertyIsEnumerable;try{j.call(document.getElementsByTagName("*"),"length");f=function(e){return c.test(g.call(e))&& typeof e.length=="number"&&!j.call(e,"length")}}catch(i){f=function(e){return c.test(g.call(e))&&typeof e.length=="number"&&!function(){var k;try{k=j.call(e,"length")}catch(o){k=true}return k}()}}return f}();d.make=function(){var f,c,g,j=document.getElementsByTagName&&document.getElementsByTagName("*"),i=q.slice,e=d.isArgumentsArray,k=d.isArray,o=typeof h.isString=="function"&&h.isString||function(){var a=/^\[object\s+String\]$/,b=n.toString;return function(l){return a.test(b.call(l))}}();try{c=i.call(j); c=i.call(arguments);g=c.join("");if(c.length!=3||g!="Array.make")throw new Error;c=i.call(g);if(c.length!==10||c[5]!==".")throw new Error;f=function(a){var b;b=(a||o(a))&&a.length;if(typeof b=="number"&&isFinite(b))b=i.call(a)||new d(b);else throw new TypeError("1st argument needs to be some kind of list.");return b||a};delete e;delete k}catch(r){f=function(a){var b,l=e(a)&&i.call(a)||o(a)&&a.split("")||k(a)&&i.call(a)||b;if(!l){b=a!==0&&a&&a.length;if(typeof b=="number"&&isFinite(b)){l=new d(b); for(var m=0,p;m<b;){p=a.item&&a.item(m)||a[m];if(typeof p!="undefined"||m in a)l[m]=p;++m}}else throw new TypeError("1st argument needs to be some kind of list.");}return l||a}}delete c;delete g;delete j;return f}("Array",".","make")})(window||this);


	[http://dean.edwards.name/packer/] bzw. [http://javascriptcompressor.com/]

- shrink variables only	: down to 2.313 byte
	(function(d){var e=d.Array,Obj=d.Object,ProtoArr=e.prototype,ProtoObj=Obj.prototype;e.isArray=(((typeof e.isArray=="function")&&e.isArray)||((typeof d.isArray=="function")&&d.isArray)||(function(){var b=(/^\[object\s+Array\]$/),exposeImplementation=ProtoObj.toString;return(function(a){return b.test(exposeImplementation.call(a))})})());e.isArgumentsArray=(((typeof d.isArgumentsArray=="function")&&d.isArgumentsArray)||(function(){var c,regXBaseClass=(/^\[object\s+Object\]$/),exposeImplementation=ProtoObj.toString,isEnumerable=ProtoObj.propertyIsEnumerable;try{isEnumerable.call(document.getElementsByTagName("*"),"length");c=(function(a){return(regXBaseClass.test(exposeImplementation.call(a))&&(typeof a.length=="number")&&!isEnumerable.call(a,"length"))})}catch(exc){c=(function(b){return(regXBaseClass.test(exposeImplementation.call(b))&&(typeof b.length=="number")&&!(function(){var a;try{a=isEnumerable.call(b,"length")}catch(exc){a=true}return a})())})}return c})());e.make=(function(){var c,arr,str,all=(document.getElementsByTagName&&document.getElementsByTagName("*")),slice=ProtoArr.slice,isArguments=e.isArgumentsArray,isArray=e.isArray,isString=(((typeof d.isString=="function")&&d.isString)||(function(){var b=(/^\[object\s+String\]$/),exposeImplementation=ProtoObj.toString;return(function(a){return b.test(exposeImplementation.call(a))})})());try{arr=slice.call(all);arr=slice.call(arguments);str=arr.join("");if((arr.length!=3)||(str!="Array.make")){throw(new Error);}arr=slice.call(str);if((arr.length!==10)||(arr[5]!==".")){throw(new Error);}c=(function(a){var b,len=((a||isString(a))&&a.length);if((typeof len=="number")&&isFinite(len)){b=(slice.call(a)||(new e(len)))}else{throw(new TypeError("1st argument needs to be some kind of list."));}return(b||a)});delete isArguments;delete isArray}catch(exc){c=(function(a){var b,arr=((isArguments(a)&&slice.call(a))||(isString(a)&&a.split(""))||(isArray(a)&&slice.call(a))||b);if(!arr){b=((a!==0)&&a&&a.length);if((typeof b=="number")&&isFinite(b)){arr=new e(b);var i=0,elm;while(i<b){elm=((a.item&&a.item(i))||a[i]);if((typeof elm!="undefined")||(i in a)){arr[i]=elm}++i}}else{throw(new TypeError("1st argument needs to be some kind of list."));}}return(arr||a)})}delete arr;delete str;delete all;return c})("Array",".","make")})(window||this);
	
- shrink and encode			: down to 1.870 byte
	eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(d){7 e=d.p,J=d.M,Q=e.K,n=J.K;e.8=(((9 e.8=="1")&&e.8)||((9 d.8=="1")&&d.8)||(1(){7 b=(/^\\[D\\s+p\\]$/),h=n.C;6(1(a){6 b.u(h.4(a))})})());e.x=(((9 d.x=="1")&&d.x)||(1(){7 c,E=(/^\\[D\\s+M\\]$/),h=n.C,r=n.17;A{r.4(z.H("*"),"f");c=(1(a){6(E.u(h.4(a))&&(9 a.f=="w")&&!r.4(a,"f"))})}B(I){c=(1(b){6(E.u(h.4(b))&&(9 b.f=="w")&&!(1(){7 a;A{a=r.4(b,"f")}B(I){a=16}6 a})())})}6 c})());e.y=(1(){7 c,2,m,G=(z.H&&z.H("*")),g=Q.g,F=e.x,8=e.8,l=(((9 d.l=="1")&&d.l)||(1(){7 b=(/^\\[D\\s+13\\]$/),h=n.C;6(1(a){6 b.u(h.4(a))})})());A{2=g.4(G);2=g.4(12);m=2.1b("");j((2.f!=3)||(m!="p.y")){t(k N);}2=g.4(m);j((2.f!==10)||(2[5]!==".")){t(k N);}c=(1(a){7 b,v=((a||l(a))&&a.f);j((9 v=="w")&&R(v)){b=(g.4(a)||(k e(v)))}S{t(k T("U V W X Y Z 11 P O."));}6(b||a)});o F;o 8}B(I){c=(1(a){7 b,2=((F(a)&&g.4(a))||(l(a)&&a.1c(""))||(8(a)&&g.4(a))||b);j(!2){b=((a!==0)&&a&&a.f);j((9 b=="w")&&R(b)){2=k e(b);7 i=0,q;1a(i<b){q=((a.L&&a.L(i))||a[i]);j((9 q!="19")||(i 14 a)){2[i]=q}++i}}S{t(k T("U V W X Y Z 11 P O."));}}6(2||a)})}o 2;o m;o G;6 c})("p",".","y")})(18||15);',62,75,'|function|arr||call||return|var|isArray|typeof||||||length|slice|exposeImplementation||if|new|isString|str|ProtoObj|delete|Array|elm|isEnumerable||throw|test|len|number|isArgumentsArray|make|document|try|catch|toString|object|regXBaseClass|isArguments|all|getElementsByTagName|exc|Obj|prototype|item|Object|Error|list|of|ProtoArr|isFinite|else|TypeError|1st|argument|needs|to|be|some||kind|arguments|String|in|this|true|propertyIsEnumerable|window|undefined|while|join|split'.split('|'),0,{}));
*/
