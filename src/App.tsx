import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion';
import {
  Calendar,
  Clock,
  Download,
  ExternalLink,
  Mail,
  Phone,
  User,
  Award,
  ChevronRight,
  CheckCircle,
  MessageSquare,
  Menu,
  X,
  FileText,
  Shield,
  Trash2,
  Plus,
  Save,
  LogOut,
  Eye,
  RefreshCw,
  Database,
  Sparkles,
  Globe,
  Zap,
  Leaf,
  Handshake,
  Bot,
  Radio,
  Building2,
  Plug,
  Sliders,
  Atom,
  Satellite
} from 'lucide-react';
import Footer from './components/Footer';
import acLogo from './assets/logo.png';
import srecLogo from './assets/srec-logo.png';
import logo2 from './assets/logo2.png';
import Tru1 from './assets/tru2 (1).png';
import Tru2 from './assets/tru2 (2).png';
import chatbotIcon from './assets/chatbot.gif';
import heroBg from './assets/hero.png';
import karpagamImg from './assets/karpagam.png';
import jansiImg from './assets/jansi.png';
import balamurgunImg from './assets/bala.jpeg';
import trust1Img from './assets/trust1.png';
import logo5 from './assets/logo5.jpg';
import principalImg from './assets/principal.png';
import kingsyImg from './assets/Kingsy.png';
import sakthivelImg from './assets/Sakthivel.png';
import radhaImg from './assets/Screenshot 2026-07-10 142828.png';
import brindhaImg from './assets/Screenshot 2026-07-10 142835.png';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import ExplorePage from './ExplorePage'
import AdminPage from './AdminPage';
import CommitteePage from './components/CommitteePage';
import PaymentPage from './components/PaymentPage';

// Navigation Items
const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'speakers', label: 'Speakers' },
  { id: 'call-for-papers', label: 'Tracks' },
  { id: 'important-dates', label: 'Important Dates' },
  { id: 'registration', label: 'Registration' },
  { id: 'call-for-papers-main', label: 'Call For Papers' },
  { id: 'committee', label: 'Committee' },
  { id: 'explore', label: 'Explore' },
  { id: 'location', label: 'Venue' },
  { id: 'admin', label: 'Admin' },
  { id: 'ieee-sb', label: 'IEEE SREC SB', external: true }
];


interface Department {
  id?: any;
  name: string;
  description: string;
  sort_order?: number;
}

interface CommitteeMember {
  id?: any;
  category: 'steering' | 'organizing' | 'advisory' | 'technical';
  role: string | null;
  name: string;
  desc: string;
  image_url?: string;
}

interface Speaker {
  id?: any;
  name: string;
  title: string;
  role: string;
  talk: string;
  color: string;
  image_url?: string;
}

interface ImportantDate {
  id?: any;
  title: string;
  event_date: string;
  desc: string;
  sort_order?: number;
}

interface Workshop {
  id?: any;
  title: string;
  instructor: string;
  duration: string;
  price: string;
  details: string;
}

/*
interface RegistrationFee {
  member_type: string;
  inr_reg: string;
  inr_early: string;
  usd_phys_reg: string;
  usd_phys_early: string;
  usd_virt_reg: string;
  usd_virt_early: string;
}
*/

interface Stat {
  number: string;
  label: string;
}

interface Coordinator {
  name: string;
  role: string;
  phone: string;
  email?: string;
  image_url?: string;
}


export const parseDateDisplay = (dateStr: string) => {
  const cleaned = dateStr.trim();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const shortMonths: Record<string, string> = {
    "January": "JAN", "February": "FEB", "March": "MAR", "April": "APR", "May": "MAY", "June": "JUN",
    "July": "JUL", "August": "AUG", "September": "SEP", "October": "OCT", "November": "NOV", "December": "DEC"
  };

  let month = "DATE";
  let day = "??";
  let year = "2027";

  for (const m of months) {
    if (cleaned.includes(m)) {
      month = shortMonths[m];
      const afterMonth = cleaned.replace(m, '').trim();
      const parts = afterMonth.split(',');
      if (parts.length >= 2) {
        day = parts[0].trim().replace('&', '-').replace(/\s+/g, ' ');
        year = parts[1].trim();
      } else {
        const spaceParts = afterMonth.split(/\s+/);
        if (spaceParts.length >= 2) {
          day = spaceParts[0].trim();
          year = spaceParts[1].trim();
        }
      }
      break;
    }
  }

  // Custom overrides for known dates to be perfectly formatted
  if (cleaned.includes("October 15")) { month = "OCT"; day = "15"; year = "2026"; }
  else if (cleaned.includes("December 20")) { month = "DEC"; day = "20"; year = "2026"; }
  else if (cleaned.includes("January 25")) { month = "JAN"; day = "25"; year = "2027"; }
  else if (cleaned.includes("February 20")) { month = "FEB"; day = "20"; year = "2027"; }
  else if (cleaned.includes("April 03")) { month = "APR"; day = "03"; year = "2027"; }
  else if (cleaned.includes("April 04") || cleaned.includes("April 4")) { month = "APR"; day = "04-05"; year = "2027"; }

  return { month, day, year };
};

export const renderDateWithSuperscript = (text: string | undefined | null) => {
  if (!text) return null;
  const regex = /(\d+)(st|nd|rd|th)/gi;
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <span key={match.index}>
        {match[1]}<sup style={{ fontSize: '0.7em', verticalAlign: 'super', lineHeight: 0 }}>{match[2]}</sup>
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
};

export const renderFormattedDesc = (descText: string | undefined | null) => {
  if (!descText) return '';
  // Clean raw escape characters if present
  let cleanedText = descText
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, ' ')
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
    <>
      {parts.map((part, index) => {
        if (phrases.includes(part)) {
          return (
            <span key={index} style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
              {part}
            </span>
          );
        }
        return part;
      })}
    </>
  );
};

const LinkedinIcon = ({ size = 16, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={style}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export const renderSpeakerTalkOrButton = (talkStr: string | undefined | null, defaultLabel?: string) => {
  if (!talkStr) return null;

  // Clean outer quotes, single quotes, escaped quotes, and whitespace
  const cleaned = talkStr
    .replace(/^\\"/g, '')
    .replace(/\\"/g, '"')
    .replace(/^["'\s]+|["'\s]+$/g, '')
    .trim();

  if (!cleaned) return null;

  // Check if string contains or is a URL
  const urlPattern = /(https?:\/\/[^\s"]+|www\.[^\s"]+|[a-zA-Z0-9-]+\.com\/[^\s"]*|[a-zA-Z0-9-]+\.in\/[^\s"]*)/i;
  const match = cleaned.match(urlPattern);

  if (match || /^https?:\/\//i.test(cleaned) || /^www\./i.test(cleaned) || cleaned.includes('linkedin.com')) {
    let rawUrl = match ? match[0] : cleaned;
    let url = rawUrl.replace(/^["'\s]+|["'\s]+$/g, '').trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    const isLinkedIn = url.toLowerCase().includes('linkedin.com');

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: '100%',
          padding: '0.65rem 1rem',
          borderRadius: '0.5rem',
          fontWeight: 700,
          fontSize: '0.85rem',
          textDecoration: 'none',
          color: '#ffffff',
          backgroundColor: isLinkedIn ? '#0a66c2' : '#2563eb',
          boxShadow: isLinkedIn ? '0 4px 12px rgba(10, 102, 194, 0.35)' : '0 4px 12px rgba(37, 99, 235, 0.35)',
          transition: 'all 0.2s ease-in-out',
          cursor: 'pointer',
          marginTop: 'auto'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = isLinkedIn ? '#004182' : '#1d4ed8';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = isLinkedIn ? '0 6px 16px rgba(10, 102, 194, 0.45)' : '0 6px 16px rgba(37, 99, 235, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isLinkedIn ? '#0a66c2' : '#2563eb';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = isLinkedIn ? '0 4px 12px rgba(10, 102, 194, 0.35)' : '0 4px 12px rgba(37, 99, 235, 0.35)';
        }}
      >
        {isLinkedIn ? <LinkedinIcon size={16} /> : <ExternalLink size={16} />}
        <span>{isLinkedIn ? 'View LinkedIn Profile' : 'View Profile'}</span>
      </a>
    );
  }

  // Otherwise render as Talk Title / Keynote Topic box
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.02)',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      padding: '1rem',
      borderRadius: '0.5rem',
      width: '100%',
      marginTop: 'auto'
    }}>
      <span style={{ display: 'block', fontSize: '0.75rem', color: '#d97706', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
        {defaultLabel || 'KEYNOTE TALK'}
      </span>
      <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>"{cleaned}"</span>
    </div>
  );
};

const ORGANIZING_DEPARTMENTS_INFO: Record<string, { title: string; subtitle?: string; desc: string[]; highlights?: string[]; vision?: string; mission?: string[]; hodName?: string; hodTitle?: string; hodMessage?: string }> = {
  'artificial intelligence': {
    title: 'Department of Artificial Intelligence and Data Science',
    subtitle: '(AI & DS)',
    desc: [
      'The Department of Artificial Intelligence and Data Science (AI & DS) at Sri Ramakrishna Engineering College focuses on developing next-generation leaders in AI, Machine Learning, Deep Learning, Big Data Analytics, and Intelligent Systems.',
      'Equipped with state-of-the-art AI laboratories, GPU computing clusters, and industry-oriented R&D facilities, the department provides hands-on experience in cutting-edge domains including Computer Vision, Natural Language Processing, MLOps, and Autonomous Systems.',
      'Driven by experienced faculty members and strong industry collaborations, the department actively engages in multidisciplinary research, consulting projects, and tech innovation hackathons.'
    ],
    highlights: [
      'Advanced AI/ML & High-Performance GPU Computing Labs',
      'Industry Collaborations and Co-Innovation Centers',
      'Active Research in Generative AI, Computer Vision, & Responsible AI'
    ]
  },
  'biomedical': {
    title: 'Department of Biomedical Engineering',
    subtitle: '(BME)',
    desc: [
      'Biomedical Engineering is a unique and exciting field where engineering meets medicine, creating solutions that improve and save lives. At our department, we provide a dynamic learning environment that integrates engineering principles, life sciences, biotechnology, and medical technology. Through a carefully designed curriculum, state-of-the-art laboratories, experiential learning, and interdisciplinary collaboration, students develop the knowledge, technical expertise, and problem-solving abilities required to excel in this rapidly evolving profession.',
      'The department takes immense pride in its excellent record of placements, higher studies, and entrepreneurial achievements. Our graduates have secured rewarding careers in healthcare technology companies, research institutions, hospitals, and multinational organizations across the globe. We also provide dedicated guidance for competitive examinations such as GATE, GRE, TOEFL, IELTS, UPSC, and other career-oriented pathways.'
    ],
    highlights: [
      'Dedicated guidance for competitive examinations (GATE, GRE, TOEFL, IELTS, UPSC)',
      'Interdisciplinary curriculum integrating engineering principles, life sciences, biotechnology & medical technology',
      'High-impact placements & higher studies track record in global healthcare & research institutions'
    ],
    vision: 'To emerge as a center of excellence in biomedical domains, fostering quality education through holistic and interdisciplinary approaches for sustainable healthcare innovations.',
    mission: [
      'To impart knowledge and skills to address challenges in healthcare sectors.',
      'To nurture innovative scientific research and translate technologies into sustainable medical solutions.',
      'To empower graduates with professional attributes and a deep commitment to ethical principles.'
    ],
    hodName: 'Dr. N. Sathish Kumar',
    hodTitle: 'B.E., M.E., Ph.D | Head of the Department',
    hodMessage: 'Welcome to the Department of Biomedical Engineering. It gives me immense pleasure to welcome you to a discipline that stands at the forefront of transforming healthcare through innovation, technology, and human compassion. As the Head of the Department, I am proud to lead a vibrant academic community committed to nurturing the next generation of biomedical engineers who will shape the future of healthcare worldwide.'
  },
  'computer science engineering': {
    title: 'Department of Computer Science Engineering',
    subtitle: '(CSE)',
    desc: [
      'The Department of Computer Science and Engineering is a flagship department at SREC, fostering academic excellence in software engineering, algorithms, cloud computing, cyber security, and distributed systems.',
      'Featuring modern computer centers with high-speed networks, cloud infrastructure, and open-source software stacks, the department empowers students to build scalable enterprise applications and innovative software products.',
      'With active student chapters of IEEE Computer Society, ACM, and CSI, the department nurtures technical leadership through codeathons, research publications, and open-source contributions.'
    ],
    highlights: [
      'High-Performance Computing Infrastructure & Cloud Testbeds',
      'Strong Placement Track Record & Top Tier Tech Internships',
      'Active Student Chapters (IEEE CS, ACM, CSI)'
    ]
  },
  'electrical and electronics': {
    title: 'Department of Electrical and Electronics Engineering',
    subtitle: '(EEE)',
    desc: [
      'Established in 1994, the Department of Electrical and Electronics Engineering offers a comprehensive four-year B.E. programme in Electrical and Electronics Engineering, along with a Ph.D. programme to promote advanced research in core and emerging areas of electrical engineering. The department is backed by a distinguished team of faculty, comprising 13 Doctorates and 8 faculty members pursuing Ph.D. in various specializations, with rich experience in industry, research, and teaching.',
      'The department has a proven track record of academic excellence and quality assurance, with its B.E. programme accredited by the National Board of Accreditation (NBA), New Delhi in 2003 and reaccredited in 2007, 2012, 2016, 2019, 2022, and 2025. It is equipped with state-of-the-art, industry-collaborated laboratories that provide learners with hands-on exposure to world-class technologies and a 360-degree view of industrial processes.',
      'The department takes pride in housing a Centre of Excellence in e-Mobility, fostering innovation and research in electric vehicle technologies. It also engages in energy auditing and consultancy services, supported by energy auditors among the faculty. Strong industry linkages through active MoUs with Salzer Electronics, Mahindra and Mahindra, Divise Electronics, and Cares Renewables facilitate collaborative research, internships, and technical training. With a consistently strong placement record, the department ensures that its graduates are well-equipped to meet the demands of the industry and contribute to sustainable and smart energy solutions.'
    ],
    highlights: [
      'Centre of Excellence in e-Mobility (Electric Vehicle Technologies R&D)',
      'Continuous NBA Accreditation (2003, 2007, 2012, 2016, 2019, 2022, 2025)',
      'Active MoUs with Salzer Electronics, Mahindra & Mahindra, Divise Electronics, and Cares Renewables',
      'In-house Energy Auditing & Industrial Consultancy Services'
    ],
    hodName: 'Dr. S. Allirani',
    hodTitle: 'B.E., M.E., Ph.D. | Professor & Head of the Department',
    hodMessage: 'Dr. S. Allirani is currently working as Professor & Head in the Department of Electrical and Electronics Engineering at Sri Ramakrishna Engineering College. She received her B.E. in Electrical & Electronics Engineering from Coimbatore Institute of Technology (CIT), Coimbatore, in 1994, M.E. in Electrical Machines from PSG College of Technology, Coimbatore, in 2004, and Ph.D. in the domain of Electrical Engineering from Anna University, Chennai, in 2014. She is a recognized supervisor under Anna University, Chennai.'
  },
  'electronics and communication': {
    title: 'Department of Electronics and Communication Engineering',
    subtitle: '(ECE)',
    desc: [
      'The Department of Electronics and Communication Engineering excels in training students in 5G/6G wireless communication, VLSI design, embedded systems, signal processing, and RF/microwave engineering.',
      'Featuring state-of-the-art labs for Cadence VLSI tools, Embedded Systems, Signal & Image Processing, and Microwave & Optical Communications, the department provides an ideal environment for hardware-software co-design.',
      'The department maintains active industry ties with semiconductor giants, telecom providers, and defense R&D organizations.'
    ],
    highlights: [
      'Cadence VLSI & Embedded Systems Design Suite',
      'Wireless Communication (5G/6G) & Antenna Design Facilities',
      'Product R&D in Embedded AI and Edge Devices'
    ]
  },
  'electronics and instrumentation': {
    title: 'Department of Electronics and Instrumentation Engineering',
    subtitle: '(EIE)',
    desc: [
      'The Department of Electronics and Instrumentation Engineering specializes in process automation, industrial IoT, SCADA/DCS systems, smart sensors, robotics, and cyber-physical systems.',
      'The department is equipped with process control rigs, virtual instrumentation setups, PLCs, industrial controllers, and sensor calibration labs to provide real-world automation experience.',
      'Collaborating closely with manufacturing and continuous-process industries, the department drives innovation in Industry 4.0/5.0 transformation.'
    ],
    highlights: [
      'Process Control, SCADA & DCS Automation Centers',
      'Industrial Robotics & Cyber-Physical Systems Labs',
      'Smart Sensors & Measurement Technology Facilities'
    ]
  },
  'information technology': {
    title: 'Department of Information Technology',
    subtitle: '(IT)',
    desc: [
      'The Department of Information Technology focuses on full-stack software development, cyber security, data analytics, web/mobile engineering, and enterprise cloud solutions.',
      'Through state-of-the-art computing labs, DevOps toolchains, and cyber security testbeds, students develop practical expertise in solving complex software engineering challenges.',
      'The department maintains close links with IT services, product firms, and tech startups for mentorship, hackathons, and placement opportunities.'
    ],
    highlights: [
      'Full-Stack Software Development & Cloud Computing Labs',
      'Cyber Security & Threat Intelligence Testing Center',
      'Industry Hackathons & Product Engineering Mentorship'
    ]
  },
  'm.tech': {
    title: 'M.TECH - COMPUTER SCIENCE AND ENGINEERING',
    subtitle: '(5 Year Integrated Programme)',
    desc: [
      'The Department of M.Tech in Computer Science and Engineering (5 Years Integrated Programme), established in year 2021, aims to be a center of excellence for advanced education, research, and industry-driven innovation. It focuses on developing skilled professionals and researchers capable of addressing the challenges of a technology-driven world. The program features a unique curriculum with two six-month internships at reputed organizations and institution of eminence such as LTTS, Airbus, HTIC, CDAC, NITs, IITs, and IISc, providing students with valuable real-world exposure and practical experience.',
      'The department is equipped with state-of-the-art laboratories featuring high-performance computing systems, AI and ML frameworks, AR and VR kits, Data Analytics platforms, and advanced networking and security setups that support hands-on learning and innovation emphasizing emerging fields such as Data Science, Cyber Security, Artificial Intelligence, and Augmented and Virtual Reality, enabling students to explore modern technologies and applications.',
      'Guided by a team of highly qualified and research-driven faculty members, students are encouraged to engage in innovative projects, publish research papers, and develop impactful technology solutions.'
    ],
    highlights: [
      'Currently working on an ANRF-funded project to automate MSMEs in Coimbatore region',
      'Student & Faculty team working under MSME Idea Hackathon 5.0 project "Predictive Food safety monitoring using smart sensors"',
      'Recognized as an Experience Centre by C-DAC Chennai for capacity building & advanced computing research'
    ]
  }
};

const getDeptInfoFromText = (text: string, dbInfo?: Record<string, string>) => {
  let deptMap = ORGANIZING_DEPARTMENTS_INFO;
  if (dbInfo && dbInfo.organizing_departments_info) {
    try {
      const parsed = typeof dbInfo.organizing_departments_info === 'string'
        ? JSON.parse(dbInfo.organizing_departments_info)
        : dbInfo.organizing_departments_info;
      if (parsed && typeof parsed === 'object') {
        deptMap = { ...ORGANIZING_DEPARTMENTS_INFO, ...parsed };
      }
    } catch (e) {
      console.error('Failed to parse organizing_departments_info from DB:', e);
    }
  }

  const lower = text.toLowerCase();
  if (lower.includes('m.tech') || lower.includes('5 year')) return deptMap['m.tech'] || ORGANIZING_DEPARTMENTS_INFO['m.tech'];
  if (lower.includes('artificial intelligence') || lower.includes('aids') || lower.includes('data science')) return deptMap['artificial intelligence'] || ORGANIZING_DEPARTMENTS_INFO['artificial intelligence'];
  if (lower.includes('biomedical')) return deptMap['biomedical'] || ORGANIZING_DEPARTMENTS_INFO['biomedical'];
  if (lower.includes('computer science engineering') || lower.includes('computer science and engineering')) return deptMap['computer science engineering'] || ORGANIZING_DEPARTMENTS_INFO['computer science engineering'];
  if (lower.includes('electrical and electronics') || lower.includes('eee')) return deptMap['electrical and electronics'] || ORGANIZING_DEPARTMENTS_INFO['electrical and electronics'];
  if (lower.includes('electronics and communication') || lower.includes('ece')) return deptMap['electronics and communication'] || ORGANIZING_DEPARTMENTS_INFO['electronics and communication'];
  if (lower.includes('electronics and instrumentation') || lower.includes('eie')) return deptMap['electronics and instrumentation'] || ORGANIZING_DEPARTMENTS_INFO['electronics and instrumentation'];
  if (lower.includes('information technology')) return deptMap['information technology'] || ORGANIZING_DEPARTMENTS_INFO['information technology'];

  return {
    title: text,
    subtitle: 'Organizing Department',
    desc: [
      `${text} is one of the premier academic departments of Sri Ramakrishna Engineering College, actively contributing to academic excellence, research innovations, and industry-oriented technical education.`
    ]
  };
};

const getDateStatus = (eventDateStr: string): 'past' | 'present' | 'future' => {
  if (!eventDateStr) return 'future';

  const normalized = eventDateStr.replace(/–|—/g, '-');
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  const rangeMatch = normalized.match(/([A-Za-z]+)\s+(\d+)\s*-\s*(\d+),\s*(\d{4})/);
  if (rangeMatch) {
    const month = rangeMatch[1];
    const startDay = rangeMatch[2];
    const endDay = rangeMatch[3];
    const year = rangeMatch[4];
    startDate = new Date(`${month} ${startDay}, ${year}`);
    endDate = new Date(`${month} ${endDay}, ${year}`);
  } else {
    const parsed = new Date(normalized);
    if (!isNaN(parsed.getTime())) {
      startDate = parsed;
      endDate = parsed;
    }
  }

  if (!startDate || isNaN(startDate.getTime())) {
    return 'future';
  }

  const now = new Date();
  if (endDate) {
    endDate.setHours(23, 59, 59, 999);
  } else {
    endDate = new Date(startDate.getTime());
    endDate.setHours(23, 59, 59, 999);
  }

  startDate.setHours(0, 0, 0, 0);

  if (now > endDate) {
    return 'past';
  } else if (now >= startDate && now <= endDate) {
    return 'present';
  } else {
    return 'future';
  }
};

const ADMIN_MASTER_KEY = "MRBB2026";


async function sha256(message: string): Promise<string> {
  // Check if Web Crypto API is available (only available in Secure Contexts, i.e., HTTPS or localhost)
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex;
    } catch (e) {
      console.warn("Secure crypto failed, falling back to JS implementation:", e);
    }
  }

  // Fallback pure JS SHA-256 implementation for insecure HTTP contexts
  function sha256_fallback(str: string): string {
    const rotateRight = (n: number, x: number) => (x >>> n) | (x << (32 - n));

    const hash = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    const msgBuffer = new TextEncoder().encode(str);
    const words = new Uint32Array(((msgBuffer.length + 8) >> 6) + 1 << 4);

    for (let i = 0; i < msgBuffer.length; i++) {
      words[i >> 2] |= msgBuffer[i] << (24 - (i % 4) * 8);
    }

    words[msgBuffer.length >> 2] |= 0x80 << (24 - (msgBuffer.length % 4) * 8);
    words[words.length - 1] = msgBuffer.length * 8;

    for (let i = 0; i < words.length; i += 16) {
      const w = new Uint32Array(64);
      for (let j = 0; j < 16; j++) w[j] = words[i + j];
      for (let j = 16; j < 64; j++) {
        const s0 = rotateRight(7, w[j - 15]) ^ rotateRight(18, w[j - 15]) ^ (w[j - 15] >>> 3);
        const s1 = rotateRight(17, w[j - 2]) ^ rotateRight(19, w[j - 2]) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }

      let [a, b, c, d, e, f, g, h] = hash;

      for (let j = 0; j < 64; j++) {
        const S1 = rotateRight(6, e) ^ rotateRight(11, e) ^ rotateRight(25, e);
        const ch = (e & f) ^ (~e & g);
        const temp1 = (h + S1 + ch + k[j] + w[j]) | 0;
        const S0 = rotateRight(2, a) ^ rotateRight(13, a) ^ rotateRight(22, a);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const temp2 = (S0 + maj) | 0;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) | 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) | 0;
      }

      hash[0] = (hash[0] + a) | 0;
      hash[1] = (hash[1] + b) | 0;
      hash[2] = (hash[2] + c) | 0;
      hash[3] = (hash[3] + d) | 0;
      hash[4] = (hash[4] + e) | 0;
      hash[5] = (hash[5] + f) | 0;
      hash[6] = (hash[6] + g) | 0;
      hash[7] = (hash[7] + h) | 0;
    }

    return Array.from(hash).map(h => (h >>> 0).toString(16).padStart(8, '0')).join('');
  }

  return sha256_fallback(message);
}

