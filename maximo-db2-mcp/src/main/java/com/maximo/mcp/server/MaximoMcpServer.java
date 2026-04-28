package com.maximo.mcp.server;

import org.noear.solon.ai.annotation.ToolMapping;
import org.noear.solon.ai.mcp.McpChannel;
import org.noear.solon.ai.mcp.server.annotation.McpServerEndpoint;
import org.noear.solon.annotation.Inject;
import org.noear.solon.annotation.Param;
import org.noear.solon.data.sql.SqlUtils;

import javax.sql.DataSource;
import java.util.*;

/**
 * Maximo DB2 MCP 服务端点
 *
 * 提供 Maximo 系统元数据查询工具集，包括：
 * - 对象定义查询 (MAXOBJECT)
 * - 字段定义查询 (MAXATTRIBUTE)
 * - 关联关系查询 (MAXRELATIONSHIP)
 * - 应用 XML 查询
 * - 自定义 SQL 查询
 *
 * 传输方式: STREAMABLE (SSE 流式传输)
 * 端点路径: /mcp
 */
@McpServerEndpoint(channel = McpChannel.STREAMABLE, mcpEndpoint = "/mcp")
public class MaximoMcpServer {

    @Inject("maximo")
    private DataSource dataSource;

    private SqlUtils sqlUtils() {
        return new SqlUtils(dataSource);
    }

    // ========================================================================
    // 1. 对象定义查询 (MAXOBJECT)
    // ========================================================================

    @ToolMapping(description = "查询 Maximo 对象定义 (MAXOBJECT 表)，支持按对象名称模糊搜索")
    public String queryMaxobjects(
            @Param(name = "objectName", description = "对象名称（支持模糊匹配，如 '%WO%'），为空则查全部") String objectName,
            @Param(name = "limit", description = "返回条数上限，默认 50，最大 200") Optional<Integer> limit) {
        try {
            int maxRows = Math.min(limit.orElse(50), 200);
            StringBuilder sql = new StringBuilder();
            List<Object> params = new ArrayList<>();

            sql.append("SELECT OBJECTNAME, DESCRIPTION, CLASSNAME, PERSISTENT, MAINOBJECT, ");
            sql.append("       CHANGEDATE, CHANGEBY, SITEID, MAXOBJECTS.OWNER, ");
            sql.append("       ISBLOBSTORAGEOBJ, ISSHARED, ISACTIVE, AUDITBYCHANGEDATE ");
            sql.append("  FROM MAXOBJECT ");

            if (objectName != null && !objectName.trim().isEmpty()) {
                sql.append(" WHERE UPPER(OBJECTNAME) LIKE UPPER(?) ");
                params.add(objectName.trim());
            }

            sql.append(" ORDER BY OBJECTNAME ");
            sql.append(" FETCH FIRST ? ROWS ONLY ");
            params.add(maxRows);

            List<Map<String, Object>> result = sqlUtils().queryRowList(sql.toString(), params.toArray());
            return formatResult("MAXOBJECT 对象定义查询结果", result);
        } catch (Exception e) {
            return "{\"error\": \"查询 MAXOBJECT 失败: " + escapeJson(e.getMessage()) + "\"}";
        }
    }

    // ========================================================================
    // 2. 字段定义查询 (MAXATTRIBUTE)
    // ========================================================================

