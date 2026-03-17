import { useState, useEffect } from 'react'
import { useI18n } from '../i18n/I18nContext'

const ScreenTest = () => {
  const { t } = useI18n()
  const [resolution, setResolution] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    screenWidth: screen.width,
    screenHeight: screen.height,
    pixelRatio: window.devicePixelRatio
  })

  const [currentColor, setCurrentColor] = useState('#ff0000')
  const [colorIndex, setColorIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [fullscreenTestActive, setFullscreenTestActive] = useState(false)
  const [showControls, setShowControls] = useState(false)

  const colors = [
    '#ff0000', // Red
    '#00ff00', // Green
    '#0000ff', // Blue
    '#ffff00', // Yellow
    '#ff00ff', // Magenta
    '#00ffff', // Cyan
    '#000000', // Black
    '#ffffff'  // White
  ]

  useEffect(() => {
    const handleResize = () => {
      setResolution({
        width: window.innerWidth,
        height: window.innerHeight,
        screenWidth: screen.width,
        screenHeight: screen.height,
        pixelRatio: window.devicePixelRatio
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    let interval: number

    if (isTesting) {
      interval = window.setInterval(() => {
        setColorIndex((prevIndex) => (prevIndex + 1) % colors.length)
        setCurrentColor(colors[(colorIndex + 1) % colors.length])
      }, 2000)
    }

    return () => clearInterval(interval)
  }, [isTesting, colorIndex])

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const startFullscreenTest = () => {
    // 添加全屏测试类
    document.documentElement.classList.add('fullscreen-test-active')

    if (!isFullscreen) {
      document.documentElement.requestFullscreen({
        navigationUI: 'hide'
      }).then(() => {
        setIsFullscreen(true)
        setFullscreenTestActive(true)
        setIsTesting(true)
        // 清除可能的滚动条
        document.documentElement.style.overflow = 'hidden'
      }).catch(err => {
        console.error('全屏模式失败:', err)
        // 即使全屏失败，也进入窗口内的全屏测试模式
        setFullscreenTestActive(true)
        setIsTesting(true)
      })
    } else {
      setFullscreenTestActive(true)
      setIsTesting(true)
      document.documentElement.style.overflow = 'hidden'
    }
  }

  const exitFullscreenTest = () => {
    setFullscreenTestActive(false)
    setIsTesting(false)

    // 移除全屏测试类
    document.documentElement.classList.remove('fullscreen-test-active')
    document.documentElement.style.overflow = ''

    if (isFullscreen) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(document.fullscreenElement ||
        // @ts-ignore
        document.webkitFullscreenElement ||
        // @ts-ignore
        document.mozFullScreenElement ||
        // @ts-ignore
        document.msFullscreenElement)

      setIsFullscreen(isCurrentlyFullscreen)

      if (!isCurrentlyFullscreen) {
        setFullscreenTestActive(false)
        document.documentElement.classList.remove('fullscreen-test-active')
        document.documentElement.style.overflow = ''
        setShowControls(false)
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    document.addEventListener('mozfullscreenchange', handleFullscreenChange)
    document.addEventListener('MSFullscreenChange', handleFullscreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange)
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange)
      // 清理
      document.documentElement.classList.remove('fullscreen-test-active')
      document.documentElement.style.overflow = ''
    }
  }, [])

  // 键盘快捷键处理
  useEffect(() => {
    if (!fullscreenTestActive) return

    const handleKeyPress = (e: KeyboardEvent) => {
      // 方向键切换颜色
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault()
        const newIndex = (colorIndex - 1 + colors.length) % colors.length
        setColorIndex(newIndex)
        setCurrentColor(colors[newIndex])
        setIsTesting(false)
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault()
        const newIndex = (colorIndex + 1) % colors.length
        setColorIndex(newIndex)
        setCurrentColor(colors[newIndex])
        setIsTesting(false)
      } else if (e.key === ' ') {
        // 空格键切换自动测试
        e.preventDefault()
        setIsTesting(prev => !prev)
      } else if (e.key === 'Escape') {
        // ESC 键退出全屏测试
        exitFullscreenTest()
      }
    }

    // 鼠标移动显示控制界面
    const handleMouseMove = () => {
      if (!showControls) {
        setShowControls(true)
      }
      // 一段时间后自动隐藏
      const timeout = setTimeout(() => {
        setShowControls(false)
      }, 3000)

      return () => clearTimeout(timeout)
    }

    window.addEventListener('keydown', handleKeyPress)
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [fullscreenTestActive, showControls, colorIndex])

  const startColorTest = () => {
    setIsTesting(true)
  }

  const stopColorTest = () => {
    setIsTesting(false)
  }

  const manualColorChange = (color: string) => {
    setCurrentColor(color)
    setIsTesting(false)
  }

  // 全屏测试模式
  if (fullscreenTestActive) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          minWidth: '100vw',
          minHeight: '100vh',
          maxWidth: '100vw',
          maxHeight: '100vh',
          backgroundColor: currentColor,
          position: 'fixed',
          top: 0,
          left: 0,
          margin: 0,
          padding: 0,
          border: 'none',
          outline: 'none',
          overflow: 'hidden',
          zIndex: 999999,
          transition: 'background-color 0.5s ease'
        }}
        onMouseMove={() => setShowControls(true)}
      >
        {/* 控制提示 - 只在显示控制时显示 */}
        {showControls && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '12px',
              zIndex: 1001,
              pointerEvents: 'none',
              opacity: showControls ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          >
            {t.moveMouseToShow} | {t.spaceToggleAuto} | {t.arrowsChangeColor}
          </div>
        )}

        {/* 控制面板 - 鼠标移动时显示 */}
        {showControls && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                display: 'flex',
                gap: '10px',
                zIndex: 1000,
                opacity: showControls ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              <button
                onClick={exitFullscreenTest}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease'
                }}
              >
                {t.exitFullscreenTestBtn}
              </button>
              {isTesting ? (
                <button
                  onClick={stopColorTest}
                  style={{
                    background: 'rgba(231, 76, 60, 0.9)',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {t.stopAutoToggle}
                </button>
              ) : (
                <button
                  onClick={startColorTest}
                  style={{
                    background: 'rgba(102, 126, 234, 0.9)',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {t.startAutoToggle}
                </button>
              )}
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center',
                zIndex: 1000,
                opacity: showControls ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
            >
              {colors.map((color) => (
                <button
                  key={color}
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: color,
                    border: currentColor === color ? '3px solid rgba(255, 255, 255, 0.9)' : '2px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, opacity 0.3s ease',
                    transform: currentColor === color ? 'scale(1.2)' : 'scale(1)'
                  }}
                  onClick={() => manualColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </>
        )}

        {isTesting && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '15px 25px',
              borderRadius: '12px'
            }}
          >
            {t.autoSwitching} ({Math.round(((colorIndex + 1) / colors.length) * 100)}%)
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="test-container">
      <div className="test-header">
        <h2>{t.screenTestTitle}</h2>
        <p>{t.screenTestDescription}</p>
      </div>

      <div className="test-content">
        <section>
          <h3>📊 {t.resolutionInfo}</h3>
          <div className="resolution-info">
            <p><strong>{t.windowResolution}:</strong> {resolution.width} × {resolution.height}</p>
            <p><strong>{t.screenResolution}:</strong> {resolution.screenWidth} × {resolution.screenHeight}</p>
            <p><strong>{t.devicePixelRatio}:</strong> {resolution.pixelRatio}x</p>
            <p><strong>{t.physicalPixels}:</strong> {Math.round(resolution.screenWidth * resolution.pixelRatio)} × {Math.round(resolution.screenHeight * resolution.pixelRatio)}</p>
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h3>🎨 {t.colorTest}</h3>
          <p>{t.colorTestDescription}</p>

          <div
            className="color-test"
            style={{ backgroundColor: currentColor }}
          />

          <div style={{ margin: '1rem 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              className="fullscreen-btn"
              onClick={startFullscreenTest}
              style={{
                background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
                flex: '1'
              }}
            >
              {t.fullscreenColorTest}
            </button>

            {!isTesting ? (
              <button
                className="fullscreen-btn"
                onClick={startColorTest}
                style={{ flex: '1' }}
              >
                {t.startAutoTest}
              </button>
            ) : (
              <button
                className="fullscreen-btn"
                onClick={stopColorTest}
                style={{ background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', flex: '1' }}
              >
                {t.stopTest}
              </button>
            )}

            <button
              className="fullscreen-btn"
              onClick={toggleFullscreen}
              style={{
                background: 'linear-gradient(135deg, #f39c12 0%, #f1c40f 100%)',
                flex: '1'
              }}
            >
              {isFullscreen ? t.exitFullscreen : t.enterFullscreen}
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <p style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{t.manualSelectColor}:</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {colors.map((color) => (
                <button
                  key={color}
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: color,
                    border: currentColor === color ? '3px solid #333' : '1px solid #ccc',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                  onClick={() => manualColorChange(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#667eea' }}>🎯 {t.testInstructions}:</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666', lineHeight: '1.8' }}>
              <li>{t.testBasic}</li>
              <li>{t.testFullscreen}</li>
              <li>{t.testFullscreenOperation}</li>
              <li>⌨️ <strong>{t.keyboardShortcuts}</strong>:
                <ul style={{ marginTop: '0.5rem', marginBottom: '0', paddingLeft: '1.5rem' }}>
                  <li>{t.shortcutSpace}</li>
                  <li>{t.shortcutArrows}</li>
                  <li>{t.shortcutEsc}</li>
                </ul>
              </li>
              <li>{t.autoTest}</li>
              <li>{t.responseTest}</li>
            </ul>
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h3>⚡ {t.responseTest}</h3>
          <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
            <h4 style={{ marginBottom: '0.5rem', color: '#667eea' }}>{t.responseTestDescription}</h4>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className="fullscreen-btn"
                onClick={() => {
                  setIsTesting(false)
                  setCurrentColor(currentColor === '#000000' ? '#ffffff' : '#000000')
                }}
                style={{ flex: '1' }}
              >
                {t.blackWhiteToggle}
              </button>
              <button
                className="fullscreen-btn"
                onClick={() => {
                  setIsTesting(false)
                  setCurrentColor(currentColor === '#000000' ? '#888888' : '#000000')
                }}
                style={{ flex: '1', background: 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)' }}
              >
                {t.grayScaleTest}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ScreenTest
