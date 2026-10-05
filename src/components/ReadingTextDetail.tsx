import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Headphones,
  BookOpen,
  FileQuestion,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  HelpCircle,
  Send,
  Clock,
  BookMarked,
  X,
  Star,
  MessageSquare,
  Languages,
  Search,
  Loader2,
  CalendarCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  ReadingText,
  RoleMode,
  Student,
  StudentDailyRecord,
  ComprehensionQuestion,
  VocabularyCheckQuestion,
  VocabularyWord,
  ReadingResponsePrompt
} from '../types';
import { speechService, SpeechStatus } from '../utils/speech';
import { translateText } from '../utils/translator';

interface ReadingTextDetailProps {
  text: ReadingText;
  onBack: () => void;
  roleMode: RoleMode;
  activeStudent: Student;
  currentDateRecord?: StudentDailyRecord;
  onSaveStudentTask: (
    task: 'reading' | 'vocab' | 'comprehension' | 'response',
    details?: {
      readingCompleted?: boolean;
      vocabScore?: { score: number; maxScore: number };
      comprehensionScore?: { score: number; maxScore: number };
      readingResponseText?: string;
    }
  ) => void;
  onAddComprehensionQ: (textId: string, q: Omit<ComprehensionQuestion, 'id'>) => void;
  onDeleteComprehensionQ: (textId: string, qId: string) => void;
  onAddVocabCheckQ: (textId: string, q: Omit<VocabularyCheckQuestion, 'id'>) => void;
  onDeleteVocabCheckQ: (textId: string, qId: string) => void;
  onUpdateResponsePrompt: (textId: string, prompt: ReadingResponsePrompt) => void;
  onAddVocabWord: (textId: string, word: VocabularyWord) => void;
  onDeleteVocabWord?: (textId: string, word: string) => void;
  onUpdateText?: (updatedText: ReadingText) => void;
  onDeleteText?: (textId: string) => void;
  onAssignTextToday?: (textId: string) => void;
  isAssignedToday?: boolean;
  allRecords: StudentDailyRecord[];
  allStudents: Student[];
  onOpenGrading: (recordId: string) => void;
  onStartPractice?: () => void;
}

