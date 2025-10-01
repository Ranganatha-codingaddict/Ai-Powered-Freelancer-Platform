import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Typewriter from 'typewriter-effect';
import { FaChartBar } from 'react-icons/fa';
import AdminPanel from './AdminPanel';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const carouselImages = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1500&q=80'
  ];

  const categories = [
    { icon: '💻', name: 'Web Development', count: '1.2k+ Jobs' },
    { icon: '🎨', name: 'Graphic Design', count: '850+ Jobs' },
    { icon: '📱', name: 'Mobile Development', count: '950+ Jobs' },
    { icon: '✍️', name: 'Content Writing', count: '600+ Jobs' },
    { icon: '📊', name: 'Digital Marketing', count: '750+ Jobs' },
    { icon: '🎥', name: 'Video Editing', count: '450+ Jobs' },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 5000);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // Reset all default margins and paddings
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Responsive style adjustments
  const isMobile = windowWidth <= 768;
  const isTablet = windowWidth <= 1024 && windowWidth > 768;

  const containerStyles = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    width: '100%',
    overflowX: 'hidden',
    boxSizing: 'border-box',
    fontFamily: "'Poppins', sans-serif",
    position: 'relative',
    alignItems: 'stretch'
  };

  const heroStyles = {
    position: 'relative',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxSizing: 'border-box'
  };

  const carouselContainerStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0
  };

  const carouselImageStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0,
    transition: 'opacity 1s ease-in-out',
    margin: 0,
    padding: 0
  };

  const heroContentStyles = {
    position: 'relative',
    zIndex: 1,
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: 'white',
    padding: isMobile ? '0 0.5rem' : '0 1rem',
    margin: 0,
    boxSizing: 'border-box'
  };

  const heroTextStyles = {
    maxWidth: isMobile ? '100%' : '800px',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 1s ease-out, transform 1s ease-out',
    width: '100%',
    padding: isMobile ? '0 1rem' : '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 0
  };

  const titleStyles = {
    fontSize: isMobile ? '2rem' : isTablet ? '2.5rem' : '3.5rem',
    fontWeight: 700,
    marginBottom: '1.5rem',
    lineHeight: 1.2,
    width: '100%',
    margin: 0
  };

  const descriptionStyles = {
    fontSize: isMobile ? '1rem' : '1.25rem',
    marginBottom: '2rem',
    opacity: 0.9,
    lineHeight: 1.5,
    width: '100%',
    margin: 0
  };

  const buttonsStyles = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
    width: isMobile ? '100%' : 'auto',
    maxWidth: isMobile ? '300px' : 'none',
    alignItems: 'center',
    margin: 0
  };

  const buttonStyles = {
    padding: '0.75rem 2rem',
    fontSize: '1.1rem',
    borderRadius: '50px',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? '100%' : 'auto',
    minWidth: '160px',
    textDecoration: 'none',
    boxSizing: 'border-box',
    margin: 0
  };

  const containerInnerStyles = {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: isMobile ? '0 1rem' : '0 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box'
  };

  const categoriesSectionStyles = {
    padding: '4rem 0',
    backgroundColor: '#f8f9fa',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: 0,
    boxSizing: 'border-box',
    alignSelf: 'stretch'
  };

  const categoriesGridStyles = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    width: '100%',
    justifyContent: 'center',
    margin: 0,
    boxSizing: 'border-box'
  };

  const statsGridStyles = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
    gap: isMobile ? '1.5rem' : '2rem',
    textAlign: 'center',
    width: '100%',
    justifyContent: 'center',
    margin: 0,
    boxSizing: 'border-box'
  };

  return (
    <div style={containerStyles}>
      <div style={heroStyles}>
        <div style={carouselContainerStyles}>
          {carouselImages.map((image, index) => (
            <div
              key={index}
              style={{
                ...carouselImageStyles,
                backgroundImage: `url(${image})`,
                opacity: index === currentImageIndex ? 1 : 0
              }}
            />
          ))}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)',
            margin: 0,
            padding: 0
          }} />
        </div>
        <div style={heroContentStyles}>
          <div style={heroTextStyles}>
            <div style={{ fontSize: '1.2rem', marginBottom: '1rem', margin: 0 }}>Welcome to Freelance Co</div>
            <h1 style={titleStyles}>
              <Typewriter
                options={{
                  strings: ['Find Expert Freelancers', 'Hire Top Talent', 'Get Work Done'],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                  pauseFor: 2000
                }}
              />
            </h1>
            <p style={descriptionStyles}>
              Connect with top freelancers, manage projects, and build your business with confidence.
            </p>
            <div style={buttonsStyles}>
              <Link
                to="/signup"
                style={{
                  ...buttonStyles,
                  backgroundColor: 'white',
                  color: '#333',
                  border: 'none'
                }}
              >Get Started</Link>
              <button
                style={{
                  ...buttonStyles,
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: '2px solid white'
                }}
                onClick={() => setShowAdminPanel(true)}
              >
                <FaChartBar style={{ marginRight: '0.5rem' }} />
                View Records
              </button>
            </div>
          </div>
        </div>
      </div>

      <section style={categoriesSectionStyles}>
        <div style={containerInnerStyles}>
          <h2 style={{
            textAlign: 'center',
            fontSize: isMobile ? '2rem' : '2.5rem',
            marginBottom: '3rem',
            color: '#333',
            width: '100%',
            margin: 0
          }}>Popular Categories</h2>
          <div style={categoriesGridStyles}>
            {categories.map((category, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '15px',
                padding: '2rem',
                textAlign: 'center',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: 0
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1, margin: 0 }}>{category.icon}</div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#333', margin: 0 }}>{category.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: 0 }}>{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        margin: 0,
        boxSizing: 'border-box',
        alignSelf: 'stretch'
      }}>
        <div style={containerInnerStyles}>
          <div style={statsGridStyles}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
              <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1, margin: 0 }}>2M+</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>Freelancers</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
              <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1, margin: 0 }}>10K+</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>Active Projects</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
              <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1, margin: 0 }}>95%</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>Client Satisfaction</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
              <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1, margin: 0 }}>$500M+</h2>
              <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>Paid to Freelancers</p>
            </div>
          </div>
        </div>
      </section>

      {showAdminPanel && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(5px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 0
        }}>
          <div style={{
            position: 'relative',
            width: isMobile ? '95%' : '90%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'white',
            borderRadius: '15px',
            padding: isMobile ? '1rem' : '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: 0
          }}>
            <button
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                fontSize: '2rem',
                color: '#666',
                cursor: 'pointer',
                padding: 0,
                lineHeight: 1,
                margin: 0
              }}
              onClick={() => setShowAdminPanel(false)}
            >
              ×
            </button>
            <AdminPanel />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;