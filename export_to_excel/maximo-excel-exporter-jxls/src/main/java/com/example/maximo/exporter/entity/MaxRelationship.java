package com.example.maximo.exporter.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaxRelationship {
    private String name;
    private String child;
    private String whereClause;
    private String cardinality;
    private String remarks;
}