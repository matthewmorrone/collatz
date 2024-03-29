import StringList from "src/dataTypes/strings/StringList";
import NumberList from "src/dataTypes/numeric/NumberList";
import NumberTable from "src/dataTypes/numeric/NumberTable";
import StringOperators from "src/operators/strings/StringOperators";
import ListGenerators from "src/operators/lists/ListGenerators";
import TableOperators from "src/operators/lists/TableOperators";
import Network from "src/dataTypes/structures/networks/Network";
import Relation from "src/dataTypes/structures/elements/Relation";
import Node from "src/dataTypes/structures/elements/Node";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import Table from "src/dataTypes/lists/Table";


/**
 * @classdesc  StringList Operators
 *
 * @namespace
 * @category strings
 */
function StringListOperators() {}
export default StringListOperators;

/**
 * receives n arguments and performs addition
 */
StringListOperators.concatStrings = function(stringList, joinString) { //deprecated
  if(joinString == null) joinString = "";
  return StringList.fromArray(stringList.join(joinString));
};

/**
 * join strings with a character
 * @param  {StringList} StringList strings to be joined
 *
 * @param  {String} join character
 * @param  {String} prefix
 * @param  {String} sufix
 * @return {String}
 * tags:
 */
StringListOperators.join = function(stringList, character, prefix, sufix) {
  if(stringList == null) return;

  character = character == null ? "" : character;
  prefix = prefix == null ? "" : prefix;
  sufix = sufix == null ? "" : sufix;
  return prefix + stringList.join(character) + sufix;
};


/**
 * filters a StringList by a string
 * @param  {StringList} stringList    to be filtered
 * @param  {String} string        filter criteria (string or word that will be search in each string of the stringList)
 *
 * @param  {Boolean} asWord        if true a word (string surrounded by separators such as space or punctuation) will be used as criteria, false by default
 * @param  {Boolean} returnIndexes if true a numberList with indexes will be returned, instead of a stringList
 * @return {List}               stringList or numberlist with filtered strings or indexes
 * tags:filter
 */
StringListOperators.filterStringListByString = function(stringList, string, asWord, returnIndexes) {
  if(stringList==null || string==null) return null;

  var i;
  var newList = returnIndexes ? new NumberList() : new StringList();
  var regex;
  var l = stringList.length;

  if(asWord) {
    regex = new RegExp("\\b" + string + "\\b");
  }

  for(i = 0; i<l; i++) {
    if(asWord) {
      if(stringList[i].match(regex).length > 0) {
        newList.push(returnIndexes ? i : stringList[i]);
      }
    } else {
      if(stringList[i].indexOf(string) != -1) {
        newList.push(returnIndexes ? i : stringList[i]);
      }
    }
  }
  
  return newList;
};

/**
 * replaces in each string, a sub-string by a string
 * @param  {StringList} texts  where to replace strings
 * @param  {StringList} strings to be replaced (could be Regular Expressions)
 * @param  {String} replacement string to be placed instead
 * @return {StringList}
 * tags:
 */
StringListOperators.replaceStringsInTexts = function(texts, strings, replacement) {
  if(texts==null || strings==null || replacement==null) return null;

  var newTexts = new StringList();
  newTexts.name = texts.name;
  var nTexts = texts.length;
  var nStrings = strings.length;
  var i, j;
  var string;

  for(i = 0; i<nTexts; i++) {
    newTexts[i] = texts[i];
    for(j=0; j<nStrings; j++){
      string = strings[j];
      if(!(string instanceof RegExp)) string = new RegExp(string, "g");
      newTexts[i] = newTexts[i].replace(string, replacement);
    }
  }

  return newTexts;
};

/**
 * replaces in each string, a sub-string by a string
 * @param  {StringList} stringList  StringList to work on.
 * @param  {String} string to be replaced (could be Regular Expression)
 * @param  {String} replacement string to be placed instead
 * @return {StringList}
 * tags:
 */
StringListOperators.replaceStringInTexts = function(texts, string, replacement) {
  if(texts==null || string==null || replacement==null) return null;

  if(!(string instanceof RegExp)) string = new RegExp(string, "g");

  var newTexts = new StringList();
  newTexts.name = texts.name;
  var nTexts = texts.length;
  var i;

  for(i = 0; i<nTexts; i++) {
    newTexts[i] = texts[i].replace(string, replacement);
  }

  return newTexts;
};

