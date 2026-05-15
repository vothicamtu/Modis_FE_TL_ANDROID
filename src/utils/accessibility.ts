/**
 * Accessibility utilities for consistent testID naming and accessibility roles
 * Following the naming convention: screen_feature_element_type
 */

// Accessibility roles for React Native components
export type AccessibilityRole = 
  | 'button'
  | 'tab' 
  | 'search'
  | 'imagebutton'
  | 'header'
  | 'link'
  | 'adjustable'
  | 'text'
  | 'list'
  | 'scrollbar'
  | 'menu'
  | 'main'
  | 'none';

// Screen identifiers
export const SCREENS = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  HOME: 'home',
  TAKE: 'take',
  SEND_PHOTO: 'send_photo',
  FRIENDS: 'friends',
  PROFILE: 'profile',
  MESSAGE: 'message',
  CONVERSATION: 'conversation',
  ALL_IMAGES: 'all_images',
} as const;

// Element types
export const ELEMENT_TYPES = {
  SCREEN: 'screen',
  BUTTON: 'button',
  INPUT: 'input',
  TEXT: 'text',
  IMAGE: 'image',
  CONTAINER: 'container',
  LIST: 'list',
  ITEM: 'item',
  TAB: 'tab',
  HEADER: 'header',
  DROPDOWN: 'dropdown',
  MODAL: 'modal',
  ICON: 'icon',
} as const;

// Features/sections
export const FEATURES = {
  // Auth
  USERNAME: 'username',
  PASSWORD: 'password',
  EMAIL: 'email',
  PHONE: 'phone',
  FULLNAME: 'fullname',
  CONFIRM_PASSWORD: 'confirm_password',
  SUBMIT: 'submit',
  SIGNUP_LINK: 'signup_link',
  LOGIN_LINK: 'login_link',
  
  // Navigation
  TOPBAR: 'topbar',
  BOTTOMBAR: 'bottombar',
  BACK: 'back',
  AVATAR: 'avatar',
  FRIENDS: 'friends',
  MESSAGE: 'message',
  FILTER: 'filter',
  
  // Camera
  CAPTURE: 'capture',
  FLASH: 'flash',
  TOGGLE_CAMERA: 'toggle_camera',
  CAMERA_AREA: 'camera_area',
  HISTORY: 'history',
  
  // Messages
  CONVERSATION: 'conversation',
  SEND: 'send',
  CLEAR: 'clear',
  LAST_MESSAGE: 'last_message',
  TIME: 'time',
  NAME: 'name',
  
  // Friends
  SEARCH: 'search',
  REQUEST: 'request',
  ACCEPT: 'accept',
  DECLINE: 'decline',
  ADD: 'add',
  
  // General
  TITLE: 'title',
  COUNT: 'count',
  LABEL: 'label',
  EMPTY: 'empty',
} as const;

/**
 * Generate testID following the naming convention: screen_feature_element_type
 * @param screen - Screen identifier
 * @param feature - Feature/section identifier
 * @param elementType - Element type
 * @param suffix - Optional suffix for dynamic IDs
 */
export const generateTestID = (
  screen: string,
  feature: string,
  elementType: string,
  suffix?: string | number
): string => {
  const baseId = `${screen}_${feature}_${elementType}`;
  return suffix ? `${baseId}_${suffix}` : baseId;
};

/**
 * Generate accessibility label with fallback to testID
 * @param label - Primary accessibility label
 * @param testID - Fallback testID
 */
export const generateAccessibilityLabel = (
  label?: string,
  testID?: string
): string => {
  return label || testID || '';
};

/**
 * Common accessibility props for interactive elements
 */
export const getAccessibilityProps = (
  testID: string,
  accessibilityLabel?: string,
  accessibilityRole?: AccessibilityRole,
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    expanded?: boolean;
  }
) => ({
  testID,
  accessibilityLabel: generateAccessibilityLabel(accessibilityLabel, testID),
  accessibilityRole,
  accessible: true,
  ...(accessibilityState && { accessibilityState }),
});

/**
 * Screen-specific testID generators
 */
