package com.freelanceplatform.ai;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@Service
public class GeminiService {
    @Value("${gemini.api.key}")
    private String apiKey;
    
    private final RestTemplate restTemplate = new RestTemplate();
    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public String parseResume(String resumeText) {
        String prompt = "Extract name, email, phone number, and skills from this resume in JSON format: {\"name\":\"\", \"email\":\"\", \"phone\":\"\", \"skills\":\"\"}. Resume: " + resumeText;
        return callGemini(prompt, 200);
    }

    public String generateQuiz(String skills) {
        String prompt = "Generate a 5-question multiple-choice quiz based on these skills: " + skills + 
                       ". Return the quiz in strict JSON format with exactly 5 questions, each having a 'question' string, an 'options' array with exactly 4 unique options, and an 'answer' index (0-3) indicating the correct option. Use this exact structure: " +
                       "{\"questions\": [" +
                       "{\"question\": \"Question 1 text\", \"options\": [\"Option A1\", \"Option B1\", \"Option C1\", \"Option D1\"], \"answer\": 0}," +
                       "{\"question\": \"Question 2 text\", \"options\": [\"Option A2\", \"Option B2\", \"Option C2\", \"Option D2\"], \"answer\": 1}," +
                       "{\"question\": \"Question 3 text\", \"options\": [\"Option A3\", \"Option B3\", \"Option C3\", \"Option D3\"], \"answer\": 2}," +
                       "{\"question\": \"Question 4 text\", \"options\": [\"Option A4\", \"Option B4\", \"Option C4\", \"Option D4\"], \"answer\": 3}," +
                       "{\"question\": \"Question 5 text\", \"options\": [\"Option A5\", \"Option B5\", \"Option C5\", \"Option D5\"], \"answer\": 0}" +
                       "]}";
        return callGemini(prompt, 500);
    }

    public String evaluateQuiz(String quiz, String answers) {
        String prompt = "You are an AI assistant tasked with evaluating a quiz. The quiz is provided in JSON format, and the answers are given as comma-separated indices (0-3) corresponding to the selected options for each question. Compare the user's answers with the 'answer' field in each question. Return a JSON object with a single field 'result': {\"result\": \"Pass\"} if 3 or more answers match the correct answers, otherwise {\"result\": \"Fail\"}. Do not include the quiz data, questions, or any other fields in the response. Only return the JSON object with the 'result' field.\n\nQuiz: " + quiz + "\nAnswers: " + answers;
        return callGemini(prompt, 200); // Increased from 100 to 200 to avoid truncation
    }

    public String chatbotResponse(String query) {
        String prompt = "Answer as a helpful assistant: " + query;
        return callGemini(prompt, 150);
    }

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
            return "{\"name\":\"Unknown\",\"email\":\"unknown@example.com\",\"phone\":\"0000000000\",\"skills\":\"Unknown\"}";
        }
    }

    private String parseGeminiResponse(String response) {
        try {
            JSONObject jsonResponse = new JSONObject(response);
            JSONArray candidates = jsonResponse.optJSONArray("candidates");
            if (candidates != null && candidates.length() > 0) {
                JSONObject firstCandidate = candidates.getJSONObject(0);
                JSONArray parts = firstCandidate.optJSONObject("content").optJSONArray("parts");
                if (parts != null && parts.length() > 0) {
                    String text = parts.getJSONObject(0).optString("text", "Error: No text in response");
                    // Remove Markdown code block markers if present
                    if (text.startsWith("```json")) {
                        text = text.replace("```json", "").trim();
                        if (text.endsWith("```")) {
                            text = text.substring(0, text.length() - 3).trim();
                        } else {
                            int lastBrace = text.lastIndexOf("}");
                            if (lastBrace > 0) {
                                text = text.substring(0, lastBrace + 1);
                            }
                        }
                    }
                    // Parse the cleaned text to validate the response format
                    JSONObject parsedJson = new JSONObject(text);
                    // For quiz evaluation, expect "result" field
                    if (parsedJson.has("result")) {
                        String result = parsedJson.getString("result");
                        if (!"Pass".equalsIgnoreCase(result) && !"Fail".equalsIgnoreCase(result)) {
                            return "Error: Invalid evaluation result - expected 'Pass' or 'Fail'";
                        }
                        return text;
                    }
                    // For quiz generation, expect "questions" array
                    else if (parsedJson.has("questions")) {
                        JSONArray questions = parsedJson.getJSONArray("questions");
                        if (questions.length() != 5) {
                            return "Error: Invalid quiz format - expected 5 questions";
                        }
                        return text;
                    }
                    // For resume parsing, expect "name" field
                    else if (parsedJson.has("name")) {
                        return text;
                    }
                    // For chatbot response, return the text as-is
                    else {
                        return text;
                    }
                }
            }
            return "Error: No valid response from Gemini";
        } catch (Exception e) {
            System.err.println("Error parsing Gemini response: " + e.getMessage());
            return "Error: Invalid Gemini response format";
        }
    }
}