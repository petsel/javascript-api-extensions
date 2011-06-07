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

  "https://raw.github.com/petsel/javascript-api-extensions/master/core/Function/Function.modifiers.targeted.js"

  ], function () {

    alert("all scripts are present.");
  }
);



/*
  before running this test the [Function.modifiers.targeted] module needs to be present/accessible.
*/
(function () {
  var global = this,


  log = ((global.console && global.console.log) || (function (msg) {(global.print||global.alert)(msg);})),
  dir = ((global.console && global.console.dir) || (function (obj) {(global.print||global.alert)(obj.toSource && obj.toSource() || {}.toString.call(obj));})),


  TestMixin = (function () {

    log("TestMixin :: initialize : " + this.initialize);
    dir(this);

  //this.initialize = this.initialize.after(function () {
    this.initialize = this.initialize.before(function () {

      log("TestMixin :: initialize");
      dir(this);

    }, this); // each method modifiers second argument does - if provided - preserve an object methods context. method delegation to another context can be achieved as well.

    log("TestMixin :: initialize : " + this.initialize);
    dir(this);
  }),
  TestConstructor = (function () {

    log("TestConstructor :: initialize : " + this.initialize);
    dir(this);

    this.initialize = (function () {

      log("TestConstructor :: initialize");
      dir(this);
    });

    log("TestConstructor :: initialize : " + this.initialize);
    dir(this);

    TestMixin.call(this);

    log("TestConstructor :: initialize : " + this.initialize);
    dir(this);
  }),


  obj = (new TestConstructor);
  obj.initialize();

  log("obj.initialize : " + obj.initialize);
  dir(obj.initialize);
  dir(obj);


}).call(null);
