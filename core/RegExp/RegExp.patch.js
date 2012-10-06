(function () {
  var global/*global object | scripting host*/ = this;


/*  newly implemented version of the aged ...
 *
 *
 *  ... [RegExp.toSearchPattern] - a way of building search strings at runtime.
 *
 *  [http://www.refactory.org/s/regexp_tosearchpattern_a_way_of_building_search_strings_at_runtime/view/latest]
 *
 *  The tool named [toSearch] is a helper method nailed statically onto the [RegExp] constructor/namespace.
 *  It does support a way of building search strings at runtime taking into account that such strings might
 *  partly contain [RegExp] pattern characters that are not supposed to be read by the [RegExp] compiler as
 *  exactly this pattern characters but rather shall be an integral part of those above mentioned searches.
 *
*/
  global.RegExp.toSearch = (function (/*Str, */REG_X_PATTERN_CHARS, REG_X_WS_SEQUENCES, WS_REPLACEMENT, masquerade) {/*

    - formerly implemented as:
      Str.prototype.toRegExpString = function () {return this.replace(/([\^\$\.\*\+\?\=\!\:\|\\\/\(\)\[\]\{\}])/g,"\\$1");};
  */
    return (function (str) {

    //return Str(str).replace(REG_X_PATTERN_CHARS, masquerade).replace(REG_X_WS_SEQUENCES, WS_REPLACEMENT);
      return ("" + str).replace(REG_X_PATTERN_CHARS, masquerade).replace(REG_X_WS_SEQUENCES, WS_REPLACEMENT);
    });
  })(
  //global.String                               /* Str */,
    (/([$^*+?!:=.|(){}[\]\\])/g)                /* REG_X_PATTERN_CHARS */,
    (/\s+/g)                                    /* REG_X_WS_SEQUENCES */,
    "\\s+"                                      /* WS_REPLACEMENT */,
    function () {return ("\\" + arguments[1]);} /* masquerade */
  );


/*
 * fix some browsers (e.g. webkit) broken prototypal [RegExp.compile] method.
*/
  (function (RegX, proto_compile, REG_X_EMPTY) {
    if ((REG_X_EMPTY.compile("(?:)", "") + "") !== (REG_X_EMPTY + "")) {

      RegX.prototype.compile = (function (/*search, flags*/) {

      //return RegX.apply(this, arguments);   // does solve the problem only half.
        proto_compile.apply(this, arguments); // solves the problem entirely.
        return this;
      });
    }
    REG_X_EMPTY = null; delete REG_X_EMPTY;
  })(global.RegExp, global.RegExp.prototype.compile, (/(?:)/));


  global = null;
  delete global;


}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 575 byte
(function(){var global=this;global.RegExp.toSearch=function(REG_X_PATTERN_CHARS,REG_X_WS_SEQUENCES,WS_REPLACEMENT,masquerade){return function(str){return(""+str).replace(REG_X_PATTERN_CHARS,masquerade).replace(REG_X_WS_SEQUENCES,WS_REPLACEMENT)}}(/([$^*+?!:=.|(){}[\]\\])/g,/\s+/g,"\\s+",function(){return"\\"+arguments[1]});(function(RegX,REG_X_EMPTY){if(REG_X_EMPTY.compile("(?:)","")+""!==REG_X_EMPTY+"")RegX.prototype.compile=function(){return RegX.apply(this,arguments)};REG_X_EMPTY=null;delete REG_X_EMPTY})(global.RegExp,/(?:)/);global=null;delete global}).call(null);

- Simple          - 357 byte
(function(){var c=this;c.RegExp.toSearch=function(b,a,c,d){return function(e){return(""+e).replace(b,d).replace(a,c)}}(/([$^*+?!:=.|(){}[\]\\])/g,/\s+/g,"\\s+",function(b,a){return"\\"+a});(function(b,a){if(a.compile("(?:)","")+""!==a+"")b.prototype.compile=function(){return b.apply(this,arguments)};delete null})(c.RegExp,/(?:)/);delete null}).call(null);


*/
