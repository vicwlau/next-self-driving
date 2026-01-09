// ANSI color codes
const RESET = "\x1b[0m";
const MOVED = "\x1b[32m"; // Green
const STAYED = "\x1b[90m"; // Gray

// find random numbers within the seeded set
function seed_numbers(count: number): number[] {
  const numbers = Array.from({ length: count }, (_, i) => i + 1);
  // Shuffle using Fisher-Yates algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  return numbers;
}

function create_number_objs(numbers: number[]): NumberObj[] {
  const number_objs: NumberObj[] = [];
  for (let i = 0; i < numbers.length; i++) {
    number_objs.push(new NumberObj(numbers[i]));
  }
  return number_objs;
}

function basic_sort(number_objs: NumberObj[]): NumberObj[] {
  const sorted = [...number_objs];
  const n = sorted.length;

  sorted.forEach((obj, i) => {
    obj.push_position_key({ position: i, array_id: 0 });
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (sorted[j].value > sorted[j + 1].value) {
        // Swap
        const temp = sorted[j];
        sorted[j] = sorted[j + 1];
        sorted[j + 1] = temp;
      }
    }
    // Record positions after each outer loop iteration
    sorted.forEach((obj, index) => {
      obj.push_position_key({ position: index, array_id: i + 1 });
    });
  }
  return sorted;
}

function quick_sort_tracked(number_objs: NumberObj[]): NumberObj[] {
  const sorted = [...number_objs];
  let step = 0;

  const record_positions = (
    current_step: number,
    low: number,
    high: number,
    pivot_idx: number | null
  ) => {
    sorted.forEach((obj, index) => {
      obj.push_position_key({
        position: index,
        array_id: current_step,
        range: [low, high],
        is_pivot: index === pivot_idx,
      });
    });
  };

  // 1. Record initial state (Step 0) before any sorting happens
  record_positions(step++, 0, sorted.length - 1, null);

  function partition(low: number, high: number): number {
    const pivot = sorted[high].value;
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (sorted[j].value < pivot) {
        i++;
        [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
      }
    }
    [sorted[i + 1], sorted[high]] = [sorted[high], sorted[i + 1]];

    record_positions(step++, low, high, i + 1);
    return i + 1;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  }

  sort(0, sorted.length - 1);
  return sorted;
}

function print(sorted_objs: NumberObj[]) {
  const max_iteration = sorted_objs[0].positions.length;

  for (let iter = 0; iter < max_iteration; iter++) {
    let msg = `Step ${iter.toString().padStart(2, "0")}: `;

    // Sort the objects based on their position at this specific iteration
    const ordered_objs = [...sorted_objs].sort(
      (a, b) => a.positions[iter].position - b.positions[iter].position
    );

    ordered_objs.forEach((obj) => {
      // Check if the object's position changed since the previous iteration
      const has_moved =
        iter > 0 &&
        obj.positions[iter].position !== obj.positions[iter - 1].position;

      const color = has_moved ? MOVED : STAYED;
      msg += `${color}${obj.value.toString().padStart(3, " ")}${RESET}`;
    });

    console.log(msg);
  }
}

interface PositionKey {
  position: number;
  array_id: number;
  is_pivot?: boolean;
  range?: [number, number]; // [low, high]
}

class NumberObj {
  value: number;
  positions: PositionKey[];
  constructor(value: number) {
    this.value = value;
    this.positions = [];
  }

  push_position_key(pos: PositionKey) {
    this.positions.push(pos);
  }

  clear_positions() {
    this.positions = [];
  }
}

export function create_sorted_objs() {
  const number_count = 25;
  const seeds = seed_numbers(number_count);
  const number_objs = create_number_objs(seeds);

  // Using the faster tracked quicksort
  const sorted_objs = quick_sort_tracked(number_objs);
  //   print(sorted_objs);
  return sorted_objs;
}

// main();

/**
 * Animates the recorded sorting steps on a canvas with smooth transitions
 */