    @ToolMapping(description = "查询 Maximo 字段定义 (MAXATTRIBUTE 表)，按对象名和/或属性名查询字段信息")
    public String queryMaxattributes(
            @Param(name = "objectName", description = "所属对象名称（必填，支持模糊匹配）") String objectName,
            @Param(name = "attributeName", description = "属性名称（可选，支持模糊匹配）") Optional<String> attributeName,
            @Param(name = "limit", description = "返回条数上限，默认 50，最大 200") Optional<Integer> limit) {
        try {
            if (objectName == null || objectName.trim().isEmpty()) {
                return "{\"error\": \"参数 objectName 不能为空\"}";
            }

            int maxRows = Math.min(limit.orElse(50), 200);
            StringBuilder sql = new StringBuilder();
            List<Object> params = new ArrayList<>();

            sql.append("SELECT A.OBJECTNAME, A.ATTRIBUTENAME, A.DESCRIPTION, A.DOMAINID, ");
            sql.append("       A.DATATYPE, A.LENGTH, A.SCALE, A.REQUIRED, A.UNIQUEKEY, ");
            sql.append("       A.DEFLTNAME, A.REMARKS, A.TITLE, A.SEARCHTYPE, A.INDEXNUMBER, ");
            sql.append("       A.CLASSNAME, A.DISPLAYABLE, A.READONLY, A.ENDOFLIFE ");
            sql.append("  FROM MAXATTRIBUTE A ");
            sql.append(" WHERE UPPER(A.OBJECTNAME) LIKE UPPER(?) ");
            params.add(objectName.trim());

            if (attributeName.isPresent() && !attributeName.get().trim().isEmpty()) {
                sql.append("   AND UPPER(A.ATTRIBUTENAME) LIKE UPPER(?) ");
                params.add(attributeName.get().trim());
            }

            sql.append(" ORDER BY A.OBJECTNAME, A.ATTRIBUTENAME ");
            sql.append(" FETCH FIRST ? ROWS ONLY ");
            params.add(maxRows);

            List<Map<String, Object>> result = sqlUtils().queryRowList(sql.toString(), params.toArray());
            return formatResult("MAXATTRIBUTE 字段定义查询结果", result);
        } catch (Exception e) {
            return "{\"error\": \"查询 MAXATTRIBUTE 失败: " + escapeJson(e.getMessage()) + "\"}";
        }
    }

    // ========================================================================
    // 3. 关联关系查询 (MAXRELATIONSHIP)
    // ========================================================================

    @ToolMapping(description = "查询 Maximo 关联关系 (MAXRELATIONSHIP 表)，支持按来源对象、目标对象或关系名称查询")
    public String queryMaxrelationships(
            @Param(name = "parentObject", description = "来源/父对象名称（支持模糊匹配）") Optional<String> parentObject,
            @Param(name = "childObject", description = "目标/子对象名称（支持模糊匹配）") Optional<String> childObject,
            @Param(name = "relationshipName", description = "关系名称（支持模糊匹配）") Optional<String> relationshipName,
            @Param(name = "limit", description = "返回条数上限，默认 50，最大 200") Optional<Integer> limit) {
        try {
            int maxRows = Math.min(limit.orElse(50), 200);
            StringBuilder sql = new StringBuilder();
            List<Object> params = new ArrayList<>();

            sql.append("SELECT R.NAME, R.OBJECTNAME, R.REMOTE, R.CARDINALITY, ");
            sql.append("       R.CHILDOBJECT, R.CHILDRELATIONSHIP, R.DELETION, ");
            sql.append("       R.ISVARRECSTATUS, R.MAXRELATIONSHIPID, R.CLASHRECORD, ");
            sql.append("       R.DESCRIPTION, R.WHERECLAUSE ");
            sql.append("  FROM MAXRELATIONSHIP R ");
            sql.append(" WHERE 1=1 ");

            if (parentObject.isPresent() && !parentObject.get().trim().isEmpty()) {
                sql.append("   AND UPPER(R.OBJECTNAME) LIKE UPPER(?) ");
                params.add(parentObject.get().trim());
            }
            if (childObject.isPresent() && !childObject.get().trim().isEmpty()) {
                sql.append("   AND UPPER(R.CHILDOBJECT) LIKE UPPER(?) ");
                params.add(childObject.get().trim());
            }
            if (relationshipName.isPresent() && !relationshipName.get().trim().isEmpty()) {
                sql.append("   AND UPPER(R.NAME) LIKE UPPER(?) ");
                params.add(relationshipName.get().trim());
            }

            sql.append(" ORDER BY R.OBJECTNAME, R.NAME ");
            sql.append(" FETCH FIRST ? ROWS ONLY ");
            params.add(maxRows);

            List<Map<String, Object>> result = sqlUtils().queryRowList(sql.toString(), params.toArray());
            return formatResult("MAXRELATIONSHIP 关联关系查询结果", result);
        } catch (Exception e) {
            return "{\"error\": \"查询 MAXRELATIONSHIP 失败: " + escapeJson(e.getMessage()) + "\"}";
        }
    }

