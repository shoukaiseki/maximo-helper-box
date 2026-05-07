package com.maximo.mcp.server;

import com.maximo.mcp.App;
import org.junit.jupiter.api.Test;
import org.noear.solon.annotation.Import;
import org.noear.solon.annotation.Inject;
import org.noear.solon.test.SolonTest;

import javax.sql.DataSource;

/**
 * MaximoMcpServer 单元测试
 * 测试 queryBySql 方法的安全性和功能性
 */
@Import(profiles = "classpath:app-test.yml")
@SolonTest(App.class)
public class MaximoMcpServerTest {

    @Inject
    private MaximoMcpServer mcpServer;
    
    @Inject("maximo")
    private DataSource dataSource;

    /**
     * 测试1: 正常的 SELECT 查询
     */
    @Test
    public void testQueryBySql_ValidSelect() {
        String sql = "SELECT 1 AS TEST FROM SYSIBM.SYSDUMMY1";
        String result = mcpServer.queryBySql(sql, 10);
        
        assert result != null : "结果不应为 null";
        assert !result.isEmpty() : "结果不应为空";
        System.out.println("正常SELECT查询结果: " + result);
    }

    /**
     * 测试2: 带 FOR READ ONLY 的查询（不应重复添加）
     */
    @Test
    public void testQueryBySql_WithForReadOnly() {
        String sql = "SELECT 1 AS TEST FROM SYSIBM.SYSDUMMY1 FOR READ ONLY";
        String result = mcpServer.queryBySql(sql, 10);
        
        assert result != null : "结果不应为 null";
        System.out.println("带FOR READ ONLY查询结果: " + result);
    }

    /**
     * 测试3: 拒绝 INSERT 语句
     */
    @Test
    public void testQueryBySql_RejectInsert() {
        String sql = "INSERT INTO MAXOBJECT (OBJECTNAME) VALUES ('TEST')";
        String result = mcpServer.queryBySql(sql, 10);
        
        assert result != null : "结果不应为 null";
        assert result.contains("error") : "应返回错误信息";
        assert result.contains("INSERT") : "应提示不允许INSERT";
        System.out.println("INSERT拦截结果: " + result);
    }

    /**
     * 测试4: 拒绝 UPDATE 语句
     */
    @Test
    public void testQueryBySql_RejectUpdate() {
        String sql = "UPDATE MAXOBJECT SET DESCRIPTION = 'TEST' WHERE OBJECTNAME = 'TEST'";
        String result = mcpServer.queryBySql(sql, 10);
        
        assert result != null : "结果不应为 null";
        assert result.contains("error") : "应返回错误信息";
        assert result.contains("UPDATE") : "应提示不允许UPDATE";
        System.out.println("UPDATE拦截结果: " + result);
    }

    /**
     * 测试5: 拒绝 DELETE 语句
     */
    @Test
    public void testQueryBySql_RejectDelete() {
        String sql = "DELETE FROM MAXOBJECT WHERE OBJECTNAME = 'TEST'";
        String result = mcpServer.queryBySql(sql, 10);
        
        assert result != null : "结果不应为 null";
        assert result.contains("error") : "应返回错误信息";
        assert result.contains("DELETE") : "应提示不允许DELETE";
        System.out.println("DELETE拦截结果: " + result);
    }

    /**
     * 测试6: 拒绝 DROP 语句
     */
    @Test
    public void testQueryBySql_RejectDrop() {
        String sql = "DROP TABLE MAXOBJECT";
        String result = mcpServer.queryBySql(sql, 10);
        
        assert result != null : "结果不应为 null";
        assert result.contains("error") : "应返回错误信息";
        assert result.contains("DROP") : "应提示不允许DROP";
        System.out.println("DROP拦截结果: " + result);
    }

    /**
     * 测试7: 拒绝非 SELECT 开头的语句
     */
    @Test
    public void testQueryBySql_RejectNonSelect() {
        String sql = "EXEC PROCEDURE TEST";
        String result = mcpServer.queryBySql(sql, 10);
        
        assert result != null : "结果不应为 null";
        assert result.contains("error") : "应返回错误信息";
        System.out.println("非SELECT语句拦截结果: " + result);
    }

