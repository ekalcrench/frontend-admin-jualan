export function emptyFunc() {
  return;
}

export const calculatePercentageDifference = (
  current: number,
  previous: number,
) => {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / Math.abs(previous)) * 100;
};

export const formatPercentageDifference = (percentage: number) =>
  percentage === 0
    ? "0%"
    : `${Math.abs(percentage).toFixed(1).replace(".0", "")}%`;
