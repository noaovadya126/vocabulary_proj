/** Standard vocabulary categories — consistent across languages */
export const STANDARD_CATEGORIES = [
  'Greetings',
  'People & Family',
  'Food & Drink',
  'Places',
  'Time & Dates',
  'Numbers',
  'Actions',
  'Descriptions',
  'Weather & Nature',
  'Transport',
  'Shopping',
  'Daily Life',
  'Study & Work',
  'Feelings',
] as const;

export type StandardCategory = (typeof STANDARD_CATEGORIES)[number];

const ALIAS_MAP: Record<string, StandardCategory> = {
  Greetings: 'Greetings',
  'Daily life': 'Daily Life',
  'Daily Life': 'Daily Life',
  Food: 'Food & Drink',
  'Food & Drink': 'Food & Drink',
  Places: 'Places',
  People: 'People & Family',
  'People & Family': 'People & Family',
  Time: 'Time & Dates',
  'Time & Dates': 'Time & Dates',
  Numbers: 'Numbers',
  Verbs: 'Actions',
  Actions: 'Actions',
  Adjectives: 'Descriptions',
  Descriptions: 'Descriptions',
  Weather: 'Weather & Nature',
  'Weather & Nature': 'Weather & Nature',
  Transport: 'Transport',
  Shopping: 'Shopping',
  Study: 'Study & Work',
  'Study & Work': 'Study & Work',
  Feelings: 'Feelings',
};

export function normalizeCategory(raw: string): StandardCategory {
  return ALIAS_MAP[raw] ?? 'Daily Life';
}

export function getCategoryLabel(cat: StandardCategory, _displayLanguage = 'en'): string {
  const labels: Record<StandardCategory, string> = {
    Greetings: '👋 Greetings',
    'People & Family': '👨‍👩‍👧 People',
    'Food & Drink': '🍜 Food',
    Places: '📍 Places',
    'Time & Dates': '⏰ Time',
    Numbers: '🔢 Numbers',
    Actions: '🏃 Actions',
    Descriptions: '🌈 Descriptions',
    'Weather & Nature': '🌤️ Weather',
    Transport: '🚌 Transport',
    Shopping: '🛍️ Shopping',
    'Daily Life': '🏠 Daily Life',
    'Study & Work': '📚 Study',
    Feelings: '💕 Feelings',
  };
  return labels[cat];
}

export function getCategoryLabelHe(cat: StandardCategory): string {
  const labels: Record<StandardCategory, string> = {
    Greetings: '👋 ברכות',
    'People & Family': '👨‍👩‍👧 אנשים ומשפחה',
    'Food & Drink': '🍜 אוכל ושתייה',
    Places: '📍 מקומות',
    'Time & Dates': '⏰ זמן ותאריכים',
    Numbers: '🔢 מספרים',
    Actions: '🏃 פעולות',
    Descriptions: '🌈 תיאורים',
    'Weather & Nature': '🌤️ מזג אוויר וטבע',
    Transport: '🚌 תחבורה',
    Shopping: '🛍️ קניות',
    'Daily Life': '🏠 חיי יומיום',
    'Study & Work': '📚 לימודים ועבודה',
    Feelings: '💕 רגשות',
  };
  return labels[cat];
}
