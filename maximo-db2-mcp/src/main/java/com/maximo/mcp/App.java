package com.maximo.mcp;

import org.noear.solon.Solon;
import org.noear.solon.annotation.SolonMain;

/**
 * Maximo DB2 MCP 服务 - 主入口
 *
 * 提供 Maximo 系统元数据查询的 MCP (Model Context Protocol) 服务，
 * 支持查询对象定义、字段定义、关联关系、应用 XML 等信息。
 */
@SolonMain
public class App {
    public static void main(String[] args) {
        Solon.start(App.class, args, app -> {
            app.onError(err -> {
                System.err.println("[Maximo MCP] 启动异常: " + err.getMessage());
                err.printStackTrace();
            });
        });
        System.out.println("[Maximo MCP] 服务已启动 - 端口: " + System.getProperty("server.port", "8080"));
    }
}