/**
 * replaces in each string, a sub-string by a string
 * @param  {StringList} texts  where to replace strings
 * @param  {StringList} strings to be replaced (could be Regular Expressions)
 * @param  {StringList} replacements strings to be placed instead (should have same length as strings)
 * @return {StringList}
 * tags:
 */
StringListOperators.replaceStringsInTextsByStrings = function(texts, strings, replacements) {
  if(texts==null || strings==null || replacements==null) return null;

  var newTexts = new StringList();
  newTexts.name = texts.name;
  var nTexts = texts.length;
  var nStrings = strings.length;
  var i, j;
  var string;

  for(i = 0; i<nTexts; i++) {
    newTexts[i] = texts[i];
    for(j=0; j<nStrings; j++){
      string = strings[j];
      if(!(string instanceof RegExp)) string = new RegExp(string, "g");
      newTexts[i] = newTexts[i].replace(string, replacements[j]);
    }
  }

  return newTexts;
};




// var regex = new RegExp("\\b"+word+"\\b");
// var match = string.match(regex);
// return match==null?0:match.length;

/*
 * a classic function, but now it works with patterns!
 */
/**
 * @todo finish docs
 */

/**
* finds strings from a list in strings in another list (typically the strings in the first list are short, and in the second longer texts)
* @param {StringList} list of strings or list of Regular Expressions
* @param {StringList} list of texts were to search
*
* @param {Boolean} asWords if false (default) searches substrings, if true searches words
* @return {NumberTable} matrix of results, each column being the vector of occurrences for each string
* tags:count
*/
StringListOperators.countStringsOccurrencesOnTexts = function(strings, texts, asWords) {
  var occurrencesTable = new NumberTable();

  var i;
  var j;
  var string;
  var numberList;
  //var splitArray;
  var nStrings = strings.length;
  var nTexts = texts.length;
  var wordRegex;

  for(i = 0; i<nStrings; i++) {
    string = strings[i];
    wordRegex = new RegExp("\\b" + string + "\\b");
    numberList = new NumberList();
    numberList.name = string;
    for(j = 0; j<nTexts; j++) {
      if(asWords){
        numberList[j] = StringOperators.countRegexOccurrences(texts[j], wordRegex);
      } else {
        numberList[j] = StringOperators.countOccurrences(texts[j], string);
      }
    }
    occurrencesTable[i] = numberList;
  }
  return occurrencesTable;
};

/**
 * builds a table with a list of occurrent words and numberLists for occurrences in each string
 * @param  {StringList} strings
 *
 * @param  {StringList} stopWords words to be excluded from the list
 * @param  {Boolean} includeLinks
 * @param  {Number} wordsLimitPerString number of words extracted per string
 * @param  {Number} totalWordsLimit final number of words
 * @param  {Boolean} normalize normalize lists to sum
 * @param {Boolean} stressUniqueness divide number of occurrences in string by total number of occurrences (words that appear in one or only few texts become more weighed)
 * @param {Boolean} sortByTotalWeight sort all columns by total weights of words
 * @param  {Number} minSizeWords
 * @return {Table}
 * tags:count
 */
