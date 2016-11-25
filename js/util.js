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
		var paths = runBFS(nodes,edges)
		animate(paths,0)
		}
		else{
			document.getElementById('recognize').value = "Re-run BFS"
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
