export function getTimeRange(range: 'Daily' | 'Weekly' | 'Monthly' | 'Lifetime') {
  const now = Math.floor(Date.now() / 1000);

  switch (range) {
    case 'Daily':
      return { start: now - 86400, end: now };
    case 'Weekly':
      return { start: now - 7 * 86400, end: now };
    case 'Monthly':
      return { start: now - 30 * 86400, end: now };
    case 'Lifetime':
      return { start: 0, end: now };
  }
}
