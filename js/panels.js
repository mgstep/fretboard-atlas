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
      state.chordFilter = state.chordFilter === idx ? null : idx;
      render();
    };
  });
}
