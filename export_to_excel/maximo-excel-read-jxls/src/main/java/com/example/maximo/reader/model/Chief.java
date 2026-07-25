package com.example.maximo.reader.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 部门负责人实体 - 对应 jxls-reader-mapping.xml 中的 department.chief
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chief {
    /** 负责人姓名 */
    private String name;
    /** 负责人年龄 */
    private Integer age;
    /** 负责人薪资 */
    private Double payment;
    /** 负责人奖金比例 */
    private Double bonus;
}
