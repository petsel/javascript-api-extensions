

(function (ns/*[custom_namespace]*/) {
  var sh = this/*[global|scripting_host]*/,


  doc = (sh && sh.document),
  docElm = (doc && (doc.documentElement || ((typeof doc.getElementsByTagName == "function") && doc.getElementsByTagName("html")[0])));


  if (doc && docElm) {


    (ns||sh)["RenderEngine"] = (function (styleOfDocElm) {

      var getIsSupported = (function (propertyName) {
        return (typeof styleOfDocElm[propertyName] == "string");
      });
      return { // e.g. ...

        isGECKO   : getIsSupported("MozOpacity"),
        isKHTML   : (getIsSupported("KhtmlOpacity") && !getIsSupported("WebkitOpacity")),
        isWEBKIT  : getIsSupported("WebkitOpacity"),
        isPRESTO  : getIsSupported("opPhonemes"),
        isTRIDENT : getIsSupported("behavior"),

        isWebkitTransform : getIsSupported("WebkitTransform"),
        isMozTransform    : getIsSupported("MozTransform"),
        isOpTransform     : getIsSupported("OpTransform"),
        isMsieTransform   : getIsSupported("MsieTransform"),
        isTransform       : getIsSupported("transform"),/*

        isOneMoreProperty : getIsSupported("propertyName"),
        isOneMoreProperty : getIsSupported("propertyName"),
        isOneMoreProperty : getIsSupported("propertyName")*/

        supports : (function (isSupported, regXWSS, regXForCamelize) {
          var sanitize = (function (str) {
            str = ("" + str).replace(regXWSS, "");
            if (regXForCamelize.test(str)) {
              str = str.toLowerCase().replace(regXForCamelize, (function ($0, $1) {return $1.charAt(1).toUpperCase();}));
            }
            return str;
          });
          return (function (cssProp) {

            return isSupported(sanitize(cssProp));
          });
        })(getIsSupported, (/\s+/g), (/([-][^-])/g))
      };
    })(docElm.style);
  }
  docElm = doc = sh = ns = null;
  delete docElm; delete doc; delete sh; delete ns;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_THIS_APPLICATION_is_supposed_to_be_bound_to]*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 1.259 byte :
(function(ns){var sh=this,doc=sh&&sh.document,docElm=doc&&(doc.documentElement||typeof doc.getElementsByTagName=="function"&&doc.getElementsByTagName("html")[0]);if(doc&&docElm)(ns||sh)["RenderEngine"]=function(styleOfDocElm){var getIsSupported=function(propertyName){return typeof styleOfDocElm[propertyName]=="string"};return{isGECKO:getIsSupported("MozOpacity"),isKHTML:getIsSupported("KhtmlOpacity")&&!getIsSupported("WebkitOpacity"),isWEBKIT:getIsSupported("WebkitOpacity"),isPRESTO:getIsSupported("opPhonemes"),isTRIDENT:getIsSupported("behavior"),isWebkitTransform:getIsSupported("WebkitTransform"),isMozTransform:getIsSupported("MozTransform"),isOpTransform:getIsSupported("OpTransform"),isMsieTransform:getIsSupported("MsieTransform"),isTransform:getIsSupported("transform"),supports:function(isSupported,regXWSS,regXForCamelize){var sanitize=function(str){str=(""+str).replace(regXWSS,"");if(regXForCamelize.test(str))str=str.toLowerCase().replace(regXForCamelize,function($0,$1){return $1.charAt(1).toUpperCase()});return str};return function(cssProp){return isSupported(sanitize(cssProp))}}(getIsSupported,/\s+/g,/([-][^-])/g)}}(docElm.style);docElm=doc=sh=ns=null;delete docElm;delete doc;delete sh;delete ns;delete arguments.callee}).call(null);

- Simple          -   873 byte :
(function(f){var d=this,c=d&&d.document,e=c&&(c.documentElement||typeof c.getElementsByTagName=="function"&&c.getElementsByTagName("html")[0]);if(c&&e)(f||d).RenderEngine=function(i){var a=function(g){return typeof i[g]=="string"};return{isGECKO:a("MozOpacity"),isKHTML:a("KhtmlOpacity")&&!a("WebkitOpacity"),isWEBKIT:a("WebkitOpacity"),isPRESTO:a("opPhonemes"),isTRIDENT:a("behavior"),isWebkitTransform:a("WebkitTransform"),isMozTransform:a("MozTransform"),isOpTransform:a("OpTransform"),isMsieTransform:a("MsieTransform"),isTransform:a("transform"),supports:function(g,j,h){var l=function(b){b=(""+b).replace(j,"");if(h.test(b))b=b.toLowerCase().replace(h,function(m,k){return k.charAt(1).toUpperCase()});return b};return function(b){return g(l(b))}}(a,/\s+/g,/([-][^-])/g)}}(e.style);e=c=d=f=null;delete e;delete c;delete d;delete f;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 1.287 byte :
(function(ns){var sh=this,doc=(sh&&sh.document),docElm=(doc&&(doc.documentElement||((typeof doc.getElementsByTagName=="function")&&doc.getElementsByTagName("html")[0])));if(doc&&docElm){(ns||sh)["RenderEngine"]=(function(styleOfDocElm){var getIsSupported=(function(propertyName){return(typeof styleOfDocElm[propertyName]=="string")});return{isGECKO:getIsSupported("MozOpacity"),isKHTML:(getIsSupported("KhtmlOpacity")&&!getIsSupported("WebkitOpacity")),isWEBKIT:getIsSupported("WebkitOpacity"),isPRESTO:getIsSupported("opPhonemes"),isTRIDENT:getIsSupported("behavior"),isWebkitTransform:getIsSupported("WebkitTransform"),isMozTransform:getIsSupported("MozTransform"),isOpTransform:getIsSupported("OpTransform"),isMsieTransform:getIsSupported("MsieTransform"),isTransform:getIsSupported("transform"),supports:(function(isSupported,regXWSS,regXForCamelize){var sanitize=(function(str){str=(""+str).replace(regXWSS,"");if(regXForCamelize.test(str)){str=str.toLowerCase().replace(regXForCamelize,(function($0,$1){return $1.charAt(1).toUpperCase()}))}return str});return(function(cssProp){return isSupported(sanitize(cssProp))})})(getIsSupported,(/\s+/g),(/([-][^-])/g))}})(docElm.style)}docElm=doc=sh=ns=null;delete docElm;delete doc;delete sh;delete ns;delete arguments.callee}).call(null);

- packed / shrinked           -   945 byte :
(function(j){var k=this,doc=(k&&k.document),docElm=(doc&&(doc.documentElement||((typeof doc.getElementsByTagName=="function")&&doc.getElementsByTagName("html")[0])));if(doc&&docElm){(j||k)["RenderEngine"]=(function(h){var i=(function(a){return(typeof h[a]=="string")});return{isGECKO:i("MozOpacity"),isKHTML:(i("KhtmlOpacity")&&!i("WebkitOpacity")),isWEBKIT:i("WebkitOpacity"),isPRESTO:i("opPhonemes"),isTRIDENT:i("behavior"),isWebkitTransform:i("WebkitTransform"),isMozTransform:i("MozTransform"),isOpTransform:i("OpTransform"),isMsieTransform:i("MsieTransform"),isTransform:i("transform"),supports:(function(d,e,f){var g=(function(c){c=(""+c).replace(e,"");if(f.test(c)){c=c.toLowerCase().replace(f,(function(a,b){return b.charAt(1).toUpperCase()}))}return c});return(function(a){return d(g(a))})})(i,(/\s+/g),(/([-][^-])/g))}})(docElm.style)}docElm=doc=k=j=null;delete docElm;delete doc;delete k;delete j;delete arguments.callee}).call(null);


*/
