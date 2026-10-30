import { CalendarDays } from 'lucide-react';
import { useAppData } from '@/context/AppDataContext';

export function AcademicYearSelect() {
  const { academicYear, academicYears, setAcademicYear } = useAppData();

  return (
    <label className="flex items-center gap-2 text-xs font-semibold text-stone-500">
      <CalendarDays size={16} className="shrink-0 text-orange-600" />
      <span className="sr-only">শিক্ষাবর্ষ</span>
      <select
        value={academicYear}
        onChange={(event) => setAcademicYear(Number(event.target.value))}
        className="h-9 w-full cursor-pointer rounded-lg border border-stone-300 bg-white px-2 text-sm font-semibold text-stone-900 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
      >
        {academicYears.map((year) => (
          <option key={year} value={year}>
            শিক্ষাবর্ষ {year.toLocaleString('bn-BD').replace(/,/g, '')}
          </option>
        ))}
      </select>
    </label>
  );
}
