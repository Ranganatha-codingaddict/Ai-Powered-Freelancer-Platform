package com.freelanceplatform.repository;

import com.freelanceplatform.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByFreelancerId(Long freelancerId); // Correct method name
	List<Job> findByClientId(Long clientId);
	
}