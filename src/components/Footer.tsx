import { motion } from 'framer-motion';
import { MapPin, Mail, MessageSquare, Shield, ChevronRight, Smartphone } from 'lucide-react';
import logo3 from '../assets/logo.png';

interface FooterProps {
  srecUrl?: string;
  copyright?: string;
  sponsor?: string;
  info?: Record<string, string>;
  onNavigate?: (id: string) => void;
}

export default function Footer({ copyright, onNavigate }: FooterProps) {
  const handleNav = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = `#${id}`;
      }
    }
  };

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #092147 0%, #061633 100%)', // Deep Vibrant Royal Blue
        color: '#ffffff', // Clean crisp white text throughout
        padding: '4rem 0 1.5rem 0',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        borderTop: '1px solid rgba(56, 189, 248, 0.25)',
        position: 'relative',
        zIndex: 5,
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 1.5rem'
        }}
      >
        {/* Main 3-Column Grid Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            marginBottom: '3.5rem',
            alignItems: 'start'
          }}
        >
          {/* Column 1: Brand / Logo & Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
              <img
                src={logo3}
                alt="AECTSD 2027 Logo"
                style={{ height: '52px', objectFit: 'contain' }}
              />
              <div>
                <h3
                  style={{
                    fontSize: '1.55rem',
                    fontWeight: 900,
                    margin: 0,
                    letterSpacing: '-0.02em',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {/* Dual-color AECTSD */}
                  <span style={{ color: '#38bdf8', fontWeight: 900 }}>AEC</span>
                  <span style={{ color: '#ffffff', fontWeight: 900 }}>TSD</span>
                  {/* High contrast 2027 badge */}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#000000',
                      padding: '0.15rem 0.55rem',
                      borderRadius: '6px',
                      fontWeight: 900,
                      fontSize: '1.1rem',
                      marginLeft: '0.5rem',
                      boxShadow: '0 2px 12px rgba(245, 158, 11, 0.4)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    2027
                  </span>
                </h3>
                <span style={{ fontSize: '0.725rem', color: '#ffffff', opacity: 0.9, fontWeight: 700, letterSpacing: '0.05em' }}>
                  INTERNATIONAL CONFERENCE
                </span>
              </div>
            </div>

            <p
              style={{
                color: '#ffffff',
                fontSize: '0.875rem',
                lineHeight: 1.65,
                margin: 0,
                opacity: 0.92,
                maxWidth: '380px'
              }}
            >
              AECTSD 2027 is the flagship international conference of Sri Ramakrishna Engineering College (SREC), bringing together researchers, academicians, industry experts and innovators from across the globe.
            </p>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div
            style={{ paddingLeft: '1rem' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4
              style={{
                color: '#ffffff', // High Contrast Pure White Header
                fontSize: '1.25rem',
                fontWeight: 900,
                margin: '0 0 1.25rem 0',
                letterSpacing: '-0.01em',
                opacity: 1,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              Quick Links
            </h4>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem'
              }}
            >
              {[
                { label: 'Home', id: 'home', color: '#38bdf8' },
                { label: 'About', id: 'about', color: '#fbbf24' },
                { label: 'Tracks', id: 'call-for-papers-main', color: '#34d399' },
                { label: 'Committee', id: 'committee', color: '#a78bfa' },
                { label: 'Venue', id: 'location', color: '#f472b6' },
                { label: 'Contact', id: 'coordinators', color: '#fb923c' }
              ].map((link, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.25 + idx * 0.08 }}
                >
                  <button
                    onClick={() => handleNav(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ffffff', // Pure White Links
                      fontSize: '0.925rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: 0.95
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.color = link.color;
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0.95';
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <ChevronRight size={15} style={{ color: link.color, flexShrink: 0 }} />
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4
              style={{
                color: '#ffffff', // High Contrast Pure White Header
                fontSize: '1.25rem',
                fontWeight: 900,
                margin: '0 0 1.25rem 0',
                letterSpacing: '-0.01em',
                opacity: 1,
                textShadow: '0 2px 8px rgba(0,0,0,0.5)'
              }}
            >
              Contact Information
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
              {/* Address */}
              <motion.div
                style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.35 }}
              >
                <span style={{ color: '#38bdf8', marginTop: '0.15rem', display: 'flex', flexShrink: 0 }}>
                  <MapPin size={18} />
                </span>
                <span style={{ color: '#ffffff', lineHeight: 1.5, opacity: 0.95, fontWeight: 500 }}>
                  Sri Ramakrishna Engineering College, Coimbatore, Tamil Nadu
                </span>
              </motion.div>

              {/* Email */}
              <motion.div
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <span style={{ color: '#38bdf8', display: 'flex', flexShrink: 0 }}>
                  <Mail size={18} />
                </span>
                <a
                  href="mailto:aectsd2027@srec.ac.in"
                  style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.95, fontWeight: 500, transition: 'all 0.2s' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.color = '#38bdf8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.95';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                >
                  aectsd2027@srec.ac.in
                </a>
              </motion.div>

              {/* WhatsApp Text */}
              <motion.div
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                <span style={{ color: '#38bdf8', display: 'flex', flexShrink: 0 }}>
                  <MessageSquare size={18} />
                </span>
                <span style={{ color: '#ffffff', opacity: 0.95, fontWeight: 500 }}>
                  WhatsApp: +91 9080296675 / +91 8124697426
                </span>
              </motion.div>

              {/* WhatsApp Action Button Pill */}
              <motion.div
                style={{ marginTop: '0.5rem' }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <a
                  href="https://wa.me/919080296675?text=Hello%2C%20I%20have%20a%20query%20regarding%20AECTSD%202027."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 1.15rem',
                    border: '1.5px solid #ffffff',
                    borderRadius: '30px',
                    color: '#ffffff',
                    background: 'rgba(255, 255, 255, 0.1)',
                    textDecoration: 'none',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    transition: 'all 0.25s ease',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#092147';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  <span
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#10b981',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff'
                    }}
                  >
                    <MessageSquare size={12} />
                  </span>
                  For queries, kindly reach us on WhatsApp.
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar / Copyright Bar */}
        <motion.div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.825rem',
            color: '#ffffff',
            opacity: 0.92
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div>
            {copyright || '© 2027 AECTSD. All Rights Reserved.'}
          </div>

          <div>
            Hosted by Sri Ramakrishna Engineering College, Coimbatore
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span>
              Designed & Developed by <strong style={{ color: '#ffffff', fontWeight: 800 }}>Surya Narayanan K S</strong>
            </span>

            {/* Android APK Download Button */}
            <button
              onClick={() => {
                if ((window as any).deferredPrompt) {
                  (window as any).deferredPrompt.prompt();
                } else {
                  alert('📱 AECTSD 2027 App is PWA/APK ready!\n\nTo install on your Android device:\n1. Tap your browser menu (3 dots)\n2. Select "Add to Home screen" or "Install App".');
                }
              }}
              style={{
                textDecoration: 'none',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.3rem 0.75rem',
                borderRadius: '20px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Download & Install AECTSD 2027 Android App"
            >
              <Smartphone size={13} /> 
            </button>

            <a
              href="/?page=admin"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '0.725rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                background: 'rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.color = '#092147';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = '#ffffff';
              }}
              title="Admin Portal Login"
            >
              <Shield size={12} /> Admin
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
