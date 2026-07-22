import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

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
  getMemberImage?: (name: string, imageUrl?: string) => string;
  onBackToHome: () => void;
}

export const renderFormattedDesc = (descText: string | undefined | null) => {
  if (!descText) return '';
  // Clean raw escape characters if present
  let cleanedText = descText
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
    .replace(/\\/g, '')
    .replace(/\bnice\b/gi, '');

  const phrases = [
    "SNR Sons Charitable Trust",
    "Sri Ramakrishna Engineering College",
    "Professor & Head - AI&DS",
    "Professor & Head - AI & DS",
    "Professor & Head - Artificial Intelligence and Data Science",
    "Organizing Secretary, Professor & Head - AI&DS",
    "Organizing Secretary, Professor & Head - AI & DS",
    "Chairman, IEEE Madras Section"
  ];
  const regex = new RegExp(`(${phrases.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = cleanedText.split(regex);
  return (
    <span style={{ display: 'block', width: '100%', wordBreak: 'normal', textAlign: 'center', lineHeight: 1.45 }}>
      {parts.map((part, index) => {
        if (phrases.includes(part)) {
          return (
            <span key={index} style={{ fontWeight: 600, color: '#0f172a', display: 'inline-block', whiteSpace: 'nowrap' }}>
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};

const getMemberImage = (name: string, imageUrl?: string): string => {
  if (imageUrl && imageUrl !== 'no_file' && imageUrl !== '') {
    return imageUrl;
  }
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0b4f30,eab308&textColor=ffffff`;
};

export default function CommitteePage({ committeeMembers, info, getMemberImage: getMemberImageProp, onBackToHome }: CommitteePageProps) {
  const resolveMemberImage = getMemberImageProp || getMemberImage;
  const [committeeTab, setCommitteeTab] = useState<'steering' | 'organizing' | 'advisory'>('organizing');
  const [activeSubcommittee, setActiveSubcommittee] = useState<string>('patrons');

  const SUBCOMMITTEES = [
    { id: 'patrons', label: 'Patrons' },
    { id: 'general-chairs', label: 'General Chairs' },
    { id: 'executive', label: 'Executive' },
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

  // IntersectionObserver for auto-highlighting tabs while scrolling
  useEffect(() => {
    if (committeeTab !== 'organizing') return;

    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -75% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id.replace('sub-', '');
          setActiveSubcommittee(id);
        }
      });
    }, observerOptions);

    SUBCOMMITTEES.forEach((sub) => {
      const element = document.getElementById(`sub-${sub.id}`);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [committeeTab, committeeMembers]);

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
              color: '#0b4f30', 
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
          <h2 style={{ fontSize: '2.5rem', color: '#0b4f30', fontWeight: 800, margin: 0 }}>
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
                background: committeeTab === tab.id ? '#0b4f30' : '#ffffff',
                color: committeeTab === tab.id ? '#ffffff' : '#0b4f30',
                border: '1px solid #e2e8f0',
                padding: '0.6rem 1.5rem',
                fontWeight: 700,
                fontSize: '0.9rem',
                borderRadius: '30px',
                cursor: 'pointer',
                boxShadow: committeeTab === tab.id ? '0 4px 12px rgba(11, 79, 48, 0.15)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Panel Subtitle */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.45rem', color: '#0b4f30', fontWeight: 800, margin: 0 }}>
            {committeeTab === 'organizing' 
              ? 'Organizing Committee'
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', justifyContent: 'center' }}>
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
                        padding: '2rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        width: '100%',
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
                          src={resolveMemberImage(member.name, member.image_url)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=0b4f30,eab308&textColor=ffffff`;
                          }}
                          alt={member.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      </div>
                      <h4 style={{ fontSize: '1.2rem', color: '#0b4f30', fontWeight: 800, margin: '0 0 0.75rem' }}>{member.name}</h4>
                      <div style={{ color: '#475569', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', lineHeight: '1.4' }}>
                        {member.role && member.role !== 'Steering Member' && (
                          <div style={{ fontWeight: 700, color: '#091d36' }}>{member.role}</div>
                        )}
                        <div style={{ fontWeight: 500 }}>{renderFormattedDesc(member.desc)}</div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {committeeTab === 'organizing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
                  {/* All Subcommittees Rendered Vertically Stacked */}

                  {/* All Subcommittees Rendered Vertically Stacked (Scrollable) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', width: '100%' }}>
                    {SUBCOMMITTEES.map((sub) => {
                      const members = committeeMembers.filter((member) => {
                        if (member.category !== 'organizing') return false;
                        const role = (member.role || '').toLowerCase();
                        switch (sub.id) {
                          case 'patrons':
                            return role.includes('patron');
                          case 'general-chairs':
                            return role.includes('general chair') || role.includes('general co-chair');
                          case 'executive':
                            return role.includes('executive') || role.includes('organizing chair') || role.includes('organizing co-chair') || role.includes('organizing secretary') || role.includes('joint secretary') || role.includes('session chair') || role.includes('convenor') || role.includes('conference chair') || role.includes('co-convenor') || role.includes('finance');
                           case 'publication':
                            return role.includes('publication');
                          case 'arrangements':
                            return role.includes('arrangement') || role.includes('reception') || role.includes('local arrangements') || role.includes('venue');
                          case 'registration':
                            return role.includes('registration');
                          case 'tutorials':
                            return role.includes('tutorial') || role.includes('workshop');
                          case 'review':
                            return role.includes('review') || role.includes('scrutiny');
                          case 'outreach':
                            return role.includes('outreach') || role.includes('promotion') || role.includes('publicity');
                          case 'website':
                            return role.includes('website') || role.includes('social media');
                          case 'hospitality':
                            return role.includes('hospitality');
                          case 'members':
                            return role === 'member' || role === '';
                          default:
                            return false;
                        }
                      });

                      if (members.length === 0) return null;

                      return (
                        <div 
                          key={sub.id} 
                          id={`sub-${sub.id}`} 
                          style={{ 
                            scrollMarginTop: '120px',
                            background: 'rgba(255, 255, 255, 0.45)',
                            borderRadius: '2rem',
                            padding: '2.5rem 1.5rem',
                            border: '1px solid rgba(11, 79, 48, 0.04)',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.01)'
                          }}
                        >
                          <h4 style={{ 
                            fontSize: '1.45rem', 
                            color: '#0b4f30', 
                            fontWeight: 800, 
                            textAlign: 'center', 
                            marginBottom: '2rem' 
                          }}>
                            {sub.id === 'patrons' || sub.id === 'general-chairs' 
                              ? `The ${sub.label}`
                              : sub.label.endsWith('Committee') 
                                ? `The ${sub.label}` 
                                : `The ${sub.label} Committee`}
                          </h4>

                          {sub.id === 'general-chairs' ? (
                            /* General Chairs: Horizontal Card Layout (Left Pic, Right Details) */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
                              {members.map((member, mIdx) => (
                                <div 
                                  key={mIdx} 
                                  className="committee-profile-card"
                                  style={{
                                    background: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '1.5rem',
                                    padding: '2rem 2.5rem',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '2rem',
                                    textAlign: 'left',
                                    width: '100%',
                                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
                                    transition: 'all 0.3s ease'
                                  }}
                                >
                                  <div style={{
                                    width: '140px',
                                    height: '140px',
                                    borderRadius: '50%',
                                    border: '3px solid #eab308',
                                    padding: '4px',
                                    overflow: 'hidden',
                                    background: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                  }}>
                                    <img 
                                      src={resolveMemberImage(member.name, member.image_url)}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=0b4f30,eab308&textColor=ffffff`;
                                      }}
                                      alt={member.name}
                                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <h4 style={{ fontSize: '1.4rem', color: '#0b4f30', fontWeight: 800, margin: 0 }}>{member.name}</h4>
                                    {member.role && (
                                      <div style={{ fontWeight: 700, color: '#091d36', fontSize: '1rem' }}>{member.role}</div>
                                    )}
                                    <div style={{ color: '#475569', fontSize: '0.92rem', fontWeight: 500, lineHeight: '1.5' }}>
                                      {renderFormattedDesc(member.desc)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            /* Other Subcommittees: 4-Column Vertical Cards */
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', justifyContent: 'center' }}>
                              {members.map((member, mIdx) => (
                                <div 
                                  key={mIdx} 
                                  className="committee-profile-card"
                                  style={{
                                    background: '#ffffff',
                                    border: '1px solid #cbd5e1',
                                    borderRadius: '1.5rem',
                                    padding: '2rem 1.5rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    width: '100%',
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
                                      src={resolveMemberImage(member.name, member.image_url)}
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}&backgroundColor=0b4f30,eab308&textColor=ffffff`;
                                      }}
                                      alt={member.name}
                                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                  </div>
                                  <h4 style={{ fontSize: '1.2rem', color: '#0b4f30', fontWeight: 800, margin: '0 0 0.75rem' }}>{member.name}</h4>
                                  <div style={{ color: '#475569', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', lineHeight: '1.4' }}>
                                    {member.role && member.role !== 'Organizing Member' && member.role !== 'Member' && (
                                      <div style={{ fontWeight: 700, color: '#091d36' }}>{member.role}</div>
                                    )}
                                    <div style={{ fontWeight: 500 }}>{renderFormattedDesc(member.desc)}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {committeeTab === 'advisory' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', justifyContent: 'center' }}>
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
                        padding: '2rem 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        width: '100%',
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
                          src={resolveMemberImage(adviser.name, adviser.image_url)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(adviser.name)}&backgroundColor=0b4f30,eab308&textColor=ffffff`;
                          }}
                          alt={adviser.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      </div>
                      <h4 style={{ fontSize: '1.2rem', color: '#0b4f30', fontWeight: 800, margin: '0 0 0.75rem' }}>{adviser.name}</h4>
                      <div style={{ color: '#475569', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', lineHeight: '1.4' }}>
                        {adviser.role && adviser.role !== 'Advisory Member' && (
                          <div style={{ fontWeight: 700, color: '#091d36' }}>{adviser.role}</div>
                        )}
                        <div style={{ fontWeight: 500 }}>{renderFormattedDesc(adviser.desc)}</div>
                      </div>
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
