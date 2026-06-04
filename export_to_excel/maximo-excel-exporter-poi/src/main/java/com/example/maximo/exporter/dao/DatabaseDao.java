package com.example.maximo.exporter.dao;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DatabaseDao {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseDao.class);
    private final DataSource dataSource;

    public DatabaseDao(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public <T> List<T> query(String sql, ResultSetMapper<T> mapper, Object... params) throws SQLException {
        List<T> results = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            
            for (int i = 0; i < params.length; i++) {
                stmt.setObject(i + 1, params[i]);
            }
            
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    results.add(mapper.map(rs));
                }
            }
            logger.debug("Query executed: {} with {} results", sql, results.size());
        } catch (SQLException e) {
            logger.error("Error executing query: {}", sql, e);
            throw e;
        }
        return results;
    }

    public <T> T querySingle(String sql, ResultSetMapper<T> mapper, Object... params) throws SQLException {
        List<T> results = query(sql, mapper, params);
        return results.isEmpty() ? null : results.get(0);
    }
}