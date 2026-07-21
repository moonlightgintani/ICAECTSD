-- SQL script to create and populate organizing_departments table in Supabase

CREATE TABLE IF NOT EXISTS organizing_departments (
    id SERIAL PRIMARY KEY,
    dept_key VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description JSONB NOT NULL,
    highlights JSONB,
    sort_order INT DEFAULT 1
);

-- Seed Initial Organizing Departments Data
INSERT INTO organizing_departments (dept_key, title, subtitle, description, highlights, sort_order)
VALUES 
(
  'artificial intelligence',
  'Department of Artificial Intelligence and Data Science',
  '(AI & DS)',
  '["The Department of Artificial Intelligence and Data Science (AI & DS) at Sri Ramakrishna Engineering College focuses on developing next-generation leaders in AI, Machine Learning, Deep Learning, Big Data Analytics, and Intelligent Systems.", "Equipped with state-of-the-art AI laboratories, GPU computing clusters, and industry-oriented R&D facilities, the department provides hands-on experience in cutting-edge domains including Computer Vision, Natural Language Processing, MLOps, and Autonomous Systems.", "Driven by experienced faculty members and strong industry collaborations, the department actively engages in multidisciplinary research, consulting projects, and tech innovation hackathons."]'::jsonb,
  '["Advanced AI/ML & High-Performance GPU Computing Labs", "Industry Collaborations and Co-Innovation Centers", "Active Research in Generative AI, Computer Vision, & Responsible AI"]'::jsonb,
  1
),
(
  'biomedical',
  'Department of Biomedical Engineering',
  '(BME)',
  '["Biomedical Engineering is a unique and exciting field where engineering meets medicine, creating solutions that improve and save lives. At our department, we provide a dynamic learning environment that integrates engineering principles, life sciences, biotechnology, and medical technology. Through a carefully designed curriculum, state-of-the-art laboratories, experiential learning, and interdisciplinary collaboration, students develop the knowledge, technical expertise, and problem-solving abilities required to excel in this rapidly evolving profession.", "The department takes immense pride in its excellent record of placements, higher studies, and entrepreneurial achievements. Our graduates have secured rewarding careers in healthcare technology companies, research institutions, hospitals, and multinational organizations across the globe. We also provide dedicated guidance for competitive examinations such as GATE, GRE, TOEFL, IELTS, UPSC, and other career-oriented pathways."]'::jsonb,
  '["Dedicated guidance for competitive examinations (GATE, GRE, TOEFL, IELTS, UPSC)", "Interdisciplinary curriculum integrating engineering principles, life sciences, biotechnology & medical technology", "High-impact placements & higher studies track record in global healthcare & research institutions"]'::jsonb,
  2
),
(
  'computer science engineering',
  'Department of Computer Science Engineering',
  '(CSE)',
  '["The Department of Computer Science and Engineering is a flagship department at SREC, fostering academic excellence in software engineering, algorithms, cloud computing, cyber security, and distributed systems.", "Featuring modern computer centers with high-speed networks, cloud infrastructure, and open-source software stacks, the department empowers students to build scalable enterprise applications and innovative software products.", "With active student chapters of IEEE Computer Society, ACM, and CSI, the department nurtures technical leadership through codeathons, research publications, and open-source contributions."]'::jsonb,
  '["High-Performance Computing Infrastructure & Cloud Testbeds", "Strong Placement Track Record & Top Tier Tech Internships", "Active Student Chapters (IEEE CS, ACM, CSI)"]'::jsonb,
  3
),
(
  'electrical and electronics',
  'Department of Electrical and Electronics Engineering',
  '(EEE)',
  '["Established in 1994, the Department of Electrical and Electronics Engineering offers a comprehensive four-year B.E. programme in Electrical and Electronics Engineering, along with a Ph.D. programme to promote advanced research in core and emerging areas of electrical engineering. The department is backed by a distinguished team of faculty, comprising 13 Doctorates and 8 faculty members pursuing Ph.D. in various specializations, with rich experience in industry, research, and teaching.", "The department has a proven track record of academic excellence and quality assurance, with its B.E. programme accredited by the National Board of Accreditation (NBA), New Delhi in 2003 and reaccredited in 2007, 2012, 2016, 2019, 2022, and 2025. It is equipped with state-of-the-art, industry-collaborated laboratories that provide learners with hands-on exposure to world-class technologies and a 360-degree view of industrial processes.", "The department takes pride in housing a Centre of Excellence in e-Mobility, fostering innovation and research in electric vehicle technologies. It also engages in energy auditing and consultancy services, supported by energy auditors among the faculty. Strong industry linkages through active MoUs with Salzer Electronics, Mahindra and Mahindra, Divise Electronics, and Cares Renewables facilitate collaborative research, internships, and technical training. With a consistently strong placement record, the department ensures that its graduates are well-equipped to meet the demands of the industry and contribute to sustainable and smart energy solutions."]'::jsonb,
  '["Centre of Excellence in e-Mobility (Electric Vehicle Technologies R&D)", "Continuous NBA Accreditation (2003, 2007, 2012, 2016, 2019, 2022, 2025)", "Active MoUs with Salzer Electronics, Mahindra & Mahindra, Divise Electronics, and Cares Renewables", "In-house Energy Auditing & Industrial Consultancy Services"]'::jsonb,
  4
),
(
  'electronics and communication',
  'Department of Electronics and Communication Engineering',
  '(ECE)',
  '["The Department of Electronics and Communication Engineering excels in training students in 5G/6G wireless communication, VLSI design, embedded systems, signal processing, and RF/microwave engineering.", "Featuring state-of-the-art labs for Cadence VLSI tools, Embedded Systems, Signal & Image Processing, and Microwave & Optical Communications, the department provides an ideal environment for hardware-software co-design.", "The department maintains active industry ties with semiconductor giants, telecom providers, and defense R&D organizations."]'::jsonb,
  '["Cadence VLSI & Embedded Systems Design Suite", "Wireless Communication (5G/6G) & Antenna Design Facilities", "Product R&D in Embedded AI and Edge Devices"]'::jsonb,
  5
),
(
  'electronics and instrumentation',
  'Department of Electronics and Instrumentation Engineering',
  '(EIE)',
  '["The Department of Electronics and Instrumentation Engineering specializes in process automation, industrial IoT, SCADA/DCS systems, smart sensors, robotics, and cyber-physical systems.", "The department is equipped with process control rigs, virtual instrumentation setups, PLCs, industrial controllers, and sensor calibration labs to provide real-world automation experience.", "Collaborating closely with manufacturing and continuous-process industries, the department drives innovation in Industry 4.0/5.0 transformation."]'::jsonb,
  '["Process Control, SCADA & DCS Automation Centers", "Industrial Robotics & Cyber-Physical Systems Labs", "Smart Sensors & Measurement Technology Facilities"]'::jsonb,
  6
),
(
  'information technology',
  'Department of Information Technology',
  '(IT)',
  '["The Department of Information Technology focuses on full-stack software development, cyber security, data analytics, web/mobile engineering, and enterprise cloud solutions.", "Through state-of-the-art computing labs, DevOps toolchains, and cyber security testbeds, students develop practical expertise in solving complex software engineering challenges.", "The department maintains close links with IT services, product firms, and tech startups for mentorship, hackathons, and placement opportunities."]'::jsonb,
  '["Full-Stack Software Development & Cloud Computing Labs", "Cyber Security & Threat Intelligence Testing Center", "Industry Hackathons & Product Engineering Mentorship"]'::jsonb,
  7
),
(
  'm.tech',
  'M.TECH - COMPUTER SCIENCE AND ENGINEERING',
  '(5 Year Integrated Programme)',
  '["The Department of M.Tech in Computer Science and Engineering (5 Years Integrated Programme), established in year 2021, aims to be a center of excellence for advanced education, research, and industry-driven innovation. It focuses on developing skilled professionals and researchers capable of addressing the challenges of a technology-driven world. The program features a unique curriculum with two six-month internships at reputed organizations and institution of eminence such as LTTS, Airbus, HTIC, CDAC, NITs, IITs, and IISc, providing students with valuable real-world exposure and practical experience.", "The department is equipped with state-of-the-art laboratories featuring high-performance computing systems, AI and ML frameworks, AR and VR kits, Data Analytics platforms, and advanced networking and security setups that support hands-on learning and innovation emphasizing emerging fields such as Data Science, Cyber Security, Artificial Intelligence, and Augmented and Virtual Reality, enabling students to explore modern technologies and applications.", "Guided by a team of highly qualified and research-driven faculty members, students are encouraged to engage in innovative projects, publish research papers, and develop impactful technology solutions."]'::jsonb,
  '["Currently working on an ANRF-funded project to automate MSMEs in Coimbatore region", "Student & Faculty team working under MSME Idea Hackathon 5.0 project \"Predictive Food safety monitoring using smart sensors\"", "Recognized as an Experience Centre by C-DAC Chennai for capacity building & advanced computing research"]'::jsonb,
  8
)
ON CONFLICT (dept_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  highlights = EXCLUDED.highlights,
  sort_order = EXCLUDED.sort_order;
