import { useTheme } from '../context/ThemeContext';

const light = {
  // Nền
  bg:               '#ede8ff' as string,
  bgGradient:       ['#ede8ff', '#e8f4ff', '#e8fff8'] as string[],
  // Surface
  surface:          'rgba(255,255,255,0.72)' as string,
  surfaceStrong:    'rgba(255,255,255,0.95)' as string, // More opaque for unified cards
  // Brand
  primary:          '#FE9EC7' as string,
  primarySurface:   'rgba(254,158,199,0.15)' as string,
  secondary:        '#89D4FF' as string,
  secondaryDark:    '#44ACFF' as string,
  secondarySurface: 'rgba(137,212,255,0.15)' as string,
  accent:           '#7C6FAB' as string,
  // Text - IMPROVED CONTRAST
  textPrimary:      '#1a1a2e' as string,
  textSecondary:    '#4a4a6a' as string,
  textHint:         '#6b7280' as string, // Better contrast
  // Buttons
  btnPrimaryText:   '#1a1a2e' as string,
  btnGhostBg:       '#89D4FF' as string,
  btnGhostBorder:   '#44ACFF' as string,
  btnGhostIcon:     '#ffffff' as string,
  btnDisabled:      'rgba(62,80,107,0.35)' as string,
  btnDisabledText:  '#9ca3af' as string, // Better disabled text contrast
  btnCancel:        'rgba(26,26,46,0.08)' as string,
  btnCancelText:    '#4a4a6a' as string,
  // Border / divider
  border:           'rgba(159,165,174,0.25)' as string, // Lighter for subtle card borders
  borderAccent:     'rgba(254,158,199,0.25)' as string,
  inputBorder:      'rgba(137,212,255,0.4)' as string, // Subtle input borders
  inputBg:          'rgba(255,255,255,0.9)' as string, // Better contrast for inputs
  // Overlay
  modalOverlay:     'rgba(26,26,46,0.45)' as string,
  captionOverlay:   'rgba(8,16,28,0.75)' as string,
  loadingOverlay:   'rgba(255,255,255,0.7)' as string,
  menuBtnOverlay:   'rgba(8,16,28,0.75)' as string,
  // Misc
  backBtn:          '#ffffff' as string,
  backBtnShadow:    '#7C6FAB' as string, // Use theme color instead of black
  dragHandle:       '#9fa5ae' as string,
  iconWrapper:      'rgba(74,74,106,0.12)' as string,
  emojiBg:          'rgba(26,26,46,0.10)' as string,
  toastBg:          '#141f2d' as string,
  danger:           '#ff4d4f' as string,
  // Send photo
  containerBg:      'rgba(255,255,255,0.90)' as string,
  panelBg:          '#203148' as string,
  panelBorder:      '#FE9EC7' as string,
  captionBoxBg:     '#89D4FF' as string,
  captionBoxBorder: '#44ACFF' as string,
  captionBoxText:   '#1a1a2e' as string,
  // Page component
  pageCircleBg:     '#89D4FF' as string,
  pageCircleBorder: '#89D4FF' as string,
  // Status bar
  statusBar:        'dark-content' as 'dark-content' | 'light-content',
  // Messaging
  msgBg:            '#ede8ff' as string,
  msgBgGradient:    ['#ede8ff', '#e8f4ff', '#e8fff8'] as string[],
  msgBackBtn:       'rgba(255,255,255,0.9)' as string,
  msgBackBtnShadow: '#7C6FAB' as string, // Use theme color instead of black
  msgIcon:          '#1a1a2e' as string,
  msgTitle:         '#1a1a2e' as string,
  msgDivider:       'rgba(159,165,174,0.2)' as string,
  msgAvatarFallBg:  'rgba(124,111,171,0.15)' as string,
  msgAvatarFallBd:  'rgba(124,111,171,0.3)' as string,
  msgAvatarInitial: '#7C6FAB' as string,
  msgName:          '#1a1a2e' as string,
  msgLastMsg:       '#7a7a9a' as string,
  msgTime:          '#7a7a9a' as string,
  msgEmptyText:     '#4a4a6a' as string,
  msgEmptyHint:     '#7a7a9a' as string,
  convBg:           '#ede8ff' as string,
  bubbleRecvBg:     'rgba(255,255,255,0.90)' as string,
  bubbleRecvBorder: 'rgba(159,165,174,0.25)' as string,
  bubbleRecvShadow: '#7C6FAB' as string,
  bubbleRecvText:   '#1a1a2e' as string,
  bubbleSentBg:     '#FE9EC7' as string,
  bubbleSentShadow: '#FE9EC7' as string,
  bubbleSentText:   '#1a1a2e' as string,
  smallAvatarBd:    'rgba(159,165,174,0.4)' as string,
  inputWrapBg:      'rgba(255,255,255,0.9)' as string,
  inputWrapBorder:  'rgba(254,158,199,0.6)' as string,
  inputWrapShadow:  'rgba(254,158,199,1)' as string,
  inputText:        '#1a1a2e' as string,
  inputPlaceholder: '#E5E7EB' as string,
  sendBtnBg:        '#FE9EC7' as string,
  sendBtnShadow:    '#FE9EC7' as string,
  sendBtnIcon:      '#1a1a2e' as string,
};

