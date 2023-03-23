/**
 * @param {{ name: string, size: number }} file
 * @param {{ name: string, size: number }} other
 */

export function areFilesEqual(file, other) {
  return file.name === other.name && file.size === other.size;
}
