package com.freelanceplatform.services;

import com.freelanceplatform.model.Job;
import com.freelanceplatform.model.User;
import com.freelanceplatform.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;

import java.util.List;

@Service
public class JobService {
	private static String jwtSecret;
    private static final String JWT_SECRET = "your-secret-key"; // Replace with your actual secret key

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserService userService;

    public Job postJob(Job job, String token) {
        Long clientId = extractUserIdFromToken(token);
        User client = userService.getUser(clientId);
        job.setClientId(client.getId());
        job.setStatus("PENDING");
        job.setPaid(false);
        // freelancerId is set from the request body if provided, no additional validation needed here
        return jobRepository.save(job);
    }
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job assignFreelancer(Long id, Long freelancerId, String token) {
        Long clientId = extractUserIdFromToken(token);
        User client = userService.getUser(clientId);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + id));
        if (!job.getClientId().equals(client.getId())) {
            throw new SecurityException("Unauthorized to assign freelancer");
        }
        job.setFreelancerId(freelancerId);
        return jobRepository.save(job);
    }

    public List<Job> getJobsByFreelancer(Long freelancerId, String token) {
        Long userId = extractUserIdFromToken(token);
        User freelancer = userService.getUser(userId);
        if (!freelancer.getId().equals(freelancerId)) {
            throw new SecurityException("Unauthorized access to freelancer jobs");
        }
        return jobRepository.findByFreelancerId(freelancerId);
    }

    public List<Job> getJobsByClient(String token) {
        Long clientId = extractUserIdFromToken(token);
        User client = userService.getUser(clientId);
        return jobRepository.findByClientId(client.getId());
    }

    public Job setPrice(Long jobId, int price, String token) {
        Long userId = extractUserIdFromToken(token);
        User freelancer = userService.getUser(userId);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));
        if (!job.getFreelancerId().equals(freelancer.getId())) {
            throw new SecurityException("Unauthorized to set price");
        }
        job.setPrice(price);
        return jobRepository.save(job);
    }

    public Job updatePaymentStatus(Long jobId, boolean paid, String token) {
        Long clientId = extractUserIdFromToken(token);
        User client = userService.getUser(clientId);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));
        if (!job.getClientId().equals(client.getId())) {
            throw new SecurityException("Unauthorized to update payment");
        }
        job.setPaid(paid);
        if (paid) job.setStatus("ACTIVE");
        return jobRepository.save(job);
    }

    private Long extractUserIdFromToken(String token) {
        String jwt = token.replace("Bearer ", "");
        Claims claims = Jwts.parser()
                .setSigningKey(JWT_SECRET)
                .parseClaimsJws(jwt)
                .getBody();
        return Long.parseLong(claims.getSubject());
    }
    public void deleteJob(Long jobId, String token) {
        Long clientId = extractUserIdFromToken(token);
        User client = userService.getUser(clientId);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));
        if (!job.getClientId().equals(client.getId())) {
            throw new SecurityException("Unauthorized to delete job");
        }
        jobRepository.delete(job);
    }

    public Job editJob(Long jobId, Job updatedJob, String token) {
        Long clientId = extractUserIdFromToken(token);
        User client = userService.getUser(clientId);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));
        if (!job.getClientId().equals(client.getId()) || job.isPaid()) {
            throw new SecurityException("Unauthorized or job already paid");
        }
        job.setTitle(updatedJob.getTitle());
        job.setDescription(updatedJob.getDescription());
        job.setEstimatedTime(updatedJob.getEstimatedTime());
        return jobRepository.save(job);
    }
    public Job completeJob(Long jobId, String token) {
    	Long userId = extractUserIdFromToken(token);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));
        User user = userService.getUser(userId);
        if (job.getFreelancerId() != null && job.getFreelancerId().equals(userId)) {
            job.setStatus("COMPLETED"); 
        } else if (job.getClientId().equals(userId) && job.getPrice() != null) {
            job.setStatus("COMPLETED");
        } else {
            throw new SecurityException("Unauthorized to accept job");
        }
        return jobRepository.save(job);
    }
    


    public Job acceptJob(Long jobId, String token) {
        Long userId = extractUserIdFromToken(token);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));
        User user = userService.getUser(userId);
        if (job.getFreelancerId() != null && job.getFreelancerId().equals(userId)) {
            job.setStatus("ACCEPTED"); // New status for freelancer acceptance
        } else if (job.getClientId().equals(userId) && job.getPrice() != null) {
            job.setStatus("ACCEPTED"); // Client accepts price
        } else {
            throw new SecurityException("Unauthorized to accept job");
        }
        return jobRepository.save(job);
    }

    public Job ignoreJob(Long jobId, String token) {
        Long userId = extractUserIdFromToken(token);
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found with ID: " + jobId));
        User user = userService.getUser(userId);
        if (job.getFreelancerId() != null && job.getFreelancerId().equals(userId)) {
            job.setFreelancerId(null); // Freelancer ignores, removes assignment
            job.setStatus("PENDING");
        } else if (job.getClientId().equals(userId) && !job.isPaid()) {
            job.setStatus("IGNORED"); // Client ignores, marks as ignored
        } else {
            throw new SecurityException("Unauthorized to ignore job");
        }
        return jobRepository.save(job);
    }
}