import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Flame,
  Award,
  BookOpen,
  Sparkles,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Calendar,
  MessageSquare,
  TrendingUp,
  X
} from 'lucide-react';
import { Student, StudentDailyRecord, ReadingText, GrammarTopic } from '../types';

interface StudentRosterProps {
  students: Student[];
  records: StudentDailyRecord[];
  texts: ReadingText[];
  grammarTopics: GrammarTopic[];
  onAddStudent: (student: Omit<Student, 'id' | 'joinedDate' | 'streakDays'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (studentId: string) => void;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  onOpenGrading: (recordId: string) => void;
}

export const StudentRoster: React.FC<StudentRosterProps> = ({
  students,
  records,
  texts,
  grammarTopics,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  selectedStudent,
  setSelectedStudent,
  onOpenGrading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Filter students
  const filteredStudents = students.filter(s => {
    return s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           s.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Classroom Student Roster</h1>
            <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-indigo-200">
              {students.length} Enrolled
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your IE students, track daily practice streaks, learning goals, and assignment history.
          </p>
        </div>

        <button
          onClick={() => setIsAddingStudent(true)}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Student Group:</span>
          <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-3 py-1 rounded-lg text-xs">
            IE Students Only ({students.length})
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name or email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Roster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStudents.map(student => {
          const studentRecords = records.filter(r => r.studentId === student.id);
          const completedDaysCount = studentRecords.filter(r => (r.completedTasks?.length || 0) >= 3).length;
          const responses = studentRecords.filter(r => r.readingResponse);
          const gradedResponses = responses.filter(r => r.readingResponse?.teacherGrade !== undefined);
          const avgGrade = gradedResponses.length > 0
            ? Math.round((gradedResponses.reduce((sum, r) => sum + (r.readingResponse?.teacherGrade || 0), 0) / gradedResponses.length) * 10) / 10
            : null;

          return (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header with Avatar & Streak */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl ${student.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow-sm`}>
                      {student.avatarSeed}
                    </div>
                    <div>
                      <h3
                        onClick={() => setSelectedStudent(student)}
                        className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors cursor-pointer text-sm"
                      >
                        {student.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">{student.email}</p>
                    </div>
                  </div>

                  <span
                    className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold"
                    title={student.streakDays > 0 ? `${student.streakDays} day practice streak` : 'Streak starts as soon as practice begins'}
                  >
                    <Flame className={`w-3.5 h-3.5 ${student.streakDays > 0 ? 'fill-amber-500 text-amber-500 animate-pulse' : 'text-slate-300'}`} />
                    <span>{student.streakDays > 0 ? `${student.streakDays}d` : '0d'}</span>
                  </span>
                </div>

                {/* Program Badge: IE only */}
                <div className="mt-3">
                  <span className="inline-block bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-indigo-200">
                    IE
                  </span>
                </div>

                {/* Learning Goal */}
                <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Focus Goal:</span>
                  <p className="text-xs text-slate-700 leading-snug line-clamp-2">
                    {student.learningGoal || 'Consistent daily practice'}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100 text-center">
                  <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-emerald-800 font-medium block">Completed Days</span>
                    <span className="text-sm font-bold text-emerald-700">{completedDaysCount}</span>
                  </div>

                  <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                    <span className="text-[10px] text-amber-800 font-medium block">Avg Journal</span>
                    <span className="text-sm font-bold text-amber-700">
                      {avgGrade ? `${avgGrade}/10` : '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 hover:underline"
                >
                  <span>View Full Profile</span>
                  <span className="text-[10px]">→</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingStudent(student)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit student information"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${student.name} from class roster?`)) {
                        onDeleteStudent(student.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove from roster"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add New Student */}
      {isAddingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Add New Student</h3>
                <p className="text-xs text-slate-500">Enroll an English language learner into Ms. Venera&#39;s classroom</p>
              </div>
              <button
                onClick={() => setIsAddingStudent(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                const gradeLevel = (form.elements.namedItem('gradeLevel') as HTMLInputElement).value;
                const learningGoal = (form.elements.namedItem('learningGoal') as HTMLInputElement).value;
                const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;

                onAddStudent({
                  name,
                  email,
                  gradeLevel,
                  learningGoal,
                  notes,
                  status: 'active',
                  avatarColor: 'bg-emerald-600',
                  avatarSeed: name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                });

                setIsAddingStudent(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Student Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Jasurbek Nematov"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email / Student ID</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. jasur.n@school.edu"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Student Status</label>
                <div className="w-full p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-800 font-bold text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span>IE (Intensive English)</span>
                </div>
                <input type="hidden" name="gradeLevel" value="IE" />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Learning Goal</label>
                <input
                  type="text"
                  name="learningGoal"
                  placeholder="e.g. Master past narrative tenses and expand vocabulary"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teacher Notes (Private for Ms. Venera)</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="e.g. Very motivated; needs encouragement with pronunciation."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingStudent(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow"
                >
                  Add Student to Roster
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Student */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Edit Student Profile</h3>
                <p className="text-xs text-slate-500">{editingStudent.name}</p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                const gradeLevel = (form.elements.namedItem('gradeLevel') as HTMLInputElement).value;
                const streakDays = parseInt((form.elements.namedItem('streakDays') as HTMLInputElement).value) || 0;
                const learningGoal = (form.elements.namedItem('learningGoal') as HTMLInputElement).value;
                const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;

                onUpdateStudent({
                  ...editingStudent,
                  name,
                  email,
                  gradeLevel,
                  streakDays,
                  learningGoal,
                  notes
                });

                setEditingStudent(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Student Full Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingStudent.name}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Email / Student ID</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingStudent.email}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Status</label>
                  <div className="w-full p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/70 text-indigo-800 font-bold text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span>IE</span>
                  </div>
                  <input type="hidden" name="gradeLevel" value="IE" />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Daily Streak (Days)</label>
                  <input
                    type="number"
                    name="streakDays"
                    min="0"
                    defaultValue={editingStudent.streakDays}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Learning Focus Goal</label>
                <input
                  type="text"
                  name="learningGoal"
                  defaultValue={editingStudent.learningGoal}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ms. Venera&#39;s Private Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingStudent.notes}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer / Modal: Student Deep-Dive Profile */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl ${selectedStudent.avatarColor} text-white font-bold flex items-center justify-center text-xl shadow`}>
                  {selectedStudent.avatarSeed}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{selectedStudent.name}</h2>
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {selectedStudent.streakDays} Day Streak
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedStudent.email} • <span className="inline-block bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded text-[10px]">IE</span></p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Focus Goal & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">🎯 Learning Focus Goal</span>
                <p className="text-slate-600 leading-relaxed">{selectedStudent.learningGoal || 'Consistent daily English practice.'}</p>
              </div>

              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">📝 Ms. Venera&#39;s Observations</span>
                <p className="text-amber-800 leading-relaxed">{selectedStudent.notes || 'No teacher notes entered yet.'}</p>
              </div>
            </div>

            {/* Historical Daily Assignment Records */}
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-2.5 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Daily Assignment Log & Submissions</span>
              </h3>

              <div className="space-y-3">
                {records
                  .filter(r => r.studentId === selectedStudent.id)
                  .map(rec => {
                    const resp = rec.readingResponse;
                    return (
                      <div key={rec.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{rec.date}</span>
                            <span className="text-[11px] text-slate-500">
                              ({rec.completedTasks.length} tasks completed)
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {rec.vocabScore && (
                              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                                Vocab: {rec.vocabScore.score}/{rec.vocabScore.maxScore}
                              </span>
                            )}
                            {rec.comprehensionScore && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                                Comp: {rec.comprehensionScore.score}/{rec.comprehensionScore.maxScore}
                              </span>
                            )}
                            {rec.grammarScore && (
                              <span className="bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                                Grammar: {rec.grammarScore.score}/{rec.grammarScore.maxScore}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Reading Response preview */}
                        {resp && (
                          <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-800 flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                                <span>Reading Response Journal</span>
                              </span>

                              {resp.teacherGrade !== undefined ? (
                                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[11px]">
                                  Grade: {resp.teacherGrade}/10 ⭐
                                </span>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedStudent(null);
                                    onOpenGrading(rec.id);
                                  }}
                                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-2.5 py-0.5 rounded text-[11px] transition-colors"
                                >
                                  Grade Now ✍️
                                </button>
                              )}
                            </div>

                            <p className="text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-100 text-[11px] leading-relaxed">
                              &ldquo;{resp.text}&rdquo;
                            </p>

                            {resp.teacherFeedback && (
                              <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                                <strong>Ms. Venera&#39;s Feedback:</strong> {resp.teacherFeedback}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                {records.filter(r => r.studentId === selectedStudent.id).length === 0 && (
                  <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl">
                    No daily records yet for this student.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
