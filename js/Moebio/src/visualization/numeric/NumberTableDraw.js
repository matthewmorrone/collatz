import { TwoPi, HalfPi } from "src/Global";
import Rectangle from "src/dataTypes/geometry/Rectangle";
import Point from "src/dataTypes/geometry/Point";
import IntervalTableOperators from "src/operators/numeric/interval/IntervalTableOperators";
import NumberList from "src/dataTypes/numeric/NumberList";
import NumberTableFlowOperators from "src/operators/numeric/numberTable/NumberTableFlowOperators";
import ColorScales from "src/operators/graphic/ColorScales";
import ColorListGenerators from "src/operators/graphic/ColorListGenerators";
import IntervalTableDraw from "src/visualization/numeric/IntervalTableDraw";
import GeometryOperators from "src/operators/geometry/GeometryOperators";
import NumberTable from "src/dataTypes/numeric/NumberTable";
import Table from "src/dataTypes/lists/Table";
import ColorList from "src/dataTypes/graphic/ColorList";
import NumberListOperators from "src/operators/numeric/numberList/NumberListOperators";
import TableOperators from "src/operators/lists/TableOperators";


function NumberTableDraw() {}
export default NumberTableDraw;

/**
 * draws a matrix, with cells colors associated to values from a ColorScale
 * @param  {Rectangle} frame
 * @param  {NumberTable} numberTable
 *
 * @param  {ColorScale} colorScale
 * @param  {Boolean} listColorsIndependent if true each numberList will be colored to fit the colorScale range
 * @param  {Number} margin
 * @return {Point}
 * tags:draw
 */
NumberTableDraw.drawNumberTable = function(frame, numberTable, colorScale, listColorsIndependent, margin, graphics) {
  if(frame == null ||  numberTable == null || numberTable.type == null || numberTable.type != "NumberTable" ||  numberTable.length < 2) return null;

  if(graphics==null) graphics = frame.graphics; //momentary fix

  colorScale = colorScale == null ? ColorScales.blueToRed : colorScale;
  listColorsIndependent = listColorsIndependent || false;
  margin = margin == null ? 2 : margin;

  var dX = frame.width / numberTable.length;
  var dY = frame.height / numberTable[0].length;

  var i;
  var j;
  var numberList;
  var x;

  var overCoordinates;

  var minMaxInterval;
  var amp;
  if(!listColorsIndependent) {
    minMaxInterval = numberTable.getMinMaxInterval();
    amp = minMaxInterval.getAmplitude();
  }

  var mouseXOnColumn;

  for(i = 0; numberTable[i] != null; i++) {
    numberList = numberTable[i];
    x = Math.round(frame.x + i * dX);
    mouseXOnColumn = graphics.mX > x && graphics.mX <= x + dX;
    if(listColorsIndependent) {
      minMaxInterval = numberList.getMinMaxInterval();
      amp = minMaxInterval.getAmplitude();
    }
    for(j = 0; numberList[j] != null; j++) {
      graphics.context.fillStyle = colorScale((numberList[j] - minMaxInterval.x) / amp);
      graphics.context.fillRect(x, Math.round(frame.y + j * dY), Math.ceil(dX) - margin, Math.ceil(dY) - margin);
      if(mouseXOnColumn && graphics.mY > frame.y + j * dY && graphics.mY <= frame.y + (j + 1) * dY) overCoordinates = new Point(i, j);
    }
  }

  return overCoordinates;
};

/**
 * draws a ScatterPlot, if the provided NumberTable contains a third NumberList it also draws circles
 * @param  {Rectangle} frame
 * @param  {NumberTable} numberTable with two lists
 *
 * @param  {StringList} texts
 * @param  {ColorList} colors
 * @param  {Number} maxRadius
 * @param  {Boolean} loglog logarithmical scale for both axis
 * @param  {Number} margin in pixels
 * @return {Number} index of rollovered element
 * tags:draw
 */
