export const bubbleSort = async ({ array, setArray, setMetrics, speed, sleep, setActiveIndices, controller, waitIfPaused }) => {
  let arr = [...array];
  let swaps = 0;
  let comparisons = 0;

  for (let i = 0; i < arr.length; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      setActiveIndices([j, j + 1]);
      comparisons++;
      await sleep(speed);
      await waitIfPaused();
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        swapped = true;
        setArray([...arr]);
        setMetrics({ swaps, comparisons });
        await sleep(speed);
      }
    }
    if (!swapped) break; // early exit for best case
  }
  setActiveIndices([]);
};