/*


  [Set.Array.bundle] boiled down from [Set.Array.Simple-Theory-Of-Sets]


*/ /*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 13.782 byte
(function(ns){var sh=this;if(!sh.Array||typeof sh.Array.make!="function"||typeof sh.Array.isArray!="function")throw new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect].");var Arr=sh.Array,ArrProto=Arr.prototype,makeArray=Arr.make,isArray=Arr.isArray,compactList=function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len)if(list[k]===obj){list.splice(k,1);--len;--k}if(!obj&&(typeof obj=="undefined"||typeof obj=="object")){list.splice(i,1);--len;--i}}return list},compactedContains=function(obj){var isMember=false,i=-1,list=this,len=list.length;while(++i<len)if(list[i]===obj){isMember=true;break}return isMember},compactedIndexOf=typeof ArrProto.indexOf=="function"&&ArrProto.indexOf||function(obj){var i=idx=-1,list=this,len=list.length;while(++i<len)if(list[i]===obj){idx=i;break}return idx};ArrProto.wasEmptySet=function(make,compact){return function(){return compact.call(make(this)).length===0}}(makeArray,compactList);Arr.wasEmptySet=function(wasEmptySet){return function(list){return wasEmptySet.call(list)}}(ArrProto.wasEmptySet);ArrProto.wasSubsetOf=function(make,compact,contains){return function(list){var supSet=compact.call(make(list)),subSet=compact.call(make(this)),len=subSet.length,idx=-1,isSubset=false;if(len===0)isSubset=true;else if(len<=supSet.length){isSubset=true;while(++idx<len)if(!contains.call(supSet,subSet[idx])){isSubset=false;break}}return isSubset}}(makeArray,compactList,compactedContains);Arr.wasSubsetOf=function(wasSubsetOf){return function(subList,supList){return wasSubsetOf.call(subList,supList)}}(ArrProto.wasSubsetOf);ArrProto.wasRealSubsetOf=function(make,compact,wasSubsetOf){return function(list){return wasSubsetOf.call(this,list)&&compact.call(make(this)).length<compact.call(make(list)).length}}(makeArray,compactList,ArrProto.wasSubsetOf);Arr.wasRealSubsetOf=function(wasRealSubsetOf){return function(subList,supList){return wasRealSubsetOf.call(subList,supList)}}(ArrProto.wasRealSubsetOf);ArrProto.wasSupersetOf=function(wasSubsetOf){return function(list){return wasSubsetOf.call(list,this)}}(ArrProto.wasSubsetOf);Arr.wasSupersetOf=function(wasSupersetOf){return function(supList,subList){return wasSupersetOf.call(supList,subList)}}(ArrProto.wasSupersetOf);ArrProto.wasRealSupersetOf=function(wasRealSubsetOf){return function(list){return wasRealSubsetOf.call(list,this)}}(ArrProto.wasRealSubsetOf);Arr.wasRealSupersetOf=function(wasRealSupersetOf){return function(supList,subList){return wasRealSupersetOf.call(supList,subList)}}(ArrProto.wasRealSupersetOf);ArrProto.wasUniverseOf=function(make,compact,wasSubsetOf){return function(){var supList=compact.call(make(this)),subLists=arguments,len=subLists.length,idx=-1,isUniverse=false;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=wasSubsetOf.call(subLists[idx],supList);if(!isUniverse)break}}return isUniverse}}(makeArray,compactList,ArrProto.wasSubsetOf);Arr.wasUniverseOf=function(make,wasUniverseOf){return function(){var subLists=make(arguments),supList=subLists.shift();return wasUniverseOf.apply(supList,subLists)}}(makeArray,ArrProto.wasUniverseOf);ArrProto.total=function(is,make,push){return function(){var arr=is(this)&&this||make(this),lists=arguments,len=lists.length,idx=-1,list;while(++idx<len){list=lists[idx];push.apply(arr,is(list)&&list||make(list))}return arr}}(isArray,makeArray,ArrProto.push);Arr.total=function(make,total){return function(){var lists=make(arguments),list=make(lists.shift());return total.apply(list,lists)}}(makeArray,ArrProto.total);ArrProto.merge=function(compact,total){return function(){return compact.call(total.apply(this,arguments))}}(compactList,ArrProto.total);Arr.merge=function(make,compact,total){return function(){var lists=make(arguments),list=make(lists.shift());return compact.call(total.apply(list,lists))}}(makeArray,compactList,ArrProto.total);ArrProto.intersection=function(is,make,compact,indexOf){return function(list){list=compact.call(make(list));var arr=compact.call(is(this)&&this||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0)list.splice(k,1);else{arr.splice(i,1);--len;--i}}return arr}}(isArray,makeArray,compactList,compactedIndexOf);Arr.intersection=function(make,intersection){return function(arr01,arr02){return intersection.call(make(arr01),arr02)}}(makeArray,ArrProto.intersection);ArrProto.wasDisjoint=function(intersection){return function(list){return intersection(this,list).length===0}}(Arr.intersection);Arr.wasDisjoint=function(intersection){return function(arr01,arr02){return intersection(arr01,arr02).length===0}}(Arr.intersection);ArrProto.difference=function(is,make,compact,indexOf){return function(list){list=compact.call(make(list));var arr=compact.call(is(this)&&this||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0){list.splice(k,1);arr.splice(i,1);--len;--i}}return arr}}(isArray,makeArray,compactList,compactedIndexOf);Arr.difference=function(make,difference){return function(arr01,arr02){return difference.call(make(arr01),arr02)}}(makeArray,ArrProto.difference);ArrProto.symmetricDifference=function(is,make,compact,indexOf,push){return function(list){list=compact.call(make(list));var arr=compact.call(is(this)&&this||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0){list.splice(k,1);arr.splice(i,1);--len;--i}}push.apply(arr,list);return arr}}(isArray,makeArray,compactList,compactedIndexOf,ArrProto.push);Arr.symmetricDifference=function(make,symmetricDifference){return function(arr01,arr02){return symmetricDifference.call(make(arr01),arr02)}}(makeArray,ArrProto.symmetricDifference);ArrProto.relativeComplement=function(is,make,wasSubsetOf,difference){return function(list){var complement=is(this)&&this||make(this);if(wasSubsetOf.call(list,complement))difference.call(complement,list);else complement.length=0;return complement}}(isArray,makeArray,ArrProto.wasSubsetOf,ArrProto.difference);Arr.relativeComplement=function(make,relativeComplement){return function(arr01,arr02){return relativeComplement.call(make(arr01),arr02)}}(makeArray,ArrProto.relativeComplement);ArrProto.absoluteComplement=function(total,relativeComplement){return function(){return relativeComplement.call(this,total.apply([],arguments))}}(Arr.total,ArrProto.relativeComplement);Arr.absoluteComplement=function(make,total,relativeComplement){return function(){var lists=make(arguments),list=make(lists.shift());return relativeComplement.call(list,total.apply([],lists))}}(makeArray,Arr.total,ArrProto.relativeComplement);(ns||sh)["Set"]=function(){var Set=function(make,compact){return function(){var cardinalNumber=0,set=[];this.valueOf=function(){return cardinalNumber>0&&make(set)||EMPTY_SET};this.toArray=function(){return cardinalNumber>0&&make(set)||[]};this.toString=function(){return["{",set.join(", "),"}"].join("")};this.getCardinalNumber=function(){return cardinalNumber};this.compile=function(){set=compact.call(make(arguments));cardinalNumber=set.length;return this};return this.compile.apply(this,arguments)}}(makeArray,compactList),SetProto=Set.prototype,EMPTY_SET=new Set,isEmptySet=function(EMPTY_SET){return function(set){return(set&&set.valueOf())===EMPTY_SET}}(EMPTY_SET),isSet=function(is){return function(set){return set&&!is(set)&&typeof set.toArray=="function"&&is(set.toArray())}}(isArray);SetProto.isEmptySet=function(isEmptySet){return function(){return isEmptySet(this)}}(isEmptySet);Set.isEmptySet=function(isEmptySet){return function(set){return isEmptySet(set)}}(isEmptySet);SetProto.isSet=function(isSet){return function(){return isSet(this)}}(isSet);Set.isSet=function(isSet){return function(set){return isSet(set)}}(isSet);SetProto.isSubsetOf=function(is,contains){return function(set){var supSet=is(set)&&set.toArray(),subSet=is(this)&&this.toArray(),len,idx,isSubset;if(supSet&&subSet){isSubset=false;len=subSet.length;if(len===0)isSubset=true;else if(len<=supSet.length){isSubset=true;idx=-1;while(++idx<len)if(!contains.call(supSet,subSet[idx])){isSubset=false;break}}}return isSubset}}(isSet,compactedContains);Set.isSubsetOf=function(isSubsetOf){return function(subSet,supSet){return isSubsetOf.call(subSet,supSet)}}(SetProto.isSubsetOf);SetProto.isRealSubsetOf=function(isSubsetOf){return function(set){return isSubsetOf.call(this,set)&&this.getCardinalNumber()<set.getCardinalNumber()}}(SetProto.isSubsetOf);Set.isRealSubsetOf=function(isRealSubsetOf){return function(subSet,supSet){return isRealSubsetOf.call(subSet,supSet)}}(SetProto.isRealSubsetOf);SetProto.isSupersetOf=function(isSubsetOf){return function(set){return isSubsetOf.call(set,this)}}(SetProto.isSubsetOf);Set.isSupersetOf=function(isSupersetOf){return function(supSet,subSet){return isSupersetOf.call(supSet,subSet)}}(SetProto.isSupersetOf);SetProto.isRealSupersetOf=function(isRealSubsetOf){return function(list){return isRealSubsetOf.call(list,this)}}(SetProto.isRealSubsetOf);Set.isRealSupersetOf=function(isRealSupersetOf){return function(supSet,subSet){return isRealSupersetOf.call(supSet,subSet)}}(SetProto.isRealSupersetOf);SetProto.isUniverseOf=function(isSubsetOf){return function(){var supSet=this,subSets=arguments,len=subSets.length,idx=-1,isUniverse;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=isSubsetOf.call(subSets[idx],supSet);if(!isUniverse)break}}return isUniverse}}(SetProto.isSubsetOf);Set.isUniverseOf=function(make,isUniverseOf){return function(){var subSets=make(arguments),supSet=subSets.shift();return isUniverseOf.apply(supSet,subSets)}}(makeArray,SetProto.isUniverseOf);SetProto.merge=function(is,push){return function(){var merger=this,total=is(merger)&&merger.toArray(),sets=arguments,len=sets.length,idx=-1,arr;if(total){while(++idx<len){arr=sets[idx];arr=is(arr)&&arr.toArray();arr&&push.apply(total,arr)}merger.compile.apply(merger,total)}return merger}}(isSet,ArrProto.push);Set.merge=function(merge,Set){return function(){return merge.apply(new Set,arguments)}}(SetProto.merge,Set);SetProto.intersection=function(is,indexOf){return function(set){var intersection=this,joint=is(intersection)&&intersection.toArray(),arr=is(set)&&set.toArray(),i=-1,k,len;if(joint&&arr){len=joint.length;while(++i<len){k=indexOf.call(arr,joint[i]);if(k>=0)arr.splice(k,1);else{joint.splice(i,1);--len;--i}}intersection.compile.apply(intersection,joint)}return intersection}}(isSet,compactedIndexOf);Set.intersection=function(is,intersection,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return intersection.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.intersection,Set);SetProto.isDisjoint=function(intersection){return function(set){return intersection(this,set).isEmptySet()}}(Set.intersection);Set.isDisjoint=function(intersection){return function(set01,set02){return intersection(set01,set02).isEmptySet()}}(Set.intersection);SetProto.difference=function(is,indexOf){return function(set){var difference=this,diff=is(difference)&&difference.toArray(),arr=is(set)&&set.toArray(),i=-1,k,len;if(diff&&arr){len=diff.length;while(++i<len){k=indexOf.call(arr,diff[i]);if(k>=0){arr.splice(k,1);diff.splice(i,1);--len;--i}}difference.compile.apply(difference,diff)}return difference}}(isSet,compactedIndexOf);Set.difference=function(is,difference,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return difference.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.difference,Set);SetProto.symmetricDifference=function(is,indexOf,push){return function(set){var difference=this,sym=is(difference)&&difference.toArray(),arr=is(set)&&set.toArray(),i=-1,k,len;if(sym&&arr){len=sym.length;while(++i<len){k=indexOf.call(arr,sym[i]);if(k>=0){arr.splice(k,1);sym.splice(i,1);--len;--i}}push.apply(sym,arr);difference.compile.apply(difference,sym)}return difference}}(isSet,compactedIndexOf,ArrProto.push);Set.symmetricDifference=function(is,symmetricDifference,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return symmetricDifference.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.symmetricDifference,Set);SetProto.relativeComplement=function(isSubsetOf,difference,Set){return function(set){var complement=this,isSubset=isSubsetOf.call(set,complement);if(typeof isSubset=="undefined")complement=new Set;else if(isSubset)difference.call(complement,set);else complement.compile.call(complement);return complement}}(SetProto.isSubsetOf,SetProto.difference,Set);Set.relativeComplement=function(is,relativeComplement,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return relativeComplement.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.relativeComplement,Set);SetProto.absoluteComplement=function(merge,relativeComplement,Set){return function(){return relativeComplement.call(this,merge.apply(new Set,arguments))}}(SetProto.merge,SetProto.relativeComplement,Set);Set.absoluteComplement=function(is,make,merge,relativeComplement,Set){return function(){var sets=make(arguments),set=sets.shift(),arr=is(set)&&set.toArray()||[];set=new Set;return relativeComplement.call(set.compile.apply(set,arr),merge.apply(new Set,sets))}}(isSet,makeArray,SetProto.merge,SetProto.relativeComplement,Set);SetProto=isEmptySet=isSet=null;delete SetProto;delete isEmptySet;delete isSet;return Set}();compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=Arr=sh=ns=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete Arr;delete sh;delete ns;delete arguments.callee}).call(null);

- Simple          -  8.956 byte
(function(v){var s=this;if(!s.Array||typeof s.Array.make!="function"||typeof s.Array.isArray!="function")throw new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect].");var n=s.Array,j=n.prototype,o=n.make,q=n.isArray,p=function(){for(var c=-1,a,g,i=this.length;++c<i;){g=this[c];for(a=c;++a<i;)if(this[a]===g){this.splice(a,1);--i;--a}if(!g&&(typeof g=="undefined"||typeof g=="object")){this.splice(c,1);--i;--c}}return this},u=function(c){for(var a=false,g=-1,i=this.length;++g<i;)if(this[g]===c){a=true;break}return a},r=typeof j.indexOf=="function"&&j.indexOf||function(c){for(var a=idx=-1,g=this.length;++a<g;)if(this[a]===c){idx=a;break}return idx};j.wasEmptySet=function(c,a){return function(){return a.call(c(this)).length===0}}(o,p);n.wasEmptySet=function(c){return function(a){return c.call(a)}}(j.wasEmptySet);j.wasSubsetOf=function(c,a,g){return function(i){i=a.call(c(i));var k=a.call(c(this)),b=k.length,e=-1,d=false;if(b===0)d=true;else if(b<=i.length)for(d=true;++e<b;)if(!g.call(i,k[e])){d=false;break}return d}}(o,p,u);n.wasSubsetOf=function(c){return function(a,g){return c.call(a,g)}}(j.wasSubsetOf);j.wasRealSubsetOf=function(c,a,g){return function(i){return g.call(this,i)&&a.call(c(this)).length<a.call(c(i)).length}}(o,p,j.wasSubsetOf);n.wasRealSubsetOf=function(c){return function(a,g){return c.call(a,g)}}(j.wasRealSubsetOf);j.wasSupersetOf=function(c){return function(a){return c.call(a,this)}}(j.wasSubsetOf);n.wasSupersetOf=function(c){return function(a,g){return c.call(a,g)}}(j.wasSupersetOf);j.wasRealSupersetOf=function(c){return function(a){return c.call(a,this)}}(j.wasRealSubsetOf);n.wasRealSupersetOf=function(c){return function(a,g){return c.call(a,g)}}(j.wasRealSupersetOf);j.wasUniverseOf=function(c,a,g){return function(){var i=a.call(c(this)),k=arguments,b=k.length,e=-1,d=false;if(b>=1)for(d=true;++e<b;){d=g.call(k[e],i);if(!d)break}return d}}(o,p,j.wasSubsetOf);n.wasUniverseOf=function(c,a){return function(){var g=c(arguments),i=g.shift();return a.apply(i,g)}}(o,j.wasUniverseOf);j.total=function(c,a,g){return function(){for(var i=c(this)&&this||a(this),k=arguments,b=k.length,e=-1,d;++e<b;){d=k[e];g.apply(i,c(d)&&d||a(d))}return i}}(q,o,j.push);n.total=function(c,a){return function(){var g=c(arguments),i=c(g.shift());return a.apply(i,g)}}(o,j.total);j.merge=function(c,a){return function(){return c.call(a.apply(this,arguments))}}(p,j.total);n.merge=function(c,a,g){return function(){var i=c(arguments),k=c(i.shift());return a.call(g.apply(k,i))}}(o,p,j.total);j.intersection=function(c,a,g,i){return function(k){k=g.call(a(k));for(var b=g.call(c(this)&&this||a(this)),e=b.length,d=-1,f;++d<e;){f=i.call(k,b[d]);if(f>=0)k.splice(f,1);else{b.splice(d,1);--e;--d}}return b}}(q,o,p,r);n.intersection=function(c,a){return function(g,i){return a.call(c(g),i)}}(o,j.intersection);j.wasDisjoint=function(c){return function(a){return c(this,a).length===0}}(n.intersection);n.wasDisjoint=function(c){return function(a,g){return c(a,g).length===0}}(n.intersection);j.difference=function(c,a,g,i){return function(k){k=g.call(a(k));for(var b=g.call(c(this)&&this||a(this)),e=b.length,d=-1,f;++d<e;){f=i.call(k,b[d]);if(f>=0){k.splice(f,1);b.splice(d,1);--e;--d}}return b}}(q,o,p,r);n.difference=function(c,a){return function(g,i){return a.call(c(g),i)}}(o,j.difference);j.symmetricDifference=function(c,a,g,i,k){return function(b){b=g.call(a(b));for(var e=g.call(c(this)&&this||a(this)),d=e.length,f=-1,h;++f<d;){h=i.call(b,e[f]);if(h>=0){b.splice(h,1);e.splice(f,1);--d;--f}}k.apply(e,b);return e}}(q,o,p,r,j.push);n.symmetricDifference=function(c,a){return function(g,i){return a.call(c(g),i)}}(o,j.symmetricDifference);j.relativeComplement=function(c,a,g,i){return function(k){var b=c(this)&&this||a(this);if(g.call(k,b))i.call(b,k);else b.length=0;return b}}(q,o,j.wasSubsetOf,j.difference);n.relativeComplement=function(c,a){return function(g,i){return a.call(c(g),i)}}(o,j.relativeComplement);j.absoluteComplement=function(c,a){return function(){return a.call(this,c.apply([],arguments))}}(n.total,j.relativeComplement);n.absoluteComplement=function(c,a,g){return function(){var i=c(arguments),k=c(i.shift());return g.call(k,a.apply([],i))}}(o,n.total,j.relativeComplement);(v||s).Set=function(){var c=function(b,e){return function(){var d=0,f=[];this.valueOf=function(){return d>0&&b(f)||g};this.toArray=function(){return d>0&&b(f)||[]};this.toString=function(){return["{",f.join(", "),"}"].join("")};this.getCardinalNumber=function(){return d};this.compile=function(){f=e.call(b(arguments));d=f.length;return this};return this.compile.apply(this,arguments)}}(o,p),a=c.prototype,g=new c,i=function(b){return function(e){return(e&&e.valueOf())===b}}(g),k=function(b){return function(e){return e&&!b(e)&&typeof e.toArray=="function"&&b(e.toArray())}}(q);a.isEmptySet=function(b){return function(){return b(this)}}(i);c.isEmptySet=function(b){return function(e){return b(e)}}(i);a.isSet=function(b){return function(){return b(this)}}(k);c.isSet=function(b){return function(e){return b(e)}}(k);a.isSubsetOf=function(b,e){return function(d){d=b(d)&&d.toArray();var f=b(this)&&this.toArray(),h,l,m;if(d&&f){m=false;h=f.length;if(h===0)m=true;else if(h<=d.length){m=true;for(l=-1;++l<h;)if(!e.call(d,f[l])){m=false;break}}}return m}}(k,u);c.isSubsetOf=function(b){return function(e,d){return b.call(e,d)}}(a.isSubsetOf);a.isRealSubsetOf=function(b){return function(e){return b.call(this,e)&&this.getCardinalNumber()<e.getCardinalNumber()}}(a.isSubsetOf);c.isRealSubsetOf=function(b){return function(e,d){return b.call(e,d)}}(a.isRealSubsetOf);a.isSupersetOf=function(b){return function(e){return b.call(e,this)}}(a.isSubsetOf);c.isSupersetOf=function(b){return function(e,d){return b.call(e,d)}}(a.isSupersetOf);a.isRealSupersetOf=function(b){return function(e){return b.call(e,this)}}(a.isRealSubsetOf);c.isRealSupersetOf=function(b){return function(e,d){return b.call(e,d)}}(a.isRealSupersetOf);a.isUniverseOf=function(b){return function(){var e=arguments,d=e.length,f=-1,h;if(d>=1)for(h=true;++f<d;){h=b.call(e[f],this);if(!h)break}return h}}(a.isSubsetOf);c.isUniverseOf=function(b,e){return function(){var d=b(arguments),f=d.shift();return e.apply(f,d)}}(o,a.isUniverseOf);a.merge=function(b,e){return function(){var d=b(this)&&this.toArray(),f=arguments,h=f.length,l=-1,m;if(d){for(;++l<h;){m=f[l];(m=b(m)&&m.toArray())&&e.apply(d,m)}this.compile.apply(this,d)}return this}}(k,j.push);c.merge=function(b,e){return function(){return b.apply(new e,arguments)}}(a.merge,c);a.intersection=function(b,e){return function(d){var f=b(this)&&this.toArray();d=b(d)&&d.toArray();var h=-1,l,m;if(f&&d){for(m=f.length;++h<m;){l=e.call(d,f[h]);if(l>=0)d.splice(l,1);else{f.splice(h,1);--m;--h}}this.compile.apply(this,f)}return this}}(k,r);c.intersection=function(b,e,d){return function(f,h){var l=b(f)&&f.toArray()||[];f=new d;return e.call(f.compile.apply(f,l),b(h)&&h||new d)}}(k,a.intersection,c);a.isDisjoint=function(b){return function(e){return b(this,e).isEmptySet()}}(c.intersection);c.isDisjoint=function(b){return function(e,d){return b(e,d).isEmptySet()}}(c.intersection);a.difference=function(b,e){return function(d){var f=b(this)&&this.toArray();d=b(d)&&d.toArray();var h=-1,l,m;if(f&&d){for(m=f.length;++h<m;){l=e.call(d,f[h]);if(l>=0){d.splice(l,1);f.splice(h,1);--m;--h}}this.compile.apply(this,f)}return this}}(k,r);c.difference=function(b,e,d){return function(f,h){var l=b(f)&&f.toArray()||[];f=new d;return e.call(f.compile.apply(f,l),b(h)&&h||new d)}}(k,a.difference,c);a.symmetricDifference=function(b,e,d){return function(f){var h=b(this)&&this.toArray();f=b(f)&&f.toArray();var l=-1,m,t;if(h&&f){for(t=h.length;++l<t;){m=e.call(f,h[l]);if(m>=0){f.splice(m,1);h.splice(l,1);--t;--l}}d.apply(h,f);this.compile.apply(this,h)}return this}}(k,r,j.push);c.symmetricDifference=function(b,e,d){return function(f,h){var l=b(f)&&f.toArray()||[];f=new d;return e.call(f.compile.apply(f,l),b(h)&&h||new d)}}(k,a.symmetricDifference,c);a.relativeComplement=function(b,e,d){return function(f){var h=this,l=b.call(f,h);if(typeof l=="undefined")h=new d;else l?e.call(h,f):h.compile.call(h);return h}}(a.isSubsetOf,a.difference,c);c.relativeComplement=function(b,e,d){return function(f,h){var l=b(f)&&f.toArray()||[];f=new d;return e.call(f.compile.apply(f,l),b(h)&&h||new d)}}(k,a.relativeComplement,c);a.absoluteComplement=function(b,e,d){return function(){return e.call(this,b.apply(new d,arguments))}}(a.merge,a.relativeComplement,c);c.absoluteComplement=function(b,e,d,f,h){return function(){var l=e(arguments),m=l.shift(),t=b(m)&&m.toArray()||[];m=new h;return f.call(m.compile.apply(m,t),d.apply(new h,l))}}(k,o,a.merge,a.relativeComplement,c);a=i=k=null;delete a;delete i;delete k;return c}();r=u=p=q=o=j=n=s=v=null;delete r;delete u;delete p;delete q;delete o;delete j;delete n;delete s;delete v;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 14.130 byte
(function(ns){var sh=this;if(!sh.Array||(typeof sh.Array.make!="function")||(typeof sh.Array.isArray!="function")){throw(new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect]."));}var Arr=sh.Array,ArrProto=Arr.prototype,makeArray=Arr.make,isArray=Arr.isArray,compactList=(function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len){if(list[k]===obj){list.splice(k,1);--len;--k}}if(!obj&&((typeof obj=="undefined")||(typeof obj=="object"))){list.splice(i,1);--len;--i}}return list}),compactedContains=(function(obj){var isMember=false,i=-1,list=this,len=list.length;while(++i<len){if(list[i]===obj){isMember=true;break}}return isMember}),compactedIndexOf=(((typeof ArrProto.indexOf=="function")&&ArrProto.indexOf)||(function(obj){var i=idx=-1,list=this,len=list.length;while(++i<len){if(list[i]===obj){idx=i;break}}return idx}));ArrProto.wasEmptySet=(function(make,compact){return(function(){return(compact.call(make(this)).length===0)})})(makeArray,compactList);Arr.wasEmptySet=(function(wasEmptySet){return(function(list){return wasEmptySet.call(list)})})(ArrProto.wasEmptySet);ArrProto.wasSubsetOf=(function(make,compact,contains){return(function(list){var supSet=compact.call(make(list)),subSet=compact.call(make(this)),len=subSet.length,idx=-1,isSubset=false;if(len===0){isSubset=true}else if(len<=supSet.length){isSubset=true;while(++idx<len){if(!contains.call(supSet,subSet[idx])){isSubset=false;break}}}return isSubset})})(makeArray,compactList,compactedContains);Arr.wasSubsetOf=(function(wasSubsetOf){return(function(subList,supList){return wasSubsetOf.call(subList,supList)})})(ArrProto.wasSubsetOf);ArrProto.wasRealSubsetOf=(function(make,compact,wasSubsetOf){return(function(list){return(wasSubsetOf.call(this,list)&&(compact.call(make(this)).length<compact.call(make(list)).length))})})(makeArray,compactList,ArrProto.wasSubsetOf);Arr.wasRealSubsetOf=(function(wasRealSubsetOf){return(function(subList,supList){return wasRealSubsetOf.call(subList,supList)})})(ArrProto.wasRealSubsetOf);ArrProto.wasSupersetOf=(function(wasSubsetOf){return(function(list){return wasSubsetOf.call(list,this)})})(ArrProto.wasSubsetOf);Arr.wasSupersetOf=(function(wasSupersetOf){return(function(supList,subList){return wasSupersetOf.call(supList,subList)})})(ArrProto.wasSupersetOf);ArrProto.wasRealSupersetOf=(function(wasRealSubsetOf){return(function(list){return wasRealSubsetOf.call(list,this)})})(ArrProto.wasRealSubsetOf);Arr.wasRealSupersetOf=(function(wasRealSupersetOf){return(function(supList,subList){return wasRealSupersetOf.call(supList,subList)})})(ArrProto.wasRealSupersetOf);ArrProto.wasUniverseOf=(function(make,compact,wasSubsetOf){return(function(){var supList=compact.call(make(this)),subLists=arguments,len=subLists.length,idx=-1,isUniverse=false;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=wasSubsetOf.call(subLists[idx],supList);if(!isUniverse){break}}}return isUniverse})})(makeArray,compactList,ArrProto.wasSubsetOf);Arr.wasUniverseOf=(function(make,wasUniverseOf){return(function(){var subLists=make(arguments),supList=subLists.shift();return wasUniverseOf.apply(supList,subLists)})})(makeArray,ArrProto.wasUniverseOf);ArrProto.total=(function(is,make,push){return(function(){var arr=((is(this)&&this)||make(this)),lists=arguments,len=lists.length,idx=-1,list;while(++idx<len){list=lists[idx];push.apply(arr,((is(list)&&list)||make(list)))}return arr})})(isArray,makeArray,ArrProto.push);Arr.total=(function(make,total){return(function(){var lists=make(arguments),list=make(lists.shift());return total.apply(list,lists)})})(makeArray,ArrProto.total);ArrProto.merge=(function(compact,total){return(function(){return compact.call(total.apply(this,arguments))})})(compactList,ArrProto.total);Arr.merge=(function(make,compact,total){return(function(){var lists=make(arguments),list=make(lists.shift());return compact.call(total.apply(list,lists))})})(makeArray,compactList,ArrProto.total);ArrProto.intersection=(function(is,make,compact,indexOf){return(function(list){list=compact.call(make(list));var arr=compact.call((is(this)&&this)||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0){list.splice(k,1)}else{arr.splice(i,1);--len;--i}}return arr})})(isArray,makeArray,compactList,compactedIndexOf);Arr.intersection=(function(make,intersection){return(function(arr01,arr02){return intersection.call(make(arr01),arr02)})})(makeArray,ArrProto.intersection);ArrProto.wasDisjoint=(function(intersection){return(function(list){return(intersection(this,list).length===0)})})(Arr.intersection);Arr.wasDisjoint=(function(intersection){return(function(arr01,arr02){return(intersection(arr01,arr02).length===0)})})(Arr.intersection);ArrProto.difference=(function(is,make,compact,indexOf){return(function(list){list=compact.call(make(list));var arr=compact.call((is(this)&&this)||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0){list.splice(k,1);arr.splice(i,1);--len;--i}}return arr})})(isArray,makeArray,compactList,compactedIndexOf);Arr.difference=(function(make,difference){return(function(arr01,arr02){return difference.call(make(arr01),arr02)})})(makeArray,ArrProto.difference);ArrProto.symmetricDifference=(function(is,make,compact,indexOf,push){return(function(list){list=compact.call(make(list));var arr=compact.call((is(this)&&this)||make(this)),len=arr.length,i=-1,k;while(++i<len){k=indexOf.call(list,arr[i]);if(k>=0){list.splice(k,1);arr.splice(i,1);--len;--i}}push.apply(arr,list);return arr})})(isArray,makeArray,compactList,compactedIndexOf,ArrProto.push);Arr.symmetricDifference=(function(make,symmetricDifference){return(function(arr01,arr02){return symmetricDifference.call(make(arr01),arr02)})})(makeArray,ArrProto.symmetricDifference);ArrProto.relativeComplement=(function(is,make,wasSubsetOf,difference){return(function(list){var complement=((is(this)&&this)||make(this));if(wasSubsetOf.call(list,complement)){difference.call(complement,list)}else{complement.length=0}return complement})})(isArray,makeArray,ArrProto.wasSubsetOf,ArrProto.difference);Arr.relativeComplement=(function(make,relativeComplement){return(function(arr01,arr02){return relativeComplement.call(make(arr01),arr02)})})(makeArray,ArrProto.relativeComplement);ArrProto.absoluteComplement=(function(total,relativeComplement){return(function(){return relativeComplement.call(this,total.apply([],arguments))})})(Arr.total,ArrProto.relativeComplement);Arr.absoluteComplement=(function(make,total,relativeComplement){return(function(){var lists=make(arguments),list=make(lists.shift());return relativeComplement.call(list,total.apply([],lists))})})(makeArray,Arr.total,ArrProto.relativeComplement);(ns||sh)["Set"]=(function(){var Set=(function(make,compact){return(function(){var cardinalNumber=0,set=[];this.valueOf=(function(){return(((cardinalNumber>0)&&make(set))||EMPTY_SET)});this.toArray=(function(){return(((cardinalNumber>0)&&make(set))||[])});this.toString=(function(){return["{",set.join(", "),"}"].join("")});this.getCardinalNumber=(function(){return cardinalNumber});this.compile=(function(){set=compact.call(make(arguments));cardinalNumber=set.length;return this});return this.compile.apply(this,arguments)})})(makeArray,compactList),SetProto=Set.prototype,EMPTY_SET=new Set,isEmptySet=(function(EMPTY_SET){return(function(set){return((set&&set.valueOf())===EMPTY_SET)})})(EMPTY_SET),isSet=(function(is){return(function(set){return(set&&!is(set)&&(typeof set.toArray=="function")&&is(set.toArray()))})})(isArray);SetProto.isEmptySet=(function(isEmptySet){return(function(){return isEmptySet(this)})})(isEmptySet);Set.isEmptySet=(function(isEmptySet){return(function(set){return isEmptySet(set)})})(isEmptySet);SetProto.isSet=(function(isSet){return(function(){return isSet(this)})})(isSet);Set.isSet=(function(isSet){return(function(set){return isSet(set)})})(isSet);SetProto.isSubsetOf=(function(is,contains){return(function(set){var supSet=(is(set)&&set.toArray()),subSet=(is(this)&&this.toArray()),len,idx,isSubset;if(supSet&&subSet){isSubset=false;len=subSet.length;if(len===0){isSubset=true}else if(len<=supSet.length){isSubset=true;idx=-1;while(++idx<len){if(!contains.call(supSet,subSet[idx])){isSubset=false;break}}}}return isSubset})})(isSet,compactedContains);Set.isSubsetOf=(function(isSubsetOf){return(function(subSet,supSet){return isSubsetOf.call(subSet,supSet)})})(SetProto.isSubsetOf);SetProto.isRealSubsetOf=(function(isSubsetOf){return(function(set){return(isSubsetOf.call(this,set)&&(this.getCardinalNumber()<set.getCardinalNumber()))})})(SetProto.isSubsetOf);Set.isRealSubsetOf=(function(isRealSubsetOf){return(function(subSet,supSet){return isRealSubsetOf.call(subSet,supSet)})})(SetProto.isRealSubsetOf);SetProto.isSupersetOf=(function(isSubsetOf){return(function(set){return isSubsetOf.call(set,this)})})(SetProto.isSubsetOf);Set.isSupersetOf=(function(isSupersetOf){return(function(supSet,subSet){return isSupersetOf.call(supSet,subSet)})})(SetProto.isSupersetOf);SetProto.isRealSupersetOf=(function(isRealSubsetOf){return(function(list){return isRealSubsetOf.call(list,this)})})(SetProto.isRealSubsetOf);Set.isRealSupersetOf=(function(isRealSupersetOf){return(function(supSet,subSet){return isRealSupersetOf.call(supSet,subSet)})})(SetProto.isRealSupersetOf);SetProto.isUniverseOf=(function(isSubsetOf){return(function(){var supSet=this,subSets=arguments,len=subSets.length,idx=-1,isUniverse;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=isSubsetOf.call(subSets[idx],supSet)if(!isUniverse){break}}}return isUniverse})})(SetProto.isSubsetOf);Set.isUniverseOf=(function(make,isUniverseOf){return(function(){var subSets=make(arguments),supSet=subSets.shift();return isUniverseOf.apply(supSet,subSets)})})(makeArray,SetProto.isUniverseOf);SetProto.merge=(function(is,push){return(function(){var merger=this,total=(is(merger)&&merger.toArray()),sets=arguments,len=sets.length,idx=-1,arr;if(total){while(++idx<len){arr=sets[idx];arr=(is(arr)&&arr.toArray());(arr&&push.apply(total,arr))}merger.compile.apply(merger,total)}return merger})})(isSet,ArrProto.push);Set.merge=(function(merge,Set){return(function(){return merge.apply((new Set),arguments)})})(SetProto.merge,Set);SetProto.intersection=(function(is,indexOf){return(function(set){var intersection=this,joint=(is(intersection)&&intersection.toArray()),arr=(is(set)&&set.toArray()),i=-1,k,len;if(joint&&arr){len=joint.length;while(++i<len){k=indexOf.call(arr,joint[i]);if(k>=0){arr.splice(k,1)}else{joint.splice(i,1);--len;--i}}intersection.compile.apply(intersection,joint)}return intersection})})(isSet,compactedIndexOf);Set.intersection=(function(is,intersection,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return intersection.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.intersection,Set);SetProto.isDisjoint=(function(intersection){return(function(set){return(intersection(this,set).isEmptySet())})})(Set.intersection);Set.isDisjoint=(function(intersection){return(function(set01,set02){return(intersection(set01,set02).isEmptySet())})})(Set.intersection);SetProto.difference=(function(is,indexOf){return(function(set){var difference=this,diff=(is(difference)&&difference.toArray()),arr=(is(set)&&set.toArray()),i=-1,k,len;if(diff&&arr){len=diff.length;while(++i<len){k=indexOf.call(arr,diff[i]);if(k>=0){arr.splice(k,1);diff.splice(i,1);--len;--i}}difference.compile.apply(difference,diff)}return difference})})(isSet,compactedIndexOf);Set.difference=(function(is,difference,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return difference.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.difference,Set);SetProto.symmetricDifference=(function(is,indexOf,push){return(function(set){var difference=this,sym=(is(difference)&&difference.toArray()),arr=(is(set)&&set.toArray()),i=-1,k,len;if(sym&&arr){len=sym.length;while(++i<len){k=indexOf.call(arr,sym[i]);if(k>=0){arr.splice(k,1);sym.splice(i,1);--len;--i}}push.apply(sym,arr);difference.compile.apply(difference,sym)}return difference})})(isSet,compactedIndexOf,ArrProto.push);Set.symmetricDifference=(function(is,symmetricDifference,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return symmetricDifference.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.symmetricDifference,Set);SetProto.relativeComplement=(function(isSubsetOf,difference,Set){return(function(set){var complement=this,isSubset=isSubsetOf.call(set,complement);if(typeof isSubset=="undefined"){complement=new Set}else if(isSubset){difference.call(complement,set)}else{complement.compile.call(complement)}return complement})})(SetProto.isSubsetOf,SetProto.difference,Set);Set.relativeComplement=(function(is,relativeComplement,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return relativeComplement.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.relativeComplement,Set);SetProto.absoluteComplement=(function(merge,relativeComplement,Set){return(function(){return relativeComplement.call(this,merge.apply((new Set),arguments))})})(SetProto.merge,SetProto.relativeComplement,Set);Set.absoluteComplement=(function(is,make,merge,relativeComplement,Set){return(function(){var sets=make(arguments),set=sets.shift(),arr=((is(set)&&set.toArray())||[]);set=new Set;return relativeComplement.call(set.compile.apply(set,arr),merge.apply((new Set),sets))})})(isSet,makeArray,SetProto.merge,SetProto.relativeComplement,Set);SetProto=isEmptySet=isSet=null;delete SetProto;delete isEmptySet;delete isSet;return Set})();compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=Arr=sh=ns=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete Arr;delete sh;delete ns;delete arguments.callee}).call(null);

- packed / shrinked           - 11.228 byte
(function(h){var j=this;if(!j.Array||(typeof j.Array.make!="function")||(typeof j.Array.isArray!="function")){throw(new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect]."));}var l=j.Array,ArrProto=l.prototype,makeArray=l.make,isArray=l.isArray,compactList=(function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len){if(list[k]===obj){list.splice(k,1);--len;--k}}if(!obj&&((typeof obj=="undefined")||(typeof obj=="object"))){list.splice(i,1);--len;--i}}return list}),compactedContains=(function(a){var b=false,i=-1,list=this,len=list.length;while(++i<len){if(list[i]===a){b=true;break}}return b}),compactedIndexOf=(((typeof ArrProto.indexOf=="function")&&ArrProto.indexOf)||(function(a){var i=idx=-1,list=this,len=list.length;while(++i<len){if(list[i]===a){idx=i;break}}return idx}));ArrProto.wasEmptySet=(function(a,b){return(function(){return(b.call(a(this)).length===0)})})(makeArray,compactList);l.wasEmptySet=(function(b){return(function(a){return b.call(a)})})(ArrProto.wasEmptySet);ArrProto.wasSubsetOf=(function(c,d,e){return(function(a){var b=d.call(c(a)),subSet=d.call(c(this)),len=subSet.length,idx=-1,isSubset=false;if(len===0){isSubset=true}else if(len<=b.length){isSubset=true;while(++idx<len){if(!e.call(b,subSet[idx])){isSubset=false;break}}}return isSubset})})(makeArray,compactList,compactedContains);l.wasSubsetOf=(function(c){return(function(a,b){return c.call(a,b)})})(ArrProto.wasSubsetOf);ArrProto.wasRealSubsetOf=(function(b,c,d){return(function(a){return(d.call(this,a)&&(c.call(b(this)).length<c.call(b(a)).length))})})(makeArray,compactList,ArrProto.wasSubsetOf);l.wasRealSubsetOf=(function(c){return(function(a,b){return c.call(a,b)})})(ArrProto.wasRealSubsetOf);ArrProto.wasSupersetOf=(function(b){return(function(a){return b.call(a,this)})})(ArrProto.wasSubsetOf);l.wasSupersetOf=(function(c){return(function(a,b){return c.call(a,b)})})(ArrProto.wasSupersetOf);ArrProto.wasRealSupersetOf=(function(b){return(function(a){return b.call(a,this)})})(ArrProto.wasRealSubsetOf);l.wasRealSupersetOf=(function(c){return(function(a,b){return c.call(a,b)})})(ArrProto.wasRealSupersetOf);ArrProto.wasUniverseOf=(function(b,c,d){return(function(){var a=c.call(b(this)),subLists=arguments,len=subLists.length,idx=-1,isUniverse=false;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=d.call(subLists[idx],a);if(!isUniverse){break}}}return isUniverse})})(makeArray,compactList,ArrProto.wasSubsetOf);l.wasUniverseOf=(function(b,c){return(function(){var a=b(arguments),supList=a.shift();return c.apply(supList,a)})})(makeArray,ArrProto.wasUniverseOf);ArrProto.total=(function(b,c,d){return(function(){var a=((b(this)&&this)||c(this)),lists=arguments,len=lists.length,idx=-1,list;while(++idx<len){list=lists[idx];d.apply(a,((b(list)&&list)||c(list)))}return a})})(isArray,makeArray,ArrProto.push);l.total=(function(b,c){return(function(){var a=b(arguments),list=b(a.shift());return c.apply(list,a)})})(makeArray,ArrProto.total);ArrProto.merge=(function(a,b){return(function(){return a.call(b.apply(this,arguments))})})(compactList,ArrProto.total);l.merge=(function(b,c,d){return(function(){var a=b(arguments),list=b(a.shift());return c.call(d.apply(list,a))})})(makeArray,compactList,ArrProto.total);ArrProto.intersection=(function(c,d,e,f){return(function(a){a=e.call(d(a));var b=e.call((c(this)&&this)||d(this)),len=b.length,i=-1,k;while(++i<len){k=f.call(a,b[i]);if(k>=0){a.splice(k,1)}else{b.splice(i,1);--len;--i}}return b})})(isArray,makeArray,compactList,compactedIndexOf);l.intersection=(function(c,d){return(function(a,b){return d.call(c(a),b)})})(makeArray,ArrProto.intersection);ArrProto.wasDisjoint=(function(b){return(function(a){return(b(this,a).length===0)})})(l.intersection);l.wasDisjoint=(function(c){return(function(a,b){return(c(a,b).length===0)})})(l.intersection);ArrProto.difference=(function(c,d,e,f){return(function(a){a=e.call(d(a));var b=e.call((c(this)&&this)||d(this)),len=b.length,i=-1,k;while(++i<len){k=f.call(a,b[i]);if(k>=0){a.splice(k,1);b.splice(i,1);--len;--i}}return b})})(isArray,makeArray,compactList,compactedIndexOf);l.difference=(function(c,d){return(function(a,b){return d.call(c(a),b)})})(makeArray,ArrProto.difference);ArrProto.symmetricDifference=(function(c,d,e,f,g){return(function(a){a=e.call(d(a));var b=e.call((c(this)&&this)||d(this)),len=b.length,i=-1,k;while(++i<len){k=f.call(a,b[i]);if(k>=0){a.splice(k,1);b.splice(i,1);--len;--i}}g.apply(b,a);return b})})(isArray,makeArray,compactList,compactedIndexOf,ArrProto.push);l.symmetricDifference=(function(c,d){return(function(a,b){return d.call(c(a),b)})})(makeArray,ArrProto.symmetricDifference);ArrProto.relativeComplement=(function(c,d,e,f){return(function(a){var b=((c(this)&&this)||d(this));if(e.call(a,b)){f.call(b,a)}else{b.length=0}return b})})(isArray,makeArray,ArrProto.wasSubsetOf,ArrProto.difference);l.relativeComplement=(function(c,d){return(function(a,b){return d.call(c(a),b)})})(makeArray,ArrProto.relativeComplement);ArrProto.absoluteComplement=(function(a,b){return(function(){return b.call(this,a.apply([],arguments))})})(l.total,ArrProto.relativeComplement);l.absoluteComplement=(function(b,c,d){return(function(){var a=b(arguments),list=b(a.shift());return d.call(list,c.apply([],a))})})(makeArray,l.total,ArrProto.relativeComplement);(h||j).Set=(function(){var g=(function(b,c){return(function(){var a=0,set=[];this.valueOf=(function(){return(((a>0)&&b(set))||EMPTY_SET)});this.toArray=(function(){return(((a>0)&&b(set))||[])});this.toString=(function(){return["{",set.join(", "),"}"].join("")});this.getCardinalNumber=(function(){return a});this.compile=(function(){set=c.call(b(arguments));a=set.length;return this});return this.compile.apply(this,arguments)})})(makeArray,compactList),SetProto=g.prototype,EMPTY_SET=new g,isEmptySet=(function(b){return(function(a){return((a&&a.valueOf())===b)})})(EMPTY_SET),isSet=(function(b){return(function(a){return(a&&!b(a)&&(typeof a.toArray=="function")&&b(a.toArray()))})})(isArray);SetProto.isEmptySet=(function(a){return(function(){return a(this)})})(isEmptySet);g.isEmptySet=(function(b){return(function(a){return b(a)})})(isEmptySet);SetProto.isSet=(function(a){return(function(){return a(this)})})(isSet);g.isSet=(function(b){return(function(a){return b(a)})})(isSet);SetProto.isSubsetOf=(function(c,d){return(function(a){var b=(c(a)&&a.toArray()),subSet=(c(this)&&this.toArray()),len,idx,isSubset;if(b&&subSet){isSubset=false;len=subSet.length;if(len===0){isSubset=true}else if(len<=b.length){isSubset=true;idx=-1;while(++idx<len){if(!d.call(b,subSet[idx])){isSubset=false;break}}}}return isSubset})})(isSet,compactedContains);g.isSubsetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isSubsetOf);SetProto.isRealSubsetOf=(function(b){return(function(a){return(b.call(this,a)&&(this.getCardinalNumber()<a.getCardinalNumber()))})})(SetProto.isSubsetOf);g.isRealSubsetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isRealSubsetOf);SetProto.isSupersetOf=(function(b){return(function(a){return b.call(a,this)})})(SetProto.isSubsetOf);g.isSupersetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isSupersetOf);SetProto.isRealSupersetOf=(function(b){return(function(a){return b.call(a,this)})})(SetProto.isRealSubsetOf);g.isRealSupersetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isRealSupersetOf);SetProto.isUniverseOf=(function(b){return(function(){var a=this,subSets=arguments,len=subSets.length,idx=-1,isUniverse;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=b.call(subSets[idx],a)if(!isUniverse){break}}}return isUniverse})})(SetProto.isSubsetOf);g.isUniverseOf=(function(b,c){return(function(){var a=b(arguments),supSet=a.shift();return c.apply(supSet,a)})})(makeArray,SetProto.isUniverseOf);SetProto.merge=(function(b,c){return(function(){var a=this,total=(b(a)&&a.toArray()),sets=arguments,len=sets.length,idx=-1,arr;if(total){while(++idx<len){arr=sets[idx];arr=(b(arr)&&arr.toArray());(arr&&c.apply(total,arr))}a.compile.apply(a,total)}return a})})(isSet,ArrProto.push);g.merge=(function(a,b){return(function(){return a.apply((new b),arguments)})})(SetProto.merge,g);SetProto.intersection=(function(c,d){return(function(a){var b=this,joint=(c(b)&&b.toArray()),arr=(c(a)&&a.toArray()),i=-1,k,len;if(joint&&arr){len=joint.length;while(++i<len){k=d.call(arr,joint[i]);if(k>=0){arr.splice(k,1)}else{joint.splice(i,1);--len;--i}}b.compile.apply(b,joint)}return b})})(isSet,compactedIndexOf);g.intersection=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.intersection,g);SetProto.isDisjoint=(function(b){return(function(a){return(b(this,a).isEmptySet())})})(g.intersection);g.isDisjoint=(function(c){return(function(a,b){return(c(a,b).isEmptySet())})})(g.intersection);SetProto.difference=(function(c,d){return(function(a){var b=this,diff=(c(b)&&b.toArray()),arr=(c(a)&&a.toArray()),i=-1,k,len;if(diff&&arr){len=diff.length;while(++i<len){k=d.call(arr,diff[i]);if(k>=0){arr.splice(k,1);diff.splice(i,1);--len;--i}}b.compile.apply(b,diff)}return b})})(isSet,compactedIndexOf);g.difference=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.difference,g);SetProto.symmetricDifference=(function(c,d,e){return(function(a){var b=this,sym=(c(b)&&b.toArray()),arr=(c(a)&&a.toArray()),i=-1,k,len;if(sym&&arr){len=sym.length;while(++i<len){k=d.call(arr,sym[i]);if(k>=0){arr.splice(k,1);sym.splice(i,1);--len;--i}}e.apply(sym,arr);b.compile.apply(b,sym)}return b})})(isSet,compactedIndexOf,ArrProto.push);g.symmetricDifference=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.symmetricDifference,g);SetProto.relativeComplement=(function(c,d,e){return(function(a){var b=this,isSubset=c.call(a,b);if(typeof isSubset=="undefined"){b=new e}else if(isSubset){d.call(b,a)}else{b.compile.call(b)}return b})})(SetProto.isSubsetOf,SetProto.difference,g);g.relativeComplement=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.relativeComplement,g);SetProto.absoluteComplement=(function(a,b,c){return(function(){return b.call(this,a.apply((new c),arguments))})})(SetProto.merge,SetProto.relativeComplement,g);g.absoluteComplement=(function(b,c,d,e,f){return(function(){var a=c(arguments),set=a.shift(),arr=((b(set)&&set.toArray())||[]);set=new f;return e.call(set.compile.apply(set,arr),d.apply((new f),a))})})(isSet,makeArray,SetProto.merge,SetProto.relativeComplement,g);SetProto=isEmptySet=isSet=null;delete SetProto;delete isEmptySet;delete isSet;return g})();compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=l=j=h=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete l;delete j;delete h;delete arguments.callee}).call(null);

- packed / shrinked / encoded -  6.255 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(h){9 j=5;m(!j.X||(N j.X.1g!="2")||(N j.X.F!="2")){1J(x 1I("1K [[1r]] 1G 1F 1s 1D 1B 1s [[X]] 1A 1z 1x [X.1g.1H]."));}9 l=j.X,7=l.1o,q=l.1g,F=l.F,A=(2(){9 i=-1,k,10,o=5,6=o.n;w(++i<6){10=o[i];k=i;w(++k<6){m(o[k]===10){o.z(k,1);--6;--k}}m(!10&&((N 10=="1u")||(N 10=="1y"))){o.z(i,1);--6;--i}}3 o}),12=(2(a){9 b=W,i=-1,o=5,6=o.n;w(++i<6){m(o[i]===a){b=O;U}}3 b}),J=(((N 7.1n=="2")&&7.1n)||(2(a){9 i=r=-1,o=5,6=o.n;w(++i<6){m(o[i]===a){r=i;U}}3 r}));7.1l=(2(a,b){3(2(){3(b.4(a(5)).n===0)})})(q,A);l.1l=(2(b){3(2(a){3 b.4(a)})})(7.1l);7.Q=(2(c,d,e){3(2(a){9 b=d.4(c(a)),R=d.4(c(5)),6=R.n,r=-1,y=W;m(6===0){y=O}M m(6<=b.n){y=O;w(++r<6){m(!e.4(b,R[r])){y=W;U}}}3 y})})(q,A,12);l.Q=(2(c){3(2(a,b){3 c.4(a,b)})})(7.Q);7.14=(2(b,c,d){3(2(a){3(d.4(5,a)&&(c.4(b(5)).n<c.4(b(a)).n))})})(q,A,7.Q);l.14=(2(c){3(2(a,b){3 c.4(a,b)})})(7.14);7.1a=(2(b){3(2(a){3 b.4(a,5)})})(7.Q);l.1a=(2(c){3(2(a,b){3 c.4(a,b)})})(7.1a);7.1b=(2(b){3(2(a){3 b.4(a,5)})})(7.14);l.1b=(2(c){3(2(a,b){3 c.4(a,b)})})(7.1b);7.1c=(2(b,c,d){3(2(){9 a=c.4(b(5)),1d=v,6=1d.n,r=-1,I=W;m(6>=1){I=O;w(++r<6){I=d.4(1d[r],a);m(!I){U}}}3 I})})(q,A,7.Q);l.1c=(2(b,c){3(2(){9 a=b(v),1v=a.Z();3 c.p(1v,a)})})(q,7.1c);7.E=(2(b,c,d){3(2(){9 a=((b(5)&&5)||c(5)),17=v,6=17.n,r=-1,o;w(++r<6){o=17[r];d.p(a,((b(o)&&o)||c(o)))}3 a})})(F,q,7.16);l.E=(2(b,c){3(2(){9 a=b(v),o=b(a.Z());3 c.p(o,a)})})(q,7.E);7.P=(2(a,b){3(2(){3 a.4(b.p(5,v))})})(A,7.E);l.P=(2(b,c,d){3(2(){9 a=b(v),o=b(a.Z());3 c.4(d.p(o,a))})})(q,A,7.E);7.H=(2(c,d,e,f){3(2(a){a=e.4(d(a));9 b=e.4((c(5)&&5)||d(5)),6=b.n,i=-1,k;w(++i<6){k=f.4(a,b[i]);m(k>=0){a.z(k,1)}M{b.z(i,1);--6;--i}}3 b})})(F,q,A,J);l.H=(2(c,d){3(2(a,b){3 d.4(c(a),b)})})(q,7.H);7.1m=(2(b){3(2(a){3(b(5,a).n===0)})})(l.H);l.1m=(2(c){3(2(a,b){3(c(a,b).n===0)})})(l.H);7.L=(2(c,d,e,f){3(2(a){a=e.4(d(a));9 b=e.4((c(5)&&5)||d(5)),6=b.n,i=-1,k;w(++i<6){k=f.4(a,b[i]);m(k>=0){a.z(k,1);b.z(i,1);--6;--i}}3 b})})(F,q,A,J);l.L=(2(c,d){3(2(a,b){3 d.4(c(a),b)})})(q,7.L);7.11=(2(c,d,e,f,g){3(2(a){a=e.4(d(a));9 b=e.4((c(5)&&5)||d(5)),6=b.n,i=-1,k;w(++i<6){k=f.4(a,b[i]);m(k>=0){a.z(k,1);b.z(i,1);--6;--i}}g.p(b,a);3 b})})(F,q,A,J,7.16);l.11=(2(c,d){3(2(a,b){3 d.4(c(a),b)})})(q,7.11);7.G=(2(c,d,e,f){3(2(a){9 b=((c(5)&&5)||d(5));m(e.4(a,b)){f.4(b,a)}M{b.n=0}3 b})})(F,q,7.Q,7.L);l.G=(2(c,d){3(2(a,b){3 d.4(c(a),b)})})(q,7.G);7.13=(2(a,b){3(2(){3 b.4(5,a.p([],v))})})(l.E,7.G);l.13=(2(b,c,d){3(2(){9 a=b(v),o=b(a.Z());3 d.4(o,c.p([],a))})})(q,l.E,7.G);(h||j).1r=(2(){9 g=(2(b,c){3(2(){9 a=0,D=[];5.1w=(2(){3(((a>0)&&b(D))||1k)});5.t=(2(){3(((a>0)&&b(D))||[])});5.1E=(2(){3["{",D.1q(", "),"}"].1q("")});5.1j=(2(){3 a});5.C=(2(){D=c.4(b(v));a=D.n;3 5});3 5.C.p(5,v)})})(q,A),8=g.1o,1k=x g,K=(2(b){3(2(a){3((a&&a.1w())===b)})})(1k),u=(2(b){3(2(a){3(a&&!b(a)&&(N a.t=="2")&&b(a.t()))})})(F);8.K=(2(a){3(2(){3 a(5)})})(K);g.K=(2(b){3(2(a){3 b(a)})})(K);8.u=(2(a){3(2(){3 a(5)})})(u);g.u=(2(b){3(2(a){3 b(a)})})(u);8.T=(2(c,d){3(2(a){9 b=(c(a)&&a.t()),R=(c(5)&&5.t()),6,r,y;m(b&&R){y=W;6=R.n;m(6===0){y=O}M m(6<=b.n){y=O;r=-1;w(++r<6){m(!d.4(b,R[r])){y=W;U}}}}3 y})})(u,12);g.T=(2(c){3(2(a,b){3 c.4(a,b)})})(8.T);8.15=(2(b){3(2(a){3(b.4(5,a)&&(5.1j()<a.1j()))})})(8.T);g.15=(2(c){3(2(a,b){3 c.4(a,b)})})(8.15);8.1i=(2(b){3(2(a){3 b.4(a,5)})})(8.T);g.1i=(2(c){3(2(a,b){3 c.4(a,b)})})(8.1i);8.1h=(2(b){3(2(a){3 b.4(a,5)})})(8.15);g.1h=(2(c){3(2(a,b){3 c.4(a,b)})})(8.1h);8.18=(2(b){3(2(){9 a=5,1f=v,6=1f.n,r=-1,I;m(6>=1){I=O;w(++r<6){I=b.4(1f[r],a)m(!I){U}}}3 I})})(8.T);g.18=(2(b,c){3(2(){9 a=b(v),1t=a.Z();3 c.p(1t,a)})})(q,8.18);8.P=(2(b,c){3(2(){9 a=5,E=(b(a)&&a.t()),1e=v,6=1e.n,r=-1,s;m(E){w(++r<6){s=1e[r];s=(b(s)&&s.t());(s&&c.p(E,s))}a.C.p(a,E)}3 a})})(u,7.16);g.P=(2(a,b){3(2(){3 a.p((x b),v)})})(8.P,g);8.H=(2(c,d){3(2(a){9 b=5,Y=(c(b)&&b.t()),s=(c(a)&&a.t()),i=-1,k,6;m(Y&&s){6=Y.n;w(++i<6){k=d.4(s,Y[i]);m(k>=0){s.z(k,1)}M{Y.z(i,1);--6;--i}}b.C.p(b,Y)}3 b})})(u,J);g.H=(2(d,e,f){3(2(a,b){9 c=((d(a)&&a.t())||[]);a=x f;3 e.4(a.C.p(a,c),((d(b)&&b)||(x f)))})})(u,8.H,g);8.1p=(2(b){3(2(a){3(b(5,a).K())})})(g.H);g.1p=(2(c){3(2(a,b){3(c(a,b).K())})})(g.H);8.L=(2(c,d){3(2(a){9 b=5,V=(c(b)&&b.t()),s=(c(a)&&a.t()),i=-1,k,6;m(V&&s){6=V.n;w(++i<6){k=d.4(s,V[i]);m(k>=0){s.z(k,1);V.z(i,1);--6;--i}}b.C.p(b,V)}3 b})})(u,J);g.L=(2(d,e,f){3(2(a,b){9 c=((d(a)&&a.t())||[]);a=x f;3 e.4(a.C.p(a,c),((d(b)&&b)||(x f)))})})(u,8.L,g);8.11=(2(c,d,e){3(2(a){9 b=5,S=(c(b)&&b.t()),s=(c(a)&&a.t()),i=-1,k,6;m(S&&s){6=S.n;w(++i<6){k=d.4(s,S[i]);m(k>=0){s.z(k,1);S.z(i,1);--6;--i}}e.p(S,s);b.C.p(b,S)}3 b})})(u,J,7.16);g.11=(2(d,e,f){3(2(a,b){9 c=((d(a)&&a.t())||[]);a=x f;3 e.4(a.C.p(a,c),((d(b)&&b)||(x f)))})})(u,8.11,g);8.G=(2(c,d,e){3(2(a){9 b=5,y=c.4(a,b);m(N y=="1u"){b=x e}M m(y){d.4(b,a)}M{b.C.4(b)}3 b})})(8.T,8.L,g);g.G=(2(d,e,f){3(2(a,b){9 c=((d(a)&&a.t())||[]);a=x f;3 e.4(a.C.p(a,c),((d(b)&&b)||(x f)))})})(u,8.G,g);8.13=(2(a,b,c){3(2(){3 b.4(5,a.p((x c),v))})})(8.P,8.G,g);g.13=(2(b,c,d,e,f){3(2(){9 a=c(v),D=a.Z(),s=((b(D)&&D.t())||[]);D=x f;3 e.4(D.C.p(D,s),d.p((x f),a))})})(u,q,8.P,8.G,g);8=K=u=19;B 8;B K;B u;3 g})();J=12=A=F=q=7=l=j=h=19;B J;B 12;B A;B F;B q;B 7;B l;B j;B h;B v.1C}).4(19);',62,109,'||function|return|call|this|len|ArrProto|SetProto|var|||||||||||||if|length|list|apply|makeArray|idx|arr|toArray|isSet|arguments|while|new|isSubset|splice|compactList|delete|compile|set|total|isArray|relativeComplement|intersection|isUniverse|compactedIndexOf|isEmptySet|difference|else|typeof|true|merge|wasSubsetOf|subSet|sym|isSubsetOf|break|diff|false|Array|joint|shift|obj|symmetricDifference|compactedContains|absoluteComplement|wasRealSubsetOf|isRealSubsetOf|push|lists|isUniverseOf|null|wasSupersetOf|wasRealSupersetOf|wasUniverseOf|subLists|sets|subSets|make|isRealSupersetOf|isSupersetOf|getCardinalNumber|EMPTY_SET|wasEmptySet|wasDisjoint|indexOf|prototype|isDisjoint|join|Set|the|supSet|undefined|supList|valueOf|base|object|module|extensions|of|callee|presence|toString|requires|implementation|detect|ReferenceError|throw|This'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    -  5.650 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(v){6 s=4;7(!s.N||H s.N.12!="2"||H s.N.18!="2")1m z 1v("1j [[1h]] 1w 1u 1g 1s 1q 1g [[N]] 1p 1n 1l [N.12.1k].");6 n=s.N,j=n.1d,o=n.12,q=n.18,p=2(){y(6 c=-1,a,g,i=4.9;++c<i;){g=4[c];y(a=c;++a<i;)7(4[a]===g){4.A(a,1);--i;--a}7(!g&&(H g=="1a"||H g=="1o")){4.A(c,1);--i;--c}}3 4},u=2(c){y(6 a=O,g=-1,i=4.9;++g<i;)7(4[g]===c){a=K;M}3 a},r=H j.19=="2"&&j.19||2(c){y(6 a=11=-1,g=4.9;++a<g;)7(4[a]===c){11=a;M}3 11};j.10=2(c,a){3 2(){3 a.5(c(4)).9===0}}(o,p);n.10=2(c){3 2(a){3 c.5(a)}}(j.10);j.I=2(c,a,g){3 2(i){i=a.5(c(i));6 k=a.5(c(4)),b=k.9,e=-1,d=O;7(b===0)d=K;P 7(b<=i.9)y(d=K;++e<b;)7(!g.5(i,k[e])){d=O;M}3 d}}(o,p,u);n.I=2(c){3 2(a,g){3 c.5(a,g)}}(j.I);j.V=2(c,a,g){3 2(i){3 g.5(4,i)&&a.5(c(4)).9<a.5(c(i)).9}}(o,p,j.I);n.V=2(c){3 2(a,g){3 c.5(a,g)}}(j.V);j.Z=2(c){3 2(a){3 c.5(a,4)}}(j.I);n.Z=2(c){3 2(a,g){3 c.5(a,g)}}(j.Z);j.Y=2(c){3 2(a){3 c.5(a,4)}}(j.V);n.Y=2(c){3 2(a,g){3 c.5(a,g)}}(j.Y);j.13=2(c,a,g){3 2(){6 i=a.5(c(4)),k=x,b=k.9,e=-1,d=O;7(b>=1)y(d=K;++e<b;){d=g.5(k[e],i);7(!d)M}3 d}}(o,p,j.I);n.13=2(c,a){3 2(){6 g=c(x),i=g.R();3 a.8(i,g)}}(o,j.13);j.J=2(c,a,g){3 2(){y(6 i=c(4)&&4||a(4),k=x,b=k.9,e=-1,d;++e<b;){d=k[e];g.8(i,c(d)&&d||a(d))}3 i}}(q,o,j.T);n.J=2(c,a){3 2(){6 g=c(x),i=c(g.R());3 a.8(i,g)}}(o,j.J);j.G=2(c,a){3 2(){3 c.5(a.8(4,x))}}(p,j.J);n.G=2(c,a,g){3 2(){6 i=c(x),k=c(i.R());3 a.5(g.8(k,i))}}(o,p,j.J);j.E=2(c,a,g,i){3 2(k){k=g.5(a(k));y(6 b=g.5(c(4)&&4||a(4)),e=b.9,d=-1,f;++d<e;){f=i.5(k,b[d]);7(f>=0)k.A(f,1);P{b.A(d,1);--e;--d}}3 b}}(q,o,p,r);n.E=2(c,a){3 2(g,i){3 a.5(c(g),i)}}(o,j.E);j.1f=2(c){3 2(a){3 c(4,a).9===0}}(n.E);n.1f=2(c){3 2(a,g){3 c(a,g).9===0}}(n.E);j.F=2(c,a,g,i){3 2(k){k=g.5(a(k));y(6 b=g.5(c(4)&&4||a(4)),e=b.9,d=-1,f;++d<e;){f=i.5(k,b[d]);7(f>=0){k.A(f,1);b.A(d,1);--e;--d}}3 b}}(q,o,p,r);n.F=2(c,a){3 2(g,i){3 a.5(c(g),i)}}(o,j.F);j.Q=2(c,a,g,i,k){3 2(b){b=g.5(a(b));y(6 e=g.5(c(4)&&4||a(4)),d=e.9,f=-1,h;++f<d;){h=i.5(b,e[f]);7(h>=0){b.A(h,1);e.A(f,1);--d;--f}}k.8(e,b);3 e}}(q,o,p,r,j.T);n.Q=2(c,a){3 2(g,i){3 a.5(c(g),i)}}(o,j.Q);j.D=2(c,a,g,i){3 2(k){6 b=c(4)&&4||a(4);7(g.5(k,b))i.5(b,k);P b.9=0;3 b}}(q,o,j.I,j.F);n.D=2(c,a){3 2(g,i){3 a.5(c(g),i)}}(o,j.D);j.S=2(c,a){3 2(){3 a.5(4,c.8([],x))}}(n.J,j.D);n.S=2(c,a,g){3 2(){6 i=c(x),k=c(i.R());3 g.5(k,a.8([],i))}}(o,n.J,j.D);(v||s).1h=2(){6 c=2(b,e){3 2(){6 d=0,f=[];4.1b=2(){3 d>0&&b(f)||g};4.w=2(){3 d>0&&b(f)||[]};4.1t=2(){3["{",f.1e(", "),"}"].1e("")};4.17=2(){3 d};4.C=2(){f=e.5(b(x));d=f.9;3 4};3 4.C.8(4,x)}}(o,p),a=c.1d,g=z c,i=2(b){3 2(e){3(e&&e.1b())===b}}(g),k=2(b){3 2(e){3 e&&!b(e)&&H e.w=="2"&&b(e.w())}}(q);a.U=2(b){3 2(){3 b(4)}}(i);c.U=2(b){3 2(e){3 b(e)}}(i);a.1i=2(b){3 2(){3 b(4)}}(k);c.1i=2(b){3 2(e){3 b(e)}}(k);a.L=2(b,e){3 2(d){d=b(d)&&d.w();6 f=b(4)&&4.w(),h,l,m;7(d&&f){m=O;h=f.9;7(h===0)m=K;P 7(h<=d.9){m=K;y(l=-1;++l<h;)7(!e.5(d,f[l])){m=O;M}}}3 m}}(k,u);c.L=2(b){3 2(e,d){3 b.5(e,d)}}(a.L);a.W=2(b){3 2(e){3 b.5(4,e)&&4.17()<e.17()}}(a.L);c.W=2(b){3 2(e,d){3 b.5(e,d)}}(a.W);a.16=2(b){3 2(e){3 b.5(e,4)}}(a.L);c.16=2(b){3 2(e,d){3 b.5(e,d)}}(a.16);a.15=2(b){3 2(e){3 b.5(e,4)}}(a.W);c.15=2(b){3 2(e,d){3 b.5(e,d)}}(a.15);a.14=2(b){3 2(){6 e=x,d=e.9,f=-1,h;7(d>=1)y(h=K;++f<d;){h=b.5(e[f],4);7(!h)M}3 h}}(a.L);c.14=2(b,e){3 2(){6 d=b(x),f=d.R();3 e.8(f,d)}}(o,a.14);a.G=2(b,e){3 2(){6 d=b(4)&&4.w(),f=x,h=f.9,l=-1,m;7(d){y(;++l<h;){m=f[l];(m=b(m)&&m.w())&&e.8(d,m)}4.C.8(4,d)}3 4}}(k,j.T);c.G=2(b,e){3 2(){3 b.8(z e,x)}}(a.G,c);a.E=2(b,e){3 2(d){6 f=b(4)&&4.w();d=b(d)&&d.w();6 h=-1,l,m;7(f&&d){y(m=f.9;++h<m;){l=e.5(d,f[h]);7(l>=0)d.A(l,1);P{f.A(h,1);--m;--h}}4.C.8(4,f)}3 4}}(k,r);c.E=2(b,e,d){3 2(f,h){6 l=b(f)&&f.w()||[];f=z d;3 e.5(f.C.8(f,l),b(h)&&h||z d)}}(k,a.E,c);a.1c=2(b){3 2(e){3 b(4,e).U()}}(c.E);c.1c=2(b){3 2(e,d){3 b(e,d).U()}}(c.E);a.F=2(b,e){3 2(d){6 f=b(4)&&4.w();d=b(d)&&d.w();6 h=-1,l,m;7(f&&d){y(m=f.9;++h<m;){l=e.5(d,f[h]);7(l>=0){d.A(l,1);f.A(h,1);--m;--h}}4.C.8(4,f)}3 4}}(k,r);c.F=2(b,e,d){3 2(f,h){6 l=b(f)&&f.w()||[];f=z d;3 e.5(f.C.8(f,l),b(h)&&h||z d)}}(k,a.F,c);a.Q=2(b,e,d){3 2(f){6 h=b(4)&&4.w();f=b(f)&&f.w();6 l=-1,m,t;7(h&&f){y(t=h.9;++l<t;){m=e.5(f,h[l]);7(m>=0){f.A(m,1);h.A(l,1);--t;--l}}d.8(h,f);4.C.8(4,h)}3 4}}(k,r,j.T);c.Q=2(b,e,d){3 2(f,h){6 l=b(f)&&f.w()||[];f=z d;3 e.5(f.C.8(f,l),b(h)&&h||z d)}}(k,a.Q,c);a.D=2(b,e,d){3 2(f){6 h=4,l=b.5(f,h);7(H l=="1a")h=z d;P l?e.5(h,f):h.C.5(h);3 h}}(a.L,a.F,c);c.D=2(b,e,d){3 2(f,h){6 l=b(f)&&f.w()||[];f=z d;3 e.5(f.C.8(f,l),b(h)&&h||z d)}}(k,a.D,c);a.S=2(b,e,d){3 2(){3 e.5(4,b.8(z d,x))}}(a.G,a.D,c);c.S=2(b,e,d,f,h){3 2(){6 l=e(x),m=l.R(),t=b(m)&&m.w()||[];m=z h;3 f.5(m.C.8(m,t),d.8(z h,l))}}(k,o,a.G,a.D,c);a=i=k=X;B a;B i;B k;3 c}();r=u=p=q=o=j=n=s=v=X;B r;B u;B p;B q;B o;B j;B n;B s;B v;B x.1r}).5(X);',62,95,'||function|return|this|call|var|if|apply|length|||||||||||||||||||||||toArray|arguments|for|new|splice|delete|compile|relativeComplement|intersection|difference|merge|typeof|wasSubsetOf|total|true|isSubsetOf|break|Array|false|else|symmetricDifference|shift|absoluteComplement|push|isEmptySet|wasRealSubsetOf|isRealSubsetOf|null|wasRealSupersetOf|wasSupersetOf|wasEmptySet|idx|make|wasUniverseOf|isUniverseOf|isRealSupersetOf|isSupersetOf|getCardinalNumber|isArray|indexOf|undefined|valueOf|isDisjoint|prototype|join|wasDisjoint|the|Set|isSet|This|detect|base|throw|module|object|extensions|of|callee|presence|toString|requires|ReferenceError|implementation'.split('|'),0,{}));


*/



