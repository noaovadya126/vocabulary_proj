/** Local chibi mascot illustrations — pastel kawaii style */
export const MASCOT_IMAGES = {
  hearts: '/characters/mascot-hearts.png',
  school: '/characters/mascot-school.png',
  study: '/characters/mascot-study.png',
} as const;

export type MascotId = keyof typeof MASCOT_IMAGES;

export const CHIBI_IMAGES = {
  mascotHearts: MASCOT_IMAGES.hearts,
  mascotSchool: MASCOT_IMAGES.school,
  mascotStudy: MASCOT_IMAGES.study,
  vocabulary: MASCOT_IMAGES.study,
  grammar: MASCOT_IMAGES.school,
  celebration: MASCOT_IMAGES.hearts,
} as const;
