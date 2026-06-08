# 导出到Excel
## 说明

比如先根据这个语句获取要导出的sheet1的表数量
```
select
       l.DESCRIPTION as l_description,
       OBJECTNAME,MAXOBJECT.DESCRIPTION
from MAXOBJECT
left join L_MAXOBJECT as l on (MAXOBJECTID=l.OWNERID and l.LANGCODE='ZH')
where objectname like 'IBM%' or OBJECTNAME in ('ITEM');

```

再根据表数量导出表字段信息
```
select
    MAXATTRIBUTE.title,l.TITLE as l_title,ATTRIBUTENAME,ATTRIBUTENO,DOMAINID,ISPOSITIVE,LENGTH,MAXTYPE,REQUIRED,PRIMARYKEYCOLSEQ,SAMEASOBJECT,SCALE,l.REMARKS as l_remarks,MAXATTRIBUTE.REMARKS,DEFAULTVALUE,AUTOKEYNAME
from MAXATTRIBUTE
         left join L_MAXATTRIBUTE as l on (MAXATTRIBUTEID=l.OWNERID and l.LANGCODE='ZH')
where OBJECTNAME='ITEM'
order by ATTRIBUTENAME;
```
再导出表关联关系信息
```
select
      NAME, CHILD,WHERECLAUSE,CARDINALITY,REMARKS
from MAXRELATIONSHIP

where PARENT='ITEM';
```
再根据索引信息导出索引信息
```
-- 唯一索引标志（D=重复，U=唯一）
select * from MAXSYSINDEXES where tbname='ITEM';

-- 根据MAXSYSINDEXES.NAME查询索引列
select * from MAXSYSKEYS where  IXNAME in (select name from MAXSYSINDEXES where tbname='ITEM')
```

导出对象信息如下
```
表名: ITEM
字段表头
字段信息
(这里空一行)
关联关系表头
关联关系信息
(这里空一行)
索引表头
索引信息  索引列
(这里空二行)
表名: ITEM
字段表头
字段信息
(这里空一行)
关联关系表头
关联关系信息
(这里空一行)
索引表头
索引信息  索引列
```

这些是sheet1

sheet2为域信息

重要提示: 根据之前所有表列的domainid字段缓存所有的域值


最后根据domainid字段缓存的域值，用in方式查询所有域类型。
```
select
       l.DESCRIPTION as l_description,
       MAXDOMAIN.DOMAINID,
       MAXDOMAIN.DESCRIPTION ,
       MAXDOMAIN.DOMAINTYPE ,
       MAXDOMAIN.MAXTYPE,
       MAXDOMAIN.LENGTH,
       MAXDOMAIN.SCALE
from MAXDOMAIN
         left join l_maxdomain as l on (maxdomainid=l.ownerid and l.langcode='zh')
where domainid like 'IBM%'
order by DOMAINID
```
再根据不同的域类型查找不同的域值
```
select l.DESCRIPTION as l_description,
       NUMERICDOMAIN.* from NUMERICDOMAIN
left join L_NUMERICDOMAIN as l on (NUMERICDOMAINID=l.OWNERID and l.LANGCODE='ZH')
where DOMAINID='xxx'
;

select L.DESCRIPTION as L_DESCRIPTION,ALNDOMAIN.* from ALNDOMAIN
left join L_ALNDOMAIN as l on (ALNDOMAINID=l.OWNERID and l.LANGCODE='ZH')
where domainid='xxx';

select l.DESCRIPTION as L_DESCRIPTION,SYNONYMDOMAIN.* from SYNONYMDOMAIN
left join L_SYNONYMDOMAIN as l on (SYNONYMDOMAINID=l.OWNERID and l.LANGCODE='ZH')
where domainid='xxx';
```

导出excel可以使用支持excel模板jar包,比如支持在excel中定义公式,函数等。

提供的sql中 l_ 开头的为多语言列,如果原来的 列字段是英文或者 ~null~,则使用 l_ 开头的列的值

你可以使用mcp-db2 工具查询要导出的excel信息的字段中文表头信息

