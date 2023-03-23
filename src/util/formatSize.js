/**
 * @param {number} bytes
 */
export function formatSize(bytes) {
    const size = Math.floor(Math.log2(bytes) / 10);
    return (bytes / Math.pow(2, size * 10)).toFixed(2) + " " + ["bytes", "kB", "MB", "GB"][size];
}
