var count = function(txt, rank) {
	var wordFreq = {};
	var words = txt.split(' ');
	for (i = 0; i < words.length; i++) {
		var current = words[i];
		var last = current.length - 1;
		current = noPunc(current);
		if (notInArray(current, particle) && !wordFreq[current]) {
			wordFreq[current] = 1;
		}
		else if (wordFreq[current]) {
			wordFreq[current] += 1;
		}
	}
	if (rank) {
		return ranking(wordFreq);
	}
	else {
		return wordFreq
	}
};
var ranking = function(list) {
	var ranks = [{
		word: null,
		count: 0
	}, {
		word: null,
		count: 0
	}, {
		word: null,
		count: 0
	}];
	for (var word in list) {
		if (list[word] > ranks[0].count) {
			swap(ranks[2], ranks[1]);
			swap(ranks[1], ranks[0]);
			ranks[0].word = word;
			ranks[0].count = list[word];
		}
		else if (list[word] > ranks[1].count || list[word] === ranks[0].count) {
			swap(ranks[2], ranks[1]);
			ranks[1].word = word;
			ranks[1].count = list[word];
		}
		else if (list[word] > ranks[2].count || list[word] === ranks[1].count) {
			ranks[2].word = word;
			ranks[2].count = list[word];
		}
	}
	return ranks;
}
var gramAnalysis = function(text) {
	var lines = text.split(". ");
	var grammar = [];
	var Eval = {};
	forEach(lines, function(line) {
		var pieces = line.split(/(\s|\,|\(|\)|\:|\;|\")/);
		var chunk = '';
		forEach(pieces, function(piece) {
			piece = piece.toLowerCase();
			if (isPart(piece)) {
				chunk = chunk + piece;
			}
			else if (isPunc(piece)) {
				chunk = chunk + piece;
			}
			else if (/[a-z\d]/.test(piece)) {
				chunk = chunk + "-";
			}
		});
		grammar.push(chunk);
	});
	var lineNum = grammar.length;
	var contentWords = 0;
	var grammarWords = 0;
	var commas = 0;
	forEach(grammar, function(line) {
		var elements = line.split(/(\-|[A-Za-z]+)/)
		forEach(elements, function(elem) {
			if (elem === '-') {
				contentWords += 1;
			}
			else if (isPart(elem)) {
				grammarWords += 1;
			}
			else if (elem === ',') {
				commas += 1;
			}
		})
	})
	Eval.contentWordsPerLine = (contentWords / lineNum);
	Eval.grammarWordsPerLine = (grammarWords / lineNum);
	Eval.commasPerLine = (commas / lineNum);
	return ({
		grammarSchema: grammar,
		grammarEval: Eval
	});
};
var notInArray = function(word, array) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === word) {
			return false;
		}
	}
	return true;
};
var forEach = function(array, fn) {
	for (var i = 0; i < array.length; i++) {
		fn(array[i]);
	}
}
var noPunc = function(word) {
	var beg = word[0];
	var end = word.length - 1;
	if (isPunc(beg)) {
		word = word.slice(1, word.length);
		return word;
	}
	else if (isPunc(end)) {
		word = word.slice(0, end);
		return word;
	}
};
var isPunc = function(char) {
	for (var i = 0; i < punctuation.length; i++) {
		if (char === punctuation[i]) {
			return true;
		}
	}
	return false;
};
var isPart = function(word) {
	for (var i = 0; i < particle.length; i++) {
		if (word === particle[i]) {
			return true;
		}
	}
	return false;
};
var swap = function(a, b) {
	a.word = b.word;
	a.count = b.count;
}
var particle = ['in', 'at', 'on', 'of', 'and', 'but', 'this', 'that', 'and', 'or', 'to', 'the', 'a', 'as', 'from', 'because', 'therefore', 'however'];
var punctuation = ['.', ',', '!', '?', '(', ')', '!', ':', '[', ']', '"', "'", '{', '}'];