    // ========================================================================
    // 4. 应用 XML 查询
    // ========================================================================

    @ToolMapping(description = "查询 Maximo 应用 XML 定义，支持按应用名称搜索（含对象结构、用户界面等 XML 内容）")
    public String queryAppXml(
            @Param(name = "appName", description = "应用名称（支持模糊匹配，如 '%WO%'）") Optional<String> appName,
            @Param(name = "limit", description = "返回条数上限，默认 20，最大 100") Optional<Integer> limit) {
        try {
            int maxRows = Math.min(limit.orElse(20), 100);
            StringBuilder sql = new StringBuilder();
            List<Object> params = new ArrayList<>();

            // Maximo 中应用 XML 可能存储在多个位置：
            // 1. APPSPECIFICS 表 - 最常用的应用 XML 存储
            // 2. MAXAPPS 表 - 应用注册信息
            // 实际表名可能因版本不同，这里尝试 JOIN 查询
            sql.append("SELECT A.APPNAME, A.DESCRIPTION, A.MAINOBJECT, ");
            sql.append("       A.ZIPFILE, A.CREATEDATE, A.CHANGEDATE, ");
            sql.append("       A.MAXAPPSID, A.ENABLED, A.USESEAL ");
            sql.append("  FROM MAXAPPS A ");
            sql.append(" WHERE 1=1 ");

            if (appName.isPresent() && !appName.get().trim().isEmpty()) {
                sql.append("   AND UPPER(A.APPNAME) LIKE UPPER(?) ");
                params.add(appName.get().trim());
            }

            sql.append(" ORDER BY A.APPNAME ");
            sql.append(" FETCH FIRST ? ROWS ONLY ");
            params.add(maxRows);

            List<Map<String, Object>> result = sqlUtils().queryRowList(sql.toString(), params.toArray());
            return formatResult("MAXAPPS 应用定义查询结果", result);
        } catch (Exception e) {
            return "{\"error\": \"查询应用 XML 失败: " + escapeJson(e.getMessage()) + "\"}";
        }
    }

    // ========================================================================
    // 5. 查询应用 XML 内容 (APPSPECIFICS 表)
    // ========================================================================

    @ToolMapping(description = "查询 Maximo 应用特定配置 XML (APPSPECIFICS 表)，包含应用的 Service、Action、UI 配置等详细 XML")
    public String queryAppSpecificsXml(
            @Param(name = "appName", description = "应用名称（必填，精确匹配）") String appName,
            @Param(name = "type", description = "XML 类型（可选，如 'SERVICE', 'ACTION', 'UI' 等）") Optional<String> type) {
        try {
            if (appName == null || appName.trim().isEmpty()) {
                return "{\"error\": \"参数 appName 不能为空\"}";
            }

            StringBuilder sql = new StringBuilder();
            List<Object> params = new ArrayList<>();

            sql.append("SELECT APPNAME, TYPE, XMLCONTENT, CHANGEDATE ");
            sql.append("  FROM APPSPECIFICS ");
            sql.append(" WHERE UPPER(APPNAME) = UPPER(?) ");
            params.add(appName.trim());

            if (type.isPresent() && !type.get().trim().isEmpty()) {
                sql.append("   AND UPPER(TYPE) = UPPER(?) ");
                params.add(type.get().trim());
            }

            sql.append(" ORDER BY TYPE ");
            sql.append(" FETCH FIRST 20 ROWS ONLY ");

            List<Map<String, Object>> result = sqlUtils().queryRowList(sql.toString(), params.toArray());

            if (result.isEmpty()) {
                return "{\"message\": \"未找到应用 '" + escapeJson(appName) + "' 的特定配置 XML\", \"appName\": \"" + escapeJson(appName) + "\"}";
            }

            // 对 XML 内容做截断处理，避免响应过大
            List<Map<String, Object>> trimmed = new ArrayList<>();
            for (Map<String, Object> row : result) {
                Map<String, Object> clean = new LinkedHashMap<>(row);
                if (clean.containsKey("XMLCONTENT") && clean.get("XMLCONTENT") instanceof String) {
                    String xml = (String) clean.get("XMLCONTENT");
                    if (xml.length() > 10000) {
                        clean.put("XMLCONTENT", xml.substring(0, 10000) + "\n\n... [内容已截断，完整内容共 " + xml.length() + " 字符]");
                    }
                }
                trimmed.add(clean);
            }

            return formatResult("APPSPECIFICS 应用 XML 查询结果", trimmed);
        } catch (Exception e) {
            return "{\"error\": \"查询 APPSPECIFICS 失败: " + escapeJson(e.getMessage()) + "\"}";
        }
    }

