/*


  [Array.generic-set-methods]


[http://closure-compiler.appspot.com/home]

- Whitespace only - 6.980 byte
(function(global){if(!global.Array||typeof global.Array.make!="function"||typeof global.Array.isArray!="function")throw new ReferenceError("This special [[Array]] implementation of generic set methods requires the presence of the [[Array]] extensions module base [Array.make.detect].");var Arr=global.Array,ArrProto=Arr.prototype,makeArray=Arr.make,isArray=Arr.isArray,compactList=function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len)if(list[k]===obj){list.splice(k,1);--len;--k}if(!obj&&(typeof obj=="undefined"||typeof obj=="object")){list.splice(i,1);--len;--i}}return list},compactedContains=function(obj){var isMember=false,i=-1,list=this,len=list.length;while(++i<len)if(list[i]===obj){isMember=true;break}return isMember},compactedIndexOf=typeof ArrProto.indexOf=="function"&&ArrProto.indexOf||function(obj){var i=idx=-1,list=this,len=list.length;while(++i<len)if(list[i]===obj){idx=i;break}return idx};ArrProto.wasEmptySet=function(make,compact){return function(){return compact.call(make(this)).length===0}}(makeArray,compactList);Arr.wasEmptySet=function(wasEmptySet){return function(list){return wasEmptySet.call(list)}}(ArrProto.wasEmptySet);ArrProto.wasSubsetOf=function(make,compact,contains){return function(list){var supSet=compact.call(make(list)),subSet=compact.call(make(this)),len=subSet.length,idx=-1,isSubset=false;if(len===0)isSubset=true;else if(len<=supSet.length){isSubset=true;while(++idx<len)if(!contains.call(supSet,subSet[idx])){isSubset=false;break}}return isSubset}}(makeArray,compactList,compactedContains);Arr.wasSubsetOf=function(wasSubsetOf){return function(subList,supList){return wasSubsetOf.call(subList,supList)}}(ArrProto.wasSubsetOf);ArrProto.wasRealSubsetOf=function(make,compact,wasSubsetOf){return function(list){return wasSubsetOf.call(this,list)&&compact.call(make(this)).length<compact.call(make(list)).length}}(makeArray,compactList,ArrProto.wasSubsetOf);Arr.wasRealSubsetOf=function(wasRealSubsetOf){return function(subList,supList){return wasRealSubsetOf.call(subList,supList)}}(ArrProto.wasRealSubsetOf);ArrProto.wasSupersetOf=function(wasSubsetOf){return function(list){return wasSubsetOf.call(list,this)}}(ArrProto.wasSubsetOf);Arr.wasSupersetOf=function(wasSupersetOf){return function(supList,subList){return wasSupersetOf.call(supList,subList)}}(ArrProto.wasSupersetOf);ArrProto.wasRealSupersetOf=function(wasRealSubsetOf){return function(list){return wasRealSubsetOf.call(list,this)}}(ArrProto.wasRealSubsetOf);Arr.wasRealSupersetOf=function(wasRealSupersetOf){return function(supList,subList){return wasRealSupersetOf.call(supList,subList)}}(ArrProto.wasRealSupersetOf);ArrProto.wasUniverseOf=function(make,compact,wasSubsetOf){return function(){var supList=compact.call(make(this)),subLists=arguments,len=subLists.length,idx=-1,isUniverse=false;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=wasSubsetOf.call(subLists[idx],supList);if(!isUniverse)break}}return isUniverse}}(makeArray,compactList,ArrProto.wasSubsetOf);Arr.wasUniverseOf=function(make,wasUniverseOf){return function(){var subLists=make(arguments),supList=subLists.shift();return wasUniverseOf.apply(supList,subLists)}}(makeArray,ArrProto.wasUniverseOf);ArrProto.total=function(is,make,push){return function(){var arr=is(this)&&this||make(this),lists=arguments,len=lists.length,idx=-1,list;while(++idx<len){list=lists[idx];push.apply(arr,is(list)&&list||make(list))}return arr}}(isArray,makeArray,ArrProto.push);Arr.total=function(make,total){return function(){var lists=make(arguments),list=make(lists.shift());return total.apply(list,lists)}}(makeArray,ArrProto.total);ArrProto.merge=function(compact,total){return function(){return compact.call(total.apply(this,arguments))}}(compactList,ArrProto.total);Arr.merge=function(make,compact,total){return function(){var lists=make(arguments),list=make(lists.shift());return compact.call(total.apply(list,lists))}}(makeArray,compactList,ArrProto.total);ArrProto.intersection=function(is,make,compact,indexOf){return function(list){list=compact.call(make(list));var arr=compact.call(is(this)&&this||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0)list.splice(k,1);else{arr.splice(i,1);--len;--i}}return arr}}(isArray,makeArray,compactList,compactedIndexOf);Arr.intersection=function(make,intersection){return function(arr01,arr02){return intersection.call(make(arr01),arr02)}}(makeArray,ArrProto.intersection);ArrProto.wasDisjoint=function(intersection){return function(list){return intersection(this,list).length===0}}(Arr.intersection);Arr.wasDisjoint=function(intersection){return function(arr01,arr02){return intersection(arr01,arr02).length===0}}(Arr.intersection);ArrProto.difference=function(is,make,compact,indexOf){return function(list){list=compact.call(make(list));var arr=compact.call(is(this)&&this||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0){list.splice(k,1);arr.splice(i,1);--len;--i}}return arr}}(isArray,makeArray,compactList,compactedIndexOf);Arr.difference=function(make,difference){return function(arr01,arr02){return difference.call(make(arr01),arr02)}}(makeArray,ArrProto.difference);ArrProto.symmetricDifference=function(is,make,compact,indexOf,push){return function(list){list=compact.call(make(list));var arr=compact.call(is(this)&&this||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0){list.splice(k,1);arr.splice(i,1);--len;--i}}push.apply(arr,list);return arr}}(isArray,makeArray,compactList,compactedIndexOf,ArrProto.push);Arr.symmetricDifference=function(make,symmetricDifference){return function(arr01,arr02){return symmetricDifference.call(make(arr01),arr02)}}(makeArray,ArrProto.symmetricDifference);ArrProto.relativeComplement=function(is,make,wasSubsetOf,difference){return function(list){var complement=is(this)&&this||make(this);if(wasSubsetOf.call(list,complement))difference.call(complement,list);else complement.length=0;return complement}}(isArray,makeArray,ArrProto.wasSubsetOf,ArrProto.difference);Arr.relativeComplement=function(make,relativeComplement){return function(arr01,arr02){return relativeComplement.call(make(arr01),arr02)}}(makeArray,ArrProto.relativeComplement);ArrProto.absoluteComplement=function(total,relativeComplement){return function(){return relativeComplement.call(this,total.apply([],arguments))}}(Arr.total,ArrProto.relativeComplement);Arr.absoluteComplement=function(make,total,relativeComplement){return function(){var lists=make(arguments),list=make(lists.shift());return relativeComplement.call(list,total.apply([],lists))}}(makeArray,Arr.total,ArrProto.relativeComplement);compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=Arr=global=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete Arr;delete global;delete arguments.callee})(this&&this.window===this&&window||this);

- Simple          - 4.476 byte
(function(o){if(!o.Array||typeof o.Array.make!="function"||typeof o.Array.isArray!="function")throw new ReferenceError("This special [[Array]] implementation of generic set methods requires the presence of the [[Array]] extensions module base [Array.make.detect].");var i=o.Array,e=i.prototype,k=i.make,n=i.isArray,m=function(){for(var b=-1,a,c,d=this.length;++b<d;){c=this[b];for(a=b;++a<d;)if(this[a]===c){this.splice(a,1);--d;--a}if(!c&&(typeof c=="undefined"||typeof c=="object")){this.splice(b,1);--d;--b}}return this},q=function(b){for(var a=false,c=-1,d=this.length;++c<d;)if(this[c]===b){a=true;break}return a},p=typeof e.indexOf=="function"&&e.indexOf||function(b){for(var a=idx=-1,c=this.length;++a<c;)if(this[a]===b){idx=a;break}return idx};e.wasEmptySet=function(b,a){return function(){return a.call(b(this)).length===0}}(k,m);i.wasEmptySet=function(b){return function(a){return b.call(a)}}(e.wasEmptySet);e.wasSubsetOf=function(b,a,c){return function(d){d=a.call(b(d));var g=a.call(b(this)),f=g.length,j=-1,h=false;if(f===0)h=true;else if(f<=d.length)for(h=true;++j<f;)if(!c.call(d,g[j])){h=false;break}return h}}(k,m,q);i.wasSubsetOf=function(b){return function(a,c){return b.call(a,c)}}(e.wasSubsetOf);e.wasRealSubsetOf=function(b,a,c){return function(d){return c.call(this,d)&&a.call(b(this)).length<a.call(b(d)).length}}(k,m,e.wasSubsetOf);i.wasRealSubsetOf=function(b){return function(a,c){return b.call(a,c)}}(e.wasRealSubsetOf);e.wasSupersetOf=function(b){return function(a){return b.call(a,this)}}(e.wasSubsetOf);i.wasSupersetOf=function(b){return function(a,c){return b.call(a,c)}}(e.wasSupersetOf);e.wasRealSupersetOf=function(b){return function(a){return b.call(a,this)}}(e.wasRealSubsetOf);i.wasRealSupersetOf=function(b){return function(a,c){return b.call(a,c)}}(e.wasRealSupersetOf);e.wasUniverseOf=function(b,a,c){return function(){var d=a.call(b(this)),g=arguments,f=g.length,j=-1,h=false;if(f>=1)for(h=true;++j<f;){h=c.call(g[j],d);if(!h)break}return h}}(k,m,e.wasSubsetOf);i.wasUniverseOf=function(b,a){return function(){var c=b(arguments),d=c.shift();return a.apply(d,c)}}(k,e.wasUniverseOf);e.total=function(b,a,c){return function(){for(var d=b(this)&&this||a(this),g=arguments,f=g.length,j=-1,h;++j<f;){h=g[j];c.apply(d,b(h)&&h||a(h))}return d}}(n,k,e.push);i.total=function(b,a){return function(){var c=b(arguments),d=b(c.shift());return a.apply(d,c)}}(k,e.total);e.merge=function(b,a){return function(){return b.call(a.apply(this,arguments))}}(m,e.total);i.merge=function(b,a,c){return function(){var d=b(arguments),g=b(d.shift());return a.call(c.apply(g,d))}}(k,m,e.total);e.intersection=function(b,a,c,d){return function(g){g=c.call(a(g));for(var f=c.call(b(this)&&this||a(this)),j=f.length,h=-1,l;++h<j;){l=d.call(g,f[h]);if(l>=0)g.splice(l,1);else{f.splice(h,1);--j;--h}}return f}}(n,k,m,p);i.intersection=function(b,a){return function(c,d){return a.call(b(c),d)}}(k,e.intersection);e.wasDisjoint=function(b){return function(a){return b(this,a).length===0}}(i.intersection);i.wasDisjoint=function(b){return function(a,c){return b(a,c).length===0}}(i.intersection);e.difference=function(b,a,c,d){return function(g){g=c.call(a(g));for(var f=c.call(b(this)&&this||a(this)),j=f.length,h=-1,l;++h<j;){l=d.call(g,f[h]);if(l>=0){g.splice(l,1);f.splice(h,1);--j;--h}}return f}}(n,k,m,p);i.difference=function(b,a){return function(c,d){return a.call(b(c),d)}}(k,e.difference);e.symmetricDifference=function(b,a,c,d,g){return function(f){f=c.call(a(f));for(var j=c.call(b(this)&&this||a(this)),h=j.length,l=-1,r;++l<h;){r=d.call(f,j[l]);if(r>=0){f.splice(r,1);j.splice(l,1);--h;--l}}g.apply(j,f);return j}}(n,k,m,p,e.push);i.symmetricDifference=function(b,a){return function(c,d){return a.call(b(c),d)}}(k,e.symmetricDifference);e.relativeComplement=function(b,a,c,d){return function(g){var f=b(this)&&this||a(this);if(c.call(g,f))d.call(f,g);else f.length=0;return f}}(n,k,e.wasSubsetOf,e.difference);i.relativeComplement=function(b,a){return function(c,d){return a.call(b(c),d)}}(k,e.relativeComplement);e.absoluteComplement=function(b,a){return function(){return a.call(this,b.apply([],arguments))}}(i.total,e.relativeComplement);i.absoluteComplement=function(b,a,c){return function(){var d=b(arguments),g=b(d.shift());return c.call(g,a.apply([],d))}}(k,i.total,e.relativeComplement);p=q=m=n=k=e=i=o=null;delete p;delete q;delete m;delete n;delete k;delete e;delete i;delete o;delete arguments.callee})(this&&this.window===this&&window||this);



[http://dean.edwards.name/packer/]

- packed                      - 7.128 byte
(function(global){if(!global.Array||(typeof global.Array.make!="function")||(typeof global.Array.isArray!="function")){throw(new ReferenceError("This special [[Array]] implementation of generic set methods requires the presence of the [[Array]] extensions module base [Array.make.detect]."));}var Arr=global.Array,ArrProto=Arr.prototype,makeArray=Arr.make,isArray=Arr.isArray,compactList=(function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len){if(list[k]===obj){list.splice(k,1);--len;--k}}if(!obj&&((typeof obj=="undefined")||(typeof obj=="object"))){list.splice(i,1);--len;--i}}return list}),compactedContains=(function(obj){var isMember=false,i=-1,list=this,len=list.length;while(++i<len){if(list[i]===obj){isMember=true;break}}return isMember}),compactedIndexOf=(((typeof ArrProto.indexOf=="function")&&ArrProto.indexOf)||(function(obj){var i=idx=-1,list=this,len=list.length;while(++i<len){if(list[i]===obj){idx=i;break}}return idx}));ArrProto.wasEmptySet=(function(make,compact){return(function(){return(compact.call(make(this)).length===0)})})(makeArray,compactList);Arr.wasEmptySet=(function(wasEmptySet){return(function(list){return wasEmptySet.call(list)})})(ArrProto.wasEmptySet);ArrProto.wasSubsetOf=(function(make,compact,contains){return(function(list){var supSet=compact.call(make(list)),subSet=compact.call(make(this)),len=subSet.length,idx=-1,isSubset=false;if(len===0){isSubset=true}else if(len<=supSet.length){isSubset=true;while(++idx<len){if(!contains.call(supSet,subSet[idx])){isSubset=false;break}}}return isSubset})})(makeArray,compactList,compactedContains);Arr.wasSubsetOf=(function(wasSubsetOf){return(function(subList,supList){return wasSubsetOf.call(subList,supList)})})(ArrProto.wasSubsetOf);ArrProto.wasRealSubsetOf=(function(make,compact,wasSubsetOf){return(function(list){return(wasSubsetOf.call(this,list)&&(compact.call(make(this)).length<compact.call(make(list)).length))})})(makeArray,compactList,ArrProto.wasSubsetOf);Arr.wasRealSubsetOf=(function(wasRealSubsetOf){return(function(subList,supList){return wasRealSubsetOf.call(subList,supList)})})(ArrProto.wasRealSubsetOf);ArrProto.wasSupersetOf=(function(wasSubsetOf){return(function(list){return wasSubsetOf.call(list,this)})})(ArrProto.wasSubsetOf);Arr.wasSupersetOf=(function(wasSupersetOf){return(function(supList,subList){return wasSupersetOf.call(supList,subList)})})(ArrProto.wasSupersetOf);ArrProto.wasRealSupersetOf=(function(wasRealSubsetOf){return(function(list){return wasRealSubsetOf.call(list,this)})})(ArrProto.wasRealSubsetOf);Arr.wasRealSupersetOf=(function(wasRealSupersetOf){return(function(supList,subList){return wasRealSupersetOf.call(supList,subList)})})(ArrProto.wasRealSupersetOf);ArrProto.wasUniverseOf=(function(make,compact,wasSubsetOf){return(function(){var supList=compact.call(make(this)),subLists=arguments,len=subLists.length,idx=-1,isUniverse=false;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=wasSubsetOf.call(subLists[idx],supList);if(!isUniverse){break}}}return isUniverse})})(makeArray,compactList,ArrProto.wasSubsetOf);Arr.wasUniverseOf=(function(make,wasUniverseOf){return(function(){var subLists=make(arguments),supList=subLists.shift();return wasUniverseOf.apply(supList,subLists)})})(makeArray,ArrProto.wasUniverseOf);ArrProto.total=(function(is,make,push){return(function(){var arr=((is(this)&&this)||make(this)),lists=arguments,len=lists.length,idx=-1,list;while(++idx<len){list=lists[idx];push.apply(arr,((is(list)&&list)||make(list)))}return arr})})(isArray,makeArray,ArrProto.push);Arr.total=(function(make,total){return(function(){var lists=make(arguments),list=make(lists.shift());return total.apply(list,lists)})})(makeArray,ArrProto.total);ArrProto.merge=(function(compact,total){return(function(){return compact.call(total.apply(this,arguments))})})(compactList,ArrProto.total);Arr.merge=(function(make,compact,total){return(function(){var lists=make(arguments),list=make(lists.shift());return compact.call(total.apply(list,lists))})})(makeArray,compactList,ArrProto.total);ArrProto.intersection=(function(is,make,compact,indexOf){return(function(list){list=compact.call(make(list));var arr=compact.call((is(this)&&this)||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0){list.splice(k,1)}else{arr.splice(i,1);--len;--i}}return arr})})(isArray,makeArray,compactList,compactedIndexOf);Arr.intersection=(function(make,intersection){return(function(arr01,arr02){return intersection.call(make(arr01),arr02)})})(makeArray,ArrProto.intersection);ArrProto.wasDisjoint=(function(intersection){return(function(list){return(intersection(this,list).length===0)})})(Arr.intersection);Arr.wasDisjoint=(function(intersection){return(function(arr01,arr02){return(intersection(arr01,arr02).length===0)})})(Arr.intersection);ArrProto.difference=(function(is,make,compact,indexOf){return(function(list){list=compact.call(make(list));var arr=compact.call((is(this)&&this)||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0){list.splice(k,1);arr.splice(i,1);--len;--i}}return arr})})(isArray,makeArray,compactList,compactedIndexOf);Arr.difference=(function(make,difference){return(function(arr01,arr02){return difference.call(make(arr01),arr02)})})(makeArray,ArrProto.difference);ArrProto.symmetricDifference=(function(is,make,compact,indexOf,push){return(function(list){list=compact.call(make(list));var arr=compact.call((is(this)&&this)||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0){list.splice(k,1);arr.splice(i,1);--len;--i}}push.apply(arr,list);return arr})})(isArray,makeArray,compactList,compactedIndexOf,ArrProto.push);Arr.symmetricDifference=(function(make,symmetricDifference){return(function(arr01,arr02){return symmetricDifference.call(make(arr01),arr02)})})(makeArray,ArrProto.symmetricDifference);ArrProto.relativeComplement=(function(is,make,wasSubsetOf,difference){return(function(list){var complement=((is(this)&&this)||make(this));if(wasSubsetOf.call(list,complement)){difference.call(complement,list)}else{complement.length=0}return complement})})(isArray,makeArray,ArrProto.wasSubsetOf,ArrProto.difference);Arr.relativeComplement=(function(make,relativeComplement){return(function(arr01,arr02){return relativeComplement.call(make(arr01),arr02)})})(makeArray,ArrProto.relativeComplement);ArrProto.absoluteComplement=(function(total,relativeComplement){return(function(){return relativeComplement.call(this,total.apply([],arguments))})})(Arr.total,ArrProto.relativeComplement);Arr.absoluteComplement=(function(make,total,relativeComplement){return(function(){var lists=make(arguments),list=make(lists.shift());return relativeComplement.call(list,total.apply([],lists))})})(makeArray,Arr.total,ArrProto.relativeComplement);compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=Arr=global=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete Arr;delete global;delete arguments.callee})((this&&(this.window===this)&&window)||this);

- packed / shrinked           - 5.701 byte
(function(h){if(!h.Array||(typeof h.Array.make!="function")||(typeof h.Array.isArray!="function")){throw(new ReferenceError("This special [[Array]] implementation of generic set methods requires the presence of the [[Array]] extensions module base [Array.make.detect]."));}var j=h.Array,ArrProto=j.prototype,makeArray=j.make,isArray=j.isArray,compactList=(function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len){if(list[k]===obj){list.splice(k,1);--len;--k}}if(!obj&&((typeof obj=="undefined")||(typeof obj=="object"))){list.splice(i,1);--len;--i}}return list}),compactedContains=(function(a){var b=false,i=-1,list=this,len=list.length;while(++i<len){if(list[i]===a){b=true;break}}return b}),compactedIndexOf=(((typeof ArrProto.indexOf=="function")&&ArrProto.indexOf)||(function(a){var i=idx=-1,list=this,len=list.length;while(++i<len){if(list[i]===a){idx=i;break}}return idx}));ArrProto.wasEmptySet=(function(a,b){return(function(){return(b.call(a(this)).length===0)})})(makeArray,compactList);j.wasEmptySet=(function(b){return(function(a){return b.call(a)})})(ArrProto.wasEmptySet);ArrProto.wasSubsetOf=(function(c,d,e){return(function(a){var b=d.call(c(a)),subSet=d.call(c(this)),len=subSet.length,idx=-1,isSubset=false;if(len===0){isSubset=true}else if(len<=b.length){isSubset=true;while(++idx<len){if(!e.call(b,subSet[idx])){isSubset=false;break}}}return isSubset})})(makeArray,compactList,compactedContains);j.wasSubsetOf=(function(c){return(function(a,b){return c.call(a,b)})})(ArrProto.wasSubsetOf);ArrProto.wasRealSubsetOf=(function(b,c,d){return(function(a){return(d.call(this,a)&&(c.call(b(this)).length<c.call(b(a)).length))})})(makeArray,compactList,ArrProto.wasSubsetOf);j.wasRealSubsetOf=(function(c){return(function(a,b){return c.call(a,b)})})(ArrProto.wasRealSubsetOf);ArrProto.wasSupersetOf=(function(b){return(function(a){return b.call(a,this)})})(ArrProto.wasSubsetOf);j.wasSupersetOf=(function(c){return(function(a,b){return c.call(a,b)})})(ArrProto.wasSupersetOf);ArrProto.wasRealSupersetOf=(function(b){return(function(a){return b.call(a,this)})})(ArrProto.wasRealSubsetOf);j.wasRealSupersetOf=(function(c){return(function(a,b){return c.call(a,b)})})(ArrProto.wasRealSupersetOf);ArrProto.wasUniverseOf=(function(b,c,d){return(function(){var a=c.call(b(this)),subLists=arguments,len=subLists.length,idx=-1,isUniverse=false;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=d.call(subLists[idx],a);if(!isUniverse){break}}}return isUniverse})})(makeArray,compactList,ArrProto.wasSubsetOf);j.wasUniverseOf=(function(b,c){return(function(){var a=b(arguments),supList=a.shift();return c.apply(supList,a)})})(makeArray,ArrProto.wasUniverseOf);ArrProto.total=(function(b,c,d){return(function(){var a=((b(this)&&this)||c(this)),lists=arguments,len=lists.length,idx=-1,list;while(++idx<len){list=lists[idx];d.apply(a,((b(list)&&list)||c(list)))}return a})})(isArray,makeArray,ArrProto.push);j.total=(function(b,c){return(function(){var a=b(arguments),list=b(a.shift());return c.apply(list,a)})})(makeArray,ArrProto.total);ArrProto.merge=(function(a,b){return(function(){return a.call(b.apply(this,arguments))})})(compactList,ArrProto.total);j.merge=(function(b,c,d){return(function(){var a=b(arguments),list=b(a.shift());return c.call(d.apply(list,a))})})(makeArray,compactList,ArrProto.total);ArrProto.intersection=(function(c,d,e,f){return(function(a){a=e.call(d(a));var b=e.call((c(this)&&this)||d(this)),len=b.length,i=-1,k;while(++i<len){k=f.call(a,b[i]);if(k>=0){a.splice(k,1)}else{b.splice(i,1);--len;--i}}return b})})(isArray,makeArray,compactList,compactedIndexOf);j.intersection=(function(c,d){return(function(a,b){return d.call(c(a),b)})})(makeArray,ArrProto.intersection);ArrProto.wasDisjoint=(function(b){return(function(a){return(b(this,a).length===0)})})(j.intersection);j.wasDisjoint=(function(c){return(function(a,b){return(c(a,b).length===0)})})(j.intersection);ArrProto.difference=(function(c,d,e,f){return(function(a){a=e.call(d(a));var b=e.call((c(this)&&this)||d(this)),len=b.length,i=-1,k;while(++i<len){k=f.call(a,b[i]);if(k>=0){a.splice(k,1);b.splice(i,1);--len;--i}}return b})})(isArray,makeArray,compactList,compactedIndexOf);j.difference=(function(c,d){return(function(a,b){return d.call(c(a),b)})})(makeArray,ArrProto.difference);ArrProto.symmetricDifference=(function(c,d,e,f,g){return(function(a){a=e.call(d(a));var b=e.call((c(this)&&this)||d(this)),len=b.length,i=-1,k;while(++i<len){k=f.call(a,b[i]);if(k>=0){a.splice(k,1);b.splice(i,1);--len;--i}}g.apply(b,a);return b})})(isArray,makeArray,compactList,compactedIndexOf,ArrProto.push);j.symmetricDifference=(function(c,d){return(function(a,b){return d.call(c(a),b)})})(makeArray,ArrProto.symmetricDifference);ArrProto.relativeComplement=(function(c,d,e,f){return(function(a){var b=((c(this)&&this)||d(this));if(e.call(a,b)){f.call(b,a)}else{b.length=0}return b})})(isArray,makeArray,ArrProto.wasSubsetOf,ArrProto.difference);j.relativeComplement=(function(c,d){return(function(a,b){return d.call(c(a),b)})})(makeArray,ArrProto.relativeComplement);ArrProto.absoluteComplement=(function(a,b){return(function(){return b.call(this,a.apply([],arguments))})})(j.total,ArrProto.relativeComplement);j.absoluteComplement=(function(b,c,d){return(function(){var a=b(arguments),list=b(a.shift());return d.call(list,c.apply([],a))})})(makeArray,j.total,ArrProto.relativeComplement);compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=j=h=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete j;delete h;delete arguments.callee})((this&&(this.window===this)&&window)||this);

- packed / shrinked / encoded - 3.481 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(h){n(!h.w||(C h.w.Q!="2")||(C h.w.q!="2")){18(1g 1h("1i 1j [[w]] 1k 11 1n 1p 16 17 13 19 11 13 [[w]] 1a 1b 1c [w.Q.1d]."));}m j=h.w,4=j.1l,9=j.Q,q=j.q,p=(2(){m i=-1,k,A,8=6,7=8.l;r(++i<7){A=8[i];k=i;r(++k<7){n(8[k]===A){8.v(k,1);--7;--k}}n(!A&&((C A=="1e")||(C A=="1f"))){8.v(i,1);--7;--i}}3 8}),G=(2(a){m b=M,i=-1,8=6,7=8.l;r(++i<7){n(8[i]===a){b=J;I}}3 b}),z=(((C 4.X=="2")&&4.X)||(2(a){m i=o=-1,8=6,7=8.l;r(++i<7){n(8[i]===a){o=i;I}}3 o}));4.W=(2(a,b){3(2(){3(b.5(a(6)).l===0)})})(9,p);j.W=(2(b){3(2(a){3 b.5(a)})})(4.W);4.y=(2(c,d,e){3(2(a){m b=d.5(c(a)),O=d.5(c(6)),7=O.l,o=-1,F=M;n(7===0){F=J}N n(7<=b.l){F=J;r(++o<7){n(!e.5(b,O[o])){F=M;I}}}3 F})})(9,p,G);j.y=(2(c){3(2(a,b){3 c.5(a,b)})})(4.y);4.H=(2(b,c,d){3(2(a){3(d.5(6,a)&&(c.5(b(6)).l<c.5(b(a)).l))})})(9,p,4.y);j.H=(2(c){3(2(a,b){3 c.5(a,b)})})(4.H);4.R=(2(b){3(2(a){3 b.5(a,6)})})(4.y);j.R=(2(c){3(2(a,b){3 c.5(a,b)})})(4.R);4.S=(2(b){3(2(a){3 b.5(a,6)})})(4.H);j.S=(2(c){3(2(a,b){3 c.5(a,b)})})(4.S);4.T=(2(b,c,d){3(2(){m a=c.5(b(6)),U=t,7=U.l,o=-1,B=M;n(7>=1){B=J;r(++o<7){B=d.5(U[o],a);n(!B){I}}}3 B})})(9,p,4.y);j.T=(2(b,c){3(2(){m a=b(t),15=a.L();3 c.u(15,a)})})(9,4.T);4.x=(2(b,c,d){3(2(){m a=((b(6)&&6)||c(6)),V=t,7=V.l,o=-1,8;r(++o<7){8=V[o];d.u(a,((b(8)&&8)||c(8)))}3 a})})(q,9,4.14);j.x=(2(b,c){3(2(){m a=b(t),8=b(a.L());3 c.u(8,a)})})(9,4.x);4.12=(2(a,b){3(2(){3 a.5(b.u(6,t))})})(p,4.x);j.12=(2(b,c,d){3(2(){m a=b(t),8=b(a.L());3 c.5(d.u(8,a))})})(9,p,4.x);4.E=(2(c,d,e,f){3(2(a){a=e.5(d(a));m b=e.5((c(6)&&6)||d(6)),7=b.l,i=-1,k;r(++i<7){k=f.5(a,b[i]);n(k>=0){a.v(k,1)}N{b.v(i,1);--7;--i}}3 b})})(q,9,p,z);j.E=(2(c,d){3(2(a,b){3 d.5(c(a),b)})})(9,4.E);4.10=(2(b){3(2(a){3(b(6,a).l===0)})})(j.E);j.10=(2(c){3(2(a,b){3(c(a,b).l===0)})})(j.E);4.K=(2(c,d,e,f){3(2(a){a=e.5(d(a));m b=e.5((c(6)&&6)||d(6)),7=b.l,i=-1,k;r(++i<7){k=f.5(a,b[i]);n(k>=0){a.v(k,1);b.v(i,1);--7;--i}}3 b})})(q,9,p,z);j.K=(2(c,d){3(2(a,b){3 d.5(c(a),b)})})(9,4.K);4.P=(2(c,d,e,f,g){3(2(a){a=e.5(d(a));m b=e.5((c(6)&&6)||d(6)),7=b.l,i=-1,k;r(++i<7){k=f.5(a,b[i]);n(k>=0){a.v(k,1);b.v(i,1);--7;--i}}g.u(b,a);3 b})})(q,9,p,z,4.14);j.P=(2(c,d){3(2(a,b){3 d.5(c(a),b)})})(9,4.P);4.D=(2(c,d,e,f){3(2(a){m b=((c(6)&&6)||d(6));n(e.5(a,b)){f.5(b,a)}N{b.l=0}3 b})})(q,9,4.y,4.K);j.D=(2(c,d){3(2(a,b){3 d.5(c(a),b)})})(9,4.D);4.Z=(2(a,b){3(2(){3 b.5(6,a.u([],t))})})(j.x,4.D);j.Z=(2(b,c,d){3(2(){m a=b(t),8=b(a.L());3 d.5(8,c.u([],a))})})(9,j.x,4.D);z=G=p=q=9=4=j=h=1m;s z;s G;s p;s q;s 9;s 4;s j;s h;s t.1o})((6&&(6.Y===6)&&Y)||6);',62,88,'||function|return|ArrProto|call|this|len|list|makeArray||||||||||||length|var|if|idx|compactList|isArray|while|delete|arguments|apply|splice|Array|total|wasSubsetOf|compactedIndexOf|obj|isUniverse|typeof|relativeComplement|intersection|isSubset|compactedContains|wasRealSubsetOf|break|true|difference|shift|false|else|subSet|symmetricDifference|make|wasSupersetOf|wasRealSupersetOf|wasUniverseOf|subLists|lists|wasEmptySet|indexOf|window|absoluteComplement|wasDisjoint|of|merge|the|push|supList|methods|requires|throw|presence|extensions|module|base|detect|undefined|object|new|ReferenceError|This|special|implementation|prototype|null|generic|callee|set'.split('|'),0,{}));



[closure-compiler(Simple) + edwards-packer(encoded)]

-combined                     - 3.190 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(o){8(!o.x||z o.x.I!="2"||z o.x.W!="2")18 19 1a("1b 15 [[x]] 1c S 14 1d 13 1e Y 12 S Y [[x]] 1f 11 1g [x.I.10].");7 i=o.x,e=i.1h,k=i.I,n=i.W,m=2(){9(7 b=-1,a,c,d=4.6;++b<d;){c=4[b];9(a=b;++a<d;)8(4[a]===c){4.v(a,1);--d;--a}8(!c&&(z c=="Z"||z c=="1i")){4.v(b,1);--d;--b}}3 4},q=2(b){9(7 a=H,c=-1,d=4.6;++c<d;)8(4[c]===b){a=F;D}3 a},p=z e.V=="2"&&e.V||2(b){9(7 a=N=-1,c=4.6;++a<c;)8(4[a]===b){N=a;D}3 N};e.O=2(b,a){3 2(){3 a.5(b(4)).6===0}}(k,m);i.O=2(b){3 2(a){3 b.5(a)}}(e.O);e.w=2(b,a,c){3 2(d){d=a.5(b(d));7 g=a.5(b(4)),f=g.6,j=-1,h=H;8(f===0)h=F;J 8(f<=d.6)9(h=F;++j<f;)8(!c.5(d,g[j])){h=H;D}3 h}}(k,m,q);i.w=2(b){3 2(a,c){3 b.5(a,c)}}(e.w);e.E=2(b,a,c){3 2(d){3 c.5(4,d)&&a.5(b(4)).6<a.5(b(d)).6}}(k,m,e.w);i.E=2(b){3 2(a,c){3 b.5(a,c)}}(e.E);e.K=2(b){3 2(a){3 b.5(a,4)}}(e.w);i.K=2(b){3 2(a,c){3 b.5(a,c)}}(e.K);e.M=2(b){3 2(a){3 b.5(a,4)}}(e.E);i.M=2(b){3 2(a,c){3 b.5(a,c)}}(e.M);e.L=2(b,a,c){3 2(){7 d=a.5(b(4)),g=s,f=g.6,j=-1,h=H;8(f>=1)9(h=F;++j<f;){h=c.5(g[j],d);8(!h)D}3 h}}(k,m,e.w);i.L=2(b,a){3 2(){7 c=b(s),d=c.C();3 a.u(d,c)}}(k,e.L);e.y=2(b,a,c){3 2(){9(7 d=b(4)&&4||a(4),g=s,f=g.6,j=-1,h;++j<f;){h=g[j];c.u(d,b(h)&&h||a(h))}3 d}}(n,k,e.R);i.y=2(b,a){3 2(){7 c=b(s),d=b(c.C());3 a.u(d,c)}}(k,e.y);e.Q=2(b,a){3 2(){3 b.5(a.u(4,s))}}(m,e.y);i.Q=2(b,a,c){3 2(){7 d=b(s),g=b(d.C());3 a.5(c.u(g,d))}}(k,m,e.y);e.B=2(b,a,c,d){3 2(g){g=c.5(a(g));9(7 f=c.5(b(4)&&4||a(4)),j=f.6,h=-1,l;++h<j;){l=d.5(g,f[h]);8(l>=0)g.v(l,1);J{f.v(h,1);--j;--h}}3 f}}(n,k,m,p);i.B=2(b,a){3 2(c,d){3 a.5(b(c),d)}}(k,e.B);e.U=2(b){3 2(a){3 b(4,a).6===0}}(i.B);i.U=2(b){3 2(a,c){3 b(a,c).6===0}}(i.B);e.G=2(b,a,c,d){3 2(g){g=c.5(a(g));9(7 f=c.5(b(4)&&4||a(4)),j=f.6,h=-1,l;++h<j;){l=d.5(g,f[h]);8(l>=0){g.v(l,1);f.v(h,1);--j;--h}}3 f}}(n,k,m,p);i.G=2(b,a){3 2(c,d){3 a.5(b(c),d)}}(k,e.G);e.P=2(b,a,c,d,g){3 2(f){f=c.5(a(f));9(7 j=c.5(b(4)&&4||a(4)),h=j.6,l=-1,r;++l<h;){r=d.5(f,j[l]);8(r>=0){f.v(r,1);j.v(l,1);--h;--l}}g.u(j,f);3 j}}(n,k,m,p,e.R);i.P=2(b,a){3 2(c,d){3 a.5(b(c),d)}}(k,e.P);e.A=2(b,a,c,d){3 2(g){7 f=b(4)&&4||a(4);8(c.5(g,f))d.5(f,g);J f.6=0;3 f}}(n,k,e.w,e.G);i.A=2(b,a){3 2(c,d){3 a.5(b(c),d)}}(k,e.A);e.T=2(b,a){3 2(){3 a.5(4,b.u([],s))}}(i.y,e.A);i.T=2(b,a,c){3 2(){7 d=b(s),g=b(d.C());3 c.5(g,a.u([],d))}}(k,i.y,e.A);p=q=m=n=k=e=i=o=16;t p;t q;t m;t n;t k;t e;t i;t o;t s.17})(4&&4.X===4&&X||4);',62,81,'||function|return|this|call|length|var|if|for|||||||||||||||||||arguments|delete|apply|splice|wasSubsetOf|Array|total|typeof|relativeComplement|intersection|shift|break|wasRealSubsetOf|true|difference|false|make|else|wasSupersetOf|wasUniverseOf|wasRealSupersetOf|idx|wasEmptySet|symmetricDifference|merge|push|of|absoluteComplement|wasDisjoint|indexOf|isArray|window|the|undefined|detect|module|presence|methods|generic|special|null|callee|throw|new|ReferenceError|This|implementation|set|requires|extensions|base|prototype|object'.split('|'),0,{}));


*/



