import { Dimensions, PixelRatio } from 'react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;
const { width: initialWidth, height: initialHeight } = Dimensions.get('window');

const round = (value) => PixelRatio.roundToNearestPixel(value);

// Central spacing tokens replace one-off paddings/margins so screens scale consistently by density.
export const spacing = {
  xxs: round(scale(4)),
  xs: round(scale(6)),
  sm: round(scale(8)),
  md: round(scale(12)),
  lg: round(scale(16)),
  xl: round(scale(24)),
  xxl: round(scale(32)),
};

// Typography uses moderate scaling to preserve hierarchy without oversized text on tablets.
export const typography = {
  caption: round(moderateScale(12, 0.25)),
  body: round(moderateScale(14, 0.25)),
  bodyLg: round(moderateScale(16, 0.25)),
  title: round(moderateScale(30, 0.35)),
  titleLg: round(moderateScale(32, 0.35)),
  error: round(moderateScale(13, 0.25)),
  button: round(moderateScale(16, 0.25)),
};

// Shared radii keep cards, inputs, and buttons visually consistent while still density-aware.
export const radius = {
  sm: round(moderateScale(8, 0.25)),
  md: round(moderateScale(10, 0.25)),
  lg: round(moderateScale(12, 0.25)),
};

// Touch and form sizes are minimums so buttons stay accessible and inputs can grow with text settings.
export const sizes = {
  inputMinHeight: round(verticalScale(52)),
  buttonMinHeight: round(verticalScale(52)),
  minTouchTarget: round(verticalScale(44)),
  formMaxWidth: round(scale(440)),
  tabletContentMaxWidth: round(scale(560)),
  errorMaxWidth: round(scale(520)),
};

export const borders = {
  hairline: PixelRatio.roundToNearestPixel(1),
};

export function isTablet(width = initialWidth) {
  return width >= 768;
}

// Small-device detection lets forms reduce vertical padding before they overflow.
export function isSmallDevice(width = initialWidth, height = initialHeight) {
  return Math.min(width, height) < 360 || Math.max(width, height) < 680;
}

// Orientation checks let screens avoid vertically centered layouts on short landscape displays.
export function isLandscape(width = initialWidth, height = initialHeight) {
  return width > height;
}

// Percent helpers use the active window size, which is safer for foldables and split-screen views.
export function responsiveWidth(percent, width = initialWidth) {
  return round((width * percent) / 100);
}

// Height percentages are used sparingly for minimum page space, avoiding fixed vertical layouts.
export function responsiveHeight(percent, height = initialHeight) {
  return round((height * percent) / 100);
}

export function getScreenProfile(width = initialWidth, height = initialHeight) {
  return {
    tablet: isTablet(width),
    small: isSmallDevice(width, height),
    landscape: isLandscape(width, height),
  };
}

export function getResponsivePagePadding(width = initialWidth, height = initialHeight) {
  if (isSmallDevice(width, height)) return spacing.lg;
  if (isTablet(width)) return spacing.xxl;
  return spacing.xl;
}

export function getFormMaxWidth(width = initialWidth) {
  return isTablet(width) ? sizes.formMaxWidth : responsiveWidth(100, width);
}

export const baseGuides = {
  width: BASE_WIDTH,
  height: BASE_HEIGHT,
};
