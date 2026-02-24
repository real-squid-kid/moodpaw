export type BadgeSize = 'square' | 'portrait' | 'landscape' | 'custom';

export interface BadgeConfig {
  id: string;
  presetId?: string;
  topText: string;
  bottomText: string;
  iconName: string;
  fontFamily: string;
  bgColor: string;
  textColor: string;
  size: BadgeSize;
  width: number;
  height: number;
  isRound: boolean;
  language: 'en' | 'ru';
  topTextPos: number; // Percentage from center (0-100)
  bottomTextPos: number; // Percentage from center (0-100)
  topFontSizeScale: number; // Scale factor (0.5 to 2.0)
  bottomFontSizeScale: number; // Scale factor (0.5 to 2.0)
  emojiStyle: 'color' | 'mono';
}

export const GOOGLE_FONTS = [
  { name: 'Inter', family: "'Inter', sans-serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Oswald', family: "'Oswald', sans-serif" },
  { name: 'Raleway', family: "'Raleway', sans-serif" },
  { name: 'Roboto', family: "'Roboto', sans-serif" },
  { name: 'Unbounded', family: "'Unbounded', sans-serif" },
  { name: 'Rubik', family: "'Rubik', sans-serif" },
];

export interface Preset {
  id: string;
  category: 'Contact' | 'Energy' | 'RP' | 'Social';
  en: { top: string; bottom: string };
  ru: { top: string; bottom: string };
  icon: string; // Emoji or FA class
  bgColor: string;
}

export const PRESETS: Preset[] = [
  // Contact
  { id: 'friendly', category: 'Contact', en: { top: '', bottom: 'Friendly' }, ru: { top: 'Открыт', bottom: 'к общению' }, icon: '😉', bgColor: '#22c55e' },
  { id: 'shy', category: 'Contact', en: { top: 'Shy', bottom: 'ask first' }, ru: { top: 'Стесняюсь', bottom: 'сначала спроси' }, icon: '👉👈', bgColor: '#64748b' },
  { id: 'no-hugs', category: 'Contact', en: { top: '', bottom: 'No hugs!' }, ru: { top: '', bottom: 'Без обнимашек!' }, icon: '❌', bgColor: '#dc2626' },
  { id: 'yes-hugs', category: 'Contact', en: { top: '', bottom: 'Yes hugs!' }, ru: { top: '', bottom: 'Да, обнимашки!' }, icon: '🤗', bgColor: '#db2777' },
  { id: 'uppies-please', category: 'Contact', en: { top: 'Uppies,', bottom: 'please?' }, ru: { top: 'Хочу', bottom: 'на ручки!' }, icon: '🥺', bgColor: '#d97706' },
  { id: 'who-wants-uppies', category: 'Contact', en: { top: 'Who wants', bottom: 'uppies?' }, ru: { top: 'Кто хочет', bottom: 'на ручки?' }, icon: '😈', bgColor: '#9333ea' },
  { id: 'photos', category: 'Contact', en: { top: 'Looking', bottom: 'for photos' }, ru: { top: 'Ищу', bottom: 'фотографов' }, icon: '📷', bgColor: '#2563eb' },
  { id: 'afk', category: 'Contact', en: { top: '', bottom: 'AFK' }, ru: { top: '', bottom: 'АФК' }, icon: '😌', bgColor: '#334155' },

  // Energy
  { id: 'high-energy', category: 'Energy', en: { top: 'High', bottom: 'energy' }, ru: { top: 'Соцбатарейка', bottom: 'заряжена' }, icon: '🔋', bgColor: '#16a34a' },
  { id: 'low-battery', category: 'Energy', en: { top: 'Low', bottom: 'battery' }, ru: { top: 'Соцбатарейка', bottom: 'разряжена' }, icon: '🪫', bgColor: '#b91c1c' },
  { id: 'overstimulated', category: 'Energy', en: { top: 'Over', bottom: 'stimulated' }, ru: { top: '', bottom: 'Перегруз' }, icon: '😵‍💫', bgColor: '#7c3aed' },
  { id: 'need-coffee', category: 'Energy', en: { top: 'Need', bottom: 'coffee' }, ru: { top: 'Нужно', bottom: 'кофе' }, icon: '☕', bgColor: '#713f12' },
  { id: 'chill', category: 'Energy', en: { top: 'Chill', bottom: 'mode' }, ru: { top: 'На', bottom: 'чилле' }, icon: '😎', bgColor: '#0891b2' },

  // RP
  { id: 'ic', category: 'RP', en: { top: '', bottom: 'In character' }, ru: { top: '', bottom: 'В образе' }, icon: '💯', bgColor: '#7c3aed' },
  { id: 'ooc', category: 'RP', en: { top: 'Out of', bottom: 'character' }, ru: { top: '', bottom: 'Вне образа' }, icon: '🙅‍♂️', bgColor: '#475569' },
  { id: 'villain', category: 'RP', en: { top: 'Villian', bottom: 'mode' }, ru: { top: 'Режим', bottom: 'злодея' }, icon: '😈', bgColor: '#0f172a' },
  { id: 'soft', category: 'RP', en: { top: 'Soft', bottom: 'mode' }, ru: { top: 'Режим', bottom: 'няшки' }, icon: '🐱', bgColor: '#f472b6' },
  { id: 'gremlin', category: 'RP', en: { top: 'Gremlin', bottom: 'mode' }, ru: { top: 'Режим', bottom: 'гремлина' }, icon: '👹', bgColor: '#3f6212' },

  // Social
  { id: 'artists', category: 'Social', en: { top: 'Looking', bottom: 'for artists' }, ru: { top: 'Ищу', bottom: 'художника' }, icon: '✍️', bgColor: '#be185d' },
  { id: 'collabs', category: 'Social', en: { top: 'Open', bottom: 'for collabs' }, ru: { top: 'Готов', bottom: 'к коллабе' }, icon: '🤝', bgColor: '#1d4ed8' },
  { id: 'sketch', category: 'Social', en: { top: 'Sketch', bottom: 'mode' }, ru: { top: 'Хочешь', bottom: 'скетч?' }, icon: '✍️', bgColor: '#c2410c' },
  { id: 'no-sketches', category: 'Social', en: { top: 'No sketches', bottom: 'please' }, ru: { top: 'Скетчи', bottom: 'не принимаю' }, icon: '🚫', bgColor: '#b91c1c' },
  { id: 'roomparty-ask', category: 'Social', en: { top: 'Ask about', bottom: 'a roomparty' }, ru: { top: 'Хочешь ко мне', bottom: 'на румпати?' }, icon: '🕺', bgColor: '#7e22ce' },
  { id: 'roomparty-anyone', category: 'Social', en: { top: 'Roomparty,', bottom: 'anyone?' }, ru: { top: 'Пригласите', bottom: 'на румпати' }, icon: '🥺', bgColor: '#be185d' },
];

