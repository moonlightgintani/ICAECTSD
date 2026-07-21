import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://exviushwdtdyotfnphsl.supabase.co';
const supabaseAnonKey = 'sb_publishable_t53cZzUCIE9sj4vfXHbLEQ_6wIHkcrl';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('Testing organizing_departments table...');
  const { data: test1, error: err1 } = await supabase.from('organizing_departments').select('*');
  console.log('organizing_departments:', err1 ? err1.message : test1);

  console.log('Testing dept_details table...');
  const { data: test2, error: err2 } = await supabase.from('dept_details').select('*');
  console.log('dept_details:', err2 ? err2.message : test2);

  console.log('Testing conference_info table keys...');
  const { data: test3, error: err3 } = await supabase.from('conference_info').select('*');
  console.log('conference_info keys:', test3 ? test3.map(r => r.key) : err3);
}

main();
