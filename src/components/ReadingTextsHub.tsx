import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Clock,
  Award,
  Sparkles,
  Search,
  Filter,
  Trash2,
  Edit3,
  ChevronRight,
  BookMarked,
  Volume2,
  Headphones,
  FileQuestion,
  HelpCircle,
  CalendarCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { ReadingText, RoleMode, VocabularyWord, ComprehensionQuestion, VocabularyCheckQuestion } from '../types';

interface ReadingTextsHubProps {
  texts: ReadingText[];
  onSelectText: (textId: string) => void;
  onAddText: (text: Omit<ReadingText, 'id'>, assignImmediately?: boolean) => void;
  onDeleteText: (textId: string) => void;
  onAssignToday?: (textId: string) => void;
  activeAssignmentTextId?: string;
  roleMode: RoleMode;
}

export const ReadingTextsHub: React.FC<ReadingTextsHubProps> = ({
  texts,
  onSelectText,
  onAddText,
  onDeleteText,
  onAssignToday,
  activeAssignmentTextId,
  roleMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [isAddingText, setIsAddingText] = useState(false);

  // Template pre-fill
  const [templateType, setTemplateType] = useState<'story' | 'article' | 'custom'>('story');

  const filteredTexts = texts.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.summary.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (genreFilter === 'all') return true;
    return t.genre.toLowerCase().includes(genreFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Classroom Reading Texts</h1>
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-amber-200">
              {texts.length} Texts in Curriculum
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Short stories, informational articles, and historical tales with built-in comprehension quizzes, vocabulary checks, and response journals.
          </p>
        </div>

        {roleMode === 'teacher' && (
          <button
            onClick={() => setIsAddingText(true)}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Reading Text</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          <button
            onClick={() => setGenreFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              genreFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Genres
          </button>
          <button
            onClick={() => setGenreFilter('short story')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              genreFilter === 'short story'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Short Stories
          </button>
          <button
            onClick={() => setGenreFilter('historical')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              genreFilter === 'historical'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Historical Tales
          </button>
          <button
            onClick={() => setGenreFilter('science')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              genreFilter === 'science'
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Science & Nature
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search texts by title or keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Texts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTexts.map(text => (
          <div
            key={text.id}
            onClick={() => onSelectText(text.id)}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-amber-400/60 transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Header Banner */}
              <div className={`p-4 bg-gradient-to-r ${text.coverImageTheme || 'from-slate-800 to-indigo-900'} text-white relative`}>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full font-semibold">
                      {text.genre}
                    </span>
                    {activeAssignmentTextId === text.id ? (
                      <span className="bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3" /> Today&#39;s Assignment
                      </span>
                    ) : text.id === 'text-spider' ? (
                      <span className="bg-amber-400/90 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px]">
                        Anchor Story
                      </span>
                    ) : null}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-amber-200 bg-black/30 px-2 py-0.5 rounded-full font-semibold text-[10px] backdrop-blur-xs">
                      <Volume2 className="w-3 h-3 text-amber-300" />
                      <span>Audio Book</span>
                    </span>
                    <span className="flex items-center gap-1 text-slate-200">
                      <Clock className="w-3.5 h-3.5" />
                      {text.readTimeMinutes} min
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-white group-hover:text-amber-200 transition-colors leading-tight line-clamp-1">
                  {text.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">By {text.author}</p>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                    Level: {text.level}
                  </span>
                  <span className="bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-2 py-0.5 rounded border border-indigo-200">
                    {text.lexileLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {text.summary}
                </p>

                {/* Modules included badge list */}
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <BookMarked className="w-3.5 h-3.5 text-amber-600" />
                      <span>Vocabulary Words</span>
                    </span>
                    <span className="font-bold text-slate-800">{text.vocabularyWords.length} terms</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileQuestion className="w-3.5 h-3.5 text-blue-600" />
                      <span>Comprehension Questions</span>
                    </span>
                    <span className="font-bold text-slate-800">{text.comprehensionQuestions.length} Qs</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>Vocabulary Check</span>
                    </span>
                    <span className="font-bold text-slate-800">{text.vocabularyCheckQuestions.length} Qs</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-rose-600" />
                      <span>Reading Response</span>
                    </span>
                    <span className="font-bold text-slate-800">Prompt Ready</span>
                  </div>
                  <div className="flex items-center justify-between text-emerald-700 bg-emerald-50/80 px-2 py-1 rounded-lg border border-emerald-100">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Headphones className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Audio Narration</span>
                    </span>
                    <span className="font-bold text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded">
                      Enabled 🔊
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <span className="text-xs text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Read, Listen & Learn <ChevronRight className="w-3.5 h-3.5" />
              </span>

              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                {roleMode === 'teacher' && onAssignToday && activeAssignmentTextId !== text.id && (
                  <button
                    onClick={() => onAssignToday(text.id)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                    title="Set this story as today's active assignment"
                  >
                    <CalendarCheck className="w-3 h-3 text-amber-700" />
                    <span>Assign Today</span>
                  </button>
                )}

                {roleMode === 'teacher' && (
                  text.id === 'text-spider' ? (
                    <span className="text-[10px] text-slate-400 font-medium px-2 py-0.5 bg-slate-50 rounded border border-slate-100">
                      Anchor Story
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${text.title}"?`)) {
                          onDeleteText(text.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete this text"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create New Text */}
      {isAddingText && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Add New Classroom Reading Text</h3>
                <p className="text-xs text-slate-500">Create a text with comprehension, vocabulary check, and response prompt</p>
              </div>
              <button
                onClick={() => setIsAddingText(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Templates Buttons */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
              <span className="text-xs font-bold text-amber-900 block mb-1.5">⚡ Ms. Venera&#39;s Story Authoring Mode:</span>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setTemplateType('custom')}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                    templateType === 'custom'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-white border border-amber-300 text-amber-900'
                  }`}
                >
                  ✍️ Blank / Write & Paste My Story
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateType('story')}
                  className={`text-xs px-3 py-1 rounded-lg font-medium transition-all ${
                    templateType === 'story'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-white border border-amber-300 text-amber-900'
                  }`}
                >
                  💡 Pre-fill Sample: The Mountain Lighthouse
                </button>
              </div>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                const author = (form.elements.namedItem('author') as HTMLInputElement).value;
                const genre = (form.elements.namedItem('genre') as HTMLSelectElement).value as any;
                const level = (form.elements.namedItem('level') as HTMLSelectElement).value as any;
                const lexileLevel = (form.elements.namedItem('lexileLevel') as HTMLInputElement).value;
                const readTimeMinutes = parseInt((form.elements.namedItem('readTimeMinutes') as HTMLInputElement).value) || 5;
                const summary = (form.elements.namedItem('summary') as HTMLTextAreaElement).value;
                const content = (form.elements.namedItem('content') as HTMLTextAreaElement).value;

                // Optional Initial Vocabulary Word
                const vocabWord = (form.elements.namedItem('vocabWord') as HTMLInputElement)?.value?.trim();
                const vocabRu = (form.elements.namedItem('vocabRu') as HTMLInputElement)?.value?.trim();
                const vocabZh = (form.elements.namedItem('vocabZh') as HTMLInputElement)?.value?.trim();
                const vocabDef = (form.elements.namedItem('vocabDef') as HTMLInputElement)?.value?.trim();

                const vocabularyWords: VocabularyWord[] = vocabWord ? [
                  {
                    word: vocabWord,
                    partOfSpeech: 'noun',
                    definition: vocabDef || 'Key word from the story.',
                    exampleSentence: `Notice how "${vocabWord}" is used in the reading text.`,
                    translationRu: vocabRu || 'ключевое слово',
                    translationZh: vocabZh || '关键词',
                    pinyin: ''
                  }
                ] : [
                  {
                    word: 'curiosity',
                    partOfSpeech: 'noun',
                    definition: 'A strong desire to know or learn something new.',
                    exampleSentence: 'Her curiosity inspired her to explore the story carefully.',
                    translationRu: 'любопытство, любознательность',
                    translationZh: '好奇心',
                    pinyin: 'hào qí xīn'
                  }
                ];

                // Optional Initial Comprehension Question
                const compQ = (form.elements.namedItem('compQ') as HTMLInputElement)?.value?.trim();
                const compOpt1 = (form.elements.namedItem('compOpt1') as HTMLInputElement)?.value?.trim();
                const compOpt2 = (form.elements.namedItem('compOpt2') as HTMLInputElement)?.value?.trim();
                const compOpt3 = (form.elements.namedItem('compOpt3') as HTMLInputElement)?.value?.trim();
                const compOpt4 = (form.elements.namedItem('compOpt4') as HTMLInputElement)?.value?.trim();
                const compCorrect = parseInt((form.elements.namedItem('compCorrect') as HTMLSelectElement)?.value || '0');
                const compExp = (form.elements.namedItem('compExp') as HTMLInputElement)?.value?.trim();

                const comprehensionQuestions: ComprehensionQuestion[] = compQ ? [
                  {
                    id: `comp-${Date.now()}-1`,
                    type: 'multiple_choice',
                    question: compQ,
                    options: [
                      compOpt1 || 'Option A',
                      compOpt2 || 'Option B',
                      compOpt3 || 'Option C',
                      compOpt4 || 'Option D'
                    ],
                    correctAnswer: compCorrect,
                    explanation: compExp || 'Evidence from the text supports this answer.',
                    points: 1
                  }
                ] : [
                  {
                    id: `comp-${Date.now()}-1`,
                    type: 'multiple_choice',
                    question: `What is the central theme of "${title}"?`,
                    options: [
                      'Dedication, reflection, and learning from experience',
                      'Giving up whenever obstacles appear',
                      'Ignoring teacher instructions',
                      'Waiting for someone else to do the work'
                    ],
                    correctAnswer: 0,
                    explanation: 'The primary message of the story highlights dedication, consistency, and resilience.',
                    points: 1
                  }
                ];

                // Optional Initial Vocabulary Check Question
                const vchkPrompt = (form.elements.namedItem('vchkPrompt') as HTMLInputElement)?.value?.trim();
                const vchkWord = (form.elements.namedItem('vchkWord') as HTMLInputElement)?.value?.trim() || vocabWord || 'curiosity';
                const vchkAnswer = (form.elements.namedItem('vchkAnswer') as HTMLInputElement)?.value?.trim() || vchkWord;

                const vocabularyCheckQuestions: VocabularyCheckQuestion[] = vchkPrompt ? [
                  {
                    id: `vocab-${Date.now()}-1`,
                    type: 'definition_match',
                    prompt: vchkPrompt,
                    options: [vchkAnswer, 'Perseverance', 'Hesitation', 'Obstacle'],
                    correctAnswer: vchkAnswer,
                    targetWord: vchkWord,
                    explanation: `"${vchkAnswer}" is the correct vocabulary term.`,
                    points: 1
                  }
                ] : [
                  {
                    id: `vocab-${Date.now()}-1`,
                    type: 'definition_match',
                    prompt: 'Which word means "a strong desire to know or learn something"?',
                    options: ['Curiosity', 'Hesitation', 'Perseverance', 'Drill'],
                    correctAnswer: 'Curiosity',
                    targetWord: 'curiosity',
                    explanation: 'Curiosity describes eagerness to discover and understand.',
                    points: 1
                  }
                ];

                // Reading Response Prompt
                const respTitle = (form.elements.namedItem('respTitle') as HTMLInputElement)?.value?.trim() || `Reflective Journal on ${title}`;
                const respText = (form.elements.namedItem('respText') as HTMLTextAreaElement)?.value?.trim() || `Write a thoughtful reflection about the events in "${title}". How do the characters overcome obstacles, and what lessons can we apply to our English studies?`;
                const assignImmediately = (form.elements.namedItem('assignImmediately') as HTMLInputElement)?.checked;

                onAddText({
                  title,
                  author,
                  genre,
                  level,
                  lexileLevel,
                  readTimeMinutes,
                  summary,
                  content,
                  coverImageTheme: genre === 'Short Story' ? 'from-purple-800 to-indigo-950' : 'from-blue-800 to-cyan-950',
                  vocabularyWords,
                  comprehensionQuestions,
                  vocabularyCheckQuestions,
                  readingResponsePrompt: {
                    id: `resp-${Date.now()}`,
                    title: respTitle,
                    promptText: respText,
                    guidingQuestions: [
                      'What was the primary situation or problem in the text?',
                      'How did the character or speaker respond?',
                      'Include at least two vocabulary words in your written response.'
                    ],
                    minWords: 80,
                    sampleExemplar: 'Every challenge presents an opportunity for deeper understanding. As shown in the reading, taking consistent steps transforms difficulties into growth.'
                  }
                }, assignImmediately);

                setIsAddingText(false);
              }}
              className="space-y-4 text-xs"
            >
              {/* Section 1: Story Details */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">1. Story Information & Content</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Story Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="e.g. The Boy Who Harnessed the Wind"
                      defaultValue={templateType === 'story' ? 'The Keeper of the Mountain Lighthouse' : ''}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Author</label>
                    <input
                      type="text"
                      name="author"
                      required
                      placeholder="e.g. William Kamkwamba"
                      defaultValue={templateType === 'story' ? 'Alina Sorokin' : ''}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Genre</label>
                    <select
                      name="genre"
                      defaultValue="Short Story"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Short Story">Short Story</option>
                      <option value="Informational Article">Informational Article</option>
                      <option value="Historical Tale">Historical Tale</option>
                      <option value="Poetry & Fable">Poetry & Fable</option>
                      <option value="Science & Nature">Science & Nature</option>
                      <option value="Biography">Biography</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Target CEFR Level</label>
                    <select
                      name="level"
                      defaultValue="Intermediate (B1)"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      <option value="Beginner (A1-A2)">Beginner (A1-A2)</option>
                      <option value="Intermediate (B1)">Intermediate (B1)</option>
                      <option value="Upper-Intermediate (B2)">Upper-Intermediate (B2)</option>
                      <option value="Advanced (C1)">Advanced (C1)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Lexile / Grade</label>
                    <input
                      type="text"
                      name="lexileLevel"
                      defaultValue="750L • Grade 7"
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-slate-700 font-semibold mb-1">Read Time (Mins)</label>
                    <input
                      type="number"
                      name="readTimeMinutes"
                      min="1"
                      max="40"
                      defaultValue="5"
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-slate-700 font-semibold mb-1">Short Lesson Summary</label>
                    <input
                      type="text"
                      name="summary"
                      required
                      placeholder="Brief overview of the story theme..."
                      defaultValue={templateType === 'story' ? 'An elderly lighthouse watchman teaches an apprentice about vigilance, quiet dedication, and guiding others.' : ''}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Full Story Paragraphs (Audio narration will speak this!)</label>
                  <textarea
                    name="content"
                    rows={6}
                    required
                    placeholder="Paste or write the complete reading story here. Separate paragraphs with a blank line..."
                    defaultValue={templateType === 'story' ? `High above the churning gray waters of the northern coast, the beacon of Crag Ridge cast its sweeping beam into the tempest. For forty years, Old Douglas had tended the brass lamps, ensuring the light never dimmed for travelers at sea.

This season, he was joined by young Tomas, who found the repetitive chores exhausting. "Why must we polish these heavy lenses every single day?" Tomas complained as freezing spray hammered against the glass.

Douglas placed a gentle hand on the boy's shoulder. "A lighthouse does not shine for glory, Tomas. It shines because lives depend on our quiet consistency. When the fog is thickest, someone out there is desperately searching for this single beam of hope."

That very midnight, when a gale knocked out the automated electrical generator, Tomas sprang into action without hesitation. He climbed the spiral iron staircase and manually operated the brass gears until dawn broke, saving a lost cargo ship from jagged coastal reefs.` : ''}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed bg-white"
                  />
                </div>
              </div>

              {/* Section 2: Key Vocabulary Word (with Russian & Chinese) */}
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2. Initial Vocabulary Word (Optional — more can be added later)</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    name="vocabWord"
                    placeholder="Word (e.g. tempest)"
                    defaultValue={templateType === 'story' ? 'tempest' : ''}
                    className="p-2 rounded-xl border border-emerald-200 bg-white"
                  />
                  <input
                    type="text"
                    name="vocabRu"
                    placeholder="🇷🇺 Russian (буря)"
                    defaultValue={templateType === 'story' ? 'буря, шторм' : ''}
                    className="p-2 rounded-xl border border-emerald-200 bg-white"
                  />
                  <input
                    type="text"
                    name="vocabZh"
                    placeholder="🇨🇳 Chinese (暴风雨)"
                    defaultValue={templateType === 'story' ? '暴风雨' : ''}
                    className="p-2 rounded-xl border border-emerald-200 bg-white"
                  />
                </div>
                <input
                  type="text"
                  name="vocabDef"
                  placeholder="English Meaning (e.g. a violent, windy storm)"
                  defaultValue={templateType === 'story' ? 'A violent, windy storm at sea.' : ''}
                  className="w-full p-2 rounded-xl border border-emerald-200 bg-white"
                />
              </div>

              {/* Section 3: Initial Comprehension Question */}
              <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200 space-y-2.5">
                <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <FileQuestion className="w-3.5 h-3.5 text-blue-600" />
                  <span>3. Initial Comprehension Question (Optional — more can be added anytime)</span>
                </span>
                <input
                  type="text"
                  name="compQ"
                  placeholder="Question (e.g. Why did Tomas complain at first?)"
                  defaultValue={templateType === 'story' ? 'Why was Tomas complaining at the beginning of the story?' : ''}
                  className="w-full p-2 rounded-xl border border-blue-200 bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="compOpt1"
                    placeholder="Option A (e.g. He found polishing lenses repetitive)"
                    defaultValue={templateType === 'story' ? 'He found the daily chore of polishing lenses repetitive and tiring' : ''}
                    className="p-2 rounded-xl border border-blue-200 bg-white"
                  />
                  <input
                    type="text"
                    name="compOpt2"
                    placeholder="Option B"
                    defaultValue={templateType === 'story' ? 'He was afraid of the dark lighthouse' : ''}
                    className="p-2 rounded-xl border border-blue-200 bg-white"
                  />
                  <input
                    type="text"
                    name="compOpt3"
                    placeholder="Option C"
                    defaultValue={templateType === 'story' ? 'He wanted to sail on a cargo ship' : ''}
                    className="p-2 rounded-xl border border-blue-200 bg-white"
                  />
                  <input
                    type="text"
                    name="compOpt4"
                    placeholder="Option D"
                    defaultValue={templateType === 'story' ? 'Douglas refused to teach him' : ''}
                    className="p-2 rounded-xl border border-blue-200 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Correct Answer</label>
                    <select
                      name="compCorrect"
                      defaultValue="0"
                      className="w-full p-2 rounded-xl border border-blue-200 bg-white"
                    >
                      <option value="0">Option A</option>
                      <option value="1">Option B</option>
                      <option value="2">Option C</option>
                      <option value="3">Option D</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-0.5">Explanation</label>
                    <input
                      type="text"
                      name="compExp"
                      placeholder="Why this answer is correct..."
                      defaultValue={templateType === 'story' ? 'Tomas complained that polishing the heavy lenses every day was exhausting.' : ''}
                      className="w-full p-2 rounded-xl border border-blue-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Initial Vocabulary Check Question */}
              <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-200 space-y-2">
                <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>4. Initial Vocabulary Check Question (Optional)</span>
                </span>
                <input
                  type="text"
                  name="vchkPrompt"
                  placeholder="Which word means violent stormy weather?"
                  defaultValue={templateType === 'story' ? 'Which word means a violent, windy storm at sea?' : ''}
                  className="w-full p-2 rounded-xl border border-purple-200 bg-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="vchkWord"
                    placeholder="Target Word (e.g. tempest)"
                    defaultValue={templateType === 'story' ? 'tempest' : ''}
                    className="p-2 rounded-xl border border-purple-200 bg-white"
                  />
                  <input
                    type="text"
                    name="vchkAnswer"
                    placeholder="Correct Choice (e.g. tempest)"
                    defaultValue={templateType === 'story' ? 'tempest' : ''}
                    className="p-2 rounded-xl border border-purple-200 bg-white"
                  />
                </div>
              </div>

              {/* Section 5: Reading Response Prompt */}
              <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200 space-y-2">
                <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-rose-600" />
                  <span>5. Reading Response Journal Prompt</span>
                </span>
                <input
                  type="text"
                  name="respTitle"
                  placeholder="Journal Title (e.g. Quiet Consistency in Our Studies)"
                  defaultValue={templateType === 'story' ? 'Journal: Quiet Consistency and Duty' : ''}
                  className="w-full p-2 rounded-xl border border-rose-200 bg-white"
                />
                <textarea
                  name="respText"
                  rows={2}
                  placeholder="Writing prompt instructions for students..."
                  defaultValue={templateType === 'story' ? 'Reflect on Old Douglas\'s words about shining without expecting glory. How does quiet dedication apply to learning a new language or helping your community?' : ''}
                  className="w-full p-2 rounded-xl border border-rose-200 bg-white"
                />
              </div>

              {/* Immediate Assignment Checkbox */}
              <div className="bg-amber-100/60 border border-amber-300 p-3 rounded-xl flex items-center gap-2">
                <input
                  type="checkbox"
                  id="assignImmediately"
                  name="assignImmediately"
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <label htmlFor="assignImmediately" className="text-xs text-amber-950 font-bold cursor-pointer">
                  📅 Assign this new story as today&#39;s active classroom assignment immediately
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingText(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow"
                >
                  Save & Open Story Hub
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
