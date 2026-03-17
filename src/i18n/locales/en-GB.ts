import { Translations } from '../types'
import { en } from './en'

export const enGB: Translations = {
  ...en,
  colorTest: 'Colour Test',
  colorTestDescription: 'Test screen colour accuracy',
  fullscreenColorTest: '🚀 Fullscreen Colour Test',
  testBasic: '🎨 Basic Test: Check if each colour is displayed uniformly, look for dead pixels',
  testFullscreen: '🚀 Fullscreen Test: Click "Fullscreen Colour Test" for exclusive screen testing',
  shortcutSpace: 'Space: Start/Stop automatic colour switching',
  shortcutArrows: '←→/↑↓ Arrows: Manually change colour',
  autoTest: '🔄 Auto Test: Auto-switch colours every 2 seconds to check smooth transitions',
  responseTestDescription: 'Quickly toggle colours to check for noticeable ghosting or trailing',
  arrowsChangeColor: 'Arrows: Change colour',
}

export default enGB
