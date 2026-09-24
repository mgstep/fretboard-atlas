const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// High E down to low E. Pitch classes from C = 0.
const OPEN = [4, 11, 7, 2, 9, 4];
const STRING_NAMES = ["E", "B", "G", "D", "A", "E"];
const STRING_WEIGHTS = ["1px", "1.2px", "1.5px", "2px", "2.4px", "2.8px"];

const SCALES = {
  "Major (Ionian)": { iv: [0, 2, 4, 5, 7, 9, 11], hint: "Bright, resolved. I–ii–iii–IV–V–vi–vii°" },
  "Natural minor (Aeolian)": { iv: [0, 2, 3, 5, 7, 8, 10], hint: "Dark, relative minor of the major 3 semitones up." },
  "Harmonic minor": { iv: [0, 2, 3, 5, 7, 8, 11], hint: "Raised 7th. Strong V7 pull. Spanish / classical color." },
  "Melodic minor": { iv: [0, 2, 3, 5, 7, 9, 11], hint: "Jazz minor. Raised 6 and 7 ascending." },
  Dorian: { iv: [0, 2, 3, 5, 7, 9, 10], hint: "Minor with a raised 6. Funky / modal rock." },
  Phrygian: { iv: [0, 1, 3, 5, 7, 8, 10], hint: "Flat 2. Spanish / metal flavor." },
  Lydian: { iv: [0, 2, 4, 6, 7, 9, 11], hint: "Sharp 4. Dreamy, floating major." },
  Mixolydian: { iv: [0, 2, 4, 5, 7, 9, 10], hint: "Dominant / blues-rock major with flat 7." },
  Locrian: { iv: [0, 1, 3, 5, 6, 8, 10], hint: "Diminished tonic. Unstable, rarely tonal home." },
  "Major pentatonic": { iv: [0, 2, 4, 7, 9], hint: "1 2 3 5 6. Country, pop, safe major melody." },
  "Minor pentatonic": { iv: [0, 3, 5, 7, 10], hint: "1 b3 4 5 b7. Default rock / blues box." },
  Blues: { iv: [0, 3, 5, 6, 7, 10], hint: "Minor pentatonic plus the blue note (b5)." },
  "Major blues": { iv: [0, 2, 3, 4, 7, 9], hint: "Major pentatonic plus #2 / b3." },
  "Whole tone": { iv: [0, 2, 4, 6, 8, 10], hint: "Augmented, dreamlike, no leading tone." },
  "Diminished (HW)": { iv: [0, 1, 3, 4, 6, 7, 9, 10], hint: "Half-whole. Dominant / diminished lines." },
  "Diminished (WH)": { iv: [0, 2, 3, 5, 6, 8, 9, 11], hint: "Whole-half. Diminished arpeggio highways." },
};

const DEGREE_NAMES = {
  0: "1",
  1: "b2",
  2: "2",
  3: "b3",
  4: "3",
  5: "4",
  6: "b5/#4",
  7: "5",
  8: "b6",
  9: "6",
  10: "b7",
  11: "7",
};

