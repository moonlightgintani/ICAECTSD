import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowLeft } from 'lucide-react';

interface CommitteeMember {
  id?: any;
  category: 'steering' | 'organizing' | 'advisory' | 'technical';
  role: string | null;
  name: string;
  desc: string;
  image_url?: string;
}

interface CommitteePageProps {
  committeeMembers: CommitteeMember[];
  info: Record<string, string>;
  onBackToHome: () => void;
}

export const renderFormattedDesc = (descText: string | undefined | null) => {
  if (!descText) return '';
  const phrases = [
    "SNR Sons Charitable Trust",
    "Sri Ramakrishna Engineering College",
    "Professor & Head - AI&DS",
    "Professor & Head - Artificial Intelligence and Data Science",
    "Organizing Secretary, Professor & Head - AI&DS",
    "Chairman, IEEE Madras Section"
  ];
  const regex = new RegExp(`(${phrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = descText.split(regex);
  return (
    <>
      {parts.map((part, index) => {
        if (phrases.includes(part)) {
          return <span key={index} style={{ whiteSpace: 'nowrap' }}>{part}</span>;
        }
        return part;
      })}
    </>
  );
};

const getMemberImage = (name: string, imageUrl?: string): string => {
  if (imageUrl && imageUrl !== 'no_file' && imageUrl !== '') {
    return imageUrl;
  }
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=58111a,eab308&textColor=ffffff`;
};

export default function CommitteePage({ committeeMembers, info, onBackToHome }: CommitteePageProps) {
  const [committeeTab, setCommitteeTab] = useState<'steering' | 'organizing' | 'advisory'>('organizing');
  const [activeSubcommittee, setActiveSubcommittee] = useState<string>('patrons');
  const [subcommitteeDropdownOpen, setSubcommitteeDropdownOpen] = useState(false);

  const SUBCOMMITTEES = [
    { id: 'patrons', label: 'Patrons' },
    { id: 'general-chairs', label: 'General Chairs' },
    { id: 'executive', label: 'Executive Committee' },
    { id: 'finance', label: 'Finance' },
    { id: 'publication', label: 'Publication' },
    { id: 'arrangements', label: 'Arrangements' },
    { id: 'registration', label: 'Registration' },
    { id: 'tutorials', label: 'Tutorials & Workshops' },
    { id: 'review', label: 'Technical Review' },
    { id: 'outreach', label: 'Outreach & Promotion' },
    { id: 'website', label: 'Website & Media' },
    { id: 'hospitality', label: 'Hospitality' },
    { id: 'members', label: 'General Members' }
  ];

  const getTabHeader = () => {
    switch (committeeTab) {
      case 'steering':
        return {
          badge: 'GOVERNANCE TEAM',
          title: 'Steering Committee',
          desc: info.steering_committee_desc || 'Meet the steering committee guiding the strategic vision and governance of the conference.'
        };
      case 'advisory':
        return {
          badge: 'ADVISORY COUNCIL',
          title: 'Advisory Committee',
          desc: info.advisory_committee_desc || 'Meet the distinguished advisory members and domain experts guiding our planning.'
        };
      default:
        return {
          badge: 'LEADERSHIP TEAM',
          title: 'Organizing Committee',
          desc: info.organizing_committee_desc || 'Meet the dedicated leaders and experts guiding the AECTSD 2027 conference.'
        };
    }
  };

  const headerData = getTabHeader();

  return (
    <div style={{ padding: 'calc(7rem + var(--banner-height, 0px)) 1.5rem 6rem', minHeight: '80vh', background: '#faf9f6' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem' }}>
          <button 
            onClick={onBackToHome} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#58111A', 
              cursor: 'pointer', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              padding: 0
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <span style={{ color: '#cbd5e1' }}>/</span>
          <span style={{ color: '#64748b' }}>Committee</span>
        </div>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{ color: '#eab308', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.12em', display: 'block', marginBottom: '0.5rem' }}>
            {headerData.badge}
          </span>
          <h2 style={{ fontSize: '2.5rem', color: '#58111A', fontWeight: 800, margin: 0 }}>
            {headerData.title}
          </h2>
          <div style={{ height: '3.5px', width: '80px', background: '#fbbf24', margin: '0.85rem auto 0', borderRadius: '2px' }} />
          <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '650px', margin: '1.25rem auto 0', lineHeight: 1.6, fontWeight: 500 }}>
            {headerData.desc}
          </p>
        </div>

        {/* Committee Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
          {([
            { id: 'organizing', label: info.committee_tab_org || 'Organizing Committee' },
            { id: 'advisory', label: info.committee_tab_adv || 'Advisory Committee' },
            { id: 'steering', label: info.committee_tab_steering || 'Steering Committee' }
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCommitteeTab(tab.id)}
              className="committee-tab-btn"
              style={{
                background: committeeTab === tab.id ? '#58111A' : '#ffffff',
                color: committeeTab === tab.id ? '#ffffff' : '#58111A',
                border: '1px solid #e2e8f0',
                padding: '0.6rem 1.5rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                borderRadius: '30px',
                cursor: 'pointer',
                boxShadow: committeeTab === tab.id ? '0 4px 12px rgba(88, 17, 26, 0.15)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Panel Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.45rem', color: '#58111A', fontWeight: 800, margin: 0 }}>
            {committeeTab === 'organizing' 
              ? `The ${SUBCOMMITTEES.find(s => s.id === activeSubcommittee)?.label} Committee`
              : committeeTab === 'steering'
              ? 'The Core Steering & Advisory Committees'
              : 'Distinguished Advisory Members'}
          </h3>
          <div style={{ height: '3px', width: '50px', background: '#fbbf24', margin: '0.75rem auto 0', borderRadius: '2px' }} />
        </div>

        {/* Committee Content Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={committeeTab + (committeeTab === 'organizing' ? activeSubcommittee : '')}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {committeeTab === 'steering' && (
              <div className="centered-flex-grid" style={{ gap: '2rem', justifyContent: 'center' }}>
                {committeeMembers
                  .filter((member) => member.category === 'steering')
                  .map((member, mIdx) => (
                    <div 
                      key={mIdx} 
                      className="committee-profile-card"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '1.5rem',
                        padding: '2.25rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        width: '280px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        border: '2px solid #eab308',
                        padding: '4px',
                        marginBottom: '1.25rem',
                        overflow: 'hidden',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <img 
                          src={getMemberImage(member.name, member.image_url)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=58111a,eab308&textColor=ffffff`;
                          }}
                          alt={member.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      </div>
                      <span style={{ 
                        background: 'rgba(88, 17, 26, 0.06)', 
                        color: '#58111A', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '2rem', 
                        fontSize: '0.7rem', 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        marginBottom: '0.75rem' 
                      }}>
                        {member.role || 'Steering Member'}
                      </span>
                      <h4 style={{ fontSize: '1.15rem', color: '#58111A', fontWeight: 800, margin: '0 0 0.5rem' }}>{member.name}</h4>
                      <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{renderFormattedDesc(member.desc)}</p>
                    </div>
                  ))}
              </div>
            )}

            {committeeTab === 'organizing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                  {/* Subcommittee Buttons: Desktop Layout */}
                  <div className="desktop-subcommittee-nav" style={{ flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem', width: '100%', alignItems: 'center' }}>
                    {/* Row 1 */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
                      {SUBCOMMITTEES.slice(0, 7).map((group) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => setActiveSubcommittee(group.id)}
                          className="subcommittee-btn"
                          style={{
                            background: activeSubcommittee === group.id ? '#58111A' : '#ffffff',
                            color: activeSubcommittee === group.id ? '#ffffff' : '#64748b',
                            border: '1px solid #e2e8f0',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            padding: '0.45rem 1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minWidth: '120px'
                          }}
                        >
                          {group.label}
                        </button>
                      ))}
                    </div>
                    
                    {/* Row 2 */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
                      {SUBCOMMITTEES.slice(7).map((group) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => setActiveSubcommittee(group.id)}
                          className="subcommittee-btn"
                          style={{
                            background: activeSubcommittee === group.id ? '#58111A' : '#ffffff',
                            color: activeSubcommittee === group.id ? '#ffffff' : '#64748b',
                            border: '1px solid #e2e8f0',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            padding: '0.45rem 1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minWidth: '120px'
                          }}
                        >
                          {group.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subcommittee Dropdown: Mobile Layout */}
                  <div className="mobile-subcommittee-nav" style={{ width: '100%', maxWidth: '320px', margin: '0 auto 2rem', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => setSubcommitteeDropdownOpen(!subcommitteeDropdownOpen)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1.25rem',
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '0.5rem',
                        color: '#58111A',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span>
                        {SUBCOMMITTEES.find(g => g.id === activeSubcommittee)?.label || 'Patrons'}
                      </span>
                      <ChevronDown size={18} style={{ marginLeft: 'auto' }} />
                    </button>

                    <AnimatePresence>
                      {subcommitteeDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: 'absolute',
                            top: '105%',
                            left: 0,
                            right: 0,
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '0.5rem',
                            zIndex: 10,
                            maxHeight: '300px',
                            overflowY: 'auto',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {SUBCOMMITTEES.map((group) => (
                            <button
                              key={group.id}
                              type="button"
                              onClick={() => {
                                setActiveSubcommittee(group.id);
                                setSubcommitteeDropdownOpen(false);
                              }}
                              style={{
                                width: '100%',
                                padding: '0.75rem 1.25rem',
                                background: activeSubcommittee === group.id ? 'rgba(88, 17, 26, 0.08)' : 'transparent',
                                border: 'none',
                                color: '#58111A',
                                textAlign: 'left',
                                fontSize: '0.9rem',
                                fontWeight: activeSubcommittee === group.id ? 700 : 500,
                                cursor: 'pointer',
                                display: 'block',
                                borderBottom: '1px solid #cbd5e1'
                              }}
                            >
                              {group.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Active Panel Members Grid */}
                  <div className="centered-flex-grid" style={{ gap: '2rem', justifyContent: 'center' }}>
                    {committeeMembers
                      .filter((member) => {
                        if (member.category !== 'organizing') return false;
                        switch (activeSubcommittee) {
                          case 'patrons':
                            return member.role === 'Chief Patron' || member.role === 'Patron';
                          case 'general-chairs':
                            return member.role === 'General Chair';
                          case 'executive':
                            return member.role === 'Conference Chair' || member.role === 'Conference Chair & Organizing Secretary' || member.role === 'Session Chair';
                          case 'finance':
                            return member.role === 'Program and Finance Chair' || member.role === 'Finance Committee Member' || member.role === 'Program and Finance Committee Member';
                          case 'publication':
                            return member.role === 'Publication Chair' || member.role === 'Publication Committee Member';
                          case 'arrangements':
                            return member.role === 'Local Arrangements Chair' || member.role === 'Local Arrangements Committee Member';
                          case 'registration':
                            return member.role === 'Registration Chair' || member.role === 'Registration Committee Member';
                          case 'tutorials':
                            return member.role === 'Conference Pre-Tutorial Sessions Chair' || member.role === 'Pre-Tutorial Sessions Committee Member';
                          case 'review':
                            return member.role === 'Technical Review Committee Convener' || member.role === 'Technical Review Committee Member';
                          case 'outreach':
                            return member.role === 'Outreach and Promotion Committee Convener' || member.role === 'Outreach and Promotion Committee Member';
                          case 'website':
                            return member.role === 'Website and Social Media Promotion Committee Chair' || member.role === 'Website and Social Media Promotion Committee Member';
                          case 'hospitality':
                            return member.role === 'Hospitality Committee Convener' || member.role === 'Hospitality Committee Member';
                          case 'members':
                            return member.role === 'Member' || !member.role;
                          default:
                            return false;
                        }
                      })
                      .map((member, mIdx) => (
                        <div 
                          key={mIdx} 
                          className="committee-profile-card"
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '1.5rem',
                            padding: '2.25rem 2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            width: '280px',
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <div style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            border: '2px solid #eab308',
                            padding: '4px',
                            marginBottom: '1.25rem',
                            overflow: 'hidden',
                            background: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <img 
                              src={getMemberImage(member.name, member.image_url)}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=58111a,eab308&textColor=ffffff`;
                              }}
                              alt={member.name}
                              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          </div>
                          <span style={{ 
                            background: 'rgba(88, 17, 26, 0.06)', 
                            color: '#58111A', 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '2rem', 
                            fontSize: '0.7rem', 
                            fontWeight: 800, 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.05em',
                            marginBottom: '0.75rem' 
                          }}>
                            {member.role && member.role !== 'Member' ? member.role : 'Organizing Member'}
                          </span>
                          <h4 style={{ fontSize: '1.15rem', color: '#58111A', fontWeight: 800, margin: '0 0 0.5rem' }}>{member.name}</h4>
                          <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{renderFormattedDesc(member.desc)}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {committeeTab === 'advisory' && (
              <div className="centered-flex-grid" style={{ gap: '2rem', justifyContent: 'center' }}>
                {committeeMembers
                  .filter(m => m.category === 'advisory')
                  .map((adviser, index) => (
                    <div 
                      key={index} 
                      className="committee-profile-card"
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '1.5rem',
                        padding: '2.25rem 2rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        width: '280px',
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.03)',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <div style={{
                        width: '140px',
                        height: '140px',
                        borderRadius: '50%',
                        border: '2px solid #eab308',
                        padding: '4px',
                        marginBottom: '1.25rem',
                        overflow: 'hidden',
                        background: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <img 
                          src={getMemberImage(adviser.name, adviser.image_url)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(adviser.name)}&backgroundColor=58111a,eab308&textColor=ffffff`;
                          }}
                          alt={adviser.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      </div>
                      <span style={{ 
                        background: 'rgba(88, 17, 26, 0.06)', 
                        color: '#58111A', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '2rem', 
                        fontSize: '0.7rem', 
                        fontWeight: 800, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.05em',
                        marginBottom: '0.75rem' 
                      }}>
                        {adviser.role || 'Advisory Member'}
                      </span>
                      <h4 style={{ fontSize: '1.15rem', color: '#58111A', fontWeight: 800, margin: '0 0 0.5rem' }}>{adviser.name}</h4>
                      <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{renderFormattedDesc(adviser.desc)}</p>
                    </div>
                  ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
