package com.freelanceplatform.ai.controller;

import com.freelanceplatform.ai.service.ResumeScoringService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeScoringService resumeScoringService;

    public ResumeController(ResumeScoringService resumeScoringService) {
        this.resumeScoringService = resumeScoringService;
    }

    @PostMapping("/score")
    public ResponseEntity<Map<String, Object>> uploadResume(@RequestParam("file") MultipartFile file) {
        try {
            Map<String, Object> response = resumeScoringService.getResumeScore(file);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to process resume"));
        }
    }
}
