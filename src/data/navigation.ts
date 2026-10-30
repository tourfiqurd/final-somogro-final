import {
  Award,
  Bell,
  BookOpen,
  Building2,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Home,
  LayoutDashboard,
  PenLine,
  ShieldCheck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/data/demo';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
}

const HOME_ITEM: NavItem = { id: 'home', label: 'ওয়েবসাইট হোমপেজ', icon: Home, href: '#home' };

export const NAVIGATION: Record<Role, NavItem[]> = {
  super_admin: [
    HOME_ITEM,
    { id: 'overview', label: 'এডমিন ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'institutions', label: 'প্রতিষ্ঠান নিয়ন্ত্রণ', icon: Building2 },
    { id: 'users', label: 'ইউজার ও পাসওয়ার্ড', icon: Users },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell },
    { id: 'audit', label: 'অডিট ও নিরাপত্তা লগ', icon: ShieldCheck },
  ],
  principal: [
    HOME_ITEM,
    { id: 'overview', label: 'স্কুল কন্ট্রোল', icon: LayoutDashboard },
    { id: 'students', label: 'শিক্ষার্থী ব্যবস্থাপনা', icon: GraduationCap },
    { id: 'teachers', label: 'শিক্ষক ও বিষয় বণ্টন', icon: Users },
    { id: 'approval', label: 'ফলাফল অনুমোদন ও প্রকাশ', icon: FileCheck2 },
    { id: 'results', label: 'টেবুলেশন ও মার্কশিট', icon: ClipboardList },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell },
  ],
  teacher: [
    HOME_ITEM,
    { id: 'overview', label: 'ক্লাস ও শাখা', icon: BookOpen },
    { id: 'marks', label: 'নম্বর এন্ট্রি', icon: PenLine },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell },
  ],
  student: [
    HOME_ITEM,
    { id: 'overview', label: 'শিক্ষার্থী ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'results', label: 'আমার ফলাফল ও মার্কশিট', icon: Award },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell },
  ],
  parent: [
    HOME_ITEM,
    { id: 'overview', label: 'সন্তানের প্রোফাইল', icon: ClipboardList },
    { id: 'results', label: 'সন্তানদের ফলাফল', icon: Award },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell },
  ],
};
