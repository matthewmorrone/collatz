import NumberList from "src/dataTypes/numeric/NumberList";
import Interval from "src/dataTypes/numeric/Interval";
import NumberOperators from "src/operators/numeric/NumberOperators";

/**
 * @classdesc NumberList Generators
 *
 * @namespace
 * @category numbers
 */
function NumberListGenerators() {}
export default NumberListGenerators;

/**
 * Generate a NumberList with sorted Numbers
 * @param {Number} nValues length of the NumberList
 *
 * @param {Number} start first value
 * @param {Number} step increment value
 * @return {NumberList} generated NumberList
 * tags:generator
 */
NumberListGenerators.createSortedNumberList = function(nValues, start, step) {
  start = start || 0;
  step = step || 1;
  if(step === 0) step = 1;
  var i;
  var numberList = new NumberList();
  for(i = 0; i < nValues; i++) {
    numberList.push(start + i * step);
  }
  return numberList;
};

/**
 * creates a list with numbers within a range defined by an interval
 * @param  {Number} nValues
 *
 * @param  {Interval} interval range of the numberList
 * @param  {Number} mode <br>0:random <br>1:evenly distributed (not yet deployed)
 * @param  {Number} seed optional seed for random numbers ([!] not yet working @todo: finish)
 * @return {NumberList}
 * tags:random,generator
 */
NumberListGenerators.createNumberListWithinInterval = function(nValues, interval, mode, randomSeed) {
  if(interval == null) interval = new Interval(0, 1);
  mode = mode==null?0:mode;

  var numberList = new NumberList();
  var range = interval.getAmplitude();
  var min = Number(interval.getMin());
  var i;
  switch(mode){
    case 0://random
      for(i = 0; i < nValues; i++) {
        numberList.push(min + Number(Math.random() * range));
      }
      break;
  }
  
  return numberList;
};

/**
 * generates a numberList with random numbers in a normal distribution
 * @param  {Number} nValues size of generated numberList
 * @param  {Number} mean
 * @param  {Number} standardDeviation
 * @return {NumberList}
 * tags:random,generator,statistics
 */
NumberListGenerators.createRandomNormalDistribution = function(nValues, mean, standardDeviation) {
  var nL = new mo.NumberList();
  var i;
  
  for(i=0; i<nValues; i++){
    nL.push(NumberOperators.normal(mean,standardDeviation));
  }
  
  return nL;
};

/**
 * generates a numberList with random numbers in a beta PERT distribution
 * @param  {Number} nValues size of generated numberList
 * @param  {Number} min value of generated numbers
 * @param  {Number} max value of generated numbers
 * @param  {Number} mode most common value of generated numbers
 * @param  {Number} lambda shape parameter. Larger values have flatter tails in the distribution
 * @param  {Number} seed optional seed for random numbers
 * @return {NumberList}
 * tags:random,generator,statistics
 */
NumberListGenerators.createRandomBetaPERTDistribution = function(nValues,min,max,mode,lambda,randomSeed) {
  min = (min == null) ? 0 : min;
  max = (max == null) ? 1 : max;
  mode = (mode == null) ? .5 : mode;
  lambda = (lambda == null) ? 1 : lambda;
  if(randomSeed)
    NumberOperators.randomSeed(randomSeed);
  var nL = new mo.NumberList();
  var i;
  
  for(i=0; i<nValues; i++){
    nL.push(NumberOperators.betaPERT(min,max,mode,lambda));
  }
  if(randomSeed)
    NumberOperators.randomSeedPop();
  return nL;
};

/**
 * generates a numberList with random numbers in a bimodal distribution
 * @param  {Number} nValues size of generated numberList
 * @param  {Number} min value of generated numbers
 * @param  {Number} max value of generated numbers
 * @param  {Number} mode1 value of one peak
 * @param  {Number} mode2 value of second peak
 * @param  {Number} lambda shape parameter. Larger values have flatter tails in the distribution
 * @param  {Number} balance number in range [0,1], fraction of samples surrounding peak2
 * @param  {Number} seed optional seed for random numbers
 * @return {NumberList}
 * tags:random,generator,statistics
 */
NumberListGenerators.createRandomBimodalDistribution = function(nValues,min,max,mode1,mode2,lambda,balance,randomSeed) {
  min = (min == null) ? 0 : min;
  max = (max == null) ? 1 : max;
  mode1 = (mode1 == null) ? .25 : mode1;
  mode2 = (mode2 == null) ? .75 : mode2;
  lambda = (lambda == null) ? 1 : lambda;
  balance = (balance == null) ? .5 : balance;
  if(randomSeed!=null)
    NumberOperators.randomSeed(randomSeed);
  var nL = new mo.NumberList();
  var i;
  
  for(i=0; i<nValues; i++){
    if(NumberOperators.random() > balance)
      nL.push(NumberOperators.betaPERT(min,max,mode1,lambda));
    else
      nL.push(NumberOperators.betaPERT(min,max,mode2,lambda));
  }
  if(randomSeed)
    NumberOperators.randomSeedPop();
  return nL;
};

/**
 * creates a list with random numbers
 *
 * @param  {Number} nValues
 *
 * @param  {Interval} interval range of the numberList
 * @param  {Number} seed optional seed for seeded random numbers
 * @return {NumberList}
 * tags:random,generator
 */
NumberListGenerators.createRandomNumberList = function(nValues, interval, seed, func) {
  seed = seed == null ? -1 : seed;
  interval = interval == null ? new Interval(0, 1) : interval;

  var numberList = new NumberList();
  var amplitude = interval.getAmplitude();

  var random = seed == -1 ? Math.random : new NumberOperators._Alea("my", seed, "seeds");

  for(var i = 0; i < nValues; i++) {
    //seed = (seed*9301+49297) % 233280; //old method, close enough: http://moebio.com/research/randomseedalgorithms/
    //numberList[i] = interval.x + (seed/233280.0)*amplitude; //old method

    numberList[i] = func == null ? (random() * amplitude + interval.x) : func(random() * amplitude + interval.x);
  }

  return numberList;
};
