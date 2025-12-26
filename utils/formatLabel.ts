export function formatLabel(label: string): string {
  return label
    .replace(/[_]+/g, ' ')          // replace underscores with spaces
    .split(' ')                     // split into words
    .filter(Boolean)                // remove empty parts
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(' ');
}
