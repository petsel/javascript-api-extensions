

var ListWrapperMixin = (function (list) {

  //kind of wrapped basic [[List]] interface

    this.valueOf = (function () {
      return [].concat(list);
    });
    this.toString = (function () {
      return ("" + list);
    });
    this.getArray = (function () { // same as this instances [valueOf]
      return [].concat(list);
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
    this.length = 0;
});/*


  [http://closure-compiler.appspot.com/home]

- Whitespace only - 299 byte :
//var ListWrapperMixin=function(list){this.valueOf=function(){return[].concat(list)};this.toString=function(){return""+list};this.getArray=function(){return[].concat(list)};this.item=function(num){return list[""+~~+num]};this.size=function(){this.length=list.length;return list.length};this.length=0};

- Simple          - 265 byte :
//var ListWrapperMixin=function(a){this.valueOf=function(){return[].concat(a)};this.toString=function(){return""+a};this.getArray=function(){return[].concat(a)};this.item=function(b){return a[""+~~+b]};this.size=function(){return this.length=a.length};this.length=0};

- Advanced        - advanced compression did fail


*/ /*


  [http://dean.edwards.name/packer/]

- packed            - 315 byte :
//var ListWrapperMixin=(function(list){this.valueOf=(function(){return[].concat(list)});this.toString=(function(){return(""+list)});this.getArray=(function(){return[].concat(list)});this.item=(function(num){return list[""+(~~+num)]});this.size=(function(){this.length=list.length;return list.length});this.length=0});

- packed / shrinked - 290 byte :
//var ListWrapperMixin=(function(b){this.valueOf=(function(){return[].concat(b)});this.toString=(function(){return(""+b)});this.getArray=(function(){return[].concat(b)});this.item=(function(a){return b[""+(~~+a)]});this.size=(function(){this.length=b.length;return b.length});this.length=0});


*/
