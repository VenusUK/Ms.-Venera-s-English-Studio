import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  BookOpen,
  Send,
  HelpCircle,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  Flame,
  Award,
  BellRing
} from 'lucide-react';
import { Student, DailyAssignment, StudentDailyRecord, ReadingText, GrammarTopic } from '../types';

interface DailyTrackerProps {
  students: Student[];
  assignments: DailyAssignment[];
  records: StudentDailyRecord[];
  texts: ReadingText[];
  grammarTopics: GrammarTopic[];
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onOpenGrading: (recordId: string) => void;
  onSelectStudent: (student: Student) => void;
  onOpenText: (textId: string) => void;
  onOpenGrammar: (topicId: string) => void;
  onUpdateAssignment: (assignment: DailyAssignment) => void;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({
  students,
  assignments,
  records,
  texts,
  grammarTopics,
  selectedDate,
  setSelectedDate,
  onOpenGrading,
  onSelectStudent,
  onOpenText,
  onOpenGrammar,
  onUpdateAssignment
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress' | 'not_started' | 'needs_grading'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reminderToast, setReminderToast] = useState<string | null>(null);
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);

  // Find assignment for current selected date
  const currentAssignment = assignments.find(a => a.date === selectedDate) || assignments[0];
  const assignedText = texts.find(t => t.id === currentAssignment?.textId) || texts[0];
  const assignedGrammar = grammarTopics.find(g => g.id === currentAssignment?.grammarTopicId) || grammarTopics[0];

  // Records for this date
  const dateRecords = records.filter(r => r.date === selectedDate);

  // Compute status for each student
  const studentRows = students.map(student => {
    const record = dateRecords.find(r => r.studentId === student.id);
    const completedTasks = record?.completedTasks || [];
    const hasReading = !!record?.readingCompleted;
    const vocabScore = record?.vocabScore;
    const compScore = record?.comprehensionScore;
    const grammarScore = record?.grammarScore;
    const response = record?.readingResponse;

    const totalRequired = currentAssignment?.requiredTasks?.length || 5;
    const completedCount = completedTasks.length;

    let status: 'completed' | 'in_progress' | 'not_started' | 'needs_grading' = 'not_started';
    if (response && response.teacherGrade === undefined) {
      status = 'needs_grading';
    } else if (completedCount >= totalRequired) {
      status = 'completed';
    } else if (completedCount > 0) {
      status = 'in_progress';
    }

    return {
      student,
      record,
      hasReading,
      vocabScore,
      compScore,
      grammarScore,
      response,
      completedCount,
      totalRequired,
      status,
      lastActive: record?.lastActiveTime
    };
  });

  // Filtered rows
  const filteredRows = studentRows.filter(row => {
    const matchesSearch = row.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          row.student.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'completed') return row.status === 'completed';
    if (filterStatus === 'in_progress') return row.status === 'in_progress';
    if (filterStatus === 'not_started') return row.status === 'not_started';
    if (filterStatus === 'needs_grading') return row.status === 'needs_grading';
    return true;
  });

  // Summary counts
  const totalCount = studentRows.length;
  const completedCount = studentRows.filter(r => r.status === 'completed').length;
  const inProgressCount = studentRows.filter(r => r.status === 'in_progress').length;
  const notStartedCount = studentRows.filter(r => r.status === 'not_started').length;
  const needsGradingCount = studentRows.filter(r => r.status === 'needs_grading').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleSendReminder = (studentName: string) => {
    setReminderToast(`Daily reminder notification sent to ${studentName}! 📩`);
    setTimeout(() => setReminderToast(null), 3500);
  };