StringListOperators.getWordsOccurrencesMatrix = function(strings, stopWords, includeLinks, wordsLimitPerString, totalWordsLimit, normalize, stressUniqueness, sortByTotalWeight, minSizeWords) {
  if(strings == null) return;

  var i;
  var matrix;

  wordsLimitPerString = wordsLimitPerString || 500;
  totalWordsLimit = totalWordsLimit || 1000;
  normalize = normalize == null ? true : normalize;
  stressUniqueness = stressUniqueness || false;
  sortByTotalWeight = (sortByTotalWeight || true);
  minSizeWords = minSizeWords == null ? 3 : minSizeWords;

  if(strings[0]==""){
    matrix = new Table();
    matrix.push(new StringList(""));
    matrix.push(new NumberList(0));
    console.log('-.-');
  } else {
    matrix = StringOperators.getWordsOccurrencesTable(strings[0], stopWords, includeLinks, wordsLimitPerString, minSizeWords);
  }


  var table;
  var nStrings = strings.length;
  for(i = 1; i<nStrings; i++) {
    console.log('strings[i]:['+strings[i]+']');

    if(strings[i]==""){
      matrix.push(ListGenerators.createListWithSameElement(matrix[0].length, 0));
      console.log('-.-');
    } else {
      table = StringOperators.getWordsOccurrencesTable(strings[i], stopWords, includeLinks, wordsLimitPerString, minSizeWords);
      matrix = TableOperators.mergeDataTables(matrix, table);
    }
  }


  if(matrix[0].length > totalWordsLimit) sortByTotalWeight = true;

  if(stressUniqueness || sortByTotalWeight) {
    var totalList = new NumberList();
    totalList = matrix[1].clone();
    matrix.forEach(function(occurrences, i) {
      if(i < 2) return;
      occurrences.forEach(function(value, j) {
        totalList[j] += value;
      });
    });

    if(stressUniqueness) {
      matrix.forEach(function(occurrences, i) {
        if(i === 0) return;
        occurrences.forEach(function(value, j) {
          occurrences[j] = value / totalList[j];
        });
      });
    }

    if(sortByTotalWeight) {
      matrix = matrix.getListsSortedByList(totalList, false);
    }
  }

  if(normalize) {
    matrix.forEach(function(occurrences, i) {
      if(i === 0) return;
      matrix[i] = NumberListOperators.normalizedToSum(matrix[i]);
    });
  }


  if(totalWordsLimit > 0) matrix = matrix.sliceRows(0, totalWordsLimit - 1);

  return matrix;
};

//good approach for few large texts, to be tested
/**
 * @todo finish docs
 */
StringListOperators.createTextsNetwork = function(texts, stopWords, stressUniqueness, relationThreshold) {
  var i, j;
  var network = new Network();

  var matrix = StringListOperators.getWordsOccurrencesMatrix(texts, stopWords, false, 600, 800, false, true, false, 3);

  texts.forEach(function(text, i) {
    var node = new Node("_" + i, "_" + i);
    node.content = text;
    node.wordsWeights = matrix[i + 1];
    network.addNode(node);
  });

  for(i = 0; network.nodeList[i + 1] != null; i++) {
    var node = network.nodeList[i];
    for(j = i + 1; network.nodeList[j] != null; j++) {
      var node1 = network.nodeList[j];

      var weight = NumberListOperators.cosineSimilarity(node.wordsWeights, node1.wordsWeights);

      if(i === 0 && j == 1) {
        console.log(node.wordsWeights.length, node1.wordsWeights.length, weight);
        console.log(node.wordsWeights.type, node.wordsWeights);
        console.log(node1.wordsWeights.type, node1.wordsWeights);
        console.log(node.wordsWeights.getNorm() * node1.wordsWeights.getNorm());
      }

      if(weight > relationThreshold) {
        var relation = new Relation(node.id + "_" + node1.id, node.id + "_" + node1.id, node, node1, weight);
        network.addRelation(relation);
      }
    }
  }

  return network;
};


/**
 * builds a network out of a list of short strings, adds a property wordsTable to each node (with words and weights)
 * @param  {StringList} texts
 *
 * @param  {StringList} stopWords
 * @param  {Number} relationThreshold threshold to create a relation
 * @param {Number} mode <br>0:pseudoentropy, by finding key words with low entropy (words occurring in a single text or in all texts have maximum entropy, occuring in 0.25 texts minimum entropy (max weight))<br>1:originality<br>2:skewed entropy<br>3:originality except isolation
 * @param {Boolean} applyIntensity takes into account occurrences of word into each text
 * @param {Table} [varname] if a words frquency table is provided, les frequent words are weighed
 * @return {Network}
 * tags:generator
 */
