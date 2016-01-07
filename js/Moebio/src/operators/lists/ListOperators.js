import List from "src/dataTypes/lists/List";
import ListConversions from "src/operators/lists/ListConversions";
import NumberTable from "src/dataTypes/numeric/NumberTable";
import Table from "src/dataTypes/lists/Table";
import NumberList from "src/dataTypes/numeric/NumberList";
import StringList from "src/dataTypes/strings/StringList";
import NodeList from "src/dataTypes/structures/lists/NodeList";
import StringOperators from "src/operators/strings/StringOperators";
import ColorOperators from "src/operators/graphic/ColorOperators";
import ColorScales from "src/operators/graphic/ColorScales";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
import NumberOperators from "src/operators/numeric/NumberOperators";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import NumberListGenerators from "src/operators/numeric/numberList/NumberListGenerators";
import { typeOf, instantiate, instantiateWithSameType } from "src/tools/utils/code/ClassUtils";

/**
 * @classdesc List Operators
 *
 * @namespace
 * @category basics
 */
function ListOperators() {}
export default ListOperators;


/**
 * gets an element in a specified position from a List
 * @param  {List} list
 *
 * @param  {Number} index
 * @return {Object}
 * tags:
 */
ListOperators.getElement = function(list, index) {
  if(list == null) return null;
  index = index == null ? 0 : index % list.length;
  return list[index];
};

/**
 * multi-ouput operator that gives acces to individual elements
 * @param  {List} list
 *
 * @param  {Number} fromIndex (default 0)
 * @return {Object} first Object
 * @return {Object} second Object
 * @return {Object} third Object
 * @return {Object} fourth Object
 * @return {Object} fifth Object
 * @return {Object} sisxth Object
 * @return {Object} seventh Object
 * @return {Object} eight Object
 * @return {Object} ninth Object
 * @return {Object} tenth Object
 * tags:
 */
ListOperators.getFirstElements = function(list, fromIndex) {
  if(list == null) return null;

  fromIndex = fromIndex == null ? 0 : Number(fromIndex);

  return [
  {
    type: "Object",
    name: "first value",
    description: "first value",
    value: list[fromIndex + 0]
  },
  {
    type: "Object",
    name: "second value",
    description: "second value",
    value: list[fromIndex + 1]
  },
  {
    type: "Object",
    name: "third value",
    description: "third value",
    value: list[fromIndex + 2]
  },
  {
    type: "Object",
    name: "fourth value",
    description: "fourth value",
    value: list[fromIndex + 3]
  },
  {
    type: "Object",
    name: "fifth value",
    description: "fifth value",
    value: list[fromIndex + 4]
  },
  {
    type: "Object",
    name: "sixth value",
    description: "sixth value",
    value: list[fromIndex + 5]
  },
  {
    type: "Object",
    name: "seventh value",
    description: "seventh value",
    value: list[fromIndex + 6]
  },
  {
    type: "Object",
    name: "eight value",
    description: "eight value",
    value: list[fromIndex + 7]
  },
  {
    type: "Object",
    name: "ninth value",
    description: "ninth value",
    value: list[fromIndex + 8]
  },
  {
    type: "Object",
    name: "tenth value",
    description: "tenth value",
    value: list[fromIndex + 9]
  }];
};


/**
* check if two lists contain same elements
* @param {List} list0 first list
* @param {List} list1 second list
* @return {Boolean}
* tags:
*/
ListOperators.containSameElements = function(list0, list1) {
  if(list0==null || list1==null) return null;

  var l = list0.length;
  var i;

  if(l!=list1.length) return;

  for(i=0; i<l; i++){
    if(list0[i]!=list1[i]) return false;
  }

  return true;
};


/**
 * first position of element in list (-1 if element doesn't belong to the list)
 * @param  {List} list
 * @param  {Object} element
 * @return {Number}
 * tags:
 */
ListOperators.indexOf = function(list, element) {
  return list.indexOf(element);
};

/**
 * concats lists
 * @param  {List} list0
 * @param  {List} list1
 *
 * @param  {List} list2
 * @param  {List} list3
 * @param  {List} list4
 * @return {List} list5
 * tags:
 */
ListOperators.concat = function() {
  if(arguments == null || arguments.length === 0 ||  arguments[0] == null) return null;
  if(arguments.length == 1) return arguments[0];

  var i;
  var list = arguments[0].concat(arguments[1]);
  for(i = 2; i<arguments.length; i++) {
    list = list.concat(arguments[i]);
  }
  return list;
};

/**
 * assembles a List
 * @param  {Object} argument0
 *
 * @param  {Object} argument1
 * @param  {Object} argument2
 * @param  {Object} argument3
 * @param  {Object} argument4
 * @return {List}
 * tags:
 */
ListOperators.assemble = function() {
  return List.fromArray(Array.prototype.slice.call(arguments, 0)).getImproved();
};



/**
 * reverses a list
 * @param {List} list
 * @return {List}
 * tags:sorting
 */
