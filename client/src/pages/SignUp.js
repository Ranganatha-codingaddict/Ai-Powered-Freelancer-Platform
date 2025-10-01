import React, { useState } from 'react';
import { registerFreelancer, registerClient, getQuiz, submitQuiz, updateFreelancerDetails } from '../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaUser, FaFileAlt, FaGraduationCap, FaEnvelope, FaLock, FaPhone, FaCheckCircle, FaUserShield } from 'react-icons/fa';


const SignUp = () => {
    const [role, setRole] = useState('FREELANCER');
    const [file, setFile] = useState(null);
    const [clientData, setClientData] = useState({ id: '', name: '', email: '', phone: '', password: '' });
    const [freelancerData, setFreelancerData] = useState({ name: '', email: '', password: '' });
    const [adminData, setAdminData] = useState({ email: '', password: '' });
    const [userId, setUserId] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [error, setError] = useState(null);
    const [quizPassed, setQuizPassed] = useState(false);
    const navigate = useNavigate();
    

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type !== 'application/pdf') {
            setError('Please upload a valid PDF file');
            setFile(null);
        } else {
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleFreelancerSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please upload your resume as a PDF file');
            return;
        }
        try {
            const response = await registerFreelancer(file);
            setUserId(response.data.id);
            const quizData = await getQuiz(response.data.id);
            let rawQuizData = quizData.data;
            let cleanJson = typeof rawQuizData === 'string' ? rawQuizData : JSON.stringify(rawQuizData);
            if (cleanJson.startsWith("```json")) {
                cleanJson = cleanJson.replace("```json", "").replace("```", "").trim();
                const lastBrace = cleanJson.lastIndexOf("}");
                if (lastBrace > 0) cleanJson = cleanJson.substring(0, lastBrace + 1);
            }
            let parsedQuiz = JSON.parse(cleanJson);
            if (!parsedQuiz.questions || !Array.isArray(parsedQuiz.questions) || parsedQuiz.questions.length !== 5) {
                throw new Error('Invalid quiz format: Expected 5 questions');
            }
            setQuiz(parsedQuiz);
            setAnswers({});
            setError(null);
        } catch (err) {
            setError(`Error registering freelancer: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleOptionChange = (questionIndex, optionIndex) => {
        setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    };

    const handleQuizSubmit = async (e) => {
        e.preventDefault();
        if (!userId || !quiz || Object.keys(answers).length !== quiz.questions.length) {
            setError('Please answer all questions before submitting');
            return;
        }
        try {
            const answerArray = quiz.questions.map((_, index) => answers[index] || -1);
            const answerString = answerArray.join(',');
            const response = await submitQuiz(userId, JSON.stringify(quiz), answerString);
            const result = response.data;
            if (result.passed) {
                setQuizPassed(true);
                setFreelancerData((prev) => ({
                    ...prev,
                    name: result.name || prev.name,
                    email: result.email || prev.email,
                }));
            } else {
                setError('Quiz Failed. Try Again.');
            }
        } catch (err) {
            setError(`Error submitting quiz: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleFreelancerFinalSubmit = async (e) => {
        e.preventDefault();
        if (!freelancerData.name || !freelancerData.email || !freelancerData.password) {
            setError('Name, email, and password are required');
            return;
        }
        try {
            await updateFreelancerDetails(userId, freelancerData);
            alert('Freelancer Registration Successful!');
            navigate('/freelancer-dashboard');
        } catch (err) {
            setError(`Error completing Freelancer registration: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleClientSubmit = async (e) => {
        e.preventDefault();
        if (!clientData.name || !clientData.email || !clientData.password) {
            setError('Name, email, and password are required');
           
            return;
        }
        try {
            await axios.post('http://localhost:8081/api/users/register/client', clientData, {
                headers: { 'Content-Type': 'application/json' },
            });
            localStorage.setItem('clientName', clientData.name);
            alert('Client Registration Successful!');
            navigate('/client-dashboard');
        } catch (err) {
            setError(`Error registering client: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        if (!adminData.email || !adminData.password) {
            setError('Email and password are required');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8081/api/admin/login/admin', adminData, {
                headers: { 'Content-Type': 'application/json' },
            });
            alert('Admin Login Successful!');
            localStorage.setItem('adminToken', response.data.token);
            navigate('/admin-dashboard');
        } catch (err) {
            setError(`Error logging in as admin: ${err.response?.data?.message || err.message}`);
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
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Choose Your Role</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                        <button
                            onClick={() => setRole('FREELANCER')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '1.5rem 2rem',
                                border: role === 'FREELANCER' ? '2px solid #4a90e2' : '2px solid #e0e0e0',
                                borderRadius: '15px',
                                background: role === 'FREELANCER' ? '#f8f9ff' : 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '200px',
                                transform: role === 'FREELANCER' ? 'translateY(-5px)' : 'none',
                                boxShadow: role === 'FREELANCER' ? '0 5px 15px rgba(74, 144, 226, 0.2)' : 'none'
                            }}
                        >
                            <FaUserTie style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#4a90e2' }} />
                            <span>Freelancer</span>
                        </button>
                        <button
                            onClick={() => setRole('CLIENT')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '1.5rem 2rem',
                                border: role === 'CLIENT' ? '2px solid #4a90e2' : '2px solid #e0e0e0',
                                borderRadius: '15px',
                                background: role === 'CLIENT' ? '#f8f9ff' : 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '200px',
                                transform: role === 'CLIENT' ? 'translateY(-5px)' : 'none',
                                boxShadow: role === 'CLIENT' ? '0 5px 15px rgba(74, 144, 226, 0.2)' : 'none'
                            }}
                        >
                            <FaUser style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#4a90e2' }} />
                            <span>Client</span>
                        </button>
                        <button
                            onClick={() => setRole('ADMIN')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '1.5rem 2rem',
                                border: role === 'ADMIN' ? '2px solid #4a90e2' : '2px solid #e0e0e0',
                                borderRadius: '15px',
                                background: role === 'ADMIN' ? '#f8f9ff' : 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '200px',
                                transform: role === 'ADMIN' ? 'translateY(-5px)' : 'none',
                                boxShadow: role === 'ADMIN' ? '0 5px 15px rgba(74, 144, 226, 0.2)' : 'none'
                            }}
                        >
                            <FaUserShield style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#4a90e2' }} />
                            <span>Admin</span>
                        </button>
                    </div>
                </div>

                {role === 'FREELANCER' ? (
                    !quiz ? (
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#2c3e50', fontSize: '1.8rem' }}>
                                <FaFileAlt style={{ color: '#4a90e2', fontSize: '2rem' }} /> Upload Your Resume
                            </h3>
                            <form onSubmit={handleFreelancerSubmit} style={{}}>
                                <div style={{ position: 'relative', marginBottom: '2rem' }}>
                                    <input
                                        type="file"
                                        id="resume"
                                        accept="application/pdf"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <label
                                        htmlFor="resume"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '1rem',
                                            padding: '1.5rem',
                                            border: '2px dashed #4a90e2',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <FaFileAlt style={{ fontSize: '2rem', color: '#4a90e2' }} />
                                        <span>Choose PDF File</span>
                                    </label>
                                    {file && (
                                    <p style={{
                                        marginTop: '0.8rem',
                                        textAlign: 'center',
                                        color: '#333',
                                        fontWeight: 500
                                    }}>
                                         📄 <strong>{file.name}</strong>
                                    </p>
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
                                    <FaCheckCircle style={{ fontSize: '1.2rem' }} /> Submit Resume
                                </button>
                            </form>
                        </div>
                    ) : !quizPassed ? (
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#2c3e50', fontSize: '1.8rem' }}>
                                <FaGraduationCap style={{ color: '#4a90e2', fontSize: '2rem' }} /> Technical Quiz
                            </h3>
                            <form onSubmit={handleQuizSubmit}>
                                {quiz.questions.map((q, qIndex) => (
                                    <div key={qIndex} style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9ff', borderRadius: '10px' }}>
                                        <h4 style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem', color: '#2c3e50' }}>
                                            <span style={{
                                                background: '#4a90e2',
                                                color: 'white',
                                                width: '30px',
                                                height: '30px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold'
                                            }}>
                                                {qIndex + 1}
                                            </span>
                                            {q.question}
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {q.options.map((option, oIndex) => (
                                                <label key={oIndex} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '1rem',
                                                    padding: '1rem',
                                                    border: '2px solid #e0e0e0',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.3s ease'
                                                }}>
                                                    <input
                                                        type="radio"
                                                        name={`question-${qIndex}`}
                                                        value={oIndex}
                                                        checked={answers[qIndex] === oIndex}
                                                        onChange={() => handleOptionChange(qIndex, oIndex)}
                                                        style={{ width: '20px', height: '20px' }}
                                                    />
                                                    <span>{String.fromCharCode(65 + oIndex)}) {option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
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
                                    <FaCheckCircle style={{ fontSize: '1.2rem' }} /> Submit Quiz
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#2c3e50', fontSize: '1.8rem' }}>
                                <FaUserTie style={{ color: '#4a90e2', fontSize: '2rem' }} /> Complete Your Profile
                            </h3>
                            <form onSubmit={handleFreelancerFinalSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 500 }}>
                                        <FaUser style={{ color: '#4a90e2' }} /> Name
                                    </label>
                                    <input
                                        type="text"
                                        value={freelancerData.name}
                                        onChange={(e) => setFreelancerData({ ...freelancerData, name: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem 1rem',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 500 }}>
                                        <FaEnvelope style={{ color: '#4a90e2' }} /> Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder='Enter your email'
                                        value={freelancerData.email}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFreelancerData({ ...freelancerData, email: value });

                                            // Show error ONLY if it contains uppercase letters
                                            if (/[A-Z]/.test(value)) {
                                            setError('Email must not contain uppercase letters');
                                            } 
                                            else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value)) {
                                                setError('Enter a valid email address');
                                            }
                                            else {
                                            setError(null);
                                            }
                                        }}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem 1rem',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 500 }}>
                                        <FaLock style={{ color: '#4a90e2' }} /> Password
                                    </label>
                                    <input
                                        type="password"
                                        value={freelancerData.password}
                                        onChange={(e) => setFreelancerData({ ...freelancerData, password: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.8rem 1rem',
                                            border: '2px solid #e0e0e0',
                                            borderRadius: '10px',
                                            fontSize: '1rem',
                                            transition: 'all 0.3s ease'
                                        }}
                                    />
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
                                    <FaCheckCircle style={{ fontSize: '1.2rem' }} /> Complete Registration
                                </button>
                            </form>
                        </div>
                    )
                ) : role === 'CLIENT' ? (
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#2c3e50', fontSize: '1.8rem' }}>
                            <FaUser style={{ color: '#4a90e2', fontSize: '2rem' }} /> Client Registration
                        </h3>
                        <form onSubmit={handleClientSubmit} autoComplete='off'>
                            <input type="text" name="fake-user" style={{ display: 'none' }} />
                            <input type="password" name="fake-pass" style={{ display: 'none' }} />
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 500 }}>
                                    <FaUser style={{ color: '#4a90e2' }} /> Name
                                </label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Enter your name"
                                    
                                    value={clientData.name}
                                    onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                                    
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                    
                                    
                                />
                                
                                
                                
                                
                            </div>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 500 }}>
                                    <FaEnvelope style={{ color: '#4a90e2' }} /> Email
                                </label>
                                <input
                                    type="email"
                                    autoComplete="off"
                                    placeholder='Enter your email'
                                    value={clientData.email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setClientData({ ...clientData, email: value });

                                        // Show error ONLY if it contains uppercase letters
                                        if (/[A-Z]/.test(value)) {
                                            setError('Email must not contain uppercase letters');
                                        } 
                                        else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value)) {
                                            setError('Enter a valid email address');
                                        }
                                        else {
                                            setError(null);
                                        }
                                    }}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                                {error && (
                                    <span style={{ color: 'red', fontSize: '0.9rem' }}>{error}</span>
                                )}
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 500 }}>
                                    <FaPhone style={{ color: '#4a90e2' }} /> Phone
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your phone number"
                                    value={clientData.phone}
                                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 500 }}>
                                    <FaLock style={{ color: '#4a90e2' }} /> Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Create a password"
                                    value={clientData.password}
                                    onChange={(e) => setClientData({ ...clientData, password: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
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
                                <FaCheckCircle style={{ fontSize: '1.2rem' }} /> Register as Client
                            </button>
                        </form>
                    </div>
                ) : (
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', color: '#2c3e50', fontSize: '1.8rem' }}>
                            <FaUserShield style={{ color: '#4a90e2', fontSize: '2rem' }} /> Admin Login
                        </h3>
                        <form onSubmit={handleAdminLogin}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 500 }}>
                                    <FaEnvelope style={{ color: '#4a90e2' }} /> Email
                                </label>
                                <input
                                    type="email"
                                    placeholder='Enter your email'
                                    value={adminData.email}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setAdminData({ ...adminData, email: value });

                                        // Show error ONLY if it contains uppercase letters
                                        if (/[A-Z]/.test(value)) {
                                        setError('Email must not contain uppercase letters');
                                        } 
                                        else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(value)) {
                                            setError('Enter a valid email address');
                                        }
                                        else {
                                        setError(null);
                                        }
                                    }}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: 500 }}>
                                    <FaLock style={{ color: '#4a90e2' }} /> Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Enter admin password"
                                    value={adminData.password}
                                    onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem 1rem',
                                        border: '2px solid #e0e0e0',
                                        borderRadius: '10px',
                                        fontSize: '1rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
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
                                <FaCheckCircle style={{ fontSize: '1.2rem' }} /> Login as Admin
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignUp;