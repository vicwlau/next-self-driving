export {};
const MAX_ARRAY_SIZE = 10 ** 8; // 100 million

let start_time = 0;
let end_time = 0;

function seed_numbers(array_size: number): number[] {
  check_array_capacity(array_size);

  const _numbers = [];
  for (let i = 0; i < array_size; i++) {
    _numbers.push(Math.floor(Math.random() * array_size));
  }
  return _numbers;
}

function check_array_capacity(array_size: number) {
  if (array_size >= MAX_ARRAY_SIZE) {
    throw new Error("Array too large to sort in this environment.");
  }
}

// 1974 ms for 10 million
function sort(numbers: number[]) {
  check_array_capacity(numbers.length);
  console.log("sorting: ", numbers.length);
  const copy = [...numbers];
  copy.sort((a, b) => a - b);
  return copy;
}

function fast_sort(numbers: number[]) {
  // Implementing a simple quicksort
  function quicksort(arr: number[]): number[] {
    // Base case
    if (arr.length <= 1) return arr;

    // Recursive case
    const pivot = arr[arr.length - 1]; // Choosing the last element as pivot
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] < pivot) {
        // Elements less than pivot
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }
    return [...quicksort(left), pivot, ...quicksort(right)];
  }

  check_array_capacity(numbers.length);
  console.log("fast sorting: ", numbers.length);

  const sorted = quicksort(numbers);
  return sorted;
}

// 1420ms for 10 million
function fast_sort_in_place(numbers: number[]) {
  check_array_capacity(numbers.length);
  const copy = [...numbers];
  console.log("fast sorting (in-place): ", numbers.length);

  function partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high]; // pivot, last element
    let i = low - 1; // Index of smaller element

    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; // Swap pivot
    return i + 1;
  }

  function quicksort(arr: number[], low: number, high: number) {
    if (low < high) {
      const pi = partition(arr, low, high); // Partitioning index
      quicksort(arr, low, pi - 1); // Recursively sort elements before partition
      quicksort(arr, pi + 1, high); // Recursively sort elements after partition
    }
  }

  // Run in-place modification directly on the global array
  quicksort(copy, 0, copy.length - 1);
  return copy;
}

function print(count: number, numbers: number[]) {
  let msg = `Printing:`;
  for (let i = 0; i < count && i < numbers.length; i++) {
    msg += ` ${numbers[i]},`;
  }
  console.log(msg);
}

function time(stage: "start" | "end", name: string) {
  if (stage === "start") {
    start_time = 0;
    end_time = 0;
    start_time = performance.now();
  } else if (stage === "end") {
    end_time = performance.now();
    const duration = end_time - start_time;
    console.log(`${name} - duration: ${duration.toFixed(2)} ms`);
  }
}

function main() {
  const RANDOM_NUMBER = 10 ** 7; //  10 million
  const same_random_set = seed_numbers(RANDOM_NUMBER);
  //
  time("start", "sort");
  const result = sort(same_random_set);
  print(7, result);
  time("end", "sort");

  time("start", "quick sort in place");
  const result3 = fast_sort_in_place(same_random_set);
  print(7, result3);
  time("end", "quick sort in place");
}

main();
