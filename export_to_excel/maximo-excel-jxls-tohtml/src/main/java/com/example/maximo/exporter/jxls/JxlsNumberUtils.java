package com.example.maximo.exporter.jxls;

import java.math.BigDecimal;
import java.util.List;

/**
 * 模板中的数字工具 bean（对应 com.autumn.common.utils.poi.jxls.JxlsNumberUtils 的独立移植）。
 *
 * <p>模板中使用示例：${numUtils.negate(num)}、${numUtils.sumListProp(list, 'amount')}。
 */
public class JxlsNumberUtils {

    private static final JxlsNumberUtils instance = new JxlsNumberUtils();

    public static JxlsNumberUtils getInstance() {
        return instance;
    }

    private JxlsNumberUtils() {
    }

    /** 数字取反，null 返回 null（对应 NumberUtils.negateHasNull）。 */
    public Number negate(Number num) {
        if (num == null) {
            return null;
        }
        if (num instanceof BigDecimal) {
            return ((BigDecimal) num).negate();
        }
        return BigDecimal.valueOf(num.doubleValue()).negate();
    }

    /** 列表指定属性求和，null 值跳过、空列表返回 0（对应 BeanUtils + CostMathUtils.ifNullToZero 组合）。 */
    public BigDecimal sumListProp(List<?> list, String propName) {
        BigDecimal tmp = BigDecimal.ZERO;
        if (list == null) {
            return tmp;
        }
        for (Object o : list) {
            Object val = PropertyUtils.getPropValue(o, propName);
            if (val == null) {
                continue;
            }
            tmp = tmp.add(toBigDecimal(val));
        }
        return tmp;
    }

    private static BigDecimal toBigDecimal(Object val) {
        if (val instanceof BigDecimal) {
            return (BigDecimal) val;
        }
        if (val instanceof Number) {
            return BigDecimal.valueOf(((Number) val).doubleValue());
        }
        String s = String.valueOf(val).trim();
        if (s.isEmpty()) {
            return BigDecimal.ZERO;
        }
        try {
            return new BigDecimal(s);
        } catch (NumberFormatException e) {
            return BigDecimal.ZERO;
        }
    }
}