package com.medstore.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
public class MessageResolver {

    private static final Logger logger = LoggerFactory.getLogger(MessageResolver.class);
    private final Map<String, Map<String, String>> messagesCache = new HashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostConstruct
    public void init() {
        // Explicitly load English and French messages on startup
        loadMessages("en");
        loadMessages("fr");
    }

    private void loadMessages(String lang) {
        String filename = "messages_" + lang + ".json";
        try {
            ClassPathResource resource = new ClassPathResource(filename);
            if (resource.exists()) {
                Map<String, String> messages = objectMapper.readValue(
                        resource.getInputStream(), 
                        new TypeReference<Map<String, String>>() {}
                );
                messagesCache.put(lang, messages);
                logger.info("Loaded {} messages from {}", messages.size(), filename);
            } else {
                logger.warn("Message file not found: {}", filename);
            }
        } catch (IOException e) {
            logger.error("Failed to load messages from {}", filename, e);
        }
    }

    public String getMessage(String code) {
        return getMessage(code, null);
    }
    
    public String getMessage(String code, Object[] args) {
        Locale locale = LocaleContextHolder.getLocale();
        String lang = locale.getLanguage();
        
        // Default to English if language not found or if unknown
        if (!messagesCache.containsKey(lang)) {
            lang = "en";
        }
        
        Map<String, String> langMessages = messagesCache.getOrDefault(lang, messagesCache.get("en"));
        if (langMessages == null) {
            return code; // Should not happen if EN is loaded
        }

        String message = langMessages.get(code);
        if (message == null) {
            // Fallback to English if key missing in current language
            Map<String, String> defaultMessages = messagesCache.get("en");
            message = defaultMessages != null ? defaultMessages.get(code) : code;
        }

        if (message != null && args != null && args.length > 0) {
            return MessageFormat.format(message, args);
        }
        
        return message != null ? message : code;
    }
}
