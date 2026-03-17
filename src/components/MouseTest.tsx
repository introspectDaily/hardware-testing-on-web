import { useState, useEffect, useRef, useCallback } from 'react'
import { useI18n } from '../i18n/I18nContext'

interface MousePos {
  x: number
  y: number
}

interface WheelEvent_ {
  deltaX: number
  deltaY: number
  direction: 'up' | 'down' | 'left' | 'right'
  timestamp: number
}

type ButtonId = 0 | 1 | 2 | 3 | 4

const BUTTON_LABELS: Record<ButtonId, string> = {
  0: 'Left',
  1: 'Middle',
  2: 'Right',
  3: 'Back',
  4: 'Forward',
}

const MouseTest = () => {
  const { t } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trackAreaRef = useRef<HTMLDivElement>(null)
  const lastPos = useRef<MousePos | null>(null)

  const [pos, setPos] = useState<MousePos>({ x: 0, y: 0 })
  const [pressedButtons, setPressedButtons] = useState<Set<ButtonId>>(new Set())
  const [clickedButtons, setClickedButtons] = useState<Set<ButtonId>>(new Set())
  const [lastWheel, setLastWheel] = useState<WheelEvent_ | null>(null)
  const [totalScroll, setTotalScroll] = useState({ x: 0, y: 0 })
  const [doubleClicked, setDoubleClicked] = useState(false)
  const [clickCount, setClickCount] = useState<Record<ButtonId, number>>({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 })
  const [isInsideTrack, setIsInsideTrack] = useState(false)

  // 在画布上绘制轨迹
  const drawTrail = useCallback((from: MousePos, to: MousePos, buttons: Set<ButtonId>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.strokeStyle = buttons.has(0) ? '#667eea' : buttons.has(2) ? '#f5576c' : '#48bb78'
    ctx.lineWidth = buttons.size > 0 ? 3 : 1.5
    ctx.lineCap = 'round'
    ctx.stroke()
  }, [])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    lastPos.current = null
  }

  const resetAll = () => {
    clearCanvas()
    setClickedButtons(new Set())
    setClickCount({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 })
    setTotalScroll({ x: 0, y: 0 })
    setLastWheel(null)
    setDoubleClicked(false)
  }

  useEffect(() => {
    const area = trackAreaRef.current
    if (!area) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = area.getBoundingClientRect()
      const x = Math.round(e.clientX - rect.left)
      const y = Math.round(e.clientY - rect.top)
      const current = { x, y }

      setPos(current)

      if (lastPos.current) {
        drawTrail(lastPos.current, current, pressedButtons)
      }
      lastPos.current = current
    }

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      const btn = e.button as ButtonId
      setPressedButtons(prev => new Set(prev).add(btn))
      setClickedButtons(prev => new Set(prev).add(btn))
      setClickCount(prev => ({ ...prev, [btn]: prev[btn] + 1 }))
    }

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault()
      const btn = e.button as ButtonId
      setPressedButtons(prev => {
        const s = new Set(prev)
        s.delete(btn)
        return s
      })
    }

    const handleContextMenu = (e: MouseEvent) => e.preventDefault()

    const handleDblClick = () => {
      setDoubleClicked(true)
      setTimeout(() => setDoubleClicked(false), 600)
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const direction: WheelEvent_['direction'] =
        Math.abs(e.deltaY) >= Math.abs(e.deltaX)
          ? e.deltaY < 0 ? 'up' : 'down'
          : e.deltaX < 0 ? 'left' : 'right'

      setLastWheel({ deltaX: e.deltaX, deltaY: e.deltaY, direction, timestamp: Date.now() })
      setTotalScroll(prev => ({
        x: Math.round(prev.x + e.deltaX),
        y: Math.round(prev.y + e.deltaY),
      }))
    }

    area.addEventListener('mousemove', handleMouseMove)
    area.addEventListener('mousedown', handleMouseDown)
    area.addEventListener('mouseup', handleMouseUp)
    area.addEventListener('contextmenu', handleContextMenu)
    area.addEventListener('dblclick', handleDblClick)
    area.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      area.removeEventListener('mousemove', handleMouseMove)
      area.removeEventListener('mousedown', handleMouseDown)
      area.removeEventListener('mouseup', handleMouseUp)
      area.removeEventListener('contextmenu', handleContextMenu)
      area.removeEventListener('dblclick', handleDblClick)
      area.removeEventListener('wheel', handleWheel)
    }
  }, [drawTrail, pressedButtons])

  // 同步 canvas 尺寸
  useEffect(() => {
    const area = trackAreaRef.current
    const canvas = canvasRef.current
    if (!area || !canvas) return
    const ro = new ResizeObserver(() => {
      const { width, height } = area.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    })
    ro.observe(area)
    return () => ro.disconnect()
  }, [])

  const isActive = (btn: ButtonId) => pressedButtons.has(btn)
  const isTested = (btn: ButtonId) => clickedButtons.has(btn)

  // 按键颜色
  const btnStyle = (btn: ButtonId) => ({
    bg: isActive(btn) ? '#667eea' : isTested(btn) ? '#c6f6d5' : '#f1f5f9',
    border: isActive(btn) ? '#667eea' : isTested(btn) ? '#48bb78' : '#cbd5e0',
    color: isActive(btn) ? '#fff' : '#333',
    shadow: isActive(btn) ? '0 6px 16px rgba(102,126,234,0.45)' : '0 2px 6px rgba(0,0,0,0.08)',
    transform: isActive(btn) ? 'translateY(3px)' : 'none',
  })

  const scrollArrow = (dir: 'up' | 'down' | 'left' | 'right') => {
    const active = lastWheel?.direction === dir
    return {
      opacity: active ? 1 : 0.2,
      color: active ? '#667eea' : '#999',
      transform: active ? 'scale(1.4)' : 'scale(1)',
      transition: 'all 0.15s ease',
      fontSize: '20px',
      fontWeight: 'bold',
    }
  }

  const s0 = btnStyle(0), s2 = btnStyle(2), s1 = btnStyle(1)

  return (
    <div className="test-container">
      <div className="test-header">
        <h2>{t.mouseTestTitle}</h2>
        <p>{t.mouseTestDescription}</p>
      </div>

      <div className="test-content">
        {/* 鼠标可视化 + 实时信息 */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>

          {/* 鼠标图示 */}
          <div style={{ flex: '0 0 auto' }}>
            <h3 style={{ marginBottom: '1rem' }}>🖱️ {t.mouseButtons}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>

              {/* 鼠标外壳顶部 */}
              <div style={{
                width: '140px',
                display: 'flex',
                gap: '3px',
                padding: '6px 6px 0',
                background: '#e2e8f0',
                borderRadius: '60px 60px 0 0',
                border: '2px solid #cbd5e0',
                borderBottom: 'none',
              }}>
                {/* 左键 */}
                <div onClick={() => {}} style={{
                  flex: 1,
                  height: '70px',
                  borderRadius: '50px 6px 6px 50px',
                  background: s0.bg,
                  border: `2px solid ${s0.border}`,
                  boxShadow: s0.shadow,
                  transform: s0.transform,
                  transition: 'all 0.1s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: s0.color,
                  cursor: 'default',
                }}>
                  {t.btnLeft}
                </div>

                {/* 中键滚轮区 */}
                <div style={{
                  width: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  paddingTop: '8px',
                }}>
                  <div style={scrollArrow('up')}>↑</div>
                  {/* 滚轮 */}
                  <div style={{
                    width: '18px',
                    height: '28px',
                    borderRadius: '9px',
                    background: s1.bg,
                    border: `2px solid ${s1.border}`,
                    boxShadow: s1.shadow,
                    transform: s1.transform,
                    transition: 'all 0.1s ease',
                  }} />
                  <div style={scrollArrow('down')}>↓</div>
                </div>

                {/* 右键 */}
                <div style={{
                  flex: 1,
                  height: '70px',
                  borderRadius: '6px 50px 50px 6px',
                  background: s2.bg,
                  border: `2px solid ${s2.border}`,
                  boxShadow: s2.shadow,
                  transform: s2.transform,
                  transition: 'all 0.1s ease',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingBottom: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: s2.color,
                  cursor: 'default',
                }} >
                  {t.btnRight}
                </div>
              </div>

              {/* 鼠标外壳身体 */}
              <div style={{
                width: '140px',
                height: '90px',
                background: 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e0 100%)',
                border: '2px solid #cbd5e0',
                borderTop: 'none',
                borderRadius: '0 0 60px 60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                flexDirection: 'column',
              }}>
                {/* 侧键 */}
                <div style={{ display: 'flex', gap: '6px' }}>
                  {([3, 4] as ButtonId[]).map(btn => {
                    const s = btnStyle(btn)
                    return (
                      <div key={btn} style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        background: s.bg,
                        border: `2px solid ${s.border}`,
                        boxShadow: s.shadow,
                        transform: s.transform,
                        transition: 'all 0.1s ease',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: s.color,
                        cursor: 'default',
                      }}>
                        {btn === 3 ? t.btnBack : t.btnForward}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 图例 */}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { color: '#667eea', label: t.pressing },
                { color: '#48bb78', label: t.tested },
                { color: '#cbd5e0', label: t.untested },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: color }} />
                  <span style={{ fontSize: '13px', color: '#555' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 实时信息面板 */}
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3>📊 {t.mouseInfo}</h3>

            {/* 坐标 */}
            <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '1rem' }}>
              <p style={{ margin: '0 0 0.5rem', fontSize: '13px', color: '#888' }}>{t.mousePosition}</p>
              <p style={{ margin: 0, fontFamily: 'monospace', fontSize: '22px', fontWeight: 700, color: '#667eea' }}>
                X: {pos.x} &nbsp; Y: {pos.y}
              </p>
            </div>

            {/* 双击提示 */}
            <div style={{
              background: doubleClicked ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f8f9fa',
              color: doubleClicked ? '#fff' : '#888',
              borderRadius: '8px',
              padding: '1rem',
              transition: 'all 0.2s ease',
              textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 4px', fontSize: '13px' }}>{t.doubleClick}</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                {doubleClicked ? '✔ ' + t.detected : t.doubleClickHint}
              </p>
            </div>

            {/* 滚轮 */}
            <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '1rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '13px', color: '#888' }}>{t.scrollWheel}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '13px' }}>
                <div>
                  <span style={{ color: '#888' }}>{t.scrollTotal} Y: </span>
                  <strong style={{ color: '#667eea' }}>{totalScroll.y > 0 ? '+' : ''}{totalScroll.y}</strong>
                </div>
                <div>
                  <span style={{ color: '#888' }}>{t.scrollTotal} X: </span>
                  <strong style={{ color: '#667eea' }}>{totalScroll.x > 0 ? '+' : ''}{totalScroll.x}</strong>
                </div>
                {lastWheel && (
                  <div style={{ gridColumn: '1/-1' }}>
                    <span style={{ color: '#888' }}>{t.lastScroll}: </span>
                    <strong>
                      {lastWheel.direction === 'up' ? '↑' : lastWheel.direction === 'down' ? '↓' : lastWheel.direction === 'left' ? '←' : '→'}
                      {' '}{t['dir_' + lastWheel.direction as keyof typeof t]}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {/* 点击次数 */}
            <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '1rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '13px', color: '#888' }}>{t.clickCount}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(Object.entries(BUTTON_LABELS) as [string, string][]).map(([btn, label]) => {
                  const id = Number(btn) as ButtonId
                  return (
                    <div key={btn} style={{
                      flex: '1 0 auto',
                      textAlign: 'center',
                      background: 'white',
                      borderRadius: '6px',
                      padding: '8px 4px',
                      border: '1px solid #e2e8f0',
                    }}>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#667eea' }}>
                        {clickCount[id]}
                      </div>
                      <div style={{ fontSize: '11px', color: '#888' }}>{label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 重置 */}
            <button
              onClick={resetAll}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(245,87,108,0.3)',
              }}
            >
              {t.resetTest}
            </button>
          </div>
        </div>

        {/* 移动轨迹画布 */}
        <section>
          <h3>🎯 {t.mouseTrail}</h3>
          <div
            ref={trackAreaRef}
            onMouseEnter={() => setIsInsideTrack(true)}
            onMouseLeave={() => { setIsInsideTrack(false); lastPos.current = null }}
            style={{
              position: 'relative',
              width: '100%',
              height: '300px',
              background: '#f8f9fa',
              borderRadius: '12px',
              border: `2px dashed ${isInsideTrack ? '#667eea' : '#cbd5e0'}`,
              overflow: 'hidden',
              cursor: 'crosshair',
              marginBottom: '0.5rem',
              transition: 'border-color 0.2s ease',
            }}
          >
            <canvas
              ref={canvasRef}
              style={{ position: 'absolute', inset: 0 }}
            />
            {!isInsideTrack && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <p style={{ color: '#aaa', fontSize: '15px' }}>{t.moveMouseHere}</p>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '13px', color: '#666' }}>
            <span><span style={{ color: '#667eea', fontWeight: 700 }}>─</span> {t.trailLeft}</span>
            <span><span style={{ color: '#f5576c', fontWeight: 700 }}>─</span> {t.trailRight}</span>
            <span><span style={{ color: '#48bb78', fontWeight: 700 }}>─</span> {t.trailNone}</span>
          </div>
        </section>

        {/* 测试说明 */}
        <section style={{ marginTop: '1.5rem' }}>
          <div style={{
            padding: '1.5rem',
            background: '#f8f9fa',
            borderRadius: '8px',
            border: '2px solid #e2e8f0',
          }}>
            <h4 style={{ margin: '0 0 1rem', color: '#667eea', fontSize: '18px' }}>
              💡 {t.testInstructions}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666', lineHeight: 2 }}>
              <li>{t.mouseInstruction1}</li>
              <li>{t.mouseInstruction2}</li>
              <li>{t.mouseInstruction3}</li>
              <li>{t.mouseInstruction4}</li>
              <li>{t.mouseInstruction5}</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

export default MouseTest
