export const selectionSort = async ({ array, setArray, setMetrics, speed, sleep, setActiveIndices, controller, waitIfPaused }) => {
  let arr = [...array];
  let swaps = 0;
  let comparisons = 0;

  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      setActiveIndices([minIdx, j]);
      comparisons++;
      await sleep(speed);
      await waitIfPaused();
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      setArray([...arr]);
      setMetrics({ swaps, comparisons });
      await sleep(speed);
    }
  }
  setActiveIndices([]);
};