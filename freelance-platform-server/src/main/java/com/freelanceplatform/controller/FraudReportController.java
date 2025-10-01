package com.freelanceplatform.controller;

import com.freelanceplatform.model.FraudReport;
import com.freelanceplatform.services.FraudReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fraud")
public class FraudReportController {

    @Autowired
    private FraudReportService fraudReportService;

    @PostMapping("/report")
    public ResponseEntity<FraudReport> reportFraud(
            @RequestHeader("Authorization") String token,
            @RequestBody FraudReport fraudReport) {
        try {
            FraudReport savedReport = fraudReportService.reportFraud(fraudReport, token);
            return ResponseEntity.ok(savedReport);
        } catch (SecurityException e) {
            System.err.println("Unauthorized access in reportFraud: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (Exception e) {
            System.err.println("Error in reportFraud: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/reports")
    public ResponseEntity<List<FraudReport>> getAllFraudReports(
            @RequestHeader("Authorization") String token) {
        try {
            List<FraudReport> reports = fraudReportService.getAllFraudReports(token);
            // Return OK with null body if no reports exist
            return ResponseEntity.ok(reports); // reports can be null
        } catch (SecurityException e) {
            System.err.println("Unauthorized access to fraud reports: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        } catch (Exception e) {
            System.err.println("Error in getAllFraudReports: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}