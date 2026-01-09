package com.medstore.config;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.util.TimeZone;

@Configuration
public class TimezoneConfig {

    @PostConstruct
    public void init() {
        // Setting the default timezone to Indian Standard Time (IST)
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Kolkata"));
        System.out.println("Date configured to: " + new java.util.Date());
    }
}
