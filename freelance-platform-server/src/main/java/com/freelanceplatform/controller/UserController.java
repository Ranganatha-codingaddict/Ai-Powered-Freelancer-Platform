package com.freelanceplatform.controller;

import com.freelanceplatform.model.User;
import com.freelanceplatform.services.UserService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register/freelancer")
    public User registerFreelancer(@RequestParam("file") MultipartFile file) {
        return userService.registerFreelancer(file);
    }

    @PostMapping("/register/client")
    public User registerClient(@RequestBody User user) {
        return userService.registerClient(user);
    }

    @GetMapping("/quiz/{userId}")
    public String generateQuiz(@PathVariable Long userId) {
        return userService.generateQuiz(userId);
    }

    @PostMapping("/quiz/{userId}")
    public ResponseEntity<?> submitQuiz(@PathVariable Long userId, @RequestBody QuizSubmission submission) {
        try {
            System.out.println("Received userId: " + userId);
            System.out.println("Received quiz: " + submission.getQuiz());
            System.out.println("Received answers: " + submission.getAnswers());
            boolean passed = userService.evaluateQuiz(userId, submission.getQuiz(), submission.getAnswers());
            System.out.println("Quiz evaluation result: " + passed);
            return ResponseEntity.ok(new QuizResult(passed));
        } catch (Exception e) {
            System.err.println("Error in submitQuiz: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @PostMapping("/freelancers/{userId}")
    public ResponseEntity<User> updateFreelancerDetails(
            @PathVariable Long userId,
            @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateFreelancerDetails(userId, userDetails.getName(), userDetails.getEmail(), userDetails.getPassword());
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            if (user != null) {
                // Generate JWT token
                String token = generateJwtToken(user);
                return ResponseEntity.ok(new LoginResponse(user, token)); // Return user and token
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred during login");
        }
    }

    private String generateJwtToken(User user) {
        return Jwts.builder()
                .setSubject(String.valueOf(user.getId()))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 day expiry
                .signWith(SignatureAlgorithm.HS512,"your-secret-key" ) // Use the same secret as in JobService
                .compact();
    }

    @GetMapping("/freelancers")
    public ResponseEntity<List<User>> getFreelancers(@RequestHeader("Authorization") String token) {
        try {
            // Remove "Bearer " prefix from the token
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;

            // Validate the token
            Jwts.parser()
                .setSigningKey("your-secret-key") // Use the same secret key as in generateJwtToken
                .parseClaimsJws(jwtToken);

            List<User> freelancers = userService.getFreelancers();
            return ResponseEntity.ok(freelancers);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/clients")
    public ResponseEntity<List<User>> getClients(@RequestHeader("Authorization") String token) {
        try {
            List<User> clients = userService.getClients();
            return ResponseEntity.ok(clients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }
}

// Existing classes unchanged
class LoginRequest {
    private String email;
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class QuizSubmission {
    private String quiz;
    private String answers;

    public String getQuiz() { return quiz; }
    public void setQuiz(String quiz) { this.quiz = quiz; }
    public String getAnswers() { return answers; }
    public void setAnswers(String answers) { this.answers = answers; }
}

class QuizResult {
    private boolean passed;

    public QuizResult(boolean passed) { this.passed = passed; }
    public boolean isPassed() { return passed; }
    public void setPassed(boolean passed) { this.passed = passed; }
}
class LoginResponse {
    private User user;
    private String token;

    public LoginResponse(User user, String token) {
        this.user = user;
        this.token = token;
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
}