

//module base [Array.make.detect]
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){E e=19,h=e.H,u=h.Y,m=e.Z.Y,v=/^\\[G\\s+Z\\]$/,q=/^\\[G\\s+1d\\]$/,k=m.1f,w=1(){E c;P{m.O.6(I,"7");c=1(d){2 1(f,b){2 d.6(f,b)}}(m.O)}J(a){c=1(d){2 1(f,b){E l;P{l=d.6(f,b)}J(r){l=18}2 l}}(m.O)}2 c}(),j=9 e.R=="1"&&e.R||1(c){2 9 c=="1"},s=j(e.X)&&e.X||1(c,a){2 1(d){2 c.F(a.6(d))}}(/^\\[G\\s+11\\]$/,k);h.D=j(h.D)&&h.D||j(e.D)&&e.D||1(c,a){2 1(d){2 c.F(a.6(d))}}(/^\\[G\\s+H\\]$/,k);h.C=j(h.C)&&h.C||j(e.C)&&e.C||1(){2 1(){2 q.F(k.6(N))}()?1(c,a){2 1(d){2 c.F(a.6(d))}}(q,k):1(c,a,d,f){2 1(b){2!!b&&c.F(a.6(b))&&9 b.7=="K"&&d(b.7)&&!f(b,"7")}}(v,k,e.L,w)}();h.M=1(){E c,a,d,f=e.12,b=u.1c,l=f&&f.1b||[],r=f&&j(f.W)&&f.W("")||[];P{a=b.6(l);a=b.6(r);a=b.6(N);d=a.14("");8(a.7!=3||d!="H.M")S T();a=b.6(d);8(a.7!==10||a[5]!==".")S T();c=1(x,y,z){2 1(n){E t=(n||y(n))&&n.7;2 9 t=="K"&&z(t)&&x.6(n)||1e 0}}(b,s,e.L)}J(B){c=1(x,y,z,n,t,A){2 1(g){E p,i,o=(y(g)||z(g))&&x.6(g)||n(g)&&g.13("")||p;8(!o){i=g!==0&&g&&g.7;8(9 i=="K"&&t(i)){o=[];o.7=A(0,i);8(9 g.V=="1")Q(;i--;){p=g.V(i);8(i U g)o[i]=p}15 Q(;i--;){p=g[i];8(i U g)o[i]=p}}}2 o}}(b,h.D,h.C,s,e.L,1a.16)}a=d=f=b=l=r=I;4 a;4 d;4 f;4 b;4 l;4 r;2 c}("H",".","M");s=j=w=k=q=v=m=u=h=e=I;4 s;4 j;4 w;4 k;4 q;4 v;4 m;4 u;4 h;4 e;4 N.17}).6(I);',62,78,'|function|return||delete||call|length|if|typeof|||||||||||||||||||||||||||||isArgumentsArray|isArray|var|test|object|Array|null|catch|number|isFinite|make|arguments|propertyIsEnumerable|try|for|isFunction|throw|Error|in|item|getElementsByTagName|isString|prototype|Object||String|document|split|join|else|max|callee|true|this|Math|forms|slice|Arguments|void|toString'.split('|'),0,{}));



