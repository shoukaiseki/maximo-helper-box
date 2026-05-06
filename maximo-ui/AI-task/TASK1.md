maximouiweb 里面不要做任何改动,这是原maximo系统中的资源文件,包含一些css样式

现在交给你个任务,在maximo91ui下新增一个 maximo91-style.html
页面中组件使用maximo-style.html的几种,可以增加

样式读取 maximouiweb中的样式


根目录下component-registry.xml 是maxiom中应用设计器的组件配置,组件对应的jsp基本在 maximouiweb\webclient\components目录下面

你来分析这些组件的样式(基本上跟你改的maximo91_export\user_detail_static.html差不多),因为之前你建的 maximo91-sytle-new.html 和maximo91-sytle.html 样式不是我看到的系统样式,所以删掉了,
现在你重新帮我在 maixmo91目录创建一个 maximo91-style.html

用到的css重新从maximouiweb目录复制过来



Form Fields 的背景色应该是 transparent,而他的上一级基本上是#f1f1f1,

都是放到 section 里面的(请查看maximo91_export_png/user.xml),这是应用程序设计器导出的xml,
tab id="main" 这部分就是 maximo91_export/user_detail_static.html 的显示效果
你现在帮我把 maximo91-graphite-style.html 再优化下,
maximo91-graphite-style.html是组件演示用的,显示maximo各个组件,各种状态下的不同显示效果
比如单行文本框,列表,按钮,多行文本框,多部分文本框,状态又有只读,必填,常规三种,显示效果也都有点不一样


帮我写个页面,以maximo91/testuser.html 的样式为组件样式基准



还是有差距,可以试下用 maximouiweb\webclient\skins\skins-20260429-0534\mas8 下面的样式创建一个
maximo91_skins-20260429-0534_mas8 的目录,再建个maximo-style.html


样式文件显示效果是对上了,就是 maximouiweb\webclient\skins\skins-20260429-0534\mas8 下面的样式

不过还需优化下,参考maximo91/testuser.html,单行文本框高度,



根据demo01-ui下面的 SC_SE.html 字段属性,创建新文件,放到{根目录}/demo01-ui-mas91目录下面
样式根据 maximo91/testuser.html 的样式,css优先选择 demo01-ui-mas91\skins-20260429-0534(是从 maximouiweb\webclient\skins\skins-20260429-0534复制过来的) 下面的css,
不要改其他的文件
