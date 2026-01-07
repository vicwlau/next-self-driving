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

# learnings

## graph editor

- when loading ref classes and passing it to a component, it may not be completed on first render. so make a `loaded` state and update upon creation of the class. see `ActionBar`
- segment can't have two identical points
- when removing a point, also remove all segments contain that point
- when removing a segment, use `findIndex` to find element, then `splice` only if return is not -1
- how does `abort signal` work when creating event listeners

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
