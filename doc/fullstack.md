
# 急速JavaScript全栈教程

自从一年前发布了[Vuejs小书](http://www.ituring.com.cn/book/1956)的电子书，也有些日子没有碰过它们了，现在因为项目的缘故，需要使用JavaScript全栈开发。所以，我得把这个全栈环境搭建起来。

整个系列，是会采用我的一贯风格，就是不疾不徐，娓娓道来，学习完毕，你可以掌握我提到的全系列的知识，并且得到一个可以直接拷贝的代码模板，并把它用到你的项目中。

## 前端的复杂度

很多人是看不起JavaScript开发的。这玩意不就是玩具嘛,一些脚本和标签而已。说这话的时候，他们可能是就翘起二郎腿的，或者抱着膀子的。

然而，前端因为还在快速发展，因此很多东西在变，构造环境的选择比较多，技术种类也不少，很多事情得自己做。因此它其实并不比那么简单的。这篇文章的图，可以窥视到前端复杂的一角了。[Modern Frontend Developer in 2018](https://medium.com/tech-tajawal/modern-frontend-developer-in-2018-4c2072fa2b9c)。

我看了不少资料，很多都是讲解这张图中的一个技术，讲解全栈的肯定是有的，但是往往过于复杂。本文试图通过一组文章，把JavaScript的全栈开发做一个全景的展示，力图使用一个案例，全须全尾的贯穿整个系列，便于初学者对技术的急速理解。


## 大纲

所以，文章会包括这些：

1. 使用Vuejs脚手架，快速搭建一个CRD用户界面。会使用vuex管理状态，使用vue-router管理路由。
2. 使用Mongodb存储和提供后端CRD服务。
3. 使用Nodejs搭建后端CRD服务。
4. 使用Fecth|Axios访问后端CRD服务
5. 使用bulfy的美化组件的方法
6. 整合全栈服务

其中的CRD指的是Create、Read、Delete。针对的数据对象，就是一个Todo对象，看起来是这样的：

  {id:1,subject:"Loving"}

如果是多个数据对象，看起来是这样的：

    [
      {id:1,subject:"Loving"}，
      {id:1,subject:"Writing"}，
      {id:1,subject:"Preying"}
    ]

这个看起来很简单平实的JS对象，会在一组组函数、模块和对象之间流动，甚至跨越网络边界，从内存到硬盘。它会被存储在Mongodb内，也会从Mongodb提取出来，在用户界面、HTTP客户端，HTTP服务器传递。

整个App看起来就是一台机器，可以说代码在运转这个机器，但是也不妨说是数据在驱动这个它。


### 使用Vuejs脚手架，快速搭建Todo App界面

我们给自己命题，做一个TODO应用，它看起来是这样的：

![Todo App](images/todoapp.png)

用户可以看到一个编辑框，和一个清单。

1. 在编辑框内加入新的todo项目，按回车即可加入到列表
2. 列表内每个项目有一个按钮，点击按钮，可以删除当前项目

## 环境要求

说起来搭建JS全栈开发环境，涉及到的东西真的不少。大的选择是这样的：

1. 前端采用Vuejs
2. 后端采用Nodejs
3. 存储使用Mongodb。

大的选择定了，小的配套也就跟着来，前端配套的话需要一系列的技术，特别是前端，对应着Vuejs，配套管理路由、状态、组件的都有相应的技术手段。自己搭配的话，还是非常麻烦的。

幸好Vuejs还有一个前端脚手架工具vue-cli，它可以把以上的组件整合起来到一个工程内。一个最为基础的vue-cli工程脚手架的创建，现在得需要160M左右的空间占用。在我的电脑和网络情况下，需要2分半的时间才会完成。

###  前端 Vuejs

1. vue-router，前端路由管理
2. vuex,前端数据管理，专业一点的说法，就是状态管理，这些数据，可能是属性，数组，对象等等，可以跨组件访问，而不像是data函数那样提供的数据只能被本组件访问，可以想到，稍微大一点的前端工程都必须前端状态管理的。
2. axios，前端HTTP访问，以promise的形式，封装了类似fetch，AJAX的能力
3. buefy，前端微型框架，可以使用自定义标签使用自定义组件，并且CSS框架为Bulma
4. Bulma，尽管使用了微框架，只是让对CSS framework的了解降到最低，但是不是说就不需要了解了。还是得学习的。Bulma相对于老牌的Bootstrap，是不需要依赖于JS框架，也没有任何JS代码，因此可以和任何一框架很好的结合，比如这里的Vuejs。这就是我选择它的原因

### 后端 cli-service

为了给前端开发提供工具链和开发便利性，我们常常需要webpack&babel。有了它们，就可以使用ES6的语法，以及代码更新后自动刷新等。这些都是非常便利的特性，用了就离不开的。有了vue-cli，对webpack&babel的了解可以降到最低，但是也不能不学，稍微需要一些定制的配置，也是必须要掌握的，起码得知道如何启动一个开发服务器，已经发布build，还有把前端服务经过proxyChain跳转到后端服务去等等。所幸是在这个教程内，你不需要学习太多就可以把案例跑起来。

### App Server + Mongodb

接下来看后端，一般习惯就是使用Nodejs+Express.js的搭配。这个没有多少说的，都是老东西了。为了访问Mongodb,也需要一套框架，基于Callback的，或者基于Promise+Await+Async的，也是需要选择的。

为了便于理解，我会用一个最小的案例完成整个开发过程，就是案例在现实中并不存在，但是也是有用的，就是你可以当它们是模板，直接拷贝代码，然后填充你的内容。天下代码一大抄嘛，没有什么不对的，毕竟这些写代码是最快的。这个案例的数据模型就是对一个{id，name}的对象进行CRD（创建删除列表）。

## 安装运行环境

安装环境相对简单，特别是如果使用Mac OS X的话。有一些工具链可以帮助快速搭建环境。当然Windows也并不多麻烦就是了，它常常提供的是一个安装程序，大部分时间，你需要的就是点击下一步。

这里以MAC为例，讲解安装。

### mongodb 

安装和运行Mongodb Daemon:

    brew install mongodb
    mongodb

访问验证,首先执行Mongodb Shell:

    mongo

输入命令，查询数据库清单：

    > show dbs
    local           0.000GB
能够看到这些信息，说明mongodb安装成功。

### Node.js

安装并验证:

    $brew install nodejs
    $node -v
    10.7.0

能够看到这些信息，说明Node.js安装成功。

## 开始前端编码

### 安装编码环境

首先安装vue-cli，方法和一般的NPM模块一样的，我们安装的版本是3.0：

    npm i @vue/cli 

查看版本：

	vue -V
	3.0.0
看到如下信息，说明成功。然后创建App的脚手架代码：

    vue create todoapp

注意，在此创建过程中，命令行会指示你做出选择，我们会选择Manual select feature,然后选择router和vuex，其他不选。然后并执行此代码：

    cd todoapp
    npm run serve
    
可以在浏览器中访问localhost:8080看到Vue的启动画面。说明创建脚手架成功。

此时，vue-cli已经帮助安装了vuex和router的模块依赖。本节一次性的安装全部剩余的全部NPM依赖，免得以后用一个安装一个，麻烦而且啰嗦。

  	npm install buefy --save
    npm install axios --save 

[buefy](https://buefy.github.io/#/)是一个基于Bulma的Vuejs用户界面组件库。这次的UI的CSS方案，使用[Bulma](https://bulma.io/)，Vuejs如果想要以定制组件的形式去使用它的话，那么需要安装Buefy模块。实际上，我研究过Bulma和[Bootstrap](https://getbootstrap.com/docs/3.3/css/)，还写了一本[免费的电子书](https://legacy.gitbook.com/book/1000copy/bootstrap/details)，我觉得Bulma相对于Bootstrap的优势在于1.不依赖任何JS框架2.用户接口设计更加简明。这就是我现在选择使用Bulma的原因。

[Axios](https://www.npmjs.com/package/axios)是一个封装了HTTPClient的库，提供了promise接口。我们使用它访问后端的HTTP Server的数据。之前提到的数据对象，就是由Axios提取到客户端，也会是通过Axios把数据对象提交到服务器的。

### 前端编码

首先，我们从状态开始。我们之前提到的Vuex，是Vuejs管理状态的官方插件。所谓的状态，就是应用程序的数据对象们。也就是我们提到的Todo对象和Todo对象集合。我们在App用户界面上看到的很多数据都是来自于状态对象。状态对象在src/store.js。不仅仅是的应用状态信息，还有和对这些的操作函数。既然需要一个todo项目清单，因此应该加入如下代码：

    import Vue from 'vue'
    import Vuex from 'vuex'
    Vue.use(Vuex)
    const defaultTodo = [
          {id:1,subject:'Eating'},
          {id:2,subject:'Loving'},
          {id:3,subject:'Preying'},
        ]
    function indexById(todos,id){
      for (var i = 0; i < todos.length; i++) {
        if (id == todos[i].id)
          return i
      }
      return -1
    }
    import axios from 'axios'
    export default new Vuex.Store({
      state: {
        msg:'Todo App',
        todos:defaultTodo
      },
      mutations: {
        add(state,subject){
          var todo = {id:subject,subject:subject}
          state.todos.push(todo)
        },
        remove(state,id){
          state.todos.splice(indexById(state.todos,id),1)
        },
        reload(state){
          state.todos = defaultTodo
        }
      },
      actions: {
      add: (context, link) => {
          context.commit("add", link)
        },
        remove: (context, link) => {
          context.commit("remove", link)
        },
        reload: (context) => {
          context.commit("reload")
        }
      }
    })


其中的state.todos属性，就是我们的主要的数据对象了。state.msg这是提供了一个App的标题字符串。mutations属性内是对数据修改提供的方法，比如
1. 我们需要添加一个todo，使用add()方法，相应的
2. 删除一个todo，使用remove()方法
3. 刷新一个todo列表，就会使用load()方法

有时候，对数据的修改可能是比较消耗时间的，因此为了避免阻塞客户端的主线程，这个对象也提供了异步的方法，actions对象内就是对应修改操作的异步方法，这里的方法功能上和mutations一致，但是是异步的。Vuex提供了类似：

    context.commit()

的语法，提供和actions和mutations方法的对接。第一个参数是mutations的方法名称，之后的参数最为mutations方法的参数传递给mutations方法。

特别说下，mutations内的add()方法，其中用户界面会提供一个Todo.subject属性，而ID是需要自动生成的，我们这里临时使用subject的值作为id，就是一个偷懒，只要subject不要输入重复，也暂时可以蒙混过关。因为知道本项目内的后台存储会采用Mongodb，在Mongodb内插入一个新的对象后，会自动生成一个ID，我们的Todo对象的id会采用这个ID。这里就没有必要自己生成了。

在src/views/home.vue内，粘贴为如下代码：

    <template>
      <div class="home">
        <h1>{{msg}}</h1>
        <NewTodo></NewTodo>
        <TodoList></TodoList>
      </div>
    </template>
    <script>
    import NewTodo from '@/components/NewTodo.vue'
    import TodoList from '@/components/TodoList.vue'
    import {mapState,mapActions} from 'vuex'
    export default {
      name: 'home',
      computed:mapState(['todos','msg']),
      components: {
        TodoList,NewTodo
      },
      data(){
      	return{newtodo:''}
      },
      methods:{
      	...mapActions([
          'remove',
          'add'
        ]),
      	add1:function(){
      		this.add(this.newtodo)
      		this.newtodo = ''
      	}
      }
    }
    </script>

...mapState,mapActions的解说。

就是说，我们这个Todo App划分为为两个组件，其中一个组件负责显示编辑框，并接受回车事件，把新的Todo项目加入到应用状态内。另外一个组件负责显示全部Todo项目，并接受删除事件，删除指定的Todo项目。它们分别是NewTodo组件和TodoList组件：

    <NewTodo></NewTodo>
    <TodoList></TodoList>

这两个组件的代码实现，分别在文件`src/components/NewTodo.vue`和`src/components/TodoList.vue`内。NewTodo代码：

    <template>
      <div class="home">
        <form @submit.prevent="add1">
        	<input type="text" name="newTodo" placeholder="new todo" v-model="newtodo">
        </form>
      </div>
    </template>
    <script>
    import {mapState,mapActions} from 'vuex'
    export default {
      name: 'newtodo',
      computed:mapState(['todos','msg']),
      data(){
      	return{newtodo:''}
      },
      methods:{
      	...mapActions([
          'add'
        ]),
      	add1:function(){
      		this.add(this.newtodo)
      		this.newtodo = ''
      	}
      }
    }
    </script>

TodoList代码：

    <template>
      <div class="hello">
        <ul>
          <li v-for="(todo,index) in todos" v-bind:key="todo.id">
            {{todo.subject}}<button @click="remove(todo.id)" class="rm">remove</button>
          </li>
        </ul>
      </div>
    </template>
    <script>
    import {mapState,mapActions} from 'vuex'
    export default {
      name: 'todolist',
      computed:mapState(['todos','msg']),
      components: {
      },
      methods:{
        ...mapActions([
          'remove','reload'
        ])
      },
      mounted(){
        this.reload()
      }
    }
    </script>
    <style scoped>
    </style>


在src/main.js文件内，添加如下代码，引入Buefy：

    import Buefy from 'buefy'
    import 'buefy/lib/buefy.css'
    Vue.use(Buefy)

现在可以使用Buefy组件了。我们可以把NewTodo组件内的标准的input变成组件化的input，把标签换成b-input即可。代码如下：

    <b-input type="text" name="newTodo" placeholder="new todo" v-model="newtodo"></b-input>

现在看浏览器，input变成了比较有吸引力的Bulma风格的控件了。
访问网络使用axios。需要首先找到src/home.vue在代码的开头部分引用此库：

    import axios from 'axios'

在Vue单页组件内使用此库了。比如在src/home.vue内代码对象中加入新方法：

    mounted(){
      var url  = 'https://api.coindesk.com/v1/bpi/currentprice.json'
      axios ({
            url:url,
            method: 'get',
        })
        .then( res => {console.log(res.data.chartName)} )
        .catch( err => cosole.error(err))
    }


我们来看看适应效果。启动cli-service：

    npm run serve

然后打开浏览器，输入地址`localhost:8080`,如果可以在浏览器内看到我们期望的用户界面，并且都可以看到console打印了Bitcoin，那么就说明用户界面代码和初步的访问HTTP网络的axios代码以及状态管理功能都是成功了的。

## 后端编码

现在，我们已经可以看到UI了，但是用户界面内的数据来自于客户端，而不是来自于服务器。我们的数据当然应该来源于服务器的了。因此我们需要启动给一个自己的服务器，这个服务器可以接受客户在界面上录入的新的Todo对象，也可以提供后端数据库内的Todo清单。

为了测试的目的，常常需要准备一个todo应用的后台JSON服务，可以通过HTTP方式，提供todo项目的增加删除修改和查询。

这样的服务器，使用了nodejs作为服务器端，并且使用了两个node模块，可以使用npm安装它们：

  npm install express body-parser 

[body-parser](https://www.npmjs.com/package/body-parser)是一个中间件，可以解析请求内容并把解析结果放到req.body属性内。最常见的做法就是解析json内容。

代码如下(文件名为：jsonserver.js)：

      var express = require('express');
      var app = express();
      var path = require('path')
      var bodyParser = require('body-parser')
      app.use(bodyParser.json())
      var todos = []
      var public = path.join(__dirname, '/')
      app.use('/',express.static(public))
      const defaultTodo = [
        {id:1,subject:'Eating'},
        {id:2,subject:'Loving'},
        {id:3,subject:'Preying'},
      ]
      function rs(){
        todos = defaultTodo
      }
      function indexById(id){
        for (var i = 0; i < todos.length; i++) {
          if (id ==todos[i].id)return i
        }
        return -1
      }
      rs()
      app.delete('/api/todo/:id', function (req, res) {
        var userkey = +req.params.id
        todos.splice(indexById(userkey),1)
        res.end( JSON.stringify(todos));
        rs()
      })
      app.get('/api/todos', function (req, res) {
        res.end( JSON.stringify(todos));
      })
      app.post('/api/todo', function (req, res) {
        todos.push(req.body)
        res.end(JSON.stringify(todos))
        rs()
      })
      var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port
        console.log("listening at http://%s:%s", host, port)
      })

可以使用命令执行：

  node jsonserver.js

## Curl命令验证

可以通过curl命令验证服务的有效性:

1. GET操作

       $curl http://localhost:8081/todo/1
       $curl http://localhost:8081/todos

2. DELETE操作

        $ curl -X "DELETE" http://localhost:8081/api/todo/1

3. POST操作

      $curl -X POST  -H "Content-Type: application/json" -d '{"subject":"s4"}' http://localhost:8081/api/todo
  
## 前端HTML验证

创建一个index.html文件，并放置到和jsonserver.js代码同一目录，代码如下：

    <a href='/todos'>todos</a>
    <a href='/todo/1'>todo/1</a>
    <button onclick='remove()'>remove 1</button>
    <button onclick='create()'>create</button>
    <script>
      function remove(){
        fetch (
          '/api/todo/1',
          {
            method: 'DELETE',
          }
        )
        .then( res => console.log(res.json()))
        .catch( err => cosole.error(err))
      }
      function create(){
        fetch (
          '/api/todo',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: "4", subject: "s4"})
          }
        )
        .then( res => console.log(res.json()))
        .catch( err => cosole.error(err))
      }
    </script>

