import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DailyTracker } from './components/DailyTracker';
import { StudentRoster } from './components/StudentRoster';
import { ReadingTextsHub } from './components/ReadingTextsHub';
import { ReadingTextDetail } from './components/ReadingTextDetail';
import { GrammarHub } from './components/GrammarHub';
import { SubmissionsReview } from './components/SubmissionsReview';
import { StudentPortal } from './components/StudentPortal';
import { StorageService } from './utils/storage';
import {
  RoleMode,
  Student,
  ReadingText,
  GrammarTopic,
  DailyAssignment,
  StudentDailyRecord,
  ComprehensionQuestion,
  VocabularyCheckQuestion,
  ReadingResponsePrompt,
  VocabularyWord,
  GrammarExercise
} from './types';

export default function App() {
  // Global View Mode: Teacher (Ms. Venera) vs Student View
  const [roleMode, setRoleMode] = useState<RoleMode>('teacher');

  // Teacher navigation tabs
  const [activeTab, setActiveTab] = useState<'daily-tracker' | 'roster' | 'reading-texts' | 'grammar' | 'submissions'>('daily-tracker');

  // Active Date for Daily Tracking
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-03');

  // Curriculum & Classroom State
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudentId, setActiveStudentId] = useState<string>('');
  const [texts, setTexts] = useState<ReadingText[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
  const [grammarTopics, setGrammarTopics] = useState<GrammarTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<DailyAssignment[]>([]);
  const [records, setRecords] = useState<StudentDailyRecord[]>([]);

  // Modals & Drill-down selections
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [selectedRecordIdForGrading, setSelectedRecordIdForGrading] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loadedStudents = StorageService.getStudents();
    const loadedTexts = StorageService.getTexts();
    const loadedGrammar = StorageService.getGrammarTopics();
    const loadedAssignments = StorageService.getAssignments();
    const loadedRecords = StorageService.getStudentRecords();
    const loadedActiveStudentId = StorageService.getActiveStudentId();

    setStudents(loadedStudents);
    setTexts(loadedTexts);
    setGrammarTopics(loadedGrammar);
    setAssignments(loadedAssignments);
    setRecords(loadedRecords);
    setActiveStudentId(loadedActiveStudentId || loadedStudents[0]?.id || '');
    if (loadedGrammar.length > 0) {
      setSelectedTopicId(loadedGrammar[0].id);
    }
  }, []);

  // Sync active student ID in storage
  const handleSetActiveStudentId = (id: string) => {
    setActiveStudentId(id);
    StorageService.setActiveStudentId(id);
  };

  // Reset demo data handler
  const handleResetData = () => {
    if (confirm('Reset classroom to initial sample lessons, students, and records?')) {
      StorageService.resetToDefaults();
      setStudents(StorageService.getStudents());
      setTexts(StorageService.getTexts());
      setGrammarTopics(StorageService.getGrammarTopics());
      setAssignments(StorageService.getAssignments());
      setRecords(StorageService.getStudentRecords());
      const firstStudentId = StorageService.getStudents()[0]?.id || '';
      setActiveStudentId(firstStudentId);
      StorageService.setActiveStudentId(firstStudentId);
      setSelectedTextId(null);
      setSelectedRecordIdForGrading(null);
      setSelectedStudentForProfile(null);
    }
  };

  // Student CRUD handlers
  const handleAddStudent = (studentData: Omit<Student, 'id' | 'joinedDate' | 'streakDays'>) => {
    const created = StorageService.addStudent(studentData);
    setStudents(StorageService.getStudents());
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    StorageService.updateStudent(updatedStudent);
    setStudents(StorageService.getStudents());
    if (selectedStudentForProfile?.id === updatedStudent.id) {
      setSelectedStudentForProfile(updatedStudent);
    }
  };

  const handleDeleteStudent = (studentId: string) => {
    StorageService.deleteStudent(studentId);
    setStudents(StorageService.getStudents());
    if (activeStudentId === studentId) {
      const remaining = StorageService.getStudents();
      if (remaining.length > 0) {
        handleSetActiveStudentId(remaining[0].id);
      }
    }
  };

  // Reading Text CRUD handlers
  const handleAssignTextToday = (textId: string) => {
    const currentAssign = assignments.find(a => a.date === selectedDate) || assignments[0];
    const textObj = texts.find(t => t.id === textId);
    if (currentAssign && textObj) {
      handleUpdateAssignment({
        ...currentAssign,
        textId: textId,
        title: `${textObj.title} & English Practice`,
        description: `Read "${textObj.title}", complete the comprehension and vocabulary check, write your reading response journal, and practice daily grammar.`
      });
    }
  };

  const handleAddText = (textData: Omit<ReadingText, 'id'>, assignImmediately?: boolean) => {
    const created = StorageService.addText(textData);
    setTexts(StorageService.getTexts());
    setSelectedTextId(created.id);
    if (assignImmediately) {
      handleAssignTextToday(created.id);
    }
  };

  const handleUpdateText = (updatedText: ReadingText) => {
    StorageService.updateText(updatedText);
    setTexts(StorageService.getTexts());
  };

  const handleDeleteText = (textId: string) => {
    StorageService.deleteText(textId);
    setTexts(StorageService.getTexts());
    if (selectedTextId === textId) {
      setSelectedTextId(null);
    }
  };

  const handleAddComprehensionQ = (textId: string, q: Omit<ComprehensionQuestion, 'id'>) => {
    StorageService.addComprehensionQuestion(textId, q);
    setTexts(StorageService.getTexts());
  };

  const handleDeleteComprehensionQ = (textId: string, qId: string) => {
    StorageService.deleteComprehensionQuestion(textId, qId);
    setTexts(StorageService.getTexts());
  };

  const handleAddVocabCheckQ = (textId: string, q: Omit<VocabularyCheckQuestion, 'id'>) => {
    StorageService.addVocabularyCheckQuestion(textId, q);
    setTexts(StorageService.getTexts());
  };

  const handleDeleteVocabCheckQ = (textId: string, qId: string) => {
    StorageService.deleteVocabularyCheckQuestion(textId, qId);
    setTexts(StorageService.getTexts());
  };

  const handleUpdateResponsePrompt = (textId: string, prompt: ReadingResponsePrompt) => {
    StorageService.updateReadingResponsePrompt(textId, prompt);
    setTexts(StorageService.getTexts());
  };

  const handleAddVocabWord = (textId: string, word: VocabularyWord) => {
    StorageService.addVocabularyWord(textId, word);
    setTexts(StorageService.getTexts());
  };

  const handleDeleteVocabWord = (textId: string, word: string) => {
    StorageService.deleteVocabularyWord(textId, word);
    setTexts(StorageService.getTexts());
  };

  // Grammar CRUD handlers
  const handleAddGrammarTopic = (topicData: Omit<GrammarTopic, 'id'>) => {
    const created = StorageService.addGrammarTopic(topicData);
    setGrammarTopics(StorageService.getGrammarTopics());
    setSelectedTopicId(created.id);
  };

  const handleDeleteGrammarTopic = (topicId: string) => {
    StorageService.deleteGrammarTopic(topicId);
    setGrammarTopics(StorageService.getGrammarTopics());
    if (selectedTopicId === topicId) {
      const remaining = StorageService.getGrammarTopics();
      setSelectedTopicId(remaining[0]?.id || null);
    }
  };

  const handleAddGrammarExercise = (topicId: string, ex: Omit<GrammarExercise, 'id'>) => {
    StorageService.addGrammarExercise(topicId, ex);
    setGrammarTopics(StorageService.getGrammarTopics());
  };

  // Assign today's homework
  const handleUpdateAssignment = (assignment: DailyAssignment) => {
    const existing = assignments.find(a => a.date === assignment.date);
    if (existing) {
      const updated = assignments.map(a => a.date === assignment.date ? assignment : a);
      StorageService.saveAssignments(updated);
      setAssignments(updated);
    } else {
      StorageService.createAssignment(assignment);
      setAssignments(StorageService.getAssignments());
    }
  };

  const handleAssignGrammarTopicToday = (topicId: string) => {
    const currentAssign = assignments.find(a => a.date === selectedDate);
    if (currentAssign) {
      handleUpdateAssignment({
        ...currentAssign,
        grammarTopicId: topicId
      });
    }
  };

  // Student Task completion saving
  const handleSaveStudentTask = (
    task: 'reading' | 'vocab' | 'comprehension' | 'response' | 'grammar',
    details?: {
      readingCompleted?: boolean;
      vocabScore?: { score: number; maxScore: number };
      comprehensionScore?: { score: number; maxScore: number };
      grammarScore?: { score: number; maxScore: number; mode: 'review' | 'test' };
      readingResponseText?: string;
    }
  ) => {
    const currentAssign = assignments.find(a => a.date === selectedDate) || assignments[0];
    const updated = StorageService.saveStudentTaskCompletion(
      activeStudentId,
      selectedDate,
      currentAssign.id,
      task,
      details
    );
    setRecords(StorageService.getStudentRecords());
    setStudents(StorageService.getStudents());
  };

  // Immediate streak starter on practice in portal
  const handleStartPractice = () => {
    StorageService.startStudentStreak(activeStudentId);
    setStudents(StorageService.getStudents());
  };

  // Teacher Grading Response
  const handleGradeResponse = (
    recordId: string,
    grade: number,
    feedback: string,
    rubricRatings?: { content: number; vocabulary: number; grammar: number; effort: number }
  ) => {
    StorageService.gradeReadingResponse(recordId, grade, feedback, rubricRatings);
    setRecords(StorageService.getStudentRecords());
  };

  // Open grading desk modal for a specific record
  const handleOpenGrading = (recordId: string) => {
    setSelectedRecordIdForGrading(recordId);
    setActiveTab('submissions');
  };

  // Find active student and context objects
  const activeStudent = students.find(s => s.id === activeStudentId) || students[0] || {
    id: 'std-1',
    name: 'Amina Aliyeva',
    email: 'amina@school.edu',
    gradeLevel: 'Grade 7-B • Intermediate (B1)',
    avatarColor: 'bg-emerald-600',
    avatarSeed: 'AA',
    joinedDate: '2026-09-01',
    streakDays: 14,
    learningGoal: 'Expand academic vocabulary',
    notes: '',
    status: 'active'
  };

  const currentAssignment = assignments.find(a => a.date === selectedDate) || assignments[0];
  const assignedText = texts.find(t => t.id === currentAssignment?.textId) || texts[0];
  const assignedGrammar = grammarTopics.find(g => g.id === currentAssignment?.grammarTopicId) || grammarTopics[0];
  const currentDateRecord = records.find(r => r.studentId === activeStudent.id && r.date === selectedDate);
  const selectedText = texts.find(t => t.id === selectedTextId);

  // Count pending reviews
  const pendingReviewsCount = records.filter(r => r.readingResponse && r.readingResponse.teacherGrade === undefined).length;

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-800 antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          if (tab === 'reading-texts') {
            setSelectedTextId(null);
          }
        }}
        roleMode={roleMode}
        setRoleMode={mode => {
          setRoleMode(mode);
          setSelectedTextId(null);
        }}
        students={students}
        activeStudentId={activeStudentId}
        setActiveStudentId={handleSetActiveStudentId}
        onResetData={handleResetData}
        pendingReviewsCount={pendingReviewsCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* STUDENT MODE */}
        {roleMode === 'student' ? (
          selectedTextId && selectedText ? (
            <ReadingTextDetail
              text={selectedText}
              onBack={() => setSelectedTextId(null)}
              roleMode={roleMode}
              activeStudent={activeStudent}
              currentDateRecord={currentDateRecord}
              onSaveStudentTask={handleSaveStudentTask}
              onAddComprehensionQ={handleAddComprehensionQ}
              onDeleteComprehensionQ={handleDeleteComprehensionQ}
              onAddVocabCheckQ={handleAddVocabCheckQ}
              onDeleteVocabCheckQ={handleDeleteVocabCheckQ}
              onUpdateResponsePrompt={handleUpdateResponsePrompt}
              onAddVocabWord={handleAddVocabWord}
              onUpdateText={handleUpdateText}
              allRecords={records}
              allStudents={students}
              onOpenGrading={handleOpenGrading}
              onStartPractice={handleStartPractice}
            />
          ) : activeTab === 'grammar' ? (
            <GrammarHub
              topics={grammarTopics}
              selectedTopicId={selectedTopicId}
              setSelectedTopicId={setSelectedTopicId}
              roleMode={roleMode}
              activeStudent={activeStudent}
              currentDateRecord={currentDateRecord}
              onSaveStudentTask={handleSaveStudentTask}
              onAddTopic={handleAddGrammarTopic}
              onDeleteTopic={handleDeleteGrammarTopic}
              onAddExercise={handleAddGrammarExercise}
              onAssignToday={handleAssignGrammarTopicToday}
            />
          ) : (
            <StudentPortal
              student={activeStudent}
              assignment={currentAssignment}
              record={currentDateRecord}
              text={assignedText}
              grammarTopic={assignedGrammar}
              onStartPractice={handleStartPractice}
              onOpenTextTab={tab => {
                setSelectedTextId(assignedText?.id || texts[0]?.id);
              }}
              onOpenGrammar={() => {
                setActiveTab('grammar');
                if (assignedGrammar) {
                  setSelectedTopicId(assignedGrammar.id);
                }
              }}
            />
          )
        ) : (
          /* TEACHER MODE (Ms. Venera) */
          <>
            {activeTab === 'daily-tracker' && (
              <DailyTracker
                students={students}
                assignments={assignments}
                records={records}
                texts={texts}
                grammarTopics={grammarTopics}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                onOpenGrading={handleOpenGrading}
                onSelectStudent={student => setSelectedStudentForProfile(student)}
                onOpenText={textId => {
                  setSelectedTextId(textId);
                  setActiveTab('reading-texts');
                }}
                onOpenGrammar={topicId => {
                  setSelectedTopicId(topicId);
                  setActiveTab('grammar');
                }}
                onUpdateAssignment={handleUpdateAssignment}
              />
            )}

            {activeTab === 'roster' && (
              <StudentRoster
                students={students}
                records={records}
                texts={texts}
                grammarTopics={grammarTopics}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                selectedStudent={selectedStudentForProfile}
                setSelectedStudent={setSelectedStudentForProfile}
                onOpenGrading={handleOpenGrading}
              />
            )}

            {activeTab === 'reading-texts' && (
              selectedTextId && selectedText ? (
                <ReadingTextDetail
                  text={selectedText}
                  onBack={() => setSelectedTextId(null)}
                  roleMode={roleMode}
                  activeStudent={activeStudent}
                  currentDateRecord={currentDateRecord}
                  onSaveStudentTask={handleSaveStudentTask}
                  onAddComprehensionQ={handleAddComprehensionQ}
                  onDeleteComprehensionQ={handleDeleteComprehensionQ}
                  onAddVocabCheckQ={handleAddVocabCheckQ}
                  onDeleteVocabCheckQ={handleDeleteVocabCheckQ}
                  onUpdateResponsePrompt={handleUpdateResponsePrompt}
                  onAddVocabWord={handleAddVocabWord}
                  onDeleteVocabWord={handleDeleteVocabWord}
                  onUpdateText={handleUpdateText}
                  onDeleteText={handleDeleteText}
                  onAssignTextToday={handleAssignTextToday}
                  isAssignedToday={currentAssignment?.textId === selectedText.id}
                  allRecords={records}
                  allStudents={students}
                  onOpenGrading={handleOpenGrading}
                  onStartPractice={handleStartPractice}
                />
              ) : (
                <ReadingTextsHub
                  texts={texts}
                  onSelectText={id => setSelectedTextId(id)}
                  onAddText={handleAddText}
                  onDeleteText={handleDeleteText}
                  onAssignToday={handleAssignTextToday}
                  activeAssignmentTextId={currentAssignment?.textId}
                  roleMode={roleMode}
                />
              )
            )}

            {activeTab === 'grammar' && (
              <GrammarHub
                topics={grammarTopics}
                selectedTopicId={selectedTopicId}
                setSelectedTopicId={setSelectedTopicId}
                roleMode={roleMode}
                activeStudent={activeStudent}
                currentDateRecord={currentDateRecord}
                onSaveStudentTask={handleSaveStudentTask}
                onAddTopic={handleAddGrammarTopic}
                onDeleteTopic={handleDeleteGrammarTopic}
                onAddExercise={handleAddGrammarExercise}
                onAssignToday={handleAssignGrammarTopicToday}
              />
            )}

            {activeTab === 'submissions' && (
              <SubmissionsReview
                records={records}
                students={students}
                texts={texts}
                onGradeResponse={handleGradeResponse}
                selectedRecordIdForGrading={selectedRecordIdForGrading}
                setSelectedRecordIdForGrading={setSelectedRecordIdForGrading}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200/80 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-600">
          Ms. Venera&#39;s English Learning Studio • Dedicated to student reading fluency and grammar mastery
        </p>
        <p className="mt-1 text-slate-400">
          Daily assignment tracking • Reading comprehension & vocabulary checks • Reflective journal rubrics • Grammar review & tests
        </p>
      </footer>
    </div>
  );
}
