import React from 'react';
import {
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Award,
  FileQuestion,
  ChevronRight,
  Star,
  MessageSquare,
  HelpCircle,
  Play,
  Headphones,
  Volume2
} from 'lucide-react';
import { Student, DailyAssignment, StudentDailyRecord, ReadingText, GrammarTopic } from '../types';

interface StudentPortalProps {
  student: Student;
  assignment: DailyAssignment;
  record?: StudentDailyRecord;
  text: ReadingText;
  grammarTopic: GrammarTopic;
  onOpenTextTab: (tab: 'text' | 'vocab' | 'comprehension' | 'response') => void;
  onOpenGrammar: () => void;
  onStartPractice?: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  assignment,
  record,
  text,
  grammarTopic,
  onOpenTextTab,
  onOpenGrammar,
  onStartPractice
}) => {
  const completedTasks = record?.completedTasks || [];
  const hasReading = !!record?.readingCompleted;
  const vocabScore = record?.vocabScore;
  const compScore = record?.comprehensionScore;
  const grammarScore = record?.grammarScore;
  const response = record?.readingResponse;

  const totalTasks = 5;
  const completedCount = completedTasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Welcome & Streak Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-sm text-xs font-semibold px-2.5 py-0.5 rounded-full">
                Ms. Venera&#39;s English Student Portal
              </span>
              <span className="bg-emerald-500/40 text-white text-xs font-bold px-2 py-0.5 rounded-md border border-emerald-400/40">
                IE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Hello, {student.name}! 👋
            </h1>

            <p className="text-sm text-emerald-100 max-w-xl leading-relaxed">
              &ldquo;{student.learningGoal || 'Read daily to grow your vocabulary and master English!'}&rdquo;
            </p>
          </div>

          {/* Streak Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Flame className="w-7 h-7 text-orange-600 fill-orange-500 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">{student.streakDays} {student.streakDays === 1 ? 'Day' : 'Days'}</div>
              <div className="text-xs text-amber-300 font-semibold">
                {student.streakDays > 0 ? 'Active Daily Streak 🔥' : 'Streak Starts on First Practice ✨'}
              </div>
            </div>
          </div>
        </div>

        {/* Daily Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex items-center justify-between text-xs text-emerald-100 mb-2">
            <span className="font-semibold">Today&#39;s Assignment Progress ({assignment.date})</span>
            <span className="font-bold text-white">{completedCount} of {totalTasks} tasks completed ({progressPercent}%)</span>
          </div>

          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-300 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Today's Daily Mission Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded">
              TODAY&#39;S MISSION
            </span>
            <h2 className="text-lg font-bold text-slate-900">{assignment.title}</h2>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
            {assignment.description}
          </p>
        </div>
      </div>

      {/* 5 Daily Task Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task 1: Reading Text */}
        <div
          onClick={() => {
            onStartPractice?.();
            onOpenTextTab('text');
          }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md ${
            hasReading
              ? 'bg-emerald-50/50 border-emerald-300'
              : 'bg-white border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>TASK 1: READING</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 bg-amber-100/80 text-amber-900 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  <Headphones className="w-3 h-3 text-amber-600" /> Audio Book
                </span>
                {hasReading ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Done
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Not Read Yet
                  </span>
                )}
              </div>
            </div>

            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              {text.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {text.summary}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
            <span>{hasReading ? 'Read Again / Listen Aloud' : 'Start Reading Text'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Task 2: Vocabulary Check */}
        <div
          onClick={() => {
            onStartPractice?.();
            onOpenTextTab('vocab');
          }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md ${
            vocabScore
              ? 'bg-amber-50/50 border-amber-300'
              : 'bg-white border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>TASK 2: VOCABULARY CHECK</span>
              </span>

              {vocabScore ? (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Score: {vocabScore.score}/{vocabScore.maxScore} ⭐
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  Pending Quiz
                </span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Context & Definitions Quiz
            </h3>
            <p className="text-xs text-slate-500">
              {text.vocabularyCheckQuestions.length} vocabulary questions on {text.vocabularyWords.map(w => w.word).join(', ')}.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
            <span>{vocabScore ? 'Review Vocab Score' : 'Take Vocabulary Check'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Task 3: Comprehension Questions */}
        <div
          onClick={() => {
            onStartPractice?.();
            onOpenTextTab('comprehension');
          }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md ${
            compScore
              ? 'bg-blue-50/50 border-blue-300'
              : 'bg-white border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <FileQuestion className="w-4 h-4 text-blue-600" />
                <span>TASK 3: COMPREHENSION QUIZ</span>
              </span>

              {compScore ? (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Score: {compScore.score}/{compScore.maxScore} ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  Not Taken
                </span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              Story Understanding & Plot Inferences
            </h3>
            <p className="text-xs text-slate-500">
              {text.comprehensionQuestions.length} questions to check your deep comprehension.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
            <span>{compScore ? 'Review Comprehension Answers' : 'Take Comprehension Quiz'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Task 4: Reading Response Journal */}
        <div
          onClick={() => {
            onStartPractice?.();
            onOpenTextTab('response');
          }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md ${
            response
              ? response.teacherGrade !== undefined
                ? 'bg-amber-50/50 border-amber-300'
                : 'bg-emerald-50/50 border-emerald-300'
              : 'bg-white border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-rose-600" />
                <span>TASK 4: READING RESPONSE JOURNAL</span>
              </span>

              {response ? (
                response.teacherGrade !== undefined ? (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    Graded: {response.teacherGrade}/10
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                    Submitted ✓
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  Not Written Yet
                </span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
              {text.readingResponsePrompt.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-2">
              {text.readingResponsePrompt.promptText}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
            <span>{response ? 'View Journal & Teacher Feedback' : 'Write Response Journal'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Task 5: Grammar Exercise */}
        <div
          onClick={() => {
            onStartPractice?.();
            onOpenGrammar();
          }}
          className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group hover:shadow-md md:col-span-2 ${
            grammarScore
              ? 'bg-indigo-50/50 border-indigo-300'
              : 'bg-white border-slate-200 hover:border-amber-400'
          }`}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>TASK 5: GRAMMAR REVIEW OR TEST</span>
              </span>

              {grammarScore ? (
                <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  Score: {grammarScore.score}/{grammarScore.maxScore} ({grammarScore.mode === 'test' ? 'Test' : 'Review'})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-medium">
                  Pending Practice
                </span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors">
              {grammarTopic.title}
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              {grammarTopic.overview}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
            <span>{grammarScore ? 'Review Grammar Exercises' : 'Open Grammar Lab (Review or Test Mode)'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* Teacher's Latest Feedback Card (if any) */}
      {response?.teacherFeedback && (
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-600 fill-amber-500" />
              <h4 className="font-bold text-amber-950 text-sm">
                Ms. Venera&#39;s Feedback on your Reading Response
              </h4>
            </div>
            <span className="bg-amber-200/80 text-amber-950 font-bold px-2.5 py-0.5 rounded text-xs">
              Score: {response.teacherGrade}/10 ⭐
            </span>
          </div>

          <p className="text-xs sm:text-sm text-amber-900 italic bg-white/70 p-3 rounded-xl border border-amber-200/60 leading-relaxed">
            &ldquo;{response.teacherFeedback}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
};
