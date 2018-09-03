(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
		var d = require('./dep2')
		var v1 = "dep1"
		function dep1(){
			return v1+"-"+d.dep2()
		}
		exports.dep1 = dep1
},{"./dep2":2}],2:[function(require,module,exports){
		var v2 = "dep2"
		function dep2(){
			return v2
		}
		function dep3(){
			console.log("dead code")
		}
		exports.dep2 = dep2
		exports.dep3 = dep3
},{}],3:[function(require,module,exports){
		var d = require('./dep1')
		console.log(d.dep1())
},{"./dep1":1}]},{},[3]);