可以提供创建，删除，列表的测试，其中部分结果在console内显示。

说起来，JS访问HTTP的库真的是不少，[这里](https://www.javascriptstuff.com/ajax-libraries/) 提到的库都有9种。其中的fetch api使用起来非常的简洁趁手，可是它[不支持IE](https://caniuse.com/#feat=fetch)。如果你需要支持IE的话，使用Axios更好。这就是为什么Vuejs官方推荐Axios的原因吧:

    The Fetch API is a powerful native API for these types of requests. You may have heard that one of the benefits of the Fetch API is that you don’t need to load an external resource in order to use it, which is true! Except… that it’s not fully supported yet, so you will still need to use a polyfill. There are also some gotchas when working with this API, which is why many prefer to use axios for now. This may very well change in the future though.
    
## axios访问方法

相比fetch，使用axios必须依赖于外部文件。为了方便，我们直接使用unpkg网站提供的库文件。

axios的语法和fetch的大同小异，看着也是比较简洁美观的。以下代码，把create和remove函数的内部实现换掉，其他不变。

    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <a href='/todos'>todos</a>
    <a href='/todo/1'>todo/1</a>
    <button onclick='remove()'>remove 1</button>
    <button onclick='create()'>create</button>
    <script>
      function remove(){
        axios ({
            url:'/api/todo/1',
            method: 'DELETE',
        })
        .then( res => console.log(res.json()))
        .catch( err => cosole.error(err))
      }
      function create(){
        axios ({
            method: 'POST',
            url:'/api/todo',
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify({subject: "s4"})
        })
        .then( res => console.log(res.json()))
        .catch( err => cosole.error(err))
      }
    </script>

现在，后端也是可以跑起来了的。

## 整合：前端后端

### 建立cli-service到App Server的通道

每次执行命令：npm run serve，都会启动vue定制脚手架的服务器代码，它会提供不少方便开发的特性。但是我希望一部分URL可以转发到我自己的服务器内。比如把所有的/api打头的URL全部转过来。只要在工程根目录内加入此文件`vue.config.js`,录入如下内容：

    module.exports = {
      devServer: {
        proxy: {
          "/api": {
            target: "http://localhost:8181",
            secure: false
          }
        }
      }
    };

我们自己的测试服务器在这里：

    var http = require('http');
    http.createServer(function (req, res) {
      res.write('Hello World!'); 
      res.end(); 
    }).listen(8181); 

我们的定制服务器，就可以监听8181的本地机器端口，等待客户端的匹配的URL转发过来，并转发我们服务器的响应代码到客户端。


但是正常开发过程中，是需要自己的服务器端代码的，如何在利用Vue脚手架服务器的方便性的基础上，加入自己的代码呢。做法是另外做一个定制的服务器，然后让vue定制脚手架的服务器转发URL到此服务器。

为了测试的目的，我们把函数`mounted`修改为：

    mounted(){
      var url  = '/api/1'
      axios ({
            url:url,
            method: 'get',
        })
        .then( res => {console.log(res.data)} )
        .catch( err => console.error(err))
    }

即可看到浏览器console内打印`Hello World!`。

### 整合前端到后端

我们已经通过配置，要求cli-service转移全部api打头的URL到App Server。只要在工程根目录内加入此文件`vue.config.js`,录入如下内容：

    module.exports = {
      devServer: {
        proxy: {
          "/api/*": {
            target: "http://localhost:8181/api",
            secure: false
          }
        }
      }
    };

现在，我们可以修改前端的Axios使用代码，分别替代前端代码的数据装入、数据删除、数据添加的代码，让这些代码可以支持网络操作。为了避免网络操作代码和业务逻辑代码混合在一起，我决定包装三个网络操作函数，并把它们放置到src/store.js文件内：
    
    import axios from 'axios'
    function httpadd(subject,cb){
      axios ({
            method: 'POST',
            url:'/api/todo',
            headers:[{'Content-Type':'application/json'}],
            data: {subject:subject}
          })
          .then( res => cb(res.data))
          .catch( err => console.error(err))
    }
    function httpremove(id,cb){
      axios ({
            url:'/api/todo/'+id,
            method: 'delete',
          })
          .then( res => {
              cb()
          })
          .catch( err => console.error(err))
    }
    function httpreload(cb){
      axios ({
            url:'/api/todos',
            method: 'get',
          })
          .then( res => {
              cb(res.data)
          })
          .catch( err => console.error(err))
    }

分别完成添加、删除、查找的任务，当完成工作后，都会调用一个callback函数，在此函数内，可以消费访问网络后得到的响应数据。

然后把文件内src/store.js的mutations对象改成如下代码：

     mutations: {
      add(state,subject){
        httpadd(subject,function(todo){
          state.todos.push(todo)
        })
      },
      remove(state,id){
        httpremove(id,function(){
          state.todos.splice(indexById(state.todos,id),1)  
        })
      },
      reload(state){
        httpreload(function(todos){
          // console.log(todos)
          state.todos = todos
        })
        // state.todos = defaultTodo
      }
    },

最后，在TodoList内加入一个新函数，并通过mapActions引入src/store.js的load()函数到当前对象内：

      methods:{
        ...mapActions([
          'remove','load'
        ])
      },
      mounted(){
        this.load()
      }

以便在启动后调用this.load()装入它。

## 整合：后端和数据库

要完成后端到数据库的整合，需要做如下的修改：

1. 原本在后端App Server内Todo数据数组，现在应该从Mongodb获得
2. 原本在添加Todo对象的时候只是添加到AppServer对象内，现在需要同时写入Mongodb
3. 原本在删除时只是从数组删除，现在需要同时在Mongodb内删除

因此，现在我们需要添加三个函数，分别做针对Mongodb的获取清单、添加和删除的工作：

    var mongo = require('mongodb')
    function insertDoc(subject,callback){
      const connectionString = 'mongodb://localhost:27017';
      (async () => {
          const client = await MongoClient.connect(connectionString,
              { useNewUrlParser: true });
          const dbo = client.db('todos');
          try {
             var res = await dbo.collection('todo').insertOne(
              {subject:subject})
             callback(undefined,res.insertedId)
          }
          catch(err){
            callback(err)
          }
          finally {
              client.close();
          }
      })().catch(err => console.error(err));
    }
    function deleteDoc(_id,callback){
      const MongoClient = mongo.MongoClient;
      const connectionString = 'mongodb://localhost:27017';
      (async () => {
          const client = await MongoClient.connect(connectionString,
              { useNewUrlParser: true });
          const dbo = client.db('todos');
          try {
                  var myquery = {_id:new mongo.ObjectID(_id)}
                  var r = await dbo.collection("todo").deleteMany(myquery)
            }
            catch(err){
            callback(err)
          }
          finally {
                client.close();
                callback()
            }
      })().catch(err => console.error(err));
    }
    function allDoc(callback){
      const MongoClient = mongo.MongoClient;
      const connectionString = 'mongodb://localhost:27017';
      (async () => {
          const client = await MongoClient.connect(connectionString,
              { useNewUrlParser: true });
          const dbo = client.db('todos');
          try {
                 var r = await dbo.collection("todo").find().toArray()
                 var ts = []
                 for (var i = 0; i < r.length; i++) {
                   ts.push({id:r[i]._id,subject:r[i].subject})
                 }
                 callback(undefined,ts)
            }
            catch(err){
            callback(err)
          }
          finally {
                client.close();
            }
      })().catch(err => console.error(err));
    }

这三个函数的功能和使用方法如下：

1. 函数allDoc会从Mongodb内获取全部todo集合，并通过callback传递这个集合给调用者函数。
2. 函数deleteDoc会从Mongodb内删除指定id的todo条目，完成删除后，通过callback通知调用者。
3. 函数deleteDoc会向Mongodb内添加一个todo条目，完成添加后，通过callback通知调用者，并传递新的todo对象给调用者。

这里的代码本身并不复杂，但是因为涉及到如何访问Mongodb，因此涉及到比较多的概念，这里不做具体的解释，你可以先把它们用起来。如果完成了本教程后，希望对Mongodb的访问做具体了解的话，可以查看后文附录的“Mongodb快速参考”。

并且和App Server对应的代码接驳，把原来的路由代码替换如下：

    app.delete('/api/todo/:id', function (req, res) {
      var userkey = req.params.id
      deleteDoc(userkey,function(){
        todos.splice(indexById(userkey),1)
        res.end( JSON.stringify(todos));
      })
    })
    app.get('/api/todos', function (req, res) {
      allDoc(function(err,todos){
        res.end( JSON.stringify(todos));  
      })
    })
    app.post('/api/todo', function (req, res) {
      insertDoc(req.body.subject,function(err,_id){
        var obj ={id:_id,subject:req.body.subject}
      todos.push(obj)
      res.end(JSON.stringify(obj))
        rs()
      })
    })

     
# Mongodb快速参考

本文会把一个对象todo对象（有属性{id，name})存储到Mongodb，做查询删除的测试（Create Remove Delete = CRD）。这个测试包括使用Mongodb Shell，使用CallBack古典风格的访问代码，以及使用Await/Async的现代风格的代码。完成这个这个验证后，就可以掌握最初步的Mongodb了。

