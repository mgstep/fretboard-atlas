const state = {
  playKey: 9,
  scaleKey: 9,
  scale: "Natural minor (Aeolian)",
  frets: 15,
  focus: new Set(),
  link: true,
  chordFilter: null,
  diatonicIndex: null,
  chordRoot: null,
  showIntervals: false,
  positionsOn: false,
  position: 0,
  progressionMinor: true,
};

function $(id) {
  return document.getElementById(id);
}

function fillSelects() {
  NOTES.forEach((n, i) => {
    $("playKey").innerHTML += `<option value="${i}">${n}</option>`;
    $("scaleKey").innerHTML += `<option value="${i}">${n}</option>`;
  });
  Object.keys(SCALES).forEach((name) => {
    $("scaleType").innerHTML += `<option>${name}</option>`;
  });
  $("playKey").value = state.playKey;
  $("scaleKey").value = state.scaleKey;
  $("scaleType").value = state.scale;
}

function render() {
  $("playKey").value = state.playKey;
  $("scaleKey").value = state.scaleKey;
  $("scaleType").value = state.scale;
  $("linkKeys").classList.toggle("active", state.link);
  $("progMajor").classList.toggle("active", !state.progressionMinor);
  $("progMinor").classList.toggle("active", state.progressionMinor);
  renderInfo();
  renderDegrees();
  renderPairings();
  renderNashville();
  renderDiatonic();
  renderChords();
  renderPositions();
  paintBoard();
  renderCircle();
}

function clearProgressionFocus() {
  state.diatonicIndex = null;
  state.chordRoot = null;
  state.focus = new Set();
}

function bindControls() {
  $("playKey").onchange = (e) => {
    state.playKey = +e.target.value;
    if (state.link) state.scaleKey = state.playKey;
    clearProgressionFocus();
    render();
  };
  $("scaleKey").onchange = (e) => {
    state.scaleKey = +e.target.value;
    state.link = false;
    render();
  };
  $("scaleType").onchange = (e) => {
    state.scale = e.target.value;
    state.chordFilter = null;
    state.diatonicIndex = null;
    state.chordRoot = null;
    state.focus = new Set();
    if (state.link) state.progressionMinor = isMinorFamily();
    render();
  };
  $("fretCount").onchange = (e) => {
    state.frets = +e.target.value;
    render();
  };
  $("linkKeys").onclick = () => {
    state.link = !state.link;
    if (state.link) {
      state.scaleKey = state.playKey;
      state.progressionMinor = isMinorFamily();
    }
    render();
  };
  $("intervalToggle").onclick = () => {
    state.showIntervals = !state.showIntervals;
    $("intervalToggle").classList.toggle("active", state.showIntervals);
    $("intervalToggle").textContent = state.showIntervals ? "Intervals" : "Note names";
    render();
  };
  $("posToggle").onclick = () => {
    state.positionsOn = !state.positionsOn;
    $("posToggle").classList.toggle("active", state.positionsOn);
    render();
  };
  $("progMajor").onclick = () => {
    state.progressionMinor = false;
    state.chordFilter = null;
    clearProgressionFocus();
    render();
  };
  $("progMinor").onclick = () => {
    state.progressionMinor = true;
    state.chordFilter = null;
    clearProgressionFocus();
    render();
  };
}

fillSelects();
bindControls();
render();
