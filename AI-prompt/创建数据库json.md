# 创建数据库接口json语句
## 数据库配置页面拥有的字段
这是maximo中应用程序设计器导出的数据库配置拥有的字段
```
<tab id="main" label="对象" type="insert">
<section border="true" id="main_header">
<sectionrow id="main_header_row1">
<sectioncol id="main_header_row1_col1">
<section id="main_grid3">
<multiparttextbox dataattribute="objectname" descdataattribute="description" id="main_grid3_1" ondatachange="resetchildren"/>
</section>
</sectioncol>
<sectioncol id="main_header_row1_col2">
<section id="main_grid3a">
<textbox dataattribute="viewchanged" id="main_grid3a_1"/>
</section>
</sectioncol>
</sectionrow>
</section>
<section id="main_section">
<sectionrow id="main_section_row1">
<sectioncol id="main_section_row1_col1">
<section id="main_section_row1_col1_section" label="详细信息">
<sectionrow id="details1">
<sectioncol id="details2">
<section id="details3">
<textbox dataattribute="servicename" id="main_details3_1" lookup="maxservice"/>
<textbox dataattribute="maxservice.description" id="main_details3_2"/>
<textbox dataattribute="ENTITYNAME" id="main_details3_3" ondatachange="resetchildren"/>
<textbox dataattribute="CLASSNAME" id="main_details3_4"/>
<textbox dataattribute="EXTENDSOBJECT" id="main_details3_5" lookup="objectname" ondatachange="resetchildren"/>
<textbox dataattribute="siteorgtype" id="main_details3_6" lookup="valuelist"/>
<textbox dataattribute="textdirection" id="main_details3_7" lookup="valuelist"/>
</section>
</sectioncol>
<sectioncol id="details4">
<section id="details5">
<checkbox dataattribute="MAINOBJECT" id="main_details5_1"/>
<checkbox dataattribute="PERSISTENT" id="main_details5_2" ondatachange="resetchildren"/>
<checkbox dataattribute="USERDEFINED" id="main_details5_3"/>
<checkbox dataattribute="IMPORTED" id="main_details5_4"/>
<checkbox dataattribute="INTERNAL" id="main_details5_5"/>
</section>
</sectioncol>
</sectionrow>
</section>
</sectioncol>
<sectioncol id="main_details_row1_col1">
<section id="main_grid5" label="表">
<sectionrow id="table1">
<sectioncol id="table2">
<section id="table3">
<textbox dataattribute="STORAGEPARTITION" id="main_table3_1" lookup="valuelist"/>
<combobox dataattribute="storagetypedesc" id="main_table3_2" sigoption="STORAGETYPE" smartfilloff="true"/>
<textbox dataattribute="uniquecolumnname" id="main_table3_3" ondatachange="resetchildren"/>
<textbox dataattribute="langtablename" id="main_table3_4"/>
<textbox dataattribute="langcolumnname" id="main_table3_5"/>
<textbox dataattribute="altixname" id="main_table3_6" lookup="maxsysindexes"/>
<textbox dataattribute="trigroot" id="main_table3_7"/>
<textbox dataattribute="maxtablecfg.exttablename" id="main_table3_8" inputmode="readonly"/>
</section>
</sectioncol>
<sectioncol id="table4">
<section id="table5">
<checkbox dataattribute="addrowstamp" id="main_table5_1"/>
<checkbox dataattribute="islangtable" id="main_table5_2" inputmode="readonly"/>
<checkbox dataattribute="isaudittable" id="main_table5_3" inputmode="readonly"/>
<checkbox dataattribute="textsearchenabled" id="main_table5_4" ondatachange="resetchildren"/>
</section>
</sectioncol>
</sectionrow>
</section>
</sectioncol>
</sectionrow>
</section>
<section id="main_view" label="风景">
<sectionrow id="main_details_row1t">
<sectioncol id="main_details_row1_col1t">
<section id="main_grid5t">
<checkbox dataattribute="ISVIEW" id="main_grid8_1" ondatachange="resetchildren"/>
<multilinetextbox columns="18" dataattribute="viewwhere" id="main_grid8_2" rows="3"/>
</section>
</sectioncol>
<sectioncol id="main_details_row1_col2t">
<section id="main_grid6t">
<textbox dataattribute="joinobject" id="main_grid6t_1" lookup="objectname" ondatachange="resetchildren"/>
<multilinetextbox columns="18" dataattribute="viewselect" id="main_grid6t_2" rows="3"/>
</section>
</sectioncol>
<sectioncol id="main_details_row1_col3t">
<section id="main_grid8t">
<checkbox dataattribute="autoselect" id="main_grid8t_1" ondatachange="resetchildren"/>
<multilinetextbox columns="18" dataattribute="viewfrom" id="main_grid8t_2" rows="3"/>
</section>
</sectioncol>
</sectionrow>
</section>
<section id="main_audit" label="审计">
<sectionrow id="main_details_row1s">
<sectioncol id="main_details_row1_col1s">
<section id="main_grid5s">
<checkbox dataattribute="EAUDITENABLED" id="main_grid5s_1"/>
<textbox dataattribute="EAUDITTBNAME" id="main_grid5s_2"/>
</section>
</sectioncol>
<sectioncol id="main_details_row1_col2s">
<section id="main_grid6s">
<multilinetextbox columns="18" dataattribute="EAUDITFILTER" id="main_grid6s_1" rows="3"/>
</section>
</sectioncol>
<sectioncol id="main_details_row1_col3s">
<section id="main_grid8s">
<multilinetextbox columns="18" dataattribute="ESIGFILTER" id="main_grid8s_1" rows="3"/>
</section>
</sectioncol>
</sectionrow>
</section>
</tab>
<tab id="columns" label="属性">
<section border="true" id="columns_header">
<sectionrow id="columns_header_row1">
<sectioncol id="columns_header_row1_col1">
<section id="columns_grid3">
<multiparttextbox dataattribute="objectname" descdataattribute="description" id="columns_grid3_1"/>
</section>
</sectioncol>
<sectioncol id="columns_header_row1_col2">
<section id="columns_grid3a">
<textbox dataattribute="viewchanged" id="columns_grid4_6"/>
</section>
</sectioncol>
</sectionrow>
</section>
<table beanclass="psdi.webclient.beans.configur.AttributesBean" id="columns_columns_table" label="属性" relationship="MAXATTRIBUTECFG">
<tablebody displayrowsperpage="10" filterable="true" id="columns_columns_table_tablebody">
<tablecol filterable="false" id="columns_columns_table_tablebody_1" mxevent="toggledetailstate" mxevent_desc="显示详细信息" sortable="false" type="event"/>
<tablecol dataattribute="viewchanged" filterable="false" id="columns_columns_table_tablebody_2" ondatachange="refreshtable" sortable="false"/>
<tablecol dataattribute="attributename" id="columns_columns_table_tablebody_3"/>
<tablecol dataattribute="remarks" id="columns_columns_table_tablebody_4"/>
<tablecol dataattribute="maxtype" id="columns_columns_table_tablebody_5" linkedcontrolid="columns_basic_row1_col1_3" ondatachange="refreshtable"/>
<tablecol dataattribute="length" id="columns_columns_table_tablebody_6" ondatachange="refreshtable"/>
<tablecol dataattribute="scale" id="columns_columns_table_tablebody_7" ondatachange="refreshtable"/>
<tablecol dataattribute="primarykeycolseq" id="columns_columns_table_tablebody_11" ondatachange="refreshtable"/>
<tablecol dataattribute="required" id="columns_columns_table_tablebody_8" linkedcontrolid="columns_basic_row1_col1_6"/>
<tablecol filterable="false" id="columns_columns_table_tablebody_10" mxevent="maxlookupmap" mxevent_desc="编辑查找图" mxevent_icon="btn_edit.gif" sortable="false" type="event"/>
<tablecol filterable="false" id="columns_columns_table_tablebody_9" mxevent="toggledeleterow" mxevent_desc="标记要删除的行" mxevent_icon="btn_garbage.gif" sortable="false" type="event"/>
</tablebody>
<tabledetails id="columns_columns_table_1">
<section id="columns_columns_table_1_grid30" label="详细信息">
<sectionrow id="columns_row1">
<sectioncol id="columns_row1_col1">
<section id="columns_basic_row1_col1">
<textbox dataattribute="attributename" id="columns_basic_row1_col1_1"/>
<textbox dataattribute="remarks" id="columns_basic_row1_col1_2"/>
<textbox dataattribute="maxtype" id="columns_basic_row1_col1_3" lookup="valuelist" ondatachange="resetchildren"/>
<textbox dataattribute="length" id="columns_basic_row1_col1_4"/>
<textbox dataattribute="scale" id="columns_basic_row1_col1_5"/>
<checkbox dataattribute="required" id="columns_basic_row1_col1_6"/>
</section>
</sectioncol>
<sectioncol id="columns_row1_col2">
<section id="columns_basic_row1_col2">
<textbox dataattribute="title" id="columns_basic_row1_col2_1"/>
<textbox dataattribute="classname" id="columns_basic_row1_col2_2"/>
<textbox applink="domainadm" dataattribute="domainid" id="columns_basic_row1_col2_3" lookup="domain" menutype="normal"/>
<textbox dataattribute="defaultvalue" id="columns_basic_row1_col2_4"/>
<textbox dataattribute="alias" id="columns_basic_row1_col2_5"/>
<textbox dataattribute="viewchanged" id="columns_basic_row1_col2_6"/>
</section>
</sectioncol>
</sectionrow>
</section>
<section id="columns_advanced" label="高级">
<sectionrow id="columns_advanced_row1">
<sectioncol id="columns_advanced_row1_col1">
<section id="columns_advanced_grid1">
<textbox dataattribute="entityname" id="columns_advanced_row1_col1_1"/>
<textbox dataattribute="columnname" id="columns_advanced_row1_col1_2"/>
<textbox dataattribute="sameasobject" id="columns_advanced_row1_col1_3" lookup="objectname"/>
<textbox dataattribute="sameasattribute" id="columns_advanced_row1_col1_4" lookup="attributename"/>
<textbox dataattribute="autokeyname" id="columns_advanced_row1_col1_5" lookup="autokey"/>
<textbox dataattribute="searchtype" id="columns_advanced_row1_col1_6" lookup="valuelist"/>
<checkbox dataattribute="localizable" id="columns_advanced_row1_col1_7"/>
<textbox dataattribute="textdirection" id="columns_advanced_row1_col1_8" lookup="valuelist"/>
</section>
</sectioncol>
<sectioncol id="columns_advanced_row2_col1">
<section id="columns_advanced_grid2">
<checkbox dataattribute="persistent" id="columns_advanced_row1_col2_1"/>
<checkbox dataattribute="mustbe" id="columns_advanced_row1_col2_2"/>
<checkbox dataattribute="ispositive" id="columns_advanced_row1_col2_3"/>
<checkbox dataattribute="userdefined" id="columns_advanced_row1_col2_4"/>
<checkbox dataattribute="canautonum" id="columns_advanced_row1_col2_5"/>
<checkbox dataattribute="isldowner" id="columns_advanced_row1_col2_6"/>
<textbox dataattribute="sequencename" id="columns_advanced_row1_col2_7"/>
<textbox dataattribute="complexexpression" id="columns_advanced_row1_col2_8" lookup="valuelist"/>
</section>
</sectioncol>
<sectioncol id="columns_advanced_col3">
<section id="columns_advanced_col3a">
<checkbox dataattribute="eauditenabled" id="columns_advanced_row1_col3_1"/>
<checkbox dataattribute="mlsupported" id="columns_advanced_row1_col3_2"/>
<checkbox dataattribute="mlinuse" id="columns_advanced_row1_col3_3"/>
<checkbox dataattribute="esigenabled" id="columns_advanced_row1_col3_4"/>
<textbox dataattribute="primarykeycolseq" id="columns_advanced_row1_col3_5"/>
<textbox dataattribute="attributeno" id="columns_advanced_row1_col3_6"/>
<textbox dataattribute="nextsequenceno" id="columns_advanced_row1_col3_7"/>
</section>
</sectioncol>
</sectionrow>
</section>
</tabledetails>
<buttongroup id="columns_columns_table_2">
<pushbutton default="true" id="columns_columns_table_2_1" label="新建行" mxevent="addrow"/>
</buttongroup>
</table>
</tab>
```


这是接口方式
```

```