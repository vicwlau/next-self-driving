# intention

build 3d world editor, road system, machine learning, and expertise in javascript

[playlist](https://www.youtube.com/playlist?list=PLB0Tybl0UNfZtY5IQl1aNwcoOPJNtnPEO)

# learnings

- when loading ref classes and passing it to a component, it may not be completed on first render. so make a `loaded` state and update upon creation of the class. see `ActionBar`
- segment can't have two identical points
- when removing a point, also remove all segments contain that point
- when removing a segment, use `findIndex` to find element, then `splice` only if return is not -1

```tsx
remove_segment(segment: Segment) {
    const index = this.segments.findIndex((s) => s.equals(segment));
    if (index !== -1) {
      this.segments.splice(index, 1);
    }
  }
```