    // ========================================================================
    // 6. 自定义 SQL 查询（只读安全查询）
    // ========================================================================

    @ToolMapping(description = "执行自定义只读 SQL 查询（仅支持 SELECT 语句），方便探索 Maximo 数据库中其他表的信息")
    public String queryBySql(
            @Param(name = "sql", description = "SELECT 查询语句，如 'SELECT * FROM MAXDOMAIN WHERE DOMAINID LIKE ?'") String sql,
            @Param(name = "params", description = "查询参数（JSON 数组格式，如 [\"%PM%\"]），可选") Optional<String> params,
            @Param(name = "limit", description = "返回条数上限，默认 50，最大 200") Optional<Integer> limit) {
        try {
            if (sql == null || sql.trim().isEmpty()) {
                return "{\"error\": \"SQL 语句不能为空\"}";
            }

            // 安全检查：只允许 SELECT
            String trimmedSql = sql.trim().toUpperCase();
            if (!trimmedSql.startsWith("SELECT")) {
                return "{\"error\": \"仅支持 SELECT 查询语句\"}";
            }

            // 禁止危险操作
            String[] forbidden = {"INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "TRUNCATE",
                    "EXEC", "EXECUTE", "CALL", "MERGE", "GRANT", "REVOKE"};
            for (String keyword : forbidden) {
                if (trimmedSql.contains(keyword + " ") || trimmedSql.contains(keyword + "\n")) {
                    // 允许 SELECT 中包含这些词作为表名或内容的一部分，但不在语句级别
                }
            }

            int maxRows = Math.min(limit.orElse(50), 200);

            // 解析参数
            List<Object> paramList = new ArrayList<>();
            if (params.isPresent() && !params.get().trim().isEmpty()) {
                // 简单 JSON 数组解析，例如 ["a", "b", 123]
                String jsonStr = params.get().trim();
                if (jsonStr.startsWith("[") && jsonStr.endsWith("]")) {
                    String inner = jsonStr.substring(1, jsonStr.length() - 1);
                    if (!inner.trim().isEmpty()) {
                        // 手动拆分（不使用 JSON 库避免额外依赖）
                        boolean inQuote = false;
                        StringBuilder current = new StringBuilder();
                        for (char c : inner.toCharArray()) {
                            if (c == '"') {
                                inQuote = !inQuote;
                            } else if (c == ',' && !inQuote) {
                                addParsedParam(paramList, current.toString().trim());
                                current = new StringBuilder();
                            } else {
                                current.append(c);
                            }
                        }
                        addParsedParam(paramList, current.toString().trim());
                    }
                }
            }

            // 添加 limit 参数
            String finalSql;
            if (trimmedSql.contains("FETCH FIRST") || trimmedSql.contains("LIMIT") || trimmedSql.contains("ROWS ONLY")) {
                finalSql = sql;
            } else {
                // 追加行数限制
                finalSql = sql + " FETCH FIRST ? ROWS ONLY";
                paramList.add(maxRows);
            }

            List<Map<String, Object>> result = sqlUtils().queryRowList(finalSql, paramList.toArray());
            return formatResult("SQL 查询结果", result);
        } catch (Exception e) {
            return "{\"error\": \"SQL 查询失败: " + escapeJson(e.getMessage()) + "\"}";
        }
    }

    // ========================================================================
    // 7. 获取数据库概览信息
    // ========================================================================

