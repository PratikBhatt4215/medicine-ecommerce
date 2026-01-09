package com.medstore.controller;

import com.medstore.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.TextStyle;
import java.util.*;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "*")
public class TimezoneController {

    @GetMapping("/timezones")
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> getSupportedTimezones() {
        List<Map<String, String>> timezones = new ArrayList<>();
        
        // Get all available ZoneIds
        Set<String> allZones = ZoneId.getAvailableZoneIds();
        
        // Convert to list and sort
        List<String> sortedZones = new ArrayList<>(allZones);
        Collections.sort(sortedZones);

        for (String zoneId : sortedZones) {
            // Filter out some obscure internal IDs to keep list clean (optional, but good for UX)
            if (zoneId.startsWith("SystemV") || zoneId.startsWith("Etc") || zoneId.contains("SystemV")) {
                continue;
            }
            
            try {
                Map<String, String> zoneInfo = new HashMap<>();
                ZoneId zone = ZoneId.of(zoneId);
                ZonedDateTime now = ZonedDateTime.now(zone);
                
                zoneInfo.put("zoneId", zoneId);
                // Use simplified label if possible, or just the ID
                zoneInfo.put("label", zoneId); 
                zoneInfo.put("abbr", zone.getDisplayName(TextStyle.SHORT, Locale.ENGLISH));
                zoneInfo.put("offset", "GMT" + now.getOffset().getId());
                
                timezones.add(zoneInfo);
            } catch (Exception e) {
                // Ignore invalid zones
            }
        }
        
        // Sort by offset for easier reading
        timezones.sort((a, b) -> a.get("offset").compareTo(b.get("offset")));
        
        return ResponseEntity.ok(ApiResponse.success(timezones, "Timezones retrieved successfully"));
    }
}
