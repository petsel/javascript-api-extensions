/*
  for testing run script beneath within [http://jconsole.com/]
*/


(function (ns/*[custom_namespace]*/) {
  var sh = this/*[global|scripting_host]*/,


  doc = (sh && sh.document), isGEBTN = (typeof doc.getElementsByTagName == "function"),
  docElm = (doc && (doc.documentElement || (isGEBTN && doc.getElementsByTagName("html")[0]))),
  elmHead = ((docElm && isGEBTN && docElm.getElementsByTagName("head")[0]) || docElm),
  elmBody = ((doc && doc.body) || (isGEBTN && docElm.getElementsByTagName("body")[0]) || docElm),
  elmDiv;


  if (doc && docElm) {
    //declaration of application wide used variables.
    /*
      create a global namespace where chosen features that
      need to be presented in public can be loosly bound to.
    */
  //var APPLICATION/* = (ns || (sh.CSS_MQ = {}))*/,


    var Helper = { // Application Helper

      Str : { // local namespace holding [String] helper methods.

        trim : (function (REG_EXP, strRegX) {
          var regX/*regXTrim*/, getRegXLazy = (function () {
            return (regX = new REG_EXP(strRegX, ""));
          });
          return (function (str) { // kind of [String.trim].

            return str.replace((regX || getRegXLazy()), "");
          });
        })(sh.RegExp, "^\\s\\s*|\\s\\s*$"),

        shrinkWS : (function (REG_EXP, strRegX) {
          var regX/*regXSequenceWS*/, getRegXLazy = (function () {
            return (regX = new REG_EXP(strRegX, "g"));
          });
          return (function (str) { // kind of [String.shrinkWiteSpaceSequences].

            return str.replace((regX || getRegXLazy()), " ");
          });
        })(sh.RegExp, "\\s+"),

        sanitize : (function (REG_EXP, strRegX) {
          var regX/*regXSanitize*/, getRegXLazy = (function () {
            return (regX = new REG_EXP(strRegX, "g"));
          });
          return (function (str) { // kind of [String.sanitizeMediaQueryPrefix].

            return str.replace((regX || getRegXLazy()), " ");
          });
        })(sh.RegExp, "@media")
      },
      mqTest : {
        styleType : "text/css",
        cssRule : "div#css_media_query_detection{position:absolute;left:2px;top:2px;display:block;width:2px;height:2px;visibility:hidden;}"/*,
        getAssambledRule : (function (mq, rule) {return ("@media " + mq + " {" + rule + "}");})*/
      }
    },


    Controller = (function (DOCUMENT, ELM_HEAD, ELM_BODY, ELM_DIV, HELPER) { // Application Controller Singleton

      var isMQ, mqMap = {}, getIsMqByLazyMapping = (function (mq) {

        var isSupported, test = HELPER.mqTest,
        elmStyle = DOCUMENT.createElement("style");

        elmStyle.type = test.styleType;
        elmStyle.media = mq;

        if (elmStyle.styleSheet) {/*
          elmStyle.innerText = test.cssRule;*/
          elmStyle.styleSheet.cssText = test.cssRule;
        //elmStyle.styleSheet.cssText = test.getAssambledRule(mq, test.cssRule);
        } else {/*
          elmStyle.innerHTML = test.cssRule;*/
          elmStyle.appendChild(DOCUMENT.createTextNode(test.cssRule));
        //elmStyle.appendChild(DOCUMENT.createTextNode(test.getAssambledRule(mq, test.cssRule)));
        }
        ELM_DIV = (ELM_DIV || DOCUMENT.createElement("div"));
        ELM_DIV.id = "css_media_query_detection";

        ELM_HEAD.appendChild(elmStyle);
        ELM_BODY.appendChild(ELM_DIV);

        isSupported = ((ELM_DIV.offsetWidth == 2) && (ELM_DIV.offsetHeight == 2) && (ELM_DIV.offsetLeft == 2) && (ELM_DIV.offsetTop == 2));

        ELM_HEAD.removeChild(elmStyle);
        ELM_DIV = ELM_BODY.removeChild(ELM_DIV);

        return isSupported;
      }),
      trim = HELPER.Str.trim,
      shrink = HELPER.Str.shrinkWS,
      sanitize = HELPER.Str.sanitize;

      return {
        isMediaQuery : (function (mq) {

        //mq = trim(shrink(sanitize(String(mq).toLowerCase())));
          mq = trim(shrink(sanitize(("" + mq).toLowerCase())));
          isMQ = mqMap[mq];
          if (typeof isMQ == "undefined") {
            isMQ = mqMap[mq] = getIsMqByLazyMapping(mq);
          }
          return isMQ;
        })
      };
    })(doc, elmHead, elmBody, elmDiv, Helper);


    doc.isCSSMediaQuery = Controller.isMediaQuery;        // make the internal controllers method become a method of the global [document]'s object ...


   //APPLICATION.isMediaQuery = Controller.isMediaQuery;  // ... or use an own namespace instead (as suggested above) in order to nail this method onto.
   //APPLICATION.helper = Helper;


    Helper = null; delete Helper;
  } else {
    doc = docElm = elmHead = elmBody = elmDiv = null;
    delete doc; delete docElm; delete elmHead; delete elmBody; delete elmDiv;
  }
  sh = ns = null;
  delete sh; delete ns;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_THIS_APPLICATION_is_supposed_to_be_bound_to]*/);


