package com.medstore.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class LogController {

    private static final Logger logger = LoggerFactory.getLogger(LogController.class);
    private static final String LOG_FILE_PATH = "logs/application.log";
    private static final Logger frontendLogger = LoggerFactory.getLogger("FrontendLogger");

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<String>> getSystemLogs() {
        if (!Files.exists(Paths.get(LOG_FILE_PATH))) {
             return ResponseEntity.ok(Collections.singletonList("Log file pending... (Action required: Check specific server log settings or wait for activity)"));
        }
        try (Stream<String> lines = Files.lines(Paths.get(LOG_FILE_PATH))) {
            // Read last 500 lines for performance
            List<String> logs = lines.collect(Collectors.toList());
            int startIndex = Math.max(0, logs.size() - 500);
            return ResponseEntity.ok(logs.subList(startIndex, logs.size()));
        } catch (IOException e) {
            logger.error("Error reading log file", e);
            return ResponseEntity.internalServerError().body(Collections.singletonList("Error reading logs: " + e.getMessage()));
        }
    }

    @PostMapping("/frontend")
    public ResponseEntity<?> logFrontendError(@RequestBody Map<String, Object> logData) {
        String level = (String) logData.getOrDefault("level", "INFO");
        String message = (String) logData.getOrDefault("message", "No message");
        String timestamp = (String) logData.getOrDefault("timestamp", "No time");
        
        String logEntry = String.format("[FRONTEND] [%s] %s: %s", timestamp, level, message);
        
        // Log to backend logs so it appears in the file
        if ("ERROR".equalsIgnoreCase(level)) {
            frontendLogger.error(logEntry);
        } else if ("WARN".equalsIgnoreCase(level)) {
            frontendLogger.warn(logEntry);
        } else {
            frontendLogger.info(logEntry);
        }
        
        return ResponseEntity.ok().build();
    }
}
