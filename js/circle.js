const FIFTH_NAMES = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
const FIFTH_PCS = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5];
const SIGNATURES = [
  "no sharps or flats",
  "1 sharp · F#",
  "2 sharps · F# C#",
  "3 sharps · F# C# G#",
  "4 sharps · F# C# G# D#",
  "5 sharps · F# C# G# D# A#",
  "6 sharps · F# C# G# D# A# E#",
  "5 flats · Bb Eb Ab Db Gb",
  "4 flats · Bb Eb Ab Db",
  "3 flats · Bb Eb Ab",
  "2 flats · Bb Eb",
  "1 flat · Bb",
];

function fifthIndex(pc) {
  return FIFTH_PCS.indexOf(((pc % 12) + 12) % 12);
}

function isMinorFamily() {
  const iv = SCALES[state.scale].iv;
  return iv.includes(3) && !iv.includes(4);
}

function signatureIndex() {
  const tonic = state.scaleKey;
  const majorPc = isMinorFamily() ? (tonic + 3) % 12 : tonic;
  return fifthIndex(majorPc);
}

function polar(cx, cy, r, i) {
  const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
}

function wedge(cx, cy, r0, r1, i) {
  const a0 = (i / 12) * Math.PI * 2 - Math.PI / 2 - Math.PI / 12;
  const a1 = a0 + Math.PI / 6;
  const p = (r, a) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  const [x0, y0] = p(r1, a0);
  const [x1, y1] = p(r1, a1);
  const [x2, y2] = p(r0, a1);
  const [x3, y3] = p(r0, a0);
  return `M ${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${r0} ${r0} 0 0 0 ${x3} ${y3} Z`;
}

function renderCircle() {
  const host = document.getElementById("circle");
  const cx = 140;
  const cy = 140;
  const active = fifthIndex(isMinorFamily() ? (state.scaleKey + 3) % 12 : state.scaleKey);
  let svg = `<svg viewBox="0 0 280 280" class="cof" aria-label="Circle of fifths">`;
  svg += `<circle cx="${cx}" cy="${cy}" r="132" class="cof-rim"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="86" class="cof-split"/>`;
  svg += `<circle cx="${cx}" cy="${cy}" r="46" class="cof-hub"/>`;

  for (let i = 0; i < 12; i++) {
    const on = i === active ? " on" : "";
    svg += `<path class="wedge${on}" d="${wedge(cx, cy, 48, 128, i)}" data-i="${i}"/>`;
    const [mx, my] = polar(cx, cy, 108, i);
    const [nx, ny] = polar(cx, cy, 68, i);
    const minorPc = (FIFTH_PCS[i] + 9) % 12;
    svg += `<text class="cof-major${on}" x="${mx}" y="${my}" data-pc="${FIFTH_PCS[i]}" data-minor="0">${FIFTH_NAMES[i]}</text>`;
    svg += `<text class="cof-minor${on}" x="${nx}" y="${ny}" data-pc="${minorPc}" data-minor="1">${pcName(minorPc)}</text>`;
  }

  const label = isMinorFamily() ? pcName(state.scaleKey) + "m" : pcName(state.scaleKey);
  svg += `<text class="cof-center" x="${cx}" y="${cy - 4}">${label}</text>`;
  svg += `<text class="cof-center-sub" x="${cx}" y="${cy + 14}">${isMinorFamily() ? "minor" : "major"}</text>`;
  svg += `</svg>`;
  host.innerHTML = svg;

  host.querySelectorAll("[data-pc]").forEach((node) => {
    node.onclick = (e) => {
      e.stopPropagation();
      chooseCircleKey(+node.dataset.pc, node.dataset.minor === "1");
    };
  });
  host.querySelectorAll(".wedge").forEach((node) => {
    node.onclick = () => {
      const i = +node.dataset.i;
      chooseCircleKey(FIFTH_PCS[i], false);
    };
  });

  const idx = signatureIndex();
  const relMajor = (state.scaleKey + 3) % 12;
  const relMinor = (state.scaleKey + 9) % 12;
  const dom = (state.scaleKey + 7) % 12;
  const sub = (state.scaleKey + 5) % 12;
  const minorSide = isMinorFamily();
  document.getElementById("cofInfo").innerHTML = `
    <div><b>Signature</b> ${SIGNATURES[idx]}</div>
    <div><b>${minorSide ? "Relative major" : "Relative minor"}</b> ${minorSide ? pcName(relMajor) : pcName(relMinor) + "m"}</div>
    <div><b>Clockwise · V</b> ${pcName(dom)} · dominant</div>
    <div><b>Counterclockwise · IV</b> ${pcName(sub)} · subdominant</div>
    <p class="hint">Outer ring is major. Inner ring is the relative minor. Click either to move the key.</p>
  `;
}

function chooseCircleKey(pc, minor) {
  state.scaleKey = pc;
  if (state.link) state.playKey = pc;
  const target = minor ? "Natural minor (Aeolian)" : "Major (Ionian)";
  const currentMinor = isMinorFamily();
  if (minor !== currentMinor) {
    state.scale = target;
    state.focus = new Set();
    state.chordFilter = null;
    state.diatonicIndex = null;
    state.chordRoot = null;
  }
  render();
}
