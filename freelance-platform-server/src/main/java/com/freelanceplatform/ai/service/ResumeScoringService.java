package com.freelanceplatform.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@Service
public class ResumeScoringService {

    @Value("${flask.api.url}")
    private String flaskApiUrl;  // Set this in application.properties (Step 3)

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getResumeScore(MultipartFile resumeFile) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        // Convert file to InputStreamResource
        ByteArrayResource fileAsResource = new ByteArrayResource(resumeFile.getBytes()) {
            @Override
            public String getFilename() {
                return resumeFile.getOriginalFilename();
            }
        };

        HttpEntity<ByteArrayResource> requestEntity = new HttpEntity<>(fileAsResource, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
            flaskApiUrl + "/process",
            HttpMethod.POST,
            requestEntity,
            Map.class
        );

        return response.getBody();
    }
}
