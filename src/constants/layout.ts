import { Platform } from 'react-native';

export const HEADER = {
  HEIGHT: 44,
  AVATAR_SIZE: 44,
  ICON_SIZE: 40,
  ONLINE_DOT_SIZE: 11,
} as const;

export const TAB_BAR = {
  HEIGHT: 64,
  BORDER_RADIUS: 24,
  MARGIN_BOTTOM: 12,
  ICON_SIZE: 22,
} as const;

export const CHAT = {
  BUBBLE_MAX_WIDTH: '82%',
  FILE_ICON_SIZE: 40,
} as const;

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