我使用的Nodejs是10.7 。操作系统环境为Mac OS X High Sierra。

## 准备环境

安装和运行Mongodb Daemon

    brew install mongodb
    mongodb


## 访问验证
首先执行Mongodb Shell:

    mongo

输入命令，查询数据库清单：

    > show dbs
    local           0.000GB

创建一个数据库

    use todos
    
(若database不存在，则会创建一个，此时若不做任何操作直接退出，则MongoDB会删除该数据库)

    db.todo.insert({id:1,name:"reco"})
    db.todo.insert({id:2,name:"rita"})

查询 ：

    db.todo.find()

    { "_id" : ObjectId("5b727c0846b6c71a98d3af52"), "id" : 1, "name" : "reco" }
    { "_id" : ObjectId("5b727c7046b6c71a98d3af53"), "id" : 2, "name" : "reta" }

删除记录：

    db.todo.remove({id:1})
    
删除数据库

    db.todo.drop()
    
## 使用nodejs方式访问Mongodb

使用nodejs执行类似Shell对对象的CRD,代码如下：

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/todos";
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      console.log("Database created!");
      var dbo = db.db("todos");
      // var myobj = { id: 1, name: "reco" };
      // dbo.collection("todo").insertOne(myobj, function(err, res) {
      //   if (err) throw err;
      //   console.log("1 document inserted");
      //   db.close();
      // });
       var myobj = [
        { id: 1, name: 'reco'},
        { id: 2, name: 'rita'},
      ];
      dbo.collection("todo").insertMany(myobj, function(err, res) {
        if (err) throw err;
        console.log("Number of documents inserted: " + res.insertedCount);
        dbo.collection("todo").find({}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
            var myquery = { id: 1 };
          dbo.collection("todo").deleteMany(myquery, function(err, obj) {
            if (err) throw err;
            console.log("document deleted");
            db.close();
          });
        });    
      });
    })

