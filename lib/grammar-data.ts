export interface GrammarPoint {
  id: number;
  title: string;
  titleKo: string;
  pattern: string;
  meaning: string;
  explanation: string;
  exampleNative: string;
  exampleEnglish: string;
  tip: string;
  topikLevel: number;
  category: string;
  image: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  Particles: '🔗',
  Verbs: '🏃',
  Adjectives: '🌈',
  Honorifics: '🙇',
  Connectors: '➡️',
  Questions: '❓',
  Time: '⏰',
  Negation: '🚫',
  Comparison: '⚖️',
  Suggestions: '💡',
};

export function getGrammarEmoji(category: string): string {
  return CATEGORY_EMOJI[category] ?? '📚';
}

const koGrammarTopik1: Omit<GrammarPoint, 'id'>[] = [
  { titleKo: '이다 / 아니다', title: 'To be / To not be', pattern: 'N + 이다 / 아니다', meaning: 'Describes what something is or is not', explanation: 'Use 이다 after consonants and 다 after vowels. 아니다 negates the statement.', exampleNative: '저는 학생이에요. / 저는 의사가 아니에요.', exampleEnglish: 'I am a student. / I am not a doctor.', tip: 'In speech, 이에요/예요 are polite forms of 이다.', topikLevel: 1, category: 'Verbs', image: '✨' },
  { titleKo: '입니다', title: 'Formal polite copula', pattern: 'N + 입니다', meaning: 'Formal way to say "is/am/are"', explanation: 'Used in formal settings, presentations, and news.', exampleNative: '이것은 한국어 책입니다.', exampleEnglish: 'This is a Korean book.', tip: 'Consonant ending: 입니다, vowel ending: 입니다 (same).', topikLevel: 1, category: 'Honorifics', image: '🎀' },
  { titleKo: '은/는', title: 'Topic particle', pattern: 'N + 은/는', meaning: 'Marks the topic of the sentence', explanation: '은 after consonant, 는 after vowel. Contrasts or introduces topic.', exampleNative: '저는 한국 사람이에요.', exampleEnglish: 'As for me, I am Korean.', tip: 'Compare with 이/가 (subject focus).', topikLevel: 1, category: 'Particles', image: '🔗' },
  { titleKo: '이/가', title: 'Subject particle', pattern: 'N + 이/가', meaning: 'Marks the grammatical subject', explanation: '이 after consonant, 가 after vowel. Emphasizes who/what does the action.', exampleNative: '친구가 왔어요.', exampleEnglish: 'My friend came.', tip: 'Use 가 with 있다/없다: 시간이 있어요.', topikLevel: 1, category: 'Particles', image: '🔗' },
  { titleKo: '을/를', title: 'Object particle', pattern: 'N + 을/를', meaning: 'Marks the direct object', explanation: '을 after consonant, 를 after vowel.', exampleNative: '커피를 마셔요.', exampleEnglish: 'I drink coffee.', tip: 'Often omitted in casual speech.', topikLevel: 1, category: 'Particles', image: '🔗' },
  { titleKo: '에', title: 'Location/time particle', pattern: 'N + 에', meaning: 'At, in, on (static) / at (time)', explanation: 'Static location or specific time.', exampleNative: '학교에 있어요. / 3시에 만나요.', exampleEnglish: 'I am at school. / Let us meet at 3.', tip: 'Movement uses 에서 or 으로.', topikLevel: 1, category: 'Particles', image: '📍' },
  { titleKo: '에서', title: 'Action location', pattern: 'N + 에서', meaning: 'At/in (where action happens)', explanation: 'Marks where an action takes place.', exampleNative: '도서관에서 공부해요.', exampleEnglish: 'I study at the library.', tip: 'Also means "from" with movement verbs.', topikLevel: 1, category: 'Particles', image: '📍' },
  { titleKo: '으로/로', title: 'Direction/means', pattern: 'N + (으)로', meaning: 'Toward, by means of', explanation: '으로 after consonant (except ㄹ), 로 after vowel or ㄹ.', exampleNative: '버스로 가요.', exampleEnglish: 'I go by bus.', tip: 'Also: 왼쪽으로 가세요.', topikLevel: 1, category: 'Particles', image: '➡️' },
  { titleKo: '와/과, 하고', title: 'And (with nouns)', pattern: 'N + 와/과 / N + 하고', meaning: 'And, with', explanation: '와 after vowel, 과 after consonant. 하고 is common in speech.', exampleNative: '친구하고 영화를 봐요.', exampleEnglish: 'I watch a movie with a friend.', tip: '하고 can also mean "and then".', topikLevel: 1, category: 'Connectors', image: '🤝' },
  { titleKo: '의', title: 'Possession', pattern: 'N + 의', meaning: 'Of, belonging to', explanation: 'Shows possession or relationship. Often dropped in speech.', exampleNative: '제 친구의 집이에요.', exampleEnglish: 'It is my friend\'s house.', tip: 'Pronunciation often blends: 친구의 → 친구에.', topikLevel: 1, category: 'Particles', image: '💝' },
  { titleKo: '도', title: 'Also, too', pattern: 'N + 도', meaning: 'Also, even', explanation: 'Replaces 을/를 or other particles.', exampleNative: '저도 한국어를 공부해요.', exampleEnglish: 'I also study Korean.', tip: 'Adds emphasis: 비싸도 사요.', topikLevel: 1, category: 'Particles', image: '➕' },
  { titleKo: '만', title: 'Only', pattern: 'N + 만', meaning: 'Only, just', explanation: 'Limits to one thing.', exampleNative: '물만 주세요.', exampleEnglish: 'Water only, please.', tip: 'Can combine: 저만 = only me.', topikLevel: 1, category: 'Particles', image: '1️⃣' },
  { titleKo: '아/어요', title: 'Present tense polite', pattern: 'V stem + 아/어요', meaning: 'Present habitual action/state', explanation: '아 after bright vowels, 어 after dark vowels, 해 for 하다.', exampleNative: '매일 운동해요.', exampleEnglish: 'I exercise every day.', tip: 'ㅂ irregular: 춥다 → 추워요.', topikLevel: 1, category: 'Verbs', image: '🏃' },
  { titleKo: '았/었어요', title: 'Past tense polite', pattern: 'V stem + 았/었어요', meaning: 'Past completed action', explanation: '았 after bright vowel stem, 었 after dark vowel stem.', exampleNative: '어제 영화를 봤어요.', exampleEnglish: 'I watched a movie yesterday.', tip: '하다 → 했어요.', topikLevel: 1, category: 'Verbs', image: '⏪' },
  { titleKo: '을/를 거예요', title: 'Future tense', pattern: 'V stem + (으)ㄹ 거예요', meaning: 'Will, going to', explanation: 'Expresses future intention or plan.', exampleNative: '내일 부산에 갈 거예요.', exampleEnglish: 'I will go to Busan tomorrow.', tip: 'Casual: 갈 거야.', topikLevel: 1, category: 'Verbs', image: '🔮' },
  { titleKo: '고 싶다', title: 'Want to', pattern: 'V stem + 고 싶다', meaning: 'Want to do', explanation: 'Expresses speaker\'s desire.', exampleNative: '한국에 가고 싶어요.', exampleEnglish: 'I want to go to Korea.', tip: '고 싶어하다 for third person.', topikLevel: 1, category: 'Verbs', image: '💭' },
  { titleKo: '세요 / 으세요', title: 'Polite imperative', pattern: 'V stem + (으)세요', meaning: 'Please do (polite request)', explanation: 'Soft command or suggestion.', exampleNative: '여기 앉으세요.', exampleEnglish: 'Please sit here.', tip: 'Also honorific: 드세요 (eat).', topikLevel: 1, category: 'Honorifics', image: '🙇' },
  { titleKo: '지 마세요', title: 'Please don\'t', pattern: 'V stem + 지 마세요', meaning: 'Please do not', explanation: 'Polite prohibition.', exampleNative: '여기서 담배를 피우지 마세요.', exampleEnglish: 'Please don\'t smoke here.', tip: 'Casual: 하지 마.', topikLevel: 1, category: 'Negation', image: '🚫' },
  { titleKo: '안', title: 'Short negation', pattern: '안 + V', meaning: 'Not (before verb)', explanation: 'Placed directly before the verb.', exampleNative: '오늘 안 가요.', exampleEnglish: 'I am not going today.', tip: 'Different from 못 (cannot).', topikLevel: 1, category: 'Negation', image: '🚫' },
  { titleKo: '못', title: 'Cannot', pattern: '못 + V', meaning: 'Cannot (ability)', explanation: 'Indicates inability or impossibility.', exampleNative: '한국어를 못 해요.', exampleEnglish: 'I cannot speak Korean.', tip: 'vs 안 = choose not to.', topikLevel: 1, category: 'Negation', image: '⛔' },
  { titleKo: '아/어서', title: 'Because, and then', pattern: 'V/A stem + 아/어서', meaning: 'Reason or sequence', explanation: 'Cannot use with imperative in reason clause.', exampleNative: '피곤해서 집에 갔어요.', exampleEnglish: 'I was tired so I went home.', tip: 'Sequence: 밥을 먹어서 학교에 갔어요.', topikLevel: 1, category: 'Connectors', image: '➡️' },
  { titleKo: '지만', title: 'But', pattern: 'V/A stem + 지만', meaning: 'However, but', explanation: 'Contrasts two clauses.', exampleNative: '비싸지만 맛있어요.', exampleEnglish: 'It is expensive but delicious.', tip: 'Formal: 지만요.', topikLevel: 1, category: 'Connectors', image: '⚖️' },
  { titleKo: '고', title: 'And (verbs)', pattern: 'V stem + 고', meaning: 'And (listing actions)', explanation: 'Connects verbs or adjectives.', exampleNative: '밥을 먹고 커피를 마셔요.', exampleEnglish: 'I eat and drink coffee.', tip: 'Different from 하고 (nouns).', topikLevel: 1, category: 'Connectors', image: '➡️' },
  { titleKo: '는데', title: 'Background / contrast', pattern: 'V + 는데 / A + (은)데', meaning: 'But, and, background info', explanation: 'Very common in spoken Korean.', exampleNative: '한국어는 어려운데 재미있어요.', exampleEnglish: 'Korean is hard but fun.', tip: 'Softens requests: 도와주실 수 있는데...', topikLevel: 1, category: 'Connectors', image: '💬' },
  { titleKo: '아/어 주다', title: 'Do for someone', pattern: 'V stem + 아/어 주다', meaning: 'Do a favor', explanation: 'Shows benefit to someone.', exampleNative: '사진을 찍어 주세요.', exampleEnglish: 'Please take a photo (for me).', tip: 'Honorific: 드리다.', topikLevel: 1, category: 'Honorifics', image: '🎁' },
  { titleKo: '아/어 보다', title: 'Try doing', pattern: 'V stem + 아/어 보다', meaning: 'Try to do', explanation: 'Attempt or experience.', exampleNative: '이 옷을 입어 보세요.', exampleEnglish: 'Try on these clothes.', tip: 'Past: 입어 봤어요 = I tried.', topikLevel: 1, category: 'Verbs', image: '👀' },
  { titleKo: '아/어야 해요', title: 'Must / have to', pattern: 'V stem + 아/어야 해요', meaning: 'Must do', explanation: 'Obligation or necessity.', exampleNative: '숙제를 해야 해요.', exampleEnglish: 'I have to do homework.', tip: 'Casual: 해야 돼.', topikLevel: 1, category: 'Verbs', image: '❗' },
  { titleKo: '아/어도 돼요', title: 'May / it\'s OK', pattern: 'V stem + 아/어도 돼요', meaning: 'It is OK to', explanation: 'Permission granted.', exampleNative: '여기 앉아도 돼요?', exampleEnglish: 'May I sit here?', tip: 'Negative: 안 돼요.', topikLevel: 1, category: 'Questions', image: '✅' },
  { titleKo: '을/를 수 있다', title: 'Can do', pattern: 'V stem + (으)ㄹ 수 있다', meaning: 'Ability / possibility', explanation: 'Expresses ability.', exampleNative: '수영을 할 수 있어요.', exampleEnglish: 'I can swim.', tip: 'Negative: 수 없다.', topikLevel: 1, category: 'Verbs', image: '💪' },
  { titleKo: '을/를 때', title: 'When', pattern: 'V stem + 을/를 때', meaning: 'When (doing)', explanation: 'Time clause.', exampleNative: '한국에 갔을 때 김치를 먹었어요.', exampleEnglish: 'When I went to Korea I ate kimchi.', tip: 'A + 은/ㄴ 때 for adjectives.', topikLevel: 1, category: 'Time', image: '⏰' },
  { titleKo: '전에 / 후에', title: 'Before / after', pattern: 'N/V + 전에 / 후에', meaning: 'Before / after', explanation: 'Time relation.', exampleNative: '식사 전에 손을 씻어요.', exampleEnglish: 'I wash hands before meals.', tip: '전에 can use V dictionary form.', topikLevel: 1, category: 'Time', image: '⏰' },
  { titleKo: '부터 / 까지', title: 'From / until', pattern: 'N + 부터 / 까지', meaning: 'From ~ to ~', explanation: 'Range in time or space.', exampleNative: '9시부터 5시까지 일해요.', exampleEnglish: 'I work from 9 to 5.', tip: 'Also: 여기부터 저기까지.', topikLevel: 1, category: 'Time', image: '📅' },
  { titleKo: '마다', title: 'Every', pattern: 'N + 마다', meaning: 'Every, each', explanation: 'Frequency.', exampleNative: '매일마다 운동해요.', exampleEnglish: 'I exercise every day.', tip: 'Often with time words.', topikLevel: 1, category: 'Time', image: '🔁' },
  { titleKo: '보다', title: 'More than', pattern: 'N + 보다', meaning: 'Comparison', explanation: 'Standard of comparison comes first.', exampleNative: '커피보다 차를 좋아해요.', exampleEnglish: 'I like tea more than coffee.', tip: 'With adjective: 더 비싸요.', topikLevel: 1, category: 'Comparison', image: '⚖️' },
  { titleKo: '가장 / 제일', title: 'Most', pattern: '가장 / 제일 + A', meaning: 'The most', explanation: 'Superlative.', exampleNative: '이게 제일 맛있어요.', exampleEnglish: 'This is the most delicious.', tip: '제일 is more colloquial.', topikLevel: 1, category: 'Comparison', image: '🏆' },
  { titleKo: '같이 / 처럼', title: 'Like, as', pattern: 'N + 같이/처럼', meaning: 'Like, together with', explanation: 'Similarity or accompaniment.', exampleNative: '친구같이 친절해요.', exampleEnglish: 'Kind like a friend.', tip: '같이 also means "together".', topikLevel: 1, category: 'Comparison', image: '🪞' },
  { titleKo: '은/는 것', title: 'Nominalizer', pattern: 'V + 는 것', meaning: 'The act of ~ing', explanation: 'Turns verb phrase into noun.', exampleNative: '한국어를 배우는 것이 재미있어요.', exampleEnglish: 'Learning Korean is fun.', tip: 'Past: 먹은 것.', topikLevel: 1, category: 'Verbs', image: '📦' },
  { titleKo: '을/를까요?', title: 'Shall we?', pattern: 'V stem + 을/를까요?', meaning: 'Shall we? / I wonder', explanation: 'Suggestion or wondering.', exampleNative: '영화를 볼까요?', exampleEnglish: 'Shall we watch a movie?', tip: 'Also soft question.', topikLevel: 1, category: 'Suggestions', image: '💡' },
  { titleKo: '아/어요? (question)', title: 'Yes/no questions', pattern: 'Sentence + 요?', meaning: 'Polite question', explanation: 'Rising intonation or 요? ending.', exampleNative: '한국 사람이에요?', exampleEnglish: 'Are you Korean?', tip: 'Wh-questions keep 요 ending.', topikLevel: 1, category: 'Questions', image: '❓' },
  { titleKo: '뭐 / 어디 / 언제', title: 'Question words', pattern: '뭐, 어디, 언제, 누구, 왜, 어떻게', meaning: 'What, where, when...', explanation: 'Basic interrogatives.', exampleNative: '뭐 먹고 싶어요?', exampleEnglish: 'What do you want to eat?', tip: 'Place particle: 어디에, 어디서.', topikLevel: 1, category: 'Questions', image: '❓' },
  { titleKo: '아/예요?', title: 'Is it?', pattern: 'N + (이)에요?', meaning: 'Is it? (noun)', explanation: 'Question form of 이다.', exampleNative: '이거 뭐예요?', exampleEnglish: 'What is this?', tip: 'Past: 이었어요?', topikLevel: 1, category: 'Questions', image: '❓' },
  { titleKo: '있어요 / 없어요', title: 'Exist / not exist', pattern: 'N + 이/가 있어요/없어요', meaning: 'There is / have / don\'t have', explanation: 'Existence and possession.', exampleNative: '시간이 없어요.', exampleEnglish: 'I don\'t have time.', tip: 'Location: 책상 위에 있어요.', topikLevel: 1, category: 'Verbs', image: '📍' },
  { titleKo: '아/어 가다/오다', title: 'Go/come doing', pattern: 'V stem + 아/어 가다/오다', meaning: 'Continuing movement', explanation: 'Action while going/coming.', exampleNative: '노래를 부르면서 걸어 왔어요.', exampleEnglish: 'I walked here singing.', tip: 'Progressive nuance.', topikLevel: 1, category: 'Verbs', image: '🚶' },
  { titleKo: '아/은/는', title: 'Adjective modifier', pattern: 'A stem + 은/는', meaning: 'Modifies noun (present)', explanation: 'Present tense adjective before noun.', exampleNative: '맛있는 음식', exampleEnglish: 'Delicious food', tip: 'Past: 맛있던 음식.', topikLevel: 1, category: 'Adjectives', image: '🌈' },
  { titleKo: '너무 / 아주 / 정말', title: 'Degree adverbs', pattern: '너무, 아주, 정말, 조금', meaning: 'Very, really, a little', explanation: 'Modify adjectives and verbs.', exampleNative: '너무 맛있어요!', exampleEnglish: 'It is so delicious!', tip: '너무 can imply "too much".', topikLevel: 1, category: 'Adjectives', image: '✨' },
  { titleKo: '잘 / 못 (adverb)', title: 'Well / poorly', pattern: '잘 / 못 + V', meaning: 'Well or poorly', explanation: 'Manner adverbs before verb.', exampleNative: '한국어를 잘 해요.', exampleEnglish: 'I speak Korean well.', tip: '못 here is manner, not negation.', topikLevel: 1, category: 'Adjectives', image: '⭐' },
  { titleKo: '마다 honorific', title: '시 honorific', pattern: 'V stem + 시 + ending', meaning: 'Honorific for subject', explanation: 'Raises subject\'s status.', exampleNative: '선생님이 오세요.', exampleEnglish: 'The teacher is coming.', tip: 'Special: 드시다, 주시다.', topikLevel: 1, category: 'Honorifics', image: '🙇' },
];

