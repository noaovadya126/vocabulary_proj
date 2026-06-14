/** Chibi mascot variant ids — rendered as inline SVG via ChibiMascot */
export const MASCOT_IMAGES = {
  hearts: 'hearts',
  school: 'school',
  study: 'study',
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
