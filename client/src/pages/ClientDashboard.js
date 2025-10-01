import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaBriefcase, FaDollarSign, FaCheckCircle, FaSpinner, FaPlus, FaExclamationTriangle, FaClock, FaUserTie, FaTrash, FaUsers, FaPlay, FaBook, FaHandshake, FaChartLine } from 'react-icons/fa';
import ProjectRequest from './ProjectRequest';
import RazorpayPayment from './RazorpayPayment';

const ClientDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({ totalSpent: 0, activeProjects: 0, totalFreelancers: 0, completedProjects: 0 });
    const [activities, setActivities] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [freelancerResponse, setFreelancerResponse] = useState(null);
    const [availableFreelancers, setAvailableFreelancers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('clientToken');
        if (!token) {
            setError('Please log in to view your dashboard');
            return;
        }

        const fetchData = async () => {
            try {
                const jobsResponse = await axios.get('http://localhost:8081/api/jobs/client', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProjects(jobsResponse.data);

                const freelancersResponse = await axios.get('http://localhost:8081/api/users/freelancers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAvailableFreelancers(freelancersResponse.data);

                const totalSpent = jobsResponse.data
                    .filter(job => job.paid)
                    .reduce((sum, job) => sum + (job.price || 0), 0);
                const activeProjects = jobsResponse.data.filter(job => job.status === 'ACTIVE').length;
                const completedProjects = jobsResponse.data.filter(job => job.status === 'COMPLETED').length;
                setStats({
                    totalSpent,
                    activeProjects,
                    totalFreelancers: freelancersResponse.data.length,
                    completedProjects
                });

                const pricedJob = jobsResponse.data.find(job => job.status === 'PENDING' && job.price && !job.paid);
                if (pricedJob && (!freelancerResponse || freelancerResponse.projectId !== pricedJob.id)) {
                    setFreelancerResponse({ projectId: pricedJob.id, price: pricedJob.price });
                }
            } catch (err) {
                setError(`Error fetching data: ${err.response?.data?.error || err.message}`);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleProjectSubmit = async (newProject) => {
        const token = localStorage.getItem('clientToken');
        try {
            const response = await axios.post('http://localhost:8081/api/jobs', newProject, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects([...projects, response.data]);
            setShowProjectForm(false);
            setActivities(prev => [{
                id: Date.now(),
                title: 'Job Request Sent',
                description: newProject.title,
                time: 'Just now',
                icon: <FaCheckCircle />
            }, ...prev]);
            setError(null);
        } catch (err) {
            setError(`Error creating job: ${err.response?.data?.error || err.message}`);
        }
    };

    const handlePaymentSuccess = async (jobId) => {
        const token = localStorage.getItem('clientToken');
        try {
            await axios.put(`http://localhost:8081/api/jobs/${jobId}/payment`, { paid: true }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(prev => prev.map(job => 
                job.id === jobId ? { ...job, status: 'ACTIVE', paid: true } : job
            ));
            setFreelancerResponse(null);
            setActivities(prev => [{
                id: Date.now(),
                title: 'Payment Successful',
                description: projects.find(job => job.id === jobId)?.title,
                time: 'Just now',
                icon: <FaDollarSign />
            }, ...prev]);
            setError(null);
        } catch (err) {
            setError(`Error processing payment: ${err.response?.data?.error || err.message}`);
        }
    };

    const lessons = [
        {
            title: "How to Hire the Right Freelancer",
            description: "Learn the essential steps to identify and hire the perfect freelancer for your project.",
            icon: <FaUsers />,
            videoId: "WbY9X5t5WnA",
            category: "Hiring"
        },
        {
            title: "Effective Communication with Freelancers",
            description: "Master the art of clear communication to ensure project success and avoid misunderstandings.",
            icon: <FaHandshake />,
            videoId: "QGHBq5OEsBM",
            category: "Communication"
        },
        {
            title: "Setting Clear Project Expectations",
            description: "Learn how to define project scope, timelines, and deliverables effectively.",
            icon: <FaBook />,
            videoId: "ceyT8hogqmo",
            category: "Project Management"
        },
        {
            title: "Managing Freelancer Performance",
            description: "Best practices for monitoring progress and providing constructive feedback.",
            icon: <FaChartLine />,
            videoId: "j28YMEY5piI",
            category: "Management"
        },
        {
            title: "Building Long-term Freelancer Relationships",
            description: "Tips for maintaining successful partnerships with freelancers.",
            icon: <FaHandshake />,
            videoId: "eybpFo4KgKY",
            category: "Relationships"
        }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            padding: '2rem',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '3rem',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    color: 'white'
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            marginBottom: '0.5rem',
                            letterSpacing: '-0.025em'
                        }}>
                            {`Welcome back, ${localStorage.getItem('clientName') || 'Client'}`}
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            opacity: '0.9'
                        }}>
                            Monitor your jobs and freelancer activities
                        </p>
                    </div>
                    <button
                        onClick={() => setShowProjectForm(true)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            ':hover': {
                                background: 'rgba(255, 255, 255, 0.3)',
                                transform: 'translateY(-2px)'
                            }
                        }}
                    >
                        <FaPlus /> Post New Job
                    </button>
                </div>

                {error && (
                    <div style={{
                        color: '#ef4444',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        padding: '1rem',
                        backgroundColor: '#fee2e2',
                        borderRadius: '0.75rem',
                        border: '1px solid #fecaca',
                        boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        ':hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                color: '#064e3b'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>₹</span>
                            </div>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Total Spent</h3>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>₹{stats.totalSpent}</div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Total payments made</div>
                    </div>

                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        ':hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                color: '#0f766e'
                            }}>
                                <FaBriefcase style={{ fontSize: '1.5rem' }} />
                            </div>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Active Jobs</h3>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>{stats.activeProjects}</div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Currently in progress</div>
                    </div>

                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        ':hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #ffd1ff 0%, #fad0c4 100%)',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                color: '#9d174d'
                            }}>
                                <FaCheckCircle style={{ fontSize: '1.5rem' }} />
                            </div>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Completed Jobs</h3>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>{stats.completedProjects}</div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Successfully finished</div>
                    </div>

                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        ':hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                color: '#166534'
                            }}>
                                <FaUsers style={{ fontSize: '1.5rem' }} />
                            </div>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Available Freelancers</h3>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>{stats.totalFreelancers}</div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Ready to work</div>
                    </div>
                </div>

                {showProjectForm && (
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        marginBottom: '2rem'
                    }}>
                        <ProjectRequest onProjectSubmit={handleProjectSubmit} availableFreelancers={availableFreelancers} />
                    </div>
                )}

                {freelancerResponse && (
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                                padding: '0.75rem',
                                borderRadius: '0.75rem',
                                color: '#92400e'
                            }}>
                                <FaClock style={{ fontSize: '1.5rem' }} />
                            </div>
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Payment Required</h3>
                        </div>
                        <p style={{ margin: '0 0 1rem 0', color: '#64748b' }}>Freelancer has set a price for Job ID: {freelancerResponse.projectId}</p>
                        <p style={{ margin: '0 0 1rem 0', color: '#1e293b', fontWeight: '600' }}>Amount: ${freelancerResponse.price}</p>
                        <RazorpayPayment
                            amount={freelancerResponse.price}
                            projectId={freelancerResponse.projectId}
                            onSuccess={handlePaymentSuccess}
                        />
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {projects.map(job => (
                        <div key={job.id} style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                            ':hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                            }
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem'
                            }}>
                                <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>{job.title}</h3>
                                <span style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '50px',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    textTransform: 'capitalize',
                                    ...(job.status === 'ACTIVE' && {
                                        background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
                                        color: '#064e3b'
                                    }),
                                    ...(job.status === 'COMPLETED' && {
                                        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                                        color: '#0f766e'
                                    }),
                                    ...(job.status === 'PENDING' && {
                                        background: 'linear-gradient(135deg, #ffd1ff 0%, #fad0c4 100%)',
                                        color: '#9d174d'
                                    })
                                }}>
                                    {job.status}
                                </span>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <span style={{ color: '#64748b', fontWeight: '500' }}>Freelancer:</span>
                                    <span style={{ color: '#1e293b', marginLeft: '0.5rem' }}>
                                        {availableFreelancers.find(f => f.id === job.freelancerId)?.name || 'Not assigned'}
                                    </span>
                                </div>
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <span style={{ color: '#64748b', fontWeight: '500' }}>Description:</span>
                                    <p style={{ color: '#1e293b', margin: '0.5rem 0 0 0' }}>{job.description}</p>
                                </div>
                                <div style={{ marginBottom: '0.75rem' }}>
                                    <span style={{ color: '#64748b', fontWeight: '500' }}>Estimated Time:</span>
                                    <span style={{ color: '#1e293b', marginLeft: '0.5rem' }}>
                                        {job.estimatedTime || 'Not specified'}
                                    </span>
                                </div>
                                {job.price && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                        <span style={{ color: '#64748b', fontWeight: '500' }}>Price:</span>
                                        <span style={{ color: '#1e293b', marginLeft: '0.5rem', fontWeight: '600' }}>
                                            ${job.price}
                                        </span>
                                    </div>
                                )}
                                {job.paid && (
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: '#059669',
                                        fontWeight: '500'
                                    }}>
                                        <FaCheckCircle /> Payment Completed
                                    </div>
                                )}
                            </div>
                            {!job.paid && (
                                <div style={{
                                    display: 'flex',
                                    gap: '0.75rem',
                                    flexWrap: 'wrap'
                                }}>
                                    <button
                                        onClick={async () => {
                                            const token = localStorage.getItem('clientToken');
                                            await axios.delete(`http://localhost:8081/api/jobs/${job.id}`, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            setProjects(prev => prev.filter(j => j.id !== job.id));
                                        }}
                                        style={{
                                            background: '#fee2e2',
                                            color: '#dc2626',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '0.5rem',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            transition: 'all 0.2s ease',
                                            ':hover': {
                                                background: '#fecaca'
                                            }
                                        }}
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                    
                                    {job.freelancerId && (
                                        <button
                                            onClick={async () => {
                                                const description = prompt("Describe why this freelancer is fraudulent:");
                                                if (description) {
                                                    const token = localStorage.getItem('clientToken');
                                                    await axios.post(`http://localhost:8081/api/fraud/report`, {
                                                        reportedUserId: job.freelancerId,
                                                        description
                                                    }, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    setActivities(prev => [{
                                                        id: Date.now(),
                                                        title: 'Fraud Reported',
                                                        description: `Reported freelancer for: ${job.title}`,
                                                        time: 'Just now',
                                                        icon: <FaUserTie />
                                                    }, ...prev]);
                                                }
                                            }}
                                            style={{
                                                background: '#fff7ed',
                                                color: '#ea580c',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '0.5rem',
                                                border: 'none',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                transition: 'all 0.2s ease',
                                                ':hover': {
                                                    background: '#ffedd5'
                                                }
                                            }}
                                        >
                                            <FaExclamationTriangle /> Report Fraud
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* New Client Lessons Section */}
                <div style={{
                    background: 'white',
                    padding: '2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '3rem'
                    }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            color: '#1e293b',
                            marginBottom: '1rem',
                            fontWeight: '700'
                        }}>
                            Client Learning Center
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#64748b',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Master the art of working with freelancers through our comprehensive video lessons
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginBottom: '3rem'
                    }}>
                        {lessons.map((lesson, index) => (
                            <div key={index} style={{
                                background: '#ffffff',
                                borderRadius: '1rem',
                                overflow: 'hidden',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                ':hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                                }
                            }}>
                                <div style={{
                                    position: 'relative',
                                    paddingTop: '56.25%',
                                    backgroundColor: '#f1f5f9'
                                }}>
                                    <iframe
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            border: 'none'
                                        }}
                                        src={`https://www.youtube.com/embed/${lesson.videoId}`}
                                        title={lesson.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                                <div style={{
                                    padding: '1.5rem'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <div style={{
                                            color: '#2563EB',
                                            fontSize: '1.25rem'
                                        }}>
                                            {lesson.icon}
                                        </div>
                                        <span style={{
                                            color: '#64748b',
                                            fontSize: '0.875rem',
                                            fontWeight: '500'
                                        }}>
                                            {lesson.category}
                                        </span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.25rem',
                                        color: '#1e293b',
                                        marginBottom: '0.75rem',
                                        fontWeight: '600'
                                    }}>
                                        {lesson.title}
                                    </h3>
                                    <p style={{
                                        color: '#64748b',
                                        fontSize: '0.875rem',
                                        lineHeight: '1.5'
                                    }}>
                                        {lesson.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        background: '#ffffff',
                        borderRadius: '1rem',
                        padding: '2rem',
                        textAlign: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            color: '#1e293b',
                            marginBottom: '1rem',
                            fontWeight: '600'
                        }}>
                            Ready to Start Working with Freelancers?
                        </h2>
                        <p style={{
                            color: '#64748b',
                            marginBottom: '1.5rem',
                            maxWidth: '600px',
                            margin: '0 auto 1.5rem'
                        }}>
                            Watch these lessons to learn everything you need to know about hiring and working with freelancers effectively.
                        </p>
                        <button style={{
                            background: '#2563EB',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s ease',
                            ':hover': {
                                background: '#1d4ed8',
                                transform: 'translateY(-1px)'
                            }
                        }}>
                            <FaPlay /> Start Learning
                        </button>
                    </div>
                </div>

                <div style={{
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1e293b' }}>Recent Activity</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {activities.map(activity => (
                            <div key={activity.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1rem',
                                background: '#f8fafc',
                                borderRadius: '0.75rem',
                                transition: 'transform 0.2s ease',
                                ':hover': {
                                    transform: 'translateX(4px)'
                                }
                            }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    color: 'white',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    marginRight: '1rem'
                                }}>
                                    {activity.icon}
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b' }}>{activity.title}</h4>
                                    <p style={{ margin: '0 0 0.25rem 0', color: '#64748b' }}>{activity.description}</p>
                                    <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;