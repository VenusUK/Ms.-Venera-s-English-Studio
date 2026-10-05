import React from 'react';
import {
  BookOpen,
  CalendarCheck2,
  Users,
  Sparkles,
  GraduationCap,
  RotateCcw,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { RoleMode, Student } from '../types';

interface NavbarProps {
  activeTab: 'daily-tracker' | 'roster' | 'reading-texts' | 'grammar' | 'submissions';
  setActiveTab: (tab: 'daily-tracker' | 'roster' | 'reading-texts' | 'grammar' | 'submissions') => void;
  roleMode: RoleMode;
  setRoleMode: (mode: RoleMode) => void;
  students: Student[];
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  onResetData: () => void;
  pendingReviewsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  roleMode,
  setRoleMode,
  students,
  activeStudentId,
  setActiveStudentId,
  onResetData,
  pendingReviewsCount
}) => {
  const activeStudent = students.find(s => s.id === activeStudentId) || students[0];

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 border-b border-slate-800 shadow-md">
      {/* Top Banner & Profile Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">
                  Ms. Venera&#39;s English Studio
                </span>
                <span className="hidden sm:inline-block text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-medium">
                  Classroom Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Reading Texts • Comprehension • Vocabulary • Grammar & Daily Tracking
              </p>
            </div>
          </div>

          {/* Right Controls: Role Mode Toggle, Student Selector, Reset */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center border border-slate-700">
              <button
                onClick={() => setRoleMode('teacher')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  roleMode === 'teacher'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Teacher management dashboard"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Ms. Venera (Teacher)</span>
              </button>
              <button
                onClick={() => setRoleMode('student')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  roleMode === 'student'
                    ? 'bg-emerald-500 text-white shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Preview student interface and take assignments"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Student View</span>
              </button>
            </div>

            {/* If in student view, allow choosing which student */}
            {roleMode === 'student' && (
              <div className="relative flex items-center bg-slate-800 border border-emerald-500/50 rounded-lg px-2.5 py-1 text-xs text-white">
                <span className="text-slate-400 mr-2 text-xs">As:</span>
                <select
                  value={activeStudentId}
                  onChange={e => setActiveStudentId(e.target.value)}
                  className="bg-transparent text-emerald-300 font-medium focus:outline-none cursor-pointer pr-4"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                      {s.name} ({s.streakDays}d 🔥)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-400 pointer-events-none absolute right-2" />
              </div>
            )}

            {/* Reset Demo Data button */}
            <button
              onClick={onResetData}
              title="Reset data to initial sample lessons & students"
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation for Teacher Mode */}
        {roleMode === 'teacher' && (
          <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-800/80 py-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('daily-tracker')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'daily-tracker'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CalendarCheck2 className="w-4 h-4" />
              <span>Daily Assignment Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'roster'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Student Roster ({students.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reading-texts')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'reading-texts'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Classroom Reading Texts</span>
            </button>

            <button
              onClick={() => setActiveTab('grammar')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === 'grammar'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Grammar Hub (Review & Test)</span>
            </button>

            <button
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all relative ${
                activeTab === 'submissions'
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Grading Desk</span>
              {pendingReviewsCount > 0 && (
                <span className="bg-rose-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingReviewsCount}
                </span>
              )}
            </button>
          </nav>
        )}

        {/* Student View Banner info */}
        {roleMode === 'student' && (
          <div className="py-2.5 flex items-center justify-between text-xs text-slate-300 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                Logged in as student: <strong className="text-emerald-300 font-semibold">{activeStudent.name}</strong> ({activeStudent.gradeLevel})
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-medium">
                Streak: {activeStudent.streakDays} Days 🔥
              </span>
              <span className="text-slate-400">
                Today&#39;s Date: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
