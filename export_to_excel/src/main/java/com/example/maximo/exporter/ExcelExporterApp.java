package com.example.maximo.exporter;

import com.example.maximo.exporter.config.AppConfig;
import com.example.maximo.exporter.config.ConfigLoader;
import com.example.maximo.exporter.dao.DatabaseDao;
import com.example.maximo.exporter.service.*;
import org.apache.commons.dbcp2.BasicDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Paths;
import java.sql.SQLException;

public class ExcelExporterApp {
    private static final Logger logger = LoggerFactory.getLogger(ExcelExporterApp.class);

    public static void main(String[] args) {
        logger.info("Starting Maximo Excel Exporter Application");
        
        // 检查是否是生成模板模式
        boolean generateTemplates = args.length > 0 && "--generate-templates".equals(args[0]);
        
        // 加载配置
        AppConfig config = ConfigLoader.loadConfig();
        
        if (generateTemplates) {
            logger.info("=== 生成模板模式 ===");
            try {
                JxlsTemplateGenerator templateGenerator = new JxlsTemplateGenerator();
                templateGenerator.generateAllTemplates(config.getExport().getTemplate().getDir());
                
                logger.info("模板生成成功！位置: {}", config.getExport().getTemplate().getDir());
            } catch (IOException e) {
                logger.error("生成模板失败", e);
                System.exit(1);
            }
            return;
        }
        
        // 正常导出模式
        logger.info("=== 导出模式 ===");
        try {
            BasicDataSource dataSource = createDataSource(config);
            DatabaseDao dao = new DatabaseDao(dataSource);
            DataService dataService = new DataService(dao, config.getQueries());
            
            String templateDir = config.getExport().getTemplate().getDir();
            
            // 使用传统格式的Excel导出（完整功能）
            ExcelExportService exportService = new ExcelExportService(dataService);
            String outputPath = Paths.get(config.getExport().getOutput().getDir(), 
                                           config.getExport().getOutput().getTableStructure()).toString();
            exportService.export(outputPath);
            logger.info("传统格式导出完成: {}", outputPath);
            
            // 使用JXLS模板导出（可选）
            JxlsExportService jxlsExportService = new JxlsExportService(dataService);
            String tableTemplatePath = Paths.get(templateDir, "template_table_structure.xlsx").toString();
            String tableOutputPath = Paths.get(config.getExport().getOutput().getDir(), 
                                               config.getExport().getOutput().getTableStructureJxls()).toString();
            try {
                logger.info("使用模板导出表结构: {}", tableTemplatePath);
                jxlsExportService.exportWithTemplate(tableTemplatePath, tableOutputPath);
                logger.info("JXLS表结构导出完成: {}", tableOutputPath);
            } catch (Exception e) {
                logger.warn("JXLS表结构导出失败（可能是模板需要调整）: {}", e.getMessage());
            }
            
            // 使用JXLS模板导出域信息（可选）
            String domainTemplatePath = Paths.get(templateDir, "template_domain.xlsx").toString();
            String domainOutputPath = Paths.get(config.getExport().getOutput().getDir(), 
                                                config.getExport().getOutput().getDomainsJxls()).toString();
            try {
                logger.info("使用模板导出域信息: {}", domainTemplatePath);
                jxlsExportService.exportDomainWithTemplate(domainTemplatePath, domainOutputPath);
                logger.info("JXLS域信息导出完成: {}", domainOutputPath);
            } catch (Exception e) {
                logger.warn("JXLS域信息导出失败（可能是模板需要调整）: {}", e.getMessage());
            }
            
            logger.info("\n========================================");
            logger.info("导出完成！");
            logger.info("========================================");
            logger.info("\n生成的文件:");
            logger.info("1. 传统格式Excel: {}", outputPath);
            logger.info("2. JXLS格式表结构: {}", tableOutputPath);
            logger.info("3. JXLS格式域信息: {}", domainOutputPath);
            logger.info("\n使用说明:");
            logger.info("   - 首次运行: java -jar ... --generate-templates");
            logger.info("   - 修改模板后: java -jar ... (直接导出，不覆盖模板)");
            
            dataSource.close();
        } catch (IOException | SQLException e) {
            logger.error("导出过程出错", e);
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
