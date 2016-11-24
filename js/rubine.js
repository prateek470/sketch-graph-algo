	function feature_f5(p){
		return p[0].distance(p[p.length-1]);
	}

	function feature_f8(p){
		var f8 = 0;		
		var var1 = 0;
		var var2 = 0;
		for (var i = 0; i < p.length-1; i++) {
			var1 = p[i].getX() - p[i+1].getX()
			var2 = p[i].getY() - p[i+1].getY()
			f8 += Math.sqrt(var1 * var1 + var2 * var2);
		}
		return f8;
	}