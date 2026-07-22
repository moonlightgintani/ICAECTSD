import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exviushwdtdyotfnphsl.supabase.co';
const supabaseAnonKey = 'sb_publishable_t53cZzUCIE9sj4vfXHbLEQ_6wIHkcrl';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tracks = [
  {
    name: "Artificial Intelligence, Data Science and Intelligent Computing",
    description: "Focuses on Artificial Intelligence, Data Science, Deep Learning, and Intelligent Computing Architectures.\n\nSubtopics:\n• Artificial Intelligence and Machine Learning\n• Deep Learning and Generative AI\n• Agentic AI and Autonomous Intelligent Systems\n• Natural Language Processing\n• Computer Vision\n• Data Science and Big Data Analytics\n• Explainable and Responsible AI\n• High-Performance Computing",
    sort_order: 1
  },
  {
    name: "Computing Technologies and Software Systems",
    description: "Focuses on Software Engineering, Distributed Systems, Cloud/Edge Infrastructure, and IoT Technologies.\n\nSubtopics:\n• Software Engineering\n• Cloud, Edge and Fog Computing\n• Distributed Computing\n• Internet of Things (IoT)\n• Digital Twin Technologies\n• Human-Computer Interaction\n• Mobile and Web Technologies\n• DevOps and Software Quality",
    sort_order: 2
  },
  {
    name: "Cyber Security, Blockchain and Quantum Computing",
    description: "Focuses on Cybersecurity, Applied Cryptography, Distributed Ledgers, and Quantum Computing.\n\nSubtopics:\n• Cyber Security and Network Security\n• Ethical Hacking and Digital Forensics\n• Blockchain Technologies\n• Privacy-Preserving Computing\n• Applied Cryptography\n• Quantum Computing\n• Quantum Algorithms\n• Quantum Communication and Security\n• Post-Quantum Cryptography",
    sort_order: 3
  },
  {
    name: "Electronics, Communication and Embedded Intelligence",
    description: "Focuses on VLSI, Semiconductor Devices, Signal Processing, 5G/6G Wireless Networks, and Embedded AI.\n\nSubtopics:\n• Embedded Systems\n• VLSI Design\n• Semiconductor Devices\n• Signal, Image and Video Processing\n• Wireless Communication (5G/6G)\n• Sensor Networks\n• Embedded AI\n• Intelligent Electronic Systems",
    sort_order: 4
  },
  {
    name: "Electrical, Energy and Smart Technologies",
    description: "Focuses on Smart Grids, Renewable Energy, Electric Vehicles, Power Electronics, and Smart Sensing.\n\nSubtopics:\n• Smart Grid Technologies\n• Renewable Energy Systems\n• Electric Vehicles and Charging Infrastructure\n• Power Electronics and Drives\n• Energy Storage Systems\n• Intelligent Power Systems\n• Sustainable Energy Technologies\n• Smart Sensors and Instrumentation",
    sort_order: 5
  },
  {
    name: "Emerging Technologies for Sustainable Development",
    description: "Focuses on Digital Healthcare, Smart Agriculture, Green Computing, Industry 5.0, and UN SDGs.\n\nSubtopics:\n• Digital Healthcare\n• Biomedical Engineering\n• Bioinformatics\n• Smart Agriculture\n• AR/VR/XR Technologies\n• Green Computing\n• Sustainable ICT Solutions\n• Industry 5.0 and Digital Transformation\n• Technology for UN Sustainable Development Goals (SDGs)",
    sort_order: 6
  }
];

async function main() {
  console.log('Clearing existing tracks in departments table...');
  const { error: deleteError } = await supabase.from('departments').delete().neq('id', 0);
  if (deleteError) {
    console.error('Delete error:', deleteError);
  }

  console.log('Inserting 6 official AECTSD 2027 Technical Tracks...');
  const { data, error } = await supabase.from('departments').insert(tracks);

  if (error) {
    console.error('Error inserting tracks:', error);
  } else {
    console.log('Successfully updated departments table with all 6 Technical Tracks for AECTSD 2027!');
  }
}

main();
