import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUser, FaBriefcase, FaDollarSign, FaCheckCircle, 
  FaSpinner, FaPlus, FaExclamationTriangle, FaClock, 
  FaUserTie, FaTrash, FaPlay, FaBook, FaHandshake, 
  FaChartLine, FaLaptopCode, FaComments
} from 'react-icons/fa';

const FreelancerDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const freelancerId = location.state?.freelancerId || localStorage.getItem('freelancerId');
    
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({ 
      earnings: 0, 
      activeProjects: 0, 
      completedProjects: 0 
    });
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPriceForm, setShowPriceForm] = useState(null);
    const [price, setPrice] = useState('');
    const [error, setError] = useState(null);

    const freelancerLessons = [
      {
        title: "How to Price Your Services",
        description: "Learn strategies to set competitive yet profitable rates for your freelance work.",
        icon: <FaDollarSign />,
        videoId: "bcrO04jp9fk",
        category: "Pricing"
      },
      {
        title: "Effective Client Communication",
        description: "Master professional communication techniques with clients.",
        icon: <FaComments />,
        videoId: "KGrnYmqt-m4",
        category: "Communication"
      },
      {
        title: "Building Your Portfolio",
        description: "Create a portfolio that showcases your best work effectively.",
        icon: <FaLaptopCode />,
        videoId: "wAUGOQY76d0",
        category: "Portfolio"
      },
      {
        title: "Managing Client Expectations",
        description: "Set clear boundaries and manage client expectations professionally.",
        icon: <FaHandshake />,
        videoId: "2Ur1t79-PnQ",
        category: "Client Management"
      },
      {
        title: "Time Management for Freelancers",
        description: "Balance multiple projects and meet deadlines effectively.",
        icon: <FaClock />,
        videoId: "OPILK_Utg6Q",
        category: "Productivity"
      }
    ];

    useEffect(() => {
        const token = localStorage.getItem('freelancerToken');
        if (!token || !freelancerId) {
            navigate('/login', { 
              state: { message: 'Please log in to view your dashboard' } 
            });
            return;
        }

        const fetchProjects = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                  `http://localhost:8081/api/jobs/freelancer/${freelancerId}`, 
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                const jobs = response.data;
                setProjects(jobs);
                updateStats(jobs);
            } catch (err) {
                console.error('Error fetching projects:', err);
                if (err.response?.status === 401) {
                    localStorage.removeItem('freelancerToken');
                    localStorage.removeItem('freelancerId');
                    navigate('/login', { 
                      state: { message: 'Session expired. Please log in again.' } 
                    });
                } else {
                    setError(`Error fetching projects: ${err.response?.data?.error || err.message}`);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
        const interval = setInterval(fetchProjects, 30000);
        
        return () => clearInterval(interval);
    }, [freelancerId, navigate]);

    const updateStats = (jobs) => {
    const active = jobs.filter(job => job.status === 'ACTIVE' || job.status === 'ACCEPTED').length;
    const completed = jobs.filter(job => job.status === 'COMPLETED').length;
    const earnings = jobs
        .filter(job => job.paid)
        .reduce((sum, job) => sum + (job.price || 0), 0);
    
    setStats({ earnings, activeProjects: active, completedProjects: completed });
};


    const handleSetPrice = async (jobId) => {
        const token = localStorage.getItem('freelancerToken');
        if (!price || isNaN(price) || price < 0) {
            setError('Please enter a valid non-negative price');
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8081/api/jobs/${jobId}/price`,
                { price: parseInt(price) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const updatedJob = response.data;
            setProjects(prev => prev.map(job =>
                job.id === jobId ? { ...job, price: parseInt(price) } : job
            ));
            setActivities(prev => [{
                id: `${Date.now()}-${Math.random()}`,
                title: 'Price Set',
                description: updatedJob.title,
                time: 'Just now',
                icon: <FaCheckCircle />
            }, ...prev]);
            setShowPriceForm(null);
            setPrice('');
            setError(null);
        } catch (err) {
            setError(`Error setting price: ${err.response?.data?.error || err.message}`);
        }
  };
  const handleCompleteJob = async (jobId) => {
    const token = localStorage.getItem('freelancerToken');
    try {
      await axios.put(
        `http://localhost:8081/api/jobs/${jobId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(prev => prev.map(j =>
        j.id === jobId ? { ...j, status: 'COMPLETED' } : j
      ));
    } catch (err) {
      setError(`Error completing job: ${err.response?.data?.error || err.message}`);
    }
  };


    const handleAcceptJob = async (jobId) => {
      const token = localStorage.getItem('freelancerToken');
      try {
        await axios.put(
          `http://localhost:8081/api/jobs/${jobId}/accept`, 
          {}, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(prev => prev.map(j => 
          j.id === jobId ? { ...j, status: 'ACTIVE' } : j
        ));
      } catch (err) {
        setError(`Error accepting job: ${err.response?.data?.error || err.message}`);
    }
  };

    const handleIgnoreJob = async (jobId) => {
      const token = localStorage.getItem('freelancerToken');
      try {
        await axios.put(
          `http://localhost:8081/api/jobs/${jobId}/ignore`, 
          {}, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProjects(prev => prev.map(j => 
          j.id === jobId ? { ...j, freelancerId: null, status: 'PENDING' } : j
        ));
      } catch (err) {
        setError(`Error ignoring job: ${err.response?.data?.error || err.message}`);
      }
    };

    const handleReportFraud = async (jobId, clientId) => {
      const description = prompt("Describe why this client is fraudulent:");
      if (!description) return;
      
      const token = localStorage.getItem('freelancerToken');
      try {
        await axios.post(
          `http://localhost:8081/api/fraud/report`, 
          { reportedUserId: clientId, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setActivities(prev => [{
          id: `${Date.now()}-${Math.random()}`,
          title: 'Fraud Reported',
          description: `Reported client for job: ${projects.find(j => j.id === jobId)?.title || 'Unknown'}`,
          time: 'Just now',
          icon: <FaUser />
        }, ...prev]);
      } catch (err) {
        setError(`Error reporting fraud: ${err.response?.data?.error || err.message}`);
      }
    };

    const cardStyle = {
      background: 'white',
      padding: '1.5rem',
      borderRadius: '1rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '1rem'
    };

    const statCardStyle = {
      ...cardStyle,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    };

    const projectCardStyle = {
      ...cardStyle,
      background: '#f8fafc'
    };

    const priceInputStyle = {
      flex: 1,
      padding: '0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #e2e8f0',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease'
    };

    const primaryButtonStyle = {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s ease'
    };

    const getStatusBadgeStyle = (status) => {
      const baseStyle = {
        padding: '0.5rem 1rem',
        borderRadius: '50px',
        fontSize: '0.875rem',
        fontWeight: '500',
        textTransform: 'capitalize'
      };

      switch(status) {
        case 'ACTIVE':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
            color: '#064e3b'
          };
        case 'COMPLETED':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: '#0f766e'
          };
        case 'PENDING':
          return {
            ...baseStyle,
            background: 'linear-gradient(135deg, #ffd1ff 0%, #fad0c4 100%)',
            color: '#9d174d'
          };
        default:
          return baseStyle;
      }
    };

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
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                              {`Welcome back, ${localStorage.getItem('freelancerName') || 'Freelancer'}`}
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            opacity: '0.9'
                        }}>
                            Monitor your projects and earnings
                        </p>
                    </div>
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
                    <div style={statCardStyle}>
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
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Total Earnings</h3>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
                          ₹{stats.earnings.toLocaleString()}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Total amount earned</div>
                    </div>

                    <div style={statCardStyle}>
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
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Active Projects</h3>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
                          {stats.activeProjects}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Currently in progress</div>
                    </div>

                    <div style={statCardStyle}>
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
                            <h3 style={{ margin: 0, color: '#1e293b' }}>Completed Projects</h3>
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
                          {stats.completedProjects}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.875rem' }}>Successfully finished</div>
                    </div>
                </div>

                <div style={{ ...cardStyle, marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#1e293b' }}>
                      Project Requests
                    </h2>
                    {isLoading ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '2rem',
                            background: '#f8fafc',
                            borderRadius: '0.75rem'
                        }}>
                            <FaSpinner style={{ 
                              fontSize: '2rem', 
                              color: '#3b82f6', 
                              animation: 'spin 1s linear infinite' 
                            }} />
                        </div>
                    ) : projects.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '2rem',
                            color: '#64748b'
                        }}>
                            No projects found
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            {projects.map(job => (
                                <div key={job.id} style={projectCardStyle}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '1rem'
                                    }}>
                                        <h3 style={{ 
                                          margin: 0, 
                                          color: '#1e293b', 
                                          fontSize: '1.25rem' 
                                        }}>
                                          {job.title}
                                        </h3>
                                        <span style={getStatusBadgeStyle(job.status)}>
                                          {job.status}
                                        </span>
                                    </div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <span style={{ 
                                              color: '#64748b', 
                                              fontWeight: '500' 
                                            }}>
                                              Description:
                                            </span>
                                            <p style={{ 
                                              color: '#1e293b', 
                                              margin: '0.5rem 0 0 0' 
                                            }}>
                                              {job.description}
                                            </p>
                                        </div>
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <span style={{ 
                                              color: '#64748b', 
                                              fontWeight: '500' 
                                            }}>
                                              Estimated Time:
                                            </span>
                                            <span style={{ 
                                              color: '#1e293b', 
                                              marginLeft: '0.5rem' 
                                            }}>
                                                {job.estimatedTime || 'Not specified'}
                                            </span>
                                        </div>
                                        {job.price && (
                                            <div style={{ marginBottom: '0.75rem' }}>
                                                <span style={{ 
                                                  color: '#64748b', 
                                                  fontWeight: '500' 
                                                }}>
                                                  Your Price:
                                                </span>
                                                <span style={{ 
                                                  color: '#1e293b', 
                                                  marginLeft: '0.5rem', 
                                                  fontWeight: '600' 
                                                }}>
                                                    ${job.price.toLocaleString()}
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
                                                <FaCheckCircle /> Payment Received
                                            </div>
                                        )}
                                    </div>
                                    {job.status === 'PENDING' && !job.price && (
                                        showPriceForm === job.id ? (
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.75rem',
                                                marginTop: '1rem'
                                            }}>
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(Math.max(0, e.target.value))}
                                                    placeholder="Set your price"
                                                    min="0"
                                                    style={priceInputStyle}
                                                />
                                                <button
                                                    onClick={() => handleSetPrice(job.id)}
                                                    style={primaryButtonStyle}
                                                >
                                                    <FaCheckCircle /> Submit Price
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowPriceForm(job.id)}
                                                style={primaryButtonStyle}
                                            >
                                                <FaPlus /> Set Price
                                            </button>
                                        )
                                    )}
                                    {job.status === 'ACTIVE' && (
                                      <button
                                        onClick={() => handleCompleteJob(job.id)}
                                        style={{
                                          background: '#e0f2fe',
                                          color: '#0284c7',
                                          padding: '0.5rem 1rem',
                                          borderRadius: '0.5rem',
                                          border: 'none',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <FaCheckCircle /> Mark as Complete
                                      </button>
                                    )}

                                    {job.status !== 'COMPLETED' && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.75rem',
                                            flexWrap: 'wrap',
                                            marginTop: '1rem'
                                        }}>
                                            <button
                                                onClick={() => handleAcceptJob(job.id)}
                                                style={{
                                                    background: '#dcfce7',
                                                    color: '#059669',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <FaCheckCircle /> Accept
                                            </button>
                                            <button
                                                onClick={() => handleIgnoreJob(job.id)}
                                                style={{
                                                    background: '#f3f4f6',
                                                    color: '#4b5563',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <FaExclamationTriangle /> Ignore
                                            </button>
                                            <button
                                                onClick={() => handleReportFraud(job.id, job.clientId)}
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
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                <FaExclamationTriangle /> Report Fraud
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '1rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  marginBottom: '2rem'
                }}>
                  <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ 
                      fontSize: '2.5rem', 
                      color: '#1e293b', 
                      marginBottom: '1rem', 
                      fontWeight: '700' 
                    }}>
                      Freelancer Learning Center
                    </h1>
                    <p style={{ 
                      fontSize: '1.125rem', 
                      color: '#64748b', 
                      maxWidth: '800px', 
                      margin: '0 auto' 
                    }}>
                      Enhance your freelance skills with our expert video lessons
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                  }}>
                    {freelancerLessons.map((lesson, index) => (
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
                      Ready to Improve Your Freelance Skills?
                    </h2>
                    <p style={{
                      color: '#64748b',
                      marginBottom: '1.5rem',
                      maxWidth: '600px',
                      margin: '0 auto 1.5rem'
                    }}>
                      Watch these lessons to learn everything you need to succeed as a freelancer.
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

                <div style={cardStyle}>
                    <h2 style={{ 
                      fontSize: '1.5rem', 
                      marginBottom: '1.5rem', 
                      color: '#1e293b' 
                    }}>
                      Recent Activity
                    </h2>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '1rem' 
                    }}>
                        {activities.length === 0 ? (
                            <div style={{ 
                              textAlign: 'center', 
                              padding: '2rem', 
                              color: '#64748b' 
                            }}>
                                No recent activity
                            </div>
                        ) : (
                            activities.map(activity => (
                                <div key={activity.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: '#f8fafc',
                                    borderRadius: '0.75rem',
                                    transition: 'transform 0.2s ease'
                                }}>
                                    <div style={{
                                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                                        <h4 style={{ 
                                          margin: '0 0 0.25rem 0', 
                                          color: '#1e293b' 
                                        }}>
                                          {activity.title}
                                        </h4>
                                        <p style={{ 
                                          margin: '0 0 0.25rem 0', 
                                          color: '#64748b' 
                                        }}>
                                          {activity.description}
                                        </p>
                                        <span style={{ 
                                          color: '#94a3b8', 
                                          fontSize: '0.875rem' 
                                        }}>
                                          {activity.time}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreelancerDashboard;