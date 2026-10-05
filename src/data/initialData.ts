import { Student, ReadingText, GrammarTopic, DailyAssignment, StudentDailyRecord } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-aelin',
    name: 'Aelin',
    email: 'aelin@school.edu',
    gradeLevel: 'IE',
    avatarColor: 'bg-emerald-500',
    avatarSeed: 'AE',
    joinedDate: '2026-09-01',
    streakDays: 0,
    learningGoal: 'Read daily to grow vocabulary and master English',
    notes: 'IE student. Enthusiastic about reading and daily practice.',
    status: 'active'
  },
  {
    id: 'std-nasip',
    name: 'Nasip',
    email: 'nasip@school.edu',
    gradeLevel: 'IE',
    avatarColor: 'bg-blue-600',
    avatarSeed: 'NA',
    joinedDate: '2026-09-01',
    streakDays: 0,
    learningGoal: 'Improve pronunciation and complete daily reading responses',
    notes: 'IE student. Diligent worker, eager to learn.',
    status: 'active'
  },
  {
    id: 'std-daliya',
    name: 'Daliya',
    email: 'daliya@school.edu',
    gradeLevel: 'IE',
    avatarColor: 'bg-purple-600',
    avatarSeed: 'DA',
    joinedDate: '2026-09-01',
    streakDays: 0,
    learningGoal: 'Master comprehension questions and vocabulary matching',
    notes: 'IE student. Great insight in story discussions.',
    status: 'active'
  },
  {
    id: 'std-alikhan',
    name: 'Alikhan',
    email: 'alikhan@school.edu',
    gradeLevel: 'IE',
    avatarColor: 'bg-amber-600',
    avatarSeed: 'AL',
    joinedDate: '2026-09-01',
    streakDays: 0,
    learningGoal: 'Build sentence structure habits and grammar mastery',
    notes: 'IE student. Enjoys audio books and listening practice.',
    status: 'active'
  },
  {
    id: 'std-fedor',
    name: 'Fedor',
    email: 'fedor@school.edu',
    gradeLevel: 'IE',
    avatarColor: 'bg-rose-500',
    avatarSeed: 'FE',
    joinedDate: '2026-09-01',
    streakDays: 0,
    learningGoal: 'Strengthen reading comprehension and writing confidence',
    notes: 'IE student. Consistent and thoughtful.',
    status: 'active'
  },
  {
    id: 'std-xiyuan',
    name: 'Xi Yuan',
    email: 'xiyuan@school.edu',
    gradeLevel: 'IE',
    avatarColor: 'bg-teal-600',
    avatarSeed: 'XY',
    joinedDate: '2026-09-01',
    streakDays: 0,
    learningGoal: 'Develop vocabulary checks and reading fluency',
    notes: 'IE student. Benefits from multilingual dictionary and audio tools.',
    status: 'active'
  }
];

