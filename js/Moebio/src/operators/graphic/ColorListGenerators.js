import ColorList from "src/dataTypes/graphic/ColorList";
import ColorScales from "src/operators/graphic/ColorScales";
import NumberListGenerators from "src/operators/numeric/numberList/NumberListGenerators";
import ListOperators from "src/operators/lists/ListOperators";
import ColorOperators from "src/operators/graphic/ColorOperators";
import Table from "src/dataTypes/lists/Table";
import List from "src/dataTypes/lists/List";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";

ColorListGenerators._HARDCODED_CATEGORICAL_COLORS = new ColorList(
  "#d62728", "#1f77b4", "#2ca02c", "#ff7f00", "#9467bd", "#bcbd22", "#8c564b", "#17becf", "#dd4411", "#206010", "#e377c2",
  "#2200bb", "#dd8811", "#ff220e", "#1f66a3", "#8c453a", "#2ba01c", "#dfc500", "#945600", "#ff008b", "#e37700", "#7f7f7f"
);

/**
 * @classdesc Tools for generating {@link List|Lists} of colors.
 *
 * @namespace
 * @category colors
 */
function ColorListGenerators() {}
export default ColorListGenerators;

/**
 * create a simple list of categorical colors
 * @param  {Number} nColors
 *
 * @param  {Number} alpha 1 by default
 * @param {Boolean} invert invert colors
 * @param {Boolean} darken colors beyond starting colorList length (default=false)
 * @return {ColorList}
 * tags:generator
 */
ColorListGenerators.createDefaultCategoricalColorList = function(nColors, alpha, invert, bDarken) {
  alpha = alpha == null ? 1 : alpha;
  bDarken = bDarken == null ? false : bDarken;
  var colors = ColorListGenerators.createCategoricalColors(2, nColors,null,null,null,null,null,bDarken);
  if(alpha < 1) colors = colors.addAlpha(alpha);

  if(invert) colors = colors.getInverted();

  return colors;
};

/**
 * Creates a ColorList of categorical colors based on an input List. All entries with the same value will get the same color.
 * @param {List} the list containing categorical data with same length as given list
 * tags:generator
 */
ColorListGenerators.colorsForCategoricalList = function(list){
  return ColorListGenerators.createCategoricalColorListForList(list)[0].value;
};

//@todo: change this method (and try to not break things)

/**
 * Creates a ColorList of categorical colors based on an input List. All entries with the same value will get the same color.
 * @param {List} the list containing categorical data
 *
 * @param {ColorList} ColorList with categorical colors
 * @param {Number} alpha transparency
 * @param {String} color to mix
 * @param {Number} interpolation value (0-1) for color mix
 * @param {Boolean} invert invert colors
 * @param {Boolean} darken colors beyond internal colorList length (default=false)
 * @return {ColorList} ColorList with categorical colors that match the given list
 * @return {List} elements list of elemnts that match colors (equivalent to getWithoutRepetions)
 * @return {ColorList} ColorList with different categorical colors
 * @return {Table} dictionary dictionary table with elemnts and matching colors
 * @return {Object} citionaryObject (relational array, from objects to colors)
 * tags:generator
 */
ColorListGenerators.createCategoricalColorListForList = function(list, colorList, alpha, color, interpolate, invert, bDarken)
{

  if(!list)
    return new ColorList();
  if(!alpha)
    alpha = 1;
  if(!color)
    color = "#fff";
  if(!interpolate)
    interpolate = 0;
  bDarken = bDarken == null ? false : bDarken;

  list = List.fromArray(list);
  var diffValues = list.getWithoutRepetitions();
  var diffColors;
  if(colorList && interpolate !== 0) {
    diffColors = colorList.getInterpolated(color, interpolate);
  } else {
    diffColors = ColorListGenerators.createCategoricalColors(2, diffValues.length, null, alpha, color, interpolate, colorList,bDarken);
  }
  if(alpha<1) diffColors = diffColors.addAlpha(alpha);

  if(invert) diffColors = diffColors.getInverted();

  var colorDictTable = Table.fromArray([diffValues, diffColors]);
  var dictionaryObject = ListOperators.buildDictionaryObjectForDictionary(colorDictTable);

  var fullColorList = ListOperators.translateWithDictionary(list, colorDictTable, 'black');

  fullColorList = ColorList.fromArray(fullColorList);

  return [
    {
      value: fullColorList,
      type: 'ColorList'
    }, {
      value: diffValues,
      type: diffValues.type
    }, {
      value: diffColors,
      type: 'ColorList'
    }, {
      value: new Table(diffValues, fullColorList),
      type: 'Table'
    }, {
      value: dictionaryObject,
      type: 'Object'
    }
  ];
};


