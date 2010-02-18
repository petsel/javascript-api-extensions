/*

(function () { // some APPLICATION module/context */


//var sh/*global*/ = ((this && (this.window === this) && /*this.*/window) || this), // "scripting host" or "global object"


	RenderEngine = (function (/*styleOfDocElm*/) { // local helper namespace holding css feature detection results.

	//var styleOfDocElm = ((sh.document && (sh.document.documentElement || ((sh.document.getElementsByTagName && sh.document.getElementsByTagName("html")[0]) || {})).style) || {}),
		var styleOfDocElm = ((document && (document.documentElement || ((document.getElementsByTagName && document.getElementsByTagName("html")[0]) || {})).style) || {}),

		getIsSupported = (function (propertyName) {
			return (typeof styleOfDocElm[propertyName] == "string");
		});
		return {

			isGECKO   : getIsSupported("MozOpacity"),
			isKHTML   : (getIsSupported("KhtmlOpacity") && !getIsSupported("WebkitOpacity")),
			isWEBKIT  : getIsSupported("WebkitOpacity"),
			isPRESTO  : getIsSupported("opPhonemes"),
			isTRIDENT : getIsSupported("behavior"),

			isWebkitTransform : getIsSupported("WebkitTransform")
		};
	})(/*(document.documentElement || document.getElementsByTagName("html")[0]).style*/);
/*

})();*/
