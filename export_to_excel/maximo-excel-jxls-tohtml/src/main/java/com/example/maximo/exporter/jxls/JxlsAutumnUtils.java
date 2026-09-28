package com.example.maximo.exporter.jxls;

import java.util.Map;

/**
 * 模板中的通用工具 bean（对应 com.autumn.common.utils.poi.jxls.JxlsAutumnUtils 的独立移植）。
 *
 * <p>模板中使用示例：${autUtils.autCellValue(row, titleConf)}。
 * 与参考实现不同的是，titleConf 使用 java.util.Map（对应参考实现中的 fastjson JSONObject），
 * 字典格式化类型取值为参考实现枚举 AutumnAppHandleValType.dictFormatObject 的值 "dictFormat"。
 */
public class JxlsAutumnUtils {

    private static final JxlsAutumnUtils instance = new JxlsAutumnUtils();

    public static JxlsAutumnUtils getInstance() {
        return instance;
    }

    private JxlsAutumnUtils() {
    }

    /** 根据列配置获取数据行中该列的值；handleValType=dictFormat 时取 prop 对应对象的 dictLabel。 */
    public String autCellValue(Object row, Map<String, Object> titleConf) {
        if (titleConf == null) {
            return "";
        }
        Object handleValType = titleConf.get("handleValType");
        Object propObj = titleConf.get("prop");
        String prop = propObj == null ? "" : String.valueOf(propObj);
        if ("dictFormat".equals(handleValType)) {
            return PropertyUtils.getPropString(row, prop.isEmpty() ? "dictLabel" : prop + ".dictLabel");
        }
        return PropertyUtils.getPropString(row, prop);
    }
}