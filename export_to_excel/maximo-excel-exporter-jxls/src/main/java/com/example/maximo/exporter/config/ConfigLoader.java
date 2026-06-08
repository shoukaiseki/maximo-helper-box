package com.example.maximo.exporter.config;

import org.yaml.snakeyaml.Yaml;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

public class ConfigLoader {
    private static final Logger logger = LoggerFactory.getLogger(ConfigLoader.class);
    private static final String DEFAULT_CONFIG = "application.yml";

    public static AppConfig loadConfig() {
        return loadConfig(DEFAULT_CONFIG);
    }

    @SuppressWarnings("unchecked")
    public static AppConfig loadConfig(String configFile) {
        logger.info("Loading configuration from: {}", configFile);
        
        InputStream input = null;
        try {
            Path filePath = Paths.get(configFile);
            if (Files.exists(filePath)) {
                input = new FileInputStream(new File(configFile));
                logger.info("Loading config from file system: {}", configFile);
            } else {
                input = ConfigLoader.class.getClassLoader().getResourceAsStream(configFile);
                if (input == null) {
                    throw new RuntimeException("Configuration file not found: " + configFile);
                }
                logger.info("Loading config from classpath: {}", configFile);
            }
            
            Yaml yaml = new Yaml();
            Map<String, Object> yamlData = yaml.load(input);
            
            return parseConfig(yamlData);
        } catch (Exception e) {
            logger.error("Failed to load configuration", e);
            throw new RuntimeException("Failed to load configuration", e);
        } finally {
            if (input != null) {
                try {
                    input.close();
                } catch (Exception e) {
                    logger.warn("Error closing input stream", e);
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    private static AppConfig parseConfig(Map<String, Object> data) {
        AppConfig config = new AppConfig();
        
        // Database
        if (data.containsKey("db")) {
            Map<String, Object> dbData = (Map<String, Object>) data.get("db");
            AppConfig.DbConfig db = new AppConfig.DbConfig();
            db.setUrl((String) dbData.get("url"));
            db.setUsername((String) dbData.get("username"));
            db.setPassword((String) dbData.get("password"));
            db.setDriver((String) dbData.get("driver"));
            config.setDb(db);
        }
        
        // Export
        if (data.containsKey("export")) {
            Map<String, Object> exportData = (Map<String, Object>) data.get("export");
            AppConfig.ExportConfig export = new AppConfig.ExportConfig();
            
            if (exportData.containsKey("template")) {
                Map<String, Object> templateData = (Map<String, Object>) exportData.get("template");
                AppConfig.TemplateConfig template = new AppConfig.TemplateConfig();
                template.setDir((String) templateData.get("dir"));
                export.setTemplate(template);
            }
            
            if (exportData.containsKey("output")) {
                Map<String, Object> outputData = (Map<String, Object>) exportData.get("output");
                AppConfig.OutputConfig output = new AppConfig.OutputConfig();
                output.setDir((String) outputData.get("dir"));
                output.setTableStructure((String) outputData.get("table-structure"));
                output.setTableStructureJxls((String) outputData.get("table-structure-jxls"));
                output.setDomainsJxls((String) outputData.get("domains-jxls"));
                export.setOutput(output);
            }
            
            config.setExport(export);
        }
        
        // Language
        if (data.containsKey("language")) {
            Map<String, Object> langData = (Map<String, Object>) data.get("language");
            AppConfig.LanguageConfig lang = new AppConfig.LanguageConfig();
            lang.setCode((String) langData.get("code"));
            config.setLanguage(lang);
        }
        
        // Object
        if (data.containsKey("object")) {
            Map<String, Object> objData = (Map<String, Object>) data.get("object");
            AppConfig.ObjectConfig obj = new AppConfig.ObjectConfig();
            obj.setFilter((String) objData.get("filter"));
            obj.setInclude((java.util.List<String>) objData.get("include"));
            config.setObject(obj);
        }
        
        // Queries
        if (data.containsKey("queries")) {
            Map<String, Object> queriesData = (Map<String, Object>) data.get("queries");
            AppConfig.QueriesConfig queries = new AppConfig.QueriesConfig();
            queries.setMaxobjects((String) queriesData.get("maxobjects"));
            queries.setMaxattributes((String) queriesData.get("maxattributes"));
            queries.setMaxrelationships((String) queriesData.get("maxrelationships"));
            queries.setMaxsysindexes((String) queriesData.get("maxsysindexes"));
            queries.setMaxsyskeys((String) queriesData.get("maxsyskeys"));
            queries.setMaxdomains((String) queriesData.get("maxdomains"));
            queries.setNumericdomain((String) queriesData.get("numericdomain"));
            queries.setAlndomain((String) queriesData.get("alndomain"));
            queries.setSynonymdomain((String) queriesData.get("synonymdomain"));
            config.setQueries(queries);
        }
        
        logger.info("Configuration loaded successfully");
        return config;
    }
}
