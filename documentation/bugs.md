# BUGS

## point had vect2

changing x and y on point did nothing because it uses vect2 to draw. lesson: remove duplicative data points.

## panning

```tsx
// what is this?
if ((evt.buttons & 2) !== 0) {
}

get_world_point(e: MouseEvent) {
    return new Point(
      e.offsetX * this.zoom - this.offset.x, // why substract from this.offset.x
      e.offsetY * this.zoom - this.offset.y
    );
  }
```

## center on zoom

explanation of how the camera position works; however, the mouse interaction is correct because of this;

```tsx
  update() {
    this.clear();
    this.ctx.save();
    // this sets the center to (-400,-300), top left {canvas.width/2...}
    this.ctx.translate(this.view.center.x, this.view.center.y);

    // zoom out from that position
    this.ctx.scale(1 / this.view.zoom, 1 / this.view.zoom);

    // move to the current world offset
    this.ctx.translate(this.view.offset.x, this.view.offset.y);
  }
```

## loading segments

```tsx
// WRONG: logic asking: 'is this the correct point OR is points[0] a valid object?
// `... || point[0])` always evaluate to true, thus find() immediately returns the first element
// for every segments regardless of whether it matches `i.p1`

// WRONG
const segments = (json_data.segments || []).map(
  (i: any) =>
    new Segment(
      points.find((p: Point) => p.equals(i.p1) || points[0]), // `points[0]` is inside the predicate
      points.find((p: Point) => p.equals(i.p2) || points[0])
    )
);

// CORRECT
const segments = (json_data.segments || []).map(
  (i: any) =>
    new Segment(
      points.find((p: Point) => p.equals(i.p1)) || points[0], //
      points.find((p: Point) => p.equals(i.p2)) || points[0]
    )
);
```

## epsilon ensures index is below math.pi due to tiny precision difference

```tsx
const points = [];
const step = Math.PI / 10; // 18 degrees, controls the curvature smoothness
const epsilon = step / 2;

for (
  let i = alpha_counter_clock_wise;
  i <= alpha_clock_wise + epsilon; // epsilon added here
  i += step
) {
  points.push(translate(p1, i, radius));
}
```

# BAD CODE

Drawing a 8x8 grid as chess board.

```tsx
  // I wrote
  static chess_board_graph() {
    const rows = 8;
    const spacing = 50;
    const margin = 50;

    const matrix: Point[][] = [];
    const points: Point[] = [];
    const segments: Segment[] = [];

    // create points
    for (let x = 0; x < rows + 1; x++) {
      matrix.push([]);
      for (let y = 0; y < rows + 1; y++) {
        const p = new Point(x * spacing + margin, y * spacing + margin);
        points.push(p);
        matrix[x].push(p);
      }
    }

    // create segments horizontal?
    for (let j = 0; j <= rows; j++) {
      const p1 = matrix[0][j];
      const p2 = matrix[rows][j];
      const segment = new Segment(p1, p2);
      segments.push(segment);
    }

    for (let j = 0; j <= rows; j++) {
      const p1 = matrix[j][0];
      const p2 = matrix[j][rows];
      const segment = new Segment(p1, p2);
      segments.push(segment);
    }

    return new Graph(points, segments);
  }


```

```tsx
  // ai wrote
  static chess_board_graph() {
    const points: Point[] = [];
    const segments: Segment[] = [];

    const grid_size = 8;
    const cell_size = 50;

    // Create points
    for (let i = 0; i <= grid_size; i++) {
      for (let j = 0; j <= grid_size; j++) {
        points.push(new Point(i * cell_size + 100, j * cell_size + 100));
      }
    }

    // Create horizontal segments
    for (let i = 0; i <= grid_size; i++) {
      for (let j = 0; j < grid_size; j++) {
        const p1 = points[i * (grid_size + 1) + j];
        const p2 = points[i * (grid_size + 1) + (j + 1)];
        segments.push(new Segment(p1, p2));
      }
    }

    // Create vertical segments
    for (let i = 0; i < grid_size; i++) {
      for (let j = 0; j <= grid_size; j++) {
        const p1 = points[i * (grid_size + 1) + j];
        const p2 = points[(i + 1) * (grid_size + 1) + j];
        segments.push(new Segment(p1, p2));
      }
    }

    return new Graph(points, segments);
  }
```
