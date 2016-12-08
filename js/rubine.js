	//Start and EndPoint distance
	function feature_f5(p){
		return p[0].distance(p[p.length-1]);
	}

	//Stroke Length
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

// Need to check accuracy
	function feature_f9(p){
		var length = p.length
		var f9 = 0;
		var deltaxp = 0;
		var deltayp = 0;
		var deltaxp1 = 0;
		var deltayp1 = 0;
		var var1 = 0;
		var var2 = 0;
		for (var i = 1; i < length - 2; i++) {
			deltaxp = p[i].getX() - p[i+1].getX();
			deltayp = p[i].getY() - p[i+1].getY();
			deltaxp1 = p[i-1].getX() - p[i].getX();
			deltayp1 = p[i-1].getY() - p[i].getY();
			var1 = deltaxp * deltayp1 - deltaxp1 * deltayp;
			var2 = deltaxp * deltaxp1 + deltayp * deltayp1;
			if(var2 == 0){
				if (var1>0)
					f9 += Math.atan(Infinity);
				else
					f9 += Math.atan(-Infinity);
			}
			else{
				f9 += Math.atan(var1 / var2);
			}
		}
		return f9;
	}	

