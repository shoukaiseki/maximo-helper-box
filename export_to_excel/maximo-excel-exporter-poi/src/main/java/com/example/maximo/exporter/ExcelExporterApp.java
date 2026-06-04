package com.example.maximo.exporter;

import com.example.maximo.exporter.config.AppConfig;
import com.example.maximo.exporter.config.ConfigLoader;
import com.example.maximo.exporter.dao.DatabaseDao;
import com.example.maximo.exporter.service.DataService;
import com.example.maximo.exporter.service.ExcelExportService;
import com.example.maximo.exporter.service.JxlsTemplateGenerator;
import org.apache.commons.dbcp2.BasicDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.nio.file.Paths;
import java.sql.SQLException;

public class ExcelExporterApp {

    private static final Logger logger = LoggerFactory.getLogger(ExcelExporterApp.class);

    public static void main(String[] args) {
        logger.info("Starting Maximo Excel Exporter (POI Version)");

        try {
            AppConfig config = ConfigLoader.loadConfig("application.yml");
            logger.info("Configuration loaded successfully");

            boolean generateTemplates = args.length > 0 && "--generate-templates".equals(args[0]);

            if (generateTemplates) {
                logger.info("=== Template Generation Mode ===");
                String templateDir = config.getExport().getTemplate().getDir();
                File templateDirFile = new File(templateDir);
                if (!templateDirFile.exists()) {
                    templateDirFile.mkdirs();
                }

                JxlsTemplateGenerator templateGenerator = new JxlsTemplateGenerator();
                String tableTemplatePath = Paths.get(templateDir, "template_table_structure.xlsx").toString();
                String domainTemplatePath = Paths.get(templateDir, "template_domain.xlsx").toString();

                templateGenerator.generateTableStructureTemplate(tableTemplatePath);
                templateGenerator.generateDomainTemplate(domainTemplatePath);

                logger.info("Templates generated successfully!");
                logger.info("Table structure template: {}", tableTemplatePath);
                logger.info("Domain template: {}", domainTemplatePath);
            } else {
                logger.info("=== Export Mode ===");

                BasicDataSource dataSource = createDataSource(config);
                DatabaseDao dao = new DatabaseDao(dataSource);
                DataService dataService = new DataService(dao, config.getQueries());

                String outputDir = config.getExport().getOutput().getDir();
                File outputDirFile = new File(outputDir);
                if (!outputDirFile.exists()) {
                    outputDirFile.mkdirs();
                }

                ExcelExportService exportService = new ExcelExportService(dataService);
                String outputPath = Paths.get(outputDir, config.getExport().getOutput().getTableStructure()).toString();
                exportService.export(outputPath);

                dataSource.close();
                logger.info("Excel export completed successfully!");
                logger.info("Output file: {}", outputPath);
            }

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