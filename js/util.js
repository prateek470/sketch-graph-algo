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
