import type { ReactNode } from 'react';
import type { AppUser } from '@/data/demo';
import { AdminOverview, AuditSection, InstitutionsSection, UsersSection } from '@/components/dashboard/admin/AdminSections';
import { ApprovalSection } from '@/components/dashboard/principal/ApprovalSection';
import { ClassesSection } from '@/components/dashboard/principal/ClassesSection';
import { ExamsSection } from '@/components/dashboard/principal/ExamsSection';
import { PrincipalAuditSection } from '@/components/dashboard/principal/PrincipalAuditSection';
import { SettingsSection } from '@/components/dashboard/principal/SettingsSection';
import { PrincipalOverview, StudentsSection } from '@/components/dashboard/principal/PrincipalSections';
import { TabulationSection } from '@/components/dashboard/principal/TabulationSection';
import { TeachersSection } from '@/components/dashboard/principal/TeachersSection';
import { NoticesSection } from '@/components/dashboard/shared/NoticesSection';
import { MarksEntrySection, TeacherOverview } from '@/components/dashboard/teacher/TeacherSections';
import { ParentOverview, ResultsSection, StudentOverview } from '@/components/dashboard/student/StudentSections';

const SCHOOL_AUDIENCES = ['সকল প্রতিষ্ঠান', 'শিক্ষক', 'শিক্ষার্থী ও অভিভাবক'];
const INSTITUTION_AUDIENCES = ['সকল', 'শিক্ষক', 'শিক্ষার্থী ও অভিভাবক'];

export function renderSection(user: AppUser, sectionId: string): ReactNode {
  if (sectionId === 'notices') {
    const isAdmin = user.role === 'super_admin';
    return (
      <NoticesSection
        user={user}
        audienceOptions={isAdmin ? SCHOOL_AUDIENCES : INSTITUTION_AUDIENCES}
        canPublish={isAdmin || user.role === 'principal'}
      />
    );
  }

  switch (user.role) {
    case 'super_admin':
      if (sectionId === 'institutions') return <InstitutionsSection />;
      if (sectionId === 'users') return <UsersSection currentUser={user} />;
      if (sectionId === 'audit') return <AuditSection />;
      return <AdminOverview />;
    case 'principal':
      if (sectionId === 'classes') return <ClassesSection user={user} />;
      if (sectionId === 'students') return <StudentsSection user={user} />;
      if (sectionId === 'teachers') return <TeachersSection user={user} />;
      if (sectionId === 'exams') return <ExamsSection user={user} />;
      if (sectionId === 'approval') return <ApprovalSection user={user} />;
      if (sectionId === 'results') return <TabulationSection user={user} />;
      if (sectionId === 'audit') return <PrincipalAuditSection user={user} />;
      if (sectionId === 'settings') return <SettingsSection user={user} />;
      return <PrincipalOverview user={user} />;
    case 'teacher':
      if (sectionId === 'marks') return <MarksEntrySection user={user} />;
      return <TeacherOverview user={user} />;
    case 'student':
      if (sectionId === 'results') return <ResultsSection user={user} />;
      return <StudentOverview user={user} />;
    case 'parent':
      if (sectionId === 'results') return <ResultsSection user={user} />;
      return <ParentOverview user={user} />;
  }
}
