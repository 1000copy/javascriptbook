		var v2 = "dep2"
		function dep2(){
			return v2
		}
		function dep3(){
			console.log("dead code")
		}
		exports.dep2 = dep2
		exports.dep3 = dep3