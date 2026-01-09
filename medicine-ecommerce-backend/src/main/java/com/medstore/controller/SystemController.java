package com.medstore.controller;

import com.medstore.config.ServerInfo;
import com.medstore.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class SystemController {

    @Autowired
    private ServerInfo serverInfo;

    @GetMapping("/system-info")
    public ResponseEntity<ApiResponse<Map<String, String>>> getSystemInfo() {
        Map<String, String> info = new HashMap<>();
        info.put("startTime", serverInfo.getStartTime());
        info.put("developer", "Pratik Bhatt");
        info.put("contact", "pratik.bhatt@gmail.com");
        
        return ResponseEntity.ok(ApiResponse.success(info, "System info retrieved successfully"));
    }
}
