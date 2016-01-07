var log = console.log.bind(console)

var nativeRandom = Math.random
Math.random = function(min, max, round, mt) {
	if (arguments.length === 0) {
		return nativeRandom()
	}
	if (!round) {
		round = 1
	}
	if (!max) {
		var max = min
		min = 1
	}
	if (mt) {
		min = parseInt(min, 10)
		max = parseInt(max, 10)
	}
	return Math.floor(nativeRandom() * (max - min + 1)) + min
}

sigma.canvas.nodes.def = function(node, context, settings) {

	// Bit technical, determining the prefix on which the renderer must act
	var prefix = settings('prefix') || '';

	// Creating a circle and filling it with the desired color
	// This is plain canvas
	context.fillStyle = node.color || settings('defaultNodeColor');
	context.beginPath();
	context.arc(
		node[prefix + 'x'],
		node[prefix + 'y'],
		node[prefix + 'size'],
		0,
		Math.PI * 2,
		true
	);

	context.closePath();
	context.fill();
};
sigma.classes.graph.addMethod('hasNode', function(nodeId) {
	return this.nodes(nodeId) ? true : false
})
sigma.classes.graph.addMethod('hasEdge', function(edgeId) {
	// log(this.edges(), this.allNeighborsIndex)
	return this.edges(edgeId) ? true : false
})

sigma.classes.graph.addMethod('neighbors', function(nodeId) {
	var k, neighbors = {}, index = this.allNeighborsIndex[nodeId] || {};
	for (k in index) {
		neighbors[k] = this.nodesIndex[k];
	}
	return neighbors
})
function circular(s) {
	s.graph.nodes().forEach(function(node, i, a) {
		node.x = Math.cos(Math.PI * 2 * i / a.length)
		node.y = Math.sin(Math.PI * 2 * i / a.length)
	})
	s.refresh()
}
sigma.classes.graph.addMethod('random', function() {
	var W = 100, H = 100;
	this.iterNodes(function(n){
		n.x = W * Math.random()
		n.y = H * Math.random()
	})
	return this.position(0, 0, 1).draw()
})
// declare new node shapes
sigma.canvas.labels.rectangle = function(node, context, settings) {
    // declarations
    var prefix = settings('prefix') || '';
    var size = node[prefix + 'size'];
    var nodeX = node[prefix + 'x'];
    var nodeY = node[prefix + 'y'];
    var textWidth;
    // define settings
    context.fillStyle = node.textColor;
    context.lineWidth = size * 0.1;
    context.font = '400 ' + size + 'px AvenirNext';
    context.textAlign = 'center';
    context.fillText(node.label, nodeX, nodeY + size * 0.375);
    // measure text width
    textWidth = context.measureText(node.label).width
    node.labelWidth = textWidth; // important for clicks
};
sigma.canvas.nodes.rectangle = function(node, context, settings) {
    // declarations
    var prefix = settings('prefix') || '';
    var size = node[prefix + 'size'];
    var nodeX = node[prefix + 'x'];
    var nodeY = node[prefix + 'y'];
    var textWidth;
    // define settings
    context.fillStyle = node.fillColor;
    context.strokeStyle = node.color || settings('defaultNodeColor');
    context.lineWidth = size * 0.1;
    context.font = '400 ' + size + 'px AvenirNext';
    // measure text width
    textWidth = context.measureText(node.label).width;
    // draw path
    context.beginPath();
    context.rect(
        nodeX - (textWidth * 1.2) * 0.5,
        nodeY - size * 1.2 * 0.5,
        textWidth * 1.2,
        size * 1.2
    );
    context.closePath();
    context.fill();
    context.stroke();
};




function fruchtermanReingold(s) {
	var frListener = sigma.layouts.fruchtermanReingold.configure(s, {
		iterations: 500,
		easing: 'quadraticInOut',
		duration: 800
	})
	frListener.bind('start stop interpolate', function(e) {
		log(e.type)
	})
	sigma.layouts.fruchtermanReingold.start(s)
	return frListener
}
function forceAtlas(s) {
	var fa = sigma.layouts.configForceLink(s, {
		worker: true,
		barnesHutOptimize: false,
		autoStop: true,
		background: true,
		easing: 'cubicInOut',
		alignNodeSiblings: true,
		nodeSiblingsScale: 1,
		nodeSiblingsAngleMin: 0.3
	})
	fa.bind('start stop', function(e) {
		console.log(e.type)
	})
	sigma.layouts.startForceLink()
	return fa
	
}

