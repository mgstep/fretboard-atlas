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
  renderInfo();
  renderDegrees();
  renderDiatonic();
  renderChords();
  renderPositions();
  paintBoard();
  renderCircle();
}

function bindControls() {
  $("playKey").onchange = (e) => {
    state.playKey = +e.target.value;
    if (state.link) state.scaleKey = state.playKey;
    render();
  };
  $("scaleKey").onchange = (e) => {
    state.scaleKey = +e.target.value;
    state.link = false;
    render();
  };
  $("scaleType").onchange = (e) => {
    state.scale = e.target.value;
    state.focus = new Set();
    state.chordFilter = null;
    state.diatonicIndex = null;
    state.chordRoot = null;
    render();
  };
  $("fretCount").onchange = (e) => {
    state.frets = +e.target.value;
    render();
  };
  $("linkKeys").onclick = () => {
    state.link = !state.link;
    if (state.link) state.scaleKey = state.playKey;
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
}

fillSelects();
bindControls();
render();
