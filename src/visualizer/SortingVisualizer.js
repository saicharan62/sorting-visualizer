import React, { useState, useEffect, useRef } from 'react';

function SortingVisualizer({
  array,
  activeIndices = [],
  onRandomize,
  onChangeBars,
  onChangeSpeed,
  onStart,
  onClose,
  speed = 50,
  stats = { time: 0, comparisons: 0, swaps: 0 },
  title = 'Visualizer'
}) {
  const baseColor = 'rgba(79, 209, 197, 0.9)';
  const activeColor = '#ff6b6b';
  const [mounted, setMounted] = useState(false);
  const [runningState, setRunningState] = useState('idle'); // idle | running | paused

  useEffect(() => { 
    const t = setTimeout(() => setMounted(true), 0); 
    return () => clearTimeout(t); 
  }, []);

  const controllerRef = useRef({ paused: false, stopped: false });

  const handleToggle = () => {
    if (runningState === 'idle' || runningState === 'paused') {
      controllerRef.current.paused = false;
      controllerRef.current.stopped = false;
      setRunningState('running');
      onStart(controllerRef.current).then(() => setRunningState('idle'));
    } else if (runningState === 'running') {
      controllerRef.current.paused = true;
      setRunningState('paused');
    }
  };

  const handleStop = () => {
    controllerRef.current.stopped = true;
    setRunningState('idle');
  };

  return (
    <div
      className="visualizer-reveal"
      style={{
        width: 'calc(100% - 25px)',
        maxWidth: '1200px',
        margin: '24px auto 28px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: '18px 18px 24px',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
        position: 'relative',
        overflow: 'hidden',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity .35s ease, transform .35s ease'
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <div style={{ fontWeight: 600, opacity: 0.9 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={handleToggle} style={toggleBtn}>
            {runningState === 'running' ? '⏸ Pause' : (runningState === 'paused' ? '▶️ Resume' : '▶️ Start')}
          </button>
          <button onClick={handleStop} style={classicBtn}>⏹ Stop</button>
          <button onClick={onClose} style={classicBtn}>✖️ Close</button>
        </div>
      </div>

      {/* Controls & Stats */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
          <button onClick={onRandomize} style={classicBtn}>Randomize</button>

          <label style={labelStyle}>
            Bars
            <input type="range" min="10" max="200" value={array.length} onChange={(e) => onChangeBars?.(+e.target.value)} style={rangeStyle}/>
            <span style={valuePill}>{array.length}</span>
          </label>

          <label style={labelStyle}>
            Speed
            <input type="range" min="5" max="250" value={speed} onChange={(e) => onChangeSpeed?.(+e.target.value)} style={rangeStyle}/>
            <span style={valuePill}>{speed} ms</span>
          </label>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 13, opacity: 0.9, padding: '6px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', justifyContent: 'center', flex: '1 1 auto' }}>
          <span>⏱ {stats.time} ms</span>
          <span>🔄 {stats.comparisons} comps</span>
          <span>♻️ {stats.swaps} swaps</span>
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: 260, paddingTop: 10, width: '100%', maxWidth: '100%', overflowX: 'hidden', gap: '2px', paddingRight: '12px', boxSizing: 'border-box' }}>
        {array.map((value, idx) => (
          <div key={idx} style={{
            width: `${Math.min(20, 700 / array.length)}px`,
            height: `${value}px`,
            background: activeIndices.includes(idx) ? activeColor : baseColor,
            borderRadius: '3px 3px 0 0',
            transition: 'height .22s ease, background .18s ease',
            boxShadow: activeIndices.includes(idx) ? '0 4px 10px rgba(0,0,0,0.3), 0 0 10px rgba(255,107,107,0.6)' : 'inset 0 2px 6px rgba(0,0,0,0.25)'
          }}/>
        ))}
      </div>
    </div>
  );
}

const classicBtn = {
  padding: '8px 14px',
  background: '#f5f5f5',
  border: '1px solid #ccc',
  borderRadius: 6,
  color: '#222',
  cursor: 'pointer',
  fontWeight: 500,
  transition: 'all 0.2s ease',
};
const toggleBtn = {
  ...classicBtn,
  background: '#16ca2bff',
  color: '#fff',
  border: 'none',
};
Object.assign(toggleBtn, {
  ':hover': { background: '#00f2fe' },
});
const labelStyle = { display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 13 };
const rangeStyle = { appearance: 'none', height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.15)', outline: 'none', width: 160 };
const valuePill = { padding: '3px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontSize: 12 };

export default SortingVisualizer;
