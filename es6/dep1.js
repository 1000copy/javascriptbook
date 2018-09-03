		import {dep2} from './dep2.js'
		var v1 = "dep1"
		export function dep1(){
			return v1+"-"+dep2()
		}
		