//[Array.make.detect]
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(1(){E e=19,h=e.H,u=h.Y,m=e.Z.Y,v=/^\\[G\\s+Z\\]$/,q=/^\\[G\\s+1d\\]$/,k=m.1f,w=1(){E c;P{m.O.6(I,"7");c=1(d){2 1(f,b){2 d.6(f,b)}}(m.O)}J(a){c=1(d){2 1(f,b){E l;P{l=d.6(f,b)}J(r){l=18}2 l}}(m.O)}2 c}(),j=9 e.R=="1"&&e.R||1(c){2 9 c=="1"},s=j(e.X)&&e.X||1(c,a){2 1(d){2 c.F(a.6(d))}}(/^\\[G\\s+11\\]$/,k);h.D=j(h.D)&&h.D||j(e.D)&&e.D||1(c,a){2 1(d){2 c.F(a.6(d))}}(/^\\[G\\s+H\\]$/,k);h.C=j(h.C)&&h.C||j(e.C)&&e.C||1(){2 1(){2 q.F(k.6(N))}()?1(c,a){2 1(d){2 c.F(a.6(d))}}(q,k):1(c,a,d,f){2 1(b){2!!b&&c.F(a.6(b))&&9 b.7=="K"&&d(b.7)&&!f(b,"7")}}(v,k,e.L,w)}();h.M=1(){E c,a,d,f=e.12,b=u.1c,l=f&&f.1b||[],r=f&&j(f.W)&&f.W("")||[];P{a=b.6(l);a=b.6(r);a=b.6(N);d=a.14("");8(a.7!=3||d!="H.M")S T();a=b.6(d);8(a.7!==10||a[5]!==".")S T();c=1(x,y,z){2 1(n){E t=(n||y(n))&&n.7;2 9 t=="K"&&z(t)&&x.6(n)||1e 0}}(b,s,e.L)}J(B){c=1(x,y,z,n,t,A){2 1(g){E p,i,o=(y(g)||z(g))&&x.6(g)||n(g)&&g.13("")||p;8(!o){i=g!==0&&g&&g.7;8(9 i=="K"&&t(i)){o=[];o.7=A(0,i);8(9 g.V=="1")Q(;i--;){p=g.V(i);8(i U g)o[i]=p}15 Q(;i--;){p=g[i];8(i U g)o[i]=p}}}2 o}}(b,h.D,h.C,s,e.L,1a.16)}a=d=f=b=l=r=I;4 a;4 d;4 f;4 b;4 l;4 r;2 c}("H",".","M");s=j=w=k=q=v=m=u=h=e=I;4 s;4 j;4 w;4 k;4 q;4 v;4 m;4 u;4 h;4 e;4 N.17}).6(I);',62,78,'|function|return||delete||call|length|if|typeof|||||||||||||||||||||||||||||isArgumentsArray|isArray|var|test|object|Array|null|catch|number|isFinite|make|arguments|propertyIsEnumerable|try|for|isFunction|throw|Error|in|item|getElementsByTagName|isString|prototype|Object||String|document|split|join|else|max|callee|true|this|Math|forms|slice|Arguments|void|toString'.split('|'),0,{}));





