// ProjectRequest.js
import React, { useState } from 'react';
import styled from 'styled-components';


const FormContainer = styled.div`
  max-width: 2200px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled.input`
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &::placeholder {
    color: #95a5a6;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  &::placeholder {
    color: #95a5a6;
  }
`;

const Select = styled.select`
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ProjectRequest = ({ onProjectSubmit, availableFreelancers }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [freelancerId, setFreelancerId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description || !estimatedTime || !freelancerId) {
            alert('Please fill all fields and select a freelancer');
            return;
        }
        
        setIsSubmitting(true);
        try {
            const newProject = { title, description, estimatedTime, freelancerId: parseInt(freelancerId) };
            await onProjectSubmit(newProject);
            setTitle('');
            setDescription('');
            setEstimatedTime('');
            setFreelancerId('');
        } catch (error) {
            console.error('Error submitting project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormContainer>
            <FormTitle>Post a New Job</FormTitle>
            <StyledForm onSubmit={handleSubmit}>
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Job Title"
                    required
                />
                <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Job Description"
                    required
                />
                <Input
                    type="text"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                    placeholder="Estimated Time (e.g., 5 days)"
                    required
                />
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    padding: '1rem'
                  }}
                >
                  {/* Text above the cards */}
                  <p
                    style={{
                      textAlign: 'center',
                      color: '#555555', // Gray color for the default text
                      fontWeight: 'bold',
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      fontSize: '1.5rem',
                      marginBottom: '1rem'
                    }}
                  >
                    Select Freelancer
                  </p>

                  {/* Cards container */}
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: '1.5rem',
                      maxHeight: '600px', // You can adjust this as needed
                      overflowY: 'auto', // Allows scrolling if there are more than 3 cards
                      boxSizing: 'border-box',
                      padding: '1rem'
                    }}
                  >
                    {availableFreelancers.map((freelancer) => {
                      const isSelected = freelancerId === freelancer.id;

                      return (
                        <div
                          key={freelancer.id}
                          onClick={() => setFreelancerId(freelancer.id)}
                          style={{
                            width: 'calc(33.333% - 1rem)', // Force 3 cards per row
                            minWidth: '280px',
                            border: isSelected ? '2px solid #3498db' : '1px solid #ccc',
                            borderRadius: '1rem',
                            padding: '1.5rem',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#eaf4ff' : '#ffffff',
                            boxShadow: isSelected
                              ? '0 8px 20px rgba(52, 152, 219, 0.35)'
                              : '0 2px 6px rgba(0,0,0,0.05)',
                            transition: 'all 0.4s ease',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            zIndex: isSelected ? 10 : 1,
                            boxSizing: 'border-box'
                          }}
                        >
                          <h3 style={{ fontSize: '1.2rem', color: '#2c3e50', marginBottom: '0.25rem' }}>
                            {freelancer.name}
                          </h3>
                          <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                            {freelancer.email}
                          </p>
                          <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            {freelancer.phone}
                          </p>
                          <div
                            style={{
                              marginTop: '1rem',
                              padding: '0.5rem 1rem',
                              background: isSelected ? '#3498db' : '#f0f9ff',
                              color: isSelected ? '#fff' : '#3498db',
                              borderRadius: '0.5rem',
                              fontSize: '0.85rem',
                              fontWeight: '500',
                              textAlign: 'center',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            {isSelected ? 'Selected' : 'Click to Select'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Text below the cards, conditional rendering */}
                  {freelancerId && (
                    <p
                      style={{
                        marginTop: '1.5rem',
                        fontWeight: 'bold',
                        color: '#2980b9', // Blue color when a freelancer is selected
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        fontSize: '1.1rem',
                        textAlign: 'center'
                      }}
                    >
                      Selected Freelancer ID: {freelancerId}
                    </p>
                  )}
                </div>

                                           
                              

                <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Job'}
                </SubmitButton>
            </StyledForm>
        </FormContainer>
    );
};

export default ProjectRequest;