ListOperators.reverse = function(list) {
  return list.getReversed();
};

/**
 * @todo write docs
 */
ListOperators.getBooleanDictionaryForList = function(list){
  if(list==null) return;

  var dictionary = {};
  var l = list.length;
  var i;
  for(i=0;i<l;i++){
    dictionary[list[i]] = true;
  }

  return dictionary;
};



/**
 * builds a dictionary that matches an element of a List with its index on the List (indexesDictionary[element] --> index)
 * it assumes there's no repetitions on the list (if that's not tha case the last index of the element will be delivered)
 * efficiently replaces indexOf
 * @param  {List} list
 * @return {Object}
 * tags:dictionary
 */
ListOperators.getSingleIndexDictionaryForList = function(list){
  if(list==null) return;

  var i;
  var l = list.length;

  var dictionary = {};
  for(i=0; i<l; i++){
    dictionary[list[i]] = i;
  }

  return dictionary;
};

/**
 * builds a dictionary that matches an element of a List with all its indexes on the List (indexesDictionary[element] --> numberList of indexes of element on list)
 * if the list has no repeated elements, and a single is required per element, use ListOperators.getSingleIndexDictionaryForList
 * @param  {List} list
 * @return {Object}
 * tags:dictionary
 */
ListOperators.getIndexesDictionary = function(list){
  var indexesDictionary = {};
  var i;
  var l = list.length;

  //list.forEach(function(element, i){
  for(i=0; i<l; i++){
    if(indexesDictionary[list[i]]==null) indexesDictionary[list[i]]=new NumberList();
    indexesDictionary[list[i]].push(i);
  }

  return indexesDictionary;
};

/**
 * @todo write docs
 */
ListOperators.getIndexesTable = function(list){
  var indexesTable = new Table();
  indexesTable[0] = new List();
  indexesTable[1] = new NumberTable();
  var indexesDictionary = {};
  var indexOnTable;

  list.forEach(function(element, i){
    indexOnTable = indexesDictionary[element];
    if(indexOnTable==null){
      indexesTable[0].push(element);
      indexesTable[1].push(new NumberList(i));
      indexesDictionary[element]=indexesTable[0].length-1;
    } else {
      indexesTable[1][indexOnTable].push(i);
    }
  });

  indexesTable[0] = indexesTable[0].getImproved();

  return indexesTable;
};


/**
 * builds a dictionar object (relational array) for a dictionar (table with two lists)
 * @param  {Table} dictionary table with two lists, typically without repetitions, elements of the second list being the 'translation' of the correspdonent on the first
 * @return {Object} relational array
 * tags:
 */
ListOperators.buildDictionaryObjectForDictionary = function(dictionary){
  if(dictionary==null || dictionary.length<2) return;

  var dictionaryObject = {};

  dictionary[0].forEach(function(element, i){
    dictionaryObject[element] = dictionary[1][i];
  });

  return dictionaryObject;
};


/**
 * using a table with two columns as a dictionary (first list elements to be read, second list result elements), translates a list
 * @param  {List} list to transalte
 * @param  {Table} dictionary table with two lists
 *
 * @param {Object} nullElement element to place in case no translation is found
 * @return {List}
 * tags:
 */
ListOperators.translateWithDictionary = function(list, dictionary, nullElement) {
  if(list==null || dictionary==null || dictionary.length<2) return;

  var dictionaryObject = ListOperators.buildDictionaryObjectForDictionary(dictionary);

  var newList = ListOperators.translateWithDictionaryObject(list, dictionaryObject, nullElement);

  newList.dictionaryObject = dictionaryObject;

  return newList;
};


/**
 * creates a new list that is a translation of a list using a dictionar object (a relation array)
 * @param  {List} list
 * @param  {Object} dictionaryObject
 *
 * @param  {Object} nullElement
 * @return {List}
 * tags:
 */
ListOperators.translateWithDictionaryObject = function(list, dictionaryObject, nullElement) {
  if(list==null || dictionaryObject==null) return;

  var newList = new List();
  var i;
  var nElements = list.length;

  for(i=0; i<nElements; i++){
    newList[i] = dictionaryObject[list[i]];
  }

  if(nullElement!=null){
    var l = list.length;
    for(i=0; i<l; i++){
      if(newList[i]==null) newList[i]=nullElement;
    }
  }
  newList.name = list.name;
  return newList.getImproved();
};


/**
 * @todo write docs
 */
ListOperators.sortListByNumberList = function(list, numberList, descending) {
  if(descending == null) descending = true;
  if(numberList.length === 0) return list;

  var pairs = [];
  var newList = instantiate(typeOf(list));
  var i;

  for(i = 0; list[i] != null; i++) {
    pairs.push([list[i], numberList[i], i]);
  }


  if(descending) {
    pairs.sort(function(a, b) {
      //return a[1] < b[1] ?  1 : a[1] > b[1] ? -1 : a[2] - b[2];
      return b[1] - a[1];// < b[1] ?  1 : a[1] > b[1] ? -1 : a[2] - b[2];
    });
  } else {
    pairs.sort(function(a, b) {
      return a[1] - b[1];// ? -1 : a[1] > b[1] ?  1 : a[2] - b[2];
    });
  }

  for(i = 0; pairs[i] != null; i++) {
    newList.push(pairs[i][0]);
  }
  newList.name = list.name;
  return newList;
};


