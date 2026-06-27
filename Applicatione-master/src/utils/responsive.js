export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const spacingForWidth = (width) => ({
  screen: width < 360 ? 14 : 20,
  compact: width < 360,
});

export const bottomNavSpace = 110;
