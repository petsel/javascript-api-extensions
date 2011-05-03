

(function () {
  var global/*global object | scripting host*/ = this;


/*
 *  RegExp.toSearchPattern - a way of building search strings at runtime.
 *
 *  [http://www.refactory.org/s/regexp_tosearchpattern_a_way_of_building_search_strings_at_runtime/view/latest]
 *
 *  The tool named [toSearch] is a helper method nailed statically onto the [RegExp] constructor/namespace.
 *  It does support a way of building search strings at runtime taking into account that such strings might
 *  partly contain [RegExp] pattern characters that are not supposed to be read by the [RegExp] compiler as
 *  exactly this pattern characters but rather shall be an integral part of those above mentioned searches.
 *
*/
    global.RegExp.toSearch = (function (STRING) {/*

      - formerly implemented as:
        STRING.prototype.toRegExpString = function () {return this.replace(/([\^\$\.\*\+\?\=\!\:\|\\\/\(\)\[\]\{\}])/g,"\\$1");};
    */
      var regXPatternChars = (/([$^*+?!:=.|(){}[\]\\])/g),
      regXWSSequences = (/\s+/g),
      wsReplacement = "\\s+",
      masquerade = (function () {return ("\\" + arguments[1]);});

      return (function (str) {

        return STRING(str).replace(regXPatternChars, masquerade).replace(regXWSSequences, wsReplacement);
      });
    })(global.String);


/*
 * fix some browsers (e.g. webkit) broken prototypal [RegExp.compile] method.
*/
    (function (REG_EXP, regX) {
      if ((regX.compile("(?:)", "") + "") !== (regX + "")) {

        REG_EXP.prototype.compile = (function (/*search, flags*/) {

          return REG_EXP.apply(this, arguments);
        });
      }
      regX = null; delete regX;
    })(global.RegExp, (/(?:)/));


}).call(null);