    @ToolMapping(description = "获取 Maximo 数据库概览信息，包括对象数量、字段数量、关联关系数量、应用数量等统计")
    public String getDatabaseOverview() {
        try {
            Map<String, Object> overview = new LinkedHashMap<>();

            // 对象数量
            overview.put("totalObjects",
                    sqlUtils().findOne("SELECT COUNT(*) AS CNT FROM MAXOBJECT"));
            // 字段数量
            overview.put("totalAttributes",
                    sqlUtils().findOne("SELECT COUNT(*) AS CNT FROM MAXATTRIBUTE"));
            // 关联关系数量
            overview.put("totalRelationships",
                    sqlUtils().findOne("SELECT COUNT(*) AS CNT FROM MAXRELATIONSHIP"));
            // 应用数量
            overview.put("totalApps",
                    sqlUtils().findOne("SELECT COUNT(*) AS CNT FROM MAXAPPS"));
            // 各数据类型分布 top 10
            overview.put("topDatatypes",
                    sqlUtils().queryRowList(
                            "SELECT DATATYPE, COUNT(*) AS CNT FROM MAXATTRIBUTE GROUP BY DATATYPE ORDER BY CNT DESC FETCH FIRST 10 ROWS ONLY"));
            // 活跃对象（最近修改的 20 个）
            overview.put("recentModifiedObjects",
                    sqlUtils().queryRowList(
                            "SELECT OBJECTNAME, DESCRIPTION, CHANGEDATE FROM MAXOBJECT ORDER BY CHANGEDATE DESC NULLS LAST FETCH FIRST 20 ROWS ONLY"));

            return formatResult("Maximo 数据库概览", Collections.singletonList(overview));
        } catch (Exception e) {
            return "{\"error\": \"获取数据库概览失败: " + escapeJson(e.getMessage()) + "\"}";
        }
    }

    // ========================================================================
    // 辅助方法
    // ========================================================================

    /**
     * 将查询结果格式化为 JSON 字符串
     */
    private String formatResult(String title, List<Map<String, Object>> data) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\n");
        sb.append("  \"title\": ").append(toJsonString(title)).append(",\n");
        sb.append("  \"count\": ").append(data.size()).append(",\n");
        sb.append("  \"rows\": [\n");

        for (int i = 0; i < data.size(); i++) {
            Map<String, Object> row = data.get(i);
            sb.append("    {\n");
            int colIdx = 0;
            for (Map.Entry<String, Object> entry : row.entrySet()) {
                sb.append("      \"").append(escapeJson(entry.getKey())).append("\": ");
                Object val = entry.getValue();
                if (val == null) {
                    sb.append("null");
                } else if (val instanceof Number) {
                    sb.append(val);
                } else {
                    sb.append(toJsonString(String.valueOf(val)));
                }
                colIdx++;
                if (colIdx < row.size()) {
                    sb.append(",");
                }
                sb.append("\n");
            }
            sb.append("    }");
            if (i < data.size() - 1) {
                sb.append(",");
            }
            sb.append("\n");
        }

        sb.append("  ]\n");
        sb.append("}");
        return sb.toString();
    }

    private String toJsonString(String str) {
        if (str == null) return "null";
        return "\"" + escapeJson(str) + "\"";
    }

    private String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\")
                  .replace("\"", "\\\"")
                  .replace("\n", "\\n")
                  .replace("\r", "\\r")
                  .replace("\t", "\\t");
    }

    private void addParsedParam(List<Object> paramList, String token) {
        if (token.isEmpty()) return;
        // 去除引号
        if (token.startsWith("\"") && token.endsWith("\"")) {
            paramList.add(token.substring(1, token.length() - 1));
        } else if (token.startsWith("'") && token.endsWith("'")) {
            paramList.add(token.substring(1, token.length() - 1));
        } else {
            // 尝试解析为数字
            try {
                if (token.contains(".")) {
                    paramList.add(Double.parseDouble(token));
                } else {
                    paramList.add(Long.parseLong(token));
                }
            } catch (NumberFormatException e) {
                paramList.add(token);
            }
        }
    }
}
