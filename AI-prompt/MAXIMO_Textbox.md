# ​MaximoTextbox.vue​ 
## 属性lookup
默认为空,不区分大小写
如果lookup有值,则显示 img_lookup.gif 图标
如果值为:DATELOOKUP,则显示 img_date_time.gif 图标


## maxtype 属性
默认为'ALN',不区分大小写
如果为 DATE,显示 img_date.gif 图标
如果为DATETIME,显示 img_date_time.gif 图标

##  menutype 属性
默认为空,不区分大小写
如果为 'NORMAL',显示 img_menu.gif 图标

## iconmenu 属性
默认为空
如果有有值,该值就是图标名称


图标优先级 iconmenu -> menutype ->  lookup -> maxtype