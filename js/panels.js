function renderInfo() {
  const sc = SCALES[state.scale];
  const notes = sc.iv.map((i) => pcName(state.scaleKey + i));
  document.getElementById("formula").textContent = sc.iv.map((i) => DEGREE_NAMES[i]).join("  ·  ");
  document.getElementById("scaleNotes").textContent = notes.join("  –  ");
  document.getElementById("scaleHint").textContent = sc.hint;
}

function renderDegrees() {
  const root = document.getElementById("degrees");
  root.innerHTML = SCALES[state.scale].iv
    .map((iv) => {
      const on = state.focus.has(iv) ? "on" : "";
      return `<button class="deg ${on}" data-iv="${iv}">${DEGREE_NAMES[iv]} · ${pcName(state.scaleKey + iv)}</button>`;
    })
    .join("");
  root.querySelectorAll(".deg").forEach((btn) => {
    btn.onclick = () => {
      const iv = +btn.dataset.iv;
      state.chordFilter = null;
      state.diatonicIndex = null;
      state.chordRoot = null;
      if (state.focus.has(iv)) state.focus.delete(iv);
      else state.focus.add(iv);
      render();
    };
  });
}

function chordInScale(chord) {
  const set = new Set(scalePCs());
  return chord.iv.every((i) => set.has((state.scaleKey + i) % 12));
}

function renderChords() {
  const rootName = pcName(state.scaleKey);
  const root = document.getElementById("chords");
  root.innerHTML = CHORD_TYPES.map((c, idx) => {
    const inScale = chordInScale(c);
    const tones = c.iv.map((i) => pcName(state.scaleKey + i)).join(" ");
    const sel = state.chordFilter === idx ? "sel" : "";
    return `<div class="chord ${sel}" data-idx="${idx}" style="opacity:${inScale ? 1 : 0.45}">
      <b>${chordLabel(rootName, c.name)}</b>
      <span>${c.tag}<br>${tones}${inScale ? "" : " · outside"}</span>
    </div>`;
  }).join("");
  root.querySelectorAll(".chord").forEach((el) => {
    el.onclick = () => {
      const idx = +el.dataset.idx;
      if (state.chordFilter === idx) {
        state.chordFilter = null;
        state.chordRoot = null;
        state.focus = new Set();
      } else {
        state.chordFilter = idx;
        state.diatonicIndex = null;
        state.chordRoot = 0;
        state.focus = new Set(CHORD_TYPES[idx].iv);
      }
      render();
    };
  });
}

function renderDiatonic() {
  const root = document.getElementById("diatonic");
  const chords = diatonicChords();
  if (!chords.length) {
    root.innerHTML = `<p class="hint">This scale is too small to build triads.</p>`;
    return;
  }
  root.innerHTML = chords
    .map((c) => {
      const sel = state.diatonicIndex === c.i ? "sel" : "";
      return `<div class="chord ${sel}" data-i="${c.i}">
        <b>${c.roman} · ${c.label}</b>
        <span>${c.notes}</span>
      </div>`;
    })
    .join("");
  root.querySelectorAll(".chord").forEach((el) => {
    el.onclick = () => {
      const i = +el.dataset.i;
      if (state.diatonicIndex === i) {
        state.diatonicIndex = null;
        state.chordRoot = null;
        state.focus = new Set();
      } else {
        const chord = diatonicChords()[i];
        state.diatonicIndex = i;
        state.chordFilter = null;
        state.chordRoot = chord.rootIv;
        state.focus = new Set(chord.tones);
      }
      render();
    };
  });
}

function renderPositions() {
  const host = document.getElementById("positions");
  host.classList.toggle("off", !state.positionsOn);
  host.innerHTML = BOXES.map((_, i) => {
    const on = state.positionsOn && state.position === i ? "on" : "";
    return `<button type="button" class="pos ${on}" data-i="${i}" ${state.positionsOn ? "" : "disabled"}>${i + 1}</button>`;
  }).join("");
  host.querySelectorAll(".pos").forEach((btn) => {
    btn.onclick = () => {
      state.position = +btn.dataset.i;
      render();
    };
  });
  const label = document.getElementById("posRange");
  if (!state.positionsOn) {
    label.textContent = "Off — whole neck";
    return;
  }
  const box = positionWindow();
  const start = Math.max(0, box.start);
  label.textContent = `Fading outside frets ${start}–${box.end}`;
}