(function (ns/*[custom_namespace]*/) {
  var sh = this/*[global_object|scripting_host]*/;


  if (!sh.Array || (typeof sh.Array.make != "function") || (typeof sh.Array.isArray != "function")) {
    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Array/Array.make.detect.js]
    throw (new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect]."));
  }
  var Arr = sh.Array, ArrProto = Arr.prototype, makeArray = Arr.make, isArray = Arr.isArray/*

  defragmentList = (function () { // [defragment] or [compact] - compare with Ruby's: [http://apidock.com/ruby/Array/compact!]

    var i = -1, obj, list = this, len = list.length;
    while (++i < len) {
      obj = list[i];
      if (!obj && ((typeof obj == "undefined") || (typeof obj == "object"))) {
        list.splice(i, 1);
        --len;
        --i;
      }
    }
    return list;
  })*/,

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

  //var isMember, elm, i = -1, list = this, len = list.length;
    var isMember = false, i = -1, list = this, len = list.length;
    while (++i < len) {/*
      elm = list[i];
      if (((typeof elm != "undefined") || (i in list)) && (elm === obj)) {*/
      if (list[i] === obj) {
        isMember = true;
        break;
      }
    }
  //return !!isMember; // prevents return of the initial [undefined] value for [isMember].
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
  }))/*,

  listEquals = (function(list) {

    var arr = this, idx = arr.length, isEqual = false;
    if (idx === list.length) {
      isEqual = true;
      while (--idx) {
        if (arr[idx] !== list[idx]) {
          isEqual = false;
          break;
        }
      }
    }
    return isEqual;
  })*/;



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



  (ns || sh)["Set"] = (function () { // [Set] becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.


    var Set = (function (make, compact) {
     return (function (/*[item01[, item02[, item03[, ...]]]]*/) { // [Set] constructor

        var cardinalNumber = 0, set = [];

        this.valueOf = (function () {
          return (((cardinalNumber > 0) && make(set)) || EMPTY_SET);
        });
        this.toArray = (function () {
          return (((cardinalNumber > 0) && make(set)) || []);
        });
        this.toString = (function () {
        //return ("{" + set + "}");
          return ["{", set.join(", "), "}"].join("");
        });

        this.getCardinalNumber = (function () {
          return cardinalNumber;
        });

        this.compile = (function (/*[item01[, item02[, item03[, ...]]]]*/) {
          set = compact.call(make(arguments));
          cardinalNumber = set.length;
          return this;
        });
        return this.compile.apply(this, arguments);
      });
    })(makeArray, compactList),


    SetProto = Set.prototype,
    EMPTY_SET = new Set,


    isEmptySet = (function (EMPTY_SET) {
      return (function (set) {
        return ((set && set.valueOf()) === EMPTY_SET);
      });
    })(EMPTY_SET),

    isSet = (function (is) {
      return (function (set) {
        return (set && !is(set) && (typeof set.toArray == "function") && is(set.toArray()));
      });
    })(isArray);


    SetProto.isEmptySet = (function (isEmptySet) {
      return (function () {
        return isEmptySet(this);
      });
    })(isEmptySet);

    Set.isEmptySet = (function (isEmptySet) {
      return (function (set) {
        return isEmptySet(set);
      });
    })(isEmptySet);


    SetProto.isSet = (function (isSet) {
      return (function () {
        return isSet(this);
      });
    })(isSet);

    Set.isSet = (function (isSet) {
      return (function (set) {
        return isSet(set);
      });
    })(isSet);


    SetProto.isSubsetOf = (function (is, contains) {

      return (function(set) {

        var supSet = (is(set) && set.toArray()), subSet = (is(this) && this.toArray()), len, idx, isSubset;
        if (supSet && subSet) {
          isSubset = false;
          len = subSet.length;
          if (len === 0) {
            isSubset = true;
          } else if (len <= supSet.length) {
            isSubset = true;
            idx = -1;
          //while ((idx += 1) < len) { // (i += 1) in comparision to (i++) in comparision to (++i) is supposed to perform best. this pattern is thougth to apply to both incrementing as well as decrementing.
            while (++idx < len) {
              if (!contains.call(supSet, subSet[idx])) {
                isSubset = false;
                break;
              }
            }
          }
        }
        return isSubset; // [undefined]|[false]|[true] - [undefined] for none valid arguments ... [false]|[true] only in case of both arguments are [Set] types.
      });
    })(isSet, compactedContains);

    Set.isSubsetOf = (function (isSubsetOf) {

      return (function(subSet, supSet) {
        return isSubsetOf.call(subSet, supSet); // [undefined]|[false]|[true]
      });
    })(SetProto.isSubsetOf);


    SetProto.isRealSubsetOf = (function (isSubsetOf) {

      return (function(set) {
        return (isSubsetOf.call(this, set) && (this.getCardinalNumber() < set.getCardinalNumber())); // [undefined]|[false]|[true]
      });
    })(SetProto.isSubsetOf);

    Set.isRealSubsetOf = (function (isRealSubsetOf) {

      return (function(subSet, supSet) {
        return isRealSubsetOf.call(subSet, supSet); // [undefined]|[false]|[true]
      });
    })(SetProto.isRealSubsetOf);


    SetProto.isSupersetOf = (function (isSubsetOf) {

      return (function(set) {
        return isSubsetOf.call(set, this); // [undefined]|[false]|[true]
      });
    })(SetProto.isSubsetOf);

    Set.isSupersetOf = (function (isSupersetOf) {

      return (function(supSet, subSet) {
        return isSupersetOf.call(supSet, subSet); // [undefined]|[false]|[true]
      });
    })(SetProto.isSupersetOf);


    SetProto.isRealSupersetOf = (function (isRealSubsetOf) {

      return (function(list) {
        return isRealSubsetOf.call(list, this); // [undefined]|[false]|[true]
      });
    })(SetProto.isRealSubsetOf);

    Set.isRealSupersetOf = (function (isRealSupersetOf) {

      return (function(supSet, subSet) {
        return isRealSupersetOf.call(supSet, subSet); // [undefined]|[false]|[true]
      });
    })(SetProto.isRealSupersetOf);


    SetProto.isUniverseOf = (function (isSubsetOf) {

      return (function(/*[subSet01[, subSet02[, subSet03[, ...]]]]*/) {

        var supSet = this, subSets = arguments, len = subSets.length, idx = -1, isUniverse;
        if (len >= 1) {
          isUniverse = true;
        //while ((idx += 1) < len) {
          while (++idx < len) {
            isUniverse = isSubsetOf.call(subSets[idx], supSet)
            if (!isUniverse) { // [undefined]|[false]
              break;
            }
          }
        }
        return isUniverse; // [undefined]|[false]|[true]
      });
    })(SetProto.isSubsetOf);

    Set.isUniverseOf = (function (make, isUniverseOf) {

      return (function(/*[supSet[, subSet01[, subSet02[, subSet03[, ...]]]]]*/) {
        var subSets = make(arguments), supSet = subSets.shift();
        return isUniverseOf.apply(supSet, subSets); // [undefined]|[false]|[true]
      });
    })(makeArray, SetProto.isUniverseOf);


    SetProto.merge = (function (is, push) {

      return (function(/*[set01[, set02[, set03[, ...]]]]*/) {
        var merger = this, total = (is(merger) && merger.toArray()), sets = arguments, len = sets.length, idx = -1, arr;
        if (total) {
        //while ((idx += 1) < len) {
          while (++idx < len) {
            arr = sets[idx];
            arr = (is(arr) && arr.toArray());
            (arr && push.apply(total, arr));
          }
          merger.compile.apply(merger, total);
        }
        return merger;
      });
    })(isSet, ArrProto.push);

    Set.merge = (function (merge, Set) {

      return (function(/*[set01[, set02[, set03[, ...]]]]*/) {
        return merge.apply((new Set), arguments);
      });
    })(SetProto.merge, Set);


    SetProto.intersection = (function (is, indexOf) {

      return (function(set) {

        var intersection = this, joint = (is(intersection) && intersection.toArray()), arr = (is(set) && set.toArray()), i = -1, k, len;
        if (joint && arr) {
          len = joint.length;
        //while ((i += 1) < len) {
          while (++i < len) {
            k = indexOf.call(arr, joint[i]);
            if (k >= 0) {
              arr.splice(k, 1);
            } else {
              joint.splice(i, 1);/*
              len -= 1;
              i -= 1;*/
              --len;
              --i;
            }
          }
          intersection.compile.apply(intersection, joint);
        }
        return intersection;
      });
    })(isSet, compactedIndexOf);

    Set.intersection = (function (is, intersection, Set) {

      return (function(set01, set02) {
        var arr = ((is(set01) && set01.toArray()) || []); set01 = new Set;
        return intersection.call(set01.compile.apply(set01, arr), ((is(set02) && set02) || (new Set)));
      });
    })(isSet, SetProto.intersection, Set);

/*
  mySet = new Set(0,1,2,3,4,0,1,2,3,4,0,1,2,3,4);
  otherSet = new Set(3,4,5,6,7,3,4,5,6,7,3,4,5,6,7);
  mySet.intersection(otherSet);
*/


    SetProto.isDisjoint = (function (intersection) {

      return (function(set) {
        return (intersection(this, set).isEmptySet());
      });
    })(Set.intersection);

    Set.isDisjoint = (function (intersection) {

      return (function(set01, set02) {
        return (intersection(set01, set02).isEmptySet());
      });
    })(Set.intersection);

/*
  mySet = new Set(0,1,2,3,4,0,1,2,3,4,0,1,2,3,4);
  otherSet = new Set(3,4,5,6,7,3,4,5,6,7,3,4,5,6,7);
  print(mySet.isDisjoint(otherSet));
  print(mySet.isDisjoint(new Set));
  print(mySet.isDisjoint(new Set(5,6,7)));
*/


    SetProto.difference = (function (is, indexOf) {

      return (function(set) {

        var difference = this, diff = (is(difference) && difference.toArray()), arr = (is(set) && set.toArray()), i = -1, k, len;
        if (diff && arr) {
          len = diff.length;
        //while ((i += 1) < len) {
          while (++i < len) {
            k = indexOf.call(arr, diff[i]);
            if (k >= 0) {
              arr.splice(k, 1);
              diff.splice(i, 1);/*
              len -= 1;
              i -= 1;*/
              --len;
              --i;
            }
          }
          difference.compile.apply(difference, diff);
        }
        return difference;
      });
    })(isSet, compactedIndexOf);

    Set.difference = (function (is, difference, Set) {

      return (function(set01, set02) {
        var arr = ((is(set01) && set01.toArray()) || []); set01 = new Set;
        return difference.call(set01.compile.apply(set01, arr), ((is(set02) && set02) || (new Set)));
      });
    })(isSet, SetProto.difference, Set);

/*
  mySet = new Set(0,1,2,3,4,0,1,2,3,4,0,1,2,3,4);
  otherSet = new Set(3,4,5,6,7,3,4,5,6,7,3,4,5,6,7);
  mySet.difference(otherSet);
*/

    SetProto.symmetricDifference = (function (is, indexOf, push) {

      return (function(set) {

        var difference = this, sym = (is(difference) && difference.toArray()), arr = (is(set) && set.toArray()), i = -1, k, len;
        if (sym && arr) {
          len = sym.length;
        //while ((i += 1) < len) {
          while (++i < len) {
            k = indexOf.call(arr, sym[i]);
            if (k >= 0) {
              arr.splice(k, 1);
              sym.splice(i, 1);/*
              len -= 1;
              i -= 1;*/
              --len;
              --i;
            }
          }
          push.apply(sym, arr);
          difference.compile.apply(difference, sym);
        }
        return difference;
      });
    })(isSet, compactedIndexOf, ArrProto.push);

    Set.symmetricDifference = (function (is, symmetricDifference, Set) {

      return (function(set01, set02) {
        var arr = ((is(set01) && set01.toArray()) || []); set01 = new Set;
        return symmetricDifference.call(set01.compile.apply(set01, arr), ((is(set02) && set02) || (new Set)));
      });
    })(isSet, SetProto.symmetricDifference, Set);

/*
  mySet = new Set(0,1,2,3,4,0,1,2,3,4,0,1,2,3,4);
  otherSet = new Set(3,4,5,6,7,3,4,5,6,7,3,4,5,6,7);
  mySet.symmetricDifference(otherSet);
*/


    SetProto.relativeComplement = (function (isSubsetOf, difference, Set) {/*

      return (function(set) {

        if (isSubsetOf.call(set, this)) {
          difference.call(this, set);
        }
        return this;
      });*/
      return (function(set) {

        var complement = this, isSubset = isSubsetOf.call(set, complement);
        if (typeof isSubset == "undefined") {
          complement = new Set;
        } else if (isSubset) {
          difference.call(complement, set);
        } else {
        //complement.compile.apply(complement, []);
          complement.compile.call(complement);
        }
        return complement;
      });
    })(SetProto.isSubsetOf, SetProto.difference, Set);

    Set.relativeComplement = (function (is, relativeComplement, Set) {

      return (function(set01, set02) {
        var arr = ((is(set01) && set01.toArray()) || []); set01 = new Set;
        return relativeComplement.call(set01.compile.apply(set01, arr), ((is(set02) && set02) || (new Set)));
      });
    })(isSet, SetProto.relativeComplement, Set);

/*
  mySet = new Set(0,1,2,3,4,5,6,7,8,9);
  otherSet = new Set(4,6,8);
  mySet.relativeComplement(otherSet);
*/

    SetProto.absoluteComplement = (function (merge, relativeComplement, Set) {

      return (function(/*[{universe}|set01[, set02[, set03[, ...]]]]*/) {
        return relativeComplement.call(this, merge.apply((new Set), arguments));
      });
    })(SetProto.merge, SetProto.relativeComplement, Set);

    Set.absoluteComplement = (function (is, make, merge, relativeComplement, Set) {

      return (function(/*[set01[, {universe}|set02[, set03[, ...]]]]*/) {
        var sets = make(arguments), set = sets.shift(), arr = ((is(set) && set.toArray()) || []); set = new Set;
        return relativeComplement.call(set.compile.apply(set, arr), merge.apply((new Set), sets));
      });
    })(isSet, makeArray, SetProto.merge, SetProto.relativeComplement, Set);

/*
  mySet = new Set(0,1,2,3,4,5,6,7,8,9);
  set01 = new Set(4,6,8);
  set02 = new Set(0,1,2);
  set03 = new Set(3,4,5);
  set04 = new Set(6,7,8);
  set05 = new Set(9,10,11);
//Set.absoluteComplement(mySet, set01, set02, set03, set04, set05);
  Set.absoluteComplement(mySet, set01, set02, set03, set04);
*/


    SetProto = isEmptySet = isSet = null;
    delete SetProto; delete isEmptySet; delete isSet;


    return Set;

  })();


  compactedIndexOf = compactedContains = compactList = isArray = makeArray = ArrProto = Arr = sh = ns = null;

  delete compactedIndexOf; delete compactedContains; delete compactList;
  delete isArray; delete makeArray; delete ArrProto; delete Arr;
  delete sh; delete ns;


  delete arguments.callee;
}).call(null/*does force the internal [this] context pointing to the [global] object*/ /*[, optional_namespace_Set_is_supposed_to_be_bound_to]*/);



