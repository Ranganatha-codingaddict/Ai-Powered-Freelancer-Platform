package com.freelanceplatform.controller;

import com.freelanceplatform.model.User;
import com.freelanceplatform.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final String ADMIN_EMAIL = "ranganathas9696@gmail.com";
    private static final String ADMIN_PASSWORD = "9019368681";
    private static final Long FIXED_ADMIN_ID = 1L; // Fixed admin ID

    @Autowired
    private UserService userService;

    @PostMapping("/login/admin")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        Map<String, Object> response = new HashMap<>();

        if (ADMIN_EMAIL.equals(email) && ADMIN_PASSWORD.equals(password)) {
            response.put("message", "Admin login successful");
            response.put("token", "mock-admin-token-" + FIXED_ADMIN_ID); // Use fixed ID instead of timestamp
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/freelancers")
    public ResponseEntity<List<User>> getFreelancers(@RequestHeader("Authorization") String authHeader) {
        if (!isAdminAuthenticated(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            List<User> freelancers = userService.getFreelancers();
            return ResponseEntity.ok(freelancers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/clients")
    public ResponseEntity<List<User>> getClients(@RequestHeader("Authorization") String authHeader) {
        if (!isAdminAuthenticated(authHeader)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            List<User> clients = userService.getClients();
            return ResponseEntity.ok(clients);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long userId, @RequestHeader("Authorization") String authHeader) {
        Map<String, String> response = new HashMap<>();
        if (!isAdminAuthenticated(authHeader)) {
            response.put("error", "Unauthorized access");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        try {
            userService.deleteUser(userId);
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to delete user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private boolean isAdminAuthenticated(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return false;
        }
        String token = authHeader.substring(7); // Remove "Bearer "
        // Still checks for "mock-admin-token-" prefix, works with fixed ID
        return token.startsWith("mock-admin-token-");
    }
}