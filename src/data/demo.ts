export type Role = 'super_admin' | 'principal' | 'teacher' | 'student' | 'parent';
export type InstitutionType = 'school' | 'college' | 'madrasa';
export type InstitutionStatus = 'pending' | 'active' | 'suspended';
export type MarkStatus = 'draft' | 'submitted' | 'approved';

export interface Institution {
  id: string;
  name: string;
  eiin: string;
  type: InstitutionType;
  address: string;
  principalName: string;
  phone: string;
  status: InstitutionStatus;
}

export interface TeachingAssignment {
  className: string;
  section: string;
  subject: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  institutionId: string | null;
  studentId: string | null;
  childIds: string[];
  teaching: TeachingAssignment[];
}

export interface Student {
  id: string;
  institutionId: string;
  name: string;
  roll: number;
  className: string;
  section: string;
  year: number;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  fourthSubject: string | null;
}

export interface MarkRecord {
  studentId: string;
  subject: string;
  cq: number | null;
  mcq: number | null;
  pr: number | null;
  status: MarkStatus;
}

export interface Notice {
  id: string;
  institutionId: string | null;
  title: string;
  body: string;
  audience: string;
  date: string;
}

export interface AuditLog {
  id: string;
  at: string;
  actor: string;
  action: string;
}

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'সেন্ট্রাল অ্যাডমিন',
  principal: 'অধ্যক্ষ',
  teacher: 'শিক্ষক',
  student: 'শিক্ষার্থী',
  parent: 'অভিভাবক',
};

export const INSTITUTION_TYPE_LABELS: Record<InstitutionType, string> = {
  school: 'স্কুল',
  college: 'কলেজ',
  madrasa: 'মাদ্রাসা',
};

export const INSTITUTION_STATUS_LABELS: Record<InstitutionStatus, string> = {
  pending: 'অপেক্ষমাণ',
  active: 'সক্রিয়',
  suspended: 'স্থগিত',
};

export const MARK_STATUS_LABELS: Record<MarkStatus, string> = {
  draft: 'খসড়া',
  submitted: 'জমা হয়েছে',
  approved: 'অনুমোদিত',
};

export const ACADEMIC_YEARS = [2025, 2026, 2027];

export const SUBJECTS = ['বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান'];

export const CLASS_NAMES = ['ষষ্ঠ', 'সপ্তম', 'অষ্টম', 'নবম', 'দশম'];

export const SECTIONS = ['ক', 'খ', 'গ'];

export const FOURTH_SUBJECTS = ['ধর্ম', 'কম্পিউটার', 'কৃষি শিক্ষা'];

export const DEMO_PASSWORD = 'Demo@1234';

export const SEED_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    name: 'সিলেট মডেল উচ্চ বিদ্যালয়',
    eiin: '108765',
    type: 'school',
    address: 'জিন্দাবাজার, সিলেট',
    principalName: 'মোহাম্মদ রফিকুল ইসলাম',
    phone: '01711000001',
    status: 'active',
  },
  {
    id: 'inst-2',
    name: 'নূরজাহান মহিলা কলেজ',
    eiin: '205431',
    type: 'college',
    address: 'মিরপুর, ঢাকা',
    principalName: 'ফারহানা শারমিন',
    phone: '01711000002',
    status: 'pending',
  },
  {
    id: 'inst-3',
    name: 'আল-হেরা দাখিল মাদ্রাসা',
    eiin: '312908',
    type: 'madrasa',
    address: 'বিশ্বনাথ, সিলেট',
    principalName: 'মাওলানা আব্দুল হক',
    phone: '01711000003',
    status: 'suspended',
  },
];

export const SEED_USERS: AppUser[] = [
  {
    id: 'u-admin',
    name: 'সুপার অ্যাডমিন',
    email: 'admin@samagra.demo',
    password: DEMO_PASSWORD,
    phone: '01700000000',
    role: 'super_admin',
    institutionId: null,
    studentId: null,
    childIds: [],
    teaching: [],
  },
  {
    id: 'u-principal',
    name: 'মোহাম্মদ রফিকুল ইসলাম',
    email: 'principal@samagra.demo',
    password: DEMO_PASSWORD,
    phone: '01711000001',
    role: 'principal',
    institutionId: 'inst-1',
    studentId: null,
    childIds: [],
    teaching: [],
  },
  {
    id: 'u-principal-pending',
    name: 'ফারহানা শারমিন',
    email: 'pending@samagra.demo',
    password: DEMO_PASSWORD,
    phone: '01711000002',
    role: 'principal',
    institutionId: 'inst-2',
    studentId: null,
    childIds: [],
    teaching: [],
  },
  {
    id: 'u-teacher',
    name: 'সাবিনা ইয়াসমিন',
    email: 'teacher@samagra.demo',
    password: DEMO_PASSWORD,
    phone: '01811000010',
    role: 'teacher',
    institutionId: 'inst-1',
    studentId: null,
    childIds: [],
    teaching: [
      { className: 'নবম', section: 'ক', subject: 'বাংলা' },
      { className: 'নবম', section: 'ক', subject: 'ইংরেজি' },
      { className: 'নবম', section: 'ক', subject: 'বিজ্ঞান' },
    ],
  },
  {
    id: 'u-student',
    name: 'সাদিয়া রহমান',
    email: 'student@samagra.demo',
    password: DEMO_PASSWORD,
    phone: '01911000020',
    role: 'student',
    institutionId: 'inst-1',
    studentId: 'stu-1',
    childIds: [],
    teaching: [],
  },
  {
    id: 'u-parent',
    name: 'আব্দুল করিম',
    email: 'parent@samagra.demo',
    password: DEMO_PASSWORD,
    phone: '01911000030',
    role: 'parent',
    institutionId: 'inst-1',
    studentId: null,
    childIds: ['stu-1', 'stu-2'],
    teaching: [],
  },
];

