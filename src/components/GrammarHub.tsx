import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Award,
  Plus,
  Play,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  FileCheck,
  ChevronRight,
  Filter,
  Trash2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GrammarTopic, GrammarExercise, RoleMode, Student, StudentDailyRecord } from '../types';

interface GrammarHubProps {
  topics: GrammarTopic[];
  selectedTopicId: string | null;
  setSelectedTopicId: (id: string | null) => void;
  roleMode: RoleMode;
  activeStudent: Student;
  currentDateRecord?: StudentDailyRecord;
  onSaveStudentTask: (
    task: 'grammar',
    details?: {
      grammarScore?: { score: number; maxScore: number; mode: 'review' | 'test' };
    }
  ) => void;
  onAddTopic: (topic: Omit<GrammarTopic, 'id'>) => void;
  onDeleteTopic: (topicId: string) => void;
  onAddExercise: (topicId: string, ex: Omit<GrammarExercise, 'id'>) => void;
  onAssignToday: (topicId: string) => void;
}

export const GrammarHub: React.FC<GrammarHubProps> = ({
  topics,
  selectedTopicId,
  setSelectedTopicId,
  roleMode,
  activeStudent,
  currentDateRecord,
  onSaveStudentTask,
  onAddTopic,
  onDeleteTopic,
  onAddExercise,
  onAssignToday
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'rules' | 'review' | 'test'>('rules');

  // Review Mode state
  const [reviewAnswers, setReviewAnswers] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});

  // Test Mode state
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [isTestActive, setIsTestActive] = useState(false);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(600); // 10 mins

  // Modals for Teacher
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [assignedToast, setAssignedToast] = useState(false);

  // Active topic
  const activeTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  // Test timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTestActive && !testSubmitted && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds(prev => {
          if (prev <= 1) {
            handleFinishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTestActive, testSubmitted, timeLeftSeconds]);

  const startTest = () => {
    setIsTestActive(true);
    setTestSubmitted(false);
    setTestAnswers({});
    setTimeLeftSeconds((activeTopic?.testDurationMinutes || 10) * 60);
  };

  const handleFinishTest = () => {
    setIsTestActive(false);
    setTestSubmitted(true);

    let earned = 0;
    let max = 0;

    activeTopic.exercises.forEach(ex => {
      max += ex.points;
      const ans = testAnswers[ex.id];
      if (ans && ans.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase()) {
        earned += ex.points;
      }
    });

    onSaveStudentTask('grammar', {
      grammarScore: { score: earned, maxScore: max, mode: 'test' }
    });

    if (earned >= max * 0.8) {
      confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
    }
  };

  // Review mode complete
  const handleCompleteReview = () => {
    let earned = 0;
    let max = 0;

    activeTopic.exercises.forEach(ex => {
      max += ex.points;
      const ans = reviewAnswers[ex.id];
      if (ans && ans.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase()) {
        earned += ex.points;
      }
    });

    onSaveStudentTask('grammar', {
      grammarScore: { score: earned, maxScore: max, mode: 'review' }
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  };

  const handleAssignTodayClick = () => {
    onAssignToday(activeTopic.id);
    setAssignedToast(true);
    setTimeout(() => setAssignedToast(false), 3000);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const filteredTopics = topics.filter(t => {
    if (categoryFilter === 'all') return true;
    return t.category.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {assignedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white border border-amber-500/50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-semibold">Assigned &ldquo;{activeTopic.title}&rdquo; for today&#39;s homework!</span>
        </div>
      )}

      {/* Header & Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Grammar Hub (Review & Test)</h1>
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">
              School Curriculum
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Master grammar topics learned at school. Study visual rules, practice in Review Mode, or test your skills in timed Test Mode.
          </p>
        </div>

        {roleMode === 'teacher' && (
          <button
            onClick={() => setIsAddingTopic(true)}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Grammar Unit</span>
          </button>
        )}
      </div>

      {/* Topics Selector Pill Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setCategoryFilter('tenses')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === 'tenses'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tenses
          </button>
          <button
            onClick={() => setCategoryFilter('sentence structure')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === 'sentence structure'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sentence Structure
          </button>
          <button
            onClick={() => setCategoryFilter('modifiers')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              categoryFilter === 'modifiers'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Prepositions
          </button>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1 border-t border-slate-100">
          {filteredTopics.map(topic => (
            <button
              key={topic.id}
              onClick={() => {
                setSelectedTopicId(topic.id);
                setIsTestActive(false);
                setTestSubmitted(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTopic.id === topic.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{topic.title}</span>
              <span className="text-[10px] opacity-75">({topic.exercises.length} ex)</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Topic Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Topic Header Banner */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {activeTopic.category} • {activeTopic.level}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{activeTopic.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{activeTopic.overview}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            {roleMode === 'teacher' && (
              <button
                onClick={handleAssignTodayClick}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assign for Today</span>
              </button>
            )}

            {roleMode === 'teacher' && (
              <button
                onClick={() => setIsAddingExercise(true)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-xl text-xs transition-all flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Exercise</span>
              </button>
            )}
          </div>
        </div>

        {/* 3 Mode Navigation Tabs: Rules, Review Mode, Test Mode */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'rules'
                ? 'bg-white text-slate-900 shadow border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>1. Rules & Cheatsheet</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'review'
                ? 'bg-white text-slate-900 shadow border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>2. Review Mode (Practice with Hints)</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'test'
                ? 'bg-white text-slate-900 shadow border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-4 h-4 text-blue-600" />
            <span>3. Test Mode (Timed School Test)</span>
            {currentDateRecord?.grammarScore && (
              <span className="text-[11px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-semibold">
                {currentDateRecord.grammarScore.score}/{currentDateRecord.grammarScore.maxScore}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: RULES & CHEATSHEET */}
        {activeTab === 'rules' && (
          <div className="p-6 space-y-6">
            <div className="space-y-5">
              {activeTopic.rules.map((rule, idx) => (
                <div key={idx} className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{rule.ruleTitle}</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {rule.ruleExplanation}
                  </p>

                  {/* Formula Box */}
                  {rule.formula && (
                    <div className="bg-white p-3 rounded-xl border border-amber-200/80 font-mono text-xs text-amber-950 font-bold flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-900 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Formula</span>
                      <span>{rule.formula}</span>
                    </div>
                  )}

                  {/* Examples */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 block">
                      Classroom Examples:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {rule.examples.map((ex, exIdx) => (
                        <div key={exIdx} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                          <p className="font-medium text-slate-800">
                            {ex.sentence}
                          </p>
                          {ex.note && (
                            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium inline-block">
                              ✓ {ex.note}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Common mistake tip */}
                  {rule.commonMistakeTip && (
                    <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-2 text-xs text-rose-900">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold mb-0.5">Watch Out! Common Mistake:</strong>
                        <span>{rule.commonMistakeTip}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => setActiveTab('review')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow flex items-center gap-1.5"
              >
                <span>Ready to Practice! Open Review Mode</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: REVIEW MODE (PRACTICE WITH HINTS) */}
        {activeTab === 'review' && (
          <div className="p-6 space-y-6">
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-emerald-950 text-sm">Review Mode (Interactive Practice)</h3>
                <p className="text-xs text-emerald-900 mt-0.5">
                  Answer the exercises at your own pace. Reveal teacher hints if you get stuck, and learn from detailed grammar breakdowns!
                </p>
              </div>

              <span className="text-xs bg-white text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-300 w-fit">
                {activeTopic.exercises.length} Practice Exercises
              </span>
            </div>

            {/* Exercises List */}
            <div className="space-y-4">
              {activeTopic.exercises.map((ex, idx) => {
                const userAns = reviewAnswers[ex.id];
                const isSelected = !!userAns;
                const isCorrect = userAns?.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase();
                const hintVisible = revealedHints[ex.id];

                return (
                  <div key={ex.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{ex.question}</span>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                        {ex.difficulty.toUpperCase()} • {ex.points} pts
                      </span>
                    </div>

                    {/* Options (Multiple choice or fill blank) */}
                    {ex.options && ex.options.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {ex.options.map((opt, optIdx) => {
                          const isChosen = userAns === opt;
                          const isRightAnswer = opt.toLowerCase() === ex.correctAnswer.toLowerCase();

                          let optClasses = 'border-slate-200 hover:bg-slate-50 text-slate-700';
                          if (isSelected) {
                            if (isRightAnswer) {
                              optClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                            } else if (isChosen && !isRightAnswer) {
                              optClasses = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => setReviewAnswers(prev => ({ ...prev, [ex.id]: opt }))}
                              className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${optClasses}`}
                            >
                              <span>{opt}</span>
                              {isSelected && isRightAnswer && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                              )}
                              {isSelected && isChosen && !isRightAnswer && (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={userAns || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setReviewAnswers(prev => ({ ...prev, [ex.id]: val }));
                          }}
                          placeholder="Type your answer here..."
                          className="w-full sm:w-80 p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    )}

                    {/* Hint Button & Box */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => setRevealedHints(prev => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                        className="text-amber-700 hover:text-amber-800 text-xs font-semibold flex items-center gap-1 hover:underline"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>{hintVisible ? 'Hide Teacher Hint' : '💡 Need a Hint from Ms. Venera?'}</span>
                      </button>

                      {isSelected && (
                        <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {isCorrect ? '✓ Correct! Well done' : '✗ Keep trying or review rule'}
                        </span>
                      )}
                    </div>

                    {hintVisible && (
                      <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed animate-fade-in">
                        <strong>Teacher Hint:</strong> {ex.hint}
                      </div>
                    )}

                    {isSelected && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-800 block">Grammar Explanation:</span>
                        <p>{ex.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Complete Review Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Completed {Object.keys(reviewAnswers).length} of {activeTopic.exercises.length} exercises
              </span>

              <button
                onClick={handleCompleteReview}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow"
              >
                Save Review Practice Progress
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: TEST MODE (TIMED SCHOOL TEST) */}
        {activeTab === 'test' && (
          <div className="p-6 space-y-6">
            {!isTestActive && !testSubmitted ? (
              <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-200 text-center space-y-4 max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">School Grammar Test</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                    This simulates an in-class test on <strong>{activeTopic.title}</strong>. Answers are submitted together, and your score will be recorded on your daily report card.
                  </p>
                </div>

                <div className="flex justify-center gap-4 text-xs text-slate-700">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-4 h-4 text-blue-600" />
                    {activeTopic.testDurationMinutes || 10} Minutes
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <Award className="w-4 h-4 text-amber-600" />
                    {activeTopic.exercises.reduce((sum, e) => sum + e.points, 0)} Total Points
                  </span>
                </div>

                <button
                  onClick={startTest}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-md inline-flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Graded Test Now</span>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Test Sticky Status Bar */}
                <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-amber-400">Test in Progress:</span>
                    <span>{activeTopic.title}</span>
                  </div>

                  {!testSubmitted ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 font-mono text-sm font-bold bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-amber-300">
                        <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span>{formatTime(timeLeftSeconds)}</span>
                      </div>

                      <button
                        onClick={handleFinishTest}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-all"
                      >
                        Submit Test
                      </button>
                    </div>
                  ) : (
                    <span className="bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded-lg text-xs">
                      Test Finished & Scored
                    </span>
                  )}
                </div>

                {/* Score Report Card when submitted */}
                {testSubmitted && currentDateRecord?.grammarScore && (
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-2xl shadow-md text-center space-y-2 animate-scale-in">
                    <Award className="w-10 h-10 mx-auto text-amber-200" />
                    <h3 className="text-xl font-bold">Grammar Test Results</h3>
                    <p className="text-3xl font-extrabold">
                      {currentDateRecord.grammarScore.score} / {currentDateRecord.grammarScore.maxScore} Points
                    </p>
                    <p className="text-xs text-emerald-100">
                      Score: {Math.round((currentDateRecord.grammarScore.score / currentDateRecord.grammarScore.maxScore) * 100)}% • Recorded on your Daily Assignment Tracker!
                    </p>
                    <button
                      onClick={startTest}
                      className="mt-2 px-4 py-1.5 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-xs transition-colors"
                    >
                      Retake Test
                    </button>
                  </div>
                )}

                {/* Test Questions List */}
                <div className="space-y-4">
                  {activeTopic.exercises.map((ex, idx) => {
                    const userAns = testAnswers[ex.id];
                    const isRight = userAns?.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase();

                    return (
                      <div key={ex.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">{ex.question}</span>
                          </div>

                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {ex.points} pts
                          </span>
                        </div>

                        {/* Options */}
                        {ex.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {ex.options.map((opt, optIdx) => {
                              const isChosen = userAns === opt;
                              const isRightAnswer = opt.toLowerCase() === ex.correctAnswer.toLowerCase();

                              let optClasses = 'border-slate-200 hover:bg-slate-50 text-slate-700';
                              if (testSubmitted) {
                                if (isRightAnswer) {
                                  optClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                                } else if (isChosen && !isRightAnswer) {
                                  optClasses = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                                }
                              } else if (isChosen) {
                                optClasses = 'bg-blue-100 border-blue-500 text-blue-950 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  disabled={testSubmitted}
                                  onClick={() => setTestAnswers(prev => ({ ...prev, [ex.id]: opt }))}
                                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${optClasses}`}
                                >
                                  <span>{opt}</span>
                                  {testSubmitted && isRightAnswer && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                                  )}
                                  {testSubmitted && isChosen && !isRightAnswer && (
                                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {testSubmitted && (
                          <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                            <strong>Explanation:</strong> {ex.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!testSubmitted && (
                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button
                      onClick={handleFinishTest}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow"
                    >
                      Finish and Submit Test
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add Grammar Topic */}
      {isAddingTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Add New Grammar Topic</h3>
                <p className="text-xs text-slate-500">Create a topic unit with rules and exercises</p>
              </div>
              <button onClick={() => setIsAddingTopic(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                const category = (form.elements.namedItem('category') as HTMLSelectElement).value as any;
                const level = (form.elements.namedItem('level') as HTMLInputElement).value;
                const overview = (form.elements.namedItem('overview') as HTMLTextAreaElement).value;

                onAddTopic({
                  title,
                  category,
                  level,
                  overview,
                  testDurationMinutes: 10,
                  rules: [
                    {
                      ruleTitle: `Key Principles of ${title}`,
                      ruleExplanation: 'Understand the standard form and usage in English writing and conversation.',
                      formula: 'Subject + Auxiliary + Main Verb',
                      examples: [
                        { sentence: 'They had already finished the reading assignment.', highlight: 'had finished', isCorrect: true, note: 'Standard usage' }
                      ],
                      commonMistakeTip: 'Pay attention to irregular verb forms!'
                    }
                  ],
                  exercises: [
                    {
                      id: `ex-${Date.now()}-1`,
                      type: 'multiple_choice',
                      question: `Choose the grammatically correct sentence for "${title}":`,
                      options: [
                        'She had completed her essay before class started.',
                        'She has completed her essay yesterday night.',
                        'She completing her essay fast.',
                        'She have completed her essay already.'
                      ],
                      correctAnswer: 'She had completed her essay before class started.',
                      explanation: 'The past perfect tense describes an action completed before another past event.',
                      hint: 'Look for the action that happened earliest in the past.',
                      difficulty: 'medium',
                      points: 2
                    }
                  ]
                });

                setIsAddingTopic(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Topic Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Past Perfect vs. Past Simple"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue="Tenses"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Tenses">Tenses</option>
                    <option value="Sentence Structure">Sentence Structure</option>
                    <option value="Verbs & Modals">Verbs & Modals</option>
                    <option value="Punctuation & Clauses">Punctuation & Clauses</option>
                    <option value="Modifiers & Prepositions">Modifiers & Prepositions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CEFR Level</label>
                  <input
                    type="text"
                    name="level"
                    defaultValue="Intermediate (B1)"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Topic Overview / Classroom Objectives</label>
                <textarea
                  name="overview"
                  rows={3}
                  required
                  placeholder="Describe when students use this grammar rule and why it matters..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingTopic(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Create Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Exercise to Topic */}
      {isAddingExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Add Exercise to {activeTopic.title}</h3>
                <p className="text-xs text-slate-500">Create multiple choice or fill-blank exercise</p>
              </div>
              <button onClick={() => setIsAddingExercise(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const question = (form.elements.namedItem('question') as HTMLTextAreaElement).value;
                const opt1 = (form.elements.namedItem('opt1') as HTMLInputElement).value;
                const opt2 = (form.elements.namedItem('opt2') as HTMLInputElement).value;
                const opt3 = (form.elements.namedItem('opt3') as HTMLInputElement).value;
                const opt4 = (form.elements.namedItem('opt4') as HTMLInputElement).value;
                const correctAnswer = (form.elements.namedItem('correctAnswer') as HTMLInputElement).value;
                const explanation = (form.elements.namedItem('explanation') as HTMLTextAreaElement).value;
                const hint = (form.elements.namedItem('hint') as HTMLInputElement).value;
                const difficulty = (form.elements.namedItem('difficulty') as HTMLSelectElement).value as any;

                onAddExercise(activeTopic.id, {
                  type: 'multiple_choice',
                  question,
                  options: [opt1, opt2, opt3, opt4],
                  correctAnswer,
                  explanation,
                  hint,
                  difficulty,
                  points: 2
                });

                setIsAddingExercise(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Exercise Prompt / Sentence with Blank</label>
                <textarea
                  name="question"
                  rows={2}
                  required
                  placeholder="e.g. By the time Ms. Venera arrived, the students ________ their books."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">4 Choices</label>
                <input type="text" name="opt1" required placeholder="Option A" className="w-full p-2 rounded-xl border border-slate-200" />
                <input type="text" name="opt2" required placeholder="Option B" className="w-full p-2 rounded-xl border border-slate-200" />
                <input type="text" name="opt3" required placeholder="Option C" className="w-full p-2 rounded-xl border border-slate-200" />
                <input type="text" name="opt4" required placeholder="Option D" className="w-full p-2 rounded-xl border border-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Exact Correct Answer</label>
                  <input
                    type="text"
                    name="correctAnswer"
                    required
                    placeholder="Must match one option"
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Difficulty</label>
                  <select name="difficulty" defaultValue="medium" className="w-full p-2.5 rounded-xl border border-slate-200 bg-white">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Teacher Hint for Review Mode</label>
                <input
                  type="text"
                  name="hint"
                  required
                  placeholder="e.g. Check the time marker 'By the time' which indicates past perfect."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Explanation</label>
                <textarea
                  name="explanation"
                  rows={2}
                  required
                  placeholder="Explain why this option is correct based on the rule..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingExercise(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Add Exercise
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
