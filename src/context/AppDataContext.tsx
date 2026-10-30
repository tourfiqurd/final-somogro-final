import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  ACADEMIC_YEARS,
  SEED_AUDIT_LOGS,
  SEED_INSTITUTIONS,
  SEED_MARKS,
  SEED_NOTICES,
  SEED_STUDENTS,
  SEED_USERS,
  type AppUser,
  type AuditLog,
  type TeachingAssignment,
  type Institution,
  type InstitutionStatus,
  type InstitutionType,
  type MarkRecord,
  type MarkStatus,
  type Notice,
  type Student,
} from '@/data/demo';

export interface RegistrationInput {
  name: string;
  type: InstitutionType;
  eiin: string;
  address: string;
  principalName: string;
  phone: string;
  email: string;
  password: string;
}

export interface StudentInput {
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

export interface TeacherInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface MarkRow {
  studentId: string;
  cq: number | null;
  mcq: number | null;
  pr: number | null;
}

interface AppDataValue {
  currentUser: AppUser | null;
  users: AppUser[];
  institutions: Institution[];
  students: Student[];
  marks: MarkRecord[];
  notices: Notice[];
  auditLogs: AuditLog[];
  academicYear: number;
  academicYears: number[];
  setAcademicYear: (year: number) => void;
  addAcademicYear: (year: number) => string | null;
  deleteAcademicYear: (year: number) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  registerInstitution: (input: RegistrationInput) => string | null;
  setInstitutionStatus: (institutionId: string, status: InstitutionStatus) => void;
  deleteInstitution: (institutionId: string) => void;
  deleteUser: (userId: string) => void;
  addNotice: (input: Omit<Notice, 'id' | 'date'>) => void;
  deleteNotice: (noticeId: string) => void;
  addStudent: (input: StudentInput) => string | null;
  addTeacher: (input: TeacherInput) => string | null;
  saveMarks: (subject: string, rows: MarkRow[], status: Exclude<MarkStatus, 'approved'>) => void;
  approveMarks: (className: string, section: string, subject: string) => void;
  setTeaching: (userId: string, assignments: TeachingAssignment[]) => void;
}

const AppDataContext = createContext<AppDataValue | null>(null);

const today = () => new Date().toISOString().slice(0, 10);
const nowStamp = () => new Date().toLocaleString('sv-SE').slice(0, 16);
const makeId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(SEED_USERS);
  const [institutions, setInstitutions] = useState<Institution[]>(SEED_INSTITUTIONS);
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [marks, setMarks] = useState<MarkRecord[]>(SEED_MARKS);
  const [notices, setNotices] = useState<Notice[]>(SEED_NOTICES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(SEED_AUDIT_LOGS);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [academicYears, setAcademicYears] = useState<number[]>(ACADEMIC_YEARS);
  const [academicYear, setAcademicYear] = useState<number>(2026);

  const currentUser = useMemo(() => users.find((user) => user.id === currentUserId) ?? null, [users, currentUserId]);

  const log = useCallback((actor: string, action: string) => {
    setAuditLogs((prev) => [{ id: makeId('a'), at: nowStamp(), actor, action }, ...prev]);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const user = users.find((item) => item.email === normalized && item.password === password);
    if (!user) return 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।';
    if (user.institutionId) {
      const institution = institutions.find((item) => item.id === user.institutionId);
      if (institution?.status === 'pending') return 'প্রতিষ্ঠানটির নিবন্ধন এখনো অনুমোদিত হয়নি। অনুমোদনের পর লগইন করতে পারবেন।';
      if (institution?.status === 'suspended') return 'প্রতিষ্ঠানটির অ্যাকাউন্ট স্থগিত আছে। সুপার অ্যাডমিনের সঙ্গে যোগাযোগ করুন।';
    }
    setCurrentUserId(user.id);
    log(user.name, 'লগইন করেছেন');
    return null;
  }, [users, institutions, log]);

  const logout = useCallback(() => setCurrentUserId(null), []);

  const registerInstitution = useCallback((input: RegistrationInput) => {
    const email = input.email.trim().toLowerCase();
    if (users.some((user) => user.email === email)) return 'এই ইমেইল দিয়ে আগে থেকেই একটি অ্যাকাউন্ট আছে।';
    if (institutions.some((item) => item.eiin === input.eiin.trim())) return 'এই EIIN নম্বরটি ইতিমধ্যে নিবন্ধিত।';

    const institution: Institution = {
      id: makeId('inst'),
      name: input.name.trim(),
      eiin: input.eiin.trim(),
      type: input.type,
      address: input.address.trim(),
      principalName: input.principalName.trim(),
      phone: input.phone.trim(),
      status: 'pending',
    };
    const principal: AppUser = {
      id: makeId('u'),
      name: input.principalName.trim(),
      email,
      password: input.password,
      phone: input.phone.trim(),
      role: 'principal',
      institutionId: institution.id,
      studentId: null,
      childIds: [],
      teaching: [],
    };
    setInstitutions((prev) => [institution, ...prev]);
    setUsers((prev) => [...prev, principal]);
    log(principal.name, `${institution.name} প্রতিষ্ঠানের নিবন্ধনের আবেদন করেছেন`);
    return null;
  }, [users, institutions, log]);

  const setInstitutionStatus = useCallback((institutionId: string, status: InstitutionStatus) => {
    const target = institutions.find((item) => item.id === institutionId);
    setInstitutions((prev) => prev.map((item) => (item.id === institutionId ? { ...item, status } : item)));
    if (currentUser && target) log(currentUser.name, `${target.name} প্রতিষ্ঠানের অবস্থা "${status}" করেছেন`);
  }, [institutions, currentUser, log]);

  const deleteInstitution = useCallback((institutionId: string) => {
    const target = institutions.find((item) => item.id === institutionId);
    const studentIds = students.filter((item) => item.institutionId === institutionId).map((item) => item.id);
    setInstitutions((prev) => prev.filter((item) => item.id !== institutionId));
    setUsers((prev) => prev.filter((item) => item.institutionId !== institutionId));
    setStudents((prev) => prev.filter((item) => item.institutionId !== institutionId));
    setMarks((prev) => prev.filter((item) => !studentIds.includes(item.studentId)));
    setNotices((prev) => prev.filter((item) => item.institutionId !== institutionId));
    if (currentUser && target) log(currentUser.name, `${target.name} প্রতিষ্ঠান মুছে ফেলেছেন`);
  }, [institutions, students, currentUser, log]);

  const deleteUser = useCallback((userId: string) => {
    const target = users.find((item) => item.id === userId);
    setUsers((prev) => prev.filter((item) => item.id !== userId));
    if (currentUser && target) log(currentUser.name, `${target.name} ব্যবহারকারীকে মুছে ফেলেছেন`);
  }, [users, currentUser, log]);

  const addNotice = useCallback((input: Omit<Notice, 'id' | 'date'>) => {
    setNotices((prev) => [{ ...input, id: makeId('n'), date: today() }, ...prev]);
    if (currentUser) log(currentUser.name, `নোটিশ প্রকাশ করেছেন: ${input.title}`);
  }, [currentUser, log]);

  const deleteNotice = useCallback((noticeId: string) => {
    setNotices((prev) => prev.filter((item) => item.id !== noticeId));
  }, []);

  const addStudent = useCallback((input: StudentInput) => {
    if (!currentUser?.institutionId) return 'প্রতিষ্ঠান পাওয়া যায়নি।';
    const duplicate = students.some(
      (item) => item.institutionId === currentUser.institutionId && item.year === input.year && item.className === input.className && item.section === input.section && item.roll === input.roll,
    );
    if (duplicate) return 'এই শ্রেণি, শাখা ও রোলে ইতিমধ্যে একজন শিক্ষার্থী আছে।';
    const student: Student = { ...input, id: makeId('stu'), institutionId: currentUser.institutionId };
    setStudents((prev) => [...prev, student]);
    log(currentUser.name, `${input.name} শিক্ষার্থীকে ভর্তি করেছেন`);
    return null;
  }, [currentUser, students, log]);

  const addTeacher = useCallback((input: TeacherInput) => {
    if (!currentUser?.institutionId) return 'প্রতিষ্ঠান পাওয়া যায়নি।';
    const email = input.email.trim().toLowerCase();
    if (users.some((item) => item.email === email)) return 'এই ইমেইল দিয়ে আগে থেকেই একটি অ্যাকাউন্ট আছে।';
    const teacher: AppUser = {
      id: makeId('u'),
      name: input.name.trim(),
      email,
      password: input.password,
      phone: input.phone.trim(),
      role: 'teacher',
      institutionId: currentUser.institutionId,
      studentId: null,
      childIds: [],
      teaching: [],
    };
    setUsers((prev) => [...prev, teacher]);
    log(currentUser.name, `${teacher.name} শিক্ষকের অ্যাকাউন্ট তৈরি করেছেন`);
    return null;
  }, [currentUser, users, log]);

  const saveMarks = useCallback((subject: string, rows: MarkRow[], status: Exclude<MarkStatus, 'approved'>) => {
    setMarks((prev) => {
      const next = [...prev];
      rows.forEach((row) => {
        const index = next.findIndex((item) => item.studentId === row.studentId && item.subject === subject);
        if (index >= 0 && next[index].status === 'approved') return;
        const record: MarkRecord = { studentId: row.studentId, subject, cq: row.cq, mcq: row.mcq, pr: row.pr, status };
        if (index >= 0) next[index] = record;
        else next.push(record);
      });
      return next;
    });
    if (currentUser) log(currentUser.name, `${subject} বিষয়ের নম্বর ${status === 'draft' ? 'খসড়া সংরক্ষণ' : 'জমা'} করেছেন`);
  }, [currentUser, log]);

  const approveMarks = useCallback((className: string, section: string, subject: string) => {
    const classStudentIds = students
      .filter((item) => item.className === className && item.section === section)
      .map((item) => item.id);
    setMarks((prev) => prev.map((item) => (
      item.subject === subject && classStudentIds.includes(item.studentId) && item.status === 'submitted'
        ? { ...item, status: 'approved' }
        : item
    )));
    if (currentUser) log(currentUser.name, `${className} (${section}) এর ${subject} নম্বর অনুমোদন করেছেন`);
  }, [students, currentUser, log]);

  const addAcademicYear = useCallback((year: number) => {
    if (academicYears.includes(year)) return 'এই শিক্ষাবর্ষ আগে থেকেই আছে।';
    setAcademicYears((prev) => [...prev, year].sort((a, b) => a - b));
    if (currentUser) log(currentUser.name, `${year} শিক্ষাবর্ষ যুক্ত করেছেন`);
    return null;
  }, [academicYears, currentUser, log]);

  const deleteAcademicYear = useCallback((year: number) => {
    if (students.some((item) => item.year === year)) return 'এই শিক্ষাবর্ষে শিক্ষার্থী আছে, তাই মুছে ফেলা যাবে না।';
    const remaining = academicYears.filter((item) => item !== year);
    setAcademicYears(remaining);
    if (academicYear === year && remaining.length > 0) setAcademicYear(remaining[0]);
    if (currentUser) log(currentUser.name, `${year} শিক্ষাবর্ষ মুছে ফেলেছেন`);
    return null;
  }, [academicYears, academicYear, students, currentUser, log]);

  const setTeaching = useCallback((userId: string, assignments: TeachingAssignment[]) => {
    const target = users.find((item) => item.id === userId);
    setUsers((prev) => prev.map((item) => (item.id === userId ? { ...item, teaching: assignments } : item)));
    if (currentUser && target) log(currentUser.name, `${target.name} শিক্ষকের বিষয় বণ্টন হালনাগাদ করেছেন`);
  }, [users, currentUser, log]);

  const value: AppDataValue = {
    currentUser,
    users,
    institutions,
    students,
    marks,
    notices,
    auditLogs,
    academicYear,
    academicYears,
    setAcademicYear,
    addAcademicYear,
    deleteAcademicYear,
    login,
    logout,
    registerInstitution,
    setInstitutionStatus,
    deleteInstitution,
    deleteUser,
    addNotice,
    deleteNotice,
    addStudent,
    addTeacher,
    saveMarks,
    approveMarks,
    setTeaching,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) throw new Error('useAppData must be used inside AppDataProvider');
  return context;
}
