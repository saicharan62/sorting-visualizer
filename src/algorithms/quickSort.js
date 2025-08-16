export const quickSort = async ({ array, setArray, setMetrics, speed, sleep, setActiveIndices, controller, waitIfPaused }) => {
  let arr = [...array];
  let swaps = 0;
  let comparisons = 0;

  const partition = async (low, high) => {
    const pivotIdx = low + Math.floor(Math.random() * (high - low + 1)); // random pivot
    const pivot = arr[pivotIdx];
    [arr[pivotIdx], arr[high]] = [arr[high], arr[pivotIdx]];
    swaps++;
    let i = low - 1;
    for (let j = low; j < high; j++) {
      setActiveIndices([j, high]);
      comparisons++;
      await sleep(speed);
      await waitIfPaused();
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swaps++;
        setArray([...arr]);
        setMetrics({ swaps, comparisons });
        await sleep(speed);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swaps++;
    setArray([...arr]);
    setMetrics({ swaps, comparisons });
    await sleep(speed);
    return i + 1;
  };

  const quickSortRecursive = async (low, high) => {
    if (low < high) {
      const pi = await partition(low, high);
      await quickSortRecursive(low, pi - 1);
      await quickSortRecursive(pi + 1, high);
    }
  };

  await quickSortRecursive(0, arr.length - 1);
  setActiveIndices([]);
};