/**
 * calculates the position of elements of a list if it were sorted (rankings)
 * @param  {List} list
 *
 * @param  {Boolean} ascendant if true (default) rankings ara lower for lower values
 * @param {Boolean} randomSortingForEqualElements random sorting for equal elements, so rankings among them will be random
 * @return {NumberList} positions (or ranks) of elements
 * tags:
 */
ListOperators.getRankings = function(list, ascendant, randomSortingForEqualElements){
  if(list==null) return null;
  
  ascendant = ascendant==null?true:ascendant;

  var indexes = NumberListGenerators.createSortedNumberList(list.length);
  indexes = indexes.getSortedByList(list, ascendant, randomSortingForEqualElements);
  var rankings = new NumberList();
  var l = list.length;
  var i;
  for(i=0;i<l; i++){
    rankings[indexes[i]] = i;
  }
  rankings.name = 'rankings';

  return rankings;
};


/**
 * @todo write docs
 */
ListOperators.sortListByIndexes = function(list, indexedArray) {
  var newList = instantiate(typeOf(list));
  newList.name = list.name;
  var nElements = list.length;
  var i;
  for(i = 0; i < nElements; i++) {
    newList.push(list[indexedArray[i]]);
  }
  return newList;
};


/**
 * @todo write docs
 */
ListOperators.concatWithoutRepetitions = function() {
  var l = arguments.length;
  if(l===0) return;
  if(l==1) return arguments[0];

  var i, j;
  var newList = arguments[0].clone();
  var newListBooleanDictionary = ListOperators.getBooleanDictionaryForList(newList);
  var addList;
  var nElements;
  for(i = 1; i < l; i++) {
    addList = arguments[i];
    nElements = addList.length;
    for(j = 0; j < nElements; j++) { // TODO Is the redefing of i intentional? <----- !
      //if(newList.indexOf(addList[i]) == -1) newList.push(addList[i]);
      if(!newListBooleanDictionary[addList[j]]) newList.push(addList[j]);
    }
  }
  return newList.getImproved();
};

/**
 * builds a table: a list of sub-lists from the original list, each sub-list determined size subListsLength, and starting at certain indexes separated by step
 * @param  {List} list
 * @param  {Number} subListsLength length of each sub-list
 * @param  {Number} step slifing step
 * @param  {Number} finalizationMode<br>0:all sub-Lists same length, doesn't cover the List<br>1:last sub-List catches the last elements, with lesser length<br>2:all lists same length, last sub-list migth contain elements from the beginning of the List
 * @return {Table}
 * tags:
 */
ListOperators.slidingWindowOnList = function(list, subListsLength, step, finalizationMode) {
  finalizationMode = finalizationMode || 0;
  var table = new Table();
  var newList;
  var nElements = list.length;
  var i;
  var j;

  step = Math.max(1, step);

  switch(finalizationMode) {
    case 0: //all sub-Lists same length, doesn't cover the List
      for(i = 0; i < nElements; i += step) {
        if(i + subListsLength <= nElements) {
          newList = new List();
          for(j = 0; j < subListsLength; j++) {
            newList.push(list[i + j]);
          }
          table.push(newList.getImproved());
        }
      }
      break;
    case 1: //last sub-List catches the last elements, with lesser length
      for(i = 0; i < nElements; i += step) {
        newList = new List();
        for(j = 0; j < Math.min(subListsLength, nElements - i); j++) {
          newList.push(list[i + j]);
        }
        table.push(newList.getImproved());
      }
      break;
    case 2: //all lists same length, last sub-list migth contain elements from the beginning of the List
      for(i = 0; i < nElements; i += step) {
        newList = new List();
        for(j = 0; j < subListsLength; j++) {
          newList.push(list[(i + j) % nElements]);
        }
        table.push(newList.getImproved());
      }
      break;
  }

  return table.getImproved();
};

/**
 * @todo write docs
 */
ListOperators.getNewListForObjectType = function(object) {
  var newList = new List();
  newList[0] = object;
  return instantiateWithSameType(newList.getImproved());
};


/*
deprectaed, use intersection instead
 */
// ListOperators.listsIntersect = function(list0, list1) {
//   var list = list0.length < list1.length ? list0 : list1;
//   var otherList = list0 == list ? list1 : list0;
//   for(var i = 0; list[i] != null; i++) {
//     if(otherList.indexOf(list[i]) != -1) return true;
//   }
//   return false;
// };


/**
 * creates a List that contains the union of two List (removing repetitions)
 * @param  {List} list0 first list
 * @param  {List} list1 second list
 * @return {List} the union of both Lists
 * tags:
 */