代码非常简单，无需更多解释。此代码使用了mongodb模块，需要首先安装：
    
    npm init -y
    npm i mongodb --save
    
然后使用`node index.js`运行即可看到效果:

    Database created!
    Number of documents inserted: 2
    [ { _id: 5b72ab9e3245f169ef5f43d2, id: 1, name: 'reco' },
      { _id: 5b72ab9e3245f169ef5f43d3, id: 2, name: 'rita' } ]
    document deleted

## 利用高级异步特性

使用Await/Async特性，可以有效的减少代码中的回调地狱现象。同样的功能，可以使用这样的代码:

    const MongoClient = require('mongodb').MongoClient;
    const connectionString = 'mongodb://localhost:27017';
    (async () => {
        const client = await MongoClient.connect(connectionString,
            { useNewUrlParser: true });
        const dbo = client.db('todos');
        try {
           var res = await dbo.collection('todo').insertMany(
            [{id:1,name:"reco"}, {id:2,name:"rita"}]);
           console.log("Number of documents inserted: " + res.insertedCount);
           var r = await dbo.collection("todo").find().toArray()
           console.log(r);
           var myquery = { id: 1 };
         var r = await dbo.collection("todo").deleteMany(myquery)
         console.log("document deleted");
        }
        finally {
            client.close();
        }
    })().catch(err => console.error(err));