const koGrammarTopik2: Omit<GrammarPoint, 'id'>[] = [
  { titleKo: '는데요', title: 'Soft explanation', pattern: 'V/A + 는데요', meaning: 'Explaining situation (polite)', explanation: 'Provides background politely.', exampleNative: '지금 바쁜데요, 나중에 전화할게요.', exampleEnglish: 'I am busy now, I will call later.', tip: 'Common in phone conversations.', topikLevel: 2, category: 'Connectors', image: '💬' },
  { titleKo: '아/어 놓다', title: 'Keep state', pattern: 'V + 아/어 놓다', meaning: 'Leave in a state', explanation: 'Result remains.', exampleNative: '문을 열어 놓았어요.', exampleEnglish: 'I left the door open.', tip: 'Preparation: 준비해 놓다.', topikLevel: 2, category: 'Verbs', image: '📌' },
  { titleKo: '아/어 버리다', title: 'Completely done', pattern: 'V + 아/어 버리다', meaning: 'Done completely (often regret)', explanation: 'Emphasizes completion.', exampleNative: '다 먹어 버렸어요.', exampleEnglish: 'I ate it all up.', tip: 'Can express regret.', topikLevel: 2, category: 'Verbs', image: '✔️' },
  { titleKo: '게 되다', title: 'Come to be', pattern: 'V + 게 되다', meaning: 'End up, come to', explanation: 'Change of state over time.', exampleNative: '한국에 오게 됐어요.', exampleEnglish: 'I came to be in Korea / I ended up coming.', tip: 'Often external factors.', topikLevel: 2, category: 'Verbs', image: '🔄' },
  { titleKo: '는 것 같다', title: 'Seems like', pattern: 'V/A + 는 것 같다', meaning: 'It seems', explanation: 'Conjecture based on evidence.', exampleNative: '비가 올 것 같아요.', exampleEnglish: 'It seems like it will rain.', tip: 'Casual: ㄴ 것 같아.', topikLevel: 2, category: 'Verbs', image: '🤔' },
  { titleKo: '아/어지다', title: 'Become', pattern: 'A stem + 아/어지다', meaning: 'Become (adjective)', explanation: 'Change of state.', exampleNative: '날씨가 추워졌어요.', exampleEnglish: 'The weather became cold.', tip: 'Also for verbs in some cases.', topikLevel: 2, category: 'Adjectives', image: '🌡️' },
  { titleKo: '도록', title: 'So that', pattern: 'V + 도록', meaning: 'So that, in order to', explanation: 'Purpose or degree.', exampleNative: '잘 들리도록 크게 말하세요.', exampleEnglish: 'Speak loudly so it can be heard well.', tip: 'Also: ~도록 하다 (make sure).', topikLevel: 2, category: 'Connectors', image: '🎯' },
  { titleKo: '는 바람에', title: 'Because (result)', pattern: 'V + 는 바람에', meaning: 'Because of (unexpected result)', explanation: 'Cause with often negative result.', exampleNative: '비가 오는 바람에 못 갔어요.', exampleEnglish: 'Because it rained I couldn\'t go.', tip: 'Formal/written nuance.', topikLevel: 2, category: 'Connectors', image: '🌧️' },
  { titleKo: '아/어도', title: 'Even if', pattern: 'V/A + 아/어도', meaning: 'Even if, even though', explanation: 'Concessive condition.', exampleNative: '비가 와도 갈 거예요.', exampleEnglish: 'Even if it rains I will go.', tip: 'Different from 지만.', topikLevel: 2, category: 'Connectors', image: '☔' },
  { titleKo: '으면', title: 'If / when', pattern: 'V/A + (으)면', meaning: 'If, when', explanation: 'Conditional.', exampleNative: '시간이 있으면 만나요.', exampleEnglish: 'If you have time, let us meet.', tip: 'Past hypothetical: 았/었으면.', topikLevel: 2, category: 'Connectors', image: '🔀' },
  { titleKo: '자마자', title: 'As soon as', pattern: 'V + 자마자', meaning: 'As soon as', explanation: 'Immediate sequence.', exampleNative: '집에 오자마자 씻었어요.', exampleEnglish: 'As soon as I got home I washed.', tip: 'Always after verb stem.', topikLevel: 2, category: 'Time', image: '⚡' },
  { titleKo: '는 동안', title: 'During', pattern: 'V + 는 동안', meaning: 'While', explanation: 'Duration of action.', exampleNative: '자는 동안 전화가 왔어요.', exampleEnglish: 'While sleeping a call came.', tip: 'N + 동안 also works.', topikLevel: 2, category: 'Time', image: '⏳' },
  { titleKo: '아/어 있다', title: 'Ongoing state', pattern: 'V + 아/어 있다', meaning: 'In the state of', explanation: 'Resultant state continues.', exampleNative: '문이 열려 있어요.', exampleEnglish: 'The door is open.', tip: 'Different from progressive.', topikLevel: 2, category: 'Verbs', image: '🚪' },
  { titleKo: '아/어 가지고', title: 'Because (spoken)', pattern: 'V + 아/어 가지고', meaning: 'Because (casual)', explanation: 'Casual reason.', exampleNative: '피곤해 가지고 일찍 잤어요.', exampleEnglish: 'I was tired so I slept early.', tip: 'Very colloquial.', topikLevel: 2, category: 'Connectors', image: '💬' },
  { titleKo: 'ㄴ/은 적이 있다', title: 'Have experienced', pattern: 'V + 은/ㄴ 적이 있다', meaning: 'Have done before', explanation: 'Past experience.', exampleNative: '한국에 간 적이 있어요.', exampleEnglish: 'I have been to Korea before.', tip: 'Negative: 적이 없다.', topikLevel: 2, category: 'Verbs', image: '🗺️' },
  { titleKo: '아/어야지', title: 'Should (resolve)', pattern: 'V + 아/어야지', meaning: 'I should, I will', explanation: 'Self-resolve or suggestion.', exampleNative: '이제 공부해야지.', exampleEnglish: 'I should study now.', tip: 'Casual determination.', topikLevel: 2, category: 'Verbs', image: '💪' },
  { titleKo: '기로 하다', title: 'Decide to', pattern: 'V + 기로 하다', meaning: 'Decide to', explanation: 'Decision made.', exampleNative: '매일 운동하기로 했어요.', exampleEnglish: 'I decided to exercise daily.', tip: 'Also plans: 만나기로 했어요.', topikLevel: 2, category: 'Verbs', image: '📝' },
  { titleKo: '아/어 달라고', title: 'Ask to do', pattern: 'V + 아/어 달라고', meaning: 'Ask someone to', explanation: 'Reported request.', exampleNative: '도와 달라고 했어요.', exampleEnglish: 'I asked them to help.', tip: 'Part of indirect speech.', topikLevel: 2, category: 'Honorifics', image: '🗣️' },
  { titleKo: '다고 하다', title: 'Reported speech', pattern: 'Sentence + 다고 하다', meaning: 'Say that', explanation: 'Indirect quotation.', exampleNative: '한국어가 어렵다고 했어요.', exampleEnglish: 'They said Korean is hard.', tip: 'Question: 냐고 하다.', topikLevel: 2, category: 'Connectors', image: '💬' },
  { titleKo: '아/어 주시겠어요?', title: 'Polite request', pattern: 'V + 아/어 주시겠어요?', meaning: 'Would you please...', explanation: 'Very polite request.', exampleNative: '이것 좀 봐 주시겠어요?', exampleEnglish: 'Would you please look at this?', tip: 'Service industry standard.', topikLevel: 2, category: 'Honorifics', image: '🙏' },
  { titleKo: '아/어 보이다', title: 'Looks like', pattern: 'A + 아/어 보이다', meaning: 'Looks, appears', explanation: 'Appearance from observer.', exampleNative: '피곤해 보여요.', exampleEnglish: 'You look tired.', tip: 'Different from 것 같다.', topikLevel: 2, category: 'Adjectives', image: '👁️' },
  { titleKo: '을/를 빼다', title: 'Except', pattern: 'N + 을/를 제외하고', meaning: 'Except for', explanation: 'Exclusion.', exampleNative: '주말을 제외하고 매일 일해요.', exampleEnglish: 'I work every day except weekends.', tip: 'Also: 빼고.', topikLevel: 2, category: 'Comparison', image: '➖' },
  { titleKo: '에 따라', title: 'Depending on', pattern: 'N + 에 따라', meaning: 'Depending on', explanation: 'Varies by condition.', exampleNative: '사람에 따라 달라요.', exampleEnglish: 'It depends on the person.', tip: 'Also: V + 에 따라.', topikLevel: 2, category: 'Comparison', image: '🔀' },
  { titleKo: '을/를 통해서', title: 'Through', pattern: 'N + 을/를 통해서', meaning: 'Through, via', explanation: 'Means or channel.', exampleNative: '인터넷을 통해서 샀어요.', exampleEnglish: 'I bought it through the internet.', tip: 'Formal: 통해.', topikLevel: 2, category: 'Particles', image: '🌐' },
  { titleKo: '는 편이다', title: 'Tend to', pattern: 'V + 는 편이다', meaning: 'Tend to', explanation: 'General tendency.', exampleNative: '집에서 노는 편이에요.', exampleEnglish: 'I tend to hang out at home.', tip: 'Soft generalization.', topikLevel: 2, category: 'Verbs', image: '📊' },
  { titleKo: '아/어 두다', title: 'Put aside for later', pattern: 'V + 아/어 두다', meaning: 'Keep for later', explanation: 'Preparation.', exampleNative: '돈을 저축해 두었어요.', exampleEnglish: 'I saved money (for later).', tip: 'Similar to 놓다.', topikLevel: 2, category: 'Verbs', image: '💰' },
  { titleKo: '아/어 내다', title: 'Finish completely', pattern: 'V + 아/어 내다', meaning: 'Finish doing', explanation: 'Complete through effort.', exampleNative: '숙제를 다 해 냈어요.', exampleEnglish: 'I finished all the homework.', tip: 'Emphasis on completion.', topikLevel: 2, category: 'Verbs', image: '✅' },
  { titleKo: '아/어 오다 (change)', title: 'Gradual change', pattern: 'A + 아/어 오다', meaning: 'Become over time', explanation: 'Gradual change toward now.', exampleNative: '날씨가 따뜻해 왔어요.', exampleEnglish: 'The weather has been getting warm.', tip: 'Opposite: 아/어 가다 (going forward).', topikLevel: 2, category: 'Adjectives', image: '🌸' },
  { titleKo: '을/ㄹ 뿐이다', title: 'Only (just)', pattern: 'V + 을/ㄹ 뿐이다', meaning: 'Only, nothing but', explanation: 'Limitation emphasis.', exampleNative: '한 번 뿐이에요.', exampleEnglish: 'It is only once.', tip: 'More formal than 만.', topikLevel: 2, category: 'Particles', image: '1️⃣' },
  { titleKo: '아/어야겠다', title: 'Must (resolve)', pattern: 'V + 아/어야겠다', meaning: 'I must, I should', explanation: 'Strong personal resolve.', exampleNative: '이제 정말 공부해야겠어요.', exampleEnglish: 'I really must study now.', tip: 'Speaker\'s determination.', topikLevel: 2, category: 'Verbs', image: '❗' },
  { titleKo: '는 한', title: 'As long as', pattern: 'V + 는 한', meaning: 'As long as', explanation: 'Condition for result.', exampleNative: '노력하는 한 포기하지 않을 거예요.', exampleEnglish: 'As long as I try I won\'t give up.', tip: 'Formal/written.', topikLevel: 2, category: 'Connectors', image: '🔗' },
  { titleKo: '아/어서는 안 되다', title: 'Must not', pattern: 'V + 아/어서는 안 되다', meaning: 'Must not', explanation: 'Prohibition.', exampleNative: '여기서 뛰어서는 안 돼요.', exampleEnglish: 'You must not run here.', tip: 'Stronger than 지 마세요.', topikLevel: 2, category: 'Negation', image: '🚫' },
  { titleKo: '아/어 보니까', title: 'After trying', pattern: 'V + 아/어 보니까', meaning: 'After doing, I found', explanation: 'Discovery after experience.', exampleNative: '먹어 보니까 맛있어요.', exampleEnglish: 'After eating it, it is tasty.', tip: 'Common review pattern.', topikLevel: 2, category: 'Verbs', image: '😋' },
  { titleKo: '을/ㄹ 줄 알다', title: 'Know how to', pattern: 'V + 을/ㄹ 줄 알다', meaning: 'Know how to', explanation: 'Knowledge of method.', exampleNative: '수영할 줄 알아요.', exampleEnglish: 'I know how to swim.', tip: 'Negative: 줄 모르다.', topikLevel: 2, category: 'Verbs', image: '🎓' },
  { titleKo: '아/어 달라고 하다', title: 'Request (reported)', pattern: 'V + 아/어 달라고 하다', meaning: 'Ask (someone) to', explanation: 'Third party request.', exampleNative: '선생님이 조용히 하라고 하셨어요.', exampleEnglish: 'The teacher asked us to be quiet.', tip: 'Honorific: 하시다.', topikLevel: 2, category: 'Honorifics', image: '🤫' },
  { titleKo: '아/어 주면 안 돼요?', title: 'Could you?', pattern: 'V + 아/어 주면 안 돼요?', meaning: 'Could you possibly...', explanation: 'Soft favor request.', exampleNative: '한 번 더 말해 주면 안 돼요?', exampleEnglish: 'Could you say it one more time?', tip: 'Very polite casual.', topikLevel: 2, category: 'Suggestions', image: '🥺' },
  { titleKo: '는데다가', title: 'Moreover', pattern: 'V/A + 는데다(가)', meaning: 'Moreover, on top of that', explanation: 'Adding information.', exampleNative: '비가 오는데다가 바람도 불어요.', exampleEnglish: 'On top of raining, the wind blows too.', tip: 'Adds emphasis.', topikLevel: 2, category: 'Connectors', image: '➕' },
  { titleKo: '아/어 가다 (future)', title: 'Continue into future', pattern: 'A + 아/어 가다', meaning: 'Will become (going forward)', explanation: 'Change toward future.', exampleNative: '앞으로 더 어려워 갈 거예요.', exampleEnglish: 'It will get harder going forward.', tip: 'Pair with 아/어 오다.', topikLevel: 2, category: 'Adjectives', image: '📈' },
  { titleKo: '을/ㄹ게요', title: 'Promise/intent', pattern: 'V + 을/ㄹ게요', meaning: 'I will (for you)', explanation: 'Speaker\'s promise to listener.', exampleNative: '내일 꼭 갈게요.', exampleEnglish: 'I will definitely come tomorrow.', tip: 'Shows consideration.', topikLevel: 2, category: 'Verbs', image: '🤝' },
  { titleKo: '아/어 주시다 honorific', title: 'Honorific giving', pattern: 'V + 아/어 주시다', meaning: 'Honorific do for', explanation: 'Respectful benefit action.', exampleNative: '선생님이 설명해 주셨어요.', exampleEnglish: 'The teacher explained (for us).', tip: '시 + 주다 combined.', topikLevel: 2, category: 'Honorifics', image: '👨‍🏫' },
  { titleKo: '아/어야 되다', title: 'Have to (spoken)', pattern: 'V + 아/어야 되다/돼', meaning: 'Have to', explanation: 'Colloquial obligation.', exampleNative: '지금 가야 돼요.', exampleEnglish: 'I have to go now.', tip: '돼 more common in speech.', topikLevel: 2, category: 'Verbs', image: '⏰' },
  { titleKo: '는 것이 좋다', title: 'It is good to', pattern: 'V + 는 것이 좋다', meaning: 'It is better to', explanation: 'Advice.', exampleNative: '일찍 자는 것이 좋아요.', exampleEnglish: 'It is good to sleep early.', tip: 'Soft recommendation.', topikLevel: 2, category: 'Suggestions', image: '💡' },
  { titleKo: '아/어지다 (passive feel)', title: 'Get/become', pattern: 'V + 아/어지다', meaning: 'Become (change)', explanation: 'Change of state from action.', exampleNative: '문제가 해결됐어요 → 풀리다.', exampleEnglish: 'The problem was solved.', tip: 'Many passive-like verbs.', topikLevel: 2, category: 'Verbs', image: '🔄' },
  { titleKo: '아/어 보다 (experience)', title: 'Have tried', pattern: 'V + 아/어 보다', meaning: 'Have tried', explanation: 'Experience at level 2 depth.', exampleNative: '한국 음식을 많이 먹어 봤어요.', exampleEnglish: 'I have tried many Korean foods.', tip: 'Review from TOPIK 1.', topikLevel: 2, category: 'Verbs', image: '🍜' },
];

