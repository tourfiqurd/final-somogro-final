import {
  Award,
  Bell,
  BookOpen,
  Building2,
  ClipboardList,
  FileCheck2,
  FileText,
  GraduationCap,
  Layers,
  LayoutDashboard,
  PenLine,
  ScrollText,
  Settings,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/data/demo';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

export const DASHBOARD_SLUG: Record<Role, string> = {
  super_admin: 'admin',
  principal: 'principal',
  teacher: 'teacher',
  student: 'student',
  parent: 'parent',
};

export const dashboardPath = (role: Role) => `/dashboard/${DASHBOARD_SLUG[role]}`;

export const sectionPath = (role: Role, item: NavItem) => (item.path ? `${dashboardPath(role)}/${item.path}` : dashboardPath(role));

export const NAVIGATION: Record<Role, NavItem[]> = {
  super_admin: [
    { id: 'overview', label: 'এডমিন ড্যাশবোর্ড', icon: LayoutDashboard, path: '' },
    { id: 'institutions', label: 'প্রতিষ্ঠান নিয়ন্ত্রণ', icon: Building2, path: 'institutions' },
    { id: 'users', label: 'ইউজার ও পাসওয়ার্ড', icon: Users, path: 'users' },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell, path: 'notices' },
    { id: 'audit', label: 'অডিট ও নিরাপত্তা লগ', icon: ShieldCheck, path: 'audit' },
  ],
  principal: [
    { id: 'overview', label: 'স্কুল কন্ট্রোল', icon: LayoutDashboard, path: '' },
    { id: 'classes', label: 'শ্রেণি, শাখা ও বিষয়', icon: Layers, path: 'classes' },
    { id: 'students', label: 'শিক্ষার্থী ব্যবস্থাপনা', icon: GraduationCap, path: 'studentmanagement' },
    { id: 'teachers', label: 'শিক্ষক ও বিষয় বণ্টন', icon: Users, path: 'teachers' },
    { id: 'exams', label: 'পরীক্ষা ও নম্বর বিভাজন', icon: FileText, path: 'exams' },
    { id: 'approval', label: 'ফলাফল অনুমোদন ও প্রকাশ', icon: FileCheck2, path: 'approval' },
    { id: 'results', label: 'টেবুলেশন ও মার্কশিট', icon: ClipboardList, path: 'results' },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell, path: 'notices' },
    { id: 'audit', label: 'অডিট লগ', icon: ScrollText, path: 'audit' },
    { id: 'settings', label: 'প্রতিষ্ঠান সেটিংস', icon: Settings, path: 'settings' },
  ],
  teacher: [
    { id: 'overview', label: 'ক্লাস ও শাখা', icon: BookOpen, path: '' },
    { id: 'marks', label: 'নম্বর এন্ট্রি', icon: PenLine, path: 'marks' },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell, path: 'notices' },
  ],
  student: [
    { id: 'overview', label: 'শিক্ষার্থী ড্যাশবোর্ড', icon: LayoutDashboard, path: '' },
    { id: 'results', label: 'আমার ফলাফল ও মার্কশিট', icon: Award, path: 'results' },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell, path: 'notices' },
  ],
  parent: [
    { id: 'overview', label: 'সন্তানের প্রোফাইল', icon: ClipboardList, path: '' },
    { id: 'results', label: 'সন্তানদের ফলাফল', icon: Award, path: 'results' },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell, path: 'notices' },
  ],
};
