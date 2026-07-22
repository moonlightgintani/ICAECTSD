import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Download, FileText } from 'lucide-react';

interface PaymentPageProps {
  info: Record<string, string>;
  pricing: any;
  isSupabaseConfigured: boolean;
  supabase: any;
  fetchDbData: () => Promise<void>;

  initialTab?: 'submission' | 'fees' | 'form';

  // Registration States passed from App.tsx
  regPaperId: string;
  setRegPaperId: (val: string) => void;
  regPaperTitle: string;
  setRegPaperTitle: (val: string) => void;
  regAuthorName: string;
  setRegAuthorName: (val: string) => void;
  regEmail: string;
  setRegEmail: (val: string) => void;
  regPhone: string;
  setRegPhone: (val: string) => void;
  regPhoneCode: string;
  setRegPhoneCode: (val: string) => void;
  regScreenshot: File | null;
  setRegScreenshot: (file: File | null) => void;
  regPaymentUrl: string;
  setRegPaymentUrl: (val: string) => void;
  regRegisterForTour: boolean;
  setRegRegisterForTour: (val: boolean) => void;
  regPreferredTourPlace: string;
  setRegPreferredTourPlace: (val: string) => void;
  regSuccess: boolean;
  setRegSuccess: (val: boolean) => void;
  regError: string | null;
  setRegError: (val: string | null) => void;
  regSubmitting: boolean;
  setRegSubmitting: (val: boolean) => void;
  showRegValidation: boolean;
  setShowRegValidation: (val: boolean) => void;
  paymentTab: 'bank' | 'online';
  setPaymentTab: (val: 'bank' | 'online') => void;

  // State from App.tsx that controls Calculator
  isIndian: boolean;
  setIsIndian: (val: boolean) => void;
  isStudent: boolean;
  setIsStudent: (val: boolean) => void;
  isIeeeMember: boolean;
  setIsIeeeMember: (val: boolean) => void;
  isLate: boolean;
  setIsLate: (val: boolean) => void;
  pageCount: number;
  setPageCount: (val: number) => void;
  workshopAddon: boolean;
  setWorkshopAddon: (val: boolean) => void;
  virtualMode: boolean;
  setVirtualMode: (val: boolean) => void;
  regOption: 'conference' | 'tutorial' | 'both' | 'listener';
  setRegOption: (val: 'conference' | 'tutorial' | 'both' | 'listener') => void;

  handleRegistrationSubmit: (e: React.FormEvent) => Promise<void>;
  calculateTotalFees: () => {
    baseFee: number;
    penalty: number;
    extraPageFee: number;
    workshopFee: number;
    virtualFee: number;
    total: number;
    currencySymbol: string;
    currency: string;
  };
  onBackToHome: () => void;
}

