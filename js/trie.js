var forEach = function(array, fn) {
	for (var i = 0; i < array.length; i++) {
		fn(array[i], i);
	}
}
var Trie = function(value) {
	this.value = value ? value[0] : '';
	this.children = [];
	this.stop = false;
	if (value) {
		var rest = value.substr(1, value.length);
		if (rest.length) {
			this.children.push(new Trie(rest));
		}
		else {
			this.stop = true;
		}
	}
}
Trie.prototype.insert = function(value, place) {
	place = place || 0;
	if (place === value.length) {
		this.stop = true;
	}
	else {
		var character = value[place];
		var returned = false;
		forEach(this.children, function(child) {
			if (child.value === character) {
				child.insert(value, place + 1);
				returned = true;
			}
		})
		if (!returned) {
			var rest = value.substr(place, value.length);
			this.children.push(new Trie(rest));
		}
	}
}
Trie.prototype.reconstruct = function(value, results) {
	value = value || '';
	results = results || [];
	value = value + this.value;
	if (this.stop) {
		results.push(value);
	}
	if (this.children.length) {
		forEach(this.children, function(child) {
			results = results.concat(child.reconstruct(value));
		})
	}
	return results;
}


var forEach = function(array, fn) {
	for (var i = 0; i < array.length; i++) {
		fn(array[i], i);
	}
}
var TrieDocument = function(value) {
	this.value = value ? value.data[0] : '';
	this.children = [];
	this.locations = [];
	this.stop = false;
	if (value) {
		value.data = value.data.substr(1, value.data.length);
		if (value.data.length) {
			this.children.push(new TrieDocument(value));
		}
		else {
			this.stop = true;
			this.locations.push(value.location)
		}
	}
}
TrieDocument.prototype.insert = function(value, place) {
	if (place === undefined) {
		place = 0;
	}
	if (place === value.data.length) {
		this.stop = true;
		this.locations.push(value.location);
	}
	else {
		var character = value.data[place];
		var returned = false;
		forEach(this.children, function(child) {
			if (child.value === character) {
				child.insert(value, place + 1);
				returned = true;
			}
		})
		if (!returned) {
			value.data = value.data.substr(place, value.data.length);
			this.children.push(new TrieDocument(value));
		}
	}
}
TrieDocument.prototype.reconstruct = function(value, results) {
	value = value || '';
	results = results || [];
	value = value + this.value;
	if (this.stop) {
		forEach(this.locations, function(idx) {
			results[idx] = value;
		})
	}
	if (this.children.length) {
		forEach(this.children, function(child) {
			results = child.reconstruct(value, results);
		})
	}
	return results;
}
TrieDocument.prototype.insertDocument = function(document) {
	var splitDocument = document.split(' ');
	for (var k = 0; k < splitDocument.length; k++) {
		if (splitDocument[k].length > 0) {
			this.insert({
				data: splitDocument[k],
				location: k
			});
		}
	}
}
