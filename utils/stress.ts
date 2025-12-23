// utils/stress.ts
export function isStressed({
  hr,
  gsr,
}: {
  hr: number;
  gsr: number;
}) {
  return hr > 110 && gsr > 2.5;
}
