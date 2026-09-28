package com.example.maximo.exporter.jxls;

import java.lang.reflect.Method;
import java.util.Map;

/**
 * 属性读取工具（供模板工具 bean 使用）。
 *
 * <p>对应参考实现中 org.shoukaiseki.common.utils.BeanUtils 的轻量本地实现，
 * 支持 Map 键路径（如 "a.b.c"）与 JavaBean getter 两种取值方式。
 */
final class PropertyUtils {

    private PropertyUtils() {
    }

    public static Object getPropValue(Object target, String propName) {
        if (target == null || propName == null) {
            return null;
        }
        Object current = target;
        for (String part : propName.split("\\.")) {
            if (part.isEmpty()) {
                continue;
            }
            if (current == null) {
                return null;
            }
            current = resolveOne(current, part);
        }
        return current;
    }

    public static String getPropString(Object target, String propName) {
        Object value = getPropValue(target, propName);
        return value == null ? "" : String.valueOf(value);
    }

    private static Object resolveOne(Object current, String part) {
        if (current instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) current;
            return map.containsKey(part) ? map.get(part) : null;
        }
        try {
            String getterName = "get" + Character.toUpperCase(part.charAt(0)) + part.substring(1);
            Method method = current.getClass().getMethod(getterName);
            return method.invoke(current);
        } catch (Exception e) {
            return null;
        }
    }
}