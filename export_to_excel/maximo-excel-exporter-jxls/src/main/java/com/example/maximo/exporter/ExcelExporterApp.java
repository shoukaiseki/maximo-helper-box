package com.example.maximo.exporter;

import com.example.maximo.exporter.config.AppConfig;
import com.example.maximo.exporter.config.ConfigLoader;
import com.example.maximo.exporter.dao.DatabaseDao;
import com.example.maximo.exporter.service.DataService;
import com.example.maximo.exporter.service.JxlsExportService;
import org.apache.commons.dbcp2.BasicDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.nio.file.Paths;
import java.sql.SQLException;

public class ExcelExporterApp {

    private static final Logger logger = LoggerFactory.getLogger(ExcelExporterApp.class);

    public static void main(String[] args) {
        logger.info("Starting Maximo Excel Exporter (JXLS Version)");

        try {
            AppConfig config = ConfigLoader.loadConfig("application.yml");
            logger.info("Configuration loaded successfully");

            logger.info("=== JXLS Export Mode ===");

            BasicDataSource dataSource = createDataSource(config);
            DatabaseDao dao = new DatabaseDao(dataSource);
            DataService dataService = new DataService(dao, config.getQueries());

            String templateDir = config.getExport().getTemplate().getDir();
            String outputDir = config.getExport().getOutput().getDir();
            
            File outputDirFile = new File(outputDir);
            if (!outputDirFile.exists()) {
                outputDirFile.mkdirs();
            }

            JxlsExportService jxlsExportService = new JxlsExportService(dataService);
            
            String tableTemplatePath = Paths.get(templateDir, "template_table_structure.xlsx").toString();
            String tableOutputPath = Paths.get(outputDir, config.getExport().getOutput().getTableStructureJxls()).toString();
            
            String domainTemplatePath = Paths.get(templateDir, "template_domain.xlsx").toString();
            String domainOutputPath = Paths.get(outputDir, config.getExport().getOutput().getDomainsJxls()).toString();

            try {
                jxlsExportService.exportWithTemplate(tableTemplatePath, tableOutputPath);
                logger.info("JXLS Table structure export completed: {}", tableOutputPath);
            } catch (Exception e) {
                logger.warn("JXLS Table structure export failed (check template): {}", e.getMessage());
            }

            try {
                jxlsExportService.exportDomainWithTemplate(domainTemplatePath, domainOutputPath);
                logger.info("JXLS Domain export completed: {}", domainOutputPath);
            } catch (Exception e) {
                logger.warn("JXLS Domain export failed (check template): {}", e.getMessage());
            }

            dataSource.close();
            logger.info("All JXLS exports completed!");

        } catch (Exception e) {
            logger.error("Error occurred: {}", e.getMessage(), e);
            System.exit(1);
        }
    }

    private static BasicDataSource createDataSource(AppConfig config) {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setUrl(config.getDb().getUrl());
        dataSource.setUsername(config.getDb().getUsername());
        dataSource.setPassword(config.getDb().getPassword());
        dataSource.setDriverClassName(config.getDb().getDriver());
        
        dataSource.setInitialSize(5);
        dataSource.setMaxTotal(20);
        dataSource.setMaxIdle(10);
        dataSource.setMinIdle(5);
        
        logger.info("Created DataSource with URL: {}", config.getDb().getUrl());
        return dataSource;
    }
}