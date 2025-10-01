package com.freelanceplatform.controller;

import com.freelanceplatform.ai.ChatbotGeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "http://localhost:3000") // Frontend access
public class ChatbotController {

    @Autowired
    private ChatbotGeminiService chatbotGeminiService;

    // Text query handling
    @PostMapping("/text")
    public String getResponse(@RequestBody String query) {
        if (query == null || query.trim().isEmpty()) {
            return "Error: Query cannot be empty!";
        }
        return chatbotGeminiService.getChatbotResponse(query); 
    }

    // File upload handling
    @PostMapping("/file")
    public String getResponseFromFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return "Error: No file uploaded!";
        }

        try {
            // Read file content as string
            String content = new BufferedReader(
                    new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))
                    .lines()
                    .collect(Collectors.joining("\n"));

            // Send file content to Gemini
            return chatbotGeminiService.getChatbotResponseFromFile(content);
        } catch (Exception e) {
            return "Error processing file: " + e.getMessage();
        }
    }
}