// Dynamic dynamic count up component for conference statistics
function CounterUp({ target, duration = 1.2 }: { target: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Extract the numeric part and any suffixes (e.g. "17" or "100+")
  const numericPart = parseInt(target.replace(/\D/g, ''), 10) || 0;
  const suffix = target.replace(/[0-9]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = numericPart;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalSteps = 45;
    const stepTime = (duration * 1000) / totalSteps;
    const increment = end / totalSteps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextVal = Math.round(increment * currentStep);
      if (currentStep >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(nextVal);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, numericPart, duration]);

  return (
    <div ref={elementRef} style={{ display: 'inline-block' }}>
      {count}
      {suffix}
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [currentPage, setCurrentPage] = useState<'main' | 'explore' | 'admin' | 'committee' | 'guidelines' | 'payment'>('main');
  const [initialRegTab, setInitialRegTab] = useState<'submission' | 'fees' | 'form'>('submission');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isSeparatePage = (id: string) => ['committee', 'guidelines', 'call-for-papers-main', 'registration', 'explore', 'admin'].includes(id);

  // Database content states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  // const [registrationFees, setRegistrationFees] = useState<RegistrationFee[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [info, setInfo] = useState<Record<string, string>>({});
  const [pricing, setPricing] = useState<Record<string, number>>({});
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [showCalcModal, setShowCalcModal] = useState<boolean>(false);
  const [activeDeptModal, setActiveDeptModal] = useState<{ title: string; subtitle?: string; desc: string[]; highlights?: string[]; vision?: string; mission?: string[]; hodName?: string; hodTitle?: string; hodMessage?: string } | null>(null);

  // Admin Portal states
  const [adminUser, setAdminUser] = useState<string | null>(() => localStorage.getItem('srec_logged_in_admin'));
  const [showAdminPortal, setShowAdminPortal] = useState<boolean>(false);
  const [adminTab, setAdminTab] = useState<string>('overview');
  const [adminRegMode, setAdminRegMode] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState<string>('');
  const [adminMasterKey, setAdminMasterKey] = useState<string>('');
  const [adminLoading, setAdminLoading] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Registrations state
  const [submittedRegistrations, setSubmittedRegistrations] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // CRUD Editing states
  const [editingSpeaker, setEditingSpeaker] = useState<any | null>(null);
  const [editingDate, setEditingDate] = useState<any | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<any | null>(null);
  const [editingCommittee, setEditingCommittee] = useState<any | null>(null);
  const [editingDept, setEditingDept] = useState<any | null>(null);


  // Contact form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  // Registration calculator and submission states
  const [isIndian, setIsIndian] = useState<boolean>(true);
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [isIeeeMember, setIsIeeeMember] = useState<boolean>(true);
  const [regOption, setRegOption] = useState<'conference' | 'tutorial' | 'both' | 'listener'>('conference');
  const [isLate, setIsLate] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(6);
  const [workshopAddon, setWorkshopAddon] = useState<boolean>(false);
  const [virtualMode, setVirtualMode] = useState<boolean>(false);

  // Payment tab and country code/online checkout states
  const [paymentTab, setPaymentTab] = useState<'bank' | 'online'>('bank');
  const [regPhoneCode, setRegPhoneCode] = useState<string>('+91');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [selectedUpi, setSelectedUpi] = useState<'gpay' | 'phonepe' | 'paytm' | 'upi_id' | null>(null);
  const [upiId, setUpiId] = useState<string>('');
  const [onlineSuccess, setOnlineSuccess] = useState<boolean>(false);
  const [onlinePaying, setOnlinePaying] = useState<boolean>(false);

  // Registration form inputs
  const [regPaperId, setRegPaperId] = useState<string>('');
  const [regPaperTitle, setRegPaperTitle] = useState<string>('');
  const [regAuthorName, setRegAuthorName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regScreenshot, setRegScreenshot] = useState<File | null>(null);
  const [regPaymentUrl, setRegPaymentUrl] = useState<string>('');
  const [regRegisterForTour, setRegRegisterForTour] = useState<boolean>(false);
  const [regPreferredTourPlace, setRegPreferredTourPlace] = useState<string>('');

  // Submitting states
  const [regSubmitting, setRegSubmitting] = useState<boolean>(false);
  const [regSuccess, setRegSuccess] = useState<boolean>(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [showRegValidation, setShowRegValidation] = useState<boolean>(false);

  // Nexus Agent Chatbot states
  const [showNexusChat, setShowNexusChat] = useState<boolean>(false);
  const [showNexusTooltip, setShowNexusTooltip] = useState<boolean>(true);
  const [chatMessages] = useState<{ sender: 'agent' | 'user'; text: string }[]>([
    { sender: 'agent', text: 'Hello! I am Nexus, your SREC Conference AI Assistant. Ask me anything about AECTSD 2027 registration, important dates, key tracks, speakers, or workshops!' }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isAgentTyping] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNexusTooltip(false);
    }, 6000); // Auto-hide tooltip after 6 seconds
    return () => clearTimeout(timer);
  }, []);



  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam === 'committee') {
      setCurrentPage('committee');
      setActiveSection('committee');
    } else if (pageParam === 'guidelines') {
      setCurrentPage('guidelines');
      setInitialRegTab('submission');
      setActiveSection('guidelines');
    } else if (pageParam === 'registration') {
      setCurrentPage('payment');
      setInitialRegTab('fees');
      setActiveSection('registration');
    } else if (pageParam === 'explore') {
      setCurrentPage('explore');
      setActiveSection('explore');
    } else if (pageParam === 'admin') {
      setCurrentPage('admin');
      setActiveSection('admin');
    }
  }, []);

  // Admin Portal authentication handlers
  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);

    try {
      if (adminRegMode) {
        if (adminUsername.trim() === '' || adminPassword.trim() === '') {
          throw new Error('Username and password cannot be empty.');
        }
        if (adminPassword !== adminConfirmPassword) {
          throw new Error('Passwords do not match.');
        }
        if (adminMasterKey !== ADMIN_MASTER_KEY) {
          throw new Error('Invalid Admin Master Key.');
        }

        const passHash = await sha256(adminPassword);

        if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.from('website_admins').insert({
            username: adminUsername,
            password_hash: passHash
          });
          if (error) {
            if (error.code === '23505') throw new Error('Username already exists.');
            throw error;
          }
        } else {
          const localAdmins = JSON.parse(localStorage.getItem('srec_offline_admins') || '{}');
          if (localAdmins[adminUsername]) {
            throw new Error('Username already exists.');
          }
          localAdmins[adminUsername] = passHash;
          localStorage.setItem('srec_offline_admins', JSON.stringify(localAdmins));
        }

        setAdminRegMode(false);
        setAdminPassword('');
        setAdminConfirmPassword('');
        setAdminMasterKey('');
        setAdminError(null);
        alert('Admin registered successfully! Please log in.');
      } else {
        if (adminUsername.trim() === '' || adminPassword.trim() === '') {
          throw new Error('Username and password cannot be empty.');
        }

        const passHash = await sha256(adminPassword);

        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase
            .from('website_admins')
            .select('*')
            .eq('username', adminUsername)
            .single();

          if (error || !data) {
            throw new Error('Invalid username or password.');
          }
          if (data.password_hash !== passHash) {
            throw new Error('Invalid username or password.');
          }
        } else {
          const localAdmins = JSON.parse(localStorage.getItem('srec_offline_admins') || '{}');
          if (!localAdmins[adminUsername] || localAdmins[adminUsername] !== passHash) {
            throw new Error('Invalid username or password.');
          }
        }

        localStorage.setItem('srec_logged_in_admin', adminUsername);
        setAdminUser(adminUsername);
        setAdminPassword('');
        setAdminError(null);
      }
    } catch (err: any) {
      setAdminError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('srec_logged_in_admin');
    setAdminUser(null);
    setAdminUsername('');
    setAdminPassword('');
    setAdminTab('overview');
  };

  // CRUD Save & Delete Handlers
  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;
    try {
      const dataToSave = {
        name: editingDept.name,
        description: editingDept.description,
        sort_order: Number(editingDept.sort_order || 1)
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingDept.id) {
          const res = await supabase.from('departments').update(dataToSave).eq('id', editingDept.id);
          error = res.error;
        } else {
          const res = await supabase.from('departments').insert(dataToSave);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...departments];
        if (editingDept.id) {
          list = list.map(d => d.id === editingDept.id ? editingDept : d);
        } else {
          list.push({ ...editingDept, id: Date.now() });
        }
        localStorage.setItem('srec_offline_departments', JSON.stringify(list));
      }
      setEditingDept(null);
      await fetchDbData();
    } catch (err: any) {
      console.error('Save department failed:', err);
      alert('Save department failed: ' + (err.message || err));
    }
  };

  const handleDeleteDept = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this department track?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('departments').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = departments.filter(d => (d as any).id !== id);
        localStorage.setItem('srec_offline_departments', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      console.error('Delete department failed:', err);
      alert('Delete department failed: ' + (err.message || err));
    }
  };

  const handleSaveSpeaker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpeaker) return;
    try {
      const dataToSave = {
        name: editingSpeaker.name,
        title: editingSpeaker.title,
        role: editingSpeaker.role,
        talk: editingSpeaker.talk,
        color: editingSpeaker.color || '#0f52ba',
        image_url: editingSpeaker.image_url || null
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingSpeaker.id) {
          const res = await supabase.from('speakers').update(dataToSave).eq('id', editingSpeaker.id);
          error = res.error;
        } else {
          const res = await supabase.from('speakers').insert(dataToSave);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...speakers];
        if (editingSpeaker.id) {
          list = list.map(s => (s as any).id === editingSpeaker.id ? editingSpeaker : s);
        } else {
          list.push({ ...editingSpeaker, id: Date.now() });
        }
        localStorage.setItem('srec_offline_speakers', JSON.stringify(list));
      }
      setEditingSpeaker(null);
      await fetchDbData();
    } catch (err: any) {
      console.error('Save speaker failed:', err);
      alert('Save speaker failed: ' + (err.message || err));
    }
  };

  const handleDeleteSpeaker = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this speaker?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('speakers').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = speakers.filter(s => (s as any).id !== id);
        localStorage.setItem('srec_offline_speakers', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      console.error('Delete speaker failed:', err);
      alert('Delete speaker failed: ' + (err.message || err));
    }
  };

  const handleSaveDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDate) return;
    try {
      const dataToSave = {
        title: editingDate.title,
        event_date: editingDate.event_date,
        desc: editingDate.desc,
        sort_order: Number(editingDate.sort_order || 1)
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingDate.id) {
          const res = await supabase.from('important_dates').update(dataToSave).eq('id', editingDate.id);
          error = res.error;
        } else {
          const res = await supabase.from('important_dates').insert(dataToSave);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...importantDates];
        if (editingDate.id) {
          list = list.map(d => (d as any).id === editingDate.id ? editingDate : d);
        } else {
          list.push({ ...editingDate, id: Date.now() });
        }
        localStorage.setItem('srec_offline_important_dates', JSON.stringify(list));
      }
      setEditingDate(null);
      await fetchDbData();
    } catch (err: any) {
      console.error('Save date failed:', err);
      alert('Save date failed: ' + (err.message || err));
    }
  };

  const handleDeleteDate = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this date?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('important_dates').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = importantDates.filter(d => (d as any).id !== id);
        localStorage.setItem('srec_offline_important_dates', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      console.error('Delete date failed:', err);
      alert('Delete date failed: ' + (err.message || err));
    }
  };

  const handleSaveWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWorkshop) return;
    try {
      const dataToSave = {
        title: editingWorkshop.title,
        instructor: editingWorkshop.instructor,
        duration: editingWorkshop.duration,
        price: editingWorkshop.price,
        details: editingWorkshop.details
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingWorkshop.id) {
          const res = await supabase.from('workshops').update(dataToSave).eq('id', editingWorkshop.id);
          error = res.error;
        } else {
          const res = await supabase.from('workshops').insert(dataToSave);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...workshops];
        if (editingWorkshop.id) {
          list = list.map(w => (w as any).id === editingWorkshop.id ? editingWorkshop : w);
        } else {
          list.push({ ...editingWorkshop, id: Date.now() });
        }
        localStorage.setItem('srec_offline_workshops', JSON.stringify(list));
      }
      setEditingWorkshop(null);
      await fetchDbData();
    } catch (err: any) {
      console.error('Save workshop failed:', err);
      alert('Save workshop failed: ' + (err.message || err));
    }
  };

  const handleDeleteWorkshop = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this workshop?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('workshops').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = workshops.filter(w => (w as any).id !== id);
        localStorage.setItem('srec_offline_workshops', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      console.error('Delete workshop failed:', err);
      alert('Delete workshop failed: ' + (err.message || err));
    }
  };

  const handleSaveCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCommittee) return;
    try {
      const dataToSave = {
        category: editingCommittee.category,
        role: editingCommittee.role || null,
        name: editingCommittee.name,
        desc: editingCommittee.desc,
        image_url: editingCommittee.image_url || null
      };

      if (isSupabaseConfigured && supabase) {
        let error;
        if (editingCommittee.id) {
          const res = await supabase.from('committee').update(dataToSave).eq('id', editingCommittee.id);
          error = res.error;
        } else {
          const res = await supabase.from('committee').insert(dataToSave);
          error = res.error;
        }
        if (error) throw error;
      } else {
        let list = [...committeeMembers];
        if (editingCommittee.id) {
          list = list.map(c => (c as any).id === editingCommittee.id ? editingCommittee : c);
        } else {
          list.push({ ...editingCommittee, id: Date.now() });
        }
        localStorage.setItem('srec_offline_committee', JSON.stringify(list));
      }
      setEditingCommittee(null);
      await fetchDbData();
    } catch (err: any) {
      console.error('Save committee member failed:', err);
      alert('Save committee member failed: ' + (err.message || err));
    }
  };

  const handleDeleteCommittee = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this committee member?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('committee').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = committeeMembers.filter(c => (c as any).id !== id);
        localStorage.setItem('srec_offline_committee', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      console.error('Delete committee member failed:', err);
      alert('Delete committee member failed: ' + (err.message || err));
    }
  };

  const handleSaveInfoSetting = async (key: string, val: string) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('conference_info').upsert({ key, value: val });
        if (error) throw error;
      }
      const updatedInfo = { ...info, [key]: val };
      setInfo(updatedInfo);
      localStorage.setItem('srec_offline_info', JSON.stringify(updatedInfo));
    } catch (err: any) {
      console.error('Save setting failed:', err);
      alert('Save setting failed: ' + (err.message || err));
    }
  };

  const handleDeleteRegistration = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this registration log?')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('registrations').delete().eq('id', id);
        if (error) throw error;
      } else {
        const list = submittedRegistrations.filter(r => r.id !== id);
        localStorage.setItem('srec_offline_registrations', JSON.stringify(list));
      }
      await fetchDbData();
    } catch (err: any) {
      console.error('Delete registration failed:', err);
      alert('Delete registration failed: ' + (err.message || err));
    }
  };

  const handleClearAllRegistrations = async () => {
    if (!window.confirm('WARNING: Are you sure you want to delete ALL registrations? This cannot be undone.')) return;
    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('registrations').delete().neq('id', 0);
        if (error) throw error;
      } else {
        localStorage.setItem('srec_offline_registrations', JSON.stringify([]));
      }
      await fetchDbData();
    } catch (err: any) {
      console.error('Clear registrations failed:', err);
      alert('Clear registrations failed: ' + (err.message || err));
    }
  };

  // Group organizing committee members by their position/role
  const organizingMembers = committeeMembers.filter(m => m.category === 'organizing');
  const groupedOrganizing: { role: string; members: CommitteeMember[] }[] = [];
  const seenRoles = new Set<string>();

  organizingMembers.forEach(member => {
    const role = member.role || 'Member';
    if (!seenRoles.has(role)) {
      seenRoles.add(role);
      groupedOrganizing.push({ role, members: [] });
    }
    const group = groupedOrganizing.find(g => g.role === role);
    if (group) {
      group.members.push(member);
    }
  });

  const calculateTotalFees = () => {
    const suffix = isIndian ? 'inr' : 'usd';
    let baseKey = 'base_';

    // Choose base pricing option
    if (regOption === 'conference') {
      baseKey += `conf_${isStudent ? 'student' : 'prof'}_${isIeeeMember ? 'ieee' : 'non_ieee'}_${suffix}`;
    } else if (regOption === 'tutorial') {
      baseKey += `tut_${isStudent ? 'student' : 'prof'}_${isIeeeMember ? 'ieee' : 'non_ieee'}_${suffix}`;
    } else if (regOption === 'both') {
      baseKey += `both_${isStudent ? 'student' : 'prof'}_${isIeeeMember ? 'ieee' : 'non_ieee'}_${suffix}`;
    } else {
      // Listener (Indian only)
      if (isIndian) {
        baseKey += `listener_${isStudent ? 'student' : 'prof'}_${isIeeeMember ? 'ieee' : 'non_ieee'}_inr`;
      } else {
        // Fallback for international listeners
        baseKey += `conf_student_ieee_usd`;
      }
    }

    const baseFallbacks: Record<string, number> = {
      base_conf_student_ieee_inr: 9000,
      base_conf_student_non_ieee_inr: 10000,
      base_conf_prof_ieee_inr: 10000,
      base_conf_prof_non_ieee_inr: 11000,
      base_tut_student_ieee_inr: 1000,
      base_tut_student_non_ieee_inr: 1250,
      base_tut_prof_ieee_inr: 1250,
      base_tut_prof_non_ieee_inr: 1500,
      base_both_student_ieee_inr: 9500,
      base_both_student_non_ieee_inr: 10750,
      base_both_prof_ieee_inr: 10750,
      base_both_prof_non_ieee_inr: 12000,
      base_listener_student_ieee_inr: 3500,
      base_listener_student_non_ieee_inr: 5000,
      base_listener_prof_ieee_inr: 4500,
      base_listener_prof_non_ieee_inr: 6000,

      base_conf_student_ieee_usd: 150,
      base_conf_student_non_ieee_usd: 200,
      base_conf_prof_ieee_usd: 200,
      base_conf_prof_non_ieee_usd: 250,
      base_tut_student_ieee_usd: 40,
      base_tut_student_non_ieee_usd: 50,
      base_tut_prof_ieee_usd: 50,
      base_tut_prof_non_ieee_usd: 75,
      base_both_student_ieee_usd: 175,
      base_both_student_non_ieee_usd: 225,
      base_both_prof_ieee_usd: 225,
      base_both_prof_non_ieee_usd: 300
    };

    const baseFee = pricing[baseKey] !== undefined ? pricing[baseKey] : (baseFallbacks[baseKey] || 0);

    // Apply modifiers
    let penalty = 0;
    if (isLate) {
      const penaltyKey = `late_penalty_${suffix}`;
      const fallbackPenalty = isIndian ? 1000 : 25;
      penalty = pricing[penaltyKey] !== undefined ? pricing[penaltyKey] : fallbackPenalty;
    }

    let extraPageFee = 0;
    if (pageCount > 6) {
      const extraPageKey = `extra_page_${suffix}`;
      const fallbackExtra = isIndian ? 500 : 20;
      const extraRate = pricing[extraPageKey] !== undefined ? pricing[extraPageKey] : fallbackExtra;
      extraPageFee = (pageCount - 6) * extraRate;
    }

    let workshopFee = 0;
    if (workshopAddon) {
      const workshopKey = `workshop_addon_${suffix}`;
      const fallbackWorkshop = isIndian ? 500 : 10;
      workshopFee = pricing[workshopKey] !== undefined ? pricing[workshopKey] : fallbackWorkshop;
    }

    let virtualFee = 0;
    if (virtualMode) {
      const virtualKey = `virtual_addon_${suffix}`;
      const fallbackVirtual = isIndian ? 1000 : 25;
      virtualFee = pricing[virtualKey] !== undefined ? pricing[virtualKey] : fallbackVirtual;
    }

    const total = baseFee + penalty + extraPageFee + workshopFee + virtualFee;

    return {
      baseFee,
      penalty,
      extraPageFee,
      workshopFee,
      virtualFee,
      total,
      currencySymbol: isIndian ? '₹' : '$',
      currency: isIndian ? 'INR' : 'USD'
    };
  };

  const sendRegistrationEmail = async (fullPhone: string) => {
    const serviceId = info.emailjs_service_id;
    const templateId = info.emailjs_template_id;
    const publicKey = info.emailjs_public_key;
    const recipient = info.emailjs_recipient || info.secretariat_email || 'aectsd2027@srec.ac.in';

    if (serviceId && templateId && publicKey) {
      try {
        let receiptBase64 = '';
        if (regScreenshot) {
          receiptBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(regScreenshot);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });
        }

        const bill = calculateTotalFees();
        const templateParams = {
          to_email: recipient,
          paper_id: regPaperId,
          paper_title: regPaperTitle,
          author_name: regAuthorName,
          email: regEmail,
          phone: fullPhone,
          total_due: `${bill.currencySymbol}${bill.total} ${bill.currency}`,
          register_for_tour: regRegisterForTour ? 'Yes' : 'No',
          preferred_tour_place: regPreferredTourPlace || 'None',
          receipt_image: receiptBase64
        };

        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: templateParams
          })
        });
        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`EmailJS responded with ${res.status}: ${errText}`);
        }
        console.log('Notification email sent successfully via EmailJS!');
      } catch (emailErr) {
        console.error('Failed to send notification email via EmailJS:', emailErr);
      }
    }
  };

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regPaperId || !regAuthorName || !regPaperTitle || !regEmail || !regPhone || (!regScreenshot && !regPaymentUrl)) {
      setShowRegValidation(true);
      setRegError('Please fill out all required fields and upload the payment screenshot or enter a valid proof URL.');
      return;
    }

    setRegSubmitting(true);
    setRegError(null);
    setShowRegValidation(false);

    const fullPhone = `${regPhoneCode} ${regPhone}`;

    try {
      if (!isSupabaseConfigured || !supabase) {
        // Mock success if Supabase is offline
        setTimeout(async () => {
          const finalScreenshotName = regScreenshot ? regScreenshot.name : regPaymentUrl ? regPaymentUrl.trim() : 'offline_mode_proof.png';
          const newReg = {
            id: Date.now(),
            paper_id: regPaperId || 'N/A',
            paper_title: regPaperTitle || 'Listener Registration',
            author_name: regAuthorName,
            email: regEmail,
            phone: fullPhone,
            screenshot_name: finalScreenshotName,
            screenshot_size: regScreenshot ? regScreenshot.size : 0,
            register_for_tour: regRegisterForTour,
            preferred_tour_place: regPreferredTourPlace || null,
            created_at: new Date().toISOString()
          };
          const existingRegs = JSON.parse(localStorage.getItem('srec_offline_registrations') || '[]');
          const updatedRegs = [newReg, ...existingRegs];
          localStorage.setItem('srec_offline_registrations', JSON.stringify(updatedRegs));
          setSubmittedRegistrations(updatedRegs);

          // Try to send notification email
          await sendRegistrationEmail(fullPhone);

          setRegSubmitting(false);
          setRegSuccess(true);
        }, 1200);
        return;
      }

      // Upload screenshot to Supabase Storage or use manual URL.
      let screenshotUrl = 'no_file';
      let screenshotFileName = 'no_file';
      if (regPaymentUrl && !regScreenshot) {
        screenshotUrl = regPaymentUrl.trim();
        screenshotFileName = screenshotUrl;
      } else if (regScreenshot) {
        screenshotFileName = regScreenshot.name;
        try {
          // Sanitize filename: replace spaces with underscores, prefix with timestamp
          const safeFileName = `${Date.now()}_${regScreenshot.name.replace(/\s+/g, '_')}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('payment-proofs')
            .upload(safeFileName, regScreenshot, { cacheControl: '3600', upsert: false });

          if (uploadError) {
            console.warn('File upload failed, saving filename only:', uploadError.message);
            screenshotUrl = screenshotFileName;
          } else {
            // Get the public URL
            const { data: urlData } = supabase.storage
              .from('payment-proofs')
              .getPublicUrl(uploadData.path);
            screenshotUrl = urlData?.publicUrl || screenshotFileName;
          }
        } catch (uploadErr) {
          console.warn('Storage upload error:', uploadErr);
          screenshotUrl = screenshotFileName;
        }
      }

      const { error } = await supabase.from('registrations').insert({
        paper_id: regPaperId,
        paper_title: regPaperTitle,
        author_name: regAuthorName,
        email: regEmail,
        phone: fullPhone,
        screenshot_name: screenshotUrl,
        screenshot_size: regScreenshot ? regScreenshot.size : 0,
        register_for_tour: regRegisterForTour,
        preferred_tour_place: regPreferredTourPlace || null
      });

      if (error) {
        throw error;
      }

      // Send notification email
      await sendRegistrationEmail(fullPhone);

      setRegSuccess(true);
      fetchDbData();

    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit registration. Please try again.';
      console.error('Registration submission error:', err);
      setRegError(errorMsg);
    } finally {
      setRegSubmitting(false);
    }
  };

  // Dynamic document title update based on logo/hero title
  useEffect(() => {
    if (info.hero_title) {
      document.title = `${info.hero_title} | ${info.logo_title || 'Sri Ramakrishna Engineering College'}`;
    }
  }, [info.hero_title, info.logo_title]);

  // Scroll Progress
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transforms for Hero background scroll animation
  const heroBgYRaw = useTransform(scrollY, [0, 600], [0, 150]);
  const heroBgY = useSpring(heroBgYRaw, { stiffness: 80, damping: 20 });
  const heroBgScaleRaw = useTransform(scrollY, [0, 600], [1, 1.15]);
  const heroBgScale = useSpring(heroBgScaleRaw, { stiffness: 80, damping: 20 });

  const [toastOpen, setToastOpen] = useState(true);

  // Countdown timer calculation
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });
  // Fetch all content from Supabase database (Gracefully falls back to mock data if unconfigured/offline)
  const fetchDbData = async () => {
    // 1. Load localStorage updates first so they render immediately
    const localDepts = localStorage.getItem('srec_offline_departments');
    if (localDepts) setDepartments(JSON.parse(localDepts));

    const localCommittee = localStorage.getItem('srec_offline_committee');
    if (localCommittee) setCommitteeMembers(JSON.parse(localCommittee));

    const localSpeakers = localStorage.getItem('srec_offline_speakers');
    if (localSpeakers) setSpeakers(JSON.parse(localSpeakers));

    const localDates = localStorage.getItem('srec_offline_important_dates');
    if (localDates) {
      setImportantDates(JSON.parse(localDates));
    } else {
      const defaultMockDates = [
        { id: 1, title: 'Full Paper Submission Deadline', event_date: 'May 2nd, 2027', desc: 'Submission deadline for initial full paper review via Microsoft CMT portal.', sort_order: 1 },
        { id: 2, title: 'Notification of Acceptance', event_date: 'June 15th, 2027', desc: 'Acceptance/rejection decisions notified to authors.', sort_order: 2 },
        { id: 3, title: 'Camera-Ready Paper Submission', event_date: 'August 1st, 2027', desc: 'Final camera-ready paper and copyright form upload deadline.', sort_order: 3 },
        { id: 4, title: 'Early Bird Registration Deadline', event_date: 'September 15th, 2027', desc: 'Early registration deadline for accepted paper authors.', sort_order: 4 },
        { id: 5, title: 'Pre-Conference Tutorial & Workshops', event_date: 'December 16th, 2027', desc: 'Hands-on pre-conference technical tutorials and domain workshops.', sort_order: 5 },
        { id: 6, title: 'Main Conference Days', event_date: 'December 17th – 18th, 2027', desc: 'Main conference tracks, keynote sessions, and technical paper presentations.', sort_order: 6 }
      ];
      setImportantDates(defaultMockDates);
      localStorage.setItem('srec_offline_important_dates', JSON.stringify(defaultMockDates));
    }

    const localWorkshops = localStorage.getItem('srec_offline_workshops');
    if (localWorkshops) setWorkshops(JSON.parse(localWorkshops));

    const localInfo = localStorage.getItem('srec_offline_info');
    if (localInfo) setInfo(prev => ({ ...prev, ...JSON.parse(localInfo) }));

    const localRegs = localStorage.getItem('srec_offline_registrations');
    if (localRegs) {
      setSubmittedRegistrations(JSON.parse(localRegs));
    } else {
      const defaultMockRegs = [
        {
          id: 1,
          paper_id: 'SREC-2027-042',
          paper_title: 'An Efficient Machine Learning Framework for Edge Devices',
          author_name: 'Dr. Rajesh Kumar',
          email: 'rajesh.kumar@srec.ac.in',
          phone: '+91 9843212345',
          screenshot_name: 'transaction_proof_rajesh.png',
          screenshot_size: 124500,
          register_for_tour: true,
          preferred_tour_place: 'Ooty Botanical Gardens',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 2,
          paper_id: 'SREC-2027-109',
          paper_title: 'Deep Learning in Precision Agriculture: A Survey',
          author_name: 'Sarah Jenkins',
          email: 'sjenkins@mit.edu',
          phone: '+1 (617) 555-0199',
          screenshot_name: 'wire_transfer_sarah.pdf',
          screenshot_size: 453000,
          register_for_tour: false,
          preferred_tour_place: null,
          created_at: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: 3,
          paper_id: 'SREC-2027-087',
          paper_title: 'Secure Blockchain-based EHR System for Smart Healthcare',
          author_name: 'Amit Sharma',
          email: 'amit.sharma@iitb.ac.in',
          phone: '+91 8877665544',
          screenshot_name: 'receipt_payment_amit.jpg',
          screenshot_size: 215000,
          register_for_tour: true,
          preferred_tour_place: 'Mudumalai Wildlife Sanctuary',
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ];
      localStorage.setItem('srec_offline_registrations', JSON.stringify(defaultMockRegs));
      setSubmittedRegistrations(defaultMockRegs);
    }

    // 2. Fetch from database if Supabase is connected
    if (!isSupabaseConfigured || !supabase) {
      console.info('Supabase not fully configured. Running on localStorage data.');
      return;
    }

    try {
      // Fetch departments
      const { data: deptData, error: errDept } = await supabase.from('departments').select('*').order('sort_order');
      if (!errDept && deptData) {
        setDepartments(deptData);
        localStorage.setItem('srec_offline_departments', JSON.stringify(deptData));
      }

      // Fetch committee
      const { data: committeeData, error: errCommittee } = await supabase.from('committee').select('*').order('id');
      if (!errCommittee && committeeData) {
        setCommitteeMembers(committeeData);
        localStorage.setItem('srec_offline_committee', JSON.stringify(committeeData));
      }

      // Fetch speakers
      const { data: speakersData, error: errSpeakers } = await supabase.from('speakers').select('*').order('id');
      if (!errSpeakers && speakersData) {
        setSpeakers(speakersData);
        localStorage.setItem('srec_offline_speakers', JSON.stringify(speakersData));
      }

      // Fetch important dates
      const { data: datesData, error: errDates } = await supabase.from('important_dates').select('*').order('sort_order');
      if (!errDates && datesData) {
        setImportantDates(datesData);
        localStorage.setItem('srec_offline_important_dates', JSON.stringify(datesData));
      }

      // Fetch workshops
      const { data: workshopsData, error: errWorkshops } = await supabase.from('workshops').select('*').order('id');
      if (!errWorkshops && workshopsData) {
        setWorkshops(workshopsData);
        localStorage.setItem('srec_offline_workshops', JSON.stringify(workshopsData));
      }

      // Fetch registration fees
      // const { data: feesData, error: errFees } = await supabase.from('registration_fees').select('*').order('sort_order');
      // if (!errFees && feesData) setRegistrationFees(feesData);

      // Fetch stats
      const { data: statsData, error: errStats } = await supabase.from('stats').select('*').order('sort_order');
      if (!errStats && statsData) setStats(statsData);

      // Fetch coordinators
      const { data: coordinatorsData, error: errCoordinators } = await supabase.from('coordinators').select('*').order('sort_order');
      if (!errCoordinators && coordinatorsData) setCoordinators(coordinatorsData);

      // Fetch registration pricing rules
      const { data: pricingData, error: errPricing } = await supabase.from('registration_pricing').select('*');
      if (!errPricing && pricingData && pricingData.length > 0) {
        const pricingMap: Record<string, number> = {};
        pricingData.forEach((row: any) => {
          pricingMap[row.key] = Number(row.value);
        });
        setPricing(pricingMap);
      }

      // Fetch conference info
      const { data: infoData, error: errInfo } = await supabase.from('conference_info').select('*');
      if (!errInfo && infoData) {
        const infoMap: Record<string, string> = {};
        infoData.forEach((row: any) => {
          infoMap[row.key] = row.value;
        });
        setInfo(prev => ({ ...prev, ...infoMap }));
        localStorage.setItem('srec_offline_info', JSON.stringify(infoMap));
      }

      // Fetch organizing_departments table if present
      const { data: orgDeptRows, error: errOrgDept } = await supabase.from('organizing_departments').select('*').order('sort_order');
      if (!errOrgDept && orgDeptRows && orgDeptRows.length > 0) {
        const orgDeptMap: Record<string, any> = {};
        orgDeptRows.forEach((row: any) => {
          orgDeptMap[row.dept_key] = {
            title: row.title,
            subtitle: row.subtitle,
            desc: Array.isArray(row.description) ? row.description : [row.description],
            highlights: Array.isArray(row.highlights) ? row.highlights : []
          };
        });
        setInfo(prev => ({ ...prev, organizing_departments_info: JSON.stringify(orgDeptMap) }));
      }

      // Fetch registrations log
      const { data: registrationsLog, error: errReg } = await supabase.from('registrations').select('*').order('created_at', { ascending: false });
      console.log('[REGISTRATIONS FETCH]', { data: registrationsLog, error: errReg });
      if (errReg) {
        console.error('[REGISTRATIONS ERROR]', errReg);
      } else if (registrationsLog && registrationsLog.length > 0) {
        setSubmittedRegistrations(registrationsLog);
        localStorage.setItem('srec_offline_registrations', JSON.stringify(registrationsLog));
        console.log('[REGISTRATIONS LOADED] Count:', registrationsLog.length);
      } else if (registrationsLog && registrationsLog.length === 0) {
        setSubmittedRegistrations([]);
        localStorage.setItem('srec_offline_registrations', JSON.stringify([]));
        console.log('[REGISTRATIONS] DB returned no rows. Showing no data.');
      } else {
        console.warn('[REGISTRATIONS] DB returned null or undefined. Keeping existing data. Check Supabase RLS SELECT policy.');
      }
    } catch (err) {
      console.warn('Failed to load online data. Falling back to offline fallback state.', err);
    }
  };

  useEffect(() => {
    fetchDbData();
  }, []);

  // Set dynamic banner height CSS variable
  useEffect(() => {
    const isBannerVisible = info.show_announcement !== 'false';
    document.documentElement.style.setProperty('--banner-height', isBannerVisible ? '40px' : '0px');
  }, [info.show_announcement]);

  useEffect(() => {
    const targetTime = info.countdown_target ? new Date(info.countdown_target).getTime() : new Date('2027-04-04T09:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        clearInterval(interval);
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s, isOver: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [info.countdown_target]);

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const scrollPosition = window.scrollY + 200; // Offset for header

      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll chatbot messages
  useEffect(() => {
    const container = document.getElementById('nexus-chat-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessages, isAgentTyping, showNexusChat]);

  const scrollToSection = (id: string) => {
    if (id === 'nexus-agent') {
      setShowNexusChat(true);
      setMobileMenuOpen(false);
      return;
    }

    if (id === 'explore') {
      setCurrentPage('explore');
      setActiveSection('explore');
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'admin') {
      setCurrentPage('admin');
      setActiveSection('admin');
      setMobileMenuOpen(false);
      setShowAdminPortal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'committee') {
      setCurrentPage('committee');
      setActiveSection('committee');
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'guidelines' || id === 'call-for-papers-main') {
      setCurrentPage('guidelines');
      setActiveSection(id);
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (id === 'registration') {
      setCurrentPage('payment');
      setActiveSection('registration');
      setMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const prevPage = currentPage;
    setCurrentPage('main');

    // Clean up URL query parameters when returning to main page
    if (window.location.search) {
      window.history.pushState({}, '', '/');
    }

    // Allow state change and DOM rendering to complete if switching back from separate pages
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 85;
        window.scrollTo({
          top: el.offsetTop - offset,
          behavior: 'smooth'
        });
        setActiveSection(id);
        setMobileMenuOpen(false);
      }
    }, ['explore', 'committee', 'guidelines', 'payment'].includes(prevPage) ? 100 : 0);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const targetEmail = info.contact_email || info.emailjs_recipient || 'aectsd2027@srec.ac.in';
    // 1. Store message in Supabase database & localStorage
    const newMsg = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      subject: formData.subject || 'General Inquiry',
      message: formData.message,
      created_at: new Date().toISOString()
    };

    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('contact_messages').insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'General Inquiry',
          message: formData.message
        });
      }
      const existingMsgs = JSON.parse(localStorage.getItem('srec_offline_contact_messages') || '[]');
      localStorage.setItem('srec_offline_contact_messages', JSON.stringify([newMsg, ...existingMsgs]));
    } catch (dbErr) {
      console.warn('Database log warning:', dbErr);
    }

    // 2. Instant Primary Email Dispatch via Formspree Endpoint
    const formspreeEndpoint = info.formspree_url || 'https://formspree.io/f/xlgqwbbd';
    try {
      await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'General Inquiry',
          message: formData.message
        })
      });
      console.log('Instant contact email dispatched via Formspree!');
    } catch (fsErr) {
      console.warn('Formspree dispatch warning:', fsErr);
    }

    // 3. Fallback Resend Dispatch (if API key is present)
    const resendApiKey = info.resend_api_key || import.meta.env.VITE_RESEND_API_KEY || '';
    if (resendApiKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`
          },
          body: JSON.stringify({
            from: 'AECTSD 2027 Portal <onboarding@resend.dev>',
            to: [targetEmail],
            subject: `[AECTSD 2027 Inquiry] ${formData.subject || 'New Contact Inquiry'}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #092147; padding: 20px; text-align: center; color: white;">
                  <h2 style="margin: 0; color: #ffffff;">AECTSD 2027 Inquiry Notification</h2>
                  <p style="margin: 5px 0 0; opacity: 0.8; font-size: 14px;">Sri Ramakrishna Engineering College</p>
                </div>
                <div style="padding: 24px; color: #334155; background-color: #ffffff;">
                  <p style="margin: 0 0 10px;"><strong>Name:</strong> ${formData.name}</p>
                  <p style="margin: 0 0 10px;"><strong>Sender Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
                  <p style="margin: 0 0 10px;"><strong>Subject:</strong> ${formData.subject || 'General Inquiry'}</p>
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                  <h4 style="margin: 0 0 10px; color: #091d36;">Message:</h4>
                  <p style="white-space: pre-wrap; background: #f8fafc; padding: 16px; border-radius: 6px; border: 1px solid #cbd5e1; margin: 0;">${formData.message}</p>
                </div>
              </div>
            `,
            reply_to: formData.email
          })
        });
      } catch (resendErr) {
        console.warn('Resend email send warning:', resendErr);
      }
    }

    // 3. Fallback EmailJS Dispatch (if service ID is configured)
    const serviceId = info.emailjs_service_id;
    const templateId = info.emailjs_template_id;
    const publicKey = info.emailjs_public_key;

    if (serviceId && templateId && publicKey) {
      try {
        await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: {
              to_email: targetEmail,
              from_name: formData.name,
              from_email: formData.email,
              subject: formData.subject || 'General Query',
              message: formData.message
            }
          })
        });
        console.log('Automated contact email sent via EmailJS!');
      } catch (emailErr) {
        console.warn('Automated background email send warning:', emailErr);
      }
    }

    setFormSubmitted(true);
  };


  // Framer Motion Animation Presets
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const navLabelMap: Record<string, string> = {
    home: info.nav_home,
    about: info.nav_about,
    committee: info.nav_committee,
    speakers: info.nav_speakers,
    'call-for-papers': info.nav_call_for_papers,
    'important-dates': info.nav_important_dates,
    workshops: info.nav_workshops,
    guidelines: info.nav_guidelines,
    'paper-submission': info.nav_paper_submission,
    registration: info.nav_registration,
    explore: info.nav_explore || "Explore Coimbatore",
    venue: info.nav_venue || "Venue",
    'contact-us': info.nav_contact_us,
    'ieee-sb': info.nav_ieee_sb || "IEEE SB",
    'nexus-agent': info.nav_nexus_agent || "Nexus Agent"
  };

  const renderBannerContent = (text: string) => {
    const target = "Call for Papers!";
    if (text.includes(target)) {
      const parts = text.split(target);
      return (
        <>
          {parts[0]}<strong>{target}</strong>{parts[1]}
        </>
      );
    }
    return text;
  };

  const getMemberImage = (name: string, imageUrl?: string): string => {
    if (imageUrl && imageUrl !== 'no_file' && imageUrl !== '') return imageUrl;
    if (name.includes('Sundar Ramakrishnan') || name.includes('R. Sundar')) return logo5;
    if (name.includes('Thiru')) return trust1Img;
    if (name.includes('Balamurugan')) return balamurgunImg;
    if (name.includes('Soundarrajan')) return principalImg;
    if (name.includes('P. Sakthivel')) return sakthivelImg;
    if (name.includes('S. Radha')) return radhaImg;
    if (name.includes('S. Brindha')) return brindhaImg;
    if (name.toLowerCase().includes('kingsy')) return kingsyImg;
    if (name.includes('Ramakrishna')) return Tru1;
    if (name.includes('Lakshminarayanaswamy')) return Tru2;
    //if (name.includes('Praveen Kumar')) return praveenkumarImg;
    if (name.includes('Karpagam')) return karpagamImg;
    if (name.includes('Jansi')) return jansiImg;
    // if (name.includes('Aravindaguru'))   return aravindaguruImg;
    // if (name.includes('Sowntharya'))     return sowntharImage;
    // if (name.includes('N. Saranya'))     return saranyaImg;
    // if (name.includes('Vishnu Vardhan')) return vishnuVardhanImg;

    // ── ORGANIZING: Local Arrangements ───────────────────────────────
    // if (name.includes('Deepa B Prabhu')) return deepaImg;
    // if (name.includes('V. Radhika'))     return radhikaImg;
    // if (name.includes('Marisekar'))      return marisekarImg;
    // if (name.includes('Logaprakash'))    return logaprakashImg;

    // ── ORGANIZING: Registration ──────────────────────────────────────
    // if (name.includes('H. Vidhya'))      return vidhyaImg;
    // if (name.includes('T. Anitha'))      return anithaImg;
    // if (name.includes('M. Jaishree'))    return jaishreeImg;
    // if (name.includes('R. S. Ramya'))    return ramyaImg;
    // if (name.includes('Jeevanandham'))   return jeevanandhamImg;
    // if (name.includes('Divyalakshmi'))   return divyalakshmiImg;

    // ── ORGANIZING: Website & Outreach ───────────────────────────────
    // if (name.includes('Vishnu Durai'))   return vishnuDuraiImg;
    // if (name.includes('Robin Johny'))    return robinJohnyImg;
    // if (name.includes('G. Narendran'))   return gNarendranImg;

    // ── ORGANIZING: Hospitality ───────────────────────────────────────
    // if (name.includes('P. Perumal'))     return perumalImg;
    // if (name.includes('Nagarajapandian'))return nagarajapandianImg;
    // if (name.includes('Krishna Kumar'))  return krishnaKumarImg;

    // ── ORGANIZING: General Members ───────────────────────────────────
    // if (name.includes('N. Divya'))       return divyaImg;
    // if (name.includes('R. Kiruba'))      return kirubaImg;
    // if (name.includes('S. P. Vimal'))    return vimalImg;
    // if (name.includes('Selva Kumar'))    return selvaKumarImg;
    // if (name.includes('Rajalakshmi'))    return rajalakshmiImg;
    // if (name.includes('G. Lavanya'))     return lavanyaImg;

    // ── STEERING COMMITTEE ────────────────────────────────────────────
    // if (name.includes('N. Susila'))          return susilaImg;
    // if (name.includes('Geetha Devasena'))    return geethaImg;
    // if (name.includes('Grace Selvarani'))    return graceSelvaraniImg;
    // if (name.includes('R. Shanmugasundaram'))return shanmugasundaramImg;
    // if (name.includes('S. Allirani'))        return alliraniImg;
    // if (name.includes('Jagadeeswari'))       return jagadeeswariImg;
    // if (name.includes('N. Sathish Kumar'))   return sathishKumarImg;

    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=091d36,f58220&textColor=ffffff`;
  };

  function handleSendChatMessage(_text: string): void {
    throw new Error('Function not implemented.');
  }


  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: 'var(--bg-deep)' }}>
      {/* Background Grids and Overlays */}
      <div className="bg-grid-overlay" />
      <div className="bg-radial-overlay" />
      <div className="bg-bubbles">
        <div className="bubble bubble-1" />
        <div className="bubble bubble-2" />
        <div className="bubble bubble-3" />
      </div>

      {/* Top Page Progress Indicator */}
      {currentPage !== 'admin' && (
        <motion.div
          style={{
            scaleX,
            position: 'fixed',
            top: 'var(--banner-height, 0px)',
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
            transformOrigin: '0%',
            zIndex: 125
          }}
        />
      )}

      {/* Announcement Banner */}
      {currentPage !== 'admin' && info.show_announcement !== 'false' && (
        <div className="announcement-banner">
          <div className="announcement-content">
            <div className="announcement-marquee-container">
              <span className="announcement-marquee-text">
                {renderBannerContent(
                  info.announcement_text ||
                  "📢 Call for Papers! Mark your calendars: The Call for Papers for AECTSD 2027 opens on 15th December 2026. Start preparing your submission"
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header / Navbar (Single Floating Capsule) */}
      {currentPage !== 'admin' && (
        <header className={`main-header ${scrolled ? 'header-scrolled' : ''}`}>
          {/* Nav Capsule Row */}
          <div className="nav-capsule-container">
            <div className="nav-capsule">
              {/* Mobile Navigation Toggle (Positioned on Left for Mobile) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-nav-toggle mobile-toggle-left"
                aria-label="Toggle Navigation Menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={mobileMenuOpen ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ display: 'inline-flex' }}
                  >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Desktop Navigation Links */}
              <nav className="desktop-nav">
                <ul>
                  {NAV_ITEMS.filter((item: any) => item.id !== 'ieee-sb').map((item: any) => (
                    <li key={item.id}>
                      {isSeparatePage(item.id) ? (
                        <a
                          href={`/?page=${item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                        >
                          {item.label}
                          {activeSection === item.id && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="active-indicator-bar"
                            />
                          )}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Desktop Navigation Action Buttons */}
              <div className="header-right-container">
                {/* IEEE SREC SB Portal Link */}
                <a
                  href={info.ieee_sb_url || "https://www.ieeesrec.in/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ieee-sb-btn-nav desktop-btn"
                >
                  IEEE SREC SB
                </a>

                {/* Contact Us Button */}
                <button
                  onClick={() => scrollToSection('contact-us')}
                  className="contact-btn-nav desktop-btn"
                >
                  CONTACT US
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Drawer Menu */}
      {currentPage !== 'admin' && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mobile-nav-drawer"
            >
              {NAV_ITEMS.filter((item: any) => item.id !== 'ieee-sb').map((item: any, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: idx * 0.03,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{ width: '100%' }}
                >
                  {isSeparatePage(item.id) ? (
                    <a
                      href={`/?page=${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mobile-link-item ${activeSection === item.id ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{navLabelMap[item.id] || item.label}</span>
                      <ChevronRight size={16} />
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        scrollToSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`mobile-link-item ${activeSection === item.id ? 'active' : ''}`}
                    >
                      <span>{navLabelMap[item.id] || item.label}</span>
                      <ChevronRight size={16} />
                    </button>
                  )}
                </motion.div>
              ))}

              {/* Action Buttons inside Mobile Drawer */}
              <div className="mobile-action-row">
                <a
                  href={info.ieee_sb_url || "https://ieeesrecsbs.vercel.app/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ieee-sb-btn-nav"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem' }}
                >
                  IEEE SREC SB
                </a>
                <button
                  onClick={() => {
                    scrollToSection('contact-us');
                    setMobileMenuOpen(false);
                  }}
                  className="contact-btn-nav"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem 1rem' }}
                >
                  CONTACT US
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence mode="wait">
        {currentPage === 'explore' ? (
          <motion.div
            key="explore"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <ExplorePage
              adminUser={adminUser}
              onBackToHome={() => {
                setCurrentPage('main');
                setActiveSection('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </motion.div>
        ) : currentPage === 'admin' ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <AdminPage
              supabase={supabase}
              isSupabaseConfigured={isSupabaseConfigured}
              fetchDbData={fetchDbData}
              departments={departments}
              committeeMembers={committeeMembers}
              speakers={speakers}
              importantDates={importantDates}
              workshops={workshops}
              submittedRegistrations={submittedRegistrations}
              info={info}
              pricing={pricing}
              stats={stats}
              coordinators={coordinators}
              setInfo={setInfo}
              setPricing={setPricing}
              setStats={setStats}
              setCoordinators={setCoordinators}
              onClose={() => {
                // Auto logout when leaving admin page
                localStorage.removeItem('srec_logged_in_admin');
                setAdminUser(null);
                setAdminUsername('');
                setAdminPassword('');
                setAdminTab('overview');
                setCurrentPage('main');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </motion.div>
        ) : currentPage === 'committee' ? (
          <motion.div
            key="committee"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <CommitteePage
              committeeMembers={committeeMembers}
              info={info}
              getMemberImage={getMemberImage}
              onBackToHome={() => {
                setCurrentPage('main');
                setActiveSection('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </motion.div>
        ) : (currentPage === 'guidelines' || currentPage === 'payment') ? (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <PaymentPage
              info={info}
              pricing={pricing}
              isSupabaseConfigured={isSupabaseConfigured}
              supabase={supabase}
              fetchDbData={fetchDbData}
              initialTab={currentPage === 'guidelines' ? 'submission' : initialRegTab}

              regPaperId={regPaperId}
              setRegPaperId={setRegPaperId}
              regPaperTitle={regPaperTitle}
              setRegPaperTitle={setRegPaperTitle}
              regAuthorName={regAuthorName}
              setRegAuthorName={setRegAuthorName}
              regEmail={regEmail}
              setRegEmail={setRegEmail}
              regPhone={regPhone}
              setRegPhone={setRegPhone}
              regPhoneCode={regPhoneCode}
              setRegPhoneCode={setRegPhoneCode}
              regScreenshot={regScreenshot}
              setRegScreenshot={setRegScreenshot}
              regPaymentUrl={regPaymentUrl}
              setRegPaymentUrl={setRegPaymentUrl}
              regRegisterForTour={regRegisterForTour}
              setRegRegisterForTour={setRegRegisterForTour}
              regPreferredTourPlace={regPreferredTourPlace}
              setRegPreferredTourPlace={setRegPreferredTourPlace}
              regSuccess={regSuccess}
              setRegSuccess={setRegSuccess}
              regError={regError}
              setRegError={setRegError}
              regSubmitting={regSubmitting}
              setRegSubmitting={setRegSubmitting}
              showRegValidation={showRegValidation}
              setShowRegValidation={setShowRegValidation}
              paymentTab={paymentTab}
              setPaymentTab={setPaymentTab}

              isIndian={isIndian}
              setIsIndian={setIsIndian}
              isStudent={isStudent}
              setIsStudent={setIsStudent}
              isIeeeMember={isIeeeMember}
              setIsIeeeMember={setIsIeeeMember}
              isLate={isLate}
              setIsLate={setIsLate}
              pageCount={pageCount}
              setPageCount={setPageCount}
              workshopAddon={workshopAddon}
              setWorkshopAddon={setWorkshopAddon}
              virtualMode={virtualMode}
              setVirtualMode={setVirtualMode}
              regOption={regOption}
              setRegOption={setRegOption}

              handleRegistrationSubmit={handleRegistrationSubmit}
              calculateTotalFees={calculateTotalFees}
              onBackToHome={() => {
                setCurrentPage('main');
                setActiveSection('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {/* Hero Section */}
            <section
              id="home"
              style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                textAlign: 'center',
                overflow: 'hidden'
              }}
            >
              {/* Parallax Hero Background Image */}
              <motion.div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${info.hero_background_image || heroBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  y: heroBgY,
                  scale: heroBgScale,
                  zIndex: 0
                }}
              />

              {/* Dark overlay for rich high-contrast golden AECTSD typography */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(15, 5, 10, 0.72) 0%, rgba(20, 5, 12, 0.85) 60%, rgba(15, 5, 10, 0.92) 100%)',
                zIndex: 1
              }} />

              <div className="AECTSD-hero-wrapper">
                {/* 1. Floating 3-Logo White Banner */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="AECTSD-logo-banner"
                >
                  <img src={srecLogo} alt="SREC Logo" className="AECTSD-banner-logo" />
                  <div className="AECTSD-logo-divider" />
                  <img src={acLogo} alt="AECTSD Logo" className="AECTSD-banner-logo" />
                  <div className="AECTSD-logo-divider" />
                  <img src={logo2} alt="SNR Trust Logo" className="AECTSD-banner-logo" />
                </motion.div>



                {/* 3. Massive Golden Serif Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="AECTSD-hero-title"
                >
                  {info.hero_title ? (
                    info.hero_title.includes(' ') ? (
                      <>
                        {info.hero_title.split(' ')[0]}
                        <br />
                        {info.hero_title.split(' ').slice(1).join(' ')}
                      </>
                    ) : info.hero_title
                  ) : (
                    <>IEEE<br />AECTSD 2027</>
                  )}
                </motion.h1>

                {/* 4. Conference Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="AECTSD-hero-subtitle"
                >
                  {info.hero_subtitle || 'SECOND INTERNATIONAL CONFERENCE ON ADVANCES IN ENGINEERING AND COMPUTING TECHNOLOGIES FOR SUSTAINABLE DEVELOPMENT'}
                </motion.p>

                {/* 5. Golden Date & Location Pill */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="AECTSD-date-pill"
                >
                  <Calendar size={18} />
                  <span>
                    {renderDateWithSuperscript(info.event_date_display || '17th and 18th December 2027')} &nbsp;|&nbsp; {info.event_location_display || 'Sri Ramakrishna Engineering College, Coimbatore, Tamilnadu, India'}
                  </span>
                </motion.div>

                {/* Live Countdown Timer Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  className="AECTSD-countdown-bar"
                >
                  <div className="AECTSD-countdown-title">
                    <Clock size={15} />
                    <span>{info.hero_countdown_title || 'CONFERENCE COUNTDOWN'}</span>
                  </div>
                  <div className="AECTSD-countdown-units">
                    {[
                      { label: info.label_days || 'Days', value: timeLeft.days },
                      { label: info.label_hours || 'Hours', value: timeLeft.hours },
                      { label: info.label_mins || 'Mins', value: timeLeft.minutes },
                      { label: info.label_secs || 'Secs', value: timeLeft.seconds }
                    ].map((t, idx) => (
                      <div key={idx} className="AECTSD-countdown-box">
                        <span className="AECTSD-countdown-val">
                          {String(t.value).padStart(2, '0')}
                        </span>
                        <span className="AECTSD-countdown-lbl">{t.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* 6. Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="AECTSD-action-row"
                >
                  <button
                    onClick={() => scrollToSection('paper-submission')}
                    className="AECTSD-btn-yellow"
                  >
                    {info.hero_btn_submit || 'Submit Paper'}
                  </button>
                  <button
                    onClick={() => {
                      alert('Brochure download starting...');
                      const link = document.createElement('a');
                      link.href = '#';
                      link.setAttribute('download', 'AECTSD_2027_Brochure.pdf');
                      document.body.appendChild(link);
                    }}
                    className="AECTSD-btn-outline"
                  >
                    {info.hero_btn_brochure || 'Download Brochure'}
                  </button>
                </motion.div>
              </div>

              {/* 7. CMT/Portal Pop-Up Toast Floating Card (Bottom Left Corner) */}
              <AnimatePresence>
                {toastOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.85, transition: { duration: 0.25, ease: 'easeInOut' } }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="AECTSD-toast-card"
                  >
                    {/* Close X Button for Mobile & Desktop */}
                    <button
                      onClick={() => setToastOpen(false)}
                      className="AECTSD-toast-close-btn"
                      title="Dismiss notification"
                    >
                      <X size={15} />
                    </button>

                    <div className="AECTSD-toast-header">
                      <div className="AECTSD-toast-icon">
                        <FileText size={18} />
                      </div>
                      <div style={{ flex: 1, paddingRight: '1rem' }}>
                        <div className="AECTSD-toast-title">{info.cmt_portal_badge || 'CMT PORTAL LIVE'}</div>
                        <div className="AECTSD-toast-desc">{info.cmt_portal_desc || 'Paper submission for AECTSD 2027 is now open via Microsoft CMT.'}</div>
                      </div>
                    </div>
                    <a
                      href={info.cmt_link || info.cmt_portal_url || "https://cmt3.research.microsoft.com/aectsd2025"}
                      onClick={(e) => {
                        e.preventDefault();
                        const link = info.cmt_link || info.cmt_portal_url;
                        if (link && link !== '#paper-submission') {
                          window.open(link, "_blank");
                        } else {
                          scrollToSection('guidelines');
                        }
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="AECTSD-toast-btn"
                    >
                      {info.cmt_portal_btn_label || 'SUBMIT PAPER →'}
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* About Section */}
            <section id="about" className="section" style={{ background: '#faf9f6', borderBottom: '1px solid #e2e8f0' }}>
              <div className="container">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-100px' }}
                  variants={fadeInUp}
                  style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                  <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginTop: '0.5rem', fontWeight: 800 }}>
                    {info.logo_title || "IEEE AECTSD 2027"}
                  </h2>
                  <div style={{ height: '3.5px', width: '80px', background: '#f58220', margin: '1rem auto 0', borderRadius: '2px' }} />
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', marginBottom: '4rem', alignItems: 'start' }} className="grid-2-col-desktop-custom">
                  {/* Left Column: Badges & Details */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ background: '#fef3c7', color: '#b45309', padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Theme
                      </span>
                      <span style={{ background: '#eff6ff', color: '#1e40af', padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {info.conf_record_no ? `IEEE Conference Record: #${info.conf_record_no}` : "IEEE Conference"}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.85rem', color: '#091d36', fontWeight: 800, lineHeight: 1.3, margin: '0.5rem 0 0' }}>
                      {info.hero_subtitle || "Net-Zero Cyber-Physical Intelligence: AI, 6G & Sustainable Electronics"}
                    </h3>

                    {info.about_conference?.split('\n\n').filter(Boolean).map((block: string, idx: number) => {
                      const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
                      const hasBullets = lines.some(line => line.startsWith('•') || line.startsWith('-'));

                      if (hasBullets) {
                        const headerLines = lines.filter(l => !l.startsWith('•') && !l.startsWith('-'));
                        const bulletLines = lines.filter(l => l.startsWith('•') || l.startsWith('-'));
                        return (
                          <div key={idx} style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                            {headerLines.map((h, hidx) => (
                              <p key={hidx} style={{ color: 'var(--text-secondary)', fontWeight: 700, margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>
                                {h}
                              </p>
                            ))}
                            <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0', color: 'var(--text-secondary)', lineHeight: '1.75', fontSize: '0.95rem', listStyleType: 'disc' }}>
                              {bulletLines.map((bLine, bIdx) => {
                                const text = bLine.replace(/^[•\-*\s]+/, '');
                                const deptInfo = getDeptInfoFromText(text, info);
                                return (
                                  <li key={bIdx} style={{ marginBottom: '0.4rem' }}>
                                    <button
                                      type="button"
                                      onClick={() => setActiveDeptModal(deptInfo)}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        font: 'inherit',
                                        color: '#0f52ba',
                                        fontWeight: 700,
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        textAlign: 'left'
                                      }}
                                    >
                                      {text} ↗
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        );
                      }

                      const isMtechTitle = block.startsWith('M.TECH -');
                      const isTitle = isMtechTitle || block.startsWith('About the Department:') || block.startsWith('Organizing Departments:');
                      if (isTitle) {
                        return (
                          <h4
                            key={idx}
                            id={isMtechTitle ? "about-mtech-dept" : undefined}
                            style={{ fontSize: '1.15rem', color: '#091d36', fontWeight: 800, margin: '1.5rem 0 0.25rem 0', scrollMarginTop: '100px' }}
                          >
                            {block}
                          </h4>
                        );
                      }

                      return (
                        <p key={idx} style={{ color: 'var(--text-secondary)', margin: 0, textAlign: 'justify', lineHeight: '1.75', fontSize: '0.95rem' }}>
                          {block}
                        </p>
                      );
                    })}

                    <div style={{
                      marginTop: '1rem',
                      padding: '1.25rem',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
                        <Award size={24} style={{ flexShrink: 0, color: '#0f52ba' }} />
                        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                          The proceedings of the previous edition (<strong>AECTSD 2025</strong>) have been successfully published in <strong>IEEE Xplore</strong> and indexed in <strong>Scopus</strong>.
                        </p>
                      </div>
                      <a
                        href="https://ieee-aectsd.srec.ac.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{
                          fontSize: '0.85rem',
                          padding: '0.5rem 1.25rem',
                          background: 'rgba(59, 130, 246, 0.08)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          color: '#0f52ba',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          textDecoration: 'none',
                          fontWeight: 700
                        }}
                      >
                        Visit Previous Edition
                      </a>
                    </div>
                  </motion.div>

                  {/* Right Column: 2x2 Grid of 4 Cards */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', width: '100%' }}
                  >
                    {[
                      {
                        title: "Global Knowledge Exchange",
                        desc: "Bringing together researchers and professionals from academia, industry and government.",
                        icon: Globe,
                        color: '#e0f2fe',
                        iconColor: '#0369a1'
                      },
                      {
                        title: "Industry Collaboration",
                        desc: "Promoting partnerships among industries, startups, innovators and IEEE communities.",
                        icon: Handshake,
                        color: '#fef3c7',
                        iconColor: '#b45309'
                      },
                      {
                        title: "Sustainable Engineering",
                        desc: "Encouraging green technologies and engineering solutions aligned with Net-Zero goals.",
                        icon: Leaf,
                        color: '#dcfce7',
                        iconColor: '#15803d'
                      },
                      {
                        title: "Future-Ready Society",
                        desc: "Advancing AI, 6G, CPS and sustainable electronics for smart and resilient communities.",
                        icon: Sparkles,
                        color: '#f3e8ff',
                        iconColor: '#6b21a8'
                      }
                    ].map((card, cidx) => {
                      const CardIcon = card.icon;
                      return (
                        <motion.div
                          key={cidx}
                          initial={{ opacity: 0, y: 30, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 100, damping: 15, delay: cidx * 0.15 }}
                          className="about-grid-card"
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '1rem',
                            padding: '1.75rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            textAlign: 'left',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                            position: 'relative'
                          }}
                        >
                          <div style={{
                            width: '45px',
                            height: '45px',
                            borderRadius: '50%',
                            background: card.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: card.iconColor
                          }}>
                            <CardIcon size={22} />
                          </div>
                          <h4 style={{ fontSize: '1.05rem', color: '#091d36', fontWeight: 800, margin: 0 }}>{card.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{card.desc}</p>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>

                {/* Institution Details */}
                <div style={{ width: '100%' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="glass-card"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <Award size={24} style={{ color: '#f58220' }} />
                      <h3 style={{ fontSize: '1.5rem', color: '#091d36', fontWeight: 700 }}>{info.about_card_inst_title || "About the Institution"}</h3>
                    </div>
                    {info.about_institution?.split('\n\n').filter(Boolean).map((para: string, idx: number) => (
                      <p key={idx} style={{ color: 'var(--text-secondary)', marginBottom: '1rem', textIndent: '2rem', textAlign: 'justify', lineHeight: '1.7', fontSize: '0.95rem' }}>
                        {para}
                      </p>
                    ))}
                  </motion.div>
                </div>

                {/* Stats Bar */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid-4-col"
                  style={{ marginTop: '4rem' }}
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="glass-card"
                      style={{ textAlign: 'center', padding: '1.5rem' }}
                    >
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3b82f6', fontFamily: 'var(--font-heading)' }}>
                        <CounterUp target={stat.number} />
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Committee page is now standalone at src/components/CommitteePage.tsx */}

            {/* Speakers Section */}
            <section id="speakers" className="section">
              <div className="container">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                  <span style={{ color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>{info.speakers_badge}</span>
                  <h2 style={{ fontSize: '2.5rem', color: 'white', marginTop: '0.5rem' }}>{info.speakers_title}</h2>
                  <div style={{ height: '3px', width: '60px', background: '#3b82f6', margin: '1rem auto 0' }} />
                  {info.speakers_desc && (
                    <p style={{ color: 'var(--text-secondary)', marginTop: '1.5rem', maxWidth: '800px', marginInline: 'auto', lineHeight: '1.7', fontSize: '0.95rem' }}>
                      {info.speakers_desc}
                    </p>
                  )}
                </motion.div>

                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                  {speakers.map((speaker, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="glass-card"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        borderTop: `4px solid ${speaker.color}`,
                        maxWidth: '380px',
                        width: '100%',
                        flex: '1 1 320px'
                      }}
                    >
                      <div style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: 'rgba(0, 0, 0, 0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${speaker.color}`,
                        marginBottom: '1.25rem',
                        overflow: 'hidden'
                      }}>
                        {speaker.image_url ? (
                          <img
                            src={speaker.image_url}
                            alt={speaker.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <User size={45} style={{ color: speaker.color }} />
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.35rem', color: 'white', marginBottom: '0.25rem' }}>{speaker.name}</h3>
                      <span style={{ fontSize: '0.85rem', color: speaker.color, fontWeight: 700, textTransform: 'uppercase' }}>{speaker.title}</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1.25rem' }}>{speaker.role}</p>
                      {renderSpeakerTalkOrButton(speaker.talk, info.speakers_keynote_label)}
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Call For Papers Section */}
            <section id="call-for-papers" className="section" style={{ background: '#faf9f6', borderBottom: '1px solid #e2e8f0' }}>
              <div className="container">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  style={{ textAlign: 'center', marginBottom: '3rem' }}
                >
                  <span style={{ color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>{info.cfp_badge || 'CALL FOR PAPERS'}</span>
                  <h2 style={{ fontSize: '2.5rem', color: '#091d36', marginTop: '0.5rem', fontWeight: 800 }}>
                    Technical Tracks
                  </h2>
                  <div style={{ height: '3.5px', width: '80px', background: '#eab308', margin: '1rem auto 0', borderRadius: '2px' }} />
                  <p style={{ color: 'var(--text-secondary)', marginTop: '1.5rem', maxWidth: '800px', marginInline: 'auto', lineHeight: 1.7, fontSize: '0.95rem' }}>
                    {info.cfp_desc || 'Prospective authors are invited to submit papers showcasing original research in the following technical tracks.'}
                  </p>
                </motion.div>

                {/* Departments grid */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.08
                      }
                    }
                  }}
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}
                >
                  {departments.map((dept, index) => {
                    const getTrackIcon = (idx: number) => {
                      switch (idx % 8) {
                        case 0: return <Bot size={32} style={{ color: '#ec4899' }} />; // AI & Machine Learning
                        case 1: return <Radio size={32} style={{ color: '#3b82f6' }} />; // 6G & Wireless
                        case 2: return <Building2 size={32} style={{ color: '#06b6d4' }} />; // Cyber-Physical & Digital Twins
                        case 3: return <Zap size={32} style={{ color: '#f59e0b' }} />; // VLSI & Embedded Systems
                        case 4: return <Plug size={32} style={{ color: '#8b5cf6' }} />; // Power Electronics & Smart Grids
                        case 5: return <Sliders size={32} style={{ color: '#64748b' }} />; // Robotics & Automation
                        case 6: return <Atom size={32} style={{ color: '#6366f1' }} />; // Photonics & Quantum
                        case 7: default: return <Satellite size={32} style={{ color: '#4f46e5' }} />; // Sensors & Remote Sensing
                      }
                    };

                    return (
                      <motion.div
                        key={index}
                        variants={{
                          hidden: { opacity: 0, y: 30, scale: 0.96 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: { type: 'spring', stiffness: 90, damping: 14 }
                          }
                        }}
                        whileHover={{ y: -6, scale: 1.015 }}
                        className="track-card-item"
                        onClick={() => setSelectedDept(dept)}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '1.25rem',
                          padding: '2.25rem 1.5rem',
                          position: 'relative',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
                          border: '1.5px solid #f1f5f9',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          minHeight: '260px',
                          justifyContent: 'center',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        {/* Faint Background Watermark Number in Center */}
                        <span
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '6.5rem',
                            fontWeight: 900,
                            color: 'rgba(15, 23, 42, 0.035)',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            fontFamily: 'var(--font-heading)',
                            zIndex: 0,
                            lineHeight: 1
                          }}
                        >
                          {(index + 1).toString().padStart(2, '0')}
                        </span>

                        {/* Top Icon Badge */}
                        <div
                          className="track-icon-badge"
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            width: '64px',
                            height: '64px',
                            borderRadius: '1rem',
                            background: '#f8fafc',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.25rem',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {getTrackIcon(index)}
                        </div>

                        {/* Track Title */}
                        <h3
                          className="track-title-text"
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            fontSize: '1.05rem',
                            color: '#701a2b',
                            fontWeight: 800,
                            margin: 0,
                            lineHeight: 1.45,
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {dept.name}
                        </h3>

                        {/* Divider & Action Prompt */}
                        <div
                          style={{
                            position: 'relative',
                            zIndex: 1,
                            marginTop: '1.25rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}
                        >
                          <div className="track-card-divider" style={{ width: '36px', height: '2.5px', background: '#f58220', borderRadius: '2px', transition: 'all 0.3s ease' }} />
                          <span style={{ fontSize: '0.78rem', color: '#0f52ba', fontWeight: 700, opacity: 0.85, marginTop: '0.2rem' }}>
                            Click to View Scope Details ↗
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Template Downloads */}
                <div style={{ marginTop: '3.5rem', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="https://template-selector.ieee.org/"
                    className="btn btn-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.8rem 2.2rem' }}
                  >
                    <Download size={18} />
                    Download IEEE Paper Templates
                  </a>
                </div>
              </div>
            </section>

            {/* Important Dates Section */}
            <section id="important-dates" className="section" style={{ background: '#ffffff', color: '#0f172a', padding: '6rem 0' }}>
              <div className="container">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                  <span style={{ color: '#0b4f30', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.12em' }}>{info.dates_badge || "TIMELINE"}</span>
                  <h2 style={{ fontSize: '2.5rem', color: '#0b4f30', marginTop: '0.5rem', fontWeight: 800 }}>{info.dates_title || "Important Dates"}</h2>
                  <div style={{ height: '3.5px', width: '80px', background: '#fbbf24', margin: '1rem auto 0', borderRadius: '2px' }} />
                </motion.div>

                {/* Blocks Layout with Status-Based Color Badges (Red = Past, Green = Present, Blue = Future) */}
                <div className="grid-4-col" style={{ marginTop: '2rem', gap: '1.25rem' }}>
                  {(() => {
                    const STATUS_PALETTES = {
                      past: {
                        badgeBg: '#ef4444',        // Red for past dates
                        badgeText: '#ffffff',
                        iconColor: '#ef4444',
                        border: '#fecaca',
                        borderActive: '#dc2626',
                        titleColor: '#091d36',
                        glowColor: 'rgba(239, 68, 68, 0.15)'
                      },
                      present: {
                        badgeBg: '#10b981',        // Green for present / today dates
                        badgeText: '#ffffff',
                        iconColor: '#10b981',
                        border: '#a7f3d0',
                        borderActive: '#059669',
                        titleColor: '#091d36',
                        glowColor: 'rgba(16, 185, 129, 0.18)'
                      },
                      future: {
                        badgeBg: '#3b82f6',        // Blue for future dates
                        badgeText: '#ffffff',
                        iconColor: '#3b82f6',
                        border: '#bfdbfe',
                        borderActive: '#1d4ed8',
                        titleColor: '#091d36',
                        glowColor: 'rgba(59, 130, 246, 0.15)'
                      }
                    };

                    return importantDates.map((evt, idx) => {
                      const status = getDateStatus(evt.event_date);
                      const palette = STATUS_PALETTES[status];

                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 40, scale: 0.95 }}
                          whileInView={{ opacity: 1, y: 0, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 100, damping: 15, delay: idx * 0.1 }}
                          whileHover={{
                            y: -5,
                            borderColor: palette.borderActive,
                            boxShadow: `0 12px 30px ${palette.glowColor}`
                          }}
                          style={{
                            background: '#ffffff',
                            border: `1.5px solid ${palette.border}`,
                            borderRadius: '1.25rem',
                            padding: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'default'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              color: palette.badgeText,
                              background: palette.badgeBg,
                              padding: '0.4rem 0.95rem',
                              borderRadius: '2rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              boxShadow: `0 4px 12px ${palette.glowColor}`
                            }}>
                              {renderDateWithSuperscript(evt.event_date)}
                            </span>

                            {status === 'past' ? (
                              <CheckCircle size={22} style={{ color: palette.iconColor, flexShrink: 0 }} />
                            ) : (
                              <Clock size={22} style={{ color: palette.iconColor, flexShrink: 0 }} />
                            )}
                          </div>

                          <h4 style={{
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            color: palette.titleColor,
                            marginBottom: '0.75rem',
                            lineHeight: 1.3
                          }}>
                            {evt.title}
                          </h4>

                          <p style={{
                            fontSize: '0.9rem',
                            color: '#475569',
                            lineHeight: 1.5,
                            margin: 0
                          }}>
                            {evt.desc}
                          </p>
                        </motion.div>
                      );
                    });
                  })()}
                </div>
              </div>
            </section>

            {/* Workshops Section */}
            <section id="workshops" className="section">
              <div className="container">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                  <span style={{ color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>{info.workshops_badge}</span>
                  <h2 style={{ fontSize: '2.5rem', color: 'white', marginTop: '0.5rem' }}>{info.workshops_title}</h2>
                  <div style={{ height: '3px', width: '60px', background: '#3b82f6', margin: '1rem auto 0' }} />
                  <p style={{ color: 'var(--text-secondary)', marginTop: '1.5rem', maxWidth: '800px', marginInline: 'auto' }}>
                    {info.workshops_desc}
                  </p>
                </motion.div>

                <div className="grid-2-col" style={{ gap: '2rem' }}>
                  {workshops.map((wk, index) => (
                    <div key={index} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>{info.workshop_label} {index + 1}</span>
                      <h3 style={{ fontSize: '1.5rem', color: 'white' }}>{wk.title}</h3>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <strong>{info.label_lead_instructor}</strong> {wk.instructor}
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#06b6d4', fontWeight: 600 }}>
                        <span>{wk.duration}</span>
                        <span>{info.label_fee} {wk.price}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{wk.details}</p>
                      <button
                        onClick={() => scrollToSection('registration')}
                        className="btn btn-secondary"
                        style={{ marginTop: 'auto', alignSelf: 'flex-start' }}
                      >
                        {info.workshops_btn_reg}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Guidelines & CMT Submission are now standalone at src/components/GuidelinesPage.tsx */}

            {/* Registration Section */}
            <section id="registration" className="section" style={{ background: '#faf9f6', padding: '5rem 1.5rem', textAlign: 'center' }}>
              <div className="container" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  style={{ textAlign: 'center' }}
                >
                  <span style={{ color: '#0b4f30', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.15em' }}>REGISTRATION</span>
                  <h2 style={{ fontSize: '2.5rem', color: '#091d36', marginTop: '0.5rem', fontWeight: 800 }}>Guidelines & Registration Details</h2>
                  <div style={{ height: '3px', width: '60px', background: '#fbbf24', margin: '1rem auto 0' }} />
                </motion.div>

                <p style={{ color: '#475569', fontSize: '1.1rem', lineHeight: '1.6', margin: '1rem 0 0', maxWidth: '600px' }}>
                  Find important instructions, eligibility criteria, student/professional fee tables, and bank details for AECTSD 2027 registration.
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open('/?page=registration', '_blank')}
                  className="btn btn-primary"
                  style={{
                    padding: '1.25rem 3rem',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #0b4f30 0%, #198754 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50px',
                    boxShadow: '0 10px 25px rgba(11, 79, 48, 0.25)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginTop: '1rem'
                  }}
                >
                  <FileText size={20} style={{ color: '#fbbf24' }} />
                  View Registration Details & Fees
                </motion.button>
              </div>
            </section>

            {/* Contact Us Section */}
            <section id="contact-us" className="section">
              <div className="container">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  style={{ textAlign: 'center', marginBottom: '4rem' }}
                >
                  <span style={{ color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em' }}>{info.contact_badge || 'Connect'}</span>
                  <h2 style={{ fontSize: '2.5rem', color: 'white', marginTop: '0.5rem' }}>{info.contact_title || 'Contact Us'}</h2>
                  <div style={{ height: '3px', width: '60px', background: '#3b82f6', margin: '1rem auto 0' }} />
                </motion.div>

                <div className="grid-2-col" style={{ gap: '2rem' }}>
                  {/* Contact Form */}
                  <div className="glass-card">
                    <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '1.5rem' }}>{info.contact_form_title || 'Send Us a Message'}</h3>

                    {formSubmitted ? (
                      <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '0.75rem',
                        padding: '2rem 1.5rem',
                        textAlign: 'center',
                        color: '#4ade80'
                      }}>
                        <CheckCircle size={42} style={{ margin: '0 auto 1rem', color: '#10b981' }} />
                        <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 800, color: '#ffffff' }}>
                          {info.contact_form_success_title || 'Message Prepared & Sent!'}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                          {info.contact_form_success_desc || 'Your inquiry was automatically prepared and dispatched to Email & WhatsApp.'}
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <a
                            href={`mailto:${info.contact_email || 'aectsd2027@srec.ac.in'}?subject=${encodeURIComponent(`[AECTSD 2027 Inquiry] ${formData.subject}`)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ fontSize: '0.85rem', padding: '0.6rem 1.15rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
                          >
                            <Mail size={15} /> Send via Email
                          </a>
                          <a
                            href={`https://wa.me/919080296675?text=${encodeURIComponent(`*New Inquiry for AECTSD 2027*\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Subject:* ${formData.subject || 'General Query'}\n\n*Message:*\n${formData.message}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.85rem',
                              padding: '0.6rem 1.15rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              textDecoration: 'none',
                              background: '#10b981',
                              color: '#ffffff',
                              borderRadius: '0.5rem',
                              fontWeight: 700,
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            <MessageSquare size={15} /> Send via WhatsApp
                          </a>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{info.contact_form_label_name || 'Your Name'}</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder={info.contact_form_placeholder_name || 'Enter full name'}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{info.contact_form_label_email || 'Email Address'}</label>
                          <input
                            type="email"
                            required
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder={info.contact_form_placeholder_email || 'Enter email address'}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{info.contact_form_label_subject || 'Subject'}</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            placeholder={info.contact_form_placeholder_subject || 'How can we help?'}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{info.contact_form_label_message || 'Message'}</label>
                          <textarea
                            rows={4}
                            required
                            className="form-input"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder={info.contact_form_placeholder_message || 'Type details here...'}
                          />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                          {info.contact_form_btn_send || 'Send Message'}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Coordinators */}
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Coordinators */}
                    <div className="glass-card" style={{ height: '100%' }}>
                      <h3 style={{ fontSize: '1.35rem', color: 'white', marginBottom: '1.5rem' }}>{info.contact_coord_title || 'Conference Coordinators'}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                        {coordinators.map((coord, cidx) => {
                          const initials = coord.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                          const bgColors = ['#0f52ba', '#0d9488', '#7c3aed', '#b45309', '#0369a1', '#be185d'];
                          const bg = bgColors[cidx % bgColors.length];
                          return (
                            <div key={cidx} style={{ borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', display: 'flex', flexDirection: 'column' }}>
                              {/* Box Image Area — no overlay badge */}
                              <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden', flexShrink: 0 }}>
                                {getMemberImage(coord.name, coord.image_url) && !getMemberImage(coord.name, coord.image_url).includes('dicebear') ? (
                                  <img
                                    src={getMemberImage(coord.name, coord.image_url)}
                                    alt={coord.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                                  />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: 800, color: 'white', letterSpacing: '0.05em' }}>{initials}</span>
                                  </div>
                                )}
                              </div>
                              {/* Info */}
                              <div style={{ padding: '0.9rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                                <h4 style={{ fontSize: '1rem', color: 'white', margin: 0, fontWeight: 700 }}>{coord.name}</h4>
                                <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.4 }}>{coord.role}</span>
                                {coord.email && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                                    <Mail size={11} style={{ color: '#60a5fa', flexShrink: 0 }} />
                                    <a href={`mailto:${coord.email}`} style={{ color: '#60a5fa', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{coord.email}</a>
                                  </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                  <Phone size={11} style={{ flexShrink: 0 }} />
                                  <span>{coord.phone}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Map & Directions Section (Venue) */}
            <section id="location" className="section" style={{ background: '#faf9f5', padding: '5rem 0' }}>
              <div className="container">
                {/* Main Header */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  style={{ textAlign: 'center', marginBottom: '3.5rem' }}
                >
                  <h2 style={{ fontSize: '2.8rem', color: '#701a1e', fontWeight: 800, margin: 0 }}>
                    Sri Ramakrishna Engineering College
                  </h2>
                  <div style={{ height: '3px', width: '70px', background: '#eab308', margin: '0.85rem auto 0', borderRadius: '2px' }} />
                </motion.div>

                {/* Host Institution Hero Block */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '4rem' }}>
                  {/* Left Column: Campus Image */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{
                      borderRadius: '1.75rem',
                      overflow: 'hidden',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      background: '#ffffff'
                    }}
                  >
                    <img 
                      src={heroBg} 
                      alt="Sri Ramakrishna Engineering College Campus" 
                      style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }} 
                    />
                  </motion.div>

                  {/* Right Column: Content & Feature Pills */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}
                  >
                    {/* Location Badge */}
                    <div style={{
                      display: 'inline-block',
                      background: '#fef3c7',
                      color: '#701a1e',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      padding: '0.35rem 1rem',
                      borderRadius: '2rem',
                      marginBottom: '1rem',
                      border: '1px solid rgba(234, 179, 8, 0.3)'
                    }}>
                      Coimbatore, Tamil Nadu
                    </div>

                    <h3 style={{ fontSize: '2.2rem', color: '#701a1e', fontWeight: 800, margin: '0 0 1.25rem', lineHeight: '1.2' }}>
                      Welcome to the Host Institution
                    </h3>

                    <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: '1.7', margin: '0 0 1rem' }}>
                      Sri Ramakrishna Engineering College is one of the leading engineering institutions in India, known for academic excellence, innovation, research and industry engagement.
                    </p>

                    <p style={{ color: '#475569', fontSize: '0.96rem', lineHeight: '1.7', margin: '0 0 2rem' }}>
                      The campus offers modern infrastructure, advanced laboratories, smart classrooms, auditoriums and a vibrant environment for researchers, professionals and students.
                    </p>

                    {/* 2x2 Feature Pills Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', width: '100%', marginBottom: '2rem' }}>
                      {[
                        { icon: '🏛️', label: 'Modern Infrastructure' },
                        { icon: '🌲', label: 'Green Campus' },
                        { icon: '🎓', label: 'Research Ecosystem' },
                        { icon: '✈️', label: 'Easy Airport Access' }
                      ].map((item, fIdx) => (
                        <div 
                          key={fIdx} 
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '0.85rem',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            color: '#1e293b'
                          }}
                        >
                          <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <a
                        href="#location-map"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById('location-map')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{
                          background: '#b45309',
                          color: '#ffffff',
                          fontWeight: 700,
                          padding: '0.75rem 1.75rem',
                          borderRadius: '2rem',
                          textDecoration: 'none',
                          fontSize: '0.9rem',
                          boxShadow: '0 4px 14px rgba(180, 83, 9, 0.3)'
                        }}
                      >
                        View Location
                      </a>
                      <a
                        href="https://srec.ac.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#ffffff',
                          color: '#701a1e',
                          border: '2px solid #701a1e',
                          fontWeight: 700,
                          padding: '0.7rem 1.75rem',
                          borderRadius: '2rem',
                          textDecoration: 'none',
                          fontSize: '0.9rem'
                        }}
                      >
                        Explore Campus
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Footer */}
      <Footer
        srecUrl={info.srec_url}
        copyright={info.footer_copyright}
        sponsor={info.footer_sponsor}
        onNavigate={scrollToSection}
      />


      {/* Call For Papers Scope Modal */}
      <AnimatePresence>
        {selectedDept && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1.5rem'
            }}
            onClick={() => setSelectedDept(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '1rem',
                padding: '2rem',
                maxWidth: '600px',
                width: '100%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDept(null)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <X size={24} />
              </button>

              {/* Badge */}
              <span style={{ fontSize: '0.8rem', color: '#f58220', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                {info.cfp_badge}
              </span>

              {/* Title */}
              <h3 style={{ fontSize: '1.4rem', color: '#091d36', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                {selectedDept.name}
              </h3>

              {/* Description */}
              <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.7', marginBottom: '2rem', whiteSpace: 'pre-line' }}>
                {selectedDept.description}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setSelectedDept(null)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.9rem' }}
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Department Details Popup Modal */}
      <AnimatePresence>
        {activeDeptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(9, 29, 54, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 99999,
              padding: '1.5rem'
            }}
            onClick={() => setActiveDeptModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '1.25rem',
                padding: '2.25rem',
                maxWidth: '720px',
                width: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                border: '1px solid #e2e8f0'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveDeptModal(null)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#475569',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e2e8f0';
                  e.currentTarget.style.color = '#0f172a';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#475569';
                }}
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '0.35rem 0.85rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Organizing Department
                </span>
              </div>

              <h2 style={{ fontSize: '1.55rem', color: '#091d36', fontWeight: 800, margin: '0.25rem 0 0.25rem 0', lineHeight: 1.3 }}>
                {activeDeptModal.title}
              </h2>
              {activeDeptModal.subtitle && (
                <h4 style={{ fontSize: '1.05rem', color: '#0f52ba', fontWeight: 700, margin: '0 0 1.25rem 0' }}>
                  {activeDeptModal.subtitle}
                </h4>
              )}

              <div style={{ height: '3.5px', width: '60px', background: '#f58220', marginBottom: '1.5rem', borderRadius: '2px' }} />

              {/* Modal Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#334155', lineHeight: 1.7, fontSize: '0.95rem' }}>
                <h5 style={{ fontSize: '1.1rem', color: '#091d36', fontWeight: 800, margin: '0.5rem 0 0' }}>
                  About the Department:
                </h5>
                {activeDeptModal.desc.map((paragraph, pIdx) => (
                  <p key={pIdx} style={{ textAlign: 'justify', margin: 0 }}>
                    {paragraph}
                  </p>
                ))}

                {activeDeptModal.highlights && activeDeptModal.highlights.length > 0 && (
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', padding: '1.25rem', marginTop: '0.5rem' }}>
                    <h5 style={{ fontSize: '1rem', color: '#091d36', fontWeight: 800, margin: '0 0 0.5rem 0' }}>
                      Key Highlights & Infrastructure:
                    </h5>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {activeDeptModal.highlights.map((item, hIdx) => (
                        <li key={hIdx}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeDeptModal.vision && (
                  <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '0.75rem', padding: '1.25rem', marginTop: '0.5rem' }}>
                    <h5 style={{ fontSize: '0.95rem', color: '#1d4ed8', fontWeight: 800, margin: '0 0 0.4rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Vision
                    </h5>
                    <p style={{ margin: 0, color: '#1e3a8a', lineHeight: 1.6, fontWeight: 500 }}>
                      {activeDeptModal.vision}
                    </p>
                  </div>
                )}

                {activeDeptModal.mission && activeDeptModal.mission.length > 0 && (
                  <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: '0.75rem', padding: '1.25rem', marginTop: '0.5rem' }}>
                    <h5 style={{ fontSize: '0.95rem', color: '#854d0e', fontWeight: 800, margin: '0 0 0.4rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Mission
                    </h5>
                    <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem', color: '#713f12' }}>
                      {activeDeptModal.mission.map((mItem, mIdx) => (
                        <li key={mIdx}>{mItem}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeDeptModal.hodMessage && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '1.25rem', marginTop: '0.5rem' }}>
                    <h5 style={{ fontSize: '0.95rem', color: '#166534', fontWeight: 800, margin: '0 0 0.4rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Head of the Department
                    </h5>
                    <p style={{ margin: '0 0 0.75rem 0', color: '#14532d', fontStyle: 'italic', lineHeight: 1.65 }}>
                      "{activeDeptModal.hodMessage}"
                    </p>
                    {activeDeptModal.hodName && (
                      <div style={{ fontWeight: 800, color: '#091d36', fontSize: '0.95rem' }}>
                        {activeDeptModal.hodName}
                        {activeDeptModal.hodTitle && (
                          <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.85rem', display: 'block', marginTop: '0.15rem' }}>
                            {activeDeptModal.hodTitle}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setActiveDeptModal(null)}
                  className="btn btn-primary"
                  style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Registration Calculator & Payment Modal */}
      <AnimatePresence>
        {showCalcModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1.5rem'
            }}
            onClick={() => setShowCalcModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '1.25rem',
                padding: '2.5rem 2rem',
                maxWidth: '950px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                position: 'relative',
                backdropFilter: 'blur(20px)',
                color: 'var(--text-primary)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCalcModal(false)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  transition: 'all 0.2s ease'
                }}
              >
                <X size={20} />
              </button>

              {/* Title */}
              <div style={{ textAlign: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Registration Portal</span>
                <h3 style={{ fontSize: '1.85rem', color: 'var(--primary)', marginTop: '0.25rem', fontWeight: 800 }}>Payment Instructions & Fee Calculator</h3>
              </div>

              {/* Grid content inside modal */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* 1. Calculator & Form Grid */}
                <div className="grid-2-col" style={{ gap: '2rem', alignItems: 'start' }}>

                  {/* Left Column: Selections */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem', fontWeight: 700 }}>1. Calculate Fee</h4>

                    {/* Indian vs International */}
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Are you Indian or International?*</label>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => { setIsIndian(true); setRegOption('conference'); }}
                          className={`btn ${isIndian ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1, borderRadius: '0.375rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                          Indian
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIsIndian(false); if (regOption === 'listener') setRegOption('conference'); }}
                          className={`btn ${!isIndian ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1, borderRadius: '0.375rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                          International
                        </button>
                      </div>
                    </div>

                    {/* Student vs Professional */}
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Are you a student or a professional?*</label>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => setIsStudent(true)}
                          className={`btn ${isStudent ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1, borderRadius: '0.375rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                          Student / Scholar
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsStudent(false)}
                          className={`btn ${!isStudent ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1, borderRadius: '0.375rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                          Professional
                        </button>
                      </div>
                    </div>

                    {/* IEEE Member */}
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Are you an IEEE member?*</label>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => setIsIeeeMember(true)}
                          className={`btn ${isIeeeMember ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1, borderRadius: '0.375rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                          Yes (IEEE Member)
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsIeeeMember(false)}
                          className={`btn ${!isIeeeMember ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ flex: 1, borderRadius: '0.375rem', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                        >
                          No (Non-IEEE Member)
                        </button>
                      </div>
                    </div>

                    {/* Registration Option */}
                    <div>
                      <label htmlFor="modal-reg-option" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Select Registration Option*</label>
                      <select
                        id="modal-reg-option"
                        value={regOption}
                        onChange={(e) => setRegOption(e.target.value as 'conference' | 'tutorial' | 'both' | 'listener')}
                        className="form-input"
                        style={{ background: '#ffffff', color: 'var(--text-primary)', border: '1px solid #cbd5e1', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        <option value="conference" style={{ background: '#ffffff', color: '#0f172a' }}>Conference Only</option>
                        <option value="tutorial" style={{ background: '#ffffff', color: '#0f172a' }}>Tutorial Only</option>
                        <option value="both" style={{ background: '#ffffff', color: '#0f172a' }}>Conference + Tutorial</option>
                        {isIndian && <option value="listener" style={{ background: '#ffffff', color: '#0f172a' }}>Indian Non-Author Attendee (Listener)</option>}
                      </select>
                    </div>

                    {/* Number of Pages */}
                    {regOption !== 'listener' && (
                      <div>
                        <label htmlFor="modal-page-count" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Number of Pages (Limit 1-12. Base covers 6 pages)*</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input
                            id="modal-page-count"
                            type="number"
                            min="1"
                            max="12"
                            value={pageCount}
                            onChange={(e) => setPageCount(Math.max(1, Math.min(12, Number(e.target.value))))}
                            className="form-input"
                            style={{ maxWidth: '80px', padding: '0.5rem', fontSize: '0.85rem', background: '#ffffff', color: 'var(--text-primary)', border: '1px solid #cbd5e1' }}
                          />
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {pageCount > 6 ? `+${pageCount - 6} Extra Page(s)` : 'Standard length'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Modifiers */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 700 }}>Additional Settings</label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <input
                          type="checkbox"
                          checked={isLate}
                          onChange={(e) => setIsLate(e.target.checked)}
                          style={{ width: '14px', height: '14px' }}
                        />
                        <span>Late Penalty (From: Nov 1, 2026)</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <input
                          type="checkbox"
                          checked={workshopAddon}
                          onChange={(e) => setWorkshopAddon(e.target.checked)}
                          style={{ width: '14px', height: '14px' }}
                        />
                        <span>Pre-conference workshop addon (+{isIndian ? '₹500' : '$10'})</span>
                      </label>

                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <input
                          type="checkbox"
                          checked={virtualMode}
                          onChange={(e) => setVirtualMode(e.target.checked)}
                          style={{ width: '14px', height: '14px' }}
                        />
                        <span>Virtual Mode Presentation addon (+{isIndian ? '₹1000' : '$25'})</span>
                      </label>
                    </div>
                  </div>

                  {/* Right Column: Billing & Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Billing Summary Box */}
                    <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '0.75rem', padding: '1.25rem' }}>
                      <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.75rem', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.35rem', fontWeight: 700 }}>Fee Breakdown</h4>

                      {(() => {
                        const bill = calculateTotalFees();
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                              <span>Base Fee:</span>
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{bill.currencySymbol}{bill.baseFee}</span>
                            </div>

                            {bill.penalty > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}>
                                <span>Late Penalty:</span>
                                <span style={{ fontWeight: 600 }}>+{bill.currencySymbol}{bill.penalty}</span>
                              </div>
                            )}

                            {bill.extraPageFee > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Extra Pages ({pageCount - 6}):</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>+{bill.currencySymbol}{bill.extraPageFee}</span>
                              </div>
                            )}

                            {bill.workshopFee > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Workshop:</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>+{bill.currencySymbol}{bill.workshopFee}</span>
                              </div>
                            )}

                            {bill.virtualFee > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Virtual Mode:</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>+{bill.currencySymbol}{bill.virtualFee}</span>
                              </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #cbd5e1', paddingTop: '0.5rem', fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent)' }}>
                              <span>Total Due:</span>
                              <span>{bill.currencySymbol}{bill.total} ({bill.currency})</span>
                            </div>
                            <div style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: '#b45309', lineHeight: '1.4', fontStyle: 'italic', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem', textAlign: 'left' }}>
                              * Note: Registration rates and fees are tentative and subject to final confirmation (under discussion with Dr. K. Balamurugan).
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Sliding Gateway Selector */}
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Select Payment Method</label>
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
                            transition: 'all 0.2s ease',
                            boxShadow: paymentTab === 'bank' ? '0 2px 8px rgba(15, 82, 186, 0.2)' : 'none'
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
                            transition: 'all 0.2s ease',
                            boxShadow: paymentTab === 'online' ? '0 2px 8px rgba(15, 82, 186, 0.2)' : 'none'
                          }}
                        >
                          Online Gateway
                        </button>
                      </div>
                    </div>

                    {/* Conditionally Render forms based on active tab */}
                    {paymentTab === 'bank' ? (
                      /* Submission Form (Bank Transfer) */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.35rem', fontWeight: 700 }}>2. Submit Proof of Payment</h4>

                        {regSuccess ? (
                          <div style={{
                            background: 'rgba(34, 197, 94, 0.08)',
                            border: '1px solid rgba(34, 197, 94, 0.25)',
                            borderRadius: '0.5rem',
                            padding: '1rem',
                            textAlign: 'center',
                            color: '#22c55e',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem',
                            alignItems: 'center'
                          }}>
                            <CheckCircle size={28} style={{ color: '#22c55e' }} />
                            <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>Submitted Successfully!</span>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
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
                                  title="Paper ID"
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
                                  title="Author Name"
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
                                title="Paper Title"
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
                                  placeholder="author@example.com"
                                  value={regEmail}
                                  onChange={(e) => setRegEmail(e.target.value)}
                                  title="Email Address"
                                />
                              </div>
                              <div>
                                <label htmlFor="reg_phone" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Phone Number*</label>
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                  <select
                                    id="reg_phone_code"
                                    value={regPhoneCode}
                                    onChange={(e) => setRegPhoneCode(e.target.value)}
                                    className="form-input"
                                    style={{
                                      width: '90px',
                                      padding: '0.4rem 0.5rem',
                                      fontSize: '0.8rem',
                                      background: '#ffffff',
                                      border: '1px solid #cbd5e1',
                                      color: 'var(--text-primary)',
                                      borderRadius: '0.5rem'
                                    }}
                                    title="Country Code"
                                  >
                                    <option value="+91" style={{ background: '#ffffff', color: '#0f172a' }}>🇮🇳 +91</option>
                                    <option value="+1" style={{ background: '#ffffff', color: '#0f172a' }}>🇺🇸 +1</option>
                                    <option value="+44" style={{ background: '#ffffff', color: '#0f172a' }}>🇬🇧 +44</option>
                                    <option value="+61" style={{ background: '#ffffff', color: '#0f172a' }}>🇦🇺 +61</option>
                                    <option value="+65" style={{ background: '#ffffff', color: '#0f172a' }}>🇸🇬 +65</option>
                                    <option value="+86" style={{ background: '#ffffff', color: '#0f172a' }}>🇨🇳 +86</option>
                                    <option value="+81" style={{ background: '#ffffff', color: '#0f172a' }}>🇯🇵 +81</option>
                                    <option value="+49" style={{ background: '#ffffff', color: '#0f172a' }}>🇩🇪 +49</option>
                                    <option value="+33" style={{ background: '#ffffff', color: '#0f172a' }}>🇫🇷 +33</option>
                                    <option value="+971" style={{ background: '#ffffff', color: '#0f172a' }}>🇦🇪 +971</option>
                                  </select>
                                  <input
                                    id="reg_phone"
                                    type="tel"
                                    required
                                    className={`form-input ${showRegValidation && !regPhone ? 'is-invalid' : ''}`}
                                    style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                                    placeholder="9876543210"
                                    value={regPhone}
                                    onChange={(e) => setRegPhone(e.target.value)}
                                    title="Phone Number"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Explore Coimbatore / Tour Option */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <input
                                  type="checkbox"
                                  checked={regRegisterForTour}
                                  onChange={(e) => {
                                    setRegRegisterForTour(e.target.checked);
                                    if (!e.target.checked) setRegPreferredTourPlace('');
                                  }}
                                  style={{ width: '14px', height: '14px' }}
                                />
                                <span style={{ fontWeight: 600 }}>Explore Coimbatore (Register for Free Local Tour)</span>
                              </label>

                              {regRegisterForTour && (
                                <div style={{ marginTop: '0.25rem' }}>
                                  <label htmlFor="reg_tour_place" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Select Preferred Sightseeing Place*</label>
                                  <select
                                    id="reg_tour_place"
                                    value={regPreferredTourPlace}
                                    onChange={(e) => setRegPreferredTourPlace(e.target.value)}
                                    required={regRegisterForTour}
                                    className="form-input"
                                    style={{
                                      width: '100%',
                                      padding: '0.4rem 0.5rem',
                                      fontSize: '0.8rem',
                                      background: '#ffffff',
                                      border: '1px solid #cbd5e1',
                                      color: '#0f172a',
                                      borderRadius: '0.5rem'
                                    }}
                                  >
                                    <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>-- Select a Place --</option>
                                    <option value="Isha Yoga Center - Dhyanalinga and Adiyogi Statue" style={{ background: '#ffffff', color: '#0f172a' }}>Isha Yoga Center - Dhyanalinga and Adiyogi Statue</option>
                                    <option value="Dhyanalinga Temple" style={{ background: '#ffffff', color: '#0f172a' }}>Dhyanalinga Temple</option>
                                    <option value="Marudamalai Temple" style={{ background: '#ffffff', color: '#0f172a' }}>Marudamalai Temple</option>
                                    <option value="Brookefields Mall" style={{ background: '#ffffff', color: '#0f172a' }}>Brookefields Mall</option>
                                    <option value="Eachanari Vinayagar Temple" style={{ background: '#ffffff', color: '#0f172a' }}>Eachanari Vinayagar Temple</option>
                                  </select>
                                </div>
                              )}
                            </div>

                            {/* Screenshot or URL */}
                            <div>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>Upload Payment Screenshot or enter payment proof URL</label>
                              <div
                                style={{
                                  border: showRegValidation && !regScreenshot && !regPaymentUrl ? '2px dashed #ef4444' : '2px dashed #cbd5e1',
                                  borderRadius: '0.5rem',
                                  padding: '1rem',
                                  textAlign: 'center',
                                  cursor: 'pointer',
                                  background: showRegValidation && !regScreenshot && !regPaymentUrl ? 'rgba(239, 68, 68, 0.05)' : '#f8fafc',
                                  transition: 'all 0.2s ease',
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                  e.preventDefault();
                                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    setRegScreenshot(e.dataTransfer.files[0]);
                                  }
                                }}
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*,application/pdf';
                                  input.onchange = (e) => {
                                    const files = (e.target as HTMLInputElement).files;
                                    if (files && files[0]) {
                                      setRegScreenshot(files[0]);
                                    }
                                  };
                                  input.click();
                                }}
                              >
                                <Download size={18} style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', marginInline: 'auto' }} />
                                {regScreenshot ? (
                                  <div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', display: 'block' }}>{regScreenshot.name}</span>
                                  </div>
                                ) : (
                                  <div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Click to upload payment screenshot receipt</span>
                                  </div>
                                )}
                              </div>

                              <input
                                id="reg_payment_url"
                                type="url"
                                value={regPaymentUrl}
                                onChange={(e) => setRegPaymentUrl(e.target.value)}
                                placeholder="Or paste payment proof URL here"
                                className={`form-input ${showRegValidation && !regScreenshot && !regPaymentUrl ? 'is-invalid' : ''}`}
                                style={{ marginTop: '0.75rem', width: '100%', padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                                title="Payment proof URL"
                              />
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                Provide either an uploaded file or a public URL for your payment receipt.
                              </span>
                            </div>

                            {regError && (
                              <div style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 600 }}>
                                {regError}
                              </div>
                            )}

                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={regSubmitting}
                              onClick={() => setShowRegValidation(true)}
                              style={{ marginTop: '0.35rem', width: '100%', padding: '0.65rem', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-cyan) 100%)', fontSize: '0.85rem', border: 'none', color: '#ffffff', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(15, 82, 186, 0.25)' }}
                            >
                              {regSubmitting ? 'Submitting...' : 'Submit Registration & Payment'}
                            </button>
                          </form>
                        )}
                      </div>
                    ) : (
                      /* Online Checkout Gateway (Futuristic Mock) */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.35rem', fontWeight: 700 }}>2. Online Payment Gateway</h4>

                        {onlineSuccess ? (
                          <div style={{
                            background: 'rgba(34, 197, 94, 0.08)',
                            border: '1px solid rgba(34, 197, 94, 0.25)',
                            borderRadius: '0.5rem',
                            padding: '1.25rem',
                            textAlign: 'center',
                            color: '#22c55e',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            alignItems: 'center'
                          }}>
                            <CheckCircle size={32} style={{ color: '#22c55e' }} />
                            <span style={{ fontSize: '1rem', fontWeight: 800 }}>Demo Checkout Complete!</span>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                              This was a simulation of the checkout sequence. SREC instant payment APIs will secure this transaction.
                            </p>
                            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', padding: '0.4rem 0.8rem', background: '#f8fafc', borderRadius: '0.25rem', border: '1px solid #e2e8f0', marginTop: '0.25rem', color: 'var(--text-primary)' }}>
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
                              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
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
                                {/* Visa logo / text */}
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
                                      onChange={(e) => setCardExpiry(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label htmlFor="card_cvv" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>CVV</label>
                                    <input
                                      id="card_cvv"
                                      type="password"
                                      maxLength={3}
                                      pattern="\d{3}"
                                      required
                                      className="form-input"
                                      style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                                      placeholder="3 digits"
                                      value={cardCvv}
                                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              /* UPI Selector */
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '0.25rem 0' }}>
                                  {['gpay', 'phonepe', 'paytm'].map((upiType) => (
                                    <button
                                      key={upiType}
                                      type="button"
                                      onClick={() => setSelectedUpi(upiType as any)}
                                      style={{
                                        padding: '0.4rem 0.8rem',
                                        fontSize: '0.75rem',
                                        background: selectedUpi === upiType ? 'rgba(15, 82, 186, 0.08)' : '#ffffff',
                                        border: selectedUpi === upiType ? '1px solid var(--accent)' : '1px solid #cbd5e1',
                                        color: selectedUpi === upiType ? 'var(--accent)' : 'var(--text-secondary)',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        fontWeight: 700
                                      }}
                                    >
                                      {upiType === 'gpay' ? 'Google Pay' : upiType === 'phonepe' ? 'PhonePe' : 'Paytm'}
                                    </button>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => setSelectedUpi('upi_id')}
                                    style={{
                                      padding: '0.4rem 0.8rem',
                                      fontSize: '0.75rem',
                                      background: selectedUpi === 'upi_id' ? 'rgba(15, 82, 186, 0.08)' : '#ffffff',
                                      border: selectedUpi === 'upi_id' ? '1px solid var(--accent)' : '1px solid #cbd5e1',
                                      color: selectedUpi === 'upi_id' ? 'var(--accent)' : 'var(--text-secondary)',
                                      borderRadius: '0.375rem',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                      fontWeight: 700
                                    }}
                                  >
                                    UPI ID
                                  </button>
                                </div>
                                <div>
                                  <label htmlFor="upi_id" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Enter UPI ID / Mobile Number</label>
                                  <input
                                    id="upi_id"
                                    type="text"
                                    required
                                    className="form-input"
                                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                                    placeholder={selectedUpi === 'gpay' ? 'e.g. name@okhdfcbank' : 'e.g. mobile@ybl or username@paytm'}
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Scheduled Notice */}
                            <div style={{
                              background: 'rgba(15, 82, 186, 0.03)',
                              border: '1px dashed rgba(15, 82, 186, 0.2)',
                              borderRadius: '0.5rem',
                              padding: '0.75rem',
                              marginTop: '0.25rem',
                              textAlign: 'left'
                            }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.15rem' }}>
                                <Sparkles size={12} /> Scheduled Pipeline (Future Integration)
                              </span>
                              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                                Live online transactions are in sandbox testing and scheduled for active deployment in Q3 2027. This simulator validates the checkout integration. To submit actual conference payment, please use the <strong>Bank Transfer</strong> tab.
                              </p>
                            </div>

                            <button
                              type="submit"
                              className="btn btn-primary"
                              disabled={onlinePaying}
                              style={{ marginTop: '0.35rem', width: '100%', padding: '0.65rem', background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-cyan) 100%)', fontSize: '0.85rem', border: 'none', color: '#ffffff', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(15, 82, 186, 0.25)' }}
                            >
                              {onlinePaying ? 'Simulating Secure Connection...' : 'Simulate Gateway Payment (Demo)'}
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Portal Overlay */}
      <AnimatePresence>
        {showAdminPortal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="admin-panel"
            >
              {/* If NOT logged in, show Login/Registration Form */}
              {adminUser === null ? (
                <div style={{ padding: '3rem 2rem', maxWidth: '450px', width: '100%', margin: 'auto', textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', background: 'rgba(59, 130, 246, 0.08)', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#0f52ba' }}>
                    <Shield size={42} />
                  </div>

                  <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#091d36', marginBottom: '0.5rem' }}>
                    {adminRegMode ? 'Register Admin Account' : 'Admin Portal Login'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>
                    {adminRegMode ? 'Create admin credentials using the secure master key.' : 'Access database dashboards to edit page contents.'}
                  </p>

                  <form onSubmit={handleAdminAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left' }}>
                    <div>
                      <label htmlFor="admin_username" style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Username</label>
                      <input
                        id="admin_username"
                        type="text"
                        required
                        className="form-input"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="Enter admin username"
                        title="Username"
                      />
                    </div>

                    <div>
                      <label htmlFor="admin_password" style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Password</label>
                      <input
                        id="admin_password"
                        type="password"
                        required
                        className="form-input"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter password"
                        title="Password"
                      />
                    </div>

                    {adminRegMode && (
                      <>
                        <div>
                          <label htmlFor="admin_confirm_password" style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Confirm Password</label>
                          <input
                            id="admin_confirm_password"
                            type="password"
                            required
                            className="form-input"
                            value={adminConfirmPassword}
                            onChange={(e) => setAdminConfirmPassword(e.target.value)}
                            placeholder="Re-enter password"
                            title="Confirm Password"
                          />
                        </div>
                        <div>
                          <label htmlFor="admin_master_key" style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Master Key</label>
                          <input
                            id="admin_master_key"
                            type="password"
                            required
                            className="form-input"
                            value={adminMasterKey}
                            onChange={(e) => setAdminMasterKey(e.target.value)}
                            placeholder="Enter master key to register"
                            title="Master Key"
                          />
                        </div>
                      </>
                    )}

                    {adminError && (
                      <div style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: 600, padding: '0.5rem', background: 'rgba(220, 38, 38, 0.05)', borderRadius: '0.375rem', border: '1px solid rgba(220, 38, 38, 0.15)' }}>
                        {adminError}
                      </div>
                    )}

                    <button type="submit" disabled={adminLoading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                      {adminLoading ? 'Processing...' : adminRegMode ? 'Register & Create Account' : 'Secure Login'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                      {adminRegMode ? (
                        <button type="button" onClick={() => { setAdminRegMode(false); setAdminError(null); }} style={{ background: 'none', border: 'none', color: '#0f52ba', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                          Already have an account? Log in
                        </button>
                      ) : (
                        <button type="button" onClick={() => { setAdminRegMode(true); setAdminError(null); }} style={{ background: 'none', border: 'none', color: '#0f52ba', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                          Need an account? Register with Master Key
                        </button>
                      )}
                    </div>
                  </form>

                  <button
                    type="button"
                    onClick={() => setShowAdminPortal(false)}
                    className="btn btn-secondary"
                    style={{ width: '100%', marginTop: '1.5rem' }}
                  >
                    Close Window & Return
                  </button>
                </div>
              ) : (
                /* Admin Dashboard View */
                <>
                  {/* Dashboard Header */}
                  <div className="admin-header">
                    <div className="admin-header-title">
                      <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '0.5rem', borderRadius: '0.5rem', color: '#0f52ba' }}>
                        <Database size={24} />
                      </div>
                      <div>
                        <h3>AECTSD 2027 Admin Console</h3>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Logged in as: <strong>{adminUser}</strong></span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          setCurrentPage('admin');
                          setShowAdminPortal(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #0f52ba 0%, #06b6d4 100%)', border: 'none', color: '#ffffff', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,82,186,0.25)' }}
                      >
                        <ExternalLink size={14} />
                        Open Full Dashboard
                      </button>

                      <button
                        onClick={() => fetchDbData().then(() => alert('Database content refreshed!'))}
                        className="btn btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      >
                        <RefreshCw size={14} />
                        Refresh
                      </button>

                      <button
                        onClick={handleAdminLogout}
                        className="btn btn-secondary"
                        style={{ color: '#dc2626', border: '1px solid rgba(220, 38, 38, 0.2)', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      >
                        <LogOut size={14} />
                        Logout
                      </button>

                      <button
                        onClick={() => setShowAdminPortal(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={28} />
                      </button>
                    </div>
                  </div>

                  {/* Tabs Menu */}
                  <div className="admin-tabs">
                    {[
                      { id: 'overview', label: 'Registrations Log' },
                      { id: 'info', label: 'General Settings' },
                      { id: 'speakers', label: 'Keynote Speakers' },
                      { id: 'departments', label: 'Academic Tracks' },
                      { id: 'committee', label: 'Committee List' },
                      { id: 'dates', label: 'Timeline Dates' },
                      { id: 'workshops', label: 'Tutorial Workshops' }
                    ].map(t => (
                      <button
                        key={t.id}
                        onClick={() => setAdminTab(t.id)}
                        className={`admin-tab-btn ${adminTab === t.id ? 'active' : ''}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Dashboard Content */}
                  <div className="admin-body">

                    {/* TAB: Registrations */}
                    {adminTab === 'overview' && (
                      <div>
                        <div className="admin-control-bar">
                          <div>
                            <h4 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Submitted Registrations ({submittedRegistrations.length})</h4>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>View proof of payments and reference files sent by authors.</p>
                          </div>
                          {submittedRegistrations.length > 0 && (
                            <button
                              onClick={handleClearAllRegistrations}
                              className="btn btn-secondary"
                              style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c' }}
                            >
                              <Trash2 size={16} />
                              Clear All Logs
                            </button>
                          )}
                        </div>

                        {submittedRegistrations.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '4rem', background: '#f8fafc', borderRadius: '1rem', border: '1px dashed #cbd5e1' }}>
                            <FileText size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
                            <p style={{ margin: 0, color: '#64748b', fontWeight: 600 }}>No registrations found in the log.</p>
                          </div>
                        ) : (
                          <>
                            {/* Desktop view */}
                            <div className="admin-table-container admin-desktop-view">
                              <div className="admin-table-wrapper">
                                <table className="admin-table">
                                  <thead>
                                    <tr>
                                      <th>Paper ID</th>
                                      <th>Author Name</th>
                                      <th>Email</th>
                                      <th>Phone</th>
                                      <th>Paper Title</th>
                                      <th>Tour Choice</th>
                                      <th>Receipt file</th>
                                      <th>Date Submitted</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {submittedRegistrations.map((reg, idx) => (
                                      <tr key={reg.id || idx}>
                                        <td style={{ fontWeight: 700, color: '#0f52ba' }}>{reg.paper_id}</td>
                                        <td style={{ fontWeight: 600 }}>{reg.author_name}</td>
                                        <td><a href={`mailto:${reg.email}`} style={{ color: '#2563eb' }}>{reg.email}</a></td>
                                        <td>{reg.phone}</td>
                                        <td style={{ maxWidth: '250px' }}>{reg.paper_title}</td>
                                        <td>
                                          {reg.register_for_tour ? (
                                            <span style={{ color: '#16a34a', fontWeight: 600, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                              <span>Yes</span>
                                              {reg.preferred_tour_place && (
                                                <span style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: 'normal' }} title={reg.preferred_tour_place}>
                                                  ({reg.preferred_tour_place.length > 20 ? reg.preferred_tour_place.substring(0, 17) + '...' : reg.preferred_tour_place})
                                                </span>
                                              )}
                                            </span>
                                          ) : (
                                            <span style={{ color: '#dc2626' }}>No</span>
                                          )}
                                        </td>
                                        <td>
                                          {reg.screenshot_name && reg.screenshot_name !== 'no_file' ? (
                                            <button
                                              type="button"
                                              onClick={() => setPreviewImage(reg.screenshot_name)}
                                              className="screenshot-badge"
                                              style={{ background: 'none', border: '1px solid #bfdbfe', cursor: 'pointer' }}
                                              title={`Size: ${Math.round(Number(reg.screenshot_size || 0) / 1024)} KB`}
                                            >
                                              <Eye size={12} />
                                              {reg.screenshot_name}
                                            </button>
                                          ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>No attachments</span>
                                          )}
                                        </td>
                                        <td>{new Date(reg.created_at).toLocaleString()}</td>
                                        <td>
                                          <button
                                            onClick={() => handleDeleteRegistration(reg.id)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                                            title="Delete log"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Mobile View Cards */}
                            <div className="admin-mobile-view admin-mobile-card-list">
                              {submittedRegistrations.map((reg, idx) => (
                                <div key={reg.id || idx} className="admin-mobile-card">
                                  <div className="admin-mobile-card-header">
                                    <span style={{ fontWeight: 700, color: '#0f52ba', fontSize: '0.9rem' }}>{reg.paper_id || 'N/A'}</span>
                                    <button
                                      onClick={() => handleDeleteRegistration(reg.id)}
                                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
                                      title="Delete log"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                  <div className="admin-mobile-card-body">
                                    <div className="admin-mobile-card-row">
                                      <span className="admin-mobile-card-label">Author:</span>
                                      <span className="admin-mobile-card-value" style={{ fontWeight: 600 }}>{reg.author_name}</span>
                                    </div>
                                    <div className="admin-mobile-card-row">
                                      <span className="admin-mobile-card-label">Email:</span>
                                      <span className="admin-mobile-card-value">
                                        <a href={`mailto:${reg.email}`} style={{ color: '#2563eb' }}>{reg.email}</a>
                                      </span>
                                    </div>
                                    <div className="admin-mobile-card-row">
                                      <span className="admin-mobile-card-label">Phone:</span>
                                      <span className="admin-mobile-card-value">{reg.phone}</span>
                                    </div>
                                    <div className="admin-mobile-card-row">
                                      <span className="admin-mobile-card-label">Paper:</span>
                                      <span className="admin-mobile-card-value">{reg.paper_title || 'N/A'}</span>
                                    </div>
                                    <div className="admin-mobile-card-row">
                                      <span className="admin-mobile-card-label">Tour:</span>
                                      <span className="admin-mobile-card-value">
                                        {reg.register_for_tour ? `✅ Yes (${reg.preferred_tour_place || 'No Choice'})` : '❌ No'}
                                      </span>
                                    </div>
                                    <div className="admin-mobile-card-row">
                                      <span className="admin-mobile-card-label">Receipt:</span>
                                      <span className="admin-mobile-card-value">
                                        {reg.screenshot_name && reg.screenshot_name !== 'no_file' ? (
                                          <button
                                            type="button"
                                            onClick={() => setPreviewImage(reg.screenshot_name)}
                                            className="screenshot-badge"
                                            style={{ background: 'none', border: '1px solid #bfdbfe', cursor: 'pointer' }}
                                          >
                                            <Eye size={12} /> {reg.screenshot_name}
                                          </button>
                                        ) : (
                                          <span style={{ color: '#94a3b8' }}>No attachment</span>
                                        )}
                                      </span>
                                    </div>
                                    <div className="admin-mobile-card-row">
                                      <span className="admin-mobile-card-label">Submitted:</span>
                                      <span className="admin-mobile-card-value">{new Date(reg.created_at).toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* TAB: General Info settings */}
                    {adminTab === 'info' && (
                      <div>
                        <h4 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700 }}>General Webpage Configurations</h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          <div className="admin-form-row" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem', marginBottom: '0.5rem' }}>
                            <div className="admin-form-group" style={{ flex: 1 }}>
                              <label htmlFor="info_show_announcement">Show Announcement Banner</label>
                              <select
                                id="info_show_announcement"
                                className="form-input"
                                value={info.show_announcement !== 'false' ? 'true' : 'false'}
                                onChange={(e) => handleSaveInfoSetting('show_announcement', e.target.value)}
                                title="Show Announcement Banner"
                              >
                                <option value="true">Show Banner</option>
                                <option value="false">Hide Banner</option>
                              </select>
                            </div>
                            <div className="admin-form-group" style={{ flex: 3 }}>
                              <label htmlFor="info_announcement_text">Announcement Banner Text</label>
                              <input
                                id="info_announcement_text"
                                type="text"
                                className="form-input"
                                value={info.announcement_text || '📢 Call for Papers! Mark your calendars: The Call for Papers for AECTSD 2027 opens on 15th December 2026. Start preparing your submission'}
                                onChange={(e) => handleSaveInfoSetting('announcement_text', e.target.value)}
                                placeholder="Enter Banner Text"
                                title="Announcement Banner Text"
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label htmlFor="info_hero_title">Hero Conference Title</label>
                              <input
                                id="info_hero_title"
                                type="text"
                                className="form-input"
                                value={info.hero_title || ''}
                                onChange={(e) => handleSaveInfoSetting('hero_title', e.target.value)}
                                placeholder="Enter Hero Conference Title"
                                title="Hero Conference Title"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label htmlFor="info_hero_subtitle">Hero Conference Subtitle</label>
                              <input
                                id="info_hero_subtitle"
                                type="text"
                                className="form-input"
                                value={info.hero_subtitle || ''}
                                onChange={(e) => handleSaveInfoSetting('hero_subtitle', e.target.value)}
                                placeholder="Enter Hero Conference Subtitle"
                                title="Hero Conference Subtitle"
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label htmlFor="info_event_date">Event Date Display</label>
                              <input
                                id="info_event_date"
                                type="text"
                                className="form-input"
                                value={info.event_date_display || ''}
                                onChange={(e) => handleSaveInfoSetting('event_date_display', e.target.value)}
                                placeholder="Enter Event Date"
                                title="Event Date Display"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label htmlFor="info_event_location">Event Location Display</label>
                              <input
                                id="info_event_location"
                                type="text"
                                className="form-input"
                                value={info.event_location_display || ''}
                                onChange={(e) => handleSaveInfoSetting('event_location_display', e.target.value)}
                                placeholder="Enter Event Location"
                                title="Event Location Display"
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label htmlFor="info_countdown_target">Countdown Target Time (ISO 8601 Format)</label>
                              <input
                                id="info_countdown_target"
                                type="text"
                                className="form-input"
                                placeholder="YYYY-MM-DDTHH:MM:SS"
                                value={info.countdown_target || ''}
                                onChange={(e) => handleSaveInfoSetting('countdown_target', e.target.value)}
                                title="Countdown Target Time"
                              />
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Currently: {new Date(info.countdown_target).toLocaleString()}</span>
                            </div>
                            <div className="admin-form-group">
                              <label htmlFor="info_cmt_link">CMT Portal Link</label>
                              <input
                                id="info_cmt_link"
                                type="text"
                                className="form-input"
                                value={info.cmt_link || ''}
                                onChange={(e) => handleSaveInfoSetting('cmt_link', e.target.value)}
                                placeholder="Enter CMT Portal Link"
                                title="CMT Portal Link"
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label htmlFor="info_srec_url">SREC Website URL</label>
                              <input
                                id="info_srec_url"
                                type="text"
                                className="form-input"
                                value={info.srec_url || ''}
                                onChange={(e) => handleSaveInfoSetting('srec_url', e.target.value)}
                                placeholder="Enter SREC Website URL"
                                title="SREC Website URL"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label htmlFor="info_ieee_sb_url">IEEE SB Website URL</label>
                              <input
                                id="info_ieee_sb_url"
                                type="text"
                                className="form-input"
                                value={info.ieee_sb_url || ''}
                                onChange={(e) => handleSaveInfoSetting('ieee_sb_url', e.target.value)}
                                placeholder="Enter IEEE SB Website URL"
                                title="IEEE SB Website URL"
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label htmlFor="info_snr_url">SNR Sons Website URL</label>
                              <input
                                id="info_snr_url"
                                type="text"
                                className="form-input"
                                value={info.snr_url || ''}
                                onChange={(e) => handleSaveInfoSetting('snr_url', e.target.value)}
                                placeholder="Enter SNR Sons Website URL"
                                title="SNR Sons Website URL"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label htmlFor="info_snr_trust_url">SNR Trust Website URL</label>
                              <input
                                id="info_snr_trust_url"
                                type="text"
                                className="form-input"
                                value={info.snr_trust_url || ''}
                                onChange={(e) => handleSaveInfoSetting('snr_trust_url', e.target.value)}
                                placeholder="Enter SNR Trust Website URL"
                                title="SNR Trust Website URL"
                              />
                            </div>
                          </div>

                          <div className="admin-form-group">
                            <label htmlFor="info_hero_bg_url">Hero Background Image URL</label>
                            <input
                              id="info_hero_bg_url"
                              type="text"
                              className="form-input"
                              value={info.hero_bg_url || ''}
                              onChange={(e) => handleSaveInfoSetting('hero_bg_url', e.target.value)}
                              placeholder="Enter Hero Background Image URL"
                              title="Hero Background Image URL"
                            />
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label htmlFor="info_bank_acc_name">Bank Account Name</label>
                              <input
                                id="info_bank_acc_name"
                                type="text"
                                className="form-input"
                                value={info.bank_account_name || ''}
                                onChange={(e) => handleSaveInfoSetting('bank_account_name', e.target.value)}
                                placeholder="Enter Bank Account Name"
                                title="Bank Account Name"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label htmlFor="info_bank_name">Bank Name</label>
                              <input
                                id="info_bank_name"
                                type="text"
                                className="form-input"
                                value={info.bank_name || ''}
                                onChange={(e) => handleSaveInfoSetting('bank_name', e.target.value)}
                                placeholder="Enter Bank Name"
                                title="Bank Name"
                              />
                            </div>
                          </div>

                          <div className="admin-form-row">
                            <div className="admin-form-group">
                              <label htmlFor="info_bank_acc_number">Account Number</label>
                              <input
                                id="info_bank_acc_number"
                                type="text"
                                className="form-input"
                                value={info.bank_account_number || ''}
                                onChange={(e) => handleSaveInfoSetting('bank_account_number', e.target.value)}
                                placeholder="Enter Account Number"
                                title="Account Number"
                              />
                            </div>
                            <div className="admin-form-group">
                              <label htmlFor="info_bank_ifsc">Bank IFSC Code</label>
                              <input
                                id="info_bank_ifsc"
                                type="text"
                                className="form-input"
                                value={info.bank_ifsc_code || ''}
                                onChange={(e) => handleSaveInfoSetting('bank_ifsc_code', e.target.value)}
                                placeholder="Enter Bank IFSC Code"
                                title="Bank IFSC Code"
                              />
                            </div>
                          </div>

                          <div className="admin-form-group">
                            <label htmlFor="info_about_conference">About the Conference Description</label>
                            <textarea
                              id="info_about_conference"
                              rows={4}
                              className="form-input"
                              value={info.about_conference || ''}
                              onChange={(e) => handleSaveInfoSetting('about_conference', e.target.value)}
                              placeholder="Enter About the Conference Description"
                              title="About the Conference Description"
                            />
                          </div>

                          <div className="admin-form-group">
                            <label htmlFor="info_about_trust">SNR Sons Trust Description</label>
                            <textarea
                              id="info_about_trust"
                              rows={3}
                              className="form-input"
                              value={info.about_trust || ''}
                              onChange={(e) => handleSaveInfoSetting('about_trust', e.target.value)}
                              placeholder="Enter SNR Sons Trust Description"
                              title="SNR Sons Trust Description"
                            />
                          </div>

                          <div className="admin-form-group">
                            <label htmlFor="info_advisory_committee_desc">Advisory Committee Description</label>
                            <textarea
                              id="info_advisory_committee_desc"
                              rows={3}
                              className="form-input"
                              value={info.advisory_committee_desc || ''}
                              onChange={(e) => handleSaveInfoSetting('advisory_committee_desc', e.target.value)}
                              placeholder="Enter Advisory Committee Description"
                              title="Advisory Committee Description"
                            />
                          </div>

                          <div className="admin-form-group">
                            <label htmlFor="info_technical_committee_desc">Technical Committee Description</label>
                            <textarea
                              id="info_technical_committee_desc"
                              rows={3}
                              className="form-input"
                              value={info.technical_committee_desc || ''}
                              onChange={(e) => handleSaveInfoSetting('technical_committee_desc', e.target.value)}
                              placeholder="Enter Technical Committee Description"
                              title="Technical Committee Description"
                            />
                          </div>

                          <div className="admin-form-group">
                            <label htmlFor="info_about_inst">SREC Institution Description</label>
                            <textarea
                              id="info_about_inst"
                              rows={3}
                              className="form-input"
                              value={info.about_institution || ''}
                              onChange={(e) => handleSaveInfoSetting('about_institution', e.target.value)}
                              placeholder="Enter SREC Institution Description"
                              title="SREC Institution Description"
                            />
                          </div>

                          <div className="admin-form-group">
                            <label htmlFor="info_sec_address">Secretariat Address</label>
                            <textarea
                              id="info_sec_address"
                              rows={3}
                              className="form-input"
                              value={info.secretariat_address || ''}
                              onChange={(e) => handleSaveInfoSetting('secretariat_address', e.target.value)}
                              placeholder="Enter Secretariat Address"
                              title="Secretariat Address"
                            />
                          </div>

                          <div className="admin-form-group">
                            <label htmlFor="info_coimbatore_desc">About Coimbatore Description</label>
                            <textarea
                              id="info_coimbatore_desc"
                              rows={4}
                              className="form-input"
                              value={info.about_coimbatore_desc || ''}
                              onChange={(e) => handleSaveInfoSetting('about_coimbatore_desc', e.target.value)}
                              placeholder="Enter Coimbatore Description"
                              title="About Coimbatore Description"
                            />
                          </div>

                          <div className="admin-form-group">
                            <label htmlFor="info_coimbatore_tour">Coimbatore Tour Info Alert</label>
                            <textarea
                              id="info_coimbatore_tour"
                              rows={2}
                              className="form-input"
                              value={info.about_coimbatore_tour_info || ''}
                              onChange={(e) => handleSaveInfoSetting('about_coimbatore_tour_info', e.target.value)}
                              placeholder="Enter Tour Info Notice"
                              title="Coimbatore Tour Info Alert"
                            />
                          </div>

                          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '1rem', fontWeight: 700 }}>EmailJS Auto-Notification Gateway</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                              Configure your client-side EmailJS integration keys to automatically receive email alerts with attached payment screenshot receipts upon new registrations.
                            </p>

                            <div className="admin-form-row">
                              <div className="admin-form-group">
                                <label htmlFor="emailjs_service_id">EmailJS Service ID</label>
                                <input
                                  id="emailjs_service_id"
                                  type="text"
                                  className="form-input"
                                  value={info.emailjs_service_id || ''}
                                  onChange={(e) => handleSaveInfoSetting('emailjs_service_id', e.target.value)}
                                  placeholder="e.g. service_xxxx"
                                  title="EmailJS Service ID"
                                />
                              </div>
                              <div className="admin-form-group">
                                <label htmlFor="emailjs_template_id">EmailJS Template ID</label>
                                <input
                                  id="emailjs_template_id"
                                  type="text"
                                  className="form-input"
                                  value={info.emailjs_template_id || ''}
                                  onChange={(e) => handleSaveInfoSetting('emailjs_template_id', e.target.value)}
                                  placeholder="e.g. template_xxxx"
                                  title="EmailJS Template ID"
                                />
                              </div>
                            </div>

                            <div className="admin-form-row" style={{ marginTop: '1rem' }}>
                              <div className="admin-form-group">
                                <label htmlFor="emailjs_public_key">EmailJS Public Key (User ID)</label>
                                <input
                                  id="emailjs_public_key"
                                  type="text"
                                  className="form-input"
                                  value={info.emailjs_public_key || ''}
                                  onChange={(e) => handleSaveInfoSetting('emailjs_public_key', e.target.value)}
                                  placeholder="e.g. user_xxxx or public_key"
                                  title="EmailJS Public Key"
                                />
                              </div>
                              <div className="admin-form-group">
                                <label htmlFor="emailjs_recipient">Notification Recipient Email</label>
                                <input
                                  id="emailjs_recipient"
                                  type="email"
                                  className="form-input"
                                  value={info.emailjs_recipient || ''}
                                  onChange={(e) => handleSaveInfoSetting('emailjs_recipient', e.target.value)}
                                  placeholder="e.g. finance@srec.ac.in"
                                  title="Notification Recipient Email"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB: Speakers */}
                    {adminTab === 'speakers' && (
                      <div>
                        <div className="admin-control-bar">
                          <h4 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Keynote Speakers ({speakers.length})</h4>
                          {!editingSpeaker && (
                            <button onClick={() => setEditingSpeaker({ name: '', title: '', role: '', talk: '', color: '#0f52ba' })} className="btn btn-primary">
                              <Plus size={16} /> Add Speaker
                            </button>
                          )}
                        </div>

                        {/* Add/Edit Form */}
                        {editingSpeaker && (
                          <div className="glass-card" style={{ marginBottom: '2rem', background: '#f8fafc', borderColor: '#3b82f6' }}>
                            <h5 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>{editingSpeaker.id ? 'Edit Speaker Details' : 'Add New Keynote Speaker'}</h5>
                            <form onSubmit={handleSaveSpeaker} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div className="admin-form-row">
                                <div className="admin-form-group">
                                  <label htmlFor="speaker_name">Speaker Name</label>
                                  <input
                                    id="speaker_name"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingSpeaker.name}
                                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, name: e.target.value })}
                                    placeholder="Enter Speaker Name"
                                    title="Speaker Name"
                                  />
                                </div>
                                <div className="admin-form-group">
                                  <label htmlFor="speaker_title">Speaker Title / Institution</label>
                                  <input
                                    id="speaker_title"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingSpeaker.title}
                                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, title: e.target.value })}
                                    placeholder="Enter Speaker Title / Institution"
                                    title="Speaker Title / Institution"
                                  />
                                </div>
                              </div>

                              <div className="admin-form-row">
                                <div className="admin-form-group">
                                  <label htmlFor="speaker_role">Conference Role / Bio Tag</label>
                                  <input
                                    id="speaker_role"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingSpeaker.role}
                                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, role: e.target.value })}
                                    placeholder="Enter Conference Role / Bio Tag"
                                    title="Conference Role / Bio Tag"
                                  />
                                </div>
                                <div className="admin-form-group">
                                  <label htmlFor="speaker_color">Theme Card Color (Hex)</label>
                                  <input
                                    id="speaker_color"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingSpeaker.color}
                                    onChange={(e) => setEditingSpeaker({ ...editingSpeaker, color: e.target.value })}
                                    placeholder="Enter Theme Card Color (Hex)"
                                    title="Theme Card Color (Hex)"
                                  />
                                </div>
                              </div>

                              <div className="admin-form-group">
                                <label htmlFor="speaker_image">Speaker Image URL</label>
                                <input
                                  id="speaker_image"
                                  type="text"
                                  className="form-input"
                                  value={editingSpeaker.image_url || ''}
                                  onChange={(e) => setEditingSpeaker({ ...editingSpeaker, image_url: e.target.value })}
                                  placeholder="Enter Speaker Image URL (or leave blank)"
                                  title="Speaker Image URL"
                                />
                              </div>

                              <div className="admin-form-group">
                                <label htmlFor="speaker_talk">Talk Title & Synopsis</label>
                                <textarea
                                  id="speaker_talk"
                                  rows={3}
                                  required
                                  className="form-input"
                                  value={editingSpeaker.talk}
                                  onChange={(e) => setEditingSpeaker({ ...editingSpeaker, talk: e.target.value })}
                                  placeholder="Enter Talk Title & Synopsis"
                                  title="Talk Title & Synopsis"
                                />
                              </div>

                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="submit" className="btn btn-primary">
                                  <Save size={16} /> Save Changes
                                </button>
                                <button type="button" onClick={() => setEditingSpeaker(null)} className="btn btn-secondary">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Card List */}
                        <div className="admin-card-grid">
                          {speakers.map((sp, idx) => (
                            <div key={sp.id || idx} className="admin-editor-card">
                              <h5 style={{ fontSize: '1.15rem', color: '#091d36', margin: '0 0 0.25rem', fontWeight: 800 }}>{sp.name}</h5>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f58220', textTransform: 'uppercase' }}>{sp.role}</span>
                              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.5rem 0' }}>{sp.title}</p>
                              <div style={{ marginTop: '0.5rem' }}>
                                {renderSpeakerTalkOrButton(sp.talk, 'Talk Topic')}
                              </div>

                              <div className="admin-action-row">
                                <button onClick={() => setEditingSpeaker(sp)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteSpeaker(sp.id)} className="btn btn-secondary" style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB: Academic Tracks / Departments */}
                    {adminTab === 'departments' && (
                      <div>
                        <div className="admin-control-bar">
                          <h4 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Academic Departments / Tracks ({departments.length})</h4>
                          {!editingDept && (
                            <button onClick={() => setEditingDept({ name: '', description: '', sort_order: departments.length + 1 })} className="btn btn-primary">
                              <Plus size={16} /> Add Track
                            </button>
                          )}
                        </div>

                        {editingDept && (
                          <div className="glass-card" style={{ marginBottom: '2rem', background: '#f8fafc', borderColor: '#3b82f6' }}>
                            <h5 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>{editingDept.id ? 'Edit Department Track' : 'Add New Department Track'}</h5>
                            <form onSubmit={handleSaveDept} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div className="admin-form-row">
                                <div className="admin-form-group" style={{ flex: 3 }}>
                                  <label htmlFor="dept_name">Department / Track Name</label>
                                  <input
                                    id="dept_name"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingDept.name}
                                    onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                                    placeholder="Enter Department / Track Name"
                                    title="Department / Track Name"
                                  />
                                </div>
                                <div className="admin-form-group">
                                  <label htmlFor="dept_sort_order">Sort Order Index</label>
                                  <input
                                    id="dept_sort_order"
                                    type="number"
                                    required
                                    className="form-input"
                                    value={editingDept.sort_order || 1}
                                    onChange={(e) => setEditingDept({ ...editingDept, sort_order: Number(e.target.value) })}
                                    placeholder="1"
                                    title="Sort Order Index"
                                  />
                                </div>
                              </div>

                              <div className="admin-form-group">
                                <label htmlFor="dept_desc">Department Scope / Call-For-Papers Track Description</label>
                                <textarea
                                  id="dept_desc"
                                  rows={5}
                                  required
                                  className="form-input"
                                  value={editingDept.description}
                                  onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                                  placeholder="Enter Department Scope / Call-For-Papers Track Description"
                                  title="Department Scope / Call-For-Papers Track Description"
                                />
                              </div>

                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="submit" className="btn btn-primary">
                                  <Save size={16} /> Save Changes
                                </button>
                                <button type="button" onClick={() => setEditingDept(null)} className="btn btn-secondary">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        <div className="admin-card-grid">
                          {departments.map((dept, idx) => (
                            <div key={dept.id || idx} className="admin-editor-card">
                              <h5 style={{ fontSize: '1.1rem', color: '#091d36', margin: '0 0 0.5rem', fontWeight: 800 }}>{dept.name}</h5>
                              <span style={{ fontSize: '0.7rem', background: '#e2e8f0', color: '#334155', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontWeight: 700 }}>
                                Order: {dept.sort_order}
                              </span>
                              <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.75rem', lineHeight: '1.5' }}>
                                {dept.description.length > 180 ? dept.description.substring(0, 180) + '...' : dept.description}
                              </p>

                              <div className="admin-action-row">
                                <button onClick={() => setEditingDept(dept)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteDept(dept.id)} className="btn btn-secondary" style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB: Committee members */}
                    {adminTab === 'committee' && (
                      <div>
                        <div className="admin-control-bar">
                          <h4 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Committee Members List ({committeeMembers.length})</h4>
                          {!editingCommittee && (
                            <button onClick={() => setEditingCommittee({ name: '', role: '', desc: '', category: 'organizing' })} className="btn btn-primary">
                              <Plus size={16} /> Add Committee Member
                            </button>
                          )}
                        </div>

                        {editingCommittee && (
                          <div className="glass-card" style={{ marginBottom: '2rem', background: '#f8fafc', borderColor: '#3b82f6' }}>
                            <h5 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>{editingCommittee.id ? 'Edit Committee Member' : 'Add New Member'}</h5>
                            <form onSubmit={handleSaveCommittee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div className="admin-form-row">
                                <div className="admin-form-group">
                                  <label htmlFor="committee_name">Full Name</label>
                                  <input
                                    id="committee_name"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingCommittee.name}
                                    onChange={(e) => setEditingCommittee({ ...editingCommittee, name: e.target.value })}
                                    placeholder="Enter Full Name"
                                    title="Full Name" />
                                </div>
                                <div className="admin-form-group">
                                  <label htmlFor="committee_category">Committee Category</label>
                                  <select
                                    id="committee_category"
                                    value={editingCommittee.category}
                                    onChange={(e) => setEditingCommittee({ ...editingCommittee, category: e.target.value })}
                                    className="form-input"
                                    style={{ background: '#ffffff' }}
                                    title="Committee Category"
                                  >
                                    <option value="organizing">Organizing Committee</option>
                                    <option value="advisory">Advisory Committee</option>
                                    <option value="technical">Technical Program Committee</option>
                                  </select>
                                </div>
                              </div>

                              <div className="admin-form-row">
                                <div className="admin-form-group">
                                  <label htmlFor="committee_role_select">Role / Position Title</label>
                                  <select
                                    id="committee_role_select"
                                    className="form-input"
                                    style={{ background: '#ffffff' }}
                                    value={!editingCommittee.role
                                      ? ""
                                      : [
                                        'Steering Committee Member',
                                        'Advisory Committee Member',
                                        'Chief Patron',
                                        'Patron',
                                        'General Chair',
                                        'Conference Chair',
                                        'Conference Chair & Organizing Secretary',
                                        'Session Chair',
                                        'Program and Finance Chair',
                                        'Finance Committee Member',
                                        'Program and Finance Committee Member',
                                        'Publication Chair',
                                        'Publication Committee Member',
                                        'Local Arrangements Chair',
                                        'Local Arrangements Committee Member',
                                        'Registration Chair',
                                        'Registration Committee Member',
                                        'Conference Pre-Tutorial Sessions Chair',
                                        'Pre-Tutorial Sessions Committee Member',
                                        'Technical Review Committee Convener',
                                        'Technical Review Committee Member',
                                        'Outreach and Promotion Committee Convener',
                                        'Outreach and Promotion Committee Member',
                                        'Website and Social Media Promotion Committee Chair',
                                        'Website and Social Media Promotion Committee Member',
                                        'Hospitality Committee Convener',
                                        'Hospitality Committee Member',
                                        'Member'
                                      ].includes(editingCommittee.role)
                                        ? editingCommittee.role
                                        : "other"}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === "other") {
                                        setEditingCommittee({ ...editingCommittee, role: "Custom Role" });
                                      } else {
                                        setEditingCommittee({ ...editingCommittee, role: val || null });
                                      }
                                    }}
                                  >
                                    <option value="">Leave blank (Standard Member)</option>
                                    <optgroup label="Steering & Advisory">
                                      <option value="Steering Committee Member">Steering Committee Member</option>
                                      <option value="Advisory Committee Member">Advisory Committee Member</option>
                                    </optgroup>
                                    <optgroup label="Patrons & Chairs">
                                      <option value="Chief Patron">Chief Patron</option>
                                      <option value="Patron">Patron</option>
                                      <option value="General Chair">General Chair</option>
                                      <option value="Conference Chair">Conference Chair</option>
                                      <option value="Conference Chair & Organizing Secretary">Conference Chair & Organizing Secretary</option>
                                      <option value="Session Chair">Session Chair</option>
                                    </optgroup>
                                    <optgroup label="Subcommittees">
                                      <option value="Program and Finance Chair">Program and Finance Chair</option>
                                      <option value="Program and Finance Committee Member">Program and Finance Committee Member</option>
                                      <option value="Finance Committee Member">Finance Committee Member</option>
                                      <option value="Publication Chair">Publication Chair</option>
                                      <option value="Publication Committee Member">Publication Committee Member</option>
                                      <option value="Local Arrangements Chair">Local Arrangements Chair</option>
                                      <option value="Local Arrangements Committee Member">Local Arrangements Committee Member</option>
                                      <option value="Registration Chair">Registration Chair</option>
                                      <option value="Registration Committee Member">Registration Committee Member</option>
                                      <option value="Conference Pre-Tutorial Sessions Chair">Conference Pre-Tutorial Sessions Chair</option>
                                      <option value="Pre-Tutorial Sessions Committee Member">Pre-Tutorial Sessions Committee Member</option>
                                      <option value="Technical Review Committee Convener">Technical Review Committee Convener</option>
                                      <option value="Technical Review Committee Member">Technical Review Committee Member</option>
                                      <option value="Outreach and Promotion Committee Convener">Outreach and Promotion Committee Convener</option>
                                      <option value="Outreach and Promotion Committee Member">Outreach and Promotion Committee Member</option>
                                      <option value="Website and Social Media Promotion Committee Chair">Website and Social Media Promotion Committee Chair</option>
                                      <option value="Website and Social Media Promotion Committee Member">Website and Social Media Promotion Committee Member</option>
                                      <option value="Hospitality Committee Convener">Hospitality Committee Convener</option>
                                      <option value="Hospitality Committee Member">Hospitality Committee Member</option>
                                    </optgroup>
                                    <optgroup label="General">
                                      <option value="Member">Member</option>
                                      <option value="other">Other (Enter Custom Role...)</option>
                                    </optgroup>
                                  </select>

                                  {editingCommittee.role && ![
                                    'Steering Committee Member',
                                    'Advisory Committee Member',
                                    'Chief Patron',
                                    'Patron',
                                    'General Chair',
                                    'Conference Chair',
                                    'Conference Chair & Organizing Secretary',
                                    'Session Chair',
                                    'Program and Finance Chair',
                                    'Finance Committee Member',
                                    'Program and Finance Committee Member',
                                    'Publication Chair',
                                    'Publication Committee Member',
                                    'Local Arrangements Chair',
                                    'Local Arrangements Committee Member',
                                    'Registration Chair',
                                    'Registration Committee Member',
                                    'Conference Pre-Tutorial Sessions Chair',
                                    'Pre-Tutorial Sessions Committee Member',
                                    'Technical Review Committee Convener',
                                    'Technical Review Committee Member',
                                    'Outreach and Promotion Committee Convener',
                                    'Outreach and Promotion Committee Member',
                                    'Website and Social Media Promotion Committee Chair',
                                    'Website and Social Media Promotion Committee Member',
                                    'Hospitality Committee Convener',
                                    'Hospitality Committee Member',
                                    'Member'
                                  ].includes(editingCommittee.role) && (
                                      <div style={{ marginTop: '0.5rem' }}>
                                        <input
                                          id="committee_role_custom"
                                          type="text"
                                          required
                                          className="form-input"
                                          value={editingCommittee.role}
                                          onChange={(e) => setEditingCommittee({ ...editingCommittee, role: e.target.value })}
                                          placeholder="Enter Custom Role Title"
                                          title="Custom Role Title" />
                                      </div>
                                    )}
                                </div>
                                <div className="admin-form-group">
                                  <label htmlFor="committee_desc">Institution / Bio Description</label>
                                  <input
                                    id="committee_desc"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingCommittee.desc}
                                    onChange={(e) => setEditingCommittee({ ...editingCommittee, desc: e.target.value })}
                                    placeholder="Enter Institution / Bio Description"
                                    title="Institution / Bio Description" />
                                </div>
                              </div><div className="admin-form-group">
                                <label htmlFor="committee_image">Image URL / Path</label>
                                <input
                                  id="committee_image"
                                  type="text"
                                  className="form-input"
                                  value={editingCommittee.image_url || ''}
                                  onChange={(e) => setEditingCommittee({ ...editingCommittee, image_url: e.target.value })}
                                  placeholder="e.g. /images/name.jpg or full URL (optional)"
                                  title="Image URL / Path" />
                              </div><div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="submit" className="btn btn-primary">
                                  <Save size={16} /> Save Changes
                                </button>
                                <button type="button" onClick={() => setEditingCommittee(null)} className="btn btn-secondary">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        <div className="admin-card-grid">
                          {committeeMembers.map((c, idx) => (
                            <div key={c.id || idx} className="admin-editor-card">
                              <h5 style={{ fontSize: '1.1rem', color: '#091d36', margin: '0 0 0.25rem', fontWeight: 800 }}>{c.name}</h5>
                              <span style={{ fontSize: '0.7rem', background: '#0f52ba', color: 'white', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontWeight: 700, textTransform: 'uppercase', marginRight: '0.5rem' }}>
                                {c.category}
                              </span>
                              {c.role && (
                                <span style={{ fontSize: '0.7rem', background: '#f58220', color: 'white', padding: '0.15rem 0.4rem', borderRadius: '0.25rem', fontWeight: 700 }}>
                                  {c.role}
                                </span>
                              )}
                              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem', marginInline: 0 }}>{c.desc}</p>

                              <div className="admin-action-row">
                                <button onClick={() => setEditingCommittee(c)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteCommittee(c.id)} className="btn btn-secondary" style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB: Timeline Dates */}
                    {adminTab === 'dates' && (
                      <div>
                        <div className="admin-control-bar">
                          <h4 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Important Timeline Dates ({importantDates.length})</h4>
                          {!editingDate && (
                            <button onClick={() => setEditingDate({ title: '', event_date: '', desc: '', sort_order: importantDates.length + 1 })} className="btn btn-primary">
                              <Plus size={16} /> Add Date
                            </button>
                          )}
                        </div>

                        {editingDate && (
                          <div className="glass-card" style={{ marginBottom: '2rem', background: '#f8fafc', borderColor: '#3b82f6' }}>
                            <h5 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>{editingDate.id ? 'Edit Timeline Date' : 'Add New Date'}</h5>
                            <form onSubmit={handleSaveDate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div className="admin-form-row">
                                <div className="admin-form-group">
                                  <label htmlFor="date_title">Event Name / Title</label>
                                  <input
                                    id="date_title"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingDate.title}
                                    onChange={(e) => setEditingDate({ ...editingDate, title: e.target.value })}
                                    placeholder="Enter Event Name / Title"
                                    title="Event Name / Title"
                                  />
                                </div>
                                <div className="admin-form-group">
                                  <label htmlFor="date_event_date">Date String (e.g. October 15, 2026)</label>
                                  <input
                                    id="date_event_date"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingDate.event_date}
                                    onChange={(e) => setEditingDate({ ...editingDate, event_date: e.target.value })}
                                    placeholder="Enter Date String"
                                    title="Date String"
                                  />
                                </div>
                              </div>

                              <div className="admin-form-row">
                                <div className="admin-form-group">
                                  <label htmlFor="date_desc">Short Description</label>
                                  <input
                                    id="date_desc"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingDate.desc}
                                    onChange={(e) => setEditingDate({ ...editingDate, desc: e.target.value })}
                                    placeholder="Enter Short Description"
                                    title="Short Description"
                                  />
                                </div>
                                <div className="admin-form-group">
                                  <label htmlFor="date_sort_order">Sort Order Index</label>
                                  <input
                                    id="date_sort_order"
                                    type="number"
                                    required
                                    className="form-input"
                                    value={editingDate.sort_order || 1}
                                    onChange={(e) => setEditingDate({ ...editingDate, sort_order: Number(e.target.value) })}
                                    placeholder="1"
                                    title="Sort Order Index"
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="submit" className="btn btn-primary">
                                  <Save size={16} /> Save Changes
                                </button>
                                <button type="button" onClick={() => setEditingDate(null)} className="btn btn-secondary">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        <div className="admin-card-grid">
                          {importantDates.map((dt, idx) => (
                            <div key={dt.id || idx} className="admin-editor-card">
                              <h5 style={{ fontSize: '1.1rem', color: '#091d36', margin: '0 0 0.25rem', fontWeight: 800 }}>{dt.title}</h5>
                              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f52ba' }}>Date: {dt.event_date}</span>
                              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem', marginInline: 0 }}>{dt.desc}</p>

                              <div className="admin-action-row">
                                <button onClick={() => setEditingDate(dt)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteDate(dt.id)} className="btn btn-secondary" style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TAB: Workshops / Tutorials */}
                    {adminTab === 'workshops' && (
                      <div>
                        <div className="admin-control-bar">
                          <h4 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700 }}>Pre-Conference Workshops & Tutorials ({workshops.length})</h4>
                          {!editingWorkshop && (
                            <button onClick={() => setEditingWorkshop({ title: '', instructor: '', duration: '', price: '', details: '' })} className="btn btn-primary">
                              <Plus size={16} /> Add Tutorial
                            </button>
                          )}
                        </div>

                        {editingWorkshop && (
                          <div className="glass-card" style={{ marginBottom: '2rem', background: '#f8fafc', borderColor: '#3b82f6' }}>
                            <h5 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>{editingWorkshop.id ? 'Edit Tutorial Details' : 'Add New Tutorial'}</h5>
                            <form onSubmit={handleSaveWorkshop} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div className="admin-form-row">
                                <div className="admin-form-group">
                                  <label htmlFor="workshop_title">Tutorial Title</label>
                                  <input
                                    id="workshop_title"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingWorkshop.title}
                                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, title: e.target.value })}
                                    placeholder="Enter Tutorial Title"
                                    title="Tutorial Title"
                                  />
                                </div>
                                <div className="admin-form-group">
                                  <label htmlFor="workshop_instructor">Lead Instructor Name & Institution</label>
                                  <input
                                    id="workshop_instructor"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingWorkshop.instructor}
                                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, instructor: e.target.value })}
                                    placeholder="Enter Lead Instructor Name & Institution"
                                    title="Lead Instructor Name & Institution"
                                  />
                                </div>
                              </div>

                              <div className="admin-form-row">
                                <div className="admin-form-group">
                                  <label htmlFor="workshop_duration">Duration / Time Block</label>
                                  <input
                                    id="workshop_duration"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingWorkshop.duration}
                                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, duration: e.target.value })}
                                    placeholder="e.g. Full Day (9:00 AM - 4:00 PM)"
                                    title="Duration / Time Block"
                                  />
                                </div>
                                <div className="admin-form-group">
                                  <label htmlFor="workshop_price">Price Display String</label>
                                  <input
                                    id="workshop_price"
                                    type="text"
                                    required
                                    className="form-input"
                                    value={editingWorkshop.price}
                                    onChange={(e) => setEditingWorkshop({ ...editingWorkshop, price: e.target.value })}
                                    placeholder="e.g. INR 1,000 / USD 40"
                                    title="Price Display String"
                                  />
                                </div>
                              </div>

                              <div className="admin-form-group">
                                <label htmlFor="workshop_details">Detailed Description & Syllabus</label>
                                <textarea
                                  id="workshop_details"
                                  rows={4}
                                  required
                                  className="form-input"
                                  value={editingWorkshop.details}
                                  onChange={(e) => setEditingWorkshop({ ...editingWorkshop, details: e.target.value })}
                                  placeholder="Enter Detailed Description & Syllabus"
                                  title="Detailed Description & Syllabus"
                                />
                              </div>

                              <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button type="submit" className="btn btn-primary">
                                  <Save size={16} /> Save Changes
                                </button>
                                <button type="button" onClick={() => setEditingWorkshop(null)} className="btn btn-secondary">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        <div className="admin-card-grid">
                          {workshops.map((w, idx) => (
                            <div key={w.id || idx} className="admin-editor-card">
                              <h5 style={{ fontSize: '1.1rem', color: '#091d36', margin: '0 0 0.25rem', fontWeight: 800 }}>{w.title}</h5>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f58220' }}>Instructor: {w.instructor}</span>
                              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0' }}><strong>Duration:</strong> {w.duration} | <strong>Price:</strong> {w.price}</p>
                              <p style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.5rem', lineHeight: '1.5' }}>{w.details}</p>

                              <div className="admin-action-row">
                                <button onClick={() => setEditingWorkshop(w)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteWorkshop(w.id)} className="btn btn-secondary" style={{ color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Proof Receipt Image Preview Modal */}
      {previewImage && (() => {
        const reg = submittedRegistrations.find(r => r.screenshot_name === previewImage);
        const isDirectUrl = previewImage.startsWith('http') || previewImage.startsWith('data:');

        // Resolve the public URL from Supabase storage bucket
        let resolvedUrl: string | null = null;
        if (isDirectUrl) {
          resolvedUrl = previewImage;
        } else if (isSupabaseConfigured && supabase) {
          const { data } = supabase.storage.from('payment-proofs').getPublicUrl(previewImage);
          resolvedUrl = data?.publicUrl || null;
        }

        const isPdf = previewImage.toLowerCase().endsWith('.pdf');

        return (
          <div
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1.5rem',
              boxSizing: 'border-box'
            }}
            onClick={() => setPreviewImage(null)}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: '1rem',
                padding: '1.5rem',
                maxWidth: '92vw',
                maxHeight: '92vh',
                width: isPdf ? '700px' : 'auto',
                position: 'relative',
                boxShadow: '0 30px 60px -12px rgba(0,0,0,0.35)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                overflow: 'hidden'
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Payment Proof</h3>
                  {reg && (
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                      {reg.author_name} · {reg.paper_id || 'N/A'} · {reg.email}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setPreviewImage(null)}
                  style={{
                    background: '#f1f5f9', border: 'none', borderRadius: '50%',
                    width: '34px', height: '34px', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer', color: '#475569', flexShrink: 0
                  }}
                  title="Close Preview"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Image / PDF body */}
              {resolvedUrl ? (
                isPdf ? (
                  <iframe
                    src={resolvedUrl}
                    title="Payment Proof PDF"
                    style={{ width: '100%', height: '65vh', border: 'none', borderRadius: '0.5rem' }}
                  />
                ) : (
                  <img
                    src={resolvedUrl}
                    alt="Payment Proof"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '65vh',
                      objectFit: 'contain',
                      borderRadius: '0.5rem',
                      border: '1px solid #e2e8f0'
                    }}
                    onError={e => {
                      // If image fails to load, show a styled error placeholder
                      (e.target as HTMLImageElement).style.display = 'none';
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) {
                        const msg = document.createElement('div');
                        msg.style.cssText = 'padding:2rem;text-align:center;color:#64748b;font-size:0.85rem;';
                        msg.textContent = '⚠️ Image could not be loaded. It may have been deleted or is not publicly accessible.';
                        parent.appendChild(msg);
                      }
                    }}
                  />
                )
              ) : (
                /* No Supabase / can't resolve URL — show styled receipt card */
                <div style={{
                  width: '300px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #fff 100%)',
                  border: '1.5px dashed #cbd5e1',
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  fontFamily: 'monospace',
                  color: '#1e293b',
                  lineHeight: 1.6,
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧾</div>
                  <p style={{ fontWeight: 700, margin: '0 0 0.25rem', fontSize: '0.9rem' }}>AECTSD 2027</p>
                  <p style={{ fontSize: '0.72rem', color: '#64748b', margin: '0 0 1rem' }}>PAYMENT PROOF ON FILE</p>
                  <p style={{ fontSize: '0.78rem', wordBreak: 'break-all', background: '#f1f5f9', padding: '0.5rem', borderRadius: '0.25rem', margin: 0 }}>
                    {previewImage}
                  </p>
                  {reg && (
                    <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '1rem', textAlign: 'left' }}>
                      <p style={{ margin: '0.15rem 0' }}><strong>Author:</strong> {reg.author_name}</p>
                      <p style={{ margin: '0.15rem 0' }}><strong>Email:</strong> {reg.email}</p>
                      <p style={{ margin: '0.15rem 0' }}><strong>Paper ID:</strong> {reg.paper_id || 'N/A'}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', width: '100%' }}>
                {resolvedUrl && (
                  <a
                    href={resolvedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      fontSize: '0.8rem', padding: '0.5rem 1rem', textDecoration: 'none',
                      color: '#ffffff', background: '#3b82f6', borderRadius: '0.375rem', fontWeight: 600
                    }}
                  >
                    <Download size={14} /> Open / Download
                  </a>
                )}
                <button
                  onClick={() => setPreviewImage(null)}
                  style={{
                    fontSize: '0.8rem', padding: '0.5rem 1rem',
                    background: '#e2e8f0', color: '#475569',
                    border: 'none', borderRadius: '0.375rem',
                    fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        );
      })()}


      {/* Nexus Agent Chatbot Floating Widget */}
      {currentPage !== 'admin' && (
        <><div className="nexus-chat-container">
          {!showNexusChat && showNexusTooltip && (
            <div className="nexus-chat-tooltip">
              <span className="nexus-chat-tooltip-dot">●</span>
              How can I help you?
            </div>
          )}

          <div
            className="nexus-chat-trigger"
            onClick={() => setShowNexusChat(!showNexusChat)}
            title="Chat with Nexus AI Agent"
          >
            {showNexusChat ? (
              <div className="nexus-chat-close-btn">
                <X size={24} />
              </div>
            ) : (
              <img
                src={chatbotIcon}
                alt="Nexus Agent"
                className="nexus-chat-mascot-img" />
            )}
          </div>
        </div><AnimatePresence>
            {showNexusChat && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.2 }}
                className="nexus-chat-window"
              >
                {/* Header */}
                <div className="nexus-chat-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <img
                      src={chatbotIcon}
                      alt="Nexus Agent Avatar"
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255, 255, 255, 0.2)', display: 'block' }} />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Nexus AI Assistant</h4>
                      <span style={{ fontSize: '0.7rem', opacity: 0.8, display: 'block' }}>SREC Conference Agent</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNexusChat(false)}
                    style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Message List */}
                <div className="nexus-chat-messages" id="nexus-chat-messages-container">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`nexus-chat-message ${msg.sender}`}>
                      <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>{msg.text}</p>
                    </div>
                  ))}
                  {isAgentTyping && (
                    <div className="nexus-chat-message agent" style={{ display: 'inline-flex', alignItems: 'center' }}>
                      <div className="nexus-typing-dots">
                        <div className="nexus-typing-dot"></div>
                        <div className="nexus-typing-dot"></div>
                        <div className="nexus-typing-dot"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested Prompts */}
                <div className="nexus-chat-suggested">
                  {[
                    { label: 'Dates 📅', text: 'What are the important dates/deadlines?' },
                    { label: 'Fees 💳', text: 'How much are the registration fees?' },
                    { label: 'Submission 📝', text: 'How do I submit my paper?' },
                    { label: 'Speakers 🎙️', text: 'Who are the keynote speakers?' }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChatMessage(p.text)}
                      className="nexus-chat-suggested-btn"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Input Area */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage(chatInput);
                  }}
                  className="nexus-chat-input-area"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask Nexus a question..."
                    className="nexus-chat-input"
                    title="Chat Input" />
                  <button type="submit" className="nexus-chat-send">
                    Send
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default App;
