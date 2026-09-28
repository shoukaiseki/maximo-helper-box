package com.example.maximo.exporter.jxls;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 模板中的日期工具 bean（对应 com.autumn.common.utils.poi.jxls.JxlsDateUtils 的独立移植）。
 *
 * <p>模板中使用示例：${dateUtils.format('yyyy-MM-dd', someDate)}、${dateUtils.getNowDate()}。
 */
public class JxlsDateUtils {

    private static final JxlsDateUtils instance = new JxlsDateUtils();

    public static JxlsDateUtils getInstance() {
        return instance;
    }

    private JxlsDateUtils() {
    }

    public String format(String format, Object time) {
        if (time == null) {
            return "";
        }
        Date date;
        if (time instanceof Date) {
            date = (Date) time;
        } else if (time instanceof Number) {
            date = new Date(((Number) time).longValue());
        } else {
            date = parseDate(time.toString());
        }
        if (date == null) {
            return "";
        }
        return new SimpleDateFormat(format).format(date);
    }

    public Date getNowDate() {
        return new Date();
    }

    /**
     * 解析常见日期字符串，解析失败返回 null。
     */
    private Date parseDate(String text) {
        String value = text.trim();
        if (value.isEmpty()) {
            return null;
        }
        try {
            return new Date(Long.parseLong(value));
        } catch (NumberFormatException ignored) {
            // 继续尝试常见日期格式
        }
        String[] patterns = {
                "yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm", "yyyy-MM-dd",
                "yyyy/MM/dd HH:mm:ss", "yyyy/MM/dd HH:mm", "yyyy/MM/dd",
                "yyyy-MM-dd'T'HH:mm:ss", "yyyy-MM-dd'T'HH:mm:ss.SSS",
                "yyyyMMddHHmmss", "yyyyMMdd"
        };
        for (String pattern : patterns) {
            try {
                return new SimpleDateFormat(pattern).parse(value);
            } catch (ParseException ignored) {
                // 继续尝试下一个格式
            }
        }
        return null;
    }
}