export const mergeSort = async ({ array, setArray, setMetrics, speed, sleep, setActiveIndices, controller, waitIfPaused }) => {
  let arr = [...array];
  let swaps = 0; // approximate as number of writes
  let comparisons = 0;

  const merge = async (left, right, startIdx) => {
    let merged = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      setActiveIndices([startIdx + i, startIdx + left.length + j]);
      comparisons++;
      await sleep(speed);
      await waitIfPaused();
      if (left[i] <= right[j]) merged.push(left[i++]);
      else merged.push(right[j++]);
      swaps++;
      setArray([...arr.slice(0, startIdx), ...merged, ...arr.slice(startIdx + merged.length)]);
      setMetrics({ swaps, comparisons });
    }
    while (i < left.length) {
      merged.push(left[i++]);
      swaps++;
      setArray([...arr.slice(0, startIdx), ...merged, ...arr.slice(startIdx + merged.length)]);
      await sleep(speed);
      await waitIfPaused();
    }
    while (j < right.length) {
      merged.push(right[j++]);
      swaps++;
      setArray([...arr.slice(0, startIdx), ...merged, ...arr.slice(startIdx + merged.length)]);
      await sleep(speed);
      await waitIfPaused();
    }
    return merged;
  };

  const mergeSortRecursive = async (start, end) => {
    if (start >= end) return [arr[start]];
    const mid = Math.floor((start + end) / 2);
    const left = await mergeSortRecursive(start, mid);
    const right = await mergeSortRecursive(mid + 1, end);
    const merged = await merge(left, right, start);
    for (let k = 0; k < merged.length; k++) arr[start + k] = merged[k];
    return merged;
  };

  await mergeSortRecursive(0, arr.length - 1);
  setActiveIndices([]);
};