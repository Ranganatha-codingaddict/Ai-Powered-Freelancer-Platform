package com.freelanceplatform.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "jobs")
@Data
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private Long clientId;
    private Long freelancerId; // This is the correct field name
    private String status;
    private double budget;
    private String estimatedTime;
    private String deadline;
    private Integer price;
    private boolean paid;
	
	
}