	define(function(require, exports, module) {
		var d = require('./dep2')
		var v1 = "dep1"
		function dep1(){
			return v1+"-"+d.dep2()
		}
		exports.dep1 = dep1
	});