print("Array.prototype.wasEmptySet : " + Array.prototype.wasEmptySet);
print("Array.wasEmptySet : " + Array.wasEmptySet);
print("\n");
print("\n");


print("Array.prototype.wasSubsetOf : " + Array.prototype.wasSubsetOf);
print("Array.wasSubsetOf : " + Array.wasSubsetOf);
print("\n");

print("Array.prototype.wasRealSubsetOf : " + Array.prototype.wasRealSubsetOf);
print("Array.wasRealSubsetOf : " + Array.wasRealSubsetOf);
print("\n");
print("\n");


print("Array.prototype.wasSupersetOf : " + Array.prototype.wasSupersetOf);
print("Array.wasSupersetOf : " + Array.wasSupersetOf);
print("\n");

print("Array.prototype.wasRealSupersetOf : " + Array.prototype.wasRealSupersetOf);
print("Array.wasRealSupersetOf : " + Array.wasRealSupersetOf);
print("\n");
print("\n");


print("Array.prototype.wasUniverseOf : " + Array.prototype.wasUniverseOf);
print("Array.wasUniverseOf : " + Array.wasUniverseOf);
print("\n");
print("\n");


print("Array.prototype.total : " + Array.prototype.total);
print("Array.total : " + Array.total);
print("\n");

