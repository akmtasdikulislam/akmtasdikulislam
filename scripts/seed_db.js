import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env file manually
const envPath = path.resolve(process.cwd(), '.env');
let SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
let SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length < 2) return;
    
    const key = parts[0].trim();
    let value = parts.slice(1).join('=').trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    if (key === 'VITE_SUPABASE_URL') SUPABASE_URL = value;
    if (key === 'VITE_SUPABASE_PUBLISHABLE_KEY') SUPABASE_KEY = value;
  });
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase URL or Key in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const demoCertifications = [
  {
    title: 'Higher Secondary Certificate (HSC)',
    issuer: 'RAJUK Uttara Model College',
    issue_date: '2024-01-01',
    description: 'Achieved GPA 5.00 in the Board Exam. Group: Science.',
    display_order: 1,
    is_visible: true
  },
  {
    title: 'Secondary School Certificate (SSC)',
    issuer: 'BAF Shaheen College Kurmitola',
    issue_date: '2022-01-01',
    description: 'Achieved GPA 5.00 with General Category Scholarship. Group: Science.',
    display_order: 2,
    is_visible: true
  },
  {
    title: 'n8n Automation Expert',
    issuer: 'Self-Mastery / Portfolio',
    issue_date: '2023-06-15',
    badge_image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/n8n/n8n-original.svg',
    description: 'Expertise in building complex AI Agentic workflows and business process automation using n8n.',
    display_order: 3,
    is_visible: true
  }
];

const demoTestimonials = [
  {
    name: 'Sarah Jenkins',
    position: 'Product Manager',
    company: 'TechStart USA',
    content: 'Tasdikul is an incredibly talented developer. He built our entire MVP using the MERN stack in record time. His knowledge of authentication and database design is top-notch.',
    avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    is_featured: true,
    display_order: 1,
    is_visible: true
  },
  {
    name: 'Michael Chen',
    position: 'CEO',
    company: 'AutomateNow',
    content: 'The AI agent workflow Tasdikul created with n8n has saved our team 20+ hours a week. He understands both the code and the business logic perfectly.',
    avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    is_featured: true,
    display_order: 2,
    is_visible: true
  },
  {
    name: 'Emily Rodriguez',
    position: 'Creative Director',
    company: 'DesignHub',
    content: 'A rare developer who cares about aesthetics! He took our Figma designs and implemented them pixel-perfectly using React and Tailwind. The animations are so smooth.',
    avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    is_featured: true,
    display_order: 3,
    is_visible: true
  }
];

const demoWorkHistory = [
  {
    company: 'Upwork / Freelance',
    position: 'Full Stack Web Developer',
    location: 'Remote',
    start_date: '2023-01-01',
    is_current: true,
    description: 'Crafting exceptional websites and web applications. Specializing in MERN stack, Next.js, and AI automation solutions. Delivered projects for international clients.',
    company_logo: 'https://cdn.worldvectorlogo.com/logos/upwork.svg',
    technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'PostgreSQL', 'n8n', 'AI Agents'],
    display_order: 1,
    is_visible: true
  },
  {
    company: 'BNCC (RAJUK College Platoon)',
    position: 'Cadet Lance Corporal',
    location: 'Dhaka, Bangladesh',
    start_date: '2023-09-05',
    end_date: '2023-09-12',
    is_current: false,
    description: 'Participated in 3 BNCC Battalion Camp. Achieved "4 inch Grouping" in Firing Competition during the camping at Milestone College Campus.',
    technologies: ['Leadership', 'Discipline', 'Teamwork'],
    display_order: 2,
    is_visible: true
  },
  {
    company: 'ICONIC IT CLUB - BAFSK',
    position: 'President',
    location: 'Dhaka, Bangladesh',
    start_date: '2021-01-01',
    end_date: '2022-12-31',
    is_current: false,
    description: 'Served as President for the 2021-22 session. Organized tech events and workshops. One of the founding members of the club.',
    technologies: ['Leadership', 'Event Management', 'Public Speaking'],
    display_order: 3,
    is_visible: true
  }
];

async function seed() {
  console.log('Seeding database...');
  
  // Certifications
  const { error: certError } = await supabase.from('certifications').insert(demoCertifications);
  if (certError) console.error('Error inserting certifications:', certError);
  else console.log('Certifications seeded.');

  // Testimonials
  const { error: testError } = await supabase.from('testimonials').insert(demoTestimonials);
  if (testError) console.error('Error inserting testimonials:', testError);
  else console.log('Testimonials seeded.');

  // Work History
  const { error: workError } = await supabase.from('work_history').insert(demoWorkHistory);
  if (workError) console.error('Error inserting work history:', workError);
  else console.log('Work History seeded.');
}

seed();