(function () {
  var sh = this/*[global_object|scripting_host]*/;


  if (!sh.Array || (typeof sh.Array.make != "function") || (typeof sh.Array.isArray != "function")) {
    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Array/Array.make.detect.js]
    throw (new sh.ReferenceError("All ECMAScript 5 conform implemented [[Array]] generics require the presence of the [[Array]] extensions module base [Array.make.detect]."));
  }
  var Arr = sh.Array, ArrProto = Arr.prototype,

  makeArray = Arr.make,
  isArray = Arr.isArray,

  NUMBER = sh.Number,
  PARSE_INT = sh.parseInt,
  IS_FINITE = sh.isFinite,
  MATH_MAX = sh.Math.max,

  TYPE_ERROR = sh.TypeError,

  throwListDelegationTypeError = (function (TypeError) {return (function () {throw (new TypeError("objects delegated via apply/call need to be some kind of list."));});})(TYPE_ERROR),
  throwListTypeError = (function (TypeError) {return (function () {throw (new TypeError("1st argument needs to be some kind of list."));});})(TYPE_ERROR),

  throwFirstArgumentFunctionTypeError = (function (TypeError) {return (function () {throw (new TypeError("1st argument needs to be a function type."));});})(TYPE_ERROR),
  throwSecondArgumentFunctionTypeError = (function (TypeError) {return (function () {throw (new TypeError("2nd argument needs to be a function type."));});})(TYPE_ERROR),

  throwSecondArgumentEmptyListTypeError = (function (TypeError) {return (function () {throw (new TypeError("2nd argument is mandatory if a list is entirely empty."));});})(TYPE_ERROR),
  throwSecondArgumentUndefinedEntriesTypeError = (function (TypeError) {return (function () {throw (new TypeError("2nd argument is mandatory if all list entries are undefined."));});})(TYPE_ERROR),

  throwThirdArgumentEmptyListTypeError = (function (TypeError) {return (function () {throw (new TypeError("3rd argument is mandatory if a list is entirely empty."));});})(TYPE_ERROR),
  throwThirdArgumentUndefinedEntriesTypeError = (function (TypeError) {return (function () {throw (new TypeError("3rd argument is mandatory if all list entries are undefined."));});})(TYPE_ERROR);



  ArrProto.forEach = (function (is, make, THROW_LIST_DELEGATION_TYPE_ERROR, THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR) {
    return (function (fct, target) {

      var arr = ((is(this) && this) || make(this) || THROW_LIST_DELEGATION_TYPE_ERROR()), len = arr.length, i = -1;
    //var arr = ((is(this) && this) || make(this) || []), len = arr.length, i = -1; // fail silently
      if (typeof fct == "function") {
/*
        target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
        while (++i < len) {
          ((i in arr) && fct.call(target, arr[i], i, arr)); // (i in arr) : countercheck on this issue with [https://bugzilla.mozilla.org/show_bug.cgi?id=475925] and [http://code.google.com/p/v8/issues/detail?id=218]
        }
*/
        if ((typeof target == "undefined") || (!target && (typeof target == "object"))) {
          while (++i < len) {
            ((i in arr) && fct(arr[i], i, arr)); // (i in arr) : countercheck on this issue with [https://bugzilla.mozilla.org/show_bug.cgi?id=475925] and [http://code.google.com/p/v8/issues/detail?id=218]
          }
        } else {
          while (++i < len) {
            ((i in arr) && fct.call(target, arr[i], i, arr)); // (i in arr) : countercheck on this issue with [https://bugzilla.mozilla.org/show_bug.cgi?id=475925] and [http://code.google.com/p/v8/issues/detail?id=218]
          }
        }
      } else {
        THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
    });
  })(isArray, makeArray, throwListDelegationTypeError, throwFirstArgumentFunctionTypeError);
/*
  ArrProto.forEach = (function (is, make) {
    return (function (fct, target) {

      var arr = ((is(this) && this) || make(this) || []/ *fail silently* /), len = arr.length, i = -1;
      if (len && (typeof fct == "function")) {
        if ((typeof target == "undefined") || (!target && (typeof target == "object"))) {
          while (++i < len) {
            ((i in arr) && fct(arr[i], i, arr)); // (i in arr) : countercheck on this issue with [https://bugzilla.mozilla.org/show_bug.cgi?id=475925] and [http://code.google.com/p/v8/issues/detail?id=218]
          }
        } else {
          while (++i < len) {
            ((i in arr) && fct.call(target, arr[i], i, arr)); // (i in arr) : countercheck on this issue with [https://bugzilla.mozilla.org/show_bug.cgi?id=475925] and [http://code.google.com/p/v8/issues/detail?id=218]
          }
        }
      }
    });
  })(isArray, makeArray);
*/


  Arr.forEach = (function (is, make, THROW_LIST_TYPE_ERROR, THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR) {
    return (function (list, fct, target) {

      var arr = ((is(list) && list) || make(list) || THROW_LIST_TYPE_ERROR()), len = arr.length, i = -1;
    //var arr = ((is(list) && list) || make(list) || []), len = arr.length, i = -1; // fail silently
      if (typeof fct == "function") {
        if ((typeof target == "undefined") || (!target && (typeof target == "object"))) {
          while (++i < len) {
            ((i in arr) && fct(arr[i], i, arr));
          }
        } else {
          while (++i < len) {
            ((i in arr) && fct.call(target, arr[i], i, arr));
          }
        }
      } else {
        THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
    });
  })(isArray, makeArray, throwListTypeError, throwSecondArgumentFunctionTypeError);
/*
  Arr.forEach = (function (is, make) {
    return (function (list, fct, target) {

      var arr = ((is(list) && list) || make(list) || []/ *fail silently* /), len = arr.length, i = -1;
      if (len && (typeof fct == "function")) {
        if ((typeof target == "undefined") || (!target && (typeof target == "object"))) {
          while (++i < len) {
            ((i in arr) && fct(arr[i], i, arr));
          }
        } else {
          while (++i < len) {
            ((i in arr) && fct.call(target, arr[i], i, arr));
          }
        }
      }
    });
  })(isArray, makeArray);
*/



  ArrProto.every = (function (is, make, THROW_LIST_DELEGATION_TYPE_ERROR, THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR) {
    return (function (fct, target) { // [http://apidock.com/ruby/Enumerable/all]

      var isAnd, arr = ((is(this) && this) || make(this) || THROW_LIST_DELEGATION_TYPE_ERROR());
    //var isAnd, arr = ((is(this) && this) || make(this) || []); // fail silently
      if (typeof fct == "function") {

        var elm, i = -1, len = arr.length, hasSome = false;// [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were unassigned/[undefined] values.
        if (len >= 1) {

          target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
          isAnd = true;
          while (isAnd && (++i < len)) {
            elm = arr[i];
            if ((typeof elm != "undefined") || (i in arr)) {
              hasSome = true;
              isAnd = fct.call(target, elm, i, arr);
            }
          }
          isAnd = (hasSome && isAnd);
        }
      } else {
        THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return !!isAnd; // prevents return of the initial [undefined] value for [isAnd].
    });
  })(isArray, makeArray, throwListDelegationTypeError, throwFirstArgumentFunctionTypeError);


  Arr.every = (function (is, make, THROW_LIST_TYPE_ERROR, THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR) {
    return (function (list, fct, target) {

      var isAnd, arr = ((is(list) && list) || make(list) || THROW_LIST_TYPE_ERROR());
    //var isAnd, arr = ((is(list) && list) || make(list) || []); // fail silently
      if (typeof fct == "function") {

        var elm, i = -1, len = arr.length, hasSome = false;// [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were unassigned/[undefined] values.
        if (len >= 1) {

          target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
          isAnd = true;
          while (isAnd && (++i < len)) {
            elm = arr[i];
            if ((typeof elm != "undefined") || (i in arr)) {
              hasSome = true;
              isAnd = fct.call(target, elm, i, arr);
            }
          }
          isAnd = (hasSome && isAnd);
        }
      } else {
        THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return !!isAnd; // prevents return of the initial [undefined] value for [isAnd].
    });
  })(isArray, makeArray, throwListTypeError, throwSecondArgumentFunctionTypeError);
//Array.every("aaaaaaaaaaa", (function (elm) {return (elm === "a");}));



  ArrProto.some = (function (is, make, THROW_LIST_DELEGATION_TYPE_ERROR, THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR) {
    return (function (fct, target) { // [http://apidock.com/ruby/Enumerable/any]

      var isOr, arr = ((is(this) && this) || make(this) || THROW_LIST_DELEGATION_TYPE_ERROR());
    //var isOr, arr = ((is(this) && this) || make(this) || []); // fail silently
      if (typeof fct == "function") {

        var elm, i = -1, len = arr.length, hasSome = false; // [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were unassigned/[undefined] values.
        if (len >= 1) {

          target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
          isOr = false;
          while (!isOr && (++i < len)) {
            elm = arr[i];
            if ((typeof elm != "undefined") || (i in arr)) {
              hasSome = true;
              isOr = fct.call(target, elm, i, arr);
            }
          }
          isOr = (hasSome && isOr);
        }
      } else {
        THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return !!isOr; // prevents return of the initial [undefined] value for [isOr].
    });
  })(isArray, makeArray, throwListDelegationTypeError, throwFirstArgumentFunctionTypeError);


  Arr.some = (function (is, make, THROW_LIST_TYPE_ERROR, THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR) {
    return (function (list, fct, target) {

      var isOr, arr = ((is(list) && list) || make(list) || THROW_LIST_TYPE_ERROR());
    //var isOr, arr = ((is(list) && list) || make(list) || []); // fail silently
      if (typeof fct == "function") {

        var elm, i = -1, len = arr.length, hasSome = false; // [hasSome] : countercheck if at least one element passes the [fct]-filter e.g. in case of all list entries were unassigned/[undefined] values.
        if (len >= 1) {

          target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
          isOr = false;
          while (!isOr && (++i < len)) {
            elm = arr[i];
            if ((typeof elm != "undefined") || (i in arr)) {
              hasSome = true;
              isOr = fct.call(target, elm, i, arr);
            }
          }
          isOr = (hasSome && isOr);
        }
      } else {
        THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return !!isOr; // prevents return of the initial [undefined] value for [isOr].
    });
  })(isArray, makeArray, throwListTypeError, throwSecondArgumentFunctionTypeError);
//Array.some("bbbbbbbbbba", (function (elm) {return (elm === "a");}));



  ArrProto.map = (function (is, make, THROW_LIST_DELEGATION_TYPE_ERROR, THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR) {
    return (function (fct, target) { // [http://apidock.com/ruby/Array/map], [http://apidock.com/ruby/Array/collect]

      var arr = [], list = ((is(this) && this) || make(this) || THROW_LIST_DELEGATION_TYPE_ERROR());
    //var arr = [], list = ((is(this) && this) || make(this) || []); // fail silently
      if (typeof fct == "function") {

        target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
        var elm, i = -1, len = list.length;
        while (++i < len) {
          elm = list[i];
          if ((typeof elm != "undefined") || (i in list)) {
            arr[i] = fct.call(target, elm, i, list);
          } else {
            arr[i] = elm;
          }
        }
      } else {
        THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return arr;
    });
  })(isArray, makeArray, throwListDelegationTypeError, throwFirstArgumentFunctionTypeError);


  Arr.map = (function (is, make, THROW_LIST_TYPE_ERROR, THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR) {
    return (function (list, fct, target) { // [http://apidock.com/ruby/Enumerable/map] - [http://apidock.com/ruby/Enumerable/collect]

      var arr = []; list = ((is(list) && list) || make(list) || THROW_LIST_TYPE_ERROR());
    //var arr = []; list = ((is(list) && list) || make(list) || []); // fail silently
      if (typeof fct == "function") {

        target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
        var elm, i = -1, len = list.length;
        while (++i < len) {
          elm = list[i];
          if ((typeof elm != "undefined") || (i in list)) {
            arr[i] = fct.call(target, elm, i, list);
          } else {
            arr[i] = elm;
          }
        }
      } else {
        THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return arr;
    });
  })(isArray, makeArray, throwListTypeError, throwSecondArgumentFunctionTypeError);



  ArrProto.filter = (function (is, make, THROW_LIST_DELEGATION_TYPE_ERROR, THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR) {
    return (function (fct, target) { // [http://apidock.com/ruby/Enumerable/select] - [http://apidock.com/ruby/Enumerable/find_all] - [http://apidock.com/ruby/Enumerable/find]

      var arr = [], list = ((is(this) && this) || make(this) || THROW_LIST_DELEGATION_TYPE_ERROR());
    //var arr = [], list = ((is(this) && this) || make(this) || []); // fail silently
      if (typeof fct == "function") {

        target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
        var elm, i = -1, len = list.length;
        while (++i < len) {
          elm = list[i];
          if ((typeof elm != "undefined") || (i in list)) {
            if (fct.call(target, elm, i, list)) {
              arr.push(elm);
            }
          }
        }
      } else {
        THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return arr;
    });
  })(isArray, makeArray, throwListDelegationTypeError, throwFirstArgumentFunctionTypeError);


  Arr.filter = (function (is, make, THROW_LIST_TYPE_ERROR, THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR) {
    return (function (list, fct, target) {

      var arr = []; list = ((is(list) && list) || make(list) || THROW_LIST_TYPE_ERROR());
    //var arr = []; list = ((is(list) && list) || make(list) || []); // fail silently
      if (typeof fct == "function") {

        target = (target || (((typeof target == "undefined") || (typeof target == "object")) ? null : target));
        var elm, i = -1, len = list.length;
        while (++i < len) {
          elm = list[i];
          if ((typeof elm != "undefined") || (i in list)) {
            if (fct.call(target, elm, i, list)) {
              arr.push(elm);
            }
          }
        }
      } else {
        THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return arr;
    });
  })(isArray, makeArray, throwListTypeError, throwSecondArgumentFunctionTypeError);



  ArrProto.reduce = (function (is, make, THROW_LIST_DELEGATION_TYPE_ERROR, THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR, THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR, THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR) {
    return (function (fct, val) { // [http://apidock.com/ruby/Enumerable/reduce]

      var list = ((is(this) && this) || make(this) || THROW_LIST_DELEGATION_TYPE_ERROR());
    //var list = ((is(this) && this) || make(this) || []); // fail silently
      if (typeof fct == "function") {

        var elm, i = 0, len = list.length, isInitalValue = (typeof val != "undefined");
        if ((len !== 0) || isInitalValue) {

          if (!isInitalValue) {
            do { // retrieve initial value in case it was not passed.
              elm = list[i];
              if ((typeof elm != "undefined") || (i in list)) {
                val = elm;
                ++i;
                break;
              }
              if (++i >= len) {
                THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR();
              }
            }
            while (true);
          }
          while (i < len) { // reduce process
            elm = list[i];
            if ((typeof elm != "undefined") || (i in list)) {
            //val = fct.call(null, val, elm, i, list);
              val = fct(val, elm, i, list);
            }
            ++i;
          }
        } else {
          THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR();
        }
      } else {
        THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return val;
    });
  })(isArray, makeArray, throwListDelegationTypeError, throwFirstArgumentFunctionTypeError, throwSecondArgumentEmptyListTypeError, throwSecondArgumentUndefinedEntriesTypeError);
/*
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduce(function (a,b) {return (a + "-" +b);});
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduce(function (a,b) {return (a + "-" +b);}, "der foenig:");
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduce(function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));});

  Array.prototype.reduce.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}));
  Array.prototype.reduce.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}), "der foenig:");
  Array.prototype.reduce.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));}));
*/

  Arr.reduce = (function (is, make, THROW_LIST_TYPE_ERROR, THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR, THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR, THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR) {
    return (function (list, fct, val) {

      list = ((is(list) && list) || make(list) || THROW_LIST_TYPE_ERROR());
    //list = ((is(list) && list) || make(list) || []); // fail silently
      if (typeof fct == "function") {

        var elm, i = 0, len = list.length, isInitalValue = (typeof val != "undefined");
        if ((len !== 0) || isInitalValue) {

          if (!isInitalValue) {
            do { // retrieve initial value in case it was not passed.
              elm = list[i];
              if ((typeof elm != "undefined") || (i in list)) {
                val = elm;
                ++i;
                break;
              }
              if (++i >= len) {
                THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR()
              }
            }
            while (true);
          }
          while (i < len) { // reduce process
            elm = list[i];
            if ((typeof elm != "undefined") || (i in list)) {
            //val = fct.call(null, val, elm, i, list);
              val = fct(val, elm, i, list);
            }
            ++i;
          }
        } else {
          THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR();
        }
      } else {
        THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return val;
    });
  })(isArray, makeArray, throwListTypeError, throwSecondArgumentFunctionTypeError, throwThirdArgumentEmptyListTypeError, throwThirdArgumentUndefinedEntriesTypeError);
/*
  Array.reduce("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}));
  Array.reduce("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}), "der foenig:");
  Array.reduce("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));}));
*/



  ArrProto.reduceRight = (function (is, make, THROW_LIST_DELEGATION_TYPE_ERROR, THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR, THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR, THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR) {
    return (function (fct, val) {

      var list = ((is(this) && this) || make(this) || THROW_LIST_DELEGATION_TYPE_ERROR());
    //var list = ((is(this) && this) || make(this) || []); // fail silently
      if (typeof fct == "function") {

        var elm, len = list.length, i = (len - 1), isInitalValue = (typeof val != "undefined");
        if ((len !== 0) || isInitalValue) {

          if (!isInitalValue) {
            do { // retrieve initial value in case it was not passed.
              elm = list[i];
              if ((typeof elm != "undefined") || (i in list)) {
                val = elm;
                --i;
                break;
              }
              if (--i < 0) {
                THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR();
              }
            }
            while (true);
          }
          while (i >= 0) { // reduce process
            elm = list[i];
            if ((typeof elm != "undefined") || (i in list)) {
            //val = fct.call(null, val, elm, i, list);
              val = fct(val, elm, i, list);
            }
            --i;
          }
        } else {
          THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR();
        }
      } else {
        THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return val;
    });
  })(isArray, makeArray, throwListDelegationTypeError, throwFirstArgumentFunctionTypeError, throwSecondArgumentEmptyListTypeError, throwSecondArgumentUndefinedEntriesTypeError);
/*
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduceRight(function (a,b) {return (a + "-" +b);});
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduceRight((function (a,b) {return (a + "-" +b);}), "der foenig:");
  ("flohmarkt, versiffte flokatis, fernlenkraketen").split("").reduceRight(function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));});

  Array.prototype.reduceRight.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}));
  Array.prototype.reduceRight.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}), "der foenig:");
  Array.prototype.reduceRight.call("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));}));
*/

  Arr.reduceRight = (function (is, make, THROW_LIST_TYPE_ERROR, THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR, THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR, THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR) {
    return (function (list, fct, val) {

      list = ((is(list) && list) || make(list) || THROW_LIST_TYPE_ERROR());
    //list = ((is(list) && list) || make(list) || []); // fail silently
      if (typeof fct == "function") {

        var elm, len = list.length, i = (len - 1), isInitalValue = (typeof val != "undefined");
        if ((len !== 0) || isInitalValue) {

          if (!isInitalValue) {
            do { // retrieve initial value in case it was not passed.
              elm = list[i];
              if ((typeof elm != "undefined") || (i in list)) {
                val = elm;
                --i;
                break;
              }
              if (--i < 0) {
                THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR();
              }
            }
            while (true);
          }
          while (i >= 0) { // reduce process
            elm = list[i];
            if ((typeof elm != "undefined") || (i in list)) {
            //val = fct.call(null, val, elm, i, list);
              val = fct(val, elm, i, list);
            }
            --i;
          }
        } else {
          THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR();
        }
      } else {
        THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();
      }
      return val;
    });
  })(isArray, makeArray, throwListTypeError, throwSecondArgumentFunctionTypeError, throwThirdArgumentEmptyListTypeError, throwThirdArgumentUndefinedEntriesTypeError);
/*
  Array.reduceRight("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}));
  Array.reduceRight("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (a + "-" +b);}), "der foenig:");
  Array.reduceRight("flohmarkt, versiffte flokatis, fernlenkraketen", (function (a,b) {return (((a == "f") ? ("k") : ((a == "k") ? ("f") : (a))) + "-" +((b == "f") ? ("k") : ((b == "k") ? ("f") : (b))));}));
*/



  ArrProto.indexOf = (function (is, make, THROW_LIST_DELEGATION_TYPE_ERROR, NUMBER, PARSE_INT, IS_FINITE, MATH_MAX) {
    return (function (obj, idx) { // [http://apidock.com/ruby/Array/index]

      var len, elm, isMember, list = ((is(this) && this) || make(this) || THROW_LIST_DELEGATION_TYPE_ERROR());
    //var len, elm, isMember, list = ((is(this) && this) || make(this) || []); // fail silently

      len = list.length;

      idx = PARSE_INT(NUMBER(idx), 10);
      idx = ((IS_FINITE(idx) && idx) || 0);
      idx = (((idx < 0) && MATH_MAX(0, (len + idx))) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf#Parameters]

      while (idx < len) {
        elm = list[idx];
        if (((typeof elm != "undefined") || (idx in list)) && (elm === obj)) {
          isMember = true;
          break;
        }
        ++idx;
      }
      return ((isMember) ? (idx) : (-1));
    });
  })(isArray, makeArray, throwListDelegationTypeError, NUMBER, PARSE_INT, IS_FINITE, MATH_MAX);
/*
  ("hallo").split("").indexOf(); // -1
  ("hallo").split("").indexOf("e"); // -1
  ("hallo").split("").indexOf("l"); // 2
  ("hallo").split("").indexOf("l", 2); // 2
  ("hallo").split("").indexOf("l", 3); // 3
  ("hallo").split("").indexOf("l", 4); // -1
  ("hallo").split("").indexOf("h"); // 0
  ("hallo").split("").indexOf("l", -4); // 2
  ("hallo").split("").indexOf("l", -3); // 2
  ("hallo").split("").indexOf("l", -2); // 3
  ("hallo").split("").indexOf("l", 7); // -1

  Array.prototype.indexOf.call("hallo"); // -1
  Array.prototype.indexOf.call("hallo", "e"); // -1
  Array.prototype.indexOf.call("hallo", "l"); // 2
  Array.prototype.indexOf.call("hallo", "l", 2); // 2
  Array.prototype.indexOf.call("hallo", "l", 3); // 3
  Array.prototype.indexOf.call("hallo", "l", 4); // -1
  Array.prototype.indexOf.call("hallo", "h"); // 0
  Array.prototype.indexOf.call("hallo", "l", -4); // 2
  Array.prototype.indexOf.call("hallo", "l", -3); // 2
  Array.prototype.indexOf.call("hallo", "l", -2); // 3
  Array.prototype.indexOf.call("hallo", "l", 7); // -1
*/

  Arr.indexOf = (function (is, make, THROW_LIST_TYPE_ERROR, NUMBER, PARSE_INT, IS_FINITE, MATH_MAX) {
    return (function (list, obj, idx) {

      var len, elm, isMember; list = ((is(list) && list) || make(list) || THROW_LIST_TYPE_ERROR());
    //var len, elm, isMember; list = ((is(list) && list) || make(list) || []); // fail silently

      len = list.length;

      idx = PARSE_INT(NUMBER(idx), 10);
      idx = ((IS_FINITE(idx) && idx) || 0);
      idx = (((idx < 0) && MATH_MAX(0, (len + idx))) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf#Parameters]

      while (idx < len) {
        elm = list[idx];
        if (((typeof elm != "undefined") || (idx in list)) && (elm === obj)) {
          isMember = true;
          break;
        }
        ++idx;
      }
      return ((isMember) ? (idx) : (-1));
    });
  })(isArray, makeArray, throwListTypeError, NUMBER, PARSE_INT, IS_FINITE, MATH_MAX);
/*
  Array.indexOf("hallo"); // -1
  Array.indexOf("hallo", "e"); // -1
  Array.indexOf("hallo", "l"); // 2
  Array.indexOf("hallo", "l", 2); // 2
  Array.indexOf("hallo", "l", 3); // 3
  Array.indexOf("hallo", "l", 4); // -1
  Array.indexOf("hallo", "h"); // 0
  Array.indexOf("hallo", "l", -4); // 2
  Array.indexOf("hallo", "l", -3); // 2
  Array.indexOf("hallo", "l", -2); // 3
  Array.indexOf("hallo", "l", 7); // -1
*/



  ArrProto.lastIndexOf = (function (is, make, THROW_LIST_DELEGATION_TYPE_ERROR, NUMBER, PARSE_INT, IS_FINITE, MATH_MAX) {
    return (function (obj, idx) { // [http://apidock.com/ruby/Array/rindex]

      var len, elm, isMember, list = ((is(this) && this) || make(this) || THROW_LIST_DELEGATION_TYPE_ERROR());
    //var len, elm, isMember, list = ((is(this) && this) || make(this) || []); // fail silently

      len = list.length;

      idx = PARSE_INT(NUMBER(idx), 10);
      idx = ((IS_FINITE(idx) && idx) || len);
      idx = (((idx < 0) && MATH_MAX(0, (len + idx))) || idx);
      idx = (((idx >= len) && (len - 1)) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf#Parameters]

      while (idx > -1) {
        elm = list[idx];
        if (((typeof elm != "undefined") || (idx in list)) && (elm === obj)) {
          isMember = true;
          break;
        }
        --idx;
      }
      return ((isMember) ? (idx) : (-1));
    });
  })(isArray, makeArray, throwListDelegationTypeError, NUMBER, PARSE_INT, IS_FINITE, MATH_MAX);
/*
  [2,3,,4,5,6].lastIndexOf(-4); // -1
  [2,3,,4,5,6].lastIndexOf(undefined, -4); // -1

  Array.prototype.lastIndexOf.apply([2,3,,4,5,6], [, -4]); // -1
  Array.prototype.lastIndexOf.apply([2,3,,4,5,6], [, -5]); // -1

  Array.prototype.lastIndexOf.apply([2,3,,4,5,6], [3, -5]); // 1
  Array.prototype.lastIndexOf.apply([2,3,,4,5,6], [4, -4]); // -1
  Array.prototype.lastIndexOf.apply([2,3,,4,5,6], [4, -3]); // 3
*/

  Arr.lastIndexOf = (function (is, make, THROW_LIST_TYPE_ERROR, NUMBER, PARSE_INT, IS_FINITE, MATH_MAX) {
    return (function (list, obj, idx) {

      var len, elm, isMember; list = ((is(list) && list) || make(list) || THROW_LIST_TYPE_ERROR());
    //var len, elm, isMember; list = ((is(list) && list) || make(list) || []); // fail silently

      len = list.length;

      idx = PARSE_INT(NUMBER(idx), 10);
      idx = ((IS_FINITE(idx) && idx) || len);
      idx = (((idx < 0) && MATH_MAX(0, (len + idx))) || idx);
      idx = (((idx >= len) && (len - 1)) || idx); // [https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/lastIndexOf#Parameters]

      while (idx > -1) {
        elm = list[idx];
        if (((typeof elm != "undefined") || (idx in list)) && (elm === obj)) {
          isMember = true;
          break;
        }
        --idx;
      }
      return ((isMember) ? (idx) : (-1));
    });
  })(isArray, makeArray, throwListTypeError, NUMBER, PARSE_INT, IS_FINITE, MATH_MAX);
/*
  Array.lastIndexOf("hallo"); // -1
  Array.lastIndexOf("hallo", "e"); // -1
  Array.lastIndexOf("hallo", "l"); // 3
  Array.lastIndexOf("hallo", "l"); // 3
  Array.lastIndexOf("hallo", "l", 2); // 2
  Array.lastIndexOf("hallo", "l", 1); // -1
  Array.lastIndexOf("hallo", "l", 4); // 3
  Array.lastIndexOf("hallo", "h"); // 0
  Array.lastIndexOf("hallo", "o"); // 4
  Array.lastIndexOf("hallo", "l", 7); // 3
  Array.lastIndexOf("hallo", "l", -2); // 3
  Array.lastIndexOf("hallo", "l", -3); // 2
  Array.lastIndexOf("hallo", "l", -4); // -1
*/


  throwThirdArgumentUndefinedEntriesTypeError = throwThirdArgumentEmptyListTypeError = null;
  throwSecondArgumentUndefinedEntriesTypeError = throwSecondArgumentEmptyListTypeError = null;
  throwSecondArgumentFunctionTypeError = throwFirstArgumentFunctionTypeError = null;
  throwListTypeError = throwListDelegationTypeError = null;

  TYPE_ERROR = MATH_MAX = IS_FINITE = PARSE_INT = NUMBER = isArray = makeArray = ArrProto = Arr = sh = null;

  delete throwThirdArgumentUndefinedEntriesTypeError; delete throwThirdArgumentEmptyListTypeError;
  delete throwSecondArgumentUndefinedEntriesTypeError; delete throwSecondArgumentEmptyListTypeError;
  delete throwSecondArgumentFunctionTypeError; delete throwFirstArgumentFunctionTypeError;
  delete throwListTypeError; delete throwListDelegationTypeError;

  delete TYPE_ERROR; delete MATH_MAX; delete IS_FINITE; delete PARSE_INT; delete NUMBER;
  delete isArray; delete makeArray; delete ArrProto; delete Arr; delete sh;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/);


/*


  ANNOTATIONS:

  - so far there seems to be at least one bug within chromes/V8's [reduce]/[reduceRight]
    methods regarding theirs second [initialValue] argument if it was/gets not passed.

  - there might be a bug as well within mozillas/chromes/operas JavaScript engines
    regarding theirs [every] method if it comes to run at completely empty arrays
    e.g. of that kind: [] or [,,,,,,,,,,,].
    any given filter function never will be used internally by [every]s process steps
    either due to such an arrays length of zero or due to such an arrays unassigned
    values.

    each of the statements beneath in my opinion should not return [true]
    but [false] instead ...

    [].every(function (elm) {return (elm === "a");});      // true
    [,,,,,].every(function (elm) {return (elm === "a");}); // true

    ... all the more for [some] on the other hand returns [false]
    for one and the same set-up ...

    [].some(function (elm) {return (elm === "a");});      // false
    [,,,,,].some(function (elm) {return (elm === "a");}); // false


    if a condition applied as logical AND ([every]) onto a list returns
    [true], the same condition applied as logical OR ([some]) onto the
    same list coercively is expected to return [true].

    the result of the above test is contradictory to logic.

*/ /*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 14.749 byte :
(function(){var sh=this;if(!sh.Array||typeof sh.Array.make!="function"||typeof sh.Array.isArray!="function")throw new sh.ReferenceError("All ECMAScript 5 conform implemented [[Array]] generics require the presence of the [[Array]] extensions module base [Array.make.detect].");var Arr=sh.Array,ArrProto=Arr.prototype,makeArray=Arr.make,isArray=Arr.isArray,NUMBER=sh.Number,PARSE_INT=sh.parseInt,IS_FINITE=sh.isFinite,MATH_MAX=sh.Math.max,TYPE_ERROR=sh.TypeError,throwListDelegationTypeError=function(TypeError){return function(){throw new TypeError("objects delegated via apply/call need to be some kind of list.");}}(TYPE_ERROR),throwListTypeError=function(TypeError){return function(){throw new TypeError("1st argument needs to be some kind of list.");}}(TYPE_ERROR),throwFirstArgumentFunctionTypeError=function(TypeError){return function(){throw new TypeError("1st argument needs to be a function type.");}}(TYPE_ERROR),throwSecondArgumentFunctionTypeError=function(TypeError){return function(){throw new TypeError("2nd argument needs to be a function type.");}}(TYPE_ERROR),throwSecondArgumentEmptyListTypeError=function(TypeError){return function(){throw new TypeError("2nd argument is mandatory if a list is entirely empty.");}}(TYPE_ERROR),throwSecondArgumentUndefinedEntriesTypeError=function(TypeError){return function(){throw new TypeError("2nd argument is mandatory if all list entries are undefined.");}}(TYPE_ERROR),throwThirdArgumentEmptyListTypeError=function(TypeError){return function(){throw new TypeError("3rd argument is mandatory if a list is entirely empty.");}}(TYPE_ERROR),throwThirdArgumentUndefinedEntriesTypeError=function(TypeError){return function(){throw new TypeError("3rd argument is mandatory if all list entries are undefined.");}}(TYPE_ERROR);ArrProto.forEach=function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR){return function(fct,target){var arr=is(this)&&this||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR();if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var elm,i=-1,len=arr.length;while(++i<len){elm=arr[i];if(typeof elm!="undefined"||i in arr)fct.call(target,elm,i,arr)}}else THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR()}}(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);Arr.forEach=function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR){return function(list,fct,target){var arr=is(list)&&list||make(list)||THROW_LIST_TYPE_ERROR();if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var elm,i=-1,len=arr.length;while(++i<len){elm=arr[i];if(typeof elm!="undefined"||i in arr)fct.call(target,elm,i,arr)}}else THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR()}}(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.every=function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR){return function(fct,target){var isAnd,arr=is(this)&&this||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR();if(typeof fct=="function"){var elm,i=-1,len=arr.length,hasSome=false;if(len>=1){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);isAnd=true;while(isAnd&&++i<len){elm=arr[i];if(typeof elm!="undefined"||i in arr){hasSome=true;isAnd=fct.call(target,elm,i,arr)}}isAnd=hasSome&&isAnd}}else THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();return!!isAnd}}(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);Arr.every=function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR){return function(list,fct,target){var isAnd,arr=is(list)&&list||make(list)||THROW_LIST_TYPE_ERROR();if(typeof fct=="function"){var elm,i=-1,len=arr.length,hasSome=false;if(len>=1){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);isAnd=true;while(isAnd&&++i<len){elm=arr[i];if(typeof elm!="undefined"||i in arr){hasSome=true;isAnd=fct.call(target,elm,i,arr)}}isAnd=hasSome&&isAnd}}else THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();return!!isAnd}}(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.some=function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR){return function(fct,target){var isOr,arr=is(this)&&this||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR();if(typeof fct=="function"){var elm,i=-1,len=arr.length,hasSome=false;if(len>=1){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);isOr=false;while(!isOr&&++i<len){elm=arr[i];if(typeof elm!="undefined"||i in arr){hasSome=true;isOr=fct.call(target,elm,i,arr)}}isOr=hasSome&&isOr}}else THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();return!!isOr}}(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);Arr.some=function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR){return function(list,fct,target){var isOr,arr=is(list)&&list||make(list)||THROW_LIST_TYPE_ERROR();if(typeof fct=="function"){var elm,i=-1,len=arr.length,hasSome=false;if(len>=1){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);isOr=false;while(!isOr&&++i<len){elm=arr[i];if(typeof elm!="undefined"||i in arr){hasSome=true;isOr=fct.call(target,elm,i,arr)}}isOr=hasSome&&isOr}}else THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();return!!isOr}}(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.map=function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR){return function(fct,target){var arr=[],list=is(this)&&this||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR();if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var elm,i=-1,len=list.length;while(++i<len){elm=list[i];if(typeof elm!="undefined"||i in list)arr[i]=fct.call(target,elm,i,list);else arr[i]=elm}}else THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();return arr}}(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);Arr.map=function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR){return function(list,fct,target){var arr=[];list=is(list)&&list||make(list)||THROW_LIST_TYPE_ERROR();if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var elm,i=-1,len=list.length;while(++i<len){elm=list[i];if(typeof elm!="undefined"||i in list)arr[i]=fct.call(target,elm,i,list);else arr[i]=elm}}else THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();return arr}}(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.filter=function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR){return function(fct,target){var arr=[],list=is(this)&&this||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR();if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var elm,i=-1,len=list.length;while(++i<len){elm=list[i];if(typeof elm!="undefined"||i in list)if(fct.call(target,elm,i,list))arr.push(elm)}}else THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();return arr}}(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);Arr.filter=function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR){return function(list,fct,target){var arr=[];list=is(list)&&list||make(list)||THROW_LIST_TYPE_ERROR();if(typeof fct=="function"){target=target||(typeof target=="undefined"||typeof target=="object"?null:target);var elm,i=-1,len=list.length;while(++i<len){elm=list[i];if(typeof elm!="undefined"||i in list)if(fct.call(target,elm,i,list))arr.push(elm)}}else THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();return arr}}(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.reduce=function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR,THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR){return function(fct,val){var list=is(this)&&this||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR();if(typeof fct=="function"){var elm,i=0,len=list.length,isInitalValue=typeof val!="undefined";if(len!==0||isInitalValue){if(!isInitalValue){do{elm=list[i];if(typeof elm!="undefined"||i in list){val=elm;++i;break}if(++i>=len)THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR()}while(true)}while(i<len){elm=list[i];if(typeof elm!="undefined"||i in list)val=fct(val,elm,i,list);++i}}else THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR()}else THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();return val}}(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError,throwSecondArgumentEmptyListTypeError,throwSecondArgumentUndefinedEntriesTypeError);Arr.reduce=function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR,THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR,THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR){return function(list,fct,val){list=is(list)&&list||make(list)||THROW_LIST_TYPE_ERROR();if(typeof fct=="function"){var elm,i=0,len=list.length,isInitalValue=typeof val!="undefined";if(len!==0||isInitalValue){if(!isInitalValue){do{elm=list[i];if(typeof elm!="undefined"||i in list){val=elm;++i;break}if(++i>=len)THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR()}while(true)}while(i<len){elm=list[i];if(typeof elm!="undefined"||i in list)val=fct(val,elm,i,list);++i}}else THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR()}else THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();return val}}(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError,throwThirdArgumentEmptyListTypeError,throwThirdArgumentUndefinedEntriesTypeError);ArrProto.reduceRight=function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR,THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR){return function(fct,val){var list=is(this)&&this||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR();if(typeof fct=="function"){var elm,len=list.length,i=len-1,isInitalValue=typeof val!="undefined";if(len!==0||isInitalValue){if(!isInitalValue){do{elm=list[i];if(typeof elm!="undefined"||i in list){val=elm;--i;break}if(--i<0)THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR()}while(true)}while(i>=0){elm=list[i];if(typeof elm!="undefined"||i in list)val=fct(val,elm,i,list);--i}}else THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR()}else THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR();return val}}(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError,throwSecondArgumentEmptyListTypeError,throwSecondArgumentUndefinedEntriesTypeError);Arr.reduceRight=function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR,THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR,THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR){return function(list,fct,val){list=is(list)&&list||make(list)||THROW_LIST_TYPE_ERROR();if(typeof fct=="function"){var elm,len=list.length,i=len-1,isInitalValue=typeof val!="undefined";if(len!==0||isInitalValue){if(!isInitalValue){do{elm=list[i];if(typeof elm!="undefined"||i in list){val=elm;--i;break}if(--i<0)THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR()}while(true)}while(i>=0){elm=list[i];if(typeof elm!="undefined"||i in list)val=fct(val,elm,i,list);--i}}else THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR()}else THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR();return val}}(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError,throwThirdArgumentEmptyListTypeError,throwThirdArgumentUndefinedEntriesTypeError);ArrProto.indexOf=function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX){return function(obj,idx){var len,elm,isMember,list=is(this)&&this||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR();len=list.length;idx=PARSE_INT(NUMBER(idx),10);idx=IS_FINITE(idx)&&idx||0;idx=idx<0&&MATH_MAX(0,len+idx)||idx;while(idx<len){elm=list[idx];if((typeof elm!="undefined"||idx in list)&&elm===obj){isMember=true;break}++idx}return isMember?idx:-1}}(isArray,makeArray,throwListDelegationTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);Arr.indexOf=function(is,make,THROW_LIST_TYPE_ERROR,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX){return function(list,obj,idx){var len,elm,isMember;list=is(list)&&list||make(list)||THROW_LIST_TYPE_ERROR();len=list.length;idx=PARSE_INT(NUMBER(idx),10);idx=IS_FINITE(idx)&&idx||0;idx=idx<0&&MATH_MAX(0,len+idx)||idx;while(idx<len){elm=list[idx];if((typeof elm!="undefined"||idx in list)&&elm===obj){isMember=true;break}++idx}return isMember?idx:-1}}(isArray,makeArray,throwListTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);ArrProto.lastIndexOf=function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX){return function(obj,idx){var len,elm,isMember,list=is(this)&&this||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR();len=list.length;idx=PARSE_INT(NUMBER(idx),10);idx=IS_FINITE(idx)&&idx||len;idx=idx<0&&MATH_MAX(0,len+idx)||idx;idx=idx>=len&&len-1||idx;while(idx>-1){elm=list[idx];if((typeof elm!="undefined"||idx in list)&&elm===obj){isMember=true;break}--idx}return isMember?idx:-1}}(isArray,makeArray,throwListDelegationTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);Arr.lastIndexOf=function(is,make,THROW_LIST_TYPE_ERROR,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX){return function(list,obj,idx){var len,elm,isMember;list=is(list)&&list||make(list)||THROW_LIST_TYPE_ERROR();len=list.length;idx=PARSE_INT(NUMBER(idx),10);idx=IS_FINITE(idx)&&idx||len;idx=idx<0&&MATH_MAX(0,len+idx)||idx;idx=idx>=len&&len-1||idx;while(idx>-1){elm=list[idx];if((typeof elm!="undefined"||idx in list)&&elm===obj){isMember=true;break}--idx}return isMember?idx:-1}}(isArray,makeArray,throwListTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);throwThirdArgumentUndefinedEntriesTypeError=throwThirdArgumentEmptyListTypeError=null;throwSecondArgumentUndefinedEntriesTypeError=throwSecondArgumentEmptyListTypeError=null;throwSecondArgumentFunctionTypeError=throwFirstArgumentFunctionTypeError=null;throwListTypeError=throwListDelegationTypeError=null;TYPE_ERROR=MATH_MAX=IS_FINITE=PARSE_INT=NUMBER=isArray=makeArray=ArrProto=Arr=sh=null;delete throwThirdArgumentUndefinedEntriesTypeError;delete throwThirdArgumentEmptyListTypeError;delete throwSecondArgumentUndefinedEntriesTypeError;delete throwSecondArgumentEmptyListTypeError;delete throwSecondArgumentFunctionTypeError;delete throwFirstArgumentFunctionTypeError;delete throwListTypeError;delete throwListDelegationTypeError;delete TYPE_ERROR;delete MATH_MAX;delete IS_FINITE;delete PARSE_INT;delete NUMBER;delete isArray;delete makeArray;delete ArrProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- Simple          -  7.003 byte :
(function(){var p=this;if(!p.Array||typeof p.Array.make!="function"||typeof p.Array.isArray!="function")throw new p.ReferenceError("All ECMAScript 5 conform implemented [[Array]] generics require the presence of the [[Array]] extensions module base [Array.make.detect].");var o=p.Array,q=o.prototype,m=o.make,n=o.isArray,w=p.Number,x=p.parseInt,y=p.isFinite,z=p.Math.max,t=p.TypeError,r=function(h){return function(){throw new h("objects delegated via apply/call need to be some kind of list.");}}(t),s=function(h){return function(){throw new h("1st argument needs to be some kind of list.");}}(t),u=function(h){return function(){throw new h("1st argument needs to be a function type.");}}(t),v=function(h){return function(){throw new h("2nd argument needs to be a function type.");}}(t),B=function(h){return function(){throw new h("2nd argument is mandatory if a list is entirely empty.");}}(t),C=function(h){return function(){throw new h("2nd argument is mandatory if all list entries are undefined.");}}(t),D=function(h){return function(){throw new h("3rd argument is mandatory if a list is entirely empty.");}}(t),E=function(h){return function(){throw new h("3rd argument is mandatory if all list entries are undefined.");}}(t);q.forEach=function(h,j,k,l){return function(f,g){var c=h(this)&&this||j(this)||k();if(typeof f=="function"){g=g||(typeof g=="undefined"||typeof g=="object"?null:g);for(var d,b=-1,a=c.length;++b<a;){d=c[b];if(typeof d!="undefined"||b in c)f.call(g,d,b,c)}}else l()}}(n,m,r,u);o.forEach=function(h,j,k,l){return function(f,g,c){f=h(f)&&f||j(f)||k();if(typeof g=="function"){c=c||(typeof c=="undefined"||typeof c=="object"?null:c);for(var d,b=-1,a=f.length;++b<a;){d=f[b];if(typeof d!="undefined"||b in f)g.call(c,d,b,f)}}else l()}}(n,m,s,v);q.every=function(h,j,k,l){return function(f,g){var c,d=h(this)&&this||j(this)||k();if(typeof f=="function"){var b,a=-1,e=d.length,i=false;if(e>=1){g=g||(typeof g=="undefined"||typeof g=="object"?null:g);for(c=true;c&&++a<e;){b=d[a];if(typeof b!="undefined"||a in d){i=true;c=f.call(g,b,a,d)}}c=i&&c}}else l();return!!c}}(n,m,r,u);o.every=function(h,j,k,l){return function(f,g,c){var d;f=h(f)&&f||j(f)||k();if(typeof g=="function"){var b,a=-1,e=f.length,i=false;if(e>=1){c=c||(typeof c=="undefined"||typeof c=="object"?null:c);for(d=true;d&&++a<e;){b=f[a];if(typeof b!="undefined"||a in f){i=true;d=g.call(c,b,a,f)}}d=i&&d}}else l();return!!d}}(n,m,s,v);q.some=function(h,j,k,l){return function(f,g){var c,d=h(this)&&this||j(this)||k();if(typeof f=="function"){var b,a=-1,e=d.length,i=false;if(e>=1){g=g||(typeof g=="undefined"||typeof g=="object"?null:g);for(c=false;!c&&++a<e;){b=d[a];if(typeof b!="undefined"||a in d){i=true;c=f.call(g,b,a,d)}}c=i&&c}}else l();return!!c}}(n,m,r,u);o.some=function(h,j,k,l){return function(f,g,c){var d;f=h(f)&&f||j(f)||k();if(typeof g=="function"){var b,a=-1,e=f.length,i=false;if(e>=1){c=c||(typeof c=="undefined"||typeof c=="object"?null:c);for(d=false;!d&&++a<e;){b=f[a];if(typeof b!="undefined"||a in f){i=true;d=g.call(c,b,a,f)}}d=i&&d}}else l();return!!d}}(n,m,s,v);q.map=function(h,j,k,l){return function(f,g){var c=[],d=h(this)&&this||j(this)||k();if(typeof f=="function"){g=g||(typeof g=="undefined"||typeof g=="object"?null:g);for(var b,a=-1,e=d.length;++a<e;){b=d[a];c[a]=typeof b!="undefined"||a in d?f.call(g,b,a,d):b}}else l();return c}}(n,m,r,u);o.map=function(h,j,k,l){return function(f,g,c){var d=[];f=h(f)&&f||j(f)||k();if(typeof g=="function"){c=c||(typeof c=="undefined"||typeof c=="object"?null:c);for(var b,a=-1,e=f.length;++a<e;){b=f[a];d[a]=typeof b!="undefined"||a in f?g.call(c,b,a,f):b}}else l();return d}}(n,m,s,v);q.filter=function(h,j,k,l){return function(f,g){var c=[],d=h(this)&&this||j(this)||k();if(typeof f=="function"){g=g||(typeof g=="undefined"||typeof g=="object"?null:g);for(var b,a=-1,e=d.length;++a<e;){b=d[a];if(typeof b!="undefined"||a in d)f.call(g,b,a,d)&&c.push(b)}}else l();return c}}(n,m,r,u);o.filter=function(h,j,k,l){return function(f,g,c){var d=[];f=h(f)&&f||j(f)||k();if(typeof g=="function"){c=c||(typeof c=="undefined"||typeof c=="object"?null:c);for(var b,a=-1,e=f.length;++a<e;){b=f[a];if(typeof b!="undefined"||a in f)g.call(c,b,a,f)&&d.push(b)}}else l();return d}}(n,m,s,v);q.reduce=function(h,j,k,l,f,g){return function(c,d){var b=h(this)&&this||j(this)||k();if(typeof c=="function"){var a,e=0,i=b.length;a=typeof d!="undefined";if(i!==0||a){if(!a){do{a=b[e];if(typeof a!="undefined"||e in b){d=a;++e;break}++e>=i&&g()}while(1)}for(;e<i;){a=b[e];if(typeof a!="undefined"||e in b)d=c(d,a,e,b);++e}}else f()}else l();return d}}(n,m,r,u,B,C);o.reduce=function(h,j,k,l,f,g){return function(c,d,b){c=h(c)&&c||j(c)||k();if(typeof d=="function"){var a,e=0,i=c.length;a=typeof b!="undefined";if(i!==0||a){if(!a){do{a=c[e];if(typeof a!="undefined"||e in c){b=a;++e;break}++e>=i&&g()}while(1)}for(;e<i;){a=c[e];if(typeof a!="undefined"||e in c)b=d(b,a,e,c);++e}}else f()}else l();return b}}(n,m,s,v,D,E);q.reduceRight=function(h,j,k,l,f,g){return function(c,d){var b=h(this)&&this||j(this)||k();if(typeof c=="function"){var a;a=b.length;var e=a-1,i=typeof d!="undefined";if(a!==0||i){if(!i){do{a=b[e];if(typeof a!="undefined"||e in b){d=a;--e;break}--e<0&&g()}while(1)}for(;e>=0;){a=b[e];if(typeof a!="undefined"||e in b)d=c(d,a,e,b);--e}}else f()}else l();return d}}(n,m,r,u,B,C);o.reduceRight=function(h,j,k,l,f,g){return function(c,d,b){c=h(c)&&c||j(c)||k();if(typeof d=="function"){var a;a=c.length;var e=a-1,i=typeof b!="undefined";if(a!==0||i){if(!i){do{a=c[e];if(typeof a!="undefined"||e in c){b=a;--e;break}--e<0&&g()}while(1)}for(;e>=0;){a=c[e];if(typeof a!="undefined"||e in c)b=d(b,a,e,c);--e}}else f()}else l();return b}}(n,m,s,v,D,E);q.indexOf=function(h,j,k,l,f,g,c){return function(d,b){var a,e,i,A=h(this)&&this||j(this)||k();a=A.length;b=f(l(b),10);b=g(b)&&b||0;for(b=b<0&&c(0,a+b)||b;b<a;){e=A[b];if((typeof e!="undefined"||b in A)&&e===d){i=true;break}++b}return i?b:-1}}(n,m,r,w,x,y,z);o.indexOf=function(h,j,k,l,f,g,c){return function(d,b,a){var e,i,A;d=h(d)&&d||j(d)||k();e=d.length;a=f(l(a),10);a=g(a)&&a||0;for(a=a<0&&c(0,e+a)||a;a<e;){i=d[a];if((typeof i!="undefined"||a in d)&&i===b){A=true;break}++a}return A?a:-1}}(n,m,s,w,x,y,z);q.lastIndexOf=function(h,j,k,l,f,g,c){return function(d,b){var a,e,i=h(this)&&this||j(this)||k();a=i.length;b=f(l(b),10);b=g(b)&&b||a;b=b<0&&c(0,a+b)||b;for(b=b>=a&&a-1||b;b>-1;){a=i[b];if((typeof a!="undefined"||b in i)&&a===d){e=true;break}--b}return e?b:-1}}(n,m,r,w,x,y,z);o.lastIndexOf=function(h,j,k,l,f,g,c){return function(d,b,a){var e,i;d=h(d)&&d||j(d)||k();e=d.length;a=f(l(a),10);a=g(a)&&a||e;a=a<0&&c(0,e+a)||a;for(a=a>=e&&e-1||a;a>-1;){e=d[a];if((typeof e!="undefined"||a in d)&&e===b){i=true;break}--a}return i?a:-1}}(n,m,s,w,x,y,z);t=z=y=x=w=n=m=q=o=p=s=r=v=u=C=B=E=D=null;delete E;delete D;delete C;delete B;delete v;delete u;delete s;delete r;delete t;delete z;delete y;delete x;delete w;delete n;delete m;delete q;delete o;delete p;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 15.252 byte :
(function(){var sh=this;if(!sh.Array||(typeof sh.Array.make!="function")||(typeof sh.Array.isArray!="function")){throw(new sh.ReferenceError("All ECMAScript 5 conform implemented [[Array]] generics require the presence of the [[Array]] extensions module base [Array.make.detect]."));}var Arr=sh.Array,ArrProto=Arr.prototype,makeArray=Arr.make,isArray=Arr.isArray,NUMBER=sh.Number,PARSE_INT=sh.parseInt,IS_FINITE=sh.isFinite,MATH_MAX=sh.Math.max,TYPE_ERROR=sh.TypeError,throwListDelegationTypeError=(function(TypeError){return(function(){throw(new TypeError("objects delegated via apply/call need to be some kind of list."));})})(TYPE_ERROR),throwListTypeError=(function(TypeError){return(function(){throw(new TypeError("1st argument needs to be some kind of list."));})})(TYPE_ERROR),throwFirstArgumentFunctionTypeError=(function(TypeError){return(function(){throw(new TypeError("1st argument needs to be a function type."));})})(TYPE_ERROR),throwSecondArgumentFunctionTypeError=(function(TypeError){return(function(){throw(new TypeError("2nd argument needs to be a function type."));})})(TYPE_ERROR),throwSecondArgumentEmptyListTypeError=(function(TypeError){return(function(){throw(new TypeError("2nd argument is mandatory if a list is entirely empty."));})})(TYPE_ERROR),throwSecondArgumentUndefinedEntriesTypeError=(function(TypeError){return(function(){throw(new TypeError("2nd argument is mandatory if all list entries are undefined."));})})(TYPE_ERROR),throwThirdArgumentEmptyListTypeError=(function(TypeError){return(function(){throw(new TypeError("3rd argument is mandatory if a list is entirely empty."));})})(TYPE_ERROR),throwThirdArgumentUndefinedEntriesTypeError=(function(TypeError){return(function(){throw(new TypeError("3rd argument is mandatory if all list entries are undefined."));})})(TYPE_ERROR);ArrProto.forEach=(function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR){return(function(fct,target){var arr=((is(this)&&this)||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR());if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var elm,i=-1,len=arr.length;while(++i<len){elm=arr[i];if((typeof elm!="undefined")||(i in arr)){fct.call(target,elm,i,arr)}}}else{THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR()}})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);Arr.forEach=(function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR){return(function(list,fct,target){var arr=((is(list)&&list)||make(list)||THROW_LIST_TYPE_ERROR());if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var elm,i=-1,len=arr.length;while(++i<len){elm=arr[i];if((typeof elm!="undefined")||(i in arr)){fct.call(target,elm,i,arr)}}}else{THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR()}})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.every=(function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR){return(function(fct,target){var isAnd,arr=((is(this)&&this)||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR());if(typeof fct=="function"){var elm,i=-1,len=arr.length,hasSome=false;if(len>=1){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));isAnd=true;while(isAnd&&(++i<len)){elm=arr[i];if((typeof elm!="undefined")||(i in arr)){hasSome=true;isAnd=fct.call(target,elm,i,arr)}}isAnd=(hasSome&&isAnd)}}else{THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR()}return!!isAnd})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);Arr.every=(function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR){return(function(list,fct,target){var isAnd,arr=((is(list)&&list)||make(list)||THROW_LIST_TYPE_ERROR());if(typeof fct=="function"){var elm,i=-1,len=arr.length,hasSome=false;if(len>=1){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));isAnd=true;while(isAnd&&(++i<len)){elm=arr[i];if((typeof elm!="undefined")||(i in arr)){hasSome=true;isAnd=fct.call(target,elm,i,arr)}}isAnd=(hasSome&&isAnd)}}else{THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR()}return!!isAnd})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.some=(function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR){return(function(fct,target){var isOr,arr=((is(this)&&this)||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR());if(typeof fct=="function"){var elm,i=-1,len=arr.length,hasSome=false;if(len>=1){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));isOr=false;while(!isOr&&(++i<len)){elm=arr[i];if((typeof elm!="undefined")||(i in arr)){hasSome=true;isOr=fct.call(target,elm,i,arr)}}isOr=(hasSome&&isOr)}}else{THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR()}return!!isOr})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);Arr.some=(function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR){return(function(list,fct,target){var isOr,arr=((is(list)&&list)||make(list)||THROW_LIST_TYPE_ERROR());if(typeof fct=="function"){var elm,i=-1,len=arr.length,hasSome=false;if(len>=1){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));isOr=false;while(!isOr&&(++i<len)){elm=arr[i];if((typeof elm!="undefined")||(i in arr)){hasSome=true;isOr=fct.call(target,elm,i,arr)}}isOr=(hasSome&&isOr)}}else{THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR()}return!!isOr})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.map=(function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR){return(function(fct,target){var arr=[],list=((is(this)&&this)||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR());if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var elm,i=-1,len=list.length;while(++i<len){elm=list[i];if((typeof elm!="undefined")||(i in list)){arr[i]=fct.call(target,elm,i,list)}else{arr[i]=elm}}}else{THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR()}return arr})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);Arr.map=(function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR){return(function(list,fct,target){var arr=[];list=((is(list)&&list)||make(list)||THROW_LIST_TYPE_ERROR());if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var elm,i=-1,len=list.length;while(++i<len){elm=list[i];if((typeof elm!="undefined")||(i in list)){arr[i]=fct.call(target,elm,i,list)}else{arr[i]=elm}}}else{THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR()}return arr})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.filter=(function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR){return(function(fct,target){var arr=[],list=((is(this)&&this)||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR());if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var elm,i=-1,len=list.length;while(++i<len){elm=list[i];if((typeof elm!="undefined")||(i in list)){if(fct.call(target,elm,i,list)){arr.push(elm)}}}}else{THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR()}return arr})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);Arr.filter=(function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR){return(function(list,fct,target){var arr=[];list=((is(list)&&list)||make(list)||THROW_LIST_TYPE_ERROR());if(typeof fct=="function"){target=(target||(((typeof target=="undefined")||(typeof target=="object"))?null:target));var elm,i=-1,len=list.length;while(++i<len){elm=list[i];if((typeof elm!="undefined")||(i in list)){if(fct.call(target,elm,i,list)){arr.push(elm)}}}}else{THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR()}return arr})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.reduce=(function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR,THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR){return(function(fct,val){var list=((is(this)&&this)||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR());if(typeof fct=="function"){var elm,i=0,len=list.length,isInitalValue=(typeof val!="undefined");if((len!==0)||isInitalValue){if(!isInitalValue){do{elm=list[i];if((typeof elm!="undefined")||(i in list)){val=elm;++i;break}if(++i>=len){THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR()}}while(true)}while(i<len){elm=list[i];if((typeof elm!="undefined")||(i in list)){val=fct(val,elm,i,list)}++i}}else{THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR()}}else{THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR()}return val})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError,throwSecondArgumentEmptyListTypeError,throwSecondArgumentUndefinedEntriesTypeError);Arr.reduce=(function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR,THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR,THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR){return(function(list,fct,val){list=((is(list)&&list)||make(list)||THROW_LIST_TYPE_ERROR());if(typeof fct=="function"){var elm,i=0,len=list.length,isInitalValue=(typeof val!="undefined");if((len!==0)||isInitalValue){if(!isInitalValue){do{elm=list[i];if((typeof elm!="undefined")||(i in list)){val=elm;++i;break}if(++i>=len){THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR()}}while(true)}while(i<len){elm=list[i];if((typeof elm!="undefined")||(i in list)){val=fct(val,elm,i,list)}++i}}else{THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR()}}else{THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR()}return val})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError,throwThirdArgumentEmptyListTypeError,throwThirdArgumentUndefinedEntriesTypeError);ArrProto.reduceRight=(function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR,THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR){return(function(fct,val){var list=((is(this)&&this)||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR());if(typeof fct=="function"){var elm,len=list.length,i=(len-1),isInitalValue=(typeof val!="undefined");if((len!==0)||isInitalValue){if(!isInitalValue){do{elm=list[i];if((typeof elm!="undefined")||(i in list)){val=elm;--i;break}if(--i<0){THROW_SECOND_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR()}}while(true)}while(i>=0){elm=list[i];if((typeof elm!="undefined")||(i in list)){val=fct(val,elm,i,list)}--i}}else{THROW_SECOND_ARGUMENT_EMPTY_LIST_TYPE_ERROR()}}else{THROW_FIRST_ARGUMENT_FUNCTION_TYPE_ERROR()}return val})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError,throwSecondArgumentEmptyListTypeError,throwSecondArgumentUndefinedEntriesTypeError);Arr.reduceRight=(function(is,make,THROW_LIST_TYPE_ERROR,THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR,THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR,THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR){return(function(list,fct,val){list=((is(list)&&list)||make(list)||THROW_LIST_TYPE_ERROR());if(typeof fct=="function"){var elm,len=list.length,i=(len-1),isInitalValue=(typeof val!="undefined");if((len!==0)||isInitalValue){if(!isInitalValue){do{elm=list[i];if((typeof elm!="undefined")||(i in list)){val=elm;--i;break}if(--i<0){THROW_THIRD_ARGUMENT_UNDEFINED_ENTRIES_TYPE_ERROR()}}while(true)}while(i>=0){elm=list[i];if((typeof elm!="undefined")||(i in list)){val=fct(val,elm,i,list)}--i}}else{THROW_THIRD_ARGUMENT_EMPTY_LIST_TYPE_ERROR()}}else{THROW_SECOND_ARGUMENT_FUNCTION_TYPE_ERROR()}return val})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError,throwThirdArgumentEmptyListTypeError,throwThirdArgumentUndefinedEntriesTypeError);ArrProto.indexOf=(function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX){return(function(obj,idx){var len,elm,isMember,list=((is(this)&&this)||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR());len=list.length;idx=PARSE_INT(NUMBER(idx),10);idx=((IS_FINITE(idx)&&idx)||0);idx=(((idx<0)&&MATH_MAX(0,(len+idx)))||idx);while(idx<len){elm=list[idx];if(((typeof elm!="undefined")||(idx in list))&&(elm===obj)){isMember=true;break}++idx}return((isMember)?(idx):(-1))})})(isArray,makeArray,throwListDelegationTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);Arr.indexOf=(function(is,make,THROW_LIST_TYPE_ERROR,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX){return(function(list,obj,idx){var len,elm,isMember;list=((is(list)&&list)||make(list)||THROW_LIST_TYPE_ERROR());len=list.length;idx=PARSE_INT(NUMBER(idx),10);idx=((IS_FINITE(idx)&&idx)||0);idx=(((idx<0)&&MATH_MAX(0,(len+idx)))||idx);while(idx<len){elm=list[idx];if(((typeof elm!="undefined")||(idx in list))&&(elm===obj)){isMember=true;break}++idx}return((isMember)?(idx):(-1))})})(isArray,makeArray,throwListTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);ArrProto.lastIndexOf=(function(is,make,THROW_LIST_DELEGATION_TYPE_ERROR,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX){return(function(obj,idx){var len,elm,isMember,list=((is(this)&&this)||make(this)||THROW_LIST_DELEGATION_TYPE_ERROR());len=list.length;idx=PARSE_INT(NUMBER(idx),10);idx=((IS_FINITE(idx)&&idx)||len);idx=(((idx<0)&&MATH_MAX(0,(len+idx)))||idx);idx=(((idx>=len)&&(len-1))||idx);while(idx>-1){elm=list[idx];if(((typeof elm!="undefined")||(idx in list))&&(elm===obj)){isMember=true;break}--idx}return((isMember)?(idx):(-1))})})(isArray,makeArray,throwListDelegationTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);Arr.lastIndexOf=(function(is,make,THROW_LIST_TYPE_ERROR,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX){return(function(list,obj,idx){var len,elm,isMember;list=((is(list)&&list)||make(list)||THROW_LIST_TYPE_ERROR());len=list.length;idx=PARSE_INT(NUMBER(idx),10);idx=((IS_FINITE(idx)&&idx)||len);idx=(((idx<0)&&MATH_MAX(0,(len+idx)))||idx);idx=(((idx>=len)&&(len-1))||idx);while(idx>-1){elm=list[idx];if(((typeof elm!="undefined")||(idx in list))&&(elm===obj)){isMember=true;break}--idx}return((isMember)?(idx):(-1))})})(isArray,makeArray,throwListTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);throwThirdArgumentUndefinedEntriesTypeError=throwThirdArgumentEmptyListTypeError=null;throwSecondArgumentUndefinedEntriesTypeError=throwSecondArgumentEmptyListTypeError=null;throwSecondArgumentFunctionTypeError=throwFirstArgumentFunctionTypeError=null;throwListTypeError=throwListDelegationTypeError=null;TYPE_ERROR=MATH_MAX=IS_FINITE=PARSE_INT=NUMBER=isArray=makeArray=ArrProto=Arr=sh=null;delete throwThirdArgumentUndefinedEntriesTypeError;delete throwThirdArgumentEmptyListTypeError;delete throwSecondArgumentUndefinedEntriesTypeError;delete throwSecondArgumentEmptyListTypeError;delete throwSecondArgumentFunctionTypeError;delete throwFirstArgumentFunctionTypeError;delete throwListTypeError;delete throwListDelegationTypeError;delete TYPE_ERROR;delete MATH_MAX;delete IS_FINITE;delete PARSE_INT;delete NUMBER;delete isArray;delete makeArray;delete ArrProto;delete Arr;delete sh;delete arguments.callee}).call(null);

- packed / shrinked           - 10.763 byte :
(function(){var l=this;if(!l.Array||(typeof l.Array.make!="function")||(typeof l.Array.isArray!="function")){throw(new l.ReferenceError("All ECMAScript 5 conform implemented [[Array]] generics require the presence of the [[Array]] extensions module base [Array.make.detect]."));}var m=l.Array,ArrProto=m.prototype,makeArray=m.make,isArray=m.isArray,NUMBER=l.Number,PARSE_INT=l.parseInt,IS_FINITE=l.isFinite,MATH_MAX=l.Math.max,TYPE_ERROR=l.TypeError,throwListDelegationTypeError=(function(a){return(function(){throw(new a("objects delegated via apply/call need to be some kind of list."));})})(TYPE_ERROR),throwListTypeError=(function(a){return(function(){throw(new a("1st argument needs to be some kind of list."));})})(TYPE_ERROR),throwFirstArgumentFunctionTypeError=(function(a){return(function(){throw(new a("1st argument needs to be a function type."));})})(TYPE_ERROR),throwSecondArgumentFunctionTypeError=(function(a){return(function(){throw(new a("2nd argument needs to be a function type."));})})(TYPE_ERROR),throwSecondArgumentEmptyListTypeError=(function(a){return(function(){throw(new a("2nd argument is mandatory if a list is entirely empty."));})})(TYPE_ERROR),throwSecondArgumentUndefinedEntriesTypeError=(function(a){return(function(){throw(new a("2nd argument is mandatory if all list entries are undefined."));})})(TYPE_ERROR),throwThirdArgumentEmptyListTypeError=(function(a){return(function(){throw(new a("3rd argument is mandatory if a list is entirely empty."));})})(TYPE_ERROR),throwThirdArgumentUndefinedEntriesTypeError=(function(a){return(function(){throw(new a("3rd argument is mandatory if all list entries are undefined."));})})(TYPE_ERROR);ArrProto.forEach=(function(e,f,g,h){return(function(a,b){var c=((e(this)&&this)||f(this)||g());if(typeof a=="function"){b=(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b));var d,i=-1,len=c.length;while(++i<len){d=c[i];if((typeof d!="undefined")||(i in c)){a.call(b,d,i,c)}}}else{h()}})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);m.forEach=(function(f,g,h,j){return(function(a,b,c){var d=((f(a)&&a)||g(a)||h());if(typeof b=="function"){c=(c||(((typeof c=="undefined")||(typeof c=="object"))?null:c));var e,i=-1,len=d.length;while(++i<len){e=d[i];if((typeof e!="undefined")||(i in d)){b.call(c,e,i,d)}}}else{j()}})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.every=(function(e,f,g,h){return(function(a,b){var c,arr=((e(this)&&this)||f(this)||g());if(typeof a=="function"){var d,i=-1,len=arr.length,hasSome=false;if(len>=1){b=(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b));c=true;while(c&&(++i<len)){d=arr[i];if((typeof d!="undefined")||(i in arr)){hasSome=true;c=a.call(b,d,i,arr)}}c=(hasSome&&c)}}else{h()}return!!c})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);m.every=(function(f,g,h,j){return(function(a,b,c){var d,arr=((f(a)&&a)||g(a)||h());if(typeof b=="function"){var e,i=-1,len=arr.length,hasSome=false;if(len>=1){c=(c||(((typeof c=="undefined")||(typeof c=="object"))?null:c));d=true;while(d&&(++i<len)){e=arr[i];if((typeof e!="undefined")||(i in arr)){hasSome=true;d=b.call(c,e,i,arr)}}d=(hasSome&&d)}}else{j()}return!!d})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.some=(function(e,f,g,h){return(function(a,b){var c,arr=((e(this)&&this)||f(this)||g());if(typeof a=="function"){var d,i=-1,len=arr.length,hasSome=false;if(len>=1){b=(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b));c=false;while(!c&&(++i<len)){d=arr[i];if((typeof d!="undefined")||(i in arr)){hasSome=true;c=a.call(b,d,i,arr)}}c=(hasSome&&c)}}else{h()}return!!c})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);m.some=(function(f,g,h,j){return(function(a,b,c){var d,arr=((f(a)&&a)||g(a)||h());if(typeof b=="function"){var e,i=-1,len=arr.length,hasSome=false;if(len>=1){c=(c||(((typeof c=="undefined")||(typeof c=="object"))?null:c));d=false;while(!d&&(++i<len)){e=arr[i];if((typeof e!="undefined")||(i in arr)){hasSome=true;d=b.call(c,e,i,arr)}}d=(hasSome&&d)}}else{j()}return!!d})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.map=(function(e,f,g,h){return(function(a,b){var c=[],list=((e(this)&&this)||f(this)||g());if(typeof a=="function"){b=(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b));var d,i=-1,len=list.length;while(++i<len){d=list[i];if((typeof d!="undefined")||(i in list)){c[i]=a.call(b,d,i,list)}else{c[i]=d}}}else{h()}return c})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);m.map=(function(f,g,h,j){return(function(a,b,c){var d=[];a=((f(a)&&a)||g(a)||h());if(typeof b=="function"){c=(c||(((typeof c=="undefined")||(typeof c=="object"))?null:c));var e,i=-1,len=a.length;while(++i<len){e=a[i];if((typeof e!="undefined")||(i in a)){d[i]=b.call(c,e,i,a)}else{d[i]=e}}}else{j()}return d})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.filter=(function(e,f,g,h){return(function(a,b){var c=[],list=((e(this)&&this)||f(this)||g());if(typeof a=="function"){b=(b||(((typeof b=="undefined")||(typeof b=="object"))?null:b));var d,i=-1,len=list.length;while(++i<len){d=list[i];if((typeof d!="undefined")||(i in list)){if(a.call(b,d,i,list)){c.push(d)}}}}else{h()}return c})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError);m.filter=(function(f,g,h,j){return(function(a,b,c){var d=[];a=((f(a)&&a)||g(a)||h());if(typeof b=="function"){c=(c||(((typeof c=="undefined")||(typeof c=="object"))?null:c));var e,i=-1,len=a.length;while(++i<len){e=a[i];if((typeof e!="undefined")||(i in a)){if(b.call(c,e,i,a)){d.push(e)}}}}else{j()}return d})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError);ArrProto.reduce=(function(e,f,g,h,j,k){return(function(a,b){var c=((e(this)&&this)||f(this)||g());if(typeof a=="function"){var d,i=0,len=c.length,isInitalValue=(typeof b!="undefined");if((len!==0)||isInitalValue){if(!isInitalValue){do{d=c[i];if((typeof d!="undefined")||(i in c)){b=d;++i;break}if(++i>=len){k()}}while(true)}while(i<len){d=c[i];if((typeof d!="undefined")||(i in c)){b=a(b,d,i,c)}++i}}else{j()}}else{h()}return b})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError,throwSecondArgumentEmptyListTypeError,throwSecondArgumentUndefinedEntriesTypeError);m.reduce=(function(e,f,g,h,j,k){return(function(a,b,c){a=((e(a)&&a)||f(a)||g());if(typeof b=="function"){var d,i=0,len=a.length,isInitalValue=(typeof c!="undefined");if((len!==0)||isInitalValue){if(!isInitalValue){do{d=a[i];if((typeof d!="undefined")||(i in a)){c=d;++i;break}if(++i>=len){k()}}while(true)}while(i<len){d=a[i];if((typeof d!="undefined")||(i in a)){c=b(c,d,i,a)}++i}}else{j()}}else{h()}return c})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError,throwThirdArgumentEmptyListTypeError,throwThirdArgumentUndefinedEntriesTypeError);ArrProto.reduceRight=(function(e,f,g,h,j,k){return(function(a,b){var c=((e(this)&&this)||f(this)||g());if(typeof a=="function"){var d,len=c.length,i=(len-1),isInitalValue=(typeof b!="undefined");if((len!==0)||isInitalValue){if(!isInitalValue){do{d=c[i];if((typeof d!="undefined")||(i in c)){b=d;--i;break}if(--i<0){k()}}while(true)}while(i>=0){d=c[i];if((typeof d!="undefined")||(i in c)){b=a(b,d,i,c)}--i}}else{j()}}else{h()}return b})})(isArray,makeArray,throwListDelegationTypeError,throwFirstArgumentFunctionTypeError,throwSecondArgumentEmptyListTypeError,throwSecondArgumentUndefinedEntriesTypeError);m.reduceRight=(function(e,f,g,h,j,k){return(function(a,b,c){a=((e(a)&&a)||f(a)||g());if(typeof b=="function"){var d,len=a.length,i=(len-1),isInitalValue=(typeof c!="undefined");if((len!==0)||isInitalValue){if(!isInitalValue){do{d=a[i];if((typeof d!="undefined")||(i in a)){c=d;--i;break}if(--i<0){k()}}while(true)}while(i>=0){d=a[i];if((typeof d!="undefined")||(i in a)){c=b(c,d,i,a)}--i}}else{j()}}else{h()}return c})})(isArray,makeArray,throwListTypeError,throwSecondArgumentFunctionTypeError,throwThirdArgumentEmptyListTypeError,throwThirdArgumentUndefinedEntriesTypeError);ArrProto.indexOf=(function(d,e,f,g,h,i,j){return(function(a,b){var c,elm,isMember,list=((d(this)&&this)||e(this)||f());c=list.length;b=h(g(b),10);b=((i(b)&&b)||0);b=(((b<0)&&j(0,(c+b)))||b);while(b<c){elm=list[b];if(((typeof elm!="undefined")||(b in list))&&(elm===a)){isMember=true;break}++b}return((isMember)?(b):(-1))})})(isArray,makeArray,throwListDelegationTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);m.indexOf=(function(e,f,g,h,i,j,k){return(function(a,b,c){var d,elm,isMember;a=((e(a)&&a)||f(a)||g());d=a.length;c=i(h(c),10);c=((j(c)&&c)||0);c=(((c<0)&&k(0,(d+c)))||c);while(c<d){elm=a[c];if(((typeof elm!="undefined")||(c in a))&&(elm===b)){isMember=true;break}++c}return((isMember)?(c):(-1))})})(isArray,makeArray,throwListTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);ArrProto.lastIndexOf=(function(d,e,f,g,h,i,j){return(function(a,b){var c,elm,isMember,list=((d(this)&&this)||e(this)||f());c=list.length;b=h(g(b),10);b=((i(b)&&b)||c);b=(((b<0)&&j(0,(c+b)))||b);b=(((b>=c)&&(c-1))||b);while(b>-1){elm=list[b];if(((typeof elm!="undefined")||(b in list))&&(elm===a)){isMember=true;break}--b}return((isMember)?(b):(-1))})})(isArray,makeArray,throwListDelegationTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);m.lastIndexOf=(function(e,f,g,h,i,j,k){return(function(a,b,c){var d,elm,isMember;a=((e(a)&&a)||f(a)||g());d=a.length;c=i(h(c),10);c=((j(c)&&c)||d);c=(((c<0)&&k(0,(d+c)))||c);c=(((c>=d)&&(d-1))||c);while(c>-1){elm=a[c];if(((typeof elm!="undefined")||(c in a))&&(elm===b)){isMember=true;break}--c}return((isMember)?(c):(-1))})})(isArray,makeArray,throwListTypeError,NUMBER,PARSE_INT,IS_FINITE,MATH_MAX);throwThirdArgumentUndefinedEntriesTypeError=throwThirdArgumentEmptyListTypeError=null;throwSecondArgumentUndefinedEntriesTypeError=throwSecondArgumentEmptyListTypeError=null;throwSecondArgumentFunctionTypeError=throwFirstArgumentFunctionTypeError=null;throwListTypeError=throwListDelegationTypeError=null;TYPE_ERROR=MATH_MAX=IS_FINITE=PARSE_INT=NUMBER=isArray=makeArray=ArrProto=m=l=null;delete throwThirdArgumentUndefinedEntriesTypeError;delete throwThirdArgumentEmptyListTypeError;delete throwSecondArgumentUndefinedEntriesTypeError;delete throwSecondArgumentEmptyListTypeError;delete throwSecondArgumentFunctionTypeError;delete throwFirstArgumentFunctionTypeError;delete throwListTypeError;delete throwListDelegationTypeError;delete TYPE_ERROR;delete MATH_MAX;delete IS_FINITE;delete PARSE_INT;delete NUMBER;delete isArray;delete makeArray;delete ArrProto;delete m;delete l;delete arguments.callee}).call(null);

- packed / shrinked / encoded -  6.280 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(){9 l=n;4(!l.R||(3 l.R.17!="2")||(3 l.R.p!="2")){M(L l.1v("1E 1F 5 1H 1J [[R]] 1L 1N 1r 1u 16 1r [[R]] 1w 1z 1B [R.17.1D]."));}9 m=l.R,F=m.1G,s=m.17,p=m.p,T=l.1I,S=l.1K,O=l.1M,Q=l.1O.1P,H=l.1t,C=(2(a){6(2(){M(L a("1x 1y 1Q 1A/D 1C 14 13 11 1h 16 o."));})})(H),A=(2(a){6(2(){M(L a("1g P 18 14 13 11 1h 16 o."));})})(H),K=(2(a){6(2(){M(L a("1g P 18 14 13 a 2 1a."));})})(H),I=(2(a){6(2(){M(L a("19 P 18 14 13 a 2 1a."));})})(H),Z=(2(a){6(2(){M(L a("19 P U 15 4 a o U 1n 1k."));})})(H),W=(2(a){6(2(){M(L a("19 P U 15 4 1j o 1i 1b 8."));})})(H),Y=(2(a){6(2(){M(L a("1p P U 15 4 a o U 1n 1k."));})})(H),X=(2(a){6(2(){M(L a("1p P U 15 4 1j o 1i 1b 8."));})})(H);F.1s=(2(e,f,g,h){6(2(a,b){9 c=((e(n)&&n)||f(n)||g());4(3 a=="2"){b=(b||(((3 b=="8")||(3 b=="J"))?x:b));9 d,i=-1,7=c.w;r(++i<7){d=c[i];4((3 d!="8")||(i q c)){a.D(b,d,i,c)}}}t{h()}})})(p,s,C,K);m.1s=(2(f,g,h,j){6(2(a,b,c){9 d=((f(a)&&a)||g(a)||h());4(3 b=="2"){c=(c||(((3 c=="8")||(3 c=="J"))?x:c));9 e,i=-1,7=d.w;r(++i<7){e=d[i];4((3 e!="8")||(i q d)){b.D(c,e,i,d)}}}t{j()}})})(p,s,A,I);F.1o=(2(e,f,g,h){6(2(a,b){9 c,u=((e(n)&&n)||f(n)||g());4(3 a=="2"){9 d,i=-1,7=u.w,G=V;4(7>=1){b=(b||(((3 b=="8")||(3 b=="J"))?x:b));c=z;r(c&&(++i<7)){d=u[i];4((3 d!="8")||(i q u)){G=z;c=a.D(b,d,i,u)}}c=(G&&c)}}t{h()}6!!c})})(p,s,C,K);m.1o=(2(f,g,h,j){6(2(a,b,c){9 d,u=((f(a)&&a)||g(a)||h());4(3 b=="2"){9 e,i=-1,7=u.w,G=V;4(7>=1){c=(c||(((3 c=="8")||(3 c=="J"))?x:c));d=z;r(d&&(++i<7)){e=u[i];4((3 e!="8")||(i q u)){G=z;d=b.D(c,e,i,u)}}d=(G&&d)}}t{j()}6!!d})})(p,s,A,I);F.11=(2(e,f,g,h){6(2(a,b){9 c,u=((e(n)&&n)||f(n)||g());4(3 a=="2"){9 d,i=-1,7=u.w,G=V;4(7>=1){b=(b||(((3 b=="8")||(3 b=="J"))?x:b));c=V;r(!c&&(++i<7)){d=u[i];4((3 d!="8")||(i q u)){G=z;c=a.D(b,d,i,u)}}c=(G&&c)}}t{h()}6!!c})})(p,s,C,K);m.11=(2(f,g,h,j){6(2(a,b,c){9 d,u=((f(a)&&a)||g(a)||h());4(3 b=="2"){9 e,i=-1,7=u.w,G=V;4(7>=1){c=(c||(((3 c=="8")||(3 c=="J"))?x:c));d=V;r(!d&&(++i<7)){e=u[i];4((3 e!="8")||(i q u)){G=z;d=b.D(c,e,i,u)}}d=(G&&d)}}t{j()}6!!d})})(p,s,A,I);F.1c=(2(e,f,g,h){6(2(a,b){9 c=[],o=((e(n)&&n)||f(n)||g());4(3 a=="2"){b=(b||(((3 b=="8")||(3 b=="J"))?x:b));9 d,i=-1,7=o.w;r(++i<7){d=o[i];4((3 d!="8")||(i q o)){c[i]=a.D(b,d,i,o)}t{c[i]=d}}}t{h()}6 c})})(p,s,C,K);m.1c=(2(f,g,h,j){6(2(a,b,c){9 d=[];a=((f(a)&&a)||g(a)||h());4(3 b=="2"){c=(c||(((3 c=="8")||(3 c=="J"))?x:c));9 e,i=-1,7=a.w;r(++i<7){e=a[i];4((3 e!="8")||(i q a)){d[i]=b.D(c,e,i,a)}t{d[i]=e}}}t{j()}6 d})})(p,s,A,I);F.1d=(2(e,f,g,h){6(2(a,b){9 c=[],o=((e(n)&&n)||f(n)||g());4(3 a=="2"){b=(b||(((3 b=="8")||(3 b=="J"))?x:b));9 d,i=-1,7=o.w;r(++i<7){d=o[i];4((3 d!="8")||(i q o)){4(a.D(b,d,i,o)){c.1e(d)}}}}t{h()}6 c})})(p,s,C,K);m.1d=(2(f,g,h,j){6(2(a,b,c){9 d=[];a=((f(a)&&a)||g(a)||h());4(3 b=="2"){c=(c||(((3 c=="8")||(3 c=="J"))?x:c));9 e,i=-1,7=a.w;r(++i<7){e=a[i];4((3 e!="8")||(i q a)){4(b.D(c,e,i,a)){d.1e(e)}}}}t{j()}6 d})})(p,s,A,I);F.1f=(2(e,f,g,h,j,k){6(2(a,b){9 c=((e(n)&&n)||f(n)||g());4(3 a=="2"){9 d,i=0,7=c.w,B=(3 b!="8");4((7!==0)||B){4(!B){12{d=c[i];4((3 d!="8")||(i q c)){b=d;++i;N}4(++i>=7){k()}}r(z)}r(i<7){d=c[i];4((3 d!="8")||(i q c)){b=a(b,d,i,c)}++i}}t{j()}}t{h()}6 b})})(p,s,C,K,Z,W);m.1f=(2(e,f,g,h,j,k){6(2(a,b,c){a=((e(a)&&a)||f(a)||g());4(3 b=="2"){9 d,i=0,7=a.w,B=(3 c!="8");4((7!==0)||B){4(!B){12{d=a[i];4((3 d!="8")||(i q a)){c=d;++i;N}4(++i>=7){k()}}r(z)}r(i<7){d=a[i];4((3 d!="8")||(i q a)){c=b(c,d,i,a)}++i}}t{j()}}t{h()}6 c})})(p,s,A,I,Y,X);F.1l=(2(e,f,g,h,j,k){6(2(a,b){9 c=((e(n)&&n)||f(n)||g());4(3 a=="2"){9 d,7=c.w,i=(7-1),B=(3 b!="8");4((7!==0)||B){4(!B){12{d=c[i];4((3 d!="8")||(i q c)){b=d;--i;N}4(--i<0){k()}}r(z)}r(i>=0){d=c[i];4((3 d!="8")||(i q c)){b=a(b,d,i,c)}--i}}t{j()}}t{h()}6 b})})(p,s,C,K,Z,W);m.1l=(2(e,f,g,h,j,k){6(2(a,b,c){a=((e(a)&&a)||f(a)||g());4(3 b=="2"){9 d,7=a.w,i=(7-1),B=(3 c!="8");4((7!==0)||B){4(!B){12{d=a[i];4((3 d!="8")||(i q a)){c=d;--i;N}4(--i<0){k()}}r(z)}r(i>=0){d=a[i];4((3 d!="8")||(i q a)){c=b(c,d,i,a)}--i}}t{j()}}t{h()}6 c})})(p,s,A,I,Y,X);F.1m=(2(d,e,f,g,h,i,j){6(2(a,b){9 c,y,E,o=((d(n)&&n)||e(n)||f());c=o.w;b=h(g(b),10);b=((i(b)&&b)||0);b=(((b<0)&&j(0,(c+b)))||b);r(b<c){y=o[b];4(((3 y!="8")||(b q o))&&(y===a)){E=z;N}++b}6((E)?(b):(-1))})})(p,s,C,T,S,O,Q);m.1m=(2(e,f,g,h,i,j,k){6(2(a,b,c){9 d,y,E;a=((e(a)&&a)||f(a)||g());d=a.w;c=i(h(c),10);c=((j(c)&&c)||0);c=(((c<0)&&k(0,(d+c)))||c);r(c<d){y=a[c];4(((3 y!="8")||(c q a))&&(y===b)){E=z;N}++c}6((E)?(c):(-1))})})(p,s,A,T,S,O,Q);F.1q=(2(d,e,f,g,h,i,j){6(2(a,b){9 c,y,E,o=((d(n)&&n)||e(n)||f());c=o.w;b=h(g(b),10);b=((i(b)&&b)||c);b=(((b<0)&&j(0,(c+b)))||b);b=(((b>=c)&&(c-1))||b);r(b>-1){y=o[b];4(((3 y!="8")||(b q o))&&(y===a)){E=z;N}--b}6((E)?(b):(-1))})})(p,s,C,T,S,O,Q);m.1q=(2(e,f,g,h,i,j,k){6(2(a,b,c){9 d,y,E;a=((e(a)&&a)||f(a)||g());d=a.w;c=i(h(c),10);c=((j(c)&&c)||d);c=(((c<0)&&k(0,(d+c)))||c);c=(((c>=d)&&(d-1))||c);r(c>-1){y=a[c];4(((3 y!="8")||(c q a))&&(y===b)){E=z;N}--c}6((E)?(c):(-1))})})(p,s,A,T,S,O,Q);X=Y=x;W=Z=x;I=K=x;A=C=x;H=Q=O=S=T=p=s=F=m=l=x;v X;v Y;v W;v Z;v I;v K;v A;v C;v H;v Q;v O;v S;v T;v p;v s;v F;v m;v l;v 1R.1S}).D(x);',62,117,'||function|typeof|if||return|len|undefined|var||||||||||||||this|list|isArray|in|while|makeArray|else|arr|delete|length|null|elm|true|throwListTypeError|isInitalValue|throwListDelegationTypeError|call|isMember|ArrProto|hasSome|TYPE_ERROR|throwSecondArgumentFunctionTypeError|object|throwFirstArgumentFunctionTypeError|new|throw|break|IS_FINITE|argument|MATH_MAX|Array|PARSE_INT|NUMBER|is|false|throwSecondArgumentUndefinedEntriesTypeError|throwThirdArgumentUndefinedEntriesTypeError|throwThirdArgumentEmptyListTypeError|throwSecondArgumentEmptyListTypeError||some|do|be|to|mandatory|of|make|needs|2nd|type|are|map|filter|push|reduce|1st|kind|entries|all|empty|reduceRight|indexOf|entirely|every|3rd|lastIndexOf|the|forEach|TypeError|presence|ReferenceError|extensions|objects|delegated|module|apply|base|need|detect|All|ECMAScript|prototype|conform|Number|implemented|parseInt|generics|isFinite|require|Math|max|via|arguments|callee'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    -  5.383 byte :
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(){8 p=9;4(!p.R||3 p.R.15!="2"||3 p.R.1q!="2")O P p.1C("1s 1t 5 1A 1z [[R]] 1Q 1P 1g 1O 14 1g [[R]] 1L 1K 1J [R.15.1I].");8 o=p.R,q=o.1H,m=o.15,n=o.1q,w=p.1G,x=p.1F,y=p.1E,z=p.1D.1r,t=p.1B,r=2(h){6 2(){O P h("1y 1x 1w 1v/L 1u X W 11 1m 14 V.");}}(t),s=2(h){6 2(){O P h("1b S 13 X W 11 1m 14 V.");}}(t),u=2(h){6 2(){O P h("1b S 13 X W a 2 1i.");}}(t),v=2(h){6 2(){O P h("16 S 13 X W a 2 1i.");}}(t),B=2(h){6 2(){O P h("16 S U Y 4 a V U 1o 1p.");}}(t),C=2(h){6 2(){O P h("16 S U Y 4 18 V 19 1a 7.");}}(t),D=2(h){6 2(){O P h("1d S U Y 4 a V U 1o 1p.");}}(t),E=2(h){6 2(){O P h("1d S U Y 4 18 V 19 1a 7.");}}(t);q.1f=2(h,j,k,l){6 2(f,g){8 c=h(9)&&9||j(9)||k();4(3 f=="2"){g=g||(3 g=="7"||3 g=="M"?K:g);H(8 d,b=-1,a=c.J;++b<a;){d=c[b];4(3 d!="7"||b F c)f.L(g,d,b,c)}}I l()}}(n,m,r,u);o.1f=2(h,j,k,l){6 2(f,g,c){f=h(f)&&f||j(f)||k();4(3 g=="2"){c=c||(3 c=="7"||3 c=="M"?K:c);H(8 d,b=-1,a=f.J;++b<a;){d=f[b];4(3 d!="7"||b F f)g.L(c,d,b,f)}}I l()}}(n,m,s,v);q.1e=2(h,j,k,l){6 2(f,g){8 c,d=h(9)&&9||j(9)||k();4(3 f=="2"){8 b,a=-1,e=d.J,i=T;4(e>=1){g=g||(3 g=="7"||3 g=="M"?K:g);H(c=N;c&&++a<e;){b=d[a];4(3 b!="7"||a F d){i=N;c=f.L(g,b,a,d)}}c=i&&c}}I l();6!!c}}(n,m,r,u);o.1e=2(h,j,k,l){6 2(f,g,c){8 d;f=h(f)&&f||j(f)||k();4(3 g=="2"){8 b,a=-1,e=f.J,i=T;4(e>=1){c=c||(3 c=="7"||3 c=="M"?K:c);H(d=N;d&&++a<e;){b=f[a];4(3 b!="7"||a F f){i=N;d=g.L(c,b,a,f)}}d=i&&d}}I l();6!!d}}(n,m,s,v);q.11=2(h,j,k,l){6 2(f,g){8 c,d=h(9)&&9||j(9)||k();4(3 f=="2"){8 b,a=-1,e=d.J,i=T;4(e>=1){g=g||(3 g=="7"||3 g=="M"?K:g);H(c=T;!c&&++a<e;){b=d[a];4(3 b!="7"||a F d){i=N;c=f.L(g,b,a,d)}}c=i&&c}}I l();6!!c}}(n,m,r,u);o.11=2(h,j,k,l){6 2(f,g,c){8 d;f=h(f)&&f||j(f)||k();4(3 g=="2"){8 b,a=-1,e=f.J,i=T;4(e>=1){c=c||(3 c=="7"||3 c=="M"?K:c);H(d=T;!d&&++a<e;){b=f[a];4(3 b!="7"||a F f){i=N;d=g.L(c,b,a,f)}}d=i&&d}}I l();6!!d}}(n,m,s,v);q.1n=2(h,j,k,l){6 2(f,g){8 c=[],d=h(9)&&9||j(9)||k();4(3 f=="2"){g=g||(3 g=="7"||3 g=="M"?K:g);H(8 b,a=-1,e=d.J;++a<e;){b=d[a];c[a]=3 b!="7"||a F d?f.L(g,b,a,d):b}}I l();6 c}}(n,m,r,u);o.1n=2(h,j,k,l){6 2(f,g,c){8 d=[];f=h(f)&&f||j(f)||k();4(3 g=="2"){c=c||(3 c=="7"||3 c=="M"?K:c);H(8 b,a=-1,e=f.J;++a<e;){b=f[a];d[a]=3 b!="7"||a F f?g.L(c,b,a,f):b}}I l();6 d}}(n,m,s,v);q.1k=2(h,j,k,l){6 2(f,g){8 c=[],d=h(9)&&9||j(9)||k();4(3 f=="2"){g=g||(3 g=="7"||3 g=="M"?K:g);H(8 b,a=-1,e=d.J;++a<e;){b=d[a];4(3 b!="7"||a F d)f.L(g,b,a,d)&&c.1h(b)}}I l();6 c}}(n,m,r,u);o.1k=2(h,j,k,l){6 2(f,g,c){8 d=[];f=h(f)&&f||j(f)||k();4(3 g=="2"){c=c||(3 c=="7"||3 c=="M"?K:c);H(8 b,a=-1,e=f.J;++a<e;){b=f[a];4(3 b!="7"||a F f)g.L(c,b,a,f)&&d.1h(b)}}I l();6 d}}(n,m,s,v);q.1c=2(h,j,k,l,f,g){6 2(c,d){8 b=h(9)&&9||j(9)||k();4(3 c=="2"){8 a,e=0,i=b.J;a=3 d!="7";4(i!==0||a){4(!a){12{a=b[e];4(3 a!="7"||e F b){d=a;++e;Q}++e>=i&&g()}Z(1)}H(;e<i;){a=b[e];4(3 a!="7"||e F b)d=c(d,a,e,b);++e}}I f()}I l();6 d}}(n,m,r,u,B,C);o.1c=2(h,j,k,l,f,g){6 2(c,d,b){c=h(c)&&c||j(c)||k();4(3 d=="2"){8 a,e=0,i=c.J;a=3 b!="7";4(i!==0||a){4(!a){12{a=c[e];4(3 a!="7"||e F c){b=a;++e;Q}++e>=i&&g()}Z(1)}H(;e<i;){a=c[e];4(3 a!="7"||e F c)b=d(b,a,e,c);++e}}I f()}I l();6 b}}(n,m,s,v,D,E);q.17=2(h,j,k,l,f,g){6 2(c,d){8 b=h(9)&&9||j(9)||k();4(3 c=="2"){8 a;a=b.J;8 e=a-1,i=3 d!="7";4(a!==0||i){4(!i){12{a=b[e];4(3 a!="7"||e F b){d=a;--e;Q}--e<0&&g()}Z(1)}H(;e>=0;){a=b[e];4(3 a!="7"||e F b)d=c(d,a,e,b);--e}}I f()}I l();6 d}}(n,m,r,u,B,C);o.17=2(h,j,k,l,f,g){6 2(c,d,b){c=h(c)&&c||j(c)||k();4(3 d=="2"){8 a;a=c.J;8 e=a-1,i=3 b!="7";4(a!==0||i){4(!i){12{a=c[e];4(3 a!="7"||e F c){b=a;--e;Q}--e<0&&g()}Z(1)}H(;e>=0;){a=c[e];4(3 a!="7"||e F c)b=d(b,a,e,c);--e}}I f()}I l();6 b}}(n,m,s,v,D,E);q.1j=2(h,j,k,l,f,g,c){6 2(d,b){8 a,e,i,A=h(9)&&9||j(9)||k();a=A.J;b=f(l(b),10);b=g(b)&&b||0;H(b=b<0&&c(0,a+b)||b;b<a;){e=A[b];4((3 e!="7"||b F A)&&e===d){i=N;Q}++b}6 i?b:-1}}(n,m,r,w,x,y,z);o.1j=2(h,j,k,l,f,g,c){6 2(d,b,a){8 e,i,A;d=h(d)&&d||j(d)||k();e=d.J;a=f(l(a),10);a=g(a)&&a||0;H(a=a<0&&c(0,e+a)||a;a<e;){i=d[a];4((3 i!="7"||a F d)&&i===b){A=N;Q}++a}6 A?a:-1}}(n,m,s,w,x,y,z);q.1l=2(h,j,k,l,f,g,c){6 2(d,b){8 a,e,i=h(9)&&9||j(9)||k();a=i.J;b=f(l(b),10);b=g(b)&&b||a;b=b<0&&c(0,a+b)||b;H(b=b>=a&&a-1||b;b>-1;){a=i[b];4((3 a!="7"||b F i)&&a===d){e=N;Q}--b}6 e?b:-1}}(n,m,r,w,x,y,z);o.1l=2(h,j,k,l,f,g,c){6 2(d,b,a){8 e,i;d=h(d)&&d||j(d)||k();e=d.J;a=f(l(a),10);a=g(a)&&a||e;a=a<0&&c(0,e+a)||a;H(a=a>=e&&e-1||a;a>-1;){e=d[a];4((3 e!="7"||a F d)&&e===b){i=N;Q}--a}6 i?a:-1}}(n,m,s,w,x,y,z);t=z=y=x=w=n=m=q=o=p=s=r=v=u=C=B=E=D=K;G E;G D;G C;G B;G v;G u;G s;G r;G t;G z;G y;G x;G w;G n;G m;G q;G o;G p;G 1M.1N}).L(K);',62,115,'||function|typeof|if||return|undefined|var|this||||||||||||||||||||||||||||||||in|delete|for|else|length|null|call|object|true|throw|new|break|Array|argument|false|is|list|be|to|mandatory|while||some|do|needs|of|make|2nd|reduceRight|all|entries|are|1st|reduce|3rd|every|forEach|the|push|type|indexOf|filter|lastIndexOf|kind|map|entirely|empty|isArray|max|All|ECMAScript|need|apply|via|delegated|objects|implemented|conform|TypeError|ReferenceError|Math|isFinite|parseInt|Number|prototype|detect|base|module|extensions|arguments|callee|presence|require|generics'.split('|'),0,{}));


*/
