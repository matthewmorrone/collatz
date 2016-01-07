function init() {
	// The following method will parse the related sigma instance nodes
	// and set their positions around a circle:
	sigma.publicPrototype.circular = function() {
		var R = 100,
			i = 0,
			L = this.getNodesCount();
		this.iterNodes(function(n) {
			n.x = Math.cos(Math.PI * (i++) / L) * R;
			n.y = Math.sin(Math.PI * (i++) / L) * R;
		});
		return this.position(0, 0, 1).draw();
	};
	// The following method will parse the related sigma instance nodes
	// and set its position to as random in a square around the center:
	sigma.publicPrototype.random = function() {
		var W = 100,
			H = 100;
		this.iterNodes(function(n) {
			n.x = W * Math.random();
			n.y = H * Math.random();
		});
		return this.position(0, 0, 1).draw();
	};
	// Instanciate sigma.js and customize it :
	var s = sigma.init(document.getElementById('sigma-example')).drawingProperties({
		defaultLabelColor: '#fff'
	});
	var i, N = 500,
		E = 3000;
	for (i = 0; i < N; i++) {
		s.addNode('n' + i, {
			'x': Math.random(),
			'y': Math.random(),
			'label': 'Node ' + i,
			'size': 0.5 + 4.5 * Math.random(),
			'color': 'rgb(' + Math.round(Math.random() * 256) + ', ' + Math.round(Math.random() * 256) + ', ' + Math.round(Math.random() * 256) + ')'
		});
	}
	for (i = 0; i < E; i++) {
		s.addEdge(i, 'n' + (Math.random() * N | 0), 'n' + (Math.random() * N | 0));
	}
	// Draw the graph :
	s.draw();
	// Finally, let's bind our methods to some buttons:
	document.getElementById('circular').addEventListener('click', function() {
		s.circular();
	}, true);
	document.getElementById('random').addEventListener('click', function() {
		s.random();
	}, true);
}
