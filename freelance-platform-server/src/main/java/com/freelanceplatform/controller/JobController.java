package com.freelanceplatform.controller;

import com.freelanceplatform.model.Job;
import com.freelanceplatform.services.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {
    @Autowired
    private JobService jobService;

    @PostMapping
    public Job postJob(@RequestBody Job job, @RequestHeader("Authorization") String token) {
        // freelancerId is now part of the Job object in the request body
        return jobService.postJob(job, token);
    }

    @GetMapping
    public List<Job> getJobs() {
        return jobService.getAllJobs();
    }

    @PutMapping("/{id}/assign")
    public Job assignFreelancer(@PathVariable Long id, @RequestParam Long freelancerId, @RequestHeader("Authorization") String token) {
        return jobService.assignFreelancer(id, freelancerId, token);
    }

    @GetMapping("/freelancer/{freelancerId}")
    public ResponseEntity<List<Job>> getFreelancerJobs(@PathVariable Long freelancerId, @RequestHeader("Authorization") String token) {
        try {
            List<Job> jobs = jobService.getJobsByFreelancer(freelancerId, token);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    @GetMapping("/client")
    public ResponseEntity<List<Job>> getClientJobs(@RequestHeader("Authorization") String token) {
        try {
            List<Job> jobs = jobService.getJobsByClient(token);
            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    @PutMapping("/{jobId}/price")
    public ResponseEntity<Job> setJobPrice(@PathVariable Long jobId, @RequestBody Map<String, String> priceData, @RequestHeader("Authorization") String token) {
        try {
            Job job = jobService.setPrice(jobId, Integer.parseInt(priceData.get("price")), token);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    @PutMapping("/{jobId}/payment")
    public ResponseEntity<Job> updatePaymentStatus(@PathVariable Long jobId, @RequestBody Map<String, Boolean> paymentData, @RequestHeader("Authorization") String token) {
        try {
            Job job = jobService.updatePaymentStatus(jobId, paymentData.get("paid"), token);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(null);
        }
    }
    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long jobId, @RequestHeader("Authorization") String token) {
        try {
            jobService.deleteJob(jobId, token);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(403).build();
        }
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<Job> editJob(@PathVariable Long jobId, @RequestBody Job updatedJob, @RequestHeader("Authorization") String token) {
        try {
            Job job = jobService.editJob(jobId, updatedJob, token);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(null);
        }
    }
    @PutMapping("/{jobId}/complete")
    public ResponseEntity<Job> completeJob(@PathVariable Long jobId, @RequestHeader("Authorization") String token) {
        try {
            Job job = jobService.completeJob(jobId, token);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(null);
        }
    }


    @PutMapping("/{jobId}/accept")
    public ResponseEntity<Job> acceptJob(@PathVariable Long jobId, @RequestHeader("Authorization") String token) {
        try {
            Job job = jobService.acceptJob(jobId, token);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    @PutMapping("/{jobId}/ignore")
    public ResponseEntity<Job> ignoreJob(@PathVariable Long jobId, @RequestHeader("Authorization") String token) {
        try {
            Job job = jobService.ignoreJob(jobId, token);
            return ResponseEntity.ok(job);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(null);
        }
    }
}