ListOperators.union = function(list0, list1) {//TODO:expand for more lists
  if(list0==null || list1==null) return;

  var union = new List();
  var l0 = list0.length;
  var l1 = list1.length;
  var i, k;

  if(list0.type=='NodeList' || list1.type=='NodeList'){
    union = new NodeList();
    union = list0.clone();
    for(i = 0; i<l1; i++){
      if(list0.getNodeById(list1[i].id)==null) union.addNode(list1[i]);
    }
    return union;
  }

  var obj = {};

  for(i = 0; i<l0; i++) obj[list0[i]] = list0[i];
  for(i = 0; i<l1; i++) obj[list1[i]] = list1[i];
  
  for(k in obj) {
    //if(obj.hasOwnProperty(k)) // <-- optional
    union.push(obj[k]);
  }
  return union.getImproved();
};

/**
 * creates a List that contains the intersection of two List (elements present in BOTH lists, result without repetions)
 * @param  {List} list0 first list
 * @param  {List} list1 second list
 * @return {List} intersection of both lists
 * tags:
 */
ListOperators.intersection = function(list0, list1) {//TODO:expand for more lists
  if(list0==null || list1==null) return;

  var intersection;
  //var l0  = list0.length;
  var l1  = list1.length;
  var i;
  var element;

  if(list0.type=="NodeList" && list1.type=="NodeList"){
    intersection = new NodeList();

    list0.forEach(function(node){
      if(list1.getNodeById(node.id)){
        intersection.addNode(node);
      }
    });

    return intersection;
  }

  var dictionary =  ListOperators.getBooleanDictionaryForList(list0);//{};
  var dictionaryIntersected = {};
  
  intersection = new List();


  // list0.forEach(function(element){
  //   dictionary[element] = true;
  // });
  //list1.forEach(function(element){
  for(i=0; i<l1; i++){
    element = list1[i];
    if(dictionary[element] && dictionaryIntersected[element]==null){
      dictionaryIntersected[element]=true;
      intersection.push(element);
    }
  }
  //});
  return intersection.getImproved();
};


/**
 * returns the list of common elements between two lists (deprecated, use intersection instead)
 * @param  {List} list0
 * @param  {List} list1
 * @return {List}
 */
// ListOperators.getCommonElements = function(list0, list1) {
//   var nums = list0.type == 'NumberList' && list1.type == 'NumberList';
//   var strs = list0.type == 'StringList' && list1.type == 'StringList';
//   var newList = nums ? new NumberList() : (strs ? new StringList() : new List());

//   var list = list0.length < list1.length ? list0 : list1;
//   var otherList = list0 == list ? list1 : list0;

//   for(var i = 0; list[i] != null; i++) {
//     if(otherList.indexOf(list[i]) != -1) newList.push(list[i]);
//   }
//   if(nums || strs) return newList;
//   return newList.getImproved();
// };


/**
 * calculates Jaccard index |list0 ∩ list1|/|list0 ∪ list1| see: https://en.wikipedia.org/wiki/Jaccard_index
 * @param  {List} list0
 * @param  {List} list1
 * @return {Number}
 * tags:
 */
ListOperators.jaccardIndex = function(list0, list1) {//TODO: see if this can be more efficient, maybe one idctionar for doing union and interstection at the same time
  return ListOperators.intersection(list0, list1).length/ListOperators.union(list0, list1).length;
};

/**
 * calculates Jaccard distance 1 - |list0 ∩ list1|/|list0 ∪ list1| see: https://en.wikipedia.org/wiki/Jaccard_index
 * @param  {List} list0
 * @param  {List} list1
 * @return {Number}
 * tags:
 */
ListOperators.jaccardDistance = function(list0, list1) {
  return 1 - ListOperators.jaccardIndex(list0, list1);
};



/**
 * aggregates values of a list using an aggregator list as reference
 *
 * @param  {List} aggregatorList aggregator list that typically contains several repeated elements
 * @param  {List} toAggregateList list of elements that will be aggregated
 * @param  {Number} mode aggregation modes:<br>0:first element<br>1:count (default)<br>2:sum<br>3:average<br>4:min<br>5:max<br>6:standard deviation<br>7:enlist (creates a list of elements)<br>8:last element<br>9:most common element<br>10:random element<br>11:indexes<br>12:count non repeated elements<br>13:enlist non repeated elements<br>14:concat elements (for strings, uses ', ' as separator)<br>15:concat non-repeated elements
 * @param  {Table} indexesTable optional already calculated table of indexes of elements on the aggregator list (if not provided, the method calculates it)
 * @return {Table} contains a list with non repeated elements on the first list, and the aggregated elements on a second list
 * tags:
 */
