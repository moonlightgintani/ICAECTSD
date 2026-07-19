import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText } from 'lucide-react';

interface GuidelinesPageProps {
  info: Record<string, string>;
  onBackToHome: () => void;
}

export default function GuidelinesPage({ info, onBackToHome }: GuidelinesPageProps) {
  const [submissionTab, setSubmissionTab] = useState<'initial' | 'camera-ready'>('initial');

  return (
    <div style={{ padding: 'calc(7rem + var(--banner-height, 0px)) 1.5rem 6rem', minHeight: '80vh', background: 'var(--bg-deep)' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontSize: '0.9rem' }}>
          <button 
            onClick={onBackToHome} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#3b82f6', 
              cursor: 'pointer', 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.35rem',
              padding: 0
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>Guidelines</span>
        </div>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>
            {info.guidelines_badge || 'POLICIES'}
          </span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginTop: '0.5rem', fontWeight: 800 }}>
            {info.guidelines_title || 'Author Guidelines'}
          </h2>
          <div style={{ height: '3px', width: '60px', background: '#3b82f6', margin: '1rem auto 0' }} />
        </div>

        {/* 2. Instructions and CMT Procedures */}
        <div className="grid-2-col" style={{ gap: '2rem' }}>
          {/* Left Card: General Instructions */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', fontWeight: 700 }}>
              Instructions for Authors
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.95rem', color: 'var(--text-secondary)', padding: 0, margin: 0 }}>
              {[
                "The maximum length of the paper for review is 6 pages, including figures, tables, and references. The maximum file size allowed is 10 MB in PDF format without encryption and/or passwords.",
                "Papers of poor quality and/or high similarity index will be rejected during the initial screening process without review.",
                "Use only the IEEE standard two-column conference paper Microsoft Word template.",
                "The paper will be peer-reviewed by domain experts of the respective tracks.",
                "Authors should submit the papers through Microsoft Conference Management Toolkit (CMT).",
                "Kindly do not submit the paper multiple times, as it may lead to the cancellation of your paper."
              ].map((inst, idx) => (
                <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', lineHeight: '1.6' }}>
                  <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '-2px' }}>•</span>
                  <span>{inst}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Card: CMT Procedure Toggler */}
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--text-primary)', fontWeight: 700, margin: 0 }}>
                CMT Submission Portal
              </h3>
              <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '1.5rem', padding: '0.25rem', border: '1px solid #cbd5e1' }}>
                <button 
                  onClick={() => setSubmissionTab('initial')}
                  className={`committee-tab-btn ${submissionTab === 'initial' ? 'active' : 'inactive'}`}
                  style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem', borderRadius: '1.5rem', border: 'none', cursor: 'pointer' }}
                >
                  Initial Submission
                </button>
                <button 
                  onClick={() => setSubmissionTab('camera-ready')}
                  className={`committee-tab-btn ${submissionTab === 'camera-ready' ? 'active' : 'inactive'}`}
                  style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem', borderRadius: '1.5rem', border: 'none', cursor: 'pointer' }}
                >
                  Camera-Ready
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={submissionTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {submissionTab === 'initial' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 700 }}>
                      Procedure for Uploading Papers:
                    </span>
                    <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      <li>
                        Go to paper submission website: <a href={info.cmt_link || "https://cmt3.research.microsoft.com/aectsd2025"} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>{info.cmt_link || "https://cmt3.research.microsoft.com/aectsd2025"}</a>.
                      </li>
                      <li>If you are new to the system, please choose "Register" at the bottom of the dialog box. Create a new account with a user ID and Password.</li>
                      <li>Log in to CMT with your user ID and Password.</li>
                      <li>Select "All Conferences" and choose the conference.</li>
                      <li>Click the Conference Name link.</li>
                      <li>On the Author Console page, click <strong>+ Create new submission</strong>.</li>
                      <li>Fill out the required fields, including the title, abstract, authors, subject areas, and email IDs of all the co-authors.</li>
                      <li>Upload your paper and other files (if needed).</li>
                      <li>Click “Submit” to submit your paper.</li>
                    </ol>
                    <button
                      onClick={() => window.open(info.cmt_link || "https://cmt3.research.microsoft.com/aectsd2025", "_blank")}
                      className="btn btn-primary"
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: '1.5rem',
                        padding: '0.8rem 2rem',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #58111A 0%, #7d1c26 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(88, 17, 26, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FileText size={16} style={{ color: '#fbbf24' }} />
                      Submit Initial Manuscript (CMT)
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 700 }}>
                      Submitting Camera-Ready Version:
                    </span>
                    <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      <li>Go to the Author Console in CMT.</li>
                      <li>Click the <strong>Create Camera Ready Submission</strong> link.</li>
                      <li>Edit the title, abstract, and author information.</li>
                      <li>Upload the camera-ready file.</li>
                      <li>Answer any additional questions.</li>
                      <li>Click “Submit” to submit your paper.</li>
                    </ol>
                    <button
                      onClick={() => window.open(info.cmt_link || "https://cmt3.research.microsoft.com/aectsd2025", "_blank")}
                      className="btn btn-primary"
                      style={{
                        alignSelf: 'flex-start',
                        marginTop: '1.5rem',
                        padding: '0.8rem 2rem',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #58111A 0%, #7d1c26 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(88, 17, 26, 0.25)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <FileText size={16} style={{ color: '#fbbf24' }} />
                      Submit Camera-Ready Manuscript (CMT)
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