export default function PaymentPage({
  info,
  pricing: _pricing,
  isSupabaseConfigured: _isSupabaseConfigured,
  supabase: _supabase,
  fetchDbData: _fetchDbData,

  initialTab = 'submission',

  regPaperId,
  setRegPaperId,
  regPaperTitle,
  setRegPaperTitle,
  regAuthorName,
  setRegAuthorName,
  regEmail,
  setRegEmail,
  regPhone,
  setRegPhone,
  regPhoneCode,
  setRegPhoneCode,
  regScreenshot,
  setRegScreenshot,
  regPaymentUrl,
  setRegPaymentUrl,
  regRegisterForTour,
  setRegRegisterForTour,
  regPreferredTourPlace,
  setRegPreferredTourPlace,
  regSuccess,
  setRegSuccess,
  regError,
  setRegError: _setRegError,
  regSubmitting,
  setRegSubmitting: _setRegSubmitting,
  showRegValidation,
  setShowRegValidation,
  paymentTab,
  setPaymentTab,

  isIndian,
  setIsIndian,
  isStudent,
  setIsStudent,
  isIeeeMember,
  setIsIeeeMember,
  isLate,
  setIsLate,
  pageCount,
  setPageCount,
  workshopAddon,
  setWorkshopAddon,
  virtualMode,
  setVirtualMode,
  regOption,
  setRegOption,

  handleRegistrationSubmit,
  calculateTotalFees,
  onBackToHome
}: PaymentPageProps) {
  // Portal tabs and submission guidelines states
  const [portalTab, setPortalTab] = useState<'submission' | 'fees' | 'form'>(initialTab);
  const [submissionTab, setSubmissionTab] = useState<'initial' | 'camera-ready'>('initial');

  useEffect(() => {
    if (initialTab) {
      setPortalTab(initialTab);
    }
  }, [initialTab]);

  // Local Mock checkout states
  const [onlineSuccess, setOnlineSuccess] = useState<boolean>(false);
  const [onlinePaying, setOnlinePaying] = useState<boolean>(false);
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [selectedUpi, setSelectedUpi] = useState<string | null>(null);
  const [upiId, setUpiId] = useState<string>('');

  const bill = calculateTotalFees();

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
          <span style={{ color: 'var(--text-secondary)' }}>Registration</span>
        </div>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: '#0f52ba', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.12em' }}>
            AUTHOR PORTAL
          </span>
          <h2 style={{ fontSize: '2.5rem', color: '#091d36', marginTop: '0.5rem', fontWeight: 800 }}>
            {portalTab === 'submission' ? 'Call for Papers & Submission' : portalTab === 'fees' ? 'Registration Guidelines & Fees' : 'Register & Pay'}
          </h2>
          <div style={{ height: '3px', width: '60px', background: '#fbbf24', margin: '1rem auto 0' }} />
        </div>

        {/* Unified Tab Switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', background: '#f1f5f9', borderRadius: '2rem', padding: '0.3rem', border: '1px solid #cbd5e1', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}>
            {[
              { id: 'submission', label: 'Call for Papers & CMT' },
              { id: 'fees', label: 'Guidelines & Fees' },
              { id: 'form', label: 'Registration & Payment' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setPortalTab(t.id as any)}
                style={{
                  padding: '0.6rem 1.75rem',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  borderRadius: '1.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  background: portalTab === t.id ? 'linear-gradient(135deg, #091d36 0%, #0f52ba 100%)' : 'transparent',
                  color: portalTab === t.id ? '#ffffff' : '#64748b',
                  transition: 'all 0.25s ease'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {portalTab === 'submission' && (
          <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '850px', margin: '0 auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', color: '#091d36', fontWeight: 800, margin: 0 }}>Manuscript Submission</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0.25rem 0 0' }}>Follow the step-by-step instructions below to submit your manuscript on CMT.</p>
              </div>

              {/* Sub-tabs for submission type */}
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

            {submissionTab === 'initial' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <span style={{ fontSize: '0.95rem', color: '#d97706', fontWeight: 700 }}>
                  Procedure for Uploading Papers:
                </span>
                <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <li>
                    Go to paper submission website: <a href={info.cmt_link || "https://cmt3.research.microsoft.com/aectsd2025"} target="_blank" rel="noopener noreferrer" style={{ color: '#0f52ba', textDecoration: 'underline', fontWeight: 600 }}>{info.cmt_link || "https://cmt3.research.microsoft.com/aectsd2025"}</a>.
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
                    padding: '0.85rem 2.25rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #0b4f30 0%, #198754 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(11, 79, 48, 0.25)',
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <span style={{ fontSize: '0.95rem', color: '#d97706', fontWeight: 700 }}>
                  Submitting Camera-Ready Version:
                </span>
                <ol style={{ paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
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
                    padding: '0.85rem 2.25rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #0b4f30 0%, #198754 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(11, 79, 48, 0.25)',
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
          </div>
        )}

        {portalTab === 'fees' && (
          <>
            {/* Registration Details & Guidelines Card */}
            <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '3rem', textAlign: 'left' }}>
              <h3 style={{ fontSize: '1.6rem', color: '#091d36', marginBottom: '1.25rem', fontWeight: 800 }}>Registration Details</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                At least one author of each accepted paper must complete the registration by paying the appropriate conference fee in order for the paper to be included in the IEEE AECTSD 2026 conference program and submitted for publication in IEEE Xplore (subject to compliance with IEEE quality standards and presentation at the conference).
              </p>

              <h4 style={{ fontSize: '1.25rem', color: '#091d36', marginBottom: '1rem', fontWeight: 700 }}>Registration Guidelines</h4>
              <ul style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: 0 }}>
                <li><strong>Eligibility for IEEE Xplore:</strong> Only registered and presented papers will be considered for IEEE Xplore Digital Library.</li>
                <li>Each full registration covers one (1) paper with a maximum of 6 pages.</li>
                <li>A maximum of 2 additional pages can be included with an overlength fee of ₹1000 / $18 per extra page.</li>
                <li>Registration fees are non-refundable under any circumstances.</li>
                <li>Authors must retain a copy of the payment transaction ID or receipt for use during the registration process.</li>
                <li>Authors registering under IEEE Member or Student categories must upload a valid IEEE membership card or student ID respectively.</li>
              </ul>
            </div>

            {/* Tables Side-by-Side */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              {/* Indian Delegates Table */}
              <div className="glass-card" style={{ flex: '1 1 480px', padding: '2rem', minWidth: '0' }}>
                <h3 style={{ fontSize: '1.35rem', color: '#091d36', marginBottom: '1.25rem', fontWeight: 800 }}>
                  Indian Delegates (Fees in INR, GST Inclusive)
                </h3>
                <div className="registration-table-container" style={{ width: '100%', overflowX: 'auto' }}>
                  <table className="registration-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', width: '40%' }}>Category</th>
                        <th style={{ textAlign: 'center' }}>Early Bird</th>
                        <th style={{ textAlign: 'center' }}>Regular</th>
                        <th style={{ textAlign: 'center' }}>Late</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'left', fontWeight: 600 }}>IEEE Student Member</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0b4f30' }}>₹9,000</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f52ba' }}>₹10,000</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#b91c1c' }}>₹11,000</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', fontWeight: 600 }}>Non-IEEE Student Member</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0b4f30' }}>₹10,000</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f52ba' }}>₹11,000</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#b91c1c' }}>₹12,000</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', fontWeight: 600 }}>IEEE Member</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0b4f30' }}>₹10,000</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f52ba' }}>₹11,000</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#b91c1c' }}>₹12,000</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', fontWeight: 600 }}>Non-IEEE Member</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0b4f30' }}>₹11,000</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f52ba' }}>₹12,000</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#b91c1c' }}>₹13,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Foreign Delegates Table */}
              <div className="glass-card" style={{ flex: '1 1 480px', padding: '2rem', minWidth: '0' }}>
                <h3 style={{ fontSize: '1.35rem', color: '#091d36', marginBottom: '1.25rem', fontWeight: 800 }}>
                  Foreign Delegates (Fees in USD, GST Inclusive)
                </h3>
                <div className="registration-table-container" style={{ width: '100%', overflowX: 'auto' }}>
                  <table className="registration-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', width: '40%' }}>Category</th>
                        <th style={{ textAlign: 'center' }}>Early Bird</th>
                        <th style={{ textAlign: 'center' }}>Regular</th>
                        <th style={{ textAlign: 'center' }}>Late</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'left', fontWeight: 600 }}>IEEE Student Member</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0b4f30' }}>USD 150</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f52ba' }}>USD 175</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#b91c1c' }}>USD 200</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', fontWeight: 600 }}>Non-IEEE Student Member</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0b4f30' }}>USD 200</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f52ba' }}>USD 225</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#b91c1c' }}>USD 250</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', fontWeight: 600 }}>IEEE Member</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0b4f30' }}>USD 200</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f52ba' }}>USD 225</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#b91c1c' }}>USD 250</td>
                      </tr>
                      <tr>
                        <td style={{ textAlign: 'left', fontWeight: 600 }}>Non-IEEE Member</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0b4f30' }}>USD 250</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#0f52ba' }}>USD 275</td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: '#b91c1c' }}>USD 300</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bank Account Details */}
            <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}>
              <h3 style={{ fontSize: '1.4rem', color: '#091d36', marginBottom: '0.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#0f52ba', fontSize: '1.5rem', fontWeight: 900 }}>$</span> Bank Account Details
              </h3>
              <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.5', textAlign: 'left' }}>
                Please find the official banking channels to process registration fees. Bank transfer references must include your Paper ID.
              </p>

              <div className="grid-2-col" style={{ gap: '2.5rem', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { label: 'Account Name', value: 'Sri Ramakrishna Engineering College - AECTSD' },
                      { label: 'Bank Name', value: 'ICICI Bank, Coimbatore' },
                      { label: 'Account Number', value: '058705008310' },
                      { label: 'IFSC Code', value: 'ICIC0000587' },
                      { label: 'Branch Location', value: 'SREC Campus Branch, Coimbatore' }
                    ].map((row, rIdx) => (
                      <div
                        key={rIdx}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingBottom: '0.75rem',
                          borderBottom: rIdx < 4 ? '1px solid #e2e8f0' : 'none',
                          gap: '1rem'
                        }}
                      >
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', flexShrink: 0 }}>{row.label}</span>
                        <span style={{ color: '#1e293b', fontSize: '0.95rem', fontWeight: 500, textAlign: 'right' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: '#fffbeb',
                    border: '1px solid #fef3c7',
                    borderRadius: '1rem',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    textAlign: 'left'
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', color: '#b45309', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                    IMPORTANT PAYMENT NOTE
                  </h4>
                  <p style={{ color: '#78350f', fontSize: '0.92rem', lineHeight: '1.6', margin: 0, fontWeight: 500 }}>
                    Please include your Paper ID in the payment reference. Once the wire transfer transaction completes successfully, authors are requested to upload the scanned payment receipt copy in the registration form.
                  </p>
                </div>
              </div>
            </div>

            {/* Note & Action card linking to form */}
            <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem', border: '1px solid rgba(15, 82, 186, 0.2)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(217, 119, 6, 0.1)', color: '#d97706', padding: '0.5rem 1.25rem', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 700 }}>
                <span>⏳</span> Important: Registration window closes on 10 November 2026.
              </div>

              <h4 style={{ fontSize: '1.4rem', color: '#091d36', fontWeight: 800, margin: 0 }}>Ready to Proceed?</h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '550px', margin: 0, lineHeight: '1.5' }}>
                Click the button below to open the dynamic registration calculator, select your options, and securely submit your details.
              </p>

              <button
                onClick={() => setPortalTab('form')}
                className="btn btn-primary"
                style={{
                  padding: '0.85rem 2.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #091d36 0%, #0f52ba 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(15, 82, 186, 0.3)'
                }}
              >
                Proceed to Registration
              </button>
            </div>
          </>
        )}

        {portalTab === 'form' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.85rem', color: 'var(--text-primary)', fontWeight: 800 }}>Calculate & Submit Registration</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>Select your options on the left to verify fees, then fill in details and pay on the right.</p>
            </div>

            <div className="grid-2-col" style={{ gap: '2.5rem', alignItems: 'start' }}>
              {/* Left Column: Calculator Panel */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.25rem', fontWeight: 700, borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                  1. Fee Calculator
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Region */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Author Nationality</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setIsIndian(true)}
                        className={`btn ${isIndian ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                      >
                        Indian
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsIndian(false)}
                        className={`btn ${!isIndian ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                      >
                        Foreign
                      </button>
                    </div>
                  </div>

                  {/* Scholar Type */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Profession Category</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setIsStudent(true)}
                        className={`btn ${isStudent ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                      >
                        Student / Scholar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsStudent(false)}
                        className={`btn ${!isStudent ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                      >
                        Professional
                      </button>
                    </div>
                  </div>

                  {/* IEEE Membership */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase' }}>IEEE Membership</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setIsIeeeMember(true)}
                        className={`btn ${isIeeeMember ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                      >
                        IEEE Member
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsIeeeMember(false)}
                        className={`btn ${!isIeeeMember ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem' }}
                      >
                        Non-IEEE Member
                      </button>
                    </div>
                  </div>

                  {/* Registration Option */}
                  <div>
                    <label htmlFor="reg_opt" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Registration Option</label>
                    <select
                      id="reg_opt"
                      value={regOption}
                      onChange={(e) => setRegOption(e.target.value as any)}
                      className="form-input"
                      style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                    >
                      <option value="conference">Conference Only</option>
                      <option value="tutorial">Pre-Conference Tutorial Only</option>
                      <option value="both">Conference + Tutorial Bundle</option>
                      {isIndian && <option value="listener">Non-Author Attendee (Indian Only)</option>}
                    </select>
                  </div>

                  {/* Surcharges & Modifiers */}
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Surcharges & Addons</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <input
                          type="checkbox"
                          checked={isLate}
                          onChange={(e) => setIsLate(e.target.checked)}
                        />
                        <span>Late Registration (after early bird)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <input
                          type="checkbox"
                          checked={virtualMode}
                          onChange={(e) => setVirtualMode(e.target.checked)}
                        />
                        <span>Virtual Presentation Mode Addon</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                        <input
                          type="checkbox"
                          checked={workshopAddon}
                          onChange={(e) => setWorkshopAddon(e.target.checked)}
                        />
                        <span>Pre-Conference Workshop Registration</span>
                      </label>
                    </div>
                  </div>

                  {/* Page Count */}
                  {regOption !== 'tutorial' && regOption !== 'listener' && (
                    <div>
                      <label htmlFor="pg_cnt" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase' }}>Paper Page Count (Base 6 pages Included)</label>
                      <select
                        id="pg_cnt"
                        value={pageCount}
                        onChange={(e) => setPageCount(Number(e.target.value))}
                        className="form-input"
                        style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                      >
                        <option value={6}>6 Pages or fewer</option>
                        <option value={7}>7 Pages (+1 page fee)</option>
                        <option value={8}>8 Pages (+2 pages fee)</option>
                      </select>
                    </div>
                  )}

                  {/* Invoice Summary */}
                  <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Base Option Fee:</span>
                      <span>{bill.currencySymbol}{bill.baseFee}</span>
                    </div>
                    {bill.penalty > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>Late Registration Surcharge:</span>
                        <span>+{bill.currencySymbol}{bill.penalty}</span>
                      </div>
                    )}
                    {bill.extraPageFee > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>Extra Pages Fee ({pageCount} pages):</span>
                        <span>+{bill.currencySymbol}{bill.extraPageFee}</span>
                      </div>
                    )}
                    {bill.workshopFee > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>Pre-Conference Workshop:</span>
                        <span>+{bill.currencySymbol}{bill.workshopFee}</span>
                      </div>
                    )}
                    {bill.virtualFee > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <span>Virtual Presentation Addon:</span>
                        <span>+{bill.currencySymbol}{bill.virtualFee}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #cbd5e1', paddingTop: '0.5rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>
                      <span>Total Due:</span>
                      <span>{bill.currencySymbol}{bill.total} ({bill.currency})</span>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#b45309', lineHeight: '1.4', fontStyle: 'italic', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}>
                      * Note: Registration rates and fees are tentative and subject to final confirmation (under discussion with Dr. K. Balamurugan).
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Submission Panel */}
              <div className="glass-card" style={{ padding: '2rem' }}>
                {/* Sliding Gateway Selector */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.02em', textAlign: 'left' }}>Select Payment Method</label>
                  <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentTab('bank')}
                      style={{
                        flex: 1,
                        background: paymentTab === 'bank' ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-cyan) 100%)' : 'transparent',
                        color: paymentTab === 'bank' ? '#ffffff' : 'var(--text-secondary)',
                        border: 'none',
                        padding: '0.55rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Bank Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentTab('online')}
                      style={{
                        flex: 1,
                        background: paymentTab === 'online' ? 'linear-gradient(135deg, var(--accent) 0%, var(--accent-cyan) 100%)' : 'transparent',
                        color: paymentTab === 'online' ? '#ffffff' : 'var(--text-secondary)',
                        border: 'none',
                        padding: '0.55rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Online Gateway
                    </button>
                  </div>
                </div>

                {/* Forms based on active tab */}
                {paymentTab === 'bank' ? (
                  /* Submission Form (Bank Transfer) */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.35rem', fontWeight: 700 }}>2. Submit Proof of Payment</h4>

                    {regSuccess ? (
                      <div style={{
                        background: 'rgba(34, 197, 94, 0.08)',
                        border: '1px solid rgba(34, 197, 94, 0.25)',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        textAlign: 'center',
                        color: '#22c55e',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}>
                        <CheckCircle size={32} style={{ color: '#22c55e' }} />
                        <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Submitted Successfully!</span>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                          SREC finance coordinators will verify receipt reference AECTSD and send a confirmation email.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setRegSuccess(false);
                            setRegPaperId('');
                            setRegPaperTitle('');
                            setRegAuthorName('');
                            setRegEmail('');
                            setRegPhone('');
                            setRegScreenshot(null);
                            setRegPaymentUrl('');
                            setRegRegisterForTour(false);
                            setRegPreferredTourPlace('');
                            setShowRegValidation(false);
                          }}
                          className="btn btn-secondary"
                          style={{ marginTop: '0.5rem', padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                        >
                          Submit Another
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleRegistrationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div className="grid-2-col" style={{ gap: '0.75rem' }}>
                          <div>
                            <label htmlFor="reg_paper_id" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Paper ID*</label>
                            <input
                              id="reg_paper_id"
                              type="text"
                              required
                              className={`form-input ${showRegValidation && !regPaperId ? 'is-invalid' : ''}`}
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                              placeholder="e.g. AECTSD-104"
                              value={regPaperId}
                              onChange={(e) => setRegPaperId(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="reg_author_name" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Author Name*</label>
                            <input
                              id="reg_author_name"
                              type="text"
                              required
                              className={`form-input ${showRegValidation && !regAuthorName ? 'is-invalid' : ''}`}
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                              placeholder="Enter full name"
                              value={regAuthorName}
                              onChange={(e) => setRegAuthorName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="reg_paper_title" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Paper Title*</label>
                          <input
                            id="reg_paper_title"
                            type="text"
                            required
                            className={`form-input ${showRegValidation && !regPaperTitle ? 'is-invalid' : ''}`}
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                            placeholder="e.g. A Secure VLSI Implementation for IoT Nodes"
                            value={regPaperTitle}
                            onChange={(e) => setRegPaperTitle(e.target.value)}
                          />
                        </div>

                        <div className="grid-2-col" style={{ gap: '0.75rem' }}>
                          <div>
                            <label htmlFor="reg_email" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Email Address*</label>
                            <input
                              id="reg_email"
                              type="email"
                              required
                              className={`form-input ${showRegValidation && !regEmail ? 'is-invalid' : ''}`}
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                              placeholder="name@institution.edu"
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                            />
                          </div>
                          <div>
                            <label htmlFor="reg_phone" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Phone Number*</label>
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                              <select
                                aria-label="Country Code"
                                value={regPhoneCode}
                                onChange={(e) => setRegPhoneCode(e.target.value)}
                                className="form-input"
                                style={{ width: '80px', padding: '0.4rem 0.25rem', fontSize: '0.8rem', flexShrink: 0 }}
                              >
                                <option value="+91">+91 (IN)</option>
                                <option value="+1">+1 (US)</option>
                                <option value="+44">+44 (UK)</option>
                                <option value="+61">+61 (AU)</option>
                                <option value="+86">+86 (CN)</option>
                                <option value="+65">+65 (SG)</option>
                              </select>
                              <input
                                id="reg_phone"
                                type="tel"
                                required
                                className={`form-input ${showRegValidation && !regPhone ? 'is-invalid' : ''}`}
                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', flexGrow: 1 }}
                                placeholder="Mobile number"
                                value={regPhone}
                                onChange={(e) => setRegPhone(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Half-day Tour opt */}
                        <div style={{ marginTop: '0.25rem', border: '1px solid #cbd5e1', padding: '0.75rem', borderRadius: '0.5rem', background: '#f8fafc' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)' }}>
                            <input
                              type="checkbox"
                              checked={regRegisterForTour}
                              onChange={(e) => setRegRegisterForTour(e.target.checked)}
                            />
                            <span>Register for Free Half-Day Tour?</span>
                          </label>
                          {regRegisterForTour && (
                            <div style={{ marginTop: '0.5rem' }}>
                              <label htmlFor="reg_tour_place" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Preferred Location</label>
                              <select
                                id="reg_tour_place"
                                value={regPreferredTourPlace}
                                onChange={(e) => setRegPreferredTourPlace(e.target.value)}
                                required={regRegisterForTour}
                                className="form-input"
                                style={{ padding: '0.35rem', fontSize: '0.75rem' }}
                              >
                                <option value="">-- Choose destination --</option>
                                <option value="Ooty Botanical Gardens">Ooty (Hill Station)</option>
                                <option value="Mudumalai Wildlife Sanctuary">Mudumalai (Tiger Reserve)</option>
                                <option value="Isha Yoga Center">Adiyogi / Isha Yoga (Coimbatore)</option>
                                <option value="Marudhamalai Temple">Marudhamalai Hill Temple</option>
                              </select>
                            </div>
                          )}
                        </div>

                        {/* Screenshot File Upload */}
                        <div>
                          <label htmlFor="receipt_file" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Upload Bank Receipt Copy*</label>
                          <div
                            onClick={() => document.getElementById('receipt_file')?.click()}
                            style={{
                              border: showRegValidation && !regScreenshot && !regPaymentUrl ? '2px dashed #dc2626' : '2px dashed #cbd5e1',
                              borderRadius: '0.5rem',
                              padding: '1rem',
                              textAlign: 'center',
                              cursor: 'pointer',
                              background: '#f8fafc',
                              transition: 'all 0.2s ease',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.25rem'
                            }}
                          >
                            <input
                              id="receipt_file"
                              type="file"
                              accept="image/*,application/pdf"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  setRegScreenshot(e.target.files[0]);
                                }
                              }}
                            />
                            <Download size={20} style={{ color: 'var(--text-muted)', margin: '0 auto' }} />
                            {regScreenshot ? (
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>{regScreenshot.name}</span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to upload payment screenshot/PDF</span>
                            )}
                          </div>

                          <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>- OR -</span>
                          </div>

                          <div style={{ marginTop: '0.5rem' }}>
                            <label htmlFor="reg_payment_url" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Paste Payment Receipt URL</label>
                            <input
                              id="reg_payment_url"
                              type="url"
                              value={regPaymentUrl}
                              onChange={(e) => setRegPaymentUrl(e.target.value)}
                              placeholder="https://drive.google.com/..."
                              className={`form-input ${showRegValidation && !regScreenshot && !regPaymentUrl ? 'is-invalid' : ''}`}
                              style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', marginTop: '0.2rem' }}
                            />
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginTop: '0.35rem' }}>
                            Provide either an uploaded file or a public URL for your payment receipt.
                          </span>
                        </div>

                        {regError && (
                          <div style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 600 }}>
                            {regError}
                          </div>
                        )}

                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={regSubmitting}
                          onClick={() => setShowRegValidation(true)}
                          style={{ marginTop: '0.5rem', width: '100%', padding: '0.7rem', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-cyan) 100%)', fontSize: '0.9rem', border: 'none', color: '#ffffff', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          {regSubmitting ? 'Submitting...' : 'Submit Registration & Payment'}
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  /* Online Checkout Gateway (Futuristic Mock) */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', textAlign: 'left' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.35rem', fontWeight: 700 }}>2. Online Payment Gateway</h4>

                    {onlineSuccess ? (
                      <div style={{
                        background: 'rgba(34, 197, 94, 0.08)',
                        border: '1px solid rgba(34, 197, 94, 0.25)',
                        borderRadius: '0.5rem',
                        padding: '1.5rem',
                        textAlign: 'center',
                        color: '#22c55e',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        alignItems: 'center'
                      }}>
                        <CheckCircle size={32} style={{ color: '#22c55e' }} />
                        <span style={{ fontSize: '1.05rem', fontWeight: 800 }}>Demo Checkout Complete!</span>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                          This was a simulation of the checkout sequence. SREC instant payment APIs will secure this transaction.
                        </p>
                        <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', padding: '0.4rem 0.8rem', background: '#ffffff', borderRadius: '0.25rem', border: '1px solid #e2e8f0', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
                          TxID: SREC-MOCK-{Math.floor(100000 + Math.random() * 900000)}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setOnlineSuccess(false);
                            setCardHolder('');
                            setCardNumber('');
                            setCardExpiry('');
                            setCardCvv('');
                            setSelectedUpi(null);
                            setUpiId('');
                          }}
                          className="btn btn-secondary"
                          style={{ marginTop: '0.5rem', padding: '0.4rem 1rem', fontSize: '0.8rem' }}
                        >
                          Restart Simulator
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        setOnlinePaying(true);
                        setTimeout(() => {
                          setOnlinePaying(false);
                          setOnlineSuccess(true);
                        }, 1500);
                      }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                        {/* Futuristic Credit Card Graphic */}
                        <div style={{
                          width: '100%',
                          height: '160px',
                          background: 'linear-gradient(135deg, rgba(9, 29, 54, 0.95) 0%, rgba(15, 82, 186, 0.9) 100%)',
                          borderRadius: '0.75rem',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          padding: '1.25rem',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.2)',
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          backdropFilter: 'blur(10px)',
                          marginBottom: '0.5rem'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* Glowing Chip */}
                            <div style={{
                              width: '32px',
                              height: '24px',
                              background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                              borderRadius: '0.25rem',
                              position: 'relative',
                              boxShadow: '0 0 8px rgba(251, 191, 36, 0.4)'
                            }} />
                            <span style={{ fontStyle: 'italic', fontWeight: 900, color: '#ffffff', fontSize: '1.1rem', letterSpacing: '0.05em' }}>SREC Secure</span>
                          </div>

                          <div style={{
                            fontSize: '1.15rem',
                            letterSpacing: '0.12em',
                            fontFamily: 'monospace',
                            color: '#ffffff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            textAlign: 'center',
                            margin: '0.75rem 0'
                          }}>
                            {cardNumber ? cardNumber.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.8)' }}>
                            <div>
                              <div style={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Card Holder</div>
                              <div>{cardHolder ? cardHolder.toUpperCase() : 'CARDHOLDER NAME'}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Expires</div>
                              <div>{cardExpiry ? cardExpiry : 'MM/YY'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Payment Method Switcher (Card vs UPI) */}
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <button
                            type="button"
                            onClick={() => { setSelectedUpi(null); setUpiId(''); }}
                            className={`btn ${selectedUpi === null ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', borderRadius: '0.25rem' }}
                          >
                            Credit/Debit Card
                          </button>
                          <button
                            type="button"
                            onClick={() => { setSelectedUpi('gpay'); }}
                            className={`btn ${selectedUpi !== null ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ flex: 1, padding: '0.35rem', fontSize: '0.75rem', borderRadius: '0.25rem' }}
                          >
                            UPI Payment
                          </button>
                        </div>

                        {selectedUpi === null ? (
                          /* Card Inputs */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div>
                              <label htmlFor="card_holder" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Cardholder Name</label>
                              <input
                                id="card_holder"
                                type="text"
                                required
                                className="form-input"
                                style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                                placeholder="e.g. John Doe"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                              />
                            </div>
                            <div>
                              <label htmlFor="card_number" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Card Number</label>
                              <input
                                id="card_number"
                                type="text"
                                maxLength={16}
                                pattern="\d{16}"
                                required
                                className="form-input"
                                style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                                placeholder="16-digit card number"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                              />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                              <div>
                                <label htmlFor="card_expiry" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Expiry Date</label>
                                <input
                                  id="card_expiry"
                                  type="text"
                                  maxLength={5}
                                  required
                                  className="form-input"
                                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                                  placeholder="MM/YY"
                                  value={cardExpiry}
                                  onChange={(e) => {
                                    let val = e.target.value.replace(/\D/g, '');
                                    if (val.length > 2) {
                                      val = val.substring(0, 2) + '/' + val.substring(2, 4);
                                    }
                                    setCardExpiry(val);
                                  }}
                                />
                              </div>
                              <div>
                                <label htmlFor="card_cvv" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CVV Code</label>
                                <input
                                  id="card_cvv"
                                  type="password"
                                  maxLength={3}
                                  pattern="\d{3}"
                                  required
                                  className="form-input"
                                  style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                                  placeholder="123"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* UPI Inputs */
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-around', margin: '0.25rem 0' }}>
                              {['gpay', 'phonepe', 'paytm'].map((upiName) => (
                                <button
                                  key={upiName}
                                  type="button"
                                  onClick={() => setSelectedUpi(upiName)}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    border: '1px solid #cbd5e1',
                                    background: selectedUpi === upiName ? '#e0f2fe' : '#ffffff',
                                    color: selectedUpi === upiName ? '#0f52ba' : 'var(--text-secondary)',
                                    borderRadius: '0.375rem',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {upiName}
                                </button>
                              ))}
                            </div>
                            <div>
                              <label htmlFor="upi_id" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Enter UPI ID / VPA</label>
                              <input
                                id="upi_id"
                                type="text"
                                required
                                className="form-input"
                                style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                                placeholder="username@okaxis"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={onlinePaying}
                          className="btn btn-primary"
                          style={{ marginTop: '0.5rem', width: '100%', padding: '0.7rem', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-cyan) 100%)', fontSize: '0.9rem', border: 'none', color: '#ffffff', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          {onlinePaying ? 'Processing Security APIs...' : `Securely Pay ${bill.currencySymbol}${bill.total}`}
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
