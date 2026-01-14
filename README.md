# INTENT

build 3d world editor, road system, machine learning, and expertise in javascript
SOURCE: [playlist](https://www.youtube.com/playlist?list=PLB0Tybl0UNfZtY5IQl1aNwcoOPJNtnPEO)

# ACTION ITEMS

- camera span w/ extending line segment intent
- reusable code in folder: `core` and `primitive`. apply to other projects.

# FEATURES | TASKS

- draw `points` and connect `segments`
- create states for `hovered` and `selected`
- separation of `graph` and `graph-editor` and `point` when rendering.
- drag move points
- intent line for connecting segments or drawing a new point with connected segment
- zoom | drag | pan,
- `abortcontroller`
- how to zoom center to the view position
- drawing envelops, in which the arc is behind a point and in front of the other point. you start ccw and then to cw

# LEARNINGS

## math

- `radian`: a radian unit is a unit of based on the physical geometry of a circle rather than an arbitrary number (360 for degree, Babylonians). one radian is the angle created when you wrap the radius of a circle around its circumference. If radius = 1, then circumference is 2 \* pi in radians; 1 radian is approx. 57.2 degrees. Easier representation in calculus: d/dx sin(x) = cos(x). if not, you need to divide by 180.
  - `degree` is a composite number, highly divisible (halves, thirds, quarters, fifths, sixths, eights). 1/3 circle is 120 degrees vs. `2*pi/3`.
- `atan2`: why does this work?

```tsx
export function angle(p: Point): number {
  return Math.atan2(p.y, p.x);
}
```

## graph editor

- when loading ref classes and passing it to a component, it may not be completed on first render. so make a `loaded` state and update upon creation of the class. see `ActionBar`
- `segment edge-cases`
  - segment can't have two identical points
  - when removing a point, also remove all segments contain that point
  - when removing a segment, use `findIndex` to find element, then `splice` only if return is not -1
- how does `abort signal` work when creating event listeners
- refactor to have drag-input and mouse-input as components withint world-edtior
- put `load()` function within graph since it knows best how to resconstruct its own internal relationships (references between segments and points)
  - staic load() acts as factory within graph,
  - `crucial logic` to preserve the `segments`, you must use the same corresponding `points`.
  - `localstorage` should be placed in `graph-editor` or `world-editor` since they should control WHERE to save, not HOW to save

```tsx
// example code for removing a segment
remove_segment(segment: Segment) {
    const index = this.segments.findIndex((s) => s.equals(segment));
    if (index !== -1) {
      this.segments.splice(index, 1);
    }
  }
```