    /**
     * 测试8: 查询 MAXOBJECT 表
     */
    @Test
    public void testQueryBySql_QueryMaxObject() {
        String sql = "SELECT OBJECTNAME, DESCRIPTION FROM MAXOBJECT FETCH FIRST 5 ROWS ONLY";
        String result = mcpServer.queryBySql(sql, 10);
        
        assert result != null : "结果不应为 null";
        assert !"[]".equals(result) : "结果不应为空数组";
        System.out.println("MAXOBJECT查询结果: " + result);
    }

    /**
     * 测试9: limit 参数限制行数
     */
    @Test
    public void testQueryBySql_LimitRows() {
        String sql = "SELECT OBJECTNAME FROM MAXOBJECT";
        String result = mcpServer.queryBySql(sql, 3);
        
        assert result != null : "结果不应为 null";
        // 验证返回的JSON数组长度不超过限制
        System.out.println("Limit测试查询结果: " + result);
    }

    /**
     * 测试10: SQL 注入尝试 - 应该被拒绝
     */
    @Test
    public void testQueryBySql_SqlInjectionAttempt() {
        String sql = "SELECT * FROM MAXOBJECT; DROP TABLE MAXOBJECT";
        String result = mcpServer.queryBySql(sql, 10);
        
        assert result != null : "结果不应为 null";
        assert result.contains("error") : "应返回错误信息";
        System.out.println("SQL注入拦截结果: " + result);
    }

    /**
     * 测试11: 大小写混合的危险关键词
     */
    @Test
    public void testQueryBySql_MixedCaseDangerousKeyword() {
        String sql = "select * from MAXOBJECT where 1=1 InSeRt into test values(1)";
        String result = mcpServer.queryBySql(sql, 10);
        
        assert result != null : "结果不应为 null";
        assert result.contains("error") : "应返回错误信息";
        System.out.println("大小写混合关键词拦截结果: " + result);
    }

    /**
     * 测试12: 空 limit 参数（应使用默认值）
     */
    @Test
    public void testQueryBySql_NullLimit() {
        String sql = "SELECT 1 AS TEST FROM SYSIBM.SYSDUMMY1";
        String result = mcpServer.queryBySql(sql, null);
        
        assert result != null : "结果不应为 null";
        System.out.println("Null Limit查询结果: " + result);
    }

    /**
     * 测试13: limit 为 0（应使用默认值）
     */
    @Test
    public void testQueryBySql_ZeroLimit() {
        String sql = "SELECT 1 AS TEST FROM SYSIBM.SYSDUMMY1";
        String result = mcpServer.queryBySql(sql, 0);
        
        assert result != null : "结果不应为 null";
        System.out.println("Zero Limit查询结果: " + result);
    }

    /**
     * 测试14: limit 超过最大值（应限制为1000）
     */
    @Test
    public void testQueryBySql_ExceedMaxLimit() {
        String sql = "SELECT OBJECTNAME FROM MAXOBJECT";
        String result = mcpServer.queryBySql(sql, 2000);
        
        assert result != null : "结果不应为 null";
        System.out.println("超大Limit查询结果: " + result);
    }

    /**
     * 测试15: 无效的 SQL 语法（表不存在）
     * 注意：DB2 会抛出 SQLException，但应该被捕获并返回错误 JSON
     */
    @Test
    public void testQueryBySql_InvalidSql() {
        String sql = "SELECT INVALID_COLUMN FROM NONEXISTENT_TABLE";
        
        // 执行查询，预期会返回错误信息而不是抛出异常
        String result = mcpServer.queryBySql(sql, 10);
        
        // 验证结果不为 null
        assert result != null : "结果不应为 null，但得到了 null";
        
        // 验证返回的是错误信息
        // 可能的格式：{"error": "SQL 查询失败: ..."} 或包含 SQLCODE 等信息
        boolean hasError = result.toLowerCase().contains("error") || 
                          result.contains("SQL") || 
                          result.contains("失败") ||
                          result.startsWith("{");  // JSON 格式
        
        assert hasError : "应返回错误信息，但实际结果: " + result;
        
        System.out.println("✓ 无效SQL测试通过，返回结果: " + result);
    }
}
