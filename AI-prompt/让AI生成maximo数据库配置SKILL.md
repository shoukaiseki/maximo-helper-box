在 Maximo 的数据库配置（Database Configuration）体系中，MAXOBJECT、MAXATTRIBUTE、MAXRELATIONSHIP 是定义数据字典（Data Dictionary）最核心的三张元数据表。通常与之配合的还有带 CFG 后缀的暂存表（如 MAXOBJECTCFG），用于存放待发布的配置变更。

一、MAXOBJECT（对象/实体定义）

• 核心用法：定义 Maximo 中的业务对象（MBO），一个 Object 通常对应底层的一张物理表（如 WORKORDER）或视图。它决定了对象的生命周期层级（System/Site/Org）以及是否启用审计、工作流等全局属性。

- 关键字段：
  • OBJECTNAME：对象唯一内部名称（如 ASSET）。

  • DESCRIPTION：对象的描述信息。

  • SITEORGTYPE：对象层级（如 SYSTEM、SITE、ORG），决定是否需要 SITEID/ORGID 字段。

  - PERSISTENT：是否为持久化对象（对应物理表）。
  • ISAUDITENABLED / HASLD：是否启用审计/是否拥有长描述。

二、MAXATTRIBUTE（字段/属性定义）

- 核心用法：定义某个 Object 下属的具体字段（列）。这里不仅定义数据类型、长度，还管理字段是否引用值域（Domain）、是否必填、以及关键的 SAMEAS（继承）关系，确保跨表同义字段（如各表的 LOCATION）类型保持一致。
- 关键字段：
  • OBJECTNAME / ATTRIBUTENAME：所属对象名及字段内部名。

  • COLUMNNAME：底层数据库物理列名。

  • MAXTYPE：数据类型（ALN 字符、INT 整数、DATE、YORN 等）。

  - LENGTH / SCALE：字段长度与小数位。
  • SAMEASOBJECT / SAMEASATTRIBUTE：指向参照的源对象/字段（用于同步类型长度）。

  • REQUIRED / PERSISTENT：是否必填、是否持久化到数据库。

  - DOMAINID：关联的值域（Lookup/Domain）名称。

三、MAXRELATIONSHIP（对象关系定义）

• 核心用法：定义对象之间的关联（相当于预定义的 SQL Join/Where 条件）。允许一个对象（Parent）通过 SQL 片段关联另一个对象（Child），常用于界面子表展示或跨对象取数（如 WORKORDER 通过 ASSETNUM 关联 ASSET 拿资产描述）。运行时支持用 :parentattr 绑定父对象字段值。

- 关键字段：
  • PARENT / CHILD：父对象名（源）和子对象名（目标表）。

  • NAME：关系的唯一标识名（如 ASSET，在 MBO 中通过该名调用）。

  - WHERECLAUSE：核心 SQL 条件片段（如 assetnum = :assetnum and siteid = :siteid）。
  • REMARKS：关系备注说明。

四、Maximo 数据库配置注意事项

• 配置与发布分离：在 UI 或 CFG 表中做的改动（新增字段、修改长度）只是暂存，必须执行“应用配置变更”（Config DB）才能真正修改底层物理数据库结构，切勿直接在数据库层面手动 ALTER TABLE 后与 Maximo 元数据脱节。

- 利用 SAMEAS 规范：自定义字段若业务含义与标准字段相同（如单据编号），务必使用 SAMEASOBJECT/ATTRIBUTE 指向标准字段，避免后续修改长度时出现各处不一致，导致隐式类型转换或截断错误。
- 关系性能与写法：WHERECLAUSE 务必确保关联字段有索引（尤其是子表 CHILD 的过滤字段）。避免在高频加载的对象上写过于复杂的多表嵌套关系；字段绑定符 :fieldname 必须准确对应 PARENT 对象的真实属性名。
- 生产操作前置条件：正式环境跑配置前，必须全库备份；建议开启“管理模式下”（Admin Mode）踢出其他用户、挂起 Cron Task，防止配置过程中表锁或数据写入导致结构变更中断、元数据状态卡死（如 CHANGED='I' 异常残留）。
- 不可随意缩减：已有数据的生产字段，避免减小长度或更改类型（如 ALN 转 INT），极易导致数据截断或配置失败；删除持久化字段需确认无历史数据依赖，且会物理删列，操作需极谨慎。