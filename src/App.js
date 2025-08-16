// src/App.js
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import HeroSection from './components/HeroSection';
import Section from './components/Section';
import SortingVisualizer from './visualizer/SortingVisualizer';
import './styles.css';

import { bubbleSort } from './algorithms/bubbleSort';
import { insertionSort } from './algorithms/insertionSort';
import { selectionSort } from './algorithms/selectionSort';
import { mergeSort } from './algorithms/mergeSort';
import { quickSort } from './algorithms/quickSort';

const createArray = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 400) + 50);

const RevealLine = ({ children }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <p
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity .9s ease, transform .9s ease',
        margin: '6px 0'
      }}
    >
      {children}
    </p>
  );
};

const algorithmDetails = {
  bubble: {
    title: 'Bubble Sort',
    theory: `Bubble Sort is a straightforward comparison-based sorting algorithm.
It works by repeatedly stepping through the list, comparing adjacent
pairs and swapping them if they are in the wrong order. After each pass,
the largest element settles at the end of the list. This process repeats
until no swaps are needed.

Time Complexity:
- Worst/Average: O(n²)
- Best: O(n) when the list is already sorted

Space Complexity: O(1)
Stability: Stable
Use Case: Educational purposes and very small datasets.`
  },
  insertion: {
    title: 'Insertion Sort',
    theory: `Insertion Sort builds the final sorted array one item at a time.
It takes the next element from the unsorted portion and inserts it
into the correct position among the already sorted elements.

Time Complexity:
- Worst/Average: O(n²)
- Best: O(n) for nearly sorted lists

Space Complexity: O(1)
Stability: Stable
Use Case: Small or nearly sorted datasets.`
  },
  selection: {
    title: 'Selection Sort',
    theory: `Selection Sort repeatedly finds the smallest element in the unsorted
portion and swaps it with the first unsorted element.

Time Complexity: O(n²) for all cases
Space Complexity: O(1)
Stability: Not stable
Use Case: Simple situations where memory writes are costly but reads are cheap.`
  },
  merge: {
    title: 'Merge Sort',
    theory: `Merge Sort is a divide-and-conquer algorithm. It divides the list into
two halves, recursively sorts each half, and merges them.

Time Complexity: O(n log n) for all cases
Space Complexity: O(n)
Stability: Stable
Use Case: Large datasets and guaranteed performance.`
  },
  quick: {
    title: 'Quick Sort',
    theory: `Quick Sort is a divide-and-conquer algorithm. It selects a pivot,
partitions the array into elements less than and greater than the pivot,
then recursively sorts the partitions.

Time Complexity:
- Worst: O(n²)
- Average/Best: O(n log n)

Space Complexity: O(log n)
Stability: Not stable
Use Case: General-purpose sorting where average speed matters most.`
  }
};