/**
 * create a colorList based on a colorScale and values from a numberList (that will be normalized)
 * @param  {NumberList} numberList
 *
 * @param  {ColorScale} colorScale
 * @param  {Number} mode 0:normalize numberList
 * @return {ColorList}
 * tags:generator
 */
ColorListGenerators.createColorListFromNumberList = function(numberList, colorScale, mode) {
  if(numberList==null) return null;

  mode = mode == null ? 0 : mode;
  colorScale = colorScale==null?ColorScales.grayToOrange:colorScale;

  var colorList = new ColorList();
  var newNumberList;
  var i;

  switch(mode) {
    case 0: //0 to max
      newNumberList = NumberListOperators.normalizedToMax(numberList);
      break;
    case 1: //min to max
      break;
    case 2: //values between 0 and 1
      break;
  }

  for(i = 0; newNumberList[i] != null; i++) {
    colorList.push(colorScale(newNumberList[i]));
  }

  return colorList;
};


/**
 * Creates a new ColorList that contains the provided color. Size of the List
 * is controlled by the nColors input.
 *
 * @param {Number} nColors Length of the list.
 * @param {Color} color Color to fill list with.
 */
ColorListGenerators.createColorListWithSingleColor = function(nColors, color) {
  var colorList = new ColorList();
  for(var i = 0; i < nColors; i++) {
    colorList.push(color);
  }
  return colorList;
};


/**
 * Creates a new ColorList from the full spectrum. Size of the List
 * is controlled by the nColors input.
 *
 * @param {Number} nColors Length of the list (default 8).
 * @param {Number} saturation in range [0,1]
 * @param {Number} value in range [0,1]
 * @return {ColorList} ColorList with spectrum colors
 * tags:generator
*/
ColorListGenerators.createColorListSpectrum = function(nColors, saturation,value) {
  // use HSV and rotate through hues
  nColors = nColors == null? 8:nColors;
  saturation = saturation == null? 1:saturation;
  value = value == null? 1:value;
  var colorList = new ColorList();
  var hue;
  for(var i = 0; i < nColors; i++) {
    // hue of 0 == hue of 360 so we go to nColors-1
    hue = 360*i/nColors;
    colorList.push(ColorOperators.HSVtoHEX(hue,saturation,value));
  }
  return colorList;
};


/**
 * Creates a ColorList of categorical colors
 * @param {Number} mode 0:simple picking from color scale function, 1:random (with seed), 2:hardcoded colors, 3:spectrum colors, 4:evolutionary algorithm, guarantees non consecutive similar colors(spectrum), 5:evolutionary algorithm, guarantees non consecutive similar colors(colorScale)
 * @param {Number} nColors
 *
 * @param {ColorScale} colorScaleFunction
 * @param {Number} alpha transparency
 * @param {String} interpolateColor color to interpolate
 * @param {Number} interpolateValue interpolation value [0, 1]
 * @param {ColorList} colorList colorList to be used in mode 2 (if not colorList is provided it will use default categorical colors)
 * @param {Boolean} darken colors beyond starting colorList length for mode 2(default=false)
 * @return {ColorList} ColorList with categorical colors
 * tags:generator
 */
