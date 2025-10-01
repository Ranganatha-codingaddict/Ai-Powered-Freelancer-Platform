package com.freelanceplatform.model;

import jakarta.persistence.*;

@Entity
@Table(name = "fraud_reports")
public class FraudReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reporter_id", nullable = false)
    private Long reporterId; // Who reported

    @Column(name = "reported_user_id", nullable = false)
    private Long reportedUserId; // Who is reported (freelancer or client)

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "status", nullable = false)
    private String status; // PENDING, REVIEWED, RESOLVED, etc.

    // Constructors
    public FraudReport() {}

    public FraudReport(Long reporterId, Long reportedUserId, String description, String status) {
        this.reporterId = reporterId;
        this.reportedUserId = reportedUserId;
        this.description = description;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getReporterId() { return reporterId; }
    public void setReporterId(Long reporterId) { this.reporterId = reporterId; }
    public Long getReportedUserId() { return reportedUserId; }
    public void setReportedUserId(Long reportedUserId) { this.reportedUserId = reportedUserId; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}