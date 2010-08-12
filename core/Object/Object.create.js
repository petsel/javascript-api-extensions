(function () {
  var global = this, Obj = global.Object, test = {proof:{}};

  Obj.create = (((typeof Obj.create == "function") && (Obj.create(test).proof === test.proof) && Obj.create) || (function (blueprint) {

    var GreenBody = (function () {});
    GreenBody.prototype = blueprint;
    return (new GreenBody);
  }));

  test = Obj = global = null;
  delete test; delete Obj; delete global;

  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 347 byte
(function(){var global=this,Obj=global.Object,test={proof:{}};Obj.create=typeof Obj.create=="function"&&Obj.create(test).proof===test.proof&&Obj.create||function(blueprint){var GreenBody=function(){};GreenBody.prototype=blueprint;return new GreenBody};test=Obj=global=null;delete test;delete Obj;delete global;delete arguments.callee}).call(null);

- Simple          - 258 byte
(function(){var c=this,a=c.Object,b={proof:{}};a.create=typeof a.create=="function"&&a.create(b).proof===b.proof&&a.create||function(e){var d=function(){};d.prototype=e;return new d};b=a=c=null;delete b;delete a;delete c;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]

- packed                      - 360 byte
(function(){var global=this,Obj=global.Object,test={proof:{}};Obj.create=(((typeof Obj.create=="function")&&(Obj.create(test).proof===test.proof)&&Obj.create)||(function(blueprint){var GreenBody=(function(){});GreenBody.prototype=blueprint;return(new GreenBody)}));test=Obj=global=null;delete test;delete Obj;delete global;delete arguments.callee}).call(null);

- packed / shrinked           - 300 byte
(function(){var c=this,Obj=c.Object,test={proof:{}};Obj.create=(((typeof Obj.create=="function")&&(Obj.create(test).proof===test.proof)&&Obj.create)||(function(a){var b=(function(){});b.prototype=a;return(new b)}));test=Obj=c=null;delete test;delete Obj;delete c;delete arguments.callee}).call(null);


*/
