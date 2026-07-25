package com.example.maximo.reader.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * 部门实体 - 对应 jxls-reader-mapping.xml 中的 department
 * 包含: name(名称), chief(负责人), staff(员工列表), totalPayment(合计)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {
    /** 部门名称 */
    private String name;
    /** 部门负责人 */
    private Chief chief;
    /** 员工列表 (XML 映射中对应 staff) */
    private List<Employee> staff = new ArrayList<>();
    /** 部门员工薪资合计 */
    private Double totalPayment;

    public void addEmployee(Employee emp) {
        if (staff == null) {
            staff = new ArrayList<>();
        }
        staff.add(emp);
    }

    public List<Employee> getEmployees() {
        return staff;
    }
}
