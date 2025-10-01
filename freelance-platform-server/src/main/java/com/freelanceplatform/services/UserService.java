package com.freelanceplatform.services;

import com.freelanceplatform.ai.GeminiService;

import com.freelanceplatform.model.User;
import com.freelanceplatform.repository.UserRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    public UserRepository userRepository;

    @Autowired
    private GeminiService geminiService;

    public User registerFreelancer(MultipartFile file) {
        // Existing logic unchanged
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("PDF file cannot be null or empty");
        }

        String resumeText;
        try {
            resumeText = extractTextFromPdf(file);
            if (resumeText == null || resumeText.trim().isEmpty()) {
                throw new IllegalStateException("No text could be extracted from the PDF");
            }

            String parsedData = geminiService.parseResume(resumeText);
            if (parsedData.contains("Error")) {
                throw new IllegalStateException("Failed to parse resume data: " + parsedData);
            }

            User user = new User();
            user.setName(extractField(parsedData, "name"));
            user.setEmail(extractField(parsedData, "email"));
            user.setPhone(extractField(parsedData, "phone"));
            user.setSkills(extractField(parsedData, "skills"));
            user.setResumeText(resumeText);
            user.setRole("FREELANCER");
            user.setActive(false);

            if (user.getName() == null || user.getEmail() == null) {
                throw new IllegalStateException("Name and email are required fields");
            }

            return userRepository.save(user);
        } catch (IOException e) {
            logger.error("Error processing PDF file: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process PDF file: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Error registering freelancer: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to register freelancer: " + e.getMessage(), e);
        }
    }

    public User registerClient(User user) {
        // Existing logic unchanged
        if (user == null || user.getName() == null || user.getEmail() == null || user.getPassword() == null) {
            throw new IllegalArgumentException("Client data (name, email, password) cannot be null");
        }
        user.setRole("CLIENT");
        user.setActive(true);
        return userRepository.save(user);
    }

    public String generateQuiz(Long userId) {
        // Existing logic unchanged
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        return geminiService.generateQuiz(user.getSkills());
    }

    public boolean evaluateQuiz(Long userId, String quiz, String answers) {
        // Existing logic unchanged
        logger.info("Evaluating quiz for userId: {}", userId);
        logger.debug("Quiz: {}", quiz);
        logger.debug("Answers: {}", answers);

        String resultJson = geminiService.evaluateQuiz(quiz, answers);
        logger.debug("Gemini response: {}", resultJson);

        try {
            JSONObject resultObj = new JSONObject(resultJson);
            String result = resultObj.optString("result", "Fail");
            logger.info("Parsed result: {}", result);

            if ("Pass".equalsIgnoreCase(result)) {
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
                user.setActive(true);
                userRepository.save(user);
                return true;
            }
            return false;
        } catch (Exception e) {
            logger.error("Error parsing quiz evaluation result: {}", resultJson, e);
            return false;
        }
    }

    public User updateFreelancerDetails(Long userId, String name, String email, String password) {
        // Existing logic unchanged
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

            if (!"FREELANCER".equals(user.getRole())) {
                throw new IllegalStateException("User is not a Freelancer");
            }

            user.setName(name);
            user.setEmail(email);
            user.setPassword(password);
            user.setActive(true);

            if (user.getName() == null || user.getEmail() == null || user.getPassword() == null) {
                throw new IllegalStateException("Name, email, and password are required fields");
            }

            return userRepository.save(user);
        } catch (Exception e) {
            logger.error("Error updating freelancer details for userId {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to update freelancer details: " + e.getMessage(), e);
        }
    }

    public void deleteUser(Long userId) {
        // Existing logic unchanged
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
        logger.info("User with ID {} deleted successfully", userId);
    }

    public void deleteFreelancer(Long freelancerId) {
        // Existing logic unchanged
        User freelancer = userRepository.findById(freelancerId)
                .orElseThrow(() -> new IllegalArgumentException("Freelancer not found with ID: " + freelancerId));

        if (!"FREELANCER".equals(freelancer.getRole())) {
            throw new IllegalStateException("User is not a freelancer");
        }

        userRepository.deleteById(freelancerId);
        logger.info("Freelancer with ID {} deleted successfully", freelancerId);
    }

    public List<User> getFreelancers() {
        // Existing logic unchanged
        return userRepository.findAll().stream()
                .filter(user -> "FREELANCER".equals(user.getRole()))
                .collect(Collectors.toList());
    }

    public List<User> getClients() {
        // Existing logic unchanged
        return userRepository.findAll().stream()
                .filter(user -> "CLIENT".equals(user.getRole()))
                .collect(Collectors.toList());
    }

    public User authenticate(String email, String password) {
        // Existing logic unchanged
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null && password.equals(user.getPassword())) {
            return user;
        }
        return null;
    }

    // New method to fetch user by ID (if needed)
    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
    }

    private String extractField(String data, String field) {
        // Existing logic unchanged
        try {
            JSONObject jsonData = new JSONObject(data);
            return jsonData.optString(field, "").trim();
        } catch (Exception e) {
            logger.error("Error parsing JSON data for field '{}': {}", field, data, e);
            return "";
        }
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        // Existing logic unchanged
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}