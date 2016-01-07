/* global console */

import List from "src/dataTypes/lists/List";
import NumberList from "src/dataTypes/numeric/NumberList";
import TableEncodings from "src/operators/lists/TableEncodings";
import {
  instantiate,
  instantiateWithSameType,
  typeOf
  } from "src/tools/utils/code/ClassUtils";
//

Table.prototype = new List();
Table.prototype.constructor = Table;

/**
 * @classdesc A sub-class of {@link List}, Table provides a 2D array-like structure.
 *
 * Each column is stored as its own {@link List}, making it a List of Lists.
 * Cells in the table can be accessed using table[column][row].
 *
 * Additional functions that work on Table can be found in:
 * <ul>
 *  <li>Operators:   {@link TableOperators}</li>
 *  <li>Conversions: {@link TableConversions}</li>
 *  <li>Generators: {@link TableGenerators}</li>
 *  <li>Encodings: {@link TableEncodings}</li>
 * </ul>
 *
 * @description Creates a new Table.
 * Input arguments are treated as the inital column values
 * of the Table.
 * @constructor
 * @category basics
 */
function Table() {
  var args = [];
  var i;
  var nArgs = arguments.length;

  for(i = 0; i < nArgs; i++) {
    args[i] = new List(arguments[i]);
  }

  var array = List.apply(this, args);
  array = Table.fromArray(array);

  return array;
}
export default Table;

/**
 * Creates a new Table from an array
 * @param {Number[]} array
 * @return {Table}
 */
Table.fromArray = function(array) {
  var result = List.fromArray(array);
  result.type = "Table";
  //assign methods to array:
  result.applyFunction = Table.prototype.applyFunction;
  result.getRow = Table.prototype.getRow;
  result.getRows = Table.prototype.getRows;
  result.getLengths = Table.prototype.getLengths;
  result.getListLength = Table.prototype.getListLength;
  result.sliceRows = Table.prototype.sliceRows;
  result.getSubListsByIndexes = Table.prototype.getSubListsByIndexes;
  result.getWithoutRow = Table.prototype.getWithoutRow;
  result.getWithoutRows = Table.prototype.getWithoutRows;
  result.getTransposed = Table.prototype.getTransposed;
  result.getListsSortedByList = Table.prototype.getListsSortedByList;
  result.sortListsByList = Table.prototype.sortListsByList;
  result.clone = Table.prototype.clone;
  result.cloneWithEmptyLists = Table.prototype.cloneWithEmptyLists;
  result.print = Table.prototype.print;

  //transformative
  result.removeRow = Table.prototype.removeRow;

  //overiden
  result.destroy = Table.prototype.destroy;

  result.isTable = true;

  return result;
};


/**
 * Executes a given function on all the columns
 * in the Table, returning a new Table with the
 * resulting values.
 * @param {Function} func Function to apply to each
 * column in the table. Columns are {@link List|Lists}.
 * @return {Table} Table of values from applying function.
 */
Table.prototype.applyFunction = function(func) {
  //TODO: to be tested!
  var i;
  var newTable = new Table();

  newTable.name = this.name;

  for(i = 0; this[i] != null; i++) {
    newTable[i] = this[i].applyFunction(func);
  }
  return newTable.getImproved();
};

/**
 * Returns a {@link List} with all the elements of a row.
 * @param  {Number} index Index of the row to get.
 * @return {List}
 * tags:filter
 */
Table.prototype.getRow = function(index) {
  var list = new List();
  var i;
  var l = this.length;

  for(i = 0; i < l; i++) {
    list[i] = this[i][index];
  }
  return list.getImproved();
};

/**
 * Returns the length a column of the Table.
 * @param  {Number} index The Column to return its length.
 * Defaults to 0.
 * @return {Number} Length of column at given index.
 */
Table.prototype.getListLength = function(index) {
  index = index || 0;
  if(index>=this.length) return;
  return this[index].length;
};

/**
 * Returns the lengths of all the columns of the Table.
 * @return {NumberList} Lengths of all columns in Table.
 */
Table.prototype.getLengths = function() {
  var lengths = new NumberList();
  var l = this.length;

  for(var i = 0; i<l; i++) {
    lengths[i] = this[i]==null?0:this[i].length;
  }
  return lengths;
};

/**
 * Filters a Table by selecting a section of rows, elements with last index included.
 * @param  {Number} startIndex Index of first element in all lists of the table.
 * @param  {Number} endIndex Index of last elements in all lists of the table.
 * @return {Table}
 * tags:filter
 */
Table.prototype.sliceRows = function(startIndex, endIndex) {
  endIndex = endIndex == null ? (this[0].length - 1) : endIndex;

  var i;
  var newTable = new Table();
  var newList;
  var l = this.length;

  newTable.name = this.name;
  for(i = 0; i<l; i++) {
    newList = this[i].getSubList(startIndex, endIndex);
    newList.name = this[i].name;
    newTable.push(newList);
  }
  return newTable.getImproved();
};

/**
 * Filters the lists of the table by indexes.
 * @param  {NumberList} indexes
 * @return {Table}
 * tags:filter
 */
Table.prototype.getSubListsByIndexes = function(indexes) {
  var newTable = new Table();
  var i;
  var l = this.length;

  for(i=0; i<l; i++){
    newTable.push(this[i].getSubListByIndexes(indexes));
  }
  // this.forEach(function(list) {
  //   newTable.push(list.getSubListByIndexes(indexes));
  // });
  return newTable.getImproved();
};