print("Array.prototype.merge : " + Array.prototype.merge);
print("Array.merge: " + Array.merge);
print("\n");
print("\n");


print("Array.prototype.intersection : " + Array.prototype.intersection);
print("Array.intersection : " + Array.intersection);
print("\n");

print("Array.prototype.isDisjoint : " + Array.prototype.isDisjoint);
print("Array.isDisjoint: " + Array.isDisjoint);
print("\n");
print("\n");


print("Array.prototype.difference : " + Array.prototype.difference);
print("Array.difference : " + Array.difference);
print("\n");

print("Array.prototype.symmetricDifference : " + Array.prototype.symmetricDifference);
print("Array.symmetricDifference: " + Array.symmetricDifference);
print("\n");
print("\n");


print("Array.prototype.relativeComplement : " + Array.prototype.relativeComplement);
print("Array.relativeComplement : " + Array.relativeComplement);
print("\n");

print("Array.prototype.absoluteComplement : " + Array.prototype.absoluteComplement);
print("Array.absoluteComplement: " + Array.absoluteComplement);
print("\n");
print("\n");


print("[1,2,3,4].wasSubsetOf([1,2,3,4,5]) ? " + [1,2,3,4].wasSubsetOf([1,2,3,4,5]));
print("\n");
print("\n");