export const ReadingTextDetail: React.FC<ReadingTextDetailProps> = ({
  text,
  onBack,
  roleMode,
  activeStudent,
  currentDateRecord,
  onSaveStudentTask,
  onAddComprehensionQ,
  onDeleteComprehensionQ,
  onAddVocabCheckQ,
  onDeleteVocabCheckQ,
  onUpdateResponsePrompt,
  onAddVocabWord,
  onDeleteVocabWord,
  onUpdateText,
  onDeleteText,
  onAssignTextToday,
  isAssignedToday,
  allRecords,
  allStudents,
  onOpenGrading,
  onStartPractice
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'comprehension' | 'vocab' | 'response'>('text');

  // Speech TTS state for audio reading books
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [currentSentenceText, setCurrentSentenceText] = useState<string>('');
  const [totalSentences, setTotalSentences] = useState<number>(0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  // Selected vocabulary term modal
  const [activeVocabWord, setActiveVocabWord] = useState<VocabularyWord | null>(null);

  // Translation feature states (for highlighting & clicking ANY word)
  const [highlightSelection, setHighlightSelection] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const [activeTranslation, setActiveTranslation] = useState<{
    original: string;
    russian: string;
    chinese: string;
    pinyin?: string;
    definition?: string;
    partOfSpeech?: string;
    exampleSentence?: string;
  } | null>(null);

  const [isTranslating, setIsTranslating] = useState(false);
  const [quickSearchWord, setQuickSearchWord] = useState('');

  // Interactive Quiz state: Comprehension
  const [selectedCompAnswers, setSelectedCompAnswers] = useState<Record<string, number>>({});
  const [compQuizSubmitted, setCompQuizSubmitted] = useState(false);

  // Interactive Quiz state: Vocab Check
  const [selectedVocabAnswers, setSelectedVocabAnswers] = useState<Record<string, string>>({});
  const [vocabQuizSubmitted, setVocabQuizSubmitted] = useState(false);

  // Reading Response writing state
  const [responseText, setResponseText] = useState(
    currentDateRecord?.readingResponse?.text || ''
  );
  const [responseSavedNotice, setResponseSavedNotice] = useState(false);

  // Modals for Teacher
  const [isAddingCompQ, setIsAddingCompQ] = useState(false);
  const [isAddingVocabQ, setIsAddingVocabQ] = useState(false);
  const [isAddingVocabWord, setIsAddingVocabWord] = useState(false);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [isEditingTextContent, setIsEditingTextContent] = useState(false);

  // Text container ref
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Subscribe to speech synthesis events
  useEffect(() => {
    const voices = speechService.getAvailableVoices();
    setAvailableVoices(voices);

    const unsubscribe = speechService.subscribe((status: SpeechStatus) => {
      setIsPlayingAudio(status.speaking);
      setIsPausedAudio(status.paused);
      setCurrentSentenceIndex(status.currentSentenceIndex);
      setCurrentSentenceText(status.currentSentenceText);
      setTotalSentences(status.totalSentences);
      setSelectedVoiceName(status.selectedVoiceName);
    });
    return () => {
      speechService.stop();
      unsubscribe();
    };
  }, []);

  // Update responseText if student record changes
  useEffect(() => {
    if (currentDateRecord?.readingResponse?.text) {
      setResponseText(currentDateRecord.readingResponse.text);
    }
  }, [currentDateRecord]);

  // Audio actions for reading books
  const handlePlayAudio = (startIndex = 0) => {
    onStartPractice?.();
    if (isPausedAudio && (startIndex === undefined || startIndex === currentSentenceIndex)) {
      speechService.resume();
    } else {
      speechService.playBook(text.content, startIndex, speechRate);
    }
  };

  const handlePauseAudio = () => {
    speechService.pause();
  };

  const handleStopAudio = () => {
    speechService.stop();
  };

  const handleSkipNext = () => {
    speechService.skipNext();
  };

  const handleSkipPrev = () => {
    speechService.skipPrev();
  };

  const handleRateChange = (newRate: number) => {
    setSpeechRate(newRate);
    speechService.setRate(newRate);
  };

  const handleVoiceChange = (voiceName: string) => {
    speechService.setVoiceByName(voiceName);
    setSelectedVoiceName(voiceName);
  };

  const handlePlayFromParagraph = (paragraphText: string) => {
    onStartPractice?.();
    speechService.playFromText(text.content, paragraphText, speechRate);
  };

  const handleMarkAsRead = () => {
    onStartPractice?.();
    onSaveStudentTask('reading', { readingCompleted: true });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  // Selection detection for mouse highlighting
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      // Delay closing slightly so clicking the floating button works
      setTimeout(() => {
        if (!window.getSelection()?.toString().trim()) {
          setHighlightSelection(null);
        }
      }, 150);
      return;
    }

    const selectedStr = selection.toString().trim();
    if (selectedStr.length > 0 && selectedStr.length <= 120) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setHighlightSelection({
        text: selectedStr,
        x: Math.max(10, rect.left + rect.width / 2),
        y: Math.max(10, rect.top - 12)
      });
    } else {
      setHighlightSelection(null);
    }
  };

  // Perform translation on highlighted or clicked word
  const handleTranslateWord = async (rawWord: string) => {
    const cleanWord = rawWord.trim().replace(/^[.,!?;:"'()]+|[.,!?;:"'()]+$/g, '');
    if (!cleanWord) return;

    setIsTranslating(true);

    // Check if it's already in text's vocabularyWords
    const matchedVocab = text.vocabularyWords.find(
      v => v.word.toLowerCase() === cleanWord.toLowerCase()
    );

    if (matchedVocab && matchedVocab.translationRu && matchedVocab.translationZh) {
      setActiveTranslation({
        original: matchedVocab.word,
        russian: matchedVocab.translationRu,
        chinese: matchedVocab.translationZh,
        pinyin: matchedVocab.pinyin,
        definition: matchedVocab.definition,
        partOfSpeech: matchedVocab.partOfSpeech,
        exampleSentence: matchedVocab.exampleSentence
      });
      setIsTranslating(false);
      setHighlightSelection(null);
      return;
    }

    // Otherwise use translation service
    const result = await translateText(cleanWord);
    setActiveTranslation({
      original: result.original,
      russian: result.russian,
      chinese: result.chinese,
      pinyin: result.pinyin,
      definition: result.definition || matchedVocab?.definition,
      partOfSpeech: result.partOfSpeech || matchedVocab?.partOfSpeech,
      exampleSentence: matchedVocab?.exampleSentence
    });

    setIsTranslating(false);
    setHighlightSelection(null);
  };

  const handleTranslateSelection = (selectedText: string) => {
    handleTranslateWord(selectedText);
  };

  // Submit Comprehension Quiz
  const handleSubmitCompQuiz = () => {
    let earnedPoints = 0;
    let maxPoints = 0;

    text.comprehensionQuestions.forEach(q => {
      maxPoints += q.points;
      const userAns = selectedCompAnswers[q.id];
      if (userAns !== undefined && userAns === q.correctAnswer) {
        earnedPoints += q.points;
      }
    });

    setCompQuizSubmitted(true);
    onSaveStudentTask('comprehension', {
      comprehensionScore: { score: earnedPoints, maxScore: maxPoints }
    });

    if (earnedPoints >= maxPoints * 0.8) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Submit Vocab Quiz
  const handleSubmitVocabQuiz = () => {
    let earnedPoints = 0;
    let maxPoints = 0;

    text.vocabularyCheckQuestions.forEach(q => {
      maxPoints += q.points;
      const userAns = selectedVocabAnswers[q.id];
      if (userAns && userAns.toLowerCase() === q.correctAnswer.toLowerCase()) {
        earnedPoints += q.points;
      }
    });

    setVocabQuizSubmitted(true);
    onSaveStudentTask('vocab', {
      vocabScore: { score: earnedPoints, maxScore: maxPoints }
    });

    if (earnedPoints >= maxPoints * 0.8) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Submit Response
  const handleSubmitResponse = () => {
    if (!responseText.trim()) return;

    onSaveStudentTask('response', {
      readingResponseText: responseText
    });

    setResponseSavedNotice(true);
    confetti({ particleCount: 60, spread: 80, origin: { y: 0.7 } });
    setTimeout(() => setResponseSavedNotice(false), 4000);
  };

  const wordCount = responseText.trim() ? responseText.trim().split(/\s+/).length : 0;
  const targetWords = text.readingResponsePrompt.minWords || 80;

  // Render text content with highlighted vocabulary terms, clickable words, and audio synchronization
  const renderFormattedContent = () => {
    const vocabMap = new Map<string, VocabularyWord>();
    text.vocabularyWords.forEach(v => vocabMap.set(v.word.toLowerCase(), v));

    const paragraphs = text.content.split('\n\n');

    return paragraphs.map((para, pIdx) => {
      const tokens = para.split(/(\s+|[.,!?;:"'()]+)/);

      // Check if this paragraph or entry is currently being spoken
      const isSpeakingThisPara =
        isPlayingAudio &&
        currentSentenceText &&
        (para.toLowerCase().includes(currentSentenceText.trim().toLowerCase().slice(0, 15)) ||
          currentSentenceText.toLowerCase().includes(para.trim().toLowerCase().slice(0, 15)));

      const lines = para.split('\n');
      const isDateHeader = /^(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s+\d+/i.test(lines[0].trim());

      return (
        <div
          key={pIdx}
          className={`mb-5 rounded-2xl transition-all duration-300 relative group ${
            isSpeakingThisPara
              ? 'bg-amber-100/90 border-l-4 border-amber-500 pl-4 pr-3 py-3 shadow-md ring-2 ring-amber-400/30'
              : 'hover:bg-slate-50/70 p-2 sm:p-3'
          }`}
        >
          {/* Paragraph / Entry Audio control badge */}
          <div className="flex items-center justify-between mb-1.5">
            {isDateHeader ? (
              <span className="font-extrabold text-amber-900 text-xs sm:text-sm tracking-wider uppercase flex items-center gap-1.5">
                <span>📅 {lines[0]}</span>
                {isSpeakingThisPara && (
                  <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] animate-pulse flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    <span>Speaking now</span>
                  </span>
                )}
              </span>
            ) : isSpeakingThisPara ? (
              <span className="bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] animate-pulse flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                <span>Speaking now</span>
              </span>
            ) : (
              <span />
            )}

            <button
              type="button"
              onClick={() => handlePlayFromParagraph(para)}
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-[11px] font-semibold text-slate-500 hover:text-amber-800 bg-white/90 hover:bg-amber-100 border border-slate-200 hover:border-amber-300 rounded-lg px-2 py-0.5 flex items-center gap-1 shadow-xs cursor-pointer"
              title="Listen to this section"
            >
              <Headphones className="w-3.5 h-3.5 text-amber-600" />
              <span>Listen from here</span>
            </button>
          </div>

          <p className="text-slate-800 text-base leading-relaxed font-serif select-text">
            {tokens.map((token, tIdx) => {
              const cleanToken = token.toLowerCase().replace(/[^a-z]/g, '');
              const vocab = vocabMap.get(cleanToken);

              if (vocab) {
                return (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => {
                      setActiveVocabWord(vocab);
                      handleTranslateWord(vocab.word);
                    }}
                    className="font-semibold text-amber-950 bg-amber-200/80 hover:bg-amber-300 border-b-2 border-amber-600 rounded px-1 transition-all cursor-pointer inline-block mx-0.5"
                    title="Click to see definition & translations in 🇷🇺 Russian & 🇨🇳 Chinese"
                  >
                    {token}
                  </button>
                );
              }

              // Normal word: clickable to translate
              if (cleanToken.length > 2 && /^[a-zA-Z]+$/.test(token)) {
                return (
                  <span
                    key={tIdx}
                    onClick={() => handleTranslateWord(cleanToken)}
                    className="cursor-pointer hover:bg-blue-100 hover:text-blue-900 rounded px-0.5 transition-colors"
                    title="Click to translate into 🇷🇺 Russian & 🇨🇳 Chinese"
                  >
                    {token}
                  </span>
                );
              }

              return <React.Fragment key={tIdx}>{token}</React.Fragment>;
            })}
          </p>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reading Texts</span>
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          {roleMode === 'teacher' && onAssignTextToday && (
            isAssignedToday ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Assigned to Classroom Today</span>
              </span>
            ) : (
              <button
                onClick={() => onAssignTextToday(text.id)}
                className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
                title="Set this story as today's active assignment"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Assign to Classroom Today</span>
              </button>
            )
          )}

          {roleMode === 'teacher' && onUpdateText && (
            <button
              onClick={() => setIsEditingTextContent(true)}
              className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-700" />
              <span>Edit Text</span>
            </button>
          )}

          {roleMode === 'teacher' && onDeleteText && text.id !== 'text-spider' && (
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to permanently delete "${text.title}"?`)) {
                  onDeleteText(text.id);
                  onBack();
                }
              }}
              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Delete this text from curriculum"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Story</span>
            </button>
          )}

          <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-semibold border border-slate-200">
            {text.genre} • {text.level}
          </span>
          <span className="bg-amber-50 text-amber-800 text-xs px-2.5 py-1 rounded-md font-semibold border border-amber-200">
            {text.lexileLevel}
          </span>
        </div>
      </div>

      {/* Teacher Curriculum Quick-Bar */}
      {roleMode === 'teacher' && (
        <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded text-[11px] uppercase tracking-wide">
              Teacher Tools
            </span>
            <span className="text-slate-300">Add or edit learning components for this story:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setActiveTab('comprehension');
                setIsAddingCompQ(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Comprehension Check</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('vocab');
                setIsAddingVocabQ(true);
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Vocabulary Check</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('text');
                setIsAddingVocabWord(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Vocabulary Word</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('response');
                setIsEditingPrompt(true);
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>✏️ Reading Response</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Text Header Card */}
      <div className={`rounded-2xl p-6 bg-gradient-to-r ${text.coverImageTheme || 'from-slate-800 to-indigo-950'} text-white shadow-md relative overflow-hidden`}>
        <div className="max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold uppercase tracking-wider">
            <span>Reading Text Page</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {text.readTimeMinutes} min read
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
            {text.title}
          </h1>

          <p className="text-sm text-slate-300">By {text.author}</p>
          <p className="text-xs text-slate-200/90 max-w-2xl leading-relaxed pt-1">
            {text.summary}
          </p>
        </div>
      </div>

      {/* 4 Dedicated Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-none bg-slate-50/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'text'
                ? 'bg-white text-slate-900 shadow border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>1. Reading Text</span>
            {currentDateRecord?.readingCompleted && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('vocab')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'vocab'
                ? 'bg-white text-slate-900 shadow border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>2. Vocabulary Check ({text.vocabularyCheckQuestions.length})</span>
            {currentDateRecord?.vocabScore && (
              <span className="text-[11px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                {currentDateRecord.vocabScore.score}/{currentDateRecord.vocabScore.maxScore}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('comprehension')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'comprehension'
                ? 'bg-white text-slate-900 shadow border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileQuestion className="w-4 h-4 text-blue-600" />
            <span>3. Comprehension Quiz ({text.comprehensionQuestions.length})</span>
            {currentDateRecord?.comprehensionScore && (
              <span className="text-[11px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                {currentDateRecord.comprehensionScore.score}/{currentDateRecord.comprehensionScore.maxScore}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('response')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'response'
                ? 'bg-white text-slate-900 shadow border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-rose-600" />
            <span>4. Reading Response Journal</span>
            {currentDateRecord?.readingResponse?.teacherGrade !== undefined ? (
              <span className="text-[11px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                {currentDateRecord.readingResponse.teacherGrade}/10 ⭐
              </span>
            ) : currentDateRecord?.readingResponse ? (
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                Submitted
              </span>
            ) : null}
          </button>
        </div>

        {/* TAB 1: READING TEXT & AUDIO READ-ALOUD & TRANSLATION */}
        {activeTab === 'text' && (
          <div className="p-6 space-y-6">
            {/* Audio Book Reader Narration Deck */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl border border-slate-800 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Audio Book Reader (Listen Aloud)</span>
                      </h4>
                      {isPlayingAudio && !isPausedAudio && (
                        <div className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <span className="flex items-end gap-0.5 h-3">
                            <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2"></span>
                            <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite] h-3"></span>
                            <span className="w-1 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-1.5"></span>
                          </span>
                          <span>Reading Sentence {currentSentenceIndex + 1} of {totalSentences || 1}</span>
                        </div>
                      )}
                      {isPlayingAudio && isPausedAudio && (
                        <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          Narration Paused
                        </span>
                      )}
                      {!isPlayingAudio && (
                        <span className="bg-slate-800 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-slate-700">
                          Web Speech Audio Ready
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Clear native English pronunciation. Follow along with real-time text highlight as the story is read.
                    </p>
                  </div>
                </div>

                {/* Primary Audio Transport Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  {isPlayingAudio && (
                    <button
                      onClick={handleSkipPrev}
                      className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                      title="Previous sentence"
                    >
                      <SkipBack className="w-4 h-4" />
                    </button>
                  )}

                  {!isPlayingAudio ? (
                    <button
                      onClick={() => handlePlayAudio(0)}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-2xl text-xs sm:text-sm transition-all shadow-lg hover:shadow-amber-500/25 cursor-pointer"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Listening to Book</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handlePauseAudio}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition-all border border-slate-700 shadow-sm cursor-pointer"
                      >
                        {isPausedAudio ? (
                          <>
                            <Play className="w-4 h-4 fill-current text-amber-400" />
                            <span>Resume</span>
                          </>
                        ) : (
                          <>
                            <Pause className="w-4 h-4 text-amber-400" />
                            <span>Pause</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleSkipNext}
                        className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700 cursor-pointer"
                        title="Next sentence"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleStopAudio}
                        className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold px-3.5 py-2.5 rounded-2xl text-xs transition-all shadow cursor-pointer"
                        title="Stop narration"
                      >
                        <VolumeX className="w-4 h-4" />
                        <span>Stop</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Sub-controls: Speed Presets & Voice Selection */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                {/* Speed Controls */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Narration Speed:</span>
                  </span>
                  <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
                    <button
                      onClick={() => handleRateChange(0.75)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        speechRate === 0.75 ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      0.75x (ESL Slow)
                    </button>
                    <button
                      onClick={() => handleRateChange(0.9)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        speechRate === 0.9 ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      0.9x (Story Mode)
                    </button>
                    <button
                      onClick={() => handleRateChange(1.0)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        speechRate === 1.0 ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      1.0x (Normal)
                    </button>
                    <button
                      onClick={() => handleRateChange(1.25)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        speechRate === 1.25 ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      1.25x
                    </button>
                  </div>
                </div>

                {/* Single Locked Voice: Google US English (en-US) */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Narrator:</span>
                  <div className="bg-slate-800/90 text-amber-300 font-semibold text-xs px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>Google US English (en-US)</span>
                  </div>
                </div>
              </div>

              {/* Real-time Currently Spoken Sentence Display Banner */}
              {isPlayingAudio && currentSentenceText && (
                <div className="bg-amber-500/10 border border-amber-400/30 rounded-2xl p-3 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider block">
                      Currently Spoken Sentence:
                    </span>
                    <p className="text-xs text-amber-100 font-medium italic mt-0.5 leading-relaxed">
                      &ldquo;{currentSentenceText}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Translation & Reading Helper Banner */}
            <div className="bg-gradient-to-r from-blue-50 via-amber-50/60 to-emerald-50/60 border border-blue-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Languages className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span>Instant Multilingual Reader: English → 🇷🇺 Русский & 🇨🇳 中文</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Click or highlight <strong>any word or phrase</strong> to see its definition, pronunciation, and instant translation into Russian & Chinese!
                  </p>
                </div>
              </div>

              {/* Quick Word Lookup Input */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Translate any word..."
                    value={quickSearchWord}
                    onChange={e => setQuickSearchWord(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && quickSearchWord.trim()) {
                        handleTranslateWord(quickSearchWord);
                      }
                    }}
                    className="pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-56"
                  />
                </div>
                <button
                  onClick={() => {
                    if (quickSearchWord.trim()) {
                      handleTranslateWord(quickSearchWord);
                    }
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Translate
                </button>
              </div>
            </div>

            {/* Reading Passage with onMouseUp selection handler */}
            <div
              ref={textContainerRef}
              onMouseUp={handleMouseUp}
              className="relative bg-amber-50/20 p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs"
            >
              {renderFormattedContent()}
            </div>

            {/* Floating Highlight Translation Tooltip */}
            {highlightSelection && (
              <div
                style={{
                  position: 'fixed',
                  left: `${highlightSelection.x}px`,
                  top: `${highlightSelection.y - 45}px`,
                  transform: 'translateX(-50%)'
                }}
                className="z-50 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-2xl border border-amber-400 flex items-center gap-2 animate-scale-in text-xs font-bold cursor-pointer hover:bg-slate-800"
                onClick={() => handleTranslateSelection(highlightSelection.text)}
              >
                <Languages className="w-4 h-4 text-amber-400" />
                <span>Translate &ldquo;{highlightSelection.text.length > 20 ? highlightSelection.text.slice(0, 18) + '...' : highlightSelection.text}&rdquo;</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1 rounded">🇷🇺 / 🇨🇳</span>
              </div>
            )}

            {/* Mark as Completed Reading button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Finished reading the text? Mark it as complete to advance your daily checklist.</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkAsRead}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                    currentDateRecord?.readingCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{currentDateRecord?.readingCompleted ? 'Completed ✓' : 'Mark as Read'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('vocab')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <span>Go to Vocab Check</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Vocabulary Bank Glossary Cards with Russian & Chinese translations */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-amber-600" />
                  <span>Vocabulary Bank for this Text ({text.vocabularyWords.length} words with 🇷🇺 & 🇨🇳)</span>
                </h3>

                {roleMode === 'teacher' && (
                  <button
                    onClick={() => setIsAddingVocabWord(true)}
                    className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Word</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {text.vocabularyWords.map((v, i) => (
                  <div key={i} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm capitalize">{v.word}</span>
                        <span className="text-[11px] text-slate-400 italic">({v.partOfSpeech})</span>
                        {v.pronunciation && (
                          <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                            {v.pronunciation}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => speechService.speakWord(v.word)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        {roleMode === 'teacher' && onDeleteVocabWord && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove vocabulary word "${v.word}" from this text?`)) {
                                onDeleteVocabWord(text.id, v.word);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete this vocabulary word"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Dual Translations Badges */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-50/80 p-2 rounded-xl border border-blue-100 space-y-0.5">
                        <span className="text-[10px] font-bold text-blue-900 flex items-center gap-1">
                          <span>🇷🇺 Русский:</span>
                        </span>
                        <p className="font-semibold text-blue-950 text-xs">
                          {v.translationRu || 'Линять, сбрасывать кожу'}
                        </p>
                      </div>

                      <div className="bg-rose-50/80 p-2 rounded-xl border border-rose-100 space-y-0.5">
                        <span className="text-[10px] font-bold text-rose-900 flex items-center gap-1">
                          <span>🇨🇳 中文:</span>
                          {v.pinyin && <span className="text-slate-500 font-normal">({v.pinyin})</span>}
                        </span>
                        <p className="font-semibold text-rose-950 text-xs">
                          {v.translationZh || '蜕皮'}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{v.definition}</p>
                    <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      &ldquo;{v.exampleSentence}&rdquo;
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VOCABULARY CHECK QUESTIONS */}
        {activeTab === 'vocab' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/60 p-4 rounded-xl border border-amber-200">
              <div>
                <h3 className="font-bold text-amber-950 text-sm">Vocabulary Check Assessment</h3>
                <p className="text-xs text-amber-900 mt-0.5">
                  Test your understanding of the key words introduced in this text through matching and context questions.
                </p>
              </div>

              {roleMode === 'teacher' && (
                <button
                  onClick={() => setIsAddingVocabQ(true)}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow w-fit"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Vocab Question</span>
                </button>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {text.vocabularyCheckQuestions.map((q, idx) => {
                const userSelected = selectedVocabAnswers[q.id];

                return (
                  <div key={q.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{q.prompt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {q.points} pts
                        </span>
                        {roleMode === 'teacher' && (
                          <button
                            onClick={() => onDeleteVocabCheckQ(text.id, q.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            title="Delete question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = userSelected === opt;
                        const isRightAnswer = opt.toLowerCase() === q.correctAnswer.toLowerCase();

                        let optClasses = 'border-slate-200 hover:bg-slate-50 text-slate-700';
                        if (vocabQuizSubmitted) {
                          if (isRightAnswer) {
                            optClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isChosen && !isRightAnswer) {
                            optClasses = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                          }
                        } else if (isChosen) {
                          optClasses = 'bg-amber-100 border-amber-500 text-amber-950 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              if (!vocabQuizSubmitted) {
                                setSelectedVocabAnswers(prev => ({ ...prev, [q.id]: opt }));
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${optClasses}`}
                          >
                            <span>{opt}</span>
                            {vocabQuizSubmitted && isRightAnswer && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                            )}
                            {vocabQuizSubmitted && isChosen && !isRightAnswer && (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after submission or in teacher mode */}
                    {(vocabQuizSubmitted || roleMode === 'teacher') && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-800 block">
                          Teacher Explanation:
                        </span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {text.vocabularyCheckQuestions.length === 0 && (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl">
                  No vocabulary check questions created yet for this text.
                </div>
              )}
            </div>

            {/* Submit Vocab Quiz Button */}
            {text.vocabularyCheckQuestions.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  {vocabQuizSubmitted && currentDateRecord?.vocabScore && (
                    <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        Quiz Completed! Score: {currentDateRecord.vocabScore.score}/{currentDateRecord.vocabScore.maxScore}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmitVocabQuiz}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow"
                >
                  {vocabQuizSubmitted ? 'Re-calculate Score' : 'Submit Vocabulary Check'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMPREHENSION QUESTIONS */}
        {activeTab === 'comprehension' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-blue-50/60 p-4 rounded-xl border border-blue-200">
              <div>
                <h3 className="font-bold text-blue-950 text-sm">Reading Comprehension Questions</h3>
                <p className="text-xs text-blue-900 mt-0.5">
                  Demonstrate your understanding of plot, main characters, themes, and inferences.
                </p>
              </div>

              {roleMode === 'teacher' && (
                <button
                  onClick={() => setIsAddingCompQ(true)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow w-fit"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Comprehension Question</span>
                </button>
              )}
            </div>

            {/* Comprehension Questions List */}
            <div className="space-y-4">
              {text.comprehensionQuestions.map((q, idx) => {
                const userChoice = selectedCompAnswers[q.id];

                return (
                  <div key={q.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{q.question}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {q.points} pts
                        </span>
                        {roleMode === 'teacher' && (
                          <button
                            onClick={() => onDeleteComprehensionQ(text.id, q.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded"
                            title="Delete question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options?.map((opt, optIdx) => {
                        const isChosen = userChoice === optIdx;
                        const isCorrectOption = optIdx === q.correctAnswer;

                        let optClasses = 'border-slate-200 hover:bg-slate-50 text-slate-700';
                        if (compQuizSubmitted) {
                          if (isCorrectOption) {
                            optClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                          } else if (isChosen && !isCorrectOption) {
                            optClasses = 'bg-rose-50 border-rose-400 text-rose-800 line-through';
                          }
                        } else if (isChosen) {
                          optClasses = 'bg-blue-100 border-blue-500 text-blue-950 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => {
                              if (!compQuizSubmitted) {
                                setSelectedCompAnswers(prev => ({ ...prev, [q.id]: optIdx }));
                              }
                            }}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${optClasses}`}
                          >
                            <span>{opt}</span>
                            {compQuizSubmitted && isCorrectOption && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                            )}
                            {compQuizSubmitted && isChosen && !isCorrectOption && (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {(compQuizSubmitted || roleMode === 'teacher') && (
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-800 block">
                          Ms. Venera&#39;s Answer Key & Insight:
                        </span>
                        <p>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}

              {text.comprehensionQuestions.length === 0 && (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl">
                  No comprehension questions added yet. Click &ldquo;Add Comprehension Question&rdquo; to create one!
                </div>
              )}
            </div>

            {/* Submit Comprehension Quiz */}
            {text.comprehensionQuestions.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div>
                  {compQuizSubmitted && currentDateRecord?.comprehensionScore && (
                    <div className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        Comprehension Checked! Score: {currentDateRecord.comprehensionScore.score}/{currentDateRecord.comprehensionScore.maxScore}
                      </span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSubmitCompQuiz}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-all shadow"
                >
                  {compQuizSubmitted ? 'Re-calculate Quiz Score' : 'Submit Comprehension Answers'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: READING RESPONSE PAGE */}
        {activeTab === 'response' && (
          <div className="p-6 space-y-6">
            {/* Prompt Box */}
            <div className="bg-gradient-to-br from-rose-50/80 via-white to-amber-50/50 p-5 rounded-2xl border border-rose-200/80 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider bg-rose-100 border border-rose-200 px-2 py-0.5 rounded">
                    Teacher Writing Prompt
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {text.readingResponsePrompt.title}
                  </h3>
                </div>

                {roleMode === 'teacher' && (
                  <button
                    onClick={() => setIsEditingPrompt(true)}
                    className="flex items-center gap-1 text-xs bg-white border border-rose-300 text-rose-800 hover:bg-rose-50 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Prompt</span>
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {text.readingResponsePrompt.promptText}
              </p>

              {/* Guiding Questions */}
              {text.readingResponsePrompt.guidingQuestions?.length > 0 && (
                <div className="bg-white/80 rounded-xl p-3 border border-rose-100 space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 block">
                    Guiding Questions to Answer:
                  </span>
                  <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                    {text.readingResponsePrompt.guidingQuestions.map((gq, i) => (
                      <li key={i}>{gq}</li>
                    ))}
                  </ul>
                </div>
              )}

              {text.readingResponsePrompt.sampleExemplar && (
                <div className="text-[11px] text-slate-600 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                  <span className="font-bold text-amber-900 block mb-0.5">🌟 Sample Teacher Exemplar:</span>
                  <p className="italic leading-relaxed">&ldquo;{text.readingResponsePrompt.sampleExemplar}&rdquo;</p>
                </div>
              )}
            </div>

            {/* If Teacher is viewing: show student responses submitted for this text */}
            {roleMode === 'teacher' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <span>Student Responses Submitted for this Text</span>
                  </h4>
                  <span className="text-xs text-slate-500">
                    {allRecords.filter(r => r.readingResponse).length} submissions
                  </span>
                </div>

                <div className="space-y-3">
                  {allRecords
                    .filter(r => r.readingResponse)
                    .map(rec => {
                      const student = allStudents.find(s => s.id === rec.studentId);
                      const resp = rec.readingResponse!;

                      return (
                        <div key={rec.id} className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{student?.name || 'Student'}</span>
                              <span className="text-slate-400 text-[11px]">({rec.date})</span>
                            </div>

                            {resp.teacherGrade !== undefined ? (
                              <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                                Graded: {resp.teacherGrade}/10 ⭐
                              </span>
                            ) : (
                              <button
                                onClick={() => onOpenGrading(rec.id)}
                                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-2.5 py-1 rounded text-xs transition-colors"
                              >
                                Grade This Entry ✍️
                              </button>
                            )}
                          </div>

                          <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded border border-slate-100 text-xs leading-relaxed">
                            &ldquo;{resp.text}&rdquo;
                          </p>

                          {resp.teacherFeedback && (
                            <div className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                              <strong>Your Feedback:</strong> {resp.teacherFeedback}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Interactive Student Response Editor */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Your Response Journal Entry ({activeStudent.name})
                </span>

                <div className="flex items-center gap-2 text-xs">
                  <span className={`font-semibold ${wordCount >= targetWords ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {wordCount} / {targetWords} words
                  </span>
                  {wordCount >= targetWords && (
                    <span className="text-emerald-600 font-bold text-[11px]">✓ Target Met</span>
                  )}
                </div>
              </div>

              <textarea
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                rows={6}
                placeholder="Write your thoughtful response here in English. Use evidence from the story and at least two vocabulary words..."
                className="w-full p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 text-sm leading-relaxed"
              />

              {/* Response feedback from teacher if graded */}
              {currentDateRecord?.readingResponse?.teacherGrade !== undefined && (
                <div className="bg-amber-50/80 border border-amber-300 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span>Ms. Venera&#39;s Grade: {currentDateRecord.readingResponse.teacherGrade} / 10</span>
                    </span>
                    <span className="text-[11px] text-amber-800 font-medium">Evaluated with Rubric</span>
                  </div>

                  <p className="text-xs text-amber-900 italic">
                    &ldquo;{currentDateRecord.readingResponse.teacherFeedback}&rdquo;
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {responseSavedNotice && (
                    <span className="text-emerald-600 font-semibold animate-fade-in">
                      Response successfully submitted to Ms. Venera! 🎉
                    </span>
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSubmitResponse}
                    disabled={!responseText.trim()}
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all shadow flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Response to Ms. Venera</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Multilingual Translation Popup Modal (Russian 🇷🇺 + Chinese 🇨🇳) */}
      {(activeTranslation || isTranslating) && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            {isTranslating ? (
              <div className="py-8 text-center space-y-3">
                <Loader2 className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
                <p className="text-xs text-slate-600 font-medium">
                  Translating into Russian 🇷🇺 and Chinese 🇨🇳...
                </p>
              </div>
            ) : activeTranslation ? (
              <>
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900 capitalize">
                        {activeTranslation.original}
                      </h3>
                      {activeTranslation.partOfSpeech && (
                        <span className="text-xs text-slate-400 italic">
                          ({activeTranslation.partOfSpeech})
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                      <Languages className="w-3.5 h-3.5" /> English Word Translation
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speechService.speakWord(activeTranslation.original)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Listen to pronunciation"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveTranslation(null)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Russian Translation Card */}
                <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <span>🇷🇺</span>
                      <span>Перевод на русский (Russian):</span>
                    </span>
                    <span className="text-[10px] bg-blue-200/80 text-blue-900 px-1.5 py-0.2 rounded font-semibold">
                      Русский
                    </span>
                  </div>
                  <p className="text-base font-bold text-blue-950">
                    {activeTranslation.russian}
                  </p>
                </div>

                {/* Chinese Translation Card */}
                <div className="bg-rose-50/80 p-3.5 rounded-2xl border border-rose-200/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-900 flex items-center gap-1.5">
                      <span>🇨🇳</span>
                      <span>中文翻译 (Chinese):</span>
                    </span>
                    {activeTranslation.pinyin && (
                      <span className="text-[11px] font-mono text-rose-800 bg-rose-200/70 px-1.5 py-0.2 rounded">
                        Pinyin: {activeTranslation.pinyin}
                      </span>
                    )}
                  </div>
                  <p className="text-base font-bold text-rose-950 font-sans">
                    {activeTranslation.chinese}
                  </p>
                </div>

                {/* English Definition & Example */}
                {activeTranslation.definition && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-amber-950 leading-relaxed">
                    <strong className="block mb-0.5 text-amber-900 text-[10px] uppercase font-bold">English Meaning:</strong>
                    {activeTranslation.definition}
                  </div>
                )}

                {activeTranslation.exampleSentence && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 italic">
                    <strong className="block not-italic text-slate-500 mb-0.5 text-[10px] uppercase">Example in Story:</strong>
                    &ldquo;{activeTranslation.exampleSentence}&rdquo;
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveTranslation(null)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow"
                  >
                    Close Translation
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal: Edit Entire Text Content (For Ms. Venera) */}
      {isEditingTextContent && onUpdateText && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Edit Reading Text Content</h3>
                <p className="text-xs text-slate-500">Ms. Venera&#39;s Classroom Editor</p>
              </div>
              <button onClick={() => setIsEditingTextContent(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                const author = (form.elements.namedItem('author') as HTMLInputElement).value;
                const lexileLevel = (form.elements.namedItem('lexileLevel') as HTMLInputElement).value;
                const readTimeMinutes = parseInt((form.elements.namedItem('readTimeMinutes') as HTMLInputElement).value) || 5;
                const summary = (form.elements.namedItem('summary') as HTMLTextAreaElement).value;
                const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;

                onUpdateText({
                  ...text,
                  title,
                  author,
                  lexileLevel,
                  readTimeMinutes,
                  summary,
                  content
                });

                setIsEditingTextContent(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={text.title}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    defaultValue={text.author}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lexile / Grade</label>
                  <input
                    type="text"
                    name="lexileLevel"
                    defaultValue={text.lexileLevel}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Read Time (Minutes)</label>
                  <input
                    type="number"
                    name="readTimeMinutes"
                    defaultValue={text.readTimeMinutes}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Summary</label>
                <textarea
                  name="summary"
                  rows={2}
                  defaultValue={text.summary}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Story / Article Paragraphs</label>
                <textarea
                  name="content"
                  rows={8}
                  defaultValue={text.content}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-serif leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingTextContent(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Save Text Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Comprehension Question */}
      {isAddingCompQ && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Add Comprehension Question</h3>
                <p className="text-xs text-slate-500">For text: {text.title}</p>
              </div>
              <button onClick={() => setIsAddingCompQ(false)} className="text-slate-400 hover:text-slate-600">
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
                const correctIndex = parseInt((form.elements.namedItem('correctIndex') as HTMLSelectElement).value) || 0;
                const explanation = (form.elements.namedItem('explanation') as HTMLTextAreaElement).value;
                const points = parseInt((form.elements.namedItem('points') as HTMLInputElement).value) || 2;

                onAddComprehensionQ(text.id, {
                  type: 'multiple_choice',
                  question,
                  options: [opt1, opt2, opt3, opt4],
                  correctAnswer: correctIndex,
                  explanation,
                  points
                });

                setIsAddingCompQ(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Question Prompt</label>
                <textarea
                  name="question"
                  rows={2}
                  required
                  placeholder="e.g. Why did Maya choose to cross the footbridge despite Leo's hesitation?"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">Answer Choices</label>
                <input
                  type="text"
                  name="opt1"
                  required
                  placeholder="Option A"
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  name="opt2"
                  required
                  placeholder="Option B"
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  name="opt3"
                  required
                  placeholder="Option C"
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  name="opt4"
                  required
                  placeholder="Option D"
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Correct Option</label>
                  <select
                    name="correctIndex"
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="0">Option A</option>
                    <option value="1">Option B</option>
                    <option value="2">Option C</option>
                    <option value="3">Option D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Points Value</label>
                  <input
                    type="number"
                    name="points"
                    min="1"
                    max="10"
                    defaultValue="2"
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ms. Venera&#39;s Answer Explanation</label>
                <textarea
                  name="explanation"
                  rows={2}
                  placeholder="Explain why this answer is correct based on specific paragraph evidence..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingCompQ(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Vocabulary Check Question */}
      {isAddingVocabQ && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Add Vocabulary Check Question</h3>
                <p className="text-xs text-slate-500">Target word verification</p>
              </div>
              <button onClick={() => setIsAddingVocabQ(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const prompt = (form.elements.namedItem('prompt') as HTMLTextAreaElement).value;
                const targetWord = (form.elements.namedItem('targetWord') as HTMLInputElement).value;
                const opt1 = (form.elements.namedItem('opt1') as HTMLInputElement).value;
                const opt2 = (form.elements.namedItem('opt2') as HTMLInputElement).value;
                const opt3 = (form.elements.namedItem('opt3') as HTMLInputElement).value;
                const opt4 = (form.elements.namedItem('opt4') as HTMLInputElement).value;
                const correctAnswer = (form.elements.namedItem('correctAnswer') as HTMLInputElement).value;
                const explanation = (form.elements.namedItem('explanation') as HTMLTextAreaElement).value;

                onAddVocabCheckQ(text.id, {
                  type: 'definition_match',
                  prompt,
                  targetWord,
                  options: [opt1, opt2, opt3, opt4],
                  correctAnswer,
                  explanation,
                  points: 2
                });

                setIsAddingVocabQ(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Word</label>
                <input
                  type="text"
                  name="targetWord"
                  required
                  placeholder="e.g. molt"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Question Prompt</label>
                <textarea
                  name="prompt"
                  rows={2}
                  required
                  placeholder="e.g. Which word describes shedding old skin to make room for new growth?"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">4 Choices (Include Correct Word)</label>
                <input
                  type="text"
                  name="opt1"
                  required
                  placeholder="Option 1"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  name="opt2"
                  required
                  placeholder="Option 2"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  name="opt3"
                  required
                  placeholder="Option 3"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  name="opt4"
                  required
                  placeholder="Option 4"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Exact Correct Answer</label>
                <input
                  type="text"
                  name="correctAnswer"
                  required
                  placeholder="Must match one of the options above"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Explanation</label>
                <textarea
                  name="explanation"
                  rows={2}
                  required
                  placeholder="Why this word is the right answer..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingVocabQ(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Add Vocab Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Key Vocabulary Word with Russian & Chinese */}
      {isAddingVocabWord && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Add Vocabulary Word</h3>
                <p className="text-xs text-slate-500">With 🇷🇺 Russian & 🇨🇳 Chinese translations</p>
              </div>
              <button onClick={() => setIsAddingVocabWord(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const word = (form.elements.namedItem('word') as HTMLInputElement).value;
                const partOfSpeech = (form.elements.namedItem('partOfSpeech') as HTMLInputElement).value;
                const translationRu = (form.elements.namedItem('translationRu') as HTMLInputElement).value;
                const translationZh = (form.elements.namedItem('translationZh') as HTMLInputElement).value;
                const pinyin = (form.elements.namedItem('pinyin') as HTMLInputElement).value;
                const definition = (form.elements.namedItem('definition') as HTMLTextAreaElement).value;
                const exampleSentence = (form.elements.namedItem('exampleSentence') as HTMLTextAreaElement).value;
                const pronunciation = (form.elements.namedItem('pronunciation') as HTMLInputElement).value;

                onAddVocabWord(text.id, {
                  word,
                  partOfSpeech,
                  translationRu,
                  translationZh,
                  pinyin,
                  definition,
                  exampleSentence,
                  pronunciation
                });

                setIsAddingVocabWord(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">English Word</label>
                <input
                  type="text"
                  name="word"
                  required
                  placeholder="e.g. molt"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Part of Speech</label>
                  <input
                    type="text"
                    name="partOfSpeech"
                    defaultValue="noun"
                    required
                    placeholder="noun / verb / adjective"
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Pronunciation (IPA)</label>
                  <input
                    type="text"
                    name="pronunciation"
                    placeholder="/məʊlt/"
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">🇷🇺 Russian Translation</label>
                  <input
                    type="text"
                    name="translationRu"
                    placeholder="линять, сбрасывать кожу"
                    required
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">🇨🇳 Chinese Translation</label>
                  <input
                    type="text"
                    name="translationZh"
                    placeholder="蜕皮"
                    required
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pinyin (for Chinese)</label>
                <input
                  type="text"
                  name="pinyin"
                  placeholder="tuì pí"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">English Definition</label>
                <textarea
                  name="definition"
                  rows={2}
                  required
                  placeholder="Clear student-friendly explanation..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Example Sentence</label>
                <textarea
                  name="exampleSentence"
                  rows={2}
                  required
                  placeholder="Show the word used naturally in a sentence..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingVocabWord(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Add Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Response Prompt */}
      {isEditingPrompt && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Edit Reading Response Prompt</h3>
                <p className="text-xs text-slate-500">Configure writing topic and guiding questions</p>
              </div>
              <button onClick={() => setIsEditingPrompt(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                const promptText = (form.elements.namedItem('promptText') as HTMLTextAreaElement).value;
                const gq1 = (form.elements.namedItem('gq1') as HTMLInputElement).value;
                const gq2 = (form.elements.namedItem('gq2') as HTMLInputElement).value;
                const gq3 = (form.elements.namedItem('gq3') as HTMLInputElement).value;
                const minWords = parseInt((form.elements.namedItem('minWords') as HTMLInputElement).value) || 80;
                const sampleExemplar = (form.elements.namedItem('sampleExemplar') as HTMLTextAreaElement).value;

                onUpdateResponsePrompt(text.id, {
                  id: text.readingResponsePrompt.id,
                  title,
                  promptText,
                  guidingQuestions: [gq1, gq2, gq3].filter(Boolean),
                  minWords,
                  sampleExemplar
                });

                setIsEditingPrompt(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Prompt Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={text.readingResponsePrompt.title}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Prompt Instructions</label>
                <textarea
                  name="promptText"
                  rows={3}
                  defaultValue={text.readingResponsePrompt.promptText}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">Guiding Questions for Students</label>
                <input
                  type="text"
                  name="gq1"
                  defaultValue={text.readingResponsePrompt.guidingQuestions?.[0] || ''}
                  placeholder="Guiding Question 1"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  name="gq2"
                  defaultValue={text.readingResponsePrompt.guidingQuestions?.[1] || ''}
                  placeholder="Guiding Question 2"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  name="gq3"
                  defaultValue={text.readingResponsePrompt.guidingQuestions?.[2] || ''}
                  placeholder="Guiding Question 3"
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Minimum Words Target</label>
                <input
                  type="number"
                  name="minWords"
                  defaultValue={text.readingResponsePrompt.minWords || 80}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Sample Teacher Exemplar (Optional)</label>
                <textarea
                  name="sampleExemplar"
                  rows={2}
                  defaultValue={text.readingResponsePrompt.sampleExemplar || ''}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingPrompt(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Save Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
