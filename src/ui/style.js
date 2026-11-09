export function addStyle() {
  const style = document.createElement('style')
  style.textContent = `
    :root { background: #e7d8b8; }
    html, body, #app { width: 100%; height: 100%; margin: 0; overflow: hidden; }
    body { background: #e7d8b8; font-family: Georgia, serif; color: #171b1b; }
    body::after { content: ''; position: fixed; inset: 0; pointer-events: none; opacity: .22; mix-blend-mode: multiply; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E"); }
    canvas { display: block; }
    #hud { position: fixed; inset: 0; pointer-events: none; }
    #bars { position: absolute; bottom: 24px; left: 24px; width: 230px; padding: 8px; border: 2px solid #171b1b; background: rgba(231,216,184,.8); }
    .bar { height: 12px; margin: 4px 0; background: #b7ad94; border: 1px solid #171b1b; }
    .fill { height: 100%; transform-origin: left; }
    #health-fill { background: #9d302c; } #stamina-fill { background: #667d63; height: 7px; }
    #hint, #lock-overlay, #dead, #fps, #debug { position: absolute; }
    #hint { bottom: 24px; right: 24px; opacity: 1; transition: opacity 1s; }
    #lock-overlay { top: 45%; width: 100%; text-align: center; font-size: 24px; }
    #dead { top: 35%; width: 100%; text-align: center; font-size: 52px; }
    #dead small { display: block; font-size: 20px; } #fps { top: 12px; left: 12px; }
    #debug { top: 34px; left: 12px; font: 12px monospace; }
    #boss-bar { display: none; }
  `
  document.head.appendChild(style)
}