NumberTableDraw.drawSimpleScatterPlot = function(frame, numberTable, texts, colors, maxRadius, loglog, margin, graphics) {
  if(frame == null ||  numberTable == null || numberTable.type != "NumberTable" ||  numberTable.length < 2 ||  numberTable[0].length === 0 || numberTable[1].length === 0) return; //todo:provisional, this is System's work

  if(graphics==null) graphics = frame.graphics; //momentary fix

  if(numberTable.length < 2) return;

  maxRadius = maxRadius || 20;
  loglog = loglog || false;
  margin = margin || 0;

  var subframe = new Rectangle(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
  subframe.bottom = subframe.getBottom();

  var i;
  var x, y;
  var list0 = NumberListOperators.normalized(loglog ? numberTable[0].log(1) : numberTable[0]);
  var list1 = (loglog ? numberTable[1].log(1) :  NumberListOperators.normalized(numberTable[1]));
  var radii = numberTable.length <= 2 ? null :  NumberListOperators.normalized(numberTable[2]).sqrt().factor(maxRadius);
  var nColors = (colors == null) ? null : colors.length;
  var n = Math.min(list0.length, list1.length, (radii == null) ? 300000 : radii.length, (texts == null) ? 300000 : texts.length);
  var iOver;

  for(i = 0; i < n; i++) {
    x = subframe.x + list0[i] * subframe.width;
    y = subframe.bottom - list1[i] * subframe.height;

    if(radii == null) {
      if(NumberTableDraw._drawCrossScatterPlot(x, y, colors == null ? 'rgb(150,150,150)' : colors[i % nColors],graphics)) iOver = i;
    } else {
      graphics.setFill(colors == null ? 'rgb(150,150,150)' : colors[i % nColors]);
      if(graphics.fCircleM(x, y, radii[i], radii[i] + 1)) iOver = i;
    }
    if(texts != null) {
      graphics.setText('black', 10);
      graphics.fText(texts[i], x, y);
    }
  }

  if(margin > 7 && list0.name !== "" && list1.name !== "") {
    graphics.setText('black', 10, null, 'right', 'middle');
    graphics.fText(list0.name, subframe.getRight() - 2, subframe.bottom + margin * 0.5);
    graphics.fTextRotated(list1.name, subframe.x - margin * 0.5, subframe.y + 1, -HalfPi);
  }

  if(iOver != null) {
    graphics.setCursor('pointer');
    return iOver;
  }
};

NumberTableDraw._drawCrossScatterPlot = function(x, y, color, graphics) {
  graphics.setStroke(color, 1);
  graphics.line(x, y - 2, x, y + 2);
  graphics.line(x - 2, y, x + 2, y);
  return Math.pow(graphics.mX - x, 2) + Math.pow(graphics.mY - y, 2) < 25;
};

/**
 * draws a slopegraph
 * @param  {Rectangle} frame
 * @param  {NumberTable} numberTable with at least two numberLists
 * @param  {StringList} texts
 * @return {Object}
 * tags:draw
 */
NumberTableDraw.drawSlopeGraph = function(frame, numberTable, texts, graphics) {
  if(frame == null ||  numberTable == null || numberTable.type != "NumberTable") return; //todo:provisional, this is System's work

  if(numberTable.length < 2) return;

  var margin = 16;
  var subframe = new Rectangle(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
  subframe.bottom = subframe.getBottom();

  var i;
  var y0, y1;
  var list0 =  NumberListOperators.normalized(numberTable[0]);
  var list1 =  NumberListOperators.normalized(numberTable[1]);
  var n = Math.min(list0.length, list1.length, texts == null ? 2000 : texts.length);

  var x0 = subframe.x + (texts == null ? 10 : 0.25 * subframe.width);
  var x1 = subframe.getRight() - (texts == null ? 10 : 0.25 * subframe.width);

  graphics.setStroke('black', 1);

  for(i = 0; i < n; i++) {
    y0 = subframe.bottom - list0[i] * subframe.height;
    y1 = subframe.bottom - list1[i] * subframe.height;

    graphics.line(x0, y0, x1, y1);

    if(texts != null && (subframe.bottom - y0) >= 9) {
      graphics.setText('black', 9, null, 'right', 'middle');
      graphics.fText(texts[i], x0 - 2, y0);
    }
    if(texts != null && (subframe.bottom - y1) >= 9) {
      graphics.setText('black', 9, null, 'left', 'middle');
      graphics.fText(texts[i], x1 + 2, y1);
    }
  }
};


/**
 * based on a integers NumberTable draws a a matrix of rectangles with colors associated to number of elelments in overCoordinates
 * @param  {Rectangle} frame
 * @param  {Object} coordinates, it could be a polygon, or a numberTable with two lists
 *
 * @param  {ColorScale} colorScale
 * @param  {Number} margin
 * @return {NumberList} list of positions of elements on clicked coordinates
 * tags:draw
 */
NumberTableDraw.drawDensityMatrix = function(frame, coordinates, colorScale, margin, graphics) {
  if(coordinates == null || coordinates[0] == null) return;

  colorScale = colorScale == null ?
								ColorScales.whiteToRed
								:
    typeof colorScale == 'string' ?
									ColorScales[colorScale]
									:
    colorScale;
  margin = margin || 0;

  var i, j;
  var x, y;
  var minx, miny;
  var matrixColors;
  var numberTable;
  var polygon;

  //setup
  if(frame.memory == null || coordinates != frame.memory.coordinates || colorScale != frame.memory.colorScale) {

    var isNumberTable = coordinates[0].x == null;
    if(isNumberTable) {
      numberTable = coordinates;
      if(numberTable == null ||  numberTable.length < 2 || numberTable.type != "NumberTable") return;
    } else {
      polygon = coordinates;
    }

    var max = 0;
    var nCols = 0;
    var nLists = 0;
    var matrix = new NumberTable();
    var n = isNumberTable ? numberTable[0].length : polygon.length;

    matrixColors = new Table();

    if(isNumberTable) {
      minx = numberTable[0].getMin();
      miny = numberTable[1].getMin();
    } else {
      minx = polygon[0].x;
      miny = polygon[0].y;
      for(i = 1; i < n; i++) {
        minx = Math.min(polygon[i].x, minx);
        miny = Math.min(polygon[i].y, miny);
      }
    }


    for(i = 0; i < n; i++) {
      if(isNumberTable) {
        x = Math.floor(numberTable[0][i] - minx);
        y = Math.floor(numberTable[1][i] - miny);
      } else {
        x = Math.floor(polygon[i].x - minx);
        y = Math.floor(polygon[i].y - miny);
      }

      if(matrix[x] == null) matrix[x] = new NumberList();
      if(matrix[x][y] == null) matrix[x][y] = 0;
      matrix[x][y]++;
      max = Math.max(max, matrix[x][y]);
      nCols = Math.max(nCols, x + 1);
      nLists = Math.max(nLists, y + 1);
    }

    for(i = 0; i < nCols; i++) {
      if(matrix[i] == null) matrix[i] = new NumberList();
      matrixColors[i] = new ColorList();
      for(j = 0; j < nLists; j++) {
        if(matrix[i][j] == null) matrix[i][j] = 0;
        matrixColors[i][j] = colorScale(matrix[i][j] / max);
      }
    }
    frame.memory = {
      matrixColors: matrixColors,
      coordinates: coordinates,
      colorScale: colorScale,
      selected: null
    };

  } else {
    matrixColors = frame.memory.matrixColors;
  }

  //c.log(matrixColors.length, matrixColors[0].length, matrixColors[0][0]);

  //draw
  var subframe = new Rectangle(frame.x + margin, frame.y + margin, frame.width - margin * 2, frame.height - margin * 2);
  subframe.bottom = subframe.getBottom();
  var dx = subframe.width / matrixColors.length;
  var dy = subframe.height / matrixColors[0].length;
  var prevSelected = frame.memory.selected;

  if(graphics.MOUSE_UP_FAST) frame.memory.selected = null;

  for(i = 0; matrixColors[i] != null; i++) {
    for(j = 0; matrixColors[0][j] != null; j++) {
      graphics.setFill(matrixColors[i][j]);
      if(graphics.fRectM(subframe.x + i * dx, subframe.bottom - (j + 1) * dy, dx + 0.5, dy + 0.5) && graphics.MOUSE_UP_FAST) {
        frame.memory.selected = [i, j];
      }
    }
  }


  //selection
  if(frame.memory.selected) {
    graphics.setStroke('white', 5);
    graphics.sRect(subframe.x + frame.memory.selected[0] * dx - 1, subframe.bottom - (frame.memory.selected[1] + 1) * dy - 1, dx + 1, dy + 1);
    graphics.setStroke('black', 1);
    graphics.sRect(subframe.x + frame.memory.selected[0] * dx - 1, subframe.bottom - (frame.memory.selected[1] + 1) * dy - 1, dx + 1, dy + 1);
  }

  if(prevSelected != frame.memory.selected) {
    if(frame.memory.selected == null) {
      frame.memory.indexes = null;
    } else {
      minx = numberTable[0].getMin();
      miny = numberTable[1].getMin();

      x = frame.memory.selected[0] + minx;
      y = frame.memory.selected[1] + miny;

      frame.memory.indexes = new NumberList();

      for(i = 0; numberTable[0][i] != null; i++) {
        if(numberTable[0][i] == x && numberTable[1][i] == y) frame.memory.indexes.push(i);
      }
    }

  }

  if(frame.memory.selected) return frame.memory.indexes;
};

/**
 * draws a steamgraph
 * @param  {Rectangle} frame
 * @param  {NumberTable} numberTable
 *
 * @param {Boolean} normalized normalize each column, making the graph of constant height
 * @param {Boolean} sorted sort flow polygons
 * @param {Number} intervalsFactor number between 0 and 1, factors the height of flow polygons
 * @param {Boolean} bezier draws bezier (soft) curves
 * @param {ColorList} colorList colors of polygons
 * @param {StringList} horizontalLabels to be placed in the bottom
 * @param {Boolean} showValues show values in the stream
 * @param {Number} logFactor if >0 heights will be transformed logaritmically log(logFactor*val + 1)
 * @param {String} backgroundColor
 * @param {String} textColor
 * @return {NumberList} list of positions of elements on clicked coordinates
 * tags:draw
 */
NumberTableDraw.drawStreamgraph = function(frame, numberTable, normalized, sorted, intervalsFactor, bezier, colorList, horizontalLabels, showValues, logFactor, backgroundColor, textColor, graphics) {
  if(numberTable == null ||  numberTable.length < 2 || numberTable.type != "NumberTable") return;

  if(graphics==null) graphics = frame.graphics; //momentary fix

  bezier = bezier == null ? true : bezier;

  textColor = textColor == null ? 'white' : textColor;

  //var self = NumberTableDraw.drawStreamgraph;

  intervalsFactor = intervalsFactor == null ? 1 : intervalsFactor;

  //setup
  if(frame.memory == null || numberTable != frame.memory.numberTable || normalized != frame.memory.normalized || sorted != frame.memory.sorted || intervalsFactor != frame.memory.intervalsFactor || bezier != frame.memory.bezier || frame.width != frame.memory.width || frame.height != frame.memory.height || logFactor != frame.memory.logFactor) {
		var nT2 = logFactor?numberTable.applyFunction(function(val){return Math.log(logFactor*val+1);}):numberTable;

    frame.memory = {
      numberTable: numberTable,
      normalized: normalized,
      sorted: sorted,
      intervalsFactor: intervalsFactor,
      bezier: bezier,
      flowIntervals: IntervalTableOperators.scaleIntervals(NumberTableFlowOperators.getFlowTableIntervals(nT2, normalized, sorted), intervalsFactor),
      fOpen: 1,
      names: numberTable.getNames(),
      mXF: graphics.mX,
      width: frame.width,
      height: frame.height,
      logFactor: logFactor,
      image: null
    };

  }

  if(colorList && frame.memory.colorList != colorList) frame.memory.image = null;

  if(frame.memory.colorList != colorList || frame.memory.colorList == null) {
    frame.memory.actualColorList = colorList == null ? ColorListGenerators.createDefaultCategoricalColorList(numberTable.length, 0.7) : colorList;
    frame.memory.colorList = colorList;
  }

  var flowFrame = new Rectangle(0, 0, frame.width, horizontalLabels == null ? frame.height : (frame.height - 14));
  flowFrame.graphics = graphics;

  if(backgroundColor!=null){
    graphics.setFill(backgroundColor);
    graphics.fRect(frame.x, frame.y, frame.width, frame.height);
  }

  if(frame.memory.image == null) {
    //frame.memory.image = new Image(10,10);
    // TODO refactor to not reassign context
    ///// capture image
    var newCanvas = document.createElement("canvas");
    newCanvas.width = frame.width;
    newCanvas.height = frame.height;
    var newContext = newCanvas.getContext("2d");
    newContext.clearRect(0, 0, frame.width, frame.height);
    var mainContext = graphics.context;
    graphics.context = newContext;
    IntervalTableDraw.drawIntervalsFlowTable(frame.memory.flowIntervals, flowFrame, frame.memory.actualColorList, bezier, 0.3);
    graphics.context = mainContext;
    frame.memory.image = new Image();
    frame.memory.image.src = newCanvas.toDataURL();
    /////
  }

  var x0, x1;
  if(frame.memory.image) {
    frame.memory.fOpen = 0.8 * frame.memory.fOpen + 0.2 * (frame.containsPoint(graphics.mP) ? 0.8 : 1);
    frame.memory.mXF = 0.7 * frame.memory.mXF + 0.3 * graphics.mX;
    frame.memory.mXF = Math.min(Math.max(frame.memory.mXF, frame.x), frame.getRight());

    if(frame.memory.fOpen < 0.999) {
      graphics.context.save();
      graphics.context.translate(frame.x, frame.y);
      var cut = frame.memory.mXF - frame.x;
      x0 = Math.floor(cut * frame.memory.fOpen);
      x1 = Math.ceil(frame.width - (frame.width - cut) * frame.memory.fOpen);

      graphics.drawImage(frame.memory.image, 0, 0, cut, flowFrame.height, 0, 0, x0, flowFrame.height);
      graphics.drawImage(frame.memory.image, cut, 0, (frame.width - cut), flowFrame.height, x1, 0, (frame.width - cut) * frame.memory.fOpen, flowFrame.height);

      NumberTableDraw._drawPartialFlow(flowFrame, frame.memory.flowIntervals, frame.memory.names, frame.memory.actualColorList, cut, x0, x1, 0.3, sorted, showValues ? numberTable : null, textColor);

      graphics.context.restore();
    } else {
      graphics.drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
    }
  }

  if(horizontalLabels) NumberTableDraw._drawHorizontalLabels(frame, frame.getBottom() - 5, numberTable, horizontalLabels, x0, x1);
};

NumberTableDraw._drawHorizontalLabels = function(frame, y, numberTable, horizontalLabels, x0, x1, graphics) {
  if(graphics==null) graphics = frame.graphics; //momentary fix

  var dx = frame.width / (numberTable[0].length - 1);
  var x;
  var mX2 = Math.min(Math.max(graphics.mX, frame.x + 1), frame.getRight() - 1);
  var iPosDec = (mX2 - frame.x) / dx;
  var iPos = Math.round(iPosDec);

  x0 = x0 == null ? frame.x : x0 + frame.x;
  x1 = x1 == null ? frame.x : x1 + frame.x;

  horizontalLabels.forEach(function(label, i) {
    graphics.setText('black', (i == iPos && x1 > (x0 + 4)) ? 14 : 10, null, 'center', 'middle');

    if(x0 > x1 - 5) {
      x = frame.x + i * dx;
    } else if(iPos == i) {
      x = (x0 + x1) * 0.5 - (x1 - x0) * (iPosDec - iPos);
    } else {
      x = frame.x + i * dx;
      if(x < mX2) {
        x = frame.x + i * dx * frame.memory.fOpen;
      } else if(x > mX2) {
        x = frame.x + i * dx * frame.memory.fOpen + (x1 - x0);
      }
    }
    graphics.fText(horizontalLabels[i], x, y);
  });
};

NumberTableDraw._drawPartialFlow = function(frame, flowIntervals, labels, colors, x, x0, x1, OFF_X, sorted, numberTable, textColor, graphics) {
  if(graphics==null) graphics = frame.graphics; //momentary fix

  var w = x1 - x0;
  var wForText = numberTable == null ? (x1 - x0) : (x1 - x0) * 0.85;

  var nDays = flowIntervals[0].length;

  var wDay = frame.width / (nDays - 1);

  var iDay = (x - frame.x) / wDay; // Math.min(Math.max((nDays-1)*(x-frame.x)/frame.width, 0), nDays-1);
  iDay = Math.max(Math.min(iDay, nDays - 1), 0);

  var i;
  var i0 = Math.floor(iDay);
  var i1 = Math.ceil(iDay);

  var interval0;
  var interval1;

  var y, h;

  var wt;
  var pt;

  var text;

  var offX = OFF_X * wDay; //*(frame.width-(x1-x0))/nDays; //not taken into account

  //var previOver = iOver;
  var iOver = -1;

  var X0, X1, xx;

  var ts0, ts1;

  for(i = 0; flowIntervals[i] != null; i++) {

    graphics.setFill(colors[i]);
    interval0 = flowIntervals[i][i0];
    interval1 = flowIntervals[i][i1];

    X0 = Math.floor(iDay) * wDay;
    X1 = Math.floor(iDay + 1) * wDay;

    xx = x;

    y = GeometryOperators.trueBezierCurveHeightHorizontalControlPoints(X0, X1, interval0.x, interval1.x, X0 + offX, X1 - offX, xx);
    h = GeometryOperators.trueBezierCurveHeightHorizontalControlPoints(X0, X1, interval0.y, interval1.y, X0 + offX, X1 - offX, xx) - y;

    y = y * frame.height + frame.y;
    h *= frame.height;

    //if(h<1) continue;

    if(graphics.fRectM(x0, y, w, h)) iOver = i;

    if(h >= 5 && w > 40) {
      graphics.setText(textColor, h, null, null, 'middle');

      text = labels[i];

      wt = graphics.getTextW(text);
      pt = wt / wForText;

      if(pt > 1) {
        graphics.setText(textColor, h / pt, null, null, 'middle');
      }

      graphics.context.fillText(text, x0, y + h * 0.5);

      if(numberTable) {
        wt = graphics.getTextW(text);

        ts0 = Math.min(h, h / pt);
        ts1 = Math.max(ts0 * 0.6, 8);

        graphics.setText(textColor, ts1, null, null, 'middle');
        graphics.fText(Math.round(numberTable[i][i0]), x0 + wt + w * 0.03, y + (h + (ts0 - ts1) * 0.5) * 0.5);
      }


    }
  }

  return iOver;
};



/**
 * draws a circular steamgraph Without labels
 * @param {Rectangle} frame
 * @param {Table} dataTable table with a categorical list and many numberLists
 *
 * @param {Boolean} normalized normalize each column, making the graph of constant height
 * @param {Boolean} sorted sort flow polygons
 * @param {Number} intervalsFactor number between 0 and 1, factors the height of flow polygons
 * @param {ColorList} colorList colors of polygons
 * @return {Number} index of position of element on first list associated with shape
 * tags:draw
 */
NumberTableDraw.drawCircularStreamgraph = function(frame, dataTable, normalized, sorted, intervalsFactor, colorList, graphics) {
  if(dataTable == null ||  dataTable.length < 3 || dataTable[0].length < 2) return;

  if(graphics==null) graphics = frame.graphics; //momentary fix

  intervalsFactor = intervalsFactor == null ? 1 : intervalsFactor;

  var over;

  //setup
  if(frame.memory == null || dataTable != frame.memory.dataTable || normalized != frame.memory.normalized || sorted != frame.memory.sorted || intervalsFactor != frame.memory.intervalsFactor || frame.width != frame.memory.width || frame.height != frame.memory.height) {
    var numberTable = TableOperators.getNumberTableFromTable(dataTable);
    
    if(numberTable.length<2) return;

    numberTable = numberTable.getTransposed();

    var names = dataTable.getNames().slice(1);
    if(names!=null && names.join('')==='') names = null;

    frame.memory = {
      dataTable:dataTable,
      numberTable: numberTable,
      categories:dataTable[0],
      names:names,
      normalized: normalized,
      sorted: sorted,
      intervalsFactor: intervalsFactor,
      flowIntervals: IntervalTableOperators.scaleIntervals(NumberTableFlowOperators.getFlowTableIntervals(numberTable, normalized, sorted), intervalsFactor),
      fOpen: 1,
      mXF: graphics.mX,
      width: frame.width,
      height: frame.height,
      radius: Math.min(frame.width, frame.height) * 0.46 - (names == null ? 0 : 8),
      r0: Math.min(frame.width, frame.height) * 0.05,
      angles: new NumberList(),
      zoom: 1,
      angle0: 0,
      image: null
    };

    var dA = TwoPi / numberTable[0].length;
    numberTable[0].forEach(function(val, i) {
      frame.memory.angles[i] = i * dA;
    });
  }

  if(frame.memory.colorList != colorList || frame.memory.colorList == null) {
    frame.memory.actualColorList = colorList == null ? ColorListGenerators.createDefaultCategoricalColorList(frame.memory.numberTable.length, 0.4) : colorList;
    frame.memory.colorList = colorList;
  }

  var mouseOnFrame = frame.containsPoint(graphics.mP);

  if(mouseOnFrame) {
    if(graphics.MOUSE_DOWN) {
      frame.memory.downX = graphics.mX;
      frame.memory.downY = graphics.mY;
      frame.memory.pressed = true;
      frame.memory.zoomPressed = frame.memory.zoom;
      frame.memory.anglePressed = frame.memory.angle0;
    }

    frame.memory.zoom *= (1 - 0.4 * graphics.WHEEL_CHANGE);
  }

  if(graphics.MOUSE_UP) frame.memory.pressed = false;
  if(frame.memory.pressed) {
    var center = frame.getCenter();
    var dx0 = frame.memory.downX - center.x;
    var dy0 = frame.memory.downY - center.y;
    var d0 = Math.sqrt(Math.pow(dx0, 2) + Math.pow(dy0, 2));
    var dx1 = graphics.mX - center.x;
    var dy1 = graphics.mY - center.y;
    var d1 = Math.sqrt(Math.pow(dx1, 2) + Math.pow(dy1, 2));
    frame.memory.zoom = frame.memory.zoomPressed * ((d1 + 5) / (d0 + 5));
    var a0 = Math.atan2(dy0, dx0);
    var a1 = Math.atan2(dy1, dx1);
    frame.memory.angle0 = frame.memory.anglePressed + a1 - a0;
  }

  if(mouseOnFrame) frame.memory.image = null;

  var captureImage = false;// frame.memory.image == null && !mouseOnFrame;
  var drawingImage = false;// !mouseOnFrame && frame.memory.image != null &&  !captureImage;

  if(drawingImage) {
    graphics.drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
  } else {
    if(captureImage) {
      // TODO refactor to not reassign context

      // var newCanvas = document.createElement("canvas");
      // newCanvas.width = frame.width;
      // newCanvas.height = frame.height;
      // var newContext = newCanvas.getContext("2d");
      // newContext.clearRect(0, 0, frame.width, frame.height);
      // var mainContext = context;
      // context = newContext;
      // var prevFx = frame.x;
      // var prevFy = frame.y;
      // frame.x = 0;
      // frame.y = 0;
      // setFill('white');
      // fRect(0, 0, frame.width, frame.height);
    }

    graphics.context.save();
    graphics.clipRectangle(frame.x, frame.y, frame.width, frame.height);

    over = IntervalTableDraw.drawCircularIntervalsFlowTable(frame, frame.memory.flowIntervals, frame.getCenter(), frame.memory.radius * frame.memory.zoom, frame.memory.r0, frame.memory.actualColorList, frame.memory.categories, true, frame.memory.angles, frame.memory.angle0);
    
    frame.memory.zoom = Math.max(Math.min(frame.memory.zoom, 2000), 0.08);

    if(frame.memory.names) {
      var a;
      var r = frame.memory.radius * frame.memory.zoom + 8;

      graphics.setText('black', 14, null, 'center', 'middle');

      frame.memory.names.forEach(function(name, i) {
        a = frame.memory.angle0 + frame.memory.angles[i];

        graphics.fTextRotated(String(name), frame.getCenter().x + r * Math.cos(a), frame.getCenter().y + r * Math.sin(a), a + HalfPi);
      });
    }

    graphics.context.restore();


    if(captureImage) {
      // TODO refactor to not reassign context
      // context = mainContext;
      // frame.memory.image = new Image();
      // frame.memory.image.src = newCanvas.toDataURL();
      // frame.x = prevFx;
      // frame.y = prevFy;
      // drawImage(frame.memory.image, frame.x, frame.y, frame.width, frame.height);
    }
  }

  return over;
};