export const INITIAL_READING_TEXTS: ReadingText[] = [
  {
    id: 'text-spider',
    title: 'Diary of a Spider',
    author: 'Doreen Cronin',
    genre: 'Short Story',
    level: 'Beginner (A1-A2)',
    lexileLevel: '510L • Grade 3-5',
    readTimeMinutes: 5,
    summary: 'The complete, hilarious diary entries of a young spider experiencing school, vacuum drills, molting, family advice from Grampa, and an unlikely friendship with Fly.',
    content: `MARCH 1
Today was Grandparents Day at school, so
I brought Grampa with me.
He taught us three things:
1. Spiders are not insects—insects have six legs.
2. Without spiders, insects could take over
the world.
3. Butterflies taste better with a little
barbecue sauce.

MARCH 16
Grampa says that in his day, flies and spiders did
not get along.
Things are different now.

March 29
Today in gym class we learned how to catch the
wind so we could travel to faraway places.
When I got home, I made up flash cards so I
could practice:
1. Climb high.
2. Release silk.
3. Catch wind

Fly made up her own flash card:
1. Fly.
I’m starting to see why
Grampa doesn’t like her.

APRIL 1
It didn’t work.
I went to the park
with my sister
today. We tried
the seesaw.
It didn’t work.
We tried the tire swing. It didn't work.
We spun a huge sticky web on
the water fountain.
That worked.

APRIL 12
Today was Safety Day at school. We
learned that vacuums eat spiderwebs
and are very, very dangerous. If we
hear a vacuum, we should Stop, Drop,
and Run

APRIL 13
We had a vacuum drill today.
I stopped what I was doing
Forgot where I was going.
And ran screaming from the room.
We’re having another drill tomorrow.

APRIL 17
I’m sleeping over at Worm’s house tonight. I hope
they don’t have leaves and rotten tomatoes for
dinner again.

MAY 7
Mom said I was getting
too big for my own skin.
So I molted.
That is
soooo gross!

MAY 8
Today was show-and-tell. So I brought in my old
skin. My teacher called on it to lead the Pledge of
Allegiance.

JUNE 5
Daddy Longlegs made fun of Fly because she
eats with her feet. Now she won’t come out of
her tree house.
I’m going to find him and give him a piece of
my mind!

JUNE 6
I found Daddy Longlegs. He’s a lot bigger than
I thought he was.
I gave him a piece of my lunch instead.

JUNE 7
Fly’s tree house blew away in the wind today.
So did Grampa.

JUNE 18
I got a postcard from Grampa today

JUNE 30
Grampa came home today. I
couldn’t wait to hear about how
he rode the winds all the way over
the ocean!
Turns out, he caught a breeze
to the airport and napped in
first class.

JULY 2
Fly came over to play today. She got stuck in our
web, and her mom had to come get her.
Grampa laughed a little too hard.
From now on, we have to play at Fly’s house.

JULY 9
Today was my birthday. Grampa decided I was old
enough to know the secret to a long, happy life:
Never fall asleep in a shoe.

JULY 16
Things I scare:
1. Fly’s mom (It wasn't his fault, Mom.)
2. Tiny bugs
3. People using water
fountains at the park

JULY 17
Things that scare me:
1. Daddy Longlegs
2. Vacuums
3. People with big feet

AUGUST 1
I wish that people wouldn’t judge all spiders
based on the few spiders that bite.
I know if we took the time to get to know
each other, we would get along just fine.
Just like me and Fly`,
    vocabularyWords: [
      {
        word: 'molted',
        partOfSpeech: 'verb',
        definition: 'Shed old skin, feathers, or shell because of growing bigger.',
        exampleSentence: 'Mom said I was getting too big for my own skin, so I molted.',
        pronunciation: '/məʊltɪd/',
        translationRu: 'полинял, сбросил старую кожу',
        translationZh: '蜕皮了，蜕去外皮',
        pinyin: 'tuì pí le'
      },
      {
        word: 'drill',
        partOfSpeech: 'noun',
        definition: 'A practice exercise to rehearse what to do in an emergency.',
        exampleSentence: 'We had a vacuum drill today at school.',
        pronunciation: '/drɪl/',
        translationRu: 'учебная тренировка, учения',
        translationZh: '演习，演练',
        pinyin: 'yǎn liàn'
      },
      {
        word: 'judge',
        partOfSpeech: 'verb',
        definition: 'To form an unfair opinion about someone without knowing them.',
        exampleSentence: 'I wish people wouldn\'t judge all spiders based on the few that bite.',
        pronunciation: '/dʒʌdʒ/',
        translationRu: 'судить, осуждать, делать поспешные выводы',
        translationZh: '评价，根据外表评判',
        pinyin: 'píng pàn'
      },
      {
        word: 'release',
        partOfSpeech: 'verb',
        definition: 'To let go or allow something to flow out freely.',
        exampleSentence: 'Spider\'s flash card said: 1. Climb high. 2. Release silk. 3. Catch wind.',
        pronunciation: '/rɪˈliːs/',
        translationRu: 'выпускать, отпускать',
        translationZh: '释放，吐出 (丝)',
        pinyin: 'shì fàng'
      },
      {
        word: 'vacuums',
        partOfSpeech: 'noun',
        definition: 'Loud electrical suction machines that clean floors and eat spiderwebs.',
        exampleSentence: 'We learned that vacuums eat spiderwebs and are very dangerous.',
        pronunciation: '/ˈvæk.juːmz/',
        translationRu: 'пылесосы',
        translationZh: '吸尘器',
        pinyin: 'xī chén qì'
      },
      {
        word: 'fountain',
        partOfSpeech: 'noun',
        definition: 'A structure from which drinking water or a jet of water is pumped.',
        exampleSentence: 'We spun a huge sticky web on the park water fountain.',
        pronunciation: '/ˈfaʊn.tɪn/',
        translationRu: 'питьевой фонтанчик, фонтан',
        translationZh: '饮水喷泉，喷泉',
        pinyin: 'pēn quán'
      },
      {
        word: 'insects',
        partOfSpeech: 'noun',
        definition: 'Small arthropods that have six legs (unlike spiders, which have eight).',
        exampleSentence: 'Spiders are not insects—insects have six legs.',
        pronunciation: '/ˈɪn.sekts/',
        translationRu: 'насекомые',
        translationZh: '昆虫',
        pinyin: 'kūn chóng'
      },
      {
        word: 'enemies',
        partOfSpeech: 'noun',
        definition: 'Creatures or people who are hostile or fight against each other.',
        exampleSentence: 'Grampa says in his day, flies and spiders were natural enemies.',
        pronunciation: '/ˈen.ə.miz/',
        translationRu: 'враги, неприятели',
        translationZh: '敌人，对头',
        pinyin: 'dí rén'
      },
      {
        word: 'breeze',
        partOfSpeech: 'noun',
        definition: 'A gentle, light wind that helps spiders or silk drift through the air.',
        exampleSentence: 'He caught a breeze to the airport and napped in first class.',
        pronunciation: '/briːz/',
        translationRu: 'легкий ветерок, бриз',
        translationZh: '微风，清风',
        pinyin: 'wēi fēng'
      },
      {
        word: 'secret',
        partOfSpeech: 'noun',
        definition: 'Special knowledge or valuable advice not known by everyone.',
        exampleSentence: 'Grampa decided I was old enough to know the secret to a long, happy life.',
        pronunciation: '/ˈsiː.krət/',
        translationRu: 'секрет, тайна',
        translationZh: '秘密，秘诀',
        pinyin: 'mì jué'
      }
    ],
    comprehensionQuestions: [
      {
        id: 'comp-spider-1',
        type: 'multiple_choice',
        question: 'In the March 1 entry, what important fact did Grampa teach the class about spiders and insects on Grandparents Day?',
        options: [
          '1. Spiders can fly like birds without needing silk',
          '1. Spiders are not insects—insects have six legs',
          '1. All spiders and flies have always been best friends',
          '1. Spiders only spin webs in the winter'
        ],
        correctAnswer: 1,
        explanation: 'On March 1, Grampa taught: "1. Spiders are not insects—insects have six legs. 2. Without spiders, insects could take over the world. 3. Butterflies taste better with a little barbecue sauce."',
        points: 1
      },
      {
        id: 'comp-spider-2',
        type: 'multiple_choice',
        question: 'On March 29, what three steps did Spider write on his flash cards to practice catching the wind in gym class?',
        options: [
          '1. Climb high. 2. Release silk. 3. Catch wind.',
          '1. Flap wings. 2. Jump high. 3. Land softly.',
          '1. Spin a web. 2. Wait for rain. 3. Float away.',
          '1. Run fast. 2. Hide in shoes. 3. Take a nap.'
        ],
        correctAnswer: 0,
        explanation: 'Spider wrote: "1. Climb high. 2. Release silk. 3. Catch wind." Fly teased him by making a flash card with only one step: "1. Fly."',
        points: 1
      },
      {
        id: 'comp-spider-3',
        type: 'multiple_choice',
        question: 'Why did Spider say "I\'m starting to see why Grampa doesn\'t like her" when Fly showed her flash card on March 29?',
        options: [
          'Fly refused to participate in gym class',
          'Fly bragged that her web was bigger than Spider\'s',
          'Fly\'s flash card jokingly had only one easy step: "1. Fly."',
          'Fly accidentally tore down Grampa\'s web'
        ],
        correctAnswer: 2,
        explanation: 'Spider spent time making three careful steps to practice catching the wind, while Fly effortlessly made her card say "1. Fly."',
        points: 1
      },
      {
        id: 'comp-spider-4',
        type: 'multiple_choice',
        question: 'On April 1, Spider and his sister tried the seesaw and the tire swing, but neither worked. What finally worked for them at the park?',
        options: [
          'Sliding down the metal slide together',
          'Spinning a huge sticky web on the water fountain',
          'Climbing to the top of the swingset',
          'Catching an earthworm in the playground sand'
        ],
        correctAnswer: 1,
        explanation: 'The playground equipment didn\'t work because spiders are too light, but spinning a huge sticky web on the water fountain worked!',
        points: 1
      },
      {
        id: 'comp-spider-5',
        type: 'multiple_choice',
        question: 'On Safety Day (April 12), what danger did spiders learn about vacuum cleaners and what is their safety drill rule?',
        options: [
          'Vacuums only eat dust, so spiders should ignore them',
          'Vacuums blow spiders into the air, so spiders should hold tight',
          'Vacuums eat spiderwebs and are very dangerous; if they hear one, they should Stop, Drop, and Run',
          'Vacuums make friendly music, so spiders should dance'
        ],
        correctAnswer: 2,
        explanation: 'Spiders learned that vacuums eat spiderwebs and are very, very dangerous. Their school safety rule was "Stop, Drop, and Run."',
        points: 1
      },
      {
        id: 'comp-spider-6',
        type: 'multiple_choice',
        question: 'On April 17, why was Spider nervous about having a sleepover at Worm\'s house?',
        options: [
          'He hoped they would not have leaves and rotten tomatoes for dinner again',
          'He was afraid Worm\'s underground house was too cold',
          'He thought Worm would invite Daddy Longlegs',
          'He forgot his pajamas and silk sleeping bag'
        ],
        correctAnswer: 0,
        explanation: 'Spider wrote: "I’m sleeping over at Worm’s house tonight. I hope they don’t have leaves and rotten tomatoes for dinner again."',
        points: 1
      },
      {
        id: 'comp-spider-7',
        type: 'multiple_choice',
        question: 'What happened when Spider grew too big for his skin in May, and what happened at show-and-tell on May 8?',
        options: [
          'Spider shrank after drinking cold water, so his skin fit again',
          'Spider hid in his tree house because his old skin was stained',
          'Spider molted his skin, and his teacher called on his old skin to lead the Pledge of Allegiance!',
          'Spider traded his old skin for Fly\'s wings at show-and-tell'
        ],
        correctAnswer: 2,
        explanation: 'On May 7 Spider molted his skin, and on May 8 his teacher called on his empty old skin to lead the Pledge of Allegiance!',
        points: 1
      },
      {
        id: 'comp-spider-8',
        type: 'multiple_choice',
        question: 'On June 6, why did Spider decide to give Daddy Longlegs a piece of his lunch instead of "a piece of his mind"?',
        options: [
          'Fly told Spider she was not upset anymore',
          'Daddy Longlegs turned out to be a lot bigger than Spider thought he was!',
          'Daddy Longlegs gave Spider a gift first',
          'Spider forgot what he was angry about'
        ],
        correctAnswer: 1,
        explanation: 'On June 6, Spider writes: "I found Daddy Longlegs. He’s a lot bigger than I thought he was. I gave him a piece of my lunch instead."',
        points: 1
      },
      {
        id: 'comp-spider-9',
        type: 'multiple_choice',
        question: 'When Grampa finally returned home on June 30, how had he actually traveled during his journey?',
        options: [
          'He rode fierce ocean winds all the way over the Atlantic',
          'He floated inside a giant soap bubble across the sea',
          'He walked on telephone wires from city to city',
          'He caught a breeze to the airport and took a nap in first class!'
        ],
        correctAnswer: 3,
        explanation: 'Spider couldn\'t wait to hear how Grampa rode the winds over the ocean, but turns out Grampa caught a breeze to the airport and napped in first class.',
        points: 1
      },
      {
        id: 'comp-spider-10',
        type: 'multiple_choice',
        question: 'In the final entry on August 1, what wish does Spider make about how people view spiders?',
        options: [
          'He wishes people would keep spiders as indoor pets in cages',
          'He wishes people wouldn\'t judge all spiders based on the few that bite, because we would get along fine if we got to know each other',
          'He wishes all insects would leave the world completely',
          'He wishes spiders could learn how to eat with their feet like Fly'
        ],
        correctAnswer: 1,
        explanation: 'On August 1, Spider concludes: "I wish that people wouldn’t judge all spiders based on the few spiders that bite. I know if we took the time to get to know each other, we would get along just fine. Just like me and Fly."',
        points: 1
      }
    ],
    vocabularyCheckQuestions: [
      {
        id: 'vocab-spider-1',
        type: 'definition_match',
        prompt: 'Which word means "shed or cast off an old outer skin because you grew too big for it"?',
        options: ['Molted', 'Drill', 'Fountain', 'Breeze'],
        correctAnswer: 'Molted',
        targetWord: 'molted',
        explanation: 'Molted (полинял / 蜕皮) means shedding an outer layer of skin or shell when growing.',
        points: 1
      },
      {
        id: 'vocab-spider-2',
        type: 'fill_in_blank',
        prompt: 'To catch the wind in gym class, Spider had to climb high and ________ silk.',
        options: ['release', 'judge', 'drill', 'molt'],
        correctAnswer: 'release',
        targetWord: 'release',
        explanation: 'Spider releases silk (выпускает паутину / 吐丝) into the breeze to sail.',
        points: 1
      },
      {
        id: 'vocab-spider-3',
        type: 'fill_in_blank',
        prompt: 'Spider wishes that people wouldn\'t ________ all spiders based on the few that bite.',
        options: ['judge', 'molt', 'release', 'drill'],
        correctAnswer: 'judge',
        targetWord: 'judge',
        explanation: 'To judge (судить / 评价，下定论) means making an unfair conclusion without truly knowing someone.',
        points: 1
      },
      {
        id: 'vocab-spider-4',
        type: 'definition_match',
        prompt: 'Which word describes a rehearsed safety practice routine for emergencies, like the vacuum drill at school?',
        options: ['Drill', 'Fountain', 'Insects', 'Enemies'],
        correctAnswer: 'Drill',
        targetWord: 'drill',
        explanation: 'A drill (тренировка / 演练) is a rehearsed safety practice for emergencies.',
        points: 1
      },
      {
        id: 'vocab-spider-5',
        type: 'fill_in_blank',
        prompt: 'On Safety Day, spiders learned that loud electrical ________ eat spiderwebs and are very dangerous.',
        options: ['vacuums', 'fountains', 'breezes', 'drills'],
        correctAnswer: 'vacuums',
        targetWord: 'vacuums',
        explanation: 'Vacuums (пылесосы / 吸尘器) are suction machines that destroy spiderwebs.',
        points: 1
      },
      {
        id: 'vocab-spider-6',
        type: 'fill_in_blank',
        prompt: 'Because the playground equipment didn\'t work, Spider and his sister spun a huge sticky web on the water ________.',
        options: ['fountain', 'vacuum', 'breeze', 'secret'],
        correctAnswer: 'fountain',
        targetWord: 'fountain',
        explanation: 'A water fountain (питьевой фонтанчик / 饮水喷泉) provides drinking water in parks and schools.',
        points: 1
      },
      {
        id: 'vocab-spider-7',
        type: 'definition_match',
        prompt: 'Grampa taught the class that spiders are NOT ________ because creatures in that family have six legs.',
        options: ['insects', 'enemies', 'secrets', 'vacuums'],
        correctAnswer: 'insects',
        targetWord: 'insects',
        explanation: 'Insects (насекомые / 昆虫) have six legs, whereas spiders (arachnids) have eight legs.',
        points: 1
      },
      {
        id: 'vocab-spider-8',
        type: 'synonym',
        prompt: 'Grampa said that in his day, flies and spiders did not get along and were natural ________.',
        options: ['enemies', 'insects', 'fountains', 'drills'],
        correctAnswer: 'enemies',
        targetWord: 'enemies',
        explanation: 'Enemies (враги, неприятели / 敌人，对头) are hostile opponents that fight each other.',
        points: 1
      },
      {
        id: 'vocab-spider-9',
        type: 'definition_match',
        prompt: 'Which word means "a gentle, light wind", like the airflow Grampa caught to float all the way to the airport?',
        options: ['Breeze', 'Drill', 'Vacuum', 'Secret'],
        correctAnswer: 'Breeze',
        targetWord: 'breeze',
        explanation: 'A breeze (легкий ветерок, бриз / 微风，清风) is a light, pleasant current of air.',
        points: 1
      },
      {
        id: 'vocab-spider-10',
        type: 'fill_in_blank',
        prompt: 'On Spider\'s birthday, Grampa shared the ________ to a long, happy life: "Never fall asleep in a shoe."',
        options: ['secret', 'vacuum', 'drill', 'enemy'],
        correctAnswer: 'secret',
        targetWord: 'secret',
        explanation: 'A secret (секрет, тайна / 秘密，秘诀) is special knowledge or advice shared by Grampa.',
        points: 1
      }
    ],
    readingResponsePrompt: {
      id: 'resp-spider',
      title: 'Week 1 Writing Journal: "Don\'t Judge a Spider by Its Bite"',
      promptText: 'On August 1, Spider writes: "I wish that people wouldn’t judge all spiders based on the few spiders that bite. I know if we took the time to get to know each other, we would get along just fine. Just like me and Fly." Write a thoughtful reflection connecting Spider\'s entry to real life.',
      guidingQuestions: [
        'Why do people often judge spiders, bugs, or things they are afraid of without understanding them?',
        'Have you ever had a misunderstanding with someone, or did you make friends with someone who seemed very different at first?',
        'What lesson does the friendship between Spider and Fly teach us about accepting differences?',
        'Try to include at least two vocabulary words: molted, drill, judge, release, vacuums, or fountain.'
      ],
      minWords: 80,
      sampleExemplar: 'People often judge spiders and insects because their many eyes and legs appear scary. However, as Spider explains on August 1, most spiders help the ecosystem by keeping insect populations balanced. Spider and Fly prove that true friendship thrives when we focus on kindness rather than superficial differences.'
    },
    coverImageTheme: 'from-amber-600 via-orange-600 to-amber-900',
    assignedDate: '2026-10-03'
  }
];

