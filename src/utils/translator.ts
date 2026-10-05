/**
 * Translation service for English to Russian (Русский) and Chinese (中文)
 * Features an instant local dictionary for classroom vocabulary,
 * plus live translation for arbitrary highlighted words and sentences.
 */

interface TranslationResult {
  original: string;
  russian: string;
  chinese: string;
  pinyin?: string;
  definition?: string;
  partOfSpeech?: string;
}

// Pre-built dictionary for immediate zero-latency translations of common school and text words
const DICTIONARY: Record<string, { ru: string; zh: string; pinyin?: string; def?: string; pos?: string }> = {
  // Diary of a Spider vocabulary
  'molt': { ru: 'линять, сбрасывать кожу', zh: '蜕皮', pinyin: 'tuì pí', def: 'To shed old feathers, hair, or skin to make way for new growth.', pos: 'verb' },
  'molted': { ru: 'полинял, сбросил старую кожу', zh: '蜕皮了', pinyin: 'tuì pí le', def: 'Shed old skin because of growing bigger.', pos: 'verb' },
  'molting': { ru: 'линька, сбрасывание старой кожи', zh: '蜕皮中', pinyin: 'tuì pí zhōng', def: 'The process of shedding an outer skeleton or skin.', pos: 'noun / verb' },
  'concentric': { ru: 'концентрический (с общим центром)', zh: '同心的', pinyin: 'tóng xīn de', def: 'Circles or rings sharing the same center.', pos: 'adjective' },
  'drill': { ru: 'учебная тренировка, учения', zh: '演练，演习', pinyin: 'yǎn liàn', def: 'A practice exercise to rehearse procedures in case of emergency.', pos: 'noun' },
  'judge': { ru: 'судить, осуждать, делать выводы', zh: '评价，评判', pinyin: 'píng pàn', def: 'To form an opinion or conclusion about someone.', pos: 'verb' },
  'release': { ru: 'выпускать, отпускать', zh: '释放，放出', pinyin: 'shì fàng', def: 'To allow something to move or escape freely.', pos: 'verb' },
  'silk': { ru: 'паучий шёлк, нить паутины', zh: '蛛丝，蚕丝', pinyin: 'zhū sī', def: 'Fine, strong, soft thread spun by spiders.', pos: 'noun' },
  'fountain': { ru: 'питьевой фонтанчик, фонтан', zh: '饮水器，喷泉', pinyin: 'pēn quán', def: 'A water fountain used for drinking at parks or schools.', pos: 'noun' },
  'vacuums': { ru: 'пылесосы', zh: '吸尘器', pinyin: 'xī chén qì', def: 'Electrical cleaning machines that suck in air and dirt.', pos: 'noun' },
  'vacuum': { ru: 'пылесос', zh: '吸尘器', pinyin: 'xī chén qì', def: 'An electrical machine that cleans by suction.', pos: 'noun' },
  'barbecue': { ru: 'барбекю, шашлык', zh: '烧烤', pinyin: 'shāo kǎo', def: 'A meal cooked outdoors on a grill over an open fire.', pos: 'noun' },
  'grandparents': { ru: 'бабушка и дедушка', zh: '祖父母', pinyin: 'zǔ fù mǔ', def: 'The parents of a person\'s father or mother.', pos: 'noun' },
  'grampa': { ru: 'дедушка', zh: '爷爷，外公', pinyin: 'yé ye', def: 'Informal word for grandfather.', pos: 'noun' },
  'seesaw': { ru: 'качели-доска, детские качели-весы', zh: '跷跷板', pinyin: 'qiāo qiāo bǎn', def: 'A long plank balanced in the middle on which two children play by riding up and down.', pos: 'noun' },
  'gross': { ru: 'противный, мерзкий, отвратительный', zh: '恶心的', pinyin: 'ě xīn de', def: 'Unpleasant and distasteful.', pos: 'adjective' },
  'allegiance': { ru: 'верность, преданность', zh: '效忠，忠诚', pinyin: 'xiào zhōng', def: 'Loyalty or commitment to a nation, group, or cause.', pos: 'noun' },
  'pledge': { ru: 'торжественная клятва, обещание', zh: '誓言，誓词', pinyin: 'shì yán', def: 'A solemn promise or undertaking.', pos: 'noun' },
  'breeze': { ru: 'легкий ветерок, бриз', zh: '微风', pinyin: 'wēi fēng', def: 'A gentle and pleasant wind.', pos: 'noun' },
  'postcard': { ru: 'почтовая открытка', zh: '明信片', pinyin: 'míng xìn piàn', def: 'A card for sending a message by mail without an envelope.', pos: 'noun' },
  'napped': { ru: 'вздремнул, спал днем', zh: '小睡，打瞌睡', pinyin: 'xiǎo shuì le', def: 'Slept lightly or briefly, especially during the day.', pos: 'verb' },
  'shoe': { ru: 'ботинок, туфля', zh: '鞋子', pinyin: 'xié zi', def: 'Footwear covering the human foot.', pos: 'noun' },
  'bite': { ru: 'кусать, укус', zh: '咬，叮', pinyin: 'yǎo', def: 'To use teeth or jaws to cut into something.', pos: 'verb / noun' },
  'arachnid': { ru: 'паукообразное', zh: '蛛形纲动物', pinyin: 'zhū xíng gāng dòng wù', def: 'A creature with eight legs and no antennae, such as a spider or scorpion.', pos: 'noun' },
  'fangs': { ru: 'клыки, ядовитые зубы паука', zh: '尖牙，毒牙', pinyin: 'jiān yá', def: 'Large, sharp teeth or hollow appendages used by spiders.', pos: 'noun' },
  'terrifying': { ru: 'устрашающий, очень пугающий', zh: '令人恐惧的', pinyin: 'lìng rén kǒng jù de', def: 'Extremely frightening or causing immense fear.', pos: 'adjective' },
  'gigantic': { ru: 'гигантский, огромный', zh: '巨大的', pinyin: 'jù dà de', def: 'Of extraordinarily large size; huge.', pos: 'adjective' },
  'enemies': { ru: 'враги, противники', zh: '敌人', pinyin: 'dí rén', def: 'People or creatures hostile to each other.', pos: 'noun' },
  'enemy': { ru: 'враг', zh: '敌人', pinyin: 'dí rén', def: 'A hostile person or opponent.', pos: 'noun' },
  'porch': { ru: 'крыльцо, веранда', zh: '门廊，走廊', pinyin: 'mén láng', def: 'A covered shelter projecting in front of the entrance of a house.', pos: 'noun' },
  'dandelion': { ru: 'одуванчик', zh: '蒲公英', pinyin: 'pú gōng yīng', def: 'A widely distributed wild plant with yellow flowers.', pos: 'noun' },
  'complimented': { ru: 'сделал комплимент, похвалил', zh: '称赞，夸奖', pinyin: 'chēng zàn', def: 'Politely praised or congratulated someone.', pos: 'verb' },
  'insects': { ru: 'насекомые', zh: '昆虫', pinyin: 'kūn chóng', def: 'Small animals with six legs and three body sections.', pos: 'noun' },
  'spider': { ru: 'паук', zh: '蜘蛛', pinyin: 'zhī zhū', def: 'An eight-legged arachnid that spins webs.', pos: 'noun' },
  'fly': { ru: 'муха', zh: '苍蝇', pinyin: 'cāng yíng', def: 'A small two-winged flying insect.', pos: 'noun' },
  'web': { ru: 'паутина, сеть', zh: '蜘蛛网', pinyin: 'zhī zhū wǎng', def: 'A network of fine threads spun by a spider.', pos: 'noun' },
  'diary': { ru: 'дневник', zh: '日记', pinyin: 'rì jì', def: 'A daily personal written record of events and thoughts.', pos: 'noun' },
  'swing': { ru: 'качели', zh: '秋千', pinyin: 'qiū qiān', def: 'A suspended seat swinging back and forth for recreation.', pos: 'noun' },
  'safety': { ru: 'безопасность', zh: '安全', pinyin: 'ān quán', def: 'The condition of being protected from danger or injury.', pos: 'noun' },
  'courage': { ru: 'мужество, смелость, храбрость', zh: '勇气，胆量', pinyin: 'yǒng qì', def: 'The ability to do something that frightens one; bravery.', pos: 'noun' },
  'luminous': { ru: 'светящийся, яркий в темноте', zh: '发光的，明亮的', pinyin: 'fā guāng de', def: 'Emitting or reflecting bright light.', pos: 'adjective' },
  'hesitation': { ru: 'колебание, нерешительность', zh: '犹豫，迟疑', pinyin: 'yóu yù', def: 'The action of pausing before saying or doing something.', pos: 'noun' },
  'canopy': { ru: 'лесной полог, крона деревьев', zh: '树冠，天篷', pinyin: 'shù guān', def: 'The high overhead roof formed by tree branches.', pos: 'noun' },
  'relic': { ru: 'реликвия, древняя вещь', zh: '遗物，文物', pinyin: 'wén wù', def: 'An object surviving from an earlier historical era.', pos: 'noun' },
  'apprentice': { ru: 'ученик, подмастерье', zh: '学徒，徒弟', pinyin: 'xué tú', def: 'A person learning a skilled craft from a master.', pos: 'noun' },
  'caravan': { ru: 'караван', zh: '商队，大篷车', pinyin: 'shāng duì', def: 'A group of merchants or pilgrims traveling together across harsh terrain.', pos: 'noun' },
  'hospitality': { ru: 'гостеприимство, радушие', zh: '热情好客', pinyin: 'rè qíng hào kè', def: 'The friendly and generous reception of guests.', pos: 'noun' },
  'obscure': { ru: 'затемнять, делать неясным / неясный', zh: '使模糊，晦涩的', pinyin: 'shǐ mó hu', def: 'To conceal from view or make difficult to understand.', pos: 'verb / adjective' },
  'unprecedented': { ru: 'беспрецедентный, небывалый', zh: '空前的，史无前例的', pinyin: 'kōng qián de', def: 'Never done or known before.', pos: 'adjective' },
  'intermittent': { ru: 'прерывистый, периодический', zh: '间歇的，断断续续的', pinyin: 'jiàn xiē de', def: 'Occurring at irregular intervals; not continuous.', pos: 'adjective' },
  'predominantly': { ru: 'преимущественно, в основном', zh: '主要地', pinyin: 'zhǔ yào de', def: 'Mainly; for the most part.', pos: 'adverb' },
  'decentralized': { ru: 'децентрализованный', zh: '分散的，去中心化的', pinyin: 'qù zhōng xīn huà de', def: 'Controlled by several local entities rather than a single center.', pos: 'adjective' },
  'grammar': { ru: 'грамматика', zh: '语法', pinyin: 'yǔ fǎ', def: 'The whole system and structure of a language.', pos: 'noun' },
  'comprehension': { ru: 'понимание, осмысление', zh: '理解，理解力', pinyin: 'lǐ jiě', def: 'The ability to understand what is read or heard.', pos: 'noun' },
  'vocabulary': { ru: 'словарный запас, лексика', zh: '词汇', pinyin: 'cí huì', def: 'A body of words known to an individual or language.', pos: 'noun' },
  'reflection': { ru: 'размышление, рефлексия', zh: '反思，沉思', pinyin: 'fǎn sī', def: 'Serious thought or consideration about an experience.', pos: 'noun' }
};