StringListOperators.createShortTextsNetwork = function(texts, stopWords, relationThreshold, mode, applyIntensity, wordsFrequencyTable) {
  if(texts == null ||  texts.length == null || texts.length === 0) return;

  var _time = new Date().getTime();

  var network = new Network();
  var joined = texts.join(' *** ').toLowerCase();
  var textsLowerCase = joined.split(' *** ');
  var n_texts = texts.length;
  var i, j;
  var word;
  var nWords;
  var n_words;
  var weights;
  var weight;
  var maxWeight = 0;

  relationThreshold = relationThreshold || 0.2;
  mode = mode || 0;

  if(wordsFrequencyTable) {
    wordsFrequencyTable[0] = wordsFrequencyTable[0].toLowerCase();
    var maxFreq = wordsFrequencyTable[1][0];
    var index;
  }

  var weightFunction;
  switch(mode) {
    case 0: //pseudo-entropy
      weightFunction = function(nOtherTexts) {
        return 1 - Math.pow(2 * nOtherTexts / (n_texts - 1) - 1, 2);
      };
      break;
    case 1: //originality
      weightFunction = function(nOtherTexts) {
        return 1 / (nOtherTexts + 1);
      };
      break;
    case 2: //skewed entropy (favoring very few external occurrences)
      weightFunction = function(nOtherTexts) {
        return 1 - Math.pow(2 * Math.pow(nOtherTexts / (n_texts - 1), 0.2) - 1, 2);
      };
      break;
    default: //originality except isolation
      weightFunction = function(nOtherTexts) {
        if(nOtherTexts === 0) return 0;
        return 1 / nOtherTexts;
      };
      break;
  }

  console.log('A ===> StringListOperators.createShortTextsNetwork took:', new Date().getTime() - _time);
  _time = new Date().getTime();

  texts.forEach(function(text, i) {
    var node = new Node("_" + i, "_" + i);
    network.addNode(node);
    node.content = text;
    var words = StringOperators.getWords(text, true, stopWords, false, false, 0, 3);

    n_words = words.length;
    weights = new NumberList();
    //words.forEach(function(word, j){
    for(j = 0; words[j] != null; j++) {
      word = words[j];
      var nOtherTexts = 0;
      textsLowerCase.forEach(function(text, k) {
        if(i == k) return;
        nOtherTexts += Number(text.indexOf(word) != -1); //is this the fastest way?
      });

      if(nOtherTexts === 0) {
        words.splice(j, 1);
        j--;
        continue;
      }

      weights[j] = weightFunction(nOtherTexts); //1-Math.pow(2*Math.pow(nOtherTexts/(n_texts-1), 0.25)-1, 2);

      if(applyIntensity) weights[j] *= (1 - 1 / (StringOperators.countOccurrences(textsLowerCase[i], word) + 1));

      if(wordsFrequencyTable) {
        index = wordsFrequencyTable[0].indexOf(word);
        //console.log(' •>•>•>•>•>•>•>•>•>•>•>•>•>•>•>•>•> ', word, weights[j], index==-1?1:(1 - Math.pow(wordsFrequencyTable[1][index]/maxFreq, 0.2)) )
        weights[j] *= (index == -1 ? 1 : (1 - Math.pow(wordsFrequencyTable[1][index] / maxFreq, 0.2)));
      }

      maxWeight = Math.max(maxWeight, weights[j]);
    }

    nWords = Math.floor(Math.log(n_words + 1) * 3);

    words = words.getSortedByList(weights, false).slice(0, nWords);

    words.position = {};
    words.forEach(function(word, j) {
      words.position[word] = j;
    });

    weights = weights.getSorted(false).slice(0, nWords);
    node.wordsTable = new Table();
    node.wordsTable[0] = words;
    node.wordsTable[1] = weights;
  });


  console.log('B ===> StringListOperators.createShortTextsNetwork took:', new Date().getTime() - _time);
  _time = new Date().getTime();

  for(i = 0; network.nodeList[i + 1] != null; i++) {
    var node = network.nodeList[i];
    for(j = i + 1; network.nodeList[j] != null; j++) {
      var node1 = network.nodeList[j];
      weight = 0;
      node.wordsTable[0].forEach(function(word, i) {
        //index = node1.wordsTable[0].indexOf(word);//TODO:this could be improved (as seen in forums, indexOf might be unneficient for arrays
        index = node1.wordsTable[0].position[word];
        if(index != null) weight += node.wordsTable[1][i] * node1.wordsTable[1][index];
      });
      weight = Math.sqrt((weight / maxWeight) / Math.max(node.wordsTable[0].length, node1.wordsTable[0].length));
      if(weight > relationThreshold) {
        var relation = new Relation(node.id + "_" + node1.id, node.id + "_" + node1.id, node, node1, weight);
        network.addRelation(relation);
      }
    }
  }

  console.log('C ===> StringListOperators.createShortTextsNetwork took:', new Date().getTime() - _time);

  return network;
};