  const handleSendAllMissingReminder = () => {
    setReminderToast(`Daily nudge sent to all ${notStartedCount} students who haven't started yet! 🔔`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {reminderToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-amber-500/50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
          <BellRing className="w-5 h-5 text-amber-400 animate-bounce" />
          <span className="text-sm font-medium">{reminderToast}</span>
        </div>
      )}

      {/* Header & Date Selector Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Daily Assignment Tracker</h1>
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">
              Live Classroom Monitor
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track which students completed today&#39;s reading, quizzes, responses, and grammar exercises.
          </p>
        </div>

        {/* Date Selector buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setSelectedDate('2026-10-03')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDate === '2026-10-03'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today (Oct 3)
            </button>
            <button
              onClick={() => setSelectedDate('2026-10-02')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDate === '2026-10-02'
                  ? 'bg-white text-slate-900 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yesterday (Oct 2)
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer text-xs"
            />
          </div>
        </div>
      </div>

      {/* Today's Assigned Curriculum Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
                Assigned for {selectedDate}
              </span>
              <h2 className="text-lg font-bold text-white">{currentAssignment?.title || 'Daily English Assignment'}</h2>
            </div>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              {currentAssignment?.description}
            </p>

            {/* Quick linked units */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {assignedText && (
                <button
                  onClick={() => onOpenText(assignedText.id)}
                  className="flex items-center gap-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-emerald-300 hover:text-emerald-200 border border-emerald-500/30 px-3 py-1 rounded-lg transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Reading: <strong>{assignedText.title}</strong></span>
                  <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
                </button>
              )}

              {assignedGrammar && (
                <button
                  onClick={() => onOpenGrammar(assignedGrammar.id)}
                  className="flex items-center gap-1.5 text-xs bg-slate-800/80 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 px-3 py-1 rounded-lg transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Grammar: <strong>{assignedGrammar.title}</strong></span>
                  <ExternalLink className="w-3 h-3 text-slate-400 ml-1" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={() => setIsEditingAssignment(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white transition-all shadow text-center"
            >
              Configure Daily Assignment
            </button>
            {notStartedCount > 0 && (
              <button
                onClick={handleSendAllMissingReminder}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow flex items-center justify-center gap-1.5"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Nudge Incomplete ({notStartedCount})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Roster Total</span>
            <span className="text-slate-400 text-xs">👥</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900">{totalCount}</div>
          <span className="text-[11px] text-slate-500">Enrolled students</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm bg-gradient-to-br from-white to-emerald-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800">Done Today</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{completedCount}</div>
          <span className="text-[11px] text-emerald-600 font-medium">{completionRate}% of class</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800">In Progress</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700">{inProgressCount}</div>
          <span className="text-[11px] text-amber-600">Started some tasks</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Not Started</span>
            <AlertCircle className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-700">{notStartedCount}</div>
          <span className="text-[11px] text-slate-400">Needs daily nudge</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm bg-gradient-to-br from-white to-rose-50/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-800">Needs Grading</span>
            <Award className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-rose-700">{needsGradingCount}</div>
          <span className="text-[11px] text-rose-600 font-medium">Pending teacher review</span>
        </div>
      </div>

      {/* Student List Matrix & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({studentRows.length})
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'in_progress'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setFilterStatus('not_started')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'not_started'
                  ? 'bg-slate-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Not Started ({notStartedCount})
            </button>
            {needsGradingCount > 0 && (
              <button
                onClick={() => setFilterStatus('needs_grading')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === 'needs_grading'
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-rose-300 text-rose-700 hover:bg-rose-50'
                }`}
              >
                Needs Grading ({needsGradingCount})
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student by name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-2 text-center">Streak</th>
                <th className="py-3 px-3 text-center">📖 Reading</th>
                <th className="py-3 px-3 text-center">💡 Vocab Check</th>
                <th className="py-3 px-3 text-center">🎯 Comprehension</th>
                <th className="py-3 px-3 text-center">✍️ Reading Response</th>
                <th className="py-3 px-3 text-center">⚡ Grammar</th>
                <th className="py-3 px-4 text-center">Daily Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map(({ student, record, hasReading, vocabScore, compScore, grammarScore, response, completedCount, totalRequired, status }) => (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Student Info */}
                  <td className="py-3 px-4">
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => onSelectStudent(student)}
                    >
                      <div className={`w-8 h-8 rounded-full ${student.avatarColor} text-white font-bold flex items-center justify-center text-xs shadow-sm`}>
                        {student.avatarSeed}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                          <span>{student.name}</span>
                          <ChevronRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="text-[11px] font-bold text-indigo-600">IE</div>
                      </div>
                    </div>
                  </td>

                  {/* Streak */}
                  <td className="py-3 px-2 text-center">
                    <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold text-[11px]">
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {student.streakDays}d
                    </span>
                  </td>

                  {/* Reading Status */}
                  <td className="py-3 px-3 text-center">
                    {hasReading ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> Read
                      </span>
                    ) : (
                      <span className="text-slate-300 font-light">—</span>
                    )}
                  </td>

                  {/* Vocab Check */}
                  <td className="py-3 px-3 text-center">
                    {vocabScore ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold text-[11px] ${
                        vocabScore.score >= vocabScore.maxScore * 0.8
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {vocabScore.score}/{vocabScore.maxScore}
                      </span>
                    ) : (
                      <span className="text-slate-300 font-light">—</span>
                    )}
                  </td>

                  {/* Comprehension Quiz */}
                  <td className="py-3 px-3 text-center">
                    {compScore ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold text-[11px] ${
                        compScore.score >= compScore.maxScore * 0.8
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {compScore.score}/{compScore.maxScore}
                      </span>
                    ) : (
                      <span className="text-slate-300 font-light">—</span>
                    )}
                  </td>

                  {/* Reading Response */}
                  <td className="py-3 px-3 text-center">
                    {response ? (
                      response.teacherGrade !== undefined ? (
                        <button
                          onClick={() => record && onOpenGrading(record.id)}
                          className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-semibold text-[11px] hover:bg-amber-100 transition-colors"
                          title="Click to view feedback & rubric"
                        >
                          <Award className="w-3 h-3 text-amber-600" />
                          <span>{response.teacherGrade}/10</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => record && onOpenGrading(record.id)}
                          className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold text-[11px] animate-pulse hover:bg-rose-100 transition-colors"
                          title="Click to grade this journal entry"
                        >
                          Needs Grade 📝
                        </button>
                      )
                    ) : (
                      <span className="text-slate-300 font-light">—</span>
                    )}
                  </td>

                  {/* Grammar */}
                  <td className="py-3 px-3 text-center">
                    {grammarScore ? (
                      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {grammarScore.score}/{grammarScore.maxScore} ({grammarScore.mode === 'test' ? 'Test' : 'Review'})
                      </span>
                    ) : (
                      <span className="text-slate-300 font-light">—</span>
                    )}
                  </td>

                  {/* Overall Daily Status Badge */}
                  <td className="py-3 px-4 text-center">
                    {status === 'completed' && (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-2.5 py-1 rounded-full font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Done ({completedCount}/{totalRequired})
                      </span>
                    )}
                    {status === 'needs_grading' && (
                      <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-100/80 border border-rose-300 px-2.5 py-1 rounded-full font-bold text-[11px]">
                        Needs Grade ({completedCount}/{totalRequired})
                      </span>
                    )}
                    {status === 'in_progress' && (
                      <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100/80 border border-amber-300 px-2.5 py-1 rounded-full font-semibold text-[11px]">
                        In Progress ({completedCount}/{totalRequired})
                      </span>
                    )}
                    {status === 'not_started' && (
                      <span className="inline-flex items-center gap-1 text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full font-medium text-[11px]">
                        Not Started (0/{totalRequired})
                      </span>
                    )}
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {status === 'not_started' && (
                        <button
                          onClick={() => handleSendReminder(student.name)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-200"
                          title={`Send reminder to ${student.name}`}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {record && response && response.teacherGrade === undefined && (
                        <button
                          onClick={() => onOpenGrading(record.id)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors"
                        >
                          Grade
                        </button>
                      )}
                      <button
                        onClick={() => onSelectStudent(student)}
                        className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
                      >
                        Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRows.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No students match your filter or search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Configure / Edit Daily Assignment */}
      {isEditingAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Configure Daily Assignment</h3>
                <p className="text-xs text-slate-500">Set the reading text & grammar topic for {selectedDate}</p>
              </div>
              <button
                onClick={() => setIsEditingAssignment(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                const textId = (form.elements.namedItem('textId') as HTMLSelectElement).value;
                const grammarTopicId = (form.elements.namedItem('grammarTopicId') as HTMLSelectElement).value;
                const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value;

                onUpdateAssignment({
                  id: currentAssignment?.id || `assign-${Date.now()}`,
                  date: selectedDate,
                  title,
                  description,
                  textId,
                  grammarTopicId,
                  requiredTasks: ['reading', 'vocab', 'comprehension', 'response', 'grammar'],
                  dueDate: `${selectedDate}T23:59:00`
                });

                setIsEditingAssignment(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assignment Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={currentAssignment?.title || 'Daily English Assignment'}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Reading Text for Class</label>
                <select
                  name="textId"
                  defaultValue={currentAssignment?.textId || texts[0]?.id}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {texts.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.genre} • {t.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Grammar Topic for Review/Test</label>
                <select
                  name="grammarTopicId"
                  defaultValue={currentAssignment?.grammarTopicId || grammarTopics[0]?.id}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {grammarTopics.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.title} ({g.category} • {g.level})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Instructions for Students</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={currentAssignment?.description || 'Read the text carefully, complete the vocabulary check and comprehension quiz, submit your reading response journal, and review the grammar rules.'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingAssignment(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow"
                >
                  Save & Assign to Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