// Memory cache for API responses
const apiCache = new Map<string, TranslationResult>();

export async function translateText(rawText: string): Promise<TranslationResult> {
  const text = rawText.trim();
  if (!text) {
    return { original: '', russian: '', chinese: '' };
  }

  const lookupKey = text.toLowerCase().replace(/[^a-z0-9]/g, '');

  // 1. Check local dictionary first
  if (DICTIONARY[lookupKey]) {
    const entry = DICTIONARY[lookupKey];
    return {
      original: text,
      russian: entry.ru,
      chinese: entry.zh,
      pinyin: entry.pinyin,
      definition: entry.def,
      partOfSpeech: entry.pos
    };
  }

  // 2. Check memory cache
  if (apiCache.has(text.toLowerCase())) {
    return apiCache.get(text.toLowerCase())!;
  }

  // 3. Fallback: Query translation service
  try {
    const [ruResponse, zhResponse] = await Promise.all([
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ru`),
      fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`)
    ]);

    let ruText = '';
    let zhText = '';

    if (ruResponse.ok) {
      const data = await ruResponse.json();
      ruText = data.responseData?.translatedText || '';
    }

    if (zhResponse.ok) {
      const data = await zhResponse.json();
      zhText = data.responseData?.translatedText || '';
    }

    const result: TranslationResult = {
      original: text,
      russian: ruText || 'Перевод недоступен',
      chinese: zhText || '暂无翻译'
    };

    apiCache.set(text.toLowerCase(), result);
    return result;
  } catch (err) {
    console.warn('Online translation request failed, returning word fallback:', err);
    return {
      original: text,
      russian: `[${text}] (перевод в словаре)`,
      chinese: `[${text}] (词典查询)`
    };
  }
}