/*
print("screen ? " + CSS_MQ.isMediaQuery("screen"));

print("print ? " + CSS_MQ.isMediaQuery("print"));
print("projection ? " + CSS_MQ.isMediaQuery("projection"));
print("handheld ? " + CSS_MQ.isMediaQuery("handheld"));

print("screen and (device-max-width: 480px) ? " + CSS_MQ.isMediaQuery("screen and (device-max-width: 480px)"));
print("screen and (device-min-width: 480px) ? " + CSS_MQ.isMediaQuery("screen and (device-min-width: 480px)"));
print("screen and (max-width: 480px) ? " + CSS_MQ.isMediaQuery("screen and (max-width: 480px)"));
print("screen and (min-width: 480px) ? " + CSS_MQ.isMediaQuery("screen and (min-width: 480px)"));
*/


print("\n");
print("screen ? " + document.isCSSMediaQuery("screen"));
print("\n");

print("print ? " + document.isCSSMediaQuery("print"));
print("projection ? " + document.isCSSMediaQuery("projection"));
print("handheld ? " + document.isCSSMediaQuery("handheld"));
print("\n");
print("\n");

print("screen and (device-max-width: 480px) ? " + document.isCSSMediaQuery("screen and (device-max-width: 480px)"));
print("screen and (device-min-width: 480px) ? " + document.isCSSMediaQuery("screen and (device-min-width: 480px)"));
print("\n");

print("screen and (device-max-width: 800px) ? " + document.isCSSMediaQuery("screen and (device-max-width: 800px)"));
print("screen and (device-min-width: 800px) ? " + document.isCSSMediaQuery("screen and (device-min-width: 800px)"));
print("\n");

print("screen and (device-max-width: 1024px) ? " + document.isCSSMediaQuery("screen and (device-max-width: 1024px)"));
print("screen and (device-min-width: 1024px) ? " + document.isCSSMediaQuery("screen and (device-min-width: 1024px)"));
print("\n");
print("\n");

print("screen and (max-width: 480px) ? " + document.isCSSMediaQuery("screen and (max-width: 480px)"));
print("screen and (min-width: 480px) ? " + document.isCSSMediaQuery("screen and (min-width: 480px)"));
print("\n");

print("screen and (max-width: 800px) ? " + document.isCSSMediaQuery("screen and (max-width: 800px)"));
print("screen and (min-width: 800px) ? " + document.isCSSMediaQuery("screen and (min-width: 800px)"));
print("\n");

print("screen and (max-width: 1024px) ? " + document.isCSSMediaQuery("screen and (max-width: 1024px)"));
print("screen and (min-width: 1024px) ? " + document.isCSSMediaQuery("screen and (min-width: 1024px)"));
print("\n");

print("screen and (max-width: 1280px) ? " + document.isCSSMediaQuery("screen and (max-width: 1280px)"));
print("screen and (min-width: 1280px) ? " + document.isCSSMediaQuery("screen and (min-width: 1280px)"));
print("\n");