export const LoginTestIDs = {
  screen: () => generateTestID(SCREENS.LOGIN, 'main', ELEMENT_TYPES.SCREEN),
  usernameInput: () => generateTestID(SCREENS.LOGIN, FEATURES.USERNAME, ELEMENT_TYPES.INPUT),
  passwordInput: () => generateTestID(SCREENS.LOGIN, FEATURES.PASSWORD, ELEMENT_TYPES.INPUT),
  submitButton: () => generateTestID(SCREENS.LOGIN, FEATURES.SUBMIT, ELEMENT_TYPES.BUTTON),
  signupLink: () => generateTestID(SCREENS.LOGIN, FEATURES.SIGNUP_LINK, ELEMENT_TYPES.BUTTON),
  titleText: () => generateTestID(SCREENS.LOGIN, FEATURES.TITLE, ELEMENT_TYPES.TEXT),
};

export const SignupTestIDs = {
  screen: () => generateTestID(SCREENS.SIGNUP, 'main', ELEMENT_TYPES.SCREEN),
  usernameInput: () => generateTestID(SCREENS.SIGNUP, FEATURES.USERNAME, ELEMENT_TYPES.INPUT),
  fullnameInput: () => generateTestID(SCREENS.SIGNUP, FEATURES.FULLNAME, ELEMENT_TYPES.INPUT),
  emailInput: () => generateTestID(SCREENS.SIGNUP, FEATURES.EMAIL, ELEMENT_TYPES.INPUT),
  phoneInput: () => generateTestID(SCREENS.SIGNUP, FEATURES.PHONE, ELEMENT_TYPES.INPUT),
  passwordInput: () => generateTestID(SCREENS.SIGNUP, FEATURES.PASSWORD, ELEMENT_TYPES.INPUT),
  confirmPasswordInput: () => generateTestID(SCREENS.SIGNUP, FEATURES.CONFIRM_PASSWORD, ELEMENT_TYPES.INPUT),
  submitButton: () => generateTestID(SCREENS.SIGNUP, FEATURES.SUBMIT, ELEMENT_TYPES.BUTTON),
  loginLink: () => generateTestID(SCREENS.SIGNUP, FEATURES.LOGIN_LINK, ELEMENT_TYPES.BUTTON),
  titleText: () => generateTestID(SCREENS.SIGNUP, FEATURES.TITLE, ELEMENT_TYPES.TEXT),
};

export const HomeTestIDs = {
  screen: () => generateTestID(SCREENS.HOME, 'main', ELEMENT_TYPES.SCREEN),
  gestureContainer: () => generateTestID(SCREENS.HOME, 'gesture', ELEMENT_TYPES.CONTAINER),
};

export const TakeTestIDs = {
  screen: () => generateTestID(SCREENS.TAKE, 'main', ELEMENT_TYPES.SCREEN),
  cameraArea: () => generateTestID(SCREENS.TAKE, FEATURES.CAMERA_AREA, ELEMENT_TYPES.CONTAINER),
  captureButton: () => generateTestID(SCREENS.TAKE, FEATURES.CAPTURE, ELEMENT_TYPES.BUTTON),
  flashButton: () => generateTestID(SCREENS.TAKE, FEATURES.FLASH, ELEMENT_TYPES.BUTTON),
  toggleCameraButton: () => generateTestID(SCREENS.TAKE, FEATURES.TOGGLE_CAMERA, ELEMENT_TYPES.BUTTON),
  historyButton: () => generateTestID(SCREENS.TAKE, FEATURES.HISTORY, ELEMENT_TYPES.BUTTON),
};

export const TopBarTestIDs = {
  container: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, ELEMENT_TYPES.CONTAINER),
  backButton: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, FEATURES.BACK, ELEMENT_TYPES.BUTTON),
  avatarButton: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, FEATURES.AVATAR, ELEMENT_TYPES.BUTTON),
  avatarImage: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, FEATURES.AVATAR, ELEMENT_TYPES.IMAGE),
  friendsButton: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, FEATURES.FRIENDS, ELEMENT_TYPES.BUTTON),
  friendCount: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, FEATURES.FRIENDS, FEATURES.COUNT),
  messageButton: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, FEATURES.MESSAGE, ELEMENT_TYPES.BUTTON),
  filterButton: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, FEATURES.FILTER, ELEMENT_TYPES.BUTTON),
  filterLabel: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, FEATURES.FILTER, FEATURES.LABEL),
  dropdown: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, ELEMENT_TYPES.DROPDOWN),
  friendsDropdownList: () => generateTestID(SCREENS.HOME, FEATURES.TOPBAR, FEATURES.FRIENDS, ELEMENT_TYPES.LIST),
};