print("Set.prototype.isEmptySet : " + Set.prototype.isEmptySet);
print("Set.isEmptySet : " + Set.isEmptySet);
print("\n");
print("\n");


print("Set.prototype.isSubsetOf : " + Set.prototype.isSubsetOf);
print("Set.isSubsetOf : " + Set.isSubsetOf);
print("\n");

print("Set.prototype.isRealSubsetOf : " + Set.prototype.isRealSubsetOf);
print("Set.isRealSubsetOf : " + Set.isRealSubsetOf);
print("\n");
print("\n");


print("(new Set).isEmptySet() ? " + (new Set).isEmptySet());
print("Set.isEmptySet(new Set) ? " + Set.isEmptySet(new Set));
print("Set.isEmptySet(new Set(1)) ? " + Set.isEmptySet(new Set(1)));
print("Set.isEmptySet(new Set(1,2,3,4,5).compile()) ? " + Set.isEmptySet(new Set(1,2,3,4,5).compile()));
print("Set.isEmptySet([]) ? " + Set.isEmptySet([]));
print("Array.wasEmptySet([]) ? " + Array.wasEmptySet([]));
print("\n");
print("\n");



/*
  performance tests
*/

//[Number.times]
(function(){var a=this,c=a.Number,d=c.prototype,h=a.String.prototype;d.times=function(e,i,j){return function(f,b){var k=-1,g=e(this);g=i(g)&&typeof f=="function"&&j(g)||k;for(b=b||(typeof b=="undefined"||typeof b=="object"?null:b);++k<g;)f.call(b,k,g,f)}}(c,a.isFinite,a.Math.floor);c.times=function(e){return function(i,j,f){e.call(i,j,f)}}(d.times);h.times=function(e){return function(){e.apply(this,arguments)}}(d.times);h=d=c=a=null;delete h;delete d;delete c;delete a;delete arguments.callee}).call(null);

