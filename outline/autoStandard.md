在以团队内执行一些规范，是非常有必要的，其中：
1. 代码复杂度低于5
2. 代码风格，像是逗号后要加空格，花括号前要加空格等
3. 测试覆盖率

我个人写代码不太注意代码风格，那些细细碎碎规则我肯定是知道一些，但是不那么在乎。比如空格怎么安排，花括号与不要提行。但是一旦在团队内，感觉这些看起来比较枝节的东西，可以在单词和语句一级提升代码的整洁度和一致性，对同行和同事是非常友好的。而付出的努力并不多，即使有些不符合习惯的套路，只要想做，一两天就可以矫正过来。

另一个方面是关于代码复杂度。它的复杂度值低一些，就大量的减少代码的坏味道，特别是大函数，这一点就可以让代码变得不那么容易腐化。尽管重构的作者用了一个巨大的部头来说重构这件事，但是说简单，就是这些简单的原则，即可大幅度的改善代码质量。对同行好一点。

然而，通过团队手册来推行的话，有点啰嗦，大家做事也没有先看手册的习惯。通过Code Review也做了不少，觉得大题小做，显得团队领导有点婆婆妈妈的。如果能够自动化，那就最好了。说起来也不难，道理就是：

1. 在每次git提交前要求必须通过代码风格检查，复杂度检查和测试覆盖率检查
2. 只要git允许在提交任务前做限制即可
3. git可以通过hook技术，在提交任务发起时，通知执行任务，检查任务执行结果，觉得继续提交或者终止提交

本文试图以Git为版本工具，以Github为提交目的仓库，使用JavaScript编写验证代码，求证自动化检查的运作方式。帮助读者了解背后的原理和执行实践的方法，以及此方法的价值。其中把这些工具整合起来的有一个NPM模块，叫做Husky。

待检查的目标代码，作为一个测试用例，是一定要有些问题的，包括代码风格，覆盖度和复杂度问题。讲解从这里开始。

候选目标代码： yddict
这个库有不好PR和需要Review的代码。可以从这里开始 https://github.com/1000copy/google-translate-api

候选，一段纯粹的代码，没有网络和磁盘IO的： https://stackoverflow.com/questions/11966520/how-to-find-prime-numbers-between-0-100]

我写的贪食蛇游戏! 感觉太长了，不适合放在文章里面： https://github.com/1000copy/js24000/blob/master/renewofsnake.html

username代码，取得它的同步代码即可。不复杂。测试需要跨平台，也是麻烦。

array-slice https://github.com/jonschlinkert/array-slice/blob/master/index.js ,稍微改变，就比较合适。

还是字符串的最好。pad-left，曾经很大争议的一个库。https://github.com/jonschlinkert/pad-left/blob/master/index.js

具体工具罗列如下：
1. Git
2. GitHub
3. Husky 提供Git提交的事件挂接方法 https://www.vojtechruzicka.com/githooks-husky/
4. 集成工具  Travis CI https://travis-ci.org/ 可以使用github登录。会执行下载，安装node，安装依赖，以及执行单元测试npm test。一个案例： https://travis-ci.org/kenshinji/yddict/builds/424206269?utm_source=github_status&utm_medium=notification  另外，看起来travis CI是可以验证代码在多个版本的Nodejs的运行情况的。因为这句话： ”昨天阅读 username 3.0.0 版本的源码之后，根据自己的想法向作者 Sindre Sorhus 提出了 Pull Request，没想到今天 Sindre 接受了 PR 同时放弃了对 Node 4 的支持，升级至 4.0.0 版本，不过核心代码并有太大的变化 “
5. Coverage工具 https://coveralls.io/ 支持github和bitbucket登录和集成，也是一个生态的。不需要单独注册，使用体验很顺利。
6. 复杂度测试工具 codeclimate 。支持github登录和集成，也是一个生态的。不需要单独注册，使用体验很顺利。
7. 单元测试工具ava|mocha
8. 风格检查工具 eslint  https://eslint.org/docs/user-guide/getting-started
9. 集成测试cypress end to end test https://www.cypress.io/
10. 风格检查工具 xo Uses ESLint underneath ，Enforces strict and readable code. Never discuss code style on a pull request again! No decision-making. No .eslintrc or .jshintrc to manage. It just works! https://github.com/xojs/xo


这也给更大范围的，远程的沟通带来了方便，代码仓库的作者可以设定一些规则，符合规则的PR代码才会被审议和接受，不符合的甚至无法提交，当然也就谈不上被合并进来。创造者指定规则，跟随者适应规则，这也是合作的应有之义，保证作者不必被低质量的PR打搅，也让跟随者知道规则，提交高质量的代码。这样的合作是更高质量的，自动化的，而不必人和人之间的对话。当然效率更高。我的这些微薄的想法来自于此： https://medium.com/tech-tajawal/modern-frontend-developer-in-2018-4c2072fa2b9c 。他论述了通过PR来学习代码的方法和这个方法的价值。


Time to Practice
I say this a lot and I will say it here again, you don’t learn anything without practice. You might have a momentary feeling that you understand something but it would soon go away if you don’t practice. Make sure that you practice as much as you can, while you are following this roadmap.

Go ahead and make some responsive website and add interactivity with JavaScript. You can copy any existing webpage that you might find interesting online but remember to use everything that you have learnt till this point.

Once you have made some of the websites, its time to get into the real business now. So go to github.com and search for some projects and try to open some pull requests on some open-source projects. Some of the ideas for pull requested are listed below :

Enhance the UI, make any demo pages responsive or improve the design
Look at any of the open issues that you can solve
Refactor any of the code that you think can be improved
Link this repo, tell them you are learning and ask for feedback on your PR and how you can improve.
While I would recommend this Github part, it needs some knowledge of git and is optional. You don’t have to do this but if you do, you will find it really beneficial — you will be amazed that how many people are willing to help you if you just ask. You can find many free resources for git, try this one.


看模块，提交PR，做Code Review都是比较好的学习方法。i5ting也有谈过这个问题，我非常赞同。https://cnodejs.org/topic/5ab3166be7b166bb7b9eccf7

这是我做过的尝试：https://github.com/kenshinji/yddict/pull/33 ，可以在此页面中看到提交的过程，每一个提交的代码检查结果和覆盖测试结果等。