export default function App() {
  const [states, setStates] = useState(
    Object.keys(algorithmDetails).reduce((acc, key) => {
      acc[key] = {
        array: createArray(50),
        active: [],
        visible: false,
        speed: 50,
        stats: { time: 0, comparisons: 0, swaps: 0 }
      };
      return acc;
    }, {})
  );

  const [controllers, setControllers] = useState({});
  const [openTheories, setOpenTheories] = useState({});
  const [activeVisualizer, setActiveVisualizer] = useState(null);

  const randomize = (algo, count = states[algo].array.length) => {
    setStates(p => ({
      ...p,
      [algo]: {
        ...p[algo],
        array: createArray(count),
        active: [],
        stats: { time: 0, comparisons: 0, swaps: 0 }
      }
    }));
  };

  const changeSpeed = (algo, speed) =>
    setStates(p => ({ ...p, [algo]: { ...p[algo], speed } }));

  const stop = (algo) => controllers[algo] && (controllers[algo].stopped = true);
  const pause = (algo) => controllers[algo] && (controllers[algo].paused = true);
  const resume = (algo) => controllers[algo] && (controllers[algo].paused = false);

  const start = async (algo, controllerRef) => {
    const { array, speed } = states[algo];
    const controller = controllerRef;
    setControllers(prev => ({ ...prev, [algo]: controller }));

    const setArray = (newArr) =>
      setStates(p => ({ ...p, [algo]: { ...p[algo], array: newArr.slice() } }));
    const setActive = (indices) =>
      setStates(p => ({ ...p, [algo]: { ...p[algo], active: indices } }));
    const setMetrics = ({ swaps, comparisons }) =>
      setStates(p => ({ ...p, [algo]: { ...p[algo], stats: { ...p[algo].stats, swaps, comparisons } } }));

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const waitIfPaused = async () => {
      while (controller.paused) await sleep(50);
      if (controller.stopped) throw 'stopped';
    };

    const t0 = performance.now();
    try {
      const sortMap = { bubble: bubbleSort, insertion: insertionSort, selection: selectionSort, merge: mergeSort, quick: quickSort };
      await sortMap[algo]({ array, setArray, setMetrics, speed, sleep, waitIfPaused, setActiveIndices: setActive });
    } catch (e) {
      if (e !== 'stopped') throw e;
    }
    const t1 = performance.now();
    setActive([]);
    setStates(p => ({ ...p, [algo]: { ...p[algo], stats: { ...p[algo].stats, time: Math.round(t1 - t0) } } }));
  };

  const renderVisualizer = (key) => {
  const algo = states[key];
  const { title, short, theory } = algorithmDetails[key];
  const showTheory = openTheories[key] || false;
  const theoryLines = theory.trim().split('\n');

  return (
    <Section title={title} key={key}>
      <p style={{ opacity: 0.85, marginBottom: 12 }}>{short}</p>

      <div
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.5s ease',
          maxHeight: showTheory ? '500px' : '3.2em', // ~2 lines height
          whiteSpace: 'pre-line',
          opacity: 0.8,
        }}
      >
        {theory}
      </div>

      <span
        onClick={() => setOpenTheories(p => ({ ...p, [key]: !showTheory }))}
        style={{
          color: '#1e90ff',
          cursor: 'pointer',
          textDecoration: 'underline',
          display: 'inline-block',
          marginTop: '4px'
        }}
      >
        {showTheory ? 'Read less' : 'Read more'}
      </span>

      {activeVisualizer === key && (
        <SortingVisualizer
          array={algo.array}
          activeIndices={algo.active}
          onRandomize={() => randomize(key)}
          onChangeBars={(count) => randomize(key, count)}
          onChangeSpeed={(speed) => changeSpeed(key, speed)}
          onStart={(controller) => start(key, controller)}
          onClose={() => setActiveVisualizer(null)}
          speed={algo.speed}
          stats={algo.stats}
          title={`${title} Visualizer`}
        />
      )}

      <div style={{ marginTop: 10 }}>
        <button
          onClick={() => setActiveVisualizer(key)}
          className="glass-btn"
        >
          {activeVisualizer === key ? 'Restart Visualizer' : 'Open Visualizer'}
        </button>
      </div>
    </Section>
  );
};


const theoryLines = [
  'Sorting algorithms are used to arrange elements of a data structure according to a specific order, such as numerical or lexicographical.',
  'This operation is one of the most important and widely used in computer science.',
  'Over time, hundreds of sorting algorithms have been developed, each with unique characteristics.',
  'They are typically analyzed by two metrics: time complexity and space complexity.',
  'These complexities are expressed with asymptotic notations: O (upper bound), Θ (tight bound), and Ω (lower bound), all in terms of n, the number of elements.',
  'Most sorting algorithms fall into two main categories:',
  'Logarithmic – complexity proportional to log₂(n). Example: Quick Sort, with O(n log n) complexity.',
  'Quadratic – complexity proportional to n². Example: Bubble Sort, with O(n²) time complexity.',
  'Complexity is also studied under best case, average case, and worst case scenarios.',
  'Sorting algorithms can be tricky to grasp, so visualizing them helps make the process easier and more fun!'
];


  return (
    <div>
      <main>
      <HeroSection />
      <Section id="theory" title="What is Sorting?">
        <div style={{ textAlign: 'justify' }}>
          {theoryLines.map((line, idx) => <RevealLine key={idx}>{line}</RevealLine>)}
        </div>
      </Section>
      {Object.keys(algorithmDetails).map(renderVisualizer)}
    
    </main>

    <footer className="glass-footer">
  <p>
    © {new Date().getFullYear()}  • <strong>Sai Charan Kodhandigari</strong> 
  </p>

</footer>
</div>
    
  );

}