# 表属性含义
## MAXOBJECT 表属性含义
| ATTRIBUTENAME | L\_TITLE | TITLE | L\_REMARKS |
| :--- | :--- | :--- | :--- |
| CLASSNAME | Java 类 | Java Class | 这是用于表示和管理业务对象的 Java 类。 |
| DESCRIPTION | 描述 | Description | 对象描述 |
| DESCRIPTION\_LONGDESCRIPTION | 有关“描述”的详细描述 | Description Long description | 有关“描述”的详细描述 |
| EAUDITENABLED | 已启用电子审计 | E-audit Enabled | 选中时，指示对该对象启用“电子审计（EAUDIT）”。 |
| EAUDITFILTER | 电子审计过滤器 | E-audit Filter | 用户定义的电子审计记录过滤器 |
| ENTITYNAME | 实体 | Entity | 此业务对象所依赖于的数据库对象的名称。 该数据库对象可以是表或视图。 |
| ESIGFILTER | 电子签名过滤器 | E-signature Filter | 用户定义的电子签名过滤器 |
| EXTENDSOBJECT | 扩展对象 | Extends Object | 指定的业务对象所扩展的业务对象。 仅当所指定业务对象的相应实体为视图时，才应扩展对象。 |
| HASLD | 具有详细描述 | Has Long Description | 此布尔标志指示是否存在此记录的任何详细描述 |
| IMPORTED | 导入的 | Imported | 指示此对象是在数据库中创建的，并已导入到产品环境中。 |
| INTERNAL | 内部 | Internal | 指示此对象保留供平台内部使用，并且不可通过“数据库配置”应用程序进行变更。 |
| ISVIEW | 视图？ | Is View | 如果是视图，那么为 True。如果是表，那么为 False |
| LANGCODE | 语言代码 | Language Code | 语言代码 |
| MAINOBJECT | 主对象 | Main Object | 指示业务应用程序和工作流的主对象。 |
| MAXOBJECTID | MAXOBJECTID | MAXOBJECTID | 唯一标识 |
| OBJECTNAME | 对象 | Object | 业务对象的名称。 |
| PERSISTENT | 持久性 | Persistent | 指示一个持久对象，此对象可以是视图或表。 对象必须是持久的，这样您才能对其定义索引。 |
| RESOURCETYPE | 资源类型 | Resource Type | 资源类型 |
| SERVICENAME | 服务 | Service | 此业务对象所依赖于的产品的启动服务的名称。 |
| SITEORGTYPE | 地点/组织类型 | Site/Organization Type | 此对象所应用于的组织级别。 |
| TEXTDIRECTION | 文本方向 | Text Direction | 您输入到字段中的文本的方向。 |
| USERDEFINED | 用户定义 | User Defined | 指示此对象由用户创建。 |


## MAXATTRIBUTE 表属性含义
```
select
l.REMARKS,l.TITLE,ATTRIBUTENAME,ATTRIBUTENO,DOMAINID,ISPOSITIVE,LENGTH,MAXTYPE,REQUIRED,PRIMARYKEYCOLSEQ,SAMEASOBJECT,SCALE
       from MAXATTRIBUTE
left join L_MAXATTRIBUTE as l on (MAXATTRIBUTEID=l.OWNERID and l.LANGCODE='ZH')
where OBJECTNAME='MAXATTRIBUTE'
and ATTRIBUTENAME in ('REMARKS','TITLE','ATTRIBUTENAME','ATTRIBUTENO','DOMAINID','ISPOSITIVE','LENGTH','MAXTYPE','REQUIRED','PRIMARYKEYCOLSEQ','SAMEASOBJECT','SCALE' )
order by ATTRIBUTENAME;
```
| TITLE | ATTRIBUTENAME | ATTRIBUTENO | DOMAINID | ISPOSITIVE | LENGTH | MAXTYPE | REQUIRED | PRIMARYKEYCOLSEQ | SAMEASOBJECT | SCALE | REMARKS |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 属性 | ATTRIBUTENAME | 2 | NULL | 0 | 50 | UPPER | 1 | 2 | NULL | 0 | 属性名 |
| 属性号 | ATTRIBUTENO | 5 | NULL | 0 | 12 | INTEGER | 1 | NULL | NULL | 0 | 属性编号 |
| 域 | DOMAINID | 10 | NULL | 0 | 18 | UPPER | 0 | NULL | MAXDOMAIN | 0 | 该属性的验证域名称 |
| 正向 | ISPOSITIVE | 15 | NULL | 0 | 1 | YORN | 1 | NULL | NULL | 0 | 如果数字字段中只允许正值（和零），请选中此复选框；如果正负值都允许，请取消选中复选框。 |
| 长度 | LENGTH | 16 | NULL | 1 | 12 | INTEGER | 1 | NULL | NULL | 0 | 属性长度 |
| 数据类型 | MAXTYPE | 17 | MAXTYPE | 0 | 8 | UPPER | 1 | NULL | NULL | 0 | Maximo 数据类型 |
| 主键列序列 | PRIMARYKEYCOLSEQ | 21 | NULL | 1 | 12 | INTEGER | 0 | NULL | NULL | 0 | 如果该字段中存在值，那么指示在构造动态的 where 子句来更新或删除数据库中的行时，该列由业务对象组件使用。主列中的值必须是大于零的顺序唯一值。 |
| 备注 | REMARKS | 22 | NULL | 0 | 4000 | ALN | 1 | NULL | NULL | 0 | 描述该属性的备注 |
| 必需 | REQUIRED | 19 | NULL | 0 | 1 | YORN | 1 | NULL | NULL | 0 | 选中时，指示该字段需要输入一个值。 |
| 等同对象 | SAMEASOBJECT | 24 | NULL | 0 | 30 | UPPER | 0 | NULL | MAXOBJECT | 0 | “等同对象”+“等同属性”用于标识控制“最大类型”、“长度”和该属性“小数位数”的主属性 |
| 小数位数 | SCALE | 25 | NULL | 1 | 12 | INTEGER | 1 | NULL | NULL | 0 | 属性小数位数（小数点右侧的位置） |
| 标题 | TITLE | 26 | NULL | 0 | 80 | ALN | 1 | NULL | NULL | 0 | 要替换到消息和屏幕标签等内容中的明确而简短的列标识。 |

