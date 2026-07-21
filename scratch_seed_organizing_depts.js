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

async function main() {
  console.log('Seeding updated EEE info into conference_info in Supabase...');
  const { data, error } = await supabase.from('conference_info').upsert({
    key: 'organizing_departments_info',
    value: JSON.stringify(organizingDeptsData, null, 2)
  });

  if (error) {
    console.error('Error seeding organizing_departments_info:', error);
  } else {
    console.log('Successfully updated organizing_departments_info in Supabase conference_info table!');
  }
}

main();
