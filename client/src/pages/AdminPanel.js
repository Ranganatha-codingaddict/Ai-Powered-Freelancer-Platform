import React, { useEffect, useState } from 'react';
import { getUserCount, getPopularSkills } from '../services/api';
import { FaUsers, FaChartLine, FaCode, FaDatabase, FaChartBar, FaChartPie } from 'react-icons/fa';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminPanel = () => {
  const [userCount, setUserCount] = useState(0);
  const [popularSkills, setPopularSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample data for charts
  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'User Growth',
        data: [65, 78, 90, 120, 150, 180],
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const skillsDistributionData = {
    labels: ['Web Dev', 'Mobile Dev', 'UI/UX', 'Data Science', 'AI/ML'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          '#2563EB',
          '#4F46E5',
          '#7C3AED',
          '#EC4899',
          '#F59E0B'
        ]
      }
    ]
  };

  const monthlyStatsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Projects',
        data: [12, 19, 15, 25, 22, 30],
        backgroundColor: '#2563EB'
      },
      {
        label: 'Completed Projects',
        data: [8, 12, 10, 18, 15, 20],
        backgroundColor: '#4F46E5'
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await getUserCount();
        const skills = await getPopularSkills();
        setUserCount(count.data);
        setPopularSkills(skills.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>Platform Analytics</h2>
        <p style={{ color: '#6B7280', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>Real-time insights and statistics</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'white', fontSize: '1.25rem' }}>
            <FaUsers />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>{userCount}</div>
          <div style={{ color: '#6B7280', fontSize: '0.875rem' }}>Total Users</div>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'white', fontSize: '1.25rem' }}>
            <FaChartLine />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>85%</div>
          <div style={{ color: '#6B7280', fontSize: '0.875rem' }}>Platform Growth</div>
        </div>

        <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', border: '1px solid rgba(37, 99, 235, 0.1)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #2563EB, #4F46E5)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'white', fontSize: '1.25rem' }}>
            <FaCode />
          </div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1F2937', marginBottom: '0.5rem' }}>150+</div>
          <div style={{ color: '#6B7280', fontSize: '0.875rem' }}>Active Projects</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>User Growth Trend</h3>
        <div style={{ height: '250px', marginBottom: '1rem' }}>
          <Line data={userGrowthData} options={chartOptions} />
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>Skills Distribution</h3>
        <div style={{ height: '250px', marginBottom: '1rem' }}>
          <Pie data={skillsDistributionData} options={chartOptions} />
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>Monthly Project Statistics</h3>
        <div style={{ height: '250px', marginBottom: '1rem' }}>
          <Bar data={monthlyStatsData} options={chartOptions} />
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1F2937', marginBottom: '1rem' }}>Popular Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
          {popularSkills.map((skill, index) => (
            <span key={index} style={{ background: '#EFF6FF', color: '#2563EB', padding: '0.4rem 0.8rem', borderRadius: '1.5rem', fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.3s ease' }}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;