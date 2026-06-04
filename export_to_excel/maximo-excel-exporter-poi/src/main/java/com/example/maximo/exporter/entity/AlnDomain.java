package com.example.maximo.exporter.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlnDomain {
    private String domainId;
    private String description;
    private String lDescription;
    private String defaultValue;
    private String listVal;
}