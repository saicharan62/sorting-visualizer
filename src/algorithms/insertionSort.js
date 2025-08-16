export const insertionSort = async ({ array, setArray, setMetrics, speed, sleep, setActiveIndices, controller, waitIfPaused }) => {
  let arr = [...array];
  let swaps = 0;
  let comparisons = 0;

  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      setActiveIndices([j, j + 1]);
      comparisons++;
      await sleep(speed);
      await waitIfPaused();
      arr[j + 1] = arr[j];
      swaps++;
      setArray([...arr]);
      setMetrics({ swaps, comparisons });
      await sleep(speed);
      j--;
    }
    if (j >= 0) comparisons++; // count comparison that breaks loop
    arr[j + 1] = key;
    setArray([...arr]);
  }
  setActiveIndices([]);
};
