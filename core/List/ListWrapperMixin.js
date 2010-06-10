/*
Number.prototype.times=(function(a,b){var i=-1,num=Number(this);num=((isFinite(num)&&(typeof a=="function")&&Math.floor(num))||i);b=((((typeof b=="undefined")||((typeof b=="obj")&&!b))&&null)||b);while(++i<num){a.call(b,i,num,a)}});

var cycles = 100000;
//var mk = Array.prototype.slice;
var arr = [];
var arr01 = [];
var arr02 = [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0];

var fct = (function (idx, len, fct) {arr = arr01.concat(arr02);});
//var fct = (function (idx, len, fct) {mk.call(arr02);});

var time = new Date;
cycles.times(fct);
time = ((new Date) - time);
print("time : " + time + " msec");
*/


var ListWrapperMixin = (function (makeArray) {


    return (function (list) {

    //kind of wrapped basic [[List]] interface

      this.toString = (function () {
        return ("" + list);
      });
      this.valueOf = this.getArray = (function () {
      //return [].concat(list);
        return makeArray(list); // 2 times faster than [concat] variant above.
      });
      this.item = (function (num) {
      //return list[String(Number(num))];
        return list["" + (~~+num)]; // [http://mir.aculo.us/2009/11/08/6-easy-things-you-can-do-to-improve-your-javascript-runtime-performance/]
      //return list["" + Number(num)];
      });
      this.size = (function () {
        this.length = list.length; // repair in case of this public property has been overwritten (either accidentally or on purpose).
        return list.length;
      });
      this.length = list.length;

      return this;
  });


})((function (slice) {

  return (function (list) {return slice.call(list);});

})([].constructor.prototype.slice));/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 413 byte :
//var ListWrapperMixin=function(makeArray){return function(list){this.toString=function(){return""+list};this.valueOf=this.getArray=function(){return makeArray(list)};this.item=function(num){return list[""+~~+num]};this.size=function(){this.length=list.length;return list.length};this.length=list.length;return this}}(function(slice){return function(list){return slice.call(list)}}([].constructor.prototype.slice));

- Simple          - 349 byte :
//var ListWrapperMixin=function(b){return function(a){this.toString=function(){return""+a};this.valueOf=this.getArray=function(){return b(a)};this.item=function(c){return a[""+~~+c]};this.size=function(){return this.length=a.length};this.length=a.length;return this}}(function(b){return function(a){return b.call(a)}}([].constructor.prototype.slice));


*/ /*


  [http://dean.edwards.name/packer/]

- packed            - 431 byte :
//var ListWrapperMixin=(function(makeArray){return(function(list){this.toString=(function(){return(""+list)});this.valueOf=this.getArray=(function(){return makeArray(list)});this.item=(function(num){return list[""+(~~+num)]});this.size=(function(){this.length=list.length;return list.length});this.length=list.length;return this})})((function(slice){return(function(list){return slice.call(list)})})([].constructor.prototype.slice));

- packed / shrinked - 376 byte :
//var ListWrapperMixin=(function(c){return(function(b){this.toString=(function(){return(""+b)});this.valueOf=this.getArray=(function(){return c(b)});this.item=(function(a){return b[""+(~~+a)]});this.size=(function(){this.length=b.length;return b.length});this.length=b.length;return this})})((function(b){return(function(a){return b.call(a)})})([].constructor.prototype.slice));


*/ /*


  [http://jconsole.com/]


var obj = ListWrapperMixin.call({},[9,8,7,6,5,4,3,2,1,0]);

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


*/
