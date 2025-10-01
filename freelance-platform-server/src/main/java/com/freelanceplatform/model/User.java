package com.freelanceplatform.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
  
    private String name;
 
    private String email;
  
    private String phone;

    private String password;
 
    private String role; // "FREELANCER" or "CLIENT"
    @Column(columnDefinition = "LONGTEXT")
    private String skills;

    
  
    @Column(columnDefinition = "LONGTEXT")
    private String resumeText;
  
    private boolean isActive;
   
    private double earnings;
}