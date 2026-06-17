/** Rotating recycling tips shown on the onboarding loading screen. */
export const RECYCLING_TIPS: string[] = [
  'Rinse before you bin — one greasy container can spoil a whole batch of recycling.',
  'Plastic bottles and metal cans earn you a deposit back under Return Right. Don’t bin the cash!',
  'Bubble tea cups can’t be recycled — the film, straw and sugar contaminate the stream.',
  'Keep paper dry. Wet or oily cardboard can’t be recycled.',
  'No need to crush your cans — recycling machines read whole ones best.',
  'Caps on! Leave the cap on your empty bottle when you return it.',
  'Styrofoam and plastic bags don’t belong in the blue bin.',
  'About 40% of what goes into blue bins is rejected as contamination. A 10-second check helps.',
  'Glass bottles are recyclable, but they’re not part of the deposit scheme — only bottles & cans are.',
  'Recycling one aluminium can saves enough energy to run a TV for hours.',
];

export function randomTip(): string {
  return RECYCLING_TIPS[Math.floor(Math.random() * RECYCLING_TIPS.length)];
}
