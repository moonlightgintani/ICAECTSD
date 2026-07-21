import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exviushwdtdyotfnphsl.supabase.co';
const supabaseAnonKey = 'sb_publishable_t53cZzUCIE9sj4vfXHbLEQ_6wIHkcrl';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newAboutConference = `We are delighted to inform the upcoming International Conference on Advances in Engineering and Computing Technologies for Sustainable Development (AECTSD 2027) is organized by Sri Ramakrishna Engineering College, Coimbatore, Tamilnadu, India during 17th and 18th December 2027.

Organizing Departments:
• Department of Artificial Intelligence and Data Science
• Department of Biomedical Engineering
• Department of Computer Science Engineering
• Department of Electrical and Electronics Engineering
• Department of Electronics and Communication Engineering
• Department of Electronics and Instrumentation Engineering
• Department of Information Technology
• Department of M.Tech - Computer Science and Engineering (5 Year Integrated Programme)

This technical co-sponsor for this conference is IEEE Madras Section. This interdisciplinary conference provides a dynamic platform for students, academicians, researchers, and industry professionals from around the globe to exchange ideas and collaborate, explore innovative solutions, present their latest research, and explore cutting-edge advancements across multiple fields of technology to facilitate the growth and prosperity of society as a whole. This interdisciplinary conference aims to foster collaboration and knowledge sharing across a diverse tracks from various domains such as Power and Energy, Embedded and Communication, Biomedical Engineering, Instrumentation and Control, Computational Intelligence, Big Data, Internet of Things and Security, and other related areas including core sciences and engineering. In addition to the technical sessions, there will be pre-conference tutorial and keynote addresses.`;

async function main() {
  const { data, error } = await supabase
    .from('conference_info')
    .upsert({ key: 'about_conference', value: newAboutConference });

  if (error) {
    console.error('Error updating about_conference:', error);
  } else {
    console.log('Successfully updated about_conference in Supabase database!');
  }
}

main();
