package com.example.maximo.exporter.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaxAttribute {
    private String title;
    private String lTitle;
    private String attributeName;
    private Integer attributeNo;
    private String domainId;
    private Integer isPositive;
    private Integer length;
    private String maxType;
    private Integer required;
    private Integer primaryKeyColSeq;
    private String sameAsObject;
    private Integer scale;
    private String lRemarks;
    private String remarks;
}