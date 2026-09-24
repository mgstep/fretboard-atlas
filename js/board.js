let builtFrets = 0;
const cells = [];

function scalePCs() {
  return SCALES[state.scale].iv.map((i) => (state.scaleKey + i) % 12);
}

function intervalFromRoot(pc) {
  return (pc - state.scaleKey + 12) % 12;
}

function noteClass(pc) {
  const iv = intervalFromRoot(pc);
  if (iv === 0) return "root";
  if (state.focus.has(iv)) return "focus";
  if (!SCALES[state.scale].iv.includes(iv)) return "ghost";
  return "scale";
}

function ensureBoard() {
  if (builtFrets === state.frets) return;
  builtFrets = state.frets;
  cells.length = 0;
  const frets = state.frets;
  const inlayFrets = new Set([3, 5, 7, 9, 12, 15, 17, 19, 21]);
  const board = document.getElementById("board");
  board.replaceChildren();

  const numbers = document.createElement("div");
  numbers.className = "fret-numbers";
  numbers.style.setProperty("--cols", frets);
  numbers.appendChild(document.createElement("div"));
  for (let f = 1; f <= frets; f++) {
    const n = document.createElement("div");
    n.textContent = String(f);
    numbers.appendChild(n);
  }

  const strings = document.createElement("div");
  strings.className = "strings";
  strings.style.setProperty("--cols", frets);

  const inlays = document.createElement("div");
  inlays.className = "inlays";
  for (let f = 1; f <= frets; f++) {
    const slot = document.createElement("div");
    slot.className = "inlay" + (f === 12 ? " double" : "");
    if (inlayFrets.has(f)) {
      slot.appendChild(document.createElement("span"));
      if (f === 12) slot.appendChild(document.createElement("span"));
    }
    inlays.appendChild(slot);
  }
  strings.appendChild(inlays);

  OPEN.forEach((openPc, s) => {
    const row = document.createElement("div");
    row.className = "string-row";
    row.style.setProperty("--sw", STRING_WEIGHTS[s]);
    row.style.setProperty("--cols", frets);

    const open = document.createElement("div");
    open.className = "open";
    const openDot = document.createElement("div");
    openDot.className = "dot";
    open.appendChild(openDot);
    const openLabel = document.createElement("span");
    openLabel.className = "open-name";
    openLabel.textContent = STRING_NAMES[s];
    open.appendChild(openLabel);
    row.appendChild(open);
    cells.push({ el: openDot, label: openLabel, pc: openPc });

    for (let f = 1; f <= frets; f++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      const dot = document.createElement("div");
      dot.className = "dot";
      cell.appendChild(dot);
      row.appendChild(cell);
      cells.push({ el: dot, label: null, pc: (openPc + f) % 12 });
    }
    strings.appendChild(row);
  });

  board.append(numbers, strings);
}

function paintBoard() {
  ensureBoard();
  const play = state.playKey;
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const cls = noteClass(cell.pc);
    const el = cell.el;
    if (cell.label) cell.label.classList.add("off");
    el.className = "dot " + cls + (cell.pc === play ? " playing" : "");
    const name = pcName(cell.pc);
    if (el.textContent !== name) el.textContent = name;
  }
}
