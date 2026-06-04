package com.example.maximo.exporter.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NumericDomain {
    private String domainId;
    private String description;
    private String lDescription;
    private Double minValue;
    private Double maxValue;
    private Double defaultVal;
    private String unit;
}