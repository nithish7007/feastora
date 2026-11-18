package com.feastora;

import com.feastora.config.AppConfig;
import com.feastora.config.DatabaseConfig;
import com.feastora.controller.*;
import com.feastora.filter.AdminAuthFilter;
import com.feastora.filter.CORSFilter;
import org.apache.catalina.Context;
import org.apache.catalina.startup.Tomcat;
import org.apache.tomcat.util.descriptor.web.FilterDef;
import org.apache.tomcat.util.descriptor.web.FilterMap;

import java.io.File;
import java.util.logging.Logger;

/**
 * Embedded Tomcat 10.1+ Runner for FEASTORA Java Backend.
 * Allows instant execution without requiring standalone Tomcat installation.
 */
public class ServerMain {

    private static final Logger LOGGER = Logger.getLogger(ServerMain.class.getName());

    public static void main(String[] args) throws Exception {
        int port = 8080;
        String portEnv = System.getenv("PORT");
        if (portEnv != null && !portEnv.isEmpty()) {
            port = Integer.parseInt(portEnv);
        }

        LOGGER.info("==================================================================");
        LOGGER.info("Starting " + AppConfig.APP_NAME + " - \"" + AppConfig.APP_TAGLINE + "\"");
        LOGGER.info("Java Version: " + System.getProperty("java.version"));
        LOGGER.info("Database Connection Test: " + (DatabaseConfig.testConnection() ? "CONNECTED (MySQL 8)" : "NOT CONNECTED (Will retry on queries)"));
        LOGGER.info("==================================================================");

        Tomcat tomcat = new Tomcat();
        tomcat.setPort(port);
        tomcat.getConnector(); // triggers connector creation

        String baseDir = new File("temp-tomcat").getAbsolutePath();
        tomcat.setBaseDir(baseDir);

        Context ctx = tomcat.addContext("", new File("backend/src/main/webapp").getAbsolutePath());

        // 1. Register Filters
        FilterDef corsDef = new FilterDef();
        corsDef.setFilterName("CORSFilter");
        corsDef.setFilterClass(CORSFilter.class.getName());
        ctx.addFilterDef(corsDef);

        FilterMap corsMap = new FilterMap();
        corsMap.setFilterName("CORSFilter");
        corsMap.addURLPattern("/*");
        ctx.addFilterMap(corsMap);

        FilterDef adminDef = new FilterDef();
        adminDef.setFilterName("AdminAuthFilter");
        adminDef.setFilterClass(AdminAuthFilter.class.getName());
        ctx.addFilterDef(adminDef);

        FilterMap adminMap = new FilterMap();
        adminMap.setFilterName("AdminAuthFilter");
        adminMap.addURLPattern("/api/admin/*");
        ctx.addFilterMap(adminMap);

        // 2. Register Servlets
        Tomcat.addServlet(ctx, "AuthServlet", new AuthServlet()).addMapping("/api/auth/*");
        Tomcat.addServlet(ctx, "RestaurantServlet", new RestaurantServlet()).addMapping("/api/restaurants/*");
        Tomcat.addServlet(ctx, "FoodServlet", new FoodServlet()).addMapping("/api/foods/*");
        Tomcat.addServlet(ctx, "CategoryServlet", new CategoryServlet()).addMapping("/api/categories/*");
        Tomcat.addServlet(ctx, "CartServlet", new CartServlet()).addMapping("/api/cart/*");
        Tomcat.addServlet(ctx, "OrderServlet", new OrderServlet()).addMapping("/api/orders/*");
        Tomcat.addServlet(ctx, "AdminServlet", new AdminServlet()).addMapping("/api/admin/*");
        Tomcat.addServlet(ctx, "PaymentServlet", new PaymentServlet()).addMapping("/api/payments/*");
        Tomcat.addServlet(ctx, "CouponServlet", new CouponServlet()).addMapping("/api/coupons/*");
        Tomcat.addServlet(ctx, "DeliveryServlet", new DeliveryServlet()).addMapping("/api/delivery/*");
        Tomcat.addServlet(ctx, "HealthServlet", new HealthServlet()).addMapping("/api/health");

        tomcat.start();
        LOGGER.info(">>> FEASTORA Java Backend is LIVE and listening at http://localhost:" + port + "/api <<<");
        tomcat.getServer().await();
    }
}