const CHORD_TYPES = [
  { name: "Major", iv: [0, 4, 7], tag: "1 3 5" },
  { name: "Minor", iv: [0, 3, 7], tag: "1 b3 5" },
  { name: "Diminished", iv: [0, 3, 6], tag: "1 b3 b5" },
  { name: "Augmented", iv: [0, 4, 8], tag: "1 3 #5" },
  { name: "Sus2", iv: [0, 2, 7], tag: "1 2 5" },
  { name: "Sus4", iv: [0, 5, 7], tag: "1 4 5" },
  { name: "6", iv: [0, 4, 7, 9], tag: "1 3 5 6" },
  { name: "m6", iv: [0, 3, 7, 9], tag: "1 b3 5 6" },
  { name: "Maj7", iv: [0, 4, 7, 11], tag: "1 3 5 7" },
  { name: "7", iv: [0, 4, 7, 10], tag: "1 3 5 b7" },
  { name: "m7", iv: [0, 3, 7, 10], tag: "1 b3 5 b7" },
  { name: "m7b5", iv: [0, 3, 6, 10], tag: "1 b3 b5 b7" },
  { name: "dim7", iv: [0, 3, 6, 9], tag: "1 b3 b5 bb7" },
  { name: "mMaj7", iv: [0, 3, 7, 11], tag: "1 b3 5 7" },
  { name: "9", iv: [0, 4, 7, 10, 2], tag: "1 3 5 b7 9" },
  { name: "Maj9", iv: [0, 4, 7, 11, 2], tag: "1 3 5 7 9" },
  { name: "m9", iv: [0, 3, 7, 10, 2], tag: "1 b3 5 b7 9" },
  { name: "add9", iv: [0, 4, 7, 2], tag: "1 3 5 9" },
  { name: "11", iv: [0, 4, 7, 10, 2, 5], tag: "1 3 5 b7 9 11" },
  { name: "13", iv: [0, 4, 7, 10, 2, 9], tag: "1 3 5 b7 9 13" },
];

function pcName(pc) {
  return NOTES[((pc % 12) + 12) % 12];
}

function chordLabel(rootName, name) {
  if (name === "Major") return rootName;
  if (name === "Minor") return rootName + "m";
  return rootName + name;
}

const BOXES = [
  { start: 0, end: 3 },
  { start: 2, end: 6 },
  { start: 5, end: 8 },
  { start: 7, end: 10 },
  { start: 10, end: 13 },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"];

function intervalLabel(iv) {
  if (iv === 6) return "b5";
  return DEGREE_NAMES[iv];
}

function rootFretLowE() {
  return (state.scaleKey - OPEN[5] + 12) % 12;
}

function positionWindow() {
  const box = BOXES[state.position] || BOXES[0];
  const root = rootFretLowE();
  return { start: root + box.start, end: root + box.end };
}

function triadKind(rel) {
  const key = rel.slice().sort((a, b) => a - b).join(",");
  const kinds = {
    "0,4,7": "maj",
    "0,3,7": "min",
    "0,3,6": "dim",
    "0,4,8": "aug",
    "0,2,7": "sus2",
    "0,5,7": "sus4",
    "0,4,6": "b5",
    "0,3,8": "m#5",
  };
  return kinds[key] || rel.map((n) => intervalLabel(n)).join(" ");
}

function shortChordName(rootName, kind) {
  if (kind === "maj") return rootName;
  if (kind === "min") return rootName + "m";
  if (kind === "dim") return rootName + "dim";
  if (kind === "aug") return rootName + "aug";
  return rootName + kind;
}

function romanNumeral(index, kind, seven) {
  if (!seven) return intervalLabel(SCALES[state.scale].iv[index]);
  let roman = ROMAN[index] || String(index + 1);
  if (kind === "min" || kind === "dim") roman = roman.toLowerCase();
  if (kind === "dim") roman += "°";
  if (kind === "aug") roman += "+";
  if (kind === "sus2" || kind === "sus4" || kind === "b5" || kind === "m#5") roman += kind;
  return roman;
}

function diatonicChords() {
  const ivs = SCALES[state.scale].iv;
  if (ivs.length < 5) return [];
  const seven = ivs.length === 7;
  return ivs.map((rootIv, i) => {
    const tones = [0, 2, 4].map((step) => ivs[(i + step) % ivs.length]);
    const rel = tones.map((t) => (t - rootIv + 12) % 12);
    const kind = triadKind(rel);
    const rootName = pcName(state.scaleKey + rootIv);
    return {
      i,
      rootIv,
      tones,
      roman: romanNumeral(i, kind, seven),
      label: shortChordName(rootName, kind),
      notes: tones.map((t) => pcName(state.scaleKey + t)).join(" "),
    };
  });
}

