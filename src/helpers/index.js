export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}