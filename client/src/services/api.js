import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const registerFreelancer = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/users/register/freelancer', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const registerClient = (user) => api.post('/users/register/client', user);

export const getQuiz = (userId) => api.get(`/users/quiz/${userId}`);

// Updated submitQuiz to send quiz and answers in the request body
export const submitQuiz = (userId, quiz, answers) => {
  return api.post(`/users/quiz/${userId}`, { quiz, answers }, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const getUser = (id) => api.get(`/users/${id}`);

export const postJob = (job) => api.post('/jobs', job);

export const getJobs = () => api.get('/jobs');

export const assignFreelancer = (jobId, freelancerId) => api.put(`/jobs/${jobId}/assign`, null, { params: { freelancerId } });

export const getChatbotResponse = (query) => api.post('/chatbot', query);

export const createCharge = (amount, currency, source) => api.post('/payments/charge', null, { params: { amount, currency, source } });

export const getUserCount = () => api.get('/admin/user-count');

export const getPopularSkills = () => api.get('/admin/popular-skills');

export const assignLearningPath = (userId, title, description) => api.post('/learning-paths', null, { params: { userId, title, description } });

export const completeLearningPath = (id) => api.put(`/learning-paths/${id}/complete`);

// Fixed function to match the backend endpoint
export const updateFreelancerDetails = (userId, freelancerData) => {
  return api.post(`/users/freelancers/${userId}`, freelancerData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};