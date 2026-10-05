import {
  Student,
  ReadingText,
  GrammarTopic,
  DailyAssignment,
  StudentDailyRecord,
  TaskType,
  ComprehensionQuestion,
  VocabularyCheckQuestion,
  ReadingResponsePrompt,
  VocabularyWord,
  GrammarExercise
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_READING_TEXTS,
  INITIAL_GRAMMAR_TOPICS,
  INITIAL_ASSIGNMENTS,
  INITIAL_STUDENT_RECORDS
} from '../data/initialData';

const KEYS = {
  STUDENTS: 'venera_students_v6',
  TEXTS: 'venera_texts_v8',
  GRAMMAR: 'venera_grammar_v2',
  ASSIGNMENTS: 'venera_assignments_v7',
  RECORDS: 'venera_records_v6',
  ACTIVE_STUDENT_ID: 'venera_active_student_id_v6'
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write ${key} to localStorage:`, e);
  }
}

export const StorageService = {
  // Reset all data to factory demo
  resetToDefaults: () => {
    safeSet(KEYS.STUDENTS, INITIAL_STUDENTS);
    safeSet(KEYS.TEXTS, INITIAL_READING_TEXTS);
    safeSet(KEYS.GRAMMAR, INITIAL_GRAMMAR_TOPICS);
    safeSet(KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    safeSet(KEYS.RECORDS, INITIAL_STUDENT_RECORDS);
    safeSet(KEYS.ACTIVE_STUDENT_ID, INITIAL_STUDENTS[0].id);
  },

  // Students
  getStudents: (): Student[] => {
    const raw = safeGet<Student[]>(KEYS.STUDENTS, INITIAL_STUDENTS);
    // Guarantee that student grade is NOT included and only IE is shown
    return raw.map(s => ({
      ...s,
      gradeLevel: 'IE'
    }));
  },

  saveStudents: (students: Student[]): void => {
    safeSet(KEYS.STUDENTS, students.map(s => ({ ...s, gradeLevel: 'IE' })));
  },

  startStudentStreak: (studentId: string): Student | undefined => {
    const students = StorageService.getStudents();
    const student = students.find(s => s.id === studentId);
    if (student) {
      if (student.streakDays === 0) {
        student.streakDays = 1;
        StorageService.updateStudent(student);
      }
      return student;
    }
    return undefined;
  },

  addStudent: (student: Omit<Student, 'id' | 'joinedDate' | 'streakDays'>): Student => {
    const students = StorageService.getStudents();
    const colors = [
      'bg-emerald-500',
      'bg-blue-600',
      'bg-purple-600',
      'bg-amber-600',
      'bg-rose-500',
      'bg-indigo-600',
      'bg-teal-600',
      'bg-orange-500'
    ];
    const newStudent: Student = {
      ...student,
      gradeLevel: 'IE',
      id: `std-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      streakDays: 0,
      avatarColor: student.avatarColor || colors[Math.floor(Math.random() * colors.length)],
      avatarSeed: student.avatarSeed || student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    };
    const updated = [newStudent, ...students];
    StorageService.saveStudents(updated);
    return newStudent;
  },

  updateStudent: (student: Student): void => {
    const students = StorageService.getStudents();
    const updated = students.map(s => s.id === student.id ? student : s);
    StorageService.saveStudents(updated);
  },

  deleteStudent: (studentId: string): void => {
    const students = StorageService.getStudents();
    const updated = students.filter(s => s.id !== studentId);
    StorageService.saveStudents(updated);
  },

  // Active student for student view simulation
  getActiveStudentId: (): string => {
    return safeGet<string>(KEYS.ACTIVE_STUDENT_ID, INITIAL_STUDENTS[0].id);
  },

  setActiveStudentId: (id: string): void => {
    safeSet(KEYS.ACTIVE_STUDENT_ID, id);
  },

  // Reading Texts
  getTexts: (): ReadingText[] => {
    let texts = safeGet<ReadingText[]>(KEYS.TEXTS, INITIAL_READING_TEXTS);
    // Explicitly delete any old seed texts (text-1, text-2, text-3) leaving only Diary of a Spider + user created texts
    const filtered = texts.filter(t => t.id === 'text-spider' || (!['text-1', 'text-2', 'text-3'].includes(t.id)));
    if (filtered.length !== texts.length) {
      texts = filtered;
      safeSet(KEYS.TEXTS, texts);
    }
    const spiderInitial = INITIAL_READING_TEXTS.find(t => t.id === 'text-spider');
    if (spiderInitial) {
      const idx = texts.findIndex(t => t.id === 'text-spider');
      if (idx !== -1) {
        let changed = false;
        if ((texts[idx].comprehensionQuestions?.length || 0) < 10) {
          texts[idx].comprehensionQuestions = spiderInitial.comprehensionQuestions;
          changed = true;
        }
        if ((texts[idx].vocabularyCheckQuestions?.length || 0) < 10) {
          texts[idx].vocabularyCheckQuestions = spiderInitial.vocabularyCheckQuestions;
          changed = true;
        }
        if ((texts[idx].vocabularyWords?.length || 0) < 10) {
          texts[idx].vocabularyWords = spiderInitial.vocabularyWords;
          changed = true;
        }
        if (changed) {
          safeSet(KEYS.TEXTS, texts);
        }
      } else {
        texts = [spiderInitial, ...texts];
        safeSet(KEYS.TEXTS, texts);
      }
    }
    return texts;
  },

  saveTexts: (texts: ReadingText[]): void => {
    safeSet(KEYS.TEXTS, texts);
  },

  getTextById: (id: string): ReadingText | undefined => {
    const texts = StorageService.getTexts();
    return texts.find(t => t.id === id);
  },

  addText: (text: Omit<ReadingText, 'id'>): ReadingText => {
    const texts = StorageService.getTexts();
    const newText: ReadingText = {
      ...text,
      id: `text-${Date.now()}`
    };
    StorageService.saveTexts([newText, ...texts]);
    return newText;
  },

  updateText: (text: ReadingText): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => t.id === text.id ? text : t);
    StorageService.saveTexts(updated);
  },

  deleteText: (textId: string): void => {
    const texts = StorageService.getTexts();
    const updated = texts.filter(t => t.id !== textId);
    StorageService.saveTexts(updated);
  },

  // Questions inside a text
  addComprehensionQuestion: (textId: string, question: Omit<ComprehensionQuestion, 'id'>): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => {
      if (t.id === textId) {
        const newQ: ComprehensionQuestion = {
          ...question,
          id: `comp-${Date.now()}`
        };
        return {
          ...t,
          comprehensionQuestions: [...t.comprehensionQuestions, newQ]
        };
      }
      return t;
    });
    StorageService.saveTexts(updated);
  },

  deleteComprehensionQuestion: (textId: string, questionId: string): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => {
      if (t.id === textId) {
        return {
          ...t,
          comprehensionQuestions: t.comprehensionQuestions.filter(q => q.id !== questionId)
        };
      }
      return t;
    });
    StorageService.saveTexts(updated);
  },

  updateComprehensionQuestion: (textId: string, question: ComprehensionQuestion): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => {
      if (t.id === textId) {
        return {
          ...t,
          comprehensionQuestions: t.comprehensionQuestions.map(q => q.id === question.id ? question : q)
        };
      }
      return t;
    });
    StorageService.saveTexts(updated);
  },

  addVocabularyCheckQuestion: (textId: string, question: Omit<VocabularyCheckQuestion, 'id'>): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => {
      if (t.id === textId) {
        const newQ: VocabularyCheckQuestion = {
          ...question,
          id: `vchk-${Date.now()}`
        };
        return {
          ...t,
          vocabularyCheckQuestions: [...t.vocabularyCheckQuestions, newQ]
        };
      }
      return t;
    });
    StorageService.saveTexts(updated);
  },

  updateVocabularyCheckQuestion: (textId: string, question: VocabularyCheckQuestion): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => {
      if (t.id === textId) {
        return {
          ...t,
          vocabularyCheckQuestions: t.vocabularyCheckQuestions.map(q => q.id === question.id ? question : q)
        };
      }
      return t;
    });
    StorageService.saveTexts(updated);
  },

  deleteVocabularyCheckQuestion: (textId: string, questionId: string): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => {
      if (t.id === textId) {
        return {
          ...t,
          vocabularyCheckQuestions: t.vocabularyCheckQuestions.filter(q => q.id !== questionId)
        };
      }
      return t;
    });
    StorageService.saveTexts(updated);
  },

  updateReadingResponsePrompt: (textId: string, prompt: ReadingResponsePrompt): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => {
      if (t.id === textId) {
        return {
          ...t,
          readingResponsePrompt: prompt
        };
      }
      return t;
    });
    StorageService.saveTexts(updated);
  },

  addVocabularyWord: (textId: string, word: VocabularyWord): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => {
      if (t.id === textId) {
        return {
          ...t,
          vocabularyWords: [...t.vocabularyWords, word]
        };
      }
      return t;
    });
    StorageService.saveTexts(updated);
  },

  updateVocabularyWord: (textId: string, oldWord: string, word: VocabularyWord): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => {
      if (t.id === textId) {
        return {
          ...t,
          vocabularyWords: t.vocabularyWords.map(w => w.word.toLowerCase() === oldWord.toLowerCase() ? word : w)
        };
      }
      return t;
    });
    StorageService.saveTexts(updated);
  },

  deleteVocabularyWord: (textId: string, word: string): void => {
    const texts = StorageService.getTexts();
    const updated = texts.map(t => {
      if (t.id === textId) {
        return {
          ...t,
          vocabularyWords: t.vocabularyWords.filter(w => w.word.toLowerCase() !== word.toLowerCase())
        };
      }
      return t;
    });
    StorageService.saveTexts(updated);
  },

  clearNonAnchorTexts: (): ReadingText[] => {
    const spider = INITIAL_READING_TEXTS.find(t => t.id === 'text-spider')!;
    StorageService.saveTexts([spider]);
    return [spider];
  },

  // Grammar Topics
  getGrammarTopics: (): GrammarTopic[] => {
    return safeGet<GrammarTopic[]>(KEYS.GRAMMAR, INITIAL_GRAMMAR_TOPICS);
  },

  saveGrammarTopics: (topics: GrammarTopic[]): void => {
    safeSet(KEYS.GRAMMAR, topics);
  },

  addGrammarTopic: (topic: Omit<GrammarTopic, 'id'>): GrammarTopic => {
    const topics = StorageService.getGrammarTopics();
    const newTopic: GrammarTopic = {
      ...topic,
      id: `gram-${Date.now()}`
    };
    StorageService.saveGrammarTopics([...topics, newTopic]);
    return newTopic;
  },

  updateGrammarTopic: (topic: GrammarTopic): void => {
    const topics = StorageService.getGrammarTopics();
    const updated = topics.map(t => t.id === topic.id ? topic : t);
    StorageService.saveGrammarTopics(updated);
  },

  deleteGrammarTopic: (id: string): void => {
    const topics = StorageService.getGrammarTopics();
    const updated = topics.filter(t => t.id !== id);
    StorageService.saveGrammarTopics(updated);
  },

  addGrammarExercise: (topicId: string, exercise: Omit<GrammarExercise, 'id'>): void => {
    const topics = StorageService.getGrammarTopics();
    const updated = topics.map(t => {
      if (t.id === topicId) {
        const newEx: GrammarExercise = {
          ...exercise,
          id: `ex-${Date.now()}`
        };
        return {
          ...t,
          exercises: [...t.exercises, newEx]
        };
      }
      return t;
    });
    StorageService.saveGrammarTopics(updated);
  },

  // Daily Assignments
  getAssignments: (): DailyAssignment[] => {
    return safeGet<DailyAssignment[]>(KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  },

  saveAssignments: (assignments: DailyAssignment[]): void => {
    safeSet(KEYS.ASSIGNMENTS, assignments);
  },

  getAssignmentByDate: (dateStr: string): DailyAssignment | undefined => {
    const assignments = StorageService.getAssignments();
    return assignments.find(a => a.date === dateStr);
  },

  createAssignment: (assignment: Omit<DailyAssignment, 'id'>): DailyAssignment => {
    const assignments = StorageService.getAssignments();
    const newAssign: DailyAssignment = {
      ...assignment,
      id: `assign-${Date.now()}`
    };
    StorageService.saveAssignments([newAssign, ...assignments]);
    return newAssign;
  },

  // Student Daily Records
  getStudentRecords: (): StudentDailyRecord[] => {
    return safeGet<StudentDailyRecord[]>(KEYS.RECORDS, INITIAL_STUDENT_RECORDS);
  },

  saveStudentRecords: (records: StudentDailyRecord[]): void => {
    safeSet(KEYS.RECORDS, records);
  },

  getRecordForStudentAndDate: (studentId: string, dateStr: string): StudentDailyRecord | undefined => {
    const records = StorageService.getStudentRecords();
    return records.find(r => r.studentId === studentId && r.date === dateStr);
  },

  saveStudentTaskCompletion: (
    studentId: string,
    dateStr: string,
    assignmentId: string,
    task: TaskType,
    details?: {
      readingCompleted?: boolean;
      vocabScore?: { score: number; maxScore: number };
      comprehensionScore?: { score: number; maxScore: number };
      grammarScore?: { score: number; maxScore: number; mode: 'review' | 'test' };
      readingResponseText?: string;
    }
  ): StudentDailyRecord => {
    const records = StorageService.getStudentRecords();
    let record = records.find(r => r.studentId === studentId && r.date === dateStr);
    const now = new Date().toISOString();

    if (!record) {
      record = {
        id: `rec-${Date.now()}`,
        studentId,
        date: dateStr,
        assignmentId,
        completedTasks: [task],
        readingCompleted: !!details?.readingCompleted,
        lastActiveTime: now
      };
      if (details?.vocabScore) {
        record.vocabScore = { ...details.vocabScore, submittedAt: now };
      }
      if (details?.comprehensionScore) {
        record.comprehensionScore = { ...details.comprehensionScore, submittedAt: now };
      }
      if (details?.grammarScore) {
        record.grammarScore = { ...details.grammarScore, submittedAt: now };
      }
      if (details?.readingResponseText) {
        record.readingResponse = {
          text: details.readingResponseText,
          submittedAt: now
        };
      }
      const updated = [record, ...records];
      StorageService.saveStudentRecords(updated);
      return record;
    }

    // Update existing record
    const updatedTasks = Array.from(new Set([...record.completedTasks, task]));
    const updatedRecord: StudentDailyRecord = {
      ...record,
      completedTasks: updatedTasks,
      lastActiveTime: now
    };

    if (details?.readingCompleted !== undefined) {
      updatedRecord.readingCompleted = details.readingCompleted;
    }
    if (details?.vocabScore) {
      updatedRecord.vocabScore = { ...details.vocabScore, submittedAt: now };
    }
    if (details?.comprehensionScore) {
      updatedRecord.comprehensionScore = { ...details.comprehensionScore, submittedAt: now };
    }
    if (details?.grammarScore) {
      updatedRecord.grammarScore = { ...details.grammarScore, submittedAt: now };
    }
    if (details?.readingResponseText) {
      updatedRecord.readingResponse = {
        ...(record.readingResponse || {}),
        text: details.readingResponseText,
        submittedAt: now
      };
    }

    const updated = records.map(r => (r.id === record!.id ? updatedRecord : r));
    StorageService.saveStudentRecords(updated);

    // Start streak as soon as student starts practicing in this portal!
    const students = StorageService.getStudents();
    const student = students.find(s => s.id === studentId);
    if (student && student.streakDays === 0) {
      student.streakDays = 1;
      StorageService.updateStudent(student);
    }

    return updatedRecord;
  },

  // Teacher grading response
  gradeReadingResponse: (
    recordId: string,
    grade: number,
    feedback: string,
    rubricRatings?: { content: number; vocabulary: number; grammar: number; effort: number }
  ): void => {
    const records = StorageService.getStudentRecords();
    const updated = records.map(r => {
      if (r.id === recordId && r.readingResponse) {
        return {
          ...r,
          readingResponse: {
            ...r.readingResponse,
            teacherGrade: grade,
            teacherFeedback: feedback,
            gradedAt: new Date().toISOString(),
            rubricRatings
          }
        };
      }
      return r;
    });
    StorageService.saveStudentRecords(updated);
  }
};