function assignIds(points: Omit<GrammarPoint, 'id'>[]): GrammarPoint[] {
  return points.map((p, i) => ({ ...p, id: i + 1 }));
}

export const GRAMMAR_BY_LANGUAGE: Record<string, GrammarPoint[]> = {
  ko: [
    ...assignIds(koGrammarTopik1),
    ...assignIds(koGrammarTopik2).map((p, i) => ({ ...p, id: koGrammarTopik1.length + i + 1 })),
  ],
};

export function getGrammarPoints(language: string, topikLevel?: number): GrammarPoint[] {
  const all = GRAMMAR_BY_LANGUAGE[language] ?? [];
  if (!topikLevel) return all;
  return all.filter((g) => g.topikLevel === topikLevel);
}

export function getGrammarPoint(language: string, grammarId: number): GrammarPoint | undefined {
  return (GRAMMAR_BY_LANGUAGE[language] ?? []).find((g) => g.id === grammarId);
}

export function getGrammarMilestoneCount(language: string): number {
  const total = (GRAMMAR_BY_LANGUAGE[language] ?? []).length;
  return Math.max(1, Math.ceil(total / 5));
}

export function getGrammarForMilestone(language: string, milestoneId: string): GrammarPoint[] {
  const all = GRAMMAR_BY_LANGUAGE[language] ?? [];
  const mid = parseInt(milestoneId, 10) || 1;
  const start = (mid - 1) * 5;
  return all.slice(start, start + 5);
}
