package com.example.maximo.exporter.service;

import com.example.maximo.exporter.config.AppConfig;
import com.example.maximo.exporter.dao.DatabaseDao;
import com.example.maximo.exporter.dao.ResultSetMapper;
import com.example.maximo.exporter.entity.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DataService {
    private static final Logger logger = LoggerFactory.getLogger(DataService.class);
    private final DatabaseDao dao;
    private final AppConfig.QueriesConfig queries;

    public DataService(DatabaseDao dao, AppConfig.QueriesConfig queries) {
        this.dao = dao;
        this.queries = queries;
    }

    public List<MaxObject> getMaxObjects() throws SQLException {
        String sql = queries.getMaxobjects();
        return dao.query(sql, rs -> mapMaxObject(rs));
    }

    public List<MaxAttribute> getMaxAttributes(String objectName) throws SQLException {
        String sql = queries.getMaxattributes();
        return dao.query(sql, rs -> mapMaxAttribute(rs), objectName);
    }

    public List<MaxRelationship> getMaxRelationships(String parentObject) throws SQLException {
        String sql = queries.getMaxrelationships();
        return dao.query(sql, rs -> mapMaxRelationship(rs), parentObject);
    }

    public List<MaxSysIndex> getMaxSysIndexes(String tbName) throws SQLException {
        String sql = queries.getMaxsysindexes();
        return dao.query(sql, rs -> mapMaxSysIndex(rs), tbName);
    }

    public List<MaxSysKey> getMaxSysKeys(List<String> ixNames) throws SQLException {
        if (ixNames == null || ixNames.isEmpty()) {
            return new ArrayList<>();
        }
        StringBuilder placeholders = new StringBuilder();
        for (int i = 0; i < ixNames.size(); i++) {
            if (i > 0) placeholders.append(",");
            placeholders.append("?");
        }
        String sql = queries.getMaxsyskeys().replace("(select name from MAXSYSINDEXES where tbname=?)", "(" + placeholders + ")");
        List<MaxSysKey> results = dao.query(sql, rs -> mapMaxSysKey(rs), ixNames.toArray());
        logger.info("Retrieved {} index keys for {} indexes", results.size(), ixNames.size());
        return results;
    }

    /**
     * 获取域值列表
     */
    public List<String> getDomainValues(String domainId, String domainType) throws SQLException {
        if (domainId == null || domainType == null) {
            return new ArrayList<>();
        }
        
        String sql;
        if ("NUMERIC".equals(domainType)) {
            sql = queries.getNumericdomain();
        } else if ("ALN".equals(domainType)) {
            sql = queries.getAlndomain();
        } else if ("SYNONYM".equals(domainType)) {
            sql = queries.getSynonymdomain();
        } else {
            return new ArrayList<>();
        }
        
        List<String> values = new ArrayList<>();
        try {
            List<Object[]> rows = dao.query(sql, rs -> {
                Object[] row = new Object[3];
                row[0] = rs.getString("VALUE");
                if ("SYNONYM".equals(domainType)) {
                    row[1] = rs.getString("MAXVALUE");
                }
                row[2] = rs.getString("DESCRIPTION");
                return row;
            }, domainId);
            
            for (Object[] row : rows) {
                String val = row[0] != null ? row[0].toString() : "";
                String desc = row[2] != null ? row[2].toString() : "";
                
                if ("SYNONYM".equals(domainType)) {
                    String maxVal = row[1] != null ? row[1].toString() : "";
                    values.add(val + " - " + maxVal + " (" + desc + ")");
                } else {
                    if (!desc.isEmpty()) {
                        values.add(val + " - " + desc);
                    } else {
                        values.add(val);
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Failed to get domain values for domain: {}", domainId, e);
        }
        return values;
    }

    public List<MaxDomain> getMaxDomains(List<String> domainIds) throws SQLException {
        if (domainIds == null || domainIds.isEmpty()) {
            return new ArrayList<>();
        }
        StringBuilder placeholders = new StringBuilder();
        for (int i = 0; i < domainIds.size(); i++) {
            if (i > 0) placeholders.append(",");
            placeholders.append("?");
        }
        String sql = queries.getMaxdomains().replace("where domainid like 'IBM%'", "WHERE DOMAINID IN (" + placeholders + ")");
        return dao.query(sql, rs -> mapMaxDomain(rs), domainIds.toArray());
    }

    public NumericDomain getNumericDomain(String domainId) throws SQLException {
        String sql = queries.getNumericdomain();
        return dao.querySingle(sql, rs -> mapNumericDomain(rs), domainId);
    }

    public AlnDomain getAlnDomain(String domainId) throws SQLException {
        String sql = queries.getAlndomain();
        return dao.querySingle(sql, rs -> mapAlnDomain(rs), domainId);
    }

    public SynonymDomain getSynonymDomain(String domainId) throws SQLException {
        String sql = queries.getSynonymdomain();
        return dao.querySingle(sql, rs -> mapSynonymDomain(rs), domainId);
    }

    private MaxObject mapMaxObject(ResultSet rs) throws SQLException {
        String description = rs.getString("DESCRIPTION");
        String lDescription = rs.getString("l_description");
        String finalDescription = getValueWithFallback(description, lDescription);
        
        return MaxObject.builder()
                .objectName(rs.getString("OBJECTNAME"))
                .description(finalDescription)
                .lDescription(lDescription)
                .build();
    }

    private MaxAttribute mapMaxAttribute(ResultSet rs) throws SQLException {
        String title = rs.getString("TITLE");
        String lTitle = rs.getString("l_title");
        String finalTitle = getValueWithFallback(title, lTitle);
        
        String remarks = rs.getString("REMARKS");
        String lRemarks = rs.getString("l_remarks");
        String finalRemarks = getValueWithFallback(remarks, lRemarks);
        
        return MaxAttribute.builder()
                .title(finalTitle)
                .lTitle(lTitle)
                .attributeName(rs.getString("ATTRIBUTENAME"))
                .attributeNo(rs.getInt("ATTRIBUTENO"))
                .domainId(rs.getString("DOMAINID"))
                .isPositive(rs.getInt("ISPOSITIVE"))
                .length(rs.getInt("LENGTH"))
                .maxType(rs.getString("MAXTYPE"))
                .required(rs.getInt("REQUIRED"))
                .primaryKeyColSeq(rs.getObject("PRIMARYKEYCOLSEQ") != null ? rs.getInt("PRIMARYKEYCOLSEQ") : null)
                .sameAsObject(rs.getString("SAMEASOBJECT"))
                .scale(rs.getInt("SCALE"))
                .lRemarks(lRemarks)
                .remarks(finalRemarks)
                .build();
    }

    private MaxRelationship mapMaxRelationship(ResultSet rs) throws SQLException {
        return MaxRelationship.builder()
                .name(rs.getString("NAME"))
                .child(rs.getString("CHILD"))
                .whereClause(rs.getString("WHERECLAUSE"))
                .cardinality(rs.getString("CARDINALITY"))
                .remarks(rs.getString("REMARKS"))
                .build();
    }

    private MaxSysIndex mapMaxSysIndex(ResultSet rs) throws SQLException {
        return MaxSysIndex.builder()
                .name(rs.getString("NAME"))
                .tbName(rs.getString("TBNAME"))
                .uniqueRule(rs.getString("UNIQUERULE"))
                .build();
    }

    private MaxSysKey mapMaxSysKey(ResultSet rs) throws SQLException {
        return MaxSysKey.builder()
                .ixName(rs.getString("IXNAME"))
                .colName(rs.getString("COLNAME"))
                .colSeq(rs.getInt("COLSEQ"))
                .ordering(rs.getString("ORDERING"))
                .build();
    }

    private MaxDomain mapMaxDomain(ResultSet rs) throws SQLException {
        String description = rs.getString("DESCRIPTION");
        String lDescription = rs.getString("l_description");
        String finalDescription = getValueWithFallback(description, lDescription);
        
        return MaxDomain.builder()
                .domainId(rs.getString("DOMAINID"))
                .description(finalDescription)
                .lDescription(lDescription)
                .domainType(rs.getString("DOMAINTYPE"))
                .maxType(rs.getString("MAXTYPE"))
                .length(rs.getObject("LENGTH") != null ? rs.getInt("LENGTH") : null)
                .scale(rs.getObject("SCALE") != null ? rs.getInt("SCALE") : null)
                .build();
    }
    
    /**
     * 如果原值是null或者主要是英文，则使用多语言值
     */
    private String getValueWithFallback(String originalValue, String fallbackValue) {
        if (originalValue == null || originalValue.isEmpty()) {
            return fallbackValue;
        }
        // 检查是否主要是英文（大部分字符是英文字母或数字）
        int englishChars = 0;
        int chineseChars = 0;
        for (char c : originalValue.toCharArray()) {
            if (Character.UnicodeScript.of(c) == Character.UnicodeScript.HAN) {
                chineseChars++;
            } else if (Character.isLetterOrDigit(c)) {
                englishChars++;
            }
        }
        // 如果中文字符很少（少于总数的30%），则使用fallback
        if (chineseChars > 0 && (double) chineseChars / (chineseChars + englishChars) < 0.3) {
            return fallbackValue != null && !fallbackValue.isEmpty() ? fallbackValue : originalValue;
        }
        return originalValue;
    }

    private NumericDomain mapNumericDomain(ResultSet rs) throws SQLException {
        String description = rs.getString("DESCRIPTION");
        String lDescription = rs.getString("l_description");
        String finalDescription = getValueWithFallback(description, lDescription);
        
        return NumericDomain.builder()
                .domainId(rs.getString("DOMAINID"))
                .description(finalDescription)
                .lDescription(lDescription)
                .defaultVal(rs.getObject("VALUE") != null ? rs.getDouble("VALUE") : null)
                .build();
    }

    private AlnDomain mapAlnDomain(ResultSet rs) throws SQLException {
        String description = rs.getString("DESCRIPTION");
        String lDescription = rs.getString("l_description");
        String finalDescription = getValueWithFallback(description, lDescription);
        
        return AlnDomain.builder()
                .domainId(rs.getString("DOMAINID"))
                .description(finalDescription)
                .lDescription(lDescription)
                .defaultValue(rs.getString("VALUE"))
                .listVal(rs.getString("VALUE"))
                .build();
    }

    private SynonymDomain mapSynonymDomain(ResultSet rs) throws SQLException {
        String description = rs.getString("DESCRIPTION");
        String lDescription = rs.getString("l_description");
        String finalDescription = getValueWithFallback(description, lDescription);
        
        return SynonymDomain.builder()
                .domainId(rs.getString("DOMAINID"))
                .description(finalDescription)
                .lDescription(lDescription)
                .objectName(rs.getString("MAXVALUE"))
                .attributeName(rs.getString("VALUE"))
                .build();
    }
}
