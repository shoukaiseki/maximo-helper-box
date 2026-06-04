package com.example.maximo.exporter.service;

import com.example.maximo.exporter.entity.*;
import org.jxls.common.Context;
import org.jxls.util.JxlsHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.sql.SQLException;
import java.util.*;

/**
 * 使用JXLS模板导出Excel
 */
public class JxlsExportService {
    private static final Logger logger = LoggerFactory.getLogger(JxlsExportService.class);
    private final DataService dataService;

    public JxlsExportService(DataService dataService) {
        this.dataService = dataService;
    }

    /**
     * 使用模板导出表结构
     */
    public void exportWithTemplate(String templatePath, String outputPath) throws IOException, SQLException {
        logger.info("Exporting with template: {} to: {}", templatePath, outputPath);
        
        try (InputStream templateIs = new FileInputStream(templatePath);
             OutputStream outputOs = new FileOutputStream(outputPath)) {
            
            Context context = new Context();
            
            List<MaxObject> objects = dataService.getMaxObjects();
            
            // 准备对象数据
            List<Map<String, Object>> objectDataList = new ArrayList<>();
            for (MaxObject obj : objects) {
                Map<String, Object> objMap = new HashMap<>();
                objMap.put("objectName", obj.getObjectName());
                objMap.put("description", obj.getDescription());
                
                // 获取字段信息
                List<MaxAttribute> attributes = dataService.getMaxAttributes(obj.getObjectName());
                List<Map<String, Object>> attrList = new ArrayList<>();
                for (MaxAttribute attr : attributes) {
                    Map<String, Object> attrMap = new HashMap<>();
                    attrMap.put("title", attr.getTitle() != null ? attr.getTitle() : "");
                    attrMap.put("lTitle", attr.getLTitle() != null ? attr.getLTitle() : "");
                    attrMap.put("attributeName", attr.getAttributeName() != null ? attr.getAttributeName() : "");
                    attrMap.put("attributeNo", attr.getAttributeNo());
                    attrMap.put("domainId", attr.getDomainId() != null ? attr.getDomainId() : "");
                    attrMap.put("isPositive", attr.getIsPositive());
                    attrMap.put("length", attr.getLength());
                    attrMap.put("maxType", attr.getMaxType() != null ? attr.getMaxType() : "");
                    attrMap.put("required", attr.getRequired());
                    attrMap.put("primaryKeyColSeq", attr.getPrimaryKeyColSeq());
                    attrMap.put("sameAsObject", attr.getSameAsObject() != null ? attr.getSameAsObject() : "");
                    attrMap.put("scale", attr.getScale());
                    attrMap.put("remarks", attr.getRemarks() != null ? attr.getRemarks() : "");
                    attrList.add(attrMap);
                }
                objMap.put("attributes", attrList);
                
                // 获取关联关系
                List<MaxRelationship> relationships = dataService.getMaxRelationships(obj.getObjectName());
                List<Map<String, Object>> relList = new ArrayList<>();
                for (MaxRelationship rel : relationships) {
                    Map<String, Object> relMap = new HashMap<>();
                    relMap.put("name", rel.getName() != null ? rel.getName() : "");
                    relMap.put("child", rel.getChild() != null ? rel.getChild() : "");
                    relMap.put("whereClause", rel.getWhereClause() != null ? rel.getWhereClause() : "");
                    relMap.put("cardinality", rel.getCardinality() != null ? rel.getCardinality() : "");
                    relMap.put("remarks", rel.getRemarks() != null ? rel.getRemarks() : "");
                    relList.add(relMap);
                }
                objMap.put("relationships", relList);
                
                // 获取索引
                List<MaxSysIndex> indexes = dataService.getMaxSysIndexes(obj.getObjectName());
                List<String> ixNames = new ArrayList<>();
                for (MaxSysIndex index : indexes) {
                    ixNames.add(index.getName());
                }
                List<MaxSysKey> keys = dataService.getMaxSysKeys(ixNames);
                
                Map<String, List<String>> indexColumns = new HashMap<>();
                for (MaxSysKey key : keys) {
                    indexColumns.computeIfAbsent(key.getIxName(), k -> new ArrayList<>())
                               .add(key.getColName() + (key.getOrdering() != null ? "(" + key.getOrdering() + ")" : ""));
                }
                
                List<Map<String, Object>> idxList = new ArrayList<>();
                for (MaxSysIndex index : indexes) {
                    Map<String, Object> idxMap = new HashMap<>();
                    idxMap.put("name", index.getName() != null ? index.getName() : "");
                    idxMap.put("tbName", index.getTbName() != null ? index.getTbName() : "");
                    idxMap.put("uniqueRule", index.getUniqueRule() != null ? index.getUniqueRule() : "");
                    idxMap.put("columns", String.join(", ", indexColumns.getOrDefault(index.getName(), new ArrayList<>())));
                    idxList.add(idxMap);
                }
                objMap.put("indexes", idxList);
                
                objectDataList.add(objMap);
            }
            
            context.putVar("objects", objectDataList);
            
            // 使用JxlsHelper处理模板
            JxlsHelper.getInstance().processTemplate(templateIs, outputOs, context);
            
            logger.info("Export with template completed successfully");
        }
    }

    /**
     * 导出域信息
     */
    public void exportDomainWithTemplate(String templatePath, String outputPath) throws IOException, SQLException {
        logger.info("Exporting domains with template: {} to: {}", templatePath, outputPath);
        
        try (InputStream templateIs = new FileInputStream(templatePath);
             OutputStream outputOs = new FileOutputStream(outputPath)) {
            
            Context context = new Context();
            
            List<MaxObject> objects = dataService.getMaxObjects();
            Set<String> domainIds = new HashSet<>();
            
            for (MaxObject obj : objects) {
                List<MaxAttribute> attributes = dataService.getMaxAttributes(obj.getObjectName());
                for (MaxAttribute attr : attributes) {
                    if (attr.getDomainId() != null && !attr.getDomainId().isEmpty()) {
                        domainIds.add(attr.getDomainId());
                    }
                }
            }
            
            List<MaxDomain> domains = dataService.getMaxDomains(new ArrayList<>(domainIds));
            List<Map<String, Object>> domainList = new ArrayList<>();
            
            for (MaxDomain domain : domains) {
                Map<String, Object> domainMap = new HashMap<>();
                domainMap.put("domainId", domain.getDomainId() != null ? domain.getDomainId() : "");
                domainMap.put("domainType", domain.getDomainType() != null ? domain.getDomainType() : "");
                domainMap.put("maxType", domain.getMaxType() != null ? domain.getMaxType() : "");
                domainMap.put("length", domain.getLength());
                domainMap.put("scale", domain.getScale());
                
                // 获取域值
                List<String> values = dataService.getDomainValues(domain.getDomainId(), domain.getDomainType());
                String valueStr = String.join("; ", values);
                if (valueStr.length() > 500) {
                    valueStr = valueStr.substring(0, 500) + "...";
                }
                domainMap.put("domainValues", valueStr);
                
                domainList.add(domainMap);
            }
            
            context.putVar("domains", domainList);
            
            JxlsHelper.getInstance().processTemplate(templateIs, outputOs, context);
            
            logger.info("Domain export with template completed successfully");
        }
    }
}