ListOperators.aggregateList = function(aggregatorList, toAggregateList, mode, indexesTable){
  if(aggregatorList==null || toAggregateList==null) return null;
  var table = new Table();

  if(indexesTable==null) indexesTable = ListOperators.getIndexesTable(aggregatorList);

  if(mode==11) return indexesTable;

  table[0] = indexesTable[0];

  if(mode===0 && aggregatorList==toAggregateList){
    table[1] = indexesTable[0];
    return table;
  }

  mode = mode==null?0:mode;

  var list;
  var elementsTable;
  var nIndexes = indexesTable[1].length;
  var indexes;
  var index;
  var elements;
  var i, j;

  switch(mode){
    case 0://first element
      table[1] = new List();
      //indexesTable[1].forEach(function(indexes){
      for(i=0; i<nIndexes; i++){
        indexes = indexesTable[1][i];
        table[1].push(toAggregateList[indexes[0]]);
      }
      table[1] = table[1].getImproved();
      return table;
    case 1://count
      table[1] = new NumberList();
      //indexesTable[1].forEach(function(indexes){
      for(i=0; i<nIndexes; i++){
        indexes = indexesTable[1][i];
        table[1].push(indexes.length);
      }
      return table;
    case 2://sum
    case 3://average
      var sum;
      table[1] = new NumberList();
      //indexesTable[1].forEach(function(indexes){
      for(i=0; i<nIndexes; i++){
        indexes = indexesTable[1][i];
        sum = 0;
        //indexes.forEach(function(index){
        for(j=0; j<indexes.length; j++){
          index = indexes[j];
          sum+=toAggregateList[index];
        }
        if(mode==3) sum/=indexes.length;
        table[1].push(sum);
      }
      return table;
    case 4://min
      var min;
      table[1] = new NumberList();
      //indexesTable[1].forEach(function(indexes){
      for(i=0; i<nIndexes; i++){
        indexes = indexesTable[1][i];
        min = 99999999999;
        //indexes.forEach(function(index){
        for(j=0; j<indexes.length; j++){
          index = indexes[j];
          min=Math.min(min, toAggregateList[index]);
        }
        table[1].push(min);
      }
      return table;
    case 5://max
      var max;
      table[1] = new NumberList();
      //indexesTable[1].forEach(function(indexes){
      for(i=0; i<nIndexes; i++){
        indexes = indexesTable[1][i];
        max = -99999999999;
        //indexes.forEach(function(index){
        for(j=0; j<indexes.length; j++){
          index = indexes[j];
          max=Math.max(max, toAggregateList[index]);
        }
        table[1].push(max);
      }
      return table;
    case 6://standard deviation
      var average;
      table = ListOperators.aggregateList(aggregatorList, toAggregateList, 3, indexesTable);
      //indexesTable[1].forEach(function(indexes){
      for(i=0; i<nIndexes; i++){
        indexes = indexesTable[1][i];
        sum = 0;
        average = table[1][i];
        //indexes.forEach(function(index){
        for(j=0; j<indexes.length; j++){
          index = indexes[j];
          sum += Math.pow(toAggregateList[index] - average, 2);
        }
        table[1][i] = Math.sqrt(sum/indexes.length);
      }
      return table;
    case 7://enlist
      table[1] = new Table();
      //indexesTable[1].forEach(function(indexes){
      for(i=0; i<nIndexes; i++){
        indexes = indexesTable[1][i];
        list = new List();
        table[1].push(list);
        //indexes.forEach(function(index){
        for(j=0; j<indexes.length; j++){
          index = indexes[j];
          list.push(toAggregateList[index]);
        }
        list = list.getImproved();
      }
      return table.getImproved();
    case 8://last element
      table[1] = new List();
      //indexesTable[1].forEach(function(indexes){
      for(i=0; i<nIndexes; i++){
        indexes = indexesTable[1][i];
        table[1].push(toAggregateList[indexes[indexes.length-1]]);
      }
      table[1] = table[1].getImproved();
      return table;
    case 9://most common
      table[1] = new List();
      elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
      //elementsTable[1].forEach(function(elements){
      for(i=0;i<elementsTable[1].length;i++){
        table[1].push(elements.getMostRepeatedElement());
      }
      table[1] = table[1].getImproved();
      return table;
    case 10://random
      table[1] = new List();
      //indexesTable[1].forEach(function(indexes){
      for(i=0; i<nIndexes; i++){
        indexes = indexesTable[1][i];
        table[1].push( toAggregateList[indexes[ Math.floor(Math.random()*indexes.length) ]] );
      }
      table[1] = table[1].getImproved();
      return table;
    case 11://indexes (returned previosuly)
      break;
    case 12://count non repeated
      table[1] = new NumberList();
      elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
      //elementsTable[1].forEach(function(elements){
      for(i=0;i<elementsTable[1].length;i++){
        elements = elementsTable[1][i];
        table[1].push(elements.getWithoutRepetitions().length);
      }
      return table;
    case 13://enlist non repeated
      table[1] = new List();
      elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
      //elementsTable[1].forEach(function(elements){
      for(i=0;i<elementsTable[1].length;i++){
        elements = elementsTable[1][i];
        table[1].push(elements.getWithoutRepetitions());
      }
      table[1] = table[1].getImproved();
      return table;
    case 14://concat string
      table[1] = new StringList();
      elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
      //elementsTable[1].forEach(function(elements){
      for(i=0;i<elementsTable[1].length;i++){
        elements = elementsTable[1][i];
        table[1].push( elements.join(', ') );
      }
      return table;
    case 15://concat string non repeated
      table[1] = new StringList();
      elementsTable = ListOperators.aggregateList(aggregatorList, toAggregateList, 7, indexesTable);
      //elementsTable[1].forEach(function(elements){
      for(i=0;i<elementsTable[1].length;i++){
        elements = elementsTable[1][i];
        table[1].push( elements.getWithoutRepetitions().join(', ') );
      }
      return table;
  }

  return null;
};

