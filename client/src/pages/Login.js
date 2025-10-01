// src/Login.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'onChange', // Validates on each keystroke
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await fetch('http://localhost:8081/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
            });

            const responseData = await response.json();
            console.log('Response Data:', responseData);

            if (response.ok) {
                const { user, token } = responseData;
                if (!user || !token) {
                    setError('Invalid response from server');
                    return;
                }

                if (user.role === 'FREELANCER') {
                    localStorage.setItem('freelancerToken', token);
                    localStorage.setItem('freelancerId', user.id);
                    localStorage.setItem('freelancerName', user.name); // for freelancer
                    navigate('/freelancer-dashboard');
                } else if (user.role === 'CLIENT') {
                    localStorage.setItem('clientToken', token);
                    localStorage.setItem('clientName', user.name);
                    navigate('/client-dashboard');
                } else {
                    setError('Invalid user role');
                }
            } else {
                setError(responseData?.message || 'Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            padding: '2rem 0'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '2rem',
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '15px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
                }}>
                    <h3 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                        color: '#2c3e50',
                        fontSize: '1.8rem',
                        justifyContent: 'center'
                    }}>
                        Login
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.5rem',
                                color: '#2c3e50',
                                fontWeight: 500
                            }}>
                                Email:
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                {...register('email', {
                                    required: 'Email is required',
                                    validate: {
                                        noUpperCase: (value) =>
                                            !/[A-Z]/.test(value) || 'Email must not contain uppercase letters',
                                        validFormat: (value) =>
                                            /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value) ||
                                            'Invalid email format',
                                    },
                                })}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                }}
                            />
                            {errors.email && (
                                <span
                                    style={{
                                        color: '#e53e3e',
                                        fontSize: '0.875rem',
                                        marginTop: '0.25rem',
                                        display: 'block',
                                    }}
                                >
                                    {errors.email.message}
                                </span>
                            )}
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.5rem',
                                color: '#2c3e50',
                                fontWeight: 500
                            }}>
                                Password:
                            </label>
                            <input
                                type="password"
                                placeholder='Enter your password'
                                {...register('password', { required: true })}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1rem',
                                    border: '2px solid #e0e0e0',
                                    borderRadius: '10px',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease'
                                }}
                            />
                            {errors.password && (
                                <span style={{
                                    color: '#e53e3e',
                                    fontSize: '0.875rem',
                                    marginTop: '0.25rem',
                                    display: 'block'
                                }}>
                                    Password is required
                                </span>
                            )}
                        </div>
                        {error && (
                            <div style={{
                                background: '#fff5f5',
                                color: '#e53e3e',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                border: '1px solid #feb2b2'
                            }}>
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                width: '100%',
                                padding: '1rem',
                                background: '#4a90e2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '1.1rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Log In
                        </button>
                    </form>
                    <p style={{
                        textAlign: 'center',
                        marginTop: '1.5rem',
                        color: '#2c3e50'
                    }}>
                        Don't have an account?{' '}
                        <a href="/signup" style={{ color: '#4a90e2', textDecoration: 'none' }}>
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