export const INITIAL_GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'gram-1',
    title: 'Past Simple vs. Past Continuous',
    category: 'Tenses',
    level: 'Intermediate (B1)',
    overview: 'Learn how to describe completed past actions (Past Simple) versus ongoing background actions that were interrupted in the past (Past Continuous). Essential for storytelling and reading comprehension!',
    rules: [
      {
        ruleTitle: '1. Past Simple for Completed Actions',
        ruleExplanation: 'Use the Past Simple (verb + -ed or irregular 2nd form) for actions that started and finished at a definite time in the past.',
        formula: 'Subject + V2 / did not + V1',
        examples: [
          { sentence: 'Maya opened the mysterious wooden box yesterday.', highlight: 'opened', isCorrect: true, note: 'Regular verb: open + ed' },
          { sentence: 'Leo saw a bright bird in the forest.', highlight: 'saw', isCorrect: true, note: 'Irregular verb: see -> saw' }
        ],
        commonMistakeTip: 'Never use "did" with the past form: Say "Did you see?" NOT "Did you saw?"'
      },
      {
        ruleTitle: '2. Past Continuous for Ongoing Background Actions',
        ruleExplanation: 'Use the Past Continuous (was/were + verb-ing) to describe an action that was in progress around a specific time in the past.',
        formula: 'Subject + was/were + V-ing',
        examples: [
          { sentence: 'At 8:00 PM last night, I was studying for Ms. Venera\'s English test.', highlight: 'was studying', isCorrect: true, note: 'In progress at 8:00 PM' },
          { sentence: 'The wind was howling through the ancient pines.', highlight: 'was howling', isCorrect: true, note: 'Continuous past atmosphere' }
        ]
      },
      {
        ruleTitle: '3. Interrupted Actions with "WHEN" and "WHILE"',
        ruleExplanation: 'We often combine both tenses in one sentence: Past Continuous for the longer background action, and Past Simple for the shorter action that interrupted it.',
        formula: 'While + Past Continuous, Past Simple  OR  Past Continuous + when + Past Simple',
        examples: [
          { sentence: 'While Leo was checking his compass, Maya spotted the glowing oak.', highlight: 'was checking ... spotted', isCorrect: true, note: 'Checking was ongoing; spotting interrupted it' },
          { sentence: 'We were walking in the park when it suddenly started to rain.', highlight: 'were walking ... started', isCorrect: true, note: '"started" is the quick interrupting event' }
        ],
        commonMistakeTip: 'Usually use "while" with Past Continuous (While I was sleeping...) and "when" with Past Simple (When you phoned...).'
      }
    ],
    exercises: [
      {
        id: 'ex-1-1',
        type: 'multiple_choice',
        question: 'While Ms. Venera ________ the grammar rule on the whiteboard, the bell suddenly rang.',
        options: ['explained', 'was explaining', 'is explaining', 'has explained'],
        correctAnswer: 'was explaining',
        explanation: 'We use Past Continuous (was explaining) for the ongoing background action interrupted by the bell.',
        hint: 'Notice the word "While" and the interrupting past action "rang".',
        difficulty: 'easy',
        points: 2
      },
      {
        id: 'ex-1-2',
        type: 'multiple_choice',
        question: 'Amina and Sophie ________ their homework when the power went out.',
        options: ['were doing', 'was doing', 'did', 'are doing'],
        correctAnswer: 'were doing',
        explanation: 'With plural subjects (Amina and Sophie = they), use "were + doing".',
        hint: 'Check subject-verb agreement for plural subjects in the past continuous.',
        difficulty: 'medium',
        points: 2
      },
      {
        id: 'ex-1-3',
        type: 'fill_blank',
        question: 'Yesterday morning, Kairat ________ (lose) his favorite English notebook on the school bus.',
        options: ['lost', 'was losing', 'losed', 'had lost'],
        correctAnswer: 'lost',
        explanation: 'This is a single completed past event at a specific time (yesterday morning), so we use the irregular Past Simple form "lost".',
        hint: 'Irregular past tense of "lose" (lose -> ???).',
        difficulty: 'easy',
        points: 2
      },
      {
        id: 'ex-1-4',
        type: 'multiple_choice',
        question: 'Which sentence is grammatically correct?',
        options: [
          'What did you do when the teacher walked in?',
          'What did you were doing when the teacher walked in?',
          'What were you doing when the teacher walked in?',
          'What was you doing when the teacher walked in?'
        ],
        correctAnswer: 'What were you doing when the teacher walked in?',
        explanation: '"What were you doing when..." asks about the ongoing activity at the moment the teacher arrived.',
        hint: 'Look for "were + you + V-ing".',
        difficulty: 'hard',
        points: 3
      },
      {
        id: 'ex-1-5',
        type: 'multiple_choice',
        question: 'The students ________ in the library when the fire alarm started buzzing.',
        options: ['studied', 'were studying', 'was studying', 'are studying'],
        correctAnswer: 'were studying',
        explanation: 'Students (plural) + were + studying (background action interrupted by fire alarm).',
        hint: 'Plural subject + continuous action.',
        difficulty: 'medium',
        points: 2
      }
    ],
    testDurationMinutes: 10
  },
  {
    id: 'gram-2',
    title: 'Subject-Verb Agreement & Tricky Plurals',
    category: 'Sentence Structure',
    level: 'Elementary to Intermediate (A2-B1)',
    overview: 'Master the fundamental English rule: singular subjects take singular verbs, and plural subjects take plural verbs. Tackle tricky collective nouns, indefinite pronouns, and irregular plurals!',
    rules: [
      {
        ruleTitle: '1. The Golden Rule: Singular vs. Plural',
        ruleExplanation: 'A singular subject takes a singular verb (often ending in -s in the present simple). A plural subject takes a plural verb (without -s).',
        formula: 'He/She/It + Verb-s  |  I/You/We/They + Base Verb',
        examples: [
          { sentence: 'The student reads a poem aloud every morning.', highlight: 'reads', isCorrect: true, note: 'Singular student -> reads' },
          { sentence: 'The students read poems aloud every morning.', highlight: 'read', isCorrect: true, note: 'Plural students -> read' }
        ]
      },
      {
        ruleTitle: '2. Indefinite Pronouns Are Singular',
        ruleExplanation: 'Words like everyone, everybody, someone, nobody, each, and neither always take a SINGULAR verb in formal English.',
        formula: 'Everyone / Each / Nobody + Singular Verb (-s)',
        examples: [
          { sentence: 'Everyone in Ms. Venera\'s class has an assigned reading book.', highlight: 'has', isCorrect: true, note: '"Everyone" is grammatically singular' },
          { sentence: 'Each of the questions requires a thoughtful answer.', highlight: 'requires', isCorrect: true, note: '"Each" is singular despite "questions"' }
        ],
        commonMistakeTip: 'Do not be tricked by phrases in between! "One of the boys IS here", NOT "One of the boys are here".'
      }
    ],
    exercises: [
      {
        id: 'ex-2-1',
        type: 'multiple_choice',
        question: 'Neither of the answers provided by the students ________ correct.',
        options: ['is', 'are', 'were', 'have been'],
        correctAnswer: 'is',
        explanation: '"Neither" refers to neither one individually, so it takes a singular verb "is".',
        hint: 'Focus on "Neither", not the plural word "answers".',
        difficulty: 'hard',
        points: 3
      },
      {
        id: 'ex-2-2',
        type: 'multiple_choice',
        question: 'Everyone in our study group ________ ready to present the reading summary.',
        options: ['is', 'are', 'be', 'were'],
        correctAnswer: 'is',
        explanation: '"Everyone" is an indefinite pronoun treated as singular in standard English.',
        hint: 'Remember the rule: everyone/everybody takes a singular verb.',
        difficulty: 'easy',
        points: 2
      },
      {
        id: 'ex-2-3',
        type: 'multiple_choice',
        question: 'The box of old English storybooks ________ stored in the classroom cupboard.',
        options: ['was', 'were', 'are', 'have'],
        correctAnswer: 'was',
        explanation: 'The subject is "The box" (singular), not the storybooks.',
        hint: 'Identify the true head noun of the subject.',
        difficulty: 'medium',
        points: 2
      },
      {
        id: 'ex-2-4',
        type: 'multiple_choice',
        question: 'Both Marcus and Elena ________ active members of the English debate club.',
        options: ['is', 'are', 'was', 'has been'],
        correctAnswer: 'are',
        explanation: 'Subjects joined by "and" create a plural compound subject, so we use "are".',
        hint: 'Compound subject with "and" = plural.',
        difficulty: 'easy',
        points: 2
      }
    ],
    testDurationMinutes: 8
  },
  {
    id: 'gram-3',
    title: 'Conditionals: Zero, First & Second',
    category: 'Sentence Structure',
    level: 'Intermediate to Upper (B1-B2)',
    overview: 'Express real facts, likely future possibilities, and imaginary hypothetical scenarios using English If-clauses.',
    rules: [
      {
        ruleTitle: '1. Zero Conditional (Scientific & General Truths)',
        ruleExplanation: 'Used for things that are always true or natural laws.',
        formula: 'If + Present Simple, ... Present Simple',
        examples: [
          { sentence: 'If you heat water to 100 degrees Celsius, it boils.', highlight: 'heat ... boils', isCorrect: true, note: 'Scientific certainty' }
        ]
      },
      {
        ruleTitle: '2. First Conditional (Real & Possible Future)',
        ruleExplanation: 'Used for real situations and realistic consequences in the future.',
        formula: 'If + Present Simple, ... will + Base Verb',
        examples: [
          { sentence: 'If you practice reading for 15 minutes daily, your vocabulary will grow fast.', highlight: 'practice ... will grow', isCorrect: true, note: 'Realistic cause & effect' }
        ],
        commonMistakeTip: 'Never put "will" inside the if-clause: Say "If it rains..." NOT "If it will rain..."'
      },
      {
        ruleTitle: '3. Second Conditional (Hypothetical & Imaginary)',
        ruleExplanation: 'Used for imaginary or unreal situations in the present or future.',
        formula: 'If + Past Simple, ... would + Base Verb',
        examples: [
          { sentence: 'If I had a magic carpet, I would fly across the Silk Road.', highlight: 'had ... would fly', isCorrect: true, note: 'Imaginary situation' },
          { sentence: 'If she were the school principal, she would give us longer reading hours.', highlight: 'were ... would give', isCorrect: true, note: 'Use "were" for all subjects in formal English' }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-3-1',
        type: 'multiple_choice',
        question: 'If Lucas ________ harder for the vocabulary test, he would score much higher.',
        options: ['studied', 'studies', 'will study', 'is studying'],
        correctAnswer: 'studied',
        explanation: 'Second conditional (imaginary/hypothetical): If + Past Simple (studied), would + verb.',
        hint: 'Check the second half: "he would score" signals second conditional.',
        difficulty: 'medium',
        points: 2
      },
      {
        id: 'ex-3-2',
        type: 'multiple_choice',
        question: 'If you finish your daily reading today, Ms. Venera ________ you a bonus sticker.',
        options: ['will give', 'gave', 'would give', 'giving'],
        correctAnswer: 'will give',
        explanation: 'First conditional (real future possibility): If + Present Simple (finish), will + verb (will give).',
        hint: 'First conditional structure for real future events.',
        difficulty: 'easy',
        points: 2
      },
      {
        id: 'ex-3-3',
        type: 'multiple_choice',
        question: 'If plants ________ enough sunlight and clean water, they wither and die.',
        options: ['do not receive', 'will not receive', 'did not receive', 'would not receive'],
        correctAnswer: 'do not receive',
        explanation: 'Zero conditional for general biological facts: Present Simple in both clauses.',
        hint: 'General biological truth = zero conditional.',
        difficulty: 'medium',
        points: 2
      }
    ],
    testDurationMinutes: 10
  },
  {
    id: 'gram-4',
    title: 'Prepositions of Time & Place: At, On, In',
    category: 'Modifiers & Prepositions',
    level: 'Elementary to Intermediate (A2-B1)',
    overview: 'Never confuse In, On, and At again! Visualize the inverted pyramid from general/broad (In) to more specific (On) to precise points (At).',
    rules: [
      {
        ruleTitle: '1. Prepositions of Time (In -> On -> At)',
        ruleExplanation: 'IN for long periods (years, months, seasons, centuries). ON for specific dates and days of the week. AT for exact clock times and points in time.',
        formula: 'IN (Broad) > ON (Specific Day/Date) > AT (Precise Time)',
        examples: [
          { sentence: 'We started our English project in September.', highlight: 'in September', isCorrect: true, note: 'Month = IN' },
          { sentence: 'Our class meets on Monday morning.', highlight: 'on Monday', isCorrect: true, note: 'Day of week = ON' },
          { sentence: 'The morning lesson begins at 8:30 AM.', highlight: 'at 8:30 AM', isCorrect: true, note: 'Exact clock time = AT' }
        ]
      }
    ],
    exercises: [
      {
        id: 'ex-4-1',
        type: 'multiple_choice',
        question: 'Ms. Venera scheduled the English reading competition ________ Friday afternoon.',
        options: ['on', 'in', 'at', 'by'],
        correctAnswer: 'on',
        explanation: 'Use "on" for days of the week and specific parts of named days (on Friday afternoon).',
        hint: 'Remember: Days of the week take ON.',
        difficulty: 'easy',
        points: 2
      },
      {
        id: 'ex-4-2',
        type: 'multiple_choice',
        question: 'The school library opened ________ 2018.',
        options: ['in', 'on', 'at', 'since'],
        correctAnswer: 'in',
        explanation: 'Years take the preposition "in" (in 2018).',
        hint: 'Years take IN.',
        difficulty: 'easy',
        points: 2
      }
    ],
    testDurationMinutes: 6
  }
];

