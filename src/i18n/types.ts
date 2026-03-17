export type LocaleCode =
  | 'zh-CN'  // 简体中文
  | 'zh-TW'  // 繁体中文
  | 'en-US'  // English (US)
  | 'en-GB'  // English (UK)
  | 'ja-JP'  // 日本語
  | 'ko-KR'  // 한국어
  | 'es-ES'  // Español
  | 'fr-FR'  // Français
  | 'de-DE'  // Deutsch
  | 'it-IT'  // Italiano
  | 'pt-BR'  // Português (Brasil)
  | 'pt-PT'  // Português (Portugal)
  | 'ru-RU'  // Русский
  | 'ar-SA'  // العربية
  | 'hi-IN'  // हिन्दी
  | 'nl-NL'  // Nederlands
  | 'tr-TR'  // Türkçe
  | 'vi-VN'  // Tiếng Việt
  | 'th-TH'  // ไทย
  | 'pl-PL'  // Polski

export interface LocaleInfo {
  code: LocaleCode
  name: string
  nativeName: string
}

export interface Translations {
  // App
  appTitle: string
  appDescription: string

  // Navigation / Common
  home: string
  backToHome: string
  language: string
  screenTest: string
  keyboardTest: string
  mouseTest: string
  gamepadTest: string
  cameraTest: string
  speakerTest: string
  micTest: string
  ffmpegTools: string

  // Screen Test
  screenTestTitle: string
  screenTestDescription: string
  resolutionInfo: string
  windowResolution: string
  screenResolution: string
  devicePixelRatio: string
  physicalPixels: string
  colorTest: string
  colorTestDescription: string
  fullscreenColorTest: string
  startAutoTest: string
  stopTest: string
  enterFullscreen: string
  exitFullscreen: string
  manualSelectColor: string
  testInstructions: string
  testBasic: string
  testFullscreen: string
  testFullscreenOperation: string
  keyboardShortcuts: string
  shortcutSpace: string
  shortcutArrows: string
  shortcutEsc: string
  autoTest: string
  responseTest: string
  responseTestDescription: string
  blackWhiteToggle: string
  grayScaleTest: string
  exitFullscreenTest: string
  stopAutoToggle: string
  startAutoToggle: string
  autoSwitching: string
  moveMouseToShow: string
  spaceToggleAuto: string
  arrowsChangeColor: string

  // Exit button
  exitFullscreenTestBtn: string

  // Common buttons
  start: string
  stop: string
  exit: string

  // Keyboard Test
  keyboardTestTitle: string
  keyboardTestDescription: string
  testCoverage: string
  testedKeys: string
  resetTest: string
  currentKeyInfo: string
  pressedKeys: string
  pressAnyKey: string
  keyboardLayout: string
  navigationKeys: string
  arrowKeys: string
  keyHistory: string
  noKeyHistory: string
  keyboardInstruction1: string
  keyboardInstruction2: string
  keyboardInstruction3: string
  keyboardInstruction4: string
  keyboardInstruction5: string
  detectedKeyboard: string
  untested: string
  tested: string
  pressing: string

  // Mouse Test
  mouseTestTitle: string
  mouseTestDescription: string
  mouseButtons: string
  mouseInfo: string
  mousePosition: string
  doubleClick: string
  doubleClickHint: string
  detected: string
  scrollWheel: string
  scrollTotal: string
  lastScroll: string
  dir_up: string
  dir_down: string
  dir_left: string
  dir_right: string
  clickCount: string
  mouseTrail: string
  moveMouseHere: string
  trailLeft: string
  trailRight: string
  trailNone: string
  btnLeft: string
  btnRight: string
  btnMiddle: string
  btnBack: string
  btnForward: string
  mouseInstruction1: string
  mouseInstruction2: string
  mouseInstruction3: string
  mouseInstruction4: string
  mouseInstruction5: string

  // Gamepad Test
  gamepadTestTitle: string
  gamepadTestDescription: string
  noGamepad: string
  noGamepadHint: string
  connectedGamepad: string
  gamepadButtons: string
  gamepadAxes: string
  gamepadLayout: string
  axisValues: string
  vibrationTest: string
  gamepadInstruction1: string
  gamepadInstruction2: string
  gamepadInstruction3: string
  gamepadInstruction4: string
  gamepadInstruction5: string
}

export const localeInfoList: LocaleInfo[] = [
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko-KR', name: 'Korean', nativeName: '한국어' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch' },
  { code: 'it-IT', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', nativeName: 'Português (BR)' },
  { code: 'pt-PT', name: 'Portuguese (Portugal)', nativeName: 'Português (PT)' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe' },
  { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'th-TH', name: 'Thai', nativeName: 'ไทย' },
  { code: 'pl-PL', name: 'Polish', nativeName: 'Polski' },
]