print("screen and (max-width: 1600px) ? " + document.isCSSMediaQuery("screen and (max-width: 1600px)"));
print("screen and (min-width: 1600px) ? " + document.isCSSMediaQuery("screen and (min-width: 1600px)"));
print("\n");

print("screen and (max-width: 1920px) ? " + document.isCSSMediaQuery("screen and (max-width: 1920px)"));
print("screen and (min-width: 1920px) ? " + document.isCSSMediaQuery("screen and (min-width: 1920px)"));
print("\n");

print("screen and (max-width: 2048px) ? " + document.isCSSMediaQuery("screen and (max-width: 2048px)"));
print("screen and (min-width: 2048px) ? " + document.isCSSMediaQuery("screen and (min-width: 2048px)"));
print("\n");


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only   - 2.361 byte :
(function(ns){var sh=this,doc=sh&&sh.document,isGEBTN=typeof doc.getElementsByTagName=="function",docElm=doc&&(doc.documentElement||isGEBTN&&doc.getElementsByTagName("html")[0]),elmHead=docElm&&isGEBTN&&docElm.getElementsByTagName("head")[0]||docElm,elmBody=doc&&doc.body||isGEBTN&&docElm.getElementsByTagName("body")[0]||docElm,elmDiv;if(doc&&docElm){var Helper={Str:{trim:function(REG_EXP,strRegX){var regX,getRegXLazy=function(){return regX=new REG_EXP(strRegX,"")};return function(str){return str.replace(regX||getRegXLazy(),"")}}(sh.RegExp,"^\\s\\s*|\\s\\s*$"),shrinkWS:function(REG_EXP,strRegX){var regX,getRegXLazy=function(){return regX=new REG_EXP(strRegX,"g")};return function(str){return str.replace(regX||getRegXLazy()," ")}}(sh.RegExp,"\\s+"),sanitize:function(REG_EXP,strRegX){var regX,getRegXLazy=function(){return regX=new REG_EXP(strRegX,"g")};return function(str){return str.replace(regX||getRegXLazy()," ")}}(sh.RegExp,"@media")},mqTest:{styleType:"text/css",cssRule:"div#css_media_query_detection{position:absolute;left:2px;top:2px;display:block;width:2px;height:2px;visibility:hidden;}"}},Controller=function(DOCUMENT,ELM_HEAD,ELM_BODY,ELM_DIV,HELPER){var isMQ,mqMap={},getIsMqByLazyMapping=function(mq){var isSupported,test=HELPER.mqTest,elmStyle=DOCUMENT.createElement("style");elmStyle.type=test.styleType;elmStyle.media=mq;if(elmStyle.styleSheet)elmStyle.styleSheet.cssText=test.cssRule;else elmStyle.appendChild(DOCUMENT.createTextNode(test.cssRule));ELM_DIV=ELM_DIV||DOCUMENT.createElement("div");ELM_DIV.id="css_media_query_detection";ELM_HEAD.appendChild(elmStyle);ELM_BODY.appendChild(ELM_DIV);isSupported=ELM_DIV.offsetWidth==2&&ELM_DIV.offsetHeight==2&&ELM_DIV.offsetLeft==2&&ELM_DIV.offsetTop==2;ELM_HEAD.removeChild(elmStyle);ELM_DIV=ELM_BODY.removeChild(ELM_DIV);return isSupported},trim=HELPER.Str.trim,shrink=HELPER.Str.shrinkWS,sanitize=HELPER.Str.sanitize;return{isMediaQuery:function(mq){mq=trim(shrink(sanitize((""+mq).toLowerCase())));isMQ=mqMap[mq];if(typeof isMQ=="undefined")isMQ=mqMap[mq]=getIsMqByLazyMapping(mq);return isMQ}}}(doc,elmHead,elmBody,elmDiv,Helper);doc.isCSSMediaQuery=Controller.isMediaQuery;Helper=null;delete Helper}else{doc=docElm=elmHead=elmBody=elmDiv=null;delete doc;delete docElm;delete elmHead;delete elmBody;delete elmDiv}sh=ns=null;delete sh;delete ns;delete arguments.callee}).call(null);