执行此代码，输出如下：

    Number of documents inserted: 2
    [ { _id: 5b72ae8a1c674a6ac1c5aa6e, id: 1, name: 'reco' },
      { _id: 5b72ae8a1c674a6ac1c5aa6f, id: 2, name: 'rita' } ]
    document deleted

# Vuejs快速参考

Vuejs本身要学的还真不少，这也是我会编写一本书来介绍它的原因。但是说到入门的话，我倒是写过一篇简单的[介绍文章](https://segmentfault.com/a/1190000007548442)。不妨去阅读看看。

上面的文章，也就对Vuejs了解个大概，提起一个兴趣。如果真的想要学习Vuejs的话，还是得看书的。这里也放一个我的书的广告，欢迎参阅。

![ad](http://file.ituring.com.cn/ScreenShow/010061ef0b279fb427bf)
[购买](http://www.ituring.com.cn/book/1956)

# 问题索引

麻雀虽小五脏俱全，虽然是一个小小的示例的应用，但是每样技术也都需要用到，遇到的技术问题也是要一个个的解决的。这里列出我遇到的问题，作为索引，也算记录我在写作过程中解决的问题，也可以作为你学习完毕后的一个查漏补缺的索引，在这里重新看到问题，然后使用代码验证自己对问题的理解和学习。

1. 使用Nodejs如何搭建一个RESTFUL的服务？
- 如何把cli-service中来自客户端但是需要去应用服务器的URL访问转移到应用服务器？
- 如何解析前端提交的Json？
- 如何打包Json到响应内？
- 如何创建一个唯一的ID？本来是用于创建一个唯一ID，这样就不必使用MongoDB生成的ObjectID了，因此插入效率会更高。但是，最后还是按惯例采用了Mongo的了。
2. 如何加入新的单页组件？
- 在哪里插入获取服务端数据的代码？
3. 如何使用Buefy？
- 在Vuejs应用中内使用Buefy？
- 在Vuejs单页组件内使用Buefy？
- 如何关闭input的自动完成特性？这个自动完成每次当你输入的时候，都会显示一个曾经的输入的列表，真的很烦。
4. 如何在组件之间共享状态？
- 为何需要共享前端状态？
- 如何区别使用同步和异步状态操作？
- 如何映射状态操作到组件内，以方便组件对方法的调用？
5. 如何访问Mongo？
- 如何安装Mongo，并快速验证Mongo？
- 如何命令行插入、删除、列表一个Collection？
- 有哪些访问Mongo的Nodejs库，差别在哪里？
- 如何使用Await风格的代码做插入删除和列表？
- 如何获取插入项目后的项目ID？
- 如何使用ObjectId查询对应的项目？
6. 如何访问网络，包括curl、axios、fetch等几种方法？
- 如何提交Get请求？
- 如何提交Put请求？
- 如何在Body内提交json？
- 如何指定请求头内容类型为json？
- 如何获取响应中的Json数据?


# 参考文章

这个App虽然很小，但是并非一次写成的，我之前已经完成了若干个更加细小的、特定方面的文章，也写了一些代码。当然外部参考肯定也是不少，特别是Medium和Stack Overflow网站，对我支持很多。这里列出关键的一些参考文章。

1. 这里会使用vuex管理状态，之前有写过文章，[到底Vuex是什么](https://segmentfault.com/a/1190000007516967)，阅读量和评价还不少呢。当然，我举例的案例，有些勉强，为了用而用，实际案例并不需要Vuex，使用组件内状态即可。
2. 使用Mongodb存储和提供[后端CRD服务](https://juejin.im/post/5b727a9451882561195114cd)
3. 使用Nodejs搭建{id，name}的对象的后端CRD服务。计划参考之前我自己的2篇文章和一个SO关于如何在AJAX内创建PUT请求的问答
- [准备 JSON 服务器并访问它](https://juejin.im/post/59125c13128fe10058660800)
- [vuejs api server开发小抄](https://segmentfault.com/a/1190000007749465)
- [Axios PUT request to server](https://stackoverflow.com/questions/44103187/)axios-put-request-to-server
4. 使用Fecth|Axios访问后端CRD服务。此文章列举了几种访问网络库的方法，给了我一个全局的视野，因此我很受益于它。[Fetch vs. Axios.js for making http requests
](https://medium.com/@thejasonfile/fetch-vs-axios-js-for-making-http-requests-2b261cdd3af5)
5. 使用buefy的美化组件的方法。这个很小众了，因此就只能看看[官方文档](https://buefy.github.io/#/)了。

