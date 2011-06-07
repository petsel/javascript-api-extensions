(function (scriptList, callback) {
  var global = this,


  doc = global.document,
  elmHead = doc.getElementsByTagName("head")[0],


  sssl,
  scriptRoot = doc.createElement("script");


  scriptRoot.onload = (function () {

    sssl = (global.sssl || null);
    sssl && sssl(scriptList, callback);
  });
  scriptRoot.src = "https://raw.github.com/gist/936413/0fe67923657cbacdc48dcad6b25ef3ddc055c011";


  elmHead && elmHead.appendChild(scriptRoot);


}).call(

  null, [

  "https://raw.github.com/petsel/javascript-api-extensions/master/core/Range/Number.String.next.js",
  "https://raw.github.com/petsel/javascript-api-extensions/master/core/Range/Range.js"

  ], function () {

    alert("all scripts are present.");
  }
);
