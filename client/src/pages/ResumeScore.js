import React, { useState } from "react";

const ResumeScore = () => {
    const [file, setFile] = useState(null);
    const [jobRole, setJobRole] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [score, setScore] = useState(null);
    const [similarity, setSimilarity] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file || !jobRole || !jobDescription) {
            alert("Please fill all fields and upload a resume!");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("pdf_doc", file);
        formData.append("job_role", jobRole);
        formData.append("job_description", jobDescription);

        try {
            const response = await fetch("http://localhost:8000/process", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            setScore(data.resume_score);
            setSimilarity(data.similarity_score);
            setSkills(data.skill_suggestions || []);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing your resume.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#ffffff',
            padding: '120px 20px 60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: "'Poppins', sans-serif",
            color: '#333'
        }}>
            <div style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '30px',
                width: '100%',
                maxWidth: '800px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
            }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    marginBottom: '30px',
                    textAlign: 'center',
                    color: '#2c3e50',
                }}>
                    Resume Score Analyzer
                </h2>
                
                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '1.1rem',
                        marginBottom: '10px',
                        color: '#2c3e50',
                        fontWeight: '500'
                    }}>
                        Upload Resume
                    </label>
                    <div style={{
                        width: '100%',
                        padding: '15px',
                        borderRadius: '10px',
                        border: '2px dashed #e0e0e0',
                        background: '#f8f9fa',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease'
                    }}>
                        <i className="fas fa-file-upload" style={{ fontSize: '20px', color: '#3498db' }}></i>
                        <input 
                            type="file" 
                            accept=".pdf,.docx" 
                            onChange={handleUpload}
                            style={{ display: 'none' }}
                            id="fileInput"
                        />
                        <label htmlFor="fileInput" style={{ cursor: 'pointer', color: '#666' }}>
                            {file ? file.name : 'Choose a file'}
                        </label>
                    </div>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '1.1rem',
                        marginBottom: '10px',
                        color: '#2c3e50',
                        fontWeight: '500'
                    }}>
                        Job Role
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Job Role"
                        value={jobRole}
                        onChange={(e) => setJobRole(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            border: '1px solid #e0e0e0',
                            background: '#ffffff',
                            color: '#333',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '1.1rem',
                        marginBottom: '10px',
                        color: '#2c3e50',
                        fontWeight: '500'
                    }}>
                        Job Description
                    </label>
                    <textarea
                        placeholder="Paste Job Description Here"
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            borderRadius: '10px',
                            border: '1px solid #e0e0e0',
                            background: '#ffffff',
                            color: '#333',
                            fontSize: '1rem',
                            minHeight: '150px',
                            resize: 'vertical',
                            transition: 'all 0.3s ease'
                        }}
                    />
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        padding: '15px 40px',
                        fontSize: '1.2rem',
                        color: '#ffffff',
                        background: loading ? '#bdc3c7' : 'linear-gradient(45deg, #3498db, #2980b9)',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        width: '100%',
                        fontWeight: '600',
                        letterSpacing: '1px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <i className="fas fa-spinner fa-spin" style={{ marginRight: '10px' }}></i>
                            Analyzing...
                        </span>
                    ) : (
                        'Analyze Resume'
                    )}
                </button>
            </div>

            {score !== null && (
                <div style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    padding: '30px',
                    width: '100%',
                    maxWidth: '800px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    marginTop: '30px',
                    animation: 'fadeIn 0.5s ease'
                }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#3498db',
                        textAlign: 'center',
                        marginBottom: '20px',
                    }}>
                        <div>Resume Score: {score}%</div>
                        <div>JD Similarity: {similarity}%</div>
                    </div>

                    {skills.length > 0 ? (
                        <div>
                            <h3 style={{ 
                                fontSize: '1.5rem', 
                                marginBottom: '20px',
                                color: '#2c3e50',
                                textAlign: 'center'
                            }}>
                                <i className="fas fa-tools" style={{ marginRight: '10px', color: '#3498db' }}></i>
                                Suggested Vocabulary for Improvement
                            </h3>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '15px',
                            }}>
                                {skills.map((skill, index) => (
                                    <li key={index} style={{
                                        background: '#f8f9fa',
                                        padding: '15px',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #e0e0e0',
                                    }}>
                                        <i className="fas fa-check-circle" style={{ color: '#3498db' }}></i>
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <h3 style={{ 
                            fontSize: '1.5rem', 
                            color: '#2ecc71',
                            textAlign: 'center'
                        }}>
                            <i className="fas fa-check-circle" style={{ marginRight: '10px' }}></i>
                            No missing skills found
                        </h3>
                    )}
                </div>
            )}

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    input::placeholder, textarea::placeholder {
                        color: #999;
                    }

                    input:focus, textarea:focus {
                        outline: none;
                        border-color: #3498db;
                        box-shadow: 0 0 10px rgba(52, 152, 219, 0.2);
                    }

                    @media (max-width: 768px) {
                        .container {
                            padding: 80px 15px 30px;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default ResumeScore;
