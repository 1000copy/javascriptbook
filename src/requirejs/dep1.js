	define(['./dep2'], function (d){
		var v1 = "dep1"
		function dep1(){
			return v1+"-"+d.dep2()
		}
		return {dep1:dep1}
	});