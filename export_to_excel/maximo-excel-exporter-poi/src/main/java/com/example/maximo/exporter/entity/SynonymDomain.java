package com.example.maximo.exporter.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SynonymDomain {
    private String domainId;
    private String description;
    private String lDescription;
    private String objectName;
    private String attributeName;
}