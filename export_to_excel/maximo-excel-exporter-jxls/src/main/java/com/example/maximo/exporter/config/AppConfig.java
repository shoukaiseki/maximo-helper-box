package com.example.maximo.exporter.config;

import lombok.Data;

import java.util.List;

@Data
public class AppConfig {
    private DbConfig db;
    private ExportConfig export;
    private LanguageConfig language;
    private ObjectConfig object;
    private QueriesConfig queries;

    @Data
    public static class DbConfig {
        private String url;
        private String username;
        private String password;
        private String driver;
    }

    @Data
    public static class ExportConfig {
        private TemplateConfig template;
        private OutputConfig output;
    }

    @Data
    public static class TemplateConfig {
        private String dir;
    }

    @Data
    public static class OutputConfig {
        private String dir;
        private String tableStructure;
        private String tableStructureJxls;
        private String domainsJxls;
    }

    @Data
    public static class LanguageConfig {
        private String code;
    }

    @Data
    public static class ObjectConfig {
        private String filter;
        private List<String> include;
    }

    @Data
    public static class QueriesConfig {
        private String maxobjects;
        private String maxattributes;
        private String maxrelationships;
        private String maxsysindexes;
        private String maxsyskeys;
        private String maxdomains;
        private String numericdomain;
        private String alndomain;
        private String synonymdomain;
    }
}
