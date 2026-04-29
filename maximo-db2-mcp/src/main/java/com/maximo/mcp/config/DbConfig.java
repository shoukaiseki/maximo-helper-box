package com.maximo.mcp.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.noear.solon.annotation.Bean;
import org.noear.solon.annotation.Configuration;
import org.noear.solon.annotation.Inject;

import javax.sql.DataSource;

@Configuration
public class DbConfig {

    @Bean(name = "maximo", typed = true)
    public DataSource dataSource(@Inject("${maximo.db.jdbcUrl}") String jdbcUrl,
                                 @Inject("${maximo.db.username}") String username,
                                 @Inject("${maximo.db.password}") String password,
                                 @Inject("${maximo.db.driverClassName}") String driverClassName) {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName(driverClassName);
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        config.setConnectionTestQuery("SELECT 1 FROM SYSIBM.SYSDUMMY1");
        config.setPoolName("MaximoDB2Pool");
        return new HikariDataSource(config);
    }
}
