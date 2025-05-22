export function normalizeQuestion(question) {
  return question
    .toLowerCase()
    .replace('[^a-zA-Z0-9\s]/g', '')
    .replace(/\s+/g, ' ')
    .trim();
}