export const SEED_STUDENTS: Student[] = [
  { id: 'stu-1', institutionId: 'inst-1', name: 'সাদিয়া রহমান', roll: 1024, className: 'নবম', section: 'ক', year: 2026, fatherName: 'রহমান আলী', motherName: 'ফাতেমা বেগম', guardianPhone: '01811111111', fourthSubject: null },
  { id: 'stu-2', institutionId: 'inst-1', name: 'তানভীর আহমেদ', roll: 1025, className: 'নবম', section: 'ক', year: 2026, fatherName: 'আব্দুল করিম', motherName: 'রোকেয়া খাতুন', guardianPhone: '01911000030', fourthSubject: 'ধর্ম' },
  { id: 'stu-3', institutionId: 'inst-1', name: 'মাহমুদা আক্তার', roll: 1031, className: 'নবম', section: 'খ', year: 2026, fatherName: 'জাহাঙ্গীর আলম', motherName: 'শিরিন আক্তার', guardianPhone: '01822222222', fourthSubject: null },
  { id: 'stu-4', institutionId: 'inst-1', name: 'রাকিব হাসান', roll: 1040, className: 'দশম', section: 'ক', year: 2026, fatherName: 'হাসান মিয়া', motherName: 'নাসরিন সুলতানা', guardianPhone: '01833333333', fourthSubject: null },
  { id: 'stu-5', institutionId: 'inst-1', name: 'নুসরাত জাহান', roll: 1002, className: 'নবম', section: 'ক', year: 2025, fatherName: 'মাহবুব আলম', motherName: 'সালমা বেগম', guardianPhone: '01844444444', fourthSubject: null },
];

export const SEED_MARKS: MarkRecord[] = [
  { studentId: 'stu-1', subject: 'বাংলা', cq: 62, mcq: 25, pr: null, status: 'approved' },
  { studentId: 'stu-1', subject: 'ইংরেজি', cq: 55, mcq: 22, pr: null, status: 'approved' },
  { studentId: 'stu-1', subject: 'বিজ্ঞান', cq: 44, mcq: 18, pr: 21, status: 'approved' },
  { studentId: 'stu-2', subject: 'বাংলা', cq: 48, mcq: 20, pr: null, status: 'approved' },
  { studentId: 'stu-2', subject: 'ইংরেজি', cq: 60, mcq: 24, pr: null, status: 'submitted' },
  { studentId: 'stu-2', subject: 'বিজ্ঞান', cq: 35, mcq: 14, pr: 19, status: 'submitted' },
];

export const SEED_NOTICES: Notice[] = [
  { id: 'n-1', institutionId: null, title: 'নতুন শিক্ষাবর্ষের ভর্তি তথ্য হালনাগাদ', body: 'সকল প্রতিষ্ঠানকে আগামী শিক্ষাবর্ষের ভর্তি তথ্য যাচাই করার অনুরোধ করা হচ্ছে।', audience: 'সকল প্রতিষ্ঠান', date: '2026-10-20' },
  { id: 'n-2', institutionId: 'inst-1', title: 'বার্ষিক পরীক্ষার নম্বর জমার শেষ তারিখ', body: 'শিক্ষকগণ আগামী ১৫ নভেম্বরের মধ্যে নিজ নিজ বিষয়ের নম্বর জমা দেবেন।', audience: 'শিক্ষক', date: '2026-10-25' },
  { id: 'n-3', institutionId: 'inst-1', title: 'অভিভাবক সভা', body: 'আগামী রবিবার সকাল ১০টায় বিদ্যালয় মিলনায়তনে অভিভাবক সভা অনুষ্ঠিত হবে।', audience: 'শিক্ষার্থী ও অভিভাবক', date: '2026-10-27' },
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  { id: 'a-1', at: '2026-10-29 09:12', actor: 'সুপার অ্যাডমিন', action: 'লগইন করেছেন' },
  { id: 'a-2', at: '2026-10-28 16:40', actor: 'সাবিনা ইয়াসমিন', action: 'বিজ্ঞান বিষয়ের নম্বর জমা দিয়েছেন' },
  { id: 'a-3', at: '2026-10-28 11:05', actor: 'মোহাম্মদ রফিকুল ইসলাম', action: 'ইংরেজি বিষয়ের নম্বর অনুমোদন করেছেন' },
  { id: 'a-4', at: '2026-10-27 10:30', actor: 'ফারহানা শারমিন', action: 'প্রতিষ্ঠান নিবন্ধনের আবেদন করেছেন' },
];
