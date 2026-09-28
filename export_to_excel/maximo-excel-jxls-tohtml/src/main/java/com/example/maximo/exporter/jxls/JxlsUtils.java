package com.example.maximo.exporter.jxls;

import java.util.List;

/**
 * 模板中的通用工具 bean（对应 com.autumn.common.utils.poi.jxls.JxlsUtils 的独立移植）。
 *
 * <p>模板中使用示例：${utils.lineNum(data, row)}（数据行行号，从 1 开始）。
 */
public class JxlsUtils {

    /** 行号（从 1 开始）。 */
    public Integer lineNum(List<?> list, Object obj) {
        if (list == null) {
            return null;
        }
        return list.indexOf(obj) + 1;
    }
}