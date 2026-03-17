import { useState, useEffect, useMemo } from 'react'
import { useI18n } from '../i18n/I18nContext'

interface KeyPress {
  key: string
  code: string
  keyCode: number
  timestamp: number
}

type KeyboardType = 'windows' | 'mac' | 'linux'

const KeyboardTest = () => {
  const { t } = useI18n()
  const [currentKey, setCurrentKey] = useState<KeyPress | null>(null)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const [keyHistory, setKeyHistory] = useState<KeyPress[]>([])
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set())

  // 检测键盘类型
  const keyboardType = useMemo<KeyboardType>(() => {
    const platform = navigator.platform.toLowerCase()
    const userAgent = navigator.userAgent.toLowerCase()

    if (platform.includes('mac') || userAgent.includes('mac')) {
      return 'mac'
    } else if (platform.includes('linux') || userAgent.includes('linux')) {
      return 'linux'
    }
    return 'windows'
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()

      const keyPress: KeyPress = {
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        timestamp: Date.now()
      }

      setCurrentKey(keyPress)
      setPressedKeys(prev => new Set(prev).add(e.code))
      setTestedKeys(prev => new Set(prev).add(e.code))

      setKeyHistory(prev => {
        const newHistory = [keyPress, ...prev]
        return newHistory.slice(0, 10)
      })
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      e.preventDefault()
      setPressedKeys(prev => {
        const newSet = new Set(prev)
        newSet.delete(e.code)
        return newSet
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  const resetTest = () => {
    setCurrentKey(null)
    setPressedKeys(new Set())
    setKeyHistory([])
    setTestedKeys(new Set())
  }

  // 根据键盘类型获取标签
  const getKeyLabel = (code: string): string => {
    const baseLabels: Record<string, string> = {
      'Escape': 'Esc',
      'Backquote': '`',
      'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4', 'Digit5': '5',
      'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9', 'Digit0': '0',
      'Minus': '-', 'Equal': '=', 'Backspace': '⌫',
      'Tab': 'Tab', 'BracketLeft': '[', 'BracketRight': ']', 'Backslash': '\\',
      'CapsLock': 'Caps Lock', 'Semicolon': ';', 'Quote': "'", 'Enter': 'Enter ↵',
      'ShiftLeft': 'Shift', 'ShiftRight': 'Shift',
      'Comma': ',', 'Period': '.', 'Slash': '/',
      'Space': '',
      'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→',
      'Insert': 'Ins', 'Delete': 'Del',
      'Home': 'Home', 'End': 'End',
      'PageUp': 'PgUp', 'PageDown': 'PgDn',
      'PrintScreen': 'PrtSc', 'ScrollLock': 'ScrLk', 'Pause': 'Pause',
      'NumLock': 'Num', 'NumpadDivide': '/', 'NumpadMultiply': '*', 'NumpadSubtract': '-',
      'Numpad7': '7', 'Numpad8': '8', 'Numpad9': '9', 'NumpadAdd': '+',
      'Numpad4': '4', 'Numpad5': '5', 'Numpad6': '6',
      'Numpad1': '1', 'Numpad2': '2', 'Numpad3': '3', 'NumpadEnter': 'Enter',
      'Numpad0': '0', 'NumpadDecimal': '.',
    }

    // Mac 特定标签
    if (keyboardType === 'mac') {
      const macLabels: Record<string, string> = {
        'ControlLeft': '⌃ Ctrl',
        'ControlRight': '⌃ Ctrl',
        'MetaLeft': '⌘ Cmd',
        'MetaRight': '⌘ Cmd',
        'AltLeft': '⌥ Opt',
        'AltRight': '⌥ Opt',
      }
      if (macLabels[code]) return macLabels[code]
    } else {
      const winLabels: Record<string, string> = {
        'ControlLeft': 'Ctrl',
        'ControlRight': 'Ctrl',
        'MetaLeft': '⊞ Win',
        'MetaRight': '⊞ Win',
        'AltLeft': 'Alt',
        'AltRight': 'Alt',
        'ContextMenu': '☰',
      }
      if (winLabels[code]) return winLabels[code]
    }

    if (code.startsWith('Key')) {
      return code.replace('Key', '')
    }
    if (code.startsWith('F') && /^F\d+$/.test(code)) {
      return code
    }
    return baseLabels[code] || code
  }

  // 键盘布局定义（更真实的布局）
  const mainKeyboard = [
    // 功能键行
    {
      keys: ['Escape', null, 'F1', 'F2', 'F3', 'F4', null, 'F5', 'F6', 'F7', 'F8', null, 'F9', 'F10', 'F11', 'F12'],
      spacing: true
    },
    // 主键盘区
    {
      keys: ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
      spacing: false
    },
    {
      keys: ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
      spacing: false
    },
    {
      keys: ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
      spacing: false
    },
    {
      keys: ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight'],
      spacing: false
    },
    {
      keys: ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight'],
      spacing: false
    }
  ]

  // 编辑键区（顶部对齐）
  const editKeysTop = [
    ['PrintScreen', 'ScrollLock', 'Pause']
  ]

  // 编辑键区（中间）
  const editKeysMiddle = [
    ['Insert', 'Home', 'PageUp'],
    ['Delete', 'End', 'PageDown']
  ]

  // 方向键区
  const arrowKeysLayout = [
    [null, 'ArrowUp', null],
    ['ArrowLeft', 'ArrowDown', 'ArrowRight']
  ]

  // 小键盘区
  const numpadLayout = [
    ['NumLock', 'NumpadDivide', 'NumpadMultiply', 'NumpadSubtract'],
    ['Numpad7', 'Numpad8', 'Numpad9', 'NumpadAdd'],
    ['Numpad4', 'Numpad5', 'Numpad6', null],
    ['Numpad1', 'Numpad2', 'Numpad3', 'NumpadEnter'],
    ['Numpad0', null, 'NumpadDecimal', null]
  ]

  const getKeyWidth = (code: string): number => {
    const widths: Record<string, number> = {
      'Backspace': 2,
      'Tab': 1.5,
      'Backslash': 1.5,
      'CapsLock': 1.75,
      'Enter': 2.25,
      'ShiftLeft': 2.25,
      'ShiftRight': 2.75,
      'ControlLeft': 1.25,
      'ControlRight': 1.25,
      'MetaLeft': 1.25,
      'MetaRight': 1.25,
      'AltLeft': 1.25,
      'AltRight': 1.25,
      'ContextMenu': 1.25,
      'Space': 6.25,
      'NumpadAdd': 1,
      'NumpadEnter': 1,
      'Numpad0': 2,
    }
    return widths[code] || 1
  }

  const getKeyHeight = (code: string): number => {
    if (code === 'NumpadAdd' || code === 'NumpadEnter') {
      return 2
    }
    return 1
  }

  const renderKey = (code: string | null, rowIndex?: number, keyIndex?: number) => {
    if (code === null) {
      return <div key={`spacer-${rowIndex}-${keyIndex}`} style={{ width: '44px', height: '44px', flexShrink: 0 }} />
    }

    const isPressed = pressedKeys.has(code)
    const isTested = testedKeys.has(code)
    const width = getKeyWidth(code)
    const height = getKeyHeight(code)
    const label = getKeyLabel(code)

    // 小键盘 Enter 和 + 的特殊处理
    const isNumpadSpecial = code === 'NumpadAdd' || code === 'NumpadEnter'
    const gridRow = isNumpadSpecial && code === 'NumpadAdd' ? 'span 2' :
                     isNumpadSpecial && code === 'NumpadEnter' ? 'span 2' : undefined

    // 基础按键宽度44px，gap 3px
    const baseWidth = 44
    const gapSize = 3
    const calculatedWidth = width * baseWidth + (width - 1) * gapSize
    const calculatedHeight = height * baseWidth + (height - 1) * gapSize

    return (
      <div
        key={code}
        style={{
          gridColumn: width !== 1 ? `span ${Math.ceil(width)}` : undefined,
          gridRow: gridRow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${calculatedWidth}px`,
          minWidth: `${calculatedWidth}px`,
          maxWidth: `${calculatedWidth}px`,
          height: `${calculatedHeight}px`,
          flexShrink: 0,
          padding: '4px',
          borderRadius: '6px',
          border: `2px solid ${isPressed ? '#667eea' : isTested ? '#48bb78' : '#cbd5e0'}`,
          backgroundColor: isPressed ? '#667eea' : isTested ? '#c6f6d5' : '#fff',
          color: isPressed ? '#fff' : '#333',
          fontSize: code === 'Space' ? '10px' : width > 2 ? '10px' : '11px',
          fontWeight: '600',
          cursor: 'default',
          userSelect: 'none',
          transition: 'all 0.15s ease',
          boxShadow: isPressed ? '0 4px 8px rgba(102, 126, 234, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
          transform: isPressed ? 'translateY(1px)' : 'none',
          textAlign: 'center',
          wordBreak: 'keep-all',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}
        title={code}
      >
        {label}
      </div>
    )
  }

  // 计算总按键数和覆盖率
  const allKeys = useMemo(() => {
    const keys = new Set<string>()
    mainKeyboard.forEach(row => row.keys.forEach(k => k && keys.add(k)))
    editKeysTop.flat().forEach(k => k && keys.add(k))
    editKeysMiddle.flat().forEach(k => k && keys.add(k))
    arrowKeysLayout.flat().forEach(k => k && keys.add(k))
    numpadLayout.flat().forEach(k => k && keys.add(k))
    return keys
  }, [])

  const coveragePercent = Math.round((testedKeys.size / allKeys.size) * 100)

  return (
    <div className="test-container">
      <div className="test-header">
        <h2>{t.keyboardTestTitle}</h2>
        <p>{t.keyboardTestDescription}</p>
      </div>

      <div className="test-content">
        {/* 键盘类型和测试覆盖率 */}
        <section>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>⌨️ {t.detectedKeyboard}</h3>
              <div style={{
                display: 'inline-block',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {keyboardType === 'mac' ? 'Mac Keyboard' :
                 keyboardType === 'linux' ? 'Linux Keyboard' :
                 'Windows Keyboard'}
              </div>
            </div>

            <button
              onClick={resetTest}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {t.resetTest}
            </button>
          </div>

          <div style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {t.testedKeys}: <strong style={{ fontSize: '16px', color: '#667eea' }}>{testedKeys.size}</strong> / {allKeys.size}
              </span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#48bb78' }}>
                {coveragePercent}%
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '24px',
              background: '#e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${coveragePercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #48bb78 0%, #38a169 100%)',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>
        </section>

        {/* 当前按键信息 */}
        <section>
          <h3>🎯 {t.currentKeyInfo}</h3>
          <div style={{
            background: currentKey ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa',
            color: currentKey ? 'white' : '#666',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            transition: 'all 0.3s ease'
          }}>
            {currentKey ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px', opacity: 0.9 }}>Key:</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{currentKey.key}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px', opacity: 0.9 }}>Code:</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{currentKey.code}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '12px', opacity: 0.9 }}>{t.pressedKeys}:</p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>{pressedKeys.size}</p>
                </div>
              </div>
            ) : (
              <p style={{ margin: 0, textAlign: 'center', fontSize: '16px' }}>
                {t.pressAnyKey}
              </p>
            )}
          </div>
        </section>

        {/* 键盘可视化 */}
        <section>
          <h3>⌨️ {t.keyboardLayout}</h3>
          <div style={{
            background: '#f8f9fa',
            padding: '1.5rem',
            borderRadius: '12px',
            overflowX: 'auto',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'flex-start',
              minWidth: 'fit-content'
            }}>
              {/* 主键盘区 */}
              <div style={{ flex: '0 0 auto' }}>
                {mainKeyboard.map((row, rowIndex) => (
                  <div key={rowIndex} style={{
                    display: 'flex',
                    marginBottom: rowIndex === 0 ? '0.5rem' : '3px',
                    gap: '3px'
                  }}>
                    {row.keys.map((code, keyIndex) => renderKey(code, rowIndex, keyIndex))}
                  </div>
                ))}
              </div>

              {/* 编辑键区、方向键和小键盘 */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                flex: '0 0 auto'
              }}>
                {/* 编辑键区和方向键列 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {/* 顶部编辑键 */}
                  <div>
                    {editKeysTop.map((row, rowIndex) => (
                      <div key={rowIndex} style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
                        {row.map((code, keyIndex) => renderKey(code, rowIndex, keyIndex))}
                      </div>
                    ))}
                  </div>

                  {/* 中间间隔 */}
                  <div style={{ height: '0.5rem' }} />

                  {/* 中间编辑键 */}
                  <div>
                    {editKeysMiddle.map((row, rowIndex) => (
                      <div key={rowIndex} style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
                        {row.map((code, keyIndex) => renderKey(code, rowIndex, keyIndex))}
                      </div>
                    ))}
                  </div>

                  {/* 底部间隔 */}
                  <div style={{ flex: 1, minHeight: '0.5rem' }} />

                  {/* 方向键 */}
                  <div>
                    {arrowKeysLayout.map((row, rowIndex) => (
                      <div key={rowIndex} style={{
                        display: 'flex',
                        gap: '3px',
                        marginBottom: '3px',
                        justifyContent: rowIndex === 0 ? 'center' : 'flex-start'
                      }}>
                        {row.map((code, keyIndex) => renderKey(code, rowIndex, keyIndex))}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 小键盘区 */}
                <div style={{ flex: '0 0 auto' }}>
                  {numpadLayout.map((row, rowIndex) => (
                    <div key={rowIndex} style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 44px)',
                      gap: '3px',
                      marginBottom: '3px'
                    }}>
                      {row.map((code, keyIndex) => renderKey(code, rowIndex, keyIndex))}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 图例 */}
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              background: 'white',
              borderRadius: '8px',
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '24px', height: '24px', border: '2px solid #cbd5e0', background: '#fff', borderRadius: '4px' }} />
                <span style={{ fontSize: '14px', color: '#666' }}>{t.untested}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '24px', height: '24px', border: '2px solid #48bb78', background: '#c6f6d5', borderRadius: '4px' }} />
                <span style={{ fontSize: '14px', color: '#666' }}>{t.tested}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '24px', height: '24px', border: '2px solid #667eea', background: '#667eea', borderRadius: '4px' }} />
                <span style={{ fontSize: '14px', color: '#666' }}>{t.pressing}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 按键历史 */}
        <section>
          <h3>📝 {t.keyHistory}</h3>
          <div style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            maxHeight: '200px',
            overflowY: 'auto',
            marginBottom: '1.5rem'
          }}>
            {keyHistory.length === 0 ? (
              <p style={{ margin: 0, color: '#666', textAlign: 'center' }}>
                {t.noKeyHistory}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {keyHistory.map((keyPress, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      background: 'white',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                  >
                    <span style={{ fontWeight: 'bold', color: '#667eea' }}>
                      {keyPress.key}
                    </span>
                    <span style={{ color: '#666' }}>
                      {keyPress.code}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 测试说明 */}
        <section>
          <div style={{
            padding: '1.5rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '2px solid #e2e8f0'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#667eea', fontSize: '18px' }}>
              💡 {t.testInstructions}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666', lineHeight: '2' }}>
              <li>{t.keyboardInstruction1}</li>
              <li>{t.keyboardInstruction2}</li>
              <li>{t.keyboardInstruction3}</li>
              <li>{t.keyboardInstruction4}</li>
              <li>{t.keyboardInstruction5}</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

export default KeyboardTest
