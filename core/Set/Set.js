/*


  [Set]


[http://closure-compiler.appspot.com/home]

- Whitespace only - 8.151 byte
(function(global,namespace){if(!global.Array||typeof global.Array.make!="function"||typeof global.Array.isArray!="function")throw new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect].");var Arr=global.Array,ArrProto=Arr.prototype,makeArray=Arr.make,isArray=Arr.isArray,compactList=function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len)if(list[k]===obj){list.splice(k,1);--len;--k}if(!obj&&(typeof obj=="undefined"||typeof obj=="object")){list.splice(i,1);--len;--i}}return list},compactedContains=function(obj){var isMember=false,i=-1,list=this,len=list.length;while(++i<len)if(list[i]===obj){isMember=true;break}return isMember},compactedIndexOf=typeof ArrProto.indexOf=="function"&&ArrProto.indexOf||function(obj){var i=idx=-1,list=this,len=list.length;while(++i<len)if(list[i]===obj){idx=i;break}return idx};namespace=namespace||global;namespace["Set"]=function(){var Set=function(make,compact){return function(){var cardinalNumber=0,set=[];this.valueOf=function(){return cardinalNumber>0&&make(set)||EMPTY_SET};this.toArray=function(){return cardinalNumber>0&&make(set)||[]};this.toString=function(){return["{",set.join(", "),"}"].join("")};this.getCardinalNumber=function(){return cardinalNumber};this.compile=function(){set=compact.call(make(arguments));cardinalNumber=set.length;return this};return this.compile.apply(this,arguments)}}(makeArray,compactList),SetProto=Set.prototype,EMPTY_SET=new Set,isEmptySet=function(EMPTY_SET){return function(set){return(set&&set.valueOf())===EMPTY_SET}}(EMPTY_SET),isSet=function(is){return function(set){return set&&!is(set)&&typeof set.toArray=="function"&&is(set.toArray())}}(isArray);SetProto.isEmptySet=function(isEmptySet){return function(){return isEmptySet(this)}}(isEmptySet);Set.isEmptySet=function(isEmptySet){return function(set){return isEmptySet(set)}}(isEmptySet);SetProto.isSet=function(isSet){return function(){return isSet(this)}}(isSet);Set.isSet=function(isSet){return function(set){return isSet(set)}}(isSet);SetProto.isSubsetOf=function(is,contains){return function(set){var supSet=is(set)&&set.toArray(),subSet=is(this)&&this.toArray(),len,idx,isSubset;if(supSet&&subSet){isSubset=false;len=subSet.length;if(len===0)isSubset=true;else if(len<=supSet.length){isSubset=true;idx=-1;while(++idx<len)if(!contains.call(supSet,subSet[idx])){isSubset=false;break}}}return isSubset}}(isSet,compactedContains);Set.isSubsetOf=function(isSubsetOf){return function(subSet,supSet){return isSubsetOf.call(subSet,supSet)}}(SetProto.isSubsetOf);SetProto.isRealSubsetOf=function(isSubsetOf){return function(set){return isSubsetOf.call(this,set)&&this.getCardinalNumber()<set.getCardinalNumber()}}(SetProto.isSubsetOf);Set.isRealSubsetOf=function(isRealSubsetOf){return function(subSet,supSet){return isRealSubsetOf.call(subSet,supSet)}}(SetProto.isRealSubsetOf);SetProto.isSupersetOf=function(isSubsetOf){return function(set){return isSubsetOf.call(set,this)}}(SetProto.isSubsetOf);Set.isSupersetOf=function(isSupersetOf){return function(supSet,subSet){return isSupersetOf.call(supSet,subSet)}}(SetProto.isSupersetOf);SetProto.isRealSupersetOf=function(isRealSubsetOf){return function(list){return isRealSubsetOf.call(list,this)}}(SetProto.isRealSubsetOf);Set.isRealSupersetOf=function(isRealSupersetOf){return function(supSet,subSet){return isRealSupersetOf.call(supSet,subSet)}}(SetProto.isRealSupersetOf);SetProto.isUniverseOf=function(isSubsetOf){return function(){var supSet=this,subSets=arguments,len=subSets.length,idx=-1,isUniverse;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=isSubsetOf.call(subSets[idx],supSet);if(!isUniverse)break}}return isUniverse}}(SetProto.isSubsetOf);Set.isUniverseOf=function(make,isUniverseOf){return function(){var subSets=make(arguments),supSet=subSets.shift();return isUniverseOf.apply(supSet,subSets)}}(makeArray,SetProto.isUniverseOf);SetProto.merge=function(is,push){return function(){var merger=this,total=is(merger)&&merger.toArray(),sets=arguments,len=sets.length,idx=-1,arr;if(total){while(++idx<len){arr=sets[idx];arr=is(arr)&&arr.toArray();arr&&push.apply(total,arr)}merger.compile.apply(merger,total)}return merger}}(isSet,ArrProto.push);Set.merge=function(merge,Set){return function(){return merge.apply(new Set,arguments)}}(SetProto.merge,Set);SetProto.intersection=function(is,indexOf){return function(set){var intersection=this,joint=is(intersection)&&intersection.toArray(),arr=is(set)&&set.toArray(),i=-1,k,len;if(joint&&arr){len=joint.length;while(++i<len){k=indexOf.call(arr,joint[i]);if(k>=0)arr.splice(k,1);else{joint.splice(i,1);--len;--i}}intersection.compile.apply(intersection,joint)}return intersection}}(isSet,compactedIndexOf);Set.intersection=function(is,intersection,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return intersection.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.intersection,Set);SetProto.isDisjoint=function(intersection){return function(set){return intersection(this,set).isEmptySet()}}(Set.intersection);Set.isDisjoint=function(intersection){return function(set01,set02){return intersection(set01,set02).isEmptySet()}}(Set.intersection);SetProto.difference=function(is,indexOf){return function(set){var difference=this,diff=is(difference)&&difference.toArray(),arr=is(set)&&set.toArray(),i=-1,k,len;if(diff&&arr){len=diff.length;while(++i<len){k=indexOf.call(arr,diff[i]);if(k>=0){arr.splice(k,1);diff.splice(i,1);--len;--i}}difference.compile.apply(difference,diff)}return difference}}(isSet,compactedIndexOf);Set.difference=function(is,difference,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return difference.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.difference,Set);SetProto.symmetricDifference=function(is,indexOf,push){return function(set){var difference=this,sym=is(difference)&&difference.toArray(),arr=is(set)&&set.toArray(),i=-1,k,len;if(sym&&arr){len=sym.length;while(++i<len){k=indexOf.call(arr,sym[i]);if(k>=0){arr.splice(k,1);sym.splice(i,1);--len;--i}}push.apply(sym,arr);difference.compile.apply(difference,sym)}return difference}}(isSet,compactedIndexOf,ArrProto.push);Set.symmetricDifference=function(is,symmetricDifference,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return symmetricDifference.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.symmetricDifference,Set);SetProto.relativeComplement=function(isSubsetOf,difference,Set){return function(set){var complement=this,isSubset=isSubsetOf.call(set,complement);if(typeof isSubset=="undefined")complement=new Set;else if(isSubset)difference.call(complement,set);else complement.compile.call(complement);return complement}}(SetProto.isSubsetOf,SetProto.difference,Set);Set.relativeComplement=function(is,relativeComplement,Set){return function(set01,set02){var arr=is(set01)&&set01.toArray()||[];set01=new Set;return relativeComplement.call(set01.compile.apply(set01,arr),is(set02)&&set02||new Set)}}(isSet,SetProto.relativeComplement,Set);SetProto.absoluteComplement=function(merge,relativeComplement,Set){return function(){return relativeComplement.call(this,merge.apply(new Set,arguments))}}(SetProto.merge,SetProto.relativeComplement,Set);Set.absoluteComplement=function(is,make,merge,relativeComplement,Set){return function(){var sets=make(arguments),set=sets.shift(),arr=is(set)&&set.toArray()||[];set=new Set;return relativeComplement.call(set.compile.apply(set,arr),merge.apply(new Set,sets))}}(isSet,makeArray,SetProto.merge,SetProto.relativeComplement,Set);SetProto=isEmptySet=isSet=null;delete SetProto;delete isEmptySet;delete isSet;return Set}();compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=Arr=global=namespace=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete Arr;delete global;delete namespace;delete arguments.callee})(this&&this.window===this&&window||this);

- Simple          - 5.413 byte
(function(m,o){if(!m.Array||typeof m.Array.make!="function"||typeof m.Array.isArray!="function")throw new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect].");var p=m.Array,n=p.prototype,q=p.make,t=p.isArray,u=function(){for(var g=-1,f,k,l=this.length;++g<l;){k=this[g];for(f=g;++f<l;)if(this[f]===k){this.splice(f,1);--l;--f}if(!k&&(typeof k=="undefined"||typeof k=="object")){this.splice(g,1);--l;--g}}return this},v=function(g){for(var f=false,k=-1,l=this.length;++k<l;)if(this[k]===g){f=true;break}return f},r=typeof n.indexOf=="function"&&n.indexOf||function(g){for(var f=idx=-1,k=this.length;++f<k;)if(this[f]===g){idx=f;break}return idx};o=o||m;o.Set=function(){var g=function(a,d){return function(){var c=0,b=[];this.valueOf=function(){return c>0&&a(b)||k};this.toArray=function(){return c>0&&a(b)||[]};this.toString=function(){return["{",b.join(", "),"}"].join("")};this.getCardinalNumber=function(){return c};this.compile=function(){b=d.call(a(arguments));c=b.length;return this};return this.compile.apply(this,arguments)}}(q,u),f=g.prototype,k=new g,l=function(a){return function(d){return(d&&d.valueOf())===a}}(k),j=function(a){return function(d){return d&&!a(d)&&typeof d.toArray=="function"&&a(d.toArray())}}(t);f.isEmptySet=function(a){return function(){return a(this)}}(l);g.isEmptySet=function(a){return function(d){return a(d)}}(l);f.isSet=function(a){return function(){return a(this)}}(j);g.isSet=function(a){return function(d){return a(d)}}(j);f.isSubsetOf=function(a,d){return function(c){c=a(c)&&c.toArray();var b=a(this)&&this.toArray(),e,h,i;if(c&&b){i=false;e=b.length;if(e===0)i=true;else if(e<=c.length){i=true;for(h=-1;++h<e;)if(!d.call(c,b[h])){i=false;break}}}return i}}(j,v);g.isSubsetOf=function(a){return function(d,c){return a.call(d,c)}}(f.isSubsetOf);f.isRealSubsetOf=function(a){return function(d){return a.call(this,d)&&this.getCardinalNumber()<d.getCardinalNumber()}}(f.isSubsetOf);g.isRealSubsetOf=function(a){return function(d,c){return a.call(d,c)}}(f.isRealSubsetOf);f.isSupersetOf=function(a){return function(d){return a.call(d,this)}}(f.isSubsetOf);g.isSupersetOf=function(a){return function(d,c){return a.call(d,c)}}(f.isSupersetOf);f.isRealSupersetOf=function(a){return function(d){return a.call(d,this)}}(f.isRealSubsetOf);g.isRealSupersetOf=function(a){return function(d,c){return a.call(d,c)}}(f.isRealSupersetOf);f.isUniverseOf=function(a){return function(){var d=arguments,c=d.length,b=-1,e;if(c>=1)for(e=true;++b<c;){e=a.call(d[b],this);if(!e)break}return e}}(f.isSubsetOf);g.isUniverseOf=function(a,d){return function(){var c=a(arguments),b=c.shift();return d.apply(b,c)}}(q,f.isUniverseOf);f.merge=function(a,d){return function(){var c=a(this)&&this.toArray(),b=arguments,e=b.length,h=-1,i;if(c){for(;++h<e;){i=b[h];(i=a(i)&&i.toArray())&&d.apply(c,i)}this.compile.apply(this,c)}return this}}(j,n.push);g.merge=function(a,d){return function(){return a.apply(new d,arguments)}}(f.merge,g);f.intersection=function(a,d){return function(c){var b=a(this)&&this.toArray();c=a(c)&&c.toArray();var e=-1,h,i;if(b&&c){for(i=b.length;++e<i;){h=d.call(c,b[e]);if(h>=0)c.splice(h,1);else{b.splice(e,1);--i;--e}}this.compile.apply(this,b)}return this}}(j,r);g.intersection=function(a,d,c){return function(b,e){var h=a(b)&&b.toArray()||[];b=new c;return d.call(b.compile.apply(b,h),a(e)&&e||new c)}}(j,f.intersection,g);f.isDisjoint=function(a){return function(d){return a(this,d).isEmptySet()}}(g.intersection);g.isDisjoint=function(a){return function(d,c){return a(d,c).isEmptySet()}}(g.intersection);f.difference=function(a,d){return function(c){var b=a(this)&&this.toArray();c=a(c)&&c.toArray();var e=-1,h,i;if(b&&c){for(i=b.length;++e<i;){h=d.call(c,b[e]);if(h>=0){c.splice(h,1);b.splice(e,1);--i;--e}}this.compile.apply(this,b)}return this}}(j,r);g.difference=function(a,d,c){return function(b,e){var h=a(b)&&b.toArray()||[];b=new c;return d.call(b.compile.apply(b,h),a(e)&&e||new c)}}(j,f.difference,g);f.symmetricDifference=function(a,d,c){return function(b){var e=a(this)&&this.toArray();b=a(b)&&b.toArray();var h=-1,i,s;if(e&&b){for(s=e.length;++h<s;){i=d.call(b,e[h]);if(i>=0){b.splice(i,1);e.splice(h,1);--s;--h}}c.apply(e,b);this.compile.apply(this,e)}return this}}(j,r,n.push);g.symmetricDifference=function(a,d,c){return function(b,e){var h=a(b)&&b.toArray()||[];b=new c;return d.call(b.compile.apply(b,h),a(e)&&e||new c)}}(j,f.symmetricDifference,g);f.relativeComplement=function(a,d,c){return function(b){var e=this,h=a.call(b,e);if(typeof h=="undefined")e=new c;else h?d.call(e,b):e.compile.call(e);return e}}(f.isSubsetOf,f.difference,g);g.relativeComplement=function(a,d,c){return function(b,e){var h=a(b)&&b.toArray()||[];b=new c;return d.call(b.compile.apply(b,h),a(e)&&e||new c)}}(j,f.relativeComplement,g);f.absoluteComplement=function(a,d,c){return function(){return d.call(this,a.apply(new c,arguments))}}(f.merge,f.relativeComplement,g);g.absoluteComplement=function(a,d,c,b,e){return function(){var h=d(arguments),i=h.shift(),s=a(i)&&i.toArray()||[];i=new e;return b.call(i.compile.apply(i,s),c.apply(new e,h))}}(j,q,f.merge,f.relativeComplement,g);f=l=j=null;delete f;delete l;delete j;return g}();r=v=u=t=q=n=p=m=o=null;delete r;delete v;delete u;delete t;delete q;delete n;delete p;delete m;delete o;delete arguments.callee})(this&&this.window===this&&window||this);



[http://dean.edwards.name/packer/]

- packed                      - 8.390 byte
(function(global,namespace){if(!global.Array||(typeof global.Array.make!="function")||(typeof global.Array.isArray!="function")){throw(new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect]."));}var Arr=global.Array,ArrProto=Arr.prototype,makeArray=Arr.make,isArray=Arr.isArray,compactList=(function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len){if(list[k]===obj){list.splice(k,1);--len;--k}}if(!obj&&((typeof obj=="undefined")||(typeof obj=="object"))){list.splice(i,1);--len;--i}}return list}),compactedContains=(function(obj){var isMember=false,i=-1,list=this,len=list.length;while(++i<len){if(list[i]===obj){isMember=true;break}}return isMember}),compactedIndexOf=(((typeof ArrProto.indexOf=="function")&&ArrProto.indexOf)||(function(obj){var i=idx=-1,list=this,len=list.length;while(++i<len){if(list[i]===obj){idx=i;break}}return idx}));namespace=(namespace||global);namespace["Set"]=(function(){var Set=(function(make,compact){return(function(){var cardinalNumber=0,set=[];this.valueOf=(function(){return(((cardinalNumber>0)&&make(set))||EMPTY_SET)});this.toArray=(function(){return(((cardinalNumber>0)&&make(set))||[])});this.toString=(function(){return["{",set.join(", "),"}"].join("")});this.getCardinalNumber=(function(){return cardinalNumber});this.compile=(function(){set=compact.call(make(arguments));cardinalNumber=set.length;return this});return this.compile.apply(this,arguments)})})(makeArray,compactList),SetProto=Set.prototype,EMPTY_SET=new Set,isEmptySet=(function(EMPTY_SET){return(function(set){return((set&&set.valueOf())===EMPTY_SET)})})(EMPTY_SET),isSet=(function(is){return(function(set){return(set&&!is(set)&&(typeof set.toArray=="function")&&is(set.toArray()))})})(isArray);SetProto.isEmptySet=(function(isEmptySet){return(function(){return isEmptySet(this)})})(isEmptySet);Set.isEmptySet=(function(isEmptySet){return(function(set){return isEmptySet(set)})})(isEmptySet);SetProto.isSet=(function(isSet){return(function(){return isSet(this)})})(isSet);Set.isSet=(function(isSet){return(function(set){return isSet(set)})})(isSet);SetProto.isSubsetOf=(function(is,contains){return(function(set){var supSet=(is(set)&&set.toArray()),subSet=(is(this)&&this.toArray()),len,idx,isSubset;if(supSet&&subSet){isSubset=false;len=subSet.length;if(len===0){isSubset=true}else if(len<=supSet.length){isSubset=true;idx=-1;while(++idx<len){if(!contains.call(supSet,subSet[idx])){isSubset=false;break}}}}return isSubset})})(isSet,compactedContains);Set.isSubsetOf=(function(isSubsetOf){return(function(subSet,supSet){return isSubsetOf.call(subSet,supSet)})})(SetProto.isSubsetOf);SetProto.isRealSubsetOf=(function(isSubsetOf){return(function(set){return(isSubsetOf.call(this,set)&&(this.getCardinalNumber()<set.getCardinalNumber()))})})(SetProto.isSubsetOf);Set.isRealSubsetOf=(function(isRealSubsetOf){return(function(subSet,supSet){return isRealSubsetOf.call(subSet,supSet)})})(SetProto.isRealSubsetOf);SetProto.isSupersetOf=(function(isSubsetOf){return(function(set){return isSubsetOf.call(set,this)})})(SetProto.isSubsetOf);Set.isSupersetOf=(function(isSupersetOf){return(function(supSet,subSet){return isSupersetOf.call(supSet,subSet)})})(SetProto.isSupersetOf);SetProto.isRealSupersetOf=(function(isRealSubsetOf){return(function(list){return isRealSubsetOf.call(list,this)})})(SetProto.isRealSubsetOf);Set.isRealSupersetOf=(function(isRealSupersetOf){return(function(supSet,subSet){return isRealSupersetOf.call(supSet,subSet)})})(SetProto.isRealSupersetOf);SetProto.isUniverseOf=(function(isSubsetOf){return(function(){var supSet=this,subSets=arguments,len=subSets.length,idx=-1,isUniverse;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=isSubsetOf.call(subSets[idx],supSet)if(!isUniverse){break}}}return isUniverse})})(SetProto.isSubsetOf);Set.isUniverseOf=(function(make,isUniverseOf){return(function(){var subSets=make(arguments),supSet=subSets.shift();return isUniverseOf.apply(supSet,subSets)})})(makeArray,SetProto.isUniverseOf);SetProto.merge=(function(is,push){return(function(){var merger=this,total=(is(merger)&&merger.toArray()),sets=arguments,len=sets.length,idx=-1,arr;if(total){while(++idx<len){arr=sets[idx];arr=(is(arr)&&arr.toArray());(arr&&push.apply(total,arr))}merger.compile.apply(merger,total)}return merger})})(isSet,ArrProto.push);Set.merge=(function(merge,Set){return(function(){return merge.apply((new Set),arguments)})})(SetProto.merge,Set);SetProto.intersection=(function(is,indexOf){return(function(set){var intersection=this,joint=(is(intersection)&&intersection.toArray()),arr=(is(set)&&set.toArray()),i=-1,k,len;if(joint&&arr){len=joint.length;while(++i<len){k=indexOf.call(arr,joint[i]);if(k>=0){arr.splice(k,1)}else{joint.splice(i,1);--len;--i}}intersection.compile.apply(intersection,joint)}return intersection})})(isSet,compactedIndexOf);Set.intersection=(function(is,intersection,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return intersection.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.intersection,Set);SetProto.isDisjoint=(function(intersection){return(function(set){return(intersection(this,set).isEmptySet())})})(Set.intersection);Set.isDisjoint=(function(intersection){return(function(set01,set02){return(intersection(set01,set02).isEmptySet())})})(Set.intersection);SetProto.difference=(function(is,indexOf){return(function(set){var difference=this,diff=(is(difference)&&difference.toArray()),arr=(is(set)&&set.toArray()),i=-1,k,len;if(diff&&arr){len=diff.length;while(++i<len){k=indexOf.call(arr,diff[i]);if(k>=0){arr.splice(k,1);diff.splice(i,1);--len;--i}}difference.compile.apply(difference,diff)}return difference})})(isSet,compactedIndexOf);Set.difference=(function(is,difference,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return difference.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.difference,Set);SetProto.symmetricDifference=(function(is,indexOf,push){return(function(set){var difference=this,sym=(is(difference)&&difference.toArray()),arr=(is(set)&&set.toArray()),i=-1,k,len;if(sym&&arr){len=sym.length;while(++i<len){k=indexOf.call(arr,sym[i]);if(k>=0){arr.splice(k,1);sym.splice(i,1);--len;--i}}push.apply(sym,arr);difference.compile.apply(difference,sym)}return difference})})(isSet,compactedIndexOf,ArrProto.push);Set.symmetricDifference=(function(is,symmetricDifference,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return symmetricDifference.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.symmetricDifference,Set);SetProto.relativeComplement=(function(isSubsetOf,difference,Set){return(function(set){var complement=this,isSubset=isSubsetOf.call(set,complement);if(typeof isSubset=="undefined"){complement=new Set}else if(isSubset){difference.call(complement,set)}else{complement.compile.call(complement)}return complement})})(SetProto.isSubsetOf,SetProto.difference,Set);Set.relativeComplement=(function(is,relativeComplement,Set){return(function(set01,set02){var arr=((is(set01)&&set01.toArray())||[]);set01=new Set;return relativeComplement.call(set01.compile.apply(set01,arr),((is(set02)&&set02)||(new Set)))})})(isSet,SetProto.relativeComplement,Set);SetProto.absoluteComplement=(function(merge,relativeComplement,Set){return(function(){return relativeComplement.call(this,merge.apply((new Set),arguments))})})(SetProto.merge,SetProto.relativeComplement,Set);Set.absoluteComplement=(function(is,make,merge,relativeComplement,Set){return(function(){var sets=make(arguments),set=sets.shift(),arr=((is(set)&&set.toArray())||[]);set=new Set;return relativeComplement.call(set.compile.apply(set,arr),merge.apply((new Set),sets))})})(isSet,makeArray,SetProto.merge,SetProto.relativeComplement,Set);SetProto=isEmptySet=isSet=null;delete SetProto;delete isEmptySet;delete isSet;return Set})();compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=Arr=global=namespace=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete Arr;delete global;delete namespace;delete arguments.callee})((this&&(this.window===this)&&window)||this);

- packed / shrinked           - 6.766 byte
(function(h,j){if(!h.Array||(typeof h.Array.make!="function")||(typeof h.Array.isArray!="function")){throw(new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect]."));}var l=h.Array,ArrProto=l.prototype,makeArray=l.make,isArray=l.isArray,compactList=(function(){var i=-1,k,obj,list=this,len=list.length;while(++i<len){obj=list[i];k=i;while(++k<len){if(list[k]===obj){list.splice(k,1);--len;--k}}if(!obj&&((typeof obj=="undefined")||(typeof obj=="object"))){list.splice(i,1);--len;--i}}return list}),compactedContains=(function(a){var b=false,i=-1,list=this,len=list.length;while(++i<len){if(list[i]===a){b=true;break}}return b}),compactedIndexOf=(((typeof ArrProto.indexOf=="function")&&ArrProto.indexOf)||(function(a){var i=idx=-1,list=this,len=list.length;while(++i<len){if(list[i]===a){idx=i;break}}return idx}));j=(j||h);j["Set"]=(function(){var g=(function(b,c){return(function(){var a=0,set=[];this.valueOf=(function(){return(((a>0)&&b(set))||EMPTY_SET)});this.toArray=(function(){return(((a>0)&&b(set))||[])});this.toString=(function(){return["{",set.join(", "),"}"].join("")});this.getCardinalNumber=(function(){return a});this.compile=(function(){set=c.call(b(arguments));a=set.length;return this});return this.compile.apply(this,arguments)})})(makeArray,compactList),SetProto=g.prototype,EMPTY_SET=new g,isEmptySet=(function(b){return(function(a){return((a&&a.valueOf())===b)})})(EMPTY_SET),isSet=(function(b){return(function(a){return(a&&!b(a)&&(typeof a.toArray=="function")&&b(a.toArray()))})})(isArray);SetProto.isEmptySet=(function(a){return(function(){return a(this)})})(isEmptySet);g.isEmptySet=(function(b){return(function(a){return b(a)})})(isEmptySet);SetProto.isSet=(function(a){return(function(){return a(this)})})(isSet);g.isSet=(function(b){return(function(a){return b(a)})})(isSet);SetProto.isSubsetOf=(function(c,d){return(function(a){var b=(c(a)&&a.toArray()),subSet=(c(this)&&this.toArray()),len,idx,isSubset;if(b&&subSet){isSubset=false;len=subSet.length;if(len===0){isSubset=true}else if(len<=b.length){isSubset=true;idx=-1;while(++idx<len){if(!d.call(b,subSet[idx])){isSubset=false;break}}}}return isSubset})})(isSet,compactedContains);g.isSubsetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isSubsetOf);SetProto.isRealSubsetOf=(function(b){return(function(a){return(b.call(this,a)&&(this.getCardinalNumber()<a.getCardinalNumber()))})})(SetProto.isSubsetOf);g.isRealSubsetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isRealSubsetOf);SetProto.isSupersetOf=(function(b){return(function(a){return b.call(a,this)})})(SetProto.isSubsetOf);g.isSupersetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isSupersetOf);SetProto.isRealSupersetOf=(function(b){return(function(a){return b.call(a,this)})})(SetProto.isRealSubsetOf);g.isRealSupersetOf=(function(c){return(function(a,b){return c.call(a,b)})})(SetProto.isRealSupersetOf);SetProto.isUniverseOf=(function(b){return(function(){var a=this,subSets=arguments,len=subSets.length,idx=-1,isUniverse;if(len>=1){isUniverse=true;while(++idx<len){isUniverse=b.call(subSets[idx],a)if(!isUniverse){break}}}return isUniverse})})(SetProto.isSubsetOf);g.isUniverseOf=(function(b,c){return(function(){var a=b(arguments),supSet=a.shift();return c.apply(supSet,a)})})(makeArray,SetProto.isUniverseOf);SetProto.merge=(function(b,c){return(function(){var a=this,total=(b(a)&&a.toArray()),sets=arguments,len=sets.length,idx=-1,arr;if(total){while(++idx<len){arr=sets[idx];arr=(b(arr)&&arr.toArray());(arr&&c.apply(total,arr))}a.compile.apply(a,total)}return a})})(isSet,ArrProto.push);g.merge=(function(a,b){return(function(){return a.apply((new b),arguments)})})(SetProto.merge,g);SetProto.intersection=(function(c,d){return(function(a){var b=this,joint=(c(b)&&b.toArray()),arr=(c(a)&&a.toArray()),i=-1,k,len;if(joint&&arr){len=joint.length;while(++i<len){k=d.call(arr,joint[i]);if(k>=0){arr.splice(k,1)}else{joint.splice(i,1);--len;--i}}b.compile.apply(b,joint)}return b})})(isSet,compactedIndexOf);g.intersection=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.intersection,g);SetProto.isDisjoint=(function(b){return(function(a){return(b(this,a).isEmptySet())})})(g.intersection);g.isDisjoint=(function(c){return(function(a,b){return(c(a,b).isEmptySet())})})(g.intersection);SetProto.difference=(function(c,d){return(function(a){var b=this,diff=(c(b)&&b.toArray()),arr=(c(a)&&a.toArray()),i=-1,k,len;if(diff&&arr){len=diff.length;while(++i<len){k=d.call(arr,diff[i]);if(k>=0){arr.splice(k,1);diff.splice(i,1);--len;--i}}b.compile.apply(b,diff)}return b})})(isSet,compactedIndexOf);g.difference=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.difference,g);SetProto.symmetricDifference=(function(c,d,e){return(function(a){var b=this,sym=(c(b)&&b.toArray()),arr=(c(a)&&a.toArray()),i=-1,k,len;if(sym&&arr){len=sym.length;while(++i<len){k=d.call(arr,sym[i]);if(k>=0){arr.splice(k,1);sym.splice(i,1);--len;--i}}e.apply(sym,arr);b.compile.apply(b,sym)}return b})})(isSet,compactedIndexOf,ArrProto.push);g.symmetricDifference=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.symmetricDifference,g);SetProto.relativeComplement=(function(c,d,e){return(function(a){var b=this,isSubset=c.call(a,b);if(typeof isSubset=="undefined"){b=new e}else if(isSubset){d.call(b,a)}else{b.compile.call(b)}return b})})(SetProto.isSubsetOf,SetProto.difference,g);g.relativeComplement=(function(d,e,f){return(function(a,b){var c=((d(a)&&a.toArray())||[]);a=new f;return e.call(a.compile.apply(a,c),((d(b)&&b)||(new f)))})})(isSet,SetProto.relativeComplement,g);SetProto.absoluteComplement=(function(a,b,c){return(function(){return b.call(this,a.apply((new c),arguments))})})(SetProto.merge,SetProto.relativeComplement,g);g.absoluteComplement=(function(b,c,d,e,f){return(function(){var a=c(arguments),set=a.shift(),arr=((b(set)&&set.toArray())||[]);set=new f;return e.call(set.compile.apply(set,arr),d.apply((new f),a))})})(isSet,makeArray,SetProto.merge,SetProto.relativeComplement,g);SetProto=isEmptySet=isSet=null;delete SetProto;delete isEmptySet;delete isSet;return g})();compactedIndexOf=compactedContains=compactList=isArray=makeArray=ArrProto=l=h=j=null;delete compactedIndexOf;delete compactedContains;delete compactList;delete isArray;delete makeArray;delete ArrProto;delete l;delete h;delete j;delete arguments.callee})((this&&(this.window===this)&&window)||this);

- packed / shrinked / encoded - 4.183 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(h,j){9(!h.H||(F h.H.14!="2")||(F h.H.G!="2")){1u(q 1v("1t [[1e]] 1s 1x 1a 1r 1y 1a [[H]] 1q 1z 1p [H.14.1A]."));}m l=h.H,E=l.1d,M=l.14,G=l.G,U=(2(){m i=-1,k,I,s=6,5=s.w;x(++i<5){I=s[i];k=i;x(++k<5){9(s[k]===I){s.B(k,1);--5;--k}}9(!I&&((F I=="1m")||(F I=="1o"))){s.B(i,1);--5;--i}}3 s}),Z=(2(a){m b=15,i=-1,s=6,5=s.w;x(++i<5){9(s[i]===a){b=R;Y}}3 b}),K=(((F E.1n=="2")&&E.1n)||(2(a){m i=r=-1,s=6,5=s.w;x(++i<5){9(s[i]===a){r=i;Y}}3 r}));j=(j||h);j["1e"]=(2(){m g=(2(b,c){3(2(){m a=0,v=[];6.1h=(2(){3(((a>0)&&b(v))||13)});6.n=(2(){3(((a>0)&&b(v))||[])});6.1B=(2(){3["{",v.1l(", "),"}"].1l("")});6.16=(2(){3 a});6.u=(2(){v=c.7(b(z));a=v.w;3 6});3 6.u.p(6,z)})})(M,U),4=g.1d,13=q g,y=(2(b){3(2(a){3((a&&a.1h())===b)})})(13),o=(2(b){3(2(a){3(a&&!b(a)&&(F a.n=="2")&&b(a.n()))})})(G);4.y=(2(a){3(2(){3 a(6)})})(y);g.y=(2(b){3(2(a){3 b(a)})})(y);4.o=(2(a){3(2(){3 a(6)})})(o);g.o=(2(b){3(2(a){3 b(a)})})(o);4.C=(2(c,d){3(2(a){m b=(c(a)&&a.n()),T=(c(6)&&6.n()),5,r,A;9(b&&T){A=15;5=T.w;9(5===0){A=R}V 9(5<=b.w){A=R;r=-1;x(++r<5){9(!d.7(b,T[r])){A=15;Y}}}}3 A})})(o,Z);g.C=(2(c){3(2(a,b){3 c.7(a,b)})})(4.C);4.W=(2(b){3(2(a){3(b.7(6,a)&&(6.16()<a.16()))})})(4.C);g.W=(2(c){3(2(a,b){3 c.7(a,b)})})(4.W);4.17=(2(b){3(2(a){3 b.7(a,6)})})(4.C);g.17=(2(c){3(2(a,b){3 c.7(a,b)})})(4.17);4.18=(2(b){3(2(a){3 b.7(a,6)})})(4.W);g.18=(2(c){3(2(a,b){3 c.7(a,b)})})(4.18);4.10=(2(b){3(2(){m a=6,19=z,5=19.w,r=-1,P;9(5>=1){P=R;x(++r<5){P=b.7(19[r],a)9(!P){Y}}}3 P})})(4.C);g.10=(2(b,c){3(2(){m a=b(z),1f=a.1g();3 c.p(1f,a)})})(M,4.10);4.N=(2(b,c){3(2(){m a=6,X=(b(a)&&a.n()),11=z,5=11.w,r=-1,8;9(X){x(++r<5){8=11[r];8=(b(8)&&8.n());(8&&c.p(X,8))}a.u.p(a,X)}3 a})})(o,E.1c);g.N=(2(a,b){3(2(){3 a.p((q b),z)})})(4.N,g);4.O=(2(c,d){3(2(a){m b=6,J=(c(b)&&b.n()),8=(c(a)&&a.n()),i=-1,k,5;9(J&&8){5=J.w;x(++i<5){k=d.7(8,J[i]);9(k>=0){8.B(k,1)}V{J.B(i,1);--5;--i}}b.u.p(b,J)}3 b})})(o,K);g.O=(2(d,e,f){3(2(a,b){m c=((d(a)&&a.n())||[]);a=q f;3 e.7(a.u.p(a,c),((d(b)&&b)||(q f)))})})(o,4.O,g);4.1k=(2(b){3(2(a){3(b(6,a).y())})})(g.O);g.1k=(2(c){3(2(a,b){3(c(a,b).y())})})(g.O);4.S=(2(c,d){3(2(a){m b=6,L=(c(b)&&b.n()),8=(c(a)&&a.n()),i=-1,k,5;9(L&&8){5=L.w;x(++i<5){k=d.7(8,L[i]);9(k>=0){8.B(k,1);L.B(i,1);--5;--i}}b.u.p(b,L)}3 b})})(o,K);g.S=(2(d,e,f){3(2(a,b){m c=((d(a)&&a.n())||[]);a=q f;3 e.7(a.u.p(a,c),((d(b)&&b)||(q f)))})})(o,4.S,g);4.12=(2(c,d,e){3(2(a){m b=6,D=(c(b)&&b.n()),8=(c(a)&&a.n()),i=-1,k,5;9(D&&8){5=D.w;x(++i<5){k=d.7(8,D[i]);9(k>=0){8.B(k,1);D.B(i,1);--5;--i}}e.p(D,8);b.u.p(b,D)}3 b})})(o,K,E.1c);g.12=(2(d,e,f){3(2(a,b){m c=((d(a)&&a.n())||[]);a=q f;3 e.7(a.u.p(a,c),((d(b)&&b)||(q f)))})})(o,4.12,g);4.Q=(2(c,d,e){3(2(a){m b=6,A=c.7(a,b);9(F A=="1m"){b=q e}V 9(A){d.7(b,a)}V{b.u.7(b)}3 b})})(4.C,4.S,g);g.Q=(2(d,e,f){3(2(a,b){m c=((d(a)&&a.n())||[]);a=q f;3 e.7(a.u.p(a,c),((d(b)&&b)||(q f)))})})(o,4.Q,g);4.1j=(2(a,b,c){3(2(){3 b.7(6,a.p((q c),z))})})(4.N,4.Q,g);g.1j=(2(b,c,d,e,f){3(2(){m a=c(z),v=a.1g(),8=((b(v)&&v.n())||[]);v=q f;3 e.7(v.u.p(v,8),d.p((q f),a))})})(o,M,4.N,4.Q,g);4=y=o=1i;t 4;t y;t o;3 g})();K=Z=U=G=M=E=l=h=j=1i;t K;t Z;t U;t G;t M;t E;t l;t h;t j;t z.1w})((6&&(6.1b===6)&&1b)||6);',62,100,'||function|return|SetProto|len|this|call|arr|if|||||||||||||var|toArray|isSet|apply|new|idx|list|delete|compile|set|length|while|isEmptySet|arguments|isSubset|splice|isSubsetOf|sym|ArrProto|typeof|isArray|Array|obj|joint|compactedIndexOf|diff|makeArray|merge|intersection|isUniverse|relativeComplement|true|difference|subSet|compactList|else|isRealSubsetOf|total|break|compactedContains|isUniverseOf|sets|symmetricDifference|EMPTY_SET|make|false|getCardinalNumber|isSupersetOf|isRealSupersetOf|subSets|the|window|push|prototype|Set|supSet|shift|valueOf|null|absoluteComplement|isDisjoint|join|undefined|indexOf|object|base|extensions|presence|implementation|This|throw|ReferenceError|callee|requires|of|module|detect|toString'.split('|'),0,{}));



[closure-compiler(Simple) + edwards-packer(encoded)]

-combined                     - 3.719 byte
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(2(m,o){7(!m.F||D m.F.O!="2"||D m.F.15!="2")1e w 1p("1c [[Z]] 1d 1n Y 1m 1f Y [[F]] 1l 1h 1j [F.O.1i].");5 p=m.F,n=p.X,q=p.O,t=p.15,u=2(){A(5 g=-1,f,k,l=4.z;++g<l;){k=4[g];A(f=g;++f<l;)7(4[f]===k){4.C(f,1);--l;--f}7(!k&&(D k=="18"||D k=="1o")){4.C(g,1);--l;--g}}3 4},v=2(g){A(5 f=W,k=-1,l=4.z;++k<l;)7(4[k]===g){f=J;K}3 f},r=D n.1a=="2"&&n.1a||2(g){A(5 f=V=-1,k=4.z;++f<k;)7(4[f]===g){V=f;K}3 V};o=o||m;o.Z=2(){5 g=2(a,d){3 2(){5 c=0,b=[];4.13=2(){3 c>0&&a(b)||k};4.8=2(){3 c>0&&a(b)||[]};4.1g=2(){3["{",b.17(", "),"}"].17("")};4.T=2(){3 c};4.y=2(){b=d.6(a(B));c=b.z;3 4};3 4.y.9(4,B)}}(q,u),f=g.X,k=w g,l=2(a){3 2(d){3(d&&d.13())===a}}(k),j=2(a){3 2(d){3 d&&!a(d)&&D d.8=="2"&&a(d.8())}}(t);f.N=2(a){3 2(){3 a(4)}}(l);g.N=2(a){3 2(d){3 a(d)}}(l);f.11=2(a){3 2(){3 a(4)}}(j);g.11=2(a){3 2(d){3 a(d)}}(j);f.E=2(a,d){3 2(c){c=a(c)&&c.8();5 b=a(4)&&4.8(),e,h,i;7(c&&b){i=W;e=b.z;7(e===0)i=J;P 7(e<=c.z){i=J;A(h=-1;++h<e;)7(!d.6(c,b[h])){i=W;K}}}3 i}}(j,v);g.E=2(a){3 2(d,c){3 a.6(d,c)}}(f.E);f.M=2(a){3 2(d){3 a.6(4,d)&&4.T()<d.T()}}(f.E);g.M=2(a){3 2(d,c){3 a.6(d,c)}}(f.M);f.Q=2(a){3 2(d){3 a.6(d,4)}}(f.E);g.Q=2(a){3 2(d,c){3 a.6(d,c)}}(f.Q);f.S=2(a){3 2(d){3 a.6(d,4)}}(f.M);g.S=2(a){3 2(d,c){3 a.6(d,c)}}(f.S);f.R=2(a){3 2(){5 d=B,c=d.z,b=-1,e;7(c>=1)A(e=J;++b<c;){e=a.6(d[b],4);7(!e)K}3 e}}(f.E);g.R=2(a,d){3 2(){5 c=a(B),b=c.1b();3 d.9(b,c)}}(q,f.R);f.H=2(a,d){3 2(){5 c=a(4)&&4.8(),b=B,e=b.z,h=-1,i;7(c){A(;++h<e;){i=b[h];(i=a(i)&&i.8())&&d.9(c,i)}4.y.9(4,c)}3 4}}(j,n.14);g.H=2(a,d){3 2(){3 a.9(w d,B)}}(f.H,g);f.G=2(a,d){3 2(c){5 b=a(4)&&4.8();c=a(c)&&c.8();5 e=-1,h,i;7(b&&c){A(i=b.z;++e<i;){h=d.6(c,b[e]);7(h>=0)c.C(h,1);P{b.C(e,1);--i;--e}}4.y.9(4,b)}3 4}}(j,r);g.G=2(a,d,c){3 2(b,e){5 h=a(b)&&b.8()||[];b=w c;3 d.6(b.y.9(b,h),a(e)&&e||w c)}}(j,f.G,g);f.12=2(a){3 2(d){3 a(4,d).N()}}(g.G);g.12=2(a){3 2(d,c){3 a(d,c).N()}}(g.G);f.L=2(a,d){3 2(c){5 b=a(4)&&4.8();c=a(c)&&c.8();5 e=-1,h,i;7(b&&c){A(i=b.z;++e<i;){h=d.6(c,b[e]);7(h>=0){c.C(h,1);b.C(e,1);--i;--e}}4.y.9(4,b)}3 4}}(j,r);g.L=2(a,d,c){3 2(b,e){5 h=a(b)&&b.8()||[];b=w c;3 d.6(b.y.9(b,h),a(e)&&e||w c)}}(j,f.L,g);f.U=2(a,d,c){3 2(b){5 e=a(4)&&4.8();b=a(b)&&b.8();5 h=-1,i,s;7(e&&b){A(s=e.z;++h<s;){i=d.6(b,e[h]);7(i>=0){b.C(i,1);e.C(h,1);--s;--h}}c.9(e,b);4.y.9(4,e)}3 4}}(j,r,n.14);g.U=2(a,d,c){3 2(b,e){5 h=a(b)&&b.8()||[];b=w c;3 d.6(b.y.9(b,h),a(e)&&e||w c)}}(j,f.U,g);f.I=2(a,d,c){3 2(b){5 e=4,h=a.6(b,e);7(D h=="18")e=w c;P h?d.6(e,b):e.y.6(e);3 e}}(f.E,f.L,g);g.I=2(a,d,c){3 2(b,e){5 h=a(b)&&b.8()||[];b=w c;3 d.6(b.y.9(b,h),a(e)&&e||w c)}}(j,f.I,g);f.19=2(a,d,c){3 2(){3 d.6(4,a.9(w c,B))}}(f.H,f.I,g);g.19=2(a,d,c,b,e){3 2(){5 h=d(B),i=h.1b(),s=a(i)&&i.8()||[];i=w e;3 b.6(i.y.9(i,s),c.9(w e,h))}}(j,q,f.H,f.I,g);f=l=j=16;x f;x l;x j;3 g}();r=v=u=t=q=n=p=m=o=16;x r;x v;x u;x t;x q;x n;x p;x m;x o;x B.1k})(4&&4.10===4&&10||4);',62,88,'||function|return|this|var|call|if|toArray|apply|||||||||||||||||||||||new|delete|compile|length|for|arguments|splice|typeof|isSubsetOf|Array|intersection|merge|relativeComplement|true|break|difference|isRealSubsetOf|isEmptySet|make|else|isSupersetOf|isUniverseOf|isRealSupersetOf|getCardinalNumber|symmetricDifference|idx|false|prototype|the|Set|window|isSet|isDisjoint|valueOf|push|isArray|null|join|undefined|absoluteComplement|indexOf|shift|This|implementation|throw|of|toString|module|detect|base|callee|extensions|presence|requires|object|ReferenceError'.split('|'),0,{}));


*/



(function (global, namespace/*optional*/) {


  if (!global.Array || (typeof global.Array.make != "function") || (typeof global.Array.isArray != "function")) {
    // you might need to check back with: [http://github.com/petsel/javascript-api-extensions/blob/master/core/Array/Array.make.detect.js]
    throw (new ReferenceError("This [[Set]] implementation requires the presence of the [[Array]] extensions module base [Array.make.detect]."));
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



  namespace = (namespace || global); // [[Set]] becomes an implementation either - if provided - of a custom namespace otherwise of the global namespace.



  namespace["Set"] = (function () {


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


  compactedIndexOf = compactedContains = compactList = isArray = makeArray = ArrProto = Arr = global = namespace = null;

  delete compactedIndexOf; delete compactedContains; delete compactList;
  delete isArray; delete makeArray; delete ArrProto; delete Arr;
  delete global; delete namespace;

  delete arguments.callee;
})(((this && (this.window === this) && window) || this)/*global[, custom_namespace]*/);

