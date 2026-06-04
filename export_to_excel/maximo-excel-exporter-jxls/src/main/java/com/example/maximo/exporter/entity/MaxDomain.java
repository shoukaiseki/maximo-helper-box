package com.example.maximo.exporter.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaxDomain {
    private String domainId;
    private String description;
    private String lDescription;
    private String domainType;
    private String maxType;
    private Integer length;
    private Integer scale;
    private List<DomainValue> domainValues;
}