//deprecated
/**
 * @ignore
 */
Table.prototype.getRows = function(indexes) {
  return Table.prototype.getSubListsByIndexes(indexes);
};

/**
 * Returns a new Table with the row at the given index removed.
 * @param {Number} rowIndex Row to remove
 * @return {Table} New Table.
 * tags:filter
 */
Table.prototype.getWithoutRow = function(rowIndex) {
  var newTable = new Table();
  var l = this.length;
  newTable.name = this.name;
  for(var i = 0; i<l; i++) {
    newTable[i] = List.fromArray(this[i].slice(0, rowIndex).concat(this[i].slice(rowIndex + 1))).getImproved();
    newTable[i].name = this[i].name;
  }
  return newTable.getImproved();
};

/**
 * Returns a new Table with the rows listed in the given numberList removed.
 * @param {NumberList} rowsIndexes numberList of row indexes to remove.
 * @return {Table}
 * tags:filter
 */
Table.prototype.getWithoutRows = function(rowsIndexes) {// @todo improve efficiency by building dictionary and not using indexOf
  var newTable = new Table();
  var l = this.length;
  var nElements;
  newTable.name = this.name;
  for(var i = 0; i<l; i++) {
    newTable[i] = new List();
    nElements = this[i].length;
    for(var j = 0; j<nElements; j++) {
      if(rowsIndexes.indexOf(j) == -1) newTable[i].push(this[i][j]);
    }
    newTable[i].name = this[i].name;
  }
  return newTable.getImproved();
};


/**
 * Sort Table's lists by a list
 * @param  {List|Number} listOrIndex List used to sort, or index of list in the table
 *
 * @param  {Boolean} ascending (true by default)
 * @return {Table} table (of the same type)
 * tags:sort
 */
Table.prototype.getListsSortedByList = function(listOrIndex, ascending) { //depracated: use sortListsByList
  if(listOrIndex == null) return;
  var newTable = instantiateWithSameType(this);
  var sortinglist = listOrIndex.isList ? listOrIndex.clone() : this[listOrIndex];
  var l = this.length;
  var i;

  //this.forEach(function(list) {
  for(i=0; i<l; i++){
    newTable.push(this[i].getSortedByList(sortinglist, ascending));
  }

  return newTable;
};

/**
 * Transposes Table.
 * @param firstListAsHeaders
 * @return {Table}
 */
Table.prototype.getTransposed = function(firstListAsHeaders) {

  var tableToTranspose = firstListAsHeaders ? this.getSubList(1) : this;
  var l = tableToTranspose.length;
  var nElements;

  var table = instantiate(typeOf(tableToTranspose));
  if(tableToTranspose.length === 0) return table;
  var i;
  var j;
  var list;

  for(i = 0; i<l; i++) {
    list = tableToTranspose[i];
    nElements = list.length;
    for(j = 0; j<nElements; j++) {
      if(i === 0) table[j] = this.type == "NumberTable" ? new NumberList() : new List();
      table[j][i] = tableToTranspose[i][j];
    }
  }

  nElements = tableToTranspose[0].length;
  if(this.type != "NumberTable")
    for(j = 0; j<nElements; j++) {
      table[j] = table[j].getImproved();
    }

  if(firstListAsHeaders) {
    nElements = this[0].length;
    for(j = 0; j<nElements; j++) {
      table[j].name = String(this[0][j]);
    }
    // this[0].forEach(function(name, i) {
    //   table[i].name = String(name);
    // });
  }

  return table;
};


/**
 * removes a row from the table.
 * @param {Number} index The row to remove.
 * @return {undefined}
 */
Table.prototype.removeRow = function(index) {
  for(var i = 0; this[i] != null; i++) {
    this[i].splice(index, 1);
  }
};

/**
 * makes a clone of the Table, that contains clones of the lists
 * @return {Table} Copy of table.
 */
Table.prototype.clone = function() {
  var l = this.length;
  var clonedTable = instantiateWithSameType(this);
  var i;

  clonedTable.name = this.name;

  for(i = 0; i<l; i++) {
    clonedTable.push(this[i].clone());
  }

  return clonedTable;
};

/**
 * makes a copy of the Table, with empty lists having same types
 * @return {Table} Copy of table.
 */
Table.prototype.cloneWithEmptyLists = function() {
  var l = this.length;
  var i;
  var newTable = instantiateWithSameType(this);
  var newList;

  newTable.name = this.name;

  for(i = 0; i<l; i++) {
    newList = instantiateWithSameType(this[i]);
    newList.name = this[i].name;
    newTable.push(newList);
  }

  return newTable;
};



/**
 * Removes all contents of the Table.
 */
Table.prototype.destroy = function() {
  for(var i = 0; this[i] != null; i++) {
    this[i].destroy();
    delete this[i];
  }
};

/**
 * Prints contents of Table to console.log.
 */

Table.prototype.print = function() {
  console.log("///////////// <" + this.name + "////////////////////////////////////////////////////");
  console.log(TableEncodings.TableToCSV(this, null, true));
  console.log("/////////////" + this.name + "> ////////////////////////////////////////////////////");
};
