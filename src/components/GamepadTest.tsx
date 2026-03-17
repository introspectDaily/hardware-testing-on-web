import { useState, useEffect, useRef, useCallback } from 'react'
import { useI18n } from '../i18n/I18nContext'

// Standard Gamepad button mapping
const BUTTON_MAP = [
  { id: 0,  label: 'A',      group: 'face' },
  { id: 1,  label: 'B',      group: 'face' },
  { id: 2,  label: 'X',      group: 'face' },
  { id: 3,  label: 'Y',      group: 'face' },
  { id: 4,  label: 'LB',     group: 'shoulder' },
  { id: 5,  label: 'RB',     group: 'shoulder' },
  { id: 6,  label: 'LT',     group: 'trigger' },
  { id: 7,  label: 'RT',     group: 'trigger' },
  { id: 8,  label: 'Select', group: 'center' },
  { id: 9,  label: 'Start',  group: 'center' },
  { id: 10, label: 'L3',     group: 'stick' },
  { id: 11, label: 'R3',     group: 'stick' },
  { id: 12, label: '↑',      group: 'dpad' },
  { id: 13, label: '↓',      group: 'dpad' },
  { id: 14, label: '←',      group: 'dpad' },
  { id: 15, label: '→',      group: 'dpad' },
  { id: 16, label: 'Home',   group: 'center' },
]

interface GamepadState {
  id: string
  index: number
  buttons: { pressed: boolean; value: number }[]
  axes: number[]
  mapping: string
  timestamp: number
}

const DEAD_ZONE = 0.12

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

