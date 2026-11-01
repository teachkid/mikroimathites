const base = import.meta.env.BASE_URL || './';
const cleanBase = base.endsWith('/') ? base : `${base}/`;

export const ANIMALS_DATA = [
  { id: 'dog', name: 'Σκύλος', emoji: '🐶', soundText: 'Γαβ! Γαβ!', audioSrc: `${cleanBase}sounds/animals/dog.mp3`, hint: 'Ο καλύτερος φίλος του ανθρώπου!' },
  { id: 'cat', name: 'Γάτα', emoji: '🐱', soundText: 'Νιάου! Νιάου!', audioSrc: `${cleanBase}sounds/animals/cat.mp3`, hint: 'Της αρέσει να γουργουρίζει!' },
  { id: 'cow', name: 'Αγελάδα', emoji: '🐮', soundText: 'Μουουου!', audioSrc: `${cleanBase}sounds/animals/cow.mp3`, hint: 'Μας δίνει νόστιμο γάλα!' },
  { id: 'duck', name: 'Πάπια', emoji: '🦆', soundText: 'Πακ! Πακ!', audioSrc: `${cleanBase}sounds/animals/duck.mp3`, hint: 'Κολυμπάει στη λίμνη!' },
  { id: 'frog', name: 'Βάτραχος', emoji: '🐸', soundText: 'Κουάξ! Κουάξ!', audioSrc: `${cleanBase}sounds/animals/frog.mp3`, hint: 'Κάνει μεγάλα πηδήματα!' },
  { id: 'sheep', name: 'Πρόβατο', emoji: '🐑', soundText: 'Μπεεεε!', audioSrc: `${cleanBase}sounds/animals/sheep.mp3?v=2`, hint: 'Έχει απαλό μαλλάκι!' },
  { id: 'lion', name: 'Λιοντάρι', emoji: '🦁', soundText: 'Γκρρρρ!', audioSrc: `${cleanBase}sounds/animals/lion.mp3`, hint: 'Ο βασιλιάς της ζούγκλας με μεγάλη χαίτη!' },
  { id: 'rooster', name: 'Κόκορας', emoji: '🐓', soundText: 'Κικιρίκου!', audioSrc: `${cleanBase}sounds/animals/rooster.mp3`, hint: 'Μας ξυπνάει το πρωί!' },
];
