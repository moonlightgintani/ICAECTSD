import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exviushwdtdyotfnphsl.supabase.co';
const supabaseAnonKey = 'sb_publishable_t53cZzUCIE9sj4vfXHbLEQ_6wIHkcrl';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tracks = [
  {
    name: "AI, Machine Learning, and Intelligence for Net-Zero Engineering",
    description: "Focuses on AI, Machine Learning, Deep Learning, Generative AI, MLOps, and Intelligent Systems for Net-Zero Engineering.\n\nSubtopics:\n• Artificial Intelligence & Machine Learning\n• Deep Learning & Generative AI\n• Agentic AI & Autonomous Systems\n• Natural Language Processing & Computer Vision\n• AI for Sustainable & Net-Zero Engineering",
    sort_order: 1
  },
  {
    name: "6G, Next-Gen Wireless, Networking & Sustainable Communication System",
    description: "Focuses on 6G, Next-Gen Wireless, Mobile Communications, and Sustainable Communication Networks.\n\nSubtopics:\n• 5G/6G Wireless Communication\n• Software-Defined Networking & Edge Computing\n• Green & Sustainable Communication Systems\n• Optical & Satellite Networks\n• Network Security & Protocol Design",
    sort_order: 2
  },
  {
    name: "Cyber-Physical Systems, Digital Twins & Sustainable Smart Infrastructure",
    description: "Focuses on Cyber-Physical Systems, Digital Twin Technology, IoT, and Sustainable Smart Cities.\n\nSubtopics:\n• Cyber-Physical Systems & Industry 4.0/5.0\n• Digital Twin Architecture & Modeling\n• Smart Cities & Intelligent Infrastructure\n• Internet of Things (IoT) & Smart Sensing\n• Distributed Cloud & Edge Infrastructure",
    sort_order: 3
  },
  {
    name: "Sustainable Electronics, Green Hardware, VLSI & Embedded Systems",
    description: "Electronic devices, circuits, VLSI, embedded systems, and low-power / green hardware design.\n\nSubtopics:\n• VLSI Design & Semiconductor Devices\n• Low-Power & Green Hardware Architecture\n• Embedded Systems & Edge AI Chips\n• Analog & Mixed-Signal IC Design\n• Sustainable Electronics Manufacturing",
    sort_order: 4
  },
  {
    name: "Power Electronics, Smart Grids, and Industrial Automation",
    description: "Focuses on Power Electronics, Smart Grids, Renewable Energy Systems, and Industrial Automation.\n\nSubtopics:\n• Smart Grid Technologies & Microgrids\n• Renewable Energy Integration (Solar/Wind/Hydro)\n• Electric Vehicles & EV Charging Infrastructure\n• Power Converter Topologies & Energy Storage\n• Industrial Drives & PLC/SCADA Automation",
    sort_order: 5
  },
  {
    name: "Robotics, Automation, Instrumentation, and Intelligent Control",
    description: "Focuses on Robotics, Autonomous Systems, Process Control, and Intelligent Automation.\n\nSubtopics:\n• Industrial & Mobile Robotics\n• Autonomous Navigation & Control Systems\n• Process Instrumentation & Smart Sensors\n• Cyber-Physical Automation R&D\n• Mechatronics & Biomedical Robotics",
    sort_order: 6
  },
  {
    name: "Photonics, Quantum Technologies, and Optical Intelligence",
    description: "Focuses on Photonics, Quantum Computing, Quantum Encryption, and Optical Intelligence.\n\nSubtopics:\n• Quantum Information & Quantum Computing\n• Quantum Cryptography & Key Distribution\n• Silicon Photonics & Optical Interconnects\n• Laser Technologies & Fiber-Optic Sensors\n• Integrated Quantum Optics",
    sort_order: 7
  },
  {
    name: "Sensors, Remote Sensing, Signal & Image Processing & Perception",
    description: "Focuses on Sensors, Remote Sensing, Satellite Imaging, Bio-Signal Processing, and Multimodal Perception.\n\nSubtopics:\n• Smart Sensors & MEMS Technology\n• Remote Sensing & Earth Observation Systems\n• Bio-Signal, Image & Video Processing\n• Multimodal Sensor Fusion & Radar Perception\n• Environmental Monitoring & Geoinformatics",
    sort_order: 8
  }
];

async function main() {
  console.log('Clearing existing tracks...');
  await supabase.from('departments').delete().neq('id', 0);

  console.log('Inserting 8 modern technical tracks into departments table...');
  const { data, error } = await supabase.from('departments').insert(tracks);

  if (error) {
    console.error('Error inserting tracks:', error);
  } else {
    console.log('Successfully updated departments table with all 8 Technical Tracks!');
  }
}

main();
