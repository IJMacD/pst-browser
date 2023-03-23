/**
 * @param {string} subject
 */

export function stripSubject(subject) {
  // eslint-disable-next-line
  return subject && subject.replace(/[\x01-\x0f]/g, "");
}
