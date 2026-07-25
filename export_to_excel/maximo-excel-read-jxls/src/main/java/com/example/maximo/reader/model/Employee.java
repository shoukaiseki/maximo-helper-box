package com.example.maximo.reader.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 员工实体 - 对应 departmentdata.xls 中每个部门下的员工数据
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    /** 员工姓名 */
    private String name;
    /** 年龄 */
    private Integer age;
    /** 出生日期 */
    private LocalDate birthDate;
    /** 薪资 */
    private Double payment;
    /** 奖金 (百分比, 如 0.25 = 25%) */
    private Double bonus;
    /** 上级姓名 */
    private String superior;
}
