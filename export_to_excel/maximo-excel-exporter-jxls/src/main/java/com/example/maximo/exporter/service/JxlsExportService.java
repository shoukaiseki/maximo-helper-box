package com.example.maximo.exporter.service;

import com.example.maximo.exporter.entity.*;
import org.jxls.common.Context;
import org.jxls.util.JxlsHelper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.*;
import java.sql.SQLException;
import java.util.*;

public class JxlsExportService {
    private static final Logger logger = LoggerFactory.getLogger(JxlsExportService.class);
    private final DataService dataService;

    public JxlsExportService(DataService dataService) {
        this.dataService = dataService;
    }

    public void exportWithTemplate(String templatePath, String outputPath) throws IOException, SQLException {
        logger.info("Exporting with template: {} to: {}", templatePath, outputPath);
        
        try (InputStream templateIs = new FileInputStream(templatePath);
             OutputStream outputOs = new FileOutputStream(outputPath)) {
            
            Context context = new Context();
            
            List<MaxObject> objects = dataService.getMaxObjects();
            
            List<Map<String, Object>> objectDataList = new ArrayList<>();
            for (MaxObject obj : objects) {
                Map<String, Object> objMap = new HashMap<>();
                objMap.put("objectName", obj.getObjectName());
                objMap.put("description", obj.getDescription() != null ? obj.getDescription() : "");
                objMap.put("lDescription", obj.getLDescription() != null ? obj.getLDescription() : "");
                
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
                    attrMap.put("lRemarks", attr.getLRemarks() != null ? attr.getLRemarks() : "");
                    attrMap.put("defaultValue", attr.getDefaultValue() != null ? attr.getDefaultValue() : "");
                    attrMap.put("autoKeyName", attr.getAutoKeyName() != null ? attr.getAutoKeyName() : "");
                    attrList.add(attrMap);
                }
                objMap.put("attributes", attrList);
                
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
                    
                    List<String> cols = indexColumns.getOrDefault(index.getName(), new ArrayList<>());
                    List<Map<String, Object>> colList = new ArrayList<>();
                    for (String col : cols) {
                        Map<String, Object> colMap = new HashMap<>();
                        colMap.put("col", col);
                        colList.add(colMap);
                    }
                    idxMap.put("columns", colList);
                    idxList.add(idxMap);
                }
                objMap.put("indexes", idxList);
                
                objectDataList.add(objMap);
            }
            
            context.putVar("objects", objectDataList);
            
            JxlsHelper.getInstance().processTemplate(templateIs, outputOs, context);
            
            logger.info("Export with template completed successfully");
        }
    }

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
                domainMap.put("description", domain.getDescription() != null ? domain.getDescription() : "");
                domainMap.put("lDescription", domain.getLDescription() != null ? domain.getLDescription() : "");
                
                List<Map<String, Object>> domainValueList = new ArrayList<>();
                if (domain.getDomainValues() != null) {
                    for (DomainValue dv : domain.getDomainValues()) {
                        Map<String, Object> dvMap = new HashMap<>();
                        dvMap.put("value", dv.getValue() != null ? dv.getValue() : "");
                        dvMap.put("description", dv.getDescription() != null ? dv.getDescription() : "");
                        dvMap.put("lDescription", dv.getLDescription() != null ? dv.getLDescription() : "");
                        domainValueList.add(dvMap);
                    }
                }
                domainMap.put("domainValues", domainValueList);
                
                domainList.add(domainMap);
            }
            
            context.putVar("domains", domainList);
            
            JxlsHelper.getInstance().processTemplate(templateIs, outputOs, context);
            
            logger.info("Domain export with template completed successfully");
        }
    }
}