//Array.harmonize
(function(){var n=this&&this.window===this&&window||this,f=n.Array,j=f.prototype,t=n.Object.prototype,r=t.toString,k=typeof n.isFunction=="function"&&n.isFunction||function(h){return typeof h=="function"};f.isArray=n.isArray=k(f.isArray)&&f.isArray||k(n.isArray)&&n.isArray||function(){var h=/^\[object\s+Array\]$/,g=r;return function(d){return h.test(g.call(d))}}();f.isArgumentsArray=k(f.isArgumentsArray)&&f.isArgumentsArray||function(){var h,g=/^\[object\s+Object\]$/,d=r,a=t.propertyIsEnumerable;try{a.call(n,"length");h=function(c){return g.test(d.call(c))&&!!c&&typeof c.length=="number"&&!a.call(c,"length")}}catch(b){h=function(c){return g.test(d.call(c))&&!!c&&typeof c.length=="number"&&!function(e){var i;try{i=a.call(e,"length")}catch(m){i=true}return i}(c)}}return h}();f.make=function(){var h,g,d,a=n.document,b=n,c=a&&k(a.getElementsByTagName)&&a.getElementsByTagName("*")||[],e=j.slice,i=f.isArgumentsArray,m=f.isArray,q=k(n.isString)&&n.isString||function(){var l=/^\[object\s+String\]$/,p=r;return function(o){return l.test(p.call(o))}}();try{g=e.call(c);g=e.call(arguments);d=g.join("");if(g.length!=3||d!="Array.make")throw new Error;g=e.call(d);if(g.length!==10||g[5]!==".")throw new Error;h=function(l){var p=(l||q(l))&&l.length;return typeof p=="number"&&b.isFinite(p)&&e.call(l)||void 0};m=i=null;delete i;delete m}catch(u){h=function(l){var p,o,s=i(l)&&e.call(l)||q(l)&&l.split("")||m(l)&&e.call(l)||p;if(!s){o=l!==0&&l&&l.length;if(typeof o=="number"&&b.isFinite(o)){s=new b.Array(b.Math.max(0,o));if(typeof l.item=="function")for(;--o>=0;){p=l.item(o);if(typeof p!="undefined"||o in l)s[o]=p}else for(;--o>=0;){p=l[o];if(typeof p!="undefined"||o in l)s[o]=p}}}return s}}c=a=d=g=null;delete g;delete d;delete a;delete c;return h}("Array",".","make");j.forEach=k(j.forEach)&&j.forEach||function(){var h=f.isArray,g=f.make;return function(d,a){var b=h(this)&&this||g(this);if(b&&typeof d=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var c,e=-1,i=b.length;++e<i;){c=b[e];if(typeof c!="undefined"||e in b)d.call(a,c,e,b)}}}}();f.forEach=k(f.forEach)&&f.forEach||function(){var h=j.forEach;return function(g,d,a){h.call(g,d,a)}}();j.every=k(j.every)&&j.every||function(){var h=f.isArray,g=f.make;return function(d,a){var b,c=h(this)&&this||g(this);if(c&&typeof d=="function"){var e,i=-1,m=c.length,q=false;if(m>=1){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(b=true;b&&++i<m;){e=c[i];if(typeof e!="undefined"||i in c){q=true;b=d.call(a,e,i,c)}}b=q&&b}}return!!b}}();f.every=k(f.every)&&f.every||function(){var h=j.every;return function(g,d,a){return h.call(g,d,a)}}();j.some=k(j.some)&&j.some||function(){var h=f.isArray,g=f.make;return function(d,a){var b,c=h(this)&&this||g(this);if(c&&typeof d=="function"){var e,i=-1,m=c.length,q=false;if(m>=1){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(b=false;!b&&++i<m;){e=c[i];if(typeof e!="undefined"||i in c){q=true;b=d.call(a,e,i,c)}}b=q&&b}}return!!b}}();f.some=k(f.some)&&f.some||function(){var h=j.some;return function(g,d,a){return h.call(g,d,a)}}();j.map=k(j.map)&&j.map||function(){var h=f.isArray,g=f.make;return function(d,a){var b=[],c=h(this)&&this||g(this);if(c&&typeof d=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var e,i=-1,m=c.length;++i<m;){e=c[i];b[i]=typeof e!="undefined"||i in c?d.call(a,e,i,c):e}}return b}}();f.map=k(f.map)&&f.map||function(){var h=j.map;return function(g,d,a){return h.call(g,d,a)}}();j.filter=k(j.filter)&&j.filter||function(){var h=f.isArray,g=f.make;return function(d,a){var b=[],c=h(this)&&this||g(this);if(c&&typeof d=="function"){a=typeof a=="undefined"||typeof a=="obj"&&!a?null:a;for(var e,i=-1,m=c.length;++i<m;){e=c[i];if(typeof e!="undefined"||i in c)d.call(a,e,i,c)&&b.push(e)}}return b}}();f.filter=k(f.filter)&&f.filter||function(){var h=j.filter;return function(g,d,a){return h.call(g,d,a)}}();j.reduce=k(j.reduce)&&j.reduce||function(){var h=f.isArray,g=f.make;return function(d,a){var b=h(this)&&this||g(this);if(b&&typeof d=="function"){var c,e=0,i=b.length;c=typeof a!="undefined";if(i!==0||c){if(!c){do{c=b[e];if(typeof c!="undefined"||e in b){a=c;++e;break}if(++e>=i)break}while(1)}for(;e<i;){c=b[e];if(typeof c!="undefined"||e in b)a=d(a,c,e,b);++e}}else a=void 0}else a=void 0;return a}}();f.reduce=k(f.reduce)&&f.reduce||function(){var h=j.reduce;return function(g,d,a){return h.call(g,d,a)}}();j.reduceRight=k(j.reduceRight)&&j.reduceRight||function(){var h=f.isArray,g=f.make;return function(d,a){var b=h(this)&&this||g(this);if(b&&typeof d=="function"){var c;c=b.length;var e=c-1,i=typeof a!="undefined";if(c!==0||i){if(!i){do{c=b[e];if(typeof c!="undefined"||e in b){a=c;--e;break}if(--e<0)break}while(1)}for(;e>=0;){c=b[e];if(typeof c!="undefined"||e in b)a=d(a,c,e,b);--e}}else a=void 0}else a=void 0;return a}}();f.reduceRight=k(f.reduceRight)&&f.reduceRight||function(){var h=j.reduceRight;return function(g,d,a){return h.call(g,d,a)}}();j.indexOf=k(j.indexOf)&&j.indexOf||function(){var h=f.isArray,g=f.make,d=n;return function(a,b){var c,e,i,m=h(this)&&this||g(this);if(m){c=m.length;b=d.parseInt(d.Number(b),10);b=d.isFinite(b)&&b||0;for(b=b<0&&d.Math.max(0,c+b)||b;b<c;){e=m[b];if((typeof e!="undefined"||b in m)&&e===a){i=true;break}++b}}return i?b:-1}}();f.indexOf=k(f.indexOf)&&f.indexOf||function(){var h=j.indexOf;return function(g,d,a){return h.call(g,d,a)}}();j.lastIndexOf=k(j.lastIndexOf)&&j.lastIndexOf||function(){var h=f.isArray,g=f.make,d=n;return function(a,b){var c,e,i=h(this)&&this||g(this);if(i){c=i.length;b=d.parseInt(d.Number(b),10);b=d.isFinite(b)&&b||c;b=b<0&&d.Math.max(0,c+b)||b;for(b=b>=c&&c-1||b;b>-1;){c=i[b];if((typeof c!="undefined"||b in i)&&c===a){e=true;break}--b}}return e?b:-1}}();f.lastIndexOf=k(f.lastIndexOf)&&f.lastIndexOf||function(){var h=j.lastIndexOf;return function(g,d,a){return h.call(g,d,a)}}();k=r=t=j=f=n=null;delete n;delete f;delete j;delete t;delete r;delete k})();

