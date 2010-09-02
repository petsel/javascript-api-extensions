/*


  [Set] extracted and boiled down from [Set.Array.Simple-Theory-Of-Sets]


*/ /*


  [http://closure-compiler.appspot.com/home]


- Whitespace only - 8.053 byte
(function(ns){var sh=this;if(!sh.Array||typeof sh.Array.make!="function"||typeof sh.Array.isArray!="function")throw new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect].");var Arr=sh.Array,ArrProto=Arr.prototype,makeArray=Arr.make,isArray=Arr.isArray,compactList=function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len)if(list[k]===obj){list.splice(k,1);--len;--k}if(!obj&&(typeof obj=="undefined"||typeof obj=="object")){list.splice(i,1);--len;--i}}return list},compactedContains=function(obj){var isMember=false,i=-1,list=this,len=list.length;while(++i<len)if(list[i]===obj){isMember=true;break}return isMember},compactedIndexOf=typeof ArrProto.indexOf=="function"&&ArrProto.indexOf||function(obj){var i=idx=-1,list=this,len=list.length;while(++i<len)if(list[i]===obj){idx=i;break}return idx};(ns||sh)["Set"]=function(){var Set=function(make,compact){return function(){var cardinalNumber=0,set=[];this.valueOf=function(){return cardinalNumber>0&&make(set)||EMPTY_SET};this.toArray=function(){return cardinalNumber>0&&make(set)||[]};this.toString=function(){return["{",set.join(", "),"}"].join("")};this.getCardinalNumber=function(){return cardinalNumber};this.compile=function(){set=compact.call(make(arguments));cardinalNumber=set.length;return this};return this.compile.apply(this,arguments)}}(makeArray,compactList),SetProto=Set.prototype,EMPTY_SET=new Set,isEmptySet=function(EMPTY_SET){return function(set){return(set&&set.valueOf())===EMPTY_SET}}(EMPTY_SET),isSet=function(is){return function(set){return set&&!is(set)&&typeof set.toArray=="function"&&is(set.toArray())}}(isArray);SetProto.isEmptySet=function(isEmptySet){return function(){return isEmptySet(this)}}(isEmptySet);Set.isEmptySet=function(isEmptySet){return function(set){return isEmptySet(set)}}(isEmptySet);SetProto.isSet=function(isSet){return function(){return isSet(this)}}(isSet);Set.isSet=function(isSet){return function(set){return isSet(set)}}(isSet);SetProto.isSubsetOf=function(is,contains){return function(set){var supSet=is(set)&&set.toArray(),subSet=is(this)&&this.toArray(),len,idx,isSubset;if(supSet&&subSet){isSubset=false;len=subSet.length;if(len===0)isSubset=true;else if(len<=supSet.length){isSubset=true;idx=-1;while(++idx<len)if(!contains.call(supSet,subSet[idx])){isSubset=false;break}}}return isSubset}}(isSet,compactedContains);Set.isSubsetOf=function(isSubsetOf){return function(subSet,supSet){return isSubsetOf.call(subSet,supSet)}}(SetProto.isSubsetOf);SetProto.isRealSubsetOf=function(isSubsetOf){return function(set){return isSubsetOf.call(this,set)&&this.getCardinalNumber()<set.getCardinalNumber()}}(SetProto.isSubsetOf);Set.isRealSubsetOf=function(isRealSubsetOf){return function(subSet,supSet){return isRealSubsetOf.call(subSet,supSet)}}(SetProto.isRealSubsetOf);SetProto.isSupersetOf=function(isSubsetOf){return function(set){return isSubsetOf.call(set,this)}}(SetProto.isSubsetOf);Set.isSupersetOf=function(isSupersetOf){return function(supSet,subSet){return isSupersetOf.call(supSet,subSet)}}(SetProto.isSupersetOf);SetProto.isRealSupersetOf=function(isRealSubsetOf){return function(list){return isRealSubsetOf.call(list,this)}}(SetProto.isRealSubsetOf);Set.isRealSupersetOf=function(isRealSupersetOf){return function(supSet,subSet){return isRealSupersetOf.call(supSet,subSet)}}(SetProto.isRealSupersetOf);SetProto.isUniverseOf=function(isSubsetOf){return function(){var supSet=this,subSets=arguments,len=subSets.length,idx=-1,isUniverse;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=isSubsetOf.call(subSets[idx],supSet);if(!isUniverse)break}}return isUniverse}}(SetProto.isSubsetOf);Set.isUniverseOf=function(make,isUniverseOf){return function(){var subSets=make(arguments),supSet=subSets.shift();return isUniverseOf.apply(supSet,subSets)}}(makeArray,SetProto.isUniverseOf);SetProto.merge=function(is,push){return function(){var merger=this,total=is(merger)&&merger.toArray(),sets=arguments,len=sets.length,idx=-1,arr;if(total){while(++idx<len){arr=sets[idx];arr=is(arr)&&arr.toArray();arr&&push.apply(total,arr)}merger.compile.apply(merger,total)}return merger}}(isSet,ArrProto.push);Set.merge=function(merge,Set){return function(){return merge.apply(new Set,arguments)}}(SetProto.merge,Set);SetProto.intersection=function(is,indexOf){return function(set){var intersection=this,joint=is(intersection)&&intersection.toArray(),arr=is(set)&&set.toArray(),i=-1,k,len;if(joint&&arr){len=joint.length;while(++i<len){k=indexOf.call(arr,joint[i]);if(k>=0)arr.splice(k,1);else{joint.splice(i,1);--len;--i}}intersection.compile.apply(intersection,joint)}return intersection}}(isSet,compactedIndexOf);Set.intersection=function(is,intersection,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return intersection.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.intersection,Set);SetProto.isDisjoint=function(intersection){return function(set){return intersection(this,set).isEmptySet()}}(Set.intersection);Set.isDisjoint=function(intersection){return function(set01,set02){return intersection(set01,set02).isEmptySet()}}(Set.intersection);SetProto.difference=function(is,indexOf){return function(set){var difference=this,diff=is(difference)&&difference.toArray(),arr=is(set)&&set.toArray(),i=-1,k,len;if(diff&&arr){len=diff.length;while(++i<len){k=indexOf.call(arr,diff[i]);if(k>=0){arr.splice(k,1);diff.splice(i,1);--len;--i}}difference.compile.apply(difference,diff)}return difference}}(isSet,compactedIndexOf);Set.difference=function(is,difference,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return difference.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.difference,Set);SetProto.symmetricDifference=function(is,indexOf,push){return function(set){var difference=this,sym=is(difference)&&difference.toArray(),arr=is(set)&&set.toArray(),i=-1,k,len;if(sym&&arr){len=sym.length;while(++i<len){k=indexOf.call(arr,sym[i]);if(k>=0){arr.splice(k,1);sym.splice(i,1);--len;--i}}push.apply(sym,arr);difference.compile.apply(difference,sym)}return difference}}(isSet,compactedIndexOf,ArrProto.push);Set.symmetricDifference=function(is,symmetricDifference,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return symmetricDifference.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.symmetricDifference,Set);SetProto.relativeComplement=function(isSubsetOf,difference,Set){return function(set){var complement=this,isSubset=isSubsetOf.call(set,complement);if(typeof isSubset=="undefined")complement=new Set;else if(isSubset)difference.call(complement,set);else complement.compile.call(complement);return complement}}(SetProto.isSubsetOf,SetProto.difference,Set);Set.relativeComplement=function(is,relativeComplement,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return relativeComplement.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.relativeComplement,Set);SetProto.absoluteComplement=function(merge,relativeComplement,Set){return function(){return relativeComplement.call(this,merge.apply(new Set,arguments))}}(SetProto.merge,SetProto.relativeComplement,Set);Set.absoluteComplement=function(is,make,merge,relativeComplement,Set){return function(){var sets=make(arguments),set=sets.shift(),arr=is(set)&&set.toArray()||[];set=new Set;return relativeComplement.call(set.compile.apply(set,arr),merge.apply(new Set,sets))}}(isSet,makeArray,SetProto.merge,SetProto.relativeComplement,Set);SetProto=isEmptySet=isSet=null;delete SetProto;delete isEmptySet;delete isSet;return Set}();compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=Arr=sh=ns=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete Arr;delete sh;delete ns;delete arguments.callee}).call(null);

- Simple          - 5.391 byte
(function(s){var m=this;if(!m.Array||typeof m.Array.make!="function"||typeof m.Array.isArray!="function")throw new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect].");var o=m.Array,n=o.prototype,p=o.make,t=o.isArray,u=function(){for(var g=-1,f,k,l=this.length;++g<l;){k=this[g];for(f=g;++f<l;)if(this[f]===k){this.splice(f,1);--l;--f}if(!k&&(typeof k=="undefined"||typeof k=="object")){this.splice(g,1);--l;--g}}return this},v=function(g){for(var f=false,k=-1,l=this.length;++k<l;)if(this[k]===g){f=true;break}return f},q=typeof n.indexOf=="function"&&n.indexOf||function(g){for(var f=idx=-1,k=this.length;++f<k;)if(this[f]===g){idx=f;break}return idx};(s||m).Set=function(){var g=function(a,d){return function(){var c=0,b=[];this.valueOf=function(){return c>0&&a(b)||k};this.toArray=function(){return c>0&&a(b)||[]};this.toString=function(){return["{",b.join(", "),"}"].join("")};this.getCardinalNumber=function(){return c};this.compile=function(){b=d.call(a(arguments));c=b.length;return this};return this.compile.apply(this,arguments)}}(p,u),f=g.prototype,k=new g,l=function(a){return function(d){return(d&&d.valueOf())===a}}(k),j=function(a){return function(d){return d&&!a(d)&&typeof d.toArray=="function"&&a(d.toArray())}}(t);f.isEmptySet=function(a){return function(){return a(this)}}(l);g.isEmptySet=function(a){return function(d){return a(d)}}(l);f.isSet=function(a){return function(){return a(this)}}(j);g.isSet=function(a){return function(d){return a(d)}}(j);f.isSubsetOf=function(a,d){return function(c){c=a(c)&&c.toArray();var b=a(this)&&this.toArray(),e,h,i;if(c&&b){i=false;e=b.length;if(e===0)i=true;else if(e<=c.length){i=true;for(h=-1;++h<e;)if(!d.call(c,b[h])){i=false;break}}}return i}}(j,v);g.isSubsetOf=function(a){return function(d,c){return a.call(d,c)}}(f.isSubsetOf);f.isRealSubsetOf=function(a){return function(d){return a.call(this,d)&&this.getCardinalNumber()<d.getCardinalNumber()}}(f.isSubsetOf);g.isRealSubsetOf=function(a){return function(d,c){return a.call(d,c)}}(f.isRealSubsetOf);f.isSupersetOf=function(a){return function(d){return a.call(d,this)}}(f.isSubsetOf);g.isSupersetOf=function(a){return function(d,c){return a.call(d,c)}}(f.isSupersetOf);f.isRealSupersetOf=function(a){return function(d){return a.call(d,this)}}(f.isRealSubsetOf);g.isRealSupersetOf=function(a){return function(d,c){return a.call(d,c)}}(f.isRealSupersetOf);f.isUniverseOf=function(a){return function(){var d=arguments,c=d.length,b=-1,e;if(c>=1)for(e=true;++b<c;){e=a.call(d[b],this);if(!e)break}return e}}(f.isSubsetOf);g.isUniverseOf=function(a,d){return function(){var c=a(arguments),b=c.shift();return d.apply(b,c)}}(p,f.isUniverseOf);f.merge=function(a,d){return function(){var c=a(this)&&this.toArray(),b=arguments,e=b.length,h=-1,i;if(c){for(;++h<e;){i=b[h];(i=a(i)&&i.toArray())&&d.apply(c,i)}this.compile.apply(this,c)}return this}}(j,n.push);g.merge=function(a,d){return function(){return a.apply(new d,arguments)}}(f.merge,g);f.intersection=function(a,d){return function(c){var b=a(this)&&this.toArray();c=a(c)&&c.toArray();var e=-1,h,i;if(b&&c){for(i=b.length;++e<i;){h=d.call(c,b[e]);if(h>=0)c.splice(h,1);else{b.splice(e,1);--i;--e}}this.compile.apply(this,b)}return this}}(j,q);g.intersection=function(a,d,c){return function(b,e){var h=a(b)&&b.toArray()||[];b=new c;return d.call(b.compile.apply(b,h),a(e)&&e||new c)}}(j,f.intersection,g);f.isDisjoint=function(a){return function(d){return a(this,d).isEmptySet()}}(g.intersection);g.isDisjoint=function(a){return function(d,c){return a(d,c).isEmptySet()}}(g.intersection);f.difference=function(a,d){return function(c){var b=a(this)&&this.toArray();c=a(c)&&c.toArray();var e=-1,h,i;if(b&&c){for(i=b.length;++e<i;){h=d.call(c,b[e]);if(h>=0){c.splice(h,1);b.splice(e,1);--i;--e}}this.compile.apply(this,b)}return this}}(j,q);g.difference=function(a,d,c){return function(b,e){var h=a(b)&&b.toArray()||[];b=new c;return d.call(b.compile.apply(b,h),a(e)&&e||new c)}}(j,f.difference,g);f.symmetricDifference=function(a,d,c){return function(b){var e=a(this)&&this.toArray();b=a(b)&&b.toArray();var h=-1,i,r;if(e&&b){for(r=e.length;++h<r;){i=d.call(b,e[h]);if(i>=0){b.splice(i,1);e.splice(h,1);--r;--h}}c.apply(e,b);this.compile.apply(this,e)}return this}}(j,q,n.push);g.symmetricDifference=function(a,d,c){return function(b,e){var h=a(b)&&b.toArray()||[];b=new c;return d.call(b.compile.apply(b,h),a(e)&&e||new c)}}(j,f.symmetricDifference,g);f.relativeComplement=function(a,d,c){return function(b){var e=this,h=a.call(b,e);if(typeof h=="undefined")e=new c;else h?d.call(e,b):e.compile.call(e);return e}}(f.isSubsetOf,f.difference,g);g.relativeComplement=function(a,d,c){return function(b,e){var h=a(b)&&b.toArray()||[];b=new c;return d.call(b.compile.apply(b,h),a(e)&&e||new c)}}(j,f.relativeComplement,g);f.absoluteComplement=function(a,d,c){return function(){return d.call(this,a.apply(new c,arguments))}}(f.merge,f.relativeComplement,g);g.absoluteComplement=function(a,d,c,b,e){return function(){var h=d(arguments),i=h.shift(),r=a(i)&&i.toArray()||[];i=new e;return b.call(i.compile.apply(i,r),c.apply(new e,h))}}(j,p,f.merge,f.relativeComplement,g);f=l=j=null;delete f;delete l;delete j;return g}();q=v=u=t=p=n=o=m=s=null;delete q;delete v;delete u;delete t;delete p;delete n;delete o;delete m;delete s;delete arguments.callee}).call(null);


*/ /*


  [http://dean.edwards.name/packer/]


- packed                      - 8.286 byte
(function(ns){var sh=this;if(!sh.Array||(typeof sh.Array.make!="function")||(typeof sh.Array.isArray!="function")){throw(new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect]."));}var Arr=sh.Array,ArrProto=Arr.prototype,makeArray=Arr.make,isArray=Arr.isArray,compactList=(function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len){if(list[k]===obj){list.splice(k,1);--len;--k}}if(!obj&&((typeof obj=="undefined")||(typeof obj=="object"))){list.splice(i,1);--len;--i}}return list}),compactedContains=(function(obj){var isMember=false,i=-1,list=this,len=list.length;while(++i<len){if(list[i]===obj){isMember=true;break}}return isMember}),compactedIndexOf=(((typeof ArrProto.indexOf=="function")&&ArrProto.indexOf)||(function(obj){var i=idx=-1,list=this,len=list.length;while(++i<len){if(list[i]===obj){idx=i;break}}return idx}));(ns||sh)["Set"]=(function(){var Set=(function(make,compact){return(function(){var cardinalNumber=0,set=[];this.valueOf=(function(){return(((cardinalNumber>0)&&make(set))||EMPTY_SET)});this.toArray=(function(){return(((cardinalNumber>0)&&make(set))||[])});this.toString=(function(){return["{",set.join(", "),"}"].join("")});this.getCardinalNumber=(function(){return cardinalNumber});this.compile=(function(){set=compact.call(make(arguments));cardinalNumber=set.length;return this});return this.compile.apply(this,arguments)})})(makeArray,compactList),SetProto=Set.prototype,EMPTY_SET=new Set,isEmptySet=(function(EMPTY_SET){return(function(set){return((set&&set.valueOf())===EMPTY_SET)})})(EMPTY_SET),isSet=(function(is){return(function(set){return(set&&!is(set)&&(typeof set.toArray=="function")&&is(set.toArray()))})})(isArray);SetProto.isEmptySet=(function(isEmptySet){return(function(){return isEmptySet(this)})})(isEmptySet);Set.isEmptySet=(function(isEmptySet){return(function(set){return isEmptySet(set)})})(isEmptySet);SetProto.isSet=(function(isSet){return(function(){return isSet(this)})})(isSet);Set.isSet=(function(isSet){return(function(set){return isSet(set)})})(isSet);SetProto.isSubsetOf=(function(is,contains){return(function(set){var supSet=(is(set)&&set.toArray()),subSet=(is(this)&&this.toArray()),len,idx,isSubset;if(supSet&&subSet){isSubset=false;len=subSet.length;if(len===0){isSubset=true}else if(len<=supSet.length){isSubset=true;idx=-1;while(++idx<len){if(!contains.call(supSet,subSet[idx])){isSubset=false;break}}}}return isSubset})})(isSet,compactedContains);Set.isSubsetOf=(function(isSubsetOf){return(function(subSet,supSet){return isSubsetOf.call(subSet,supSet)})})(SetProto.isSubsetOf);SetProto.isRealSubsetOf=(function(isSubsetOf){return(function(set){return(isSubsetOf.call(this,set)&&(this.getCardinalNumber()<set.getCardinalNumber()))})})(SetProto.isSubsetOf);Set.isRealSubsetOf=(function(isRealSubsetOf){return(function(subSet,supSet){return isRealSubsetOf.call(subSet,supSet)})})(SetProto.isRealSubsetOf);SetProto.isSupersetOf=(function(isSubsetOf){return(function(set){return isSubsetOf.call(set,this)})})(SetProto.isSubsetOf);Set.isSupersetOf=(function(isSupersetOf){return(function(supSet,subSet){return isSupersetOf.call(supSet,subSet)})})(SetProto.isSupersetOf);SetProto.isRealSupersetOf=(function(isRealSubsetOf){return(function(list){return isRealSubsetOf.call(list,this)})})(SetProto.isRealSubsetOf);Set.isRealSupersetOf=(function(isRealSupersetOf){return(function(supSet,subSet){return isRealSupersetOf.call(supSet,subSet)})})(SetProto.isRealSupersetOf);SetProto.isUniverseOf=(function(isSubsetOf){return(function(){var supSet=this,subSets=arguments,len=subSets.length,idx=-1,isUniverse;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=isSubsetOf.call(subSets[idx],supSet)if(!isUniverse){break}}}return isUniverse})})(SetProto.isSubsetOf);Set.isUniverseOf=(function(make,isUniverseOf){return(function(){var subSets=make(arguments),supSet=subSets.shift();return isUniverseOf.apply(supSet,subSets)})})(makeArray,SetProto.isUniverseOf);SetProto.merge=(function(is,push){return(function(){var merger=this,total=(is(merger)&&merger.toArray()),sets=arguments,len=sets.length,idx=-1,arr;if(total){while(++idx<len){arr=sets[idx];arr=(is(arr)&&arr.toArray());(arr&&push.apply(total,arr))}merger.compile.apply(merger,total)}return merger})})(isSet,ArrProto.push);Set.merge=(function(merge,Set){return(function(){return merge.apply((new Set),arguments)})})(SetProto.merge,Set);SetProto.intersection=(function(is,indexOf){return(function(set){var intersection=this,joint=(is(intersection)&&intersection.toArray()),arr=(is(set)&&set.toArray()),i=-1,k,len;if(joint&&arr){len=joint.length;while(++i<len){k=indexOf.call(arr,joint[i]);if(k>=0){arr.splice(k,1)}else{joint.splice(i,1);--len;--i}}intersection.compile.apply(intersection,joint)}return intersection})})(isSet,compactedIndexOf);Set.intersection=(function(is,intersection,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return intersection.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.intersection,Set);SetProto.isDisjoint=(function(intersection){return(function(set){return(intersection(this,set).isEmptySet())})})(Set.intersection);Set.isDisjoint=(function(intersection){return(function(set01,set02){return(intersection(set01,set02).isEmptySet())})})(Set.intersection);SetProto.difference=(function(is,indexOf){return(function(set){var difference=this,diff=(is(difference)&&difference.toArray()),arr=(is(set)&&set.toArray()),i=-1,k,len;if(diff&&arr){len=diff.length;while(++i<len){k=indexOf.call(arr,diff[i]);if(k>=0){arr.splice(k,1);diff.splice(i,1);--len;--i}}difference.compile.apply(difference,diff)}return difference})})(isSet,compactedIndexOf);Set.difference=(function(is,difference,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return difference.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.difference,Set);SetProto.symmetricDifference=(function(is,indexOf,push){return(function(set){var difference=this,sym=(is(difference)&&difference.toArray()),arr=(is(set)&&set.toArray()),i=-1,k,len;if(sym&&arr){len=sym.length;while(++i<len){k=indexOf.call(arr,sym[i]);if(k>=0){arr.splice(k,1);sym.splice(i,1);--len;--i}}push.apply(sym,arr);difference.compile.apply(difference,sym)}return difference})})(isSet,compactedIndexOf,ArrProto.push);Set.symmetricDifference=(function(is,symmetricDifference,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return symmetricDifference.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.symmetricDifference,Set);SetProto.relativeComplement=(function(isSubsetOf,difference,Set){return(function(set){var complement=this,isSubset=isSubsetOf.call(set,complement);if(typeof isSubset=="undefined"){complement=new Set}else if(isSubset){difference.call(complement,set)}else{complement.compile.call(complement)}return complement})})(SetProto.isSubsetOf,SetProto.difference,Set);Set.relativeComplement=(function(is,relativeComplement,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return relativeComplement.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.relativeComplement,Set);SetProto.absoluteComplement=(function(merge,relativeComplement,Set){return(function(){return relativeComplement.call(this,merge.apply((new Set),arguments))})})(SetProto.merge,SetProto.relativeComplement,Set);Set.absoluteComplement=(function(is,make,merge,relativeComplement,Set){return(function(){var sets=make(arguments),set=sets.shift(),arr=((is(set)&&set.toArray())||[]);set=new Set;return relativeComplement.call(set.compile.apply(set,arr),merge.apply((new Set),sets))})})(isSet,makeArray,SetProto.merge,SetProto.relativeComplement,Set);SetProto=isEmptySet=isSet=null;delete SetProto;delete isEmptySet;delete isSet;return Set})();compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=Arr=sh=ns=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete Arr;delete sh;delete ns;delete arguments.callee}).call(null);

- packed / shrinked           - 6.735 byte
(function(h){var j=this;if(!j.Array||(typeof j.Array.make!="function")||(typeof j.Array.isArray!="function")){throw(new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect]."));}var l=j.Array,ArrProto=l.prototype,makeArray=l.make,isArray=l.isArray,compactList=(function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len){if(list[k]===obj){list.splice(k,1);--len;--k}}if(!obj&&((typeof obj=="undefined")||(typeof obj=="object"))){list.splice(i,1);--len;--i}}return list}),compactedContains=(function(a){var b=false,i=-1,list=this,len=list.length;while(++i<len){if(list[i]===a){b=true;break}}return b}),compactedIndexOf=(((typeof ArrProto.indexOf=="function")&&ArrProto.indexOf)||(function(a){var i=idx=-1,list=this,len=list.length;while(++i<len){if(list[i]===a){idx=i;break}}return idx}));(h||j).Set=(function(){var g=(function(b,c){return(function(){var a=0,set=[];this.valueOf=(function(){return(((a>0)&&b(set))||EMPTY_SET)});this.toArray=(function(){return(((a>0)&&b(set))||[])});this.toString=(function(){return["{",set.join(", "),"}"].join("")});this.getCardinalNumber=(function(){return a});this.compile=(function(){set=c.call(b(arguments));a=set.length;return this});return this.compile.apply(this,arguments)})})(makeArray,compactList),SetProto=g.prototype,EMPTY_SET=new g,isEmptySet=(function(b){return(function(a){return((a&&a.valueOf())===b)})})(EMPTY_SET),isSet=(function(b){return(function(a){return(a&&!b(a)&&(typeof a.toArray=="function")&&b(a.toArray()))})})(isArray);SetProto.isEmptySet=(function(a){return(function(){return a(this)})})(isEmptySet);g.isEmptySet=(function(b){return(function(a){return b(a)})})(isEmptySet);SetProto.isSet=(function(a){return(function(){return a(this)})})(isSet);g.isSet=(function(b){return(function(a){return b(a)})})(isSet);SetProto.isSubsetOf=(function(c,d){return(function(a){var b=(c(a)&&a.toArray()),subSet=(c(this)&&this.toArray()),len,idx,isSubset;if(b&&subSet){isSubset=false;len=subSet.length;if(len===0){isSubset=true}else if(len<=b.length){isSubset=true;idx=-1;while(++idx<len){if(!d.call(b,subSet[idx])){isSubset=false;break}}}}return isSubset})})(isSet,compactedContains);g.isSubsetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isSubsetOf);SetProto.isRealSubsetOf=(function(b){return(function(a){return(b.call(this,a)&&(this.getCardinalNumber()<a.getCardinalNumber()))})})(SetProto.isSubsetOf);g.isRealSubsetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isRealSubsetOf);SetProto.isSupersetOf=(function(b){return(function(a){return b.call(a,this)})})(SetProto.isSubsetOf);g.isSupersetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isSupersetOf);SetProto.isRealSupersetOf=(function(b){return(function(a){return b.call(a,this)})})(SetProto.isRealSubsetOf);g.isRealSupersetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isRealSupersetOf);SetProto.isUniverseOf=(function(b){return(function(){var a=this,subSets=arguments,len=subSets.length,idx=-1,isUniverse;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=b.call(subSets[idx],a)if(!isUniverse){break}}}return isUniverse})})(SetProto.isSubsetOf);g.isUniverseOf=(function(b,c){return(function(){var a=b(arguments),supSet=a.shift();return c.apply(supSet,a)})})(makeArray,SetProto.isUniverseOf);SetProto.merge=(function(b,c){return(function(){var a=this,total=(b(a)&&a.toArray()),sets=arguments,len=sets.length,idx=-1,arr;if(total){while(++idx<len){arr=sets[idx];arr=(b(arr)&&arr.toArray());(arr&&c.apply(total,arr))}a.compile.apply(a,total)}return a})})(isSet,ArrProto.push);g.merge=(function(a,b){return(function(){return a.apply((new b),arguments)})})(SetProto.merge,g);SetProto.intersection=(function(c,d){return(function(a){var b=this,joint=(c(b)&&b.toArray()),arr=(c(a)&&a.toArray()),i=-1,k,len;if(joint&&arr){len=joint.length;while(++i<len){k=d.call(arr,joint[i]);if(k>=0){arr.splice(k,1)}else{joint.splice(i,1);--len;--i}}b.compile.apply(b,joint)}return b})})(isSet,compactedIndexOf);g.intersection=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.intersection,g);SetProto.isDisjoint=(function(b){return(function(a){return(b(this,a).isEmptySet())})})(g.intersection);g.isDisjoint=(function(c){return(function(a,b){return(c(a,b).isEmptySet())})})(g.intersection);SetProto.difference=(function(c,d){return(function(a){var b=this,diff=(c(b)&&b.toArray()),arr=(c(a)&&a.toArray()),i=-1,k,len;if(diff&&arr){len=diff.length;while(++i<len){k=d.call(arr,diff[i]);if(k>=0){arr.splice(k,1);diff.splice(i,1);--len;--i}}b.compile.apply(b,diff)}return b})})(isSet,compactedIndexOf);g.difference=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.difference,g);SetProto.symmetricDifference=(function(c,d,e){return(function(a){var b=this,sym=(c(b)&&b.toArray()),arr=(c(a)&&a.toArray()),i=-1,k,len;if(sym&&arr){len=sym.length;while(++i<len){k=d.call(arr,sym[i]);if(k>=0){arr.splice(k,1);sym.splice(i,1);--len;--i}}e.apply(sym,arr);b.compile.apply(b,sym)}return b})})(isSet,compactedIndexOf,ArrProto.push);g.symmetricDifference=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.symmetricDifference,g);SetProto.relativeComplement=(function(c,d,e){return(function(a){var b=this,isSubset=c.call(a,b);if(typeof isSubset=="undefined"){b=new e}else if(isSubset){d.call(b,a)}else{b.compile.call(b)}return b})})(SetProto.isSubsetOf,SetProto.difference,g);g.relativeComplement=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.relativeComplement,g);SetProto.absoluteComplement=(function(a,b,c){return(function(){return b.call(this,a.apply((new c),arguments))})})(SetProto.merge,SetProto.relativeComplement,g);g.absoluteComplement=(function(b,c,d,e,f){return(function(){var a=c(arguments),set=a.shift(),arr=((b(set)&&set.toArray())||[]);set=new f;return e.call(set.compile.apply(set,arr),d.apply((new f),a))})})(isSet,makeArray,SetProto.merge,SetProto.relativeComplement,g);SetProto=isEmptySet=isSet=null;delete SetProto;delete isEmptySet;delete isSet;return g})();compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=l=j=h=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete l;delete j;delete h;delete arguments.callee}).call(null);

- packed / shrinked / encoded - 4.154 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(h){9 j=6;m(!j.J||(D j.J.17!="2")||(D j.J.L!="2")){1p(q 1o("1q [[1h]] 1w 1s 1c 1n 1A 1c [[J]] 1z 1u 1r [J.17.1t]."));}9 l=j.J,F=l.1e,G=l.17,L=l.L,X=(2(){9 i=-1,k,H,t=6,5=t.w;x(++i<5){H=t[i];k=i;x(++k<5){m(t[k]===H){t.B(k,1);--5;--k}}m(!H&&((D H=="1i")||(D H=="1v"))){t.B(i,1);--5;--i}}3 t}),R=(2(a){9 b=15,i=-1,t=6,5=t.w;x(++i<5){m(t[i]===a){b=Z;Y}}3 b}),K=(((D F.1d=="2")&&F.1d)||(2(a){9 i=s=-1,t=6,5=t.w;x(++i<5){m(t[i]===a){s=i;Y}}3 s}));(h||j).1h=(2(){9 g=(2(b,c){3(2(){9 a=0,u=[];6.1g=(2(){3(((a>0)&&b(u))||19)});6.n=(2(){3(((a>0)&&b(u))||[])});6.1y=(2(){3["{",u.1f(", "),"}"].1f("")});6.16=(2(){3 a});6.v=(2(){u=c.7(b(y));a=u.w;3 6});3 6.v.p(6,y)})})(G,X),4=g.1e,19=q g,A=(2(b){3(2(a){3((a&&a.1g())===b)})})(19),o=(2(b){3(2(a){3(a&&!b(a)&&(D a.n=="2")&&b(a.n()))})})(L);4.A=(2(a){3(2(){3 a(6)})})(A);g.A=(2(b){3(2(a){3 b(a)})})(A);4.o=(2(a){3(2(){3 a(6)})})(o);g.o=(2(b){3(2(a){3 b(a)})})(o);4.E=(2(c,d){3(2(a){9 b=(c(a)&&a.n()),W=(c(6)&&6.n()),5,s,z;m(b&&W){z=15;5=W.w;m(5===0){z=Z}T m(5<=b.w){z=Z;s=-1;x(++s<5){m(!d.7(b,W[s])){z=15;Y}}}}3 z})})(o,R);g.E=(2(c){3(2(a,b){3 c.7(a,b)})})(4.E);4.V=(2(b){3(2(a){3(b.7(6,a)&&(6.16()<a.16()))})})(4.E);g.V=(2(c){3(2(a,b){3 c.7(a,b)})})(4.V);4.11=(2(b){3(2(a){3 b.7(a,6)})})(4.E);g.11=(2(c){3(2(a,b){3 c.7(a,b)})})(4.11);4.12=(2(b){3(2(a){3 b.7(a,6)})})(4.V);g.12=(2(c){3(2(a,b){3 c.7(a,b)})})(4.12);4.13=(2(b){3(2(){9 a=6,14=y,5=14.w,s=-1,N;m(5>=1){N=Z;x(++s<5){N=b.7(14[s],a)m(!N){Y}}}3 N})})(4.E);g.13=(2(b,c){3(2(){9 a=b(y),1k=a.1l();3 c.p(1k,a)})})(G,4.13);4.O=(2(b,c){3(2(){9 a=6,S=(b(a)&&a.n()),1a=y,5=1a.w,s=-1,8;m(S){x(++s<5){8=1a[s];8=(b(8)&&8.n());(8&&c.p(S,8))}a.v.p(a,S)}3 a})})(o,F.1m);g.O=(2(a,b){3(2(){3 a.p((q b),y)})})(4.O,g);4.P=(2(c,d){3(2(a){9 b=6,M=(c(b)&&b.n()),8=(c(a)&&a.n()),i=-1,k,5;m(M&&8){5=M.w;x(++i<5){k=d.7(8,M[i]);m(k>=0){8.B(k,1)}T{M.B(i,1);--5;--i}}b.v.p(b,M)}3 b})})(o,K);g.P=(2(d,e,f){3(2(a,b){9 c=((d(a)&&a.n())||[]);a=q f;3 e.7(a.v.p(a,c),((d(b)&&b)||(q f)))})})(o,4.P,g);4.1b=(2(b){3(2(a){3(b(6,a).A())})})(g.P);g.1b=(2(c){3(2(a,b){3(c(a,b).A())})})(g.P);4.U=(2(c,d){3(2(a){9 b=6,I=(c(b)&&b.n()),8=(c(a)&&a.n()),i=-1,k,5;m(I&&8){5=I.w;x(++i<5){k=d.7(8,I[i]);m(k>=0){8.B(k,1);I.B(i,1);--5;--i}}b.v.p(b,I)}3 b})})(o,K);g.U=(2(d,e,f){3(2(a,b){9 c=((d(a)&&a.n())||[]);a=q f;3 e.7(a.v.p(a,c),((d(b)&&b)||(q f)))})})(o,4.U,g);4.18=(2(c,d,e){3(2(a){9 b=6,C=(c(b)&&b.n()),8=(c(a)&&a.n()),i=-1,k,5;m(C&&8){5=C.w;x(++i<5){k=d.7(8,C[i]);m(k>=0){8.B(k,1);C.B(i,1);--5;--i}}e.p(C,8);b.v.p(b,C)}3 b})})(o,K,F.1m);g.18=(2(d,e,f){3(2(a,b){9 c=((d(a)&&a.n())||[]);a=q f;3 e.7(a.v.p(a,c),((d(b)&&b)||(q f)))})})(o,4.18,g);4.Q=(2(c,d,e){3(2(a){9 b=6,z=c.7(a,b);m(D z=="1i"){b=q e}T m(z){d.7(b,a)}T{b.v.7(b)}3 b})})(4.E,4.U,g);g.Q=(2(d,e,f){3(2(a,b){9 c=((d(a)&&a.n())||[]);a=q f;3 e.7(a.v.p(a,c),((d(b)&&b)||(q f)))})})(o,4.Q,g);4.1j=(2(a,b,c){3(2(){3 b.7(6,a.p((q c),y))})})(4.O,4.Q,g);g.1j=(2(b,c,d,e,f){3(2(){9 a=c(y),u=a.1l(),8=((b(u)&&u.n())||[]);u=q f;3 e.7(u.v.p(u,8),d.p((q f),a))})})(o,G,4.O,4.Q,g);4=A=o=10;r 4;r A;r o;3 g})();K=R=X=L=G=F=l=j=h=10;r K;r R;r X;r L;r G;r F;r l;r j;r h;r y.1x}).7(10);',62,99,'||function|return|SetProto|len|this|call|arr|var|||||||||||||if|toArray|isSet|apply|new|delete|idx|list|set|compile|length|while|arguments|isSubset|isEmptySet|splice|sym|typeof|isSubsetOf|ArrProto|makeArray|obj|diff|Array|compactedIndexOf|isArray|joint|isUniverse|merge|intersection|relativeComplement|compactedContains|total|else|difference|isRealSubsetOf|subSet|compactList|break|true|null|isSupersetOf|isRealSupersetOf|isUniverseOf|subSets|false|getCardinalNumber|make|symmetricDifference|EMPTY_SET|sets|isDisjoint|the|indexOf|prototype|join|valueOf|Set|undefined|absoluteComplement|supSet|shift|push|presence|ReferenceError|throw|This|base|requires|detect|module|object|implementation|callee|toString|extensions|of'.split('|'),0,{}));


*/ /*


  [closure-compiler(Simple) + edwards-packer(encoded)]


- combined                    - 3.699 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(s){5 m=4;7(!m.F||D m.F.Q!="2"||D m.F.15!="2")1c w 1k("1b [[1a]] 1d 1e 14 1h 1i 14 [[F]] 1g 1l 1m [F.Q.1n].");5 o=m.F,n=o.12,p=o.Q,t=o.15,u=2(){A(5 g=-1,f,k,l=4.z;++g<l;){k=4[g];A(f=g;++f<l;)7(4[f]===k){4.C(f,1);--l;--f}7(!k&&(D k=="16"||D k=="1f")){4.C(g,1);--l;--g}}3 4},v=2(g){A(5 f=S,k=-1,l=4.z;++k<l;)7(4[k]===g){f=K;L}3 f},q=D n.17=="2"&&n.17||2(g){A(5 f=T=-1,k=4.z;++f<k;)7(4[f]===g){T=f;L}3 T};(s||m).1a=2(){5 g=2(a,d){3 2(){5 c=0,b=[];4.19=2(){3 c>0&&a(b)||k};4.8=2(){3 c>0&&a(b)||[]};4.1j=2(){3["{",b.10(", "),"}"].10("")};4.R=2(){3 c};4.y=2(){b=d.6(a(B));c=b.z;3 4};3 4.y.9(4,B)}}(p,u),f=g.12,k=w g,l=2(a){3 2(d){3(d&&d.19())===a}}(k),j=2(a){3 2(d){3 d&&!a(d)&&D d.8=="2"&&a(d.8())}}(t);f.J=2(a){3 2(){3 a(4)}}(l);g.J=2(a){3 2(d){3 a(d)}}(l);f.Y=2(a){3 2(){3 a(4)}}(j);g.Y=2(a){3 2(d){3 a(d)}}(j);f.E=2(a,d){3 2(c){c=a(c)&&c.8();5 b=a(4)&&4.8(),e,h,i;7(c&&b){i=S;e=b.z;7(e===0)i=K;V 7(e<=c.z){i=K;A(h=-1;++h<e;)7(!d.6(c,b[h])){i=S;L}}}3 i}}(j,v);g.E=2(a){3 2(d,c){3 a.6(d,c)}}(f.E);f.N=2(a){3 2(d){3 a.6(4,d)&&4.R()<d.R()}}(f.E);g.N=2(a){3 2(d,c){3 a.6(d,c)}}(f.N);f.W=2(a){3 2(d){3 a.6(d,4)}}(f.E);g.W=2(a){3 2(d,c){3 a.6(d,c)}}(f.W);f.O=2(a){3 2(d){3 a.6(d,4)}}(f.N);g.O=2(a){3 2(d,c){3 a.6(d,c)}}(f.O);f.X=2(a){3 2(){5 d=B,c=d.z,b=-1,e;7(c>=1)A(e=K;++b<c;){e=a.6(d[b],4);7(!e)L}3 e}}(f.E);g.X=2(a,d){3 2(){5 c=a(B),b=c.Z();3 d.9(b,c)}}(p,f.X);f.G=2(a,d){3 2(){5 c=a(4)&&4.8(),b=B,e=b.z,h=-1,i;7(c){A(;++h<e;){i=b[h];(i=a(i)&&i.8())&&d.9(c,i)}4.y.9(4,c)}3 4}}(j,n.11);g.G=2(a,d){3 2(){3 a.9(w d,B)}}(f.G,g);f.H=2(a,d){3 2(c){5 b=a(4)&&4.8();c=a(c)&&c.8();5 e=-1,h,i;7(b&&c){A(i=b.z;++e<i;){h=d.6(c,b[e]);7(h>=0)c.C(h,1);V{b.C(e,1);--i;--e}}4.y.9(4,b)}3 4}}(j,q);g.H=2(a,d,c){3 2(b,e){5 h=a(b)&&b.8()||[];b=w c;3 d.6(b.y.9(b,h),a(e)&&e||w c)}}(j,f.H,g);f.13=2(a){3 2(d){3 a(4,d).J()}}(g.H);g.13=2(a){3 2(d,c){3 a(d,c).J()}}(g.H);f.M=2(a,d){3 2(c){5 b=a(4)&&4.8();c=a(c)&&c.8();5 e=-1,h,i;7(b&&c){A(i=b.z;++e<i;){h=d.6(c,b[e]);7(h>=0){c.C(h,1);b.C(e,1);--i;--e}}4.y.9(4,b)}3 4}}(j,q);g.M=2(a,d,c){3 2(b,e){5 h=a(b)&&b.8()||[];b=w c;3 d.6(b.y.9(b,h),a(e)&&e||w c)}}(j,f.M,g);f.P=2(a,d,c){3 2(b){5 e=a(4)&&4.8();b=a(b)&&b.8();5 h=-1,i,r;7(e&&b){A(r=e.z;++h<r;){i=d.6(b,e[h]);7(i>=0){b.C(i,1);e.C(h,1);--r;--h}}c.9(e,b);4.y.9(4,e)}3 4}}(j,q,n.11);g.P=2(a,d,c){3 2(b,e){5 h=a(b)&&b.8()||[];b=w c;3 d.6(b.y.9(b,h),a(e)&&e||w c)}}(j,f.P,g);f.I=2(a,d,c){3 2(b){5 e=4,h=a.6(b,e);7(D h=="16")e=w c;V h?d.6(e,b):e.y.6(e);3 e}}(f.E,f.M,g);g.I=2(a,d,c){3 2(b,e){5 h=a(b)&&b.8()||[];b=w c;3 d.6(b.y.9(b,h),a(e)&&e||w c)}}(j,f.I,g);f.18=2(a,d,c){3 2(){3 d.6(4,a.9(w c,B))}}(f.G,f.I,g);g.18=2(a,d,c,b,e){3 2(){5 h=d(B),i=h.Z(),r=a(i)&&i.8()||[];i=w e;3 b.6(i.y.9(i,r),c.9(w e,h))}}(j,p,f.G,f.I,g);f=l=j=U;x f;x l;x j;3 g}();q=v=u=t=p=n=o=m=s=U;x q;x v;x u;x t;x p;x n;x o;x m;x s;x B.1o}).6(U);',62,87,'||function|return|this|var|call|if|toArray|apply|||||||||||||||||||||||new|delete|compile|length|for|arguments|splice|typeof|isSubsetOf|Array|merge|intersection|relativeComplement|isEmptySet|true|break|difference|isRealSubsetOf|isRealSupersetOf|symmetricDifference|make|getCardinalNumber|false|idx|null|else|isSupersetOf|isUniverseOf|isSet|shift|join|push|prototype|isDisjoint|the|isArray|undefined|indexOf|absoluteComplement|valueOf|Set|This|throw|implementation|requires|object|extensions|presence|of|toString|ReferenceError|module|base|detect|callee'.split('|'),0,{}));


*/


(function (ns/*[custom_namespace]*/) {
  var sh = this/*[global_object|scripting_host]*/;


  if (!sh.Array || (typeof sh.Array.make != "function") || (typeof sh.Array.isArray != "function")) {
    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Array/Array.make.detect.js]
    throw (new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect]."));
  }
  var Arr = sh.Array, ArrProto = Arr.prototype, makeArray = Arr.make, isArray = Arr.isArray,

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
