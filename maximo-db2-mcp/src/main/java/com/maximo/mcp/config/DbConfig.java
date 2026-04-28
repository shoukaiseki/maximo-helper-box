package com.maximo.mcp.config;

import com.zaxxer.hikari.HikariDataSource;
import org.noear.solon.annotation.Bean;
import org.noear.solon.annotation.Configuration;
import org.noear.solon.annotation.Inject;

import javax.sql.DataSource;

/**
 * Maximo DB2 数据源配置
 *
 * 从 app.yml 中读取 maximo.db 配置并创建 HikariCP 连接池，
 * 用于连接 IBM DB2 / Maximo 数据库。
 */
@Configuration
public class DbConfig {

    @Bean(name = "maximo", typed = true)
    public DataSource maximoDataSource(@Inject("${maximo.db}") HikariDataSource ds) {
        // HikariCP 属性已通过 @Inject 自动绑定
        // 可在此处做额外定制（如设置连接测试语句）
        ds.setConnectionTestQuery("SELECT 1 FROM SYSIBM.SYSDUMMY1");
        ds.setConnectionInitSql("SELECT 1 FROM SYSIBM.SYSDUMMY1");

        System.out.println("[Maximo MCP] 数据源初始化完成: " + ds.getJdbcUrl());
        return ds;
    }
}
