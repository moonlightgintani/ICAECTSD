import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exviushwdtdyotfnphsl.supabase.co';
const supabaseAnonKey = 'sb_publishable_t53cZzUCIE9sj4vfXHbLEQ_6wIHkcrl';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const organizingDeptsData = {
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
      'The Department of Biomedical Engineering bridges engineering innovation with clinical healthcare to develop advanced diagnostic tools, medical imaging software, wearable health sensors, and rehabilitation technologies.',
      'With dedicated research labs in Bio-Signal Processing, Telemedicine, Micro/Nano Bio-engineering, and Biomechanics, students gain hands-on training to address critical challenges in modern healthcare.',
      'The department works closely with leading hospitals, medical research institutes, and healthcare organizations for clinical trials and medical device development.'
    ],
    highlights: [
      'Clinical Training & Multi-Specialty Hospital Partnerships',
      'Advanced Bio-Signal & Medical Imaging Systems',
      'Research in Wearable Health Sensors & Point-of-Care Diagnostics'
    ]
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
      'The Department of Electrical and Electronics Engineering is dedicated to shaping future leaders in power systems, smart grids, renewable energy, electric vehicle technologies, and industrial automation.',
      'Equipped with modern laboratories for Power Electronics, Drives & Control, High Voltage Engineering, Electric Vehicles, and Smart Sensors, the department combines rigorous theory with practical engineering.',
      'Faculty and students collaborate on industrial consultancy projects, renewable energy integration, and smart grid automation for leading energy enterprises.'
    ],
    highlights: [
      'Electric Vehicle & Smart Grid Research Facilities',
      'Power Electronics, Automation & Renewable Energy Labs',
      'Industry-Sponsored Consultancy & Energy Audits'
    ]
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

async function main() {
  console.log('Seeding organizing_departments_info into conference_info in Supabase...');
  const { data, error } = await supabase.from('conference_info').upsert({
    key: 'organizing_departments_info',
    value: JSON.stringify(organizingDeptsData, null, 2)
  });

  if (error) {
    console.error('Error seeding organizing_departments_info:', error);
  } else {
    console.log('Successfully seeded organizing_departments_info into Supabase conference_info table!');
  }
}

main();
