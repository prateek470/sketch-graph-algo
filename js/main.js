function onResize(event) {
	// Whenever the window is resized, recenter the path:
	path.position = view.center;
}

var mouseMovepath = new Path.Circle({
    center: [0, 0],
    radius: 5,
    fillColor: 'yellow'
});

function onMouseDown(event) {
	// PaperJS add a new Path object and initial starting point
	path = new Path();
	path.strokeColor = 'black';
	path.strokeWidth = 2;
	path.add(event.point);
	
	// SRLlib add a new Stroke object and initial starting point
	stroke = new srlib.core.data.container.Stroke();
	point = new srlib.core.data.container.Point(event.point.x,event.point.y)
	if (typeof sketch == "undefined") {
		sketch = new srlib.core.data.container.Sketch();
	}
	sketch.addStroke(stroke);
	sketch.addPoint(point);
	stroke.addPoint(point);
}

function onMouseDrag(event) {
	// PaperJS add points to Path object on mouse drag
	path.add(event.point);
	// SRLlib add points to Stroke on mouse drag
	point = new srlib.core.data.container.Point(event.point.x,event.point.y)
	sketch.addPoint(point);
	stroke.addPoint(point);
}

function onMouseMove(event) {
	// Whenever the user moves the mouse, move the path
    // to that position:
	mouseMovepath.position = event.point;
}


function onMouseUp(event) {	
	
	// Add evaluation / recognition functions or whatever you want here!
	var points = stroke.getPoints();
	// <!-- Circle -->
	 
 	if(isScribble(points,path)){
 		path.remove()
 	}else if(isCircle(points,path)){ 
		var BB = new srlib.core.data.container.BoundingBox(stroke);
		var center = new Point( ((BB.getMaxX() + BB.getMinX()  )/2  ) ,( ( BB.getMaxY() + BB.getMinY() )/2 ) )
		var myCircle = new Path.Circle(center, 30);
		myCircle.strokeColor = 'red';
		path.visible = false;

		// <!-- Update model -->
		var node  = new Node(fig.getNodes.length)
		node.setCenter = new srlib.core.data.container.Point(center.x,center.y)
		node.path = myCircle
		node.original = path

// <!-- Add node name -->
		var text = new PointText(center);
		text.fillColor = 'black';
		text.fontSize = 15
		text.justification = 'center'
		node.setName = 	String.fromCharCode('A'.charCodeAt() + node.getId)
		text.content = node.getName
		text.data.nodeId = node.getId
		text.onClick = function(){
			var box = document.createElement('input'); // creates the element
			box.id = this.data.nodeId
			box.style.position = 'absolute';  // position it
			box.style.left = center.x;
			box.style.top = center.y;  
			box.style.width = 75
			box.oninput = function(){
				fig.getNodes[this.id].setName = this.value
				text.content = fig.getNodes[this.id].getName
			}
			box.onkeyup = function(e){
				if (e.keyCode == 13){
					document.body.removeChild(box)
					console.log(fig.getUndirected)
					document.getElementById("startnodes").options[this.id].text = this.value
					document.getElementById("sourcenode").options[this.id].text = this.value
					document.getElementById("destnode").options[this.id].text = this.value
				}
			}
			document.body.appendChild(box)
			box.focus()
		}


// <!-- Add node to figure -->
		fig.addNode(node) 

		// <!-- Add nodes to dropdowns -->
		var select = document.getElementById("startnodes")
        var option = document.createElement('option')
        option.text = node.getName
        option.value = node.getId
        select.add(option)

        select = document.getElementById("sourcenode")
        option = document.createElement('option')
        option.text = node.getName
        option.value = node.getId
    	select.add(option)

    	select = document.getElementById("destnode")
    	option = document.createElement('option')
        option.text = node.getName
        option.value = node.getId
    	select.add(option)

	}
	// <!-- Line -->
	else if(isLine(points)){
		var isDirectedEdge = document.getElementById("directedgraph").checked;
		var myLine = new Path.Line(points[0],points[points.length-1])
		myLine.strokeColor = 'blue';
		path.visible = false;

		if(isDirectedEdge){
			path.simplify(10); 
		    var point = path.getPointAt(path.length)
		    var vector  = point.subtract(path.getPointAt(path.length/2)); 
		    var arrowVector = vector.normalize(12);
		    var arrowPath = new Path({
		      segments: [point.add(arrowVector.rotate(145)), point, point.add(arrowVector.rotate(-145))],
		      fillColor: 'blue',
		      strokeWidth: 1,              
		    });
		}

		// <!-- Update model -->
		var edge = new Edge(fig.getUndirected.length)
		edge.endpoints = []
		edge.endpoints.push(points[0])
		edge.endpoints.push(points[points.length-1])
		edge.path = myLine
		edge.arrowPath = arrowPath //only in case of directed graph
		if(isDirectedEdge)
			edge.isDirectedEdge = true
		else
			edge.isDirectedEdge = false
		edge.original = path
		fig.addUndirected(edge)

		// <!-- Edge weight -->
		var center = new Point ((points[0].getX()+points[points.length-1].getX())/2, (points[0].getY()+points[points.length-1].getY())/2)
		var text = new PointText(center);
		text.data.edgeId = edge.getId
		text.fillColor = 'black';
		text.fontSize = 15
		text.justification = 'left'
		text.content = 0
		text.onClick = function(){
			var box = document.createElement('input'); // creates the element
			box.id = this.data.edgeId
			box.style.position = 'absolute';  // position it
			box.style.left = center.x;
			box.style.top = center.y;  
			box.style.width = 25
			box.oninput = function(){
				fig.getUndirected[this.id].setValue = parseInt(this.value)
				text.content = fig.getUndirected[this.id].getValue
			}
			box.onkeyup = function(e){
				if (e.keyCode == 13){
					document.body.removeChild(box)
					console.log(fig.getUndirected)
				}
			}
			document.body.appendChild(box)
			box.focus()
		}
		// <!-- Associate text with the edge -->
		edge.text = text
	}
	// <!-- Not recognized -->
	else{
		path.removeSegments()
	}
}
