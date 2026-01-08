# intention

build 3d world editor, road system, machine learning, and expertise in javascript

[playlist](https://www.youtube.com/playlist?list=PLB0Tybl0UNfZtY5IQl1aNwcoOPJNtnPEO)

# summary of tasks

- draw `points` and `segments`
- state for `hovered` and `selected` states
- separation of `graph` and `graph-editor` and `point` when rendering.
- drag move points
- intent line for connecting segments or drawing a new point with connected segment
- zoom | drag | pan,
- `abortcontroller`
- how to zoom center to the view position

# learnings

## graph editor

- when loading ref classes and passing it to a component, it may not be completed on first render. so make a `loaded` state and update upon creation of the class. see `ActionBar`
- segment can't have two identical points
- when removing a point, also remove all segments contain that point
- when removing a segment, use `findIndex` to find element, then `splice` only if return is not -1
- how does `abort signal` work when creating event listeners
- refactor to have drag-input and mouse-input as components withint world-edtior
- put `load()` function within graph since it knows best how to resconstruct its own internal relationships (references between segments and points)
  - staic load() acts as factory within graph,
  - `crucial logic` to preserve the `segments`, you must use the same corresponding `points`.
  - `localstorage` should be placed in `graph-editor` or `world-editor` since WHERE to save and not HOW to save

```tsx
remove_segment(segment: Segment) {
    const index = this.segments.findIndex((s) => s.equals(segment));
    if (index !== -1) {
      this.segments.splice(index, 1);
    }
  }
```

# bugs

## point had vect2

modification of x and y on point was doing nothing because it uses vect2 to draw. removed duplicative data points.

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
// incorrect; this logic is asking 'is this the correct point OR is points[0] a valid object? since it is always true, find() essentially just grabbed the first item it saw every single time. And thus, no segments since they are all the same points.

const segments = (json_data.segments || []).map(
  (i: any) =>
    new Segment(
      points.find((p: Point) => p.equals(i.p1) || points[0]),
      points.find((p: Point) => p.equals(i.p2) || points[0])
    )
);

// corrected
const segments = (json_data.segments || []).map(
  (i: any) =>
    new Segment(
      points.find((p: Point) => p.equals(i.p1)) || points[0],
      points.find((p: Point) => p.equals(i.p2)) || points[0]
    )
);
```
