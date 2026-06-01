# next-self-driving

An interactive 2D world / road-network editor built with Next.js, React, and the HTML Canvas API. It's a learning project exploring graph-based geometry, canvas rendering, and the foundations for a self-driving car simulation.

This project follows the [Self-driving car simulation playlist](https://www.youtube.com/playlist?list=PLB0Tybl0UNfZtY5IQl1aNwcoOPJNtnPEO) and reimplements the ideas in TypeScript with a Next.js front end.

## Features

- Draw **points** and connect them with **segments**
- `hovered` and `selected` interaction states
- Drag to move points
- "Intent" preview line for connecting segments or placing a new connected point
- Zoom, drag, and pan the viewport
- Envelope (road-edge) generation around segments
- Save / load the graph to `localStorage`
- Clean separation between the `Graph` (data) and the `GraphEditor` (interaction/rendering)

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run eslint
```

## Project structure

```
app/                Next.js app router (page, layout, styles)
component/          React UI components (e.g. ActionBar)
lib/
  core/             Reusable input handlers (mouse-input, drag-input)
  math/             Graph data structure and math utilities
  primitive/        Geometry primitives (point, segment, polygon, envelope, square)
  sandbox/          Standalone demos (e.g. radian visualizer)
  world-editor.ts   Top-level editor wiring canvas, viewport, and graph editor
  graph-editor.ts   Graph interaction and rendering logic
  view-port.ts      Camera: zoom / pan / coordinate transforms
documentation/      Development notes
```

The `lib/core` and `lib/primitive` folders are written to be reusable across other canvas projects.

## Notes

A few concepts worth highlighting from building this:

- **Radians** measure angles by the geometry of a circle itself (a full circle is `2π`), which makes calculus cleaner — `d/dx sin(x) = cos(x)` only holds in radians.
- **Loading classes into components**: a ref-held class may not exist on the first render, so a `loaded` state flag is used to re-render once it's constructed (see `ActionBar`).
- **Segment edge cases**: a segment can't have two identical endpoints; removing a point must also remove every segment that touches it; removing a segment uses `findIndex` + `splice` only when the index is found.
- **Save / load ownership**: `Graph.load()` acts as a factory that rebuilds the references between segments and points (segments must reuse the same point instances). The decision of *where* to persist (`localStorage`) lives in the editor, not the graph.

## License

[MIT](./LICENSE) © Victor Lau
