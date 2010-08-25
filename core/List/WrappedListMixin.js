

(function (ns/*[custom_namespace]*/) {
  var sh = this/*[global_object|scripting_host]*/,


  Arr = sh.Array,
  ArrProto = Arr.prototype,
  makeArray = (((typeof Arr.make == "function") && Arr.make) || (function (slice) {return (function (list) {return slice.call(list);});})(ArrProto.slice));


  (ns||sh)["WrappedListMixin"] = (function (make) { // [WrappedList]Mixin becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.
    return (function (list) { // basic list wrapper provided as an implemented interface


      this.toString = (function () {
        return ("" + list);
      });
      this.valueOf = this.toArray = (function () {
      //return [].concat(list);
        return make(list); // 2 times faster than [concat] variant above.
      });
      this.item = (function (num) {
      //return list[String(Number(num))];
        return list["" + (~~+num)]; // [http://mir.aculo.us/2009/11/08/6-easy-things-you-can-do-to-improve-your-javascript-runtime-performance/]
      //return list["" + Number(num)];
      });
      this.size = (function () {
        this.length = list.length; // recover/repair in case of this public property has been overwritten (either accidentally or on purpose).
        return list.length;
      });
      this.length = list.length;


      return this;
    });
  })(makeArray);


  makeArray = ArrProto = Arr = sh = ns = null;
  delete makeArray; delete ArrProto; delete Arr; delete sh; delete ns;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_WrappedListMixin_is_supposed_to_be_bound_to]*/);


/*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 650 byte :
(function(ns){var sh=this,Arr=sh.Array,ArrProto=Arr.prototype,makeArray=typeof Arr.make=="function"&&Arr.make||function(slice){return function(list){return slice.call(list)}}(ArrProto.slice);(ns||sh)["WrappedListMixin"]=function(make){return function(list){this.toString=function(){return""+list};this.valueOf=this.toArray=function(){return make(list)};this.item=function(num){return list[""+~~+num]};this.size=function(){this.length=list.length;return list.length};this.length=list.length;return this}}(makeArray);makeArray=ArrProto=Arr=sh=ns=null;delete makeArray;delete ArrProto;delete Arr;delete sh;delete ns;delete arguments.callee}).call(null);

- Simple          - 512 byte :
(function(d){var c=this,b=c.Array,e=b.prototype,g=typeof b.make=="function"&&b.make||function(f){return function(a){return f.call(a)}}(e.slice);(d||c).WrappedListMixin=function(f){return function(a){this.toString=function(){return""+a};this.valueOf=this.toArray=function(){return f(a)};this.item=function(h){return a[""+~~+h]};this.size=function(){return this.length=a.length};this.length=a.length;return this}}(g);g=e=b=c=d=null;delete g;delete e;delete b;delete c;delete d;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 674 byte :
(function(ns){var sh=this,Arr=sh.Array,ArrProto=Arr.prototype,makeArray=(((typeof Arr.make=="function")&&Arr.make)||(function(slice){return(function(list){return slice.call(list)})})(ArrProto.slice));(ns||sh)["WrappedListMixin"]=(function(make){return(function(list){this.toString=(function(){return(""+list)});this.valueOf=this.toArray=(function(){return make(list)});this.item=(function(num){return list[""+(~~+num)]});this.size=(function(){this.length=list.length;return list.length});this.length=list.length;return this})})(makeArray);makeArray=ArrProto=Arr=sh=ns=null;delete makeArray;delete ArrProto;delete Arr;delete sh;delete ns;delete arguments.callee}).call(null);

- packed / shrinked           - 620 byte :
(function(d){var e=this,Arr=e.Array,ArrProto=Arr.prototype,makeArray=(((typeof Arr.make=="function")&&Arr.make)||(function(b){return(function(a){return b.call(a)})})(ArrProto.slice));(d||e)["WrappedListMixin"]=(function(c){return(function(b){this.toString=(function(){return(""+b)});this.valueOf=this.toArray=(function(){return c(b)});this.item=(function(a){return b[""+(~~+a)]});this.size=(function(){this.length=b.length;return b.length});this.length=b.length;return this})})(makeArray);makeArray=ArrProto=Arr=e=d=null;delete makeArray;delete ArrProto;delete Arr;delete e;delete d;delete arguments.callee}).call(null);


*/ /*


  please run this simple test within [http://jconsole.com/]

*/

var obj = WrappedListMixin.call({},[9,8,7,6,5,4,3,2,1,0]);

print(obj);
print(obj.item(9));
print(obj.length);
print(obj.size);
print(obj.size());
print(obj.item);
print(obj.item(0));
print(obj.item(1));
print(obj.valueOf);
print(obj.toString);
