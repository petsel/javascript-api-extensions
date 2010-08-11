(function () {

  var global = this, Obj = global.Object, test = {proof:{}};

  Obj.create = (((typeof Obj.create == "function") && (Obj.create(test).proof === test.proof) && Obj.create) || (function (blueprint) {

    var GreenBody = (function () {});
    GreenBody.prototype = blueprint;
    return (new GreenBody);
  }));

  test = Obj = global = null;
  delete test; delete Obj; delete global;

  delete arguments;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);