ColorListGenerators.createCategoricalColors = function(mode, nColors, colorScaleFunction, alpha, interpolateColor, interpolateValue, colorList, bDarken) {
  colorScaleFunction = colorScaleFunction == null ? ColorScales.temperature : colorScaleFunction;
  bDarken = bDarken == null ? false : bDarken;
  var i;
  var newColorList = new ColorList();
  switch(mode) {
    case 0: //picking from ColorScale
      for(i = 0; i < nColors; i++) {
        newColorList[i] = colorScaleFunction(i / (nColors - 1));
      }
      break;
    case 1: //seeded random numbers
      var values = NumberListGenerators.createRandomNumberList(nColors, null, 0);
      for(i = 0; i < nColors; i++) {
        newColorList[i] = colorScaleFunction(values[i]);
      }
      break;
    case 2:
      colorList = colorList==null?ColorListGenerators._HARDCODED_CATEGORICAL_COLORS:colorList;
      var nInterpolate;
      for(i = 0; i < nColors; i++) {
        newColorList[i] = colorList[i%colorList.length];
        if(bDarken && i >= colorList.length){
          // move towards black
          nInterpolate = Math.floor(i/colorList.length);
          for(var j=0; j < nInterpolate;j++){
            newColorList[i]= ColorOperators.interpolateColors(newColorList[i],'black',0.20);
          }
        }
      }
      break;
    case 3:
      newColorList = ColorListGenerators.createColorListSpectrum(nColors);
      break;
    case 4:
    case 5:
      var randomNumbersSource = NumberListGenerators.createRandomNumberList(1001, null, 0);
      var positions = NumberListGenerators.createSortedNumberList(nColors);
      var randomNumbers = NumberListGenerators.createRandomNumberList(nColors, null, 0);
      var randomPositions = ListOperators.sortListByNumberList(positions, randomNumbers);

      var nGenerations = Math.floor(nColors * 2) + 100;
      var nChildren = Math.floor(nColors * 0.6) + 5;
      var bCircular = mode == 4;
      var bExtendedNeighbourhood = mode == 4;
      var bestEvaluation = ColorListGenerators._evaluationFunction(randomPositions,bCircular,bExtendedNeighbourhood);
      var child;
      var bestChildren = randomPositions;
      var j;
      var nr = 0;
      var evaluation;

      for(i = 0; i < nGenerations; i++) {
        for(j = 0; j < nChildren; j++) {
          child = ColorListGenerators._sortingVariation(randomPositions, randomNumbersSource[nr], randomNumbersSource[nr + 1]);
          nr = (nr + 2) % 1001;
          evaluation = ColorListGenerators._evaluationFunction(child,bCircular,bExtendedNeighbourhood);
          if(evaluation > bestEvaluation) {
            bestChildren = child;
            bestEvaluation = evaluation;
          }
        }
        randomPositions = bestChildren;
      }
      if(mode == 4){
        var colorListSpectrum = ColorListGenerators.createColorListSpectrum(nColors);
        for(i = 0; i < nColors; i++) {
          newColorList.push(colorListSpectrum[randomPositions[i]]);
        }
      }
      else{ // 5
        for(i = 0; i < nColors; i++) {
          newColorList.push(colorScaleFunction((1 / nColors) + randomPositions[i] / (nColors + 1))); //TODO: make more efficient by pre-nuilding the colorList
        }
      }
      break;
  }

  if(interpolateColor != null && interpolateValue != null) {
    newColorList = newColorList.getInterpolated(interpolateColor, interpolateValue);
  }

  if(alpha) {
    newColorList = newColorList.addAlpha(alpha);
  }

  return newColorList;
};

/**
 * @ignore
 */
ColorListGenerators._sortingVariation = function(numberList, rnd0, rnd1) { //private
  var newNumberList = numberList.clone();
  var pos0 = Math.floor(rnd0 * newNumberList.length);
  var pos1 = Math.floor(rnd1 * newNumberList.length);
  var cache = newNumberList[pos1];
  newNumberList[pos1] = newNumberList[pos0];
  newNumberList[pos0] = cache;
  return newNumberList;
};

/**
 * @ignore
 */
ColorListGenerators._evaluationFunction = function(numberList, bCircular, bExtendedNeighbourhood) { //private
  // bCircular == true means distance between 0 and n-1 is 1
  // bExtendedNeighbourhood == true means consider diffs beyond adjacent pairs
  var sum = 0;
  var i,d,r2,
    len=numberList.length,
    h=Math.floor(len/2);
  var range = bExtendedNeighbourhood ? 4 : 1;
  for(var r=1; r <= range; r++){
    r2 = r*r;
    for(i = 0; numberList[i + r] != null; i++) {
      d = Math.abs(numberList[i + r] - numberList[i]);
      if(bCircular && d > h){
        d = len-d;
      }
      sum += Math.sqrt(d/r2);
    }
  }
  return sum;
};

/**
 * Creates an object dictionary that matches elements from a list (that could contan repeated elements) with categorical colors
 * @param {List} the list containing categorical data
 *
 * @param {ColorList} ColorList with categorical colors
 * @param {Number} alpha transparency
 * @param {String} color to mix
 * @param {Number} interpolation value (0-1) for color mix
 * @param {Boolean} invert invert colors
 * @return {Object} object dictionar that delivers a color for each element on original list
 * tags:generator
 */
ColorListGenerators.createCategoricalColorListDictionaryObject = function(list, colorList, alpha, color, interpolate, invert){
  if(list==null) return;

  var diffValues = list.getWithoutRepetitions();

  var diffColors = ColorListGenerators.createCategoricalColors(2, diffValues.length, null, alpha, color, interpolate, colorList);

  if(invert) diffColors = diffColors.getInverted();

  var dictionaryObject = {};

  var l = diffColors.length;
  var i;

  for(i=0; i<l; i++){
    dictionaryObject[diffValues[i]] = diffColors[i];
  }

  // diffValues.forEach(function(element, i){
  //   dictionaryObject[element] = diffColors[i];
  // });

  return dictionaryObject;

};