/**
 * Analyses wether two lists are categorical identical, one is subcategorical to the other, or there's no relation
 * @param  {List} list0
 * @param  {List} list1
 * @return {Number} 0:no relation, 1:categorical identical, 2:list0 subcategorical to list1, 3:list1 subcategorical to list0
 * tags:
 */
ListOperators.subCategoricalAnalysis = function(list0, list1){
  if(list0==null || list1==null) return;

  var dictionary = {};
  var element, projection;
  var i;
  var list0SubCategorical = true;
  for(i=0; list0[i]!=null; i++){
    element = list0[i];
    projection = dictionary[element];
    if(projection==null){
      dictionary[element] = list1[i];
    } else if(projection!=list1[i]){
      list0SubCategorical = false;
      break;
    }
  }

  dictionary = {};
  var list1SubCategorical = true;
  for(i=0; list1[i]!=null; i++){
    element = list1[i];
    projection = dictionary[element];
    if(projection==null){
      dictionary[element] = list0[i];
    } else if(projection!=list0[i]){
      list1SubCategorical = false;
      break;
    }
  }

  if(list1SubCategorical && list0SubCategorical) return 1;
  if(list0SubCategorical) return 2;
  if(list1SubCategorical) return 3;
  return 0;
};

/**
 * calculates de entropy of a list, properties _mostRepresentedValue and _biggestProbability are added to the list
 * @param  {List} list with repeated elements (actegorical list)
 *
 * @param {Object} valueFollowing if a value is provided, the property _P_valueFollowing will be added to the list, with proportion of that value in the list
 * @param {Table} freqTable for saving time, in case the frequency table with sorted elements has been already calculated (with list.getFrequenciesTable(true))
 * @return {Number}
 * tags:statistics
 */
ListOperators.getListEntropy = function(list, valueFollowing, freqTable) {
  if(list == null) return;

  if(list.length < 2) {
    if(list.length == 1) {
      list._mostRepresentedValue = list[0];
      list._biggestProbability = 1;
      if(valueFollowing != null) list._P_valueFollowing = list[0] == valueFollowing ? 1 : 0;
    } else {
      if(valueFollowing != null) list._P_valueFollowing = 0;
    }
    return 0;
  }

  if(freqTable==null) freqTable = list.getFrequenciesTable(true);// ListOperators.countElementsRepetitionOnList(list, true);

  list._mostRepresentedValue = freqTable[0][0];
  var N = list.length;
  list._biggestProbability = freqTable[1][0] / N;
  if(freqTable[0].length == 1) {
    list._P_valueFollowing = list[0] == valueFollowing ? 1 : 0;
    return 0;
  }
  var entropy = 0;

  var norm = Math.log(freqTable[0].length);
  var l = freqTable[1].length;
  var i;
  var val;
  for(i=0; i<l; i++){
    val = freqTable[1][i];
    entropy -= (val / N) * Math.log(val / N) / norm;
  }

  //set: {*,*,*,°,°,°,X,X,X}
  //N=9
  //norm=3
  // -(3/9)*log(3/9)/3 -(3/9)*log(3/9)/3 -(3/9)*log(3/9)/3 
  // -(3/9)*log(3/9)
  // -(1/3)*log(1/3)
  // 0.366… (is something wrong?) @todo: check this entropy algebra

  // freqTable[1].forEach(function(val) {
  //   entropy -= (val / N) * Math.log(val / N) / norm;
  // });

  if(valueFollowing != null) {
    var index = freqTable[0].indexOf(valueFollowing);
    list._P_valueFollowing = index == -1 ? 0 : freqTable[1][index] / N;
  }
  return entropy;
};


/**
 * measures how much a feature decreases entropy when segmenting by its values by a supervised variable
 * @param  {List} feature
 * @param  {List} supervised
 * @return {Number}
 * tags:ds
 */
ListOperators.getInformationGain = function(feature, supervised) {
  if(feature == null || supervised == null || feature.length != supervised.length) return null;

  var ig = ListOperators.getListEntropy(supervised);
  var childrenObject = {};
  var childrenLists = [];
  var N = feature.length;

  feature.forEach(function(element, i) {
    if(childrenObject[element] == null) {
      childrenObject[element] = new List();
      childrenLists.push(childrenObject[element]);
    }
    childrenObject[element].push(supervised[i]);
  });

  childrenLists.forEach(function(cl) {
    ig -= (cl.length / N) * ListOperators.getListEntropy(cl);
  });

  return ig;
};

