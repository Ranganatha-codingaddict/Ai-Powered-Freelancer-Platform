package com.freelanceplatform.services;

import com.freelanceplatform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {
    @Autowired
    private UserRepository userRepository;

    public long getUserCount() {
        return userRepository.count();
    }

    public String getPopularSkills() {
        // Simplified; in reality, aggregate skills from all users
        return "Java, Python, React";
    }
}