export const INITIAL_ASSIGNMENTS: DailyAssignment[] = [
  {
    id: 'assign-today',
    date: '2026-10-03',
    title: 'Week 1: Diary of a Spider by Doreen Cronin & Past Tenses',
    description: 'Read the complete story "Diary of a Spider", answer the 10 comprehension check questions, explore molting and vacuum safety drills, check vocabulary with Russian & Chinese translations, write your creature response journal, and practice past narrative tenses.',
    textId: 'text-spider',
    grammarTopicId: 'gram-1',
    requiredTasks: ['reading', 'vocab', 'comprehension', 'response', 'grammar'],
    dueDate: '2026-10-03T23:59:00'
  },
  {
    id: 'assign-yesterday',
    date: '2026-10-02',
    title: 'Introductory Day: Exploring Diary of a Spider',
    description: 'Begin exploring "Diary of a Spider", read the early March journal entries, review key vocabulary, and build reading habits.',
    textId: 'text-spider',
    grammarTopicId: 'gram-2',
    requiredTasks: ['reading', 'vocab', 'comprehension', 'response', 'grammar'],
    dueDate: '2026-10-02T23:59:00'
  }
];

export const INITIAL_STUDENT_RECORDS: StudentDailyRecord[] = [
  {
    id: 'rec-1',
    studentId: 'std-aelin', // Aelin
    date: '2026-10-03',
    assignmentId: 'assign-today',
    completedTasks: [],
    readingCompleted: false,
    lastActiveTime: undefined
  },
  {
    id: 'rec-2',
    studentId: 'std-nasip', // Nasip
    date: '2026-10-03',
    assignmentId: 'assign-today',
    completedTasks: [],
    readingCompleted: false,
    lastActiveTime: undefined
  },
  {
    id: 'rec-3',
    studentId: 'std-daliya', // Daliya
    date: '2026-10-03',
    assignmentId: 'assign-today',
    completedTasks: [],
    readingCompleted: false,
    lastActiveTime: undefined
  },
  {
    id: 'rec-4',
    studentId: 'std-alikhan', // Alikhan
    date: '2026-10-03',
    assignmentId: 'assign-today',
    completedTasks: [],
    readingCompleted: false,
    lastActiveTime: undefined
  },
  {
    id: 'rec-5',
    studentId: 'std-fedor', // Fedor
    date: '2026-10-03',
    assignmentId: 'assign-today',
    completedTasks: [],
    readingCompleted: false,
    lastActiveTime: undefined
  },
  {
    id: 'rec-6',
    studentId: 'std-xiyuan', // Xi Yuan
    date: '2026-10-03',
    assignmentId: 'assign-today',
    completedTasks: [],
    readingCompleted: false,
    lastActiveTime: undefined
  }
];
