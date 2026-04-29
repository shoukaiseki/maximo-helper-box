package com.maximo.mcp.server;

import org.noear.solon.ai.annotation.ToolMapping;
import org.noear.solon.ai.mcp.McpChannel;
import org.noear.solon.ai.mcp.server.annotation.McpServerEndpoint;
import org.noear.solon.annotation.Inject;
import org.noear.solon.annotation.Param;
import org.noear.solon.core.util.LogUtil;
import org.noear.snack.ONode;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Maximo DB2 元数据查询 MCP 服务
 * <p>
 * 提供对 Maximo 系统核心元数据表的查询能力：
 * MAXOBJECT（对象定义）、MAXATTRIBUTE（字段定义）、
 * MAXRELATIONSHIP（关联关系）、MAXAPPS/APPSPECIFICS（应用XML）
 */
@McpServerEndpoint(channel = McpChannel.STREAMABLE, mcpEndpoint = "/mcp")
public class MaximoMcpServer {

    @Inject("maximo")
    private DataSource dataSource;

    // SQL 安全校验：只允许 SELECT 查询
    private static final Pattern SQL_SAFETY_PATTERN = Pattern.compile(
            "^\\s*SELECT\\s+.*", Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

    // 默认查询行数限制
    private static final int DEFAULT_LIMIT = 200;
    private static final int MAX_XML_LENGTH = 10000;


    // ========================================================================
    //  工具 1：查询对象定义（MAXOBJECT）
    // ========================================================================

    @ToolMapping(description = "查询 Maximo 对象定义信息（MAXOBJECT 表）。支持按对象名称模糊搜索，返回对象的类名、表名、描述等基本信息")
    public String queryMaxobjects(
            @Param(name = "objectName", description = "对象名称关键词，支持 % 通配符（例如：%WO%、WORKORDER、%ASSET%）") String objectName,
            @Param(name = "limit", description = "返回行数上限（默认 200）") Integer limit) {
        String sql = "SELECT OBJECTNAME, CLASSNAME, MAINTABLE, DESCRIPTION, " +
                "ISSYSTEM, ISINTERFACE, ISCHANGEHISTORY, ISTEXTSEARCH " +
                "FROM MAXOBJECT WHERE UCASE(OBJECTNAME) LIKE ?";
        return queryAsJson(sql, new Object[]{"%" + objectName.toUpperCase() + "%"}, limit);
    }


    // ========================================================================
    //  工具 2：查询字段/属性定义（MAXATTRIBUTE）
    // ========================================================================

    @ToolMapping(description = "查询 Maximo 属性/字段定义（MAXATTRIBUTE 表）。支持按对象名称和属性名称模糊搜索，返回字段类型、长度、是否必填等信息")
    public String queryMaxattributes(
            @Param(name = "objectName", description = "所属对象名称关键词（支持 % 通配符）") String objectName,
            @Param(name = "attributeName", description = "属性名称关键词（支持 % 通配符），为空时返回所有属性") String attributeName,
            @Param(name = "limit", description = "返回行数上限（默认 200）") Integer limit) {
        String sql;
        Object[] params;
        if (attributeName != null && !attributeName.trim().isEmpty()) {
            sql = "SELECT OBJECTNAME, ATTRIBUTENAME, DOMAINNAME, COLUMNNAME, " +
                    "AITYPE, LENGTH, SCALE, REQUIRED, ISUNIQUE, DEFALTVALUE, " +
                    "REMARK, TITLE, ISNUMBER " +
                    "FROM MAXATTRIBUTE WHERE UCASE(OBJECTNAME) LIKE ? AND UCASE(ATTRIBUTENAME) LIKE ? " +
                    "ORDER BY OBJECTNAME, ATTRIBUTENAME";
            params = new Object[]{"%" + objectName.toUpperCase() + "%",
                    "%" + attributeName.toUpperCase() + "%"};
        } else {
            sql = "SELECT OBJECTNAME, ATTRIBUTENAME, DOMAINNAME, COLUMNNAME, " +
                    "AITYPE, LENGTH, SCALE, REQUIRED, ISUNIQUE, DEFALTVALUE, " +
                    "REMARK, TITLE, ISNUMBER " +
                    "FROM MAXATTRIBUTE WHERE UCASE(OBJECTNAME) LIKE ? " +
                    "ORDER BY OBJECTNAME, ATTRIBUTENAME";
            params = new Object[]{"%" + objectName.toUpperCase() + "%"};
        }
        return queryAsJson(sql, params, limit);
    }


    // ========================================================================
    //  工具 3：查询关联关系（MAXRELATIONSHIP）
    // ========================================================================

    @ToolMapping(description = "查询 Maximo 关联关系定义（MAXRELATIONSHIP 表）。支持按源对象名称或关系名称模糊搜索，返回关联类型、目标对象、关联条件等信息")
    public String queryMaxrelationships(
            @Param(name = "className", description = "源对象类名关键词（支持 % 通配符）") String className,
            @Param(name = "relationshipName", description = "关联名称关键词（支持 % 通配符），为空时返回该对象所有关联") String relationshipName,
            @Param(name = "limit", description = "返回行数上限（默认 200）") Integer limit) {
        String sql;
        Object[] params;
        if (relationshipName != null && !relationshipName.trim().isEmpty()) {
            sql = "SELECT CLASSNAME, RELATIONSHIPNAME, REMARK, " +
                    "MAXOBJECT, CHILDCLASS, RELATIONSHIPTYPE, " +
                    "DIRECTION, CARDINALITY, DELETETYPE, " +
                    "WHERE clause AS WHERECLAUSE " +
                    "FROM MAXRELATIONSHIP WHERE UCASE(CLASSNAME) LIKE ? AND UCASE(RELATIONSHIPNAME) LIKE ? " +
                    "ORDER BY CLASSNAME, RELATIONSHIPNAME";
            params = new Object[]{"%" + className.toUpperCase() + "%",
                    "%" + relationshipName.toUpperCase() + "%"};
        } else {
            sql = "SELECT CLASSNAME, RELATIONSHIPNAME, REMARK, " +
                    "MAXOBJECT, CHILDCLASS, RELATIONSHIPTYPE, " +
                    "DIRECTION, CARDINALITY, DELETETYPE, " +
                    "WHERE clause AS WHERECLAUSE " +
                    "FROM MAXRELATIONSHIP WHERE UCASE(CLASSNAME) LIKE ? " +
                    "ORDER BY CLASSNAME, RELATIONSHIPNAME";
            params = new Object[]{"%" + className.toUpperCase() + "%"};
        }
        return queryAsJson(sql, params, limit);
    }


    // ========================================================================
    //  工具 4：查询应用注册信息（MAXAPPS）
    // ========================================================================

    @ToolMapping(description = "查询 Maximo 应用注册信息（MAXAPPS 表）。返回应用的名称、描述、主对象等信息")
    public String queryAppXml(
            @Param(name = "appName", description = "应用名称关键词，支持 % 通配符（例如：%WO%、CHANGE%、%ASSET%）") String appName,
            @Param(name = "limit", description = "返回行数上限（默认 200）") Integer limit) {
        String sql = "SELECT APP, MAINOBJECT, TYPE, " +
                "DESCRIPTION, ISTEMPLATE, URL, " +
                "SUBSTRING(APPXML, 1, " + MAX_XML_LENGTH + ") AS APPXML_PREVIEW, " +
                "CASE WHEN LENGTH(APPXML) > " + MAX_XML_LENGTH + " " +
                "  THEN '... [content truncated, total length: ' || VARCHAR(LENGTH(APPXML)) || ' chars]' " +
                "  ELSE NULL END AS APPXML_TRUNCATED " +
                "FROM MAXAPPS WHERE UCASE(APP) LIKE ? " +
                "ORDER BY APP";
        return queryAsJson(sql, new Object[]{"%" + appName.toUpperCase() + "%"}, limit);
    }


    // ========================================================================
    //  工具 5：查询应用 XML 详细内容（MAXPRESENTATION）
    // ========================================================================

    @ToolMapping(description = "查询 Maximo 应用的 XML 详细配置内容（MAXPRESENTATION 表）。返回应用的完整演示配置 XML")
    public String queryAppSpecificsXml(
            @Param(name = "app", description = "应用名称关键词，支持 % 通配符") String app,
            @Param(name = "limit", description = "返回行数上限（默认 200）") Integer limit) {
        String sql = "SELECT MAXPRESENTATIONID, APP, " +
                "SUBSTRING(PRESENTATION, 1, " + MAX_XML_LENGTH + ") AS PRESENTATION_PREVIEW, " +
                "CASE WHEN LENGTH(PRESENTATION) > " + MAX_XML_LENGTH + " " +
                "  THEN '... [content truncated, total length: ' || VARCHAR(LENGTH(PRESENTATION)) || ' chars]' " +
                "  ELSE NULL END AS PRESENTATION_TRUNCATED " +
                "FROM MAXPRESENTATION WHERE UCASE(APP) LIKE ? " +
                "ORDER BY APP";
        return queryAsJson(sql, new Object[]{"%" + app.toUpperCase() + "%"}, limit);
    }


    // ========================================================================
    //  工具 6：通用只读 SQL 查询（带安全校验）
    // ========================================================================

    @ToolMapping(description = "通用只读 SQL 查询。仅允许 SELECT 语句，自动限制行数，返回 JSON 格式结果集")
    public String queryBySql(
            @Param(name = "sql", description = "要执行的 SELECT 查询语句（只读，禁止 INSERT/UPDATE/DELETE/DROP 等操作）") String sql,
            @Param(name = "limit", description = "返回行数上限（默认 200）") Integer limit) {
        // 安全校验：只允许 SELECT
        if (!SQL_SAFETY_PATTERN.matcher(sql).matches()) {
            return "{\"error\": \"仅允许 SELECT 查询操作\"}";
        }

        // 禁止危险关键词
        String upperSql = sql.toUpperCase();
        String[] forbidden = {"INSERT ", "UPDATE ", "DELETE ", "DROP ", "ALTER ", "CREATE ",
                "TRUNCATE ", "EXEC ", "EXECUTE ", "CALL ", "MERGE "};
        for (String keyword : forbidden) {
            if (upperSql.contains(keyword)) {
                return "{\"error\": \"不允许执行 " + keyword.trim() + " 操作\"}";
            }
        }

        return queryAsJson(sql, new Object[]{}, limit);
    }


    // ========================================================================
    //  工具 7：数据库概览统计
    // ========================================================================

    @ToolMapping(description = "获取 Maximo 数据库概览信息。统计 MAXOBJECT、MAXATTRIBUTE、MAXRELATIONSHIP、MAXAPPS 等核心表的记录数")
    public String getDatabaseOverview() {
        StringBuilder result = new StringBuilder();
        result.append("{\"overview\": [\n");

        appendTableStat(result, "MAXOBJECT", "SELECT COUNT(*) AS CNT FROM MAXOBJECT");
        result.append(",\n");
        appendTableStat(result, "MAXATTRIBUTE", "SELECT COUNT(*) AS CNT FROM MAXATTRIBUTE");
        result.append(",\n");
        appendTableStat(result, "MAXRELATIONSHIP", "SELECT COUNT(*) AS CNT FROM MAXRELATIONSHIP");
        result.append(",\n");
        appendTableStat(result, "MAXAPPS", "SELECT COUNT(*) AS CNT FROM MAXAPPS");
        result.append(",\n");
        appendTableStat(result, "MAXPRESENTATION", "SELECT COUNT(*) AS CNT FROM MAXPRESENTATION");
        result.append(",\n");
        appendTableStat(result, "MAXDOMAIN", "SELECT COUNT(*) AS CNT FROM MAXDOMAIN");
        result.append(",\n");
        appendTableStat(result, "MAXSIGNATURE", "SELECT COUNT(*) AS CNT FROM MAXSIGNATURE");

        result.append("\n], \"message\": \"Maximo 数据库元数据概览\"}");
        return result.toString();
    }


    // ========================================================================
    //  辅助方法
    // ========================================================================

    /**
     * 执行 SQL 查询并以 JSON 字符串返回结果
     */
    private String queryAsJson(String sql, Object[] params, Integer limit) {
        int maxRows = (limit != null && limit > 0) ? Math.min(limit, 1000) : DEFAULT_LIMIT;
        List<Map<String, Object>> rows = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            // 设置参数
            for (int i = 0; i < params.length; i++) {
                ps.setObject(i + 1, params[i]);
            }

            // 限制行数
            ps.setMaxRows(maxRows);

            try (ResultSet rs = ps.executeQuery()) {
                ResultSetMetaData meta = rs.getMetaData();
                int columnCount = meta.getColumnCount();

                while (rs.next()) {
                    Map<String, Object> row = new LinkedHashMap<>();
                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = meta.getColumnLabel(i);
                        Object value = rs.getObject(i);
                        row.put(columnName, value != null ? value : "");
                    }
                    rows.add(row);
                }
            }

        } catch (SQLException e) {
            LogUtil.global().error("SQL 查询失败: " + e.getMessage(), e);
            return "{\"error\": \"SQL 查询失败: " + escapeJson(e.getMessage()) + "\"}";
        }

        // 使用 Snack3 序列化为 JSON
        ONode node = ONode.load(rows);
        String json = node.toJson();

        // 如果结果为空，返回提示
        if (rows.isEmpty()) {
            return "[]";
        }

        return json;
    }

    /**
     * 追加单表统计信息
     */
    private void appendTableStat(StringBuilder sb, String tableName, String sql) {
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            long count = 0;
            if (rs.next()) {
                count = rs.getLong(1);
            }
            sb.append("  {\"table\": \"").append(tableName)
                    .append("\", \"recordCount\": ").append(count)
                    .append("}");

        } catch (SQLException e) {
            sb.append("  {\"table\": \"").append(tableName)
                    .append("\", \"recordCount\": -1, \"error\": \"")
                    .append(escapeJson(e.getMessage())).append("\"}");
        }
    }

    /**
     * 简单 JSON 字符串转义
     */
    private String escapeJson(String text) {
        if (text == null) {
            return "";
        }
        return text.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
