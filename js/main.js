const state = {
  playKey: 9,
  scaleKey: 9,
  scale: "Natural minor (Aeolian)",
  frets: 15,
  focus: new Set(),
  link: true,
  chordFilter: null,
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
  renderChords();
  renderBoard();
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
}

fillSelects();
bindControls();
render();
