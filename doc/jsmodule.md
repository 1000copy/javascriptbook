#Javascript模块全揽

之前写的文章[急速Js全栈教程](https://segmentfault.com/a/1190000016101940)得到了不错的阅读量，霸屏掘金头条3天，点赞过千，阅读近万，甚至还有人在评论区打广告，可见也是一个小小的生态了；）。看来和JS全栈有关的内容，还是有人颇有兴趣的。

![](https://user-gold-cdn.xitu.io/2018/8/31/1658d63918ce55b9?w=419&h=221&f=png&s=42747)

这次文章的内容，是JavaScript模块。JavaScript Module 真是很讨厌，但是不得不了解的话题。奇葩在于：

1. 它一个非常老的语言，并且使用非常广泛
2. 可是它很多年来也不支持模块。这得厂家当前是多大的心呢
3. 再一个可是，它可以直接用现有的语言机制，实现自己的模块，这个就厉害了，因为它释放了社区的力量。事实证明，社区果然不可小看，这个年代，蚂蚁雄兵胜过大象的
4. 再再一个但是，它的模块还可以有很多型的，这说的是分裂
5. 这么多型的模块，还搞了各自独立的标准出来，这说的是整合

最近的ES2017，终于在前端也有了媲美后端的模块，但是大家并不准备把它用起来，很多人表示需要继续Webpack[玩转ES6模块](https://cnodejs.org/topic/5af511071b02288048bd0f10)。

把ES6模块真用的起来，可以不在乎Webpack等打包工具带来的加载优化，各种小文件不必打包这点来说，我看还得加上HTTP/2的配合就好很多了。这也是文章将要介绍的一个主旨吧。ES6模块的引入，确实有可能对当前主流的打包模式有些影响，参考文章6内有所论述

文章自然也不少，但是写作此文的理由还是存在：

1. 我还没有看到一个完整的全览，并且结合HTTP/2的更加没有看到。
2. 而且，在我看来，即使有了ES6模块，也得了解和学习之前拼出来的各种模块，因为社区内的代码还大量的使用这样的模块，其中的一些设计模式，比如IIFE，也是值得一看的。
3. 看到JS社区的热情和推动力，相信JS发展的未来是美好的

## 目录

1. 最古老的模块加载`<script>`标签
2. 此方法的若干问题
- 全局变量。全局命名污染和命名冲突
- 依赖管理。都需要HTML管理，而不是分层管理依赖，多文件加载次序非常关键
- 效率。太多HTTP请求，和并行加载效率低下
3. 有问题引发的解决方法
- 命令空间，匿名闭包、依赖引入
4. 当前主流的模块技术
- Nodejs的做法，Commonjs方案
- Nodejs借鉴
- Require.js实践，AMD和CMD，依赖就近原则
- 从手写模块，到自动编译，Browerify,Webpack,Rollup
5. 刚刚落地的模块技术
- ES6模块，官方发力，对现有技术的影响
- 弥补ES6问题，HTTP/2
6. 最佳实践

## 从脚本加载开始

一切从Javascript的加载开始，自有Javascript依赖，第一个加载模块的方案就是使用HTML标签，也就是`<script>`标签。也就是说，Javascript本身根本就没有模块和加载的定义，它是利用HTML来完成本该自己做的工作。

这是初学者遇到的第一个令人困惑的问题。这样的语言，根本就是一个玩具！也许有些尴尬，但是现实就是如此。并且如此的加载方案，在稍微大点的工程中，会遇到几个违反常识的问题：

1. 全局命名污染。就是说每一个被加载的模块都会引入新的全局变量，他们会污染全局空间，而且必须小心命名，避免名字的冲突
2. 依赖关系单一。此种加载方式，必须按照依赖关系排序，依赖性最大的模块一定要放到最后加载，当依赖关系很复杂的时候，代码的编写和维护都会变得困难。
3. 加载和执行效率难以细颗粒度的调优。一个个的按依赖次序加载和执行。虽然加载往往是可以并行的，但是执行时串行的。加载的时候，浏览器会停止网页渲染，加载文件越多，网页失去响应的时间就会越长

还是从一个案例开始。这个案例，不会做任何有意义的工作，也不会做什么功能演示，而只是验证古典的Javascript加载的能力和限定，验证这些问题的存在，进而找到解决问题的方法。

假设我们现在有一个主程序，它在index.html内，一个模块dep1，一个模块dep2，依赖关系是index.html依赖dep1，dep1依赖dep2。代码都不复杂，就是直接列表如下：

文件index.html

	// index.html
	<script src="dep2.js"></script>
	<script src="dep1.js"></script>
	<script type="text/javascript">
		console.log(dep1())
	</script>

文件dep1.js

	var v1 = "dep1"
	function dep1(){
		return v1+"-"+dep2()
	}

文件dep2.js

	var v2 = "dep2"
	function dep2(){
		return v2
	}


当使用浏览器加载index.html文件时，如我所愿，它会随后加载dep2,dep1,并调用函数dep1，后者调用dep2，然后在控制台输出：

	dep1+dep2

功能是有效的，依赖关系是是对的，输出也是如期望的。但是它也带来了额外的问题：

1. 全局变量污染。在本案例中，可以在console内验证，发现变量v1，v2，函数dep1，dep2都是全局变量。但是由于script的加载机制，以及当前采用的Javascript函数和变量的定义不是局部化的，导致了这样的问题。
2. 依赖关系并不严密。事实上，dep2内的引入变量和函数，只有dep1看得到即可，无需导入到全局变量内。
3. 加载和执行效率难以细颗粒度的调优。本例内，dep1依赖dep2，它们被并行转入，但是执行必须是串行的，首先执行dep2，然后执行dep1，在此案例中，这样做是合适的，但是有不少代码模块之间并不存在依赖关系，它们完全可能并发装入并发执行，但是使用script装入是不能如此的，它会按照标签的次序一个个的执行。如果有比较好的指定依赖关系的方法就好了。

讨论到此，我感觉我在重复先辈们的话，实际上1960年代，第一届软件工程会议，就提出了模块化编程的概念，并且在之后多年一直努力的批评全局变量和Goto语句了。有时候，你会发现，这样看起来非常不济的语言，却可以在现实的项目中如鱼得水，发展的非常的好。而软件工程思想指导下的一些名流语言却早早夭折。这是另外一个有趣的话题了，或许以后有机会谈到。

## 后端的借鉴

后端Nodejs干净利索的解决了此问题。做法就是对每一个装入的模块都注入一个require函数和一个exports对象。其中require函数可以被模块用来引入其他模块，而exports对象则被用来引出当前模块的功能接口。还是以前文提到的作为案例，做法就是：

文件index.js

	// index.js
	var d = require('./dep1')
	console.log(d.dep1())

文件dep1.js

	var d = require('./dep2')
	var v1 = "dep1"
	function dep1(){
		return v1+"-"+d.dep2()
	}
	exports.dep1 = dep1

文件dep2.js

	var v2 = "dep2"
	function dep2(){
		return v2
	}
	exports.dep2 = dep2

执行命令：

	$ node index.js 
	dep1-dep2


这里有一点变化，就是在nodejs内使用index.js代替了index.html。可以看到：

1. Nodejs提供了很好的局部化定义变量和函数的能力，如果使用exports声明引出，其他模块看不到本模块的定义。比如v2变量没有声明引出，当然实际上在本案例内本来也不必引出，那么在dep1内并不会看到v2变量。类似的v1也不会出现在index.js内。
2. Nodejs提供了更加细粒度的依赖关系。index.js依赖dep1，但是并不依赖于dep2，那么index.js就只要引入dep1，而不必同时引入dep2。这样的依赖关系，更加符合实际工程代码的需求，而不是一股脑的、不分层次的引入全部需要用到的代码。

在传统的服务器开发的诸多语言中，模块都是最基础也是最必备的，像是JavaScript连个内置模块支持都没有的是不常见的（或者说根本没有？）。使用诸如的require和exports，就在后端干净利索的解决了困恼前端的模块问题，这不免让前端觉得应该效仿之。当然，Nodejs加载模块是同步的，这个是不能在前端效仿的。因为后端从磁盘加载代码，速度根本不是问题，而前端加载的都是从网络上进行的， 如果同步的话，加上Javas本身的单线程限定，整个UI就会因为加载代码而被卡死的。对比下两者的速度差异，你就明白了：


	硬盘 I/O		
	-----------------
	HDD:	100 MB/s	
	SSD:	600 MB/s	
	SATA-III:	6000 Mb/s	
	-----------------
	网速 I/O
	ADSL:	4 Mb/s
	4G:	100 Mb/s
	Fiber:	100 Mb/s

## 借鉴后的样子，先看看Modules/Async规范

思路倒也简单，只要自己编写一个库，有它来异步加载其他模块，并在加载时注入需要的require和exports即可。这方面的库有几个，比如requirejs，sea.js等。因为我们只是为了讲清楚概念和思路，因此会那概念上最清晰，和Nodejs最为一致的库来说明问题,并不会因为那个更加主流而去选择它。从这个标准看，sea.js是说明概念问题的最佳模块装入库。

sea.js 是一个模块加载器，模块加载器需要实现两个基本功能：

1. 实现模块定义规范
2. 加载运行符合规范的模块

核心落脚点，就在规范二字上。sea.js要求模块编写必须在真正的代码之外套上一层规定的代码包装，样子看起来是这样的：

	define(function(require, exports, module) {
	    // 模块代码
	});

通过传递一个签名为`function(require, exports, module)`的回调函数给define函数，就可以把需要注入的变量和函数注入到模块代码内。之前的实例代码，在这里写成：

文件index.js

	// index.js
	define(function(require, exports, module) {
		var d = require('./dep1')
		console.log(d.dep1())
	});

文件dep1.js

	define(function(require, exports, module) {
		var d = require('./dep2')
		var v1 = "dep1"
		function dep1(){
			return v1+"-"+d.dep2()
		}
		exports.dep1 = dep1
	});

文件dep2.js

	define(function(require, exports, module) {
		var v2 = "dep2"
		function dep2(){
			return v2
		}
		exports.dep2 = dep2
	});

除了加上一层有点看起来莫名其妙的外套代码，其他的模块代码，你该怎么写就怎么写。倘若不是那么洁癖，这样的代码确实解决了之前使用script标签加载代码带来的全局变量污染等问题，并且还是可以异步加载的，那些看起来不错的依赖关系，也如Nodejs一样。以上代码，可以直接把nodejs对应的代码拷贝过来，加上外套即可运行。

我们不妨加入seajs文件，来看看实际的使用效果:

	//index.html
	<script type="text/javascript" src="https://cdn.bootcss.com/seajs/3.0.2/sea.js"></script>
	<script>
	  seajs.use('./index.js');
	</script>

这里为了偷懒，我使用了seajs的CDN文件。如果有遇到什么问题，你不妨自己下载一个seajs文件，然后改成你的URL即可。

加载此HTML文件，可以在控制台看到输出：

	dep1+dep2

说明seajs执行效果不错！

1. seajs通过use方法来加载入口模块，可选接收一个回调函数，当模块加载完成会调用此回调函数，并传入对应的模块作为参数
2. 来获取到模块后，等待模块（包括模块依赖的模块）加载完成会调用回调函数。
3. 分析模块的依赖，按依赖关系递归执行`document.createElement(‘script’)`，这些标签的创建会导致浏览器加载对应的脚本

对模块的价值，都是异步加载，浏览器不会失去响应，它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。

可以在控制台输入：
	
	seajs.data.fetchedList

查看文件加载清单。

因为不是语言自带，而是社区通过现有的语言特性，硬造出来的一个模块系统，因为看起来代码不免累赘。但是在没有原生模块的情况下，这样做确实是管用的。要知道真正的原生模块，在ES6标准之后才出现，这都是2015年的事儿了。在一些有名的应用如Gmail、Google Map的推动下，Web从简单的展示到App的变化，迫切需要这样类似的模块技术，大家等不了那么久，先弄一个能用的是很重要的。

为什么要套这层外壳呢？就是为了解决全局变量污染问题。在JavaScript语言内，唯一提供本地作用域的就是函数和闭包，通过闭包`function(require, exports, module)`,模块加载器给模块注入了必要的函数和变量。看起来在模块之内的任何地方都可以使用require和exports，但是他没都不是全局变量，而是闭包内变量。这些变量都是局部化的，绝对不会污染全局空间。

使用require函数，可以就近指定对其他模块的依赖，函数本身是由sea.js这样的模块加载器提供，它会内部构造依赖关系图谱，并根据依赖关系，设置加入script标签的次序。

更加详细的理解这层外壳，可以阅读seajs源代码，代码量并不大，值得一读。或者看看此[问答](https://stackoverflow.com/questions/2421911/what-is-the-purpose-of-wrapping-whole-javascript-files-in-anonymous-functions-li)

当然Seajs也引入了自己的规范，叫做CMD规范。它的前身是Modules/Wrappings规范。SeaJS更多地来自 Modules/2.0 的观点，同时借鉴了 RequireJS 的不少东西，比如将Modules/Wrappings规范里的 module.declare改为define等。
说是规范，却不像是一般的规范那么冗长，可能打印出来也就一两页的纸张而已，这也是JavaScript社区的一个特点吧。[Modules/Wrappings](http://wiki.commonjs.org/wiki/Modules/Wrappings)

seajs的作者在一篇文章中提到了业界在开发前端模块加载器时的场景：

大概 09 年 - 10 年期间，CommonJS 社区大牛云集。CommonJS 原来叫 ServerJS，推出 Modules/1.0 规范后，在 Node.js 等环境下取得了很不错的实践。09年下半年这帮充满干劲的小伙子们想把 ServerJS 的成功经验进一步推广到浏览器端，于是将社区改名叫 CommonJS，同时激烈争论 Modules 的下一版规范。分歧和冲突由此诞生，逐步形成了三大流派：
1. Modules/1.x 流派。这个观点觉得 1.x 规范已经够用，只要移植到浏览器端就好。要做的是新增 Modules/Transport 规范，即在浏览器上运行前，先通过转换工具将模块转换为符合 Transport 规范的代码。主流代表是服务端的开发人员。现在值得关注的有两个实现：越来越火的 component 和走在前沿的 es6 module transpiler。
2. Modules/Async 流派。这个观点觉得浏览器有自身的特征，不应该直接用 Modules/1.x 规范。这个观点下的典型代表是 AMD 规范及其实现 RequireJS。
3. Modules/2.0 流派。这个观点觉得浏览器有自身的特征，不应该直接用 Modules/1.x 规范，但应该尽可能与 Modules/1.x 规范保持一致。这个观点下的典型代表是 BravoJS 和 FlyScript 的作者。BravoJS 作者对 CommonJS 的社区的贡献很大，这份 Modules/2.0-draft 规范花了很多心思。FlyScript 的作者提出了 Modules/Wrappings 规范，这规范是 CMD 规范的前身。可惜的是 BravoJS 太学院派，FlyScript 后来做了自我阉割，将整个网站（flyscript.org）下线了。这个故事有点悲壮，下文细说。

## 也谈谈require.js

这个模块加载器是更加主流的。之所以不是首先提到它，是因为概念上来说seajs更加简明。和seajs相比，requirejs是更加主流的框架。它的差异主要是一些零零散散的不同，比如模块代码的外套是不太一样的：

	require(['moduleA', 'moduleB', 'moduleC'], function (moduleA, moduleB, moduleC){
　　　　// some code here
	});

导出模块变量和函数的方式，也是不同的。requirejs的引出方式是直接返回：

	return {foo:foo}

一样的案例，使用requirejs的话，代码是这样的：

index.html文件

	<script data-main="index"
	 src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.js" ></script>

index.js文件：

	require(['./dep1'], function (d){
		console.log(d.dep1())		
	});

dep1.js文件：

	define(['./dep2'], function (d){
		var v1 = "dep1"
		function dep1(){
			return v1+"-"+d.dep2()
		}
		return {dep1:dep1}
	});

dep2.js文件：

	define(function() {
		var v2 = "dep2"
		function dep2(){
			return v2
		}
		return {dep2:dep2}
	});

浏览器打开文件index.html，可以看到控制台输出一样的结果。

稍加对比require.js和sea.js。使用Require.js，默认推荐的模块格式是：

	define(['a','b'], function(a, b) {
	  // do sth
	})

使用seajs的时候，类似的功能，代码这样写：

	define(function(require, exports, module) {
	  var a = require('a')
	  var b = require('b')
	  // do sth
	  ...
	})

Seajs的做法是更加现代的。我需要用的时候，我才去引用它，而不是实现什么都引用好，然后用的时候直接用就好。



## Modules/1.x规范

以require.js为代表的Modules/Async流派，尊重了浏览器的特殊性，代价是不管写什么模块，都得自己给自己穿上一层外套，对于有代码洁癖的人来说，这样的情况是看不下去的。最好是开发人员编写干干净净的模块代码，框架开发者做一个工具，这个工具自动的把这些代码转义成客户端认可的异步代码。即在浏览器上运行前，先通过转换工具将模块转换为符合规范的代码。这就是Modules/1.x 流派的做法。需要注意的是1.x和2.0还有Async流派不能简单的认为版本号大的就更好。倒是理解成各自不同的解决方案为好。

以我们自己的案例来说，就是可以直接把nodejs代码那里，使用一个工具做一个转换，即可得到符合前端需要的代码，这些代码是异步加载的、是可以保证模块变量局部化的、是可以由良好的依赖关系定义的。工具browerfy就是做这个的。我们来试试具体是怎么玩的。

首先安装此工具：

	npm install --global browserify

到你的nodejs代码内，然后转换此代码，生成一个新的js文件，一般命名为bundle.js：

	browserify index.js -o bundle.js

然后创建index.html并引入bundle.js:
	
	<script type="text/javascript" src="./bundle.js"></script>

使用浏览器打开此HTML文件，可以在控制台看到熟悉的输出,这说明转换是有效的：

	dep1+dep2

本身nodejs的代码，是不能在浏览器执行的，浏览器内也没有什么require函数，但是转换后就可以执行了。那么，转换的过程，到底玩了什么魔术？

像是browserify这样的工具，就是找到全面被引入的代码，解析它的依赖关系，并且自动的加入我们在requirejs里面需要的外套代码。尽管bundle.js文件并不是为了阅读优化的，但是可以取出其中的代码片段来证实我们的观点：

	{"./dep2":2}],2:[function(require,module,exports){
			var v2 = "dep2"
			function dep2(){
				return v2
			}
			exports.dep2 = dep2
	},{}],3:[function(require,module,exports){
			var d = require('./dep1')
			console.log(d.dep1())
	},{"./dep1":1}]},{},[3]);

我们可以看到本来的nodejs代码，以及它们对应的外套。还是比较简单，就不进一步解释了。browserify不但完成了加外套代码的工作，还同时把若干小文件打成一个大的文件，对于当前使用的HTTP主流版本1.1来说，这样做会让加载效率更高。但是对于HTTP/2.0来说，它已经支持了多个文件在一个连接内交错传递，因此再做打包的意义就不大了。只是...HTTP/2.0的普及还需要时日。

browerify完成的工作简明而单一。另外一个主流的同类工具叫做webpack，不但可以转换js代码，还可以打包css文件、图片文件，并且可以做一些工程化的管理，代价就是webpack学起来也困难的多。实际上像是Vuejs这样的UI开发框架，内部就是使用了webpack做工程化管理和代码转译的。但是在模块化方面，两者是差不多的。就不另外介绍了。

## ES6 Module

时间到了May 9, 2018，我看到了阮一峰发布了这样的微博：

	今天 Firefox 60发布，默认打开了ES6 模块支持，至此所有浏览器都默认支持ES6模块。前端开发模式可能因此大变。现在的方案是所有模块发到npm，本地写好入口文件，再用webpack打包成一个脚本。但是如果浏览器原生支持，为什么还要打包呢？至少简单的应用可以直接加载入口文件，浏览器自己去抓取依赖。 ​​​​

这里所有浏览器指的是Edge、Firefox、Chrome、Safari。当然，再一次没有IE。如果想要支持IE或者比较老的版本的话，还是需要使用打包器来完成代码的转译。另外很多人表示会继续使用Webpack，原因很简单，Webpack不仅仅是完成模块打包工作，还有压缩、混淆等，并且很多框架还需要依赖它。所以迁移并非一朝一夕之功。而无需考虑老版本浏览器的兼容的代码，是完全可以大量的使用它了。了不起在把Webpack加起来转换ES Module到加外套的代码就是了。

ES6 Module不是requirejs那样加外套的样子，也不是Nodejs使用require函数的样子，而是另外一套有官方提出的模块模式。它使用的是import、export关键字。官方的就是不一样，社区是加不了关键字的。同样的案例，使用ES6 Module就是这样的了。

index.html文件：

	<script type="module">
			import {dep1 } from './dep1.js'
			console.log(dep1())
	</script>

dep1.js文件

		import {dep2} from './dep2.js'
		var v1 = "dep1"
		export function dep1(){
			return v1+"-"+dep2()
		}
		

dep2.js文件：

		var v2 = "dep2"
		export function dep2(){
			return v2
		}

ES6 Module要求必须有后台的HTTP服务器，而不能直接在文件系统上完成Demo的测试。所幸使用Nodejs搭建一个服务器也非常简单直接：
	
	npm i http-server -g
	http-server

在浏览器内访问此HTML文件的URL，可以看到控制台输出:dep1+dep2。这个输出，已经是你的老朋友了。

Nodejs在10.9才支持实验版本的ES6 Module，是落后了点，但是对于Nodejs来说，新的模块技术本来也就并不迫切。

ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

## 最佳实践建议

综合以上的内容，我认为，在不必考虑古老的浏览器兼容的情况下，最好的实践是这样的：

1. 直接使用ES6 Module编写模块代码
2. 使用Rollup清除没有调用的代码，降低代码的大小
3. 使用Ugly工具压缩和混淆代码
4. 使用HTTP/2做网络传递协议

这样的实践，会随着HTTP/2的逐步普及和ES6被更多的开发者采用，而成为更好的选择。

使用ES6 Module的坏处是无法像require那样动态的加载。但是好处是可以精确指明对于一个库，我们使用的是那些，这就给工具提供了优化的可能，就是说如果我引入了一个库，但是这个库内有些我不会用的，那么这些不会被用到的代码也不会加载到前端了。这个功能对于后端来说意义不大，但是对于前端来说，就是非常令人喜欢的功能了。实际上，这样的工具已经有了，比较知名的就是rollup，它属于了一种被称为tree-shaking的技术优化使用代码。

而以往做模块打包，很多的原因是HTTP/1.1传递大量小文件的时候开销比较大，而打包成单一的问题，就可以更好的利用HTTP/1.1的传输特性。但是HTTP/2.0的一个大的特色就是可以在单一的连接内，并发和交错的传递多个流，因为在一个连接内交错的传递多个文件，就可以不再有HTTP/1.1的连接开销了。因此，在HTTP/2.0被采纳的网络里面，打包单一文件的价值几乎没有了。直接使用小文件默认情况下就可以得到比较好的优化传输。

按照现在的技术发展的势头，要不了几年，打包器将不再那么必要，使用原生代码编写模块将会成为主流的。


## 参考

参考文章不少,其中模块历史和选型如下：

1. [前端模块化开发那点历史](https://github.com/seajs/seajs/issues/588)
2. [梳理的还是比较清晰](https://segmentfault.com/a/1190000015302578)
3. [有点黑客精神的小伙伴，玩的很广谱](http://huangxuan.me/js-module-7day/#/1)
4. [介绍Bower](http://blog.fens.me/nodejs-bower-intro/)
5. [npm for Beginners: A Guide for Front-end Developers](https://www.impressivewebs.com/npm-for-beginners-a-guide-for-front-end-developers/)
6. [Es6module 出来了，是否应该重新考虑打包的方案？](https://www.contentful.com/blog/2017/04/04/es6-modules-support-lands-in-browsers-is-it-time-to-rethink-bundling/)

## 未来

这篇文章预计想要编写的YUI方法，YUI Combo方法，想了想还是算了，因为这样的恐龙代码，已经在日常的代码实践中逐步消失，作为一个曾经比较重要，现在则退居二线的代码库，对它最好的赞许就是让它退休，也不必给读者增加额外的阅读负担了。毕竟require.js、browerify、webpack都工作的不错，在此基础上发展的Vuejs、React.js也的得到了更多的认可。

本文讲到的模块规范和实践工具，为编写一个广为社区认可的模块起到了最基础的规范作用。但是，JavaScript社区最为令人称道的就是代码库仓库。包括NPM仓库，Bower仓库。在这些仓库内，有模块依赖管理工具，还有工程化工具。这些内容，它们当然是重要的，不在本文的范围内。

作为前端开发者，有人采用Bower管理组件依赖，也有人使用Npm做类似的工作。有很多时候，这样的实践是令人困惑的。还有这里[npm and the front end](https://medium.com/dailyjs/npm-and-the-front-end-950c79fc22ce),NPM官方也对npm在前端的使用，提出了[自己的看法][https://blog.npmjs.org/post/101775448305/npm-and-front-end-packaging]。

这些未尽的内容，或许在未来的文章中表达之。
