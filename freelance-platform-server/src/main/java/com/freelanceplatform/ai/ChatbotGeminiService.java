package com.freelanceplatform.ai;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatbotGeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    // Method to get response for text queries
    public String getChatbotResponse(String query) {
        String prompt = "Answer as a helpful assistant: " + query;
        return callGemini(prompt, 150); // Sending query to Gemini with 150 tokens limit
    }

    // Method to handle file content
    public String getChatbotResponseFromFile(String fileContent) {
        String prompt = "Answer as a helpful assistant: " + fileContent;
        return callGemini(prompt, 150); // Send file content to Gemini with 150 tokens limit
    }

    // Generic method to call the Gemini API
    private String callGemini(String prompt, int maxTokens) {
        try {
            if (apiKey == null || apiKey.trim().isEmpty()) {
                throw new IllegalStateException("Gemini API key is not configured");
            }

            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(Map.of("role", "user", "parts", List.of(Map.of("text", prompt)))));
            requestBody.put("generationConfig", Map.of("maxOutputTokens", maxTokens));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String urlWithKey = GEMINI_API_URL + "?key=" + apiKey;
            String response = restTemplate.exchange(urlWithKey, HttpMethod.POST, entity, String.class).getBody();

            return parseGeminiResponse(response);
        } catch (Exception e) {
            System.err.println("Failed to call Gemini API: " + e.getMessage());
            return "Error: Invalid Gemini response format";
        }
    }

    // Parse the response from Gemini
    private String parseGeminiResponse(String response) {
        try {
            JSONObject jsonResponse = new JSONObject(response);
            JSONArray candidates = jsonResponse.optJSONArray("candidates");
            if (candidates != null && candidates.length() > 0) {
                JSONObject firstCandidate = candidates.getJSONObject(0);
                JSONArray parts = firstCandidate.optJSONObject("content").optJSONArray("parts");
                if (parts != null && parts.length() > 0) {
                    String text = parts.getJSONObject(0).optString("text", "Error: No text in response");
                    return text;
                }
            }
            return "Error: No valid response from Gemini";
        } catch (Exception e) {
            System.err.println("Error parsing Gemini response: " + e.getMessage());
            return "Error: Invalid Gemini response format";
        }
    }
}
