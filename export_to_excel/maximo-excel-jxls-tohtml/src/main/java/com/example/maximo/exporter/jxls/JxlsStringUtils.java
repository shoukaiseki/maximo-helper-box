package com.example.maximo.exporter.jxls;

/**
 * 模板中的字符串工具 bean（对应 com.autumn.common.utils.poi.jxls.JxlsStringUtils 的独立移植）。
 *
 * <p>模板中使用示例：${strUtils.valEmptyNullStr(name, '(', ')')}：
 * val 为空时返回空字符串，否则返回 pre + val + suffix（pre/suffix 为空时自动跳过）。
 */
public class JxlsStringUtils {

    /** 如果 val 为空返回空字符。 */
    public String valEmptyNullStr(String val, String pre, String suffix) {
        if (isEmpty(val)) {
            return "";
        }
        StringBuilder tmp = new StringBuilder();
        if (!isEmpty(pre)) {
            tmp.append(pre);
        }
        tmp.append(val);
        if (!isEmpty(suffix)) {
            tmp.append(suffix);
        }
        return tmp.toString();
    }

    private static boolean isEmpty(String s) {
        return s == null || s.isEmpty();
    }
}