- Simple            - 1.529 byte :
(function(p){var c=this,d=c&&c.document,i=typeof d.getElementsByTagName=="function",g=d&&(d.documentElement||i&&d.getElementsByTagName("html")[0]),j=g&&i&&g.getElementsByTagName("head")[0]||g;i=d&&d.body||i&&g.getElementsByTagName("body")[0]||g;var m;if(d&&g){c={Str:{trim:function(f,h){var e;return function(a){return a.replace(e||(e=new f(h,"")),"")}}(c.RegExp,"^\\s\\s*|\\s\\s*$"),shrinkWS:function(f,h){var e;return function(a){return a.replace(e||(e=new f(h,"g"))," ")}}(c.RegExp,"\\s+"),sanitize:function(f,h){var e;return function(a){return a.replace(e||(e=new f(h,"g"))," ")}}(c.RegExp,"@media")},mqTest:{styleType:"text/css",cssRule:"div#css_media_query_detection{position:absolute;left:2px;top:2px;display:block;width:2px;height:2px;visibility:hidden;}"}};j=function(f,h,e,a,k){var l,q={},r=k.Str.trim,s=k.Str.shrinkWS,t=k.Str.sanitize;return{isMediaQuery:function(b){b=r(s(t((""+b).toLowerCase())));l=q[b];if(typeof l=="undefined"){var u=b,n=b,o=k.mqTest;b=f.createElement("style");b.type=o.styleType;b.media=n;if(b.styleSheet)b.styleSheet.cssText=o.cssRule;else b.appendChild(f.createTextNode(o.cssRule));a=a||f.createElement("div");a.id="css_media_query_detection";h.appendChild(b);e.appendChild(a);n=a.offsetWidth==2&&a.offsetHeight==2&&a.offsetLeft==2&&a.offsetTop==2;h.removeChild(b);a=e.removeChild(a);l=q[u]=n}return l}}}(d,j,i,m,c);d.isCSSMediaQuery=j.isMediaQuery;c=null;delete c}else{d=g=j=i=m=null;delete d;delete g;delete j;delete i;delete m}c=p=null;delete c;delete p;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]

  
- packed                      - 2.423 byte :
(function(ns){var sh=this,doc=(sh&&sh.document),isGEBTN=(typeof doc.getElementsByTagName=="function"),docElm=(doc&&(doc.documentElement||(isGEBTN&&doc.getElementsByTagName("html")[0]))),elmHead=((docElm&&isGEBTN&&docElm.getElementsByTagName("head")[0])||docElm),elmBody=((doc&&doc.body)||(isGEBTN&&docElm.getElementsByTagName("body")[0])||docElm),elmDiv;if(doc&&docElm){var Helper={Str:{trim:(function(REG_EXP,strRegX){var regX,getRegXLazy=(function(){return(regX=new REG_EXP(strRegX,""))});return(function(str){return str.replace((regX||getRegXLazy()),"")})})(sh.RegExp,"^\\s\\s*|\\s\\s*$"),shrinkWS:(function(REG_EXP,strRegX){var regX,getRegXLazy=(function(){return(regX=new REG_EXP(strRegX,"g"))});return(function(str){return str.replace((regX||getRegXLazy())," ")})})(sh.RegExp,"\\s+"),sanitize:(function(REG_EXP,strRegX){var regX,getRegXLazy=(function(){return(regX=new REG_EXP(strRegX,"g"))});return(function(str){return str.replace((regX||getRegXLazy())," ")})})(sh.RegExp,"@media")},mqTest:{styleType:"text/css",cssRule:"div#css_media_query_detection{position:absolute;left:2px;top:2px;display:block;width:2px;height:2px;visibility:hidden;}"}},Controller=(function(DOCUMENT,ELM_HEAD,ELM_BODY,ELM_DIV,HELPER){var isMQ,mqMap={},getIsMqByLazyMapping=(function(mq){var isSupported,test=HELPER.mqTest,elmStyle=DOCUMENT.createElement("style");elmStyle.type=test.styleType;elmStyle.media=mq;if(elmStyle.styleSheet){elmStyle.styleSheet.cssText=test.cssRule}else{elmStyle.appendChild(DOCUMENT.createTextNode(test.cssRule))}ELM_DIV=(ELM_DIV||DOCUMENT.createElement("div"));ELM_DIV.id="css_media_query_detection";ELM_HEAD.appendChild(elmStyle);ELM_BODY.appendChild(ELM_DIV);isSupported=((ELM_DIV.offsetWidth==2)&&(ELM_DIV.offsetHeight==2)&&(ELM_DIV.offsetLeft==2)&&(ELM_DIV.offsetTop==2));ELM_HEAD.removeChild(elmStyle);ELM_DIV=ELM_BODY.removeChild(ELM_DIV);return isSupported}),trim=HELPER.Str.trim,shrink=HELPER.Str.shrinkWS,sanitize=HELPER.Str.sanitize;return{isMediaQuery:(function(mq){mq=trim(shrink(sanitize((""+mq).toLowerCase())));isMQ=mqMap[mq];if(typeof isMQ=="undefined"){isMQ=mqMap[mq]=getIsMqByLazyMapping(mq)}return isMQ})}})(doc,elmHead,elmBody,elmDiv,Helper);doc.isCSSMediaQuery=Controller.isMediaQuery;Helper=null;delete Helper}else{doc=docElm=elmHead=elmBody=elmDiv=null;delete doc;delete docElm;delete elmHead;delete elmBody;delete elmDiv}sh=ns=null;delete sh;delete ns;delete arguments.callee}).call(null);

- packed / shrinked           - 2.067 byte :
(function(i){var j=this,doc=(j&&j.document),isGEBTN=(typeof doc.getElementsByTagName=="function"),docElm=(doc&&(doc.documentElement||(isGEBTN&&doc.getElementsByTagName("html")[0]))),elmHead=((docElm&&isGEBTN&&docElm.getElementsByTagName("head")[0])||docElm),elmBody=((doc&&doc.body)||(isGEBTN&&docElm.getElementsByTagName("body")[0])||docElm),elmDiv;if(doc&&docElm){var k={Str:{trim:(function(b,c){var d,getRegXLazy=(function(){return(d=new b(c,""))});return(function(a){return a.replace((d||getRegXLazy()),"")})})(j.RegExp,"^\\s\\s*|\\s\\s*$"),shrinkWS:(function(b,c){var d,getRegXLazy=(function(){return(d=new b(c,"g"))});return(function(a){return a.replace((d||getRegXLazy())," ")})})(j.RegExp,"\\s+"),sanitize:(function(b,c){var d,getRegXLazy=(function(){return(d=new b(c,"g"))});return(function(a){return a.replace((d||getRegXLazy())," ")})})(j.RegExp,"@media")},mqTest:{styleType:"text/css",cssRule:"div#css_media_query_detection{position:absolute;left:2px;top:2px;display:block;width:2px;height:2px;visibility:hidden;}"}},Controller=(function(c,d,e,f,g){var h,mqMap={},getIsMqByLazyMapping=(function(a){var b,test=g.mqTest,elmStyle=c.createElement("style");elmStyle.type=test.styleType;elmStyle.media=a;if(elmStyle.styleSheet){elmStyle.styleSheet.cssText=test.cssRule}else{elmStyle.appendChild(c.createTextNode(test.cssRule))}f=(f||c.createElement("div"));f.id="css_media_query_detection";d.appendChild(elmStyle);e.appendChild(f);b=((f.offsetWidth==2)&&(f.offsetHeight==2)&&(f.offsetLeft==2)&&(f.offsetTop==2));d.removeChild(elmStyle);f=e.removeChild(f);return b}),trim=g.Str.trim,shrink=g.Str.shrinkWS,sanitize=g.Str.sanitize;return{isMediaQuery:(function(a){a=trim(shrink(sanitize((""+a).toLowerCase())));h=mqMap[a];if(typeof h=="undefined"){h=mqMap[a]=getIsMqByLazyMapping(a)}return h})}})(doc,elmHead,elmBody,elmDiv,k);doc.isCSSMediaQuery=Controller.isMediaQuery;k=null;delete k}else{doc=docElm=elmHead=elmBody=elmDiv=null;delete doc;delete docElm;delete elmHead;delete elmBody;delete elmDiv}j=i=null;delete j;delete i;delete arguments.callee}).call(null);


*/