export const BottomBarTestIDs = {
  container: () => generateTestID(SCREENS.HOME, FEATURES.BOTTOMBAR, ELEMENT_TYPES.CONTAINER),
  homeButton: () => generateTestID(SCREENS.HOME, FEATURES.BOTTOMBAR, 'home', ELEMENT_TYPES.BUTTON),
};

export const MessageTestIDs = {
  screen: () => generateTestID(SCREENS.MESSAGE, 'main', ELEMENT_TYPES.SCREEN),
  list: () => generateTestID(SCREENS.MESSAGE, 'main', ELEMENT_TYPES.LIST),
  listEmpty: () => generateTestID(SCREENS.MESSAGE, 'main', FEATURES.EMPTY),
  item: (id: string | number) => generateTestID(SCREENS.MESSAGE, ELEMENT_TYPES.ITEM, ELEMENT_TYPES.BUTTON, id),
  itemAvatar: (id: string | number) => generateTestID(SCREENS.MESSAGE, ELEMENT_TYPES.ITEM, FEATURES.AVATAR, id),
  itemName: (id: string | number) => generateTestID(SCREENS.MESSAGE, ELEMENT_TYPES.ITEM, FEATURES.NAME, id),
  itemLastMessage: (id: string | number) => generateTestID(SCREENS.MESSAGE, ELEMENT_TYPES.ITEM, FEATURES.LAST_MESSAGE, id),
  itemTime: (id: string | number) => generateTestID(SCREENS.MESSAGE, ELEMENT_TYPES.ITEM, FEATURES.TIME, id),
};

export const FriendsTestIDs = {
  screen: () => generateTestID(SCREENS.FRIENDS, 'main', ELEMENT_TYPES.SCREEN),
  backButton: () => generateTestID(SCREENS.FRIENDS, FEATURES.BACK, ELEMENT_TYPES.BUTTON),
  scroll: () => generateTestID(SCREENS.FRIENDS, 'main', 'scroll'),
  searchInput: () => generateTestID(SCREENS.FRIENDS, FEATURES.SEARCH, ELEMENT_TYPES.INPUT),
  friendRow: (id: string) => generateTestID(SCREENS.FRIENDS, 'friend', 'row', id),
};

export const SearchTestIDs = {
  input: (context: string) => generateTestID(context, FEATURES.SEARCH, ELEMENT_TYPES.INPUT),
  clearButton: (context: string) => generateTestID(context, FEATURES.SEARCH, FEATURES.CLEAR, ELEMENT_TYPES.BUTTON),
  rightIconButton: (context: string) => generateTestID(context, FEATURES.SEARCH, 'right_icon', ELEMENT_TYPES.BUTTON),
};

/**
 * Vietnamese accessibility labels for common UI elements
 */
export const AccessibilityLabels = {
  // Navigation
  BACK: 'Quay lại',
  HOME: 'Trang chủ',
  PROFILE: 'Hồ sơ cá nhân',
  MESSAGES: 'Tin nhắn',
  FRIENDS: 'Bạn bè',
  
  // Actions
  LOGIN: 'Đăng nhập',
  SIGNUP: 'Đăng ký',
  SUBMIT: 'Gửi',
  CANCEL: 'Hủy',
  SAVE: 'Lưu',
  DELETE: 'Xóa',
  EDIT: 'Chỉnh sửa',
  SEARCH: 'Tìm kiếm',
  CLEAR_SEARCH: 'Xóa nội dung tìm kiếm',
  
  // Camera
  TAKE_PHOTO: 'Chụp ảnh',
  TOGGLE_FLASH: 'Bật/tắt đèn flash',
  SWITCH_CAMERA: 'Chuyển camera',
  
  // Forms
  USERNAME_INPUT: 'Nhập tên đăng nhập',
  PASSWORD_INPUT: 'Nhập mật khẩu',
  EMAIL_INPUT: 'Nhập email',
  PHONE_INPUT: 'Nhập số điện thoại',
  
  // States
  LOADING: 'Đang tải',
  EMPTY_LIST: 'Danh sách trống',
  ERROR: 'Có lỗi xảy ra',
};