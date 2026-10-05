import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  Star,
  Send,
  Filter,
  Search,
  MessageSquare,
  Sparkles,
  Calendar,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, StudentDailyRecord, ReadingText } from '../types';

interface SubmissionsReviewProps {
  records: StudentDailyRecord[];
  students: Student[];
  texts: ReadingText[];
  onGradeResponse: (
    recordId: string,
    grade: number,
    feedback: string,
    rubricRatings?: { content: number; vocabulary: number; grammar: number; effort: number }
  ) => void;
  selectedRecordIdForGrading: string | null;
  setSelectedRecordIdForGrading: (id: string | null) => void;
}

export const SubmissionsReview: React.FC<SubmissionsReviewProps> = ({
  records,
  students,
  texts,
  onGradeResponse,
  selectedRecordIdForGrading,
  setSelectedRecordIdForGrading
}) => {
  const [filterType, setFilterType] = useState<'pending' | 'graded' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Grading form state
  const activeRecord = records.find(r => r.id === selectedRecordIdForGrading);
  const activeStudent = students.find(s => s.id === activeRecord?.studentId);
  const activeText = texts.find(t => t.id === 'text-1') || texts[0]; // fallback or matching text

  const [gradeInput, setGradeInput] = useState<number>(activeRecord?.readingResponse?.teacherGrade || 9);
  const [feedbackInput, setFeedbackInput] = useState<string>(activeRecord?.readingResponse?.teacherFeedback || '');
  const [rubricContent, setRubricContent] = useState<number>(activeRecord?.readingResponse?.rubricRatings?.content || 5);
  const [rubricVocab, setRubricVocab] = useState<number>(activeRecord?.readingResponse?.rubricRatings?.vocabulary || 5);
  const [rubricGrammar, setRubricGrammar] = useState<number>(activeRecord?.readingResponse?.rubricRatings?.grammar || 5);
  const [rubricEffort, setRubricEffort] = useState<number>(activeRecord?.readingResponse?.rubricRatings?.effort || 5);

  // When active record changes, populate fields
  React.useEffect(() => {
    if (activeRecord?.readingResponse) {
      setGradeInput(activeRecord.readingResponse.teacherGrade || 9);
      setFeedbackInput(
        activeRecord.readingResponse.teacherFeedback ||
        'Thoughtful response! Excellent vocabulary application and connection to personal experience.'
      );
      if (activeRecord.readingResponse.rubricRatings) {
        setRubricContent(activeRecord.readingResponse.rubricRatings.content);
        setRubricVocab(activeRecord.readingResponse.rubricRatings.vocabulary);
        setRubricGrammar(activeRecord.readingResponse.rubricRatings.grammar);
        setRubricEffort(activeRecord.readingResponse.rubricRatings.effort);
      }
    }
  }, [activeRecord]);

  // All response records
  const responseRecords = records.filter(r => r.readingResponse);

  const filteredRecords = responseRecords.filter(r => {
    const student = students.find(s => s.id === r.studentId);
    const matchesSearch = student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.date.includes(searchQuery);
    if (!matchesSearch) return false;

    const isGraded = r.readingResponse?.teacherGrade !== undefined;
    if (filterType === 'pending') return !isGraded;
    if (filterType === 'graded') return isGraded;
    return true;
  });

  const pendingCount = responseRecords.filter(r => r.readingResponse?.teacherGrade === undefined).length;
  const gradedCount = responseRecords.filter(r => r.readingResponse?.teacherGrade !== undefined).length;

  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecord) return;

    onGradeResponse(activeRecord.id, gradeInput, feedbackInput, {
      content: rubricContent,
      vocabulary: rubricVocab,
      grammar: rubricGrammar,
      effort: rubricEffort
    });

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    setSelectedRecordIdForGrading(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ms. Venera&#39;s Grading Desk</h1>
            <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-rose-200">
              {pendingCount} Pending Review
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Review student reading response journals, assign rubric ratings, and leave encouraging teacher feedback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'pending'
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Needs Grading ({pendingCount})
          </button>
          <button
            onClick={() => setFilterType('graded')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'graded'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Graded ({gradedCount})
          </button>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-sm font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({responseRecords.length})
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredRecords.map(rec => {
          const student = students.find(s => s.id === rec.studentId);
          const resp = rec.readingResponse!;
          const isGraded = resp.teacherGrade !== undefined;
          const wordCount = resp.text.trim().split(/\s+/).length;

          return (
            <div
              key={rec.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all space-y-4 ${
                isGraded ? 'border-slate-200' : 'border-rose-300 ring-2 ring-rose-500/10'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${student?.avatarColor || 'bg-slate-800'} text-white font-bold flex items-center justify-center text-xs shadow-sm`}>
                    {student?.avatarSeed || 'ST'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{student?.name}</h3>
                    <p className="text-[11px] text-slate-400">
                      <span className="font-bold text-indigo-600">IE</span> • Submitted {rec.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {wordCount} Words
                  </span>

                  {isGraded ? (
                    <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span>{resp.teacherGrade}/10 Points</span>
                    </span>
                  ) : (
                    <span className="bg-rose-100 text-rose-800 border border-rose-200 font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1 animate-pulse">
                      <Clock className="w-3.5 h-3.5 text-rose-600" />
                      <span>Pending Grade</span>
                    </span>
                  )}

                  <button
                    onClick={() => setSelectedRecordIdForGrading(rec.id)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow"
                  >
                    {isGraded ? 'Edit Grade & Feedback' : 'Grade Response ✍️'}
                  </button>
                </div>
              </div>

              {/* Student's Written Response */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Student Journal Text:
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-serif">
                  &ldquo;{resp.text}&rdquo;
                </p>
              </div>

              {/* Teacher Feedback if already graded */}
              {isGraded && resp.teacherFeedback && (
                <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/80 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                      <span>Ms. Venera&#39;s Feedback:</span>
                    </span>
                    {resp.rubricRatings && (
                      <div className="flex items-center gap-2 text-[11px] text-amber-900 font-medium">
                        <span>Ideas: {resp.rubricRatings.content}/5</span>
                        <span>•</span>
                        <span>Vocab: {resp.rubricRatings.vocabulary}/5</span>
                        <span>•</span>
                        <span>Grammar: {resp.rubricRatings.grammar}/5</span>
                      </div>
                    )}
                  </div>
                  <p className="text-amber-900 italic">&ldquo;{resp.teacherFeedback}&rdquo;</p>
                </div>
              )}
            </div>
          );
        })}

        {filteredRecords.length === 0 && (
          <div className="py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No submissions found in this category.</p>
            <p className="text-xs text-slate-400 mt-1">All current reading responses have been processed!</p>
          </div>
        )}
      </div>

      {/* Modal: Interactive Teacher Grading Panel */}
      {activeRecord && activeStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Grade Reading Response</h3>
                <p className="text-xs text-slate-500">{activeStudent.name} • {activeRecord.date}</p>
              </div>
              <button
                onClick={() => setSelectedRecordIdForGrading(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student's submission excerpt */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 max-h-40 overflow-y-auto text-xs text-slate-700 leading-relaxed font-serif italic">
              &ldquo;{activeRecord.readingResponse?.text}&rdquo;
            </div>

            <form onSubmit={handleSubmitGrade} className="space-y-4 text-xs">
              {/* Overall Grade Input */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-950 block text-sm">Overall Score (Out of 10)</span>
                  <span className="text-[11px] text-amber-800">Recorded on student daily assignment card</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={gradeInput}
                    onChange={e => setGradeInput(parseInt(e.target.value) || 0)}
                    required
                    className="w-16 p-2 text-center text-lg font-bold bg-white rounded-xl border border-amber-300 text-amber-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="font-bold text-amber-900 text-base">/ 10</span>
                </div>
              </div>

              {/* 4-Criterion Rubric */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-800 block text-xs">Rubric Evaluation (1 - 5 Stars):</span>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Content & Insight</span>
                    <select
                      value={rubricContent}
                      onChange={e => setRubricContent(parseInt(e.target.value))}
                      className="bg-white p-1 rounded-lg border border-slate-200 font-bold text-slate-800"
                    >
                      <option value="5">5 ⭐ (Excellent)</option>
                      <option value="4">4 ⭐ (Good)</option>
                      <option value="3">3 ⭐ (Satisfactory)</option>
                      <option value="2">2 ⭐ (Needs Work)</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Vocabulary Use</span>
                    <select
                      value={rubricVocab}
                      onChange={e => setRubricVocab(parseInt(e.target.value))}
                      className="bg-white p-1 rounded-lg border border-slate-200 font-bold text-slate-800"
                    >
                      <option value="5">5 ⭐ (Natural)</option>
                      <option value="4">4 ⭐ (Good)</option>
                      <option value="3">3 ⭐ (Basic)</option>
                      <option value="2">2 ⭐ (Missing)</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Grammar & Syntax</span>
                    <select
                      value={rubricGrammar}
                      onChange={e => setRubricGrammar(parseInt(e.target.value))}
                      className="bg-white p-1 rounded-lg border border-slate-200 font-bold text-slate-800"
                    >
                      <option value="5">5 ⭐ (Accurate)</option>
                      <option value="4">4 ⭐ (Minor Slips)</option>
                      <option value="3">3 ⭐ (Understandable)</option>
                      <option value="2">2 ⭐ (Frequent Errors)</option>
                    </select>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Effort & Depth</span>
                    <select
                      value={rubricEffort}
                      onChange={e => setRubricEffort(parseInt(e.target.value))}
                      className="bg-white p-1 rounded-lg border border-slate-200 font-bold text-slate-800"
                    >
                      <option value="5">5 ⭐ (Outstanding)</option>
                      <option value="4">4 ⭐ (Great)</option>
                      <option value="3">3 ⭐ (Average)</option>
                      <option value="2">2 ⭐ (Minimal)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Personalized Feedback */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Ms. Venera&#39;s Encouraging Feedback
                </label>
                <textarea
                  rows={3}
                  value={feedbackInput}
                  onChange={e => setFeedbackInput(e.target.value)}
                  required
                  placeholder="Highlight student strengths, applaud vocabulary usage, and provide constructive advice..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedRecordIdForGrading(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Grade & Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