(function (global) {


  if (!global.Array || (typeof global.Array.make != "function") || (typeof global.Array.isArray != "function")) {
    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Array/Array.make.detect.js]
    throw (new ReferenceError("This special [[Array]] implementation of generic set methods requires the presence of the [[Array]] extensions module base [Array.make.detect]."));
  }
  var Arr = global.Array, ArrProto = Arr.prototype, makeArray = Arr.make, isArray = Arr.isArray,

  compactList = (function () { // how about [deduplicate] or [singulate] or [individualize] - was: [normalizeList] // [normalize] or [tidy] or [tidyUp] or even [recompose] or [reassemble] - compare with Ruby's: [http://apidock.com/ruby/Array/uniq!] and [http://apidock.com/ruby/Array/compact!]

    var i = -1, k, obj, list = this, len = list.length;
    while (++i < len) {
      obj = list[i];
      k = i;
      while (++k < len) { // this is the [deduplicate] or [uniq]e part
        if (list[k] === obj) {
          list.splice(k, 1);
          --len;
          --k;
        }
      }
      if (!obj && ((typeof obj == "undefined") || (typeof obj == "object"))) { // this is the [compact] or [defragment]ation part - it will be executed at most twice - once for each of the values [null] and [undefined] in case both are present.
        list.splice(i, 1);
        --len;
        --i;
      }
    }
    return list;
  }),

  compactedContains = (function (obj) { // [contains] - compare with Ruby's: [http://apidock.com/ruby/Array/include?]

    var isMember = false, i = -1, list = this, len = list.length;
    while (++i < len) {
      if (list[i] === obj) {
        isMember = true;
        break;
      }
    }
    return isMember;
  }),

  compactedIndexOf = (((typeof ArrProto.indexOf == "function") && ArrProto.indexOf) || (function (obj) {

    var i = idx = -1, list = this, len = list.length;
    while (++i < len) {
      if (list[i] === obj) {
        idx = i;
        break;
      }
    }
    return idx;
  }));



  ArrProto.wasEmptySet = (function (make, compact) {

    return (function() {
      return (compact.call(make(this)).length === 0);
    });
  })(makeArray, compactList);

  Arr.wasEmptySet = (function (wasEmptySet) {

    return (function(list) {
      return wasEmptySet.call(list);
    });
  })(ArrProto.wasEmptySet);


  ArrProto.wasSubsetOf = (function (make, compact, contains) {

    return (function(list) { // definition (3) - [EN] subset - // [DE] teilmenge.

      var supSet = compact.call(make(list)), subSet = compact.call(make(this)), len = subSet.length, idx = -1, isSubset = false;
      if (len === 0) { // [http://de.wikipedia.org/wiki/Mengenlehre#Leere_Menge] : ... Die leere Menge ist Teilmenge einer jeden Menge.
        isSubset = true;
      } else if (len <= supSet.length) {
        isSubset = true;
        while (++idx < len) {
          if (!contains.call(supSet, subSet[idx])) {
            isSubset = false;
            break;
          }
        }
      }
      return isSubset; // [false]|[true]
    });
  })(makeArray, compactList, compactedContains);

  Arr.wasSubsetOf = (function (wasSubsetOf) {

    return (function(subList, supList) { // definition (3) - [EN] subset - // [DE] teilmenge.
      return wasSubsetOf.call(subList, supList); // [false]|[true]
    });
  })(ArrProto.wasSubsetOf);


  ArrProto.wasRealSubsetOf = (function (make, compact, wasSubsetOf) {

    return (function(list) { // definition (4) - [EN] real subset - [DE] echte teilmenge.
      return (wasSubsetOf.call(this, list) && (compact.call(make(this)).length < compact.call(make(list)).length)); // [false]|[true]
    });
  })(makeArray, compactList, ArrProto.wasSubsetOf);

  Arr.wasRealSubsetOf = (function (wasRealSubsetOf) {

    return (function(subList, supList) { // definition (4) - [EN] real subset - [DE] echte teilmenge.
      return wasRealSubsetOf.call(subList, supList); // [false]|[true]
    });
  })(ArrProto.wasRealSubsetOf);


  ArrProto.wasSupersetOf = (function (wasSubsetOf) {

    return (function(list) { // definition (7) - [EN] superset - [DE] obermenge.
      return wasSubsetOf.call(list, this); // [false]|[true]
    });
  })(ArrProto.wasSubsetOf);

  Arr.wasSupersetOf = (function (wasSupersetOf) {

    return (function(supList, subList) { // definition (7) - [EN] superset - [DE] obermenge.
      return wasSupersetOf.call(supList, subList); // [false]|[true]
    });
  })(ArrProto.wasSupersetOf);


  ArrProto.wasRealSupersetOf = (function (wasRealSubsetOf) {

    return (function(list) {
      return wasRealSubsetOf.call(list, this); // [false]|[true]
    });
  })(ArrProto.wasRealSubsetOf);

  Arr.wasRealSupersetOf = (function (wasRealSupersetOf) {

    return (function(supList, subList) {
      return wasRealSupersetOf.call(supList, subList); // [false]|[true]
    });
  })(ArrProto.wasRealSupersetOf);


  ArrProto.wasUniverseOf = (function (make, compact, wasSubsetOf) {

    return (function(/*subList01, subList02, subList03, ...*/) { // definition (8) - [EN] basic set or universe - [DE] grundmenge oder universum.

      var supList = compact.call(make(this)), subLists = arguments, len = subLists.length, idx = -1, isUniverse = false;
      if (len >= 1) {
        isUniverse = true;
        while (++idx < len) {
          isUniverse = wasSubsetOf.call(subLists[idx], supList);
          if (!isUniverse) { // [false]
            break;
          }
        }
      }
      return isUniverse; // [false]|[true]
    });
  })(makeArray, compactList, ArrProto.wasSubsetOf);

  Arr.wasUniverseOf = (function (make, wasUniverseOf) {

    return (function(/*supList, subList01, subList02, subList03, ...*/) { // definition (8) - [EN] basic set or universe - [DE] grundmenge oder universum.
      var subLists = make(arguments), supList = subLists.shift();
      return wasUniverseOf.apply(supList, subLists); // [false]|[true]
    });
  })(makeArray, ArrProto.wasUniverseOf);



  ArrProto.total = (function (is, make, push) {

    return (function(/*list01, [list02, [list03, ...]]*/) { // closest to definition (9) - [EN] set union (logical OR): changes the method calling array - in this case the method calling array mutates to a non compacted total of all arrays - [DE] kommt der vereinigungsmenge am naechsten (logisches ODER): aendert das diese methode aufrufende array - in diesem handelt es sich um die nicht um dubletten bereinigte summe aller arrays.

      var arr = ((is(this) && this) || make(this)), lists = arguments, len = lists.length, idx = -1, list;
      while (++idx < len) {
        list = lists[idx];
        push.apply(arr, ((is(list) && list) || make(list)));
      }
      return arr;
    });
  })(isArray, makeArray, ArrProto.push);

  Arr.total = (function (make, total) {

    return (function(/*list01, [list02, [list03, ...]]*/) { // closest to definition (9) - [EN] set union (logical OR): does not change any of the methods arguments but as for this case returns a new non compacted total of all arrays - [DE] kommt der vereinigungsmenge am naechsten (logisches ODER): aendert keines der beteiligten argumente sondern gibt eine separate nicht um dubletten bereinigte summe aller arrays zurueck.
      var lists = make(arguments), list = make(lists.shift());
      return total.apply(list, lists);
    });
  })(makeArray, ArrProto.total);

/*
  arr = [0,1,2,3,4];
  Array.total(arr, ["x","y"],"a","b","c",["z"],5,6,[7,8,9],[0],[1,2],[3,4,7,8,9]);
*/

  ArrProto.merge = (function (compact, total) {

    return (function(/*list01, [list02, [list03, ...]]*/) { // definition (9) - [EN] set union (logical OR): changes the method calling array - in this case the method calling array mutates to a real compacted merger - [DE] vereinigungsmenge (logisches ODER): aendert das diese methode aufrufende array - das vereinigte array entspricht der um dubletten bereinigten summe aller arrays.
      return compact.call(total.apply(this, arguments));
    });
  })(compactList, ArrProto.total);

  Arr.merge = (function (make, compact, total) {

    return (function(/*list01, [list02, [list03, ...]]*/) { // definition (9) - [EN] set union (logical OR): does not change any of the methods arguments but as for this case returns a new real compacted merger - [DE] vereinigungsmenge (logisches ODER): aendert keines der beteiligten argumente sondern gibt eine separate um dubletten bereinigte summe aller arrays zurueck.
      var lists = make(arguments), list = make(lists.shift());
      return compact.call(total.apply(list, lists));
    });
  })(makeArray, compactList, ArrProto.total);

/*
  arr = [0,1,2,3,4];
  Array.merge(arr, ["x","y"],"a","b","c",["z"],5,6,[7,8,9],[0],[1,2],[3,4,7,8,9]);
*/



  ArrProto.intersection = (function (is, make, compact, indexOf) {

    return (function(list) { // definition (10) - [EN] intersection of sets (logical AND): changes the method calling array - [DE] schnittmenge oder durchschnittsmenge (logisches UND): aendert das diese methode aufrufende array.

      list = compact.call(make(list));
      var arr = compact.call((is(this) && this) || make(this)), len = arr.length, i = -1, k;
      while (++i < len) {
        k = indexOf.call(list, arr[i]);
        if (k >= 0) {
          list.splice(k, 1);
        } else {
          arr.splice(i, 1);
          --len;
          --i;
        }
      }
      return arr;
    });
  })(isArray, makeArray, compactList, compactedIndexOf);

  Arr.intersection = (function (make, intersection) {

    return (function(arr01, arr02) { // definition (10) - [EN] intersection of sets (logical AND): does not change the method calling array but returns a new intersection set - [DE] schnittmenge oder durchschnittsmenge (logisches UND): aendert das diese methode aufrufende array NICHT, sondern gibt ein separates schnittmengen-array zurueck.
      return intersection.call(make(arr01), arr02);
    });
  })(makeArray, ArrProto.intersection);

/*
  arr = [0,1,2,3,4,0,1,2,3,4,0,1,2,3,4];
  list = [3,4,5,6,7,3,4,5,6,7,3,4,5,6,7];
  arr.intersection(list);
*/

  ArrProto.wasDisjoint = (function (intersection) {

    return (function(list) { // definition (11) - [EN] disjoint (disjunctive) - [DE] disjunkt.
      return (intersection(this, list).length === 0); // [false]|[true]
    });
  })(Arr.intersection);

  Arr.wasDisjoint = (function (intersection) {

    return (function(arr01, arr02) { // definition (11) - [EN] disjoint (disjunctive) - [DE] disjunkt.
      return (intersection(arr01, arr02).length === 0); // [false]|[true]
    });
  })(Arr.intersection);

/*
  arr = [0,1,2,3,4,0,1,2,3,4,0,1,2,3,4];
  list = [3,4,5,6,7,3,4,5,6,7,3,4,5,6,7];
  print(arr.wasDisjoint(list));
  print(arr.wasDisjoint([]));
  print(arr.wasDisjoint([5,6,7]));
*/



  ArrProto.difference = (function (is, make, compact, indexOf) {

    return (function(list) { // definition (12) - [EN] difference quantity: changes the method calling array - [DE] differenzmenge: aendert das diese methode aufrufende array.

      list = compact.call(make(list));
      var arr = compact.call((is(this) && this) || make(this)), len = arr.length, i = -1, k;
      while (++i < len) {
        k = indexOf.call(list, arr[i]);
        if (k >= 0) {
          list.splice(k, 1);
          arr.splice(i, 1);
          --len;
          --i;
        }
      }
      return arr;
    });
  })(isArray, makeArray, compactList, compactedIndexOf);

  Arr.difference = (function (make, difference) {

    return (function(arr01, arr02) { // definition (12) - [EN] difference quantity: does not change the method calling array but returns a new difference quantity - [DE] differenzmenge: aendert das diese methode aufrufende array NICHT, sondern gibt ein separates differenzmengen-array zurueck.
      return difference.call(make(arr01), arr02);
    });
  })(makeArray, ArrProto.difference);

/*
  arr = [0,1,2,3,4,0,1,2,3,4,0,1,2,3,4];
  list = [3,4,5,6,7,3,4,5,6,7,3,4,5,6,7];
  arr.difference(list);
*/

  ArrProto.symmetricDifference = (function (is, make, compact, indexOf, push) {

    return (function(list) { // definition (13) - [EN] symmetric difference: changes the method calling array - [DE] symmetrische differenz: aendert das diese methode aufrufende array.

      list = compact.call(make(list));
      var arr = compact.call((is(this) && this) || make(this)), len = arr.length, i = -1, k;
      while (++i < len) {
        k = indexOf.call(list, arr[i]);
        if (k >= 0) {
          list.splice(k, 1);
          arr.splice(i, 1);
          --len;
          --i;
        }
      }
      push.apply(arr, list);
      return arr;
    });
  })(isArray, makeArray, compactList, compactedIndexOf, ArrProto.push);

  Arr.symmetricDifference = (function (make, symmetricDifference) {

    return (function(arr01, arr02) { // definition (13) - [EN] symmetric difference: does not change the method calling array but returns a new symmetric difference - [DE] symmetrische differenz: aendert das diese methode aufrufende array NICHT, sondern gibt ein separates symmetrisches differenzmengen-array zurueck.
      return symmetricDifference.call(make(arr01), arr02);
    });
  })(makeArray, ArrProto.symmetricDifference);

/*
  arr = [0,1,2,3,4,0,1,2,3,4,0,1,2,3,4];
  list = [3,4,5,6,7,3,4,5,6,7,3,4,5,6,7];
  arr.symmetricDifference(list);
*/



  ArrProto.relativeComplement = (function (is, make, wasSubsetOf, difference) {/*

    return (function(list) { // [http://de.wikipedia.org/wiki/Komplement_%28Mengenlehre%29#Relatives_Komplement]

      if (wasSubsetOf.call(list, this)) {
        difference.call(this, list);
      }
      return this;
    });*/
    return (function(list) {

      var complement = ((is(this) && this) || make(this));
      if (wasSubsetOf.call(list, complement)) {
        difference.call(complement, list);
      } else {
        complement.length = 0;
      }
      return complement;
    });
  })(isArray, makeArray, ArrProto.wasSubsetOf, ArrProto.difference);

  Arr.relativeComplement = (function (make, relativeComplement) {

    return (function(arr01, arr02) { // [http://de.wikipedia.org/wiki/Komplement_%28Mengenlehre%29#Relatives_Komplement]
      return relativeComplement.call(make(arr01), arr02);
    });
  })(makeArray, ArrProto.relativeComplement);

/*
  arr = [0,1,2,3,4,5,6,7,8,9];
  list = [4,6,8];
  arr.relativeComplement(list);
*/

  ArrProto.absoluteComplement = (function (total, relativeComplement) {

    return (function(/*{universe}|list01, [list02, [list03, ...]]*/) { // [http://de.wikipedia.org/wiki/Komplement_%28Mengenlehre%29#Absolutes_Komplement]
      return relativeComplement.call(this, total.apply([], arguments));
    });
  })(Arr.total, ArrProto.relativeComplement);

  Arr.absoluteComplement = (function (make, total, relativeComplement) {

    return (function(/*list01, {universe}|list02, [list03, ...]*/) { // [http://de.wikipedia.org/wiki/Komplement_%28Mengenlehre%29#Absolutes_Komplement]
      var lists = make(arguments), list = make(lists.shift());
      return relativeComplement.call(list, total.apply([], lists));
    });
  })(makeArray, Arr.total, ArrProto.relativeComplement);

/*
  arr = [0,1,2,3,4,5,6,7,8,9];
  list01 = [4,6,8];
  list02 = [0,1,2];
  list03 = [3,4,5];
  list04 = [6,7,8];
  list05 = [9,10,11];
  Array.absoluteComplement(arr, list01, list02, list03, list04, list05);
*/


  compactedIndexOf = compactedContains = compactList = isArray = makeArray = ArrProto = Arr = global = null;

  delete compactedIndexOf; delete compactedContains; delete compactList;
  delete isArray; delete makeArray; delete ArrProto; delete Arr; delete global;

  delete arguments.callee;
})((this && (this.window === this) && window) || this);