/**
 * @todo write docs
 */
ListOperators.getInformationGainAnalysis = function(feature, supervised) {
  if(feature == null || supervised == null || feature.length != supervised.length) return null;

  var ig = ListOperators.getListEntropy(supervised);
  var childrenObject = {};
  var childrenLists = [];
  var N = feature.length;
  var entropy;
  var sets = new List();

  feature.forEach(function(element, i) {
    if(childrenObject[element] == null) {
      childrenObject[element] = new List();
      childrenLists.push(childrenObject[element]);
    }
    childrenObject[element].push(supervised[i]);
  });

  childrenLists.forEach(function(cl) {
    entropy = ListOperators.getListEntropy(cl);
    ig -= (cl.length / N) * entropy;

    sets.push({
      children: cl,
      entropy: entropy,
      infoGain: ig
    });
  });

  return sets;
};


/**
 * Takes a List and returns its elements grouped by identic value. Each list in the table is assigned a "valProperty" value which is used for sorting
 * @param  {List} list of elements to group
 * @param  {Boolean} whether the results are to be sorted or not
 * @param  {Number} mode: 0 for returning original values, 1 for indices in original list
 *
 * @param  {Boolean} fillBlanks: whether to fill missing slots or not (if data is sequential)
 * @return {Table}
 * tags:dani
 */
ListOperators.groupElements = function(list, sortedByValue, mode, fillBlanks) {
  if(!list)
    return;
  var result = ListOperators._groupElements_Base(list, null, sortedByValue, mode, fillBlanks);
  return result;
};


/**
 * Takes a List and returns its elements grouped by identic value. Each list in the table is assigned a "valProperty" value which is used for sorting
 * @param  {List} list of elements to group
 * @param  {String} name of the property to be used for grouping
 * @param  {Boolean} wether the results are to be sorted or not
 * @param  {Number} mode: 0 for returning original values, 1 for indices in original list
 *
 * @param  {Boolean} fillBlanks: whether to fill missing slots or not (if data is sequential)
 * @return {Table}
 * tags:dani
 */
ListOperators.groupElementsByPropertyValue = function(list, propertyName, sortedByValue, mode, fillBlanks) {
  if(!list)
    return;
  var result = ListOperators._groupElements_Base(list, propertyName, sortedByValue, mode, fillBlanks);
  return result;
};



/**
 * @ignore
 */
ListOperators._groupElements_Base = function(list, propertyName, sortedByValue, mode, fillBlanks) {
  if(!list)
    return;
  if(mode == undefined){
    mode = 0;
  }
  var resultOb = {};
  var resultTable = new Table();
  var pValue, item, minValue, maxValue, i;
  for(i = 0; i < list.length; i++) {
    item = list[i];
    pValue = propertyName == undefined ? item : item[propertyName];
    if(resultOb[pValue] === undefined) {
      resultOb[pValue] = new List();
      resultOb[pValue].name = pValue;
      resultOb[pValue].valProperty = pValue;
      resultTable.push(resultOb[pValue]);
    }
    if(mode === 0)
      resultOb[pValue].push(item);
    else if(mode == 1)
      resultOb[pValue].push(i);
    // Update boundaries
    if(minValue === undefined || pValue < minValue) {
      minValue = pValue;
    }
    if(maxValue === undefined || pValue > maxValue) {
      maxValue = pValue;
    }
  }

  // Fill the blanks
  if(fillBlanks) {
    var numBlanks = 0;
    for(i = minValue; i < maxValue; i++) {
      if(resultOb[i] === undefined) {
        resultOb[i] = new List();
        resultOb[i].name = i;
        resultOb[i].valProperty = i;
        resultTable.push(resultOb[i]);
        numBlanks++;
      }
    }
    //console.log("numBlanks: ", numBlanks)
  }

  // To-do: looks like getSortedByProperty is removing the valProperty from the objects
  if(sortedByValue)
    resultTable = resultTable.getSortedByProperty("name"); // "valProperty"

  return resultTable;

};

/**
 * returns a string representing list
 *
 * @param  {List} list
 * @param  {Number} level
 *
 */