## MAXRELATIONSHIP 表属性含义
| ATTRIBUTENAME | L\_TITLE | TITLE | L\_REMARKS |
| :--- | :--- | :--- | :--- |
| CARDINALITY | 基数 | Cardinality | 数据库关联是独立的还是多重的？ |
| CHILD | 子对象 | Child Object | 关联子级的表名。 |
| DBJOINREQUIRED | 必需数据库连接吗？ | Is Database Join Required | 该关联使用必需的数据库连接吗？ |
| ISDEFAULT | 是否为缺省值 | Is Default | 用于表示两个对象之间缺省关系的标志 |
| MAXRELATIONSHIPID | MAXRELATIONSHIPID | MAXRELATIONSHIPID | 唯一标识 |
| NAME | 关系 | Relationship | 关联的标识。 |
| PARENT | 父级 | Parent | 关联所有者 |
| REMARKS | 备注 | Remarks | 对关联的明确描述。 |
| WHERECLAUSE | Where 子句 | Where Clause | 用于设置加入条件的子句。 如果条件不满足，将不加入该表。 |

## MAXSYSKEYS 表属性含义
| ATTRIBUTENAME | L\_TITLE | TITLE | L\_REMARKS |
| :--- | :--- | :--- | :--- |
| ASCENDING | 升序 | Ascending | 选中此项，指示这是一个升序键。 |
| CHANGED | 已变更 | Changed | 索引列是否已按配置变更？ （是或否） |
| COLNAME | 列 | Column | 列名 |
| COLSEQ | 序号 | Sequence | 此索引内部的列顺序 |
| IXNAME | 索引 | Index | 索引名称 |
| MAXSYSKEYSID | Maxsyskeys 标识 | Maxsyskeys Id | 唯一标识列 |
| ORDERING | 订购 | Ordering | 列排序（A=升序，D=降序） |
| VIEWCHANGED | 已变更 | Changed | 为便于阅读，对“已更改”的值进行了翻译。 |


## MAXSYSINDEXES 表属性含义
| ATTRIBUTENAME | L\_TITLE | TITLE | L\_REMARKS |
| :--- | :--- | :--- | :--- |
| CHANGED | 已变更 | Changed | 该索引是否已通过配置改变？ |
| CLUSTERRULE | 簇索引 | Clustered Index | 仅 SQL 服务器 - 簇索引标志（1=成簇，0=不成簇） |
| MAXSYSINDEXESID | Maxsysindexes 标识 | Maxsysindexes Id | 唯一标识列 |
| NAME | 索引 | Index | 索引名称 |
| REQUIRED | 内部 | Internal | 选中时，指示用户不能删除该索引。 |
| STORAGEPARTITION | 存储分区 | Storage Partition | 与数据库相关的，表的指定存储分区。这是 Oracle 的表空间和 Microsoft SQLServer 的段。 |
| TBNAME | 表 | Table | 索引所属的表名称 |
| TEXTSEARCH | 文本搜索索引 | Text Search Index | 指示是否已经创建该索引，以进行文本搜索 |
| UNIQUE | 强制唯一性 | Enforce Uniqueness | 选中后，指示这是唯一索引。 |
| UNIQUEIDINDEX | 唯一标识索引 | Unique ID Index | 标识这是否为唯一标识属性的索引 |
| UNIQUERULE | 唯一规则 | Unique Rule | 唯一索引标志（D=重复，U=唯一） |
| VIEWCHANGED | 状态 | Status | 配置的状态。可以是这些值之一：要添加、变更或删除 |

生成运行生成excel文件的脚本
生成模板的脚本就不需要了



使用 template_table_structure_1780507131886.xlsx 的样式
 domain样式也要改下

索引显示方式
 ```
 jx:each(items='obj.indexes', var='idx')			
 索引名称	表名	唯一标志	索引列
  A          ITEM   Y          ITEM_ID
                               A
  B          ITEM   N          ITEM_ID
```

domain显示方式
```
域名: xxx   描述:  xxx  英文描述:
域类型: xxx  数据类型: xxx  长度: xxx  小数位: xxx
(table标题) 域值   描述   英文名称
```