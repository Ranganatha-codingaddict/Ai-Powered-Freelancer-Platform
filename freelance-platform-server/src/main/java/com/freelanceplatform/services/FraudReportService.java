package com.freelanceplatform.services;

import com.freelanceplatform.model.FraudReport;
import com.freelanceplatform.model.User;
import com.freelanceplatform.repository.FraudReportRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FraudReportService {
    private static final String JWT_SECRET = "your-secret-key"; // Matches UserController

    @Autowired
    private FraudReportRepository fraudReportRepository;

    @Autowired
    private UserService userService;

    public FraudReport reportFraud(FraudReport report, String token) {
        System.out.println("Reporting fraud with token: " + token);
        Long userId = extractUserIdFromToken(token);
        System.out.println("Extracted reporter ID: " + userId);
        User reporter = userService.getUser(userId);
        System.out.println("Fetched reporter: " + (reporter != null ? "ID: " + reporter.getId() + ", Role: " + reporter.getRole() : "null"));
        if (reporter == null) {
            System.out.println("No reporter found for ID: " + userId);
            throw new SecurityException("Invalid reporter ID");
        }
        if ("ADMIN".equals(reporter.getRole())) {
            System.out.println("Admins cannot report fraud, user role: " + reporter.getRole());
            throw new SecurityException("Admins are not allowed to report fraud");
        }
        report.setReporterId(userId);
        report.setStatus("PENDING");
        System.out.println("Saving fraud report for reporter ID: " + userId);
        return fraudReportRepository.save(report);
    }

    public List<FraudReport> getAllFraudReports(String token) {
        System.out.println("Received token for fraud reports: " + token);
        Long adminId = extractUserIdFromToken(token);
        System.out.println("Extracted adminId: " + adminId);
        User admin = userService.getUser(adminId);
        System.out.println("Fetched admin: " + (admin != null ? "ID: " + admin.getId() + ", Role: " + admin.getRole() : "null"));
        if (admin == null) {
            System.out.println("No user found for adminId: " + adminId);
            throw new SecurityException("No user found for the provided token");
        }
        String jwt = token.replace("Bearer ", "");
        if (!jwt.equals("mock-admin-token-1") || !"ADMIN".equals(admin.getRole())) { // Exact match for fixed token
            System.out.println("User is not an admin or invalid token, role: " + admin.getRole() + ", token: " + jwt);
            throw new SecurityException("Only admins can view fraud reports");
        }
        System.out.println("Fetching fraud reports for admin ID: " + adminId);
        List<FraudReport> reports = fraudReportRepository.findAll();
        return reports.isEmpty() ? null : reports;
    }

    private Long extractUserIdFromToken(String token) {
        try {
            String jwt = token.replace("Bearer ", "");
            System.out.println("JWT after Bearer removal: " + jwt);
            if (jwt.equals("mock-admin-token-1")) { // Exact match for fixed admin token
                System.out.println("Mock admin token detected, extracting ID: 1");
                return 1L;
            }
            // Handle client/freelancer tokens (assuming JWT from UserController)
            Claims claims = Jwts.parser()
                    .setSigningKey(JWT_SECRET)
                    .parseClaimsJws(jwt)
                    .getBody();
            String subject = claims.getSubject();
            System.out.println("Token subject: " + subject);
            return Long.parseLong(subject);
        } catch (Exception e) {
            System.err.println("Error parsing token: " + e.getMessage());
            throw new SecurityException("Invalid token: " + e.getMessage());
        }
    }
}