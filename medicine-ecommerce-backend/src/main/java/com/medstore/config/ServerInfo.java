package com.medstore.config;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class ServerInfo {

    private ZonedDateTime startTime;

    @PostConstruct
    public void init() {
        this.startTime = ZonedDateTime.now();
    }

    public String getStartTime() {
        return startTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }
}
