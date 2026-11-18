package com.feastora.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * REST API JSON Utility for reading HTTP requests and writing formatted responses.
 */
public class JsonUtil {

    private static final Gson GSON = new GsonBuilder()
            .setDateFormat("yyyy-MM-dd HH:mm:ss")
            .serializeNulls()
            .create();

    public static Gson getGson() {
        return GSON;
    }

    /**
     * Reads JSON body from HttpServletRequest and deserializes to target class
     */
    public static <T> T fromJson(HttpServletRequest request, Class<T> classOfT) throws IOException {
        StringBuilder buffer = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                buffer.append(line);
            }
        }
        return GSON.fromJson(buffer.toString(), classOfT);
    }

    /**
     * Serializes object to JSON string
     */
    public static String toJson(Object src) {
        return GSON.toJson(src);
    }

    /**
     * Writes standardized JSON response
     */
    public static void writeJson(HttpServletResponse response, int statusCode, Object data) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setStatus(statusCode);
        try (PrintWriter writer = response.getWriter()) {
            writer.print(GSON.toJson(data));
            writer.flush();
        }
    }

    /**
     * Standard success JSON response
     */
    public static void sendSuccess(HttpServletResponse response, Object data, String message) throws IOException {
        Map<String, Object> body = new HashMap<>();
        body.put("success", true);
        body.put("message", message);
        body.put("data", data);
        body.put("timestamp", System.currentTimeMillis());
        writeJson(response, HttpServletResponse.SC_OK, body);
    }

    /**
     * Standard error JSON response
     */
    public static void sendError(HttpServletResponse response, int statusCode, String message) throws IOException {
        Map<String, Object> body = new HashMap<>();
        body.put("success", false);
        body.put("message", message);
        body.put("timestamp", System.currentTimeMillis());
        writeJson(response, statusCode, body);
    }
}