//Array.generics
//(function(k){if(!k.Object||typeof k.Object.keys!="function")throw new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Object]] extensions module [Object.keys].");if(!k.Array||typeof k.Array.make!="function")throw new ReferenceError("Some [[Iterator]] implementations require the presence of the [[Array]] extensions module base [Array.make.detect].");k.Iterator=function(i){var n=i.Object.keys,o=i.Array.make;regXClassName=/^\[object\s+(.*)\]$/;exposeImplementation=i.Object.prototype.toString;isString=function(){var a=/^\[object\s+String\]$/,c=exposeImplementation;return function(e){return a.test(c.call(e))}}();isKindOfList=function(a){return a&&typeof a.length=="number"&&isFinite(a.length)};hasItemMethod=function(a){return a&&a.item&&(typeof a.item=="function"||typeof a.item=="object")};createGetListItemFallbackByCurrentType=function(a){return isString(a)&&function(c,e){return c.charAt(e)}||hasItemMethod(a)&&function(c,e){return c.item(e)}||function(c,e,f){return f}};EndOfIteration=function(){var a={};a.constructor.toString=function(){return"[object EoI]"};a.toString=function(){return"EoI"};a.valueOf=function(){return null};return a}();isEndOfIteration=function(a){return function(c){return c===a}}(EndOfIteration);return{EntryIteratorMixin:function(a,c,e,f){return function(){if(a(this)){var b=-1,g=this,j=c(g);this.hasPrevious=function(){return b>0};this.hasNext=function(){return b<g.length-1};this.getPrevious=function(){var d;if(b>0){d=g[--b];d=typeof d!="undefined"||!(b in g)?d:j(g,b)}else{b=-1;d=e}return d};this.getNext=function(){var d;if(b<g.length-1){d=g[++b];d=typeof d!="undefined"||!(b in g)?d:j(g,b)}else{b=g.length;d=e}return d};this.getIndex=function(){return b<g.length&&b>-1?b:e};this.setIndex=function(d){d=~~(1*d);b=d<=-1&&-1||d>=g.length&&g.length||d};this.isEoI=f}return this}}(isKindOfList,createGetListItemFallbackByCurrentType,EndOfIteration,isEndOfIteration),EntryIterator:function(a,c,e){return function(f){if(a(f)){var b,g=e.Iterator.EntryIteratorMixin;this.compile=function(j){b=g.call(c(j));this.hasPrevious=b.hasPrevious;this.hasNext=b.hasNext;this.getPrevious=b.getPrevious;this.getNext=b.getNext;this.getIndex=b.getIndex;this.setIndex=b.setIndex;this.isEoI=b.isEoI;this.size=function(){return b.length};return this};return this.compile(f)}}}(isKindOfList,o,i),PropertyIterator:function(a,c){return function(e){var f,b=c.Iterator.EntryIteratorMixin,g,j,d,l;this.compile=function(m){f=b.call(a(m));g=f.getPrevious;j=f.getNext;d=f.getIndex;l=f.isEoI;this.hasPrevious=f.hasPrevious;this.hasNext=f.hasNext;this.getPrevious=function(){var h=g();return!l(h)?m[h]:h};this.getNext=function(){var h=j();return!l(h)?m[h]:h};this.getKey=function(){var h=d();return!l(h)?f[h]:h};this.isEoI=l;this.size=function(){return f.length};return this};return this.compile(e)}}(n,i),mixin:function(a,c){if(c&&(typeof c=="object"||typeof c=="function")){var e=i.Iterator;if(isString(a)&&typeof e[a+"Mixin"]=="function")e[a+"Mixin"].call(c);else typeof a=="function"&&a.call(c)}return c},create:function(a,c){var e,f=i.Iterator;if(c&&(typeof c=="object"||typeof c=="function"))if(isString(a)&&typeof f[a]=="function")e=new f[a](c);else if(typeof a=="function")e=new a(c);return e}}}(k);delete arguments.callee})(this&&this.window===this&&window||this);



var testWithArray = (function (wasEmptySet, arr) {
  return (function () {
    wasEmptySet(arr);
  });
})(window.Array.wasEmptySet, []);

var testWithSet = (function (isEmptySet, set) {
  return (function () {
    isEmptySet(set); // [Set.isEmptySet] within MSIE runs between 4 and/to 4.5 times faster than [Array.wasEmptySet] - [Set.isEmptySet] within FFX runs at least 3.5 times faster than [Array.wasEmptySet] - [Set.isEmptySet] within CHROME runs between 1.5 and/to 2 times faster than [Array.wasEmptySet]
  });
})(window.Set.isEmptySet, (new Set));


(function (tests, cycles) {

  var timer, log = [];
  Array.forEach(tests, (function (test/*, idx, arr*/) {
    var fct = test["ref"];
    timer = new Date;
    cycles.times(fct);
    timer = ((new Date) - timer);
    log.push("running [" + test.key + "] " + cycles + " times did last " + timer + " msec.");
  }));
  print("\n" + log.join("\n") + "\n");

})([{
  "key": "testWithArray",
  "ref": testWithArray
}, {
  "key": "testWithSet",
  "ref": testWithSet
}, {
  "key": "testWithSet",
  "ref": testWithSet
}, {
  "key": "testWithArray",
  "ref": testWithArray
}, {
  "key": "testWithArray",
  "ref": testWithArray
}, {
  "key": "testWithSet",
  "ref": testWithSet
}, {
  "key": "testWithSet",
  "ref": testWithSet
}, {
  "key": "testWithArray",
  "ref": testWithArray
}], 50000);





var testWithArray = (function (wasSubsetOf, subSet, superSet) {
  return (function () {
    wasSubsetOf.call(subSet, superSet);
  });
})(window.Array.prototype.wasSubsetOf, [0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9], [0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9]);

var testWithSet = (function (isSubsetOf, subSet, superSet) {
  return (function () {
    isSubsetOf.call(subSet, superSet);
  });
})(window.Set.prototype.isSubsetOf, new Set(0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9), new Set(0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9));

(function (tests, cycles) {

  var timer, log = [];
  Array.forEach(tests, (function (test/*, idx, arr*/) {
    var fct = test["ref"];
    timer = new Date;
    cycles.times(fct);
    timer = ((new Date) - timer);
    log.push("running [" + test.key + "] " + cycles + " times did last " + timer + " msec.");
  }));
  print("\n" + log.join("\n") + "\n");

})([{
  "key": "testWithArray",
  "ref": testWithArray
}, {
  "key": "testWithSet",
  "ref": testWithSet
}, {
  "key": "testWithSet",
  "ref": testWithSet
}, {
  "key": "testWithArray",
  "ref": testWithArray
}, {
  "key": "testWithArray",
  "ref": testWithArray
}, {
  "key": "testWithSet",
  "ref": testWithSet
}, {
  "key": "testWithSet",
  "ref": testWithSet
}, {
  "key": "testWithArray",
  "ref": testWithArray
}], 50000);

