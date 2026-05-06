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