ListOperators.getReport = function(list, level) { //TODO:complete
  var ident = "\n" + (level > 0 ? StringOperators.repeatString("  ", level) : "");
  var text = level > 0 ? (ident + "////report of instance of List////") : "///////////report of instance of List//////////";

  var length = list.length;
  var i;

  text += ident + "name: " + list.name;
  text += ident + "type: " + list.type;

  if(length === 0) {
    text += ident + "single element: [" + list[0] + "]";
    return text;
  } else {
    text += ident + "length: " + length;
    text += ident + "first element: [" + list[0] + "]";
  }

  switch(list.type) {
    case "NumberList":
      var min = list.getMin();
      var max = list.getMax();
      list.min = min;
      list.max = max;
      var average = list.getAverage();//(min + max) * 0.5;
      list.average = average;
      text += ident + "min: " + min;
      text += ident + "max: " + max;
      text += ident + "average: " + average;
      if(length < 101) {
        text += ident + "numbers: " + list.join(", ");
      }
      break;
    case "StringList":
    case "List":
    case "ColorList":
      var freqTable = list.getFrequenciesTable(true);
      list._freqTable = freqTable;
      text += ident + "number of different elements: " + freqTable[0].length;
      if(freqTable[0].length < 10) {
        text += ident + "elements frequency:";
      } else {
        text += ident + "some elements frequency:";
      }

      for(i = 0; freqTable[0][i] != null && i < 10; i++) {
        text += ident + "  [" + String(freqTable[0][i]) + "]: " + freqTable[1][i];
      }

      var joined;
      if(list.type == "List") {
        joined = list.join("], [");
      } else {
        joined = ListConversions.toStringList(list).join("], [");
      }

      if(joined.length < 2000) text += ident + "strings: [" + joined + "]";
      break;

  }

  ///add ideas to: analyze, visualize


  return text;
};


ListOperators.getReportHtml = function(list, level) { //TODO:complete
  var ident = "<br>" + (level > 0 ? StringOperators.repeatString("&nbsp", level) : "");
  var text =  level > 0 ? "" : "<b><font style=\"font-size:18px\">list report</f></b>";

  var length = list.length;
  var i;

  if(list.name){
    text += ident + "name: <b>" + list.name + "</b>";
  } else {
    text += ident + "<i>no name</i>";
  }
  text += ident + "type: <b>" + list.type + "</b>";

  if(length === 0) {
    text += ident + "single element: [<b>" + list[0] + "</b>]";
    return text;
  } else {
    text += ident + "length: <b>" + length + "</b>";
    text += ident + "first element: [<b>" + list[0] + "</b>]";
  }

  switch(list.type) {
    case "NumberList":
      var min = 9999999;
      var max = -9999999;
      var average = 0;
      var shorten = new NumberList();
      var index = 0;
      var accumsum = 0;
      var maxAccumsum = -99999;
      var sizeAccum = Math.max(Math.floor(list.length/50), 1);

      list.forEach(function(val){
        min = Math.min(min, val);
        max = Math.max(max, val);
        average += val;
        accumsum += val;
        index++;
        if(index==sizeAccum){
          accumsum /= index;
          maxAccumsum = Math.max(maxAccumsum, accumsum);
          shorten.push(accumsum);
          accumsum=0;
          index=0;
        }
      });
      if(index !== 0){
          accumsum /=index;
          maxAccumsum = Math.max(maxAccumsum, accumsum);
          shorten.push(accumsum);
      }

      shorten = shorten.factor(1/maxAccumsum);

      average /= list.length;

      list.min = min;
      list.max = max;
      list.average = average;
      text += ident + "min: <b>" + min + "</b>";
      text += ident + "max: <b>" + max + "</b>";
      text += ident + "average: <b>" + average + "</b>";
      if(length < 101) {
        text += ident + "numbers: <b>" + list.join("</b>, <b>") + "</b>";
      }
      text += ident;
      for(i=0; shorten[i]!=null; i++){
        text += "<font style=\"font-size:7px\"><font color=\""+ColorOperators.colorStringToHEX(ColorScales.grayToOrange(shorten[i]))+"\">█</f></f>";
      }
      break;
    case "StringList":
    case "List":
    case "ColorList":
      var freqTable = list.getFrequenciesTable(true);
      list._freqTable = freqTable;
      var catColors = ColorListGenerators.createCategoricalColors(2, freqTable[0].length);

      text += ident + "entropy: <b>" + NumberOperators.numberToString(ListOperators.getListEntropy(list, null, freqTable), 4) + "</b>";

      text += ident + "number of different elements: <b>" + freqTable[0].length + "</b>";
      if(freqTable[0].length < 10) {
        text += ident + "elements frequency:";
      } else {
        text += ident + "some elements frequency:";
      }

      for(i = 0; freqTable[0][i] != null && i < 10; i++) {
        text += ident + "  [<b>" + String(freqTable[0][i]) + "</b>]: <font style=\"font-size:10px\"><b><font color=\""+ColorOperators.colorStringToHEX(catColors[i])+"\">" + freqTable[1][i] + "</f></b></f>";
      }

      var joined;
      if(list.type == "List") {
        joined = list.join("], [");
      } else {
        joined = ListConversions.toStringList(list).join("], [");
      }

      if(joined.length < 2000) text += ident + "contents: [" + joined + "]";

      var weights = NumberListOperators.normalizedToSum(freqTable[1]);

      var bars = StringOperators.createsCategoricalColorsBlocksHtml(weights, 55, catColors);
      text += ident;
      text += "<font style=\"font-size:7px\">"+bars+"</f>";

      break;
  }


  ///add ideas to: analyze, visualize
  return text;
};