const GamepadTest = () => {
  const { t } = useI18n()
  const [gamepads, setGamepads] = useState<GamepadState[]>([])
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [testedButtons, setTestedButtons] = useState<Set<number>>(new Set())
  const [vibrateSupported, setVibrateSupported] = useState(false)
  const rafRef = useRef<number>(0)

  const readGamepads = useCallback(() => {
    const raw = navigator.getGamepads()
    const connected: GamepadState[] = []
    for (const gp of raw) {
      if (!gp) continue
      connected.push({
        id: gp.id,
        index: gp.index,
        mapping: gp.mapping,
        timestamp: gp.timestamp,
        buttons: Array.from(gp.buttons).map(b => ({ pressed: b.pressed, value: b.value })),
        axes: Array.from(gp.axes),
      })
    }
    setGamepads(connected)

    // 记录已按过的按键
    const active = raw[activeIndex]
    if (active) {
      active.buttons.forEach((btn, i) => {
        if (btn.pressed) {
          setTestedButtons(prev => {
            if (prev.has(i)) return prev
            return new Set(prev).add(i)
          })
        }
      })
      // 摇杆也计入测试（偏移超过阈值）
      if (Math.abs(active.axes[0]) > 0.5 || Math.abs(active.axes[1]) > 0.5) {
        setTestedButtons(prev => prev.has(10) ? prev : new Set(prev).add(10))
      }
      if (Math.abs(active.axes[2]) > 0.5 || Math.abs(active.axes[3]) > 0.5) {
        setTestedButtons(prev => prev.has(11) ? prev : new Set(prev).add(11))
      }
      // 检测震动支持
      if ((active as any).vibrationActuator) setVibrateSupported(true)
    }

    rafRef.current = requestAnimationFrame(readGamepads)
  }, [activeIndex])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(readGamepads)
    return () => cancelAnimationFrame(rafRef.current)
  }, [readGamepads])

  useEffect(() => {
    const onConnect = (e: GamepadEvent) => {
      setActiveIndex(e.gamepad.index)
    }
    window.addEventListener('gamepadconnected', onConnect)
    return () => window.removeEventListener('gamepadconnected', onConnect)
  }, [])

  const triggerVibrate = async () => {
    const gp = navigator.getGamepads()[activeIndex]
    if (!gp) return
    const actuator = (gp as any).vibrationActuator
    if (!actuator) return
    await actuator.playEffect('dual-rumble', {
      startDelay: 0, duration: 500,
      weakMagnitude: 0.5, strongMagnitude: 1.0,
    })
  }

  const resetTest = () => setTestedButtons(new Set())

  const active = gamepads.find(g => g.index === activeIndex)

  // ─── 按键状态帮助函数 ───
  const isPressed = (id: number) => active?.buttons[id]?.pressed ?? false
  const btnValue  = (id: number) => active?.buttons[id]?.value ?? 0
  const isTested  = (id: number) => testedButtons.has(id)

  const btnColor = (id: number) => {
    if (isPressed(id)) return { bg: '#667eea', border: '#667eea', color: '#fff', shadow: '0 0 12px rgba(102,126,234,0.6)' }
    if (isTested(id))  return { bg: '#c6f6d5', border: '#48bb78', color: '#333', shadow: 'none' }
    return { bg: '#f1f5f9', border: '#cbd5e0', color: '#555', shadow: 'none' }
  }

  // ─── 圆形按键 ───
  const RoundBtn = ({ id, label, size = 38, fontSize = 12 }: { id: number; label: string; size?: number; fontSize?: number }) => {
    const c = btnColor(id)
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: c.bg, border: `2px solid ${c.border}`, color: c.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize, fontWeight: 700, boxShadow: c.shadow,
        transition: 'all 0.08s ease', transform: isPressed(id) ? 'scale(0.92)' : 'scale(1)',
        userSelect: 'none', cursor: 'default', flexShrink: 0,
      }}>
        {label}
      </div>
    )
  }

  // ─── 扳机条 ───
  const TriggerBar = ({ id, label }: { id: number; label: string }) => {
    const val = btnValue(id)
    const pressed = isPressed(id)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 60 }}>
        <div style={{
          padding: '3px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700,
          background: pressed ? '#667eea' : isTested(id) ? '#c6f6d5' : '#f1f5f9',
          border: `2px solid ${pressed ? '#667eea' : isTested(id) ? '#48bb78' : '#cbd5e0'}`,
          color: pressed ? '#fff' : '#555',
          transition: 'all 0.08s ease',
        }}>{label}</div>
        <div style={{ width: 48, height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            width: `${val * 100}%`, height: '100%',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            transition: 'width 0.05s linear',
          }} />
        </div>
        <span style={{ fontSize: 10, color: '#999' }}>{Math.round(val * 100)}%</span>
      </div>
    )
  }

  // ─── 摇杆 ───
  const Stick = ({ axisX, axisY, btnId, label }: { axisX: number; axisY: number; btnId: number; label: string }) => {
    const x = Math.abs(axisX) > DEAD_ZONE ? axisX : 0
    const y = Math.abs(axisY) > DEAD_ZONE ? axisY : 0
    const radius = 32
    const dotX = clamp(x * radius, -radius, radius)
    const dotY = clamp(y * radius, -radius, radius)
    const pressed = isPressed(btnId)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{
          position: 'relative', width: radius * 2 + 16, height: radius * 2 + 16,
          borderRadius: '50%', background: pressed ? '#e8eaf6' : '#f1f5f9',
          border: `2px solid ${pressed ? '#667eea' : '#cbd5e0'}`,
          boxShadow: pressed ? 'inset 0 2px 6px rgba(102,126,234,0.3)' : 'inset 0 2px 4px rgba(0,0,0,0.08)',
          transition: 'all 0.08s ease',
        }}>
          {/* 十字线 */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ width: '70%', height: 1, background: '#e2e8f0', position: 'absolute' }} />
            <div style={{ width: 1, height: '70%', background: '#e2e8f0', position: 'absolute' }} />
          </div>
          {/* 摇杆点 */}
          <div style={{
            position: 'absolute',
            left: '50%', top: '50%',
            width: 20, height: 20, borderRadius: '50%',
            background: pressed ? '#667eea' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '2px solid #fff',
            boxShadow: '0 2px 6px rgba(102,126,234,0.5)',
            transform: `translate(calc(-50% + ${dotX}px), calc(-50% + ${dotY}px))`,
            transition: 'transform 0.03s linear',
          }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RoundBtn id={btnId} label={label} size={28} fontSize={10} />
          <span style={{ fontSize: 11, color: '#888' }}>
            {x.toFixed(2)}, {y.toFixed(2)}
          </span>
        </div>
      </div>
    )
  }

  const axes = active?.axes ?? [0, 0, 0, 0]
  const totalButtons = BUTTON_MAP.length
  const coveragePercent = Math.round((testedButtons.size / totalButtons) * 100)

  return (
    <div className="test-container">
      <div className="test-header">
        <h2>{t.gamepadTestTitle}</h2>
        <p>{t.gamepadTestDescription}</p>
      </div>

      <div className="test-content">

        {/* 连接状态 */}
        {gamepads.length === 0 ? (
          <div style={{
            padding: '3rem', textAlign: 'center', background: '#f8f9fa',
            borderRadius: 12, marginBottom: '1.5rem',
            border: '2px dashed #cbd5e0',
          }}>
            <div style={{ fontSize: 56, marginBottom: '1rem' }}>🎮</div>
            <p style={{ fontSize: 18, color: '#555', marginBottom: 8 }}>{t.noGamepad}</p>
            <p style={{ fontSize: 14, color: '#999' }}>{t.noGamepadHint}</p>
          </div>
        ) : (
          <>
            {/* 手柄选择 & 覆盖率 */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <h3 style={{ marginBottom: '0.75rem' }}>🎮 {t.connectedGamepad}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {gamepads.map(gp => (
                    <div key={gp.index}
                      onClick={() => setActiveIndex(gp.index)}
                      style={{
                        padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                        background: gp.index === activeIndex ? 'linear-gradient(135deg,#667eea,#764ba2)' : '#f8f9fa',
                        color: gp.index === activeIndex ? '#fff' : '#333',
                        border: `2px solid ${gp.index === activeIndex ? '#667eea' : '#e2e8f0'}`,
                        transition: 'all 0.15s ease',
                      }}>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>
                        #{gp.index} — {gp.id.length > 40 ? gp.id.slice(0, 40) + '…' : gp.id}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.8 }}>
                        {t.gamepadButtons}: {gp.buttons.length} &nbsp;|&nbsp; {t.gamepadAxes}: {gp.axes.length} &nbsp;|&nbsp; {gp.mapping || 'unknown'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 覆盖率 & 操作 */}
              <div style={{ flex: '0 0 200px' }}>
                <h3 style={{ marginBottom: '0.75rem' }}>📊 {t.testCoverage}</h3>
                <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: '#666' }}>
                      {testedButtons.size} / {totalButtons}
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#48bb78' }}>{coveragePercent}%</span>
                  </div>
                  <div style={{ height: 20, background: '#e2e8f0', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{
                      width: `${coveragePercent}%`, height: '100%',
                      background: 'linear-gradient(90deg,#48bb78,#38a169)',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button onClick={resetTest} style={{
                      padding: '8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: 'linear-gradient(135deg,#f093fb,#f5576c)', color: '#fff',
                      fontSize: 13, fontWeight: 600,
                    }}>{t.resetTest}</button>
                    {vibrateSupported && (
                      <button onClick={triggerVibrate} style={{
                        padding: '8px', borderRadius: 6, border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff',
                        fontSize: 13, fontWeight: 600,
                      }}>📳 {t.vibrationTest}</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 手柄可视化 */}
            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>🕹️ {t.gamepadLayout}</h3>
              <div style={{
                background: '#f8f9fa', borderRadius: 12, padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '1.5rem',
              }}>
                {/* ── 顶行：扳机 & 肩键 ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <TriggerBar id={6} label="LT" />
                    <RoundBtn id={4} label="LB" size={44} />
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <RoundBtn id={5} label="RB" size={44} />
                    <TriggerBar id={7} label="RT" />
                  </div>
                </div>

                {/* ── 中行：D-Pad | 中间键 | ABXY ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  {/* D-Pad */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,38px)', gridTemplateRows: 'repeat(3,38px)', gap: 3 }}>
                    <div />
                    <RoundBtn id={12} label="↑" />
                    <div />
                    <RoundBtn id={14} label="←" />
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#e2e8f0' }} />
                    <RoundBtn id={15} label="→" />
                    <div />
                    <RoundBtn id={13} label="↓" />
                    <div />
                  </div>

                  {/* 中间键 */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <RoundBtn id={8}  label="⊖" size={32} fontSize={14} />
                      <RoundBtn id={16} label="⊙" size={36} fontSize={14} />
                      <RoundBtn id={9}  label="⊕" size={32} fontSize={14} />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: 10, color: '#aaa' }}>Select</span>
                      <span style={{ fontSize: 10, color: '#aaa' }}>Home</span>
                      <span style={{ fontSize: 10, color: '#aaa' }}>Start</span>
                    </div>
                  </div>

                  {/* ABXY */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,38px)', gridTemplateRows: 'repeat(3,38px)', gap: 3 }}>
                    <div /><RoundBtn id={3} label="Y" /><div />
                    <RoundBtn id={2} label="X" />
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#e2e8f0' }} />
                    <RoundBtn id={1} label="B" />
                    <div /><RoundBtn id={0} label="A" /><div />
                  </div>
                </div>

                {/* ── 底行：左摇杆 | 右摇杆 ── */}
                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                  <Stick axisX={axes[0]} axisY={axes[1]} btnId={10} label="L3" />
                  <Stick axisX={axes[2]} axisY={axes[3]} btnId={11} label="R3" />
                </div>
              </div>
            </section>

            {/* 原始轴值 */}
            <section style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.75rem' }}>📐 {t.axisValues}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                {(active?.axes ?? []).map((val, i) => (
                  <div key={i} style={{ background: '#f8f9fa', borderRadius: 8, padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#888' }}>Axis {i}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#667eea' }}>
                        {val.toFixed(3)}
                      </span>
                    </div>
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 3, position: 'relative' }}>
                      <div style={{
                        position: 'absolute',
                        left: '50%', top: 0, height: '100%',
                        width: `${Math.abs(val) * 50}%`,
                        transform: val < 0 ? 'translateX(-100%)' : 'none',
                        background: 'linear-gradient(90deg,#667eea,#764ba2)',
                        borderRadius: 3,
                        transition: 'width 0.05s linear',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* 测试说明 */}
        <section>
          <div style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: 8, border: '2px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 1rem', color: '#667eea', fontSize: 18 }}>
              💡 {t.testInstructions}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#666', lineHeight: 2 }}>
              <li>{t.gamepadInstruction1}</li>
              <li>{t.gamepadInstruction2}</li>
              <li>{t.gamepadInstruction3}</li>
              <li>{t.gamepadInstruction4}</li>
              <li>{t.gamepadInstruction5}</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  )
}

export default GamepadTest
