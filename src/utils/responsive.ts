import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Device breakpoints
export const DEVICE_SIZES = {
  IPHONE_SE_WIDTH: 375,
  IPHONE_STANDARD_WIDTH: 390,
  IPHONE_PRO_MAX_WIDTH: 428,
  ANDROID_SMALL_WIDTH: 360,
  ANDROID_LARGE_WIDTH: 480,
} as const;

// Base design width (iPhone 11/12/13 standard)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Responsive scaling functions
export const scale = (size: number): number => (screenWidth / BASE_WIDTH) * size;
export const verticalScale = (size: number): number => (screenHeight / BASE_HEIGHT) * size;
export const moderateScale = (size: number, factor: number = 0.5): number => 
  size + (scale(size) - size) * factor;

// Device type detection
export const isSmallDevice = (): boolean => screenWidth <= DEVICE_SIZES.IPHONE_SE_WIDTH;
export const isLargeDevice = (): boolean => screenWidth >= DEVICE_SIZES.IPHONE_PRO_MAX_WIDTH;
export const isTablet = (): boolean => screenWidth >= 768;

// Safe responsive values
export const getResponsiveValue = (small: number, medium: number, large: number): number => {
  if (isSmallDevice()) return small;
  if (isLargeDevice()) return large;
  return medium;
};

// Touch area helpers (minimum 44x44 for iOS, 48x48 for Android)
export const getMinTouchArea = (): number => Platform.OS === 'ios' ? 44 : 48;

// Responsive padding/margin
export const getHorizontalPadding = (): number => getResponsiveValue(12, 16, 20);
export const getVerticalPadding = (): number => getResponsiveValue(8, 12, 16);

// Font size scaling
export const getFontSize = (baseSize: number): number => {
  const scaled = moderateScale(baseSize);
  // Ensure minimum readable size
  return Math.max(scaled, 12);
};

// Icon size scaling
export const getIconSize = (baseSize: number): number => {
  return getResponsiveValue(
    baseSize - 2,  // smaller on small devices
    baseSize,      // base size on medium devices
    baseSize + 2   // larger on large devices
  );
};

// Layout dimensions
export const getLayoutDimensions = () => ({
  screenWidth,
  screenHeight,
  isLandscape: screenWidth > screenHeight,
  aspectRatio: screenWidth / screenHeight,
  safeWidth: screenWidth - getHorizontalPadding() * 2,
});

// Keyboard height estimation
export const getKeyboardHeight = (): number => {
  if (Platform.OS === 'ios') {
    return isSmallDevice() ? 260 : 290;
  }
  return 280;
};