export function animate_sort(
  canvas: HTMLCanvasElement,
  sorted_objs: NumberObj[],
  step_duration: number = 500
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const max_steps = sorted_objs[0].positions.length;
  const bar_width = canvas.width / sorted_objs.length;
  const height_unit =
    canvas.height / Math.max(...sorted_objs.map((o) => o.value));

  let current_step = 0;
  let start_time: number | null = null;

  function render(now: number) {
    if (!ctx) return;
    if (!start_time) start_time = now;
    const elapsed = now - start_time;
    const progress = Math.min(elapsed / step_duration, 1); // 0 to 1

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sorted_objs.forEach((obj) => {
      const state = obj.positions[current_step];
      const next_state = obj.positions[current_step + 1] || state; // 2. Get the target state

      const from_pos = state.position;
      const to_pos = next_state.position;

      const interpolated_index = from_pos + (to_pos - from_pos) * progress;
      const x = interpolated_index * bar_width;
      const height = obj.value * height_unit;
      const y = canvas.height - height;

      // 3. Use next_state to determine colors since that's the logic currently executing
      const in_range =
        next_state.range &&
        to_pos >= next_state.range[0] &&
        to_pos <= next_state.range[1];

      if (next_state.is_pivot && to_pos === next_state.position) {
        ctx.fillStyle = "#ef4444"; // Red for Pivot
      } else if (in_range) {
        ctx.fillStyle = from_pos !== to_pos ? "#4ade80" : "#60a5fa"; // Green if moving, Blue if in range
      } else {
        ctx.fillStyle = "#e2e8f0"; // Light gray for inactive elements
      }

      ctx.fillRect(x, y, bar_width - 2, height);
    });

    if (progress < 1) {
      requestAnimationFrame(render);
    } else if (current_step < max_steps - 2) {
      // Move to next transition
      current_step++;
      start_time = now;
      requestAnimationFrame(render);
    }
  }

  requestAnimationFrame(render);
}

/*
# VERSION ONE - NO ANIMATION

export function animate_sort(
  canvas: HTMLCanvasElement,
  sorted_objs: NumberObj[],
  step_time: number = 100
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const max_iterations = sorted_objs[0].positions.length;
  const bar_width = canvas.width / sorted_objs.length;
  const height_unit =
    canvas.height / Math.max(...sorted_objs.map((o) => o.value));

  let current_iter = 0;

  function draw() {
    if (!ctx) return;
    if (current_iter >= max_iterations) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get current positions
    const current_state = new Array(sorted_objs.length);
    sorted_objs.forEach((obj) => {
      const pos = obj.positions[current_iter].position;
      current_state[pos] = obj;
    });

    // Draw bars
    current_state.forEach((obj, index) => {
      const x = index * bar_width;
      const height = obj.value * height_unit;
      const y = canvas.height - height;

      // Highlight if it moved since last step
      const has_moved =
        current_iter > 0 &&
        obj.positions[current_iter].position !==
          obj.positions[current_iter - 1].position;

      ctx.fillStyle = has_moved ? "#4ade80" : "#94a3b8"; // Green if moved, Gray if still
      ctx.fillRect(x, y, bar_width - 1, height);
    });

    current_iter++;
    // Adjust timeout for speed (e.g., 100ms per step)
    setTimeout(() => requestAnimationFrame(draw), step_time);
  }

  draw();
}

*/

/*
VERSION 2 - WITH ANIMATION

export function animate_sort(
  canvas: HTMLCanvasElement,
  sorted_objs: NumberObj[],
  step_duration: number = 500
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const max_steps = sorted_objs[0].positions.length;
  const bar_width = canvas.width / sorted_objs.length;
  const height_unit =
    canvas.height / Math.max(...sorted_objs.map((o) => o.value));

  let current_step = 0;
  let start_time: number | null = null;

  function render(now: number) {
    if (!ctx) return;
    if (!start_time) start_time = now;
    const elapsed = now - start_time;
    const progress = Math.min(elapsed / step_duration, 1); // 0 to 1

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    sorted_objs.forEach((obj) => {
      const from_pos = obj.positions[current_step].position;
      const to_pos =
        current_step + 1 < max_steps
          ? obj.positions[current_step + 1].position
          : from_pos;

      // Calculate interpolated horizontal position for smooth shifting
      const interpolated_index = from_pos + (to_pos - from_pos) * progress;

      const x = interpolated_index * bar_width;
      const height = obj.value * height_unit;
      const y = canvas.height - height;

      // Highlight bars currently in motion
      const is_moving = from_pos !== to_pos;
      ctx.fillStyle = is_moving ? "#4ade80" : "#94a3b8";

      ctx.fillRect(x, y, bar_width - 2, height);
    });

    if (progress < 1) {
      requestAnimationFrame(render);
    } else if (current_step < max_steps - 2) {
      // Move to next transition
      current_step++;
      start_time = now;
      requestAnimationFrame(render);
    }
  }

  requestAnimationFrame(render);
}
*/
