export type RoleMode = 'teacher' | 'student';

export interface Student {
  id: string;
  name: string;
  email: string;
  gradeLevel: string; // e.g. "Grade 7-A", "ESL Intermediate B1"
  avatarColor: string;
  avatarSeed: string;
  joinedDate: string;
  streakDays: number;
  learningGoal: string;
  notes: string;
  status: 'active' | 'needs_attention' | 'excused';
}

export type TaskType = 'reading' | 'vocab' | 'comprehension' | 'response' | 'grammar';

export interface DailyAssignment {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  textId: string;
  grammarTopicId: string;
  requiredTasks: TaskType[];
  dueDate: string;
}

export interface StudentDailyRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  assignmentId: string;
  completedTasks: TaskType[];
  readingCompleted: boolean;
  vocabScore?: { score: number; maxScore: number; submittedAt: string };
  comprehensionScore?: { score: number; maxScore: number; submittedAt: string };
  grammarScore?: { score: number; maxScore: number; mode: 'review' | 'test'; submittedAt: string };
  readingResponse?: {
    text: string;
    submittedAt: string;
    teacherGrade?: number; // e.g. 9 out of 10
    teacherFeedback?: string;
    gradedAt?: string;
    rubricRatings?: {
      content: number; // 1-5
      vocabulary: number; // 1-5
      grammar: number; // 1-5
      effort: number; // 1-5
    };
  };
  lastActiveTime?: string;
}

export interface VocabularyWord {
  word: string;
  partOfSpeech: string;
  definition: string;
  exampleSentence: string;
  pronunciation?: string;
  translationRu?: string; // Russian translation
  translationZh?: string; // Chinese translation
  pinyin?: string;        // Pinyin pronunciation for Chinese
}

export interface ComprehensionQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[]; // for multiple choice & true_false
  correctAnswer: string | number; // index (0,1,2,3) or text
  explanation: string;
  points: number;
}

export interface VocabularyCheckQuestion {
  id: string;
  type: 'definition_match' | 'fill_in_blank' | 'synonym';
  prompt: string;
  options: string[];
  correctAnswer: string;
  targetWord: string;
  explanation: string;
  points: number;
}

export interface ReadingResponsePrompt {
  id: string;
  title: string;
  promptText: string;
  guidingQuestions: string[];
  minWords: number;
  sampleExemplar?: string;
}

export interface ReadingText {
  id: string;
  title: string;
  author: string;
  genre: 'Short Story' | 'Informational Article' | 'Historical Tale' | 'Poetry & Fable' | 'Science & Nature' | 'Biography';
  level: 'Beginner (A1-A2)' | 'Intermediate (B1)' | 'Upper-Intermediate (B2)' | 'Advanced (C1)';
  lexileLevel: string; // e.g., "780L • Grade 7"
  readTimeMinutes: number;
  summary: string;
  content: string; // Multi-paragraph markdown or text
  vocabularyWords: VocabularyWord[];
  comprehensionQuestions: ComprehensionQuestion[];
  vocabularyCheckQuestions: VocabularyCheckQuestion[];
  readingResponsePrompt: ReadingResponsePrompt;
  coverImageTheme: string;
  assignedDate?: string;
}

export interface GrammarRule {
  ruleTitle: string;
  ruleExplanation: string;
  formula?: string;
  examples: Array<{
    sentence: string;
    highlight: string;
    isCorrect: boolean;
    note?: string;
  }>;
  commonMistakeTip?: string;
}

export interface GrammarExercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'sentence_correction';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string;
  explanation: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface GrammarTopic {
  id: string;
  title: string;
  category: 'Tenses' | 'Sentence Structure' | 'Verbs & Modals' | 'Punctuation & Clauses' | 'Modifiers & Prepositions';
  level: string;
  overview: string;
  rules: GrammarRule[];
  exercises: GrammarExercise[];
  testDurationMinutes: number;
}
