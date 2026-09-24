function scalePCs() {
  return SCALES[state.scale].iv.map((i) => (state.scaleKey + i) % 12);
}

function intervalFromRoot(pc) {
  return (pc - state.scaleKey + 12) % 12;
}

function noteClass(pc) {
  const iv = intervalFromRoot(pc);
  if (state.chordFilter != null) {
    const chord = CHORD_TYPES[state.chordFilter];
    if (!chord.iv.includes(iv)) return null;
    if (iv === 0) return "root";
    return state.focus.has(iv) ? "focus" : "scale";
  }
  if (!SCALES[state.scale].iv.includes(iv)) return null;
  if (iv === 0) return "root";
  if (state.focus.has(iv)) return "focus";
  return "scale";
}

function dotHtml(pc, cls) {
  const ring = pc === state.playKey ? " playing" : "";
  return `<div class="dot ${cls}${ring}">${pcName(pc)}</div>`;
}

function renderBoard() {
  const frets = state.frets;
  const inlayFrets = new Set([3, 5, 7, 9, 12, 15, 17, 19, 21]);
  let html = `<div class="fret-numbers" style="--cols:${frets}"><div></div>`;
  for (let f = 1; f <= frets; f++) html += `<div>${f}</div>`;
  html += `</div><div class="strings" style="position:relative;--cols:${frets}"><div class="inlays">`;
  for (let f = 1; f <= frets; f++) {
    const dbl = f === 12;
    const mark = inlayFrets.has(f)
      ? dbl
        ? "<span></span><span></span>"
        : "<span></span>"
      : "";
    html += `<div class="inlay ${dbl ? "double" : ""}">${mark}</div>`;
  }
  html += `</div>`;

  OPEN.forEach((openPc, s) => {
    html += `<div class="string-row" style="--sw:${STRING_WEIGHTS[s]};--cols:${frets}">`;
    const openCls = noteClass(openPc);
    html += `<div class="open">${openCls ? dotHtml(openPc, openCls) : STRING_NAMES[s]}</div>`;
    for (let f = 1; f <= frets; f++) {
      const pc = (openPc + f) % 12;
      const cls = noteClass(pc);
      html += `<div class="cell">${cls ? dotHtml(pc, cls) : ""}</div>`;
    }
    html += `</div>`;
  });
  html += `</div>`;
  document.getElementById("board").innerHTML = html;
}
