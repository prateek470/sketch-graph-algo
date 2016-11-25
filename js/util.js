	function Recognize(fig){
		console.log("Num of nodes : " + fig.getNodes.length)
		console.log("Num of edges : " + fig.getUndirected.length)
		var nodes = fig.getNodes
		var edges = fig.getUndirected

		if(nodes.length == 0 || edges.length > combinations(nodes.length,2)){
			alert("Not a graph")
			return
		}

		if(reRunFlag == false){
		for(var i = 0; i < edges.length; i++){
			var edge = edges[i]

			var node = getClosest(edge.endpoints[0], nodes)
			edge.setStart = node
			node.addEdge(edge)

			node = getClosest(edge.endpoints[1], nodes)
			edge.setEnd = node
			node.addEdge(edge)
		}

		var matrix = new Array(nodes.length)
		for(var i = 0; i < nodes.length; i++){
			matrix[i] = new Array(nodes.length)
			for(var j = 0; j < nodes.length; j++)
				matrix[i][j] = 0
		}

		for(var i = 0; i < edges.length; i++){
			var edge = edges[i]
			matrix[edge.getStart.getId][edge.getEnd.getId] = 1
			matrix[edge.getEnd.getId][edge.getStart.getId] = 1
		}

		console.log(JSON.stringify(matrix))
		reRunFlag = true
		document.getElementById('recognize').value = "Re-run BFS"
		var paths = runBFS(nodes,edges)
		animate(paths,0)
		}
		else{
			var paths = runBFS(nodes,edges)
			for(var i=0;i<paths.length;i++){
				paths[i].strokeColor = paths[i].data.originalStrokeColor
				paths[i].strokeWidth = paths[i].data.originalStrokeWidth
			}
			animate(paths,0)
		}
		
	}

	// sleep time expects milliseconds
	function sleep (time) {
	  return new Promise((resolve) => setTimeout(resolve, time));
	}

	function animate(paths,index){
	// Usage!
	if(index == paths.length)
			return
	sleep(1500).then(() => {
	    // Do something after the sleep!
	    paths[index].data.originalStrokeColor = paths[index].strokeColor
	    paths[index].strokeColor = 'black'
	    paths[index].data.originalStrokeWidth = paths[index].strokeWidth
	    paths[index].strokeWidth = 5
	    animate(paths,index+1)
	});
	}

	function runBFS(nodes,edges){
		var paths = []
		var visited = new Array(nodes.length)
		for(var i=0;i<nodes.length;i++)
			visited[i] = false

		Q = []
		Q.push(fig.getStartNode)
		visited[fig.getStartNode] = true
		paths.push(nodes[fig.getStartNode].path)

		while(Q.length > 0){
			var node = nodes[Q.shift()]
			for(var i = 0;i < node.getEdges.length; i++){
				var edge = node.getEdges[i]
				var othernode
				if(edge.getStart.getId == node.getId)
					othernode = edge.getEnd
				else
					othernode = edge.getStart
				if( visited[othernode.getId] == false){
					paths.push(edge.path)
					paths.push(othernode.path)
					Q.push(othernode.getId)
					visited[othernode.getId] = true
				}
			}
		}
		return paths
	}

	function getClosest(point, nodes){
		var min = point.distance(nodes[0].getCenter)
		var closest = nodes[0]
		for(var i=1;i<nodes.length;i++){
			if(min > point.distance(nodes[i].getCenter)){
				min = point.distance(nodes[i].getCenter)
				closest = nodes[i]
			}
		}
		return closest
	}

	function product_Range(a,b) {  
	  var prd = a,i = a;  
	   
	  while (i++< b) {  
	    prd*=i;  
	  }  
	  return prd;  
	}  
  
  
	function combinations(n, r)   
	{  

	  if(r>n)
	  	return 0;
	  if (n==r)   
	  {  
	    return 1;  
	  }   
	  else   
	  {  
	    r=(r < n-r) ? n-r : r;  
	    return product_Range(r+1, n)/product_Range(1,n-r);  
	  }  
	}

	function isCircle(points,path){
		var BB = new srlib.core.data.container.BoundingBox(stroke);
		var radius = BB.getCenterPoint().distance(BB.getTopCenterPoint())
		var center = new srlib.core.data.container.Point( ((BB.getMaxX() + BB.getMinX()  )/2  ) ,( ( BB.getMaxY() + BB.getMinY() )/2 ) )
		var maxDeviation = 0
		var totalDeviation = 0
		var containsCenter = path.contains(center)
		for(var i=0;i < points.length;i++){
			var dist = points[i].distance(center)
			var deviation = dist - radius
			totalDeviation += deviation
			if(maxDeviation < deviation)
				maxDeviation = deviation
		}
		console.log("Total : " + totalDeviation)
		console.log("Contains center : " + containsCenter)
		return points.length > 20 && feature_f5(points)<=10 && Math.abs(totalDeviation) < 750 && containsCenter
	}  

	function isLine(points){
		return feature_f5(points)/feature_f8(points) > 0.9
	}

	function Original(fig){
		var nodes = fig.getNodes
		var edges = fig.getUndirected
		if(document.getElementById('original').value == "Show Original"){
			document.getElementById('original').value = "Hide Original"
			for(var i = 0; i < nodes.length; i++)
				nodes[i].original.visible = true
			for(var i = 0; i < edges.length; i++)
				edges[i].original.visible = true
		}else{
			document.getElementById('original').value = "Show Original"
			for(var i = 0; i < nodes.length; i++)
				nodes[i].original.visible = false
			for(var i = 0; i < edges.length; i++)
				edges[i].original.visible = false
		}
	}
