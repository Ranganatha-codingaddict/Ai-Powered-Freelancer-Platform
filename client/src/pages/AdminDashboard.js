import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaUser, FaTrash, FaExclamationTriangle, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';

const AdminDashboard = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [clients, setClients] = useState([]);
    const [fraudReports, setFraudReports] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/signup');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch freelancers
                const freelancersResponse = await axios.get('http://localhost:8081/api/admin/freelancers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFreelancers(freelancersResponse.data);

                // Fetch clients
                const clientsResponse = await axios.get('http://localhost:8081/api/admin/clients', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setClients(clientsResponse.data);

                // Fetch fraud reports separately
                try {
                    const fraudReportsResponse = await axios.get('http://localhost:8081/api/fraud/reports', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setFraudReports(fraudReportsResponse.data);
                } catch (fraudErr) {
                    console.error('Error fetching fraud reports:', fraudErr.response?.data || fraudErr.message);
                    setError(`Error fetching fraud reports: ${fraudErr.response?.data?.error || fraudErr.message}`);
                }
            } catch (err) {
                setError(`Error fetching data: ${err.response?.data?.error || err.message}`);
                if (err.response?.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/signup');
                }
            }
        };

        fetchData();
    }, [navigate]);

    const handleDelete = async (id, type) => {
        const token = localStorage.getItem('adminToken');
        try {
            await axios.delete(`http://localhost:8081/api/admin/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (type === 'freelancer') {
                setFreelancers(freelancers.filter((f) => f.id !== id));
            } else {
                setClients(clients.filter((c) => c.id !== id));
            }
            setError(null);
        } catch (err) {
            setError(`Error deleting ${type}: ${err.response?.data?.error || err.message}`);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f1f5f9',
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
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
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
                            Admin Dashboard
                        </h1>
                        <p style={{
                            fontSize: '1.125rem',
                            opacity: '0.9'
                        }}>
                            Manage your platform's users and monitor activities
                        </p>
                    </div>
                    <div style={{
                        display: 'flex',
                        gap: '2rem'
                    }}>
                        <div style={{
                            textAlign: 'center',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.75rem',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <FaUsers style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{freelancers.length + clients.length}</div>
                            <div style={{ fontSize: '0.875rem', opacity: '0.9' }}>Total Users</div>
                        </div>
                        <div style={{
                            textAlign: 'center',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '0.75rem',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <FaChartLine style={{ fontSize: '2rem', marginBottom: '0.5rem' }} />
                            <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{fraudReports.length}</div>
                            <div style={{ fontSize: '0.875rem', opacity: '0.9' }}>Active Reports</div>
                        </div>
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
                    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        background: '#ffffff',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        ':hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }
                    }}>
                        <h3 style={{
                            color: '#2563eb',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '1.5rem',
                            fontWeight: '600'
                        }}>
                            <FaUserTie style={{ fontSize: '1.75rem' }} /> Registered Freelancers
                        </h3>
                        {freelancers.length === 0 ? (
                            <p style={{ color: '#64748b', fontSize: '1rem' }}>No freelancers registered yet.</p>
                        ) : (
                            <div style={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#cbd5e1 #f1f5f9'
                            }}>
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'separate',
                                    borderSpacing: '0'
                                }}>
                                    <thead>
                                        <tr>
                                            <th style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '2px solid #e2e8f0',
                                                backgroundColor: '#f8fafc',
                                                color: '#1e293b',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Name
                                            </th>
                                            <th style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '2px solid #e2e8f0',
                                                backgroundColor: '#f8fafc',
                                                color: '#1e293b',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Email
                                            </th>
                                            <th style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '2px solid #e2e8f0',
                                                backgroundColor: '#f8fafc',
                                                color: '#1e293b',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {freelancers.map((freelancer) => (
                                            <tr key={freelancer.id} style={{
                                                ':hover': {
                                                    backgroundColor: '#f8fafc'
                                                }
                                            }}>
                                                <td style={{
                                                    padding: '1rem',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    color: '#1e293b'
                                                }}>
                                                    {freelancer.name}
                                                </td>
                                                <td style={{
                                                    padding: '1rem',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    color: '#1e293b'
                                                }}>
                                                    {freelancer.email}
                                                </td>
                                                <td style={{
                                                    padding: '1rem',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #e2e8f0'
                                                }}>
                                                    <button
                                                        onClick={() => handleDelete(freelancer.id, 'freelancer')}
                                                        style={{
                                                            backgroundColor: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '0.5rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '500',
                                                            transition: 'all 0.2s ease-in-out',
                                                            ':hover': {
                                                                backgroundColor: '#dc2626',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div style={{
                        background: '#ffffff',
                        padding: '1.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        ':hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                        }
                    }}>
                        <h3 style={{
                            color: '#2563eb',
                            marginBottom: '1.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '1.5rem',
                            fontWeight: '600'
                        }}>
                            <FaUser style={{ fontSize: '1.75rem' }} /> Registered Clients
                        </h3>
                        {clients.length === 0 ? (
                            <p style={{ color: '#64748b', fontSize: '1rem' }}>No clients registered yet.</p>
                        ) : (
                            <div style={{
                                maxHeight: '400px',
                                overflowY: 'auto',
                                scrollbarWidth: 'thin',
                                scrollbarColor: '#cbd5e1 #f1f5f9'
                            }}>
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'separate',
                                    borderSpacing: '0'
                                }}>
                                    <thead>
                                        <tr>
                                            <th style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '2px solid #e2e8f0',
                                                backgroundColor: '#f8fafc',
                                                color: '#1e293b',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Name
                                            </th>
                                            <th style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '2px solid #e2e8f0',
                                                backgroundColor: '#f8fafc',
                                                color: '#1e293b',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Email
                                            </th>
                                            <th style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '2px solid #e2e8f0',
                                                backgroundColor: '#f8fafc',
                                                color: '#1e293b',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Phone
                                            </th>
                                            <th style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '2px solid #e2e8f0',
                                                backgroundColor: '#f8fafc',
                                                color: '#1e293b',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clients.map((client) => (
                                            <tr key={client.id} style={{
                                                ':hover': {
                                                    backgroundColor: '#f8fafc'
                                                }
                                            }}>
                                                <td style={{
                                                    padding: '1rem',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    color: '#1e293b'
                                                }}>
                                                    {client.name}
                                                </td>
                                                <td style={{
                                                    padding: '1rem',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    color: '#1e293b'
                                                }}>
                                                    {client.email}
                                                </td>
                                                <td style={{
                                                    padding: '1rem',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #e2e8f0',
                                                    color: '#1e293b'
                                                }}>
                                                    {client.phone || 'N/A'}
                                                </td>
                                                <td style={{
                                                    padding: '1rem',
                                                    textAlign: 'left',
                                                    borderBottom: '1px solid #e2e8f0'
                                                }}>
                                                    <button
                                                        onClick={() => handleDelete(client.id, 'client')}
                                                        style={{
                                                            backgroundColor: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '0.5rem 1rem',
                                                            borderRadius: '0.5rem',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '500',
                                                            transition: 'all 0.2s ease-in-out',
                                                            ':hover': {
                                                                backgroundColor: '#dc2626',
                                                                transform: 'translateY(-1px)'
                                                            }
                                                        }}
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{
                    background: '#ffffff',
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    ':hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                    }
                }}>
                    <h3 style={{
                        color: '#ea580c',
                        marginBottom: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontSize: '1.5rem',
                        fontWeight: '600'
                    }}>
                        <FaShieldAlt style={{ fontSize: '1.75rem' }} /> Fraud Reports
                    </h3>
                    {fraudReports.length === 0 ? (
                        <p style={{ color: '#64748b', fontSize: '1rem' }}>No fraud reports yet.</p>
                    ) : (
                        <div style={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#cbd5e1 #f1f5f9'
                        }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'separate',
                                borderSpacing: '0'
                            }}>
                                <thead>
                                    <tr>
                                        <th style={{
                                            padding: '1rem',
                                            textAlign: 'left',
                                            borderBottom: '2px solid #e2e8f0',
                                            backgroundColor: '#f8fafc',
                                            color: '#1e293b',
                                            fontWeight: '600',
                                            fontSize: '0.875rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Reporter
                                        </th>
                                        <th style={{
                                            padding: '1rem',
                                            textAlign: 'left',
                                            borderBottom: '2px solid #e2e8f0',
                                            backgroundColor: '#f8fafc',
                                            color: '#1e293b',
                                            fontWeight: '600',
                                            fontSize: '0.875rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Reported User
                                        </th>
                                        <th style={{
                                            padding: '1rem',
                                            textAlign: 'left',
                                            borderBottom: '2px solid #e2e8f0',
                                            backgroundColor: '#f8fafc',
                                            color: '#1e293b',
                                            fontWeight: '600',
                                            fontSize: '0.875rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Description
                                        </th>
                                        <th style={{
                                            padding: '1rem',
                                            textAlign: 'left',
                                            borderBottom: '2px solid #e2e8f0',
                                            backgroundColor: '#f8fafc',
                                            color: '#1e293b',
                                            fontWeight: '600',
                                            fontSize: '0.875rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fraudReports.map(report => (
                                        <tr key={report.id} style={{
                                            ':hover': {
                                                backgroundColor: '#f8fafc'
                                            }
                                        }}>
                                            <td style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #e2e8f0',
                                                color: '#1e293b'
                                            }}>
                                                {report.reporterId}
                                            </td>
                                            <td style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #e2e8f0',
                                                color: '#1e293b'
                                            }}>
                                                {report.reportedUserId}
                                            </td>
                                            <td style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #e2e8f0',
                                                color: '#1e293b'
                                            }}>
                                                {report.description}
                                            </td>
                                            <td style={{
                                                padding: '1rem',
                                                textAlign: 'left',
                                                borderBottom: '1px solid #e2e8f0'
                                            }}>
                                                <button
                                                    onClick={() => handleDelete(report.reportedUserId, freelancers.some(f => f.id === report.reportedUserId) ? 'freelancer' : 'client')}
                                                    style={{
                                                        backgroundColor: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '0.5rem',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        transition: 'all 0.2s ease-in-out',
                                                        ':hover': {
                                                            backgroundColor: '#dc2626',
                                                            transform: 'translateY(-1px)'
                                                        }
                                                    }}
                                                >
                                                    <FaTrash /> Delete User
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;