const dark = {
  bg:               '#08101c' as string,
  bgGradient:       ['#08101c', '#0d1520', '#091820'] as string[],
  surface:          'rgba(255,255,255,0.05)' as string,
  surfaceStrong:    '#1a2840' as string, // Unified dark card background
  primary:          '#FF9EC5' as string,
  primarySurface:   'rgba(254,158,199,0.15)' as string,
  secondary:        '#7DD8FF' as string,
  secondaryDark:    '#44ACFF' as string,
  secondarySurface: 'rgba(137,212,255,0.15)' as string,
  accent:           '#9B8FC4' as string,
  textPrimary:      '#FFFFFF' as string,
  textSecondary:    '#E5E7EB' as string,
  textHint:         '#9CA3AF' as string, // Better contrast for dark mode
  btnPrimaryText:   '#0d1520' as string,
  btnGhostBg:       'rgba(137,212,255,0.18)' as string,
  btnGhostBorder:   '#7DD8FF' as string,
  btnGhostIcon:     '#7DD8FF' as string,
  btnDisabled:      'rgba(255,158,197,0.35)' as string,
  btnDisabledText:  '#6B7280' as string, // Better disabled text contrast
  btnCancel:        'rgba(255,255,255,0.06)' as string,
  btnCancelText:    '#9fb3cc' as string,
  border:           'rgba(255,255,255,0.08)' as string, // Subtle card borders
  borderAccent:     'rgba(254,158,199,0.20)' as string,
  inputBorder:      'rgba(125,216,255,0.3)' as string, // Subtle input borders
  inputBg:          '#0d1826' as string, // Unified input background
  modalOverlay:     'rgba(0,0,0,0.80)' as string,
  captionOverlay:   'rgba(8,16,28,0.75)' as string,
  loadingOverlay:   'rgba(13,21,32,0.80)' as string,
  menuBtnOverlay:   'rgba(8,16,28,0.75)' as string,
  backBtn:          '#1a2840' as string,
  backBtnShadow:    '#FF9EC5' as string,
  dragHandle:       '#2e3d52' as string,
  iconWrapper:      'rgba(159,179,204,0.10)' as string,
  emojiBg:          'rgba(137,212,255,0.12)' as string,
  toastBg:          '#1a2840' as string,
  danger:           '#ff6b6b' as string,
  containerBg:      '#0d1520' as string,
  panelBg:          '#0d1826' as string,
  panelBorder:      'rgba(254,158,199,0.20)' as string,
  captionBoxBg:     'rgba(137,212,255,0.15)' as string,
  captionBoxBorder: '#7DD8FF' as string,
  captionBoxText:   '#FFFFFF' as string,
  pageCircleBg:     'rgba(137,212,255,0.15)' as string,
  pageCircleBorder: '#7DD8FF' as string,
  statusBar:        'light-content' as 'dark-content' | 'light-content',
  // Messaging
  msgBg:            '#08101c' as string,
  msgBgGradient:    ['#08101c', '#0d1520', '#091820'] as string[],
  msgBackBtn:       '#1a2840' as string,
  msgBackBtnShadow: 'rgba(155,143,196,0.35)' as string, // Use theme color instead of black
  msgIcon:          '#e2eaf5' as string,
  msgTitle:         '#e2eaf5' as string,
  msgDivider:       'rgba(255,255,255,0.06)' as string,
  msgAvatarFallBg:  'rgba(155,143,196,0.20)' as string,
  msgAvatarFallBd:  'rgba(155,143,196,0.35)' as string,
  msgAvatarInitial: '#9B8FC4' as string,
  msgName:          '#e2eaf5' as string,
  msgLastMsg:       '#5c7391' as string,
  msgTime:          '#5c7391' as string,
  msgEmptyText:     '#9fb3cc' as string,
  msgEmptyHint:     '#5c7391' as string,
  convBg:           '#0d1520' as string,
  bubbleRecvBg:     '#1a2840' as string,
  bubbleRecvBorder: 'rgba(255,255,255,0.07)' as string,
  bubbleRecvShadow: 'rgba(155,143,196,0.15)' as string,
  bubbleRecvText:   '#e2eaf5' as string,
  bubbleSentBg:     '#FF9EC5' as string,
  bubbleSentShadow: 'rgba(254,158,199,0.30)' as string,
  bubbleSentText:   '#0d1520' as string,
  smallAvatarBd:    'rgba(255,255,255,0.12)' as string,
  inputWrapBg:      '#131e2e' as string,
  inputWrapBorder:  'rgba(254,158,199,0.35)' as string,
  inputWrapShadow:  'rgba(254,158,199,0.12)' as string,
  inputText:        '#e2eaf5' as string,
  inputPlaceholder: '#3a4f66' as string,
  sendBtnBg:        '#FF9EC5' as string,
  sendBtnShadow:    'rgba(254,158,199,0.30)' as string,
  sendBtnIcon:      '#0d1520' as string,
};

export type AppColors = typeof light;

export const useColors = (): AppColors => {
  const { isDark } = useTheme();
  return isDark ? dark : light;
};
