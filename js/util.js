	function RunShortestPath(fig){

		var nodes = fig.getNodes
		var edges = fig.getUndirected

		if(nodes.length == 0 || edges.length > combinations(nodes.length,2)){
			alert("Not a graph")
			return
		}

		Recognize(fig)
		ClearAnimation()

		var paths = Shortest(nodes,edges)
		fig.oldpaths = paths
		animate(paths,0)
	}

	function Shortest(nodes,edges){

		var paths = []
		var select = document.getElementById("sourcenode")
		var src = select.selectedIndex
		select = document.getElementById("destnode")
		dest = select.selectedIndex

		// Animate only node if source = destination
		if(src == dest){
			paths.push(nodes[src].path)
			return paths
		}

		var queue = new PriorityQueue();
		for(var i = 0; i < nodes.length; i++){
			if(i==src){
				nodes[i].path.data.priority = 0
			}
			else{
				nodes[i].path.data.priority = Infinity
			}
			nodes[i].path.data.prevEdgeId = -1
			queue.enqueue(nodes[i], nodes[i].path.data.priority);	
		}
		
		var visited = new Array(nodes.length)
		for(var i=0;i<nodes.length;i++)
			visited[i] = false

		while(!queue.isEmpty()){
			var node = queue.dequeue()

			// No path to destination node
			if(!node || node.path.data.priority == Infinity)
				break

			
			// If reached destination node
			if(node.getId == dest){
				while(node.path.data.prevEdgeId != -1){
					var prevEdge = edges[node.path.data.prevEdgeId]
					paths.push(node.path)
					paths.push(prevEdge.path)
					if(prevEdge.getStart.getId == node.getId)
						node = prevEdge.getEnd
					else
						node = prevEdge.getStart
				}
				paths.push(node.path)
				paths.reverse()
				return paths
			}
			
			visited[node.getId] = true
			// Relax neighbors
			for(var i = 0;i < node.getEdges.length; i++){
				var edge = node.getEdges[i]
				var othernode
				if(edge.getStart.getId == node.getId)
					othernode = edge.getEnd
				else
					othernode = edge.getStart
				if( visited[othernode.getId] == false){
					if(othernode.path.data.priority > node.path.data.priority + edge.getValue){
						othernode.path.data.priority = node.path.data.priority + edge.getValue
						othernode.path.data.prevEdgeId = edge.getId
						queue.enqueue(othernode,othernode.path.data.priority)
					}
				}

			}
		}
		alert('No path exists between ' + nodes[src].getName + ' and ' + nodes[dest].getName +' !')
		return paths
	}

	function Recognize(fig){
		console.log("Num of nodes : " + fig.getNodes.length)
		console.log("Num of edges : " + fig.getUndirected.length)
		var nodes = fig.getNodes
		var edges = fig.getUndirected

		if(nodes.length == 0 || edges.length > combinations(nodes.length,2)){
			alert("Not a graph")
			return
		}

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
		
	}

	function BFS(){
		var nodes = fig.getNodes
		var edges = fig.getUndirected

		if(nodes.length == 0 || edges.length > combinations(nodes.length,2)){
			alert("Not a graph")
			return
		}
		var select = document.getElementById("startnodes")
		fig.setStartNode = select.selectedIndex

		Recognize(fig)
		ClearAnimation()
		
		var paths = runBFSOnGraph(nodes,edges)
		fig.oldpaths = paths
		animate(paths,0)
	}


	// sleep time expects milliseconds
	function sleep (time) {
	  return new Promise((resolve) => setTimeout(resolve, time));
	}

	function animate(paths,index){
	// Usage!
	if(index == paths.length)
			return
	sleep(1000).then(() => {
	    // Do something after the sleep!
	    paths[index].data.originalStrokeColor = paths[index].strokeColor
	    paths[index].strokeColor = 'black'
	    paths[index].data.originalStrokeWidth = paths[index].strokeWidth
	    paths[index].strokeWidth = 5
	    animate(paths,index+1)
	});
	}

	function runBFSOnGraph(nodes,edges){
		var paths = []
		var visited = new Array(nodes.length)
		for(var i=0;i<nodes.length;i++)
			visited[i] = false
		paths = paths.concat(runBFS(nodes,edges,visited,fig.getStartNode))
		for(var i=0;i<nodes.length;i++){
			if(visited[i] == false)
				paths = paths.concat(runBFS(nodes,edges,visited,i))
		}
		return paths
	}

	function runBFS(nodes,edges,visited,index){
		var paths = []
		var Q = []
		Q.push(index)
		visited[index] = true
		paths.push(nodes[index].path)

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
		return points.length > 50 && feature_f5(points)<=25 && Math.abs(totalDeviation) < 1000 && containsCenter
	}  

	function isLine(points){
		return feature_f5(points)/feature_f8(points) > 0.9 && points[0].distance(points[points.length-1]) > 35
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

	function ClearAnimation(){
		for(var i=0;i<fig.oldpaths.length;i++){
				fig.oldpaths[i].strokeColor = fig.oldpaths[i].data.originalStrokeColor
				fig.oldpaths[i].strokeWidth = fig.oldpaths[i].data.originalStrokeWidth
			}
	}

	function toggleMenu() {
	  var menuBox = document.getElementById('menu');    
	  if(menuBox.style.display == "block") { // if is menuBox displayed, hide it
	    menuBox.style.display = "none"
	    document.getElementById('showmenubtn').style.display = "block"
	  }
	  else { // if is menuBox hidden, display it
	    menuBox.style.display = "block"
	    document.getElementById('showmenubtn').style.display = "none"
	  }
	}

	//Run DFS on Graph
	function DFS() {
		var nodes = fig.getNodes
		var edges = fig.getUndirected

		if(nodes.length == 0 || edges.length > combinations(nodes.length,2)){
			alert("Not a graph")
			return
		}

		var select = document.getElementById("startnodes")
		fig.setStartNode = select.selectedIndex

		Recognize(fig)
		ClearAnimation()

		var paths = runDFSOnGraph(nodes,edges)
		fig.oldpaths = paths
		animate(paths,0)
	}

	function runDFSOnGraph(nodes,edges){
		var paths = []
		var path = []
		var visited = new Array(nodes.length)
		for(var i=0;i<nodes.length;i++)
			visited[i] = false
		runDFS(nodes,edges,visited,fig.getStartNode,path)
		paths = paths.concat(path)
		path.length = 0
		for(var i=0;i<nodes.length;i++){
			if(visited[i] == false){
				runDFS(nodes,edges,visited,i,path)
			}
		}
		paths = paths.concat(path)
		return paths
	}

	function runDFS(nodes,edges,visited,index,paths){
		visited[index] = true
		paths.push(nodes[index].path)
		var node = nodes[index]

		for(var i = 0;i < node.getEdges.length; i++){
			var edge = node.getEdges[i]
			var othernode
			if(edge.getStart.getId == node.getId)
				othernode = edge.getEnd
			else
				othernode = edge.getStart

			if(visited[othernode.getId] == false){
				paths.push(edge.path)
				runDFS(nodes,edges,visited,othernode.getId,paths)
			}
		}
	}